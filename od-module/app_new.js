/**
 * The Junagadh Commercial Co-Operative Bank Ltd.
 * Overdraft Loan Against Fixed Deposit Receipt Module
 * Exact Physical Bank Form Engine (FD FORM MODULE Compliant)
 */

// Official Branch Master Data
const BRANCH_MASTER = [
  { code: "99", name: "HEAD OFFICE", shortName: "HO" },
  { code: "01", name: "AZADCHOWK BRANCH", shortName: "CBB" },
  { code: "02", name: "JOSHIPARA BRANCH", shortName: "JPB" },
  { code: "03", name: "DOLATPARA BRANCH", shortName: "DPB" },
  { code: "04", name: "KODINAR BRANCH", shortName: "KDR" },
  { code: "05", name: "KESHOD BRANCH", shortName: "KSD" },
  { code: "06", name: "VANTHALI BRANCH", shortName: "VTL" },
  { code: "07", name: "MANAVADAR BRANCH", shortName: "MNV" },
  { code: "08", name: "GANDHINAGAR BRANCH", shortName: "GNB" },
  { code: "09", name: "LIMBDI BRANCH", shortName: "LIM" },
  { code: "10", name: "MENDARDA BRANCH", shortName: "MEN" },
  { code: "11", name: "VISAVADAR BRANCH", shortName: "VIS" },
  { code: "12", name: "JAMNAGAR BRANCH", shortName: "JMB" },
  { code: "13", name: "BUS STAND BRANCH", shortName: "STB" },
  { code: "14", name: "LATHI BRANCH", shortName: "LTH" },
  { code: "16", name: "AHMEDABAD BRANCH", shortName: "AHM" },
  { code: "17", name: "RAJKOT BRANCH", shortName: "RJT" },
  { code: "18", name: "ZANZARDA BRANCH", shortName: "ZAN" }
];

// Gujarati Numbers To Words Converter
const GUJ_WORDS = {
  units: ['', 'એક', 'બે', 'ત્રણ', 'ચાર', 'પાંચ', 'છ', 'સાત', 'આઠ', 'નવ', 'દસ',
          'અગિયાર', 'બાર', 'તેર', 'ચૌદ', 'પંદર', 'સોળ', 'સત્તર', 'અઢાર', 'ઓગણીસ'],
  tens: ['', '', 'વીસ', 'ત્રીસ', 'ચાલીસ', 'પચાસ', 'સાઈઠ', 'સિત્તેર', 'એંસી', 'નેવું'],
  twentyPlus: [
    '', 'એકવીસ', 'બાવીસ', 'તેવીસ', 'ચોવીસ', 'પચીસ', 'છવ્વીસ', 'સત્તાવીસ', 'અઠ્ઠાવીસ', 'ઓગણત્રીસ', 'ત્રીસ',
    'એકત્રીસ', 'બત્રીસ', 'તેત્રીસ', 'ચોત્રીસ', 'પાંત્રીસ', 'છત્રીસ', 'સાડત્રીસ', 'આડત્રીસ', 'ઓગણચાલીસ', 'ચાલીસ',
    'એકતાલીસ', 'બેતાલીસ', 'તેતાલીસ', 'ચુમ્માલીસ', 'પિસ્તાલીસ', 'છેતાલીસ', 'સુડતાલીસ', 'અડતાલીસ', 'ઓગણપચાસ', 'પચાસ',
    'એકાવન', 'બાવન', 'ત્રેપન', 'ચોપન', 'પંચાવન', 'છપ્પન', 'સત્તાવન', 'અઠ્ઠાવન', 'ઓગણસાઠ', 'સાઈઠ',
    'એકસઠ', 'બાસઠ', 'ત્રેસઠ', 'ચોસઠ', 'પાંસઠ', 'છાસઠ', 'સડસઠ', 'અડસઠ', 'અગણોસિત્તેર', 'સિત્તેર',
    'એકોતેર', 'બોતેર', 'તેરોતેર', 'ચુમોતેર', 'પંચોતેર', 'છોતેર', 'સંતોતેર', 'ઇઠોતેર', 'ઓગણાએંસી', 'એંસી',
    'એક્યાસી', 'બ્યાસી', 'ત્યાસી', 'ચોર્યાસી', 'પંચાસી', 'છ્યાસી', 'સત્તાસી', 'અઠ્યાસી', 'નેવ્યાસી', 'નેવું',
    'એકાણું', 'બાણું', 'ત્રાણું', 'ચોરાણું', 'પંચાણું', 'છન્નું', 'સત્તાણું', 'અઠ્ઠાણું', 'નવ્વાણું'
  ]
};

function numberToGujaratiWords(num) {
  num = Math.floor(Math.abs(Number(num) || 0));
  if (num === 0) return 'શૂન્ય';

  function convertTwoDigits(n) {
    if (n === 0) return '';
    if (n < 20) return GUJ_WORDS.units[n];
    return GUJ_WORDS.twentyPlus[n - 20];
  }

  function convertSection(n) {
    let res = '';
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    if (hundred > 0) {
      res += GUJ_WORDS.units[hundred] + ' સો ';
    }
    if (remainder > 0) {
      res += convertTwoDigits(remainder) + ' ';
    }
    return res.trim();
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = num;

  if (crore > 0) words += convertSection(crore) + ' કરોડ ';
  if (lakh > 0) words += convertSection(lakh) + ' લાખ ';
  if (thousand > 0) words += convertSection(thousand) + ' હજાર ';
  if (remainder > 0) words += convertSection(remainder);

  return (words.trim() + ' રૂપિયા પૂરા').replace(/\s+/g, ' ');
}

// English Numbers To Words Converter
const ENG_UNITS = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
                   'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
const ENG_TENS = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

function numberToEnglishWords(num) {
  num = Math.floor(Math.abs(Number(num) || 0));
  if (num === 0) return 'ZERO RUPEES ONLY';

  function convertChunk(n) {
    let s = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    if (h > 0) s += ENG_UNITS[h] + ' HUNDRED ';
    if (rem > 0) {
      if (rem < 20) s += ENG_UNITS[rem] + ' ';
      else {
        s += ENG_TENS[Math.floor(rem / 10)] + ' ';
        if (rem % 10 > 0) s += ENG_UNITS[rem % 10] + ' ';
      }
    }
    return s.trim();
  }

  let parts = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = num;

  if (crore > 0) parts += convertChunk(crore) + ' CRORE ';
  if (lakh > 0) parts += convertChunk(lakh) + ' LAKH ';
  if (thousand > 0) parts += convertChunk(thousand) + ' THOUSAND ';
  if (remainder > 0) parts += convertChunk(remainder);

  return 'RUPEES ' + parts.trim() + ' ONLY';
}

// Helper to render bank SVG emblem into containers
function renderBankLogos() {
  if (typeof TJCCB_LOGO_SVG !== 'undefined') {
    document.querySelectorAll('.bank-logo-placeholder').forEach(el => {
      el.innerHTML = TJCCB_LOGO_SVG;
    });
  }
}

// ==================== MAIN APPLICATION LOGIC ====================
const OverdraftApp = {
  currentRecordId: null,
  activeTab: 'form',
  activePrintDoc: 'all',
  jointCustomerCount: 0,
  maxJointCustomers: 3, // Total 1 primary + 3 joint = 4
  fdRowCount: 0,

  init() {
    this.populateBranchDropdowns();
    this.initDefaultDate();
    this.bindEvents();
    this.addFdRow(); // Start with at least 1 FD row
    this.updateRegisterTable();
    this.updateReportMetrics();
    this.setupSessionAndBranchLock();
    renderBankLogos();
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

    // 1. Lock Branch Select dropdown in Form
    const branchSelect = document.getElementById('branchSelect');
    if (branchSelect) {
      const codeNum = String(session.code || '').trim().replace(/\D/g, '');
      let matchedVal = null;

      for (let i = 0; i < branchSelect.options.length; i++) {
        const opt = branchSelect.options[i];
        const optVal = opt.value.toUpperCase();
        const optText = opt.text.toUpperCase();

        if (codeNum && (optVal.startsWith(codeNum) || optText.startsWith(codeNum) || optVal.includes(`[${codeNum}]`))) {
          matchedVal = opt.value;
          break;
        } else if (session.name && (optVal.includes(session.name.toUpperCase()) || optText.includes(session.name.toUpperCase()))) {
          matchedVal = opt.value;
          break;
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

      const label = document.querySelector('label[for="branchSelect"]');
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
    if (branchText) branchText.textContent = `${session.code || '99'} ${session.name || 'HEAD OFFICE'}`;
    if (roleBadge) roleBadge.textContent = (session.isAdmin || session.code === "99") ? '👑 Super Admin' : '🏢 Branch User';

    window.handleLogout = function() {
      if (confirm('Are you sure you want to log out? (શું તમે ખરેખર લૉગઆઉટ કરવા માંગો છો?)')) {
        localStorage.removeItem('jccb_user_session');
        sessionStorage.removeItem('jccb_user_session');
        sessionStorage.clear();
        window.location.href = '../index.html';
      }
    };
  },

  // Initialize Branch Dropdowns (Form & Filter)
  populateBranchDropdowns() {
    const branchSelect = document.getElementById('branchSelect');
    const filterBranch = document.getElementById('filterBranch');
    
    if (branchSelect) {
      branchSelect.innerHTML = BRANCH_MASTER.map(b => 
        `<option value="${b.code} - ${b.name} [${b.shortName}]">${b.code} - ${b.name} [${b.shortName}]</option>`
      ).join('');
      branchSelect.value = "01 - AZADCHOWK BRANCH [CBB]";
    }

    if (filterBranch) {
      filterBranch.innerHTML = '<option value="">-- તમામ શાખાઓ (ALL BRANCHES) --</option>' +
        BRANCH_MASTER.map(b => `<option value="${b.name}">${b.code} - ${b.name}</option>`).join('');
    }
  },

  initDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    const loanDateInput = document.getElementById('loanDate');
    if (loanDateInput && !loanDateInput.value) {
      loanDateInput.value = today;
    }
  },

  bindEvents() {
    // 15-Digit Saving Account Number Validation
    const accInput = document.getElementById('savingAccountNo') || document.getElementById('savingAccNo');
    if (accInput) {
      accInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 15);
        e.target.value = val;
        this.validateSavingAccNumber(val);
      });
    }

    // Auto amount to words converter
    const loanAmountInput = document.getElementById('loanAmount');
    if (loanAmountInput) {
      loanAmountInput.addEventListener('input', (e) => {
        const amt = parseFloat(e.target.value) || 0;
        const wordsGujEl = document.getElementById('loanAmountWordsGuj');
        const wordsEngEl = document.getElementById('loanAmountWordsEng');
        if (wordsGujEl) wordsGujEl.value = amt > 0 ? numberToGujaratiWords(amt) : '';
        if (wordsEngEl) wordsEngEl.value = amt > 0 ? numberToEnglishWords(amt) : '';
      });
    }

    // Uppercase inputs
    document.querySelectorAll('input[type="text"], textarea').forEach(el => {
      if (el.id !== 'savingAccNo' && el.id !== 'savingAccountNo' && !el.classList.contains('no-caps')) {
        el.addEventListener('input', () => {
          el.value = el.value.toUpperCase();
        });
      }
    });
  },

  validateSavingAccNumber(val) {
    const feedback = document.getElementById('savingAccValidationBadge') || document.getElementById('accNoFeedback');
    const input = document.getElementById('savingAccountNo') || document.getElementById('savingAccNo');
    if (!feedback || !input) return;

    if (!val || val.length === 0) {
      feedback.innerHTML = '<span class="text-amber-600 font-semibold">ફરજિયાત ૧૫ અંક</span>';
      input.classList.remove('border-emerald-500', 'border-red-500');
    } else if (val.length === 15) {
      feedback.innerHTML = '<span class="text-emerald-600 font-bold">✓ માન્ય ૧૫ ડીજીટ સેવિંગ ખાતા નંબર</span>';
      input.classList.add('border-emerald-500');
      input.classList.remove('border-red-500');
    } else {
      feedback.innerHTML = `<span class="text-amber-600 font-bold">! ૧૫ આંકડા જરૂરી છે (હાલ: ${val.length}, ખૂટે છે: ${15 - val.length})</span>`;
      input.classList.add('border-red-500');
      input.classList.remove('border-emerald-500');
    }
  },

  // Dynamic Joint Customers Management (+ જોઇન્ટ નામ ઉમેરો)
  addJointCustomer(data = null) {
    if (this.jointCustomerCount >= this.maxJointCustomers) {
      alert('મહત્તમ ૪ ગ્રાહકો (૧ મુખ્ય + ૩ જોઈન્ટ) સુધી જ વિગતો ઉમેરી શકાશે.');
      return;
    }

    this.jointCustomerCount++;
    const idx = this.jointCustomerCount + 1; // 2, 3, 4
    const container = document.getElementById('jointCustomersContainer');
    if (!container) return;

    const div = document.createElement('div');
    div.id = `jointCustomerBlock_${idx}`;
    div.className = 'p-4 bg-slate-50 border-2 border-dashed border-blue-200 rounded-xl relative space-y-3';
    div.innerHTML = `
      <div class="flex items-center justify-between border-b border-slate-200 pb-2">
        <span class="text-xs font-black text-blue-900 flex items-center gap-1.5">
          <i data-lucide="user-plus" class="w-3.5 h-3.5 text-blue-600"></i>
          કસ્ટમર ${idx} ની વિગત (JOINT APPLICANT ${idx})
        </span>
        <button type="button" onclick="OverdraftApp.removeJointCustomer(${idx})" class="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> રદ કરો
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div class="md:col-span-3">
          <label class="input-label" for="customerId_${idx}">કસ્ટમર ${idx} આઈડી</label>
          <input type="text" id="customerId_${idx}" class="form-input font-bold uppercase" placeholder="દા.ત. CUST00${idx}" value="${data ? (data.id || '') : ''}">
        </div>
        <div class="md:col-span-4">
          <label class="input-label" for="customerName_${idx}">ગ્રાહક ${idx} નું નામ <span class="req">*</span></label>
          <input type="text" id="customerName_${idx}" class="form-input font-bold uppercase text-blue-950" placeholder="સંપૂર્ણ નામ દાખલ કરો" value="${data ? (data.name || '') : ''}">
        </div>
        <div class="md:col-span-5">
          <label class="input-label" for="customerAddress_${idx}">ગ્રાહક ${idx} નું સરનામું</label>
          <input type="text" id="customerAddress_${idx}" class="form-input uppercase" placeholder="સરનામું દાખલ કરો" value="${data ? (data.address || '') : ''}">
        </div>
      </div>
    `;

    container.appendChild(div);
    if (window.lucide) lucide.createIcons();
    this.updateJointAddBtnState();
  },

  removeJointCustomer(idx) {
    const el = document.getElementById(`jointCustomerBlock_${idx}`);
    if (el) el.remove();
    this.jointCustomerCount = Math.max(0, this.jointCustomerCount - 1);
    this.updateJointAddBtnState();
  },

  updateJointAddBtnState() {
    const btn = document.getElementById('btnAddJoint') || document.getElementById('btnAddJointCustomer');
    if (!btn) return;
    if (this.jointCustomerCount >= this.maxJointCustomers) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'inline-flex';
    }
  },

  // Alias for addFdRow invoked by index.html
  addFdReceiptRow(data = null) {
    return this.addFdRow(data);
  },

  // Dynamic Fixed Deposit Receipts Table (+ રસીદ ઉમેરો)
  addFdRow(data = null) {
    this.fdRowCount++;
    const tbody = document.getElementById('fdReceiptsTbody');
    if (!tbody) return;

    const rowId = `fdRow_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const tr = document.createElement('tr');
    tr.id = rowId;
    tr.className = 'border-b border-slate-200 hover:bg-slate-50/70 transition';

    tr.innerHTML = `
      <td class="p-2 text-center font-bold text-slate-500 row-idx text-xs">${this.fdRowCount}</td>
      <td class="p-2">
        <input type="text" class="form-input font-mono font-bold text-xs py-1 px-2 cert-no" placeholder="CERT NO" value="${data ? data.certNo : ''}">
      </td>
      <td class="p-2">
        <input type="date" class="form-input text-xs py-1 px-2 font-bold dep-date" value="${data ? data.depDate : ''}">
      </td>
      <td class="p-2">
        <input type="date" class="form-input text-xs py-1 px-2 font-bold mat-date" value="${data ? data.matDate : ''}">
      </td>
      <td class="p-2">
        <input type="number" step="0.01" oninput="OverdraftApp.calcFdTotals()" class="form-input text-xs py-1 px-2 text-right font-black text-blue-950 dep-amt" placeholder="0.00" value="${data ? data.depAmount : ''}">
      </td>
      <td class="p-2">
        <input type="number" step="0.01" oninput="OverdraftApp.calcFdTotals()" class="form-input text-xs py-1 px-2 text-right font-black text-emerald-800 loan-amt" placeholder="0.00" value="${data ? data.rowLoanAmt : ''}">
      </td>
      <td class="p-2 text-center">
        <button type="button" onclick="OverdraftApp.removeFdRow('${rowId}')" class="text-red-500 hover:text-red-700 font-bold p-1 rounded hover:bg-red-50 transition cursor-pointer" title="રદ કરો">
          <i data-lucide="x-circle" class="w-4 h-4"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
    if (window.lucide) lucide.createIcons();
    this.reindexFdRows();
    this.calcFdTotals();
  },

  removeFdRow(rowId) {
    const tbody = document.getElementById('fdReceiptsTbody');
    if (tbody && tbody.children.length <= 1) {
      alert('ઓછામાં ઓછી એક રસીદની વિગત જરૂરી છે.');
      return;
    }
    const row = document.getElementById(rowId);
    if (row) row.remove();
    this.reindexFdRows();
    this.calcFdTotals();
  },

  reindexFdRows() {
    const rows = document.querySelectorAll('#fdReceiptsTbody tr');
    this.fdRowCount = rows.length;
    rows.forEach((r, i) => {
      const idxCell = r.querySelector('.row-idx');
      if (idxCell) idxCell.textContent = i + 1;
    });
  },

  calcFdTotals() {
    let totalDep = 0;
    let totalLoan = 0;

    document.querySelectorAll('#fdReceiptsTbody tr').forEach(r => {
      const dep = parseFloat(r.querySelector('.dep-amt')?.value) || 0;
      const loan = parseFloat(r.querySelector('.loan-amt')?.value) || 0;
      totalDep += dep;
      totalLoan += loan;
    });

    const totalDepEl = document.getElementById('totalDepositAmount');
    const totalLoanEl = document.getElementById('totalFdLoanAmount') || document.getElementById('totalRowLoanAmount');
    if (totalDepEl) totalDepEl.textContent = `₹ ${totalDep.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (totalLoanEl) totalLoanEl.textContent = `₹ ${totalLoan.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    const mainLoanInput = document.getElementById('loanAmount');
    if (mainLoanInput && (!mainLoanInput.value || parseFloat(mainLoanInput.value) === 0) && totalLoan > 0) {
      mainLoanInput.value = totalLoan;
      const wordsGujEl = document.getElementById('loanAmountWordsGuj');
      const wordsEngEl = document.getElementById('loanAmountWordsEng');
      if (wordsGujEl) wordsGujEl.value = numberToGujaratiWords(totalLoan);
      if (wordsEngEl) wordsEngEl.value = numberToEnglishWords(totalLoan);
    }
  },

  // Save Record To Local Storage
  saveRecord() {
    const branchName = document.getElementById('branchSelect')?.value || '';
    const loanDate = document.getElementById('loanDate')?.value || '';
    const cust1Id = (document.getElementById('customerId_1') || document.getElementById('cust1Id'))?.value.trim() || '';
    const cust1Name = (document.getElementById('customerName_1') || document.getElementById('cust1Name'))?.value.trim() || '';
    const cust1Address = (document.getElementById('customerAddress_1') || document.getElementById('cust1Address'))?.value.trim() || '';
    const savingAccNo = (document.getElementById('savingAccountNo') || document.getElementById('savingAccNo'))?.value.trim() || '';
    const loanAmount = parseFloat(document.getElementById('loanAmount')?.value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate')?.value) || 8.50;
    const loanPurpose = document.getElementById('loanPurpose')?.value.trim() || '';

    // Form Validations
    if (!cust1Name) {
      alert('કૃપા કરીને મુખ્ય ગ્રાહકનું નામ દાખલ કરો.');
      (document.getElementById('customerName_1') || document.getElementById('cust1Name'))?.focus();
      return;
    }

    if (!savingAccNo || savingAccNo.length !== 15) {
      alert('સેવિંગ ખાતા નંબર ફરજિયાત ૧૫ આંકડાનો હોવો જોઈએ.');
      (document.getElementById('savingAccountNo') || document.getElementById('savingAccNo'))?.focus();
      return;
    }

    if (loanAmount <= 0) {
      alert('કૃપા કરીને માન્ય લોનની રકમ દાખલ કરો.');
      document.getElementById('loanAmount')?.focus();
      return;
    }

    // Collect Joint Applicants
    const jointApplicants = [];
    for (let i = 2; i <= 4; i++) {
      const nameEl = document.getElementById(`customerName_${i}`) || document.getElementById(`cust${i}Name`);
      if (nameEl && nameEl.value.trim()) {
        const idEl = document.getElementById(`customerId_${i}`) || document.getElementById(`cust${i}Id`);
        const addrEl = document.getElementById(`customerAddress_${i}`) || document.getElementById(`cust${i}Address`);
        jointApplicants.push({
          idx: i,
          id: idEl?.value.trim() || '',
          name: nameEl.value.trim().toUpperCase(),
          address: addrEl?.value.trim().toUpperCase() || ''
        });
      }
    }

    // Collect FD Receipts
    const fdReceipts = [];
    document.querySelectorAll('#fdReceiptsTbody tr').forEach(r => {
      const certNo = r.querySelector('.cert-no')?.value.trim() || '';
      const depDate = r.querySelector('.dep-date')?.value || '';
      const matDate = r.querySelector('.mat-date')?.value || '';
      const depAmount = parseFloat(r.querySelector('.dep-amt')?.value) || 0;
      const rowLoanAmt = parseFloat(r.querySelector('.loan-amt')?.value) || 0;
      if (certNo || depAmount > 0) {
        fdReceipts.push({ certNo, depDate, matDate, depAmount, rowLoanAmt });
      }
    });

    const recordId = this.currentRecordId || `OD_${Date.now()}`;
    const record = {
      id: recordId,
      createdAt: this.currentRecordId ? (this.getRecord(this.currentRecordId)?.createdAt || Date.now()) : Date.now(),
      updatedAt: Date.now(),
      branchName,
      loanDate,
      applicant1: { id: cust1Id, name: cust1Name.toUpperCase(), address: cust1Address.toUpperCase() },
      jointApplicants,
      loanAmount,
      loanAmountWordsGuj: numberToGujaratiWords(loanAmount),
      loanAmountWordsEng: numberToEnglishWords(loanAmount),
      interestRate,
      loanPurpose,
      savingAccNo,
      fdReceipts
    };

    const allRecords = this.getAllRecords();
    allRecords[recordId] = record;
    localStorage.setItem('tjccb_od_loans', JSON.stringify(allRecords));

    alert(`✓ ઓવરડ્રાફ્ટ લોન રેકોર્ડ સફળતાપૂર્વક સેવ થયો!\nગ્રાહકનું નામ: ${cust1Name.toUpperCase()}\nલોન રકમ: ₹ ${loanAmount.toLocaleString('en-IN')}`);
    
    this.currentRecordId = null;
    this.resetForm();
    this.updateRegisterTable();
    this.updateReportMetrics();
    this.switchTab('register');
  },

  getAllRecords() {
    try {
      return JSON.parse(localStorage.getItem('tjccb_od_loans') || '{}');
    } catch (e) {
      return {};
    }
  },

  getRecord(id) {
    return this.getAllRecords()[id] || null;
  },

  deleteRecord(id) {
    if (!confirm('શું આપ ખરેખર આ ઓવરડ્રાફ્ટ લોન રેકોર્ડ રદ કરવા માંગો છો?')) return;
    const all = this.getAllRecords();
    delete all[id];
    localStorage.setItem('tjccb_od_loans', JSON.stringify(all));
    this.updateRegisterTable();
    this.updateReportMetrics();
  },

  editRecord(id) {
    const record = this.getRecord(id);
    if (!record) return;

    this.currentRecordId = record.id;
    this.switchTab('form');

    const bSelect = document.getElementById('branchSelect');
    if (bSelect && record.branchName) bSelect.value = record.branchName;

    const lDate = document.getElementById('loanDate');
    if (lDate && record.loanDate) lDate.value = record.loanDate;

    const c1Id = document.getElementById('customerId_1') || document.getElementById('cust1Id');
    const c1Name = document.getElementById('customerName_1') || document.getElementById('cust1Name');
    const c1Addr = document.getElementById('customerAddress_1') || document.getElementById('cust1Address');
    if (c1Id) c1Id.value = record.applicant1?.id || '';
    if (c1Name) c1Name.value = record.applicant1?.name || '';
    if (c1Addr) c1Addr.value = record.applicant1?.address || '';

    // Clear and restore Joint Applicants
    const jointContainer = document.getElementById('jointCustomersContainer');
    if (jointContainer) jointContainer.innerHTML = '';
    this.jointCustomerCount = 0;
    if (record.jointApplicants && record.jointApplicants.length > 0) {
      record.jointApplicants.forEach(j => {
        this.addJointCustomer({ id: j.id, name: j.name, address: j.address });
      });
    }

    const accInput = document.getElementById('savingAccountNo') || document.getElementById('savingAccNo');
    if (accInput) {
      accInput.value = record.savingAccNo || '';
      this.validateSavingAccNumber(record.savingAccNo || '');
    }

    const loanAmtEl = document.getElementById('loanAmount');
    if (loanAmtEl) loanAmtEl.value = record.loanAmount || '';

    const wordsGujEl = document.getElementById('loanAmountWordsGuj');
    const wordsEngEl = document.getElementById('loanAmountWordsEng');
    if (wordsGujEl) wordsGujEl.value = record.loanAmountWordsGuj || numberToGujaratiWords(record.loanAmount || 0);
    if (wordsEngEl) wordsEngEl.value = record.loanAmountWordsEng || numberToEnglishWords(record.loanAmount || 0);

    const roiEl = document.getElementById('interestRate');
    if (roiEl) roiEl.value = record.interestRate || '8.50';

    const purposeEl = document.getElementById('loanPurpose');
    if (purposeEl) purposeEl.value = record.loanPurpose || '';

    // Restore FD Receipts
    const tbody = document.getElementById('fdReceiptsTbody');
    if (tbody) tbody.innerHTML = '';
    this.fdRowCount = 0;
    if (record.fdReceipts && record.fdReceipts.length > 0) {
      record.fdReceipts.forEach(fd => this.addFdRow(fd));
    } else {
      this.addFdRow();
    }
  },

  resetForm() {
    this.currentRecordId = null;
    const form = document.getElementById('overdraftForm');
    if (form) form.reset();

    const c1Id = document.getElementById('customerId_1') || document.getElementById('cust1Id');
    const c1Name = document.getElementById('customerName_1') || document.getElementById('cust1Name');
    const c1Addr = document.getElementById('customerAddress_1') || document.getElementById('cust1Address');
    if (c1Id) c1Id.value = '';
    if (c1Name) c1Name.value = '';
    if (c1Addr) c1Addr.value = '';
    
    const jointContainer = document.getElementById('jointCustomersContainer');
    if (jointContainer) jointContainer.innerHTML = '';
    this.jointCustomerCount = 0;
    this.updateJointAddBtnState();

    const tbody = document.getElementById('fdReceiptsTbody');
    if (tbody) tbody.innerHTML = '';
    this.fdRowCount = 0;
    this.addFdRow();

    this.initDefaultDate();
    this.validateSavingAccNumber('');
  },

  // Switch App Navigation Tab
  switchTab(tab) {
    this.activeTab = tab;
    const formView = document.getElementById('formView');
    const registerView = document.getElementById('registerView');
    const reportView = document.getElementById('reportView');

    if (formView) formView.style.display = tab === 'form' ? 'block' : 'none';
    if (registerView) registerView.style.display = tab === 'register' ? 'block' : 'none';
    if (reportView) reportView.style.display = tab === 'reports' ? 'block' : 'none';

    document.querySelectorAll('.tab-btn').forEach(b => {
      if (b.dataset.tab === tab) {
        b.classList.add('nav-tab-active');
        b.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        b.classList.remove('nav-tab-active');
        b.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });

    if (tab === 'register') this.updateRegisterTable();
    if (tab === 'reports') this.updateReportMetrics();
  },

  // Update Form Register Table
  updateRegisterTable() {
    const tbody = document.getElementById('registerTbody') || document.getElementById('registerTableBody');
    const countBadge = document.getElementById('registerCountBadge');
    if (!tbody) return;

    const allRecords = Object.values(this.getAllRecords());
    if (countBadge) countBadge.textContent = allRecords.length;

    const search = (document.getElementById('searchRegister')?.value || '').trim().toLowerCase();
    const filterBranch = (document.getElementById('filterBranch')?.value || '').trim().toLowerCase();

    const filtered = allRecords.filter(r => {
      const matchSearch = !search || 
        (r.applicant1.name && r.applicant1.name.toLowerCase().includes(search)) ||
        (r.applicant1.id && r.applicant1.id.toLowerCase().includes(search)) ||
        (r.savingAccNo && r.savingAccNo.toLowerCase().includes(search)) ||
        (r.fdReceipts && r.fdReceipts.some(f => f.certNo.toLowerCase().includes(search)));

      const matchBranch = !filterBranch || (r.branchName && r.branchName.toLowerCase().includes(filterBranch));
      return matchSearch && matchBranch;
    });

    filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="p-8 text-center text-slate-400 font-bold text-xs">
            <i data-lucide="file-question" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
            કોઈ ઓવરડ્રાફ્ટ લોન રેકોર્ડ મળેલ નથી.
          </td>
        </tr>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    tbody.innerHTML = filtered.map((r, i) => `
      <tr class="border-b border-slate-200 hover:bg-blue-50/40 transition text-xs">
        <td class="p-3 text-center font-bold text-slate-500">${i + 1}</td>
        <td class="p-3 font-mono font-bold text-blue-900">${r.id}</td>
        <td class="p-3 font-mono font-bold text-slate-600">${r.loanDate ? r.loanDate.split('-').reverse().join('/') : '-'}</td>
        <td class="p-3">
          <div class="font-black text-blue-950">${r.applicant1.name}</div>
          <div class="text-[10px] text-slate-500 font-semibold">ID: ${r.applicant1.id || 'N/A'} • A/c: ${r.savingAccNo}</div>
        </td>
        <td class="p-3 text-xs font-bold text-slate-700">${r.branchName}</td>
        <td class="p-3 text-right font-black text-emerald-800 text-sm">
          ₹ ${r.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          <div class="text-[10px] text-slate-500 font-bold">ROI: ${r.interestRate}%</div>
        </td>
        <td class="p-3 text-center">
          <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[11px] border border-blue-200">
            ${r.fdReceipts ? r.fdReceipts.length : 0} Receipts
          </span>
        </td>
        <td class="p-3 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="OverdraftApp.editRecord('${r.id}')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold shadow transition cursor-pointer" title="Edit Application">
              Edit
            </button>
            <button onclick="OverdraftApp.printEntryDocuments('${r.id}')" class="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold shadow transition cursor-pointer flex items-center gap-1" title="દસ્તાવેજ પ્રિન્ટ કરો">
              <i data-lucide="printer" class="w-3.5 h-3.5 text-amber-300"></i> પ્રિન્ટ
            </button>
            <button onclick="OverdraftApp.deleteRecord('${r.id}')" class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow transition cursor-pointer" title="Delete">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    if (window.lucide) lucide.createIcons();
  },

  // Update Report Metrics
  updateReportMetrics() {
    const records = Object.values(this.getAllRecords());
    const totalApps = records.length;
    let totalLoan = 0;
    let totalFd = 0;
    let roiSum = 0;

    const branchSummary = {};

    records.forEach(r => {
      totalLoan += r.loanAmount || 0;
      roiSum += r.interestRate || 0;

      let rFdTotal = 0;
      (r.fdReceipts || []).forEach(f => {
        rFdTotal += f.depAmount || 0;
      });
      totalFd += rFdTotal;

      const bName = r.branchName || 'OTHER';
      if (!branchSummary[bName]) {
        branchSummary[bName] = { count: 0, loanAmt: 0, fdAmt: 0 };
      }
      branchSummary[bName].count++;
      branchSummary[bName].loanAmt += r.loanAmount || 0;
      branchSummary[bName].fdAmt += rFdTotal;
    });

    const avgRoi = totalApps > 0 ? (roiSum / totalApps).toFixed(2) : '0.00';

    if (document.getElementById('repTotalApps')) document.getElementById('repTotalApps').textContent = totalApps;
    if (document.getElementById('repTotalLoan')) document.getElementById('repTotalLoan').textContent = `₹ ${totalLoan.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (document.getElementById('repTotalFd')) document.getElementById('repTotalFd').textContent = `₹ ${totalFd.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (document.getElementById('repAvgRoi')) document.getElementById('repAvgRoi').textContent = `${avgRoi} %`;

    // Branch Wise Breakdown
    const tbody = document.getElementById('repBranchTbody');
    if (!tbody) return;

    const branches = Object.keys(branchSummary);
    if (branches.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="p-6 text-center text-slate-400 font-bold text-xs">કોઈ ડેટા ઉપલબ્ધ નથી</td></tr>';
      return;
    }

    tbody.innerHTML = branches.map((b, i) => `
      <tr class="border-b border-slate-200 text-xs">
        <td class="p-2.5 text-center font-bold text-slate-500">${i + 1}</td>
        <td class="p-2.5 font-bold text-slate-800">${b}</td>
        <td class="p-2.5 text-center font-black text-blue-900">${branchSummary[b].count}</td>
        <td class="p-2.5 text-right font-bold text-emerald-800">₹ ${branchSummary[b].loanAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td class="p-2.5 text-right font-bold text-amber-800">₹ ${branchSummary[b].fdAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('');
  },

  // Export CSV
  exportCSV() {
    const records = Object.values(this.getAllRecords());
    if (records.length === 0) {
      alert('એક્સપોર્ટ કરવા માટે કોઈ રેકોર્ડ ઉપલબ્ધ નથી.');
      return;
    }

    let csv = 'ID,Date,Branch,Customer Name,Customer ID,Saving A/c No,Loan Amount,ROI,Pledged FD Count\n';
    records.forEach(r => {
      csv += `"${r.id}","${r.loanDate}","${r.branchName}","${r.applicant1.name}","${r.applicant1.id}","${r.savingAccNo}","${r.loanAmount}","${r.interestRate}","${r.fdReceipts ? r.fdReceipts.length : 0}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TJCCB_Overdraft_Loans_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  },

  // Export / Import JSON Backup
  exportJSON() {
    const data = JSON.stringify(this.getAllRecords(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TJCCB_Overdraft_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  async exportXLSX() {
    try {
      if (window.CentralBackup) {
        await CentralBackup.exportModuleXLSX('od');
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
        await CentralBackup.exportModuleCSV('od');
      } else {
        alert("Backup engine loading...");
      }
    } catch (e) {
      alert("CSV Export Error: " + e.message);
    }
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
      const count = inspection.stats.odLoans || (inspection.sheets["OD_LOANS"] ? inspection.sheets["OD_LOANS"].length : 0);
      
      const proceed = confirm(`ફાઇલ વેરિફિકેશન સફળ!\nફાઇલ નામ: ${file.name}\nમળેલ OD લોન એકાઉન્ટ્સ: ${count} રેકોર્ડ્સ\n\nશું આપ આ ડેટા Overdraft પોર્ટલમાં રીસ્ટોર કરવા માંગો છો?`);
      if (!proceed) return;

      const report = await CentralBackup.executeRestore(inspection, 'od', 'merge');
      this.updateRegisterTable();
      this.updateReportMetrics();

      alert(`✓ Overdraft ડેટા સફળતાપૂર્વક રીસ્ટોર થયો!\nકુલ ${report.odRestored} રેકોર્ડ્સ અપડેટ થયા.`);
    } catch (err) {
      alert("Restore Error: " + err.message);
    } finally {
      event.target.value = "";
    }
  },

  importJSON(event) {
    this.restoreBackupFile(event);
  },

  clearAllRecords() {
    if (!confirm('ચેતવણી: શું આપ ખરેખર તમામ ઓવરડ્રાફ્ટ લોન રેકોર્ડ્સ કાયમ માટે ડિલીટ કરવા માંગો છો?')) return;
    localStorage.removeItem('tjccb_od_loans');
    this.updateRegisterTable();
    this.updateReportMetrics();
    alert('તમામ રેકોર્ડ્સ સફળતાપૂર્વક ક્લીયર થઈ ગયા છે.');
  },

  // Print Single Entry Documents from Loan Register
  printEntryDocuments(recordId) {
    try {
      const records = this.getAllRecords();
      const record = records[recordId];
      if (!record) {
        alert('રેકોર્ડ મળેલ નથી: ' + recordId);
        return;
      }
      this.currentRecordId = recordId;
      this.preparePrintData(record);
      this.openPrintPreview(recordId);
    } catch (err) {
      console.error('Error in printEntryDocuments:', err);
      alert('પ્રિન્ટ ઓપન કરવામાં સમસ્યા: ' + err.message);
    }
  },

  // Print Loan Register Summary Report
  printLoanRegisterReport() {
    const records = Object.values(this.getAllRecords());
    if (records.length === 0) {
      alert('પ્રિન્ટ કરવા માટે કોઈ ઓવરડ્રાફ્ટ લોન રેકોર્ડ ઉપલબ્ધ નથી.');
      return;
    }
    window.print();
  },

  // ==================== DOCUMENT PRINT ENGINE (ALL 5 OFFICIAL DOCUMENTS) ====================
  preparePrintData(record = null) {
    if (!record) {
      const branchName = document.getElementById('branchSelect')?.value || '01 - AZADCHOWK BRANCH [CBB]';
      const loanDate = document.getElementById('loanDate')?.value || new Date().toISOString().split('T')[0];
      const cust1Id = (document.getElementById('customerId_1') || document.getElementById('cust1Id'))?.value.trim() || '';
      const cust1Name = (document.getElementById('customerName_1') || document.getElementById('cust1Name'))?.value.trim() || '';
      const cust1Address = (document.getElementById('customerAddress_1') || document.getElementById('cust1Address'))?.value.trim() || '';
      const savingAccNo = (document.getElementById('savingAccountNo') || document.getElementById('savingAccNo'))?.value.trim() || '';
      let loanAmount = parseFloat(document.getElementById('loanAmount')?.value) || 0;
      const interestRate = parseFloat(document.getElementById('interestRate')?.value) || 8.50;
      const loanPurpose = document.getElementById('loanPurpose')?.value.trim() || 'PERSONAL USE';

      const jointApplicants = [];
      for (let i = 2; i <= 4; i++) {
        const nameEl = document.getElementById(`customerName_${i}`) || document.getElementById(`cust${i}Name`);
        if (nameEl && nameEl.value.trim()) {
          const idEl = document.getElementById(`customerId_${i}`) || document.getElementById(`cust${i}Id`);
          const addrEl = document.getElementById(`customerAddress_${i}`) || document.getElementById(`cust${i}Address`);
          jointApplicants.push({
            idx: i,
            id: idEl?.value.trim() || '',
            name: nameEl.value.trim().toUpperCase(),
            address: addrEl?.value.trim().toUpperCase() || ''
          });
        }
      }

      const fdReceipts = [];
      let totalFdLoan = 0;
      document.querySelectorAll('#fdReceiptsTbody tr').forEach(r => {
        const certNo = r.querySelector('.cert-no')?.value.trim() || '';
        const depDate = r.querySelector('.dep-date')?.value || '';
        const matDate = r.querySelector('.mat-date')?.value || '';
        const depAmount = parseFloat(r.querySelector('.dep-amt')?.value) || 0;
        const rowLoanAmt = parseFloat(r.querySelector('.loan-amt')?.value) || 0;
        totalFdLoan += rowLoanAmt;
        if (certNo || depAmount > 0 || rowLoanAmt > 0) {
          fdReceipts.push({ certNo, depDate, matDate, depAmount, rowLoanAmt });
        }
      });

      if (loanAmount === 0 && totalFdLoan > 0) {
        loanAmount = totalFdLoan;
      }

      const wordsGuj = document.getElementById('loanAmountWordsGuj')?.value.trim() || numberToGujaratiWords(loanAmount);
      const wordsEng = document.getElementById('loanAmountWordsEng')?.value.trim() || numberToEnglishWords(loanAmount);

      record = {
        id: this.currentRecordId || 'DRAFT',
        branchName,
        loanDate,
        applicant1: { 
          id: cust1Id, 
          name: cust1Name ? cust1Name.toUpperCase() : 'ગ્રાહકનું નામ', 
          address: cust1Address ? cust1Address.toUpperCase() : 'જૂનાગઢ' 
        },
        jointApplicants,
        loanAmount,
        loanAmountWordsGuj: wordsGuj,
        loanAmountWordsEng: wordsEng,
        interestRate,
        loanPurpose,
        savingAccNo: savingAccNo || '000000000000000',
        fdReceipts
      };
    }

    // Populate all 5 official documents
    this.populatePromissoryNote(record);
    this.populateFdLoanAppDoc(record);
    this.populateLienPage1(record);
    this.populateLienPage2(record);
    this.populateLienPage3(record);
  },

// 1. ડીમાન્ડ પ્રોમીસરી નોટ (DEMAND PROMISSORY NOTE) (media_1788586786026.jpg - HALF A4 PAGE)
  populatePromissoryNote(record) {
    const container = document.getElementById('printDpNotePage');
    if (!container) return;

    try {
      const formattedDate = record.loanDate ? String(record.loanDate).split('-').reverse().join('/') : '';
      const applicantName = (record.applicant1 && record.applicant1.name) ? record.applicant1.name : '';
      const allNames = [applicantName, ...(record.jointApplicants || []).map(j => j && j.name)].filter(Boolean).join(', ') || 'ગ્રાહકનું નામ';
      const branchStr = record.branchName || '';
      const branchParts = branchStr.split('-');
      const branchClean = branchParts.length > 1 ? branchParts[1].trim() : (branchStr || 'મુખ્ય શાખા');
      const roi = ((typeof record.interestRate === 'number' ? record.interestRate : parseFloat(record.interestRate)) || 8.50).toFixed(2);
      const loanAmtNum = (typeof record.loanAmount === 'number' ? record.loanAmount : parseFloat(record.loanAmount)) || 0;
      const loanAmtStr = loanAmtNum ? loanAmtNum.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00';
      const applicantAddress = (record.applicant1 && record.applicant1.address) ? record.applicant1.address : 'જૂનાગઢ';

      container.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 2mm 4mm; box-sizing: border-box; font-family: 'Shruti', 'Gujarati MT', 'Noto Sans Gujarati', sans-serif; color: #000000;">
          
          <!-- Header Title -->
          <div style="text-align: center; margin-top: 2px; margin-bottom: 6px;">
            <div style="font-size: 15pt; font-weight: 900; color: #000000; letter-spacing: 0.5px; display: inline-block; border-bottom: 2px solid #000000; padding-bottom: 2px;">
              ડીમાન્ડ પ્રોમીસરી નોટ
            </div>
          </div>

          <!-- Amount Left & Date Right in Clean Single Line -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 10.5pt; font-weight: bold; color: #000000;">
            <div>રૂા. <strong>${loanAmtStr}</strong></div>
            <div>તારીખ : <strong>${formattedDate}</strong></div>
          </div>

          <!-- Main Promissory Text - Pure Continuous Legal Paragraph in Half A4 Page -->
          <div style="font-size: 10.2pt; line-height: 2.05; text-align: justify; color: #000000; flex: 1; padding: 2mm 0;">
            <p style="margin: 0; text-indent: 35px;">
              માંગણી કરવા પર હું / શ્રી <strong>${allNames}</strong>, રહેવાસી : <strong>${applicantAddress}</strong>, આજરોજ મને મળેલા અવેજ બદલ રૂા. <strong>${loanAmtStr}</strong> અંકે રૂપિયા <strong>${record.loanAmountWordsGuj || numberToGujaratiWords(loanAmtNum)}</strong> રોકડા <strong>${roi} %</strong> ના વાર્ષિક દરે, માસીક લેખે અથવા દર વર્ષે દર સેંકડે <strong>${roi}</strong> ટકા વ્યાજ માસિક સમયાનુસાર ગણત્રીએ, ચડત વ્યાજની રકમ સહીત, ધી જૂનાગઢ કોમર્શીયલ કો - ઓપરેટીવ બેંક લી., જૂનાગઢ ને અથવા તેના આદેશ અનુસાર તેની <strong>${branchClean}</strong> શાખામાં ચૂકવી આપવા વચન આપું છું.
            </p>
          </div>

          <!-- Bottom Signatures & Revenue Stamp Section -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 4px; padding-bottom: 4px;">
            
            <!-- Place Left -->
            <div style="font-size: 10.5pt; font-weight: bold; color: #000000; padding-bottom: 4px;">
              સ્થળ : <strong>જૂનાગઢ</strong>
            </div>

            <!-- Centered Revenue Stamp & Signature Area on Right -->
            <div style="display: flex; flex-direction: column; align-items: center; min-width: 220px;">
              
              <!-- Revenue Stamp Box Centered Above Signature Line -->
              <div style="width: 58px; height: 65px; margin-bottom: 5px; border: 1.2px dashed #000000; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #ffffff;">
                <span style="font-size: 8pt; color: #dc2626; font-weight: 900;">₹ 1.00</span>
                <span style="font-size: 7.5pt; color: #000000; font-weight: bold;">રેવન્યુ</span>
                <span style="font-size: 7.5pt; color: #000000; font-weight: bold;">સ્ટેમ્પ</span>
              </div>

              <!-- Signature Line -->
              <div style="width: 210px; border-bottom: 1.5px solid #000000; margin-bottom: 4px;"></div>

              <!-- Borrower's Name Below Signature Line -->
              <div style="font-size: 9.5pt; font-weight: bold; color: #000000; text-align: center; max-width: 220px; line-height: 1.2;">
                (${allNames})
              </div>
              
            </div>

          </div>

        </div>
      `;
    } catch (err) {
      console.error('Error populating Promissory Note:', err);
    }
  },

  // 2. બાંધી મુદત થાપણ સામે લોન/ઓવરડ્રાફ્ટ માટેનું અરજી ફોર્મ (media_1788588299822.jpg)
  populateFdLoanAppDoc(record) {
    const container = document.getElementById('printFdLoanAppPage');
    if (!container) return;

    try {
      const formattedDate = record.loanDate ? String(record.loanDate).split('-').reverse().join('/') : '';
      const applicantName = (record.applicant1 && record.applicant1.name) ? record.applicant1.name : '';
      const allNames = [applicantName, ...(record.jointApplicants || []).map(j => j && j.name)].filter(Boolean).join(', ') || 'ગ્રાહકનું નામ';
      const branchStr = record.branchName || '';
      const branchParts = branchStr.split('-');
      const branchClean = branchParts.length > 1 ? branchParts[1].trim() : (branchStr || 'મુખ્ય શાખા');
      const roi = ((typeof record.interestRate === 'number' ? record.interestRate : parseFloat(record.interestRate)) || 8.50).toFixed(2);
      const loanAmtNum = (typeof record.loanAmount === 'number' ? record.loanAmount : parseFloat(record.loanAmount)) || 0;
      const savingAccStr = record.savingAccNo || '000000000000000';

      let totalDeposit = 0;
      let totalLoanEligible = 0;
      const maxTableRows = 5;
      const tableRows = [];

      (record.fdReceipts || []).forEach((f, i) => {
        const depAmt = (typeof f.depAmount === 'number' ? f.depAmount : parseFloat(f.depAmount)) || 0;
        const loanAmt = (typeof f.rowLoanAmt === 'number' ? f.rowLoanAmt : parseFloat(f.rowLoanAmt)) || 0;
        totalDeposit += depAmt;
        totalLoanEligible += loanAmt;
        tableRows.push(`
          <tr style="height: 28px;">
            <td style="text-align: center; font-weight: bold; width: 40px; border: 1px solid #000; font-size: 8.5pt;">${i + 1}</td>
            <td style="font-weight: bold; text-align: center; width: 130px; border: 1px solid #000; font-size: 8.5pt;">${f.certNo || '-'}</td>
            <td style="text-align: center; width: 110px; border: 1px solid #000; font-size: 8.5pt;">${f.depDate ? String(f.depDate).split('-').reverse().join('/') : '-'}</td>
            <td style="text-align: center; width: 110px; border: 1px solid #000; font-size: 8.5pt;">${f.matDate ? String(f.matDate).split('-').reverse().join('/') : '-'}</td>
            <td style="text-align: right; font-weight: bold; width: 130px; border: 1px solid #000; font-size: 8.5pt;">₹ ${depAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td style="text-align: right; font-weight: bold; width: 130px; border: 1px solid #000; font-size: 8.5pt;">₹ ${loanAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        `);
      });

      for (let i = tableRows.length; i < maxTableRows; i++) {
        tableRows.push(`
          <tr style="height: 28px;">
            <td style="text-align: center; color: #94a3b8; border: 1px solid #000; font-size: 8.5pt;">${i + 1}</td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
          </tr>
        `);
      }

      container.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; font-size: 9.8pt; line-height: 2.0; font-family: 'Shruti', 'Gujarati MT', 'Noto Sans Gujarati', sans-serif; color: #000000;">
          
          <!-- Header exactly matching media_1788588299822.jpg -->
          <div>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div class="bank-logo-placeholder" style="width: 52px; height: 52px; shrink: 0;"></div>
              <div style="flex: 1;">
                <div style="font-size: 17pt; font-weight: 900; color: #000000; letter-spacing: 0.5px;">ધી જૂનાગઢ કોમર્શીયલ કો-ઓપરેટીવ બેંક લી.</div>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 7.8pt; color: #334155; margin-top: 4px; line-height: 1.4;">
              <div>
                Reg. No. Se-8221, Dt.18/02/1971<br>
                RBI Licence No. GJ-521 P
              </div>
              <div style="text-align: right;">
                રજી. ઓફિસ : ચંદ્રકાન્ત માલવિયા સ્મૃતિ ભવન, ચોકસી બજાર, જૂનાગઢ.<br>
                ફોન : ૦૨૮૫-૨૬૨૦૪૬૬ &nbsp;|&nbsp; Email : jccbank_ad1@sancharnet.in &nbsp;|&nbsp; Web : www.jcombank.com
              </div>
            </div>
            <div style="border-bottom: 2px solid #000000; margin: 6px 0 8px 0;"></div>
          </div>

          <!-- Form Title -->
          <div style="text-align: center; margin: 4px 0 8px 0;">
            <span style="font-size: 12.8pt; font-weight: 900; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 2px;">
              બાંધી મુદત થાપણ સામે લોન /ઓવરડ્રાફ્ટ માટેનું અરજી ફોર્મ
            </span>
          </div>

          <!-- Addressing & Date -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; font-size: 9.8pt; line-height: 1.6;">
            <div>
              <strong>પ્રતિ,</strong><br>
              મેનેજર સાહેબ,<br>
              ધી જૂનાગઢ કોમર્શીયલ કો-ઓપ બેન્ક લી.<br>
              <strong>${branchClean}</strong> શાખા
            </div>
            <div style="text-align: right;">
              તા. <strong>${formattedDate}</strong>
            </div>
          </div>

          <!-- Application Body Text - Pure Continuous Text -->
          <div style="text-align: justify; line-height: 2.05; margin-bottom: 8px; font-size: 9.8pt;">
            <strong>સાહેબશ્રી,</strong><br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;જય ભારત સાથ હું/અમો નીચે સહી કરનાર <strong>${allNames}</strong> આપની બેંકમાં નીચે દર્શાવ્યા મુજબની કુલ રૂપિયા <strong>₹ ${totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> ની બાંધી મુદત થાપણો ધરાવું છું/ધરાવીએ છીએ મારે/અમારે આ થાપણ સામે ધીરાણ લેવાની જરૂર હોય બેંકના બાંધી મુદત થાપણ ધીરાણ ખાતાના નિયમો અનુસાર તથા થાપણ સર્ટીફિકેટ બેંકમાં રાખી મને/અમોને ધીરાણ આપવા શ્રી/મે. <strong>${allNames}</strong> ને તેમના ખાતા નંબર <strong>${savingAccStr}</strong> માં ધીરાણની રકમ જમા આપવા વિનંતી.<br>
            <div style="margin-top: 4px;">
              આ ધીરાણ હું/અમો લોન/ઓવરડ્રાફ્ટ સ્વરૂપે મંજૂર કરવા વિનંતી કરૂ છું / કરીએ છીએ
            </div>
          </div>

          <!-- 5-Row Fixed Deposit Table -->
          <table class="print-doc-table" style="width: 100%; border-collapse: collapse; margin: 8px 0;">
            <thead>
              <tr style="height: 32px; background-color: #f8fafc;">
                <th style="width: 40px; border: 1px solid #000; font-size: 8.5pt; text-align: center;">ક્રમ</th>
                <th style="width: 130px; border: 1px solid #000; font-size: 8.5pt; text-align: center;">સર્ટીફિકેટ નંબર</th>
                <th style="width: 110px; border: 1px solid #000; font-size: 8.5pt; text-align: center;">થાપણ મુક્યા તા.</th>
                <th style="width: 110px; border: 1px solid #000; font-size: 8.5pt; text-align: center;">પાક્યા તા.</th>
                <th style="width: 130px; border: 1px solid #000; font-size: 8.5pt; text-align: center;">થાપણ રકમ રૂા.</th>
                <th style="width: 130px; border: 1px solid #000; font-size: 8.5pt; text-align: center;">ધીરાણ પાત્ર રકમ રૂા.</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows.join('')}
            </tbody>
            <tfoot>
              <tr style="height: 30px; font-weight: bold; background-color: #f8fafc;">
                <td colspan="4" style="text-align: right; border: 1px solid #000; padding: 0 8px; font-size: 9pt;">કુલ રૂા.</td>
                <td style="text-align: right; border: 1px solid #000; padding: 0 8px; font-size: 9pt;">₹ ${totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style="text-align: right; border: 1px solid #000; padding: 0 8px; font-size: 9pt;">₹ ${totalLoanEligible.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Signatures Section of Applicants -->
          <div style="margin: 10px 0 14px 0;">
            <div style="font-weight: bold; margin-bottom: 22px;">આપનો વિશ્વાસુ,</div>
            <div style="display: flex; justify-content: space-between; gap: 20px;">
              <div style="flex: 1; border-top: 1.2px solid #000; padding-top: 3px; font-size: 8.5pt; text-align: center;">
                ૧. <strong>${applicantName}</strong>
              </div>
              <div style="flex: 1; border-top: 1.2px solid #000; padding-top: 3px; font-size: 8.5pt; text-align: center;">
                ૨. ${(record.jointApplicants && record.jointApplicants[0]) ? record.jointApplicants[0].name : ''}
              </div>
              <div style="flex: 1; border-top: 1.2px solid #000; padding-top: 3px; font-size: 8.5pt; text-align: center;">
                ૩. ${(record.jointApplicants && record.jointApplicants[1]) ? record.jointApplicants[1].name : ''}
              </div>
            </div>
          </div>

          <!-- Bottom Official Use Border Box -->
          <div style="border: 1.2px solid #000; padding: 8px 12px; margin-top: 4px; font-size: 9.2pt; line-height: 1.85;">
            <div style="text-align: center; font-weight: 900; font-size: 10.5pt; margin-bottom: 6px;">
              (ફક્ત ઓફિસ ઉપયોગ માટે)
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold;">
              <div>બાંધી મુદત થાપણ રસીદ નં <strong>${(record.fdReceipts && record.fdReceipts[0] && record.fdReceipts[0].certNo) ? record.fdReceipts[0].certNo : '__________'}</strong></div>
              <div>રૂપીયા <strong>₹ ${totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
              <div>ચડતવ્યાજ રૂપીયા ____________________</div>
            </div>

            <div style="text-align: justify; margin-bottom: 22px;">
              શ્રી <strong>${allNames}</strong> તરફથી તેમની બાંધી મુદત થાપણ રસીદ સામે રૂપીયા <strong>₹ ${loanAmtNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> નું ધીરાણ મંજૂર કરવામાં આવે છે. તેમની સૂચના મુજબ શ્રી/મે. <strong>${allNames}</strong> ના ખાતા નંબર <strong>${savingAccStr}</strong> માં રૂપીયા <strong>₹ ${loanAmtNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> ની લોન/ નો ઓવરડ્રાફ્ટ <strong>${roi} %</strong> ટકાના વાર્ષિક વ્યાજના દરથી બેંકના બાંધી મુદત થાપણ ધીરાણના નિયમો મુજબ મંજુર કરવામાં આવે છે.
            </div>

            <div style="display: flex; justify-content: space-between; padding: 0 45px; font-size: 10.5pt; font-weight: bold; margin-bottom: 4px;">
              <div>ઓફિસર</div>
              <div>મેનેજર</div>
            </div>
          </div>

        </div>
      `;
    } catch (err) {
      console.error('Error populating FD Loan App Doc:', err);
    }
  },

  // 3. સંમિશ્ર ગ્રહણાધિકાર પત્ર / COMPOSITE LETTER OF LIEN (PAGE 1) (media_1788588299814.jpg)
  populateLienPage1(record) {
    const container = document.getElementById('printLienPage1');
    if (!container) return;

    try {
      const formattedDate = record.loanDate ? String(record.loanDate).split('-').reverse().join('/') : '';
      const j1Name = record.applicant1 ? record.applicant1.name : '';
      const j1Addr = record.applicant1 ? (record.applicant1.address || '') : '';
      const j2Name = record.jointApplicants && record.jointApplicants[0] ? record.jointApplicants[0].name : '';
      const j2Addr = record.jointApplicants && record.jointApplicants[0] ? (record.jointApplicants[0].address || '') : '';
      const j3Name = record.jointApplicants && record.jointApplicants[1] ? record.jointApplicants[1].name : '';
      const j3Addr = record.jointApplicants && record.jointApplicants[1] ? (record.jointApplicants[1].address || '') : '';
      const branchStr = record.branchName || '';
      const branchParts = branchStr.split('-');
      const branchClean = branchParts.length > 1 ? branchParts[1].trim() : (branchStr || 'મુખ્ય શાખા');
      const roi = ((typeof record.interestRate === 'number' ? record.interestRate : parseFloat(record.interestRate)) || 8.50).toFixed(2);
      const dueDate = (record.fdReceipts && record.fdReceipts[0] && record.fdReceipts[0].matDate) 
        ? String(record.fdReceipts[0].matDate).split('-').reverse().join('/') 
        : formattedDate;

    container.innerHTML = `
      <div style="display: block; font-family: 'Shruti', 'Gujarati MT', 'Noto Sans Gujarati', sans-serif; color: #000000; padding: 2mm 2mm; box-sizing: border-box;">
        
        <!-- Header Exactly as media_1788588299814.jpg -->
        <div>
          <div style="display: flex; align-items: center; gap: 14px;">
            <div class="bank-logo-placeholder" style="width: 50px; height: 50px; shrink: 0;"></div>
            <div style="flex: 1;">
              <div style="font-size: 16.5pt; font-weight: 900; color: #000000; letter-spacing: 0.5px;">The Junagadh Commercial Co-Operative Bank Ltd.</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 7.8pt; color: #334155; margin-top: 4px; line-height: 1.4;">
            <div>
              Reg. No. Se-8221, Dt.18/02/1971<br>
              RBI Licence No. GJ-521 P
            </div>
            <div style="text-align: right;">
              Reg. Office : Chandrakant Malaviya Smurti Bhavan, Choksi Bazar, Junagadh<br>
              Phone : 0285-2620496 &nbsp;|&nbsp; Email : jccbank_ad1@sancharnet.in &nbsp;|&nbsp; Web : www.jcombank.com
            </div>
          </div>
          <div style="border-bottom: 2px solid #000000; margin: 6px 0 12px 0;"></div>
        </div>

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 13.5pt; font-weight: 900; color: #000000;">संमिश्र ग्रहणाधिकार पत्र</div>
          <div style="font-size: 12pt; font-weight: 900; color: #000000; letter-spacing: 0.5px;">COMPOSITE LETTER OF LIEN</div>
          <div style="font-size: 9.5pt; font-weight: 700; color: #000000; margin-top: 3px;">(निजी जमाराशियों के सावधि जमा पर ऋण खाता के लिए)</div>
          <div style="font-size: 9.5pt; font-weight: 700; color: #000000;">(For LTD Accounts of Own Deposits)</div>
        </div>

        <!-- From & Place/Date/Box Grid -->
        <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; margin-bottom: 14px; font-size: 9.8pt;">
          
          <!-- Left: From lines -->
          <div>
            <strong>प्रेषक / From</strong>
            <div style="margin-top: 4px; line-height: 1.6;">
              <strong>1)</strong> <strong>${j1Name}</strong><br>
              &nbsp;&nbsp;&nbsp;<span style="font-size: 9pt;">${j1Addr}</span>
            </div>
            ${j2Name ? `
            <div style="margin-top: 6px; line-height: 1.6;">
              <strong>2)</strong> <strong>${j2Name}</strong><br>
              &nbsp;&nbsp;&nbsp;<span style="font-size: 9pt;">${j2Addr}</span>
            </div>` : ''}
            ${j3Name ? `
            <div style="margin-top: 6px; line-height: 1.6;">
              <strong>3)</strong> <strong>${j3Name}</strong><br>
              &nbsp;&nbsp;&nbsp;<span style="font-size: 9pt;">${j3Addr}</span>
            </div>` : ''}
          </div>

          <!-- Right: Place, Date & Box -->
          <div>
            <div style="margin-bottom: 6px;">स्थान / Place : <strong>JUNAGADH</strong></div>
            <div style="margin-bottom: 8px;">दिनांक / Date : <strong>${formattedDate}</strong></div>

            <div style="border: 1.5px solid #000; padding: 8px 12px; line-height: 1.65; font-size: 9.2pt;">
              <div style="font-weight: bold;">स्थायि जमा पर</div>
              <div style="font-weight: bold;">ऋण खाता सं.</div>
              <div>LTD A/c No. : <strong>${record.savingAccNo}</strong></div>
              <div>दिनांक / Date : <strong>${formattedDate}</strong></div>
            </div>
          </div>

        </div>

        <!-- To Block -->
        <div style="margin-bottom: 14px; font-size: 9.8pt; line-height: 1.6;">
          <strong>सेवा मे / To</strong><br>
          The Junagadh Commercial Co-Operative Bank Ltd.<br>
          Address : Chandrakant Malaviya Smurti Bhavan, Choksi Bazar, Junagadh<br>
          Branch : <strong>${branchClean}</strong><br>
          <strong>महोदय / Sirs,</strong>
        </div>

        <!-- Clauses 1 & 2 - Pure Continuous Text (No underlines) -->
        <div style="text-align: justify; font-size: 10.3pt; line-height: 2.12;">
          
          <div style="margin-bottom: 22px;">
            <strong>1.</strong>&nbsp;&nbsp;&nbsp;&nbsp;मेरे / हमारे अनुरोध पर मुझे / हमे आज रु. <strong>₹ ${record.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> ( रुपये <strong>${record.loanAmountWordsGuj}</strong> ) मात्र रकम का ऋण प्रदान करने पर मे / हम इसके अंतर्गत आपके पत्र मे इस अनुसूची मे उल्लिखित जमा पर ( जो इसके पश्चयात <strong>“अनुसूची जमा”</strong> के नाम से अभिहित होगा) किसी भी समय मूलधन, व्याज लागत, प्रभार आदि के प्रति आपके बैंक को देय सभी धन के लिए प्रतिभूत के रूप मे उक्त ऋण पर ग्रहणाधिकार प्रदान करता हु / करते है ।<br>
            <div style="margin-top: 5px; line-height: 1.72; font-size: 9.4pt; color: #1e293b;">
              In Consideration of your granting at my / our request, a loan of Rs. <strong>₹ ${record.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> (Rupees <strong>${record.loanAmountWordsEng}</strong>) Only to me/us today. I/We hereby create a lien in your favour on the deposits described in the Schedule there of (hereinafter referred to as 'Schedule Deposits') as security for all moneys owing to your bank and time towards principal, interest, costs charges etc. on account of the said loan.
            </div>
          </div>

          <div style="margin-bottom: 18px;">
            <strong>2.</strong>&nbsp;&nbsp;&nbsp;&nbsp;मै / हम इस बात से सहमत हु / है की मे / हम दि <strong>${dueDate}</strong> को या उसके पहले तिमाही अंतराल मे <strong>${roi} %</strong> प्र.व. दर पर आज लिए गए उक्त ऋण की चुકોતી करूंगा/કરेंगे।<br>
            <div style="margin-top: 5px; line-height: 1.72; font-size: 9.4pt; color: #1e293b;">
              I/We agree that the aforesaid loan availed by me/us today shall be repaid by me/us to you with interest at <strong>${roi} %</strong> P.A. with quarterly rests, on or before <strong>${dueDate}</strong>
            </div>
          </div>

        </div>

        <!-- Borrower Signature Block at Bottom -->
        <div style="display: flex; justify-content: flex-end; margin-top: 35px; margin-bottom: 6px;">
          <div style="text-align: center; min-width: 220px;">
            <div style="border-bottom: 1.5px solid #000; margin-bottom: 4px;"></div>
            <div style="font-size: 10pt; font-weight: bold; color: #000;">(${allNames})</div>
            <div style="font-size: 8.5pt; color: #475569;">(અરજદાર / કરજદારની સહી)</div>
          </div>
        </div>
        </div>
      `;
    } catch (err) {
      console.error('Error populating Lien Page 1:', err);
    }
  },

  // 4. સંમિશ્ર ગ્રહણાધિકાર પત્ર (PAGE 2 - CLAUSES 3 TO 8) (media_1788588299838.jpg)
  populateLienPage2(record) {
    const container = document.getElementById('printLienPage2');
    if (!container) return;

    try {
      const purpose = record.loanPurpose || 'PERSONAL USE';
      const applicantName = (record.applicant1 && record.applicant1.name) ? record.applicant1.name : '';
      const allNames = [applicantName, ...(record.jointApplicants || []).map(j => j && j.name)].filter(Boolean).join(', ') || 'ગ્રાહકનું નામ';

      container.innerHTML = `
        <div style="display: block; font-family: 'Shruti', 'Gujarati MT', 'Noto Sans Gujarati', sans-serif; color: #000000; text-align: justify; padding: 2mm 2mm; box-sizing: border-box;">
          
          <!-- Clause 3 -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 10.3pt; line-height: 2.12;">
              <strong>3.</strong>&nbsp;&nbsp;&nbsp;&nbsp;मै / हम यह घोषित करते है की उक्त ऋण मैंने / हमने <strong>${purpose}</strong> उददेश्य हेतु लिया है ।
            </div>
            <div style="margin-top: 5px; font-size: 9.4pt; line-height: 1.72; color: #1e293b;">
              I/ We declare that the aforesaid loan is availed be me / us for the purpose of <strong>${purpose}</strong>
            </div>
          </div>

          <!-- Clause 4 -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 10.3pt; line-height: 2.12;">
              <strong>4.</strong>&nbsp;&nbsp;&nbsp;&nbsp;मै / हम सहमत हु / है की अनुसूची जमा को मुजसे / हमसे संयुक्त रूप से और / अथवा पृथक रूप से और / या मुजसे किसी अन्य व्यक्ति (यों) के साथ सयुक्त रूप से अब या भविष्य मे किसी या अन्य सभी / ऋण और सुविधाओ या किसी अन्य प्रकार के ऋण पर जिसका आपके बैंक की किसी शाखा मे देय पाए जाने पर आपके बैंक के ग्रहણાधिकार के अंतर्गत ही प्रतिभूति जा सकती है ।
            </div>
            <div style="margin-top: 5px; font-size: 9.4pt; line-height: 1.72; color: #1e293b;">
              I/We agree that the Schedule Deposits may also be held as security subjects to your Bank/s lien, for any or all other loans and facilities or any other indebtedness of any nature whatsoever, on account of which any moneys may be found due to any of the branches of your Bank from me/us jointly and/ or severally, and/ or from me /us jointly with any other person(s), now or at any time hereafter.
            </div>
          </div>

          <!-- Clause 5 -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 10.3pt; line-height: 2.12;">
              <strong>5.</strong>&nbsp;&nbsp;&nbsp;&nbsp;मैं/हम इसके साथ अनुसूची जमा से संबधित રસીદ / प्रमाण पत्र / पासબૂક को विधिवत हस्ताक्षर कर आपको सोप देता हु / देते है।
            </div>
            <div style="margin-top: 5px; font-size: 9.4pt; line-height: 1.72; color: #1e293b;">
              I/We handover to you herewith the Receipts / Certificate (s) Pass Book(s) relating to Schedule Deposits duly discharged by me / us.
            </div>
          </div>

          <!-- Clause 6 -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 10.3pt; line-height: 2.12;">
              <strong>6.</strong>&nbsp;&nbsp;&nbsp;&nbsp;मै / हम सहमत हू / है की परिपक्ता दिनांक पर अथवा इसके पश्चात यदि किसी अनुसूची जमा का पूननविकरण किया जाए तो ऐसा / ऐसे पूननविकरण जमा भी आपके बैंक के ग्रहણાधिकार के अंतर्गत ही आयेगा / आयेंगे और इससे बनी प्रतिभूति का भाग ठीक वैसे ही बनेगा जैसा कि पूननविकृत जमा इस अनुसूची मै सम्मिलित है और मै / हम विधिवતશપથ लेता हु / लेते है कि इस प्रकार के पूननविकृत जमा से संबंध રસીદ / प्रमाण पत्र / पासબૂક को विधिवत विमुक्त कर आपको हस्तांतरित करूंगा / करेंगे।
            </div>
            <div style="margin-top: 5px; font-size: 9.4pt; line-height: 1.72; color: #1e293b;">
              I/We agree that in the event of renewal of any of the Schedule Deposits by me/us on or after the respective date of maturity, such renewed Deposit/s shall also be subject to the lien in favour of your Bank and from part of the security created hereby, as if such renewed Deposit/s are included in the Schedule here to and I/We undertake to duly discharge and handover to you the Receipt(s) / Certificate (s) Pass Book(s) relating to such renewed Deposit/s.
            </div>
          </div>

          <!-- Clause 7 -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 10.3pt; line-height: 2.12;">
              <strong>7.</strong>&nbsp;&nbsp;&nbsp;&nbsp;मै / हम आपके मेरे / हमारे सभी या किसी अनुसूची जमा कि अग्रिम राशि (વ્યાજ સહિત) को परिपकता दिनांकों को उससे पूर्व या बाद मे किसी भी समय इस पत्र के प्रथम और द्वितीय अनुच्छेद मे उद्भूत किसी या सभी ऋण / सुविधा या बैंक के किसी ऋण कि राशि वसूली के लिए / મુજે સૂચના दिये बिना ही विनियोजित करने के लिए प्राधिकृत करता हू / करते है।
            </div>
            <div style="margin-top: 5px; font-size: 9.4pt; line-height: 1.72; color: #1e293b;">
              I/We authorize you to appropriate the proceeds (inclusive of interest) of any or all the Schedule Deposits at any time before. on or after the respective dates of maturity at your sole discretion in realisation of the moneys due to your Bank in respect of any or all loans/facilities and other indebtedness referred to in the first and second paragraph herein, without any intimation to me/us.
            </div>
          </div>

          <!-- Clause 8 -->
          <div style="margin-bottom: 22px;">
            <div style="font-size: 10.3pt; line-height: 2.12;">
              <strong>8.</strong>&nbsp;&nbsp;&nbsp;&nbsp;मै / हम संप्रति और भविष्य मे लागू किये जाने वाले नियमो का पालन करने तथा व्याज के परिकलन हेतु सातवे अनुच्छेद मे किये गए प्राधिकार के आधार पर कि जानेवाली जमा कि अगમ રાશિ કે વિનિયોજન કો મેરી / હમારી ઉક્ત જમા કિ અદાયગી માનને કો સહમત હૂઁ/હૈં ।
            </div>
            <div style="margin-top: 5px; font-size: 9.4pt; line-height: 1.72; color: #1e293b;">
              I/We agree to abide by all the Rules and Regulations of your Bank, already in force and to be enforced in future, and appropriation of the proceeds of any of the Schedule Deposits by vitue of the authorisation made in the seventh paragraph herein shall be treated as payment of the said Deposits to me/us for the purpose of calculation of interest thereon
            </div>
          </div>

          <!-- Borrower Sign / Initial at bottom as per scan -->
          <div style="display: flex; justify-content: flex-end; margin-top: 25px; margin-bottom: 6px;">
            <div style="text-align: center; min-width: 220px;">
              <div style="border-bottom: 1.5px solid #000; margin-bottom: 4px;"></div>
              <div style="font-size: 10pt; font-weight: bold; color: #000;">(${allNames})</div>
              <div style="font-size: 8.5pt; color: #475569;">(અરજદાર / કરજદારની સહી)</div>
            </div>
          </div>

        </div>
      `;
    } catch (err) {
      console.error('Error populating Lien Page 2:', err);
    }
  },

  // 5. સંમિશ્ર ગ્રહણાધિકાર પત્ર (PAGE 3 - CLAUSE 9 + SCHEDULE + OFFICE USE) (media_1788588299801.jpg)
  populateLienPage3(record) {
    const container = document.getElementById('printLienPage3');
    if (!container) return;

    try {
      const formattedDate = record.loanDate ? String(record.loanDate).split('-').reverse().join('/') : '';
      const applicantName = (record.applicant1 && record.applicant1.name) ? record.applicant1.name : '';
      const allNames = [applicantName, ...(record.jointApplicants || []).map(j => j && j.name)].filter(Boolean).join(', ') || 'ગ્રાહકનું નામ';
      const roi = ((typeof record.interestRate === 'number' ? record.interestRate : parseFloat(record.interestRate)) || 8.50).toFixed(2);
      const loanAmtNum = (typeof record.loanAmount === 'number' ? record.loanAmount : parseFloat(record.loanAmount)) || 0;
      const savingAccStr = record.savingAccNo || '000000000000000';

      let totalDeposit = 0;
      const maxSchedRows = 5;
      const schedRows = [];

      (record.fdReceipts || []).forEach((f, i) => {
        const depAmt = (typeof f.depAmount === 'number' ? f.depAmount : parseFloat(f.depAmount)) || 0;
        totalDeposit += depAmt;
        schedRows.push(`
          <tr style="height: 28px;">
            <td style="text-align: center; font-weight: bold; width: 45px; border: 1px solid #000; font-size: 8.5pt;">${i + 1}</td>
            <td style="text-align: center; font-weight: bold; width: 140px; border: 1px solid #000; font-size: 8.5pt;">FIXED DEPOSIT</td>
            <td style="text-align: center; font-weight: bold; width: 130px; border: 1px solid #000; font-family: monospace; font-size: 8.5pt;">${savingAccStr}</td>
            <td style="text-align: center; width: 160px; border: 1px solid #000; font-weight: bold; font-size: 8.5pt;">${f.certNo || '-'}${f.depDate ? ' Dt. ' + String(f.depDate).split('-').reverse().join('/') : ''}</td>
            <td style="text-align: right; font-weight: bold; width: 130px; border: 1px solid #000; font-size: 8.5pt;">₹ ${depAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td style="text-align: center; width: 100px; border: 1px solid #000; font-size: 8.5pt;">${f.matDate ? String(f.matDate).split('-').reverse().join('/') : '-'}</td>
          </tr>
        `);
      });

      for (let i = schedRows.length; i < maxSchedRows; i++) {
        schedRows.push(`
          <tr style="height: 28px;">
            <td style="text-align: center; color: #94a3b8; border: 1px solid #000; font-size: 8.5pt;">${i + 1}</td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
          </tr>
        `);
      }

      container.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; font-size: 9.5pt; line-height: 1.85; font-family: 'Shruti', 'Gujarati MT', 'Noto Sans Gujarati', sans-serif; color: #000000; padding: 2mm 0; box-sizing: border-box;">
          
          <!-- Clause 9 Pure Clean Text -->
          <div style="text-align: justify; line-height: 1.85; margin-bottom: 8px;">
            <strong>9.</strong>&nbsp;&nbsp;&nbsp;&nbsp;मै / हम घोषणा करते है कि मैंने / हमने अनुसूची जमां को किसी भी प्रकार से बन्धक, समनुदेशित, प्रभारित या भारग्रस्त नहीं किया है।<br>
            <div style="margin-top: 4px; font-size: 8.8pt; line-height: 1.45; color: #1e293b;">
              I/We declare that I/We have not pledged, assigned, charged or encumbered in any manner the Schedule Deposits in favour of other party
            </div>
          </div>

          <!-- Schedule Deposits Table Matching Columns in media_1788588299801.jpg -->
          <table class="print-doc-table" style="width: 100%; border-collapse: collapse; margin: 6px 0;">
            <thead>
              <tr style="height: 32px; background-color: #f8fafc;">
                <th style="width: 45px; border: 1px solid #000; padding: 3px; font-size: 8pt; text-align: center;">क्रम संख्या<br>Sr.No.</th>
                <th style="width: 140px; border: 1px solid #000; padding: 3px; font-size: 8pt; text-align: center;">जमा खाते का स्वरूप<br>Nature of<br>Deposit Account</th>
                <th style="width: 130px; border: 1px solid #000; padding: 3px; font-size: 8pt; text-align: center;">खाता संख्या<br>Account No.<br>of the Deposit</th>
                <th style="border: 1px solid #000; padding: 3px; font-size: 8pt; text-align: center;">जमा रसीद / प्रमाणपत्रकी संख्या तथा दिनांक<br>Printed Number & Date<br>of Deposit Receipt / Certificate</th>
                <th style="width: 130px; border: 1px solid #000; padding: 3px; font-size: 8pt; text-align: center;">जमाराशि<br>Amount of<br>Deposit</th>
                <th style="width: 100px; border: 1px solid #000; padding: 3px; font-size: 8pt; text-align: center;">देय दिनांक<br>Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${schedRows.join('')}
            </tbody>
          </table>

          <!-- Yours Faithfully Signature Section on Right Exactly as Scan -->
          <div style="display: flex; justify-content: flex-end; margin: 6px 0 10px 0;">
            <div style="text-align: right; min-width: 250px;">
              <div style="font-weight: bold; font-size: 10.5pt; margin-bottom: 24px;">भवदीय / Yours Faithfully</div>
              <div style="border-bottom: 1.5px solid #000; margin-bottom: 4px;"></div>
              <div style="font-size: 10pt; font-weight: bold; color: #000; text-align: center;">(${allNames})</div>
            </div>
          </div>

          <!-- Dotted Separator Line -->
          <div style="border-top: 1.5px dashed #000; margin: 8px 0;"></div>

          <!-- For Office Use Section Exactly as media_1788588299801.jpg - Neat Two-Column Grid Alignment -->
          <div style="padding: 4px 0; font-size: 9.5pt; line-height: 1.85;">
            <div style="text-align: center; font-weight: 900; font-size: 11.5pt; margin-bottom: 8px; letter-spacing: 0.5px;">For Office Use</div>

            <!-- 2-Column Grid for Perfect Vertical Alignment -->
            <div style="display: grid; grid-template-columns: 56% 44%; gap: 6px 14px; margin-bottom: 6px; font-size: 9.2pt;">
              
              <!-- Row 1 -->
              <div>
                <span style="display: inline-block; min-width: 170px;">Total Deposit Amount :</span>
                <strong>₹ ${totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div>
                <span style="display: inline-block; min-width: 140px;">Accured Interest :</span>
                <span>____________________</span>
              </div>

              <!-- Row 2 -->
              <div>
                <span style="display: inline-block; min-width: 170px;">Depositor Name :-</span>
                <strong>${allNames}</strong>
              </div>
              <div>
                <span style="display: inline-block; min-width: 140px;">FDR A/c No. :</span>
                <strong>${savingAccStr}</strong>
              </div>

              <!-- Row 3 -->
              <div>
                <span style="display: inline-block; min-width: 170px;">Total Amount Deposit :</span>
                <strong>₹ ${totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div>
                <span style="display: inline-block; min-width: 140px;">Sanction Loan Amount Rs. :</span>
                <strong>₹ ${loanAmtNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>

            </div>

            <!-- Full Width Rows 4 & 5 -->
            <div style="margin-bottom: 5px; font-size: 9.2pt;">
              <span style="display: inline-block; min-width: 85px;">In Words :</span>
              <strong>${record.loanAmountWordsEng || ''}</strong>
            </div>

            <div style="margin-bottom: 8px; font-size: 9.2pt;">
              With Interest Rate <strong>${roi} %</strong>, to Loan A/c No : <strong>${savingAccStr}</strong>
            </div>

            <!-- Date & Place Row -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 9.8pt; font-weight: bold;">
              <div>Date : <strong>${formattedDate}</strong></div>
              <div style="margin-right: 50px;">Place : <strong>JUNAGADH</strong></div>
            </div>

            <!-- Bottom 3 Signatures: Office, Manager, Chief Executive Officer -->
            <div style="display: flex; justify-content: space-between; padding: 0 10px; font-size: 10.5pt; font-weight: 900; margin-bottom: 4px;">
              <div style="width: 130px; text-align: left;">Office</div>
              <div style="width: 150px; text-align: center;">Manager</div>
              <div style="width: 210px; text-align: right;">Chief Executive Officer</div>
            </div>

          </div>

        </div>
      `;
    } catch (err) {
      console.error('Error populating Lien Page 3:', err);
    }
  },

  // Open Print Preview Modal
  openPrintPreview(recordId = null) {
    try {
      let record = null;
      if (recordId) {
        const records = this.getAllRecords();
        record = records[recordId];
      }
      this.preparePrintData(record);
      this.setPrintDocumentType(this.activePrintDoc || 'all');
      
      const modal = document.getElementById('printPreviewModal');
      if (modal) {
        modal.style.display = 'flex';
      } else {
        // Fallback: If modal not found in DOM, trigger executePrint directly
        this.executePrint();
      }
      if (window.lucide) window.lucide.createIcons();
    } catch (err) {
      console.error('Error in openPrintPreview:', err);
      alert('પ્રિવ્યૂ ખોલવામાં ક્ષતિ: ' + err.message);
    }
  },

  syncPreviewCanvas() {
    const canvas = document.getElementById('modalPrintCanvas');
    if (!canvas) return;

    canvas.innerHTML = '';
    
    const pages = [
      { id: 'printDpNotePage', isDp: true },
      { id: 'printFdLoanAppPage', isDp: false },
      { id: 'printLienPage1', isDp: false },
      { id: 'printLienPage2', isDp: false },
      { id: 'printLienPage3', isDp: false }
    ];

    pages.forEach(p => {
      const pageEl = document.getElementById(p.id);
      if (pageEl && pageEl.style.display !== 'none') {
        const previewBox = document.createElement('div');
        previewBox.className = `preview-page-canvas ${p.isDp ? 'dp-note-canvas' : ''}`;
        previewBox.innerHTML = pageEl.innerHTML;
        canvas.appendChild(previewBox);
      }
    });

    renderBankLogos();
  },

  closePrintPreview() {
    const modal = document.getElementById('printPreviewModal');
    if (modal) modal.style.display = 'none';
  },

  setPrintDocumentType(type) {
    this.activePrintDoc = type;
    const p1 = document.getElementById('printDpNotePage');
    const p2 = document.getElementById('printFdLoanAppPage');
    const p3 = document.getElementById('printLienPage1');
    const p4 = document.getElementById('printLienPage2');
    const p5 = document.getElementById('printLienPage3');

    const showMap = {
      'all': [p1, p2, p3, p4, p5],
      'dp_note': [p1],
      'fd_app': [p2],
      'lien_1': [p3],
      'lien_2': [p4],
      'lien_3': [p5]
    };

    const targetList = showMap[type] || showMap['all'];
    [p1, p2, p3, p4, p5].forEach(el => {
      if (el) el.style.display = targetList.includes(el) ? 'flex' : 'none';
    });

    document.querySelectorAll('.doc-switch-btn').forEach(btn => {
      if (btn.dataset.type === type) {
        btn.classList.add('bg-blue-700', 'text-white', 'shadow-sm');
        btn.classList.remove('text-slate-700');
      } else {
        btn.classList.remove('bg-blue-700', 'text-white', 'shadow-sm');
        btn.classList.add('text-slate-700');
      }
    });

    this.syncPreviewCanvas();
  },

  // Direct print execution replicating FD FORM MODULE
  executePrint() {
    const pc = document.getElementById('printDocumentContainer');
    if (pc) pc.style.display = 'block';
    
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        if (pc) pc.style.display = '';
      }, 500);
    }, 100);
  }
};

// Global Window Exposure
window.OverdraftApp = OverdraftApp;

// Auto-run on DOM load
document.addEventListener('DOMContentLoaded', () => {
  OverdraftApp.init();
});
