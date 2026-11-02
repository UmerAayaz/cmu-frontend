import { api } from './client';

const MOCK = true;

export const MOCK_CATEGORIES = [
  {
    id: 1,
    name: 'Complaint',
    priority: 'High',
    subCategories: [
      { id: 11, name: 'ATM Issue', products: [
        { id: 111, name: 'Card Not Read', priority: 'High' },
        { id: 112, name: 'Cash Jam', priority: 'Critical' },
      ]},
      { id: 12, name: 'Mobile Banking', products: [
        { id: 121, name: 'App Crash', priority: 'High' },
      ]},
    ],
  },
  {
    id: 2,
    name: 'Service Request',
    priority: 'Medium',
    subCategories: [
      { id: 21, name: 'Account Opening', products: [
        { id: 211, name: 'KYC Verification', priority: 'Medium' },
      ]},
    ],
  },
];

export const lookupsApi = {
  categories: async () => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 150));
      return { items: [...MOCK_CATEGORIES] };
    }
    return api.get('/lookups/categories');
  },

  departments: async () => {
    if (MOCK) {
      return {
        items: [
          { id: 1, name: 'Customer Care' },
          { id: 2, name: 'Finance' },
          { id: 3, name: 'Human Resources' },
          { id: 4, name: 'IT Operations' },
        ],
      };
    }
    return api.get('/lookups/departments');
  },

  users: async () => {
    if (MOCK) {
      return {
        items: [
          { id: 1, name: 'Umer Aayaz', email: 'umer@cmu.com', role: 'System Admin' },
          { id: 2, name: 'Sara Ahmed', email: 'sara@cmu.com', role: 'Team Lead' },
          { id: 3, name: 'Ali Khan', email: 'ali@cmu.com', role: 'Case Officer' },
          { id: 4, name: 'Bilal Raza', email: 'bilal@cmu.com', role: 'Case Officer' },
        ],
      };
    }
    return api.get('/lookups/users');
  },
};