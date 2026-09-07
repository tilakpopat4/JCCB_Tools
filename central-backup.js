/**
 * The Junagadh Commercial Co-Operative Bank Ltd.
 * Central & Individual Backup / Restore Engine (xlsx & csv)
 * Supports: Gold Loan, Fixed Deposit (FD), and Overdraft (OD) Against FD
 */

const CentralBackup = (function () {
  // Storage Keys
  const GOLD_KEY = "jccb_gold_system_state_v2";
  const FD_FORMS_KEY = "tjccb_fd_forms";
  const FD_RATES_KEY = "tjccb_fd_interest_master";
  const OD_LOANS_KEY = "tjccb_od_loans";

  // IDB Config for Gold
  const GOLD_IDB_CONFIG = {
    name: "JCCB_Gold_Storage_DB",
    version: 1,
    storeName: "app_state",
    key: "current_state"
  };

  // Helper: Open Gold IndexedDB
  function getGoldIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("IndexedDB not supported"));
      const req = window.indexedDB.open(GOLD_IDB_CONFIG.name, GOLD_IDB_CONFIG.version);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(GOLD_IDB_CONFIG.storeName)) {
          db.createObjectStore(GOLD_IDB_CONFIG.storeName);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // Load Gold State (IndexedDB + LocalStorage fallback + Neon Cloud)
  async function getGoldState() {
    let localData = null;
    try {
      const raw = localStorage.getItem(GOLD_KEY);
      if (raw) localData = JSON.parse(raw);
    } catch (e) {
      console.warn("Gold LocalStorage read error:", e);
    }

    try {
      const db = await getGoldIndexedDB();
      const idbData = await new Promise((resolve, reject) => {
        const tx = db.transaction([GOLD_IDB_CONFIG.storeName], "readonly");
        const store = tx.objectStore(GOLD_IDB_CONFIG.storeName);
        const req = store.get(GOLD_IDB_CONFIG.key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });

      if (idbData && typeof idbData === "object") {
        localData = { ...(localData || {}), ...idbData };
      }
    } catch (err) {
      console.warn("Gold IndexedDB read error:", err);
    }

    const stateObj = localData || { loans: [], customers: [], valuers: [], rules: {}, goldRates: {} };

    // Merge with Neon Cloud if available
    if (window.PostgresSync && window.PostgresSync.fetchGoldLoans) {
      try {
        const cloudLoans = await window.PostgresSync.fetchGoldLoans();
        if (Array.isArray(cloudLoans) && cloudLoans.length > 0) {
          const loanMap = new Map();
          (stateObj.loans || []).forEach(l => { if (l && l.id) loanMap.set(l.id, l); });
          cloudLoans.forEach(cl => {
            if (cl && cl.id) {
              const existing = loanMap.get(cl.id);
              loanMap.set(cl.id, existing ? { ...existing, ...cl } : cl);
            }
          });
          stateObj.loans = Array.from(loanMap.values());
        }
      } catch (e) { }
    }

    return stateObj;
  }

  // Save Gold State (IndexedDB + LocalStorage + Neon Cloud)
  async function saveGoldState(stateData) {
    try {
      // 1. IndexedDB
      const db = await getGoldIndexedDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction([GOLD_IDB_CONFIG.storeName], "readwrite");
        const store = tx.objectStore(GOLD_IDB_CONFIG.storeName);
        const req = store.put(stateData, GOLD_IDB_CONFIG.key);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn("Gold IDB save error:", e);
    }

    try {
      // 2. LocalStorage with size-safe fallback
      localStorage.setItem(GOLD_KEY, JSON.stringify(stateData));
    } catch (e) {
      console.warn("Gold LocalStorage full, saving trimmed fallback copy:", e);
      try {
        const light = {
          ...stateData,
          loans: (stateData.loans || []).map(l => ({ ...l, applicantPhoto: "", ornamentPhoto: "", customerPhoto: "" })),
          customers: (stateData.customers || []).map(c => ({ ...c, photo: "", customerPhoto: "" }))
        };
        localStorage.setItem(GOLD_KEY, JSON.stringify(light));
      } catch (inner) {
        console.warn("Gold light storage also full:", inner);
      }
    }

    // 3. Dual-write loans to Neon PostgreSQL
    if (window.PostgresSync && window.PostgresSync.syncGoldLoan && Array.isArray(stateData.loans)) {
      stateData.loans.forEach(loan => {
        window.PostgresSync.syncGoldLoan(loan).catch(() => {});
      });
    }
  }

  // Load FD Data (LocalStorage + Neon Cloud)
  function getFDForms() {
    try {
      const raw = localStorage.getItem(FD_FORMS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function getFDRates() {
    try {
      const raw = localStorage.getItem(FD_RATES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveFDForms(formsObj) {
    localStorage.setItem(FD_FORMS_KEY, JSON.stringify(formsObj || {}));
    if (window.PostgresSync && window.PostgresSync.syncFDForm && formsObj) {
      Object.values(formsObj).forEach(f => {
        window.PostgresSync.syncFDForm(f).catch(() => {});
      });
    }
  }

  function saveFDRates(ratesArr) {
    if (ratesArr && ratesArr.length) {
      localStorage.setItem(FD_RATES_KEY, JSON.stringify(ratesArr));
    }
  }

  // Load OD Data (LocalStorage + Neon Cloud)
  function getODLoans() {
    try {
      const raw = localStorage.getItem(OD_LOANS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveODLoans(loansObj) {
    localStorage.setItem(OD_LOANS_KEY, JSON.stringify(loansObj || {}));
    if (window.PostgresSync && window.PostgresSync.syncODLoan && loansObj) {
      Object.values(loansObj).forEach(l => {
        window.PostgresSync.syncODLoan(l).catch(() => {});
      });
    }
  }

  // Ensure SheetJS is available
  function ensureXLSX() {
    if (typeof XLSX === "undefined") {
      alert("Excel engine (SheetJS) is loading or unavailable. Please check your internet connection and refresh the page.");
      throw new Error("XLSX library not loaded");
    }
    return XLSX;
  }

  // Download Trigger
  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  }

  // Convert Array of Objects to CSV string with UTF-8 BOM
  function arrayToCSV(dataArray) {
    if (!dataArray || !dataArray.length) return "\uFEFF";
    const headers = Object.keys(dataArray[0]);
    const csvRows = [];
    csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(","));

    for (const row of dataArray) {
      const values = headers.map(header => {
        let val = row[header];
        if (val === null || val === undefined) val = "";
        if (typeof val === "object") val = JSON.stringify(val);
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      });
      csvRows.push(values.join(","));
    }
    return "\uFEFF" + csvRows.join("\r\n");
  }

  // Simple CSV string parser to Array of Objects
  function parseCSV(csvString) {
    let clean = csvString.replace(/^\uFEFF/, "");
    const lines = [];
    let row = [];
    let inQuotes = false;
    let currentCell = "";

    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      const next = clean[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          currentCell += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentCell);
        currentCell = "";
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && next === '\n') i++;
        row.push(currentCell);
        currentCell = "";
        if (row.length > 0 && row.some(cell => cell.trim() !== "")) {
          lines.push(row);
        }
        row = [];
      } else {
        currentCell += char;
      }
    }
    if (currentCell || row.length > 0) {
      row.push(currentCell);
      if (row.some(cell => cell.trim() !== "")) lines.push(row);
    }

    if (lines.length < 2) return [];
    const headers = lines[0].map(h => h.trim());
    const result = [];
    for (let r = 1; r < lines.length; r++) {
      const obj = {};
      for (let c = 0; c < headers.length; c++) {
        obj[headers[c]] = lines[r][c] !== undefined ? lines[r][c] : "";
      }
      result.push(obj);
    }
    return result;
  }

  // Formatter: Flatten Gold Loans
  function flattenGoldLoans(loans) {
    if (!Array.isArray(loans)) return [];
    return loans.map(l => ({
      "Proposal_No": l.proposalNo || l.id || "",
      "Account_No": l.accountNo || "",
      "Date": l.loanDate || l.date || "",
      "Branch_Code": l.branchCode || "",
      "Branch_Name": l.branchName || "",
      "Customer_ID": l.customerId || l.borrowerId || "",
      "Customer_Name": (l.customerName || l.applicantName || l.borrowerName || "").toUpperCase(),
      "Customer_Address": l.address || l.customerAddress || "",
      "Mobile_No": l.mobileNo || l.mobile || "",
      "Loan_Scheme": l.schemeName || l.productName || l.loanType || "",
      "Sanctioned_Amount": parseFloat(l.sanctionAmount || l.loanAmount || 0) || 0,
      "Interest_Rate_Pct": parseFloat(l.interestRate || l.roi || 0) || 0,
      "Tenure_Months": parseInt(l.tenureMonths || 12, 10) || 12,
      "Valuation_Amount": parseFloat(l.totalValuation || l.valuationAmount || 0) || 0,
      "Gross_Weight_Gm": parseFloat(l.totalGrossWeight || 0) || 0,
      "Net_Weight_Gm": parseFloat(l.totalNetWeight || 0) || 0,
      "Total_Items_Count": parseInt(l.totalItems || (Array.isArray(l.ornaments) ? l.ornaments.length : 0), 10) || 0,
      "Valuer_Name": l.valuerName || "",
      "Processing_Fee": parseFloat(l.processingFee || 0) || 0,
      "Appraiser_Charge": parseFloat(l.appraiserCharge || 0) || 0,
      "Stamp_Duty": parseFloat(l.stampDuty || 0) || 0,
      "Total_Deductions": parseFloat(l.totalDeductions || 0) || 0,
      "Disbursement_Amount": parseFloat(l.netDisbursement || l.netPayable || 0) || 0,
      "Status": l.status || "SANCTIONED",
      "Ornaments_Detail_JSON": JSON.stringify(l.ornaments || []),
      "_RAW_PAYLOAD": JSON.stringify(l)
    }));
  }

  // Formatter: Flatten FD Accounts
  function flattenFDAccounts(fdFormsObj) {
    const list = Object.values(fdFormsObj || {});
    return list.map(item => {
      const d = item.data || {};
      return {
        "FD_Form_ID": item.id || d.formRefNo || "",
        "Timestamp": item.timestamp || "",
        "Branch_Name": item.branch || d.branchName || "",
        "Customer_1_ID": item.customerId || d.firstCustomerId || "",
        "Customer_1_Name": (item.customerName || d.firstFullName || "").toUpperCase(),
        "Customer_1_Mobile": d.firstMobile || "",
        "Customer_1_PAN": (d.firstPan || "").toUpperCase(),
        "Customer_1_Aadhaar": d.firstAadhaar || "",
        "Customer_1_Address": d.firstFlatNo ? `${d.firstFlatNo}, ${d.firstStreet || ''}, ${d.firstCity || ''}` : (d.firstAddress || ""),
        "Deposit_Scheme": item.depositScheme || d.typeOfDeposit || "",
        "Deposit_Amount": parseFloat(item.amount || d.deposit1Amount || 0) || 0,
        "ROI_Percentage": parseFloat(item.roi || d.deposit1Roi || 0) || 0,
        "Tenure_Summary": item.tenure || `${d.deposit1Years || 0}Y ${d.deposit1Months || 0}M ${d.deposit1Days || 0}D`,
        "Maturity_Amount": parseFloat(item.maturityAmount || d.deposit1MaturityAmount || 0) || 0,
        "Operating_Instructions": d.modeOfOperation || "",
        "Nominee_1_Name": (d.nominee1Name || "").toUpperCase(),
        "Nominee_1_Relation": d.nominee1Relation || "",
        "Nominee_1_Age": d.nominee1Age || "",
        "Joint_2_Name": (d.secondFullName || "").toUpperCase(),
        "Joint_3_Name": (d.thirdFullName || "").toUpperCase(),
        "Joint_4_Name": (d.fourthFullName || "").toUpperCase(),
        "_RAW_PAYLOAD": JSON.stringify(item)
      };
    });
  }

  // Formatter: Flatten OD Loans
  function flattenODLoans(odLoansObj) {
    const list = Object.values(odLoansObj || {});
    return list.map(item => {
      const app1 = item.applicant1 || {};
      const receipts = Array.isArray(item.fdReceipts) ? item.fdReceipts : [];
      const totalFdVal = receipts.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
      return {
        "OD_Record_ID": item.id || "",
        "Loan_Date": item.loanDate || "",
        "Branch_Name": item.branchName || "",
        "Customer_1_ID": app1.id || "",
        "Customer_1_Name": (app1.name || "").toUpperCase(),
        "Customer_1_Address": (app1.address || "").toUpperCase(),
        "Sanctioned_OD_Limit": parseFloat(item.loanAmount || 0) || 0,
        "OD_Amount_Gujarati": item.loanAmountWordsGuj || "",
        "OD_Amount_English": item.loanAmountWordsEng || "",
        "Interest_Rate_Pct": parseFloat(item.interestRate || 0) || 0,
        "Loan_Purpose": item.loanPurpose || "",
        "Saving_Account_No": item.savingAccNo || "",
        "Pledged_FD_Count": receipts.length,
        "Total_Pledged_FD_Amount": totalFdVal,
        "Joint_Applicants_JSON": JSON.stringify(item.jointApplicants || []),
        "FD_Receipts_JSON": JSON.stringify(receipts),
        "_RAW_PAYLOAD": JSON.stringify(item)
      };
    });
  }

  // ==================== EXPORT ENGINES ====================

  /**
   * Export Master Multi-Sheet Workbook (.xlsx)
   */
  async function exportMasterXLSX() {
    const XLSX = ensureXLSX();
    const goldState = await getGoldState();
    const fdForms = getFDForms();
    const fdRates = getFDRates();
    const odLoans = getODLoans();

    const wb = XLSX.utils.book_new();

    // 1. Gold Loans Sheet
    const goldLoansRows = flattenGoldLoans(goldState.loans || []);
    const wsGold = XLSX.utils.json_to_sheet(goldLoansRows.length ? goldLoansRows : [{ "Status": "No Gold Loan Records" }]);
    XLSX.utils.book_append_sheet(wb, wsGold, "GOLD_LOANS");

    // 2. Gold Customers Sheet
    const goldCustRows = (goldState.customers || []).map(c => ({
      "Customer_ID": c.id || c.customerId || "",
      "Name": (c.name || c.customerName || "").toUpperCase(),
      "Father_Spouse_Name": (c.relativeName || c.fatherName || "").toUpperCase(),
      "Mobile": c.mobile || c.mobileNo || "",
      "Aadhaar": c.aadhaar || "",
      "PAN": c.pan || "",
      "Address": c.address || "",
      "Branch_Code": c.branchCode || "",
      "_RAW_PAYLOAD": JSON.stringify(c)
    }));
    const wsGoldCust = XLSX.utils.json_to_sheet(goldCustRows.length ? goldCustRows : [{ "Status": "No Customer Records" }]);
    XLSX.utils.book_append_sheet(wb, wsGoldCust, "GOLD_CUSTOMERS");

    // 3. Gold Valuers Sheet
    const goldValuersRows = (goldState.valuers || []).map(v => ({
      "Valuer_ID": v.id || "",
      "Valuer_Name": v.name || "",
      "License_No": v.licenseNo || "",
      "Contact_No": v.contact || v.phone || "",
      "Address": v.address || "",
      "Status": v.status || "ACTIVE",
      "_RAW_PAYLOAD": JSON.stringify(v)
    }));
    const wsValuers = XLSX.utils.json_to_sheet(goldValuersRows.length ? goldValuersRows : [{ "Status": "No Valuer Records" }]);
    XLSX.utils.book_append_sheet(wb, wsValuers, "GOLD_VALUERS");

    // 4. FD Accounts Sheet
    const fdRows = flattenFDAccounts(fdForms);
    const wsFD = XLSX.utils.json_to_sheet(fdRows.length ? fdRows : [{ "Status": "No FD Account Records" }]);
    XLSX.utils.book_append_sheet(wb, wsFD, "FD_ACCOUNTS");

    // 5. FD Rates Sheet
    const wsFDRates = XLSX.utils.json_to_sheet(fdRates.length ? fdRates : [{ "Status": "Default System Rates" }]);
    XLSX.utils.book_append_sheet(wb, wsFDRates, "FD_RATES");

    // 6. OD Loans Sheet
    const odRows = flattenODLoans(odLoans);
    const wsOD = XLSX.utils.json_to_sheet(odRows.length ? odRows : [{ "Status": "No OD Loan Records" }]);
    XLSX.utils.book_append_sheet(wb, wsOD, "OD_LOANS");

    // 7. System Backup Metadata Sheet
    const metaRow = [{
      "Bank_Name": "The Junagadh Commercial Co-Operative Bank Ltd.",
      "Backup_Created_At": new Date().toISOString(),
      "Backup_Formatted_Date": new Date().toLocaleString('en-IN'),
      "Version": "JCCB-UNIFIED-BACKUP-v2.0",
      "Total_Gold_Loans": goldLoansRows.length,
      "Total_Gold_Customers": goldCustRows.length,
      "Total_FD_Accounts": fdRows.length,
      "Total_OD_Loans": odRows.length
    }];
    const wsMeta = XLSX.utils.json_to_sheet(metaRow);
    XLSX.utils.book_append_sheet(wb, wsMeta, "BACKUP_METADATA");

    // Write file
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `JCCB_Master_Central_Backup_${dateStr}.xlsx`;
    XLSX.writeFile(wb, filename);
    return filename;
  }

  /**
   * Export Individual Module to Excel (.xlsx)
   */
  async function exportModuleXLSX(moduleName) {
    const XLSX = ensureXLSX();
    const wb = XLSX.utils.book_new();
    const dateStr = new Date().toISOString().split("T")[0];
    let filename = "";

    if (moduleName === "gold") {
      const goldState = await getGoldState();
      const goldLoansRows = flattenGoldLoans(goldState.loans || []);
      const ws = XLSX.utils.json_to_sheet(goldLoansRows.length ? goldLoansRows : [{ "Status": "No Records" }]);
      XLSX.utils.book_append_sheet(wb, ws, "GOLD_LOANS");
      filename = `JCCB_Gold_Loans_Backup_${dateStr}.xlsx`;
    } else if (moduleName === "fd") {
      const fdForms = getFDForms();
      const fdRows = flattenFDAccounts(fdForms);
      const ws = XLSX.utils.json_to_sheet(fdRows.length ? fdRows : [{ "Status": "No Records" }]);
      XLSX.utils.book_append_sheet(wb, ws, "FD_ACCOUNTS");
      filename = `JCCB_FD_Accounts_Backup_${dateStr}.xlsx`;
    } else if (moduleName === "od") {
      const odLoans = getODLoans();
      const odRows = flattenODLoans(odLoans);
      const ws = XLSX.utils.json_to_sheet(odRows.length ? odRows : [{ "Status": "No Records" }]);
      XLSX.utils.book_append_sheet(wb, ws, "OD_LOANS");
      filename = `JCCB_OD_Loans_Backup_${dateStr}.xlsx`;
    } else {
      throw new Error("Invalid module: " + moduleName);
    }

    XLSX.writeFile(wb, filename);
    return filename;
  }

  /**
   * Export Individual Module to CSV (.csv with UTF-8 BOM)
   */
  async function exportModuleCSV(moduleName) {
    let rows = [];
    const dateStr = new Date().toISOString().split("T")[0];
    let filename = "";

    if (moduleName === "gold") {
      const goldState = await getGoldState();
      rows = flattenGoldLoans(goldState.loans || []);
      filename = `JCCB_Gold_Loans_${dateStr}.csv`;
    } else if (moduleName === "fd") {
      const fdForms = getFDForms();
      rows = flattenFDAccounts(fdForms);
      filename = `JCCB_FD_Accounts_${dateStr}.csv`;
    } else if (moduleName === "od") {
      const odLoans = getODLoans();
      rows = flattenODLoans(odLoans);
      filename = `JCCB_OD_Loans_${dateStr}.csv`;
    } else {
      throw new Error("Invalid module: " + moduleName);
    }

    if (!rows.length) {
      rows = [{ "Status": "No records found for export" }];
    }

    const csvContent = arrayToCSV(rows);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
    return filename;
  }

  // ==================== RESTORE ENGINES ====================

  /**
   * Inspect & Parse an uploaded File (.xlsx, .csv, .json)
   */
  async function inspectFile(file) {
    const isXLSX = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    const isCSV = file.name.endsWith(".csv");

    if (!isXLSX && !isCSV && !file.name.endsWith(".json")) {
      throw new Error("અયોગ્ય ફાઇલ ફોર્મેટ! કૃપા કરીને .xlsx, .csv અથવા .json ફાઇલ પસંદ કરો.");
    }

    const result = {
      filename: file.name,
      fileType: isXLSX ? "xlsx" : (isCSV ? "csv" : "json"),
      detectedPortal: null, // "master", "gold", "fd", "od"
      sheets: {},
      stats: { goldLoans: 0, fdAccounts: 0, odLoans: 0, goldCustomers: 0, goldValuers: 0 }
    };

    if (isXLSX) {
      const XLSX = ensureXLSX();
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });

      wb.SheetNames.forEach(sheetName => {
        const ws = wb.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
        result.sheets[sheetName] = data;
      });

      const sheetNamesUpper = wb.SheetNames.map(s => s.toUpperCase());

      if (sheetNamesUpper.includes("GOLD_LOANS") || sheetNamesUpper.includes("FD_ACCOUNTS") || sheetNamesUpper.includes("OD_LOANS") || sheetNamesUpper.includes("BACKUP_METADATA")) {
        result.detectedPortal = "master";
        if (result.sheets["GOLD_LOANS"]) result.stats.goldLoans = result.sheets["GOLD_LOANS"].length;
        if (result.sheets["GOLD_CUSTOMERS"]) result.stats.goldCustomers = result.sheets["GOLD_CUSTOMERS"].length;
        if (result.sheets["GOLD_VALUERS"]) result.stats.goldValuers = result.sheets["GOLD_VALUERS"].length;
        if (result.sheets["FD_ACCOUNTS"]) result.stats.fdAccounts = result.sheets["FD_ACCOUNTS"].length;
        if (result.sheets["OD_LOANS"]) result.stats.odLoans = result.sheets["OD_LOANS"].length;
      } else {
        const firstSheet = wb.SheetNames[0];
        const rows = result.sheets[firstSheet] || [];
        const detected = detectPortalFromRows(rows);
        result.detectedPortal = detected;
        if (detected === "gold") result.stats.goldLoans = rows.length;
        if (detected === "fd") result.stats.fdAccounts = rows.length;
        if (detected === "od") result.stats.odLoans = rows.length;
      }
    } else if (isCSV) {
      const text = await file.text();
      const rows = parseCSV(text);
      result.sheets["CSV_DATA"] = rows;
      const detected = detectPortalFromRows(rows);
      result.detectedPortal = detected;
      if (detected === "gold") result.stats.goldLoans = rows.length;
      if (detected === "fd") result.stats.fdAccounts = rows.length;
      if (detected === "od") result.stats.odLoans = rows.length;
    } else if (file.name.endsWith(".json")) {
      const text = await file.text();
      const parsed = JSON.parse(text);
      result.sheets["JSON_DATA"] = parsed;
      if (parsed.loans || parsed.rules || parsed.valuers) {
        result.detectedPortal = "gold";
        result.stats.goldLoans = (parsed.loans || []).length;
      } else if (parsed.tjccb_fd_forms || typeof parsed === "object") {
        const keys = Object.keys(parsed);
        if (keys.some(k => k.startsWith("FD_") || (parsed[k] && parsed[k].depositScheme))) {
          result.detectedPortal = "fd";
          result.stats.fdAccounts = keys.length;
        } else if (keys.some(k => k.startsWith("OD-") || (parsed[k] && parsed[k].loanAmount))) {
          result.detectedPortal = "od";
          result.stats.odLoans = keys.length;
        } else {
          result.detectedPortal = "master";
        }
      }
    }

    return result;
  }

  // Detect which portal data belongs to based on columns
  function detectPortalFromRows(rows) {
    if (!rows || !rows.length) return "unknown";
    const sample = rows[0];
    const keys = Object.keys(sample).map(k => k.toUpperCase());

    if (keys.includes("PROPOSAL_NO") || keys.includes("ORNAMENTS_DETAIL_JSON") || keys.includes("VALUATION_AMOUNT") || keys.includes("GROSS_WEIGHT_GM")) {
      return "gold";
    }
    if (keys.includes("FD_FORM_ID") || keys.includes("DEPOSIT_SCHEME") || keys.includes("MATURITY_AMOUNT") || keys.includes("OPERATING_INSTRUCTIONS")) {
      return "fd";
    }
    if (keys.includes("OD_RECORD_ID") || keys.includes("SANCTIONED_OD_LIMIT") || keys.includes("PLEDGED_FD_COUNT") || keys.includes("FD_RECEIPTS_JSON")) {
      return "od";
    }
    return "unknown";
  }

  /**
   * Commit Restore Operations
   */
  async function executeRestore(inspectionResult, scope = "all", mode = "merge") {
    const report = { goldRestored: 0, fdRestored: 0, odRestored: 0, errors: [] };

    try {
      // 1. RESTORE GOLD
      if (scope === "all" || scope === "gold") {
        let goldRows = inspectionResult.sheets["GOLD_LOANS"] || inspectionResult.sheets["CSV_DATA"] || [];
        if (inspectionResult.detectedPortal === "gold" && inspectionResult.fileType === "json") {
          const jsonState = inspectionResult.sheets["JSON_DATA"];
          if (jsonState && typeof jsonState === "object") {
            const current = (mode === "merge") ? await getGoldState() : {};
            const mergedLoans = (mode === "merge" && Array.isArray(current.loans)) ? [...current.loans] : [];
            const newLoans = Array.isArray(jsonState.loans) ? jsonState.loans : [];
            newLoans.forEach(nl => {
              const idx = mergedLoans.findIndex(l => l.id === nl.id || l.proposalNo === nl.proposalNo);
              if (idx >= 0) mergedLoans[idx] = nl;
              else mergedLoans.push(nl);
            });

            const updatedState = { ...current, ...jsonState, loans: mergedLoans };
            await saveGoldState(updatedState);
            report.goldRestored = newLoans.length;
          }
        } else if (goldRows.length > 0 && inspectionResult.detectedPortal !== "fd" && inspectionResult.detectedPortal !== "od") {
          const goldState = await getGoldState();
          const existingLoans = (mode === "merge" && Array.isArray(goldState.loans)) ? [...goldState.loans] : [];
          let count = 0;

          goldRows.forEach(row => {
            if (row.Status === "No Gold Loan Records" || row.Status === "No Records") return;
            let loanObj = null;

            if (row._RAW_PAYLOAD) {
              try { loanObj = JSON.parse(row._RAW_PAYLOAD); } catch (e) { }
            }

            if (!loanObj) {
              loanObj = {
                id: row.Proposal_No || "GL_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                proposalNo: row.Proposal_No || "",
                accountNo: row.Account_No || "",
                loanDate: row.Date || new Date().toISOString().split("T")[0],
                branchCode: row.Branch_Code || "99",
                branchName: row.Branch_Name || "HEAD OFFICE",
                customerId: row.Customer_ID || "",
                customerName: (row.Customer_Name || "").toUpperCase(),
                applicantName: (row.Customer_Name || "").toUpperCase(),
                address: row.Customer_Address || "",
                mobileNo: row.Mobile_No || "",
                schemeName: row.Loan_Scheme || "GOLD LOAN",
                sanctionAmount: parseFloat(row.Sanctioned_Amount) || 0,
                loanAmount: parseFloat(row.Sanctioned_Amount) || 0,
                interestRate: parseFloat(row.Interest_Rate_Pct) || 8.5,
                tenureMonths: parseInt(row.Tenure_Months, 10) || 12,
                totalValuation: parseFloat(row.Valuation_Amount) || 0,
                totalGrossWeight: parseFloat(row.Gross_Weight_Gm) || 0,
                totalNetWeight: parseFloat(row.Net_Weight_Gm) || 0,
                totalItems: parseInt(row.Total_Items_Count, 10) || 0,
                valuerName: row.Valuer_Name || "",
                processingFee: parseFloat(row.Processing_Fee) || 0,
                appraiserCharge: parseFloat(row.Appraiser_Charge) || 0,
                stampDuty: parseFloat(row.Stamp_Duty) || 0,
                totalDeductions: parseFloat(row.Total_Deductions) || 0,
                netDisbursement: parseFloat(row.Disbursement_Amount) || 0,
                status: row.Status || "SANCTIONED",
                ornaments: []
              };
              if (row.Ornaments_Detail_JSON) {
                try { loanObj.ornaments = JSON.parse(row.Ornaments_Detail_JSON); } catch (e) { }
              }
            }

            if (loanObj && (loanObj.id || loanObj.proposalNo)) {
              const key = loanObj.id || loanObj.proposalNo;
              const idx = existingLoans.findIndex(l => (l.id === key || l.proposalNo === key));
              if (idx >= 0) existingLoans[idx] = loanObj;
              else existingLoans.push(loanObj);
              count++;
            }
          });

          // Also restore Customers and Valuers if present in Master sheets
          let custs = goldState.customers || [];
          if (inspectionResult.sheets["GOLD_CUSTOMERS"]) {
            const custRows = inspectionResult.sheets["GOLD_CUSTOMERS"];
            custRows.forEach(cr => {
              if (cr._RAW_PAYLOAD) {
                try {
                  const cObj = JSON.parse(cr._RAW_PAYLOAD);
                  const cIdx = custs.findIndex(c => c.id === cObj.id || c.customerId === cObj.customerId);
                  if (cIdx >= 0) custs[cIdx] = cObj;
                  else custs.push(cObj);
                } catch (e) { }
              }
            });
          }

          let valuers = goldState.valuers || [];
          if (inspectionResult.sheets["GOLD_VALUERS"]) {
            const valRows = inspectionResult.sheets["GOLD_VALUERS"];
            valRows.forEach(vr => {
              if (vr._RAW_PAYLOAD) {
                try {
                  const vObj = JSON.parse(vr._RAW_PAYLOAD);
                  const vIdx = valuers.findIndex(v => v.id === vObj.id);
                  if (vIdx >= 0) valuers[vIdx] = vObj;
                  else valuers.push(vObj);
                } catch (e) { }
              }
            });
          }

          await saveGoldState({ ...goldState, loans: existingLoans, customers: custs, valuers: valuers });
          report.goldRestored = count;
        }
      }

      // 2. RESTORE FD
      if (scope === "all" || scope === "fd") {
        let fdRows = inspectionResult.sheets["FD_ACCOUNTS"] || inspectionResult.sheets["CSV_DATA"] || [];
        if (inspectionResult.detectedPortal === "fd" || inspectionResult.sheets["FD_ACCOUNTS"]) {
          const currentForms = (mode === "merge") ? getFDForms() : {};
          let count = 0;

          fdRows.forEach(row => {
            if (row.Status === "No FD Account Records" || row.Status === "No Records") return;
            let itemObj = null;

            if (row._RAW_PAYLOAD) {
              try { itemObj = JSON.parse(row._RAW_PAYLOAD); } catch (e) { }
            }

            if (!itemObj) {
              const formId = row.FD_Form_ID || `FD_${row.Customer_1_ID || 'TJCCB'}_${Date.now().toString().slice(-4)}`;
              const formData = {
                formRefNo: formId,
                branchName: row.Branch_Name || "HEAD OFFICE",
                firstCustomerId: row.Customer_1_ID || "",
                firstFullName: (row.Customer_1_Name || "").toUpperCase(),
                firstMobile: row.Customer_1_Mobile || "",
                firstPan: row.Customer_1_PAN || "",
                firstAadhaar: row.Customer_1_Aadhaar || "",
                firstAddress: row.Customer_1_Address || "",
                typeOfDeposit: row.Deposit_Scheme || "FIXED DEPOSIT (FD)",
                deposit1Amount: row.Deposit_Amount || "0",
                deposit1Roi: row.ROI_Percentage || "0",
                deposit1MaturityAmount: row.Maturity_Amount || "",
                modeOfOperation: row.Operating_Instructions || "SELF",
                nominee1Name: row.Nominee_1_Name || "",
                nominee1Relation: row.Nominee_1_Relation || "",
                nominee1Age: row.Nominee_1_Age || "",
                secondFullName: row.Joint_2_Name || "",
                thirdFullName: row.Joint_3_Name || "",
                fourthFullName: row.Joint_4_Name || ""
              };

              itemObj = {
                id: formId,
                createdAt: Date.now(),
                timestamp: row.Timestamp || new Date().toLocaleString('en-IN'),
                customerName: (row.Customer_1_Name || "").toUpperCase(),
                customerId: row.Customer_1_ID || "",
                branch: row.Branch_Name || "HEAD OFFICE",
                depositScheme: row.Deposit_Scheme || "FIXED DEPOSIT (FD)",
                amount: row.Deposit_Amount || "0",
                roi: row.ROI_Percentage || "0",
                maturityAmount: row.Maturity_Amount || "",
                tenure: row.Tenure_Summary || "",
                data: formData
              };
            }

            if (itemObj && itemObj.id) {
              currentForms[itemObj.id] = itemObj;
              count++;
            }
          });

          saveFDForms(currentForms);

          if (inspectionResult.sheets["FD_RATES"]) {
            const rateRows = inspectionResult.sheets["FD_RATES"].filter(r => !r.Status);
            if (rateRows.length) saveFDRates(rateRows);
          }

          report.fdRestored = count;
        }
      }

      // 3. RESTORE OD
      if (scope === "all" || scope === "od") {
        let odRows = inspectionResult.sheets["OD_LOANS"] || inspectionResult.sheets["CSV_DATA"] || [];
        if (inspectionResult.detectedPortal === "od" || inspectionResult.sheets["OD_LOANS"]) {
          const currentOD = (mode === "merge") ? getODLoans() : {};
          let count = 0;

          odRows.forEach(row => {
            if (row.Status === "No OD Loan Records" || row.Status === "No Records") return;
            let itemObj = null;

            if (row._RAW_PAYLOAD) {
              try { itemObj = JSON.parse(row._RAW_PAYLOAD); } catch (e) { }
            }

            if (!itemObj) {
              const recId = row.OD_Record_ID || `OD-01-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
              let jointApps = [];
              let receipts = [];
              if (row.Joint_Applicants_JSON) {
                try { jointApps = JSON.parse(row.Joint_Applicants_JSON); } catch (e) { }
              }
              if (row.FD_Receipts_JSON) {
                try { receipts = JSON.parse(row.FD_Receipts_JSON); } catch (e) { }
              }

              itemObj = {
                id: recId,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                branchName: row.Branch_Name || "HEAD OFFICE",
                loanDate: row.Loan_Date || new Date().toISOString().split("T")[0],
                applicant1: {
                  id: row.Customer_1_ID || "",
                  name: (row.Customer_1_Name || "").toUpperCase(),
                  address: (row.Customer_1_Address || "").toUpperCase()
                },
                jointApplicants: jointApps,
                loanAmount: parseFloat(row.Sanctioned_OD_Limit) || 0,
                loanAmountWordsGuj: row.OD_Amount_Gujarati || "",
                loanAmountWordsEng: row.OD_Amount_English || "",
                interestRate: parseFloat(row.Interest_Rate_Pct) || 9.5,
                loanPurpose: row.Loan_Purpose || "BUSINESS / PERSONAL OVERDRAFT",
                savingAccNo: row.Saving_Account_No || "",
                fdReceipts: receipts
              };
            }

            if (itemObj && itemObj.id) {
              currentOD[itemObj.id] = itemObj;
              count++;
            }
          });

          saveODLoans(currentOD);
          report.odRestored = count;
        }
      }

    } catch (err) {
      console.error("Restore execution error:", err);
      report.errors.push(err.message);
    }

    return report;
  }

  // Public API
  return {
    getGoldState,
    saveGoldState,
    getFDForms,
    saveFDForms,
    getODLoans,
    saveODLoans,
    exportMasterXLSX,
    exportModuleXLSX,
    exportModuleCSV,
    inspectFile,
    executeRestore
  };
})();

// Attach to window
if (typeof window !== "undefined") {
  window.CentralBackup = CentralBackup;
}
