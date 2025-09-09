import { DefaultTheme } from 'styled-components';

export type PaletteName = 'indigo' | 'teal' | 'rose' | 'amber';
export type Appearance = 'light' | 'dark';

export interface Palette {
  surface0: string; // page background
  surface1: string; // cards / modals
  ink900: string;
  ink600: string;
  ink400: string;
  brand: string;
  brandHover: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

const baseLight = {
  surface0: '#F8FAFC',
  surface1: '#FFFFFF',
  ink900: '#0F172A',
  ink600: '#475569',
  ink400: '#94A3B8',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0EA5E9',
} as const;

const baseDark = {
  surface0: '#0F172A',
  surface1: '#1F2937',
  ink900: '#E2E8F0',
  ink600: '#CBD5E1',
  ink400: '#94A3B8',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0EA5E9',
} as const;

export const palettes: Record<PaletteName, { light: Palette; dark: Palette }> = {
  indigo: {
    light: { ...baseLight, brand: '#4F46E5', brandHover: '#4338CA' },
    dark: { ...baseDark, brand: '#6366F1', brandHover: '#4F46E5' },
  },
  teal: {
    light: { ...baseLight, brand: '#0D9488', brandHover: '#0F766E' },
    dark: { ...baseDark, brand: '#14B8A6', brandHover: '#0D9488' },
  },
  rose: {
    light: { ...baseLight, brand: '#E11D48', brandHover: '#BE123C' },
    dark: { ...baseDark, brand: '#FB7185', brandHover: '#F43F5E' },
  },
  amber: {
    light: { ...baseLight, brand: '#D97706', brandHover: '#B45309' },
    dark: { ...baseDark, brand: '#F59E0B', brandHover: '#D97706' },
  },
};

export const makeTheme = (name: PaletteName, mode: Appearance = 'light'): DefaultTheme => {
  const p = palettes[name][mode];
  return {
    colors: {
      ...p,
    },
    radius: {
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    shadow: {
      card: mode === 'dark'
        ? '0 1px 1px rgba(0,0,0,0.40),0 10px 20px rgba(0,0,0,0.50)'
        : '0 1px 1px rgba(16,24,40,0.04),0 10px 20px rgba(16,24,40,0.06)',
    },
    spacing: (n: number) => `${4 * n}px`,
    font: {
      body: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    },
  } as const;
};

