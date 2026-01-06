import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../../store/appStore';
import { Student } from '../../types';
import { format } from 'date-fns';
import { findNextAvailableSlotSameDay, hasConflict } from '../../utils/scheduling';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 520px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px;
  margin-bottom: 12px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

const Button = styled.button<{ variant?: 'primary' }>`
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  ${p => p.variant === 'primary' ? `background:#3b82f6;border-color:#3b82f6;color:#fff;` : `background:#fff;border-color:#d1d5db;color:#374151;`}
`;

interface AddEventModalProps {
  isOpen: boolean;
  startISO: string;
  onClose: () => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, startISO, onClose }) => {
  const { students, addEvent } = useAppStore();
  const [title, setTitle] = useState('New Class');
  const [studentId, setStudentId] = useState('');
  const [durationMin, setDurationMin] = useState(60);

  if (!isOpen) return null;

  const start = new Date(startISO);
  const end = new Date(start.getTime() + durationMin * 60000);

  return (
    <Overlay role="dialog" aria-modal="true" aria-labelledby="add-class-title" onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <h3 id="add-class-title" style={{ marginTop: 0, marginBottom: 12 }}>Add Class</h3>
        <Row>
          <Label>Start</Label>
          <div>{format(start, 'EEE, MMM d, h:mm a')}</div>
        </Row>
        <Row>
          <Label>Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
        </Row>
        <Row>
          <Label>Student</Label>
          <Select value={studentId} onChange={e => setStudentId(e.target.value)}>
            <option value="">Unassigned</option>
            {students.map((s: Student) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </Row>
        <Row>
          <Label>Duration</Label>
          <Select value={durationMin} onChange={e => setDurationMin(parseInt(e.target.value))}>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
            <option value={90}>90 min</option>
          </Select>
        </Row>
        <ButtonRow>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              const evts = useAppStore.getState().events;
              if (hasConflict(start, end, evts)) {
                const suggestion = findNextAvailableSlotSameDay(start, durationMin, evts);
                if (suggestion) {
                  const ok = window.confirm(`Selected time conflicts. Use next available slot at ${format(suggestion.start, 'h:mm a')}?`);
                  if (!ok) return;
                  addEvent({ studentId, title, start: suggestion.start.toISOString(), end: suggestion.end.toISOString(), confirmed: false, canceled: false });
                } else {
                  alert('No available slot today.');
                  return;
                }
              } else {
                addEvent({ studentId, title, start: start.toISOString(), end: end.toISOString(), confirmed: false, canceled: false });
              }
              onClose();
            }}
          >
            Save
          </Button>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

