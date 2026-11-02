import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProjectStore = create(
  persist(
    (set) => ({
      activeProject: null,
      setActiveProject: (p) => set({ activeProject: p }),
      clear: () => set({ activeProject: null }),
    }),
    { name: 'cmu-project' }
  )
);