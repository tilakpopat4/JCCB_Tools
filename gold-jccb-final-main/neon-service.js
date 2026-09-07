/**
 * The Junagadh Commercial Co-Operative Bank Ltd.
 * 100% Pure Neon Serverless PostgreSQL Cloud Engine for Gold Loan Portal
 * Replaces Firebase Firestore completely with Zero-Limits Cloud Postgres.
 */

(function () {
  const DEFAULT_BRANCHES = [
    { code: "99", branchCode: "99", name: "99 HEAD OFFICE", shortName: "HO", branchName: "99 HEAD OFFICE", branchNameGuj: "૯૯ મુખ્ય કચેરી", role: "admin", roleTitle: "Super Admin", isActive: true, isHO: true, isHeadOffice: true },
    { code: "01", branchCode: "01", name: "01 AZADCHOWK BRANCH", shortName: "CBB", branchName: "01 AZADCHOWK BRANCH", branchNameGuj: "૦૧ આઝાદચોક શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "02", branchCode: "02", name: "02 JOSHIPARA BRANCH", shortName: "JPB", branchName: "02 JOSHIPARA BRANCH", branchNameGuj: "૦૨ જોશીપુરા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "03", branchCode: "03", name: "03 DOLATPARA BRANCH", shortName: "DPB", branchName: "03 DOLATPARA BRANCH", branchNameGuj: "૦૩ દોલતપરા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "04", branchCode: "04", name: "04 KODINAR BRANCH", shortName: "KDR", branchName: "04 KODINAR BRANCH", branchNameGuj: "૦૪ કોડીનાર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "05", branchCode: "05", name: "05 KESHOD BRANCH", shortName: "KSD", branchName: "05 KESHOD BRANCH", branchNameGuj: "૦૫ કેશોદ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "06", branchCode: "06", name: "06 VANTHALI BRANCH", shortName: "VTL", branchName: "06 VANTHALI BRANCH", branchNameGuj: "૦૬ વંથલી શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "07", branchCode: "07", name: "07 MANAVADAR BRANCH", shortName: "MNV", branchName: "07 MANAVADAR BRANCH", branchNameGuj: "૦૭ માણાવદર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "08", branchCode: "08", name: "08 GANDHINAGAR BRANCH", shortName: "GNB", branchName: "08 GANDHINAGAR BRANCH", branchNameGuj: "૦૮ ગાંધીનગર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "09", branchCode: "09", name: "09 LIMBDI BRANCH", shortName: "LIM", branchName: "09 LIMBDI BRANCH", branchNameGuj: "૦૯ લીંબડી શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "10", branchCode: "10", name: "10 MENDARDA BRANCH", shortName: "MND", branchName: "10 MENDARDA BRANCH", branchNameGuj: "૧૦ મેંદરડા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "11", branchCode: "11", name: "11 VISAVADAR BRANCH", shortName: "VIS", branchName: "11 VISAVADAR BRANCH", branchNameGuj: "૧૧ વિસાવદર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "12", branchCode: "12", name: "12 JAMNAGAR BRANCH", shortName: "JAM", branchName: "12 JAMNAGAR BRANCH", branchNameGuj: "૧૨ જામનગર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "13", branchCode: "13", name: "13 BUS STAND BRANCH", shortName: "STB", branchName: "13 BUS STAND BRANCH", branchNameGuj: "૧૩ બસ સ્ટેન્ડ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "14", branchCode: "14", name: "14 LATHI BRANCH", shortName: "LTH", branchName: "14 LATHI BRANCH", branchNameGuj: "૧૪ લાઠી શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "16", branchCode: "16", name: "16 AHMEDABAD BRANCH", shortName: "AHM", branchName: "16 AHMEDABAD BRANCH", branchNameGuj: "૧૬ અમદાવાદ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "17", branchCode: "17", name: "17 RAJKOT BRANCH", shortName: "RJT", branchName: "17 RAJKOT BRANCH", branchNameGuj: "૧૭ રાજકોટ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "18", branchCode: "18", name: "18 ZANZARDA BRANCH", shortName: "ZAN", branchName: "18 ZANZARDA BRANCH", branchNameGuj: "૧૮ ઝાંઝરડા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false }
  ];

  const NeonGoldService = {
    isInitialized: true,
    currentUser: { uid: "jccb_user", email: "banking@tjccb.com" },
    userProfile: { role: "admin", isHO: true },
    pollingInterval: null,

    init: async function () {
      console.log("⚡ [Neon Cloud DB] Gold Loan Portal connected to Neon PostgreSQL (Singapore)");
      if (window.PostgresSync && window.PostgresSync.init) {
        await window.PostgresSync.init();
      }
      this.startBackgroundSync();
      return true;
    },

    onAuthStateChanged: function (callback) {
      if (typeof callback === "function") {
        callback(this.currentUser);
      }
    },

    isHeadOffice: function () {
      try {
        const s = JSON.parse(localStorage.getItem("jccb_user_session") || sessionStorage.getItem("jccb_user_session") || "{}");
        return Boolean(s.isAdmin || s.code === "99" || s.role === "Super Admin" || (s.name && s.name.toUpperCase().includes("HEAD OFFICE")));
      } catch (e) {
        return true;
      }
    },

    isSuperAdmin: function () {
      return this.isHeadOffice();
    },

    getBranchId: function () {
      try {
        const s = JSON.parse(localStorage.getItem("jccb_user_session") || sessionStorage.getItem("jccb_user_session") || "{}");
        return s.code || "99";
      } catch (e) {
        return "99";
      }
    },

    // ==========================================
    // 1. GOLD LOANS CRUD & LIVE SYNC
    // ==========================================
    saveLoan: async function (loanData) {
      const loanId = String(loanData.id || loanData.loanId || loanData.proposalNo || `GL_${Date.now()}_${loanData.branchCode || "01"}`).trim();
      const payload = {
        ...loanData,
        id: loanId,
        loanId: loanId,
        updatedAt: loanData.updatedAt || new Date().toISOString()
      };

      // Dual-write to Neon PostgreSQL
      if (window.PostgresSync && window.PostgresSync.syncGoldLoan) {
        await window.PostgresSync.syncGoldLoan(payload);
      }

      return payload;
    },

    getLoans: async function (branchCode = null) {
      let bCode = branchCode;
      if (!bCode && !this.isHeadOffice()) {
        bCode = this.getBranchId();
      }

      if (window.PostgresSync && window.PostgresSync.fetchGoldLoans) {
        try {
          const loans = await window.PostgresSync.fetchGoldLoans(bCode);
          if (Array.isArray(loans) && loans.length > 0) {
            return loans;
          }
        } catch (e) {
          console.warn("[Neon Cloud] Fallback to local cache for loans:", e);
        }
      }

      try {
        const raw = localStorage.getItem("jccb_gold_system_state_v2");
        if (raw) {
          const parsed = JSON.parse(raw);
          let list = Array.isArray(parsed.loans) ? parsed.loans : [];
          if (!this.isHeadOffice() && bCode) {
            const userBranch = String(bCode).replace(/\D/g, '');
            list = list.filter(l => String(l.branchCode || l.branchId || "").replace(/\D/g, '') === userBranch);
          }
          return list;
        }
      } catch (e) { }
      return [];
    },

    deleteLoan: async function (loanId) {
      if (window.PostgresSync && window.PostgresSync.deleteGoldLoan) {
        try {
          await window.PostgresSync.deleteGoldLoan(loanId);
        } catch (e) {
          console.warn("[Neon Cloud] Delete loan sync error:", e);
        }
      }
      return true;
    },

    getDeletedLoanIds: async function () {
      if (window.PostgresSync && window.PostgresSync.fetchDeletedRecordIds) {
        try {
          return await window.PostgresSync.fetchDeletedRecordIds('gold');
        } catch (e) {
          return [];
        }
      }
      return [];
    },

    listenLoans: function (branchCode, callback) {
      if (typeof callback !== "function") return;
      this.getLoans(branchCode).then(callback).catch(() => {});
      setInterval(async () => {
        try {
          const loans = await this.getLoans(branchCode);
          if (Array.isArray(loans)) callback(loans);
        } catch (e) { }
      }, 10000);
    },

    listenDeletedLoans: function (callback) {
      if (typeof callback !== "function") return;
      setInterval(async () => {
        if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
          try {
            const res = await window.PostgresSync.runNeonQuery("SELECT id FROM jccb_deleted_records WHERE module = 'gold' AND deleted_at > NOW() - INTERVAL '15 minutes';");
            if (res && res.rows) {
              res.rows.forEach(r => callback(r.id));
            }
          } catch (e) { }
        }
      }, 15000);
    },

    // ==========================================
    // 2. DAILY GOLD RATE MASTER
    // ==========================================
    saveDailyRate: async function (dateStr, rateVal) {
      const payload = {
        date: dateStr,
        rate22K: Number(rateVal),
        rate24K: Math.round(Number(rateVal) * (24 / 22)),
        updatedAt: new Date().toISOString()
      };

      if (window.PostgresSync && window.PostgresSync.syncGoldRate) {
        await window.PostgresSync.syncGoldRate(dateStr, rateVal);
      }
      return payload;
    },

    getDailyRates: async function () {
      if (window.PostgresSync && window.PostgresSync.fetchGoldRates) {
        try {
          const rates = await window.PostgresSync.fetchGoldRates();
          if (Array.isArray(rates) && rates.length > 0) {
            // Also augment array with latest rate properties for dual compatibility
            const latest = rates[0] || {};
            const r22 = parseFloat(latest.rate22K || latest.rate || 0);
            rates.rate22K = r22;
            rates.rate24K = Math.round(r22 * (24 / 22));
            rates.date = latest.date || latest.date_str || "";
            return rates;
          }
        } catch (e) { }
      }
      return [];
    },

    listenDailyRates: function (callback) {
      if (typeof callback !== "function") return;
      this.getDailyRates().then(callback).catch(() => {});
      setInterval(async () => {
        try {
          const rates = await this.getDailyRates();
          if (rates) callback(rates);
        } catch (e) { }
      }, 15000);
    },

    // ==========================================
    // 3. MASTER DATA: BRANCHES, VALUERS, CUSTOMERS, PRODUCTS
    // ==========================================
    getBranchesList: async function () {
      if (window.PostgresSync && window.PostgresSync.fetchGoldSettings) {
        const branches = await window.PostgresSync.fetchGoldSettings('branches');
        if (Array.isArray(branches) && branches.length > 0) return branches;
      }
      return DEFAULT_BRANCHES;
    },
    saveBranchesList: async function (branches) {
      if (window.PostgresSync && window.PostgresSync.syncGoldSettings) {
        await window.PostgresSync.syncGoldSettings('branches', branches);
      }
      return branches;
    },
    listenBranches: function (callback) {
      if (typeof callback === "function") {
        this.getBranchesList().then(callback);
      }
    },
    saveBranch: async function (b) { return b; },

    getValuersList: async function () {
      if (window.PostgresSync && window.PostgresSync.fetchGoldSettings) {
        const valuers = await window.PostgresSync.fetchGoldSettings('valuers');
        if (valuers) return valuers;
      }
      try {
        const raw = localStorage.getItem("jccb_gold_system_state_v2");
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed.valuers || [];
        }
      } catch (e) { }
      return [];
    },
    saveValuersList: async function (valuers, deletedIds = []) {
      if (window.PostgresSync && window.PostgresSync.syncGoldSettings) {
        await window.PostgresSync.syncGoldSettings('valuers', { list: valuers, deletedIds });
      }
      return valuers;
    },
    saveValuer: async function (v) {
      const current = await this.getValuersList();
      const list = Array.isArray(current) ? current : (current.list || []);
      const idx = list.findIndex(item => item.id === v.id || item.name === v.name);
      if (idx >= 0) list[idx] = v;
      else list.push(v);
      await this.saveValuersList(list);
      return v;
    },
    listenValuers: function (callback) {
      if (typeof callback === "function") {
        this.getValuersList().then(list => callback(list, []));
      }
    },

    getProductsList: async function () {
      if (window.PostgresSync && window.PostgresSync.fetchGoldSettings) {
        const prods = await window.PostgresSync.fetchGoldSettings('products');
        if (Array.isArray(prods) && prods.length > 0) return prods;
      }
      return [];
    },
    saveProductsList: async function (products) {
      if (window.PostgresSync && window.PostgresSync.syncGoldSettings) {
        await window.PostgresSync.syncGoldSettings('products', products);
      }
      return products;
    },
    saveProduct: async function (p) {
      const list = await this.getProductsList();
      list.push(p);
      await this.saveProductsList(list);
      return p;
    },
    listenProducts: function (callback) {
      if (typeof callback === "function") {
        this.getProductsList().then(callback);
      }
    },

    getCustomers: async function () {
      if (window.PostgresSync && window.PostgresSync.fetchGoldSettings) {
        const customers = await window.PostgresSync.fetchGoldSettings('customers');
        if (Array.isArray(customers) && customers.length > 0) return customers;
      }
      try {
        const raw = localStorage.getItem("jccb_gold_system_state_v2");
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed.customers || [];
        }
      } catch (e) { }
      return [];
    },
    saveCustomersList: async function (customers) {
      if (window.PostgresSync && window.PostgresSync.syncGoldSettings) {
        await window.PostgresSync.syncGoldSettings('customers', customers);
      }
      return customers;
    },
    saveCustomer: async function (c) {
      const list = await this.getCustomers();
      const idx = list.findIndex(item => String(item.customerNo || item.id) === String(c.customerNo || c.id));
      if (idx >= 0) list[idx] = c;
      else list.push(c);
      await this.saveCustomersList(list);
      return c;
    },
    listenCustomers: function (callback) {
      if (typeof callback === "function") {
        this.getCustomers().then(callback);
      }
    },

    // ==========================================
    // 4. RULES & SETTINGS
    // ==========================================
    saveRules: async function (rules) {
      if (window.PostgresSync && window.PostgresSync.syncGoldSettings) {
        await window.PostgresSync.syncGoldSettings('rules', rules);
      }
      return rules;
    },
    getRules: async function () {
      if (window.PostgresSync && window.PostgresSync.fetchGoldSettings) {
        const rules = await window.PostgresSync.fetchGoldSettings('rules');
        if (rules) return rules;
      }
      return {};
    },
    listenRules: function (callback) {
      if (typeof callback === "function") {
        this.getRules().then(callback);
      }
    },

    saveSettings: async function (settings) {
      if (window.PostgresSync && window.PostgresSync.syncGoldSettings) {
        await window.PostgresSync.syncGoldSettings('settings', settings);
      }
      return settings;
    },
    getSettings: async function () {
      if (window.PostgresSync && window.PostgresSync.fetchGoldSettings) {
        const settings = await window.PostgresSync.fetchGoldSettings('settings');
        if (settings) return settings;
      }
      return {};
    },
    listenSettings: function (callback) {
      if (typeof callback === "function") {
        this.getSettings().then(callback);
      }
    },

    // ==========================================
    // 5. AUDIT LOGGING & ACTIVITY
    // ==========================================
    logAuditEvent: async function (type, description, meta = {}) {
      if (window.PostgresSync && window.PostgresSync.logActivity) {
        try {
          const s = JSON.parse(localStorage.getItem("jccb_user_session") || "{}");
          const bCode = s.code || "99";
          await window.PostgresSync.logActivity(bCode, "GOLD", type, null, description);
        } catch (e) { }
      }
    },
    getAuditLogs: async function (limit = 100) {
      if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
        try {
          const res = await window.PostgresSync.runNeonQuery("SELECT * FROM jccb_branch_activity WHERE module = 'GOLD' ORDER BY created_at DESC LIMIT $1;", [limit]);
          if (res && res.rows) return res.rows;
        } catch (e) { }
      }
      return [];
    },
    listenAuditLogs: function (callback) {
      if (typeof callback === "function") {
        this.getAuditLogs(100).then(callback);
      }
    },

    // ==========================================
    // 6. SESSIONS MANAGEMENT
    // ==========================================
    listenActiveSessions: function (callback) {
      if (typeof callback === "function") {
        const dummy = [{ branchId: "99", branchName: "99 HEAD OFFICE", role: "Super Admin", isOnline: true }];
        callback(dummy);
      }
    },
    registerActiveSession: async function () {},
    terminateActiveSession: async function () {},
    deleteActiveSession: async function () {},

    // ==========================================
    // 7. UTILITIES
    // ==========================================
    compressBase64Image: async function (base64, maxDim = 600, quality = 0.7) {
      return new Promise((resolve) => {
        if (!base64 || typeof base64 !== "string" || !base64.startsWith("data:image")) {
          return resolve(base64);
        }
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => resolve(base64);
        img.src = base64;
      });
    },

    uploadImage: async function (fileOrBase64) {
      if (typeof fileOrBase64 === "string") return fileOrBase64;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBase64);
      });
    },

    // Background live cloud sync to ensure cross-device updates
    startBackgroundSync: function () {
      if (this.pollingInterval) clearInterval(this.pollingInterval);
      this.pollingInterval = setInterval(async () => {
        try {
          if (window.PostgresSync && window.PostgresSync.isConnected && window.PostgresSync.isConnected()) {
            const cloudLoans = await this.getLoans();
            if (Array.isArray(cloudLoans) && cloudLoans.length > 0) {
              if (typeof window.syncCloudData === "function") {
                window.syncCloudData(false);
              }
            }
          }
        } catch (e) { }
      }, 10000);
    }
  };

  // Expose as both NeonGoldService and legacy FirebaseService for backwards compatibility
  window.NeonGoldService = NeonGoldService;
  window.FirebaseService = NeonGoldService;
})();
