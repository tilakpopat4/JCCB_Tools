/**
 * The Junagadh Commercial Co-operative Bank Ltd. (TJCCB)
 * Lightweight Independent Draft Auto-Save Engine
 *
 * Scopes:
 * - Module & Record Isolation: `draft:${moduleName}:${formId}`
 * - 500ms Debounced capture on input/change
 * - Excludes photo/base64 data to maintain small payload size
 * - Non-blocking "Unsaved draft restored" banner with "Discard draft" action
 * - Preserves draft across tab refresh/network drops
 * - Clears draft ONLY on confirmed successful save
 * - Completely decoupled from Firestore snapshot listeners / sync engines
 */

(function(global) {
  'use strict';

  const DraftAutoSave = {
    prefix: 'draft',
    debounceTimers: {},

    /**
     * Generate storage key
     */
    getKey: function(moduleName, formId) {
      const cleanModule = String(moduleName || 'common').trim();
      const cleanId = String(formId || 'new-record').trim();
      return `${this.prefix}:${cleanModule}:${cleanId}`;
    },

    /**
     * Extract serializable form values, skipping photos/files/base64
     */
    serializeForm: function(formEl) {
      if (!formEl) return null;
      const data = {};
      const elements = formEl.querySelectorAll('input, select, textarea');

      elements.forEach(el => {
        const name = el.name || el.id;
        if (!name) return;

        // Skip file inputs and photo/base64 fields
        if (el.type === 'file') return;
        const lowerName = name.toLowerCase();
        if (lowerName.includes('photo') || lowerName.includes('image') || lowerName.includes('base64')) return;

        let value;
        if (el.type === 'checkbox') {
          value = el.checked;
        } else if (el.type === 'radio') {
          if (el.checked) {
            value = el.value;
          } else {
            return;
          }
        } else {
          value = el.value;
        }

        // Exclude large base64 strings if accidentally entered
        if (typeof value === 'string' && (value.startsWith('data:image') || value.length > 1000)) {
          return;
        }

        data[name] = value;
      });

      return data;
    },

    /**
     * Populate form elements from serialized draft
     */
    deserializeForm: function(formEl, data) {
      if (!formEl || !data || typeof data !== 'object') return false;
      let populatedCount = 0;

      for (const key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
        const val = data[key];

        // Match by id or name
        let el = formEl.querySelector(`#${CSS.escape(key)}`) || formEl.querySelector(`[name="${CSS.escape(key)}"]`);
        if (!el) continue;

        if (el.type === 'checkbox') {
          el.checked = Boolean(val);
        } else if (el.type === 'radio') {
          const radio = formEl.querySelector(`input[type="radio"][name="${CSS.escape(key)}"][value="${CSS.escape(val)}"]`);
          if (radio) radio.checked = true;
        } else {
          el.value = val;
        }

        // Trigger input/change events for computed fields
        try {
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) { }

        populatedCount++;
      }

      return populatedCount > 0;
    },

    /**
     * Check if a non-empty draft exists
     */
    hasDraft: function(moduleName, formId) {
      const key = this.getKey(moduleName, formId);
      try {
        const item = localStorage.getItem(key);
        if (!item) return false;
        const parsed = JSON.parse(item);
        return parsed && parsed.data && Object.keys(parsed.data).length > 0;
      } catch (e) {
        return false;
      }
    },

    /**
     * Retrieve draft payload
     */
    getDraft: function(moduleName, formId) {
      const key = this.getKey(moduleName, formId);
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        return null;
      }
    },

    /**
     * Save draft to localStorage
     */
    saveDraft: function(moduleName, formId, formEl) {
      if (!formEl) return;
      const key = this.getKey(moduleName, formId);
      const data = this.serializeForm(formEl);
      if (!data || Object.keys(data).length === 0) return;

      // Check if at least one meaningful field has user content
      const hasContent = Object.values(data).some(v => {
        if (typeof v === 'string') return v.trim().length > 0;
        if (typeof v === 'number') return v > 0;
        return Boolean(v);
      });

      if (!hasContent) return;

      const payload = {
        module: moduleName,
        formId: formId || 'new-record',
        timestamp: Date.now(),
        savedAt: new Date().toLocaleTimeString(),
        data: data
      };

      try {
        localStorage.setItem(key, JSON.stringify(payload));
      } catch (e) {
        console.warn(`[DraftAutoSave] Could not write to localStorage:`, e);
      }
    },

    /**
     * Clear draft from localStorage
     */
    clearDraft: function(moduleName, formId) {
      const key = this.getKey(moduleName, formId);
      try {
        localStorage.removeItem(key);
        this.hideBanner(moduleName);
        console.log(`🧹 [DraftAutoSave] Cleared draft for [${key}]`);
      } catch (e) { }
    },

    /**
     * Render non-blocking "Unsaved draft restored" banner
     */
    showBanner: function(moduleName, formId, formEl, savedAt, onDiscard) {
      let banner = document.getElementById(`draft-banner-${moduleName}`);
      if (!banner && formEl) {
        banner = document.createElement('div');
        banner.id = `draft-banner-${moduleName}`;
        banner.className = 'draft-autosave-banner';
        banner.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(253, 190, 52, 0.16) 0%, rgba(4, 21, 98, 0.35) 100%);
          border: 1px solid rgba(253, 190, 52, 0.6);
          border-radius: 0.75rem;
          padding: 0.65rem 1rem;
          margin-bottom: 1.25rem;
          color: #fef08a;
          font-size: 0.825rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: fadeInDraft 0.3s ease-in-out;
        `;

        // Insert at the top of the form
        formEl.parentNode.insertBefore(banner, formEl);
      }

      if (banner) {
        banner.style.display = 'flex';
        banner.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-clock-rotate-left" style="color: #facc15; font-size: 0.95rem;"></i>
            <span>
              <strong>અનસેવ્ડ ડ્રાફ્ટ પુનઃસ્થાપિત (Unsaved draft restored)</strong>
              ${savedAt ? `<span style="opacity: 0.8; font-size: 0.75rem; margin-left: 0.35rem;">(${savedAt})</span>` : ''}
            </span>
          </div>
          <button type="button" class="btn-discard-draft-${moduleName}" style="
            background: rgba(239, 68, 68, 0.25);
            border: 1px solid rgba(239, 68, 68, 0.7);
            color: #fca5a5;
            padding: 0.3rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.35rem;
            transition: all 0.2s;
          ">
            <i class="fa-solid fa-trash-can"></i> Discard draft
          </button>
        `;

        const btnDiscard = banner.querySelector(`.btn-discard-draft-${moduleName}`);
        if (btnDiscard) {
          btnDiscard.onclick = (e) => {
            e.preventDefault();
            this.clearDraft(moduleName, formId);
            if (typeof onDiscard === 'function') {
              onDiscard();
            } else if (formEl && typeof formEl.reset === 'function') {
              formEl.reset();
            }
          };
        }
      }
    },

    /**
     * Hide banner
     */
    hideBanner: function(moduleName) {
      const banner = document.getElementById(`draft-banner-${moduleName}`);
      if (banner) {
        banner.style.display = 'none';
      }
    },

    /**
     * Attach debounced auto-saver to form
     */
    attach: function(options) {
      const { moduleName, formElement, getFormId, onRestore, onDiscard, debounceMs = 500 } = options;
      const form = typeof formElement === 'string' ? document.getElementById(formElement) : formElement;
      if (!form) return null;

      const self = this;
      const resolveFormId = () => {
        if (typeof getFormId === 'function') return getFormId();
        return 'new-record';
      };

      // 1. Initial Restore on Load
      const formId = resolveFormId();
      const draft = this.getDraft(moduleName, formId);
      if (draft && draft.data) {
        const restored = this.deserializeForm(form, draft.data);
        if (restored) {
          this.showBanner(moduleName, formId, form, draft.savedAt, () => {
            if (typeof onDiscard === 'function') {
              onDiscard();
            } else {
              form.reset();
            }
          });
          if (typeof onRestore === 'function') {
            onRestore(draft.data);
          }
        }
      }

      // 2. Debounced Event Listener on input / change
      const handleInput = (e) => {
        // Skip file inputs and photo uploads
        if (e.target && e.target.type === 'file') return;
        const curId = resolveFormId();

        if (self.debounceTimers[moduleName]) {
          clearTimeout(self.debounceTimers[moduleName]);
        }

        self.debounceTimers[moduleName] = setTimeout(() => {
          self.saveDraft(moduleName, curId, form);
        }, debounceMs);
      };

      form.addEventListener('input', handleInput);
      form.addEventListener('change', handleInput);

      return {
        saveNow: () => self.saveDraft(moduleName, resolveFormId(), form),
        restoreNow: () => {
          const curId = resolveFormId();
          const d = self.getDraft(moduleName, curId);
          if (d && d.data) {
            self.deserializeForm(form, d.data);
            self.showBanner(moduleName, curId, form, d.savedAt, onDiscard);
          }
        },
        clearNow: () => self.clearDraft(moduleName, resolveFormId()),
        hideBanner: () => self.hideBanner(moduleName)
      };
    }
  };

  global.DraftAutoSave = DraftAutoSave;
})(typeof window !== 'undefined' ? window : global);
