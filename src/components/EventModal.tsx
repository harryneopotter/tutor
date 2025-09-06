import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/appStore';
import { ClassEvent } from '../types';
import { format, parseISO } from 'date-fns';

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

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  ${p => p.variant === 'primary' ? `background:#3b82f6;border-color:#3b82f6;color:#fff;` : p.variant === 'danger' ? `background:#ef4444;border-color:#ef4444;color:#fff;` : `background:#fff;border-color:#d1d5db;color:#374151;`}
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

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Event Details</h3>
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
          <Label>Time</Label>
          <div>{format(start, 'EEE, MMM d, h:mm a')} - {format(end, 'h:mm a')}</div>
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
          <Button onClick={() => { updateEvent(event.id, { title, studentId }); onClose(); }} variant="primary">Save</Button>
          <Button onClick={() => { deleteEvent(event.id); onClose(); }} variant="danger">Delete</Button>
          <Button onClick={onClose}>Close</Button>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

