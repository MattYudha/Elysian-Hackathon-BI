import { create } from 'zustand';

interface SettingsUiState {
    isFormDirty: boolean;
    setFormDirty: (isDirty: boolean) => void;
}

export const useSettingsUiStore = create<SettingsUiState>((set) => ({
    isFormDirty: false,
    setFormDirty: (isDirty) => set({ isFormDirty: isDirty }),
}));
