import React, { useState } from 'react';
import styled from 'styled-components';
import { format, isToday, parseISO } from 'date-fns';
import { useAppStore } from '../store/appStore';
import { ClassEvent, ExtraClassRequest } from '../types';
import { hasConflict, findNextAvailableSlotSameDay } from '../utils/scheduling';

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

const AddButton = styled.button`
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover { background: #2563eb; }
`;

const Modal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 420px;
  width: 90%;
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
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
  border-radius: 4px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 60px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
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
    updateExtraClassRequest,
    addExtraClassRequest,
    addEvent
  } = useAppStore();

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
          <Title>Today's Schedule</Title>
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

      {scheduleModal.open && (
        <Modal role="dialog" aria-modal="true" aria-labelledby="schedule-extra-title" onClick={() => setScheduleModal({ open: false })}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle id="schedule-extra-title">Schedule Extra Class</ModalTitle>
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
              <Input type="date" value={scheduleModal.date || ''} onChange={(e) => setScheduleModal({ ...scheduleModal, date: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Time</Label>
              <Input type="time" value={scheduleModal.time || ''} onChange={(e) => setScheduleModal({ ...scheduleModal, time: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Duration (minutes)</Label>
              <Input type="number" min={30} step={30} value={scheduleModal.durationMin || 60} onChange={(e) => setScheduleModal({ ...scheduleModal, durationMin: parseInt(e.target.value) || 60 })} />
            </FormGroup>
            <ButtonRow>
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
                    // conflict check
                    if (hasConflict(start, end, evts)) {
                      const suggestion = findNextAvailableSlotSameDay(start, durationMin, evts);
                      if (suggestion) {
                        const ok = window.confirm(`Selected time conflicts. Use next available slot at ${format(suggestion.start, 'h:mm a')}?`);
                        if (!ok) return;
                        const title = `Extra Class - ${getStudentName(studentId)}`;
                        addEvent({ studentId, title, start: suggestion.start.toISOString(), end: suggestion.end.toISOString(), confirmed: false, canceled: false });
                        updateExtraClassRequest(requestId, { status: 'scheduled' });
                        setScheduleModal({ open: false });
                        return;
                      } else {
                        alert('No available slot today.');
                        return;
                      }
                    }

                    const title = `Extra Class - ${getStudentName(studentId)}`;
                    addEvent({ studentId, title, start: start.toISOString(), end: end.toISOString(), confirmed: false, canceled: false });
                    updateExtraClassRequest(requestId, { status: 'scheduled' });
                    setScheduleModal({ open: false });
                  } catch (e) {
                    console.error(e);
                    setScheduleModal({ open: false });
                  }
                }}
              >Save</ActionButton>
            </ButtonRow>
          </ModalContent>
        </Modal>
      )}

      {showAddModal && (
        <Modal role="dialog" aria-modal="true" aria-labelledby="add-extra-title" onClick={() => setShowAddModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle id="add-extra-title">Add Extra Class Request</ModalTitle>
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
              <Input
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
              <TextArea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any specific details..."
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
                    <Input type="time" value={w.start} onChange={e => { const nw = [...form.windows]; nw[i] = { ...nw[i], start: e.target.value }; setForm({ ...form, windows: nw }); }} />
                    <Input type="time" value={w.end} onChange={e => { const nw = [...form.windows]; nw[i] = { ...nw[i], end: e.target.value }; setForm({ ...form, windows: nw }); }} />
                    <ActionButton variant="dismiss" onClick={() => { const nw = [...form.windows]; nw.splice(i,1); setForm({ ...form, windows: nw }); }}>Remove</ActionButton>
                  </WindowRow>
                ))}
                <ActionButton variant="schedule" onClick={() => setForm({ ...form, windows: [...(form.windows||[]), { dow: 1, start: '09:00', end: '10:00' }] })}>+ Add window</ActionButton>
              </div>
            </FormGroup>
            <ButtonRow>
              <ActionButton variant="dismiss" onClick={() => setShowAddModal(false)}>Cancel</ActionButton>
              <ActionButton
                variant="schedule"
                onClick={() => {
                  if (form.studentId) {
                    addExtraClassRequest({ studentId: form.studentId, durationMin: form.durationMin, notes: form.notes, status: 'open' });
                    setShowAddModal(false);
                    setForm({ studentId: '', durationMin: 60, notes: '' });
                  }
                }}
              >Save</ActionButton>
            </ButtonRow>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
};
