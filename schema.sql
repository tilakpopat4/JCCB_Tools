-- ============================================================================
-- The Junagadh Commercial Co-Operative Bank Ltd. (JCCB)
-- PostgreSQL / Supabase Schema for Gold, FD, and OD Portals
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Bank Branches Master Table
CREATE TABLE IF NOT EXISTS public.jccb_branches (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT,
    name_guj TEXT,
    is_ho BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Gold Loans Table
CREATE TABLE IF NOT EXISTS public.jccb_gold_loans (
    id TEXT PRIMARY KEY,
    branch_code TEXT NOT NULL,
    loan_no TEXT,
    customer_name TEXT,
    phone TEXT,
    sanction_amount NUMERIC,
    sanction_date TEXT,
    status TEXT DEFAULT 'ACTIVE',
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Fixed Deposit (FD) Forms Table
CREATE TABLE IF NOT EXISTS public.jccb_fd_forms (
    id TEXT PRIMARY KEY,
    branch_code TEXT NOT NULL,
    form_no TEXT,
    customer_name TEXT,
    deposit_amount NUMERIC,
    interest_rate NUMERIC,
    tenure_months INTEGER,
    status TEXT DEFAULT 'COMPLETED',
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Overdraft (OD) Against FD Table
CREATE TABLE IF NOT EXISTS public.jccb_od_loans (
    id TEXT PRIMARY KEY,
    branch_code TEXT NOT NULL,
    account_no TEXT,
    customer_name TEXT,
    limit_amount NUMERIC,
    fd_receipt_no TEXT,
    status TEXT DEFAULT 'SANCTIONED',
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Branch Heartbeat & Activity Log Table
CREATE TABLE IF NOT EXISTS public.jccb_branch_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    branch_code TEXT NOT NULL,
    branch_name TEXT,
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    record_id TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Indexes for High-Speed Multi-Branch Queries
CREATE INDEX IF NOT EXISTS idx_gold_branch ON public.jccb_gold_loans(branch_code);
CREATE INDEX IF NOT EXISTS idx_gold_loan_no ON public.jccb_gold_loans(loan_no);
CREATE INDEX IF NOT EXISTS idx_fd_branch ON public.jccb_fd_forms(branch_code);
CREATE INDEX IF NOT EXISTS idx_od_branch ON public.jccb_od_loans(branch_code);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.jccb_branch_activity(created_at DESC);

-- 7. Enable Row Level Security (RLS) & Allow Anonymous Read/Write for Testing Phase
ALTER TABLE public.jccb_gold_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jccb_fd_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jccb_od_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jccb_branch_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for testing gold" ON public.jccb_gold_loans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for testing fd" ON public.jccb_fd_forms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for testing od" ON public.jccb_od_loans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for testing activity" ON public.jccb_branch_activity FOR ALL USING (true) WITH CHECK (true);

-- 8. Enable Realtime Publications for Live Head Office Updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.jccb_gold_loans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jccb_fd_forms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jccb_od_loans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jccb_branch_activity;
