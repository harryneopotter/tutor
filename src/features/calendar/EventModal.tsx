import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../../store/appStore';
import { ClassEvent } from '../../types';
import { format, parseISO } from 'date-fns';
import { hasConflict, findNextAvailableSlotSameDay } from '../../utils/scheduling';
import { Modal as UIModal } from '../../ui/components/Modal';
import { Button as UIButton } from '../../ui/components/Button';
import { Input as UIInput } from '../../ui/components/Input';
import { useToast } from '../../ui/components/ToastProvider';
import { Save, Trash2, Check, X } from 'lucide-react';

const Row = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.ink400};
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
  font-weight: 600;
  box-shadow: ${({ theme }) => theme.shadow.skeuoRaised};
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.brand}; }
`;

const StatusBadge = styled.div<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  width: fit-content;
  background: ${p => {
    if (p.$status === 'canceled') return 'rgba(255, 69, 58, 0.1)';
    if (p.$status === 'confirmed') return 'rgba(50, 215, 75, 0.1)';
    return 'rgba(255, 159, 10, 0.1)';
  }};
  color: ${p => {
    if (p.$status === 'canceled') return '#FF453A';
    if (p.$status === 'confirmed') return '#32D74B';
    return '#FF9F0A';
  }};
`;

interface EventModalProps {
  event: ClassEvent;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const { students, updateEvent, deleteEvent } = useAppStore();
  const { showToast } = useToast();
  const [title, setTitle] = useState(event.title);
  const [studentId, setStudentId] = useState(event.studentId);

  const start = parseISO(event.start);
  const end = parseISO(event.end);
  const [date, setDate] = useState<string>(format(start, 'yyyy-MM-dd'));
  const [time, setTime] = useState<string>(format(start, 'HH:mm'));
  const [durationMin, setDurationMin] = useState<number>(Math.max(30, Math.round((end.getTime() - start.getTime()) / 60000)));

  const status = event.canceled ? 'canceled' : event.confirmed ? 'confirmed' : 'pending';

  const handleSave = () => {
    try {
      const [h, m] = time.split(':').map(Number);
      const newStart = new Date(date);
      newStart.setHours(h, m, 0, 0);
      const newEnd = new Date(newStart.getTime() + durationMin * 60000);
      const evts = (useAppStore.getState().events).filter(e => e.id !== event.id);

      if (hasConflict(newStart, newEnd, evts)) {
        const suggestion = findNextAvailableSlotSameDay(newStart, durationMin, evts);
        if (suggestion) {
          const ok = window.confirm(`Selected time conflicts. Use next available slot at ${format(suggestion.start, 'h:mm a')}?`);
          if (!ok) return;
          updateEvent(event.id, { title, studentId, start: suggestion.start.toISOString(), end: suggestion.end.toISOString() });
          showToast('Event rescheduled successfully', 'success');
        } else {
          showToast('No available slot today. Please choose another time.', 'error');
          return;
        }
      } else {
        updateEvent(event.id, { title, studentId, start: newStart.toISOString(), end: newEnd.toISOString() });
        showToast('Event details updated', 'success');
      }
      onClose();
    } catch (e) {
      showToast('Failed to save changes', 'error');
    }
  };

  return (
    <UIModal
      open={true}
      title="Event Details"
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', width: '100%', gap: 12 }}>
          <UIButton onClick={() => { deleteEvent(event.id); showToast('Event permanently deleted', 'info'); onClose(); }} aria-label="Delete Event">
            <Trash2 size={16} />
          </UIButton>
          <div style={{ flex: 1 }} />
          <UIButton variant="secondary" onClick={onClose}>Cancel</UIButton>
          <UIButton variant="primary" onClick={handleSave}>
            <Save size={16} style={{ marginRight: 8 }} />
            Save Changes
          </UIButton>
        </div>
      }
    >
      <Row>
        <Label>Title</Label>
        <UIInput value={title} onChange={e => setTitle(e.target.value)} />
      </Row>
      <Row>
        <Label>Student</Label>
        <Select value={studentId} onChange={e => setStudentId(e.target.value)}>
          <option value="">Unassigned</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>
      </Row>
      <Row>
        <Label>Date</Label>
        <UIInput type="date" value={date} onChange={e => setDate(e.target.value)} />
      </Row>
      <Row>
        <Label>Time</Label>
        <UIInput type="time" value={time} onChange={e => setTime(e.target.value)} />
      </Row>
      <Row>
        <Label>Duration</Label>
        <Select value={durationMin} onChange={e => setDurationMin(parseInt(e.target.value))}>
          <option value={30}>30 min</option>
          <option value={60}>60 min</option>
          <option value={90}>90 min</option>
          <option value={120}>120 min</option>
        </Select>
      </Row>
      <Row>
        <Label>Status</Label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <StatusBadge $status={status}>{status}</StatusBadge>
          {!event.confirmed && !event.canceled && (
            <UIButton size="sm" variant="secondary" onClick={() => { updateEvent(event.id, { confirmed: true, canceled: false }); showToast('Event confirmed', 'success'); onClose(); }}>
              <Check size={14} style={{ marginRight: 6 }} />
              Confirm
            </UIButton>
          )}
          {!event.canceled && (
            <UIButton size="sm" variant="secondary" onClick={() => { updateEvent(event.id, { canceled: true, confirmed: false }); showToast('Event canceled', 'info'); onClose(); }}>
              <X size={14} style={{ marginRight: 6 }} />
              Cancel
            </UIButton>
          )}
        </div>
      </Row>
    </UIModal>
  );
};
