/**
 * JCCB Tools Suite — Set Firebase Custom Claims (Branch Code & Role)
 * Server-side Admin SDK Script (Node.js)
 * 
 * Usage:
 * node set_firebase_claims.js <uid> <branchCode> <role>
 * 
 * Examples:
 * node set_firebase_claims.js user_12345 99 admin
 * node set_firebase_claims.js user_67890 01 branch
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Attempt to initialize Firebase Admin with service account if present, or default credentials
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.initializeApp({
    projectId: 'project-484328444876485620'
  });
}

async function setBranchClaims(uid, branchCode, role) {
  if (!uid || !branchCode) {
    console.error("Usage: node set_firebase_claims.js <uid> <branchCode> [role]");
    process.exit(1);
  }

  const cleanBranch = String(branchCode).replace(/\D/g, '').padStart(2, '0');
  const userRole = role || (cleanBranch === '99' ? 'admin' : 'branch');

  console.log(`Setting custom claims for UID: ${uid} -> { branchCode: "${cleanBranch}", role: "${userRole}" }...`);

  try {
    await admin.auth().setCustomUserClaims(uid, {
      branchCode: cleanBranch,
      role: userRole
    });

    // Also mirror to /users/{uid} document in Firestore for easy client discovery
    const db = admin.firestore();
    await db.collection('users').doc(uid).set({
      uid: uid,
      branchCode: cleanBranch,
      role: userRole,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ Successfully set custom claims for user ${uid}!`);
  } catch (err) {
    console.error("❌ Error setting custom claims:", err);
  }
}

const args = process.argv.slice(2);
if (args.length >= 2) {
  setBranchClaims(args[0], args[1], args[2]);
} else {
  console.log("ℹ️ Module exported. To run CLI: node set_firebase_claims.js <uid> <branchCode> [role]");
}

module.exports = { setBranchClaims };
