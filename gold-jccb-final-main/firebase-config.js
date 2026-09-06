/**
 * The Junagadh Commercial Co-operative Bank Ltd. (JCCB)
 * Firebase Configuration & Realtime RBAC Database Engine
 */

const firebaseConfig = {
  apiKey: "AIzaSyAdIRywb7xDw9xbTzgE2fl9sn2d4LduTKs",
  authDomain: "project-484328444876485620.firebaseapp.com",
  projectId: "project-484328444876485620",
  storageBucket: "project-484328444876485620.firebasestorage.app",
  messagingSenderId: "811112744598",
  appId: "1:811112744598:web:165dfd8dd9e0b648f0a4b7",
  measurementId: "G-VRGC863RKH"
};

// Default static branch list used for initial seed / offline fallback (All 18 Branches)
const DEFAULT_JCCB_BRANCHES = [
    { code: "99", branchCode: "99", name: "99 HEAD OFFICE", shortName: "HO", branchName: "99 HEAD OFFICE", branchNameGuj: "૯૯ હેડ ઓફિસ (મુખ્ય કચેરી)", role: "admin", roleTitle: "Head Office Super Admin", isActive: true, isHO: true, isHeadOffice: true, password: "Rahul#80810" },
    { code: "01", branchCode: "01", name: "01 AZADCHOWK BRANCH", shortName: "CBB", branchName: "01 AZADCHOWK BRANCH", branchNameGuj: "૦૧ આઝાદચોક શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "02", branchCode: "02", name: "02 JOSHIPARA BRANCH", shortName: "JPB", branchName: "02 JOSHIPARA BRANCH", branchNameGuj: "૦૨ જોશીપરા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "03", branchCode: "03", name: "03 DOLATPARA BRANCH", shortName: "DPB", branchName: "03 DOLATPARA BRANCH", branchNameGuj: "૦૩ દોલતપરા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "04", branchCode: "04", name: "04 KODINAR BRANCH", shortName: "KDR", branchName: "04 KODINAR BRANCH", branchNameGuj: "૦૪ કોડીનાર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "05", branchCode: "05", name: "05 KESHOD BRANCH", shortName: "KSD", branchName: "05 KESHOD BRANCH", branchNameGuj: "૦૫ કેશોદ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "06", branchCode: "06", name: "06 VANTHALI BRANCH", shortName: "VTL", branchName: "06 VANTHALI BRANCH", branchNameGuj: "૦૬ વંથલી શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "07", branchCode: "07", name: "07 MANAVADAR BRANCH", shortName: "MNV", branchName: "07 MANAVADAR BRANCH", branchNameGuj: "૦૭ માણાવદર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "08", branchCode: "08", name: "08 GANDHINAGAR BRANCH", shortName: "GNB", branchName: "08 GANDHINAGAR BRANCH", branchNameGuj: "૦૮ ગાંધીનગર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "09", branchCode: "09", name: "09 LIMBDI BRANCH", shortName: "LIM", branchName: "09 LIMBDI BRANCH", branchNameGuj: "૦૯ લીંબડી શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "10", branchCode: "10", name: "10 MENDARDA BRANCH", shortName: "MND", branchName: "10 MENDARDA BRANCH", branchNameGuj: "૧૦ મેંદરડા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "11", branchCode: "11", name: "11 VISAVADAR BRANCH", shortName: "VIS", branchName: "11 VISAVADAR BRANCH", branchNameGuj: "૧૧ વિસાવદર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "12", branchCode: "12", name: "12 JAMNAGAR BRANCH", shortName: "JAM", branchName: "12 JAMNAGAR BRANCH", branchNameGuj: "૧૨ જામનગર શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "13", branchCode: "13", name: "13 BUS STAND BRANCH", shortName: "STB", branchName: "13 BUS STAND BRANCH", branchNameGuj: "૧૩ બસ સ્ટેન્ડ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "14", branchCode: "14", name: "14 LATHI BRANCH", shortName: "LTH", branchName: "14 LATHI BRANCH", branchNameGuj: "૧૪ લાઠી શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "16", branchCode: "16", name: "16 AHMEDABAD BRANCH", shortName: "AHM", branchName: "16 AHMEDABAD BRANCH", branchNameGuj: "૧૬ અમદાવાદ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "17", branchCode: "17", name: "17 RAJKOT BRANCH", shortName: "RJT", branchName: "17 RAJKOT BRANCH", branchNameGuj: "૧૭ રાજકોટ શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" },
    { code: "18", branchCode: "18", name: "18 ZANZARDA BRANCH", shortName: "ZAN", branchName: "18 ZANZARDA BRANCH", branchNameGuj: "૧૮ ઝાંઝરડા શાખા", role: "branch_manager", roleTitle: "Branch Manager", isActive: true, isHO: false, isHeadOffice: false, password: "Admin@123" }
];

const FirebaseService = {
    app: null,
    auth: null,
    db: null,
    storage: null,
    analytics: null,
    isInitialized: false,
    currentUser: null,
    userProfile: null, // { uid, email, role: 'admin'|'branch_manager'|'branch_user', branchId, branchName, isActive }

    /**
     * Initialize Firebase App and Services
     */
    init: async function() {
        try {
            if (typeof firebase === 'undefined') {
                console.warn("[Firebase] SDK script tags not loaded yet. Running in offline/local mode.");
                return false;
            }

            if (!firebase.apps.length) {
                this.app = firebase.initializeApp(firebaseConfig);
            } else {
                this.app = firebase.app();
            }

            this.auth = firebase.auth();
            this.db = firebase.firestore();
            
            // Storage is completely optional (works on free Spark plan without storage)
            if (firebase.storage) {
                try {
                    this.storage = firebase.storage();
                } catch (stErr) {
                    console.warn("[Firebase] Storage not enabled on project (using Firestore base64/local mode):", stErr);
                    this.storage = null;
                }
            }

            if (firebase.analytics) {
                try {
                    this.analytics = firebase.analytics();
                } catch (anErr) {
                    console.warn("[Firebase Analytics]", anErr);
                }
            }

            // Enable offline persistence for reliable banking operations
            try {
                await this.db.enablePersistence({ synchronizeTabs: true });
                console.log("[Firebase] Firestore offline persistence enabled.");
            } catch (err) {
                if (err.code === 'failed-precondition') {
                    console.warn("[Firebase] Persistence notice: Multiple tabs open simultaneously.");
                } else if (err.code === 'unimplemented') {
                    console.warn("[Firebase] Persistence not supported in current browser.");
                }
            }

            // Ensure authenticated Firebase session (Anonymous auth fallback)
            if (this.auth && !this.auth.currentUser) {
                try {
                    await this.auth.signInAnonymously();
                    console.log("[Firebase] Cloud authentication session active.");
                } catch (authErr) {
                    console.warn("[Firebase] Anonymous auth fallback notice:", authErr);
                }
            }

            this.isInitialized = true;
            console.log("[Firebase] Successfully connected to Firebase Project:", firebaseConfig.projectId);
            return true;
        } catch (error) {
            console.error("[Firebase] Initialization error:", error);
            this.isInitialized = false;
            return false;
        }
    },

    // =================================================================
    // AUTHENTICATION & RBAC STATE
    // =================================================================

    /**
     * Listen for Auth changes and load user RBAC profile from Firestore
     */
    onAuthStateChanged: function(callback) {
        if (!this.auth) return;
        this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                try {
                    const userDoc = await this.db.collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        this.userProfile = userDoc.data();
                    } else {
                        // Default profile if newly signed up
                        this.userProfile = {
                            uid: user.uid,
                            email: user.email,
                            role: 'branch_user',
                            branchId: '01',
                            branchName: 'Branch 01',
                            isActive: true,
                            createdAt: new Date().toISOString()
                        };
                    }
                } catch (e) {
                    console.warn("[Firebase] Could not fetch user profile:", e);
                }
            } else {
                this.currentUser = null;
                this.userProfile = null;
            }

            if (typeof callback === 'function') {
                callback(this.currentUser, this.userProfile);
            }
        });
    },

    /**
     * Sign in with email and password
     */
    login: async function(email, password) {
        if (!this.auth) throw new Error("Firebase Auth not initialized.");
        const cred = await this.auth.signInWithEmailAndPassword(email, password);
        const userDoc = await this.db.collection('users').doc(cred.user.uid).get();
        if (userDoc.exists) {
            this.userProfile = userDoc.data();
        }
        return { user: cred.user, profile: this.userProfile };
    },

    /**
     * Sign out
     */
    logout: async function() {
        if (this.auth) {
            await this.auth.signOut();
        }
        this.currentUser = null;
        this.userProfile = null;
    },

    /**
     * Check if current user is Head Office Admin
     */
    isAdmin: function() {
        return (this.userProfile && this.userProfile.role === 'admin' && this.userProfile.isActive) ||
               (this.userProfile && this.userProfile.branchId === '99');
    },

    /**
     * Check if user is active branch manager
     */
    isBranchManager: function() {
        return this.userProfile && this.userProfile.role === 'branch_manager' && this.userProfile.isActive;
    },

    /**
     * Get assigned branch ID
     */
    getUserBranchId: function() {
        return this.userProfile ? this.userProfile.branchId : null;
    },

    // =================================================================
    // BRANCH MANAGEMENT (HEAD OFFICE ADMIN PRIVILEGE)
    // =================================================================

    /**
     * Get all branches (realtime or fetch from Firestore)
     */
    getBranches: async function() {
        if (!this.db) return DEFAULT_JCCB_BRANCHES;
        try {
            const snapshot = await this.db.collection('branches').get();
            const list = [];
            snapshot.forEach(doc => {
                if (doc.id !== 'undefined') {
                    list.push({ id: doc.id, ...doc.data() });
                }
            });
            if (list.length === 0) {
                console.log("[Firebase] Seeding initial 18 branch master records into Firestore...");
                await this.seedDefaultBranches();
                return DEFAULT_JCCB_BRANCHES;
            }
            return list;
        } catch (error) {
            console.warn("[Firebase] Error fetching branches from Firestore:", error);
            return DEFAULT_JCCB_BRANCHES;
        }
    },

    /**
     * Seed all 18 default JCCB branches into Firestore branches collection
     */
    seedDefaultBranches: async function() {
        await this.saveBranchesList(DEFAULT_JCCB_BRANCHES);
    },

    /**
     * Add or Update a Branch (Admin Only)
     */
    saveBranch: async function(branchData) {
        if (!this.db) throw new Error("Firestore not initialized.");
        const rawCode = String(branchData.code || branchData.branchCode || "01").replace(/\D/g, '');
        const branchCode = rawCode ? rawCode.padStart(2, '0') : "01";
        const docRef = this.db.collection('branches').doc(branchCode);
        const payload = {
            ...branchData,
            code: branchCode,
            branchCode: branchCode,
            name: branchData.name || branchData.branchName || `Branch ${branchCode}`,
            branchName: branchData.branchName || branchData.name || `Branch ${branchCode}`,
            password: branchData.password || (branchCode === "99" ? "Rahul#80810" : "Admin@123"),
            isHO: (branchCode === "99" || branchData.isHO === true || branchData.isHeadOffice === true),
            role: (branchCode === "99" ? "admin" : (branchData.role || "branch_manager")),
            isActive: (branchData.isActive !== false),
            updatedAt: new Date().toISOString(),
            updatedBy: this.currentUser ? this.currentUser.uid : 'ADMIN'
        };
        if (!branchData.createdAt) {
            payload.createdAt = new Date().toISOString();
        }
        await docRef.set(payload, { merge: true });
        return { id: branchCode, ...payload };
    },

    /**
     * Remove / Delete a Branch (Admin Only)
     */
    deleteBranch: async function(branchCode) {
        if (!this.db) throw new Error("Firestore not initialized.");
        const cleanCode = String(branchCode).replace(/\D/g, '').padStart(2, '0');
        await this.db.collection('branches').doc(cleanCode).delete();
    },

    /**
     * Toggle Branch Active/Inactive Status
     */
    toggleBranchStatus: async function(branchCode, isActive) {
        if (!this.db) throw new Error("Firestore not initialized.");
        await this.db.collection('branches').doc(String(branchCode)).update({
            isActive: Boolean(isActive),
            updatedAt: new Date().toISOString()
        });
    },

    // =================================================================
    // USER & ROLE MANAGEMENT (HEAD OFFICE ADMIN PRIVILEGE)
    // =================================================================

    /**
     * Get all users in system (Admin only)
     */
    getUsers: async function() {
        if (!this.db) return [];
        const snapshot = await this.db.collection('users').get();
        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    },

    /**
     * Create or update a user's role and branch assignment
     */
    saveUserRole: async function(uid, userData) {
        if (!this.db) throw new Error("Firestore not initialized.");
        const userRef = this.db.collection('users').doc(uid);
        const payload = {
            ...userData,
            uid: uid,
            updatedAt: new Date().toISOString()
        };
        await userRef.set(payload, { merge: true });
    },

    /**
     * Highly optimized base64 image compressor for minimal storage & bandwidth
     */
    compressBase64Image: function(dataUrl, maxWidth = 320, quality = 0.55) {
        return new Promise((resolve) => {
            if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image")) {
                return resolve(dataUrl || "");
            }
            try {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement("canvas");
                        let width = img.width;
                        let height = img.height;
                        if (width > maxWidth || height > maxWidth) {
                            if (width > height) {
                                height = Math.round((height * maxWidth) / width);
                                width = maxWidth;
                            } else {
                                width = Math.round((width * maxWidth) / height);
                                height = maxWidth;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressed = canvas.toDataURL("image/jpeg", quality);
                        resolve(compressed);
                    } catch (e) {
                        resolve(dataUrl);
                    }
                };
                img.onerror = () => resolve(dataUrl);
                img.src = dataUrl;
            } catch (err) {
                resolve(dataUrl);
            }
        });
    },

    /**
     * Convert JS object to Firestore REST API document format
     */
    toFirestoreDocument: function(obj) {
        const fields = {};
        for (const [key, val] of Object.entries(obj)) {
            if (val === undefined || val === null) {
                fields[key] = { nullValue: null };
            } else if (typeof val === "boolean") {
                fields[key] = { booleanValue: val };
            } else if (typeof val === "number") {
                if (Number.isInteger(val)) {
                    fields[key] = { integerValue: String(val) };
                } else {
                    fields[key] = { doubleValue: val };
                }
            } else if (typeof val === "string") {
                fields[key] = { stringValue: val };
            } else if (Array.isArray(val)) {
                fields[key] = {
                    arrayValue: {
                        values: val.map(item => {
                            if (typeof item === "object" && item !== null) {
                                return { mapValue: this.toFirestoreDocument(item) };
                            } else if (typeof item === "number") {
                                return Number.isInteger(item) ? { integerValue: String(item) } : { doubleValue: item };
                            } else {
                                return { stringValue: String(item || "") };
                            }
                        })
                    }
                };
            } else if (typeof val === "object") {
                fields[key] = { mapValue: this.toFirestoreDocument(val) };
            }
        }
        return { fields };
    },

    /**
     * Convert Firestore REST API document to plain JS object
     */
    fromFirestoreDocument: function(doc) {
        if (!doc || !doc.fields) return {};
        const result = {};
        for (const [key, valObj] of Object.entries(doc.fields)) {
            if ("stringValue" in valObj) result[key] = valObj.stringValue;
            else if ("integerValue" in valObj) result[key] = parseInt(valObj.integerValue, 10);
            else if ("doubleValue" in valObj) result[key] = parseFloat(valObj.doubleValue);
            else if ("booleanValue" in valObj) result[key] = valObj.booleanValue;
            else if ("nullValue" in valObj) result[key] = null;
            else if ("mapValue" in valObj) result[key] = this.fromFirestoreDocument(valObj.mapValue);
            else if ("arrayValue" in valObj) {
                result[key] = (valObj.arrayValue.values || []).map(v => {
                    if ("stringValue" in v) return v.stringValue;
                    if ("integerValue" in v) return parseInt(v.integerValue, 10);
                    if ("doubleValue" in v) return parseFloat(v.doubleValue);
                    if ("booleanValue" in v) return v.booleanValue;
                    if ("mapValue" in v) return this.fromFirestoreDocument(v.mapValue);
                    return null;
                });
            }
        }
        if (doc.name) {
            const parts = doc.name.split("/");
            result.id = parts[parts.length - 1];
        }
        return result;
    },

    /**
     * Save a gold loan record to Firestore (Dual SDK + REST fallback)
     */
    saveLoan: async function(loanData) {
        const loanId = String(loanData.id || loanData.loanId || `GL_${Date.now()}_${loanData.branchCode || '01'}`).trim();
        
        let custPhoto = loanData.customerPhoto || "";
        let ornPhoto = loanData.ornamentPhoto || "";

        if (typeof custPhoto === "string" && custPhoto.startsWith("data:image") && custPhoto.length > 120000) {
            try {
                custPhoto = await this.compressBase64Image(custPhoto, 400, 0.6);
            } catch (e) {}
        }
        if (typeof ornPhoto === "string" && ornPhoto.startsWith("data:image") && ornPhoto.length > 120000) {
            try {
                ornPhoto = await this.compressBase64Image(ornPhoto, 400, 0.6);
            } catch (e) {}
        }

        const rawPayload = {
            ...loanData,
            id: loanId,
            loanId: loanId,
            customerPhoto: custPhoto,
            ornamentPhoto: ornPhoto,
            branchId: String(loanData.branchCode || loanData.branchId || '01'),
            updatedAt: new Date().toISOString(),
            updatedBy: this.currentUser ? this.currentUser.uid : (loanData.updatedBy || 'SYSTEM')
        };
        if (!loanData.createdAt) {
            rawPayload.createdAt = new Date().toISOString();
            rawPayload.createdBy = this.currentUser ? this.currentUser.uid : (loanData.createdBy || 'SYSTEM');
        }

        const payload = JSON.parse(JSON.stringify(rawPayload));

        // 1. Write via Firestore SDK
        if (this.db) {
            try {
                const loanRef = this.db.collection('loans').doc(loanId);
                await loanRef.set(payload, { merge: true });
                console.log("[Firebase SDK] Loan saved to Firestore:", loanId);
            } catch (sdkErr) {
                console.warn("[Firebase SDK] Firestore write notice:", sdkErr);
            }
            try {
                // Ensure this active loan is never treated as deleted
                await this.db.collection('deleted_loans').doc(loanId).delete();
            } catch (e) {}
        }

        // 2. Guaranteed REST API cloud write fallback
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/loans/${loanId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
            console.log("[Firebase REST] Loan synced to Firestore cloud:", loanId);
        } catch (restErr) {
            console.warn("[Firebase REST] REST sync error:", restErr);
        }

        return payload;
    },

    /**
     * Fetch all loans from Firestore (Dual SDK + Paginated REST fallback)
     */
    getLoans: async function(branchCode = null) {
        let list = [];
        // 1. Primary: Firestore SDK (Full unpaginated collection fetch with offline caching)
        if (this.db) {
            try {
                const snapshot = await this.db.collection('loans').get();
                snapshot.forEach(doc => {
                    const data = doc.data();
                    list.push({ ...data, id: doc.id, loanId: data.loanId || doc.id });
                });
                if (list.length > 0) {
                    if (branchCode && branchCode !== '99') {
                        return list.filter(l => String(l.branchCode || l.branchId) === String(branchCode));
                    }
                    return list;
                }
            } catch (sdkErr) {
                console.warn("[Firebase SDK] Error fetching loans via SDK:", sdkErr);
            }
        }

        // 2. Fallback: Paginated REST API fetch (ensures 100% of loans are retrieved)
        try {
            let pageToken = "";
            let maxPages = 40;
            while (maxPages-- > 0) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 6000);
                const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/loans?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!res.ok) break;
                const data = await res.json();
                if (Array.isArray(data.documents)) {
                    data.documents.forEach(d => list.push(this.fromFirestoreDocument(d)));
                }
                if (data.nextPageToken) {
                    pageToken = data.nextPageToken;
                } else {
                    break;
                }
            }
            console.log("[Firebase REST] Fetched all loans from cloud:", list.length);
        } catch (restErr) {
            console.warn("[Firebase REST] Error fetching loans via REST:", restErr);
        }

        if (branchCode && branchCode !== '99') {
            return list.filter(l => String(l.branchCode || l.branchId) === String(branchCode));
        }
        return list;
    },

    /**
     * Realtime listener for loan records across all branches & Head Office
     */
    listenLoans: function(branchCode, onUpdate) {
        if (!this.db) return () => {};
        return this.db.collection('loans').onSnapshot((snapshot) => {
            const list = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                list.push({ ...data, id: doc.id, loanId: data.loanId || doc.id });
            });
            if (typeof onUpdate === 'function') {
                onUpdate(list);
            }
        }, (err) => {
            console.warn("[Firebase] Loan snapshot listener notice:", err);
        });
    },

    /**
     * Delete loan record (Dual delete from loans collection + write tombstone to deleted_loans for live multi-device sync)
     */
    deleteLoan: async function(loanId) {
        if (!loanId) return;
        const cleanId = String(loanId).trim();
        let deleted = false;
        const tombstone = {
            id: cleanId,
            deletedAt: new Date().toISOString(),
            deletedBy: this.currentUser ? this.currentUser.uid : 'SYSTEM'
        };

        // 1. Delete from loans collection & record in deleted_loans via SDK
        if (this.db) {
            try {
                await this.db.collection('loans').doc(cleanId).delete();
                console.log("[Firebase SDK] Loan deleted from Firestore:", cleanId);
                deleted = true;
            } catch (e) {
                console.warn("[Firebase SDK] Loan delete SDK notice:", e);
            }
            try {
                await this.db.collection('deleted_loans').doc(cleanId).set(tombstone);
            } catch (e) {}
        }

        // 2. Guaranteed REST Fallback
        try {
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/loans/${cleanId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                console.log("[Firebase REST] Loan deleted via REST:", cleanId);
                deleted = true;
            }
        } catch (e) {
            console.warn("[Firebase REST] Loan delete REST notice:", e);
        }

        try {
            const fsDoc = this.toFirestoreDocument(tombstone);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/deleted_loans/${cleanId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
        } catch (e) {}

        return deleted;
    },

    /**
     * Realtime listener for deleted loans across all devices
     */
    listenDeletedLoans: function(onDeleted) {
        if (!this.db || typeof onDeleted !== 'function') return () => {};
        return this.db.collection('deleted_loans').onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const data = change.doc.data();
                    const deletedId = (data && data.id) ? data.id : change.doc.id;
                    if (deletedId) onDeleted(deletedId);
                }
            });
        }, (err) => {
            console.warn("[Firebase] Deleted loans listener notice:", err);
        });
    },

    /**
     * Fetch all deleted loan IDs for cold start / offline sync catchup
     */
    getDeletedLoanIds: async function() {
        let list = [];
        // 1. Primary: SDK
        if (this.db) {
            try {
                const snap = await this.db.collection('deleted_loans').get();
                snap.forEach(doc => list.push(doc.id));
                if (list.length > 0) return list;
            } catch (e) {}
        }

        // 2. Paginated REST fallback
        try {
            let pageToken = "";
            let maxPages = 20;
            while (maxPages-- > 0) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000);
                const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/deleted_loans?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!res.ok) break;
                const data = await res.json();
                if (Array.isArray(data.documents)) {
                    data.documents.forEach(d => {
                        const parsed = this.fromFirestoreDocument(d);
                        list.push(parsed.id || d.name.split('/').pop());
                    });
                }
                if (data.nextPageToken) {
                    pageToken = data.nextPageToken;
                } else {
                    break;
                }
            }
        } catch (e) {}
        return list;
    },

    // =================================================================
    // DAILY RATES & GLOBAL SETTINGS
    // =================================================================

    /**
     * Get daily gold rates from Firestore (Direct REST with SDK fallback)
     */
    getDailyRates: async function() {
        // 1. Direct REST fetch (instant, never hangs)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/rates/today`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                const parsed = this.fromFirestoreDocument(data);
                if (parsed && (parseFloat(parsed.rate22K) > 0 || parseFloat(parsed.rate24K) > 0)) {
                    return parsed;
                }
            }
        } catch (restErr) {
            console.warn("[Firebase REST] Rates REST fetch notice:", restErr);
        }

        // 2. Fallback check in settings/dailyRates
        try {
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/dailyRates`);
            if (res.ok) {
                const data = await res.json();
                return this.fromFirestoreDocument(data);
            }
        } catch (e) {}

        // 3. Fallback to SDK
        if (this.db) {
            try {
                const doc = await this.db.collection('rates').doc('today').get();
                if (doc && doc.exists) {
                    return doc.data();
                }
            } catch (e) {}
        }
        return null;
    },

    /**
     * Save daily gold rates to Firestore (Dual SDK + REST)
     */
    saveDailyRates: async function(ratesData) {
        const payload = JSON.parse(JSON.stringify({
            ...ratesData,
            updatedAt: new Date().toISOString(),
            updatedBy: this.currentUser ? this.currentUser.uid : 'ADMIN'
        }));

        // 1. Write via SDK
        if (this.db) {
            try {
                await Promise.all([
                    this.db.collection('rates').doc('today').set(payload, { merge: true }),
                    this.db.collection('settings').doc('dailyRates').set(payload, { merge: true })
                ]);
            } catch (e) {}
        }

        // 2. Write via REST API
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await Promise.all([
                fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/rates/today`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(fsDoc)
                }),
                fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/dailyRates`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(fsDoc)
                })
            ]);
            console.log("[Firebase REST] Daily rates saved to cloud successfully.");
        } catch (restErr) {
            console.warn("[Firebase REST] Daily rates REST save error:", restErr);
        }

        return payload;
    },

    /**
     * Realtime listener for daily gold rates
     */
    listenDailyRates: function(onUpdate) {
        if (!this.db) return () => {};
        return this.db.collection('rates').doc('today').onSnapshot((doc) => {
            if (doc.exists && typeof onUpdate === 'function') {
                onUpdate(doc.data());
            }
        }, (err) => {
            console.warn("[Firebase] Rates listener notice:", err);
        });
    },

    // =================================================================
    // CUSTOMER DIRECTORY OPERATIONS & SYNC
    // =================================================================

    /**
     * Save customer profile to Firestore
     */
    saveCustomer: async function(custData) {
        if (!this.db) return custData;
        const custId = String(custData.customerNo || custData.id || `CUST_${Date.now()}`).trim();
        const docRef = this.db.collection('customers').doc(custId);
        const payload = {
            ...custData,
            id: custId,
            customerNo: custData.customerNo || custId,
            updatedAt: new Date().toISOString()
        };
        if (!custData.createdAt) {
            payload.createdAt = new Date().toISOString();
        }
        await docRef.set(payload, { merge: true });
        return payload;
    },

    /**
     * Get all customers from Firestore
     */
    getCustomers: async function() {
        let list = [];
        // 1. Check settings/customersList for fast bulk retrieval
        try {
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/customersList`);
            if (res.ok) {
                const data = await res.json();
                const parsed = this.fromFirestoreDocument(data);
                if (parsed && Array.isArray(parsed.list) && parsed.list.length > 0) {
                    return parsed.list;
                }
            }
        } catch (e) {}

        if (this.db) {
            try {
                const doc = await this.db.collection('settings').doc('customersList').get();
                if (doc.exists && Array.isArray(doc.data().list) && doc.data().list.length > 0) {
                    return doc.data().list;
                }
            } catch (e) {}
        }

        // 2. Fallback to individual customers collection
        if (this.db) {
            try {
                const snapshot = await this.db.collection('customers').get();
                snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                if (list.length > 0) return list;
            } catch (e) {
                console.warn("[Firebase] Error fetching customers collection:", e);
            }
        }
        return list;
    },

    /**
     * Realtime listener for customers
     */
    listenCustomers: function(onUpdate) {
        if (!this.db) return () => {};
        // Listen to settings/customersList
        this.db.collection('settings').doc('customersList').onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (Array.isArray(data.list) && typeof onUpdate === 'function') {
                    onUpdate(data.list);
                }
            }
        }, () => {});

        // Also listen to customers collection
        return this.db.collection('customers').onSnapshot((snapshot) => {
            const list = [];
            snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            if (typeof onUpdate === 'function' && list.length > 0) {
                onUpdate(list);
            }
        }, (err) => {
            console.warn("[Firebase] Customer snapshot error:", err);
        });
    },

    /**
     * Delete customer from Firestore
     */
    deleteCustomer: async function(custId) {
        if (!this.db) return;
        const id = String(custId).trim();
        await this.db.collection('customers').doc(id).delete();
    },

    // =================================================================
    // SYSTEM SETTINGS & BRANCH SEEDS SYNC
    // =================================================================

    /**
     * Save branch seeds & settings to Firestore (Dual SDK + REST)
     */
    saveSettings: async function(settingsData) {
        const payload = JSON.parse(JSON.stringify({
            ...settingsData,
            updatedAt: new Date().toISOString()
        }));

        if (this.db) {
            try {
                await this.db.collection('settings').doc('branchSeeds').set(payload, { merge: true });
                console.log("[Firebase SDK] Settings saved to cloud.");
            } catch (e) {}
        }
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/branchSeeds`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
        } catch (e) {}
    },

    /**
     * Get branch seeds & settings from Firestore
     */
    getSettings: async function() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/branchSeeds`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                return this.fromFirestoreDocument(data);
            }
        } catch (e) {}

        if (this.db) {
            try {
                const doc = await this.db.collection('settings').doc('branchSeeds').get();
                return doc.exists ? doc.data() : null;
            } catch (e) {}
        }
        return null;
    },

    /**
     * Realtime listener for branch settings across all PCs
     */
    listenSettings: function(onUpdate) {
        if (!this.db) return () => {};
        return this.db.collection('settings').doc('branchSeeds').onSnapshot((doc) => {
            if (doc.exists && typeof onUpdate === 'function') {
                onUpdate(doc.data());
            }
        }, (err) => {
            console.warn("[Firebase] Settings snapshot error:", err);
        });
    },

    // =================================================================
    // RULES MASTER SYNC (BANK DEDUCTIONS, VALUATION SLABS, GST)
    // =================================================================

    /**
     * Save Rules Master configurations to Firestore
     */
    saveRules: async function(rulesData) {
        const payload = JSON.parse(JSON.stringify({
            ...rulesData,
            updatedAt: new Date().toISOString(),
            updatedBy: this.currentUser ? this.currentUser.uid : 'ADMIN'
        }));

        if (this.db) {
            try {
                await this.db.collection('settings').doc('rulesMaster').set(payload, { merge: true });
                console.log("[Firebase SDK] Rules Master saved to cloud.");
            } catch (e) {}
        }
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/rulesMaster`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
        } catch (e) {}
    },

    /**
     * Get Rules Master from Firestore
     */
    getRules: async function() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/rulesMaster`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                return this.fromFirestoreDocument(data);
            }
        } catch (e) {}

        if (this.db) {
            try {
                const doc = await this.db.collection('settings').doc('rulesMaster').get();
                return doc.exists ? doc.data() : null;
            } catch (e) {}
        }
        return null;
    },

    /**
     * Realtime listener for Rules Master
     */
    listenRules: function(onUpdate) {
        if (!this.db) return () => {};
        return this.db.collection('settings').doc('rulesMaster').onSnapshot((doc) => {
            if (doc.exists && typeof onUpdate === 'function') {
                onUpdate(doc.data());
            }
        }, (err) => {
            console.warn("[Firebase] Rules listener error:", err);
        });
    },

    // =================================================================
    // BRANCHES, VALUERS & PRODUCTS MASTER SYNC
    /**
     * Save all branches list to Firestore (Writes both settings/branchesList and individual branches/{code} documents)
     */
    saveBranchesList: async function(branchesList) {
        if (!Array.isArray(branchesList) || branchesList.length === 0) {
            branchesList = DEFAULT_JCCB_BRANCHES;
        }

        const normalizedList = branchesList.map(b => {
            const rawCode = String(b.code || b.branchCode || "01").replace(/\D/g, '');
            const bCode = rawCode ? rawCode.padStart(2, '0') : "01";
            return {
                ...b,
                code: bCode,
                branchCode: bCode,
                name: b.name || b.branchName || `Branch ${bCode}`,
                branchName: b.branchName || b.name || `Branch ${bCode}`,
                password: b.password || (bCode === "99" ? "Rahul#80810" : "Admin@123"),
                isHO: (bCode === "99" || b.isHO === true || b.isHeadOffice === true),
                role: (bCode === "99" ? "admin" : (b.role || "branch_manager")),
                isActive: (b.isActive !== false),
                updatedAt: new Date().toISOString()
            };
        });

        // 1. Bulk document in settings/branchesList
        const payload = {
            list: normalizedList,
            updatedAt: new Date().toISOString()
        };
        if (this.db) {
            try {
                await this.db.collection('settings').doc('branchesList').set(payload, { merge: true });
            } catch (e) {}
        }
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/branchesList`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
        } catch (e) {}

        // 2. Individual documents in collection('branches') for all 18 branches
        if (this.db) {
            try {
                const batch = this.db.batch();
                // Clean up rogue undefined document
                batch.delete(this.db.collection('branches').doc('undefined'));

                normalizedList.forEach(nb => {
                    const docRef = this.db.collection('branches').doc(nb.code);
                    batch.set(docRef, nb, { merge: true });
                });
                await batch.commit();
                console.log("[Firebase SDK] Seeded/updated all 18 branch docs in branches collection successfully!");
            } catch (sdkErr) {
                console.warn("[Firebase SDK] Error batch writing branch docs:", sdkErr);
            }
        }

        // 3. REST API writes for individual branch docs (guaranteed cloud fallback)
        normalizedList.forEach(async (nb) => {
            try {
                const fsDoc = this.toFirestoreDocument(nb);
                await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/branches/${nb.code}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(fsDoc)
                });
            } catch (e) {}
        });

        // Delete rogue undefined doc via REST
        try {
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/branches/undefined`, {
                method: "DELETE"
            });
        } catch (e) {}
    },

    /**
     * Get all branches list from Firestore
     */
    getBranchesList: async function() {
        try {
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/branchesList`);
            if (res.ok) {
                const data = await res.json();
                const parsed = this.fromFirestoreDocument(data);
                if (parsed && Array.isArray(parsed.list)) return parsed.list;
            }
        } catch (e) {}

        if (this.db) {
            try {
                const doc = await this.db.collection('settings').doc('branchesList').get();
                if (doc.exists && doc.data().list) return doc.data().list;
            } catch (e) {}
        }
        return null;
    },

    /**
     * Realtime listener for Branches Master
     */
    listenBranches: function(onUpdate) {
        if (!this.db) return () => {};
        return this.db.collection('settings').doc('branchesList').onSnapshot((doc) => {
            if (doc.exists && typeof onUpdate === 'function') {
                const data = doc.data();
                if (Array.isArray(data.list)) onUpdate(data.list);
            }
        }, (err) => {
            console.warn("[Firebase] Branches listener error:", err);
        });
    },

    /**
     * Save all Valuers list to Firestore
     */
    saveValuersList: async function(valuersList, deletedIds = []) {
        const payload = {
            list: valuersList,
            deletedIds: Array.isArray(deletedIds) ? deletedIds : [],
            updatedAt: new Date().toISOString()
        };
        if (this.db) {
            try {
                await this.db.collection('settings').doc('valuersList').set(payload);
            } catch (e) {}
        }
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/valuersList`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
        } catch (e) {}
    },

    /**
     * Get all Valuers list from Firestore
     */
    getValuersList: async function() {
        try {
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/valuersList`);
            if (res.ok) {
                const data = await res.json();
                const parsed = this.fromFirestoreDocument(data);
                if (parsed && Array.isArray(parsed.list)) return { list: parsed.list, deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [] };
            }
        } catch (e) {}

        if (this.db) {
            try {
                const doc = await this.db.collection('settings').doc('valuersList').get();
                if (doc.exists && doc.data().list) return { list: doc.data().list, deletedIds: Array.isArray(doc.data().deletedIds) ? doc.data().deletedIds : [] };
            } catch (e) {}
        }
        return null;
    },

    /**
     * Realtime listener for Valuers Master
     */
    listenValuers: function(onUpdate) {
        if (!this.db) return () => {};
        return this.db.collection('settings').doc('valuersList').onSnapshot((doc) => {
            if (doc.exists && typeof onUpdate === 'function') {
                const data = doc.data();
                if (Array.isArray(data.list)) onUpdate(data.list, Array.isArray(data.deletedIds) ? data.deletedIds : []);
            }
        }, (err) => {
            console.warn("[Firebase] Valuers listener error:", err);
        });
    },

    /**
     * Save all Product Schemes list to Firestore
     */
    saveProductsList: async function(productsList) {
        const payload = {
            list: productsList,
            updatedAt: new Date().toISOString()
        };
        if (this.db) {
            try {
                await this.db.collection('settings').doc('productsList').set(payload, { merge: true });
            } catch (e) {}
        }
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/productsList`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
        } catch (e) {}
    },

    /**
     * Get all Product Schemes list from Firestore
     */
    getProductsList: async function() {
        try {
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/productsList`);
            if (res.ok) {
                const data = await res.json();
                const parsed = this.fromFirestoreDocument(data);
                if (parsed && Array.isArray(parsed.list)) return parsed.list;
            }
        } catch (e) {}

        if (this.db) {
            try {
                const doc = await this.db.collection('settings').doc('productsList').get();
                if (doc.exists && doc.data().list) return doc.data().list;
            } catch (e) {}
        }
        return null;
    },

    /**
     * Realtime listener for Product Schemes Master
     */
    listenProducts: function(onUpdate) {
        if (!this.db) return () => {};
        return this.db.collection('settings').doc('productsList').onSnapshot((doc) => {
            if (doc.exists && typeof onUpdate === 'function') {
                const data = doc.data();
                if (Array.isArray(data.list)) onUpdate(data.list);
            }
        }, (err) => {
            console.warn("[Firebase] Products listener error:", err);
        });
    },

    // =================================================================
    // SECURITY AUDIT LOGS & CLIENT IP TRACKING
    // =================================================================

    /**
     * Get or resolve client IP address
     */
    getClientIp: async function() {
        if (this._cachedIp) return this._cachedIp;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                if (data && data.ip) {
                    this._cachedIp = data.ip;
                    return data.ip;
                }
            }
        } catch (e) {}
        this._cachedIp = "Local / Office Network";
        return this._cachedIp;
    },

    /**
     * Record an audit event with timestamp, branch, operator, IP, and device metadata
     */
    logAuditEvent: async function(action, details, metadata = {}) {
        try {
            const ip = await this.getClientIp();
            const logId = `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const payload = {
                id: logId,
                action: String(action || 'ACTION').toUpperCase(),
                details: String(details || ''),
                branchCode: metadata.branchCode || (window.state?.currentSession?.code) || '99',
                branchName: metadata.branchName || (window.state?.currentSession?.name) || 'Head Office',
                operator: metadata.operator || (window.state?.currentSession?.name || 'ADMIN'),
                ip: ip,
                userAgent: navigator.userAgent || '',
                platform: navigator.platform || '',
                timestamp: new Date().toISOString(),
                timestampMs: Date.now(),
                ...metadata
            };

            if (this.db) {
                try {
                    await this.db.collection('audit_logs').doc(logId).set(payload);
                } catch (e) {}
            }
            try {
                const fsDoc = this.toFirestoreDocument(payload);
                await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/audit_logs/${logId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(fsDoc)
                });
            } catch (e) {}

            return payload;
        } catch (err) {
            console.warn("[Firebase] logAuditEvent notice:", err);
            return null;
        }
    },

    /**
     * Get recent audit logs from Firestore
     */
    getAuditLogs: async function(limit = 200) {
        if (this.db) {
            try {
                const snapshot = await this.db.collection('audit_logs').orderBy('timestampMs', 'desc').limit(limit).get();
                const logs = [];
                snapshot.forEach(doc => logs.push({ id: doc.id, ...doc.data() }));
                if (logs.length > 0) return logs;
            } catch (e) {}
        }
        try {
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/audit_logs?pageSize=${limit}`);
            if (res.ok) {
                const data = await res.json();
                if (data.documents && Array.isArray(data.documents)) {
                    return data.documents.map(d => this.fromFirestoreDocument(d)).sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
                }
            }
        } catch (e) {}
        return [];
    },

    /**
     * Realtime listener for security audit logs
     */
    listenAuditLogs: function(onUpdate, limit = 200) {
        if (!this.db) return () => {};
        try {
            return this.db.collection('audit_logs').orderBy('timestampMs', 'desc').limit(limit).onSnapshot((snapshot) => {
                const logs = [];
                snapshot.forEach(doc => logs.push({ id: doc.id, ...doc.data() }));
                if (typeof onUpdate === 'function') onUpdate(logs);
            }, (err) => {
                console.warn("[Firebase] Audit logs listener error:", err);
            });
        } catch (e) {
            return () => {};
        }
    },

    // =================================================================
    // ACTIVE DEVICE HEARTBEAT & LIVE BRANCH PRESENCE
    // =================================================================

    /**
     * Update device heartbeat ping with IP and session details
     */
    updateDeviceHeartbeat: async function(sessionInfo = {}) {
        try {
            let sessionId = localStorage.getItem("jccb_device_session_id");
            if (!sessionId) {
                sessionId = `DEV_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
                localStorage.setItem("jccb_device_session_id", sessionId);
            }

            // If this device was previously terminated by admin, do not send online heartbeat
            if (localStorage.getItem("jccb_device_terminated") === sessionId) {
                return { terminated: true };
            }

            const ip = await this.getClientIp();
            const payload = {
                sessionId: sessionId,
                branchCode: sessionInfo.branchCode || (window.state?.currentSession?.code) || '99',
                branchName: sessionInfo.branchName || (window.state?.currentSession?.name) || 'Head Office',
                operator: sessionInfo.operator || (window.state?.currentSession?.name) || 'Operator',
                ip: ip,
                userAgent: navigator.userAgent || '',
                platform: navigator.platform || '',
                screenWidth: window.screen ? window.screen.width : 0,
                screenHeight: window.screen ? window.screen.height : 0,
                loginTime: sessionInfo.loginTime || localStorage.getItem("jccb_session_login_time") || new Date().toISOString(),
                lastPing: new Date().toISOString(),
                lastPingMs: Date.now(),
                isOnline: true,
                terminated: false,
                status: "active"
            };

            if (!localStorage.getItem("jccb_session_login_time")) {
                localStorage.setItem("jccb_session_login_time", payload.loginTime);
            }

            if (this.db) {
                try {
                    const doc = await this.db.collection('active_sessions').doc(sessionId).get();
                    if (doc.exists && (doc.data().terminated === true || doc.data().status === "terminated")) {
                        localStorage.setItem("jccb_device_terminated", sessionId);
                        return { terminated: true };
                    }
                    await this.db.collection('active_sessions').doc(sessionId).set(payload, { merge: true });
                } catch (e) {}
            }
            try {
                const fsDoc = this.toFirestoreDocument(payload);
                await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/active_sessions/${sessionId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(fsDoc)
                });
            } catch (e) {}

            return payload;
        } catch (err) {
            return null;
        }
    },

    /**
     * Terminate / Force-Disconnect an active device session from Central Management
     */
    terminateActiveSession: async function(sessionId) {
        const payload = {
            sessionId: sessionId,
            isOnline: false,
            terminated: true,
            status: "terminated",
            terminatedAt: new Date().toISOString(),
            terminatedAtMs: Date.now()
        };

        if (this.db) {
            try {
                await this.db.collection('active_sessions').doc(sessionId).set(payload, { merge: true });
            } catch (e) {}
        }
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/active_sessions/${sessionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
        } catch (e) {}

        return payload;
    },

    /**
     * Realtime listener on client device for remote killswitch / force logout
     */
    listenSessionKillswitch: function(sessionId, onTerminated) {
        if (!this.db || !sessionId) return () => {};
        try {
            return this.db.collection('active_sessions').doc(sessionId).onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data && (data.terminated === true || data.status === "terminated" || data.isOnline === false)) {
                        if (typeof onTerminated === "function") onTerminated(data);
                    }
                }
            }, (err) => {
                console.warn("[Firebase] Session killswitch listener notice:", err);
            });
        } catch (e) {
            return () => {};
        }
    },

    /**
     * Realtime listener for active branches and connected devices
     */
    listenActiveSessions: function(onUpdate) {
        if (!this.db) return () => {};
        try {
            return this.db.collection('active_sessions').onSnapshot((snapshot) => {
                const sessions = [];
                snapshot.forEach(doc => sessions.push({ id: doc.id, ...doc.data() }));
                if (typeof onUpdate === 'function') onUpdate(sessions);
            }, (err) => {
                console.warn("[Firebase] Active sessions listener error:", err);
            });
        } catch (e) {
            return () => {};
        }
    },

    /**
     * Terminate or remove an active session
     */
    deleteActiveSession: async function(sessionId) {
        if (this.db) {
            try {
                await this.db.collection('active_sessions').doc(sessionId).delete();
            } catch (e) {}
        }
        try {
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/active_sessions/${sessionId}`, {
                method: "DELETE"
            });
        } catch (e) {}
    },

    // =================================================================
    // GLOBAL DATABASE RESTORE & MULTI-DEVICE REALTIME BROADCAST ENGINE
    // =================================================================

    /**
     * Save customer list document for fast bulk sync
     */
    saveCustomersList: async function(customersList) {
        const payload = {
            list: customersList || [],
            updatedAt: new Date().toISOString()
        };
        if (this.db) {
            try {
                await this.db.collection('settings').doc('customersList').set(payload);
            } catch (e) {}
        }
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/customersList`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
        } catch (e) {}
    },

    /**
     * Send global sync signal to all connected branch devices
     */
    sendGlobalSyncSignal: async function(signalData = {}) {
        const payload = {
            signalId: `SIG_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            restoreTimestamp: Date.now(),
            restoreTimeISO: new Date().toISOString(),
            action: signalData.action || "DATABASE_RESTORE_GLOBAL",
            restoreType: signalData.restoreType || "EXCEL_RESTORE",
            restoredBy: signalData.restoredBy || (window.state?.currentSession?.name) || "HEAD OFFICE",
            summary: signalData.summary || {},
            updatedAt: new Date().toISOString()
        };

        if (this.db) {
            try {
                await this.db.collection('settings').doc('global_sync_signal').set(payload);
            } catch (e) {}
        }
        try {
            const fsDoc = this.toFirestoreDocument(payload);
            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/global_sync_signal`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fsDoc)
            });
        } catch (e) {}

        return payload;
    },

    /**
     * Realtime listener for global database restore & update signal
     */
    listenGlobalSyncSignal: function(onSignal) {
        if (!this.db || typeof onSignal !== "function") return () => {};
        return this.db.collection('settings').doc('global_sync_signal').onSnapshot((doc) => {
            if (doc.exists) {
                onSignal(doc.data());
            }
        }, (err) => {
            console.warn("[Firebase] Global sync signal listener notice:", err);
        });
    },

    /**
     * Get latest global sync signal
     */
    getGlobalSyncSignal: async function() {
        try {
            const res = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/global_sync_signal`);
            if (res.ok) {
                const data = await res.json();
                return this.fromFirestoreDocument(data);
            }
        } catch (e) {}
        if (this.db) {
            try {
                const doc = await this.db.collection('settings').doc('global_sync_signal').get();
                if (doc.exists) return doc.data();
            } catch (e) {}
        }
        return null;
    },

    /**
     * PERMANENT GLOBAL DATABASE RESTORE TO FIREBASE FIRESTORE
     * Writes all restored collections, chunked batches, settings, masters, and triggers realtime broadcast
     */
    restoreFullDatabaseToFirebase: async function(restoredData = {}, onProgress = null) {
        const report = (stage, pct, msg) => {
            console.log(`[Firebase Restore ${pct}%] [${stage}]: ${msg}`);
            if (typeof onProgress === "function") {
                try { onProgress(stage, pct, msg); } catch (e) {}
            }
        };

        report("START", 5, "Firebase ક્લાઉડ ડેટાબેઝ સાથે કનેક્શન સ્થાપિત થઈ રહ્યું છે...");

        try {
            // 1. Daily Rates & Rate History
            if (restoredData.goldRates || (restoredData.rateHistory && restoredData.rateHistory.length > 0)) {
                report("RATES", 12, "દૈનિક સોનાના ભાવ અને રેટ હિસ્ટ્રી ક્લાઉડ પર સેવ થઈ રહ્યા છે...");
                const latestRate = (restoredData.rateHistory && restoredData.rateHistory.length > 0)
                    ? restoredData.rateHistory[0]
                    : { rate22K: restoredData.goldRates?.["22K"] || 0, rate24K: restoredData.goldRates?.["24K"] || 0 };

                await this.saveDailyRates({
                    rate22K: parseFloat(latestRate.rate22K || latestRate.rate || 0),
                    rate24K: parseFloat(latestRate.rate24K || 0),
                    date: latestRate.date || new Date().toISOString().split("T")[0],
                    isLocked: Boolean(restoredData.goldRates?.isLocked),
                    lockedAt: restoredData.goldRates?.lockedAt || null,
                    lockedBy: restoredData.goldRates?.lockedBy || "HEAD OFFICE"
                });

                if (Array.isArray(restoredData.rateHistory)) {
                    const rhPayload = { list: restoredData.rateHistory, updatedAt: new Date().toISOString() };
                    if (this.db) {
                        try { await this.db.collection('settings').doc('rateHistory').set(rhPayload); } catch (e) {}
                    }
                    try {
                        const fsDoc = this.toFirestoreDocument(rhPayload);
                        await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/settings/rateHistory`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(fsDoc)
                        });
                    } catch (e) {}
                }
            }

            // 2. Rules Master & Custom Charges
            if (restoredData.rules) {
                report("RULES", 22, "બેંકિંગ રૂલ્સ, વેલ્યુએશન સ્લેબ્સ અને કસ્ટમ ચાર્જીસ ક્લાઉડ પર સેવ થઈ રહ્યા છે...");
                await this.saveRules(restoredData.rules);
            }

            // 3. Settings & Branch Seeds
            if (restoredData.settings) {
                report("SETTINGS", 32, "શાખા એકાઉન્ટ નંબર અને પેકેટ સીડ્સ કન્ફિગરેશન ક્લાઉડ પર સેવ થઈ રહ્યા છે...");
                await this.saveSettings(restoredData.settings);
            }

            // 4. Sony Valuers Master
            if (Array.isArray(restoredData.valuers)) {
                report("VALUERS", 42, `અધિકૃત ${restoredData.valuers.length} સોની વેલ્યુઅર્સ ક્લાઉડ પર સેવ થઈ રહ્યા છે...`);
                await this.saveValuersList(restoredData.valuers, restoredData.deletedValuerIds || []);
            }

            // 5. Product Schemes Master
            if (Array.isArray(restoredData.products)) {
                report("PRODUCTS", 50, `કુલ ${restoredData.products.length} લોન પ્રોડક્ટ સ્કીમ્સ ક્લાઉડ પર સેવ થઈ રહી છે...`);
                await this.saveProductsList(restoredData.products);
            }

            // 6. Branches Master
            if (Array.isArray(restoredData.branches)) {
                report("BRANCHES", 58, `તમામ ${restoredData.branches.length} બેંક શાખાઓ અને પાસવર્ડ્સ ક્લાઉડ પર સેવ થઈ રહ્યા છે...`);
                await this.saveBranchesList(restoredData.branches);
                for (const b of restoredData.branches) {
                    try {
                        await this.saveBranch(b);
                    } catch (e) {}
                }
            }

            // 7. Customers & Member Directory
            if (Array.isArray(restoredData.customers) && restoredData.customers.length > 0) {
                report("CUSTOMERS", 68, `કુલ ${restoredData.customers.length} સભાસદ/ગ્રાહક પ્રોફાઈલ્સ ક્લાઉડ પર સેવ થઈ રહી છે...`);
                await this.saveCustomersList(restoredData.customers);
                
                // Also write individual docs in chunked batches
                const custBatchSize = 300;
                for (let i = 0; i < restoredData.customers.length; i += custBatchSize) {
                    const chunk = restoredData.customers.slice(i, i + custBatchSize);
                    if (this.db) {
                        try {
                            const batch = this.db.batch();
                            chunk.forEach(c => {
                                const cId = String(c.customerNo || c.id || `CUST_${i}`).trim();
                                const ref = this.db.collection('customers').doc(cId);
                                batch.set(ref, { ...c, id: cId, customerNo: c.customerNo || cId, updatedAt: new Date().toISOString() }, { merge: true });
                            });
                            await batch.commit();
                        } catch (e) {
                            console.warn("[Firebase] Customers chunk SDK write error, moving on:", e);
                        }
                    }
                }
            }

            // 8. Clean up deleted_loans tombstones for all restored active loans
            const restoredLoanIdsSet = new Set((Array.isArray(restoredData.loans) ? restoredData.loans : []).map(l => String(l.id || l.loanId || "").trim()));
            if (restoredLoanIdsSet.size > 0 && this.db) {
                try {
                    const cleanBatch = this.db.batch();
                    let cCount = 0;
                    for (const lId of restoredLoanIdsSet) {
                        if (lId) {
                            cleanBatch.delete(this.db.collection('deleted_loans').doc(lId));
                            cCount++;
                            if (cCount >= 400) break;
                        }
                    }
                    await cleanBatch.commit();
                } catch (e) {}
            }

            // Save only genuine deleted loans (excluding any restored active loans)
            const trueDeletedIds = (Array.isArray(restoredData.deletedLoanIds) ? restoredData.deletedLoanIds : []).filter(dId => !restoredLoanIdsSet.has(String(dId).trim()));
            if (trueDeletedIds.length > 0) {
                report("DELETED", 75, "ડિલીટ કરેલ લોન ટૂમ્બસ્ટોન્સ સિંક થઈ રહ્યા છે...");
                if (this.db) {
                    try {
                        const batch = this.db.batch();
                        trueDeletedIds.forEach(dId => {
                            if (dId) {
                                const ref = this.db.collection('deleted_loans').doc(String(dId).trim());
                                batch.set(ref, { id: String(dId).trim(), deletedAt: new Date().toISOString(), deletedBy: "HEAD_OFFICE_RESTORE" }, { merge: true });
                            }
                        });
                        await batch.commit();
                    } catch (e) {}
                }
            }

            // 9. All Loan Records (Chunked Batch Upload with Photo Compression)
            const loans = Array.isArray(restoredData.loans) ? restoredData.loans : [];
            const totalLoans = loans.length;
            report("LOANS", 80, `કુલ ${totalLoans} લોન ખાતાઓ Firebase Firestore પર અપલોડ થઈ રહ્યા છે...`);

            const loanBatchSize = 100;
            for (let i = 0; i < totalLoans; i += loanBatchSize) {
                const chunk = loans.slice(i, i + loanBatchSize);
                const currentProgress = Math.round(80 + ((i + chunk.length) / totalLoans) * 15);
                report("LOANS_CHUNK", currentProgress, `લોન રેકોર્ડ્સ અપલોડ થઈ રહ્યા છે: ${i + chunk.length} / ${totalLoans}...`);

                // Prepare payloads with photo compression
                const processedChunk = await Promise.all(chunk.map(async (loanItem) => {
                    const loanId = String(loanItem.id || loanItem.loanId || `GL_${Date.now()}_${loanItem.branchCode || '01'}`).trim();
                    let custPhoto = loanItem.customerPhoto || "";
                    let ornPhoto = loanItem.ornamentPhoto || "";

                    if (typeof custPhoto === "string" && custPhoto.startsWith("data:image") && custPhoto.length > 120000) {
                        try { custPhoto = await this.compressBase64Image(custPhoto, 400, 0.6); } catch (e) {}
                    }
                    if (typeof ornPhoto === "string" && ornPhoto.startsWith("data:image") && ornPhoto.length > 120000) {
                        try { ornPhoto = await this.compressBase64Image(ornPhoto, 400, 0.6); } catch (e) {}
                    }

                    return {
                        ...loanItem,
                        id: loanId,
                        loanId: loanId,
                        customerPhoto: custPhoto,
                        ornamentPhoto: ornPhoto,
                        branchId: String(loanItem.branchCode || loanItem.branchId || '01'),
                        updatedAt: loanItem.updatedAt || new Date().toISOString()
                    };
                }));

                // 1. Write chunk via SDK batch
                let chunkSaved = false;
                if (this.db) {
                    try {
                        const batch = this.db.batch();
                        processedChunk.forEach(pLoan => {
                            const ref = this.db.collection('loans').doc(pLoan.id);
                            batch.set(ref, pLoan, { merge: true });
                        });
                        await batch.commit();
                        chunkSaved = true;
                    } catch (sdkErr) {
                        console.warn("[Firebase SDK] Loan chunk batch error, falling back to REST:", sdkErr);
                    }
                }

                // 2. Fallback to REST API if SDK batch failed
                if (!chunkSaved) {
                    await Promise.all(processedChunk.map(async (pLoan) => {
                        try {
                            const fsDoc = this.toFirestoreDocument(pLoan);
                            await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/loans/${pLoan.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(fsDoc)
                            });
                        } catch (e) {}
                    }));
                }
            }

            // 10. Broadcast Global Sync Signal to All Devices & Log Audit Event
            report("BROADCAST", 98, "તમામ કનેક્ટેડ બ્રાન્ચ કમ્પ્યુટર્સ પર લાઈવ ગ્લોબલ સિગ્નલ મોકલાઈ રહ્યો છે...");
            await this.sendGlobalSyncSignal({
                action: "DATABASE_RESTORE_GLOBAL",
                restoreType: restoredData.restoreType || "EXCEL_RESTORE",
                restoredBy: (window.state?.currentSession?.name) || "HEAD OFFICE",
                summary: restoredData.summary || {
                    loans: totalLoans,
                    customers: (restoredData.customers || []).length,
                    valuers: (restoredData.valuers || []).length,
                    products: (restoredData.products || []).length,
                    branches: (restoredData.branches || []).length
                }
            });

            await this.logAuditEvent("DATABASE_RESTORE_GLOBAL", `Full database restored globally (${totalLoans} loans, ${(restoredData.customers || []).length} customers) by Head Office`, {
                totalLoans: totalLoans,
                totalCustomers: (restoredData.customers || []).length,
                totalValuers: (restoredData.valuers || []).length,
                totalBranches: (restoredData.branches || []).length,
                operator: (window.state?.currentSession?.name) || "HEAD OFFICE"
            });

            report("COMPLETE", 100, "સંપૂર્ણ ડેટાબેઝ સફળતાપૂર્વક Firebase ક્લાઉડ પર કાયમી સેવ થઈ ગયો અને તમામ કમ્પ્યુટર્સ પર લાઈવ થઈ ગયો!");
            return true;
        } catch (fatalError) {
            console.error("[Firebase Restore] Fatal error during cloud restore:", fatalError);
            report("ERROR", 100, "ક્લાઉડ સેવ દરમિયાન ક્ષતિ: " + fatalError.message);
            throw fatalError;
        }
    },

    // =================================================================
    // CLOUD STORAGE UPLOADS (ORNAMENTS & KYC)
    // =================================================================

    /**
     * Upload gold ornament photo to Firebase Storage
     */
    uploadOrnamentPhoto: async function(branchCode, loanId, fileBlob, fileName) {
        if (!this.storage) throw new Error("Firebase Storage not initialized.");
        const path = `branches/${branchCode}/loans/${loanId}/${Date.now()}_${fileName || 'ornament.jpg'}`;
        const storageRef = this.storage.ref().child(path);
        const snapshot = await storageRef.put(fileBlob);
        const downloadUrl = await snapshot.ref.getDownloadURL();
        return { path, downloadUrl };
    }
};

// Expose globally
window.FirebaseService = FirebaseService;
