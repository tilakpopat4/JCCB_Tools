# JCCB Tools Suite — Firebase / Firestore Schema & Security Rules
### Branch-scoped access + Head Office (99) admin override across all 3 modules

This mirrors the same entities you already have in Neon (`jccb_gold_loans`,
`jccb_fd_forms`, `jccb_od_loans`, + master tables), redesigned for Firestore's
document model with **custom-claim-based** branch/role security — this is the
part Firestore rules can't do without: you can't check "is this user Head
Office" from a client-writable field, it has to come from a server-issued
auth token claim, or any user could just edit their own branchCode and see
everyone's data.

---

## 1. Collection Structure

```
/branches/{branchCode}                → master branch list (01–18, 99)
/users/{uid}                          → user profile (mirrors custom claims for UI display)
/goldLoans/{loanId}
/fdForms/{formId}
/odLoans/{odId}
/goldRates/{dateString}               → e.g. "2026-09-07"
/goldSettings/{settingKey}
/goldValuers/{valuerId}
/goldCustomers/{customerId}
/deletedRecords/{deletionId}          → cross-device delete broadcast (all 3 modules)
/branchActivity/{activityId}          → audit trail / heartbeat log
```

Every operational record (`goldLoans`, `fdForms`, `odLoans`) carries:
```
{
  branchCode: "01",        // REQUIRED, immutable after create, 2-digit string
  status: "ACTIVE",
  payload: { ...fullFormData },   // same JSONB-equivalent as Neon
  createdAt: <server timestamp>,
  updatedAt: <server timestamp>,
  createdBy: "<uid>"
}
```

---

## 2. Custom Claims — the actual access-control mechanism

Firestore rules cannot trust any field the client can write. Branch and role
**must** come from a Firebase custom claim, set server-side (Admin SDK, e.g.
in a Cloud Function triggered on user creation, or from a secure admin panel).

```javascript
// Server-side only (Cloud Function / Admin SDK) — NEVER in client code
const admin = require('firebase-admin');

async function setBranchClaims(uid, branchCode, role) {
  // role: "branch" | "admin"
  // branchCode: "01".."18" or "99" for Head Office
  await admin.auth().setCustomUserClaims(uid, { branchCode, role });
}

// Example: promote a user to Head Office admin
await setBranchClaims(headOfficeUserUid, "99", "admin");

// Example: a normal branch teller
await setBranchClaims(branchUserUid, "01", "branch");
```

The user must sign out/in (or force-refresh their ID token) after claims
change for the new claims to take effect client-side.

---

## 3. Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ------------------------------------------------------------------
    // Helper functions
    // ------------------------------------------------------------------
    function isSignedIn() {
      return request.auth != null;
    }

    function userBranch() {
      return request.auth.token.branchCode;
    }

    function userRole() {
      return request.auth.token.role;
    }

    // Head Office = branch 99 OR explicit admin role — either grants full access
    function isHeadOffice() {
      return isSignedIn() && (userBranch() == '99' || userRole() == 'admin');
    }

    function isOwnBranch(branchCode) {
      return isSignedIn() && userBranch() == branchCode;
    }

    // The single rule that replaces every buggy client-side branch filter:
    // Head Office bypasses branch matching entirely, branch users must match exactly.
    function canAccessBranch(branchCode) {
      return isHeadOffice() || isOwnBranch(branchCode);
    }

    function isValidBranchCode(code) {
      return code is string && code.matches('^[0-9]{2}$');
    }

    // branchCode must never change after creation — prevents a branch user
    // from re-tagging their own record to escape their own scoping.
    function branchCodeUnchanged() {
      return request.resource.data.branchCode == resource.data.branchCode;
    }

    // ------------------------------------------------------------------
    // /branches — master list, readable by all signed-in users,
    // writable only by Head Office / admin
    // ------------------------------------------------------------------
    match /branches/{branchCode} {
      allow read: if isSignedIn();
      allow write: if isHeadOffice();
    }

    // ------------------------------------------------------------------
    // /users — a user can read/update their own profile doc;
    // Head Office can read/write everyone's (for user management)
    // ------------------------------------------------------------------
    match /users/{uid} {
      allow read: if isSignedIn() && (request.auth.uid == uid || isHeadOffice());
      allow write: if isHeadOffice() || (isSignedIn() && request.auth.uid == uid);
    }

    // ------------------------------------------------------------------
    // /goldLoans — Gold Loan Portal
    // ------------------------------------------------------------------
    match /goldLoans/{loanId} {
      allow read: if isSignedIn() && canAccessBranch(resource.data.branchCode);

      allow create: if isSignedIn()
                    && isValidBranchCode(request.resource.data.branchCode)
                    && canAccessBranch(request.resource.data.branchCode)
                    && request.resource.data.payload is map;

      allow update: if isSignedIn()
                    && canAccessBranch(resource.data.branchCode)
                    && branchCodeUnchanged();

      // Deletes require Head Office OR the owning branch — and should be
      // paired with a write to /deletedRecords from the client (see §5).
      allow delete: if isSignedIn() && canAccessBranch(resource.data.branchCode);
    }

    // ------------------------------------------------------------------
    // /fdForms — Fixed Deposit Portal
    // ------------------------------------------------------------------
    match /fdForms/{formId} {
      allow read: if isSignedIn() && canAccessBranch(resource.data.branchCode);

      allow create: if isSignedIn()
                    && isValidBranchCode(request.resource.data.branchCode)
                    && canAccessBranch(request.resource.data.branchCode)
                    && request.resource.data.payload is map;

      allow update: if isSignedIn()
                    && canAccessBranch(resource.data.branchCode)
                    && branchCodeUnchanged();

      allow delete: if isSignedIn() && canAccessBranch(resource.data.branchCode);
    }

    // ------------------------------------------------------------------
    // /odLoans — Overdraft Against FD Portal
    // ------------------------------------------------------------------
    match /odLoans/{odId} {
      allow read: if isSignedIn() && canAccessBranch(resource.data.branchCode);

      allow create: if isSignedIn()
                    && isValidBranchCode(request.resource.data.branchCode)
                    && canAccessBranch(request.resource.data.branchCode)
                    && request.resource.data.payload is map;

      allow update: if isSignedIn()
                    && canAccessBranch(resource.data.branchCode)
                    && branchCodeUnchanged();

      allow delete: if isSignedIn() && canAccessBranch(resource.data.branchCode);
    }

    // ------------------------------------------------------------------
    // /goldRates, /goldSettings, /goldValuers — master/reference data.
    // Every branch reads them; only Head Office/admin edits them.
    // ------------------------------------------------------------------
    match /goldRates/{dateStr} {
      allow read: if isSignedIn();
      allow write: if isHeadOffice();
    }

    match /goldSettings/{settingKey} {
      allow read: if isSignedIn();
      allow write: if isHeadOffice();
    }

    match /goldValuers/{valuerId} {
      allow read: if isSignedIn();
      allow write: if isHeadOffice();
    }

    // ------------------------------------------------------------------
    // /goldCustomers — unified customer index, branch-scoped like loans
    // ------------------------------------------------------------------
    match /goldCustomers/{customerId} {
      allow read: if isSignedIn() && canAccessBranch(resource.data.branchCode);
      allow create: if isSignedIn()
                    && isValidBranchCode(request.resource.data.branchCode)
                    && canAccessBranch(request.resource.data.branchCode);
      allow update: if isSignedIn()
                    && canAccessBranch(resource.data.branchCode)
                    && branchCodeUnchanged();
      allow delete: if isHeadOffice();
    }

    // ------------------------------------------------------------------
    // /deletedRecords — cross-device delete broadcast log.
    // Every signed-in device must be able to READ this (that's how sync
    // finds out something was deleted elsewhere), but writes are scoped.
    // ------------------------------------------------------------------
    match /deletedRecords/{deletionId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && canAccessBranch(request.resource.data.branchCode);
      allow update, delete: if false; // append-only log, never edited or removed
    }

    // ------------------------------------------------------------------
    // /branchActivity — audit trail / heartbeat.
    // Branch users can log their OWN activity; only Head Office can read
    // the full audit console.
    // ------------------------------------------------------------------
    match /branchActivity/{activityId} {
      allow create: if isSignedIn() && canAccessBranch(request.resource.data.branchCode);
      allow read: if isHeadOffice() || isOwnBranch(resource.data.branchCode);
      allow update, delete: if false; // immutable audit log
    }

    // ------------------------------------------------------------------
    // Default deny — anything not explicitly matched above is blocked.
    // ------------------------------------------------------------------
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 4. Composite Indexes (`firestore.indexes.json`)

Branch-scoped polling (`WHERE branchCode == X ORDER BY updatedAt`) needs a
composite index per collection — Firestore will refuse the query without one:

```json
{
  "indexes": [
    { "collectionGroup": "goldLoans", "queryScope": "COLLECTION", "fields": [
      { "fieldPath": "branchCode", "order": "ASCENDING" },
      { "fieldPath": "updatedAt", "order": "ASCENDING" }
    ]},
    { "collectionGroup": "fdForms", "queryScope": "COLLECTION", "fields": [
      { "fieldPath": "branchCode", "order": "ASCENDING" },
      { "fieldPath": "updatedAt", "order": "ASCENDING" }
    ]},
    { "collectionGroup": "odLoans", "queryScope": "COLLECTION", "fields": [
      { "fieldPath": "branchCode", "order": "ASCENDING" },
      { "fieldPath": "updatedAt", "order": "ASCENDING" }
    ]},
    { "collectionGroup": "deletedRecords", "queryScope": "COLLECTION", "fields": [
      { "fieldPath": "tableName", "order": "ASCENDING" },
      { "fieldPath": "deletedAt", "order": "ASCENDING" }
    ]}
  ],
  "fieldOverrides": []
}
```

Deploy both files with the Firebase CLI:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 5. Client query pattern (mirrors the Neon poll queries you already have)

```javascript
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

function subscribeToFDForms(db, userClaims) {
  const fdRef = collection(db, "fdForms");

  const q = (userClaims.branchCode === '99' || userClaims.role === 'admin')
    ? query(fdRef, orderBy("updatedAt", "asc"))                       // Head Office: no filter
    : query(fdRef, where("branchCode", "==", userClaims.branchCode),  // Branch: scoped
                    orderBy("updatedAt", "asc"));

  // onSnapshot gives you REAL real-time sync — no 10-second polling loop needed,
  // this replaces the entire startNeonDeviceSync()/setInterval pattern.
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added" || change.type === "modified") {
        // merge change.doc.data() into local state
      }
      if (change.type === "removed") {
        // remove from local state
      }
    });
  });
}
```

**This is the biggest practical upgrade over the Neon setup**: `onSnapshot`
gives genuine push-based real-time sync. You'd no longer need the 10-second
`setInterval` polling loop, the `last_synced_at` cursor, or a separate
`deletedRecords` broadcast table for live devices — Firestore delivers
deletions as `change.type === "removed"` automatically. (Keep
`/deletedRecords` only if you still need an audit trail of who deleted what.)

---

## 6. Head Office admin privileges — summary

| Action | Branch user (`01`–`18`) | Head Office / admin (`99`) |
|---|---|---|
| Read own branch's loans/FD/OD | ✅ | ✅ |
| Read **any** branch's records | ❌ | ✅ (no filter applied) |
| Create records | ✅, own branch only | ✅, any branch |
| Edit records | ✅, own branch only | ✅, any branch |
| Delete records | ✅, own branch only | ✅, any branch |
| Edit gold rates / settings / valuers | ❌ (read-only) | ✅ |
| View audit trail (`branchActivity`) | own branch only | ✅ all branches |
| Manage user roles/branches (`/users`) | own profile only | ✅ all users |
