import { Suspense, lazy, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { WeeklyCalendar } from './features/calendar/WeeklyCalendar';
const TodayDashboard = lazy(() => import('./features/dashboard/TodayDashboard').then(m => ({ default: m.TodayDashboard })));
const WaitlistManagement = lazy(() => import('./features/waitlist/WaitlistManagement').then(m => ({ default: m.WaitlistManagement })));
const TrashView = lazy(() => import('./features/system/TrashView').then(m => ({ default: m.TrashView })));
const AvailabilityReport = lazy(() => import('./features/binder/AvailabilityReport').then(m => ({ default: m.AvailabilityReport })));
const StudentBinder = lazy(() => import('./features/binder/StudentBinder').then(m => ({ default: m.StudentBinder })));
import { useAppStore } from './store/appStore';
import { SettingsModal } from './features/settings/SettingsModal';
import { SplashScreen } from './features/system/SplashScreen';
import {
  Calendar,
  ClipboardList,
  Clock,
  BarChart,
  BookOpen,
  Trash2,
  Settings,
  Bell
} from 'lucide-react';
import { ThemeBackground } from './ui/components/ThemeBackground';
// Premium Book UI integration (feature flag)
const PremiumBookUILazy = lazy(() => import('./redesign/premium-book-ui'));

const AppContainer = styled.div`
  height: 100vh;
  background: transparent;
  color: ${({ theme }) => theme.colors.ink900};
  transition: background-color 200ms ease, color 200ms ease;
`;

const Navigation = styled.nav`
  position: sticky;
  top: 12px;
  display: flex;
  margin: 0 16px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: ${({ theme }) => theme.blur.thick} saturate(250%);
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.thick} saturate(250%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: 
    0 32px 64px rgba(0,0,0,0.15),
    ${({ theme }) => theme.shadow.liquidGlass};
  z-index: 1000;
  padding: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: 0 8px 16px;
    border-radius: ${({ theme }) => theme.radius.lg};
    top: 8px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.2) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const RightControls = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 4px;
  flex-shrink: 0;
`;

const NavButton = styled.button<{ $active: boolean }>`
  padding: 10px 24px;
  margin: 2px;
  border: none;
  background: ${props => props.$active
    ? `linear-gradient(180deg, ${props.theme.colors.brand} 0%, ${props.theme.colors.brandHover} 100%)`
    : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : props.theme.colors.ink900};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.lg};
  transition: all 0.4s cubic-bezier(0.1, 0.9, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  letter-spacing: -0.01em;
  
  ${props => props.$active && css`
    box-shadow: 
      ${props.theme.shadow.skeuoRaised},
      0 8px 24px ${props.theme.colors.brand}40,
      inset 0 1px 1px rgba(255,255,255,0.4);
    
    &::after {
      content: '';
      position: absolute;
      top: 1px; left: 1px; right: 1px; height: 40%;
      background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
      border-radius: inherit;
    }
  `}
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.brandHover : 'rgba(0,0,0,0.06)'};
    transform: translateY(${props => props.$active ? '-2px' : '-1px'});
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 10px 16px;
    font-size: 11px;
    flex-shrink: 0;
    gap: 6px;
    span { display: none; }
  }
  
  &:active {
    transform: translateY(1px) scale(0.96);
    ${props => props.$active && css`
      box-shadow: ${props.theme.shadow.skeuoPressed};
      &::after { opacity: 0; }
    `}
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.info}50;
  }
`;

const SampleDataButton = styled.button`
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.colors.ink900};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-1px);
  }
`;

const SettingsButton = styled(SampleDataButton)`
  border-color: ${({ theme }) => theme.colors.ink400};
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 8px;
    span { display: none; }
    svg { margin: 0 !important; }
  }
`;

const NotificationBell = styled.button`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.ink600};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0,0,0,0.05);
    color: ${({ theme }) => theme.colors.brand};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: 10px;
  font-weight: 800;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;

type ViewType = 'calendar' | 'today' | 'waitlist' | 'trash' | 'availability' | 'binder';


function App() {
  const ENABLE_BOOK_UI = (import.meta as any).env?.VITE_ENABLE_BOOK_UI === 'true';
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [showSettings, setShowSettings] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const { students, extraClassRequests, initializeSampleData, hydrateFromDB, initialized } = useAppStore();

  const openRequestsCount = extraClassRequests.filter(r => r.status === 'open').length;
  const [splashExiting, setSplashExiting] = useState(false);

  useEffect(() => {
    void hydrateFromDB();
  }, [hydrateFromDB]);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (!hasSeenSplash) {
      setShowSplash(true);
    }
  }, []);


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

  if (!initialized || (showSplash && !splashExiting)) {
    const ready = initialized;
    const handleContinue = () => {
      setSplashExiting(true);
      setShowSplash(false);
      localStorage.setItem('hasSeenSplash', 'true');
    };
    return <SplashScreen ready={ready} exiting={splashExiting} onContinue={handleContinue} />;
  }

  if (ENABLE_BOOK_UI) {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Suspense fallback={<div style={{ color: '#6b7280', padding: 16 }}>Loading Premium Book UI…</div>}>
          <PremiumBookUILazy />
        </Suspense>
      </div>
    );
  }

  return (
    <AppContainer>
      <ThemeBackground />
      <Navigation>
        <NavButton
          $active={currentView === 'calendar'}
          aria-current={currentView === 'calendar' ? 'page' : undefined}
          onClick={() => setCurrentView('calendar')}
        >
          <Calendar size={18} />
          <span>Weekly Calendar</span>
        </NavButton>
        <NavButton
          $active={currentView === 'today'}
          aria-current={currentView === 'today' ? 'page' : undefined}
          onClick={() => setCurrentView('today')}
        >
          <ClipboardList size={18} />
          <span>Today</span>
        </NavButton>
        <NavButton
          $active={currentView === 'waitlist'}
          aria-current={currentView === 'waitlist' ? 'page' : undefined}
          onClick={() => setCurrentView('waitlist')}
        >
          <Clock size={18} />
          <span>Waitlist</span>
        </NavButton>
        <NavButton
          $active={currentView === 'availability'}
          aria-current={currentView === 'availability' ? 'page' : undefined}
          onClick={() => setCurrentView('availability')}
        >
          <BarChart size={18} />
          <span>Availability</span>
        </NavButton>
        <NavButton
          $active={currentView === 'binder'}
          aria-current={currentView === 'binder' ? 'page' : undefined}
          onClick={() => setCurrentView('binder')}
        >
          <BookOpen size={18} />
          <span>Binder</span>
        </NavButton>
        <NavButton
          $active={currentView === 'trash'}
          aria-current={currentView === 'trash' ? 'page' : undefined}
          onClick={() => setCurrentView('trash')}
        >
          <Trash2 size={18} />
          <span>Trash</span>
        </NavButton>

        <RightControls>
          {openRequestsCount > 0 && (
            <NotificationBell
              onClick={() => setCurrentView('today')}
              title={`${openRequestsCount} pending extra class requests`}
            >
              <Bell size={18} />
              <Badge>{openRequestsCount}</Badge>
            </NotificationBell>
          )}
          <SettingsButton onClick={() => setShowSettings(true)}>
            <Settings size={14} style={{ marginRight: 6 }} />
            <span>Settings</span>
          </SettingsButton>
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