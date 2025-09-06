import React, { useState } from 'react';
import styled from 'styled-components';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { TodayDashboard } from './components/TodayDashboard';
import { WaitlistManagement } from './components/WaitlistManagement';
import { useAppStore } from './store/appStore';

const AppContainer = styled.div`
  height: 100vh;
  background: #f5f5f5;
`;

const Navigation = styled.div`
  display: flex;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0;
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
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
`;

const SampleDataButton = styled.button`
  padding: 8px 16px;
  margin-left: auto;
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

type ViewType = 'calendar' | 'today' | 'waitlist';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const { students, initializeSampleData } = useAppStore();

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
      default:
        return <WeeklyCalendar />;
    }
  };

  return (
    <AppContainer>
      <Navigation>
        <NavButton 
          active={currentView === 'calendar'}
          onClick={() => setCurrentView('calendar')}
        >
          📅 Weekly Calendar
        </NavButton>
        <NavButton 
          active={currentView === 'today'}
          onClick={() => setCurrentView('today')}
        >
          📋 Today
        </NavButton>
        <NavButton 
          active={currentView === 'waitlist'}
          onClick={() => setCurrentView('waitlist')}
        >
          ⏰ Waitlist
        </NavButton>
        
        {students.length === 0 && (
          <SampleDataButton onClick={handleLoadSampleData}>
            Load Sample Data
          </SampleDataButton>
        )}
      </Navigation>
      
      {renderCurrentView()}
    </AppContainer>
  );
}

export default App;