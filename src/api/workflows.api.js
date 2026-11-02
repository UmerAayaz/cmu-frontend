import { api } from './client';

const MOCK = true;

const getStoredWorkflows = () => JSON.parse(localStorage.getItem('mock_workflows') || '[]');
const storeWorkflows = (flows) => localStorage.setItem('mock_workflows', JSON.stringify(flows));

export const workflowsApi = {
  list: async () => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return { items: getStoredWorkflows() };
    }
    return api.get('/workflows');
  },

  create: async (payload) => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const workflows = getStoredWorkflows();
      const newFlow = {
        id: Date.now(),
        version: 'v1.0',
        status: 'Draft',
        nodes: 0,
        updated: 'Just now',
        ...payload,
      };
      storeWorkflows([...workflows, newFlow]);
      return newFlow;
    }
    return api.post('/workflows', payload);
  },
};