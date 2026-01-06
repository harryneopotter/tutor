import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { useSettingsStore } from '../../store/settingsStore';
import { Modal as UIModal } from '../../ui/components/Modal';
import { Button as UIButton } from '../../ui/components/Button';
import { PaletteName } from '../../ui/theme/presets';
import { useToast } from '../../ui/components/ToastProvider';
import { BackupService } from '../../utils/backupService';
import { Download, Upload, Database, Smartphone } from 'lucide-react';

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const themeName = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const appearance = useSettingsStore((s) => s.appearance);
  const setAppearance = useSettingsStore((s) => s.setAppearance);
  const { showToast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    try {
      await BackupService.exportData();
      showToast('Backup downloaded successfully', 'success');
    } catch (e) {
      showToast('Backup failed', 'error');
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (confirm('Are you sure? This will replace all existing data with the content of the backup file.')) {
      try {
        await BackupService.importData(file);
        showToast('Data restored successfully', 'success');
        onClose();
      } catch (err) {
        showToast('Restore failed: Invalid file format', 'error');
      }
    }
    // Reset input
    e.target.value = '';
  };

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
    <UIModal
      open={open}
      onClose={onClose}
      title="Settings"
      footer={
        <UIButton variant="primary" onClick={onClose}>Done</UIButton>
      }
    >
      <SectionTitle>Theme Color</SectionTitle>
      <Grid>
        {palettes.map((p) => (
          <ThemeCard key={p.name} $active={themeName === p.name} onClick={() => handleSelect(p.name)}>
            <Swatch $variant={p.name} />
            <span>{p.label}</span>
          </ThemeCard>
        ))}
      </Grid>

      <div style={{ height: 24 }} />
      <SectionTitle>Appearance</SectionTitle>
      <Row>
        {(['system', 'light', 'dark'] as const).map(opt => (
          <Choice
            key={opt}
            aria-pressed={appearance === opt}
            $active={appearance === opt}
            onClick={() => setAppearance(opt)}
          >{opt.charAt(0).toUpperCase() + opt.slice(1)}</Choice>
        ))}
      </Row>

      <div style={{ height: 32 }} />
      <SectionTitle>Data Management</SectionTitle>
      <div style={{ display: 'grid', gap: 12 }}>
        <UIButton variant="secondary" onClick={handleBackup} style={{ width: '100%', justifyContent: 'flex-start' }}>
          <Download size={16} style={{ marginRight: 12 }} />
          Backup All Data (.json)
        </UIButton>

        <UIButton variant="secondary" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', justifyContent: 'flex-start' }}>
          <Upload size={16} style={{ marginRight: 12 }} />
          Restore from Backup
        </UIButton>

        <UIButton
          variant="secondary"
          onClick={() => {
            showToast('To add to Home Screen: Tap Share icon in Safari and select "Add to Home Screen"', 'info');
          }}
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          <Smartphone size={16} style={{ marginRight: 12 }} />
          Add to Home Screen
        </UIButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleRestore}
          accept=".json"
          style={{ display: 'none' }}
        />

        <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 4, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Database size={10} />
          Data is stored locally on this device.
        </p>
      </div>
    </UIModal>
  );
}

const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink400};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  background: rgba(0,0,0,0.05);
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.md};
  gap: 4px;
`;

const ThemeCard = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand : 'rgba(0,0,0,0.05)')};
  background: ${({ $active, theme }) => ($active ? theme.colors.surface1 : 'rgba(255,255,255,0.5)')};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  box-shadow: ${({ $active }) => $active ? '0 8px 16px rgba(0,0,0,0.05)' : 'none'};
  
  &:hover { 
    border-color: ${({ theme }) => theme.colors.brand};
    transform: translateY(-2px);
  }
`;

const Swatch = styled.div<{ $variant: PaletteName }>`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: ${({ $variant }) =>
    $variant === 'indigo' ? '#4F46E5' :
      $variant === 'teal' ? '#0D9488' :
        $variant === 'rose' ? '#E11D48' :
          '#D97706'};
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px; left: 2px; right: 2px; height: 12px;
    background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%);
    border-radius: 999px;
  }
`;

const Choice = styled.button<{ $active: boolean }>`
  flex: 1;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.surface1 : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.ink900 : theme.colors.ink600)};
  box-shadow: ${({ $active }) => ($active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none')};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { color: ${({ theme }) => theme.colors.brand}; }
`;

