import { create } from 'zustand';

type SyncState = {
  isOnline: boolean;
  isSyncing: boolean;
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
};

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: true,
  isSyncing: false,
  setOnline: (isOnline) => set({ isOnline }),
  setSyncing: (isSyncing) => set({ isSyncing }),
}));
