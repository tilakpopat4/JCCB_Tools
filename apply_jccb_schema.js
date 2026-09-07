const fs = require('fs');
const path = require('path');

const conn = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_kF5qI9QzSacN@ep-floral-frog-b3s0jrlo-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const match = conn.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
if (!match) {
  console.error("Invalid database connection string");
  process.exit(1);
}
const host = match[3];
const url = 'https://' + host + '/sql';

async function executeSql(sql) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': conn
    },
    body: JSON.stringify({ query: sql, params: [] })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || JSON.stringify(data));
  }
  return data;
}

async function main() {
  console.log("=======================================================");
  console.log("  Executing jccb_neon_schema.sql for Neon PostgreSQL");
  console.log("  Database Host: " + host);
  console.log("=======================================================\n");

  const migrationSteps = [
    // 0. Extensions & Updated At Trigger Function
    `CREATE EXTENSION IF NOT EXISTS pgcrypto;`,
    `CREATE OR REPLACE FUNCTION jccb_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`,

    // 1. Gold Loans Table & Indexes & Triggers
    `CREATE TABLE IF NOT EXISTS public.jccb_gold_loans (
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
    `CREATE INDEX IF NOT EXISTS idx_gold_branch ON public.jccb_gold_loans (branch_code);`,
    `CREATE INDEX IF NOT EXISTS idx_gold_loan_no ON public.jccb_gold_loans (loan_no);`,
    `CREATE INDEX IF NOT EXISTS idx_gold_status ON public.jccb_gold_loans (status);`,
    `CREATE INDEX IF NOT EXISTS idx_gold_updated ON public.jccb_gold_loans (updated_at);`,
    `CREATE INDEX IF NOT EXISTS idx_gold_customer ON public.jccb_gold_loans (customer_name);`,
    `CREATE INDEX IF NOT EXISTS idx_gold_payload_gin ON public.jccb_gold_loans USING GIN (payload);`,
    `DROP TRIGGER IF EXISTS trg_gold_loans_updated_at ON public.jccb_gold_loans;`,
    `CREATE TRIGGER trg_gold_loans_updated_at BEFORE UPDATE ON public.jccb_gold_loans FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();`,

    // 2. FD Forms Table & Indexes & Triggers
    `CREATE TABLE IF NOT EXISTS public.jccb_fd_forms (
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
    `CREATE INDEX IF NOT EXISTS idx_fd_branch ON public.jccb_fd_forms (branch_code);`,
    `CREATE INDEX IF NOT EXISTS idx_fd_form_no ON public.jccb_fd_forms (form_no);`,
    `CREATE INDEX IF NOT EXISTS idx_fd_status ON public.jccb_fd_forms (status);`,
    `CREATE INDEX IF NOT EXISTS idx_fd_updated ON public.jccb_fd_forms (updated_at);`,
    `CREATE INDEX IF NOT EXISTS idx_fd_customer ON public.jccb_fd_forms (customer_name);`,
    `CREATE INDEX IF NOT EXISTS idx_fd_payload_gin ON public.jccb_fd_forms USING GIN (payload);`,
    `DROP TRIGGER IF EXISTS trg_fd_forms_updated_at ON public.jccb_fd_forms;`,
    `CREATE TRIGGER trg_fd_forms_updated_at BEFORE UPDATE ON public.jccb_fd_forms FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();`,

    // 3. OD Loans Table & Indexes & Triggers
    `CREATE TABLE IF NOT EXISTS public.jccb_od_loans (
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
    `CREATE INDEX IF NOT EXISTS idx_od_branch ON public.jccb_od_loans (branch_code);`,
    `CREATE INDEX IF NOT EXISTS idx_od_acc_no ON public.jccb_od_loans (account_no);`,
    `CREATE INDEX IF NOT EXISTS idx_od_status ON public.jccb_od_loans (status);`,
    `CREATE INDEX IF NOT EXISTS idx_od_updated ON public.jccb_od_loans (updated_at);`,
    `CREATE INDEX IF NOT EXISTS idx_od_fd_receipt ON public.jccb_od_loans (fd_receipt_no);`,
    `CREATE INDEX IF NOT EXISTS idx_od_payload_gin ON public.jccb_od_loans USING GIN (payload);`,
    `DROP TRIGGER IF EXISTS trg_od_loans_updated_at ON public.jccb_od_loans;`,
    `CREATE TRIGGER trg_od_loans_updated_at BEFORE UPDATE ON public.jccb_od_loans FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();`,

    // 4. Gold Rates Table & Trigger
    `CREATE TABLE IF NOT EXISTS public.jccb_gold_rates (
      id TEXT PRIMARY KEY,
      date_str TEXT,
      rate NUMERIC,
      rate_date DATE DEFAULT CURRENT_DATE,
      rate_22k NUMERIC,
      rate_24k NUMERIC,
      set_by TEXT,
      payload JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    `ALTER TABLE public.jccb_gold_rates ADD COLUMN IF NOT EXISTS date_str TEXT;`,
    `ALTER TABLE public.jccb_gold_rates ADD COLUMN IF NOT EXISTS rate NUMERIC;`,
    `ALTER TABLE public.jccb_gold_rates ADD COLUMN IF NOT EXISTS rate_date DATE DEFAULT CURRENT_DATE;`,
    `ALTER TABLE public.jccb_gold_rates ADD COLUMN IF NOT EXISTS rate_22k NUMERIC;`,
    `ALTER TABLE public.jccb_gold_rates ADD COLUMN IF NOT EXISTS rate_24k NUMERIC;`,
    `ALTER TABLE public.jccb_gold_rates ADD COLUMN IF NOT EXISTS set_by TEXT;`,
    `ALTER TABLE public.jccb_gold_rates ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;`,
    `ALTER TABLE public.jccb_gold_rates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,
    `DROP TRIGGER IF EXISTS trg_gold_rates_updated_at ON public.jccb_gold_rates;`,
    `CREATE TRIGGER trg_gold_rates_updated_at BEFORE UPDATE ON public.jccb_gold_rates FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();`,

    // 5. Gold Settings Table & Trigger
    `CREATE TABLE IF NOT EXISTS public.jccb_gold_settings (
      key TEXT PRIMARY KEY,
      id TEXT,
      setting_key TEXT,
      setting_value JSONB,
      payload JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    `ALTER TABLE public.jccb_gold_settings ADD COLUMN IF NOT EXISTS id TEXT;`,
    `ALTER TABLE public.jccb_gold_settings ADD COLUMN IF NOT EXISTS setting_key TEXT;`,
    `ALTER TABLE public.jccb_gold_settings ADD COLUMN IF NOT EXISTS setting_value JSONB;`,
    `ALTER TABLE public.jccb_gold_settings ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;`,
    `ALTER TABLE public.jccb_gold_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,
    `DROP TRIGGER IF EXISTS trg_gold_settings_updated_at ON public.jccb_gold_settings;`,
    `CREATE TRIGGER trg_gold_settings_updated_at BEFORE UPDATE ON public.jccb_gold_settings FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();`,

    // 6. Gold Valuers Directory Table & Indexes & Trigger
    `CREATE TABLE IF NOT EXISTS public.jccb_gold_valuers (
      id TEXT PRIMARY KEY,
      name TEXT,
      valuer_name TEXT,
      license_no TEXT,
      phone TEXT,
      branch_code TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      payload JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    `ALTER TABLE public.jccb_gold_valuers ADD COLUMN IF NOT EXISTS name TEXT;`,
    `ALTER TABLE public.jccb_gold_valuers ADD COLUMN IF NOT EXISTS valuer_name TEXT;`,
    `ALTER TABLE public.jccb_gold_valuers ADD COLUMN IF NOT EXISTS license_no TEXT;`,
    `ALTER TABLE public.jccb_gold_valuers ADD COLUMN IF NOT EXISTS phone TEXT;`,
    `ALTER TABLE public.jccb_gold_valuers ADD COLUMN IF NOT EXISTS branch_code TEXT;`,
    `ALTER TABLE public.jccb_gold_valuers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;`,
    `ALTER TABLE public.jccb_gold_valuers ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;`,
    `ALTER TABLE public.jccb_gold_valuers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,
    `CREATE INDEX IF NOT EXISTS idx_valuers_branch ON public.jccb_gold_valuers (branch_code);`,
    `CREATE INDEX IF NOT EXISTS idx_valuers_active ON public.jccb_gold_valuers (is_active);`,
    `DROP TRIGGER IF EXISTS trg_gold_valuers_updated_at ON public.jccb_gold_valuers;`,
    `CREATE TRIGGER trg_gold_valuers_updated_at BEFORE UPDATE ON public.jccb_gold_valuers FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();`,

    // 7. Gold Customers Master Table & Indexes & Trigger
    `CREATE TABLE IF NOT EXISTS public.jccb_gold_customers (
      id TEXT PRIMARY KEY,
      name TEXT,
      customer_name TEXT,
      phone TEXT,
      branch_code TEXT,
      aadhaar_no TEXT,
      pan_no TEXT,
      payload JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    `ALTER TABLE public.jccb_gold_customers ADD COLUMN IF NOT EXISTS name TEXT;`,
    `ALTER TABLE public.jccb_gold_customers ADD COLUMN IF NOT EXISTS customer_name TEXT;`,
    `ALTER TABLE public.jccb_gold_customers ADD COLUMN IF NOT EXISTS phone TEXT;`,
    `ALTER TABLE public.jccb_gold_customers ADD COLUMN IF NOT EXISTS branch_code TEXT;`,
    `ALTER TABLE public.jccb_gold_customers ADD COLUMN IF NOT EXISTS aadhaar_no TEXT;`,
    `ALTER TABLE public.jccb_gold_customers ADD COLUMN IF NOT EXISTS pan_no TEXT;`,
    `ALTER TABLE public.jccb_gold_customers ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;`,
    `ALTER TABLE public.jccb_gold_customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,
    `CREATE INDEX IF NOT EXISTS idx_customers_branch ON public.jccb_gold_customers (branch_code);`,
    `CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.jccb_gold_customers (phone);`,
    `DROP TRIGGER IF EXISTS trg_gold_customers_updated_at ON public.jccb_gold_customers;`,
    `CREATE TRIGGER trg_gold_customers_updated_at BEFORE UPDATE ON public.jccb_gold_customers FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();`,

    // 8. Gold Branches Table & Seeds & Trigger
    `CREATE TABLE IF NOT EXISTS public.jccb_gold_branches (
      code TEXT PRIMARY KEY,
      branch_code TEXT,
      name TEXT,
      branch_name TEXT,
      branch_name_gu TEXT,
      is_head_office BOOLEAN DEFAULT FALSE,
      payload JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    `ALTER TABLE public.jccb_gold_branches ADD COLUMN IF NOT EXISTS branch_code TEXT;`,
    `ALTER TABLE public.jccb_gold_branches ADD COLUMN IF NOT EXISTS name TEXT;`,
    `ALTER TABLE public.jccb_gold_branches ADD COLUMN IF NOT EXISTS branch_name TEXT;`,
    `ALTER TABLE public.jccb_gold_branches ADD COLUMN IF NOT EXISTS branch_name_gu TEXT;`,
    `ALTER TABLE public.jccb_gold_branches ADD COLUMN IF NOT EXISTS is_head_office BOOLEAN DEFAULT FALSE;`,
    `ALTER TABLE public.jccb_gold_branches ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;`,
    `ALTER TABLE public.jccb_gold_branches ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,
    `DROP TRIGGER IF EXISTS trg_gold_branches_updated_at ON public.jccb_gold_branches;`,
    `CREATE TRIGGER trg_gold_branches_updated_at BEFORE UPDATE ON public.jccb_gold_branches FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();`,
    `INSERT INTO public.jccb_gold_branches (code, branch_code, name, branch_name, is_head_office, payload)
     VALUES ('99', '99', '99 HEAD OFFICE', 'HEAD OFFICE', TRUE, '{"code":"99","name":"99 HEAD OFFICE","isHO":true}'::jsonb),
            ('01', '01', '01 AZADCHOWK', 'AZADCHOWK', FALSE, '{"code":"01","name":"01 AZADCHOWK","isHO":false}'::jsonb),
            ('02', '02', '02 JOSHIPARA', 'JOSHIPARA', FALSE, '{"code":"02","name":"02 JOSHIPARA","isHO":false}'::jsonb)
     ON CONFLICT (code) DO NOTHING;`,

    // 9. Deleted Records Ledger Table & Indexes
    `CREATE TABLE IF NOT EXISTS public.jccb_deleted_records (
      id TEXT PRIMARY KEY,
      module TEXT,
      record_id TEXT,
      table_name TEXT,
      branch_code TEXT,
      deleted_by TEXT,
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    `ALTER TABLE public.jccb_deleted_records ADD COLUMN IF NOT EXISTS module TEXT;`,
    `ALTER TABLE public.jccb_deleted_records ADD COLUMN IF NOT EXISTS record_id TEXT;`,
    `ALTER TABLE public.jccb_deleted_records ADD COLUMN IF NOT EXISTS table_name TEXT;`,
    `ALTER TABLE public.jccb_deleted_records ADD COLUMN IF NOT EXISTS branch_code TEXT;`,
    `ALTER TABLE public.jccb_deleted_records ADD COLUMN IF NOT EXISTS deleted_by TEXT;`,
    `ALTER TABLE public.jccb_deleted_records ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();`,
    `CREATE INDEX IF NOT EXISTS idx_deleted_at ON public.jccb_deleted_records (deleted_at);`,

    // 10. Branch Activity & Heartbeat Log Table & Indexes
    `CREATE TABLE IF NOT EXISTS public.jccb_branch_activity (
      id TEXT PRIMARY KEY,
      branch_code TEXT NOT NULL,
      device_id TEXT,
      user_name TEXT,
      action TEXT,
      module TEXT,
      record_id TEXT,
      summary TEXT,
      payload JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    `ALTER TABLE public.jccb_branch_activity ADD COLUMN IF NOT EXISTS device_id TEXT;`,
    `ALTER TABLE public.jccb_branch_activity ADD COLUMN IF NOT EXISTS user_name TEXT;`,
    `ALTER TABLE public.jccb_branch_activity ADD COLUMN IF NOT EXISTS record_id TEXT;`,
    `ALTER TABLE public.jccb_branch_activity ADD COLUMN IF NOT EXISTS summary TEXT;`,
    `ALTER TABLE public.jccb_branch_activity ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;`,
    `CREATE INDEX IF NOT EXISTS idx_activity_branch ON public.jccb_branch_activity (branch_code);`,
    `CREATE INDEX IF NOT EXISTS idx_activity_created ON public.jccb_branch_activity (created_at);`,
    `CREATE INDEX IF NOT EXISTS idx_activity_module ON public.jccb_branch_activity (module);`
  ];

  console.log(`Executing ${migrationSteps.length} migration steps...`);
  let successCount = 0;

  for (let i = 0; i < migrationSteps.length; i++) {
    const stmt = migrationSteps[i];
    const preview = stmt.replace(/\s+/g, ' ').slice(0, 75);
    try {
      await executeSql(stmt);
      console.log(`[${i + 1}/${migrationSteps.length}] ✓ Success: ${preview}...`);
      successCount++;
    } catch (err) {
      console.error(`[${i + 1}/${migrationSteps.length}] ❌ Error on: ${preview}...`, err.message);
    }
  }

  console.log(`\n=======================================================`);
  console.log(`  Migration Summary: ${successCount}/${migrationSteps.length} executed successfully!`);
  console.log(`=======================================================\n`);

  // Verification 1: Tables
  console.log("Verified Public Tables in Neon:");
  const tables = await executeSql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'jccb_%' ORDER BY table_name;");
  console.table(tables.rows);

  // Verification 2: Triggers
  console.log("\nVerified Triggers in Neon:");
  const triggers = await executeSql("SELECT event_object_table, trigger_name FROM information_schema.triggers WHERE trigger_schema = 'public' ORDER BY event_object_table;");
  console.table(triggers.rows);

  // Verification 3: Indexes
  console.log("\nVerified Indexes in Neon:");
  const indexes = await executeSql("SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename LIKE 'jccb_%' ORDER BY tablename, indexname;");
  console.table(indexes.rows);

  // Verification 4: Gold Loans count
  const goldCount = await executeSql("SELECT count(*) as count FROM jccb_gold_loans;");
  console.log(`\nExisting Live Gold Loans in Database: ${goldCount.rows[0].count} records preserved.`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
