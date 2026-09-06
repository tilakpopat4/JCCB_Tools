/**
 * The Junagadh Commercial Co-Operative Bank Ltd.
 * Overdraft Loan Against Fixed Deposit Receipt Module
 * Form, Dynamic Joint Applicants, Dynamic FD Table, Register, Reports & Single-Page A4 Print
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
    '', 'એકવીસ', 'બાવીસ', 'ત્રેવીસ', 'ચોવીસ', 'પચ્ચીસ', 'છવ્વીસ', 'સત્તાવીસ', 'અઠ્ઠાવીસ', 'ઓગણત્રીસ',
    'ત્રીસ', 'એકત્રીસ', 'બત્રીસ', 'તેત્રીસ', 'ચોત્રીસ', 'પાંત્રીસ', 'છત્રીસ', 'સાડત્રીસ', 'આડત્રીસ', 'ઓગણચાલીસ',
    'ચાલીસ', 'એકતાલીસ', 'બેતાલીસ', 'ત્રેતાલીસ', 'ચુંમાલીસ', 'પિસ્તાલીસ', 'છેતાલીસ', 'સુડતાલીસ', 'અડતાલીસ', 'ઓગણપચાસ',
    'પચાસ', 'એકાવન', 'બાવન', 'ત્રેપન', 'ચોપન', 'પંચાવન', 'છપ્પન', 'સત્તાવન', 'અઠ્ઠાવન', 'ઓગણસાઈઠ',
    'સાઈઠ', 'એકસઠ', 'બાસઠ', 'ત્રેસઠ', 'ચોસઠ', 'પાંસઠ', 'છાસઠ', 'સડસઠ', 'અડસઠ', 'અગણોસિત્તેર',
    'સિત્તેર', 'એકોતેર', 'બોતેર', 'તોતેર', 'ચુમોતેર', 'પંચોતેર', 'છોતેર', 'સીંતોતેર', 'ઈઠોતેર', 'ઓગણાએંસી',
    'એંસી', 'એક્યાસી', 'બ્યાસી', 'ત્યાસી', 'ચોર્યાસી', 'પંચાસી', 'છ્યાસી', 'સિત્યાસી', 'અઠ્યાસી', 'નેવ્યાંસી',
    'નેવું', 'એકાણું', 'બાણું', 'ત્રાણું', 'ચોરાણું', 'પંચાણું', 'છન્નું', 'સત્તાણું', 'અઠ્ઠાણું', 'નવ્વાણું'
  ]
};

function convertTwoDigitsGujarati(n) {
  if (n === 0) return '';
  if (n < 20) return GUJ_WORDS.units[n];
  if (n < 100) return GUJ_WORDS.twentyPlus[n - 20] || (GUJ_WORDS.tens[Math.floor(n / 10)] + ' ' + GUJ_WORDS.units[n % 10]).trim();
  return '';
}

function numberToGujaratiWords(num) {
  if (!num || isNaN(num) || num <= 0) return '';
  num = Math.floor(Number(num));
  if (num === 0) return 'શૂન્ય રૂપિયા પૂરા';

  function convertSection(n) {
    let str = '';
    const hundred = Math.floor(n / 100);
    const rem = n % 100;
    if (hundred > 0) {
      str += GUJ_WORDS.units[hundred] + ' સો ';
    }
    if (rem > 0) {
      str += convertTwoDigitsGujarati(rem);
    }
    return str.trim();
  }

  let crore = Math.floor(num / 10000000);
  let rem = num % 10000000;
  let lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  let thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  let words = [];
  if (crore > 0) {
    words.push(convertSection(crore) + ' કરોડ');
  }
  if (lakh > 0) {
    words.push(convertSection(lakh) + ' લાખ');
  }
  if (thousand > 0) {
    words.push(convertSection(thousand) + ' હજાર');
  }
  if (rem > 0) {
    words.push(convertSection(rem));
  }

  return (words.join(' ') + ' રૂપિયા પૂરા').trim();
}

// English Number to Words
function numberToEnglishWords(num) {
  if (!num || isNaN(num) || num <= 0) return '';
  num = Math.floor(Number(num));
  if (num === 0) return 'ZERO RUPEES ONLY';

  const single = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
  const double = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

  function convertTwo(n) {
    if (n < 10) return single[n];
    if (n < 20) return double[n - 10];
    const t = Math.floor(n / 10);
    const u = n % 10;
    return tens[t] + (u ? ' ' + single[u] : '');
  }

  function convertThree(n) {
    let str = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    if (h) str += single[h] + ' HUNDRED';
    if (h && rem) str += ' AND ';
    if (rem) str += convertTwo(rem);
    return str;
  }

  let crore = Math.floor(num / 10000000);
  let rem = num % 10000000;
  let lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  let thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  let words = [];
  if (crore) words.push(convertThree(crore) + ' CRORE');
  if (lakh) words.push(convertTwo(lakh) + ' LAKH');
  if (thousand) words.push(convertTwo(thousand) + ' THOUSAND');
  if (rem) words.push(convertThree(rem));

  return (words.join(' ') + ' RUPEES ONLY').toUpperCase();
}

// Main Application Controller
const OverdraftApp = {
  currentRecordId: null,
  activeTab: 'form', // 'form', 'register', 'reports'
  jointCustomerCount: 0, // 0 means only primary customer; max 3 extra joints (total 4)
  fdRowCount: 0,
  activePrintDoc: 'all', // 'dp_note', 'application', 'all'

  init() {
    this.populateBranchDropdowns();
    this.setDefaultDate();
    this.setupEventListeners();
    this.addFdReceiptRow(); // initial receipt row
    this.updateRegisterTable();
    this.updateReportMetrics();
  },

  // Populate Branch Select Dropdown
  populateBranchDropdowns() {
    const branchSelect = document.getElementById('branchSelect');
    const filterBranchSelect = document.getElementById('filterBranch');
    
    if (branchSelect) {
      branchSelect.innerHTML = BRANCH_MASTER.map(b => 
        `<option value="${b.code} - ${b.name} (${b.shortName})">${b.code} - ${b.name} [${b.shortName}]</option>`
      ).join('');
    }

    if (filterBranchSelect) {
      filterBranchSelect.innerHTML = '<option value="">-- ALL BRANCHES (તમામ શાખાઓ) --</option>' + 
        BRANCH_MASTER.map(b => 
          `<option value="${b.code} - ${b.name} (${b.shortName})">${b.code} - ${b.name} [${b.shortName}]</option>`
        ).join('');
    }
  },

  setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    const loanDateField = document.getElementById('loanDate');
    if (loanDateField && !loanDateField.value) {
      loanDateField.value = today;
    }
  },

  setupEventListeners() {
    // 15-Digit Saving Account strict numeric validation
    const savingAccInput = document.getElementById('savingAccountNo');
    if (savingAccInput) {
      savingAccInput.addEventListener('input', (e) => {
        // keep only numbers
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 15) {
          val = val.substring(0, 15);
        }
        e.target.value = val;
        this.validateSavingAccount(val);
      });
    }

    // Loan amount auto convert to Gujarati & English Words
    const loanAmountInput = document.getElementById('loanAmount');
    if (loanAmountInput) {
      loanAmountInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        this.updateAmountInWords(val);
      });
    }
  },

  validateSavingAccount(val) {
    const badge = document.getElementById('savingAccValidationBadge');
    if (!badge) return;
    if (val.length === 15) {
      badge.innerHTML = '<span class="text-emerald-600 font-bold flex items-center gap-1">✓ ૧૫ અંક માન્ય (Valid 15 Digits)</span>';
    } else if (val.length === 0) {
      badge.innerHTML = '<span class="text-amber-600 font-semibold">ફરજિયાત ૧૫ અંકનો નંબર દાખલ કરો</span>';
    } else {
      badge.innerHTML = `<span class="text-red-600 font-bold">${val.length}/15 અંક (${15 - val.length} અંક ખૂટે છે)</span>`;
    }
  },

  updateAmountInWords(val) {
    const gujField = document.getElementById('loanAmountWordsGuj');
    const engField = document.getElementById('loanAmountWordsEng');
    if (val > 0) {
      const gujText = numberToGujaratiWords(val);
      const engText = numberToEnglishWords(val);
      if (gujField) gujField.value = gujText;
      if (engField) engField.value = engText;
    } else {
      if (gujField) gujField.value = '';
      if (engField) engField.value = '';
    }
  },

  // Dynamic Joint Customers Management (1 primary + up to 3 extra = 4 total)
  addJointCustomer() {
    if (this.jointCustomerCount >= 3) {
      alert('મહત્તમ ૪ ગ્રાહકો (૧ મુખ્ય + ૩ જોઈન્ટ) સુધીની મંજૂરી છે.');
      return;
    }
    this.jointCustomerCount++;
    const customerIndex = this.jointCustomerCount + 1; // 2, 3, or 4

    const container = document.getElementById('jointCustomersContainer');
    const jointCard = document.createElement('div');
    jointCard.id = `jointCustomerBlock_${customerIndex}`;
    jointCard.className = 'p-4 bg-slate-50 rounded-xl border-2 border-slate-300 space-y-3 relative transition-all duration-300';
    jointCard.innerHTML = `
      <div class="flex items-center justify-between border-b-2 border-slate-200 pb-2">
        <div class="flex items-center gap-2 font-black text-sm text-slate-800">
          <span class="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">${customerIndex}</span>
          <span>કસ્ટમર ${customerIndex} ની વિગત (Joint Applicant ${customerIndex})</span>
        </div>
        <button type="button" onclick="OverdraftApp.removeJointCustomer(${customerIndex})" class="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold border border-red-300 flex items-center gap-1 transition">
          ✕ દૂર કરો (Remove)
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div class="md:col-span-3">
          <label class="input-label" for="customerId_${customerIndex}">કસ્ટમર ${customerIndex} આઇડી (Customer ID)</label>
          <input type="text" id="customerId_${customerIndex}" class="form-input font-bold uppercase" placeholder="દા.ત. CUST00${customerIndex}">
        </div>
        <div class="md:col-span-4">
          <label class="input-label" for="customerName_${customerIndex}">ગ્રાહક ${customerIndex} નું નામ (Applicant Name) <span class="req">*</span></label>
          <input type="text" id="customerName_${customerIndex}" class="form-input font-bold uppercase" placeholder="સંપૂર્ણ નામ દાખલ કરો">
        </div>
        <div class="md:col-span-5">
          <label class="input-label" for="customerAddress_${customerIndex}">ગ્રાહક ${customerIndex} નું સરનામું (Residential Address)</label>
          <input type="text" id="customerAddress_${customerIndex}" class="form-input uppercase" placeholder="સરનામું દાખલ કરો">
        </div>
      </div>
    `;

    container.appendChild(jointCard);

    // Toggle button state if reached max
    if (this.jointCustomerCount >= 3) {
      document.getElementById('btnAddJoint').style.display = 'none';
    }
  },

  removeJointCustomer(index) {
    const el = document.getElementById(`jointCustomerBlock_${index}`);
    if (el) {
      el.remove();
      this.jointCustomerCount--;
      document.getElementById('btnAddJoint').style.display = 'inline-flex';
    }
  },

  // Dynamic Fixed Deposit Receipts Table
  addFdReceiptRow(data = null) {
    this.fdRowCount++;
    const tbody = document.getElementById('fdReceiptsTbody');
    const tr = document.createElement('tr');
    tr.id = `fdRow_${this.fdRowCount}`;
    tr.className = 'hover:bg-slate-50 border-b border-slate-200 transition';

    tr.innerHTML = `
      <td class="p-2.5 text-center font-bold text-slate-700 fd-sr-no"></td>
      <td class="p-2">
        <input type="text" class="form-input font-bold uppercase fd-cert-no" placeholder="CERT-0000" value="${data ? data.certNo : ''}">
      </td>
      <td class="p-2">
        <input type="date" class="form-input font-semibold fd-dep-date" value="${data ? data.depDate : ''}">
      </td>
      <td class="p-2">
        <input type="date" class="form-input font-semibold fd-mat-date" value="${data ? data.matDate : ''}">
      </td>
      <td class="p-2">
        <input type="number" step="any" class="form-input font-bold text-right text-blue-900 fd-dep-amount" placeholder="0.00" oninput="OverdraftApp.calculateFdTotals()" value="${data ? data.depAmount : ''}">
      </td>
      <td class="p-2">
        <input type="number" step="any" class="form-input font-bold text-right text-emerald-900 fd-loan-amount" placeholder="0.00" oninput="OverdraftApp.calculateFdTotals()" value="${data ? data.loanAmount : ''}">
      </td>
      <td class="p-2 text-center">
        <button type="button" onclick="OverdraftApp.removeFdReceiptRow(${this.fdRowCount})" class="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-black transition" title="Delete Row">
          ✕
        </button>
      </td>
    `;

    tbody.appendChild(tr);
    this.refreshFdRowNumbers();
    this.calculateFdTotals();
  },

  removeFdReceiptRow(rowId) {
    const tbody = document.getElementById('fdReceiptsTbody');
    if (tbody.children.length <= 1) {
      alert('ઓછામાં ઓછી એક એફડી રસીદ રાખવી ફરજિયાત છે.');
      return;
    }
    const tr = document.getElementById(`fdRow_${rowId}`);
    if (tr) {
      tr.remove();
      this.refreshFdRowNumbers();
      this.calculateFdTotals();
    }
  },

  refreshFdRowNumbers() {
    const rows = document.querySelectorAll('#fdReceiptsTbody tr');
    rows.forEach((row, idx) => {
      const srCol = row.querySelector('.fd-sr-no');
      if (srCol) srCol.textContent = idx + 1;
    });
  },

  calculateFdTotals() {
    let totalDeposit = 0;
    let totalEligibleLoan = 0;

    document.querySelectorAll('.fd-dep-amount').forEach(inp => {
      totalDeposit += parseFloat(inp.value) || 0;
    });

    document.querySelectorAll('.fd-loan-amount').forEach(inp => {
      totalEligibleLoan += parseFloat(inp.value) || 0;
    });

    const totalDepEl = document.getElementById('totalDepositAmount');
    const totalLoanEl = document.getElementById('totalFdLoanAmount');
    if (totalDepEl) totalDepEl.textContent = '₹ ' + totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    if (totalLoanEl) totalLoanEl.textContent = '₹ ' + totalEligibleLoan.toLocaleString('en-IN', { minimumFractionDigits: 2 });

    // Auto update main Loan Amount field if user hasn't explicitly overridden it
    const mainLoanAmountInput = document.getElementById('loanAmount');
    if (mainLoanAmountInput && (!mainLoanAmountInput.value || mainLoanAmountInput.dataset.autoFilled === 'true')) {
      if (totalEligibleLoan > 0) {
        mainLoanAmountInput.value = totalEligibleLoan;
        mainLoanAmountInput.dataset.autoFilled = 'true';
        this.updateAmountInWords(totalEligibleLoan);
      }
    }
  },

  // Save record to LocalStorage
  saveRecord() {
    // Validation
    const branchName = document.getElementById('branchSelect').value;
    const loanDate = document.getElementById('loanDate').value;
    const cust1Id = document.getElementById('customerId_1').value.trim();
    const cust1Name = document.getElementById('customerName_1').value.trim();
    const cust1Address = document.getElementById('customerAddress_1').value.trim();

    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const interestRate = document.getElementById('interestRate').value.trim();
    const loanPurpose = document.getElementById('loanPurpose').value.trim();
    const savingAccNo = document.getElementById('savingAccountNo').value.trim();

    if (!branchName) {
      alert('કૃપા કરીને શાખા પસંદ કરો.');
      return;
    }
    if (!loanDate) {
      alert('કૃપા કરીને તારીખ દાખલ કરો.');
      return;
    }
    if (!cust1Name) {
      alert('મુખ્ય ગ્રાહકનું નામ દાખલ કરવું ફરજિયાત છે.');
      document.getElementById('customerName_1').focus();
      return;
    }
    if (savingAccNo.length !== 15) {
      alert('સેવિંગ ખાતા નંબર ફરજિયાત ૧૫ અંકનો હોવો જોઈએ.');
      document.getElementById('savingAccountNo').focus();
      return;
    }
    if (loanAmount <= 0) {
      alert('માન્ય લોનની રકમ દાખલ કરો.');
      document.getElementById('loanAmount').focus();
      return;
    }

    // Collect Joint Applicants
    const jointApplicants = [];
    for (let i = 2; i <= 4; i++) {
      const nameEl = document.getElementById(`customerName_${i}`);
      if (nameEl && nameEl.value.trim()) {
        jointApplicants.push({
          id: (document.getElementById(`customerId_${i}`)?.value || '').trim(),
          name: nameEl.value.trim().toUpperCase(),
          address: (document.getElementById(`customerAddress_${i}`)?.value || '').trim().toUpperCase()
        });
      }
    }

    // Collect FD Receipts
    const fdReceipts = [];
    const rows = document.querySelectorAll('#fdReceiptsTbody tr');
    rows.forEach(r => {
      const certNo = r.querySelector('.fd-cert-no')?.value.trim() || '';
      const depDate = r.querySelector('.fd-dep-date')?.value || '';
      const matDate = r.querySelector('.fd-mat-date')?.value || '';
      const depAmount = parseFloat(r.querySelector('.fd-dep-amount')?.value) || 0;
      const rowLoanAmt = parseFloat(r.querySelector('.fd-loan-amount')?.value) || 0;

      if (certNo || depAmount > 0) {
        fdReceipts.push({ certNo, depDate, matDate, depAmount, rowLoanAmt });
      }
    });

    if (fdReceipts.length === 0) {
      alert('ઓછામાં ઓછી એક એફડી રસીદ વિગત દાખલ કરવી જરૂરી છે.');
      return;
    }

    // Generate unique record ID if new
    const recordId = this.currentRecordId || `OD-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
    
    const record = {
      id: recordId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      branchName,
      loanDate,
      applicant1: {
        id: cust1Id,
        name: cust1Name.toUpperCase(),
        address: cust1Address.toUpperCase()
      },
      jointApplicants,
      loanAmount,
      loanAmountWordsGuj: numberToGujaratiWords(loanAmount),
      loanAmountWordsEng: numberToEnglishWords(loanAmount),
      interestRate,
      loanPurpose,
      savingAccNo,
      fdReceipts
    };

    const savedRecords = this.getAllRecords();
    savedRecords[recordId] = record;
    localStorage.setItem('tjccb_od_loan_records', JSON.stringify(savedRecords));

    this.currentRecordId = recordId;
    alert(`ઓવરડ્રાફ્ટ લોન રેકોર્ડ સફળતાપૂર્વક સાચવવામાં આવ્યો છે!\nRecord ID: ${recordId}`);
    
    this.updateRegisterTable();
    this.updateReportMetrics();
  },

  getAllRecords() {
    try {
      return JSON.parse(localStorage.getItem('tjccb_od_loan_records') || '{}');
    } catch (e) {
      return {};
    }
  },

  resetForm() {
    this.currentRecordId = null;
    document.getElementById('overdraftForm').reset();
    document.getElementById('jointCustomersContainer').innerHTML = '';
    this.jointCustomerCount = 0;
    document.getElementById('btnAddJoint').style.display = 'inline-flex';

    document.getElementById('fdReceiptsTbody').innerHTML = '';
    this.fdRowCount = 0;
    this.addFdReceiptRow();

    this.setDefaultDate();
    this.validateSavingAccount('');
    this.updateAmountInWords(0);
    this.calculateFdTotals();
  },

  // Edit Record from Register
  editRecord(recordId) {
    const records = this.getAllRecords();
    const record = records[recordId];
    if (!record) return;

    this.resetForm();
    this.currentRecordId = recordId;

    document.getElementById('branchSelect').value = record.branchName;
    document.getElementById('loanDate').value = record.loanDate;
    document.getElementById('customerId_1').value = record.applicant1.id;
    document.getElementById('customerName_1').value = record.applicant1.name;
    document.getElementById('customerAddress_1').value = record.applicant1.address;

    // Populate Joint Applicants
    if (record.jointApplicants && record.jointApplicants.length > 0) {
      record.jointApplicants.forEach((joint, idx) => {
        this.addJointCustomer();
        const customerIndex = idx + 2;
        const idEl = document.getElementById(`customerId_${customerIndex}`);
        const nameEl = document.getElementById(`customerName_${customerIndex}`);
        const addrEl = document.getElementById(`customerAddress_${customerIndex}`);
        if (idEl) idEl.value = joint.id;
        if (nameEl) nameEl.value = joint.name;
        if (addrEl) addrEl.value = joint.address;
      });
    }

    document.getElementById('loanAmount').value = record.loanAmount;
    document.getElementById('interestRate').value = record.interestRate;
    document.getElementById('loanPurpose').value = record.loanPurpose;
    document.getElementById('savingAccountNo').value = record.savingAccNo;
    this.validateSavingAccount(record.savingAccNo);
    this.updateAmountInWords(record.loanAmount);

    // Populate FD Receipts Table
    document.getElementById('fdReceiptsTbody').innerHTML = '';
    this.fdRowCount = 0;
    if (record.fdReceipts && record.fdReceipts.length > 0) {
      record.fdReceipts.forEach(r => {
        this.addFdReceiptRow({
          certNo: r.certNo,
          depDate: r.depDate,
          matDate: r.matDate,
          depAmount: r.depAmount,
          loanAmount: r.rowLoanAmt
        });
      });
    } else {
      this.addFdReceiptRow();
    }

    this.switchTab('form');
  },

  deleteRecord(recordId) {
    if (confirm(`શું આપ ખરેખર Record ID: ${recordId} ડીલીટ કરવા માંગો છો?`)) {
      const records = this.getAllRecords();
      delete records[recordId];
      localStorage.setItem('tjccb_od_loan_records', JSON.stringify(records));
      this.updateRegisterTable();
      this.updateReportMetrics();
      if (this.currentRecordId === recordId) {
        this.resetForm();
      }
    }
  },

  clearAllRecords() {
    if (confirm('ચેતવણી: આનાથી તમામ ઓવરડ્રાફ્ટ લોન રેકોર્ડ્સ કાયમ માટે ડીલીટ થઈ જશે! શું આપ આગળ વધવા માંગો છો?')) {
      localStorage.removeItem('tjccb_od_loan_records');
      this.updateRegisterTable();
      this.updateReportMetrics();
      this.resetForm();
    }
  },

  // Switch Views/Tabs
  switchTab(tabName) {
    this.activeTab = tabName;
    document.getElementById('formView').style.display = tabName === 'form' ? 'block' : 'none';
    document.getElementById('registerView').style.display = tabName === 'register' ? 'block' : 'none';
    document.getElementById('reportView').style.display = tabName === 'reports' ? 'block' : 'none';

    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('nav-tab-active');
      } else {
        btn.classList.remove('nav-tab-active');
      }
    });

    if (tabName === 'register') {
      this.updateRegisterTable();
    } else if (tabName === 'reports') {
      this.updateReportMetrics();
    }
  },

  // Update Register Table with Search & Filter
  updateRegisterTable() {
    const records = Object.values(this.getAllRecords()).reverse(); // newest on top
    const searchVal = (document.getElementById('searchRegister')?.value || '').toLowerCase().trim();
    const branchFilter = document.getElementById('filterBranch')?.value || '';

    const filtered = records.filter(r => {
      const matchBranch = !branchFilter || r.branchName === branchFilter;
      const combinedSearch = `${r.id} ${r.applicant1.name} ${r.applicant1.id} ${r.savingAccNo} ${(r.jointApplicants || []).map(j => j.name).join(' ')} ${(r.fdReceipts || []).map(f => f.certNo).join(' ')}`.toLowerCase();
      const matchSearch = !searchVal || combinedSearch.includes(searchVal);
      return matchBranch && matchSearch;
    });

    const countBadge = document.getElementById('registerCountBadge');
    if (countBadge) countBadge.textContent = filtered.length;

    const tbody = document.getElementById('registerTbody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="p-8 text-center text-slate-500 font-semibold">
            કોઈ રેકોર્ડ મળેલ નથી. (No records found)
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map((r, i) => `
      <tr class="hover:bg-blue-50/40 border-b border-slate-200 transition">
        <td class="p-3 text-center font-bold text-slate-600">${i + 1}</td>
        <td class="p-3 font-mono font-black text-blue-900 text-xs">${r.id}</td>
        <td class="p-3 text-xs font-semibold text-slate-700">${r.loanDate}</td>
        <td class="p-3">
          <div class="font-black text-slate-900 text-xs">${r.applicant1.name}</div>
          <div class="text-[11px] text-slate-500 font-semibold">ID: ${r.applicant1.id || '-'} | A/c: ${r.savingAccNo}</div>
          ${r.jointApplicants && r.jointApplicants.length > 0 ? 
            `<div class="text-[10px] text-blue-800 font-bold mt-0.5">+ ${r.jointApplicants.length} Joint: ${r.jointApplicants.map(j => j.name).join(', ')}</div>` 
            : ''}
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
            <button onclick="OverdraftApp.editRecord('${r.id}')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold shadow transition" title="Edit Application">
              Edit
            </button>
            <button onclick="OverdraftApp.openPrintPreview('${r.id}')" class="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-bold shadow transition" title="Print Documents">
              Print
            </button>
            <button onclick="OverdraftApp.deleteRecord('${r.id}')" class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow transition" title="Delete">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // Update Report Metrics
  updateReportMetrics() {
    const records = Object.values(this.getAllRecords());
    const totalApps = records.length;
    let totalLoanAmt = 0;
    let totalFdAmt = 0;
    let totalRoiSum = 0;
    let roiCount = 0;

    const branchSummary = {};

    records.forEach(r => {
      totalLoanAmt += r.loanAmount || 0;
      if (r.interestRate) {
        const rate = parseFloat(r.interestRate);
        if (!isNaN(rate)) {
          totalRoiSum += rate;
          roiCount++;
        }
      }

      let appFdSum = 0;
      (r.fdReceipts || []).forEach(f => {
        appFdSum += f.depAmount || 0;
      });
      totalFdAmt += appFdSum;

      // Branch wise
      const bName = r.branchName || 'Unknown';
      if (!branchSummary[bName]) {
        branchSummary[bName] = { count: 0, loanAmt: 0, fdAmt: 0 };
      }
      branchSummary[bName].count++;
      branchSummary[bName].loanAmt += r.loanAmount || 0;
      branchSummary[bName].fdAmt += appFdSum;
    });

    const avgRoi = roiCount > 0 ? (totalRoiSum / roiCount).toFixed(2) : '0.00';

    document.getElementById('repTotalApps').textContent = totalApps;
    document.getElementById('repTotalLoan').textContent = '₹ ' + totalLoanAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    document.getElementById('repTotalFd').textContent = '₹ ' + totalFdAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    document.getElementById('repAvgRoi').textContent = avgRoi + ' %';

    // Populate Branch Analysis Table
    const repBranchTbody = document.getElementById('repBranchTbody');
    if (repBranchTbody) {
      const branchEntries = Object.entries(branchSummary);
      if (branchEntries.length === 0) {
        repBranchTbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-500 font-semibold">કોઈ ડેટા ઉપલબ્ધ નથી.</td></tr>';
      } else {
        repBranchTbody.innerHTML = branchEntries.map(([branch, data], idx) => `
          <tr class="hover:bg-slate-50 border-b border-slate-200">
            <td class="p-2.5 text-center font-bold text-slate-700">${idx + 1}</td>
            <td class="p-2.5 font-black text-slate-900 text-xs">${branch}</td>
            <td class="p-2.5 text-center font-black text-blue-900">${data.count}</td>
            <td class="p-2.5 text-right font-black text-emerald-800">₹ ${data.loanAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td class="p-2.5 text-right font-bold text-slate-700">₹ ${data.fdAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        `).join('');
      }
    }
  },

  // Export & Import JSON Backup
  exportJSON() {
    const data = this.getAllRecords();
    const str = JSON.stringify(data, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TJCCB_Overdraft_Loan_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (typeof imported === 'object' && imported !== null) {
          const current = this.getAllRecords();
          const merged = { ...current, ...imported };
          localStorage.setItem('tjccb_od_loan_records', JSON.stringify(merged));
          alert(`સફળતાપૂર્વક બેકઅપ ઇમ્પોર્ટ થયેલ છે! કુલ ${Object.keys(merged).length} રેકોર્ડ્સ ઉપલબ્ધ છે.`);
          this.updateRegisterTable();
          this.updateReportMetrics();
        } else {
          alert('અમાન્ય JSON ફાઇલ ફોર્મેટ!');
        }
      } catch (err) {
        alert('ફાઇલ વાંચવામાં ભૂલ થઈ: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },

  // Export CSV Report
  exportCSV() {
    const records = Object.values(this.getAllRecords());
    if (records.length === 0) {
      alert('એક્સપોર્ટ કરવા માટે કોઈ ડેટા નથી.');
      return;
    }

    const headers = ['Record ID', 'Date', 'Branch', 'Primary Applicant Name', 'Customer ID', 'Saving Account No', 'Loan Amount', 'ROI %', 'Purpose', 'FD Count'];
    const rows = records.map(r => [
      `"${r.id}"`,
      `"${r.loanDate}"`,
      `"${r.branchName}"`,
      `"${r.applicant1.name}"`,
      `"${r.applicant1.id || ''}"`,
      `"${r.savingAccNo}"`,
      `"${r.loanAmount}"`,
      `"${r.interestRate}"`,
      `"${r.loanPurpose}"`,
      `"${(r.fdReceipts || []).length}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TJCCB_Overdraft_Loan_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // PRINTING SYSTEM: Mapping Form Data to Printable A4 Document Templates
  preparePrintData(record) {
    if (!record) {
      // Create temporary record from current form inputs
      const branchName = document.getElementById('branchSelect').value;
      const loanDate = document.getElementById('loanDate').value;
      const cust1Id = document.getElementById('customerId_1').value.trim();
      const cust1Name = document.getElementById('customerName_1').value.trim();
      const cust1Address = document.getElementById('customerAddress_1').value.trim();

      const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
      const interestRate = document.getElementById('interestRate').value.trim();
      const loanPurpose = document.getElementById('loanPurpose').value.trim();
      const savingAccNo = document.getElementById('savingAccountNo').value.trim();

      const jointApplicants = [];
      for (let i = 2; i <= 4; i++) {
        const nameEl = document.getElementById(`customerName_${i}`);
        if (nameEl && nameEl.value.trim()) {
          jointApplicants.push({
            id: (document.getElementById(`customerId_${i}`)?.value || '').trim(),
            name: nameEl.value.trim().toUpperCase(),
            address: (document.getElementById(`customerAddress_${i}`)?.value || '').trim().toUpperCase()
          });
        }
      }

      const fdReceipts = [];
      document.querySelectorAll('#fdReceiptsTbody tr').forEach(r => {
        const certNo = r.querySelector('.fd-cert-no')?.value.trim() || '';
        const depDate = r.querySelector('.fd-dep-date')?.value || '';
        const matDate = r.querySelector('.fd-mat-date')?.value || '';
        const depAmount = parseFloat(r.querySelector('.fd-dep-amount')?.value) || 0;
        const rowLoanAmt = parseFloat(r.querySelector('.fd-loan-amount')?.value) || 0;
        if (certNo || depAmount > 0) {
          fdReceipts.push({ certNo, depDate, matDate, depAmount, rowLoanAmt });
        }
      });

      record = {
        id: this.currentRecordId || 'DRAFT',
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
    }

    // Prepare all 5 documents
    this.populatePromissoryNote(record);
    this.populateFdLoanAppDoc(record);
    this.populateLienPage1(record);
    this.populateLienPage2(record);
    this.populateLienPage3(record);
  },

  // 1. ડીમાન્ડ પ્રોમીસરી નોટ (Demand Promissory Note)
  populatePromissoryNote(record) {
    const container = document.getElementById('printDpNotePage');
    if (!container) return;

    const formattedDate = record.loanDate ? record.loanDate.split('-').reverse().join('/') : '';
    const allNames = [record.applicant1.name, ...(record.jointApplicants || []).map(j => j.name)].filter(Boolean).join(', ');
    const allAddresses = [record.applicant1.address, ...(record.jointApplicants || []).map(j => j.address)].filter(Boolean).join('; ');
    const branchParts = record.branchName.split('-');
    const branchClean = branchParts.length > 1 ? branchParts[1].trim() : record.branchName;
    const roi = record.interestRate || '___';

    container.innerHTML = `
      <div class="text-fit-border dp-note-border">
        
        <!-- Header Title Bar -->
        <div style="text-align: center; border-bottom: 2px solid #005670; padding-bottom: 6px; margin-bottom: 16px;">
          <div class="dp-header-title">ડીમાન્ડ પ્રોમીસરી નોટ</div>
        </div>

        <!-- Date & Loan Amount Header Row -->
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 11pt; font-weight: bold; color: #002b99; margin-bottom: 20px;">
          <div style="font-size: 13pt;">
            રૂા. <span class="fill-data-solid" style="min-width: 140px; font-size: 13pt; text-align: left; color: #000;">${record.loanAmount ? record.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '___________________'}</span>
          </div>
          <div>
            તારીખ : <span class="fill-data-solid" style="min-width: 120px; text-align: center; color: #000;">${formattedDate}</span>
          </div>
        </div>

        <!-- Promissory Note Main Gujarati Legal Body -->
        <div style="font-size: 10.5pt; line-height: 2.3; color: #0f172a; text-align: justify; font-family: 'Noto Sans Gujarati', sans-serif;">
          
          <div style="margin-bottom: 12px;">
            માંગણી કરવા પર હું / શ્રી <span class="fill-data" style="min-width: 65%; font-weight: 800; color: #000;">${allNames || '____________________________________________________________________________________'}</span>
          </div>

          <div style="margin-bottom: 12px;">
            સરનામું : <span class="fill-data" style="min-width: 85%;">${allAddresses || '____________________________________________________________________________________'}</span>
          </div>

          <div style="margin-bottom: 12px;">
            આજરોજ મને મળેલા અવેજ બદલ રૂા. <span class="fill-data" style="font-weight: 800; min-width: 105px;">${record.loanAmount ? record.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '________________'}</span> 
            અંકે રૂપિયા <span class="fill-data" style="font-weight: 800; color: #002b99;">${record.loanAmountWordsGuj || '_______________________________________________________________'}</span>
            રોકડા <span class="fill-data" style="min-width: 55px; text-align: center; font-weight: 800; color: #000;">${roi}</span> % ના વાર્ષિક દરે,
          </div>

          <div style="margin-bottom: 16px;">
            માસીક લેખે અથવા દર વર્ષે દર સેંકડે <span class="fill-data" style="min-width: 55px; text-align: center; font-weight: 800;">${roi}</span> ટકા વ્યાજ માસિક સમયાનુસાર ગણત્રીએ, ચડત વ્યાજની રકમ સહીત, <strong>ધી જૂનાગઢ કોમર્શીયલ કો - ઓપરેટીવ બેંક લી., જૂનાગઢ</strong> ને અથવા તેના આદેશ અનુસાર તેની <span class="fill-data" style="font-weight: 800; min-width: 180px; text-align: center; color: #002b99;">${branchClean}</span> શાખામાં ચૂકવી આપવા વચન આપું છું / આપીએ છીએ.
          </div>

        </div>

        <!-- Bottom Signatures & Revenue Stamp Section (Stamp in Center Above Signature Line) -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 35px; padding-top: 15px;">
          
          <!-- Place Left -->
          <div style="font-size: 11pt; font-weight: bold; color: #0f172a; margin-bottom: 12px;">
            સ્થળ : <span class="fill-data" style="min-width: 140px; text-align: center;">જૂનાગઢ (JUNAGADH)</span>
          </div>

          <!-- Revenue Stamp Centered Above Signature & Borrower Name Below Line -->
          <div style="min-width: 250px; display: flex; flex-direction: column; align-items: center;">
            
            <!-- Revenue Stamp Box Centered Above Signature Line -->
            <div class="revenue-stamp-box" style="margin-bottom: 12px;">
              <span style="font-size: 8pt; color: #dc2626; font-weight: 900;">₹ 1.00</span>
              <span>રેવન્યુ</span>
              <span>સ્ટેમ્પ</span>
              <div style="position: absolute; width: 100%; height: 100%; border: 0.5px dashed rgba(220, 38, 38, 0.4); pointer-events: none;"></div>
            </div>

            <!-- Signature Line and Borrower Name -->
            <div style="width: 100%; text-align: center;">
              <div style="border-bottom: 1.5px dotted #000; width: 100%; height: 25px; margin-bottom: 6px;"></div>
              <div style="font-size: 9.5pt; font-weight: 800; color: #002b99;">
                ${allNames ? `( ${allNames} )` : '( લોન લેનારનું નામ )'}
              </div>
            </div>

          </div>

        </div>

      </div>
    `;
  },

  // 2. બાંધી મુદત થાપણ સામે લોન/ઓવરડ્રાફ્ટ માટેનું અરજી ફોર્મ
  populateFdLoanAppDoc(record) {
    const container = document.getElementById('printFdLoanAppPage');
    if (!container) return;

    const formattedDate = record.loanDate ? record.loanDate.split('-').reverse().join('/') : '';
    const allNames = [record.applicant1.name, ...(record.jointApplicants || []).map(j => j.name)].filter(Boolean).join(', ');
    const allAddresses = [record.applicant1.address, ...(record.jointApplicants || []).map(j => j.address)].filter(Boolean).join('; ');
    const branchParts = record.branchName.split('-');
    const branchClean = branchParts.length > 1 ? branchParts[1].trim() : record.branchName;
    const roi = record.interestRate || '___';

    const fdList = record.fdReceipts || [];
    let totalDeposit = 0;
    let totalLoanEligible = 0;

    let fdRowsHtml = '';
    const displayRowCount = Math.max(5, fdList.length);

    for (let i = 0; i < displayRowCount; i++) {
      if (i < fdList.length) {
        const f = fdList[i];
        totalDeposit += f.depAmount || 0;
        totalLoanEligible += f.rowLoanAmt || 0;
        fdRowsHtml += `
          <tr style="height: 22px;">
            <td style="text-align: center; font-weight: bold; padding: 2px 4px;">${i + 1}</td>
            <td style="font-weight: bold; text-align: center; padding: 2px 4px;">${f.certNo || '-'}</td>
            <td style="text-align: center; padding: 2px 4px;">${f.depDate ? f.depDate.split('-').reverse().join('/') : '-'}</td>
            <td style="text-align: center; padding: 2px 4px;">${f.matDate ? f.matDate.split('-').reverse().join('/') : '-'}</td>
            <td style="text-align: right; font-weight: bold; padding: 2px 4px;">₹ ${(f.depAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td style="text-align: right; font-weight: bold; padding: 2px 4px;">₹ ${(f.rowLoanAmt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        `;
      } else {
        fdRowsHtml += `
          <tr style="height: 22px;">
            <td style="text-align: center; color: #64748b; padding: 2px 4px;">${i + 1}</td>
            <td style="padding: 2px 4px;"></td>
            <td style="padding: 2px 4px;"></td>
            <td style="padding: 2px 4px;"></td>
            <td style="padding: 2px 4px;"></td>
            <td style="padding: 2px 4px;"></td>
          </tr>
        `;
      }
    }

    container.innerHTML = `
      <div class="text-fit-border" style="font-size: 8.5pt; line-height: 1.45;">
        
        <!-- Header -->
        <div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="bank-logo-placeholder" style="width: 52px; height: 52px; shrink: 0;"></div>
            <div style="flex: 1;">
              <div style="font-size: 15pt; font-weight: 900; color: #002b99; letter-spacing: 0.5px;">ધી જૂનાગઢ કોમર્શીયલ કો-ઓપરેટીવ બેંક લી.</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 6.8pt; color: #334155; margin-top: 3px; line-height: 1.35;">
            <div>
              Reg. No. Se-8221, Dt.18/02/1971<br>
              RBI Licence No. GJ-521 P
            </div>
            <div style="text-align: right;">
              રજી. ઓફિસ: ચંદ્રકાન્ત માલવિયા સ્મૃતિ ભવન, ચોક્સી બજાર, જૂનાગઢ.<br>
              ફોન: ૦૨૮૫-૨૬૨૦૪૯૬ &nbsp;|&nbsp; Email: jccbank_ad1@sancharnet.in &nbsp;|&nbsp; Web: www.jcombank.com
            </div>
          </div>
          <div style="border-bottom: 2px solid #002b99; margin: 4px 0 6px 0;"></div>
        </div>

        <!-- Form Title -->
        <div style="text-align: center; margin: 2px 0 4px 0;">
          <span style="font-size: 10.8pt; font-weight: 900; color: #002b99; border-bottom: 1.5px solid #002b99; padding-bottom: 1px;">
            બાંધી મુદત થાપણ સામે લોન/ઓવરડ્રાફ્ટ માટેનું અરજી ફોર્મ
          </span>
        </div>

        <!-- To & Date -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
          <div>
            <strong>પ્રતિ,</strong><br>
            મેનેજર સાહેબ,<br>
            ધી જૂનાગઢ કોમર્શિયલ કો-ઓપ બેન્ક લી.<br>
            <strong>${branchClean} શાખા</strong>
          </div>
          <div style="text-align: right; font-weight: bold;">
            તા. <span class="fill-data-solid" style="min-width: 100px; text-align: center;">${formattedDate}</span>
          </div>
        </div>

        <!-- Application Body Text -->
        <div style="text-align: justify; line-height: 1.65; margin-bottom: 4px; font-size: 8.5pt;">
          <strong>સાહેબશ્રી,</strong><br>
          &nbsp;&nbsp;&nbsp;&nbsp;જય ભારત સાથે હું/અમો નીચે સહી કરનાર <span class="fill-data" style="font-weight: 800; min-width: 35%; color: #002b99;">${allNames}</span> આપની બેંકમાં નીચે દર્શાવ્યા મુજબની કુલ રૂપિયા <span class="fill-data" style="font-weight: 800; min-width: 85px; color: #002b99;">₹ ${totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> ની બાંધી મુદત થાપણો ધરાવું છું/ધરાવીએ છીએ. મારે/અમારે આ થાપણ સામે ધીરાણ લેવાની જરૂર હોય બેંકના બાંધી મુદત થાપણ ધીરાણ ખાતાના નિયમો અનુસાર તથા થાપણ સર્ટીફિકેટ બેંકમાં રાખી મને/અમોને ધીરાણ આપવા શ્રી/મે. <span class="fill-data" style="font-weight: 800; min-width: 30%; color: #002b99;">${allNames}</span> ને તેમના ખાતા નંબર <span class="fill-data" style="font-family: monospace; font-weight: 900; min-width: 120px; color: #002b99;">${record.savingAccNo}</span> માં ધીર�  // 3. સંમિશ્ર ગ્રહણાધિકાર પત્ર / COMPOSITE LETTER OF LIEN (PAGE 1) (media_1788588299814.jpg)
  populateLienPage1(record) {
    const container = document.getElementById('printLienPage1');
    if (!container) return;

    const formattedDate = record.loanDate ? record.loanDate.split('-').reverse().join('/') : '';
    const allNames = [record.applicant1.name, ...(record.jointApplicants || []).map(j => j.name)].filter(Boolean).join(', ');
    const branchParts = record.branchName.split('-');
    const branchClean = branchParts.length > 1 ? branchParts[1].trim() : record.branchName;
    const roi = record.interestRate || '___';
    const dueDate = (record.fdReceipts && record.fdReceipts[0] && record.fdReceipts[0].matDate) 
      ? record.fdReceipts[0].matDate.split('-').reverse().join('/') 
      : formattedDate;

    container.innerHTML = `
      <div class="text-fit-border" style="font-size: 8pt; line-height: 1.45;">
        
        <!-- Bank Letterhead matching media_1788588299814.jpg -->
        <div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="bank-logo-placeholder" style="width: 50px; height: 50px; shrink: 0;"></div>
            <div style="flex: 1;">
              <div style="font-size: 14.5pt; font-weight: 900; color: #002b99; letter-spacing: 0.5px;">The Junagadh Commercial Co-Operative Bank Ltd.</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 6.8pt; color: #334155; margin-top: 3px; line-height: 1.35;">
            <div>
              Reg. No. Se-8221, Dt.18/02/1971<br>
              RBI Licence No. GJ-521 P
            </div>
            <div style="text-align: right;">
              Reg. Office: Chandrakant Malaviya Smurti Bhavan, Choksi Bazar, Junagadh<br>
              Phone: 0285-2620496 &nbsp;|&nbsp; Email: jccbank_ad1@sancharnet.in &nbsp;|&nbsp; Web: www.jcombank.com
            </div>
          </div>
          <div style="border-bottom: 2px solid #002b99; margin: 4px 0 6px 0;"></div>
        </div>

        <!-- Title -->
        <div style="text-align: center; margin: 2px 0;">
          <div style="font-size: 10pt; font-weight: 900; color: #002b99;">संमिश्र ग्रहणाधिकार पत्र</div>
          <div style="font-size: 9.5pt; font-weight: 900; color: #002b99; letter-spacing: 0.5px;">COMPOSITE LETTER OF LIEN</div>
          <div style="font-size: 7.8pt; font-weight: 700; color: #334155;">(निजी जमाराशियों के सावधि जमा पर ऋण खाता के लिए) / (For LTD Accounts of Own Deposits)</div>
        </div>

        <!-- From & Place/Date/LTD Box Grid -->
        <div style="display: grid; grid-template-columns: 1.35fr 1fr; gap: 8px; margin-bottom: 4px;">
          
          <!-- From Left -->
          <div>
            <strong>प्रेषक / From :</strong><br>
            <div style="margin-top: 1px;">1) <span class="fill-data-solid" style="min-width: 85%; font-weight: bold;">${record.applicant1.name}, ${record.applicant1.address}</span></div>
            <div style="margin-top: 2px;">2) <span class="fill-data-solid" style="min-width: 85%;">${record.jointApplicants && record.jointApplicants[0] ? record.jointApplicants[0].name + ', ' + record.jointApplicants[0].address : ''}</span></div>
            <div style="margin-top: 2px;">3) <span class="fill-data-solid" style="min-width: 85%;">${record.jointApplicants && record.jointApplicants[1] ? record.jointApplicants[1].name + ', ' + record.jointApplicants[1].address : ''}</span></div>
          </div>

          <!-- Place & LTD Box Right -->
          <div>
            <div style="margin-bottom: 2px;">स्थान / Place : <span class="fill-data-solid" style="min-width: 90px; text-align: center;">જૂનાગઢ (JUNAGADH)</span></div>
            <div style="margin-bottom: 3px;">दिनांक / Date : <span class="fill-data-solid" style="min-width: 90px; text-align: center;">${formattedDate}</span></div>
            
            <div style="border: 1.5px solid #002b99; border-radius: 4px; padding: 4px 6px; background-color: #f8fafc; font-size: 7.8pt;">
              <div style="font-weight: bold;">સ્થાયિ જમા પર ઋણ ખાતા સં. :</div>
              <div style="font-weight: bold;">LTD A/c No. : <span style="font-family: monospace; font-size: 8.5pt; color: #002b99;">${record.savingAccNo}</span></div>
              <div style="margin-top: 1px;">दिनांक / Date : <span style="font-weight: bold;">${formattedDate}</span></div>
            </div>
          </div>

        </div>

        <!-- To -->
        <div style="margin-bottom: 3px;">
          <strong>सेवा मे / To</strong><br>
          <strong>The Junagadh Commercial Co-Operative Bank Ltd.</strong><br>
          Address : Chandrakant Malaviya Smruti Bhavan, Choksi Bazar, Junagadh<br>
          Branch : <strong>${branchClean}</strong><br>
          <strong>महोदय / Sirs,</strong>
        </div>

        <!-- Clauses 1 & 2 (Bilingual) -->
        <div style="text-align: justify; line-height: 1.45;">
          
          <div style="margin-bottom: 6px;">
            <strong>1.</strong>&nbsp;&nbsp;मेरे / हमारे अनुरोध पर मुझे / हमे आज रु. <span class="fill-data-solid" style="font-weight: bold;">₹ ${record.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> (रुपये <span class="fill-data-solid" style="font-weight: bold; color: #002b99;">${record.loanAmountWordsEng}</span>) मात्र रकम का ऋण प्रदान करने पर मे / हम इसके अंतर्गत आपके पत्र मे इस अनुसूची मे उल्लिखित जमा पर ( जो इसके पश्चात "अनुसूची जमा" के नाम से अभिहित होगा) किसी भी समय मूलधन, ब्याज लागत, प्रभार आदि के प्रति आपके बैंक को देय सभी धन के लिए प्रतिभूत के रूप मे उक्त ऋण पर ग्रहणाधिकार प्रदान करता हु / करते है ।<br>
            <span style="font-size: 7.3pt; color: #334155;">
              In Consideration of your granting at my / our request, a loan of <strong>Rs. ${record.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Rupees ${record.loanAmountWordsEng})</strong> Only to me/us today. I/We hereby create a lien in your favour on the deposits described in the Schedule thereof (hereinafter referred to as 'Schedule Deposits') as security for all moneys owing to your bank and time towards principal, interest, costs charges etc. on account of the said loan.
            </span>
          </div>

          <div>
            <strong>2.</strong>&nbsp;&nbsp;मै / हम इस बात से सहमत हु / है की मे / हम दि. <span class="fill-data-solid" style="font-weight: bold;">${dueDate}</span> को या उसके पहले तिमाही अंतराल मे <span class="fill-data-solid" style="font-weight: bold;">${roi}</span> % प्र.व. दर पर आज लिए गए उक्त ऋण की चुકોતી करूंगा/करेंगे।<br>
            <span style="font-size: 7.3pt; color: #334155;">
              I/We agree that the aforesaid loan availed by me/us today shall be repaid by me/us to you with interest at <strong>${roi}% P.A.</strong> with quarterly rests, on or before <strong>${dueDate}</strong>.
            </span>
          </div>

        </div>

        <!-- Bottom Initial Mark -->
        <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
          <span style="font-size: 7.8pt; color: #64748b;">(हस्ताक्षर / Initial : _____________________)</span>
        </div>

      </div>
    `;
  },    </div>
    `;, Dt.18/02/1971 &nbsp;|&nbsp; RBI Licence No. GJ-521 P &nbsp;|&nbsp; Reg. Office: Chandrakant Malaviya Smruti Bhavan, Choksi Bazar, Junagadh<br>
              Phone: 0285-2620496 &nbsp;|&nbsp; Email: jccbank_ad1@sancharnet.in &nbsp;|&nbsp; Web: www.jcombank.com
            </div>
          </div>
          <div class="bank-logo-placeholder" style="width: 44px; height: 44px; shrink: 0;"></div>
        </div>

        <!-- Title -->
        <div style="text-align: center; margin: 3px 0;">
          <div style="font-size: 10pt; font-weight: 900; color: #002b99;">संमिश्र ग्रहणाधिकार पत्र</div>
          <div style="font-size: 9.5pt; font-weight: 900; color: #002b99; letter-spacing: 0.5px;">COMPOSITE LETTER OF LIEN</div>
          <div style="font-size: 8pt; font-weight: 700; color: #334155;">(निजी जमाराशियों के सावधि जमा पर ऋण खाता के लिए) / (For LTD Accounts of Own Deposits)</div>
        </div>

        <!-- From & Place/Date/LTD Box Grid -->
        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 8px; margin-bottom: 4px;">
          
          <!-- From Left -->
          <div>
            <strong>प्रेषक / From :</strong><br>
            <div style="margin-top: 1px;">1) <span class="fill-data-solid" style="min-width: 85%; font-weight: bold;">${record.applicant1.name}, ${record.applicant1.address}</span></div>
            <div style="margin-top: 2px;">2) <span class="fill-data-solid" style="min-width: 85%;">${record.jointApplicants[0] ? record.jointApplicants[0].name + ', ' + record.jointApplicants[0].address : ''}</span></div>
            <div style="margin-top: 2px;">3) <span class="fill-data-solid" style="min-width: 85%;">${record.jointApplicants[1] ? record.jointApplicants[1].name + ', ' + record.jointApplicants[1].address : ''}</span></div>
          </div>

          <!-- Place & LTD Box Right -->
          <div>
            <div style="margin-bottom: 2px;">स्थान / Place : <span class="fill-data-solid" style="min-width: 90px; text-align: center;">જૂનાગઢ</span></div>
            <div style="margin-bottom: 4px;">दिनांक / Date : <span class="fill-data-solid" style="min-width: 90px; text-align: center;">${formattedDate}</span></div>
            
            <div style="border: 1.5px solid #002b99; border-radius: 4px; padding: 4px 6px; background-color: #f8fafc; font-size: 7.8pt;">
              <div style="font-weight: bold;">સ્થાયિ જમા પર ઋણ ખાતા સં. :</div>
              <div style="font-weight: bold;">LTD A/c No. : <span style="font-family: monospace; font-size: 8.5pt; color: #002b99;">${record.savingAccNo}</span></div>
              <div style="margin-top: 1px;">दिनांक / Date : <span style="font-weight: bold;">${formattedDate}</span></div>
            </div>
          </div>

        </div>

        <!-- To -->
        <div style="margin-bottom: 3px;">
          <strong>सेवा मे / To</strong><br>
          <strong>The Junagadh Commercial Co-Operative Bank Ltd.</strong><br>
          Address : Chandrakant Malaviya Smruti Bhavan, Choksi Bazar, Junagadh<br>
          Branch : <strong>${branchClean}</strong><br>
          <strong>महोदय / Sirs,</strong>
        </div>

        <!-- Clauses 1 & 2 (Bilingual) -->
        <div style="space-y: 6px; text-align: justify; line-height: 1.45;">
          
          <div style="margin-bottom: 6px;">
            <strong>1.</strong>&nbsp;&nbsp;मेरे / हमारे अनुरोध पर मुझे / हमे आज रु. <span class="fill-data-solid" style="font-weight: bold;">₹ ${record.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> (रुपये <span class="fill-data-solid" style="font-weight: bold; color: #002b99;">${record.loanAmountWordsEng}</span>) मात्र रकम का ऋण प्रदान करने पर मे / हम इसके अंतर्गत आपके पत्र मे इस अनुसूची मे उल्लिखित जमा पर ( जो इसके पश्चात "अनुसूची जमा" के नाम से अभिहित होगा) किसी भी समय मूलधन, ब्याज लागत, प्रभार आदि के प्रति आपके बैंक को देय सभी धन के लिए प्रतिभूत के रूप मे उक्त ऋण पर ग्रहणाधिकार प्रदान करता हु / करते है ।<br>
            <span style="font-size: 7.5pt; color: #334155;">
              In Consideration of your granting at my / our request, a loan of <strong>Rs. ${record.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Rupees ${record.loanAmountWordsEng})</strong> Only to me/us today. I/We hereby create a lien in your favour on the deposits described in the Schedule thereof (hereinafter referred to as 'Schedule Deposits') as security for all moneys owing to your bank and time towards principal, interest, costs charges etc. on account of the said loan.
            </span>
          </div>

          <div>
            <strong>2.</strong>&nbsp;&nbsp;मै / हम इस बात से सहमत हु / है की मे / हम दि. <span class="fill-data-solid" style="font-weight: bold;">${dueDate}</span> को या उसके पहले तिमाही अंतराल मे <span class="fill-data-solid" style="font-weight: bold;">${roi}</span> % प्र.व. दर पर आज लिए गए उक्त ऋण की चुकोती करूंगा/करेंगे।<br>
            <span style="font-size: 7.5pt; color: #334155;">
              I/We agree that the aforesaid loan availed by me/us today shall be repaid by me/us to you with interest at <strong>${roi}% P.A.</strong> with quarterly rests, on or before <strong>${dueDate}</strong>.
            </span>
          </div>

        </div>

      </div>
    `;
  },

  // 4. સંમિશ્ર ગ્રહણાધિકાર પત્ર (PAGE 2 - CLAUSES 3 TO 8) (media_1788588299838.jpg)
  populateLienPage2(record) {
    const container = document.getElementById('printLienPage2');
    if (!container) return;

    const purpose = record.loanPurpose || 'PERSONAL / BUSINESS USE';

    container.innerHTML = `
      <div class="text-fit-border" style="font-size: 7.8pt; line-height: 1.45; text-align: justify;">
        
        <div style="margin-bottom: 6px;">
          <strong>3.</strong>&nbsp;&nbsp;मै / हम यह घोषित करते है की उक्त ऋण मैंने / हमने <span class="fill-data-solid" style="font-weight: bold; min-width: 150px; color: #002b99;">${purpose}</span> उद्देश्य हेतु लिया है ।<br>
          <span style="font-size: 7.3pt; color: #334155;">
            I / We declare that the aforesaid loan is availed by me / us for the purpose of <strong>${purpose}</strong>.
          </span>
        </div>

        <div style="margin-bottom: 6px;">
          <strong>4.</strong>&nbsp;&nbsp;मै / हम सहमत हु / है की अनुसूची जमा को मुझसे / हमसे संयुक्त रूप से और / अथवा पृथक रूप से और / या मुझसे किसी अन्य व्यक्ति (यों) के साथ संयुक्त रूप से अब या भविष्य मे किसी या अन्य सभी / ऋण और सुविधाओ या किसी अन्य प्रकार के ऋण पर जिसका आपके बैंक की किसी शाखा मे देय पाए जाने पर आपके बैंक के ग्रहणाधिकार के अंतर्गत ही प्रतिभूति जा सकती है ।<br>
          <span style="font-size: 7.3pt; color: #334155;">
            I/We agree that the Schedule Deposits may also be held as security subjects to your Bank's lien, for any or all other loans and facilities or any other indebtedness of any nature whatsoever, on account of which any moneys may be found due to any of the branches of your Bank from me/us jointly and/or severally, and/or from me/us jointly with any other person(s), now or at any time hereafter.
          </span>
        </div>

        <div style="margin-bottom: 6px;">
          <strong>5.</strong>&nbsp;&nbsp;मै/हम इसके साथ अनुसूची जमा से संबंधित रसीद / प्रमाण पत्र / पासबूक को विधिवत हस्ताक्षर कर आपको सोप देता हु / देते है।<br>
          <span style="font-size: 7.3pt; color: #334155;">
            I/We handover to you herewith the Receipts / Certificate (s) Pass Book(s) relating to Schedule Deposits duly discharged by me / us.
          </span>
        </div>

        <div style="margin-bottom: 6px;">
          <strong>6.</strong>&nbsp;&nbsp;मै / हम सहमत हु / है की परिपक्वता दिनांक पर अथवा इसके पश्चात यदि किसी अनुसूची जमा का पूननविकरण किया जाए तो ऐसा / ऐसे पूननविकरण जमा भी आपके बैंक के ग्रहણાधिकार के अंतर्गत ही आयेगा / आयेंगे और इससे बनी प्रतिभूति का भाग ठीक वैसे ही बनेगा जैसा कि पूननविकृत जमा इस अनुसूची मे सम्मिलित है और मै / हम विधिवतशपथ लेता हु / लेते है कि इस प्रकार के पूननविकृत जमा से संबंध रसीद / प्रमाण पत्र / पासबुक को विधिवત विमुक्त कर आपको हस्तांतरित करूंगा / करेंगे।<br>
          <span style="font-size: 7.3pt; color: #334155;">
            I/We agree that in the event of renewal of any of the Schedule Deposits by me/us on or after the respective date of maturity, such renewed Deposit/s shall also be subject to the lien in favour of your Bank and from part of the security created hereby, as if such renewed Deposit/s are included in the Schedule here to and I/We undertake to duly discharge and handover to you the Receipt(s) / Certificate (s) Pass Book(s) relating to such renewed Deposit/s.
          </span>
        </div>

        <div style="margin-bottom: 6px;">
          <strong>7.</strong>&nbsp;&nbsp;मै / हम आपके मेरे / हमारे सभी या किसी अनुसूची जमा कि अग्रिम राशि (ब्याज सहित) को परिपक्वता दिनांकों को उससे पूर्व या बाद मे किसी भी समय इस पत्र के प्रथम और द्वितीय अनुच्छेद मे उद्धृत किसी या सभी ऋण / सुविधाए या बैंक के किसी ऋण कि राशि वसूली के लिए / मुझे सूचना दिये बिना ही विनियोजित करने के लिए प्राधिकृत करता हू / करते हैं।<br>
          <span style="font-size: 7.3pt; color: #334155;">
            I/We authorize you to appropriate the proceeds (inclusive of interest) of any or all the Schedule Deposits at any time before, on or after the respective dates of maturity at your sole discretion in realisation of the moneys due to your Bank in respect of any or all loans/facilities and other indebtedness referred to in the first and second paragraph herein, without any intimation to me/us.
          </span>
        </div>

        <div>
          <strong>8.</strong>&nbsp;&nbsp;मै / हम संप्रति और भविष्य मे लागू किये जाने वाले नियमो का पालन करने तथा ब्याज के परिकलन हेतु सातवे अनुच्छेद मे किये गए प्राधिकार के आधार पर कि जानेवाली जमा कि अगम राशि के विनियोजन को मेरी / हमारी उक्त जमा कि अदायगी मानने को सहमत हूँ/हैं।<br>
          <span style="font-size: 7.3pt; color: #334155;">
            I/We agree to abide by all the Rules and Regulations of your Bank, already in force and to be enforced in future, and appropriation of the proceeds of any of the Schedule Deposits by virtue of the authorisation made in the seventh paragraph herein shall be treated as payment of the said Deposits to me/us for the purpose of calculation of interest thereon.
          </span>
        </div>

      </div>
    `;
  },

  // 5. સંમિશ્ર ગ્રહણાધિકાર પત્ર (PAGE 3 - CLAUSE 9 + SCHEDULE TABLE + FOR OFFICE USE) (media_1788588299801.jpg)
  populateLienPage3(record) {
    const container = document.getElementById('printLienPage3');
    if (!container) return;

    const formattedDate = record.loanDate ? record.loanDate.split('-').reverse().join('/') : '';
    const allNames = [record.applicant1.name, ...(record.jointApplicants || []).map(j => j.name)].filter(Boolean).join(', ');
    const roi = record.interestRate || '___';

    let totalDeposit = 0;
    const scheduleRowsHtml = (record.fdReceipts || []).map((f, i) => {
      totalDeposit += f.depAmount || 0;
      return `
        <tr>
          <td style="text-align: center; font-weight: bold; padding: 4px;">${i + 1}</td>
          <td style="text-align: center; font-weight: bold; padding: 4px;">FIXED DEPOSIT (FD)</td>
          <td style="text-align: center; font-family: monospace; padding: 4px;">${record.savingAccNo}</td>
          <td style="text-align: center; font-weight: bold; padding: 4px;">${f.certNo || '-'} &nbsp;(${f.depDate ? f.depDate.split('-').reverse().join('/') : '-'})</td>
          <td style="text-align: right; font-weight: bold; padding: 4px;">₹ ${(f.depAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: center; padding: 4px;">${f.matDate ? f.matDate.split('-').reverse().join('/') : '-'}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div class="text-fit-border" style="font-size: 8pt; line-height: 1.45;">
        
        <!-- Clause 9 -->
        <div style="text-align: justify; margin-bottom: 6px;">
          <strong>9.</strong>&nbsp;&nbsp;मै / हम घोषणा करते है कि मैंने / हमने अनुसूची जमा को किसी भी प्रकार से बन्धक, समनुदेशित, प्रभारित या भारग्रस्त नहीं किया है।<br>
          <span style="font-size: 7.5pt; color: #334155;">
            I/We declare that I/We have not pledged, assigned, charged or encumbered in any manner the Schedule Deposits in favour of other party.
          </span>
        </div>

        <!-- Schedule Table -->
        <div style="margin: 4px 0;">
          <div style="font-weight: 900; color: #002b99; text-align: center; margin-bottom: 2px;">
            अनुसूची जमा / SCHEDULE OF DEPOSITS
          </div>
          <table class="print-doc-table">
            <thead>
              <tr>
                <th style="width: 6%;">ક્રમ સંખ્યા<br>Sr.No.</th>
                <th style="width: 20%;">જમા ખાતે કા સ્વરૂપ<br>Nature of Deposit</th>
                <th style="width: 20%;">ખાતા સંખ્યા<br>Account No.</th>
                <th style="width: 24%;">જમા રસીદ/પ્રમાણપત્રકી સંખ્યા તથા દિનાંક<br>Receipt / Cert No & Date</th>
                <th style="width: 15%;">જમારાશિ<br>Amount</th>
                <th style="width: 15%;">દેય દિનાંક<br>Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleRowsHtml}
              <tr style="background-color: #f1f5f9; font-weight: 900;">
                <td colspan="4" style="text-align: right;">કુલ જમા રકમ (Total):</td>
                <td style="text-align: right; color: #002b99;">₹ ${totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Yours Faithfully / Signatures -->
        <div style="display: flex; justify-content: flex-end; margin: 6px 0 10px 0; text-align: center;">
          <div style="width: 250px;">
            <div style="font-weight: 900; margin-bottom: 25px;">भवदीय / Yours Faithfully</div>
            <div style="border-top: 1.5px dotted #000; padding-top: 2px; font-weight: 800; color: #002b99;">
              ${allNames ? `( ${allNames} )` : '( हस्ताक्षर / Signature )'}
            </div>
          </div>
        </div>

        <!-- For Office Use Box -->
        <div style="border: 1.5px solid #002b99; border-radius: 6px; padding: 6px 8px; background-color: #f8fafc; font-size: 7.8pt; line-height: 1.6;">
          <div style="text-align: center; font-weight: 900; color: #002b99; text-decoration: underline; margin-bottom: 4px;">
            For Office Use
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>Total Deposit Amount : <span class="fill-data-solid" style="min-width: 100px;">₹ ${totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            <div>Accrued Interest : <span class="fill-data-solid" style="min-width: 90px;"></span></div>
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 8px; margin-top: 2px;">
            <div>Depositor Name :- <span class="fill-data-solid" style="min-width: 160px; font-weight: bold;">${allNames}</span></div>
            <div>FDR A/c No. : <span class="fill-data-solid" style="min-width: 100px; font-family: monospace;">${record.savingAccNo}</span></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 8px; margin-top: 2px;">
            <div>Total Amount Deposit : <span class="fill-data-solid" style="min-width: 90px;">₹ ${totalDeposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            <div>Sanction Loan Amount Rs. : <span class="fill-data-solid" style="min-width: 100px; font-weight: bold;">₹ ${record.loanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
          </div>

          <div style="margin-top: 2px;">
            In Words : <span class="fill-data-solid" style="min-width: 80%; font-weight: bold; color: #002b99;">${record.loanAmountWordsEng}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 2px;">
            <div>With Interest Rate : <span class="fill-data-solid" style="min-width: 45px; text-align: center; font-weight: bold;">${roi}</span> %, to Loan A/c No : <span class="fill-data-solid" style="min-width: 110px; font-family: monospace;">${record.savingAccNo}</span></div>
            <div>Date : <span class="fill-data-solid" style="min-width: 80px; text-align: center;">${formattedDate}</span> &nbsp;&nbsp; Place : <span class="fill-data-solid" style="min-width: 70px; text-align: center;">જૂનાગઢ</span></div>
          </div>

          <!-- Bottom 3 Signatures -->
          <div style="display: flex; justify-content: space-between; margin-top: 25px; padding-top: 10px; font-weight: bold; text-align: center;">
            <div style="width: 100px; border-top: 1px dotted #000;">Office</div>
            <div style="width: 120px; border-top: 1px dotted #000;">Manager</div>
            <div style="width: 160px; border-top: 1px dotted #000;">Chief Executive Officer</div>
          </div>
        </div>

      </div>
    `;

    renderBankLogos();
  },

  openPrintPreview(recordId = null) {
    let record = null;
    if (recordId) {
      const records = this.getAllRecords();
      record = records[recordId];
    }
    this.preparePrintData(record);
    this.setPrintDocumentType(this.activePrintDoc || 'all');
    document.getElementById('printPreviewModal').style.display = 'flex';
  },

  setPrintDocumentType(type) {
    this.activePrintDoc = type;

    const pageMap = {
      dp_note: document.getElementById('printDpNotePage'),
      fd_app: document.getElementById('printFdLoanAppPage'),
      lien_1: document.getElementById('printLienPage1'),
      lien_2: document.getElementById('printLienPage2'),
      lien_3: document.getElementById('printLienPage3')
    };

    Object.keys(pageMap).forEach(key => {
      const el = pageMap[key];
      if (el) {
        el.style.display = (type === 'all' || type === key) ? 'flex' : 'none';
      }
    });

    document.querySelectorAll('.doc-switch-btn').forEach(btn => {
      if (btn.dataset.type === type) {
        btn.classList.add('bg-blue-900', 'text-amber-300');
        btn.classList.remove('bg-slate-200', 'text-slate-800');
      } else {
        btn.classList.remove('bg-blue-900', 'text-amber-300');
        btn.classList.add('bg-slate-200', 'text-slate-800');
      }
    });

    this.syncPreviewCanvas();
  },

  syncPreviewCanvas() {
    const canvas = document.getElementById('modalPrintCanvas');
    if (!canvas) return;

    canvas.innerHTML = '';

    const pages = [
      { id: 'printDpNotePage', type: 'dp_note' },
      { id: 'printFdLoanAppPage', type: 'fd_app' },
      { id: 'printLienPage1', type: 'lien_1' },
      { id: 'printLienPage2', type: 'lien_2' },
      { id: 'printLienPage3', type: 'lien_3' }
    ];

    pages.forEach(p => {
      if (this.activePrintDoc === 'all' || this.activePrintDoc === p.type) {
        const sourceEl = document.getElementById(p.id);
        if (sourceEl) {
          const previewCard = document.createElement('div');
          previewCard.className = 'bg-white shadow-xl p-6 rounded-xl border border-slate-300 w-full min-h-[600px] mb-6';
          previewCard.innerHTML = sourceEl.innerHTML;
          canvas.appendChild(previewCard);
        }
      }
    });

    renderBankLogos();
  },

  closePrintPreview() {
    document.getElementById('printPreviewModal').style.display = 'none';
  },

  executePrint() {
    window.print();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OverdraftApp.init();
});
