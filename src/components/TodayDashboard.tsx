import React from 'react';
import styled from 'styled-components';
import { format, isToday, parseISO } from 'date-fns';
import { useAppStore } from '../store/appStore';
import { ClassEvent, ExtraClassRequest } from '../types';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e1e5e9;
  background: #ffffff;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const DateSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClassList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ClassItem = styled.div<{ status: 'confirmed' | 'pending' | 'canceled' }>`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: ${props => {
    switch (props.status) {
      case 'confirmed': return '#f0fdf4';
      case 'pending': return '#fefce8';
      case 'canceled': return '#fef2f2';
      default: return '#ffffff';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'canceled': return '#ef4444';
      default: return '#e5e7eb';
    }
  }};
`;

const ClassInfo = styled.div`
  flex: 1;
`;

const ClassTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const ClassDetails = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const ClassActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ variant: 'confirm' | 'cancel' | 'schedule' | 'snooze' | 'dismiss' }>`
  padding: 6px 12px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'confirm':
        return `
          background: #10b981;
          border-color: #10b981;
          color: white;
          &:hover { background: #059669; }
        `;
      case 'cancel':
        return `
          background: #ef4444;
          border-color: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
        `;
      case 'schedule':
        return `
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
          &:hover { background: #2563eb; }
        `;
      case 'snooze':
        return `
          background: #ffffff;
          border-color: #d1d5db;
          color: #374151;
          &:hover { background: #f9fafb; }
        `;
      case 'dismiss':
        return `
          background: #ffffff;
          border-color: #d1d5db;
          color: #374151;
          &:hover { background: #f9fafb; }
        `;
      default:
        return `
          background: #ffffff;
          border-color: #d1d5db;
          color: #374151;
        `;
    }
  }}
`;

const StatusBadge = styled.span<{ status: 'confirmed' | 'pending' | 'canceled' }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  ${props => {
    switch (props.status) {
      case 'confirmed':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'pending':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'canceled':
        return `
          background: #fecaca;
          color: #991b1b;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

const ExtraRequestItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
`;

const BellIcon = styled.span`
  color: #f59e0b;
  font-size: 18px;
`;

export const TodayDashboard: React.FC = () => {
  const { 
    events, 
    students, 
    extraClassRequests, 
    updateEvent,
    updateExtraClassRequest
  } = useAppStore();

  // Get today's classes sorted by time
  const todaysClasses = events
    .filter(event => {
      if (event.deletedAt) return false;
      return isToday(parseISO(event.start));
    })
    .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

  // Get pending extra class requests
  const pendingExtras = extraClassRequests.filter(
    request => request.status === 'open' || request.status === 'snoozed'
  );

  const getClassStatus = (event: ClassEvent): 'confirmed' | 'pending' | 'canceled' => {
    if (event.canceled) return 'canceled';
    if (event.confirmed) return 'confirmed';
    return 'pending';
  };

  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const handleConfirmClass = (eventId: string) => {
    updateEvent(eventId, { confirmed: true, canceled: false });
  };

  const handleCancelClass = (eventId: string) => {
    updateEvent(eventId, { canceled: true, confirmed: false });
  };

  const handleScheduleExtra = (requestId: string) => {
    // For now, just mark as scheduled - later we'll open the calendar modal
    const request = extraClassRequests.find(r => r.id === requestId);
    if (request) {
      // This would normally open a scheduling modal
      alert(`Scheduling extra class for ${getStudentName(request.studentId)}`);
    }
  };

  const handleSnoozeExtra = (requestId: string) => {
    // Snooze for 24 hours
    const snoozeUntil = new Date();
    snoozeUntil.setHours(snoozeUntil.getHours() + 24);
    
    updateExtraClassRequest(requestId, {
      status: 'snoozed',
      snoozeUntil: snoozeUntil.toISOString()
    });
  };

  const handleDismissExtra = (requestId: string) => {
    updateExtraClassRequest(requestId, {
      status: 'dismissed'
    });
  };

  return (
    <DashboardContainer>
      <Header>
        <div>
          <Title>Today's Schedule</Title>
          <DateSubtitle>{format(new Date(), 'EEEE, MMMM d, yyyy')}</DateSubtitle>
        </div>
      </Header>

      <Content>
        {/* Today's Classes */}
        <Section>
          <SectionTitle>Classes Today</SectionTitle>
          {todaysClasses.length === 0 ? (
            <EmptyState>No classes scheduled for today</EmptyState>
          ) : (
            <ClassList>
              {todaysClasses.map(event => {
                const status = getClassStatus(event);
                const startTime = format(parseISO(event.start), 'h:mm a');
                const endTime = format(parseISO(event.end), 'h:mm a');
                
                return (
                  <ClassItem key={event.id} status={status}>
                    <ClassInfo>
                      <ClassTitle>
                        {event.title}
                        <StatusBadge status={status} style={{ marginLeft: 8 }}>
                          {status}
                        </StatusBadge>
                      </ClassTitle>
                      <ClassDetails>
                        {getStudentName(event.studentId)} • {startTime} - {endTime}
                      </ClassDetails>
                    </ClassInfo>
                    
                    <ClassActions>
                      {status === 'pending' && (
                        <>
                          <ActionButton 
                            variant="confirm"
                            onClick={() => handleConfirmClass(event.id)}
                          >
                            ✅ Confirm
                          </ActionButton>
                          <ActionButton 
                            variant="cancel"
                            onClick={() => handleCancelClass(event.id)}
                          >
                            ❌ Cancel
                          </ActionButton>
                        </>
                      )}
                      {status === 'confirmed' && (
                        <ActionButton 
                          variant="cancel"
                          onClick={() => handleCancelClass(event.id)}
                        >
                          ❌ Cancel
                        </ActionButton>
                      )}
                    </ClassActions>
                  </ClassItem>
                );
              })}
            </ClassList>
          )}
        </Section>

        {/* Pending Extra Classes */}
        <Section>
          <SectionTitle>
            <BellIcon>🔔</BellIcon>
            Pending Extras ({pendingExtras.length})
          </SectionTitle>
          {pendingExtras.length === 0 ? (
            <EmptyState>No pending extra class requests</EmptyState>
          ) : (
            <ClassList>
              {pendingExtras.map(request => (
                <ExtraRequestItem key={request.id}>
                  <ClassInfo>
                    <ClassTitle>
                      Extra Class Request
                    </ClassTitle>
                    <ClassDetails>
                      {getStudentName(request.studentId)} • {request.durationMin} minutes
                      {request.notes && ` • ${request.notes}`}
                    </ClassDetails>
                  </ClassInfo>
                  
                  <ClassActions>
                    <ActionButton 
                      variant="schedule"
                      onClick={() => handleScheduleExtra(request.id)}
                    >
                      📅 Schedule
                    </ActionButton>
                    <ActionButton 
                      variant="snooze"
                      onClick={() => handleSnoozeExtra(request.id)}
                    >
                      😴 Snooze
                    </ActionButton>
                    <ActionButton 
                      variant="dismiss"
                      onClick={() => handleDismissExtra(request.id)}
                    >
                      ✕ Dismiss
                    </ActionButton>
                  </ClassActions>
                </ExtraRequestItem>
              ))}
            </ClassList>
          )}
        </Section>
      </Content>
    </DashboardContainer>
  );
};