export const LOCAL_STORAGE_KEY = 'onboard_project_draft';

export const STEPS = [
  { id: 'basics', title: 'Basics' },
  { id: 'template', title: 'Template' },
  { id: 'words', title: 'Words' },
  { id: 'teams', title: 'Teams and people' },
  { id: 'datasources', title: 'Data sources' },
  { id: 'calendar', title: 'Calendar and SLA' },
  { id: 'categories', title: 'Categories' },
  { id: 'review', title: 'Review and go live' },
];

export const MARK_COLORS = [
  '#dc2626', '#0d9488', '#2563eb', '#7c3aed', '#0f172a',
];

export const TEMPLATES = [
  {
    id: 'parallel-review',
    title: 'Complaints with parallel review',
    desc: 'Route to multiple teams, review replies and resolve with a root cause.',
    steps: '4 steps',
  },
  {
    id: 'approval-chain',
    title: 'Approval chain',
    desc: 'Approve step by step. Rules can add or skip approvers.',
    steps: '3 steps',
  },
  {
    id: 'request-fulfil',
    title: 'Request and fulfil',
    desc: 'A team fulfils the request, then the requester confirms.',
    steps: '3 steps',
  },
  {
    id: 'blank',
    title: 'Blank project',
    desc: 'Start with an empty configuration.',
    steps: '0 steps',
  },
];

export const ENGINE_WORDS = [
  { key: 'case', label: 'case', plural: 'cases' },
  { key: 'case_type', label: 'case type', plural: 'case types' },
  { key: 'subject', label: 'subject', plural: 'subjects' },
  { key: 'start_case', label: 'start a case', plural: 'none' },
  { key: 'my_cases', label: 'my cases', plural: 'none' },
  { key: 'case_queue', label: 'case queue', plural: 'none' },
];

export const MOCK_USERS = [
  { id: 1, name: 'Sara Ahmed', email: 'sara.ahmed@example.com', role: 'Administrator' },
  { id: 2, name: 'Ali Khan', email: 'ali.khan@example.com', role: 'Team Lead' },
  { id: 3, name: 'Usman Raza', email: 'usman.raza@example.com', role: 'Officer' },
  { id: 4, name: 'Ayesha Malik', email: 'ayesha.malik@example.com', role: 'Officer' },
  { id: 5, name: 'Hamza Tariq', email: 'hamza.tariq@example.com', role: 'Verifier' },
  { id: 6, name: 'Fatima Noor', email: 'fatima.noor@example.com', role: 'Stakeholder' },
];

export const MOCK_TEAMS = [
  {
    id: 'team-customer-care',
    name: 'Customer Care',
    lead: 'Sara Ahmed',
    members: ['Ali Khan', 'Ayesha Malik'],
  },
  {
    id: 'team-operations',
    name: 'Operations',
    lead: 'Usman Raza',
    members: ['Hamza Tariq'],
  },
  {
    id: 'team-compliance',
    name: 'Compliance',
    lead: 'Fatima Noor',
    members: ['Sara Ahmed'],
  },
];

export const DATA_SOURCES = [
  {
    id: 'core',
    title: 'Core Banking',
    desc: 'REST API · Customer and account information',
    checked: true,
  },
  {
    id: 'card',
    title: 'Card Switch',
    desc: 'REST API · Card and transaction information',
    checked: false,
  },
  {
    id: 'hrms',
    title: 'HRMS',
    desc: 'Employee and department information',
    checked: false,
  },
  {
    id: 'ad',
    title: 'Active Directory',
    desc: 'Users, groups and authentication',
    checked: false,
  },
];

export const MOCK_CALENDARS = [
  {
    id: 'cmu-weekdays',
    name: 'CMU (Monday to Friday)',
    timezone: 'Asia/Karachi',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    id: 'banking',
    name: 'Banking Calendar',
    timezone: 'Asia/Karachi',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    startTime: '09:00',
    endTime: '16:30',
  },
  {
    id: 'all-days',
    name: '24/7 Calendar',
    timezone: 'Asia/Karachi',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    startTime: '00:00',
    endTime: '23:59',
  },
];

export const DEFAULT_CATEGORIES = [
  {
    id: 'cat-branch',
    name: 'Branch',
    subCategories: ['Account', 'Cash Withdrawal'],
  },
  {
    id: 'cat-customer',
    name: 'Customer Support',
    subCategories: ['Internet Banking', 'Mobile Banking'],
  },
  {
    id: 'cat-operations',
    name: 'Operations',
    subCategories: ['Transaction', 'Other'],
  },
];

export const INITIAL_FORM_STATE = {
  name: '',
  code: '',
  description: '',
  department: '',
  owner: 'Sara Ahmed',
  admins: ['Sara Ahmed'],
  markLetter: 'W',
  markColor: '#dc2626',

  template: 'request-fulfil',

  caseWord: 'Request',
  pluralWord: 'Requests',
  personWord: 'Requester',
  referencePrefix: 'REQ',
  teamWord: 'Fulfilment team',

  teams: [],
  dataSources: DATA_SOURCES.map((source) => ({ ...source })),
  calendar: 'cmu-weekdays',
  timezone: 'Asia/Karachi',
  sla: {
    firstResponseHours: 8,
    resolutionHours: 48,
    escalationEnabled: true,
  },

  categories: DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    subCategories: [...category.subCategories],
  })),

  theme: 'red',
  sidebarStyle: 'dark',
  status: 'Active',
};

export const createId = (prefix = 'item') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;