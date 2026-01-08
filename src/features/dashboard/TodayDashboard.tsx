import React, { useState } from 'react';
import styled from 'styled-components';
import { format, isToday, parseISO } from 'date-fns';
import { useAppStore } from '../../store/appStore';
import { ClassEvent } from '../../types';
import { hasConflict, findNextAvailableSlotSameDay } from '../../utils/scheduling';
import { StatusPill } from '../../ui/components/StatusPill';
import { Input as UIInput } from '../../ui/components/Input';
import { TextArea as UITextArea } from '../../ui/components/TextArea';
import { Modal as UIModal } from '../../ui/components/Modal';
import { Card as UICard } from '../../ui/components/Card';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface0};
  color: ${({ theme }) => theme.colors.ink900};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: ${({ theme }) => theme.colors.glass1};
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.glassBorder};
  z-index: 10;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px; left: 0; right: 0; height: 8px;
    background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 100%);
    pointer-events: none;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink900};
  margin: 0;
`;

const AddButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.brand} 0%, ${({ theme }) => theme.colors.brandHover} 100%);
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadow.skeuoRaised}, 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 1px; left: 1px; right: 1px; height: 45%;
    background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%);
    border-radius: inherit;
    pointer-events: none;
  }
  
  &:hover { 
    filter: brightness(1.05);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15), ${({ theme }) => theme.shadow.skeuoRaised};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: ${({ theme }) => theme.shadow.skeuoPressed};
    background: ${({ theme }) => theme.colors.brandHover};
    &::after { opacity: 0; }
  }
`;


const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
`;



const WindowRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 8px;
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
  gap: 16px;
`;

const ClassItem = styled(UICard).attrs({ glass: true }) <{ status: 'confirmed' | 'pending' | 'canceled' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 2px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 6px;
    background: ${props => {
    switch (props.status) {
      case 'confirmed': return props.theme.colors.success;
      case 'pending': return props.theme.colors.warning;
      case 'canceled': return props.theme.colors.danger;
      default: return props.theme.colors.border;
    }
  }};
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  }
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
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ theme }) => theme.shadow.skeuoRaised};

  &::after {
    content: '';
    position: absolute;
    top: 1px; left: 1px; right: 1px; height: 45%;
    background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
    border-radius: inherit;
    pointer-events: none;
  }
  
  ${props => {
    switch (props.variant) {
      case 'confirm':
        return `
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          color: white;
          &:hover { filter: brightness(1.05); }
        `;
      case 'cancel':
        return `
          background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
          color: white;
          &:hover { filter: brightness(1.05); }
        `;
      case 'schedule':
        return `
          background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          &:hover { filter: brightness(1.05); }
        `;
      default:
        return `
          background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%);
          color: #374151;
          border: 1px solid rgba(0,0,0,0.1);
          &::after { background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%); }
          &:hover { background: #ffffff; }
        `;
    }
  }}

  &:active {
    transform: translateY(1px);
    box-shadow: ${({ theme }) => theme.shadow.skeuoPressed};
    &::after { opacity: 0; }
  }
`;


const ExtraRequestItem = styled(UICard).attrs({ glass: true })`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 2px;
  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 6px;
    background: ${({ theme }) => theme.colors.info};
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  }
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

import { useSettingsStore } from '../../store/settingsStore';

export const TodayDashboard: React.FC = () => {
  const {
    events,
    students,
    extraClassRequests,
    updateEvent,
    updateExtraClassRequest,
    addExtraClassRequest,
    scheduleExtra
  } = useAppStore();

  const userName = useSettingsStore(s => s.userName);

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ studentId: '', durationMin: 60, notes: '', windows: [] as { dow: number; start: string; end: string }[] });

  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; requestId?: string; studentId?: string; durationMin?: number; date?: string; time?: string }>(() => ({ open: false }));

  // Get today's classes sorted by time
  const todaysClasses = events
    .filter(event => {
      if (event.deletedAt) return false;
      return isToday(parseISO(event.start));
    })
    .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

  // Get pending extra class requests
  const now = new Date();
  const pendingExtras = extraClassRequests.filter(request => {
    if (request.status === 'open') return true;
    if (request.status === 'snoozed' && request.snoozeUntil) {
      try {
        return new Date(request.snoozeUntil) <= now;
      } catch {
        return false;
      }
    }
    return false;
  });

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
    const request = extraClassRequests.find(r => r.id === requestId);
    if (request) {
      // Open scheduling modal with defaults
      setScheduleModal({
        open: true,
        requestId,
        studentId: request.studentId,
        durationMin: request.durationMin,
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00'
      });
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
          <Title>Welcome back, {userName}!</Title>
          <DateSubtitle>{format(new Date(), 'EEEE, MMMM d, yyyy')}</DateSubtitle>
        </div>
        <AddButton onClick={() => setShowAddModal(true)}>+ Add Extra Request</AddButton>
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
                        <StatusPill status={status} style={{ marginLeft: 8 }} />
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

      <UIModal
        open={scheduleModal.open}
        title="Schedule Extra Class"
        onClose={() => setScheduleModal({ open: false })}
        footer={
          <>
            <ActionButton variant="dismiss" onClick={() => setScheduleModal({ open: false })}>Cancel</ActionButton>
            <ActionButton
              variant="schedule"
              onClick={() => {
                try {
                  const { requestId, studentId, durationMin, date, time } = scheduleModal;
                  if (!requestId || !studentId || !date || !time || !durationMin) return;
                  const [h, m] = time.split(':').map(Number);
                  const start = new Date(date);
                  start.setHours(h, m, 0, 0);
                  const end = new Date(start.getTime() + durationMin * 60000);

                  const evts = useAppStore.getState().events;
                  if (hasConflict(start, end, evts)) {
                    const suggestion = findNextAvailableSlotSameDay(start, durationMin, evts);
                    if (suggestion) {
                      const ok = window.confirm(`Selected time conflicts. Use next available slot at ${format(suggestion.start, 'h:mm a')}?`);
                      if (!ok) return;
                      const title = `Extra Class - ${getStudentName(studentId)}`;
                      scheduleExtra(requestId, { studentId, title, start: suggestion.start.toISOString(), end: suggestion.end.toISOString() });
                      setScheduleModal({ open: false });
                      return;
                    } else {
                      alert('No available slot today.');
                      return;
                    }
                  }

                  const title = `Extra Class - ${getStudentName(studentId)}`;
                  scheduleExtra(requestId, { studentId, title, start: start.toISOString(), end: end.toISOString() });
                  setScheduleModal({ open: false });
                } catch (e) {
                  console.error(e);
                  setScheduleModal({ open: false });
                }
              }}
            >Save</ActionButton>
          </>
        }
      >
        <FormGroup>
          <Label>Student</Label>
          <Select disabled value={scheduleModal.studentId}>
            <option>
              {getStudentName(scheduleModal.studentId || '')}
            </option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Date</Label>
          <UIInput type="date" value={scheduleModal.date || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleModal({ ...scheduleModal, date: e.target.value })} />
        </FormGroup>
        <FormGroup>
          <Label>Time</Label>
          <UIInput type="time" value={scheduleModal.time || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleModal({ ...scheduleModal, time: e.target.value })} />
        </FormGroup>
        <FormGroup>
          <Label>Duration (minutes)</Label>
          <UIInput type="number" min={30} step={30} value={scheduleModal.durationMin || 60} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleModal({ ...scheduleModal, durationMin: parseInt(e.target.value) || 60 })} />
        </FormGroup>
      </UIModal>

      <UIModal
        open={showAddModal}
        title="Add Extra Class Request"
        onClose={() => setShowAddModal(false)}
        footer={
          <>
            <ActionButton variant="dismiss" onClick={() => setShowAddModal(false)}>Cancel</ActionButton>
            <ActionButton
              variant="schedule"
              onClick={() => {
                if (form.studentId) {
                  addExtraClassRequest({ studentId: form.studentId, durationMin: form.durationMin, notes: form.notes, status: 'open', windows: form.windows });
                  setShowAddModal(false);
                  setForm({ studentId: '', durationMin: 60, notes: '', windows: [] });
                }
              }}
            >Save</ActionButton>
          </>
        }
      >
        <FormGroup>
          <Label>Student</Label>
          <Select
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          >
            <option value="">Select a student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Duration (minutes)</Label>
          <UIInput
            type="number"
            min={30}
            max={180}
            step={30}
            value={form.durationMin}
            onChange={(e) => setForm({ ...form, durationMin: parseInt(e.target.value) || 60 })}
          />
        </FormGroup>
        <FormGroup>
          <Label>Notes (optional)</Label>
          <UITextArea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Any specific details..."
            rows={3}
          />
        </FormGroup>
        <FormGroup>
          <Label>Preferred windows (optional)</Label>
          <div style={{ display: 'grid', gap: 8 }}>
            {(form.windows || []).map((w, i) => (
              <WindowRow key={i}>
                <Select value={w.dow} onChange={e => {
                  const v = parseInt(e.target.value);
                  const nw = [...form.windows]; nw[i] = { ...nw[i], dow: v }; setForm({ ...form, windows: nw });
                }}>
                  <option value={1}>Mon</option>
                  <option value={2}>Tue</option>
                  <option value={3}>Wed</option>
                  <option value={4}>Thu</option>
                  <option value={5}>Fri</option>
                  <option value={6}>Sat</option>
                  <option value={0}>Sun</option>
                </Select>
                <UIInput type="time" value={w.start} onChange={e => { const nw = [...form.windows]; nw[i] = { ...nw[i], start: e.target.value }; setForm({ ...form, windows: nw }); }} />
                <UIInput type="time" value={w.end} onChange={e => { const nw = [...form.windows]; nw[i] = { ...nw[i], end: e.target.value }; setForm({ ...form, windows: nw }); }} />
                <ActionButton variant="dismiss" onClick={() => { const nw = [...form.windows]; nw.splice(i, 1); setForm({ ...form, windows: nw }); }}>Remove</ActionButton>
              </WindowRow>
            ))}
            <ActionButton variant="schedule" onClick={() => setForm({ ...form, windows: [...(form.windows || []), { dow: 1, start: '09:00', end: '10:00' }] })}>+ Add window</ActionButton>
          </div>
        </FormGroup>
      </UIModal>
    </DashboardContainer>
  );
};
