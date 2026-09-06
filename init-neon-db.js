const conn = "postgresql://neondb_owner:npg_kF5qI9QzSacN@ep-floral-frog-b3s0jrlo-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const match = conn.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
const host = match[3];
const url = "https://" + host + "/sql";

const statements = [
  `CREATE TABLE IF NOT EXISTS jccb_gold_loans (
    id TEXT PRIMARY KEY,
    branch_code TEXT NOT NULL,
    loan_no TEXT,
    customer_name TEXT,
    phone TEXT,
    sanction_amount NUMERIC,
    sanction_date TEXT,
    status TEXT DEFAULT 'ACTIVE',
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_fd_forms (
    id TEXT PRIMARY KEY,
    branch_code TEXT NOT NULL,
    form_no TEXT,
    customer_name TEXT,
    deposit_amount NUMERIC,
    interest_rate NUMERIC,
    tenure_months INTEGER,
    status TEXT DEFAULT 'COMPLETED',
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_od_loans (
    id TEXT PRIMARY KEY,
    branch_code TEXT NOT NULL,
    account_no TEXT,
    customer_name TEXT,
    limit_amount NUMERIC,
    fd_receipt_no TEXT,
    status TEXT DEFAULT 'SANCTIONED',
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_gold_rates (
    id TEXT PRIMARY KEY,
    date_str TEXT NOT NULL,
    rate NUMERIC NOT NULL,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_gold_branches (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_gold_valuers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_gold_customers (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_gold_settings (
    key TEXT PRIMARY KEY,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_gold_sessions (
    id TEXT PRIMARY KEY,
    branch_code TEXT NOT NULL,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_deleted_records (
    id TEXT PRIMARY KEY,
    module TEXT NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS jccb_branch_activity (
    id TEXT PRIMARY KEY,
    branch_code TEXT NOT NULL,
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    record_id TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `CREATE INDEX IF NOT EXISTS idx_gold_branch ON jccb_gold_loans(branch_code);`,
  `CREATE INDEX IF NOT EXISTS idx_fd_branch ON jccb_fd_forms(branch_code);`,
  `CREATE INDEX IF NOT EXISTS idx_od_branch ON jccb_od_loans(branch_code);`
];

async function main() {
  console.log("Initializing Neon Postgres tables...");
  for (const sql of statements) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Neon-Connection-String": conn
        },
        body: JSON.stringify({ query: sql, params: [] })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Error executing:", sql.split("\n")[0], data);
      } else {
        console.log("✓ Success:", sql.split("\n")[0]);
      }
    } catch (err) {
      console.error("Network error executing:", sql.split("\n")[0], err.message);
    }
  }
  console.log("All Neon Postgres tables initialized successfully!");
}

main();
