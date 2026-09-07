/**
 * The Junagadh Commercial Co-Operative Bank Ltd. (JCCB)
 * Unified Firebase / Firestore Realtime Sync Engine
 * 
 * Supports all 3 portals: Gold Loan, FD Portal, and OD Against FD Portal.
 * Enforces branch isolation (01-18) + Head Office (99 / admin) global consolidation.
 * Schema & Security Rules compliant with firestore_schema_and_rules.md.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FirebaseSync = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAdIRywb7xDw9xbTzgE2fl9sn2d4LduTKs",
    authDomain: "project-484328444876485620.firebaseapp.com",
    projectId: "project-484328444876485620",
    storageBucket: "project-484328444876485620.firebasestorage.app",
    messagingSenderId: "811112744598",
    appId: "1:811112744598:web:165dfd8dd9e0b648f0a4b7",
    measurementId: "G-VRGC863RKH"
  };

  let app = null;
  let auth = null;
  let db = null;
  let isInitialized = false;
  let initPromise = null;
  let activeSubscriptions = {};
  let connectionListeners = [];
  let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // Track online/offline status
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      isOnline = true;
      notifyConnectionStatus(true);
    });
    window.addEventListener('offline', () => {
      isOnline = false;
      notifyConnectionStatus(false);
    });
  }

  function notifyConnectionStatus(status) {
    connectionListeners.forEach(cb => {
      try { cb(status); } catch (e) { }
    });
  }

  /**
   * Parse logged in user's branch & role from browser storage
   */
  function getCurrentBranchInfo() {
    let branchCode = '99';
    let role = 'branch';
    let branchName = 'HEAD OFFICE';
    let isAdmin = false;

    if (typeof localStorage === 'undefined') {
      return { branchCode: '99', role: 'admin', branchName: 'HEAD OFFICE', isHeadOffice: true };
    }

    try {
      const raw = localStorage.getItem('jccb_user_session') ||
                  sessionStorage.getItem('jccb_user_session') ||
                  sessionStorage.getItem('jccb_active_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.code || parsed.branchCode || parsed.branchId) {
          const rawCode = String(parsed.code || parsed.branchCode || parsed.branchId).replace(/\D/g, '');
          branchCode = rawCode ? rawCode.padStart(2, '0') : '99';
        }
        if (parsed.name || parsed.branchName) {
          branchName = parsed.name || parsed.branchName;
        }
        if (parsed.role) {
          role = parsed.role;
        }
        if (parsed.isAdmin !== undefined) {
          isAdmin = !!parsed.isAdmin;
        }
      }
    } catch (e) { }

    if (branchCode === '99' || role === 'admin' || role === 'Super Admin' || isAdmin) {
      isAdmin = true;
      role = 'admin';
    }

    return {
      branchCode: branchCode,
      role: role,
      branchName: branchName,
      isHeadOffice: isAdmin || branchCode === '99'
    };
  }

  /**
   * Initialize Firebase App & Firestore with Offline Persistence
   */
  async function init() {
    if (isInitialized && db) return true;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        if (typeof firebase === 'undefined') {
          console.warn("[FirebaseSync] Firebase SDK scripts not loaded yet. Waiting...");
          return false;
        }

        if (!firebase.apps || !firebase.apps.length) {
          app = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
          app = firebase.app();
        }

        auth = firebase.auth();
        db = firebase.firestore();

        // Enable offline persistence
        try {
          await db.enablePersistence({ synchronizeTabs: true });
          console.log("⚡ [FirebaseSync] Firestore offline persistence active.");
        } catch (persErr) {
          if (persErr.code === 'failed-precondition') {
            console.warn("[FirebaseSync] Persistence notice: Multiple tabs open.");
          } else if (persErr.code === 'unimplemented') {
            console.warn("[FirebaseSync] Persistence not supported in current browser.");
          }
        }

        // Anonymous auth fallback session
        if (auth && !auth.currentUser) {
          try {
            await auth.signInAnonymously();
            console.log("🔒 [FirebaseSync] Cloud authenticated session active.");
          } catch (authErr) {
            console.warn("[FirebaseSync] Anonymous auth fallback notice:", authErr.message);
          }
        }

        isInitialized = true;
        console.log("✅ [FirebaseSync] Connected to Firebase Project:", FIREBASE_CONFIG.projectId);
        notifyConnectionStatus(true);
        return true;
      } catch (err) {
        console.error("❌ [FirebaseSync] Initialization error:", err);
        isInitialized = false;
        return false;
      }
    })();

    return initPromise;
  }

  // =========================================================================
  // REAL-TIME SUBSCRIPTIONS (PUSH BASED — NO 10S POLLING LOOP NEEDED)
  // =========================================================================

  /**
   * Subscribe to Fixed Deposit Forms (/fdForms)
   * Head Office gets all branches; branch users get branch-scoped records.
   */
  async function subscribeToFDForms(onDataCallback) {
    await init();
    if (!db) return () => {};

    const branchInfo = getCurrentBranchInfo();
    const fdRef = db.collection('fdForms');

    let q;
    if (branchInfo.isHeadOffice) {
      q = fdRef.orderBy('updatedAt', 'asc');
    } else {
      q = fdRef.where('branchCode', '==', branchInfo.branchCode).orderBy('updatedAt', 'asc');
    }

    const unsubKey = 'fdForms';
    if (activeSubscriptions[unsubKey]) {
      try { activeSubscriptions[unsubKey](); } catch (e) { }
    }

    const unsub = q.onSnapshot(
      (snapshot) => {
        const records = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          records.push({
            id: doc.id,
            formNo: doc.id,
            branchCode: d.branchCode || '99',
            customerName: d.customerName || (d.payload && d.payload.firstFullName) || 'UNNAMED',
            customerId: d.customerId || (d.payload && d.payload.firstCustomerId) || 'TJCCB',
            depositScheme: d.depositScheme || (d.payload && d.payload.typeOfDeposit) || 'FIXED DEPOSIT (FD)',
            amount: d.amount || (d.payload && d.payload.deposit1Amount) || '0',
            roi: d.roi || (d.payload && d.payload.deposit1Roi) || '0.00',
            maturityAmount: d.maturityAmount || (d.payload && d.payload.deposit1MaturityAmount) || '',
            tenure: d.tenure || '',
            status: d.status || 'ACTIVE',
            updatedAt: d.updatedAtIso || (d.updatedAt && d.updatedAt.toDate ? d.updatedAt.toDate().toISOString() : new Date().toISOString()),
            data: d.payload || d
          });
        });

        if (typeof onDataCallback === 'function') {
          onDataCallback(records, snapshot.docChanges());
        }
      },
      async (err) => {
        console.warn("[FirebaseSync] FD query with index failed, falling back to simple query:", err.message);
        // Fallback if composite index is building
        const fallbackRef = branchInfo.isHeadOffice
          ? fdRef
          : fdRef.where('branchCode', '==', branchInfo.branchCode);

        const fallbackUnsub = fallbackRef.onSnapshot((snapshot) => {
          const records = [];
          snapshot.forEach(doc => {
            const d = doc.data();
            records.push({
              id: doc.id,
              formNo: doc.id,
              branchCode: d.branchCode || '99',
              customerName: d.customerName || (d.payload && d.payload.firstFullName) || 'UNNAMED',
              customerId: d.customerId || (d.payload && d.payload.firstCustomerId) || 'TJCCB',
              depositScheme: d.depositScheme || (d.payload && d.payload.typeOfDeposit) || 'FIXED DEPOSIT (FD)',
              amount: d.amount || (d.payload && d.payload.deposit1Amount) || '0',
              roi: d.roi || (d.payload && d.payload.deposit1Roi) || '0.00',
              maturityAmount: d.maturityAmount || (d.payload && d.payload.deposit1MaturityAmount) || '',
              tenure: d.tenure || '',
              status: d.status || 'ACTIVE',
              updatedAt: d.updatedAtIso || (d.updatedAt && d.updatedAt.toDate ? d.updatedAt.toDate().toISOString() : new Date().toISOString()),
              data: d.payload || d
            });
          });
          if (typeof onDataCallback === 'function') {
            onDataCallback(records, snapshot.docChanges());
          }
        });
        activeSubscriptions[unsubKey] = fallbackUnsub;
      }
    );

    activeSubscriptions[unsubKey] = unsub;
    return unsub;
  }

  /**
   * Subscribe to Gold Loans (/goldLoans)
   */
  async function subscribeToGoldLoans(onDataCallback) {
    await init();
    if (!db) return () => {};

    const branchInfo = getCurrentBranchInfo();
    const goldRef = db.collection('goldLoans');

    let q;
    if (branchInfo.isHeadOffice) {
      q = goldRef.orderBy('updatedAt', 'asc');
    } else {
      q = goldRef.where('branchCode', '==', branchInfo.branchCode).orderBy('updatedAt', 'asc');
    }

    const unsubKey = 'goldLoans';
    if (activeSubscriptions[unsubKey]) {
      try { activeSubscriptions[unsubKey](); } catch (e) { }
    }

    const unsub = q.onSnapshot(
      (snapshot) => {
        const records = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          records.push({
            id: doc.id,
            loanNo: doc.id,
            branchCode: d.branchCode || '99',
            customerName: d.customerName || (d.payload && d.payload.customerName) || 'UNNAMED',
            customerId: d.customerId || (d.payload && d.payload.customerId) || '',
            amount: d.amount || (d.payload && d.payload.loanAmount) || '0',
            status: d.status || 'ACTIVE',
            updatedAt: d.updatedAtIso || (d.updatedAt && d.updatedAt.toDate ? d.updatedAt.toDate().toISOString() : new Date().toISOString()),
            data: d.payload || d
          });
        });

        if (typeof onDataCallback === 'function') {
          onDataCallback(records, snapshot.docChanges());
        }
      },
      (err) => {
        console.warn("[FirebaseSync] Gold Loans query index fallback:", err.message);
        const fallbackRef = branchInfo.isHeadOffice
          ? goldRef
          : goldRef.where('branchCode', '==', branchInfo.branchCode);

        const fallbackUnsub = fallbackRef.onSnapshot((snapshot) => {
          const records = [];
          snapshot.forEach(doc => {
            const d = doc.data();
            records.push({
              id: doc.id,
              loanNo: doc.id,
              branchCode: d.branchCode || '99',
              customerName: d.customerName || (d.payload && d.payload.customerName) || 'UNNAMED',
              customerId: d.customerId || (d.payload && d.payload.customerId) || '',
              amount: d.amount || (d.payload && d.payload.loanAmount) || '0',
              status: d.status || 'ACTIVE',
              updatedAt: d.updatedAtIso || (d.updatedAt && d.updatedAt.toDate ? d.updatedAt.toDate().toISOString() : new Date().toISOString()),
              data: d.payload || d
            });
          });
          if (typeof onDataCallback === 'function') {
            onDataCallback(records, snapshot.docChanges());
          }
        });
        activeSubscriptions[unsubKey] = fallbackUnsub;
      }
    );

    activeSubscriptions[unsubKey] = unsub;
    return unsub;
  }

  /**
   * Subscribe to OD Against FD Loans (/odLoans)
   */
  async function subscribeToODLoans(onDataCallback) {
    await init();
    if (!db) return () => {};

    const branchInfo = getCurrentBranchInfo();
    const odRef = db.collection('odLoans');

    let q;
    if (branchInfo.isHeadOffice) {
      q = odRef.orderBy('updatedAt', 'asc');
    } else {
      q = odRef.where('branchCode', '==', branchInfo.branchCode).orderBy('updatedAt', 'asc');
    }

    const unsubKey = 'odLoans';
    if (activeSubscriptions[unsubKey]) {
      try { activeSubscriptions[unsubKey](); } catch (e) { }
    }

    const unsub = q.onSnapshot(
      (snapshot) => {
        const records = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          records.push({
            id: doc.id,
            accountNo: doc.id,
            branchCode: d.branchCode || '99',
            customerName: d.customerName || (d.payload && d.payload.customerName) || 'UNNAMED',
            customerId: d.customerId || (d.payload && d.payload.customerId) || '',
            amount: d.amount || (d.payload && d.payload.odLimit) || '0',
            status: d.status || 'ACTIVE',
            updatedAt: d.updatedAtIso || (d.updatedAt && d.updatedAt.toDate ? d.updatedAt.toDate().toISOString() : new Date().toISOString()),
            data: d.payload || d
          });
        });

        if (typeof onDataCallback === 'function') {
          onDataCallback(records, snapshot.docChanges());
        }
      },
      (err) => {
        console.warn("[FirebaseSync] OD Loans query index fallback:", err.message);
        const fallbackRef = branchInfo.isHeadOffice
          ? odRef
          : odRef.where('branchCode', '==', branchInfo.branchCode);

        const fallbackUnsub = fallbackRef.onSnapshot((snapshot) => {
          const records = [];
          snapshot.forEach(doc => {
            const d = doc.data();
            records.push({
              id: doc.id,
              accountNo: doc.id,
              branchCode: d.branchCode || '99',
              customerName: d.customerName || (d.payload && d.payload.customerName) || 'UNNAMED',
              customerId: d.customerId || (d.payload && d.payload.customerId) || '',
              amount: d.amount || (d.payload && d.payload.odLimit) || '0',
              status: d.status || 'ACTIVE',
              updatedAt: d.updatedAtIso || (d.updatedAt && d.updatedAt.toDate ? d.updatedAt.toDate().toISOString() : new Date().toISOString()),
              data: d.payload || d
            });
          });
          if (typeof onDataCallback === 'function') {
            onDataCallback(records, snapshot.docChanges());
          }
        });
        activeSubscriptions[unsubKey] = fallbackUnsub;
      }
    );

    activeSubscriptions[unsubKey] = unsub;
    return unsub;
  }

  /**
   * Subscribe to cross-device deletion broadcast (/deletedRecords)
   */
  async function subscribeToDeletedRecords(tableName, onDeletedCallback) {
    await init();
    if (!db) return () => {};

    const unsubKey = `del_${tableName}`;
    if (activeSubscriptions[unsubKey]) {
      try { activeSubscriptions[unsubKey](); } catch (e) { }
    }

    const unsub = db.collection('deletedRecords')
      .where('tableName', '==', tableName)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            if (data && data.recordId && typeof onDeletedCallback === 'function') {
              onDeletedCallback(data.recordId, data);
            }
          }
        });
      }, (err) => {
        console.warn("[FirebaseSync] Deleted records subscription error:", err.message);
      });

    activeSubscriptions[unsubKey] = unsub;
    return unsub;
  }

  // =========================================================================
  // DOCUMENT WRITES (CLOUD UPSERTS & DELETES)
  // =========================================================================

  /**
   * Save FD Form into /fdForms/{formId}
   */
  async function saveFDForm(record) {
    await init();
    if (!db) throw new Error("Firestore not initialized.");

    const rawId = record.id || record.formNo || record.formRefNo || ('FD_' + Date.now());
    const cleanId = String(rawId).replace(/[\/\\]/g, '_').trim();
    
    const branchInfo = getCurrentBranchInfo();
    const rawBranch = record.branchCode || record.branch || branchInfo.branchCode;
    const cleanBranch = String(rawBranch).replace(/\D/g, '').padStart(2, '0') || '99';

    const formData = record.data || record.payload || record;
    const custName = record.customerName || formData.firstFullName || 'UNNAMED';
    const custId = record.customerId || formData.firstCustomerId || 'TJCCB';
    const scheme = record.depositScheme || formData.typeOfDeposit || 'FIXED DEPOSIT (FD)';
    const amount = record.amount || formData.deposit1Amount || '0';
    const roi = record.roi || formData.deposit1Roi || '0.00';
    const maturityAmount = record.maturityAmount || formData.deposit1MaturityAmount || '';
    const tenure = record.tenure || `${formData.deposit1Years || 0}Y ${formData.deposit1Months || 0}M ${formData.deposit1Days || 0}D`;

    const nowIso = new Date().toISOString();
    const docPayload = {
      id: cleanId,
      branchCode: cleanBranch,
      status: record.status || 'ACTIVE',
      customerName: custName,
      customerId: custId,
      depositScheme: scheme,
      amount: amount,
      roi: roi,
      maturityAmount: maturityAmount,
      tenure: tenure,
      payload: formData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAtIso: nowIso,
      createdBy: auth.currentUser ? auth.currentUser.uid : 'staff'
    };

    if (!record.createdAt) {
      docPayload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('fdForms').doc(cleanId).set(docPayload, { merge: true });
    console.log(`⚡ [FirebaseSync] Saved FD Form /fdForms/${cleanId} (Branch ${cleanBranch})`);
    
    // Log activity
    logActivity('SAVE_FD_FORM', 'fd', { formId: cleanId, customerName: custName, branchCode: cleanBranch }).catch(() => {});
    return true;
  }

  /**
   * Delete FD Form from /fdForms/{formId} and broadcast to /deletedRecords
   */
  async function deleteFDForm(formId, branchCode, deletedBy) {
    await init();
    if (!db) return false;

    const cleanId = String(formId).trim();
    const branchInfo = getCurrentBranchInfo();
    const bCode = branchCode ? String(branchCode).padStart(2, '0') : branchInfo.branchCode;

    try {
      await db.collection('fdForms').doc(cleanId).delete();
      await db.collection('deletedRecords').add({
        tableName: 'fdForms',
        recordId: cleanId,
        branchCode: bCode,
        deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
        deletedAtIso: new Date().toISOString(),
        deletedBy: deletedBy || (auth.currentUser ? auth.currentUser.uid : 'staff')
      });
      console.log(`🗑️ [FirebaseSync] Deleted FD Form /fdForms/${cleanId}`);
      logActivity('DELETE_FD_FORM', 'fd', { formId: cleanId, branchCode: bCode }).catch(() => {});
      return true;
    } catch (e) {
      console.error("[FirebaseSync] Error deleting FD form:", e);
      return false;
    }
  }

  /**
   * Save Gold Loan into /goldLoans/{loanId}
   */
  async function saveGoldLoan(loan) {
    await init();
    if (!db) throw new Error("Firestore not initialized.");

    const rawId = loan.id || loan.loanNo || loan.formNo || loan.applicationNo || ('GL_' + Date.now());
    const cleanId = String(rawId).replace(/[\/\\]/g, '_').trim();

    const branchInfo = getCurrentBranchInfo();
    const rawBranch = loan.branchCode || loan.branch || branchInfo.branchCode;
    const cleanBranch = String(rawBranch).replace(/\D/g, '').padStart(2, '0') || '99';

    const loanPayload = loan.data || loan.payload || loan;
    const custName = loan.customerName || loanPayload.customerName || 'UNNAMED';
    const custId = loan.customerId || loanPayload.customerId || '';
    const amount = loan.amount || loanPayload.loanAmount || loanPayload.sanctionAmount || '0';

    const nowIso = new Date().toISOString();
    const docPayload = {
      id: cleanId,
      branchCode: cleanBranch,
      status: loan.status || 'ACTIVE',
      customerName: custName,
      customerId: custId,
      amount: amount,
      payload: loanPayload,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAtIso: nowIso,
      createdBy: auth.currentUser ? auth.currentUser.uid : 'staff'
    };

    if (!loan.createdAt) {
      docPayload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('goldLoans').doc(cleanId).set(docPayload, { merge: true });
    
    // Dual write to legacy /loans collection for backwards compatibility
    try {
      await db.collection('loans').doc(cleanId).set(docPayload, { merge: true });
    } catch (e) { }

    console.log(`⚡ [FirebaseSync] Saved Gold Loan /goldLoans/${cleanId} (Branch ${cleanBranch})`);
    logActivity('SAVE_GOLD_LOAN', 'gold', { loanId: cleanId, customerName: custName, branchCode: cleanBranch }).catch(() => {});
    return true;
  }

  /**
   * Delete Gold Loan from /goldLoans/{loanId} and broadcast to /deletedRecords
   */
  async function deleteGoldLoan(loanId, branchCode, deletedBy) {
    await init();
    if (!db) return false;

    const cleanId = String(loanId).trim();
    const branchInfo = getCurrentBranchInfo();
    const bCode = branchCode ? String(branchCode).padStart(2, '0') : branchInfo.branchCode;

    try {
      await db.collection('goldLoans').doc(cleanId).delete();
      try { await db.collection('loans').doc(cleanId).delete(); } catch(e){}
      
      await db.collection('deletedRecords').add({
        tableName: 'goldLoans',
        recordId: cleanId,
        branchCode: bCode,
        deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
        deletedAtIso: new Date().toISOString(),
        deletedBy: deletedBy || (auth.currentUser ? auth.currentUser.uid : 'staff')
      });
      console.log(`🗑️ [FirebaseSync] Deleted Gold Loan /goldLoans/${cleanId}`);
      logActivity('DELETE_GOLD_LOAN', 'gold', { loanId: cleanId, branchCode: bCode }).catch(() => {});
      return true;
    } catch (e) {
      console.error("[FirebaseSync] Error deleting Gold loan:", e);
      return false;
    }
  }

  /**
   * Save OD Against FD Loan into /odLoans/{odId}
   */
  async function saveODLoan(odData) {
    await init();
    if (!db) throw new Error("Firestore not initialized.");

    const rawId = odData.id || odData.accountNo || odData.formNo || odData.odNo || ('OD_' + Date.now());
    const cleanId = String(rawId).replace(/[\/\\]/g, '_').trim();

    const branchInfo = getCurrentBranchInfo();
    const rawBranch = odData.branchCode || odData.branch || branchInfo.branchCode;
    const cleanBranch = String(rawBranch).replace(/\D/g, '').padStart(2, '0') || '99';

    const payload = odData.data || odData.payload || odData;
    const custName = odData.customerName || payload.customerName || 'UNNAMED';
    const custId = odData.customerId || payload.customerId || '';
    const amount = odData.amount || payload.odLimit || payload.loanAmount || '0';

    const nowIso = new Date().toISOString();
    const docPayload = {
      id: cleanId,
      branchCode: cleanBranch,
      status: odData.status || 'ACTIVE',
      customerName: custName,
      customerId: custId,
      amount: amount,
      payload: payload,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAtIso: nowIso,
      createdBy: auth.currentUser ? auth.currentUser.uid : 'staff'
    };

    if (!odData.createdAt) {
      docPayload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('odLoans').doc(cleanId).set(docPayload, { merge: true });
    console.log(`⚡ [FirebaseSync] Saved OD Loan /odLoans/${cleanId} (Branch ${cleanBranch})`);
    logActivity('SAVE_OD_LOAN', 'od', { odId: cleanId, customerName: custName, branchCode: cleanBranch }).catch(() => {});
    return true;
  }

  /**
   * Delete OD Loan from /odLoans/{odId} and broadcast to /deletedRecords
   */
  async function deleteODLoan(odId, branchCode, deletedBy) {
    await init();
    if (!db) return false;

    const cleanId = String(odId).trim();
    const branchInfo = getCurrentBranchInfo();
    const bCode = branchCode ? String(branchCode).padStart(2, '0') : branchInfo.branchCode;

    try {
      await db.collection('odLoans').doc(cleanId).delete();
      await db.collection('deletedRecords').add({
        tableName: 'odLoans',
        recordId: cleanId,
        branchCode: bCode,
        deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
        deletedAtIso: new Date().toISOString(),
        deletedBy: deletedBy || (auth.currentUser ? auth.currentUser.uid : 'staff')
      });
      console.log(`🗑️ [FirebaseSync] Deleted OD Loan /odLoans/${cleanId}`);
      logActivity('DELETE_OD_LOAN', 'od', { odId: cleanId, branchCode: bCode }).catch(() => {});
      return true;
    } catch (e) {
      console.error("[FirebaseSync] Error deleting OD loan:", e);
      return false;
    }
  }

  // =========================================================================
  // MASTER & AUDIT HELPERS
  // =========================================================================

  /**
   * Log Branch Activity into /branchActivity
   */
  async function logActivity(action, module, details) {
    try {
      await init();
      if (!db) return;
      const branchInfo = getCurrentBranchInfo();
      await db.collection('branchActivity').add({
        action: action,
        module: module || 'portal',
        branchCode: branchInfo.branchCode,
        branchName: branchInfo.branchName,
        details: details || {},
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        timestampIso: new Date().toISOString(),
        userId: auth.currentUser ? auth.currentUser.uid : 'staff'
      });
    } catch (e) { }
  }

  /**
   * Fetch master branches list from /branches
   */
  async function getBranches() {
    await init();
    if (!db) return [];
    try {
      const snap = await db.collection('branches').get();
      const list = [];
      snap.forEach(doc => {
        list.push({ branchCode: doc.id, ...doc.data() });
      });
      return list;
    } catch (e) {
      return [];
    }
  }

  /**
   * Seed / Save branches to /branches
   */
  async function saveBranches(branchesList) {
    await init();
    if (!db || !Array.isArray(branchesList)) return;
    const batch = db.batch();
    branchesList.forEach(b => {
      const code = String(b.code || b.branchCode || '01').padStart(2, '0');
      const ref = db.collection('branches').doc(code);
      batch.set(ref, {
        branchCode: code,
        name: b.name || b.branchName || `Branch ${code}`,
        shortName: b.shortName || code,
        isActive: b.isActive !== false,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });
    await batch.commit();
  }

  // =========================================================================
  // SEAMLESS NEON TO FIRESTORE MIGRATION UTILITY
  // =========================================================================

  /**
   * Live Migration Utility: reads existing records from Neon and writes them directly into Firestore
   */
  async function migrateNeonToFirestore(customNeonConnStr, onProgress) {
    await init();
    if (!db) throw new Error("Firestore is not initialized.");

    const connStr = customNeonConnStr || (window.PostgresSync && window.PostgresSync.config && window.PostgresSync.config.neonConnString) || "postgresql://neondb_owner:npg_kF5qI9QzSacN@ep-floral-frog-b3s0jrlo-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

    const report = {
      goldLoans: 0,
      fdForms: 0,
      odLoans: 0,
      branches: 0,
      errors: []
    };

    const runSql = async (sql, params = []) => {
      if (window.PostgresSync && typeof window.PostgresSync.runNeonQuery === 'function') {
        return window.PostgresSync.runNeonQuery(sql, params, connStr);
      }
      const match = connStr.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
      if (!match) throw new Error("Invalid Neon connection string format.");
      const host = match[3];
      const resp = await fetch(`https://${host}/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': connStr
        },
        body: JSON.stringify({ query: sql, params: params })
      });
      return resp.json();
    };

    if (typeof onProgress === 'function') onProgress("Starting migration from Neon PostgreSQL to Firebase Firestore...");

    // 1. Migrate Gold Loans
    try {
      if (typeof onProgress === 'function') onProgress("Fetching Gold Loans from Neon...");
      const goldRes = await runSql("SELECT id, branch_code, loan_no, customer_name, customer_id, sanction_amount, data, created_at, updated_at FROM jccb_gold_loans;");
      const goldRows = (goldRes && goldRes.rows) || [];
      if (typeof onProgress === 'function') onProgress(`Found ${goldRows.length} Gold Loans in Neon. Writing to Firestore /goldLoans...`);
      
      for (const row of goldRows) {
        const id = String(row.id || row.loan_no);
        const bCode = String(row.branch_code || '99').padStart(2, '0');
        const payload = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
        await db.collection('goldLoans').doc(id).set({
          id: id,
          branchCode: bCode,
          status: 'ACTIVE',
          customerName: row.customer_name || payload.customerName || 'UNNAMED',
          customerId: row.customer_id || payload.customerId || '',
          amount: row.sanction_amount || payload.loanAmount || '0',
          payload: payload,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAtIso: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
        }, { merge: true });
        report.goldLoans++;
      }
    } catch (e) {
      report.errors.push(`Gold Loans migration: ${e.message}`);
    }

    // 2. Migrate FD Forms
    try {
      if (typeof onProgress === 'function') onProgress("Fetching FD Forms from Neon...");
      const fdRes = await runSql("SELECT id, branch_code, form_no, customer_name, customer_id, deposit_scheme, deposit_amount, roi, tenure, data, created_at, updated_at FROM jccb_fd_forms;");
      const fdRows = (fdRes && fdRes.rows) || [];
      if (typeof onProgress === 'function') onProgress(`Found ${fdRows.length} FD Forms in Neon. Writing to Firestore /fdForms...`);

      for (const row of fdRows) {
        const id = String(row.id || row.form_no);
        const bCode = String(row.branch_code || '99').padStart(2, '0');
        const payload = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
        await db.collection('fdForms').doc(id).set({
          id: id,
          branchCode: bCode,
          status: 'ACTIVE',
          customerName: row.customer_name || (payload && payload.firstFullName) || 'UNNAMED',
          customerId: row.customer_id || (payload && payload.firstCustomerId) || 'TJCCB',
          depositScheme: row.deposit_scheme || (payload && payload.typeOfDeposit) || 'FIXED DEPOSIT (FD)',
          amount: row.deposit_amount || (payload && payload.deposit1Amount) || '0',
          roi: row.roi || (payload && payload.deposit1Roi) || '0.00',
          tenure: row.tenure || '',
          payload: payload,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAtIso: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
        }, { merge: true });
        report.fdForms++;
      }
    } catch (e) {
      report.errors.push(`FD Forms migration: ${e.message}`);
    }

    // 3. Migrate OD Loans
    try {
      if (typeof onProgress === 'function') onProgress("Fetching OD Loans from Neon...");
      const odRes = await runSql("SELECT id, branch_code, account_no, customer_name, customer_id, od_limit, data, created_at, updated_at FROM jccb_od_loans;");
      const odRows = (odRes && odRes.rows) || [];
      if (typeof onProgress === 'function') onProgress(`Found ${odRows.length} OD Loans in Neon. Writing to Firestore /odLoans...`);

      for (const row of odRows) {
        const id = String(row.id || row.account_no);
        const bCode = String(row.branch_code || '99').padStart(2, '0');
        const payload = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
        await db.collection('odLoans').doc(id).set({
          id: id,
          branchCode: bCode,
          status: 'ACTIVE',
          customerName: row.customer_name || payload.customerName || 'UNNAMED',
          customerId: row.customer_id || payload.customerId || '',
          amount: row.od_limit || payload.odLimit || '0',
          payload: payload,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAtIso: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
        }, { merge: true });
        report.odLoans++;
      }
    } catch (e) {
      report.errors.push(`OD Loans migration: ${e.message}`);
    }

    if (typeof onProgress === 'function') {
      onProgress(`Migration finished! Gold Loans: ${report.goldLoans}, FD Forms: ${report.fdForms}, OD Loans: ${report.odLoans}`);
    }

    return report;
  }

  // =========================================================================
  // PUBLIC API EXPORT
  // =========================================================================
  return {
    config: FIREBASE_CONFIG,
    init: init,
    getCurrentBranchInfo: getCurrentBranchInfo,
    onConnectionChange: (cb) => { if (typeof cb === 'function') connectionListeners.push(cb); },
    get isOnline() { return isOnline; },

    // Subscriptions
    subscribeToFDForms: subscribeToFDForms,
    subscribeToGoldLoans: subscribeToGoldLoans,
    subscribeToODLoans: subscribeToODLoans,
    subscribeToDeletedRecords: subscribeToDeletedRecords,

    // Writes
    saveFDForm: saveFDForm,
    deleteFDForm: deleteFDForm,
    saveGoldLoan: saveGoldLoan,
    deleteGoldLoan: deleteGoldLoan,
    saveODLoan: saveODLoan,
    deleteODLoan: deleteODLoan,

    // Masters & Audit
    logActivity: logActivity,
    getBranches: getBranches,
    saveBranches: saveBranches,

    // Migration
    migrateNeonToFirestore: migrateNeonToFirestore
  };
}));
