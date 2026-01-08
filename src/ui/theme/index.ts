import { createGlobalStyle } from 'styled-components';
import { makeTheme, PaletteName, Appearance } from './presets';

export const GlobalStyle = createGlobalStyle`
  :root {
    font-family: ${({ theme }) => theme.font.body};
    color: ${({ theme }) => theme.colors.ink900};
    background: transparent;
    line-height: 1.4;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    background: transparent;
    transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
  }
  @media (prefers-reduced-motion: reduce) {
    body { transition: none; }
  }
`;

export { makeTheme };
export type { PaletteName, Appearance };

