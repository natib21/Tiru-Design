import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActiveWorkspaceState {
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;
  clearActiveWorkspace: () => void;
}

export const useActiveWorkspaceStore = create<ActiveWorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      setActiveWorkspaceId: (activeWorkspaceId) => set({ activeWorkspaceId }),
      clearActiveWorkspace: () => set({ activeWorkspaceId: null }),
    }),
    {
      name: 'tirudesign-active-workspace',
    },
  ),
);
