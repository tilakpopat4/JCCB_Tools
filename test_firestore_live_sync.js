const https = require('https');

const FIREBASE_API_KEY = "AIzaSyCuqV1wofO-dfb134Oehjm7NNPK5aRGCn0";
const FIREBASE_PROJECT_ID = "jccbtools";

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

async function testLiveFirestore() {
  console.log("=================================================");
  console.log("🔍 TESTING LIVE FIRESTORE SYNC ON JCCBTOOLS 🔍");
  console.log("=================================================\n");

  // 1. Sign in anonymously
  console.log("Step 1: Authenticating anonymously...");
  const authPayload = JSON.stringify({ returnSecureToken: true });
  const authRes = await httpRequest({
    hostname: 'identitytoolkit.googleapis.com',
    path: `/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(authPayload)
    }
  }, authPayload);

  console.log(`Auth Response Status: ${authRes.status}`);
  if (authRes.status !== 200) {
    console.error("❌ Anonymous Auth FAILED! Details:", authRes.data || authRes.raw);
    console.log("\n⚠️ CRITICAL NOTICE: Anonymous Authentication is currently DISABLED in Firebase Console.");
    console.log("To fix: Go to Firebase Console -> Authentication -> Sign-in method -> Enable 'Anonymous'.\n");
    return;
  }

  const idToken = authRes.data.idToken;
  const uid = authRes.data.localId;
  console.log(`✅ Auth SUCCESS! UID: ${uid}\n`);

  // 2. Write a test document to /fdForms/FD-TEST-LIVE
  console.log("Step 2: Writing test document to /fdForms/FD-TEST-LIVE...");
  const docPayload = JSON.stringify({
    fields: {
      id: { stringValue: "FD-TEST-LIVE" },
      branchCode: { stringValue: "01" },
      status: { stringValue: "ACTIVE" },
      customerName: { stringValue: "LIVE TEST USER" },
      customerId: { stringValue: "TJCCB-1001" },
      amount: { stringValue: "50000" },
      depositScheme: { stringValue: "FIXED DEPOSIT (FD)" },
      payload: {
        mapValue: {
          fields: {
            firstFullName: { stringValue: "LIVE TEST USER" },
            deposit1Amount: { stringValue: "50000" }
          }
        }
      },
      updatedAt: { timestampValue: new Date().toISOString() },
      updatedAtIso: { stringValue: new Date().toISOString() }
    }
  });

  const writeRes = await httpRequest({
    hostname: 'firestore.googleapis.com',
    path: `/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/fdForms/FD-TEST-LIVE`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
      'Content-Length': Buffer.byteLength(docPayload)
    }
  }, docPayload);

  console.log(`Write Response Status: ${writeRes.status}`);
  if (writeRes.status === 200) {
    console.log("✅ WRITE SUCCESS! Document successfully written to Firestore cloud database!");
  } else {
    console.error("❌ Write FAILED! Details:", writeRes.data || writeRes.raw);
  }

  // 3. Read back all documents from /fdForms
  console.log("\nStep 3: Reading back documents from /fdForms collection...");
  const readRes = await httpRequest({
    hostname: 'firestore.googleapis.com',
    path: `/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/fdForms`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });

  console.log(`Read Response Status: ${readRes.status}`);
  if (readRes.status === 200 && readRes.data.documents) {
    console.log(`✅ READ SUCCESS! Found ${readRes.data.documents.length} document(s) in /fdForms:`);
    readRes.data.documents.forEach((doc, idx) => {
      console.log(`   [${idx + 1}] Path: ${doc.name}`);
    });
  } else {
    console.log("Result:", readRes.data || readRes.raw);
  }
}

testLiveFirestore();
