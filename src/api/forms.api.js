import { api } from './client';

const MOCK = true;

// --- Field Library Mock Storage (Default Fields) ---
const DEFAULT_FIELDS = [
  {
    id: 1,
    fieldKey: 'complainant_name',
    label: 'Complainant Name',
    fieldType: 'text',
    required: true,
    validation: { minLength: 2, maxLength: 100 },
    createdAt: '2026-10-01',
  },
  {
    id: 2,
    fieldKey: 'cnic',
    label: 'CNIC Number',
    fieldType: 'text',
    required: true,
    validation: { regex: '^\\d{5}-\\d{7}-\\d$', regexMessage: 'Format: 12345-1234567-1' },
    createdAt: '2026-10-01',
  },
  {
    id: 3,
    fieldKey: 'email',
    label: 'Email Address',
    fieldType: 'text',
    required: false,
    validation: { regex: '^[^@]+@[^@]+\\.[^@]+$', regexMessage: 'Valid email required' },
    createdAt: '2026-10-02',
  },
  {
    id: 4,
    fieldKey: 'account_type',
    label: 'Account Type',
    fieldType: 'dropdown',
    required: true,
    options: ['Savings', 'Current', 'Fixed Deposit', 'Other'],
    validation: {},
    createdAt: '2026-10-02',
  },
  {
    id: 5,
    fieldKey: 'amount',
    label: 'Amount',
    fieldType: 'number',
    required: false,
    validation: { min: 0, max: 10000000 },
    createdAt: '2026-10-03',
  },
  {
    id: 6,
    fieldKey: 'incident_date',
    label: 'Incident Date',
    fieldType: 'date',
    required: true,
    validation: {},
    createdAt: '2026-10-03',
  },
  {
    id: 7,
    fieldKey: 'description',
    label: 'Description',
    fieldType: 'textarea',
    required: true,
    validation: { minLength: 10, maxLength: 2000 },
    createdAt: '2026-10-04',
  },
  {
    id: 8,
    fieldKey: 'attachment',
    label: 'Supporting Document',
    fieldType: 'file',
    required: false,
    validation: { allowedTypes: ['pdf', 'jpg', 'png', 'docx'], maxSizeMB: 5, allowMultiple: false },
    createdAt: '2026-10-04',
  },
];

// LocalStorage helpers
const getStoredFields = () => {
  const stored = localStorage.getItem('mock_fields');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('mock_fields', JSON.stringify(DEFAULT_FIELDS));
  return DEFAULT_FIELDS;
};
const storeFields = (fields) => localStorage.setItem('mock_fields', JSON.stringify(fields));

const getStoredForms = () => JSON.parse(localStorage.getItem('mock_forms') || '[]');
const storeForms = (forms) => localStorage.setItem('mock_forms', JSON.stringify(forms));


export const formsApi = {
  // ==========================================
  // FIELD LIBRARY
  // ==========================================
  listFields: async () => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return { items: getStoredFields() };
    }
    return api.get('/forms/fields');
  },

  createField: async (payload) => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const fields = getStoredFields();
      const newField = {
        id: Date.now(), // Use timestamp for unique ID
        ...payload,
        createdAt: new Date().toISOString().split('T')[0],
      };
      storeFields([...fields, newField]);
      return newField;
    }
    return api.post('/forms/fields', payload);
  },

  updateField: async (id, payload) => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const fields = getStoredFields();
      const idx = fields.findIndex((f) => f.id === Number(id));
      if (idx === -1) throw new Error('Field not found');
      
      fields[idx] = { ...fields[idx], ...payload };
      storeFields(fields);
      return fields[idx];
    }
    return api.put(`/forms/fields/${id}`, payload);
  },

  deleteField: async (id) => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const fields = getStoredFields();
      storeFields(fields.filter((f) => f.id !== Number(id)));
      return { success: true };
    }
    return api.delete(`/forms/fields/${id}`);
  },

  // ==========================================
  // FORMS (Form Builder)
  // ==========================================
  listForms: async () => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return { items: getStoredForms() };
    }
    return api.get('/forms');
  },

  createForm: async (payload) => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const forms = getStoredForms();
      const newForm = {
        id: Date.now(),
        version: 'v1.0',
        status: 'Draft',
        updated: 'Just now',
        ...payload,
      };
      storeForms([...forms, newForm]);
      return newForm;
    }
    return api.post('/forms', payload);
  },
};