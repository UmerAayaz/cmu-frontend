import { api } from './client';

const MOCK = true;
const STORAGE_KEY = 'cmu_mock_projects';

const SEED_PROJECTS = [
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
    caseWord: 'Complaint',
    pluralWord: 'Complaints',
    personWord: 'Complainant',
    teamWord: 'Resolution team',
    referencePrefix: 'CMU',
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
    caseWord: 'Dispute',
    pluralWord: 'Disputes',
    personWord: 'Customer',
    teamWord: 'Billing team',
    referencePrefix: 'BILL',
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
    caseWord: 'Request',
    pluralWord: 'Requests',
    personWord: 'Employee',
    teamWord: 'HR team',
    referencePrefix: 'HR',
  },
  {
    id: 4,
    name: 'IT Service Desk',
    code: 'ITSD-2026',
    description: 'IT support requests and incident management',
    department: 'Information Technology',
    status: 'Active',
    theme: 'blue',
    sidebarStyle: 'dark',
    formsCount: 4,
    teamsCount: 2,
    workflowsCount: 2,
    createdAt: '2026-04-12',
    caseWord: 'Ticket',
    pluralWord: 'Tickets',
    personWord: 'Requester',
    teamWord: 'Support team',
    referencePrefix: 'IT',
  },
];

const wait = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const readProjects = () => {
  if (typeof window === 'undefined') return [...SEED_PROJECTS];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROJECTS));
      return [...SEED_PROJECTS];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [...SEED_PROJECTS];
  } catch (error) {
    console.error('Unable to read mock projects:', error);
    return [...SEED_PROJECTS];
  }
};

const saveProjects = (projects) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const MOCK_PROJECTS = readProjects();

const syncProjects = (projects) => {
  MOCK_PROJECTS.splice(0, MOCK_PROJECTS.length, ...projects);
  saveProjects(projects);
};

export const projectsApi = {
  list: async (params = {}) => {
    if (!MOCK) return api.get('/projects', { params });

    await wait();

    let items = [...readProjects()];
    const search = params.search?.trim().toLowerCase();

    if (search) {
      items = items.filter((project) =>
        [
          project.name,
          project.code,
          project.department,
          project.description,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search))
      );
    }

    if (params.status) {
      items = items.filter((project) => project.status === params.status);
    }

    if (params.limit) {
      items = items.slice(0, Number(params.limit));
    }

    return {
      items,
      total: items.length,
    };
  },

  get: async (id) => {
    if (!MOCK) return api.get(`/projects/${id}`);

    await wait(100);
    return readProjects().find((project) => project.id === Number(id)) || null;
  },

  create: async (payload) => {
    if (!MOCK) return api.post('/projects', payload);

    await wait(400);

    const projects = readProjects();

    const duplicate = projects.some(
      (project) =>
        project.code?.toLowerCase() === payload.code?.trim().toLowerCase()
    );

    if (duplicate) {
      throw new Error('A project with this project code already exists.');
    }

    const newProject = {
      ...payload,
      id: Date.now(),
      name: payload.name.trim(),
      code: payload.code.trim().toUpperCase(),
      status: 'Active',
      formsCount: 0,
      teamsCount: payload.teams?.length || 0,
      workflowsCount: payload.template === 'blank' ? 0 : 1,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
    };

    syncProjects([newProject, ...projects]);
    return newProject;
  },

  update: async (id, payload) => {
    if (!MOCK) return api.put(`/projects/${id}`, payload);

    await wait(250);

    const projects = readProjects();
    const index = projects.findIndex(
      (project) => project.id === Number(id)
    );

    if (index === -1) {
      throw new Error('Project not found.');
    }

    const updatedProject = {
      ...projects[index],
      ...payload,
      id: Number(id),
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updatedProject;
    syncProjects(projects);

    return updatedProject;
  },

  remove: async (id) => {
    if (!MOCK) return api.delete(`/projects/${id}`);

    await wait(200);

    const projects = readProjects();
    const remaining = projects.filter(
      (project) => project.id !== Number(id)
    );

    if (remaining.length === projects.length) {
      throw new Error('Project not found.');
    }

    syncProjects(remaining);
    return { success: true, id: Number(id) };
  },

  stats: async () => {
    if (!MOCK) return api.get('/projects/stats');

    await wait(150);

    const projects = readProjects();

    return {
      projects: projects.length,
      forms: projects.reduce(
        (total, project) => total + (project.formsCount || 0),
        0
      ),
      workflows: projects.reduce(
        (total, project) => total + (project.workflowsCount || 0),
        0
      ),
      pendingReview: 2,
    };
  },
};