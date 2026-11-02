import { api } from './client';

// 🔧 MOCK MODE — backend ready hone tak true rakhen
const MOCK = true;

const MOCK_USERS = {
  'admin@cmu.com': {
    password: 'admin123',
    token: 'mock-token-admin',
    user: {
      id: 1,
      name: 'Umer Aayaz',
      email: 'admin@cmu.com',
      role: 'System Admin',
      isSuperAdmin: true,
    },
  },
};

export const authApi = {
  login: async (email, password) => {
    if (MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const u = MOCK_USERS[email.toLowerCase()];
      if (!u || u.password !== password) {
        throw new Error('Invalid email or password');
      }
      return { token: u.token, user: u.user };
    }
    return api.post('/auth/login', { email, password });
  },

  me: () => (MOCK ? Promise.resolve(null) : api.get('/auth/me')),
  logout: () => (MOCK ? Promise.resolve() : api.post('/auth/logout')),
};