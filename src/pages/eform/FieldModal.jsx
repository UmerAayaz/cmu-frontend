import { useState, useEffect } from 'react'
import {
  X, Type, AlignLeft, Hash, Calendar, ChevronDown, Circle, CheckSquare, Paperclip,
  Plus, Trash2,
} from 'lucide-react'
import { api } from '../../api/localApi.js'

const FIELD_TYPES = [
  { key: 'text',       label: 'Text',      icon: Type },
  { key: 'textarea',   label: 'Text Area', icon: AlignLeft },
  { key: 'number',     label: 'Number',    icon: Hash },
  { key: 'date',       label: 'Date',      icon: Calendar },
  { key: 'dropdown',   label: 'Dropdown',  icon: ChevronDown },
  { key: 'radio',      label: 'Radio',     icon: Circle },
  { key: 'checkbox',   label: 'Checkbox',  icon: CheckSquare },
  { key: 'attachment', label: 'File',      icon: Paperclip },
]

const REGEX_PRESETS = [
  { label: 'CNIC',         pattern: '^\\d{5}-\\d{7}-\\d$',               message: 'Enter valid CNIC (42101-1234567-1)' },
  { label: 'Email',        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$', message: 'Enter a valid email address' },
  { label: 'Phone (PK)',   pattern: '^(\\+92|0)?3\\d{9}$',               message: 'Enter valid Pakistani mobile number' },
  { label: 'Phone (Intl)', pattern: '^\\+?[0-9]{10,15}$',                message: 'Enter valid phone number' },
  { label: 'URL',          pattern: '^https?:\\/\\/[^\\s]+$',            message: 'Enter a valid URL' },
  { label: 'Digits',       pattern: '^\\d+$',                             message: 'Only digits allowed' },
  { label: 'Letters',      pattern: '^[A-Za-z]+$',                        message: 'Only letters allowed' },
  { label: 'Alphanumeric', pattern: '^[A-Za-z0-9]+$',                     message: 'Only letters and numbers allowed' },
  { label: 'Postal (PK)',  pattern: '^\\d{5}$',                           message: 'Enter valid 5-digit postal code' },
]

const EMPTY_FORM = {
  label: '', fieldKey: '', fieldType: 'text', required: false,
  minLength: '', maxLength: '', min: '', max: '',
  regex: '', regexMessage: '', validationType: '',
  options: [],
  allowedTypes: 'pdf,jpg,png,docx', maxSizeMB: 5, allowMultiple: false,
}

// ✅ Yahan saare red colors hata kar --primary-red laga diya hai
const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(24,27,31,.45)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 20 },
  modal: { width: 'min(720px, 100%)', maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 14, boxShadow: '0 24px 80px rgba(0,0,0,.22)', overflow: 'hidden' },
  header: { padding: '18px 22px', borderBottom: '1px solid var(--primary-red, #dc2626)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' },
  headerTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' },
  closeBtn: { width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, overflowY: 'auto', padding: 22, background: '#fafafa' },
  footer: { padding: '14px 22px', borderTop: '1px solid #f3f4f6', background: '#fff', display: 'flex', justifyContent: 'flex-end', gap: 10 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: '#374151' },
  req: { color: 'var(--primary-red, #dc2626)', marginLeft: 2 },
  input: { padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff' },
  typesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  typeBtn: (active) => ({ 
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 6px', 
    border: '1.5px solid ' + (active ? 'var(--primary-red, #dc2626)' : '#e5e7eb'), 
    background: active ? '#fff' : '#fff', 
    color: active ? 'var(--primary-red, #dc2626)' : '#6b7280', 
    borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600 
  }),
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', marginBottom: 8 },
  toggle: (on) => ({ position: 'relative', width: 42, height: 24, borderRadius: 999, background: on ? 'var(--primary-red, #dc2626)' : '#cbd5e1', border: 'none', cursor: 'pointer', transition: '0.2s' }),
  toggleDot: (on) => ({ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: '0.2s' }),
  section: { padding: '16px 18px', background: '#fff', border: '1px solid #f3f4f6', borderLeft: '4px solid var(--primary-red, #dc2626)', borderRadius: 10, marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: 'var(--primary-red, #dc2626)', textTransform: 'uppercase', letterSpacing: '0.9px', margin: '0 0 12px', paddingBottom: 8, borderBottom: '1px dashed var(--primary-red, #dc2626)' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, marginBottom: 12 },
  chip: { padding: '4px 12px', borderRadius: 20, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  testBox: { padding: 12, background: '#fff', border: '1px solid var(--primary-red, #dc2626)', borderRadius: 8, marginTop: 10 },
  testResult: (ok) => ({ 
    marginTop: 8, padding: '8px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, 
    background: ok ? '#ecfdf5' : '#fee2e2', 
    color: ok ? '#065f46' : '#991b1b', 
    border: '1px solid ' + (ok ? '#86efac' : '#fca5a5') 
  }),
  optionRow: { display: 'flex', gap: 8, marginBottom: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 8, border: '1.5px solid var(--primary-red, #dc2626)', background: '#fff', color: 'var(--primary-red, #dc2626)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  addBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1.5px dashed var(--primary-red, #dc2626)', background: 'transparent', color: 'var(--primary-red, #dc2626)', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  btnPrimary: { padding: '9px 18px', background: 'var(--primary-red, #dc2626)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnSecondary: { padding: '9px 18px', background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
}

export default function FieldModal({ open, onClose, field, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [testValue, setTestValue] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (field) {
      setForm({
        label: field.label || '',
        fieldKey: field.fieldKey || '',
        fieldType: field.fieldType || 'text',
        required: !!field.isRequired,
        minLength: field.minLength ?? '',
        maxLength: field.maxLength ?? '',
        min: field.minValue ?? '',
        max: field.maxValue ?? '',
        regex: field.regexPattern || '',
        regexMessage: field.regexMessage || '',
        validationType: field.validationType || '',
        options: field.options || [],
        allowedTypes: (field.allowedFileTypes || ['pdf', 'jpg', 'png', 'docx']).join(','),
        maxSizeMB: field.maxFileSizeMb ?? 5,
        allowMultiple: !!field.allowMultiple,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setTestValue('')
  }, [open, field])

  const update = (patch) => setForm((f) => ({ ...f, ...patch }))

  const handleLabelChange = (label) => {
    update({ label })
    if (!field) {
      const key = label.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').slice(0, 40)
      update({ fieldKey: key })
    }
  }

  const addOption = () => update({ options: [...form.options, ''] })
  const updateOption = (idx, val) => { const opts = [...form.options]; opts[idx] = val; update({ options: opts }) }
  const removeOption = (idx) => update({ options: form.options.filter((_, i) => i !== idx) })

  const applyPreset = (preset) => { update({ regex: preset.pattern, regexMessage: preset.message, validationType: preset.label.toLowerCase().replace(/[^a-z0-9]+/g, '_') }) }

  const testRegex = () => { if (!form.regex) return null; try { return new RegExp(form.regex).test(testValue) } catch { return null } }

  const handleSubmit = async () => {
    if (!form.label.trim()) return window.alert('Label is required')
    if (!form.fieldKey.trim()) return window.alert('Field key is required')
    if (['dropdown', 'radio', 'checkbox'].includes(form.fieldType)) {
      if (form.options.filter(Boolean).length === 0) return window.alert('Add at least one option')
    }

    setSaving(true)
    try {
      const payload = {
        fieldKey: form.fieldKey.trim(), label: form.label.trim(), fieldType: form.fieldType,
        placeholder: null, isRequired: !!form.required,
        options: ['dropdown', 'radio', 'checkbox'].includes(form.fieldType) ? form.options.filter(Boolean) : null,
        regexPattern: form.regex?.trim() || null, regexMessage: form.regexMessage?.trim() || null,
        minLength: form.minLength !== '' ? Number(form.minLength) : null, maxLength: form.maxLength !== '' ? Number(form.maxLength) : null,
        minValue: form.min !== '' ? Number(form.min) : null, maxValue: form.max !== '' ? Number(form.max) : null,
        validationType: form.validationType || null,
        allowedFileTypes: form.fieldType === 'attachment' ? form.allowedTypes.split(',').map((x) => x.trim()).filter(Boolean) : null,
        maxFileSizeMb: form.fieldType === 'attachment' ? Number(form.maxSizeMB) : null,
        allowMultiple: form.fieldType === 'attachment' ? !!form.allowMultiple : null,
      }

      if (field) {
        const { fieldKey, ...updatePayload } = payload
        await api(`/library-fields/${field.id}`, { method: 'PUT', body: updatePayload })
      } else {
        await api('/library-fields', { method: 'POST', body: payload })
      }

      if (onSaved) onSaved()
      onClose()
    } catch (err) {
      window.alert(`Save failed: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null
  const regexOk = testRegex()

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={s.headerTitle}>{field ? 'Edit Field' : 'Add Field'}</h3>
          <button style={s.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div style={s.body}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Label <span style={s.req}>*</span></label>
              <input style={s.input} value={form.label} onChange={(e) => handleLabelChange(e.target.value)} placeholder="e.g. Complainant Name" autoFocus />
            </div>
            <div style={s.field}>
              <label style={s.label}>Field Key <span style={s.req}>*</span></label>
              <input style={s.input} value={form.fieldKey} onChange={(e) => update({ fieldKey: e.target.value })} placeholder="complainant_name" />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Field Type</label>
            <div style={s.typesGrid}>
              {FIELD_TYPES.map(({ key, label, icon: Icon }) => (
                <button key={key} type="button" style={s.typeBtn(form.fieldType === key)} onClick={() => update({ fieldType: key })} disabled={!!field}>
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            {field && <small style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Field type cannot be changed after creation.</small>}
          </div>

          <div style={s.toggleRow}>
            <div>
              <div style={s.label}>Required</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>User must fill this before submitting</div>
            </div>
            <button type="button" style={s.toggle(form.required)} onClick={() => update({ required: !form.required })}>
              <span style={s.toggleDot(form.required)} />
            </button>
          </div>

          {['text', 'textarea', 'number'].includes(form.fieldType) && (
            <div style={s.section}>
              <h4 style={s.sectionTitle}>Validation</h4>
              {form.fieldType === 'number' ? (
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Min Value</label>
                    <input type="number" style={s.input} value={form.min} onChange={(e) => update({ min: e.target.value })} placeholder="0" />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Max Value</label>
                    <input type="number" style={s.input} value={form.max} onChange={(e) => update({ max: e.target.value })} placeholder="100000" />
                  </div>
                </div>
              ) : (
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Min Length</label>
                    <input type="number" style={s.input} value={form.minLength} onChange={(e) => update({ minLength: e.target.value })} placeholder="0" />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Max Length</label>
                    <input type="number" style={s.input} value={form.maxLength} onChange={(e) => update({ maxLength: e.target.value })} placeholder="255" />
                  </div>
                </div>
              )}

              {form.fieldType === 'text' && (
                <>
                  <div style={s.field}>
                    <label style={s.label}>Regex Pattern</label>
                    <input style={{ ...s.input, fontFamily: 'monospace' }} value={form.regex} onChange={(e) => update({ regex: e.target.value })} placeholder="^\d{5}-\d{7}-\d$" />
                  </div>
                  <div style={s.chips}>
                    {REGEX_PRESETS.map((p) => (
                      <button key={p.label} type="button" style={s.chip} onClick={() => applyPreset(p)}>{p.label}</button>
                    ))}
                  </div>
                  {form.regex && (
                    <>
                      <div style={s.field}>
                        <label style={s.label}>Error Message</label>
                        <input style={s.input} value={form.regexMessage} onChange={(e) => update({ regexMessage: e.target.value })} placeholder="Invalid format" />
                      </div>
                      <div style={s.testBox}>
                        <label style={s.label}>Live Test</label>
                        <input style={{ ...s.input, marginTop: 4 }} value={testValue} onChange={(e) => setTestValue(e.target.value)} placeholder="Type to test regex…" />
                        {testValue && regexOk !== null && (
                          <div style={s.testResult(regexOk)}>
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

          {['dropdown', 'radio', 'checkbox'].includes(form.fieldType) && (
            <div style={s.section}>
              <h4 style={s.sectionTitle}>Options</h4>
              {form.options.length === 0 && (
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10, fontStyle: 'italic' }}>No options yet.</div>
              )}
              {form.options.map((opt, idx) => (
                <div key={idx} style={s.optionRow}>
                  <input style={{ ...s.input, flex: 1 }} value={opt} onChange={(e) => updateOption(idx, e.target.value)} placeholder={`Option ${idx + 1}`} />
                  <button type="button" style={s.iconBtn} onClick={() => removeOption(idx)}><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" style={s.addBtn} onClick={addOption}><Plus size={14} /> Add Option</button>
            </div>
          )}

          {form.fieldType === 'attachment' && (
            <div style={s.section}>
              <h4 style={s.sectionTitle}>File Configuration</h4>
              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Allowed Types (comma separated)</label>
                  <input style={s.input} value={form.allowedTypes} onChange={(e) => update({ allowedTypes: e.target.value })} placeholder="pdf,jpg,png,docx" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Max Size (MB)</label>
                  <input type="number" style={s.input} value={form.maxSizeMB} onChange={(e) => update({ maxSizeMB: e.target.value })} placeholder="5" />
                </div>
              </div>
              <div style={s.toggleRow}>
                <span style={s.label}>Allow multiple files</span>
                <button type="button" style={s.toggle(form.allowMultiple)} onClick={() => update({ allowMultiple: !form.allowMultiple })}>
                  <span style={s.toggleDot(form.allowMultiple)} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={s.footer}>
          <button style={s.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={s.btnPrimary} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : field ? 'Update Field' : 'Create Field'}
          </button>
        </div>
      </div>
    </div>
  )
}