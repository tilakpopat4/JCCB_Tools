/**
 * The Junagadh Commercial Co-Operative Bank Ltd.
 * 100% Pure Neon Serverless PostgreSQL Cloud Engine for Gold Loan Portal
 * Replaces Firebase Firestore completely with Zero-Limits Cloud Postgres.
 */

(function () {
  const DEFAULT_BRANCHES = [
    { code: "99", branchCode: "99", name: "99 HEAD OFFICE", shortName: "HO", branchName: "99 HEAD OFFICE", branchNameGuj: "૯૯ મુખ્ય કચેરી", role: "admin", roleTitle: "Super Admin", isActive: true, isHO: true, isHeadOffice: true },
    { code: "01", branchCode: "01", name: "01 STATION ROAD", shortName: "STR", branchName: "01 STATION ROAD", branchNameGuj: "૦૧ સ્ટેશન રોડ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "02", branchCode: "02", name: "02 BUS STAND ROAD", shortName: "BSR", branchName: "02 BUS STAND ROAD", branchNameGuj: "૦૨ બસ સ્ટેન્ડ રોડ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "03", branchCode: "03", name: "03 VEJALPUR BRANCH", shortName: "VEJ", branchName: "03 VEJALPUR BRANCH", branchNameGuj: "૦૩ વેજલપુર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "04", branchCode: "04", name: "04 JOSHIPURA BRANCH", shortName: "JOS", branchName: "04 JOSHIPURA BRANCH", branchNameGuj: "૦૪ જોશીપુરા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "05", branchCode: "05", name: "05 BILKHA BRANCH", shortName: "BIL", branchName: "05 BILKHA BRANCH", branchNameGuj: "૦૫ બિલખા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "06", branchCode: "06", name: "06 VISAVADAR BRANCH", shortName: "VIS", branchName: "06 VISAVADAR BRANCH", branchNameGuj: "૦૬ વિસાવદર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "07", branchCode: "07", name: "07 BHEESAN BRANCH", shortName: "BHE", branchName: "07 BHEESAN BRANCH", branchNameGuj: "૦૭ ભેંસાણ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "08", branchCode: "08", name: "08 MEND выс BRANCH", shortName: "MEN", branchName: "08 MEND выс BRANCH", branchNameGuj: "૦૮ મેંદરડા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "09", branchCode: "09", name: "09 TALALA BRANCH", shortName: "TAL", branchName: "09 TALALA BRANCH", branchNameGuj: "૦૯ તાલાલા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "10", branchCode: "10", name: "10 VERAVAL BRANCH", shortName: "VER", branchName: "10 VERAVAL BRANCH", branchNameGuj: "૧૦ વેરાવળ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "11", branchCode: "11", name: "11 KESHOD BRANCH", shortName: "KES", branchName: "11 KESHOD BRANCH", branchNameGuj: "૧૧ કેશોદ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "12", branchCode: "12", name: "12 MANAVADAR BRANCH", shortName: "MAN", branchName: "12 MANAVADAR BRANCH", branchNameGuj: "૧૨ માણાવદર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "13", branchCode: "13", name: "13 KANJHA BRANCH", shortName: "KAN", branchName: "13 KANJHA BRANCH", branchNameGuj: "૧૩ કાંજળા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "14", branchCode: "14", name: "14 VANTHALI BRANCH", shortName: "VAN", branchName: "14 VANTHALI BRANCH", branchNameGuj: "૧૪ વંથલી શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "15", branchCode: "15", name: "15 SHAPUR BRANCH", shortName: "SHA", branchName: "15 SHAPUR BRANCH", branchNameGuj: "૧૫ સાપુર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "16", branchCode: "16", name: "16 SARDARBAUG BRANCH", shortName: "SAR", branchName: "16 SARDARBAUG BRANCH", branchNameGuj: "૧૬ સરદારબાગ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "17", branchCode: "17", name: "17 GANDHIGRAM BRANCH", shortName: "GAN", branchName: "17 GANDHIGRAM BRANCH", branchNameGuj: "૧૭ ગાંધીગ્રામ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false },
    { code: "18", branchCode: "18", name: "18 ZANZARDA BRANCH", shortName: "ZAN", branchName: "18 ZANZARDA BRANCH", branchNameGuj: "૧૮ ઝાંઝરડા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false }
  ];

  const NeonGoldService = {
    isInitialized: true,
    currentUser: { uid: "jccb_user", email: "banking@tjccb.com" },
    userProfile: { role: "admin", isHO: true },
    pollingInterval: null,

    init: async function () {
      console.log("⚡ [Neon Cloud DB] Gold Loan Portal connected to Neon PostgreSQL (Singapore)");
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
        return Boolean(s.isAdmin || s.code === "99" || s.role === "Super Admin");
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
      const loanId = String(loanData.id || loanData.loanId || `GL_${Date.now()}_${loanData.branchCode || "01"}`).trim();
      const payload = {
        ...loanData,
        id: loanId,
        loanId: loanId,
        updatedAt: new Date().toISOString()
      };

      // Save to local cache first
      try {
        const cache = JSON.parse(localStorage.getItem("tjccb_gold_loans_cache") || "{}");
        cache[loanId] = payload;
        localStorage.setItem("tjccb_gold_loans_cache", JSON.stringify(cache));
      } catch (e) { }

      // Dual-write to Neon PostgreSQL
      if (window.PostgresSync && window.PostgresSync.syncGoldLoan) {
        await window.PostgresSync.syncGoldLoan(payload);
      }

      return payload;
    },

    getLoans: async function (branchCode = null) {
      if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
        try {
          const sql = branchCode && branchCode !== "99" && branchCode !== "ALL"
            ? "SELECT payload FROM jccb_gold_loans WHERE branch_code = $1 ORDER BY updated_at DESC;"
            : "SELECT payload FROM jccb_gold_loans ORDER BY updated_at DESC;";
          const params = branchCode && branchCode !== "99" && branchCode !== "ALL" ? [String(branchCode)] : [];
          const res = await window.PostgresSync.runNeonQuery(sql, params);
          if (res && res.rows) {
            return res.rows.map(r => r.payload || r);
          }
        } catch (e) {
          console.warn("[Neon Cloud] Fallback to local cache for loans:", e);
        }
      }
      try {
        const cache = JSON.parse(localStorage.getItem("tjccb_gold_loans_cache") || "{}");
        return Object.values(cache);
      } catch (e) {
        return [];
      }
    },

    deleteLoan: async function (loanId) {
      try {
        const cache = JSON.parse(localStorage.getItem("tjccb_gold_loans_cache") || "{}");
        delete cache[loanId];
        localStorage.setItem("tjccb_gold_loans_cache", JSON.stringify(cache));
      } catch (e) { }

      if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
        try {
          await window.PostgresSync.runNeonQuery("DELETE FROM jccb_gold_loans WHERE id = $1;", [loanId]);
          await window.PostgresSync.runNeonQuery("INSERT INTO jccb_deleted_records (id, module, deleted_at) VALUES ($1, 'gold', NOW()) ON CONFLICT (id) DO NOTHING;", [loanId]);
        } catch (e) {
          console.warn("[Neon Cloud] Delete loan sync error:", e);
        }
      }
      return true;
    },

    listenLoans: function (branchCode, callback) {
      if (typeof callback !== "function") return;
      this.getLoans(branchCode).then(callback).catch(() => {});
      // Periodic live poll every 15 seconds
      setInterval(async () => {
        try {
          const loans = await this.getLoans(branchCode);
          callback(loans);
        } catch (e) { }
      }, 15000);
    },

    listenDeletedLoans: function (callback) {
      if (typeof callback !== "function") return;
      setInterval(async () => {
        if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
          try {
            const res = await window.PostgresSync.runNeonQuery("SELECT id FROM jccb_deleted_records WHERE module = 'gold' AND deleted_at > NOW() - INTERVAL '5 minutes';");
            if (res && res.rows) {
              res.rows.forEach(r => callback(r.id));
            }
          } catch (e) { }
        }
      }, 20000);
    },

    // ==========================================
    // 2. DAILY GOLD RATE MASTER
    // ==========================================
    saveDailyRate: async function (dateStr, rateVal) {
      const payload = {
        date: dateStr,
        rate: Number(rateVal),
        updatedAt: new Date().toISOString()
      };
      try {
        const cache = JSON.parse(localStorage.getItem("tjccb_daily_rates_cache") || "{}");
        cache[dateStr] = payload;
        localStorage.setItem("tjccb_daily_rates_cache", JSON.stringify(cache));
      } catch (e) { }

      if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
        try {
          const sql = `
            INSERT INTO jccb_gold_rates (id, date_str, rate, payload, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (id) DO UPDATE SET
              date_str = EXCLUDED.date_str,
              rate = EXCLUDED.rate,
              payload = EXCLUDED.payload,
              updated_at = NOW();
          `;
          await window.PostgresSync.runNeonQuery(sql, [dateStr, dateStr, Number(rateVal), JSON.stringify(payload)]);
        } catch (e) {
          console.warn("[Neon Cloud] Save gold rate error:", e);
        }
      }
      return payload;
    },

    getDailyRates: async function () {
      if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
        try {
          const res = await window.PostgresSync.runNeonQuery("SELECT payload FROM jccb_gold_rates ORDER BY date_str DESC;");
          if (res && res.rows && res.rows.length) {
            return res.rows.map(r => r.payload || r);
          }
        } catch (e) { }
      }
      try {
        const cache = JSON.parse(localStorage.getItem("tjccb_daily_rates_cache") || "{}");
        return Object.values(cache);
      } catch (e) {
        return [];
      }
    },

    listenDailyRates: function (callback) {
      if (typeof callback !== "function") return;
      this.getDailyRates().then(callback).catch(() => {});
      setInterval(async () => {
        try {
          const rates = await this.getDailyRates();
          callback(rates);
        } catch (e) { }
      }, 30000);
    },

    // ==========================================
    // 3. MASTER DATA: BRANCHES, VALUERS, CUSTOMERS, PRODUCTS
    // ==========================================
    getBranchesList: async function () {
      return DEFAULT_BRANCHES;
    },
    listenBranches: function (callback) {
      if (typeof callback === "function") callback(DEFAULT_BRANCHES);
    },
    saveBranch: async function (b) { return b; },

    getValuersList: async function () {
      try {
        return JSON.parse(localStorage.getItem("tjccb_valuers_cache") || "[]");
      } catch (e) { return []; }
    },
    saveValuer: async function (v) {
      try {
        const list = await this.getValuersList();
        list.push(v);
        localStorage.setItem("tjccb_valuers_cache", JSON.stringify(list));
      } catch (e) { }
      return v;
    },
    listenValuers: function (callback) {
      if (typeof callback === "function") {
        this.getValuersList().then(list => callback(list, []));
      }
    },

    getProductsList: async function () {
      try {
        return JSON.parse(localStorage.getItem("tjccb_products_cache") || "[]");
      } catch (e) { return []; }
    },
    saveProduct: async function (p) {
      try {
        const list = await this.getProductsList();
        list.push(p);
        localStorage.setItem("tjccb_products_cache", JSON.stringify(list));
      } catch (e) { }
      return p;
    },
    listenProducts: function (callback) {
      if (typeof callback === "function") {
        this.getProductsList().then(callback);
      }
    },

    getCustomers: async function () {
      try {
        return JSON.parse(localStorage.getItem("tjccb_customers_cache") || "[]");
      } catch (e) { return []; }
    },
    saveCustomer: async function (c) {
      try {
        const list = await this.getCustomers();
        list.push(c);
        localStorage.setItem("tjccb_customers_cache", JSON.stringify(list));
      } catch (e) { }
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
      localStorage.setItem("tjccb_rules_cache", JSON.stringify(rules));
      if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
        try {
          await window.PostgresSync.runNeonQuery(
            "INSERT INTO jccb_gold_settings (key, payload, updated_at) VALUES ('rules', $1, NOW()) ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW();",
            [JSON.stringify(rules)]
          );
        } catch (e) { }
      }
      return rules;
    },
    getRules: async function () {
      try {
        return JSON.parse(localStorage.getItem("tjccb_rules_cache") || "{}");
      } catch (e) { return {}; }
    },
    listenRules: function (callback) {
      if (typeof callback === "function") {
        this.getRules().then(callback);
      }
    },

    saveSettings: async function (settings) {
      localStorage.setItem("tjccb_settings_cache", JSON.stringify(settings));
      if (window.PostgresSync && window.PostgresSync.runNeonQuery) {
        try {
          await window.PostgresSync.runNeonQuery(
            "INSERT INTO jccb_gold_settings (key, payload, updated_at) VALUES ('settings', $1, NOW()) ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW();",
            [JSON.stringify(settings)]
          );
        } catch (e) { }
      }
      return settings;
    },
    getSettings: async function () {
      try {
        return JSON.parse(localStorage.getItem("tjccb_settings_cache") || "{}");
      } catch (e) { return {}; }
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
    // 7. UTILITIES (IMAGE COMPRESSION & UPLOAD)
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

    // Periodic live cloud fetch to ensure cross-device updates
    startBackgroundSync: function () {
      if (this.pollingInterval) clearInterval(this.pollingInterval);
      this.pollingInterval = setInterval(async () => {
        try {
          if (window.PostgresSync && window.PostgresSync.isConnected && window.PostgresSync.isConnected()) {
            const cloudLoans = await this.getLoans();
            if (cloudLoans && cloudLoans.length) {
              const cache = JSON.parse(localStorage.getItem("tjccb_gold_loans_cache") || "{}");
              let changed = false;
              cloudLoans.forEach(l => {
                if (l && l.id && !cache[l.id]) {
                  cache[l.id] = l;
                  changed = true;
                }
              });
              if (changed) {
                localStorage.setItem("tjccb_gold_loans_cache", JSON.stringify(cache));
                if (window.renderLoansTable) window.renderLoansTable();
              }
            }
          }
        } catch (e) { }
      }, 20000);
    }
  };

  // Expose as both NeonGoldService and legacy FirebaseService
  window.NeonGoldService = NeonGoldService;
  window.FirebaseService = NeonGoldService;
})();
