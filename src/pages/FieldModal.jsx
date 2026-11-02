import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  X, Type, AlignLeft, Hash, Calendar, ChevronDown, Circle, CheckSquare, Paperclip,
  Plus, Trash2,
} from 'lucide-react';
import { formsApi } from '../api/forms.api';
import { REGEX_PRESETS } from '../utils/constants';
import '../styles/workflow-module.css';

const FIELD_TYPES = [
  { key: 'text',     label: 'Text',      icon: Type },
  { key: 'textarea', label: 'Text Area', icon: AlignLeft },
  { key: 'number',   label: 'Number',    icon: Hash },
  { key: 'date',     label: 'Date',      icon: Calendar },
  { key: 'dropdown', label: 'Dropdown',  icon: ChevronDown },
  { key: 'radio',    label: 'Radio',     icon: Circle },
  { key: 'checkbox', label: 'Checkbox',  icon: CheckSquare },
  { key: 'file',     label: 'File',      icon: Paperclip },
];

const EMPTY_FORM = {
  label: '',
  fieldKey: '',
  fieldType: 'text',
  required: false,
  // validation
  minLength: '',
  maxLength: '',
  min: '',
  max: '',
  regex: '',
  regexMessage: '',
  // options
  options: [],
  // file
  allowedTypes: 'pdf,jpg,png,docx',
  maxSizeMB: 5,
  allowMultiple: false,
};

export default function FieldModal({ open, onClose, field }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [testValue, setTestValue] = useState('');

  useEffect(() => {
    if (!open) return;
    if (field) {
      setForm({
        label: field.label || '',
        fieldKey: field.fieldKey || '',
        fieldType: field.fieldType || 'text',
        required: !!field.required,
        minLength: field.validation?.minLength ?? '',
        maxLength: field.validation?.maxLength ?? '',
        min: field.validation?.min ?? '',
        max: field.validation?.max ?? '',
        regex: field.validation?.regex || '',
        regexMessage: field.validation?.regexMessage || '',
        options: field.options || [],
        allowedTypes: field.validation?.allowedTypes?.join(',') ?? 'pdf,jpg,png,docx',
        maxSizeMB: field.validation?.maxSizeMB ?? 5,
        allowMultiple: !!field.validation?.allowMultiple,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setTestValue('');
  }, [open, field]);

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      field ? formsApi.updateField(field.id, payload) : formsApi.createField(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-library'] });
      toast.success(field ? 'Field updated' : 'Field created');
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleLabelChange = (label) => {
    update({ label });
    if (!field) {
      const key = label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 40);
      update({ fieldKey: key });
    }
  };

  const addOption = () => update({ options: [...form.options, ''] });
  const updateOption = (idx, val) => {
    const opts = [...form.options];
    opts[idx] = val;
    update({ options: opts });
  };
  const removeOption = (idx) => {
    update({ options: form.options.filter((_, i) => i !== idx) });
  };

  const applyPreset = (preset) => {
    update({ regex: preset.pattern, regexMessage: preset.message });
  };

  const testRegex = () => {
    if (!form.regex) return null;
    try {
      return new RegExp(form.regex).test(testValue);
    } catch {
      return null;
    }
  };

  const handleSubmit = () => {
    if (!form.label.trim()) return toast.error('Label is required');
    if (!form.fieldKey.trim()) return toast.error('Field key is required');

    if (['dropdown', 'radio', 'checkbox'].includes(form.fieldType)) {
      if (form.options.filter(Boolean).length === 0) {
        return toast.error('Add at least one option');
      }
    }

    const validation = {};
    if (form.minLength !== '') validation.minLength = Number(form.minLength);
    if (form.maxLength !== '') validation.maxLength = Number(form.maxLength);
    if (form.min !== '') validation.min = Number(form.min);
    if (form.max !== '') validation.max = Number(form.max);
    if (form.regex) validation.regex = form.regex;
    if (form.regexMessage) validation.regexMessage = form.regexMessage;

    if (form.fieldType === 'file') {
      validation.allowedTypes = form.allowedTypes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      validation.maxSizeMB = Number(form.maxSizeMB);
      validation.allowMultiple = form.allowMultiple;
    }

    const payload = {
      label: form.label.trim(),
      fieldKey: form.fieldKey.trim(),
      fieldType: form.fieldType,
      required: form.required,
      validation,
    };
    if (['dropdown', 'radio', 'checkbox'].includes(form.fieldType)) {
      payload.options = form.options.filter(Boolean);
    }

    saveMutation.mutate(payload);
  };

  if (!open) return null;

  const regexOk = testRegex();

  return (
    <div className="wf-modal-overlay" onClick={onClose}>
      <div className="wf-modal wf-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="wf-modal__header">
          <h3 className="wf-modal__title">
            {field ? 'Edit Field' : 'Add Field'}
          </h3>
          <button className="wf-modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="wf-modal__body">
          {/* Basic info */}
          <div className="wf-row">
            <div className="wf-field">
              <label className="wf-label">
                Label <span className="wf-label__req">*</span>
              </label>
              <input
                className="wf-input"
                value={form.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="e.g. Complainant Name"
              />
            </div>
            <div className="wf-field">
              <label className="wf-label">
                Field Key <span className="wf-label__req">*</span>
              </label>
              <input
                className="wf-input"
                value={form.fieldKey}
                onChange={(e) => update({ fieldKey: e.target.value })}
                placeholder="complainant_name"
              />
            </div>
          </div>

          {/* Type selector */}
          <div className="wf-field">
            <label className="wf-label">Field Type</label>
            <div className="wf-field-types">
              {FIELD_TYPES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  className={`wf-field-type ${form.fieldType === key ? 'wf-field-type--active' : ''}`}
                  onClick={() => update({ fieldType: key })}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Required toggle */}
          <div className="wf-toggle-row">
            <div>
              <div className="wf-label">Required</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>
                User must fill this before submitting
              </div>
            </div>
            <button
              type="button"
              className={`wf-toggle ${form.required ? 'wf-toggle--on' : ''}`}
              onClick={() => update({ required: !form.required })}
            />
          </div>

          {/* Validation — text/number */}
          {['text', 'textarea', 'number'].includes(form.fieldType) && (
            <div className="wf-section">
              <h4 className="wf-section__title">Validation</h4>

              {form.fieldType === 'number' ? (
                <div className="wf-row">
                  <div className="wf-field">
                    <label className="wf-label">Min Value</label>
                    <input
                      type="number"
                      className="wf-input"
                      value={form.min}
                      onChange={(e) => update({ min: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="wf-field">
                    <label className="wf-label">Max Value</label>
                    <input
                      type="number"
                      className="wf-input"
                      value={form.max}
                      onChange={(e) => update({ max: e.target.value })}
                      placeholder="100000"
                    />
                  </div>
                </div>
              ) : (
                <div className="wf-row">
                  <div className="wf-field">
                    <label className="wf-label">Min Length</label>
                    <input
                      type="number"
                      className="wf-input"
                      value={form.minLength}
                      onChange={(e) => update({ minLength: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="wf-field">
                    <label className="wf-label">Max Length</label>
                    <input
                      type="number"
                      className="wf-input"
                      value={form.maxLength}
                      onChange={(e) => update({ maxLength: e.target.value })}
                      placeholder="255"
                    />
                  </div>
                </div>
              )}

              {form.fieldType === 'text' && (
                <>
                  <div className="wf-field">
                    <label className="wf-label">Regex Pattern</label>
                    <input
                      className="wf-input"
                      value={form.regex}
                      onChange={(e) => update({ regex: e.target.value })}
                      placeholder="^\\d{5}-\\d{7}-\\d$"
                    />
                  </div>
                  <div className="wf-chips">
                    {REGEX_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        className="wf-chip"
                        onClick={() => applyPreset(p)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {form.regex && (
                    <>
                      <div className="wf-field">
                        <label className="wf-label">Error Message</label>
                        <input
                          className="wf-input"
                          value={form.regexMessage}
                          onChange={(e) => update({ regexMessage: e.target.value })}
                          placeholder="Invalid format"
                        />
                      </div>
                      <div className="wf-test-box">
                        <label className="wf-label">Live Test</label>
                        <input
                          className="wf-input"
                          value={testValue}
                          onChange={(e) => setTestValue(e.target.value)}
                          placeholder="Type to test regex…"
                        />
                        {testValue && regexOk !== null && (
                          <div
                            className={`wf-test-result ${regexOk ? 'wf-test-result--ok' : 'wf-test-result--bad'}`}
                          >
                            {regexOk ? '✓ Matches' : '✗ Does not match'}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Options — dropdown/radio/checkbox */}
          {['dropdown', 'radio', 'checkbox'].includes(form.fieldType) && (
            <div className="wf-section">
              <h4 className="wf-section__title">Options</h4>
              <div className="wf-options">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="wf-option-row">
                    <input
                      className="wf-input"
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                    />
                    <button
                      type="button"
                      className="wf-btn wf-btn--ghost wf-btn--icon"
                      onClick={() => removeOption(idx)}
                      style={{ color: '#DC2626' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="wf-btn wf-btn--secondary"
                onClick={addOption}
                style={{ alignSelf: 'flex-start' }}
              >
                <Plus size={14} /> Add Option
              </button>
            </div>
          )}

          {/* File config */}
          {form.fieldType === 'file' && (
            <div className="wf-section">
              <h4 className="wf-section__title">File Configuration</h4>
              <div className="wf-row">
                <div className="wf-field">
                  <label className="wf-label">Allowed Types (comma separated)</label>
                  <input
                    className="wf-input"
                    value={form.allowedTypes}
                    onChange={(e) => update({ allowedTypes: e.target.value })}
                    placeholder="pdf,jpg,png,docx"
                  />
                </div>
                <div className="wf-field">
                  <label className="wf-label">Max Size (MB)</label>
                  <input
                    type="number"
                    className="wf-input"
                    value={form.maxSizeMB}
                    onChange={(e) => update({ maxSizeMB: e.target.value })}
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="wf-toggle-row">
                <span className="wf-label">Allow multiple files</span>
                <button
                  type="button"
                  className={`wf-toggle ${form.allowMultiple ? 'wf-toggle--on' : ''}`}
                  onClick={() => update({ allowMultiple: !form.allowMultiple })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="wf-modal__footer">
          <button className="wf-btn wf-btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="wf-btn wf-btn--primary"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving…' : field ? 'Update Field' : 'Create Field'}
          </button>
        </div>
      </div>
    </div>
  );
}