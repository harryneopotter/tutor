import { Suspense, lazy, useEffect, useState } from 'react';
import styled from 'styled-components';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import SplashScreen from './components/SplashScreen';
const TodayDashboard = lazy(() => import('./components/TodayDashboard').then(m => ({ default: m.TodayDashboard })));
const WaitlistManagement = lazy(() => import('./components/WaitlistManagement').then(m => ({ default: m.WaitlistManagement })));
const TrashView = lazy(() => import('./components/TrashView').then(m => ({ default: m.TrashView })));
const AvailabilityReport = lazy(() => import('./components/AvailabilityReport').then(m => ({ default: m.AvailabilityReport })));
const StudentBinder = lazy(() => import('./components/StudentBinder').then(m => ({ default: m.StudentBinder })));
import { useAppStore } from './store/appStore';
import { SettingsModal } from './components/SettingsModal';

const AppContainer = styled.div`
  height: 100vh;
  background: ${({ theme }) => theme.colors.surface0};
  transition: background-color 200ms ease;
`;

const Navigation = styled.div`
  display: flex;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0;
`;

const RightControls = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  border: none;
  background: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#374151'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.25);
  }
`;

const SampleDataButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
  }
`;

const SettingsButton = styled(SampleDataButton)`
  border-color: #e2e8f0;
`;

type ViewType = 'calendar' | 'today' | 'waitlist' | 'trash' | 'availability' | 'binder';

const Icon = styled.span`
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [showSettings, setShowSettings] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const { students, initializeSampleData, hydrateFromDB } = useAppStore();

  useEffect(() => {
    void hydrateFromDB();
  }, [hydrateFromDB]);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (!hasSeenSplash) {
      setShowSplash(true);
    }
  }, []);

  const handleSplashFinish = () => {
    localStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  const handleLoadSampleData = () => {
    initializeSampleData();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'calendar':
        return <WeeklyCalendar />;
      case 'today':
        return <TodayDashboard />;
      case 'waitlist':
        return <WaitlistManagement />;
      case 'trash':
        return <TrashView />;
      case 'availability':
        return <AvailabilityReport />;
      case 'binder':
        return <StudentBinder />;
      default:
        return <WeeklyCalendar />;
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <AppContainer>
      <Navigation>
        <NavButton 
          active={currentView === 'calendar'}
          aria-current={currentView === 'calendar' ? 'page' : undefined}
          onClick={() => setCurrentView('calendar')}
        >
          <Icon aria-hidden>📅</Icon>
          <span>Weekly Calendar</span>
        </NavButton>
        <NavButton 
          active={currentView === 'today'}
          aria-current={currentView === 'today' ? 'page' : undefined}
          onClick={() => setCurrentView('today')}
        >
          <Icon aria-hidden>📋</Icon>
          <span>Today</span>
        </NavButton>
        <NavButton 
          active={currentView === 'waitlist'}
          aria-current={currentView === 'waitlist' ? 'page' : undefined}
          onClick={() => setCurrentView('waitlist')}
        >
          <Icon aria-hidden>⏰</Icon>
          <span>Waitlist</span>
        </NavButton>
        <NavButton 
          active={currentView === 'availability'}
          aria-current={currentView === 'availability' ? 'page' : undefined}
          onClick={() => setCurrentView('availability')}
        >
          <Icon aria-hidden>📊</Icon>
          <span>Availability</span>
        </NavButton>
        <NavButton 
          active={currentView === 'binder'}
          aria-current={currentView === 'binder' ? 'page' : undefined}
          onClick={() => setCurrentView('binder')}
        >
          <Icon aria-hidden>📚</Icon>
          <span>Binder</span>
        </NavButton>
        <NavButton 
          active={currentView === 'trash'}
          aria-current={currentView === 'trash' ? 'page' : undefined}
          onClick={() => setCurrentView('trash')}
        >
          <Icon aria-hidden>🗑️</Icon>
          <span>Trash</span>
        </NavButton>

        <RightControls>
          <SettingsButton onClick={() => setShowSettings(true)}>⚙ Settings</SettingsButton>
          {students.length === 0 && (
            <SampleDataButton onClick={handleLoadSampleData}>
              Load Sample Data
            </SampleDataButton>
          )}
        </RightControls>
      </Navigation>
      
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        {renderCurrentView()}
      </Suspense>
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </AppContainer>
  );
}

export default App;