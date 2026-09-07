const conn = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_kF5qI9QzSacN@ep-floral-frog-b3s0jrlo-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const match = conn.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
if (!match) {
  console.error("Invalid database connection string");
  process.exit(1);
}
const host = match[3];
const url = 'https://' + host + '/sql';

async function executeSql(sql, params = []) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': conn
    },
    body: JSON.stringify({ query: sql, params })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || JSON.stringify(data));
  }
  return data;
}

async function verify() {
  console.log("=================================================");
  console.log("  Testing Head Office Bypass in Neon PostgreSQL");
  console.log("=================================================\n");

  // 1. Seed demo FD records from different branches if table is empty
  const fdCountRes = await executeSql("SELECT COUNT(*) as count FROM jccb_fd_forms;");
  const count = parseInt(fdCountRes.rows[0].count, 10);
  console.log(`Current jccb_fd_forms row count: ${count}`);

  if (count === 0) {
    console.log("Inserting test FD applications across branches 01, 02, 03, 99...");
    const testRecords = [
      {
        id: "FD-2026-001",
        branch_code: "01",
        form_no: "FD-2026-001",
        customer_name: "RAHUL J POPAT",
        deposit_amount: 100000,
        interest_rate: 7.60,
        tenure_months: 60,
        status: "COMPLETED",
        payload: {
          id: "FD-2026-001",
          branchCode: "01",
          branchName: "AZADCHOWK BRANCH (CBB)",
          customerName: "RAHUL J POPAT",
          customerId: "7769",
          amount: "100000",
          roi: "7.60",
          depositScheme: "SENIOR CITIZEN DEPOSIT",
          timestamp: new Date().toLocaleString('en-IN'),
          createdAt: Date.now() - 3600000,
          data: {
            branchCode: "01",
            branchName: "AZADCHOWK BRANCH (CBB)",
            firstFullName: "RAHUL J POPAT",
            firstCustomerId: "7769",
            deposit1Amount: "100000",
            deposit1Roi: "7.60"
          }
        }
      },
      {
        id: "FD-2026-002",
        branch_code: "02",
        form_no: "FD-2026-002",
        customer_name: "PRIYA K SHAH",
        deposit_amount: 250000,
        interest_rate: 7.00,
        tenure_months: 24,
        status: "COMPLETED",
        payload: {
          id: "FD-2026-002",
          branchCode: "02",
          branchName: "JOSHIPARA BRANCH (JPB)",
          customerName: "PRIYA K SHAH",
          customerId: "8821",
          amount: "250000",
          roi: "7.00",
          depositScheme: "FIXED DEPOSIT (FD)",
          timestamp: new Date().toLocaleString('en-IN'),
          createdAt: Date.now() - 1800000,
          data: {
            branchCode: "02",
            branchName: "JOSHIPARA BRANCH (JPB)",
            firstFullName: "PRIYA K SHAH",
            firstCustomerId: "8821",
            deposit1Amount: "250000",
            deposit1Roi: "7.00"
          }
        }
      },
      {
        id: "FD-2026-003",
        branch_code: "03",
        form_no: "FD-2026-003",
        customer_name: "MANISH D JOSHI",
        deposit_amount: 500000,
        interest_rate: 7.20,
        tenure_months: 36,
        status: "COMPLETED",
        payload: {
          id: "FD-2026-003",
          branchCode: "03",
          branchName: "DOLATPARA BRANCH (DBP)",
          customerName: "MANISH D JOSHI",
          customerId: "9102",
          amount: "500000",
          roi: "7.20",
          depositScheme: "FIXED DEPOSIT (FD)",
          timestamp: new Date().toLocaleString('en-IN'),
          createdAt: Date.now() - 600000,
          data: {
            branchCode: "03",
            branchName: "DOLATPARA BRANCH (DBP)",
            firstFullName: "MANISH D JOSHI",
            firstCustomerId: "9102",
            deposit1Amount: "500000",
            deposit1Roi: "7.20"
          }
        }
      }
    ];

    for (const r of testRecords) {
      await executeSql(`
        INSERT INTO jccb_fd_forms (id, branch_code, form_no, customer_name, deposit_amount, interest_rate, tenure_months, status, payload, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT (id) DO UPDATE SET
          branch_code = EXCLUDED.branch_code,
          customer_name = EXCLUDED.customer_name,
          deposit_amount = EXCLUDED.deposit_amount,
          interest_rate = EXCLUDED.interest_rate,
          tenure_months = EXCLUDED.tenure_months,
          status = EXCLUDED.status,
          payload = EXCLUDED.payload,
          updated_at = NOW();
      `, [r.id, r.branch_code, r.form_no, r.customer_name, r.deposit_amount, r.interest_rate, r.tenure_months, r.status, JSON.stringify(r.payload)]);
    }
    console.log("✓ Inserted 3 multi-branch test FD applications.");
  }

  // 2. Query distinct branch codes in database
  const distinctRes = await executeSql("SELECT DISTINCT branch_code FROM jccb_fd_forms ORDER BY branch_code;");
  console.log("\n--- SELECT DISTINCT branch_code FROM jccb_fd_forms; ---");
  console.table(distinctRes.rows);

  // 3. Test Head Office vs Branch queries
  console.log("\n--- Testing Head Office Fetch (branch_code = '99' / 'ALL' / null) ---");
  // Head Office fetch:
  const hoFetch = await executeSql("SELECT id, branch_code, customer_name, deposit_amount FROM jccb_fd_forms ORDER BY updated_at DESC;");
  console.log(`Head Office sees ${hoFetch.rows.length} total records across branches:`);
  console.table(hoFetch.rows);

  // Branch 01 fetch:
  console.log("\n--- Testing Branch 01 Fetch (branch_code = '01') ---");
  const b01Fetch = await executeSql("SELECT id, branch_code, customer_name, deposit_amount FROM jccb_fd_forms WHERE branch_code = '01' ORDER BY updated_at DESC;");
  console.log(`Branch 01 user sees ${b01Fetch.rows.length} records for branch 01 only:`);
  console.table(b01Fetch.rows);

  // Branch 02 fetch:
  console.log("\n--- Testing Branch 02 Fetch (branch_code = '02') ---");
  const b02Fetch = await executeSql("SELECT id, branch_code, customer_name, deposit_amount FROM jccb_fd_forms WHERE branch_code = '02' ORDER BY updated_at DESC;");
  console.log(`Branch 02 user sees ${b02Fetch.rows.length} records for branch 02 only:`);
  console.table(b02Fetch.rows);

  // Check Gold Loans table as well
  console.log("\n--- Gold Loans Total in DB ---");
  const goldRes = await executeSql("SELECT COUNT(*) as count FROM jccb_gold_loans;");
  console.log(`jccb_gold_loans total active records: ${goldRes.rows[0].count}`);
}

verify().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
