/**
 * The Junagadh Commercial Co-Operative Bank Ltd. (TJCCB)
 * One-Time Base64 to Firebase Storage Migration & Backfill Utility
 *
 * Scans collections: loans, goldLoans, customers
 * Replaces heavy base64 images with lightweight Storage download URLs.
 * Runs in batches of 50 to protect Firestore write quotas.
 */

const https = require('https');
const crypto = require('crypto');

const FIREBASE_API_KEY = "AIzaSyCuqV1wofO-dfb134Oehjm7NNPK5aRGCn0";
const FIREBASE_PROJECT_ID = "jccbtools";
const STORAGE_BUCKET = "jccbtools.firebasestorage.app";

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

function parseFirestoreValue(valObj) {
  if (!valObj) return null;
  if (valObj.stringValue !== undefined) return valObj.stringValue;
  if (valObj.integerValue !== undefined) return parseInt(valObj.integerValue, 10);
  if (valObj.doubleValue !== undefined) return parseFloat(valObj.doubleValue);
  if (valObj.booleanValue !== undefined) return valObj.booleanValue;
  if (valObj.timestampValue !== undefined) return valObj.timestampValue;
  if (valObj.mapValue !== undefined) {
    const res = {};
    const fields = valObj.mapValue.fields || {};
    for (const k in fields) {
      res[k] = parseFirestoreValue(fields[k]);
    }
    return res;
  }
  if (valObj.arrayValue !== undefined) {
    const values = valObj.arrayValue.values || [];
    return values.map(parseFirestoreValue);
  }
  if (valObj.nullValue !== undefined) return null;
  return null;
}

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === 'boolean') return { booleanValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const k in val) {
      fields[k] = toFirestoreValue(val[k]);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

async function uploadBase64ToStorageRest(idToken, storagePath, base64Data) {
  try {
    let cleanBase64 = base64Data;
    let contentType = 'image/jpeg';
    if (base64Data.startsWith('data:')) {
      const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        contentType = match[1];
        cleanBase64 = match[2];
      } else {
        cleanBase64 = base64Data.split(',')[1] || base64Data;
      }
    }

    const buffer = Buffer.from(cleanBase64, 'base64');
    const downloadToken = crypto.randomUUID();

    const uploadOptions = {
      hostname: 'firebasestorage.googleapis.com',
      path: `/v0/b/${STORAGE_BUCKET}/o?name=${encodeURIComponent(storagePath)}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': contentType,
        'Content-Length': buffer.length,
        'x-goog-meta-firebasestoragedownloadtokens': downloadToken
      }
    };

    const res = await httpRequest(uploadOptions, buffer);
    if (res.status === 200) {
      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;
      return downloadUrl;
    } else {
      console.warn(`[Storage REST] Upload returned status ${res.status}:`, res.data || res.raw);
      return null;
    }
  } catch (err) {
    console.warn(`[Storage REST] Error uploading to ${storagePath}:`, err.message);
    return null;
  }
}

async function migrateCollection(idToken, collectionName) {
  console.log(`\n======================================================`);
  console.log(`📦 Scanning collection /${collectionName}...`);
  console.log(`======================================================`);

  let pageToken = "";
  let totalScanned = 0;
  let totalMigrated = 0;
  let totalBytesSaved = 0;

  do {
    const listPath = `/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collectionName}?pageSize=50${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const listRes = await httpRequest({
      hostname: 'firestore.googleapis.com',
      path: listPath,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${idToken}` }
    });

    if (listRes.status !== 200 || !listRes.data || !Array.isArray(listRes.data.documents)) {
      if (listRes.status === 200 && (!listRes.data || !listRes.data.documents)) {
        console.log(`ℹ️ Collection /${collectionName} is empty or has no further documents.`);
      } else {
        console.warn(`⚠️ Could not list /${collectionName} (Status ${listRes.status}):`, listRes.data || listRes.raw);
      }
      break;
    }

    const docs = listRes.data.documents;
    totalScanned += docs.length;
    console.log(`🔍 Processing batch of ${docs.length} documents in /${collectionName}...`);

    for (const doc of docs) {
      const docPath = doc.name;
      const docId = docPath.split('/').pop();
      const rawFields = doc.fields || {};
      const fields = {};
      for (const k in rawFields) {
        fields[k] = parseFirestoreValue(rawFields[k]);
      }

      const branchCode = String(fields.branchCode || fields.branchId || '99').replace(/\D/g, '').padStart(2, '0') || '99';
      let modified = false;

      // Photo keys to inspect
      const photoKeys = ['applicantPhoto', 'ornamentPhoto', 'customerPhoto', 'photo', 'goldPhoto'];
      for (const key of photoKeys) {
        const val = fields[key];
        if (typeof val === 'string' && (val.startsWith('data:image') || val.length > 500)) {
          console.log(`  📸 Found base64 photo in [${collectionName}/${docId}] -> field "${key}" (${Math.round(val.length / 1024)} KB)`);
          const storagePath = `branches/${branchCode}/${collectionName}/${docId}/${key}.jpg`;
          const downloadUrl = await uploadBase64ToStorageRest(idToken, storagePath, val);

          if (downloadUrl) {
            totalBytesSaved += val.length;
            fields[key] = downloadUrl;

            // Also sync payload sub-fields if present
            if (fields.payload && typeof fields.payload === 'object') {
              if (fields.payload[key]) fields.payload[key] = downloadUrl;
              if (key === 'applicantPhoto' && fields.payload.customerPhoto) fields.payload.customerPhoto = downloadUrl;
              if (key === 'customerPhoto' && fields.payload.applicantPhoto) fields.payload.applicantPhoto = downloadUrl;
            }
            if (fields.data && typeof fields.data === 'object') {
              if (fields.data[key]) fields.data[key] = downloadUrl;
            }
            modified = true;
          }
        }
      }

      if (modified) {
        // Write updated document back to Firestore
        const updateFields = {};
        for (const k in fields) {
          updateFields[k] = toFirestoreValue(fields[k]);
        }

        const patchRes = await httpRequest({
          hostname: 'firestore.googleapis.com',
          path: `/v1/${docPath}`,
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }, JSON.stringify({ fields: updateFields }));

        if (patchRes.status === 200) {
          totalMigrated++;
          console.log(`  ✅ Successfully updated document [${collectionName}/${docId}] with Storage URLs.`);
        } else {
          console.warn(`  ❌ Failed to update document [${collectionName}/${docId}] (Status ${patchRes.status}):`, patchRes.data);
        }
      }
    }

    pageToken = listRes.data.nextPageToken || "";
  } while (pageToken);

  console.log(`\n🎉 Completed /${collectionName}: ${totalScanned} scanned, ${totalMigrated} migrated to Storage.`);
  console.log(`💾 Estimated document weight reduction: ${Math.round(totalBytesSaved / 1024)} KB payload stripped.`);
  return { totalScanned, totalMigrated, totalBytesSaved };
}

async function runMigration() {
  console.log("==================================================================");
  console.log("🚀 STARTING JCCB BASE64 TO FIREBASE STORAGE MIGRATION UTILITY 🚀");
  console.log("==================================================================\n");

  // Step 1: Anonymous Auth
  console.log("Authenticating anonymously to Firebase...");
  const authRes = await httpRequest({
    hostname: 'identitytoolkit.googleapis.com',
    path: `/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ returnSecureToken: true }));

  if (authRes.status !== 200) {
    console.error("❌ Authentication failed:", authRes.data || authRes.raw);
    return;
  }

  const idToken = authRes.data.idToken;
  console.log("✅ Authenticated successfully!\n");

  const collections = ['goldLoans', 'loans', 'customers'];
  let grandTotalMigrated = 0;
  let grandTotalBytes = 0;

  for (const col of collections) {
    try {
      const res = await migrateCollection(idToken, col);
      grandTotalMigrated += res.totalMigrated;
      grandTotalBytes += res.totalBytesSaved;
    } catch (e) {
      console.warn(`Error migrating collection ${col}:`, e);
    }
  }

  console.log("\n==================================================================");
  console.log(`🏁 MIGRATION FINISHED! Total documents updated: ${grandTotalMigrated}`);
  console.log(`📉 Total Base64 stripped & transferred to Storage: ${Math.round(grandTotalBytes / 1024)} KB`);
  console.log("==================================================================");
}

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
