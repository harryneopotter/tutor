import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaletteName } from '../ui/theme/presets';

interface SettingsState {
  theme: PaletteName;
  appearance: 'light' | 'dark' | 'system';
  userName: string;
  setTheme: (t: PaletteName) => void;
  setAppearance: (a: 'light' | 'dark' | 'system') => void;
  setUserName: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'indigo',
      appearance: 'system',
      userName: 'Jane',
      setTheme: (theme) => set({ theme }),
      setAppearance: (appearance) => set({ appearance }),
      setUserName: (userName) => set({ userName }),
    }),
    {
      name: 'tutor-settings',
    },
  ),
);

