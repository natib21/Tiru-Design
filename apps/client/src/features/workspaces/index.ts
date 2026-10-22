import { setWorkspaceProvider } from '@/shared/api';
import { useActiveWorkspaceStore } from './active-workspace';

// Register workspace provider with shared api layer
setWorkspaceProvider({
  getActiveWorkspaceId: () => useActiveWorkspaceStore.getState().activeWorkspaceId,
});

export * from './active-workspace';
