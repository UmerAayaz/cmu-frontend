import { api } from './client';

const MOCK = true;

export const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'Complaint Management Unit',
    code: 'CMU-2026',
    description: 'Complaint handling, escalation and resolution',
    department: 'Customer Care',
    status: 'Active',
    theme: 'red',
    sidebarStyle: 'dark',
    formsCount: 8,
    teamsCount: 3,
    workflowsCount: 2,
    createdAt: '2026-01-15',
  },
  {
    id: 2,
    name: 'Billing & Payments',
    code: 'BILL-2026',
    description: 'Billing disputes and payment processing',
    department: 'Finance',
    status: 'Active',
    theme: 'purple',
    sidebarStyle: 'dark',
    formsCount: 5,
    teamsCount: 2,
    workflowsCount: 1,
    createdAt: '2026-02-20',
  },
  {
    id: 3,
    name: 'HR Onboarding',
    code: 'HR-2026',
    description: 'Employee onboarding and documentation',
    department: 'Human Resources',
    status: 'Active',
    theme: 'teal',
    sidebarStyle: 'dark',
    formsCount: 3,
    teamsCount: 1,
    workflowsCount: 1,
    createdAt: '2026-03-10',
  },
];

export const projectsApi = {
  list: async (params = {}) => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      let items = [...MOCK_PROJECTS];
      if (params.search) {
        const s = params.search.toLowerCase();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.code.toLowerCase().includes(s)
        );
      }
      if (params.limit) items = items.slice(0, params.limit);
      return { items, total: items.length };
    }
    return api.get('/projects', { params });
  },

  get: (id) =>
    MOCK
      ? Promise.resolve(MOCK_PROJECTS.find((p) => p.id === Number(id)))
      : api.get(`/projects/${id}`),

  create: async (payload) => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const newProject = {
        id: MOCK_PROJECTS.length + 1,
        ...payload,
        status: 'Active',
        formsCount: 0,
        teamsCount: 0,
        workflowsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      MOCK_PROJECTS.push(newProject);
      return newProject;
    }
    return api.post('/projects', payload);
  },

  update: (id, payload) =>
    MOCK ? Promise.resolve({ id, ...payload }) : api.put(`/projects/${id}`, payload),

  stats: async () => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return {
        projects: MOCK_PROJECTS.length,
        forms: MOCK_PROJECTS.reduce((a, p) => a + (p.formsCount || 0), 0),
        workflows: MOCK_PROJECTS.reduce((a, p) => a + (p.workflowsCount || 0), 0),
        pendingReview: 2,
      };
    }
    return api.get('/projects/stats');
  },
};