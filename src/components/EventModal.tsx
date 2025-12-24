import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/appStore';
import { ClassEvent } from '../types';
import { format, parseISO } from 'date-fns';
import { hasConflict, findNextAvailableSlotSameDay } from '../utils/scheduling';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
  width: 90%;
  max-width: 520px;
  box-shadow: ${({ theme }) => theme.shadow.card};
  border: 1px solid ${({ theme }) => theme.colors.ink400};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px;
  margin-bottom: 12px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink900};
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.ink400};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.colors.ink400};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 12px;
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  ${p => p.variant === 'primary'
    ? `background:${p.theme.colors.brand};border-color:${p.theme.colors.brand};color:#fff;`
    : p.variant === 'danger'
      ? `background:${p.theme.colors.danger};border-color:${p.theme.colors.danger};color:#fff;`
      : `background:${p.theme.colors.surface1};border-color:${p.theme.colors.ink400};color:${p.theme.colors.ink900};`}
`;

interface EventModalProps {
  event: ClassEvent;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const { students, updateEvent, deleteEvent } = useAppStore();
  const [title, setTitle] = useState(event.title);
  const [studentId, setStudentId] = useState(event.studentId);

  const start = parseISO(event.start);
  const end = parseISO(event.end);
  const [date, setDate] = useState<string>(format(start, 'yyyy-MM-dd'));
  const [time, setTime] = useState<string>(format(start, 'HH:mm'));
  const [durationMin, setDurationMin] = useState<number>(Math.max(30, Math.round((end.getTime() - start.getTime()) / 60000)));

  return (
    <Overlay role="dialog" aria-modal="true" aria-labelledby="event-details-title" onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <h3 id="event-details-title" style={{ marginTop: 0, marginBottom: 12 }}>Event Details</h3>
        <Row>
          <Label>Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
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
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </Row>
        <Row>
          <Label>Time</Label>
          <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
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
          <div>
            {event.canceled ? 'Canceled' : event.confirmed ? 'Confirmed' : 'Pending'}
          </div>
        </Row>

        <ButtonRow>
          {!event.confirmed && !event.canceled && (
            <Button onClick={() => updateEvent(event.id, { confirmed: true, canceled: false })}>Confirm</Button>
          )}
          {!event.canceled && (
            <Button onClick={() => updateEvent(event.id, { canceled: true, confirmed: false })}>Cancel</Button>
          )}
          <Button onClick={() => {
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
                } else {
                  alert('No available slot today.');
                  return;
                }
              } else {
                updateEvent(event.id, { title, studentId, start: newStart.toISOString(), end: newEnd.toISOString() });
              }
              onClose();
            } catch (e) {
              console.error(e);
            }
          }} variant="primary">Save</Button>
          <Button onClick={() => { deleteEvent(event.id); onClose(); }} variant="danger">Delete</Button>
          <Button onClick={onClose}>Close</Button>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

