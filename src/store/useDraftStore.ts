import { create } from 'zustand';

type DraftState = {
  dirtyDrafts: Record<string, true>;
  setDirty: (draftId: string, isDirty: boolean) => void;
  clearDrafts: () => void;
};

export const useDraftStore = create<DraftState>((set) => ({
  dirtyDrafts: {},
  setDirty: (draftId, isDirty) => set((state) => {
    const dirtyDrafts = { ...state.dirtyDrafts };
    if (isDirty) dirtyDrafts[draftId] = true;
    else delete dirtyDrafts[draftId];
    return { dirtyDrafts };
  }),
  clearDrafts: () => set({ dirtyDrafts: {} }),
}));
