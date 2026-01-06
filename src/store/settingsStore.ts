import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaletteName } from '../ui/theme/presets';

interface SettingsState {
  theme: PaletteName;
  appearance: 'light' | 'dark' | 'system';
  setTheme: (t: PaletteName) => void;
  setAppearance: (a: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'indigo',
      appearance: 'system',
      setTheme: (theme) => set({ theme }),
      setAppearance: (appearance) => set({ appearance }),
    }),
    {
      name: 'tutor-settings',
    },
  ),
);

