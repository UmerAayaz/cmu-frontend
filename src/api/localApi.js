// src/api/localApi.js
// ============================================================
// localStorage-backed drop-in replacement for `api` from client.js
// ✅ PROJECT-SCOPED — each project has separate forms & fields
// ============================================================

// ============================================================
// PROJECT DETECTION
// ============================================================
function getProjectId() {
  if (typeof window === 'undefined') return 'default'
  const match = window.location.pathname.match(/\/projects\/([^/]+)/)
  return match ? match[1] : 'default'
}

function keyFor(name) {
  return `cmu_project_${getProjectId()}_${name}`
}

// Regex presets are templates — shared globally across all projects
const REGEX_PRESETS_KEY = 'cmu_regex_presets'

// ---------- helpers ----------
const read  = (key, fb = []) => { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb } catch { return fb } }
const write = (key, v) => { try { localStorage.setItem(key, JSON.stringify(v)) } catch (e) { console.error(e); throw new Error('localStorage write failed') } }
const genId = () => 'id_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
const nowIso = () => new Date().toISOString()

// ============================================================
// SEED DEFAULTS
// ============================================================
const DEFAULT_PRESETS = [
  { key: 'cnic',       label: 'CNIC (Pakistan)',        pattern: '^\\d{5}-\\d{7}-\\d$',                  message: 'Enter valid CNIC (42101-1234567-1)' },
  { key: 'email',      label: 'Email',                  pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$',    message: 'Enter a valid email address' },
  { key: 'phone_pk',   label: 'Phone (PK Mobile)',      pattern: '^(\\+92|0)?3\\d{9}$',                  message: 'Enter valid Pakistani mobile number' },
  { key: 'phone_intl', label: 'Phone (International)',  pattern: '^\\+?[0-9]{10,15}$',                   message: 'Enter valid phone number' },
  { key: 'url',        label: 'URL',                    pattern: '^https?:\\/\\/[^\\s]+$',               message: 'Enter a valid URL' },
  { key: 'digits',     label: 'Digits Only',            pattern: '^\\d+$',                               message: 'Only digits allowed' },
  { key: 'alpha',      label: 'Letters Only',           pattern: '^[A-Za-z]+$',                          message: 'Only letters allowed' },
  { key: 'alnum',      label: 'Alphanumeric',           pattern: '^[A-Za-z0-9]+$',                       message: 'Only letters and numbers allowed' },
  { key: 'postal_pk',  label: 'Postal Code (PK)',       pattern: '^\\d{5}$',                             message: 'Enter valid 5-digit postal code' },
]

const DEFAULT_FIELDS = [
  { fieldKey: 'full_name',   label: 'Full Name',           fieldType: 'text',     placeholder: 'e.g. Ali Khan',        isRequired: true },
  { fieldKey: 'email',       label: 'Email Address',       fieldType: 'text',     placeholder: 'you@example.com',      isRequired: true,  validationType: 'email', regexPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$', regexMessage: 'Enter a valid email address' },
  { fieldKey: 'cnic',        label: 'CNIC Number',         fieldType: 'text',     placeholder: '42101-1234567-1',      isRequired: false, validationType: 'cnic',  regexPattern: '^\\d{5}-\\d{7}-\\d$', regexMessage: 'Enter valid CNIC (42101-1234567-1)' },
  { fieldKey: 'description', label: 'Description',         fieldType: 'textarea', placeholder: 'Describe the issue…',  isRequired: false },
  { fieldKey: 'priority',    label: 'Priority',            fieldType: 'dropdown', isRequired: true,  options: ['Low', 'Medium', 'High', 'Critical'] },
  { fieldKey: 'attachment',  label: 'Supporting Document', fieldType: 'attachment', isRequired: false, allowedFileTypes: ['pdf', 'jpg', 'png'], maxFileSizeMb: 5, allowMultiple: false },
]

function seedIfNeeded() {
  const seededKey = keyFor('seeded_v1')
  if (localStorage.getItem(seededKey)) return

  if (!localStorage.getItem(REGEX_PRESETS_KEY)) {
    write(REGEX_PRESETS_KEY, DEFAULT_PRESETS)
  }

  const fieldsKey = keyFor('library_fields')
  if (!localStorage.getItem(fieldsKey)) {
    write(fieldsKey, DEFAULT_FIELDS.map(f => ({
      id: genId(),
      fieldKey: f.fieldKey, label: f.label, fieldType: f.fieldType,
      placeholder: f.placeholder || null,
      isRequired: !!f.isRequired,
      options: f.options || null,
      regexPattern: f.regexPattern || null,
      regexMessage: f.regexMessage || null,
      minLength: null, maxLength: null, minValue: null, maxValue: null,
      validationType: f.validationType || null,
      allowedFileTypes: f.allowedFileTypes || null,
      maxFileSizeMb: f.maxFileSizeMb ?? null,
      allowMultiple: f.allowMultiple ?? null,
      createdAtUtc: nowIso(), updatedAtUtc: nowIso(),
    })))
  }

  const formsKey = keyFor('forms')
  if (!localStorage.getItem(formsKey)) write(formsKey, [])

  localStorage.setItem(seededKey, '1')
}

// ============================================================
// LIBRARY FIELDS (project-scoped)
// ============================================================
const listFields  = () => read(keyFor('library_fields'), [])
const listPresets = () => read(REGEX_PRESETS_KEY, [])

function createField(body) {
  const key = keyFor('library_fields')
  const fields = read(key, [])
  if (fields.some(f => f.fieldKey?.toLowerCase() === body.fieldKey?.toLowerCase()))
    throw new Error(`A field with key "${body.fieldKey}" already exists in this project.`)
  const field = { id: genId(), ...body, createdAtUtc: nowIso(), updatedAtUtc: nowIso() }
  fields.push(field); write(key, fields); return field
}

function updateField(id, body) {
  const key = keyFor('library_fields')
  const fields = read(key, [])
  const i = fields.findIndex(f => f.id === id)
  if (i === -1) throw new Error('Field not found')
  fields[i] = { ...fields[i], ...body, id, updatedAtUtc: nowIso() }
  write(key, fields); return fields[i]
}

function deleteField(id) {
  const key = keyFor('library_fields')
  const fields = read(key, [])
  const next = fields.filter(f => f.id !== id)
  if (next.length === fields.length) throw new Error('Field not found')
  write(key, next); return { success: true }
}

// ============================================================
// FORMS (project-scoped)
// ============================================================
function listForms() {
  return read(keyFor('forms'), []).map(f => ({ ...f, fieldCount: (f.fields || []).length }))
}

function getForm(id) {
  const form = read(keyFor('forms'), []).find(f => f.id === id)
  if (!form) throw new Error('Form not found')
  const libById = {}; listFields().forEach(lf => { libById[lf.id] = lf })
  const enriched = (form.fields || []).map(f => {
    const lib = libById[f.libraryFieldId] || {}
    return {
      ...lib,
      libraryFieldId: f.libraryFieldId,
      isRequired: f.isRequiredOverride ?? lib.isRequired ?? false,
      label: lib.label || '(missing field)',
      fieldType: lib.fieldType || 'text',
      regexPattern: lib.regexPattern,
    }
  })
  return { ...form, fieldCount: enriched.length, fields: enriched }
}

function createForm(body) {
  const key = keyFor('forms')
  const forms = read(key, [])
  const form = {
    id: genId(),
    formKey: 'form_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: body.name, description: body.description || null,
    status: 'Draft', version: 1, fields: body.fields || [],
    createdAtUtc: nowIso(), updatedAtUtc: nowIso(),
  }
  forms.push(form); write(key, forms); return form
}

function updateForm(id, body) {
  const key = keyFor('forms')
  const forms = read(key, [])
  const i = forms.findIndex(f => f.id === id)
  if (i === -1) throw new Error('Form not found')
  if (forms[i].status === 'Published') throw new Error('Published forms are immutable. Create a new version to edit.')
  forms[i] = {
    ...forms[i],
    name: body.name ?? forms[i].name,
    description: body.description ?? forms[i].description,
    fields: body.fields ?? forms[i].fields,
    updatedAtUtc: nowIso(),
  }
  write(key, forms); return forms[i]
}

function publishForm(id) {
  const key = keyFor('forms')
  const forms = read(key, [])
  const i = forms.findIndex(f => f.id === id)
  if (i === -1) throw new Error('Form not found')
  forms[i] = { ...forms[i], status: 'Published', updatedAtUtc: nowIso() }
  write(key, forms); return forms[i]
}

function newFormVersion(id) {
  const key = keyFor('forms')
  const forms = read(key, [])
  const original = forms.find(f => f.id === id)
  if (!original) throw new Error('Form not found')
  if (original.status !== 'Published') throw new Error('Only published forms can have new versions.')
  const siblings = forms.filter(f => f.formKey === original.formKey)
  const maxV = Math.max(...siblings.map(f => f.version || 1))
  const newForm = {
    ...original,
    id: genId(),
    status: 'Draft',
    version: maxV + 1,
    createdAtUtc: nowIso(), updatedAtUtc: nowIso(),
  }
  forms.push(newForm); write(key, forms); return newForm
}

// ============================================================
// WORKFLOWS (project-scoped)
// ============================================================
const listWorkflows = () => read(keyFor('workflow_definitions'), [])

function migrateFormInWorkflows(oldFormId, newFormId) {
  if (!oldFormId || !newFormId) throw new Error('oldFormId and newFormId are required')
  const key = keyFor('workflow_definitions')
  const workflows = read(key, [])
  if (workflows.length === 0) return { updatedCount: 0, warnings: [], skipped: [] }

  let updatedCount = 0
  const warnings = [], skipped = []

  const updated = workflows.map(w => {
    if (w.status === 2 || w.status === 'Archived') { skipped.push(w.id); return w }
    try {
      const designer = JSON.parse(w.designerJson || '{}')
      const nodes = designer.Nodes || designer.nodes || []
      let changed = false
      const newNodes = nodes.map(n => {
        const fid = n.FormId || n.formId
        if (fid && fid.toLowerCase() === oldFormId.toLowerCase()) {
          changed = true
          return { ...n, FormId: newFormId, formId: newFormId }
        }
        return n
      })
      if (!changed) return w
      const newDesigner = { ...designer }
      if (designer.Nodes) newDesigner.Nodes = newNodes
      else newDesigner.nodes = newNodes
      updatedCount++
      return {
        ...w,
        designerJson: JSON.stringify(newDesigner),
        version: (w.version || 1) + 1,
        updatedAtUtc: nowIso(),
      }
    } catch (err) {
      warnings.push(`Workflow "${w.name}" could not be updated: ${err.message}`)
      return w
    }
  })

  write(key, updated)
  return { updatedCount, warnings, skipped }
}

// ============================================================
// ROUTER
// ============================================================
export async function localApi(path, options = {}) {
  seedIfNeeded()
  const method = (options.method || 'GET').toUpperCase()
  const body   = options.body || null
  const [urlPath] = path.split('?')

  await new Promise(r => setTimeout(r, 25))

  // Library fields
  if (urlPath === '/library-fields' && method === 'GET')  return listFields()
  if (urlPath === '/library-fields/regex-presets' && method === 'GET') return listPresets()
  if (urlPath === '/library-fields' && method === 'POST') return createField(body)

  const fm = urlPath.match(/^\/library-fields\/([^/]+)$/)
  if (fm) {
    if (method === 'PUT')    return updateField(fm[1], body)
    if (method === 'DELETE') return deleteField(fm[1])
    if (method === 'GET')    { const f = listFields().find(x => x.id === fm[1]); if (!f) throw new Error('Field not found'); return f }
  }

  // Forms
  if (urlPath === '/forms' && method === 'GET')  return listForms()
  if (urlPath === '/forms' && method === 'POST') return createForm(body)

  const fgm = urlPath.match(/^\/forms\/([^/]+)$/)
  if (fgm) {
    if (method === 'GET') return getForm(fgm[1])
    if (method === 'PUT') return updateForm(fgm[1], body)
  }

  const pm = urlPath.match(/^\/forms\/([^/]+)\/publish$/)
  if (pm && method === 'POST') return publishForm(pm[1])

  const nvm = urlPath.match(/^\/forms\/([^/]+)\/new-version$/)
  if (nvm && method === 'POST') return newFormVersion(nvm[1])

  // Workflows
  if (urlPath === '/workflow-definitions' && method === 'GET') return listWorkflows()
  if (urlPath === '/workflow-definitions/migrate-form' && method === 'POST')
    return migrateFormInWorkflows(body?.oldFormId, body?.newFormId)

  throw new Error(`localApi: Unhandled route ${method} ${urlPath}`)
}

export const api = localApi