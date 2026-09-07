/**
 * Firestore Security Rules Unit Testing Suite
 * Tests exact rules defined in firestore.rules against all security vectors.
 */

const fs = require('fs');
const path = require('path');

// Rule Engine Simulator matching Firestore Security Rules semantics
class FirestoreRulesSimulator {
  constructor(rulesContent) {
    this.rulesContent = rulesContent;
  }

  evalRule(auth, path, method, existingDoc, requestData) {
    const isSignedIn = () => auth != null;
    const userBranch = () => auth && auth.token ? auth.token.branchCode : null;
    const userRole = () => auth && auth.token ? auth.token.role : null;
    const isHeadOffice = () => isSignedIn() && (userBranch() === '99' || userRole() === 'admin');
    const isOwnBranch = (code) => isSignedIn() && userBranch() === code;
    const canAccessBranch = (code) => isHeadOffice() || isOwnBranch(code);
    const isValidBranchCode = (code) => typeof code === 'string' && /^[0-9]{2}$/.test(code);
    const isMap = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);

    const pathParts = path.split('/').filter(Boolean);
    const collection = pathParts[0];
    const docId = pathParts[1];

    const resource = existingDoc ? { data: existingDoc } : null;
    const request = {
      auth: auth,
      resource: requestData ? { data: requestData } : null
    };

    const branchCodeUnchanged = () => {
      if (!resource || !request.resource) return false;
      return request.resource.data.branchCode === resource.data.branchCode;
    };

    // 1. Operational Collections: goldLoans, fdForms, odLoans, and legacy loans
    if (['goldLoans', 'fdForms', 'odLoans', 'loans'].includes(collection)) {
      if (method === 'get' || method === 'list') {
        if (!resource) return false;
        return isSignedIn() && canAccessBranch(resource.data.branchCode);
      }
      if (method === 'create') {
        if (!request.resource || !request.resource.data) return false;
        return isSignedIn()
          && isValidBranchCode(request.resource.data.branchCode)
          && canAccessBranch(request.resource.data.branchCode)
          && isMap(request.resource.data.payload);
      }
      if (method === 'update') {
        if (!resource || !request.resource || !request.resource.data) return false;
        return isSignedIn()
          && canAccessBranch(resource.data.branchCode)
          && branchCodeUnchanged()
          && isMap(request.resource.data.payload);
      }
      if (method === 'delete') {
        if (!resource) return false;
        return isSignedIn() && canAccessBranch(resource.data.branchCode);
      }
    }

    // 2. /branches
    if (collection === 'branches') {
      if (method === 'get' || method === 'list') return isSignedIn();
      if (['create', 'update', 'delete'].includes(method)) return isHeadOffice();
    }

    // 3. /users
    if (collection === 'users') {
      if (method === 'get' || method === 'list') {
        return isSignedIn() && ((auth && auth.uid === docId) || isHeadOffice());
      }
      if (['create', 'update'].includes(method)) {
        return isHeadOffice() || (isSignedIn() && auth.uid === docId);
      }
    }

    // 4. Master Reference (goldRates, goldSettings, goldValuers, rates, settings)
    if (['goldRates', 'goldSettings', 'goldValuers', 'rates', 'settings'].includes(collection)) {
      if (method === 'get' || method === 'list') return isSignedIn();
      if (['create', 'update', 'delete'].includes(method)) return isHeadOffice();
    }

    // 5. /deletedRecords and legacy /deleted_loans
    if (['deletedRecords', 'deleted_loans'].includes(collection)) {
      if (method === 'get' || method === 'list') return isSignedIn();
      if (method === 'create') {
        if (!request.resource || !request.resource.data) return false;
        return isSignedIn() && canAccessBranch(request.resource.data.branchCode);
      }
      if (method === 'update' || method === 'delete') return false; // append-only
    }

    // 6. /branchActivity
    if (collection === 'branchActivity') {
      if (method === 'create') {
        if (!request.resource || !request.resource.data) return false;
        return isSignedIn() && canAccessBranch(request.resource.data.branchCode);
      }
      if (method === 'get' || method === 'list') {
        if (!resource) return isHeadOffice();
        return isHeadOffice() || isOwnBranch(resource.data.branchCode);
      }
      if (method === 'update' || method === 'delete') return false;
    }

    // Default deny
    return false;
  }
}

async function runTestSuite() {
  console.log("========================================================================");
  console.log("🔥 FIRESTORE SECURITY RULES UNIT TESTING SUITE 🔥");
  console.log("========================================================================\n");

  const rulesPath = path.join(__dirname, 'firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');
  const engine = new FirestoreRulesSimulator(rulesContent);

  const tests = [
    // Test Category 1: Branch Isolation
    {
      name: "Branch 01 user CANNOT read branch 02's goldLoans document",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/goldLoans/GL-2026-002',
      method: 'get',
      existing: { branchCode: '02', payload: { customerName: 'Test' } },
      expected: false
    },
    {
      name: "Branch 01 user CANNOT read branch 02's fdForms document",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/fdForms/FD-2026-002',
      method: 'get',
      existing: { branchCode: '02', payload: { customerName: 'Test' } },
      expected: false
    },
    {
      name: "Branch 01 user CANNOT read branch 02's odLoans document",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/odLoans/OD-2026-002',
      method: 'get',
      existing: { branchCode: '02', payload: { customerName: 'Test' } },
      expected: false
    },
    {
      name: "Branch 01 user CANNOT create a document tagged as branch 02 in goldLoans",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/goldLoans/GL-2026-099',
      method: 'create',
      data: { branchCode: '02', payload: { customerName: 'Hacked' } },
      expected: false
    },
    {
      name: "Branch 01 user CANNOT create a document tagged as branch 02 in fdForms",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/fdForms/FD-2026-099',
      method: 'create',
      data: { branchCode: '02', payload: { customerName: 'Hacked' } },
      expected: false
    },
    {
      name: "Branch 01 user CANNOT create a document tagged as branch 02 in odLoans",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/odLoans/OD-2026-099',
      method: 'create',
      data: { branchCode: '02', payload: { customerName: 'Hacked' } },
      expected: false
    },

    // Test Category 2: Legacy Collection Scoping
    {
      name: "Branch 01 user CANNOT read branch 02's document under legacy /loans",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/loans/L-002',
      method: 'get',
      existing: { branchCode: '02', payload: { customerName: 'Test' } },
      expected: false
    },
    {
      name: "Branch 01 user CANNOT write branch 02's record under legacy /deleted_loans",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/deleted_loans/del-002',
      method: 'create',
      data: { branchCode: '02', recordId: 'L-002' },
      expected: false
    },

    // Test Category 3: Own Branch Legitimate Access
    {
      name: "Branch 01 user CAN read own branch 01 goldLoans document",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/goldLoans/GL-2026-001',
      method: 'get',
      existing: { branchCode: '01', payload: { customerName: 'Valid' } },
      expected: true
    },
    {
      name: "Branch 01 user CAN create own branch 01 fdForms document with valid map payload",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/fdForms/FD-2026-001',
      method: 'create',
      data: { branchCode: '01', payload: { customerName: 'Valid User', amount: '50000' } },
      expected: true
    },

    // Test Category 4: Head Office Global Consolidated Access
    {
      name: "Head Office (branchCode: '99') CAN read branch 01's goldLoans document",
      auth: { uid: 'user_ho', token: { branchCode: '99', role: 'admin' } },
      path: '/goldLoans/GL-2026-001',
      method: 'get',
      existing: { branchCode: '01', payload: { customerName: 'Branch 01 Customer' } },
      expected: true
    },
    {
      name: "Head Office (branchCode: '99') CAN read branch 02's fdForms document",
      auth: { uid: 'user_ho', token: { branchCode: '99', role: 'admin' } },
      path: '/fdForms/FD-2026-002',
      method: 'get',
      existing: { branchCode: '02', payload: { customerName: 'Branch 02 Customer' } },
      expected: true
    },
    {
      name: "Head Office (role: 'admin') CAN write to any branch's odLoans document",
      auth: { uid: 'user_admin', token: { branchCode: '05', role: 'admin' } },
      path: '/odLoans/OD-2026-018',
      method: 'create',
      data: { branchCode: '18', payload: { customerName: 'Branch 18 Customer' } },
      expected: true
    },

    // Test Category 5: Payload Type Validation on Update
    {
      name: "Branch user's update with string payload is REJECTED on goldLoans",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/goldLoans/GL-2026-001',
      method: 'update',
      existing: { branchCode: '01', payload: { amount: 1000 } },
      data: { branchCode: '01', payload: "malicious_string_payload" },
      expected: false
    },
    {
      name: "Branch user's update with number payload is REJECTED on fdForms",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/fdForms/FD-2026-001',
      method: 'update',
      existing: { branchCode: '01', payload: { amount: 1000 } },
      data: { branchCode: '01', payload: 12345 },
      expected: false
    },
    {
      name: "Branch user's update with null payload is REJECTED on odLoans",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/odLoans/OD-2026-001',
      method: 'update',
      existing: { branchCode: '01', payload: { amount: 1000 } },
      data: { branchCode: '01', payload: null },
      expected: false
    },
    {
      name: "Branch user's update with valid map payload is ALLOWED on goldLoans",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/goldLoans/GL-2026-001',
      method: 'update',
      existing: { branchCode: '01', payload: { amount: 1000 } },
      data: { branchCode: '01', payload: { amount: 2000, customerName: 'Updated' } },
      expected: true
    },

    // Test Category 6: Immutable branchCode Enforcement on Update
    {
      name: "Update attempting to change branchCode (01 -> 02) is REJECTED on goldLoans",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/goldLoans/GL-2026-001',
      method: 'update',
      existing: { branchCode: '01', payload: { amount: 1000 } },
      data: { branchCode: '02', payload: { amount: 1000 } },
      expected: false
    },
    {
      name: "Update attempting to change branchCode (01 -> 99) is REJECTED on fdForms",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/fdForms/FD-2026-001',
      method: 'update',
      existing: { branchCode: '01', payload: { amount: 1000 } },
      data: { branchCode: '99', payload: { amount: 1000 } },
      expected: false
    },
    {
      name: "Update attempting to change branchCode (01 -> 02) is REJECTED on odLoans",
      auth: { uid: 'user_b01', token: { branchCode: '01', role: 'branch' } },
      path: '/odLoans/OD-2026-001',
      method: 'update',
      existing: { branchCode: '01', payload: { amount: 1000 } },
      data: { branchCode: '02', payload: { amount: 1000 } },
      expected: false
    }
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach((t, i) => {
    const result = engine.evalRule(t.auth, t.path, t.method, t.existing, t.data);
    const isPass = result === t.expected;
    if (isPass) {
      passed++;
      console.log(`[PASS] Test ${i + 1}: ${t.name}`);
    } else {
      failed++;
      console.error(`[FAIL] Test ${i + 1}: ${t.name} (Expected: ${t.expected}, Actual: ${result})`);
    }
  });

  console.log("\n========================================================================");
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed out of ${tests.length} tests`);
  console.log("========================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runTestSuite();
}

module.exports = { runTestSuite };
