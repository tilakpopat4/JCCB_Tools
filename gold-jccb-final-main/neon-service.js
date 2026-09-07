/**
 * The Junagadh Commercial Co-Operative Bank Ltd.
 * 100% Pure Neon Serverless PostgreSQL & Firebase Firestore Hybrid Cloud Engine for Gold Loan Portal
 * Zero-Limits Cloud PostgreSQL + Live Realtime Push Firestore Sync.
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

      // 1. Cloud Realtime Push (Firebase Firestore)
      if (window.FirebaseSync && typeof window.FirebaseSync.saveGoldLoan === "function") {
        try {
          await window.FirebaseSync.saveGoldLoan(payload);
          console.log(`⚡ [Gold Save] Firestore realtime sync status for ${loanId}: SUCCESS`);
        } catch (fbErr) {
          console.warn("⚠️ [Gold Save] Firebase sync warning:", fbErr);
        }
      }

      // 2. Dual-write to Neon PostgreSQL
      if (window.PostgresSync && window.PostgresSync.syncGoldLoan) {
        try {
          await window.PostgresSync.syncGoldLoan(payload);
        } catch (e) {
          console.warn("[Gold Save] Neon sync warning:", e);
        }
      }

      return payload;
    },

    getLoans: async function (branchCode = null) {
      let bCode = branchCode;
      if (!bCode && !this.isHeadOffice()) {
        bCode = this.getBranchId();
      }

      const loanMap = new Map();

      // 1. Fetch from Neon PostgreSQL
      if (window.PostgresSync && window.PostgresSync.fetchGoldLoans) {
        try {
          const pgLoans = await window.PostgresSync.fetchGoldLoans(bCode);
          if (Array.isArray(pgLoans)) {
            pgLoans.forEach(l => {
              if (l && (l.id || l.loanId)) {
                loanMap.set(String(l.id || l.loanId).trim(), l);
              }
            });
          }
        } catch (e) {
          console.warn("[Neon Cloud] Fallback to local cache for loans:", e);
        }
      }

      // 2. Fetch from Firebase Firestore if available
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        try {
          const db = firebase.firestore();
          let query = db.collection('goldLoans');
          if (!this.isHeadOffice() && bCode) {
            query = query.where('branchCode', '==', String(bCode).padStart(2, '0'));
          }
          const snap = await query.get();
          snap.forEach(doc => {
            const data = doc.data();
            const id = String(data.id || data.loanId || doc.id).trim();
            const existing = loanMap.get(id);
            const loanObj = { ...(data.payload || data), id: id, loanId: id };
            if (existing) {
              loanMap.set(id, { ...existing, ...loanObj });
            } else {
              loanMap.set(id, loanObj);
            }
          });
        } catch (fbErr) { }
      }

      if (loanMap.size > 0) {
        let list = Array.from(loanMap.values());
        if (!this.isHeadOffice() && bCode) {
          const userBranch = String(bCode).replace(/\D/g, '');
          list = list.filter(l => String(l.branchCode || l.branchId || "").replace(/\D/g, '') === userBranch);
        }
        return list;
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
      const cleanId = String(loanId).trim();
      const bCode = this.getBranchId() || '99';
      const user = (this.getActiveSession && this.getActiveSession().name) || 'User';

      // 1. Delete & Broadcast on Firebase Firestore
      if (window.FirebaseSync && typeof window.FirebaseSync.deleteGoldLoan === "function") {
        try {
          await window.FirebaseSync.deleteGoldLoan(cleanId, bCode, user);
          console.log(`🗑️ [Gold Delete] Firestore realtime delete broadcast for ${cleanId}`);
        } catch (fbErr) {
          console.warn("[Gold Delete] Firebase delete warning:", fbErr);
        }
      }

      // 2. Delete on Neon PostgreSQL
      if (window.PostgresSync && window.PostgresSync.deleteGoldLoan) {
        try {
          await window.PostgresSync.deleteGoldLoan(cleanId, bCode, user);
        } catch (e) {
          console.warn("[Neon Cloud] Delete loan sync error:", e);
        }
      }
      return true;
    },

    getDeletedLoanIds: async function () {
      const deletedSet = new Set();
      if (window.PostgresSync && window.PostgresSync.fetchDeletedRecordIds) {
        try {
          const pgDeleted = await window.PostgresSync.fetchDeletedRecordIds('gold');
          (pgDeleted || []).forEach(id => deletedSet.add(String(id).trim()));
        } catch (e) { }
      }
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        try {
          const db = firebase.firestore();
          const snap = await db.collection('deleted_loans').get();
          snap.forEach(doc => deletedSet.add(String(doc.id).trim()));
        } catch (e) { }
      }
      return Array.from(deletedSet);
    },

    listenLoans: function (branchCode, callback) {
      if (typeof callback !== "function") return;

      // 1. Firebase Firestore Instant Realtime Push Subscription
      if (window.FirebaseSync && typeof window.FirebaseSync.subscribeToGoldLoans === "function") {
        try {
          window.FirebaseSync.subscribeToGoldLoans((cloudLoans) => {
            if (Array.isArray(cloudLoans)) {
              callback(cloudLoans);
            }
          });
        } catch (fbErr) {
          console.warn("[Gold Live Sync] Firebase subscription notice:", fbErr);
        }
      }

      // 2. Initial load and Neon fallback
      this.getLoans(branchCode).then(loans => {
        if (Array.isArray(loans) && loans.length > 0) {
          callback(loans);
        }
      }).catch(() => {});
    },

    listenDeletedLoans: function (callback) {
      if (typeof callback !== "function") return;

      // 1. Firebase Firestore Realtime Deletion Broadcast Listener
      if (window.FirebaseSync && typeof window.FirebaseSync.subscribeToDeletedRecords === "function") {
        try {
          window.FirebaseSync.subscribeToDeletedRecords('goldLoans', (deletedId) => {
            if (deletedId) {
              callback(deletedId);
            }
          });
        } catch (fbErr) {
          console.warn("[Gold Delete Listener] Firebase deleted subscription notice:", fbErr);
        }
      }

      // 2. Neon fallback query for deleted records
      if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
        setInterval(async () => {
          try {
            const res = await window.PostgresSync.runNeonQuery("SELECT id FROM jccb_deleted_records WHERE module = 'gold' AND deleted_at > NOW() - INTERVAL '15 minutes';");
            if (res && res.rows) {
              res.rows.forEach(r => callback(r.id));
            }
          } catch (e) { }
        }, 15000);
      }
    },

    // ==========================================
    // 2. DAILY GOLD RATE MASTER
    // ==========================================
    saveDailyRate: async function (dateStr, rateVal) {
      const r22 = Number(rateVal);
      const payload = {
        date: dateStr,
        rate22K: r22,
        rate24K: Math.round(r22 * (24 / 22)),
        updatedAt: new Date().toISOString()
      };

      if (window.PostgresSync && window.PostgresSync.syncGoldRate) {
        try { await window.PostgresSync.syncGoldRate(dateStr, rateVal); } catch (e) {}
      }

      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        try {
          const db = firebase.firestore();
          await db.collection('goldSettings').doc('dailyRates').set(payload, { merge: true });
        } catch (e) {}
      }

      return payload;
    },

    saveDailyRates: async function (ratesObj) {
      if (!ratesObj) return;
      const r22 = parseFloat(ratesObj.rate22K || ratesObj.rate || 0);
      const rDate = ratesObj.date || new Date().toISOString().split("T")[0];
      return this.saveDailyRate(rDate, r22);
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
      if (window.FirebaseSync && typeof window.FirebaseSync.saveBranches === 'function') {
        try { await window.FirebaseSync.saveBranches(branches); } catch (e) {}
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
      if (window.FirebaseSync && typeof window.FirebaseSync.getValuersList === "function") {
        try {
          const valRes = await window.FirebaseSync.getValuersList();
          if (valRes && (Array.isArray(valRes.list) || Array.isArray(valRes))) {
            return valRes;
          }
        } catch (e) { }
      }

      if (window.PostgresSync && window.PostgresSync.fetchGoldSettings) {
        try {
          const valuers = await window.PostgresSync.fetchGoldSettings('valuers');
          if (valuers) return valuers;
        } catch (e) { }
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
      const vList = Array.isArray(valuers) ? valuers : [];
      const dIds = Array.isArray(deletedIds) ? deletedIds : [];

      if (window.FirebaseSync && typeof window.FirebaseSync.saveValuersList === "function") {
        try {
          await window.FirebaseSync.saveValuersList(vList, dIds);
          console.log(`⚡ [NeonGoldService] Valuers saved to Firebase Firestore (${vList.length} valuers)`);
        } catch (e) {
          console.warn("[NeonGoldService] Firebase Valuers save notice:", e);
        }
      }

      if (window.PostgresSync && window.PostgresSync.syncGoldSettings) {
        try {
          await window.PostgresSync.syncGoldSettings('valuers', { list: vList, deletedIds: dIds });
        } catch (e) { }
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
      if (typeof callback !== "function") return;

      // 1. Firebase Firestore Live Realtime Push
      if (window.FirebaseSync && typeof window.FirebaseSync.subscribeToValuers === "function") {
        try {
          window.FirebaseSync.subscribeToValuers((list, deletedIds) => {
            if (Array.isArray(list)) {
              callback(list, deletedIds || []);
            }
          });
        } catch (e) {
          console.warn("[NeonGoldService] Realtime valuers subscription notice:", e);
        }
      }

      // 2. Initial fetch
      this.getValuersList().then(res => {
        const list = Array.isArray(res) ? res : ((res && Array.isArray(res.list)) ? res.list : []);
        const del = (res && Array.isArray(res.deletedIds)) ? res.deletedIds : [];
        if (list.length > 0) callback(list, del);
      }).catch(() => {});
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
    // 7. GLOBAL DATABASE RESTORE & LIVE BROADCAST
    // ==========================================
    restoreFullDatabaseToFirebase: async function (restoredData = {}, onProgress = null) {
      const report = (stage, pct, msg) => {
        console.log(`[Neon/Firebase Restore ${pct}%] [${stage}]: ${msg}`);
        if (typeof onProgress === "function") {
          try { onProgress(stage, pct, msg); } catch (e) {}
        }
      };

      report("START", 5, "Cloud Database Connection Established...");

      try {
        // 1. Daily Rates & Rate History
        if (restoredData.goldRates || (restoredData.rateHistory && restoredData.rateHistory.length > 0)) {
          report("RATES", 12, "Saving daily gold rates & rate history to cloud...");
          const latestRate = (restoredData.rateHistory && restoredData.rateHistory.length > 0)
            ? restoredData.rateHistory[0]
            : { rate22K: restoredData.goldRates?.["22K"] || 0, rate24K: restoredData.goldRates?.["24K"] || 0 };
          const r22 = parseFloat(latestRate.rate22K || latestRate.rate || 0);
          const rDate = latestRate.date || new Date().toISOString().split("T")[0];

          if (r22 > 0) {
            await this.saveDailyRate(rDate, r22);
          }
          if (window.PostgresSync && window.PostgresSync.syncGoldSettings) {
            try {
              await window.PostgresSync.syncGoldSettings('rateHistory', restoredData.rateHistory || []);
            } catch (e) {}
          }
          if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            try {
              const db = firebase.firestore();
              await db.collection('goldSettings').doc('dailyRates').set({
                rate22K: r22,
                rate24K: Math.round(r22 * (24 / 22)),
                date: rDate,
                isLocked: Boolean(restoredData.goldRates?.isLocked),
                lockedAt: restoredData.goldRates?.lockedAt || null,
                lockedBy: restoredData.goldRates?.lockedBy || "HEAD OFFICE",
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true });
              if (Array.isArray(restoredData.rateHistory)) {
                await db.collection('goldSettings').doc('rateHistory').set({
                  list: restoredData.rateHistory,
                  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
              }
            } catch (e) {}
          }
        }

        // 2. Sony Valuers Master
        if (Array.isArray(restoredData.valuers)) {
          report("VALUERS", 25, `Saving ${restoredData.valuers.length} Sony Valuers to cloud...`);
          await this.saveValuersList(restoredData.valuers, []);
        }

        // 3. Branches Master
        if (Array.isArray(restoredData.branches)) {
          report("BRANCHES", 35, `Saving ${restoredData.branches.length} Bank Branches to cloud...`);
          await this.saveBranchesList(restoredData.branches);
        }

        // 4. Products Master
        if (Array.isArray(restoredData.products)) {
          report("PRODUCTS", 45, `Saving ${restoredData.products.length} Loan Schemes to cloud...`);
          await this.saveProductsList(restoredData.products);
          if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            try {
              const db = firebase.firestore();
              await db.collection('goldSettings').doc('products').set({
                list: restoredData.products,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true });
            } catch (e) {}
          }
        }

        // 5. Rules Master & Settings
        if (restoredData.rules) {
          report("RULES", 55, "Saving Banking Rules & Custom Charges to cloud...");
          await this.saveRules(restoredData.rules);
          if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            try {
              const db = firebase.firestore();
              await db.collection('goldSettings').doc('rules').set({
                ...restoredData.rules,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true });
            } catch (e) {}
          }
        }
        if (restoredData.settings) {
          report("SETTINGS", 62, "Saving Account Settings & Seeds to cloud...");
          await this.saveSettings(restoredData.settings);
          if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            try {
              const db = firebase.firestore();
              await db.collection('goldSettings').doc('settings').set({
                ...restoredData.settings,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true });
            } catch (e) {}
          }
        }

        // 6. Customers Master
        if (Array.isArray(restoredData.customers) && restoredData.customers.length > 0) {
          report("CUSTOMERS", 70, `Saving ${restoredData.customers.length} Member/Customer profiles to cloud...`);
          await this.saveCustomersList(restoredData.customers);
          if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            try {
              const db = firebase.firestore();
              await db.collection('goldSettings').doc('customers').set({
                list: restoredData.customers,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true });
            } catch (e) {}
          }
        }

        // 7. Clean up deleted tombstones for any restored active loans
        const loans = Array.isArray(restoredData.loans) ? restoredData.loans : [];
        const totalLoans = loans.length;
        const restoredLoanIds = loans.map(l => String(l.id || l.loanId || "").trim()).filter(Boolean);

        if (restoredLoanIds.length > 0) {
          report("CLEANUP", 75, "Clearing old deleted tombstones for restored active loans...");
          // Clean from PostgreSQL
          if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
            try {
              await window.PostgresSync.runNeonQuery(
                `DELETE FROM jccb_deleted_records WHERE module = 'gold' AND id = ANY($1::text[]);`,
                [restoredLoanIds]
              );
            } catch (e) { }
          }
          // Clean from Firestore
          if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            try {
              const db = firebase.firestore();
              const batch = db.batch();
              let count = 0;
              for (const lId of restoredLoanIds) {
                batch.delete(db.collection('deleted_loans').doc(lId));
                batch.delete(db.collection('deletedRecords').doc(`gold_${lId}`));
                batch.delete(db.collection('deletedRecords').doc(lId));
                count++;
                if (count >= 400) break;
              }
              await batch.commit();
            } catch (e) {}
          }
        }

        // 8. Upload Loan Records in Batches
        report("LOANS", 80, `Uploading ${totalLoans} Gold Loan records to Firebase & Neon...`);
        const loanBatchSize = 10;
        for (let i = 0; i < totalLoans; i += loanBatchSize) {
          const chunk = loans.slice(i, i + loanBatchSize);
          const currentProgress = Math.round(80 + ((i + chunk.length) / (totalLoans || 1)) * 16);
          report("LOANS_CHUNK", currentProgress, `Uploading loans: ${i + chunk.length} / ${totalLoans}...`);

          await Promise.all(chunk.map(async (loanItem) => {
            const loanId = String(loanItem.id || loanItem.loanId || `GL_${Date.now()}_${loanItem.branchCode || '01'}`).trim();
            let custPhoto = loanItem.customerPhoto || loanItem.applicantPhoto || "";
            let ornPhoto = loanItem.ornamentPhoto || "";

            if (typeof custPhoto === "string" && custPhoto.startsWith("data:image") && custPhoto.length > 120000) {
              try { custPhoto = await this.compressBase64Image(custPhoto, 400, 0.6); } catch (e) {}
            }
            if (typeof ornPhoto === "string" && ornPhoto.startsWith("data:image") && ornPhoto.length > 120000) {
              try { ornPhoto = await this.compressBase64Image(ornPhoto, 400, 0.6); } catch (e) {}
            }

            const pLoan = {
              ...loanItem,
              id: loanId,
              loanId: loanId,
              customerPhoto: custPhoto,
              applicantPhoto: custPhoto,
              ornamentPhoto: ornPhoto,
              branchCode: String(loanItem.branchCode || loanItem.branchId || '01'),
              branchId: String(loanItem.branchCode || loanItem.branchId || '01'),
              updatedAt: loanItem.updatedAt || new Date().toISOString()
            };

            await this.saveLoan(pLoan);
          }));
        }

        // 9. Send Global Broadcast Signal
        report("BROADCAST", 98, "Broadcasting global restore signal to all branches...");
        await this.sendGlobalSyncSignal({
          action: "DATABASE_RESTORE_GLOBAL",
          restoreTimestamp: Date.now(),
          restoredBy: (window.state?.currentSession?.name) || "HEAD OFFICE",
          summary: { loans: totalLoans, customers: (restoredData.customers || []).length }
        });

        report("COMPLETE", 100, "Full database restored and saved permanently to Cloud!");
        return true;
      } catch (fatalError) {
        console.error("[Neon/Firebase Restore] Fatal error during cloud restore:", fatalError);
        report("ERROR", 100, "Cloud restore error: " + fatalError.message);
        throw fatalError;
      }
    },

    sendGlobalSyncSignal: async function (signalData = {}) {
      const payload = {
        ...signalData,
        restoreTimestamp: Date.now(),
        updatedAt: new Date().toISOString()
      };
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        try {
          const db = firebase.firestore();
          await db.collection('settings').doc('global_sync_signal').set(payload, { merge: true });
          await db.collection('goldSettings').doc('global_sync_signal').set(payload, { merge: true });
        } catch (e) {}
      }
      return payload;
    },

    getGlobalSyncSignal: async function () {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        try {
          const db = firebase.firestore();
          const doc = await db.collection('goldSettings').doc('global_sync_signal').get();
          if (doc.exists) return doc.data();
          const doc2 = await db.collection('settings').doc('global_sync_signal').get();
          if (doc2.exists) return doc2.data();
        } catch (e) {}
      }
      return null;
    },

    listenGlobalSyncSignal: function (onSignal) {
      if (typeof onSignal !== "function") return () => {};
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        try {
          const db = firebase.firestore();
          return db.collection('goldSettings').doc('global_sync_signal').onSnapshot(doc => {
            if (doc.exists) onSignal(doc.data());
          }, () => {});
        } catch (e) {}
      }
      return () => {};
    },

    // ==========================================
    // 8. UTILITIES
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
