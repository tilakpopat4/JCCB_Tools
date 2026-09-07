-- ============================================================================
-- JCCB Tools Suite — Complete Database Schema
-- The Junagadh Commercial Co-Operative Bank Ltd. (TJCCB)
-- Target: Neon Serverless PostgreSQL (ap-southeast-1)
-- Doc version reference: 2.0.0 (2026-09-07)
-- ============================================================================
-- HOW TO USE:
--   1. Open your Neon project -> SQL Editor (or `psql` via the connection string).
--   2. Paste this entire file and run it once. It is fully idempotent —
--      safe to re-run any time without duplicating tables/indexes/triggers.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 0. Extensions & shared helper function
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid(), if you ever need it

-- Generic trigger: keeps updated_at fresh on every UPDATE so the
-- 10-second polling sync loop always sees an accurate timestamp.
CREATE OR REPLACE FUNCTION jccb_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. jccb_gold_loans — Gold Loan Portal
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_gold_loans (
    id               TEXT PRIMARY KEY,
    branch_code      TEXT NOT NULL,
    loan_no          TEXT,
    customer_name    TEXT,
    phone            TEXT,
    sanction_amount  NUMERIC,
    sanction_date    TEXT,
    status           TEXT DEFAULT 'ACTIVE',
    payload          JSONB NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gold_branch    ON public.jccb_gold_loans (branch_code);
CREATE INDEX IF NOT EXISTS idx_gold_loan_no   ON public.jccb_gold_loans (loan_no);
CREATE INDEX IF NOT EXISTS idx_gold_status    ON public.jccb_gold_loans (status);
CREATE INDEX IF NOT EXISTS idx_gold_updated   ON public.jccb_gold_loans (updated_at);
CREATE INDEX IF NOT EXISTS idx_gold_customer  ON public.jccb_gold_loans (customer_name);
CREATE INDEX IF NOT EXISTS idx_gold_payload_gin ON public.jccb_gold_loans USING GIN (payload);

DROP TRIGGER IF EXISTS trg_gold_loans_updated_at ON public.jccb_gold_loans;
CREATE TRIGGER trg_gold_loans_updated_at
    BEFORE UPDATE ON public.jccb_gold_loans
    FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();

-- ----------------------------------------------------------------------------
-- 2. jccb_fd_forms — Fixed Deposit Portal
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_fd_forms (
    id               TEXT PRIMARY KEY,
    branch_code      TEXT NOT NULL,
    form_no          TEXT,
    customer_name    TEXT,
    deposit_amount   NUMERIC,
    interest_rate    NUMERIC,
    tenure_months    INTEGER,
    status           TEXT DEFAULT 'COMPLETED',
    payload          JSONB NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fd_branch      ON public.jccb_fd_forms (branch_code);
CREATE INDEX IF NOT EXISTS idx_fd_form_no     ON public.jccb_fd_forms (form_no);
CREATE INDEX IF NOT EXISTS idx_fd_status      ON public.jccb_fd_forms (status);
CREATE INDEX IF NOT EXISTS idx_fd_updated     ON public.jccb_fd_forms (updated_at);
CREATE INDEX IF NOT EXISTS idx_fd_customer    ON public.jccb_fd_forms (customer_name);
CREATE INDEX IF NOT EXISTS idx_fd_payload_gin ON public.jccb_fd_forms USING GIN (payload);

DROP TRIGGER IF EXISTS trg_fd_forms_updated_at ON public.jccb_fd_forms;
CREATE TRIGGER trg_fd_forms_updated_at
    BEFORE UPDATE ON public.jccb_fd_forms
    FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. jccb_od_loans — Overdraft Against FD Portal
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_od_loans (
    id               TEXT PRIMARY KEY,
    branch_code      TEXT NOT NULL,
    account_no       TEXT,
    customer_name    TEXT,
    limit_amount     NUMERIC,
    fd_receipt_no    TEXT,
    status           TEXT DEFAULT 'SANCTIONED',
    payload          JSONB NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_od_branch      ON public.jccb_od_loans (branch_code);
CREATE INDEX IF NOT EXISTS idx_od_acc_no      ON public.jccb_od_loans (account_no);
CREATE INDEX IF NOT EXISTS idx_od_status      ON public.jccb_od_loans (status);
CREATE INDEX IF NOT EXISTS idx_od_updated     ON public.jccb_od_loans (updated_at);
CREATE INDEX IF NOT EXISTS idx_od_fd_receipt  ON public.jccb_od_loans (fd_receipt_no);
CREATE INDEX IF NOT EXISTS idx_od_payload_gin ON public.jccb_od_loans USING GIN (payload);

DROP TRIGGER IF EXISTS trg_od_loans_updated_at ON public.jccb_od_loans;
CREATE TRIGGER trg_od_loans_updated_at
    BEFORE UPDATE ON public.jccb_od_loans
    FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. jccb_gold_rates — Daily 22K / 24K valuation rates
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_gold_rates (
    id            TEXT PRIMARY KEY,
    rate_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    rate_22k      NUMERIC NOT NULL,
    rate_24k      NUMERIC NOT NULL,
    set_by        TEXT,
    payload       JSONB DEFAULT '{}'::jsonb,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_gold_rates_date ON public.jccb_gold_rates (rate_date);

DROP TRIGGER IF EXISTS trg_gold_rates_updated_at ON public.jccb_gold_rates;
CREATE TRIGGER trg_gold_rates_updated_at
    BEFORE UPDATE ON public.jccb_gold_rates
    FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. jccb_gold_settings — Global config, interest slabs, printer setup
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_gold_settings (
    id            TEXT PRIMARY KEY,
    setting_key   TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_gold_settings_updated_at ON public.jccb_gold_settings;
CREATE TRIGGER trg_gold_settings_updated_at
    BEFORE UPDATE ON public.jccb_gold_settings
    FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();

-- ----------------------------------------------------------------------------
-- 6. jccb_gold_valuers — Certified gold appraisers directory
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_gold_valuers (
    id            TEXT PRIMARY KEY,
    valuer_name   TEXT NOT NULL,
    license_no    TEXT,
    phone         TEXT,
    branch_code   TEXT,
    is_active     BOOLEAN DEFAULT TRUE,
    payload       JSONB DEFAULT '{}'::jsonb,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_valuers_branch ON public.jccb_gold_valuers (branch_code);
CREATE INDEX IF NOT EXISTS idx_valuers_active ON public.jccb_gold_valuers (is_active);

DROP TRIGGER IF EXISTS trg_gold_valuers_updated_at ON public.jccb_gold_valuers;
CREATE TRIGGER trg_gold_valuers_updated_at
    BEFORE UPDATE ON public.jccb_gold_valuers
    FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();

-- ----------------------------------------------------------------------------
-- 7. jccb_gold_customers — Unified bank customer index
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_gold_customers (
    id             TEXT PRIMARY KEY,
    customer_name  TEXT NOT NULL,
    phone          TEXT,
    branch_code    TEXT,
    aadhaar_no     TEXT,
    pan_no         TEXT,
    payload        JSONB DEFAULT '{}'::jsonb,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_branch ON public.jccb_gold_customers (branch_code);
CREATE INDEX IF NOT EXISTS idx_customers_phone  ON public.jccb_gold_customers (phone);
CREATE INDEX IF NOT EXISTS idx_customers_name   ON public.jccb_gold_customers (customer_name);

DROP TRIGGER IF EXISTS trg_gold_customers_updated_at ON public.jccb_gold_customers;
CREATE TRIGGER trg_gold_customers_updated_at
    BEFORE UPDATE ON public.jccb_gold_customers
    FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();

-- ----------------------------------------------------------------------------
-- 8. jccb_gold_branches — Master list of 18 branch codes + names
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_gold_branches (
    branch_code    TEXT PRIMARY KEY,
    branch_name    TEXT NOT NULL,
    branch_name_gu TEXT,
    is_head_office BOOLEAN DEFAULT FALSE,
    payload        JSONB DEFAULT '{}'::jsonb,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_gold_branches_updated_at ON public.jccb_gold_branches;
CREATE TRIGGER trg_gold_branches_updated_at
    BEFORE UPDATE ON public.jccb_gold_branches
    FOR EACH ROW EXECUTE FUNCTION jccb_set_updated_at();

-- Seed the known branch codes (01–18 + Head Office 99) — safe to re-run.
INSERT INTO public.jccb_gold_branches (branch_code, branch_name, is_head_office)
VALUES
    ('99', 'HEAD OFFICE', TRUE),
    ('01', 'AZADCHOWK', FALSE),
    ('02', 'JOSHIPARA', FALSE)
ON CONFLICT (branch_code) DO NOTHING;
-- Add branches 03–18 the same way once you have their names.

-- ----------------------------------------------------------------------------
-- 9. jccb_deleted_records — Cross-device deletion broadcast log
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_deleted_records (
    id           TEXT PRIMARY KEY,
    record_id    TEXT NOT NULL,
    table_name   TEXT NOT NULL,
    branch_code  TEXT,
    deleted_by   TEXT,
    deleted_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deleted_table   ON public.jccb_deleted_records (table_name);
CREATE INDEX IF NOT EXISTS idx_deleted_record  ON public.jccb_deleted_records (record_id);
CREATE INDEX IF NOT EXISTS idx_deleted_at      ON public.jccb_deleted_records (deleted_at);

-- ----------------------------------------------------------------------------
-- 10. jccb_branch_activity — Audit trail & branch presence heartbeat
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jccb_branch_activity (
    id           TEXT PRIMARY KEY,
    branch_code  TEXT NOT NULL,
    device_id    TEXT,
    user_name    TEXT,
    action       TEXT,
    module       TEXT,
    payload      JSONB DEFAULT '{}'::jsonb,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_branch  ON public.jccb_branch_activity (branch_code);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.jccb_branch_activity (created_at);
CREATE INDEX IF NOT EXISTS idx_activity_module  ON public.jccb_branch_activity (module);

COMMIT;

-- ============================================================================
-- Verification query — run separately after the block above to confirm
-- everything was created:
--
--   SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public' AND table_name LIKE 'jccb_%'
--   ORDER BY table_name;
-- ============================================================================
