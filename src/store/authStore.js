import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      currentProjectId: null,

      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null, currentProjectId: null }),
      setCurrentProject: (id) => set({ currentProjectId: id }),
    }),
    { name: 'cmu-auth' }
  )
);