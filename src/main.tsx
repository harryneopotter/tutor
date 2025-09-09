import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { ThemeProvider } from 'styled-components';
import { GlobalStyle, makeTheme } from './ui/theme';
import { useSettingsStore } from './store/settingsStore';

const Root = () => {
  const themeName = useSettingsStore(state => state.theme);
  const appearance = useSettingsStore(state => state.appearance);
  const [systemDark, setSystemDark] = React.useState<boolean>(() => typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false);

  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener?.('change', handler);
    mq.addListener?.(handler);
    return () => {
      mq.removeEventListener?.('change', handler);
      mq.removeListener?.(handler);
    };
  }, []);

  const resolvedMode = appearance === 'system' ? (systemDark ? 'dark' : 'light') : appearance;
  const theme = makeTheme(themeName, resolvedMode);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);