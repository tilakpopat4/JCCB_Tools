# The Junagadh Commercial Co-Operative Bank Ltd. (TJCCB)
## Master Context & Comprehensive System Architecture Documentation

**Document Version**: `2.0.0`  
**Last Updated**: `2026-09-07`  
**Author / Chief Architect**: Rahul Popat (+91 9898180810)  
**Database Provider**: Neon Serverless PostgreSQL (Singapore / `ap-southeast-1`)  
**Target Environment**: Multi-Branch Core Banking Assist Suite (Head Office + 18 Branch Terminals)

---

## 1. Executive Summary & Purpose

**JCCB Tools Suite** is an enterprise-grade banking assist platform designed for **The Junagadh Commercial Co-Operative Bank Ltd.** It integrates 3 major banking applications under a single unified portal with **100% real-time cross-device synchronization**, powered by **Neon Serverless PostgreSQL**.

### Core Portals Included:
1. 🪙 **Gold Loan Portal** (`/gold-jccb-final-main`): Complete gold loan appraisal, interest calculation, 3-in-1 cash credit voucher generation, KFS, promissory notes, and valuer management.
2. 🏦 **Fixed Deposit (FD) Portal** (`/fd-module`): 4-page A4 application generator, dynamic Gujarati/English words converter, multi-joint applicant KYC, DA-1 nomination, and interest rate slab calculator.
3. 💳 **Overdraft (OD) Against FD Portal** (`/od-module`): Overdraft credit limit sanctioning against pledged fixed deposit receipts, Demand Promissory (DP) notes, Composite Letter of Lien (Clauses 1 to 9), and sanction memorandums.
4. 🚀 **Central Launcher & Merger** (`/merger.html` & `/index.html`): Central authentication gateway for 18 branches and Head Office with live database connectivity and quick navigation.
5. 🛡️ **Central Management & Audit Console** (`/gold-jccb-final-main/management`): Real-time device monitoring, audit trails, system health telemetry, and live loan disbursements tracker.

---

## 2. Cloud Database Architecture (Neon PostgreSQL)

The system is configured with **Neon Serverless PostgreSQL** hosted in the **Singapore (`ap-southeast-1`)** region.

### Database Connection Configuration:
- **Connection String**: `postgresql://neondb_owner:npg_kF5qI9QzSacN@ep-floral-frog-b3s0jrlo-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
- **Direct HTTP SQL Endpoint**: `https://ep-floral-frog-b3s0jrlo-pooler.c-4.ap-southeast-1.aws.neon.tech/sql`
- **Local / Serverless Proxy**: `/api/sql` via `server.js`

### Zero Data Loss Dual-Write Architecture
Every database table is engineered with:
1. **Indexed Structured Columns**: For rapid multi-branch filtering, queries, date-range sorting, and aggregation.
2. **`payload JSONB NOT NULL`**: Stores the complete raw object representing 100% of form inputs, metadata, arrays (e.g. ornaments, joint applicants, pledged receipts), and base64 images. No field is ever discarded or truncated.

---

## 3. Database Schema & Complete Field Inventory

### Table 1: `public.jccb_gold_loans`
```sql
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gold_branch ON jccb_gold_loans(branch_code);
CREATE INDEX IF NOT EXISTS idx_gold_loan_no ON jccb_gold_loans(loan_no);
```
- **Key Fields in Payload**: `id`, `proposalNo`, `accountNo`, `branchCode`, `branchName`, `loanDate`, `customerId`, `customerName`, `fatherSpouseName`, `address`, `mobileNo`, `schemeName`, `sanctionAmount`, `interestRate`, `tenureMonths`, `totalValuation`, `totalGrossWeight`, `totalNetWeight`, `totalItems`, `valuerName`, `valuerId`, `ornaments` (item description, count, gross wt, net wt, purity, valuation), `processingFee`, `appraiserCharge`, `stampDuty`, `totalDeductions`, `netDisbursement`, `applicantPhoto` (base64), `ornamentPhoto` (base64), `status`, `createdAt`, `updatedAt`.

---

### Table 2: `public.jccb_fd_forms`
```sql
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fd_branch ON jccb_fd_forms(branch_code);
CREATE INDEX IF NOT EXISTS idx_fd_form_no ON jccb_fd_forms(form_no);
```
- **Key Fields in Payload**: `formRefNo`, `formDate`, `branchName`, `branchCode`, `enteredBy`, `authorizedBy`, `firstCustomerId`, `firstFullName`, `firstRelativeName`, `firstDob`, `firstAge`, `firstGender`, `firstMobileNo`, `firstEmail`, `firstPan`, `firstAadharNo`, `firstAddress`, `firstFlatNo`, `firstStreet`, `firstCity`, `firstPincode`, `firstOccupation`, `firstMaritalStatus`, `second_applicant`, `third_applicant`, `fourth_applicant`, `typeOfAccount`, `typeOfDeposit`, `deposit1Amount`, `deposit1AmountWords`, `deposit1AmountWordsGuj`, `deposit1Years`, `deposit1Months`, `deposit1Days`, `tenure`, `deposit1Roi`, `deposit1MaturityAmount`, `deposit1MaturityDate`, `seniorCitizenBenefit`, `bulkDepositBenefit`, `interestPaymentMode`, `interestCreditAccNo`, `modeOfOperation`, `renewalInstruction`, `nomineeRegistered`, `nominee1Name`, `nominee1Relation`, `nominee1Age`, `nominee1Dob`, `nominee1Address`, `nomineeGuardianName`, `paymentMode`, `paymentChequeNo`, `sourceOfFunds`, `identityProof`, `addressProof`, `data` (Full DOM Input Dictionary).

---

### Table 3: `public.jccb_od_loans`
```sql
CREATE TABLE IF NOT EXISTS public.jccb_od_loans (
    id TEXT PRIMARY KEY,
    branch_code TEXT NOT NULL,
    account_no TEXT,
    customer_name TEXT,
    limit_amount NUMERIC,
    fd_receipt_no TEXT,
    status TEXT DEFAULT 'SANCTIONED',
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_od_branch ON jccb_od_loans(branch_code);
CREATE INDEX IF NOT EXISTS idx_od_acc_no ON jccb_od_loans(account_no);
```
- **Key Fields in Payload**: `id`, `accountNo`, `branchCode`, `branchName`, `loanDate`, `status`, `loanPurpose`, `savingAccNo`, `applicant1` (`id`, `name`, `address`, `mobile`, `pan`, `aadhaar`), `jointApplicants` (Array of Co-Borrowers), `loanAmount`, `loanAmountWordsGuj`, `loanAmountWordsEng`, `interestRate`, `marginPercent`, `drawingPower`, `fdReceipts` (`certNo`, `accountNo`, `amount`, `roi`, `issueDate`, `maturityDate`, `maturityAmount`, `holderName`, `lienAmount`, `pledgedPercent`), `demandPromissoryNote`, `letterOfLien` (Clauses 1 to 9), `sanctionMemo`, `createdAt`, `updatedAt`.

---

### Supporting Master Tables
- **`jccb_gold_rates`**: Daily 22K and 24K valuation rates per gram.
- **`jccb_gold_settings`**: Global configuration, rules, interest slabs, printer setups.
- **`jccb_gold_valuers`**: Certified gold appraisers directory.
- **`jccb_gold_customers`**: Unified bank customer index.
- **`jccb_gold_branches`**: Master list of all 18 branch codes & Gujarati names.
- **`jccb_deleted_records`**: Cross-device deletion broadcast log.
- **`jccb_branch_activity`**: Audit trail and branch presence heartbeat log.

---

## 4. Real-Time Multi-Device Sync & Global Reflection

### 1. Instant Write & Broadcast
- When a record is added, edited, or deleted on any device (PC, tablet, mobile), it immediately saves locally and synchronizes to **Neon Serverless PostgreSQL** via direct HTTPS query with automatic fallback to `/api/sql`.

### 2. Multi-Device Polling & Non-Destructive Merge
- Each portal runs an automatic background synchronization loop every **10 seconds**.
- Devices compare local records against remote cloud state using timestamps (`updatedAt`).
- Newer records or missing entries from other branches are merged automatically without refreshing or interrupting the user.

### 3. Cross-Device Delete Broadcast
- When a loan or form is cancelled/deleted on one computer, its ID is recorded in `jccb_deleted_records`.
- All other devices check this ledger and purge the record locally within 10-15 seconds.

---

## 5. Head Office & Multi-Branch Visibility Model

### Role Permissions:
- **`99 HEAD OFFICE` (Super Admin)**:
  - Can view **100% of all records** across all 18 branches (`01` through `18` and `99`).
  - Access to the **Central Data Storage Center** (Master Excel Export & Restore).
  - Access to the **Security & Audit Console** (`management/index.html`).
- **Branch Users (`01` to `18`)**:
  - Automatically locked to their branch code (e.g. `01 AZADCHOWK`, `02 JOSHIPARA`).
  - Read/write access strictly scoped to their respective branch.

---

## 6. Central Backup & Restore Engine (`central-backup.js`)

- **Master Workbook (`.xlsx`)**: Generates a consolidated multi-sheet workbook containing:
  1. `GOLD_LOANS`
  2. `GOLD_CUSTOMERS`
  3. `GOLD_VALUERS`
  4. `FD_ACCOUNTS`
  5. `FD_RATES`
  6. `OD_LOANS`
  7. `BACKUP_METADATA`
- **Individual Module Exports**: Direct download of `.xlsx` or `.csv` (with UTF-8 BOM for full Gujarati font compatibility).
- **Smart Restore Engine**: Auto-detects uploaded file type (`.xlsx`, `.csv`, `.json`), presents record statistics, and allows Selective Scope (`All`, `Gold`, `FD`, `OD`) with `Merge` or `Replace` modes.

---

## 7. Project File Structure

```
JCCB_Tools/
├── MASTER_CONTEXT_DOCUMENTATION.md # Master context & architecture document
├── index.html                      # Central Login Gateway (Tailwind CSS)
├── merger.html                     # Portal Launcher & Master Backup Center
├── postgres-sync.js                # Core Neon PostgreSQL Cloud Sync Engine
├── central-backup.js               # Universal Backup & Restore Engine (SheetJS)
├── schema.sql                      # Complete SQL DDL Schema Definition
├── init-neon-db.js                 # Automatic Neon Database Table Initializer
├── server.js                       # Local HTTP & CORS-Free Proxy Server
├── build.js                        # Production Distribution Packager
├── package.json                    # Project metadata & npm scripts
├── vercel.json                     # Vercel Deployment Configuration
├── jccb-logo.png                   # Official Bank Crest / Emblem
│
├── gold-jccb-final-main/           # 🪙 Gold Loan Portal
│   ├── index.html                  # Main Gold Loan Application
│   ├── app_gold.js                 # Gold Loan Calculation & UI Controller
│   ├── neon-service.js             # Neon Cloud Adapter for Gold Loan
│   ├── styles.css                  # High-Fidelity Banking Theme
│   ├── management.html             # Management & Audit Center (Root link)
│   ├── management.js               # Audit & Device Presence Controller
│   └── management/
│       └── index.html              # Management Console Standalone View
│
├── fd-module/                      # 🏦 Fixed Deposit (FD) Portal
│   ├── index.html                  # 4-Page A4 FD Application & Register
│   ├── app.js                      # FD Calculations, KYC & Neon Sync
│   ├── bank_emblem.js              # Vector Emblem Renderer
│   └── styles.css                  # Print & Form Layout Styling
│
├── od-module/                      # 💳 Overdraft (OD) Against FD Portal
│   ├── index.html                  # OD Application, DP Note & Lien Form
│   ├── app_new.js                  # OD Sanction Engine & Neon Sync
│   ├── bank_emblem.js              # Vector Emblem Renderer
│   └── styles.css                  # Document & Register Styling
│
└── dist/                           # Compiled Production Bundle for Deployment
```

---

## 8. Summary of Milestones Achieved

1. ✅ **100% Pure Neon PostgreSQL Integration**: Successfully connected all 3 portals to Singapore-hosted Neon Serverless PostgreSQL.
2. ✅ **Zero Data Loss Guarantee**: Implemented `payload JSONB` storage preserving 100% of fields, joint names, KYC details, receipt arrays, and photos.
3. ✅ **Real-Time Cross-Device Sync**: Auto-polling loops running every 10 seconds across all devices for instant live data propagation.
4. ✅ **Head Office 100% Visibility**: Head Office (`99`) can monitor and query all branch activities and loan entries across Gujarat.
5. ✅ **Enterprise Backup & Restore**: Universal SheetJS engine with single-click master multi-sheet Excel backup and restore.
6. ✅ **Production Verification**: Database tables verified, schema verified, and distribution bundle (`dist/`) generated.
