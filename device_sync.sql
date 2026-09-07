-- ============================================================================
-- JCCB Tools Suite — Device Sync SQL (Write + Poll + Delete Broadcast)
-- For use in neon-service.js / postgres-sync.js via node-postgres ($1, $2...)
-- Covers: Gold Loan, FD, OD modules — same pattern, 3 tables.
-- ============================================================================
-- THE CORE PATTERN (per module):
--   1. UPSERT on save — INSERT ... ON CONFLICT (id) DO UPDATE, never a plain
--      INSERT. If a device edits an existing record, plain INSERT will
--      throw a PK violation and the save silently fails on retry logic.
--   2. POLL on a timer (every 10s) — SELECT everything changed since the
--      device's last known timestamp, scoped by branch UNLESS the user
--      is Head Office (99), in which case fetch every branch.
--   3. DELETE BROADCAST — never DELETE a row directly. Log the deletion to
--      jccb_deleted_records, then have every device's poll loop also check
--      that table and purge locally.
-- ============================================================================


-- ============================================================================
-- 1. GOLD LOAN MODULE — jccb_gold_loans
-- ============================================================================

-- 1a. UPSERT on save (call this from the Gold Loan save handler)
-- Params: $1=id, $2=branch_code, $3=loan_no, $4=customer_name, $5=phone,
--         $6=sanction_amount, $7=sanction_date, $8=status, $9=payload(JSONB)
INSERT INTO jccb_gold_loans
    (id, branch_code, loan_no, customer_name, phone, sanction_amount, sanction_date, status, payload, updated_at)
VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
ON CONFLICT (id) DO UPDATE SET
    branch_code      = EXCLUDED.branch_code,
    loan_no          = EXCLUDED.loan_no,
    customer_name    = EXCLUDED.customer_name,
    phone            = EXCLUDED.phone,
    sanction_amount  = EXCLUDED.sanction_amount,
    sanction_date    = EXCLUDED.sanction_date,
    status           = EXCLUDED.status,
    payload          = EXCLUDED.payload,
    updated_at       = NOW();

-- 1b. POLL — branch user (params: $1 = branch_code, $2 = last_synced_at)
SELECT id, branch_code, loan_no, customer_name, phone, sanction_amount,
       sanction_date, status, payload, updated_at
FROM jccb_gold_loans
WHERE branch_code = $1
  AND updated_at > $2
ORDER BY updated_at ASC;

-- 1c. POLL — Head Office (params: $1 = last_synced_at). No branch_code filter at all.
SELECT id, branch_code, loan_no, customer_name, phone, sanction_amount,
       sanction_date, status, payload, updated_at
FROM jccb_gold_loans
WHERE updated_at > $1
ORDER BY updated_at ASC;


-- ============================================================================
-- 2. FD MODULE — jccb_fd_forms
-- ============================================================================

-- 2a. UPSERT on save
-- Params: $1=id, $2=branch_code, $3=form_no, $4=customer_name,
--         $5=deposit_amount, $6=interest_rate, $7=tenure_months,
--         $8=status, $9=payload(JSONB)
INSERT INTO jccb_fd_forms
    (id, branch_code, form_no, customer_name, deposit_amount, interest_rate, tenure_months, status, payload, updated_at)
VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
ON CONFLICT (id) DO UPDATE SET
    branch_code     = EXCLUDED.branch_code,
    form_no         = EXCLUDED.form_no,
    customer_name   = EXCLUDED.customer_name,
    deposit_amount  = EXCLUDED.deposit_amount,
    interest_rate   = EXCLUDED.interest_rate,
    tenure_months   = EXCLUDED.tenure_months,
    status          = EXCLUDED.status,
    payload         = EXCLUDED.payload,
    updated_at      = NOW();

-- 2b. POLL — branch user (params: $1 = branch_code, $2 = last_synced_at)
SELECT id, branch_code, form_no, customer_name, deposit_amount, interest_rate,
       tenure_months, status, payload, updated_at
FROM jccb_fd_forms
WHERE branch_code = $1
  AND updated_at > $2
ORDER BY updated_at ASC;

-- 2c. POLL — Head Office (params: $1 = last_synced_at)
SELECT id, branch_code, form_no, customer_name, deposit_amount, interest_rate,
       tenure_months, status, payload, updated_at
FROM jccb_fd_forms
WHERE updated_at > $1
ORDER BY updated_at ASC;


-- ============================================================================
-- 3. OD MODULE — jccb_od_loans
-- ============================================================================

-- 3a. UPSERT on save
-- Params: $1=id, $2=branch_code, $3=account_no, $4=customer_name,
--         $5=limit_amount, $6=fd_receipt_no, $7=status, $8=payload(JSONB)
INSERT INTO jccb_od_loans
    (id, branch_code, account_no, customer_name, limit_amount, fd_receipt_no, status, payload, updated_at)
VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
ON CONFLICT (id) DO UPDATE SET
    branch_code    = EXCLUDED.branch_code,
    account_no     = EXCLUDED.account_no,
    customer_name  = EXCLUDED.customer_name,
    limit_amount   = EXCLUDED.limit_amount,
    fd_receipt_no  = EXCLUDED.fd_receipt_no,
    status         = EXCLUDED.status,
    payload        = EXCLUDED.payload,
    updated_at     = NOW();

-- 3b. POLL — branch user (params: $1 = branch_code, $2 = last_synced_at)
SELECT id, branch_code, account_no, customer_name, limit_amount, fd_receipt_no,
       status, payload, updated_at
FROM jccb_od_loans
WHERE branch_code = $1
  AND updated_at > $2
ORDER BY updated_at ASC;

-- 3c. POLL — Head Office (params: $1 = last_synced_at)
SELECT id, branch_code, account_no, customer_name, limit_amount, fd_receipt_no,
       status, payload, updated_at
FROM jccb_od_loans
WHERE updated_at > $1
ORDER BY updated_at ASC;


-- ============================================================================
-- 4. DELETE BROADCAST — shared across all 3 modules
-- ============================================================================

-- 4a. Call this INSTEAD OF a raw DELETE, whenever a record is removed.
-- Params: $1=deletion log id (generate client-side, e.g. uuid),
--         $2=record_id (the deleted row's id), $3=table_name
--         ('jccb_gold_loans' | 'jccb_fd_forms' | 'jccb_od_loans'),
--         $4=branch_code, $5=deleted_by (username/device)
INSERT INTO jccb_deleted_records (id, record_id, table_name, branch_code, deleted_by, deleted_at)
VALUES ($1, $2, $3, $4, $5, NOW());

-- 4b. Then actually remove the row from its source table.
-- Params: $1 = record_id
DELETE FROM jccb_gold_loans WHERE id = $1;
-- (repeat against jccb_fd_forms / jccb_od_loans depending on table_name)

-- 4c. Every device's poll loop should ALSO run this, to purge locally cached
-- records that were deleted elsewhere. Params: $1 = table_name, $2 = last_synced_at
SELECT record_id
FROM jccb_deleted_records
WHERE table_name = $1
  AND deleted_at > $2
ORDER BY deleted_at ASC;


-- ============================================================================
-- 5. BRANCH ACTIVITY HEARTBEAT — optional but matches the doc's audit trail
-- ============================================================================
-- Call this on login, or on an interval, so management/audit console can see
-- which branches/devices are currently active.
-- Params: $1=id, $2=branch_code, $3=device_id, $4=user_name, $5=action,
--         $6=module ('gold'|'fd'|'od'), $7=payload(JSONB, optional metadata)
INSERT INTO jccb_branch_activity (id, branch_code, device_id, user_name, action, module, payload, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());


-- ============================================================================
-- 6. CLIENT-SIDE POLLING LOOP — pseudocode reference (JS, not SQL)
-- ============================================================================
-- Every 10 seconds, per module, per device:
--
--   let lastSyncedAt = localStorage.getItem('fd_last_synced_at') || '1970-01-01';
--   const isHeadOffice = (userBranch === '99');
--
--   const rows = isHeadOffice
--       ? await pollAllBranches('jccb_fd_forms', lastSyncedAt)   // query 2c
--       : await pollBranch('jccb_fd_forms', userBranch, lastSyncedAt); // query 2b
--
--   const deletions = await pollDeletions('jccb_fd_forms', lastSyncedAt); // query 4c
--
--   mergeIntoLocalStore(rows);
--   purgeLocally(deletions);
--   lastSyncedAt = new Date().toISOString();
--   localStorage.setItem('fd_last_synced_at', lastSyncedAt);
--
-- The critical bug class to check for: if `lastSyncedAt` is reset to "now"
-- on every poll (instead of persisted), a device will always ask for
-- "changes since right now" and get zero rows back — indistinguishable
-- from a sync failure, but caused entirely by a bad cursor.
-- ============================================================================
