/**
 * The Junagadh Commercial Co-Operative Bank Ltd. (JCCB)
 * PostgreSQL / Neon Serverless Cloud Sync Engine
 * Works across: Central Hub, Gold Loan, FD Portal, and OD Portal.
 */

const PostgresSync = (function () {
  const CONFIG_KEY = "tjccb_cloud_db_config";
  const DEFAULT_NEON_CONN = "postgresql://neondb_owner:npg_kF5qI9QzSacN@ep-floral-frog-b3s0jrlo-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

  // Configuration (Pre-configured system default + local storage override)
  let config = {
    provider: "neon",
    neonConnString: DEFAULT_NEON_CONN,
    autoSync: true
  };

  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-migrate if stale connection exists
      if (parsed.neonConnString && !parsed.neonConnString.includes("npg_84BeauzJCGtj")) {
        config = { ...config, ...parsed };
      } else {
        config.neonConnString = DEFAULT_NEON_CONN;
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      }
    } else {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    }
  } catch (e) {
    console.warn("[PostgresSync] Config parse error:", e);
  }

  let isConnected = false;
  let listeners = [];

  // Helper: Parse Neon Connection String
  function parseNeonConnString(connStr) {
    if (!connStr || typeof connStr !== "string") return null;
    try {
      const match = connStr.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
      if (match) {
        const [, user, password, host, dbname] = match;
        return {
          user,
          password,
          host,
          dbname,
          httpEndpoint: `https://${host}/sql`
        };
      }
    } catch (e) { }
    return null;
  }

  // Neon HTTP Query Runner (Direct CORS-ready endpoint with proxy fallback)
  async function runNeonQuery(sql, params = [], customConnStr = null) {
    const connStr = (customConnStr || config.neonConnString || DEFAULT_NEON_CONN).trim();
    if (!connStr) {
      throw new Error("No Neon connection string configured.");
    }

    const parsed = parseNeonConnString(connStr);
    if (!parsed) {
      throw new Error("Invalid Neon connection string format.");
    }

    let directError = null;

    // 1. Direct Neon HTTP SQL Endpoint (CORS-enabled from all origins)
    try {
      const resp = await fetch(parsed.httpEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Neon-Connection-String": connStr
        },
        body: JSON.stringify({ query: sql, params: params || [] })
      });

      const respData = await resp.json().catch(() => null);
      if (resp.ok && respData && (respData.rows !== undefined || respData.command !== undefined)) {
        return respData;
      }
      if (!resp.ok) {
        directError = new Error((respData && (respData.message || respData.error)) || `HTTP Error ${resp.status}`);
      }
    } catch (err) {
      directError = err;
    }

    // 2. Fallback to Local Node / Serverless Proxy (/api/sql)
    try {
      const proxyResp = await fetch("/api/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Neon-Connection-String": connStr
        },
        body: JSON.stringify({ query: sql, params: params || [], connString: connStr })
      });

      if (proxyResp.ok) {
        const proxyData = await proxyResp.json().catch(() => null);
        if (proxyData && (proxyData.rows !== undefined || proxyData.command !== undefined)) {
          return proxyData;
        }
      }
    } catch (proxyErr) {
      // Proxy unavailable
    }

    if (directError) {
      throw directError;
    }

    throw new Error("Database query failed: Could not reach Neon PostgreSQL endpoint.");
  }

  // Initialize DB Client & Verify Live Connection
  async function init() {
    if (config.provider === "neon" && config.neonConnString) {
      try {
        const testRes = await runNeonQuery("SELECT 1 as live_status;");
        if (testRes && testRes.rows && testRes.rows.length) {
          isConnected = true;
          console.log("⚡ [PostgresSync] Connected to Neon PostgreSQL (Singapore / ap-southeast-1)");
        } else {
          isConnected = false;
        }
      } catch (err) {
        console.warn("[PostgresSync] Direct connection check failed, verifying table setup...", err);
        try {
          await initNeonTables();
          isConnected = true;
        } catch (innerErr) {
          console.warn("[PostgresSync] Neon offline:", innerErr);
          isConnected = false;
        }
      }
    } else {
      isConnected = false;
    }

    notifyStatus();
    return isConnected;
  }

  // Initialize Tables on Neon sequentially if not exist
  async function initNeonTables(customConnStr = null) {
    const stmts = [
      `CREATE TABLE IF NOT EXISTS jccb_gold_loans (
        id TEXT PRIMARY KEY,
        branch_code TEXT NOT NULL,
        loan_no TEXT,
        customer_name TEXT,
        phone TEXT,
        sanction_amount NUMERIC,
        sanction_date TEXT,
        status TEXT DEFAULT 'ACTIVE',
        payload JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_fd_forms (
        id TEXT PRIMARY KEY,
        branch_code TEXT NOT NULL,
        form_no TEXT,
        customer_name TEXT,
        deposit_amount NUMERIC,
        interest_rate NUMERIC,
        tenure_months INTEGER,
        status TEXT DEFAULT 'COMPLETED',
        payload JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_od_loans (
        id TEXT PRIMARY KEY,
        branch_code TEXT NOT NULL,
        account_no TEXT,
        customer_name TEXT,
        limit_amount NUMERIC,
        fd_receipt_no TEXT,
        status TEXT DEFAULT 'SANCTIONED',
        payload JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_gold_rates (
        id TEXT PRIMARY KEY,
        date_str TEXT NOT NULL,
        rate NUMERIC NOT NULL,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_gold_branches (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_gold_valuers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_gold_customers (
        id TEXT PRIMARY KEY,
        name TEXT,
        phone TEXT,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_gold_settings (
        key TEXT PRIMARY KEY,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_gold_sessions (
        id TEXT PRIMARY KEY,
        branch_code TEXT NOT NULL,
        payload JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_deleted_records (
        id TEXT PRIMARY KEY,
        module TEXT NOT NULL,
        deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE TABLE IF NOT EXISTS jccb_branch_activity (
        id TEXT PRIMARY KEY,
        branch_code TEXT NOT NULL,
        module TEXT NOT NULL,
        action TEXT NOT NULL,
        record_id TEXT,
        summary TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      `CREATE INDEX IF NOT EXISTS idx_gold_branch ON jccb_gold_loans(branch_code);`,
      `CREATE INDEX IF NOT EXISTS idx_gold_loan_no ON jccb_gold_loans(loan_no);`,
      `CREATE INDEX IF NOT EXISTS idx_fd_branch ON jccb_fd_forms(branch_code);`,
      `CREATE INDEX IF NOT EXISTS idx_fd_form_no ON jccb_fd_forms(form_no);`,
      `CREATE INDEX IF NOT EXISTS idx_od_branch ON jccb_od_loans(branch_code);`,
      `CREATE INDEX IF NOT EXISTS idx_od_acc_no ON jccb_od_loans(account_no);`,
      `CREATE INDEX IF NOT EXISTS idx_activity_created ON jccb_branch_activity(created_at DESC);`
    ];

    for (const s of stmts) {
      try {
        await runNeonQuery(s, [], customConnStr);
      } catch (e) {
        console.warn("[PostgresSync] Table init stmt error:", e);
      }
    }
  }

  function notifyStatus() {
    listeners.forEach(fn => {
      try { fn({ isConnected, config }); } catch(e){}
    });
    updateUIBadge();
  }

  function onStatusChange(fn) {
    listeners.push(fn);
    try { fn({ isConnected, config }); } catch(e){}
  }

  function updateUIBadge() {
    const badges = document.querySelectorAll("#postgres-status-badge, .postgres-status-badge");
    badges.forEach(badge => {
      if (!config.neonConnString) {
        badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1.5 cursor-pointer hover:bg-amber-100 transition shadow-sm";
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> <span>Cloud DB: Offline Local</span>`;
      } else if (isConnected) {
        badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100 transition shadow-sm";
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <span>Neon Postgres: Live</span>`;
      } else {
        badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 flex items-center gap-1.5 cursor-pointer hover:bg-rose-100 transition shadow-sm";
        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-500"></span> <span>Neon DB: Connect...</span>`;
      }
    });
  }  // ==========================================
  // JCCB OFFICIAL BRANCH CODE RESOLVER
  // ==========================================
  const BRANCH_NAME_TO_CODE = {
    'AZADCHOWK': '01',
    'JOSHIPARA': '02',
    'DOLATPARA': '03',
    'KODINAR': '04',
    'KESHOD': '05',
    'VANTHALI': '06',
    'MANAVADAR': '07',
    'GANDHINAGAR': '08',
    'LIMBDI': '09',
    'MENDARDA': '10',
    'VISAVADAR': '11',
    'JAMNAGAR': '12',
    'BUS STAND': '13',
    'LATHI': '14',
    'AHMEDABAD': '16',
    'RAJKOT': '17',
    'ZANZARDA': '18',
    'HEAD OFFICE': '99',
    'HO': '99',
    'CBB': '01',
    'JPB': '02',
    'DBP': '03',
    'DPB': '03',
    'KDR': '04',
    'KSD': '05',
    'VTL': '06',
    'MNV': '07',
    'GNB': '08',
    'LIM': '09',
    'MEN': '10',
    'MND': '10',
    'VIS': '11',
    'JMB': '12',
    'JAM': '12',
    'STB': '13',
    'LTH': '14',
    'AHM': '16',
    'RJT': '17',
    'ZAN': '18'
  };

  function resolveBranchCode(input) {
    if (!input && input !== 0) return '99';
    const str = String(input).trim().toUpperCase();
    if (!str || str === 'ALL') return 'ALL';
    if (str === 'HO' || str === 'HEAD OFFICE' || str === '99') return '99';
    if (/^\d{1,2}$/.test(str)) {
      return str.padStart(2, '0');
    }
    const matchPrefix = str.match(/^(\d{1,2})\s*[-_]/);
    if (matchPrefix) {
      return matchPrefix[1].padStart(2, '0');
    }
    for (const [nameKey, code] of Object.entries(BRANCH_NAME_TO_CODE)) {
      if (str.includes(nameKey)) {
        return code;
      }
    }
    const digits = str.replace(/\D/g, '');
    if (digits.length > 0 && digits.length <= 2) {
      return digits.padStart(2, '0');
    }
    return '99';
  }

  // ==========================================
  // 1. GOLD MODULE DUAL-WRITE & SYNC
  // ==========================================
  async function syncGoldLoan(loan) {
    try {
      const id = String(loan.id || loan.loanNo || loan.proposalNo || Date.now()).trim();
      const rawBranch = loan.branchCode || loan.branchId || loan.branchName || (loan.data && loan.data.branchCode) || (loan.data && loan.data.branchName);
      const branchCode = resolveBranchCode(rawBranch);
      const loanNo = String(loan.loanNo || loan.proposalNo || loan.id || "");
      const customerName = String(loan.customerName || loan.borrowerName || "").toUpperCase();
      const phone = String(loan.phone || loan.mobile || "");
      const sanctionAmount = Number(loan.sanctionAmount || loan.loanAmount || loan.sanctionedAmount || 0);
      const sanctionDate = String(loan.sanctionDate || loan.date || new Date().toISOString().split("T")[0]);
      const status = String(loan.status || loan.loanStatus || "ACTIVE").toUpperCase();

      const payload = { ...loan, id, branchCode, updatedAt: loan.updatedAt || new Date().toISOString() };

      const sql = `
        INSERT INTO jccb_gold_loans (id, branch_code, loan_no, customer_name, phone, sanction_amount, sanction_date, status, payload, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT (id) DO UPDATE SET
          branch_code = EXCLUDED.branch_code,
          loan_no = EXCLUDED.loan_no,
          customer_name = EXCLUDED.customer_name,
          phone = EXCLUDED.phone,
          sanction_amount = EXCLUDED.sanction_amount,
          sanction_date = EXCLUDED.sanction_date,
          status = EXCLUDED.status,
          payload = EXCLUDED.payload,
          updated_at = NOW();
      `;
      await runNeonQuery(sql, [id, branchCode, loanNo, customerName, phone, sanctionAmount, sanctionDate, status, JSON.stringify(payload)]);
      return true;
    } catch (e) {
      console.warn("[PostgresSync] Gold sync error:", e);
      return false;
    }
  }

  async function deleteGoldLoan(loanId) {
    try {
      const id = String(loanId).trim();
      await runNeonQuery("DELETE FROM jccb_gold_loans WHERE id = $1;", [id]);
      await runNeonQuery(
        "INSERT INTO jccb_deleted_records (id, module, deleted_at) VALUES ($1, 'gold', NOW()) ON CONFLICT (id) DO UPDATE SET deleted_at = NOW();",
        [id]
      );
      return true;
    } catch (e) {
      console.warn("[PostgresSync] Delete gold loan error:", e);
      return false;
    }
  }

  function isHeadOfficeQuery(branchCode) {
    if (!branchCode && branchCode !== 0) return true;
    const raw = String(branchCode).trim().toUpperCase();
    const digits = raw.replace(/\D/g, '');
    return !branchCode || digits === '99' || digits === '' || raw === 'ALL' || raw === 'HO' || raw === 'HEAD OFFICE' || raw.includes('HEAD OFFICE');
  }

  async function fetchGoldLoans(branchCode = null) {
    try {
      const isHO = isHeadOfficeQuery(branchCode);
      let sql, params;
      if (isHO) {
        sql = "SELECT payload FROM jccb_gold_loans ORDER BY updated_at DESC;";
        params = [];
      } else {
        let bCode = resolveBranchCode(branchCode);
        sql = "SELECT payload FROM jccb_gold_loans WHERE branch_code = $1 ORDER BY updated_at DESC;";
        params = [bCode];
      }
      console.log(`⚡ [PostgresSync] fetchGoldLoans query: "${sql}" (params: ${JSON.stringify(params)}, isHO: ${isHO})`);
      const res = await runNeonQuery(sql, params);
      const rows = (res && res.rows) ? res.rows.map(r => {
        let payload = r.payload || r;
        if (typeof payload === 'string') {
          try { payload = JSON.parse(payload); } catch(e) {}
        }
        return payload;
      }) : [];
      console.log(`✅ [PostgresSync] fetchGoldLoans returned ${rows.length} records from Neon`);
      return rows;
    } catch (e) {
      console.error("❌ [PostgresSync] Fetch gold loans error:", e);
      return [];
    }
  }

  async function syncGoldRate(dateStr, rateVal) {
    try {
      const payload = {
        date: dateStr,
        rate22K: Number(rateVal),
        rate24K: Math.round(Number(rateVal) * (24 / 22)),
        updatedAt: new Date().toISOString()
      };
      const sql = `
        INSERT INTO jccb_gold_rates (id, date_str, rate, payload, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (id) DO UPDATE SET
          date_str = EXCLUDED.date_str,
          rate = EXCLUDED.rate,
          payload = EXCLUDED.payload,
          updated_at = NOW();
      `;
      await runNeonQuery(sql, [dateStr, dateStr, Number(rateVal), JSON.stringify(payload)]);
      return true;
    } catch (e) {
      console.warn("[PostgresSync] Save gold rate error:", e);
      return false;
    }
  }

  async function fetchGoldRates() {
    try {
      const res = await runNeonQuery("SELECT payload FROM jccb_gold_rates ORDER BY date_str DESC;");
      return (res && res.rows) ? res.rows.map(r => r.payload || r) : [];
    } catch (e) {
      console.warn("[PostgresSync] Fetch gold rates error:", e);
      return [];
    }
  }

  async function syncGoldSettings(key, payloadObj) {
    try {
      const sql = `
        INSERT INTO jccb_gold_settings (key, payload, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO UPDATE SET
          payload = EXCLUDED.payload,
          updated_at = NOW();
      `;
      await runNeonQuery(sql, [key, JSON.stringify(payloadObj)]);
      return true;
    } catch (e) {
      console.warn(`[PostgresSync] Save settings (${key}) error:`, e);
      return false;
    }
  }

  async function fetchGoldSettings(key) {
    try {
      const res = await runNeonQuery("SELECT payload FROM jccb_gold_settings WHERE key = $1;", [key]);
      return (res && res.rows && res.rows[0]) ? res.rows[0].payload : null;
    } catch (e) {
      console.warn(`[PostgresSync] Fetch settings (${key}) error:`, e);
      return null;
    }
  }

  // ==========================================
  // 2. FD MODULE DUAL-WRITE & SYNC
  // ==========================================
  async function syncFDForm(form) {
    try {
      const id = String(form.formNo || form.id || Date.now()).trim();
      const rawBranch = form.branchCode || (form.data && form.data.branchCode) || form.branchId || form.branchName || form.branch || (form.data && form.data.branchName);
      const branchCode = resolveBranchCode(rawBranch);
      const formNo = String(form.formNo || form.id || "");
      const customerName = String(form.customerName || form.applicantName || (form.data && form.data.firstFullName) || (form.data && form.data.cust1Name) || "").toUpperCase();
      const depositAmount = Number(form.depositAmount || form.amount || (form.data && form.data.deposit1Amount) || 0);
      const interestRate = Number(form.interestRate || form.roi || form.rate || (form.data && form.data.deposit1Roi) || 0);
      const tenureMonths = Number(form.tenureMonths || form.months || 12);
      const status = String(form.status || "COMPLETED").toUpperCase();

      const payload = { ...form, id, branchCode, updatedAt: form.updatedAt || new Date().toISOString() };

      const sql = `
        INSERT INTO jccb_fd_forms (id, branch_code, form_no, customer_name, deposit_amount, interest_rate, tenure_months, status, payload, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT (id) DO UPDATE SET
          branch_code = EXCLUDED.branch_code,
          customer_name = EXCLUDED.customer_name,
          deposit_amount = EXCLUDED.deposit_amount,
          interest_rate = EXCLUDED.interest_rate,
          tenure_months = EXCLUDED.tenure_months,
          status = EXCLUDED.status,
          payload = EXCLUDED.payload,
          updated_at = NOW();
      `;
      await runNeonQuery(sql, [id, branchCode, formNo, customerName, depositAmount, interestRate, tenureMonths, status, JSON.stringify(payload)]);
      return true;
    } catch (e) {
      console.warn("[PostgresSync] FD sync error:", e);
      return false;
    }
  }

  async function deleteFDForm(formId) {
    try {
      const id = String(formId).trim();
      await runNeonQuery("DELETE FROM jccb_fd_forms WHERE id = $1;", [id]);
      await runNeonQuery(
        "INSERT INTO jccb_deleted_records (id, module, deleted_at) VALUES ($1, 'fd', NOW()) ON CONFLICT (id) DO UPDATE SET deleted_at = NOW();",
        [id]
      );
      return true;
    } catch (e) {
      console.warn("[PostgresSync] Delete FD form error:", e);
      return false;
    }
  }

  async function fetchFDForms(branchCode = null) {
    try {
      const isHO = isHeadOfficeQuery(branchCode);
      let sql, params;
      if (isHO) {
        sql = "SELECT payload FROM jccb_fd_forms ORDER BY updated_at DESC;";
        params = [];
      } else {
        let bCode = resolveBranchCode(branchCode);
        sql = "SELECT payload FROM jccb_fd_forms WHERE branch_code = $1 ORDER BY updated_at DESC;";
        params = [bCode];
      }
      console.log(`⚡ [PostgresSync] fetchFDForms query: "${sql}" (params: ${JSON.stringify(params)}, isHO: ${isHO})`);
      const res = await runNeonQuery(sql, params);
      const rows = (res && res.rows) ? res.rows.map(r => {
        let payload = r.payload || r;
        if (typeof payload === 'string') {
          try { payload = JSON.parse(payload); } catch(e) {}
        }
        return payload;
      }) : [];
      console.log(`✅ [PostgresSync] fetchFDForms returned ${rows.length} records from Neon`);
      return rows;
    } catch (e) {
      console.error("❌ [PostgresSync] Fetch FD forms error:", e);
      return [];
    }
  }

  // ==========================================
  // 3. OD MODULE DUAL-WRITE & SYNC
  // ==========================================
  async function syncODLoan(od) {
    try {
      const id = String(od.accountNo || od.id || Date.now()).trim();
      const rawBranch = od.branchCode || od.branchId || od.branchName || (od.data && od.data.branchCode) || (od.data && od.data.branchName);
      const branchCode = resolveBranchCode(rawBranch);
      const accountNo = String(od.accountNo || od.id || od.savingAccNo || "");
      const customerName = String(od.customerName || (od.applicant1 && od.applicant1.name) || od.borrowerName || "").toUpperCase();
      const limitAmount = Number(od.limitAmount || od.loanAmount || od.sanctionAmount || 0);
      const fdReceiptNo = String(od.fdReceiptNo || (od.fdReceipts && od.fdReceipts[0] ? od.fdReceipts[0].certNo : "") || "");
      const status = String(od.status || "SANCTIONED").toUpperCase();

      const payload = { ...od, id, branchCode, updatedAt: od.updatedAt || new Date().toISOString() };

      const sql = `
        INSERT INTO jccb_od_loans (id, branch_code, account_no, customer_name, limit_amount, fd_receipt_no, status, payload, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (id) DO UPDATE SET
          branch_code = EXCLUDED.branch_code,
          customer_name = EXCLUDED.customer_name,
          limit_amount = EXCLUDED.limit_amount,
          fd_receipt_no = EXCLUDED.fd_receipt_no,
          status = EXCLUDED.status,
          payload = EXCLUDED.payload,
          updated_at = NOW();
      `;
      await runNeonQuery(sql, [id, branchCode, accountNo, customerName, limitAmount, fdReceiptNo, status, JSON.stringify(payload)]);
      return true;
    } catch (e) {
      console.warn("[PostgresSync] OD sync error:", e);
      return false;
    }
  }

  async function deleteODLoan(odId) {
    try {
      const id = String(odId).trim();
      await runNeonQuery("DELETE FROM jccb_od_loans WHERE id = $1;", [id]);
      await runNeonQuery(
        "INSERT INTO jccb_deleted_records (id, module, deleted_at) VALUES ($1, 'od', NOW()) ON CONFLICT (id) DO UPDATE SET deleted_at = NOW();",
        [id]
      );
      return true;
    } catch (e) {
      console.warn("[PostgresSync] Delete OD loan error:", e);
      return false;
    }
  }

  async function fetchODLoans(branchCode = null) {
    try {
      const isHO = isHeadOfficeQuery(branchCode);
      let sql, params;
      if (isHO) {
        sql = "SELECT payload FROM jccb_od_loans ORDER BY updated_at DESC;";
        params = [];
      } else {
        let bCode = resolveBranchCode(branchCode);
        sql = "SELECT payload FROM jccb_od_loans WHERE branch_code = $1 ORDER BY updated_at DESC;";
        params = [bCode];
      }
      console.log(`⚡ [PostgresSync] fetchODLoans query: "${sql}" (params: ${JSON.stringify(params)}, isHO: ${isHO})`);
      const res = await runNeonQuery(sql, params);
      const rows = (res && res.rows) ? res.rows.map(r => {
        let payload = r.payload || r;
        if (typeof payload === 'string') {
          try { payload = JSON.parse(payload); } catch(e) {}
        }
        return payload;
      }) : [];
      console.log(`✅ [PostgresSync] fetchODLoans returned ${rows.length} records from Neon`);
      return rows;
    } catch (e) {
      console.error("❌ [PostgresSync] Fetch OD loans error:", e);
      return [];
    }
  }

  // ==========================================
  // 4. DELETED RECORDS & AUDIT ACTIVITY
  // ==========================================
  async function fetchDeletedRecordIds(moduleName) {
    try {
      const res = await runNeonQuery("SELECT id FROM jccb_deleted_records WHERE module = $1;", [moduleName]);
      return (res && res.rows) ? res.rows.map(r => r.id) : [];
    } catch (e) {
      return [];
    }
  }

  async function logActivity(branchCode, module, action, recordId, summary) {
    try {
      const id = `ACT_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const sql = `
        INSERT INTO jccb_branch_activity (id, branch_code, module, action, record_id, summary, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW());
      `;
      await runNeonQuery(sql, [id, String(branchCode || "99"), String(module || "SYSTEM"), String(action || "INFO"), String(recordId || ""), String(summary || "")]);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Fetch All Head Office Data across 3 portals
  async function fetchAllHeadOfficeData() {
    try {
      const [goldRes, fdRes, odRes] = await Promise.all([
        runNeonQuery("SELECT payload FROM jccb_gold_loans ORDER BY updated_at DESC;").catch(() => ({ rows: [] })),
        runNeonQuery("SELECT id, payload FROM jccb_fd_forms ORDER BY updated_at DESC;").catch(() => ({ rows: [] })),
        runNeonQuery("SELECT id, payload FROM jccb_od_loans ORDER BY updated_at DESC;").catch(() => ({ rows: [] }))
      ]);

      const goldLoans = (goldRes.rows || []).map(r => r.payload || r);
      const fdForms = (fdRes.rows || []).reduce((acc, r) => {
        const item = r.payload || r;
        if (item && item.id) acc[item.id] = item;
        return acc;
      }, {});
      const odLoans = (odRes.rows || []).reduce((acc, r) => {
        const item = r.payload || r;
        if (item && item.id) acc[item.id] = item;
        return acc;
      }, {});

      return { goldLoans, fdForms, odLoans };
    } catch (e) {
      console.error("[PostgresSync] fetchAllHeadOfficeData error:", e);
      return null;
    }
  }

  // UI Config Modal
  function showConfigModal() {
    let modal = document.getElementById("postgres-config-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "postgres-config-modal";
      modal.className = "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div class="bg-gradient-to-r from-[#041562] to-[#11468F] p-5 text-white flex justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⚡</span>
            <div>
              <h3 class="font-bold text-lg">Neon Serverless PostgreSQL Cloud DB</h3>
              <p class="text-xs text-blue-200">Live Multi-Branch & Cross-Device Cloud Sync</p>
            </div>
          </div>
          <button onclick="PostgresSync.hideConfigModal()" class="text-white/80 hover:text-white text-xl font-bold">&times;</button>
        </div>
        
        <div class="p-6 space-y-4 text-sm text-slate-700">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Neon Database Connection String</label>
            <textarea id="pg-cfg-neon-conn" rows="3" placeholder="postgresql://neondb_owner:password@ep-xyz.aws.neon.tech/neondb?sslmode=require" 
              class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs">${config.neonConnString || DEFAULT_NEON_CONN}</textarea>
            <p class="text-[11px] text-slate-500 mt-1">Direct Serverless Endpoint: Singapore (ap-southeast-1)</p>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <p class="font-semibold text-slate-800 flex items-center gap-1.5">
              <span>🛡️</span> Multi-Layer Security & Fail-Safe:
            </p>
            <p>• <b>Live Cloud Sync</b>: All branch records sync to Neon PostgreSQL in real time.</p>
            <p>• <b>Cross-Device Instant Access</b>: Open any portal on any computer or phone to see live entries.</p>
            <p>• <b>Dual-Write Protection</b>: Local storage preserves offline copies automatically.</p>
          </div>

          <div id="pg-cfg-test-status" class="hidden p-3 rounded-lg text-xs font-semibold"></div>
        </div>

        <div class="bg-slate-100 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <button onclick="PostgresSync.testSettings()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs transition">
            ⚡ Test Connection
          </button>
          <div class="flex gap-2">
            <button onclick="PostgresSync.hideConfigModal()" class="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold text-xs">Cancel</button>
            <button onclick="PostgresSync.saveSettings()" class="px-5 py-2 bg-[#041562] hover:bg-[#11468F] text-white rounded-lg font-bold text-xs transition shadow-md">
              Save & Connect
            </button>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function hideConfigModal() {
    const modal = document.getElementById("postgres-config-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  }

  async function testSettings() {
    const statusDiv = document.getElementById("pg-cfg-test-status");
    const connStr = (document.getElementById("pg-cfg-neon-conn").value || "").trim();

    if (!connStr) {
      statusDiv.className = "p-3 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800";
      statusDiv.innerHTML = "⚠️ Please paste your Neon connection string.";
      statusDiv.classList.remove("hidden");
      return;
    }

    statusDiv.className = "p-3 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800";
    statusDiv.innerHTML = "⚡ Connecting to Neon PostgreSQL...";
    statusDiv.classList.remove("hidden");

    try {
      const testRes = await runNeonQuery("SELECT 1 as live_status;", [], connStr);
      if (testRes && testRes.rows && testRes.rows.length) {
        statusDiv.className = "p-3 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800";
        statusDiv.innerHTML = "✅ Connection successful! Neon PostgreSQL is live & synchronized.";
      } else {
        throw new Error("Invalid response from database");
      }
    } catch (err) {
      statusDiv.className = "p-3 rounded-lg text-xs font-semibold bg-rose-100 text-rose-800";
      statusDiv.innerHTML = `❌ Connection error: ${err.message}`;
    }
  }

  function saveSettings() {
    const connStr = (document.getElementById("pg-cfg-neon-conn").value || "").trim();
    config.provider = "neon";
    config.neonConnString = connStr || DEFAULT_NEON_CONN;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    hideConfigModal();
    init();
  }

  // Auto initialize on load
  if (typeof window !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => init());
    } else {
      init();
    }
  }

  return {
    init,
    getConfig: () => ({ ...config }),
    isConnected: () => isConnected,
    onStatusChange,
    syncGoldLoan,
    deleteGoldLoan,
    fetchGoldLoans,
    syncGoldRate,
    fetchGoldRates,
    syncGoldSettings,
    fetchGoldSettings,
    syncFDForm,
    deleteFDForm,
    fetchFDForms,
    syncODLoan,
    deleteODLoan,
    fetchODLoans,
    fetchDeletedRecordIds,
    logActivity,
    fetchAllHeadOfficeData,
    showConfigModal,
    hideConfigModal,
    testSettings,
    saveSettings,
    runNeonQuery
  };
})();

if (typeof window !== "undefined") {
  window.PostgresSync = PostgresSync;
}
