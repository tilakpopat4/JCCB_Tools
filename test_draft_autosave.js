/**
 * Draft Auto-Save Unit Testing Suite
 * Tests serialization, debounced storage, scoping, photo filtering, restoration, and clearance.
 */

const assert = require('assert');

// Mock DOM environment for Node testing
class MockElement {
  constructor(tag, id = '', type = 'text', name = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.name = name;
    this.type = type;
    this.value = '';
    this.checked = false;
    this.style = {};
    this.classList = new Set();
    this.children = [];
    this.parentNode = null;
    this.innerHTML = '';
  }

  querySelectorAll(selector) {
    const results = [];
    const traverse = (node) => {
      node.children.forEach(c => {
        results.push(c);
        traverse(c);
      });
    };
    traverse(this);
    return results;
  }

  querySelector(selector) {
    const all = this.querySelectorAll(selector);
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      return all.find(el => el.id === id) || null;
    }
    return all[0] || null;
  }

  dispatchEvent(evt) {
    return true;
  }

  addEventListener(type, handler) { }
}

// Mock localStorage
const mockStorage = {};
const localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { for (const k in mockStorage) delete mockStorage[k]; }
};

global.localStorage = localStorage;
global.CSS = { escape: (s) => s };

// Load DraftAutoSave engine
const DraftAutoSave = require('./draft-autosave.js').DraftAutoSave || global.DraftAutoSave;

function runDraftAutoSaveTests() {
  console.log("========================================================================");
  console.log("📝 DRAFT AUTO-SAVE UNIT TESTING SUITE 📝");
  console.log("========================================================================\n");

  let passed = 0;
  let failed = 0;

  const runTest = (name, fn) => {
    try {
      fn();
      passed++;
      console.log(`[PASS] ${name}`);
    } catch (err) {
      failed++;
      console.error(`[FAIL] ${name}:`, err.message);
    }
  };

  // Test 1: Key Scoping
  runTest("Key Generation: Scopes key per module and formId", () => {
    assert.strictEqual(DraftAutoSave.getKey('goldLoan', 'new-record'), 'draft:goldLoan:new-record');
    assert.strictEqual(DraftAutoSave.getKey('fd', 'FD-101'), 'draft:fd:FD-101');
    assert.strictEqual(DraftAutoSave.getKey('od', 'OD-202'), 'draft:od:OD-202');
  });

  // Test 2: Form Serialization
  runTest("Form Serialization: Captures text, number, select and excludes photo/file/base64", () => {
    const form = new MockElement('form', 'testForm');
    const inputName = new MockElement('input', 'customerName', 'text');
    inputName.value = 'RAMESHBHAI PATEL';
    const inputAmount = new MockElement('input', 'loanAmount', 'number');
    inputAmount.value = '250000';
    const inputPhoto = new MockElement('input', 'cust-photo-upload', 'file');
    inputPhoto.value = 'C:\\fakepath\\photo.jpg';
    const inputBase64 = new MockElement('input', 'applicantPhotoBase64', 'hidden');
    inputBase64.value = 'data:image/jpeg;base64,' + 'A'.repeat(5000);

    form.children.push(inputName, inputAmount, inputPhoto, inputBase64);

    const serialized = DraftAutoSave.serializeForm(form);
    assert.strictEqual(serialized.customerName, 'RAMESHBHAI PATEL');
    assert.strictEqual(serialized.loanAmount, '250000');
    assert.strictEqual(serialized['cust-photo-upload'], undefined, "File inputs must be excluded");
    assert.strictEqual(serialized.applicantPhotoBase64, undefined, "Base64 photos must be excluded");
  });

  // Test 3: Save and Retrieve Draft
  runTest("Save & Get Draft: Writes valid draft JSON to localStorage and retrieves it", () => {
    const form = new MockElement('form', 'goldForm');
    const inputName = new MockElement('input', 'borrowerName', 'text');
    inputName.value = 'DINESHBHAI POPAT';
    form.children.push(inputName);

    DraftAutoSave.saveDraft('goldLoan', 'GL_1001', form);
    assert.strictEqual(DraftAutoSave.hasDraft('goldLoan', 'GL_1001'), true);

    const draft = DraftAutoSave.getDraft('goldLoan', 'GL_1001');
    assert.strictEqual(draft.module, 'goldLoan');
    assert.strictEqual(draft.formId, 'GL_1001');
    assert.strictEqual(draft.data.borrowerName, 'DINESHBHAI POPAT');
  });

  // Test 4: Module Scoping Isolation
  runTest("Module Isolation: Switching modules never overwrites or reads other drafts", () => {
    const formGold = new MockElement('form', 'goldForm');
    const inGold = new MockElement('input', 'borrowerName', 'text');
    inGold.value = 'GOLD USER';
    formGold.children.push(inGold);

    const formFD = new MockElement('form', 'fdForm');
    const inFD = new MockElement('input', 'firstFullName', 'text');
    inFD.value = 'FD USER';
    formFD.children.push(inFD);

    const formOD = new MockElement('form', 'odForm');
    const inOD = new MockElement('input', 'customerName_1', 'text');
    inOD.value = 'OD USER';
    formOD.children.push(inOD);

    DraftAutoSave.saveDraft('goldLoan', 'new-record', formGold);
    DraftAutoSave.saveDraft('fd', 'new-record', formFD);
    DraftAutoSave.saveDraft('od', 'new-record', formOD);

    assert.strictEqual(DraftAutoSave.getDraft('goldLoan', 'new-record').data.borrowerName, 'GOLD USER');
    assert.strictEqual(DraftAutoSave.getDraft('fd', 'new-record').data.firstFullName, 'FD USER');
    assert.strictEqual(DraftAutoSave.getDraft('od', 'new-record').data.customerName_1, 'OD USER');
  });

  // Test 5: Clear Draft only on Confirmed Save
  runTest("Clear Draft: Clears specific module draft without touching other active drafts", () => {
    DraftAutoSave.clearDraft('goldLoan', 'new-record');
    assert.strictEqual(DraftAutoSave.hasDraft('goldLoan', 'new-record'), false);
    // FD and OD drafts remain intact
    assert.strictEqual(DraftAutoSave.hasDraft('fd', 'new-record'), true);
    assert.strictEqual(DraftAutoSave.hasDraft('od', 'new-record'), true);
  });

  // Test 6: Deserialization & Value Restoration
  runTest("Form Deserialization: Restores field values into form controls accurately", () => {
    const form = new MockElement('form', 'fdForm');
    const inName = new MockElement('input', 'firstFullName', 'text');
    const inAmt = new MockElement('input', 'deposit1Amount', 'number');
    const inCheck = new MockElement('input', 'isSeniorCitizen', 'checkbox');
    form.children.push(inName, inAmt, inCheck);

    const draftData = {
      firstFullName: 'BHARATBHAI JOSHI',
      deposit1Amount: '500000',
      isSeniorCitizen: true
    };

    const restored = DraftAutoSave.deserializeForm(form, draftData);
    assert.strictEqual(restored, true);
    assert.strictEqual(inName.value, 'BHARATBHAI JOSHI');
    assert.strictEqual(inAmt.value, '500000');
    assert.strictEqual(inCheck.checked, true);
  });

  console.log("\n========================================================================");
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed out of ${passed + failed} tests`);
  console.log("========================================================================");

  if (failed > 0) process.exit(1);
}

runDraftAutoSaveTests();
