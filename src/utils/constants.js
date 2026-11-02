export const ROLES = {
  SUPER_ADMIN: 'System Admin',
  UNIT_HEAD:   'Unit Head',
  TEAM_LEAD:   'Team Lead',
  OFFICE:      'Case Officer',
};

export const FORM_STATUS = {
  DRAFT:           'Draft',
  PENDING_REVIEW:  'PendingReview',
  PUBLISHED:       'Published',
  REJECTED:        'Rejected',
  RETIRED:         'Retired',
};

export const STATUS_BADGE = {
  Draft:         'badge--neutral',
  PendingReview: 'badge--warning',
  Published:     'badge--success',
  Rejected:      'badge--danger',
  Retired:       'badge--neutral',
  Active:        'badge--success',
};

export const FIELD_TYPES = [
  { key: 'text',     label: 'Text',      icon: 'Type' },
  { key: 'textarea', label: 'Text Area', icon: 'AlignLeft' },
  { key: 'number',   label: 'Number',    icon: 'Hash' },
  { key: 'date',     label: 'Date',      icon: 'Calendar' },
  { key: 'dropdown', label: 'Dropdown',  icon: 'ChevronDown' },
  { key: 'radio',    label: 'Radio',     icon: 'Circle' },
  { key: 'checkbox', label: 'Checkbox',  icon: 'CheckSquare' },
  { key: 'file',     label: 'File',      icon: 'Paperclip' },
];

export const REGEX_PRESETS = [
  { label: 'CNIC',  pattern: '^\\d{5}-\\d{7}-\\d$', message: 'Format: 12345-1234567-1' },
  { label: 'Email', pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Valid email required' },
  { label: 'Phone', pattern: '^\\+?\\d{10,15}$', message: 'Valid phone required' },
  { label: 'IBAN',  pattern: '^PK\\d{2}[A-Z]{4}\\d{16}$', message: 'Format: PK00XXXX0000000000000000' },
];