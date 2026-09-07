/**
 * The Junagadh Commercial Co-Operative Bank Ltd.
 * Fixed Deposit Form Logic, Maturity Amount Calculator, Register & Strict Uppercase English
 */

// Default Interest Rate Master (Effective From 01-06-2025)
const DEFAULT_INTEREST_RATES = {
  effectiveDate: "01-06-2025",
  rules: {
    seniorCitizenExtra: "0.50",
    bulkDepositExtra: "0.25",
    bulkPrematurePenalty: "1.00",
    normalPrematurePenalty: "0.50",
    seniorCitizenMinAge: "58",
    maxTenureMonths: "120"
  },
  slabs: [
    { id: 1, minDays: 7, maxDays: 45, label: "7 DAYS TO 45 DAYS", normRegular: 4.00, normSenior: 4.50, bulkRegular: 4.25, bulkSenior: 4.75 },
    { id: 2, minDays: 46, maxDays: 90, label: "46 DAYS TO 90 DAYS", normRegular: 5.25, normSenior: 5.75, bulkRegular: 5.50, bulkSenior: 6.00 },
    { id: 3, minDays: 91, maxDays: 120, label: "91 DAYS TO 120 DAYS", normRegular: 5.50, normSenior: 6.00, bulkRegular: 5.75, bulkSenior: 6.25 },
    { id: 4, minDays: 121, maxDays: 179, label: "121 DAYS TO 179 DAYS", normRegular: 5.75, normSenior: 6.25, bulkRegular: 6.00, bulkSenior: 6.50 },
    { id: 5, minDays: 180, maxDays: 269, label: "180 DAYS TO 269 DAYS", normRegular: 6.00, normSenior: 6.50, bulkRegular: 6.25, bulkSenior: 6.75 },
    { id: 6, minDays: 270, maxDays: 364, label: "270 DAYS TO 364 DAYS", normRegular: 6.50, normSenior: 7.00, bulkRegular: 6.75, bulkSenior: 7.25 },
    { id: 7, minDays: 365, maxDays: 365, label: "12 MONTH (1 YEAR)", normRegular: 6.75, normSenior: 7.25, bulkRegular: 7.00, bulkSenior: 7.50 },
    { id: 8, minDays: 366, maxDays: 730, label: "ABOVE 12 MONTHS TO 24 MONTHS", normRegular: 7.00, normSenior: 7.50, bulkRegular: 7.25, bulkSenior: 7.75 },
    { id: 9, minDays: 731, maxDays: 1095, label: "ABOVE 24 MONTHS TO 36 MONTHS", normRegular: 7.20, normSenior: 7.70, bulkRegular: 7.45, bulkSenior: 7.95 },
    { id: 10, minDays: 1096, maxDays: 1825, label: "ABOVE 36 MONTHS TO 60 MONTHS", normRegular: 7.10, normSenior: 7.60, bulkRegular: 7.35, bulkSenior: 7.85 },
    { id: 11, minDays: 1826, maxDays: 36500, label: "ABOVE 60 MONTH (5+ YEARS)", normRegular: 6.75, normSenior: 7.25, bulkRegular: 7.00, bulkSenior: 7.50 }
  ]
};

// Required fields configuration
const REQUIRED_FIELDS = [
  { id: 'branchName', label: 'Branch Name (શાખાનું નામ)' },
  { id: 'formDate', label: 'Date (તારીખ)' },
  { id: 'firstCustomerId', label: 'First Applicant Customer ID (મુખ્ય ગ્રાહક ID)' },
  { id: 'firstFullName', label: 'First Applicant Full Name (મુખ્ય અરજદારનું નામ)' },
  { id: 'firstAddress', label: 'First Applicant Residential Address (મુખ્ય અરજદારનું સરનામું)' },
  { id: 'firstMobileNo', label: 'First Applicant Mobile Number (મુખ્ય મોબાઈલ નંબર)' },
  { id: 'firstDob', label: 'First Applicant Date of Birth (જન્મ તારીખ)' },
  { id: 'firstAadharNo', label: 'First Applicant Aadhaar Number (૧૨ અંકનો આધાર નંબર)' },
  { id: 'deposit1Amount', label: 'Deposit 1 Amount (ડિપોઝીટ ૧ ની રકમ)' },
  { id: 'interestPaymentMode', label: 'Interest Payment Mode (વ્યાજ ચુકવણી મોડ)' },
  { id: 'interestCreditAccNo', label: 'Interest Credit A/c No (15 Digit Account No - ૧૫ અંકનો ખાતા નંબર)' },
  { id: 'renewalInstruction', label: 'Renewal Instruction (રીન્યુઅલ સૂચના)' },
  { id: 'paymentMode', label: 'Mode of Payment (ચુકવણી મોડ)' },
  { id: 'sourceOfFunds', label: 'Source of Funds (ભંડોળનો સ્ત્રોત)' },
  { id: 'identityProof', label: 'Identity Proof (ઓળખનો પુરાવો)' },
  { id: 'addressProof', label: 'Address Proof (સરનામાનો પુરાવો)' },
  { id: 'enteredBy', label: 'Entered By - Maker (ઓપરેટરનું નામ / ID)' },
  { id: 'authorizedBy', label: 'Authorized By - Checker (ઓથોરાઈઝ્ડ ઓફિસરનું નામ / ID)' }
];

// Helper: Convert Number to Indian English Words (All Uppercase)
function numberToWords(num) {
  if (num === null || num === undefined || isNaN(num) || num === '') return '';
  num = Math.floor(Number(num));
  if (num === 0) return 'ZERO RUPEES ONLY';
  if (num < 0) return 'INVALID AMOUNT';

  const single = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
  const double = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

  function convertTwoDigits(n) {
    if (n < 10) return single[n];
    if (n < 20) return double[n - 10];
    const t = Math.floor(n / 10);
    const u = n % 10;
    return tens[t] + (u ? ' ' + single[u] : '');
  }

  function convertThreeDigits(n) {
    let str = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    if (h) str += single[h] + ' HUNDRED';
    if (h && rem) str += ' AND ';
    if (rem) str += convertTwoDigits(rem);
    return str;
  }

  let crore = Math.floor(num / 10000000);
  let rem = num % 10000000;
  let lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  let thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  let words = [];
  if (crore) words.push(convertThreeDigits(crore) + ' CRORE');
  if (lakh) words.push(convertTwoDigits(lakh) + ' LAKH');
  if (thousand) words.push(convertTwoDigits(thousand) + ' THOUSAND');
  if (rem) words.push(convertThreeDigits(rem));

  return (words.join(' ') + ' RUPEES ONLY').toUpperCase();
}

// Global App State & Controller
const FDApp = {
  interestRates: null,
  currentView: 'form', // 'form', 'rateMaster', 'register'

  init() {
    // Purge any corrupted or undefined old demo records from previous versions
    try {
      let saved = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
      let cleaned = {};
      Object.keys(saved).forEach(k => {
        if (k !== 'undefined' && saved[k] && saved[k].id !== 'undefined' && saved[k].customerName !== 'undefined') {
          // ensure not corrupt
          if (saved[k].customerName && !saved[k].customerName.toLowerCase().includes('undefined')) {
            cleaned[k] = saved[k];
          }
        }
      });
      localStorage.setItem('tjccb_fd_forms', JSON.stringify(cleaned));
    } catch(e) {
      localStorage.removeItem('tjccb_fd_forms');
    }

    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('formDate');
    if (dateField && !dateField.value) {
      dateField.value = today;
    }

    this.loadInterestRates();
    this.renderRateMasterTable();
    this.bindEvents();
    this.updateAccountTypeVisibility();
    this.updateNomineeVisibility();
    this.syncExtraDepositVisibility();
    this.setupAmountAutoConvert();
    this.setupAddressSyncListeners();
    this.setupAutoRateCalculation();
    this.setupCustomerLookup();
    this.setupStrictEnglishUppercaseInputs();
    this.setupSessionAndBranchLock();
    this.updateRegisterBadgeCount();
    this.startRealtimeCloudSync();
  },

  async startRealtimeCloudSync() {
    // 1. Firebase Firestore Realtime Subscription (Push-based instant updates)
    if (window.FirebaseSync && typeof window.FirebaseSync.subscribeToFDForms === 'function') {
      try {
        window.FirebaseSync.subscribeToFDForms((cloudForms) => {
          let savedList = {};
          try {
            savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
          } catch (e) { }

          let changed = false;
          if (Array.isArray(cloudForms)) {
            cloudForms.forEach(item => {
              if (item && item.id) {
                const local = savedList[item.id];
                if (!local || (item.updatedAt && (!local.updatedAt || new Date(item.updatedAt) >= new Date(local.updatedAt)))) {
                  savedList[item.id] = item;
                  changed = true;
                }
              }
            });

            // If Head Office, reflect all branch records directly
            const branchInfo = window.FirebaseSync.getCurrentBranchInfo();
            if (branchInfo.isHeadOffice) {
              cloudForms.forEach(cf => {
                if (cf && cf.id && !savedList[cf.id]) {
                  savedList[cf.id] = cf;
                  changed = true;
                }
              });
            }
          }

          if (changed || Object.keys(savedList).length > 0) {
            localStorage.setItem('tjccb_fd_forms', JSON.stringify(savedList));
            this.updateRegisterBadgeCount();
            if (typeof this.renderRegisterTable === 'function' && this.currentView === 'register') {
              this.renderRegisterTable();
            }
          }
        });

        // Listen for cross-device deletions via Firestore
        window.FirebaseSync.subscribeToDeletedRecords('fdForms', (deletedId) => {
          let savedList = {};
          try {
            savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
          } catch (e) { }
          if (savedList[deletedId]) {
            delete savedList[deletedId];
            localStorage.setItem('tjccb_fd_forms', JSON.stringify(savedList));
            this.updateRegisterBadgeCount();
            if (typeof this.renderRegisterTable === 'function' && this.currentView === 'register') {
              this.renderRegisterTable();
            }
          }
        });
      } catch (fbErr) {
        console.warn("[FD Realtime Sync] Firebase subscription notice:", fbErr);
      }
    }

    // 2. Neon / PostgreSQL fallback poll
    const pullCloudFD = async () => {
      if (window.PostgresSync && window.PostgresSync.fetchFDForms) {
        try {
          const [cloudForms, deletedIds] = await Promise.all([
            window.PostgresSync.fetchFDForms().catch(() => []),
            (window.PostgresSync.fetchDeletedRecordIds ? window.PostgresSync.fetchDeletedRecordIds('fd') : Promise.resolve([])).catch(() => [])
          ]);

          let savedList = {};
          try {
            savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
          } catch (e) { }

          const deletedSet = new Set(deletedIds || []);
          let changed = false;

          deletedSet.forEach(delId => {
            if (savedList[delId]) {
              delete savedList[delId];
              changed = true;
            }
          });

          if (Array.isArray(cloudForms) && cloudForms.length > 0) {
            cloudForms.forEach(item => {
              if (item && item.id && !deletedSet.has(String(item.id))) {
                const local = savedList[item.id];
                if (!local || (item.updatedAt && (!local.updatedAt || new Date(item.updatedAt) >= new Date(local.updatedAt)))) {
                  savedList[item.id] = { ...local, ...item };
                  changed = true;
                }
              }
            });
          }

          if (changed) {
            localStorage.setItem('tjccb_fd_forms', JSON.stringify(savedList));
            this.updateRegisterBadgeCount();
            if (typeof this.renderRegisterTable === 'function' && this.currentView === 'register') {
              this.renderRegisterTable();
            }
          }
        } catch (e) { }
      }
    };
    this.pullCloudFD = pullCloudFD;
    pullCloudFD();
  },

  setupSessionAndBranchLock() {
    let session = null;
    try {
      const raw = localStorage.getItem('jccb_user_session') || sessionStorage.getItem('jccb_user_session') || sessionStorage.getItem('jccb_active_session');
      if (raw) session = JSON.parse(raw);
    } catch(e) {}

    if (!session) {
      session = { code: "99", name: "HEAD OFFICE", role: "Super Admin", isAdmin: true };
    }
    this.currentSession = session;

    // 1. Lock Branch Select dropdown in FD Entry Form
    const branchSelect = document.getElementById('branchName');
    if (branchSelect) {
      const codeStr = String(session.code || '').padStart(2, '0');
      let matchedVal = null;

      for (let i = 0; i < branchSelect.options.length; i++) {
        const opt = branchSelect.options[i];
        if (opt.dataset && opt.dataset.branchCode === codeStr) {
          matchedVal = opt.value;
          break;
        }
      }

      if (!matchedVal) {
        for (let i = 0; i < branchSelect.options.length; i++) {
          const opt = branchSelect.options[i];
          const optVal = opt.value.toUpperCase();
          const optText = opt.text.toUpperCase();

          if (codeStr && (optVal.includes(`(${session.code})`) || optText.startsWith(`${parseInt(codeStr, 10)} -`) || optText.includes(`[${codeStr}]`))) {
            matchedVal = opt.value;
            break;
          } else if (session.name && (optVal.includes(session.name.toUpperCase()) || optText.includes(session.name.toUpperCase()))) {
            matchedVal = opt.value;
            break;
          }
        }
      }

      if (matchedVal) {
        branchSelect.value = matchedVal;
      }

      branchSelect.disabled = true;
      branchSelect.style.pointerEvents = 'none';
      branchSelect.style.backgroundColor = '#f1f5f9';
      branchSelect.style.borderColor = '#cbd5e1';
      branchSelect.style.color = '#0f172a';
      branchSelect.style.cursor = 'not-allowed';

      const label = document.querySelector('label[for="branchName"]');
      if (label && !document.getElementById('branchLockBadge')) {
        const badge = document.createElement('span');
        badge.id = 'branchLockBadge';
        badge.className = 'ml-2 text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-400 shadow-sm inline-flex items-center gap-1';
        badge.innerHTML = `🔒 LOCKED: ${session.code || '99'} ${session.name || 'HEAD OFFICE'} (${session.role || 'User'})`;
        label.appendChild(badge);
      }
    }

    // 2. Sync Header Branch & Role Text
    const branchText = document.getElementById('user-branch-text');
    const roleBadge = document.getElementById('user-role-badge');
    const isHO = Boolean(session.isAdmin || session.code === "99" || session.code === 99 || session.role === "Super Admin" || (session.name && session.name.toUpperCase().includes("HEAD OFFICE")));
    if (branchText) branchText.textContent = `${session.code || '99'} ${session.name || 'HEAD OFFICE'}`;
    if (roleBadge) roleBadge.textContent = isHO ? '👑 Super Admin' : '🏢 Branch User';

    // 3. Backup & Restore Box (Head Office / Super Admin Only)
    const fdBackupBox = document.getElementById('fd-backup-box');
    if (fdBackupBox) {
      fdBackupBox.style.display = isHO ? 'block' : 'none';
    }

    window.handleLogout = function() {
      if (confirm('Are you sure you want to log out? (શું તમે ખરેખર લૉગઆઉટ કરવા માંગો છો?)')) {
        localStorage.removeItem('jccb_user_session');
        sessionStorage.removeItem('jccb_user_session');
        sessionStorage.clear();
        window.location.href = '../index.html';
      }
    };

    // 3. Render Active Locked Session Card in Left Sidebar
    const sidebarNav = document.querySelector('aside nav');
    if (sidebarNav && !document.getElementById('sidebarSessionCard')) {
      const sessCard = document.createElement('div');
      sessCard.id = 'sidebarSessionCard';
      sessCard.className = 'p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5 mb-3';
      sessCard.innerHTML = `
        <div class="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
          <i data-lucide="lock" class="w-3 h-3 text-amber-400"></i> ACTIVE LOCKED SESSION
        </div>
        <div class="font-black text-white text-xs">${session.code || '99'} - ${session.name || 'HEAD OFFICE'}</div>
        <div class="text-[10px] font-bold text-slate-400 flex items-center justify-between">
          <span>Role: <strong class="text-amber-300">${session.role || 'User'}</strong></span>
          <span class="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-black border border-amber-400/40">LOCKED</span>
        </div>
      `;
      sidebarNav.insertBefore(sessCard, sidebarNav.firstChild);
    }
  },

  // Enforce English Only & Automatic Uppercase Sanitizer
  setupStrictEnglishUppercaseInputs() {
    const sanitizeInput = (e) => {
      const input = e.target;
      // Allow standard printable ASCII
      const sanitized = input.value.replace(/[^\x20-\x7E]/g, '').toUpperCase();
      if (input.value !== sanitized) {
        input.value = sanitized;
      }
    };

    document.addEventListener('input', (e) => {
      const tag = e.target.tagName;
      const type = e.target.type;
      if (tag === 'TEXTAREA' || (tag === 'INPUT' && (type === 'text' || type === 'email' || type === 'tel' || type === 'search'))) {
        sanitizeInput(e);
      }
    }, true);
  },

  // Switch between Form, ROI Master, and FD Register
  switchView(viewName) {
    this.currentView = viewName;

    // Update active nav button styling
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('bg-blue-900', 'text-amber-300', 'border-amber-400', 'font-black');
        btn.classList.remove('text-slate-300', 'hover:bg-slate-800');
      } else {
        btn.classList.remove('bg-blue-900', 'text-amber-300', 'border-amber-400', 'font-black');
        btn.classList.add('text-slate-300', 'hover:bg-slate-800');
      }
    });

    // Toggle View Panels
    const panels = ['formView', 'rateMasterView', 'registerView'];
    panels.forEach(p => {
      const el = document.getElementById(p);
      if (el) el.style.display = 'none';
    });

    if (viewName === 'form') {
      document.getElementById('formView').style.display = 'block';
    } else if (viewName === 'rateMaster') {
      document.getElementById('rateMasterView').style.display = 'block';
      this.renderRateMasterTable();
    } else if (viewName === 'register') {
      document.getElementById('registerView').style.display = 'block';
      this.renderRegisterTable();
      if (typeof this.pullCloudFD === 'function') {
        this.pullCloudFD();
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Load interest rates from localStorage or default
  loadInterestRates() {
    const saved = localStorage.getItem('tjccb_fd_interest_master');
    if (saved) {
      try {
        this.interestRates = JSON.parse(saved);
        if (!this.interestRates.rules) {
          this.interestRates.rules = JSON.parse(JSON.stringify(DEFAULT_INTEREST_RATES.rules));
        }
      } catch (e) {
        this.interestRates = JSON.parse(JSON.stringify(DEFAULT_INTEREST_RATES));
      }
    } else {
      this.interestRates = JSON.parse(JSON.stringify(DEFAULT_INTEREST_RATES));
    }
  },

  saveInterestRates() {
    localStorage.setItem('tjccb_fd_interest_master', JSON.stringify(this.interestRates));
  },

  // Render editable rate master table
  renderRateMasterTable() {
    const tbody = document.getElementById('rateMasterTbody');
    const effDateInput = document.getElementById('rateEffectiveDate');
    if (effDateInput) {
      effDateInput.value = this.interestRates.effectiveDate || "01-06-2025";
    }

    const r = this.interestRates.rules || DEFAULT_INTEREST_RATES.rules;
    const ruleFields = ['seniorCitizenExtra', 'bulkDepositExtra', 'bulkPrematurePenalty', 'normalPrematurePenalty', 'seniorCitizenMinAge', 'maxTenureMonths'];
    ruleFields.forEach(f => {
      const el = document.getElementById(`rule_${f}`);
      if (el) el.value = r[f] || DEFAULT_INTEREST_RATES.rules[f];
    });

    if (!tbody) return;

    let html = '';
    this.interestRates.slabs.forEach((slab, idx) => {
      html += `
        <tr class="hover:bg-slate-50 transition border-b border-slate-200 text-xs">
          <td class="p-2.5 font-bold text-slate-800 text-center">${idx + 1}</td>
          <td class="p-2.5 font-semibold text-slate-900">${slab.label}</td>
          
          <!-- Normal Deposit Upto 14,99,999 -->
          <td class="p-1.5 text-center bg-blue-50/50">
            <input type="number" step="0.01" value="${slab.normRegular.toFixed(2)}" 
              onchange="FDApp.updateRateSlab(${idx}, 'normRegular', this.value)" 
              class="w-20 text-center font-bold text-blue-900 p-1 border-2 border-blue-300 rounded focus:border-blue-700 bg-white"> %
          </td>
          <td class="p-1.5 text-center bg-amber-50/50">
            <input type="number" step="0.01" value="${slab.normSenior.toFixed(2)}" 
              onchange="FDApp.updateRateSlab(${idx}, 'normSenior', this.value)" 
              class="w-20 text-center font-black text-amber-900 p-1 border-2 border-amber-300 rounded focus:border-amber-700 bg-white"> %
          </td>

          <!-- Bulk Deposit 15 Lakh & Above -->
          <td class="p-1.5 text-center bg-indigo-50/50">
            <input type="number" step="0.01" value="${slab.bulkRegular.toFixed(2)}" 
              onchange="FDApp.updateRateSlab(${idx}, 'bulkRegular', this.value)" 
              class="w-20 text-center font-bold text-indigo-900 p-1 border-2 border-indigo-300 rounded focus:border-indigo-700 bg-white"> %
          </td>
          <td class="p-1.5 text-center bg-emerald-50/50">
            <input type="number" step="0.01" value="${slab.bulkSenior.toFixed(2)}" 
              onchange="FDApp.updateRateSlab(${idx}, 'bulkSenior', this.value)" 
              class="w-20 text-center font-black text-emerald-900 p-1 border-2 border-emerald-300 rounded focus:border-emerald-700 bg-white"> %
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  },

  updateRateSlab(index, field, val) {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      this.interestRates.slabs[index][field] = num;
      this.saveInterestRates();
    }
  },

  updateRule(ruleKey, val) {
    if (!this.interestRates.rules) this.interestRates.rules = {};
    this.interestRates.rules[ruleKey] = val;
    this.saveInterestRates();
  },

  updateEffectiveDate(val) {
    this.interestRates.effectiveDate = val;
    this.saveInterestRates();
  },

  resetInterestRatesToDefault() {
    if (confirm('Are you sure you want to reset Interest Rates and Rules to Bank Default (01-06-2025)?')) {
      this.interestRates = JSON.parse(JSON.stringify(DEFAULT_INTEREST_RATES));
      this.saveInterestRates();
      this.renderRateMasterTable();
      alert('Interest rates reset to default successfully.');
    }
  },

  // Calculate matching ROI
  calculateMatchingROI(amount, years, months, days) {
    if (!amount || amount <= 0) return null;
    
    const yrs = parseInt(years) || 0;
    const mos = parseInt(months) || 0;
    const dys = parseInt(days) || 0;
    const totalDays = yrs * 365 + mos * 30 + dys;
    if (totalDays < 7) return null;

    const minSeniorAge = parseInt(this.interestRates.rules?.seniorCitizenMinAge || 58);
    const depositType = document.getElementById('typeOfDeposit')?.value || '';
    const isSeniorScheme = depositType === 'Senior Citizen Deposit';
    const dobVal = document.getElementById('firstDob')?.value;
    let isSeniorAge = false;
    if (dobVal) {
      const birth = new Date(dobVal);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age >= minSeniorAge) isSeniorAge = true;
    }
    const isSenior = isSeniorScheme || isSeniorAge;
    const isBulk = parseFloat(amount) >= 1500000;

    const slab = this.interestRates.slabs.find(s => totalDays >= s.minDays && totalDays <= s.maxDays);
    if (!slab) return null;

    if (isBulk) {
      return isSenior ? slab.bulkSenior : slab.bulkRegular;
    } else {
      return isSenior ? slab.normSenior : slab.normRegular;
    }
  },

  // Calculate Maturity Amount using Quarterly Compounding
  calculateMaturityAmount(principal, roi, years, months, days, schemeType) {
    principal = parseFloat(principal) || 0;
    roi = parseFloat(roi) || 0;
    if (principal <= 0 || roi <= 0) return 0;

    const yrs = parseInt(years) || 0;
    const mos = parseInt(months) || 0;
    const dys = parseInt(days) || 0;
    const totalYears = yrs + (mos / 12) + (dys / 365);
    if (totalYears <= 0) return principal;

    // Banking Standard Quarterly Compounding:
    // A = P * (1 + (ROI / 400)) ^ (4 * totalYears)
    const totalQuarters = totalYears * 4;
    const ratePerQuarter = (roi / 100) / 4;
    const maturity = principal * Math.pow(1 + ratePerQuarter, totalQuarters);

    return Math.round(maturity);
  },

  recalculateAllROI(forceAutoRate = false) {
    const schemeType = document.getElementById('typeOfDeposit')?.value || '';

    [1, 2, 3].forEach(idx => {
      const amt = document.getElementById(`deposit${idx}Amount`)?.value;
      const yrs = document.getElementById(`deposit${idx}Years`)?.value;
      const mos = document.getElementById(`deposit${idx}Months`)?.value;
      const dys = document.getElementById(`deposit${idx}Days`)?.value;
      const roiInput = document.getElementById(`deposit${idx}Roi`);
      const maturityInput = document.getElementById(`deposit${idx}MaturityAmount`);

      if (amt && (yrs || mos || dys)) {
        let currentRoi = parseFloat(roiInput?.value);
        const autoRate = this.calculateMatchingROI(amt, yrs, mos, dys);
        
        if (autoRate !== null) {
          if (forceAutoRate || !currentRoi || isNaN(currentRoi) || currentRoi <= 0) {
            currentRoi = autoRate;
            if (roiInput) roiInput.value = autoRate.toFixed(2);
          } else {
            // Check if rate should update because of senior status change
            currentRoi = autoRate;
            if (roiInput) roiInput.value = autoRate.toFixed(2);
          }
        }

        if (maturityInput && currentRoi > 0) {
          const maturityAmt = this.calculateMaturityAmount(amt, currentRoi, yrs, mos, dys, schemeType);
          maturityInput.value = maturityAmt ? '₹ ' + maturityAmt.toLocaleString('en-IN') : '';
        }
      } else {
        if (maturityInput) maturityInput.value = '';
      }
    });
  },

  setupAutoRateCalculation() {
    [1, 2, 3].forEach(idx => {
      ['Amount', 'Years', 'Months', 'Days'].forEach(f => {
        const el = document.getElementById(`deposit${idx}${f}`);
        if (el) {
          el.addEventListener('input', () => this.recalculateAllROI(true));
          el.addEventListener('change', () => this.recalculateAllROI(true));
        }
      });
      const roiEl = document.getElementById(`deposit${idx}Roi`);
      if (roiEl) {
        roiEl.addEventListener('input', () => this.recalculateAllROI(false));
      }
    });

    const depType = document.getElementById('typeOfDeposit');
    if (depType) {
      depType.addEventListener('change', () => this.recalculateAllROI(true));
    }

    const dob = document.getElementById('firstDob');
    if (dob) {
      ['change', 'input', 'blur'].forEach(evt => {
        dob.addEventListener(evt, () => {
          const dobVal = dob.value;
          if (dobVal) {
            const birth = new Date(dobVal);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

            const depTypeSelect = document.getElementById('typeOfDeposit');
            const form121Above60 = document.getElementById('form121Above60');
            const form121Below60 = document.getElementById('form121Below60');
            const minSeniorAge = parseInt(this.interestRates?.rules?.seniorCitizenMinAge || 58);

            if (age >= minSeniorAge) {
              if (depTypeSelect && depTypeSelect.value === 'Fixed Deposit (FD)') {
                depTypeSelect.value = 'Senior Citizen Deposit';
              }
              if (form121Above60) form121Above60.checked = true;
              if (form121Below60) form121Below60.checked = false;
            } else {
              if (depTypeSelect && depTypeSelect.value === 'Senior Citizen Deposit') {
                depTypeSelect.value = 'Fixed Deposit (FD)';
              }
              if (form121Above60) form121Above60.checked = false;
            }
          }
          // Force immediate recalculation of ROI for all active deposit cards
          this.recalculateAllROI(true);
        });
      });
    }
  },

  bindEvents() {
    // Account Type Toggle (Single hides Joint 1 & Joint 2, Joint shows all)
    const accTypeSelect = document.getElementById('typeOfAccount');
    if (accTypeSelect) {
      accTypeSelect.addEventListener('change', () => this.updateAccountTypeVisibility());
    }

    const modeOfOp = document.getElementById('modeOfOperation');
    const modeOtherDiv = document.getElementById('modeOfOpOtherDiv');
    if (modeOfOp && modeOtherDiv) {
      modeOfOp.addEventListener('change', function() {
        modeOtherDiv.style.display = (this.value === 'Other') ? 'block' : 'none';
      });
    }

    const paymentMode = document.getElementById('paymentMode');
    const transferAccDiv = document.getElementById('transferAccDiv');
    if (paymentMode && transferAccDiv) {
      paymentMode.addEventListener('change', function() {
        transferAccDiv.style.display = (this.value === 'Transfer from A/c') ? 'block' : 'none';
      });
    }

    const fundSource = document.getElementById('sourceOfFunds');
    const fundSourceOtherDiv = document.getElementById('sourceOfFundsOtherDiv');
    if (fundSource && fundSourceOtherDiv) {
      fundSource.addEventListener('change', function() {
        fundSourceOtherDiv.style.display = (this.value === 'Other') ? 'block' : 'none';
      });
    }

    // Nominee Share % Dynamic Visibility Listeners
    for (let i = 1; i <= 4; i++) {
      const shareInput = document.getElementById(`nominee${i}Share`);
      if (shareInput) {
        ['input', 'change'].forEach(evt => {
          shareInput.addEventListener(evt, () => this.updateNomineeVisibility());
        });
      }
      const dobInput = document.getElementById(`nominee${i}Dob`);
      if (dobInput) {
        dobInput.addEventListener('change', () => this.checkMinorNominees());
      }
    }
  },

  // Dynamic Nominee Visibility:
  // - Nominee 1: Always visible
  // - Nominee 2: Visible only if Nominee 1 Share < 100%
  // - Nominee 3: Visible only if (Nominee 1 Share + Nominee 2 Share) < 100%
  // - Nominee 4: Visible only if (Nominee 1 + Nominee 2 + Nominee 3 Share) < 100%
  updateNomineeVisibility() {
    const s1 = parseFloat(document.getElementById('nominee1Share')?.value) || 0;
    const s2 = parseFloat(document.getElementById('nominee2Share')?.value) || 0;
    const s3 = parseFloat(document.getElementById('nominee3Share')?.value) || 0;

    const nom2Card = document.getElementById('nomineeCard_2');
    const nom3Card = document.getElementById('nomineeCard_3');
    const nom4Card = document.getElementById('nomineeCard_4');
    const gridContainer = document.getElementById('nomineesGridContainer');

    const showNom2 = (s1 > 0 && s1 < 100);
    const showNom3 = showNom2 && ((s1 + s2) < 100);
    const showNom4 = showNom3 && ((s1 + s2 + s3) < 100);

    if (nom2Card) nom2Card.style.display = showNom2 ? 'block' : 'none';
    if (nom3Card) nom3Card.style.display = showNom3 ? 'block' : 'none';
    if (nom4Card) nom4Card.style.display = showNom4 ? 'block' : 'none';

    // If hidden, clear inputs to avoid dirty print
    if (!showNom2) {
      ['Name', 'Dob', 'Share', 'Address'].forEach(f => {
        const el = document.getElementById(`nominee2${f}`);
        if (el && f !== 'Share') el.value = '';
      });
    }
    if (!showNom3) {
      ['Name', 'Dob', 'Share', 'Address'].forEach(f => {
        const el = document.getElementById(`nominee3${f}`);
        if (el) el.value = '';
      });
    }
    if (!showNom4) {
      ['Name', 'Dob', 'Share', 'Address'].forEach(f => {
        const el = document.getElementById(`nominee4${f}`);
        if (el) el.value = '';
      });
    }

    // Adjust grid responsive columns based on visible nominees
    if (gridContainer) {
      let visibleCount = 1 + (showNom2 ? 1 : 0) + (showNom3 ? 1 : 0) + (showNom4 ? 1 : 0);
      if (visibleCount === 1) {
        gridContainer.className = 'grid grid-cols-1 max-w-md gap-4';
      } else if (visibleCount === 2) {
        gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 max-w-3xl gap-4';
      } else if (visibleCount === 3) {
        gridContainer.className = 'grid grid-cols-1 md:grid-cols-3 gap-4';
      } else {
        gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4';
      }
    }

    this.checkMinorNominees();
  },

  // Dynamic Add / Remove Extra Deposits (Deposit 2 & 3)
  addExtraDeposit() {
    const card2 = document.getElementById('depositCard_2');
    const card3 = document.getElementById('depositCard_3');
    const addBtn = document.getElementById('btnAddExtraDeposit');

    if (card2 && (card2.style.display === 'none' || !card2.style.display)) {
      card2.style.display = 'block';
      const amt2 = document.getElementById('deposit2Amount');
      if (amt2) amt2.focus();
    } else if (card3 && (card3.style.display === 'none' || !card3.style.display)) {
      card3.style.display = 'block';
      const amt3 = document.getElementById('deposit3Amount');
      if (amt3) amt3.focus();
    } else {
      alert('Maximum 3 deposits can be added in a single application form.');
    }
    this.updateExtraDepositButtonState();
    if (window.lucide) lucide.createIcons();
  },

  removeExtraDeposit(idx) {
    const card = document.getElementById(`depositCard_${idx}`);
    if (card) {
      card.style.display = 'none';
      // Clear fields
      ['Amount', 'AmountWords', 'Years', 'Months', 'Days', 'Roi', 'MaturityAmount'].forEach(f => {
        const el = document.getElementById(`deposit${idx}${f}`);
        if (el) el.value = '';
      });
    }
    this.updateExtraDepositButtonState();
    this.recalculateAllROI();
  },

  updateExtraDepositButtonState() {
    const card2 = document.getElementById('depositCard_2');
    const card3 = document.getElementById('depositCard_3');
    const addBtn = document.getElementById('btnAddExtraDeposit');
    if (!addBtn) return;

    const is2Visible = card2 && card2.style.display !== 'none';
    const is3Visible = card3 && card3.style.display !== 'none';

    if (is2Visible && is3Visible) {
      addBtn.style.display = 'none';
    } else {
      addBtn.style.display = 'inline-flex';
    }
  },

  syncExtraDepositVisibility() {
    const dep2Amt = document.getElementById('deposit2Amount')?.value;
    const dep3Amt = document.getElementById('deposit3Amount')?.value;
    const card2 = document.getElementById('depositCard_2');
    const card3 = document.getElementById('depositCard_3');

    if (card2) {
      card2.style.display = (dep2Amt && parseFloat(dep2Amt) > 0) ? 'block' : 'none';
    }
    if (card3) {
      card3.style.display = (dep3Amt && parseFloat(dep3Amt) > 0) ? 'block' : 'none';
    }
    this.updateExtraDepositButtonState();
  },

  updateAccountTypeVisibility() {
    const accType = document.getElementById('typeOfAccount')?.value || 'Single';
    const isJoint = (accType === 'Joint');

    const joint1Card = document.getElementById('applicantCard_joint1');
    const joint2Card = document.getElementById('applicantCard_joint2');
    const applicantsContainer = document.getElementById('applicantsContainer');

    if (joint1Card) joint1Card.style.display = isJoint ? 'block' : 'none';
    if (joint2Card) joint2Card.style.display = isJoint ? 'block' : 'none';

    if (applicantsContainer) {
      if (isJoint) {
        applicantsContainer.className = 'grid grid-cols-1 lg:grid-cols-3 gap-5';
      } else {
        applicantsContainer.className = 'grid grid-cols-1 max-w-2xl mx-auto gap-5';
      }
    }
  },

  // Auto-fetch and fill basic details when Customer ID is entered
  setupCustomerLookup() {
    // Lookups for First Applicant, Joint 1, Joint 2
    const applicants = [
      {
        idInput: 'firstCustomerId',
        fields: {
          firstFullName: 'firstFullName',
          firstAddress: 'firstAddress',
          firstPanNo: 'firstPanNo',
          firstAadharNo: 'firstAadharNo',
          firstMobileNo: 'firstMobileNo',
          firstEmailId: 'firstEmailId',
          firstDob: 'firstDob',
          firstGender: 'firstGender',
          firstOccupation: 'firstOccupation',
          firstAnnualIncome: 'firstAnnualIncome'
        }
      },
      {
        idInput: 'joint1CustomerId',
        fields: {
          joint1FullName: 'firstFullName',
          joint1Address: 'firstAddress',
          joint1PanNo: 'firstPanNo',
          joint1AadharNo: 'firstAadharNo',
          joint1MobileNo: 'firstMobileNo',
          joint1EmailId: 'firstEmailId',
          joint1Dob: 'firstDob',
          joint1Gender: 'firstGender',
          joint1Occupation: 'firstOccupation',
          joint1AnnualIncome: 'firstAnnualIncome'
        }
      },
      {
        idInput: 'joint2CustomerId',
        fields: {
          joint2FullName: 'firstFullName',
          joint2Address: 'firstAddress',
          joint2PanNo: 'firstPanNo',
          joint2AadharNo: 'firstAadharNo',
          joint2MobileNo: 'firstMobileNo',
          joint2EmailId: 'firstEmailId',
          joint2Dob: 'firstDob',
          joint2Gender: 'firstGender',
          joint2Occupation: 'firstOccupation',
          joint2AnnualIncome: 'firstAnnualIncome'
        }
      }
    ];

    applicants.forEach(app => {
      const inputEl = document.getElementById(app.idInput);
      if (inputEl) {
        // Trigger on change or blur
        ['change', 'blur'].forEach(evt => {
          inputEl.addEventListener(evt, () => {
            const custId = (inputEl.value || '').trim().toUpperCase();
            if (!custId) return;

            // Search in saved register records
            const savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
            let foundData = null;

            for (let key in savedList) {
              const rec = savedList[key];
              if (rec && rec.data) {
                // Match with First Applicant Customer ID
                if ((rec.data.firstCustomerId || '').trim().toUpperCase() === custId) {
                  foundData = rec.data;
                  break;
                }
                // Match with Joint 1 Customer ID
                if ((rec.data.joint1CustomerId || '').trim().toUpperCase() === custId) {
                  foundData = {
                    firstFullName: rec.data.joint1FullName,
                    firstAddress: rec.data.joint1Address,
                    firstPanNo: rec.data.joint1PanNo,
                    firstAadharNo: rec.data.joint1AadharNo,
                    firstMobileNo: rec.data.joint1MobileNo,
                    firstEmailId: rec.data.joint1EmailId,
                    firstDob: rec.data.joint1Dob,
                    firstGender: rec.data.joint1Gender,
                    firstOccupation: rec.data.joint1Occupation,
                    firstAnnualIncome: rec.data.joint1AnnualIncome
                  };
                  break;
                }
                // Match with Joint 2 Customer ID
                if ((rec.data.joint2CustomerId || '').trim().toUpperCase() === custId) {
                  foundData = {
                    firstFullName: rec.data.joint2FullName,
                    firstAddress: rec.data.joint2Address,
                    firstPanNo: rec.data.joint2PanNo,
                    firstAadharNo: rec.data.joint2AadharNo,
                    firstMobileNo: rec.data.joint2MobileNo,
                    firstEmailId: rec.data.joint2EmailId,
                    firstDob: rec.data.joint2Dob,
                    firstGender: rec.data.joint2Gender,
                    firstOccupation: rec.data.joint2Occupation,
                    firstAnnualIncome: rec.data.joint2AnnualIncome
                  };
                  break;
                }
              }
            }

            if (foundData) {
              // Auto-fill applicant fields
              Object.keys(app.fields).forEach(targetFieldId => {
                const sourceKey = app.fields[targetFieldId];
                const targetEl = document.getElementById(targetFieldId);
                if (targetEl && foundData[sourceKey]) {
                  targetEl.value = foundData[sourceKey];
                }
              });

              // If looking up First Applicant, also auto-fill Interest Credit A/c No and Nominee 1 Details
              if (app.idInput === 'firstCustomerId') {
                const intAcc = document.getElementById('interestCreditAccNo');
                if (intAcc && foundData['interestCreditAccNo']) {
                  intAcc.value = foundData['interestCreditAccNo'];
                }

                // Auto-fill Nominee 1 Details
                const nomFields = [
                  { id: 'nominee1Name', key: 'nominee1Name' },
                  { id: 'nominee1Dob', key: 'nominee1Dob' },
                  { id: 'nominee1Share', key: 'nominee1Share' },
                  { id: 'nominee1Address', key: 'nominee1Address' }
                ];

                nomFields.forEach(nf => {
                  const el = document.getElementById(nf.id);
                  if (el && foundData[nf.key]) {
                    el.value = foundData[nf.key];
                  }
                });

                // Guardian details if minor
                if (foundData['guardianName']) {
                  const gName = document.getElementById('guardianName');
                  if (gName) gName.value = foundData['guardianName'];
                }
                if (foundData['relationWithGuardian']) {
                  const gRel = document.getElementById('relationWithGuardian');
                  if (gRel) gRel.value = foundData['relationWithGuardian'];
                }

                this.updateNomineeVisibility();
              }

              // Re-check ROI / DOB dependent rates
              this.recalculateAllROI(true);
              this.checkMinorNominees();

              // Flash highlight to indicate auto-fill
              inputEl.classList.add('bg-emerald-100', 'border-emerald-500');
              setTimeout(() => {
                inputEl.classList.remove('bg-emerald-100', 'border-emerald-500');
              }, 1200);
            }
          });
        });
      }
    });
  },

  updateAccountTypeVisibility() {
    const accType = document.getElementById('typeOfAccount')?.value || 'Single';
    const isJoint = (accType === 'Joint');

    const joint1Card = document.getElementById('applicantCard_joint1');
    const joint2Card = document.getElementById('applicantCard_joint2');
    const applicantsContainer = document.getElementById('applicantsContainer');

    if (joint1Card) joint1Card.style.display = isJoint ? 'block' : 'none';
    if (joint2Card) joint2Card.style.display = isJoint ? 'block' : 'none';

    if (applicantsContainer) {
      if (isJoint) {
        applicantsContainer.className = 'grid grid-cols-1 lg:grid-cols-3 gap-5';
      } else {
        applicantsContainer.className = 'grid grid-cols-1 max-w-2xl mx-auto gap-5';
      }
    }
  },

  setupAddressSyncListeners() {
    const firstAddrInput = document.getElementById('firstAddress');
    if (firstAddrInput) {
      firstAddrInput.addEventListener('input', () => {
        const val = firstAddrInput.value;
        ['joint1', 'joint2', 'nominee1', 'nominee2', 'nominee3', 'nominee4'].forEach(id => {
          const chk = document.getElementById(`${id}SameAsFirstAddr`);
          const target = document.getElementById(`${id}Address`);
          if (chk && chk.checked && target) {
            target.value = val;
          }
        });
      });
    }
  },

  syncAddress(targetId, checkboxEl) {
    const target = document.getElementById(targetId);
    const firstAddr = document.getElementById('firstAddress')?.value || '';
    if (checkboxEl.checked) {
      if (target) {
        target.value = firstAddr;
      }
    }
  },

  setupAmountAutoConvert() {
    [1, 2, 3].forEach(index => {
      const amtInput = document.getElementById(`deposit${index}Amount`);
      const wordsInput = document.getElementById(`deposit${index}AmountWords`);
      if (amtInput && wordsInput) {
        amtInput.addEventListener('input', (e) => {
          wordsInput.value = numberToWords(e.target.value);
        });
      }
    });
  },

  toggleOccupationOther(applicant, selectEl) {
    const otherDiv = document.getElementById(`${applicant}OccupationOtherDiv`);
    if (otherDiv) {
      otherDiv.style.display = (selectEl.value === 'Other') ? 'block' : 'none';
    }
  },

  checkMinorNominees() {
    let hasMinor = false;
    const today = new Date();

    for (let i = 1; i <= 4; i++) {
      const dobVal = document.getElementById(`nominee${i}Dob`)?.value;
      const nomName = document.getElementById(`nominee${i}Name`)?.value;
      if (dobVal && nomName) {
        const birthDate = new Date(dobVal);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          hasMinor = true;
          break;
        }
      }
    }

    const minorSection = document.getElementById('minorGuardianSection');
    if (minorSection) {
      if (hasMinor) {
        minorSection.classList.add('border-amber-500', 'bg-amber-50/80');
        minorSection.classList.remove('border-slate-300', 'bg-slate-50');
      } else {
        minorSection.classList.remove('border-amber-500', 'bg-amber-50/80');
        minorSection.classList.add('border-slate-300', 'bg-slate-50');
      }
    }
  },

  // Mandatory Validation
  validateForm() {
    const missingFields = [];

    document.querySelectorAll('.field-error').forEach(el => {
      el.classList.remove('field-error', 'border-red-500', 'bg-red-50');
    });

    REQUIRED_FIELDS.forEach(f => {
      const el = document.getElementById(f.id);
      if (el) {
        const val = (el.value || '').trim();
        if (!val) {
          missingFields.push(f);
          el.classList.add('field-error', 'border-red-500', 'bg-red-50');
        }
      }
    });

    // Validate exact 15-digit numeric for Interest Credit Account Number
    const intAccEl = document.getElementById('interestCreditAccNo');
    if (intAccEl) {
      const intAccVal = (intAccEl.value || '').trim();
      if (!intAccVal || intAccVal.length !== 15 || !/^\d{15}$/.test(intAccVal)) {
        if (!missingFields.some(f => f.id === 'interestCreditAccNo')) {
          missingFields.push({ id: 'interestCreditAccNo', label: 'Interest Credit A/c No (Must be exactly 15 numeric digits - ૧૫ અંકનો ખાતા નંબર)' });
        }
        intAccEl.classList.add('field-error', 'border-red-500', 'bg-red-50');
      }
    }

    // Validate exact 12-digit numeric for First Applicant Aadhaar Number
    const aadharEl = document.getElementById('firstAadharNo');
    if (aadharEl) {
      const aadharVal = (aadharEl.value || '').trim();
      if (!aadharVal || aadharVal.length !== 12 || !/^\d{12}$/.test(aadharVal)) {
        if (!missingFields.some(f => f.id === 'firstAadharNo')) {
          missingFields.push({ id: 'firstAadharNo', label: 'Aadhaar Number (Must be exactly 12 numeric digits - ૧૨ અંકનો આધાર નંબર)' });
        }
        aadharEl.classList.add('field-error', 'border-red-500', 'bg-red-50');
      }
    }

    // Validate Joint 1 Aadhaar if entered
    const j1AadharEl = document.getElementById('joint1AadharNo');
    if (j1AadharEl && j1AadharEl.value.trim()) {
      const val = j1AadharEl.value.trim();
      if (val.length !== 12 || !/^\d{12}$/.test(val)) {
        missingFields.push({ id: 'joint1AadharNo', label: 'Joint 1 Aadhaar Number (Must be exactly 12 numeric digits)' });
        j1AadharEl.classList.add('field-error', 'border-red-500', 'bg-red-50');
      }
    }

    // Validate Joint 2 Aadhaar if entered
    const j2AadharEl = document.getElementById('joint2AadharNo');
    if (j2AadharEl && j2AadharEl.value.trim()) {
      const val = j2AadharEl.value.trim();
      if (val.length !== 12 || !/^\d{12}$/.test(val)) {
        missingFields.push({ id: 'joint2AadharNo', label: 'Joint 2 Aadhaar Number (Must be exactly 12 numeric digits)' });
        j2AadharEl.classList.add('field-error', 'border-red-500', 'bg-red-50');
      }
    }

    const y = document.getElementById('deposit1Years')?.value;
    const m = document.getElementById('deposit1Months')?.value;
    const d = document.getElementById('deposit1Days')?.value;
    if (!y && !m && !d) {
      missingFields.push({ id: 'deposit1Years', label: 'Deposit 1 Tenure (Years/Months/Days)' });
      document.getElementById('deposit1Years')?.classList.add('field-error', 'border-red-500', 'bg-red-50');
    }

    const accType = document.getElementById('typeOfAccount')?.value;
    if (accType === 'Joint') {
      const joint1Name = document.getElementById('joint1FullName')?.value;
      if (!joint1Name || !joint1Name.trim()) {
        missingFields.push({ id: 'joint1FullName', label: 'Joint Applicant 1 Full Name' });
        document.getElementById('joint1FullName')?.classList.add('field-error', 'border-red-500', 'bg-red-50');
      }
    }

    if (missingFields.length > 0) {
      this.showValidationErrorModal(missingFields);
      return false;
    }

    return true;
  },

  showValidationErrorModal(missingFields) {
    const listEl = document.getElementById('validationErrorsList');
    if (listEl) {
      let html = '<ul class="list-disc pl-5 space-y-1.5 text-xs text-red-700 font-bold">';
      missingFields.forEach(f => {
        html += `<li><span class="text-slate-900">${f.label}</span> MUST BE FILLED.</li>`;
      });
      html += '</ul>';
      listEl.innerHTML = html;
    }

    const modal = document.getElementById('validationModal');
    if (modal) modal.style.display = 'flex';

    if (missingFields[0] && missingFields[0].id) {
      const firstEl = document.getElementById(missingFields[0].id);
      if (firstEl) {
        firstEl.focus();
        firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  },

  closeValidationModal() {
    const modal = document.getElementById('validationModal');
    if (modal) modal.style.display = 'none';
  },

  collectFormData() {
    const data = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(el => {
      if (el.id) {
        if (el.type === 'checkbox') {
          data[el.id] = el.checked;
        } else if (el.tagName === 'SELECT') {
          data[el.id] = el.value || '';
        } else {
          data[el.id] = (el.value || '').toUpperCase();
        }
      }
    });

    const branchSelect = document.getElementById('branchName');
    if (branchSelect && branchSelect.selectedOptions && branchSelect.selectedOptions[0]) {
      data.branchCode = branchSelect.selectedOptions[0].dataset.branchCode || '';
      data.branchName = branchSelect.value;
    }

    return data;
  },

  formatPrintDate(isoDate) {
    if (!isoDate || typeof isoDate !== 'string') return '';
    const clean = isoDate.trim();
    if (clean.includes('-')) {
      const parts = clean.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return clean;
  },

  formatAadhaar(val) {
    if (!val || typeof val !== 'string') return '';
    const digits = val.replace(/\D/g, '');
    if (digits.length === 12) {
      return `${digits.substring(0, 4)} ${digits.substring(4, 8)} ${digits.substring(8, 12)}`;
    }
    return val;
  },

  formatAccountNumber(val) {
    if (!val || typeof val !== 'string') return '';
    const digits = val.replace(/\D/g, '');
    if (digits.length === 15) {
      return `${digits.substring(0, 3)}-${digits.substring(3, 7)}-${digits.substring(7, 15)}`;
    }
    return val;
  },

  renderPrintCheckbox(checked, label) {
    return checked
      ? `<span class="p-checked">[✓]</span> <strong>${label}</strong>`
      : `<span class="p-unchecked">[ ]</span> ${label}`;
  },

  populatePrintView() {
    const data = this.collectFormData();
    const isJoint = (data['typeOfAccount'] || '').toUpperCase().includes('JOINT');

    // Standard data-print mappings
    document.querySelectorAll('[data-print]').forEach(el => {
      const key = el.getAttribute('data-print');
      
      // Skip custom formatted keys
      if (key.startsWith('chk_') || key.endsWith('Check') || key.endsWith('Print')) return;

      // Handle Joint applicants when Account is Single or Joint fields are empty
      if (!isJoint) {
        if (key.startsWith('joint1') || key.startsWith('joint2')) {
          el.innerText = '';
          return;
        }
      } else {
        if (key.startsWith('joint1') && !data['joint1FullName']) {
          el.innerText = '';
          return;
        }
        if (key.startsWith('joint2') && !data['joint2FullName']) {
          el.innerText = '';
          return;
        }
      }

      let val = data[key] || '';
      
      // Format Dates to DD-MM-YYYY
      if (key.toLowerCase().includes('date') || key.toLowerCase().includes('dob')) {
        val = this.formatPrintDate(val);
      } else if (key.toLowerCase().includes('aadhar')) {
        val = this.formatAadhaar(val);
      } else if (key.toLowerCase().includes('accno') || key.toLowerCase().includes('accountno')) {
        val = this.formatAccountNumber(val);
      } else if (typeof val === 'boolean') {
        val = val ? '<span class="p-checked">[✓]</span> YES' : '<span class="p-unchecked">[ ]</span> NO';
      }
      
      el.innerText = val;
    });

    const setHtml = (key, content) => {
      const el = document.querySelector(`[data-print="${key}"]`);
      if (el) el.innerHTML = content;
    };

    // 1. Account Type & Mode of Operation
    setHtml('typeOfAccountCheck', `${this.renderPrintCheckbox(!isJoint, 'Single')} &nbsp;&nbsp; ${this.renderPrintCheckbox(isJoint, 'Joint')}`);

    const modeOp = (data['modeOfOperation'] || 'Either or Survivor').toUpperCase();
    const isEither = modeOp.includes('EITHER');
    const isJointly = modeOp.includes('JOINTLY');
    const isOtherMode = !isEither && !isJointly;
    const otherModeLabel = data['modeOfOperationOther'] ? `Other (${data['modeOfOperationOther']})` : 'Other';
    setHtml('modeOfOperationCheck', `${this.renderPrintCheckbox(isEither, 'Either or Survivor')} &nbsp; ${this.renderPrintCheckbox(isJointly, 'Jointly')} &nbsp; ${this.renderPrintCheckbox(isOtherMode, otherModeLabel)}`);

    // 2. Section 1 Display ONLY selected value for Occupation, Gender, Annual Income (No unselected checkboxes)
    const renderOcc = (occVal, otherVal) => {
      if (!occVal || !occVal.trim()) return '';
      if (occVal.toUpperCase() === 'OTHER' && otherVal) {
        return `<span class="print-val font-bold text-[8.2pt]">${otherVal.toUpperCase()}</span>`;
      }
      return `<span class="print-val font-bold text-[8.2pt]">${occVal.toUpperCase()}</span>`;
    };

    const renderGender = (gVal) => {
      if (!gVal || !gVal.trim()) return '';
      const map = { 'MALE': 'MALE (પુરુષ)', 'FEMALE': 'FEMALE (સ્ત્રી)', 'OTHER': 'OTHER (અન્ય)' };
      const formatted = map[gVal.toUpperCase()] || gVal.toUpperCase();
      return `<span class="print-val font-bold text-[8.2pt]">${formatted}</span>`;
    };

    const renderIncome = (incVal) => {
      if (!incVal || !incVal.trim()) return '';
      return `<span class="print-val font-bold text-[8.2pt]">${incVal.toUpperCase()}</span>`;
    };

    setHtml('firstOccupationCheck', renderOcc(data['firstOccupation'], data['firstOccupationOther']));
    setHtml('joint1OccupationCheck', isJoint && data['joint1FullName'] ? renderOcc(data['joint1Occupation'], data['joint1OccupationOther']) : '');
    setHtml('joint2OccupationCheck', isJoint && data['joint2FullName'] ? renderOcc(data['joint2Occupation'], data['joint2OccupationOther']) : '');

    setHtml('firstGenderCheck', renderGender(data['firstGender']));
    setHtml('joint1GenderCheck', isJoint && data['joint1FullName'] ? renderGender(data['joint1Gender']) : '');
    setHtml('joint2GenderCheck', isJoint && data['joint2FullName'] ? renderGender(data['joint2Gender']) : '');

    setHtml('firstAnnualIncomeCheck', renderIncome(data['firstAnnualIncome']));
    setHtml('joint1AnnualIncomeCheck', isJoint && data['joint1FullName'] ? renderIncome(data['joint1AnnualIncome']) : '');
    setHtml('joint2AnnualIncomeCheck', isJoint && data['joint2FullName'] ? renderIncome(data['joint2AnnualIncome']) : '');

    // 3. Section 2: Type of Deposit Checkboxes
    const depType = (data['typeOfDeposit'] || 'Fixed Deposit (FD)').toUpperCase();
    setHtml('chk_dep_fd', this.renderPrintCheckbox(depType.includes('FIXED'), 'Fixed Deposit (FD)'));
    setHtml('chk_dep_reinvest', this.renderPrintCheckbox(depType.includes('REINVEST'), 'Reinvestment Deposit (RD)'));
    setHtml('chk_dep_recur', this.renderPrintCheckbox(depType.includes('RECURRING'), 'Recurring Deposit (RD)'));
    setHtml('chk_dep_senior', this.renderPrintCheckbox(depType.includes('SENIOR'), 'Senior Citizen Deposit'));

    // 4. Section 3: Deposit Rows (Clear unused Deposit 2 and Deposit 3 rows)
    const formatTenure = (y, m, d) => {
      const parts = [];
      if (y && Number(y) > 0) parts.push(`${y}Y`);
      if (m && Number(m) > 0) parts.push(`${m}M`);
      if (d && Number(d) > 0) parts.push(`${d}D`);
      return parts.join(' ') || '-';
    };

    setHtml('deposit1TenurePrint', formatTenure(data['deposit1Years'], data['deposit1Months'], data['deposit1Days']));

    const dep2Row = document.getElementById('printDepositRow2');
    if (dep2Row) {
      if (data['deposit2Amount'] && Number(data['deposit2Amount']) > 0) {
        setHtml('deposit2TenurePrint', formatTenure(data['deposit2Years'], data['deposit2Months'], data['deposit2Days']));
      } else {
        dep2Row.innerHTML = '<td style="text-align: center;">2</td><td></td><td></td><td></td><td></td>';
      }
    }

    const dep3Row = document.getElementById('printDepositRow3');
    if (dep3Row) {
      if (data['deposit3Amount'] && Number(data['deposit3Amount']) > 0) {
        setHtml('deposit3TenurePrint', formatTenure(data['deposit3Years'], data['deposit3Months'], data['deposit3Days']));
      } else {
        dep3Row.innerHTML = '<td style="text-align: center;">3</td><td></td><td></td><td></td><td></td>';
      }
    }

    // Section 3: Interest Frequency & Renewal Instructions
    const payMode = (data['interestPaymentMode'] || 'On Maturity').toUpperCase();
    const modes = [
      { key: 'Monthly', label: 'Monthly/માસિક' },
      { key: 'Quarterly', label: 'Quarterly/ત્રિમાસિક' },
      { key: 'Half Yearly', label: 'Half Yearly/અર્ધ-વાર્ષિક' },
      { key: 'Yearly', label: 'Yearly/વાર્ષિક' },
      { key: 'On Maturity', label: 'On Maturity/પાક્યે' }
    ];
    const modeHtml = modes.map(m => this.renderPrintCheckbox(payMode.includes(m.key.toUpperCase()), m.label)).join(' &nbsp; ');
    setHtml('interestPaymentModeCheck', modeHtml);

    const renewInst = (data['renewalInstruction'] || 'Auto Renewal (Principal + Interest)').toUpperCase();
    const renewals = [
      { key: 'Interest', label: 'Auto Renewal (Principal+Interest)' },
      { key: 'Only', label: 'Auto Renewal (Principal only)' },
      { key: 'Maturity', label: 'Pay on Maturity' }
    ];
    const renewHtml = renewals.map(r => this.renderPrintCheckbox(renewInst.includes(r.key.toUpperCase()), r.label)).join(' &nbsp; ');
    setHtml('renewalInstructionCheck', renewHtml);

    // 5. Section 4: Nominees (Clear unused Nominee rows)
    [1, 2, 3, 4].forEach(idx => {
      const nomName = data[`nominee${idx}Name`];
      const row = document.getElementById(`printNomineeRow${idx}`);
      if (row) {
        if (!nomName || !nomName.trim()) {
          row.innerHTML = `<td>${idx}. </td><td></td><td></td><td></td><td></td>`;
        }
      }
    });

    // Guardian details for print (blank if no guardian entered or no relation selected)
    const gNameEl = document.querySelector('[data-print="guardianName"]');
    if (gNameEl) {
      gNameEl.innerText = data['guardianName'] || '';
    }
    const gRelEl = document.querySelector('[data-print="relationWithGuardian"]');
    if (gRelEl) {
      gRelEl.innerText = data['guardianName'] && data['relationWithGuardian'] ? data['relationWithGuardian'] : (data['relationWithGuardian'] || '');
    }

    // 6. Section 5: TDS Form 121
    const renderTick = (checked) => checked ? `<span class="p-checked" style="font-size: 11.5pt;">[✓]</span>` : `<span class="p-unchecked" style="font-size: 10pt;">[ ]</span>`;
    setHtml('chk_tds_below60_tick', renderTick(data['form121Below60']));
    setHtml('chk_tds_above60_tick', renderTick(data['form121Above60']));
    setHtml('chk_tds_applicable_tick', renderTick(data['tdsApplicable']));

    // 7. Section 6: Payment Mode & Source of Funds
    const pMode = (data['paymentMode'] || 'Cash').toUpperCase();
    const pModes = [
      { key: 'Cash', label: 'Cash/રોકડ' },
      { key: 'Cheque', label: 'Cheque/ચેક' },
      { key: 'NEFT', label: 'NEFT/RTGS' },
      { key: 'Transfer', label: 'Transfer from A/c' }
    ];
    let pModeStr = pModes.map(m => this.renderPrintCheckbox(pMode.includes(m.key.toUpperCase()), m.label)).join(' &nbsp; ');
    if (pMode.includes('TRANSFER') && data['transferAccountNo']) {
      pModeStr += ` : <span class="print-val">${data['transferAccountNo']}</span>`;
    }
    setHtml('paymentModeCheck', pModeStr);

    const sFund = (data['sourceOfFunds'] || 'Savings').toUpperCase();
    const sFunds = [
      { key: 'Salary', label: 'Salary/Pension' },
      { key: 'Business', label: 'Business Income' },
      { key: 'Savings', label: 'Savings' },
      { key: 'Inheritance', label: 'Inheritance' },
      { key: 'Other', label: 'Other' }
    ];
    let sFundStr = sFunds.map(s => this.renderPrintCheckbox(sFund.includes(s.key.toUpperCase()), s.label)).join(' &nbsp; ');
    if (sFund.includes('OTHER') && data['sourceOfFundsOther']) {
      sFundStr += ` : <span class="print-val">${data['sourceOfFundsOther']}</span>`;
    }
    setHtml('sourceOfFundsCheck', sFundStr);

    // 8. Section 7: KYC Proofs
    const idProof = (data['identityProof'] || 'Aadhaar Card').toUpperCase();
    const idProofs = ['Aadhaar Card', 'PAN Card', 'Voter ID', 'Passport', 'Driving License'];
    setHtml('idProofCheck', idProofs.map(p => this.renderPrintCheckbox(idProof.replace(/\s+/g, '').includes(p.replace(/\s+/g, '').toUpperCase()), p)).join(' &nbsp; '));

    const addrProof = (data['addressProof'] || 'Aadhaar Card').toUpperCase();
    const addrProofs = ['Aadhaar Card', 'Passport', 'Utility Bill (< 3 Months)', 'Bank Statement'];
    setHtml('addrProofCheck', addrProofs.map(p => {
      const match = (p.includes('Utility') && addrProof.includes('UTILITY')) ||
                    (p.includes('Bank') && addrProof.includes('BANK')) ||
                    (p.includes('Passport') && addrProof.includes('PASSPORT')) ||
                    (p.includes('Aadhaar') && (addrProof.includes('AADHAAR') || addrProof.includes('AADHAR')));
      return this.renderPrintCheckbox(match, p);
    }).join(' &nbsp; '));

    const addProof = (data['additionalProof'] || '').toUpperCase();
    const photoCheck = this.renderPrintCheckbox(true, 'Recent Passport Size Photographs / તાજેતરનો પાસપોર્ટ સાઇઝ ફોટો');
    const seniorCheck = this.renderPrintCheckbox(addProof.includes('SENIOR') || addProof.includes('BOTH'), 'Senior Citizen Certificate / વરિષ્ઠ નાગરિક પુરાવો');
    setHtml('additionalProofCheck', `${photoCheck} &nbsp;&nbsp; ${seniorCheck}`);
  },

  printForm() {
    if (!this.validateForm()) {
      return;
    }
    this.populatePrintView();
    const pc = document.getElementById('printContainer');
    if (pc) pc.style.display = 'block';
    window.print();
    if (pc) pc.style.display = 'none';
  },

  async saveToLocalStorage() {
    if (!this.validateForm()) {
      return;
    }

    const data = this.collectFormData();
    const custName = data['firstFullName'] || 'UNNAMED';
    const custId = data['firstCustomerId'] || 'TJCCB';
    const timestampNow = new Date().toLocaleString('en-IN');
    const formId = data['formRefNo'] ? data['formRefNo'] : ('FD_' + custId + '_' + Date.now().toString().slice(-4));
    
    let savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
    
    const recordPayload = {
      id: formId,
      formNo: formId,
      createdAt: Date.now(),
      timestamp: timestampNow,
      customerName: custName,
      customerId: custId,
      branch: data['branchName'] || 'HEAD OFFICE',
      branchName: data['branchName'] || 'HEAD OFFICE',
      branchCode: data.branchCode || '99',
      depositScheme: data['typeOfDeposit'] || 'FIXED DEPOSIT (FD)',
      amount: data['deposit1Amount'] || '0',
      roi: data['deposit1Roi'] || '0.00',
      maturityAmount: data['deposit1MaturityAmount'] || '',
      tenure: `${data['deposit1Years'] || 0}Y ${data['deposit1Months'] || 0}M ${data['deposit1Days'] || 0}D`,
      data: data,
      updatedAt: new Date().toISOString()
    };

    savedList[formId] = recordPayload;
    localStorage.setItem('tjccb_fd_forms', JSON.stringify(savedList));
    
    // Cloud Realtime Push (Firebase Firestore & Neon)
    let syncSuccess = false;
    if (window.FirebaseSync && typeof window.FirebaseSync.saveFDForm === 'function') {
      try {
        await window.FirebaseSync.saveFDForm(recordPayload);
        syncSuccess = true;
        console.log(`⚡ [FD Save] Firebase Firestore sync status for ${formId}: SUCCESS`);
      } catch (fbErr) {
        console.warn("⚠️ [FD Save] Firebase sync warning:", fbErr);
      }
    }

    if (window.PostgresSync && typeof window.PostgresSync.syncFDForm === 'function') {
      try {
        const pgRes = await window.PostgresSync.syncFDForm(recordPayload);
        if (pgRes) syncSuccess = true;
      } catch(e) { }
    }

    alert(`✓ Record saved successfully!\nCustomer: ${custName}\nRef ID: ${formId}${syncSuccess ? '\n⚡ Synced in Real-Time to Cloud' : ''}`);
    
    // Clear form so next time user opens FD Entry Form, it is fresh & blank
    this.clearFormCleanly();

    this.updateRegisterBadgeCount();
    this.switchView('register');
    if (typeof this.pullCloudFD === 'function') {
      this.pullCloudFD();
    }
  },

  clearFormCleanly() {
    const form = document.getElementById('fdMainForm');
    if (form) form.reset();
    
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('formDate');
    if (dateField) dateField.value = today;

    const refField = document.getElementById('formRefNo');
    if (refField) refField.value = 'FD-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);

    // Clear any extra input fields that reset() might miss
    ['firstCustomerId', 'firstFullName', 'firstAddress', 'firstPanNo', 'firstAadharNo', 'firstMobileNo', 'firstEmailId',
     'joint1CustomerId', 'joint1FullName', 'joint1Address', 'joint1PanNo', 'joint1AadharNo', 'joint1MobileNo', 'joint1EmailId',
     'joint2CustomerId', 'joint2FullName', 'joint2Address', 'joint2PanNo', 'joint2AadharNo', 'joint2MobileNo', 'joint2EmailId',
     'deposit1Amount', 'deposit1AmountWords', 'deposit1Years', 'deposit1Months', 'deposit1Days', 'deposit1Roi', 'deposit1MaturityAmount',
     'deposit2Amount', 'deposit2AmountWords', 'deposit2Years', 'deposit2Months', 'deposit2Days', 'deposit2Roi', 'deposit2MaturityAmount',
     'deposit3Amount', 'deposit3AmountWords', 'deposit3Years', 'deposit3Months', 'deposit3Days', 'deposit3Roi', 'deposit3MaturityAmount',
     'nominee1Name', 'nominee1Dob', 'nominee1Address', 'nominee2Name', 'nominee2Dob', 'nominee2Address',
     'nominee3Name', 'nominee3Dob', 'nominee3Address', 'nominee4Name', 'nominee4Dob', 'nominee4Address',
     'guardianName', 'relationWithGuardian', 'enteredBy', 'authorizedBy', 'transferAccountNo', 'sourceOfFundsOther', 'interestCreditAccNo',
     'joint1Gender', 'joint1Relation', 'joint1AnnualIncome', 'joint1Occupation', 'joint1OccupationOther',
     'joint2Gender', 'joint2Relation', 'joint2AnnualIncome', 'joint2Occupation', 'joint2OccupationOther'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    const nom1Share = document.getElementById('nominee1Share');
    if (nom1Share) nom1Share.value = '100';

    const accType = document.getElementById('typeOfAccount');
    if (accType) accType.value = 'Single';

    document.querySelectorAll('.field-error').forEach(el => {
      el.classList.remove('field-error', 'border-red-500', 'bg-red-50');
    });

    this.updateAccountTypeVisibility();
    this.updateNomineeVisibility();
    this.syncExtraDepositVisibility();
    this.recalculateAllROI();
    this.setupSessionAndBranchLock();
  },

  updateRegisterBadgeCount() {
    const savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
    const sessionCode = this.currentSession ? String(this.currentSession.code || '').trim().replace(/\D/g, '') : '99';
    const isHO = Boolean(
      !this.currentSession ||
      this.currentSession.isAdmin === true ||
      sessionCode === '99' ||
      sessionCode === '' ||
      (this.currentSession.role && String(this.currentSession.role).toUpperCase().includes('ADMIN')) ||
      (this.currentSession.name && String(this.currentSession.name).toUpperCase().includes('HEAD OFFICE'))
    );

    let count = 0;
    if (isHO) {
      count = Object.keys(savedList).length;
    } else {
      const uBranch = sessionCode.padStart(2, '0');
      count = Object.values(savedList).filter(item => {
        const itemBranch = String(item.branchCode || (item.data && item.data.branchCode) || '').padStart(2, '0');
        return itemBranch === uBranch;
      }).length;
    }

    const badge = document.getElementById('registerCountBadge');
    if (badge) badge.innerText = count;
  },

  // Clear all records from register
  clearAllRecords() {
    if (confirm('Are you sure you want to delete ALL records from FD Register? This cannot be undone.')) {
      localStorage.removeItem('tjccb_fd_forms');
      this.renderRegisterTable();
      this.updateRegisterBadgeCount();
      alert('All FD Register records have been deleted.');
    }
  },

  // ==================== FD ENTRY FORM REGISTER ====================
  renderRegisterTable() {
    const container = document.getElementById('registerTableContainer');
    if (!container) return;

    const savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
    const keys = Object.keys(savedList);

    this.updateRegisterBadgeCount();

    const sessionCode = this.currentSession ? String(this.currentSession.code || '').trim().replace(/\D/g, '') : '99';
    const sessionName = this.currentSession ? String(this.currentSession.name || '').toUpperCase() : 'HEAD OFFICE';
    const sessionRole = this.currentSession ? String(this.currentSession.role || '').toUpperCase() : 'SUPER ADMIN';
    const isHO = Boolean(
      !this.currentSession ||
      this.currentSession.isAdmin === true ||
      sessionCode === '99' ||
      sessionCode === '' ||
      sessionRole.includes('ADMIN') ||
      sessionRole.includes('SUPER') ||
      sessionName.includes('HEAD OFFICE') ||
      sessionName.includes('HO')
    );
    const userBranch = sessionCode ? sessionCode.padStart(2, '0') : '99';
    const selectedBranchFilter = this.selectedRegisterBranch || (isHO ? 'ALL' : userBranch);

    // Sort entries by createdAt timestamp in descending order (Newest first)
    let sortedEntries = keys.map(k => savedList[k]).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Branch Filtering logic:
    // Head Office bypasses branch filter completely (100% of records from all 18 branches visible by default)
    if (isHO) {
      if (selectedBranchFilter && selectedBranchFilter !== 'ALL') {
        sortedEntries = sortedEntries.filter(item => {
          const itemBranch = String(item.branchCode || (item.data && item.data.branchCode) || '').padStart(2, '0');
          return itemBranch === selectedBranchFilter;
        });
      }
      // If selectedBranchFilter === 'ALL', no filtering is applied: HO sees 100% of all branches
    } else {
      // Branch user can ONLY see their own branch's entries
      sortedEntries = sortedEntries.filter(item => {
        const itemBranch = String(item.branchCode || (item.data && item.data.branchCode) || '').padStart(2, '0');
        return itemBranch === userBranch;
      });
    }

    let filterBarHtml = '';
    if (isHO) {
      filterBarHtml = `
        <div class="mb-4 bg-slate-900 text-white p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-slate-700">
          <div class="flex items-center gap-2">
            <span class="text-amber-400 font-black text-sm">👑 Head Office View:</span>
            <span class="text-xs text-slate-300 font-semibold">Bank-wide Global Consolidated Database</span>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-slate-300">🏢 Filter by Branch:</label>
            <select id="fdRegisterBranchFilter" onchange="FDApp.changeRegisterBranchFilter(this.value)" class="bg-slate-800 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-amber-400">
              <option value="ALL" ${selectedBranchFilter === 'ALL' ? 'selected' : ''}>🌟 All Branches (બધી શાખાઓ)</option>
              <option value="99" ${selectedBranchFilter === '99' ? 'selected' : ''}>99 HEAD OFFICE</option>
              <option value="01" ${selectedBranchFilter === '01' ? 'selected' : ''}>01 AZADCHOWK BRANCH</option>
              <option value="02" ${selectedBranchFilter === '02' ? 'selected' : ''}>02 JOSHIPARA BRANCH</option>
              <option value="03" ${selectedBranchFilter === '03' ? 'selected' : ''}>03 DOLATPARA BRANCH</option>
              <option value="04" ${selectedBranchFilter === '04' ? 'selected' : ''}>04 KODINAR BRANCH</option>
              <option value="05" ${selectedBranchFilter === '05' ? 'selected' : ''}>05 KESHOD BRANCH</option>
              <option value="06" ${selectedBranchFilter === '06' ? 'selected' : ''}>06 VANTHALI BRANCH</option>
              <option value="07" ${selectedBranchFilter === '07' ? 'selected' : ''}>07 MANAVADAR BRANCH</option>
              <option value="08" ${selectedBranchFilter === '08' ? 'selected' : ''}>08 GANDHINAGAR BRANCH</option>
              <option value="09" ${selectedBranchFilter === '09' ? 'selected' : ''}>09 LIMBDI BRANCH</option>
              <option value="10" ${selectedBranchFilter === '10' ? 'selected' : ''}>10 MENDARDA BRANCH</option>
              <option value="11" ${selectedBranchFilter === '11' ? 'selected' : ''}>11 VISAVADAR BRANCH</option>
              <option value="12" ${selectedBranchFilter === '12' ? 'selected' : ''}>12 JAMNAGAR BRANCH</option>
              <option value="13" ${selectedBranchFilter === '13' ? 'selected' : ''}>13 BUS STAND BRANCH</option>
              <option value="14" ${selectedBranchFilter === '14' ? 'selected' : ''}>14 LATHI BRANCH</option>
              <option value="16" ${selectedBranchFilter === '16' ? 'selected' : ''}>16 AHMEDABAD BRANCH</option>
              <option value="17" ${selectedBranchFilter === '17' ? 'selected' : ''}>17 RAJKOT BRANCH</option>
              <option value="18" ${selectedBranchFilter === '18' ? 'selected' : ''}>18 ZANZARDA BRANCH</option>
            </select>
          </div>
        </div>
      `;
    } else {
      filterBarHtml = `
        <div class="mb-4 bg-blue-50 border border-blue-200 text-blue-900 p-2.5 rounded-xl flex items-center justify-between text-xs font-bold">
          <div class="flex items-center gap-2">
            <span>🏢 Branch Context:</span>
            <span class="bg-blue-900 text-white px-2.5 py-0.5 rounded font-black">${this.currentSession ? this.currentSession.name : 'Branch'}</span>
            <span class="text-slate-500 font-semibold">(Displaying records for your branch only)</span>
          </div>
          <span class="text-blue-800 font-black">${sortedEntries.length} Records</span>
        </div>
      `;
    }

    if (sortedEntries.length === 0) {
      container.innerHTML = `
        ${filterBarHtml}
        <div class="p-12 text-center text-slate-500 font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
          <i data-lucide="file-x-2" class="w-10 h-10 mx-auto mb-2 text-slate-400"></i>
          <div>No FD Application records found for this branch selection.</div>
          <button onclick="FDApp.switchView('form')" class="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold shadow">
            + Create New FD Form Entry (નવું ફોર્મ ભરો)
          </button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    let totalAmount = 0;
    let html = `
      ${filterBarHtml}
      <div class="overflow-x-auto border-2 border-slate-300 rounded-xl shadow-sm">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-blue-950 text-white uppercase font-bold tracking-wider">
              <th class="p-3 text-center w-10">#</th>
              <th class="p-3">Ref ID</th>
              <th class="p-3">Customer ID</th>
              <th class="p-3">Applicant Name</th>
              <th class="p-3">Branch Name</th>
              <th class="p-3">Scheme & Tenure</th>
              <th class="p-3 text-right">Amount (₹)</th>
              <th class="p-3 text-center">ROI %</th>
              <th class="p-3 text-right">Maturity (₹)</th>
              <th class="p-3">Date / Time</th>
              <th class="p-3 text-center min-w-[210px]">Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    sortedEntries.forEach((item, idx) => {
      const amt = parseFloat(item.amount || 0);
      totalAmount += amt;

      const safeId = encodeURIComponent(item.id);

      html += `
        <tr class="border-b hover:bg-blue-50/50 font-medium transition ${idx === 0 ? 'bg-amber-50/40' : ''}">
          <td class="p-3 font-bold text-center text-slate-700">${idx + 1}</td>
          <td class="p-3 font-mono font-black text-blue-950">${item.id} ${idx === 0 ? '<span class="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded uppercase ml-1">New</span>' : ''}</td>
          <td class="p-3 font-mono font-bold text-slate-800">${item.customerId || '-'}</td>
          <td class="p-3 font-black text-slate-900">${item.customerName}</td>
          <td class="p-3 font-semibold text-slate-700">${item.branch}</td>
          <td class="p-3 text-slate-800 font-semibold">${item.depositScheme}<br><span class="text-[10px] text-slate-500 font-bold">${item.tenure || ''}</span></td>
          <td class="p-3 text-right font-black text-blue-950 text-sm">₹ ${amt.toLocaleString('en-IN')}</td>
          <td class="p-3 text-center font-black text-amber-700 bg-amber-50/70 border-x border-amber-200">${item.roi || '-'}%</td>
          <td class="p-3 text-right font-bold text-emerald-800">${item.maturityAmount || '-'}</td>
          <td class="p-3 text-slate-600 text-[11px]">${item.timestamp}</td>
          <td class="p-3 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <!-- Edit Action -->
              <button type="button" onclick="FDApp.loadFormAndEdit('${safeId}')" title="Edit Entry" class="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded font-bold text-xs flex items-center gap-1 shadow cursor-pointer">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit
              </button>

              <!-- Direct Print Action -->
              <button type="button" onclick="FDApp.directPrintRecord('${safeId}')" title="Print Form" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded font-black text-xs flex items-center gap-1 shadow border border-amber-400 cursor-pointer">
                <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print
              </button>

              <!-- Delete Action -->
              <button type="button" onclick="FDApp.deleteRecord('${safeId}')" title="Delete Record" class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs shadow cursor-pointer">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
          <tfoot>
            <tr class="bg-slate-200 font-black text-slate-900 text-sm">
              <td colspan="6" class="p-3 text-right uppercase">Total FD Register Amount (કુલ રકમ):</td>
              <td class="p-3 text-right text-blue-950">₹ ${totalAmount.toLocaleString('en-IN')}</td>
              <td colspan="4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
  },

  changeRegisterBranchFilter(branchVal) {
    this.selectedRegisterBranch = branchVal;
    this.renderRegisterTable();
  },

  // Edit record from Register
  loadFormAndEdit(encodedId) {
    const id = decodeURIComponent(encodedId);
    const savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
    const item = savedList[id];
    if (!item || !item.data) {
      alert('Record not found: ' + id);
      return;
    }

    const data = item.data;
    Object.keys(data).forEach(fieldId => {
      const el = document.getElementById(fieldId);
      if (el) {
        if (el.type === 'checkbox') {
          el.checked = !!data[fieldId];
        } else if (el.tagName === 'SELECT') {
          const val = data[fieldId] || '';
          el.value = val;
          // If direct match failed due to casing, match case-insensitively
          if (el.selectedIndex === -1 && val) {
            for (let opt of el.options) {
              if (opt.value.toUpperCase() === val.toUpperCase()) {
                el.value = opt.value;
                break;
              }
            }
          }
        } else {
          el.value = data[fieldId] || '';
        }
      }
    });

    this.checkMinorNominees();
    this.updateAccountTypeVisibility();
    this.updateNomineeVisibility();
    this.syncExtraDepositVisibility();
    this.switchView('form');
  },

  // Direct print of any record from Register
  directPrintRecord(encodedId) {
    const id = decodeURIComponent(encodedId);
    const savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
    const item = savedList[id];
    if (!item || !item.data) {
      alert('Record not found: ' + id);
      return;
    }

    // Populate data to form fields temporarily for print mapping
    const data = item.data;
    Object.keys(data).forEach(fieldId => {
      const el = document.getElementById(fieldId);
      if (el) {
        if (el.type === 'checkbox') {
          el.checked = !!data[fieldId];
        } else if (el.tagName === 'SELECT') {
          const val = data[fieldId] || '';
          el.value = val;
          if (el.selectedIndex === -1 && val) {
            for (let opt of el.options) {
              if (opt.value.toUpperCase() === val.toUpperCase()) {
                el.value = opt.value;
                break;
              }
            }
          }
        } else {
          el.value = data[fieldId] || '';
        }
      }
    });

    this.populatePrintView();
    const pc = document.getElementById('printContainer');
    if (pc) pc.style.display = 'block';
    window.print();
    if (pc) pc.style.display = 'none';
  },

  // Delete Record from Register
  deleteRecord(encodedId) {
    const id = decodeURIComponent(encodedId);
    if (!confirm(`Are you sure you want to permanently delete record: ${id}?`)) return;
    let savedList = JSON.parse(localStorage.getItem('tjccb_fd_forms') || '{}');
    delete savedList[id];
    localStorage.setItem('tjccb_fd_forms', JSON.stringify(savedList));
    const bCode = this.currentSession ? (this.currentSession.code || '99') : '99';
    const user = this.currentSession ? (this.currentSession.name || 'User') : 'User';
    if (window.FirebaseSync && typeof window.FirebaseSync.deleteFDForm === 'function') {
      window.FirebaseSync.deleteFDForm(id, bCode, user).catch(() => {});
    }
    if (window.PostgresSync && window.PostgresSync.deleteFDForm) {
      window.PostgresSync.deleteFDForm(id, bCode, user).catch(() => {});
    }
    this.renderRegisterTable();
    this.updateRegisterBadgeCount();
  },

  async exportXLSX() {
    try {
      if (window.CentralBackup) {
        await CentralBackup.exportModuleXLSX('fd');
      } else {
        alert("Backup engine loading...");
      }
    } catch (e) {
      alert("Excel Export Error: " + e.message);
    }
  },

  async exportCSV() {
    try {
      if (window.CentralBackup) {
        await CentralBackup.exportModuleCSV('fd');
      } else {
        alert("Backup engine loading...");
      }
    } catch (e) {
      alert("CSV Export Error: " + e.message);
    }
  },

  exportJSON() {
    const savedList = localStorage.getItem('tjccb_fd_forms') || '{}';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(savedList);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `TJCCB_FD_Register_Backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  },

  async restoreBackupFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (!window.CentralBackup) {
        alert("Central backup engine not loaded!");
        return;
      }
      const inspection = await CentralBackup.inspectFile(file);
      const count = inspection.stats.fdAccounts || (inspection.sheets["FD_ACCOUNTS"] ? inspection.sheets["FD_ACCOUNTS"].length : 0);
      
      const proceed = confirm(`ફાઇલ વેરિફિકેશન સફળ!\nફાઇલ નામ: ${file.name}\nમળેલ FD એકાઉન્ટ્સ: ${count} રેકોર્ડ્સ\n\nશું આપ આ ડેટા FD પોર્ટલમાં રીસ્ટોર કરવા માંગો છો?`);
      if (!proceed) return;

      const report = await CentralBackup.executeRestore(inspection, 'fd', 'merge');
      this.renderRegisterTable();
      this.updateRegisterBadgeCount();

      alert(`✓ FD ડેટા સફળતાપૂર્વક રીસ્ટોર થયો!\nકુલ ${report.fdRestored} રેકોર્ડ્સ અપડેટ થયા.`);
    } catch (err) {
      alert("Restore Error: " + err.message);
    } finally {
      event.target.value = "";
    }
  },

  importJSON(event) {
    this.restoreBackupFile(event);
  },

  resetForm() {
    if (confirm('Create New FD Form? Current unsaved entries will be cleared.')) {
      this.clearFormCleanly();
      this.switchView('form');
    }
  }
};

// Explicit global exposure
window.FDApp = FDApp;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  FDApp.init();
});
