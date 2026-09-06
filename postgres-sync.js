/**
 * The Junagadh Commercial Co-Operative Bank Ltd. (JCCB)
 * PostgreSQL / Neon Serverless Cloud Sync Engine
 * Works across: Central Hub, Gold Loan, FD Portal, and OD Portal.
 */

const PostgresSync = (function () {
  const CONFIG_KEY = "tjccb_cloud_db_config";

  // Configuration (Loaded from browser local storage)
  let config = {
    provider: "neon",
    neonConnString: "",
    autoSync: true
  };

  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      config = { ...config, ...JSON.parse(saved) };
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

  // Neon HTTP Query Runner (via local CORS-free proxy or direct endpoint)
  async function runNeonQuery(sql, params = [], customConnStr = null) {
    const connStr = (customConnStr || config.neonConnString || "").trim();
    if (!connStr) {
      throw new Error("No Neon connection string configured. Please enter your connection string in the Cloud DB modal.");
    }

    const parsed = parseNeonConnString(connStr);
    if (!parsed) {
      throw new Error("Invalid connection string format. Example: postgresql://user:password@ep-xyz.aws.neon.tech/neondb?sslmode=require");
    }

    // Try via proxy endpoint first if running on server/local
    try {
      const proxyResp = await fetch("/api/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Neon-Connection-String": connStr
        },
        body: JSON.stringify({ query: sql, params, connString: connStr })
      });

      if (proxyResp.ok) {
        return await proxyResp.json();
      } else {
        const proxyErr = await proxyResp.json().catch(() => null);
        if (proxyErr && proxyErr.error) {
          throw new Error(proxyErr.error);
        }
      }
    } catch (proxyErr) {
      // If error came from Neon proxy failure, rethrow
      if (proxyErr && proxyErr.message && !proxyErr.message.includes("fetch")) {
        throw proxyErr;
      }
    }

    // Direct endpoint fetch
    const resp = await fetch(parsed.httpEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Neon-Connection-String": connStr
      },
      body: JSON.stringify({ query: sql, params })
    });

    if (!resp.ok) {
      let errText = await resp.text();
      try {
        const errJson = JSON.parse(errText);
        if (errJson.message) errText = errJson.message;
      } catch (e) { }
      throw new Error(errText);
    }

    return await resp.json();
  }

  // Initialize DB Client & Verify Live Connection
  async function init() {
    if (config.provider === "neon" && config.neonConnString) {
      try {
        const testRes = await runNeonQuery("SELECT 1 as live_status;");
        if (testRes && testRes.rows && testRes.rows.length) {
          isConnected = true;
          console.log("⚡ [PostgresSync] Connected to Neon PostgreSQL (Singapore)");
        } else {
          isConnected = false;
        }
      } catch (err) {
        console.warn("[PostgresSync] Neon connection check failed, trying auto table creation...", err);
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

  // Initialize Tables on Neon sequentially
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
      `CREATE INDEX IF NOT EXISTS idx_fd_branch ON jccb_fd_forms(branch_code);`,
      `CREATE INDEX IF NOT EXISTS idx_od_branch ON jccb_od_loans(branch_code);`
    ];

    for (const s of stmts) {
      await runNeonQuery(s, [], customConnStr);
    }
  }

  function notifyStatus() {
    listeners.forEach(fn => fn({ isConnected, config }));
    updateUIBadge();
  }

  function onStatusChange(fn) {
    listeners.push(fn);
    fn({ isConnected, config });
  }

  function updateUIBadge() {
    const badge = document.getElementById("postgres-status-badge");
    if (!badge) return;

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
  }

  // Dual-Write: Save Gold Loan
  async function syncGoldLoan(loan) {
    if (!isConnected) return false;
    try {
      const id = String(loan.id || loan.loanNo || Date.now());
      const branchCode = String(loan.branchCode || loan.branchId || "99");
      const loanNo = String(loan.loanNo || loan.id || "");
      const customerName = loan.customerName || loan.borrowerName || "";
      const phone = loan.phone || loan.mobile || "";
      const sanctionAmount = Number(loan.sanctionAmount || loan.loanAmount || 0);
      const sanctionDate = loan.sanctionDate || loan.date || new Date().toISOString().split("T")[0];
      const status = loan.status || "ACTIVE";

      const sql = `
        INSERT INTO jccb_gold_loans (id, branch_code, loan_no, customer_name, phone, sanction_amount, sanction_date, status, payload, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT (id) DO UPDATE SET
          loan_no = EXCLUDED.loan_no,
          customer_name = EXCLUDED.customer_name,
          phone = EXCLUDED.phone,
          sanction_amount = EXCLUDED.sanction_amount,
          status = EXCLUDED.status,
          payload = EXCLUDED.payload,
          updated_at = NOW();
      `;
      await runNeonQuery(sql, [id, branchCode, loanNo, customerName, phone, sanctionAmount, sanctionDate, status, JSON.stringify(loan)]);
      return true;
    } catch (e) {
      console.warn("[PostgresSync] Gold sync error:", e);
      return false;
    }
  }

  // Dual-Write: Save FD Form
  async function syncFDForm(form) {
    if (!isConnected) return false;
    try {
      const id = String(form.formNo || form.id || Date.now());
      const branchCode = String(form.branchCode || form.branchId || "99");
      const formNo = String(form.formNo || "");
      const customerName = form.customerName || form.applicantName || "";
      const depositAmount = Number(form.depositAmount || form.amount || 0);
      const interestRate = Number(form.interestRate || form.rate || 0);
      const tenureMonths = Number(form.tenureMonths || form.months || 12);
      const status = form.status || "COMPLETED";

      const sql = `
        INSERT INTO jccb_fd_forms (id, branch_code, form_no, customer_name, deposit_amount, interest_rate, tenure_months, status, payload, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT (id) DO UPDATE SET
          customer_name = EXCLUDED.customer_name,
          deposit_amount = EXCLUDED.deposit_amount,
          interest_rate = EXCLUDED.interest_rate,
          tenure_months = EXCLUDED.tenure_months,
          status = EXCLUDED.status,
          payload = EXCLUDED.payload,
          updated_at = NOW();
      `;
      await runNeonQuery(sql, [id, branchCode, formNo, customerName, depositAmount, interestRate, tenureMonths, status, JSON.stringify(form)]);
      return true;
    } catch (e) {
      console.warn("[PostgresSync] FD sync error:", e);
      return false;
    }
  }

  // Dual-Write: Save OD Loan
  async function syncODLoan(od) {
    if (!isConnected) return false;
    try {
      const id = String(od.accountNo || od.id || Date.now());
      const branchCode = String(od.branchCode || od.branchId || "99");
      const accountNo = String(od.accountNo || od.loanNo || "");
      const customerName = od.customerName || od.borrowerName || "";
      const limitAmount = Number(od.limitAmount || od.sanctionAmount || od.loanAmount || 0);
      const fdReceiptNo = String(od.fdReceiptNo || od.fdNumber || "");
      const status = od.status || "SANCTIONED";

      const sql = `
        INSERT INTO jccb_od_loans (id, branch_code, account_no, customer_name, limit_amount, fd_receipt_no, status, payload, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (id) DO UPDATE SET
          customer_name = EXCLUDED.customer_name,
          limit_amount = EXCLUDED.limit_amount,
          fd_receipt_no = EXCLUDED.fd_receipt_no,
          status = EXCLUDED.status,
          payload = EXCLUDED.payload,
          updated_at = NOW();
      `;
      await runNeonQuery(sql, [id, branchCode, accountNo, customerName, limitAmount, fdReceiptNo, status, JSON.stringify(od)]);
      return true;
    } catch (e) {
      console.warn("[PostgresSync] OD sync error:", e);
      return false;
    }
  }

  // Fetch All Head Office Data
  async function fetchAllHeadOfficeData() {
    if (!isConnected) return null;
    try {
      const [goldData, fdData, odData] = await Promise.all([
        runNeonQuery("SELECT payload FROM jccb_gold_loans ORDER BY updated_at DESC;"),
        runNeonQuery("SELECT id, payload FROM jccb_fd_forms ORDER BY updated_at DESC;"),
        runNeonQuery("SELECT id, payload FROM jccb_od_loans ORDER BY updated_at DESC;")
      ]);

      return {
        goldLoans: (goldData.rows || []).map(r => r.payload),
        fdForms: (fdData.rows || []).reduce((acc, r) => { acc[r.id] = r.payload; return acc; }, {}),
        odLoans: (odData.rows || []).reduce((acc, r) => { acc[r.id] = r.payload; return acc; }, {})
      };
    } catch (e) {
      console.error("[PostgresSync] fetchAllHeadOfficeData error:", e);
      return null;
    }
  }

  // Show Config Modal
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
              <h3 class="font-bold text-lg">Neon Serverless PostgreSQL Database</h3>
              <p class="text-xs text-blue-200">Live Multi-Branch Cloud Sync</p>
            </div>
          </div>
          <button onclick="PostgresSync.hideConfigModal()" class="text-white/80 hover:text-white text-xl font-bold">&times;</button>
        </div>
        
        <div class="p-6 space-y-4 text-sm text-slate-700">
          <div>
            <label class="block font-bold text-slate-800 mb-1">Neon Database Connection String</label>
            <textarea id="pg-cfg-neon-conn" rows="3" placeholder="postgresql://neondb_owner:password@ep-xyz.aws.neon.tech/neondb?sslmode=require" 
              class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs">${config.neonConnString || ''}</textarea>
            <p class="text-[11px] text-slate-500 mt-1">Paste your freshly rotated connection string from your Neon Project Dashboard.</p>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <p class="font-semibold text-slate-800 flex items-center gap-1.5">
              <span>🛡️</span> Multi-Layer Security & Fail-Safe:
            </p>
            <p>• <b>Live Cloud Sync</b>: All branch records are mirrored to Neon PostgreSQL in real-time.</p>
            <p>• <b>Dual-Write Protection</b>: Local computer storage always stores primary records offline.</p>
            <p>• <b>Excel Snapshot Export</b>: 1-Click master backup (.xlsx) available anytime.</p>
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
        statusDiv.innerHTML = "✅ Connection successful! Neon PostgreSQL is live & ready.";
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
    config.neonConnString = connStr;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));

    hideConfigModal();
    init();
    alert("Neon PostgreSQL settings saved & connected!");
  }

  // Auto initialize on load
  if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
      init();
    });
  }

  return {
    init,
    getConfig: () => ({ ...config }),
    isConnected: () => isConnected,
    onStatusChange,
    syncGoldLoan,
    syncFDForm,
    syncODLoan,
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
