import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, makeTheme } from '../../ui/theme';
import { ToastProvider } from '../../ui/components/ToastProvider';
import { TrashView } from '../../features/system/TrashView';
import { useSettingsStore } from '../../store/settingsStore';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

function renderWithTheme(ui: React.ReactElement) {
  const state = useSettingsStore.getState();
  const theme = makeTheme(state.theme, state.appearance === 'system' ? 'light' : state.appearance);
  return render(<ThemeProvider theme={theme}><ToastProvider><GlobalStyle />{ui}</ToastProvider></ThemeProvider>);
}

describe('a11y: TrashView', () => {
  it('has no detectable accessibility violations on initial render', async () => {
    const { container } = renderWithTheme(<TrashView />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

