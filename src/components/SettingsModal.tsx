import styled from 'styled-components';
import { useSettingsStore } from '../store/settingsStore';
import { PaletteName } from '../ui/theme/presets';

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const themeName = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const appearance = useSettingsStore((s) => s.appearance);
  const setAppearance = useSettingsStore((s) => s.setAppearance);

  if (!open) return null;

  const palettes: { name: PaletteName; label: string }[] = [
    { name: 'indigo', label: 'Indigo' },
    { name: 'teal', label: 'Teal' },
    { name: 'rose', label: 'Rose' },
    { name: 'amber', label: 'Amber' },
  ];

  const handleSelect = (name: PaletteName) => {
    setTheme(name);
    onClose();
  };

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="Settings">
      <Dialog>
        <Header>
          <Title>Settings</Title>
          <CloseBtn onClick={onClose}>Close</CloseBtn>
        </Header>
        <Body>
          <SectionTitle>Theme</SectionTitle>
          <Grid>
            {palettes.map((p) => (
              <ThemeCard key={p.name} $active={themeName === p.name} onClick={() => handleSelect(p.name)}>
                <Swatch $variant={p.name} />
                <span>{p.label}</span>
              </ThemeCard>
            ))}
          </Grid>

          <div style={{ height: 16 }} />
          <SectionTitle>Appearance</SectionTitle>
          <Row>
            {(['system','light','dark'] as const).map(opt => (
              <Choice
                key={opt}
                aria-pressed={appearance === opt}
                $active={appearance === opt}
                onClick={() => setAppearance(opt)}
              >{opt.charAt(0).toUpperCase() + opt.slice(1)}</Choice>
            ))}
          </Row>
        </Body>
        <Footer>
          <FooterBtn onClick={onClose}>Done</FooterBtn>
        </Footer>
      </Dialog>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.4);
  display: grid;
  place-items: center;
  z-index: 50;
`;

const Dialog = styled.div`
  width: 560px;
  max-width: calc(100vw - 32px);
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.card};
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const CloseBtn = styled.button`
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 6px 10px;
  cursor: pointer;
  &:hover { background: #f8fafc; }
`;

const Body = styled.div`
  padding: 16px;
`;

const SectionTitle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ink600};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
`;

const ThemeCard = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${p => (p.$active ? p.theme.colors.brand : '#e2e8f0')};
  background: white;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 12px;
  cursor: pointer;
  text-align: left;
  &:hover { border-color: ${({ theme }) => theme.colors.brand}; }
`;

const Swatch = styled.div<{ $variant: PaletteName }>`
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: ${({ $variant }) =>
    $variant === 'indigo' ? '#4F46E5' :
    $variant === 'teal' ? '#0D9488' :
    $variant === 'rose' ? '#E11D48' :
    '#D97706'};
  box-shadow: inset 0 0 0 3px rgba(255,255,255,0.6);
`;

const Footer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
`;

const Choice = styled.button<{ $active: boolean }>`
  border: 1px solid ${p => (p.$active ? p.theme.colors.brand : '#e2e8f0')};
  background: ${p => (p.$active ? p.theme.colors.surface1 : 'white')};
  color: inherit;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 6px 10px;
  cursor: pointer;
  &:hover { border-color: ${({ theme }) => theme.colors.brand}; }
`;

const FooterBtn = styled.button`
  background: ${({ theme }) => theme.colors.brand};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 8px 12px;
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors.brandHover}; }
`;

