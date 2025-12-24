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
  glass0: string;
  glass1: string;
  glassHighlight: string;
  glassBorder: string;
  border: string;
}

const baseLight = {
  surface0: '#F5F5F7', // Apple soft gray
  surface1: '#FFFFFF',
  ink900: '#1D1D1F', // Apple system black
  ink600: '#424245', // Apple dynamic gray
  ink400: '#86868B',
  success: '#34C759', // Apple Green
  warning: '#FF9500', // Apple Orange
  danger: '#FF3B30',  // Apple Red
  info: '#007AFF',    // Apple Blue
  glass0: 'rgba(255, 255, 255, 0.35)',
  glass1: 'rgba(255, 255, 255, 0.55)',
  glassHighlight: 'rgba(255, 255, 255, 0.9)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
  border: 'rgba(0, 0, 0, 0.08)',
} as const;

const baseDark = {
  surface0: '#000000',
  surface1: '#1C1C1E', // Apple Dark surface
  ink900: '#F5F5F7',
  ink600: '#A1A1A6',
  ink400: '#6E6E73',
  success: '#30D158',
  warning: '#FF9F0A',
  danger: '#FF453A',
  info: '#0A84FF',
  glass0: 'rgba(0, 0, 0, 0.5)',
  glass1: 'rgba(28, 28, 30, 0.6)',
  glassHighlight: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.12)',
} as const;

export const palettes: Record<PaletteName, { light: Palette; dark: Palette }> = {
  indigo: {
    light: { ...baseLight, brand: '#5E5CE6', brandHover: '#5856D6' }, // SF Pro Indigo
    dark: { ...baseDark, brand: '#5E5CE6', brandHover: '#5856D6' },
  },
  teal: {
    light: { ...baseLight, brand: '#30B0C7', brandHover: '#2A9AAB' }, // SF Pro Teal
    dark: { ...baseDark, brand: '#40C8E0', brandHover: '#30B0C7' },
  },
  rose: {
    light: { ...baseLight, brand: '#FF2D55', brandHover: '#D81B60' }, // SF Pro Rose
    dark: { ...baseDark, brand: '#FF375F', brandHover: '#FF2D55' },
  },
  amber: {
    light: { ...baseLight, brand: '#FFCC00', brandHover: '#FFB800' }, // SF Pro Yellow
    dark: { ...baseDark, brand: '#FFD60A', brandHover: '#FFCC00' },
  },
};

export const makeTheme = (name: PaletteName, mode: Appearance = 'light'): DefaultTheme => {
  const p = palettes[name][mode];
  return {
    colors: {
      ...p,
    },
    radius: {
      xs: '6px',
      sm: '10px',
      md: '12px',
      lg: '16px',
      xl: '22px', // Apple-style generous radius
      full: '9999px',
    },
    shadow: {
      // Layered shadows for depth
      card: mode === 'dark'
        ? '0 4px 12px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)'
        : '0 4px 12px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)',
      premium: mode === 'dark'
        ? '0 20px 40px rgba(0,0,0,0.6), 0 4px 8px rgba(255,255,255,0.05)'
        : '0 20px 40px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.02)',
      skeuo: mode === 'dark'
        ? 'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.5)'
        : 'inset 0 1px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.1)',
      skeuoRaised: mode === 'dark'
        ? '0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.5) inset, 0 2px 4px rgba(0,0,0,0.8), 0 8px 16px rgba(0,0,0,0.4)'
        : '0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px rgba(0,0,0,0.08)',
      skeuoPressed: mode === 'dark'
        ? 'inset 0 4px 12px rgba(0,0,0,0.8), inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)'
        : 'inset 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 2px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.8)',
      liquidGlass: mode === 'dark'
        ? '0 20px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)'
        : '0 20px 80px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.02)',
    },
    blur: {
      thin: 'blur(20px)',
      regular: 'blur(40px)',
      thick: 'blur(80px)',
    },
    spacing: (n: number) => `${4 * n}px`,
    font: {
      body: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif',
      heading: '"SF Pro Display", "SF Pro Text", -apple-system, "Inter", sans-serif',
      mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    },
    transition: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.1)',
      speed: '250ms',
    }
  } as any;
};

