/**
 * JCCB Tools Suite — Seed Master Branches (01-18, 99 Head Office) into Firestore
 * Uses Firestore REST API with Anonymous Auth or Service Account
 */

const https = require('https');

const FIREBASE_API_KEY = "AIzaSyCuqV1wofO-dfb134Oehjm7NNPK5aRGCn0";
const FIREBASE_PROJECT_ID = "jccbtools";

const JCCB_BRANCHES = [
  { code: "99", branchCode: "99", name: "99 HEAD OFFICE", shortName: "HO", branchNameGuj: "૯૯ હેડ ઓફિસ (મુખ્ય કચેરી)", role: "admin", isHO: true },
  { code: "01", branchCode: "01", name: "01 AZADCHOWK BRANCH", shortName: "CBB", branchNameGuj: "૦૧ આઝાદચોક શાખા", role: "branch", isHO: false },
  { code: "02", branchCode: "02", name: "02 JOSHIPARA BRANCH", shortName: "JPB", branchNameGuj: "૦૨ જોશીપરા શાખા", role: "branch", isHO: false },
  { code: "03", branchCode: "03", name: "03 DOLATPARA BRANCH", shortName: "DPB", branchNameGuj: "૦૩ દોલતપરા શાખા", role: "branch", isHO: false },
  { code: "04", branchCode: "04", name: "04 KODINAR BRANCH", shortName: "KDR", branchNameGuj: "૦૪ કોડીનાર શાખા", role: "branch", isHO: false },
  { code: "05", branchCode: "05", name: "05 KESHOD BRANCH", shortName: "KSD", branchNameGuj: "૦૫ કેશોદ શાખા", role: "branch", isHO: false },
  { code: "06", branchCode: "06", name: "06 VANTHALI BRANCH", shortName: "VTL", branchNameGuj: "૦૬ વંથલી શાખા", role: "branch", isHO: false },
  { code: "07", branchCode: "07", name: "07 MANAVADAR BRANCH", shortName: "MNV", branchNameGuj: "૦૭ માણાવદર શાખા", role: "branch", isHO: false },
  { code: "08", branchCode: "08", name: "08 GANDHINAGAR BRANCH", shortName: "GNB", branchNameGuj: "૦૮ ગાંધીનગર શાખા", role: "branch", isHO: false },
  { code: "09", branchCode: "09", name: "09 LIMBDI BRANCH", shortName: "LIM", branchNameGuj: "૦૯ લીંબડી શાખા", role: "branch", isHO: false },
  { code: "10", branchCode: "10", name: "10 MENDARDA BRANCH", shortName: "MND", branchNameGuj: "૧૦ મેંદરડા શાખા", role: "branch", isHO: false },
  { code: "11", branchCode: "11", name: "11 VISAVADAR BRANCH", shortName: "VIS", branchNameGuj: "૧૧ વિસાવદર શાખા", role: "branch", isHO: false },
  { code: "12", branchCode: "12", name: "12 JAMNAGAR BRANCH", shortName: "JAM", branchNameGuj: "૧૨ જામનગર શાખા", role: "branch", isHO: false },
  { code: "13", branchCode: "13", name: "13 BUS STAND BRANCH", shortName: "STB", branchNameGuj: "૧૩ બસ સ્ટેન્ડ શાખા", role: "branch", isHO: false },
  { code: "14", branchCode: "14", name: "14 LATHI BRANCH", shortName: "LTH", branchNameGuj: "૧૪ લાઠી શાખા", role: "branch", isHO: false },
  { code: "16", branchCode: "16", name: "16 AHMEDABAD BRANCH", shortName: "AHM", branchNameGuj: "૧૬ અમદાવાદ શાખા", role: "branch", isHO: false },
  { code: "17", branchCode: "17", name: "17 RAJKOT BRANCH", shortName: "RJT", branchNameGuj: "૧૭ રાજકોટ શાખા", role: "branch", isHO: false },
  { code: "18", branchCode: "18", name: "18 ZANZARDA BRANCH", shortName: "ZAN", branchNameGuj: "૧૮ ઝાંઝરડા શાખા", role: "branch", isHO: false }
];

function httpRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getAuthToken() {
  const payload = JSON.stringify({ returnSecureToken: true });
  const res = await httpRequest({
    hostname: 'identitytoolkit.googleapis.com',
    path: `/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, payload);

  if (res.data && res.data.idToken) {
    return res.data.idToken;
  }
  throw new Error((res.data && res.data.error && res.data.error.message) || "Could not sign in anonymously. Make sure Anonymous Authentication is enabled in Firebase Console.");
}

async function seedBranches() {
  console.log("=================================================");
  console.log("🏦 SEEDING JCCB BRANCHES INTO FIRESTORE (/branches) 🏦");
  console.log("=================================================\n");

  try {
    console.log("1. Authenticating with Firebase...");
    let idToken;
    try {
      idToken = await getAuthToken();
      console.log("✓ Authenticated successfully with Firebase Auth token.\n");
    } catch (authErr) {
      console.warn("Notice during auth:", authErr.message);
      console.log("Attempting direct REST push without token (or ensure Anonymous Auth is turned ON in Firebase Console)...");
    }

    console.log("2. Writing 18 Branches + Head Office to /branches/{branchCode}...");

    for (const b of JCCB_BRANCHES) {
      const docPath = `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/branches/${b.code}`;
      const fields = {
        branchCode: { stringValue: b.code },
        name: { stringValue: b.name },
        shortName: { stringValue: b.shortName },
        branchNameGuj: { stringValue: b.branchNameGuj },
        role: { stringValue: b.role },
        isHeadOffice: { booleanValue: b.isHO },
        isActive: { booleanValue: true },
        updatedAt: { timestampValue: new Date().toISOString() }
      };

      const payload = JSON.stringify({ fields });
      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const res = await httpRequest({
        hostname: 'firestore.googleapis.com',
        path: `/v1/${docPath}`,
        method: 'PATCH',
        headers
      }, payload);

      if (res.status === 200) {
        console.log(`  ✅ Seeded: /branches/${b.code} -> ${b.name}`);
      } else {
        console.log(`  ⚠️ Status ${res.status} for ${b.code}:`, (res.data && res.data.error && res.data.error.message) || res.raw || '');
      }
    }

    console.log("\n=================================================");
    console.log("🎉 All 18 Branches and Head Office processed!");
    console.log("=================================================");
  } catch (e) {
    console.error("❌ Error seeding branches:", e);
  }
}

if (require.main === module) {
  seedBranches();
}

module.exports = { seedBranches, JCCB_BRANCHES };
