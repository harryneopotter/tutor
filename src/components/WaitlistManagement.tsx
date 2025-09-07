import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/appStore';

const WaitlistContainer = styled.div`
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
  
  &:hover {
    background: #2563eb;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const WaitlistGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const WaitlistCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const StudentDetails = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const Duration = styled.div`
  padding: 4px 8px;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin: 0 12px;
`;

const RemoveButton = styled.button`
  padding: 4px 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: #dc2626;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
    &:hover { background: #2563eb; }
  ` : `
    background: white;
    border-color: #d1d5db;
    color: #374151;
    &:hover { background: #f9fafb; }
  `}
`;

export const WaitlistManagement: React.FC = () => {
  const { students, waitlist, addWaitlistEntry, removeWaitlistEntry } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    studentId: '',
    durationMin: 60,
    notes: '',
    windows: [] as { dow: number; start: string; end: string }[]
  });

  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getStudentGrade = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student?.grade || '';
  };

  const handleAddEntry = () => {
    if (newEntry.studentId) {
      addWaitlistEntry(newEntry);
      setNewEntry({ studentId: '', durationMin: 60, notes: '', windows: [] });
      setShowAddModal(false);
    }
  };

  const handleRemoveEntry = (id: string) => {
    removeWaitlistEntry(id);
  };

  return (
    <WaitlistContainer>
      <Header>
        <Title>Waitlist Management</Title>
        <AddButton onClick={() => setShowAddModal(true)}>
          + Add Student
        </AddButton>
      </Header>

      <Content>
        {waitlist.length === 0 ? (
          <EmptyState>
            No students in waitlist.<br />
            Add students who are looking for extra class slots.
          </EmptyState>
        ) : (
          <WaitlistGrid>
            {waitlist.map(entry => (
              <WaitlistCard key={entry.id}>
                <StudentInfo>
                  <StudentName>{getStudentName(entry.studentId)}</StudentName>
                  <StudentDetails>
                    {getStudentGrade(entry.studentId)}
                    {entry.notes && ` • ${entry.notes}`}
                  </StudentDetails>
                </StudentInfo>
                <Duration>{entry.durationMin} min</Duration>
                <RemoveButton onClick={() => handleRemoveEntry(entry.id)}>
                  Remove
                </RemoveButton>
              </WaitlistCard>
            ))}
          </WaitlistGrid>
        )}
      </Content>

      {showAddModal && (
        <Modal role="dialog" aria-modal="true" aria-labelledby="add-waitlist-title" onClick={() => setShowAddModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle id="add-waitlist-title">Add Student to Waitlist</ModalTitle>
            
            <FormGroup>
              <Label>Student</Label>
              <Select
                value={newEntry.studentId}
                onChange={(e) => setNewEntry({...newEntry, studentId: e.target.value})}
              >
                <option value="">Select a student</option>
                {students
                  .filter(student => !waitlist.some(entry => entry.studentId === student.id))
                  .map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.grade})
                    </option>
                  ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Preferred Duration (minutes)</Label>
              <Input
                type="number"
                value={newEntry.durationMin}
                onChange={(e) => setNewEntry({...newEntry, durationMin: parseInt(e.target.value) || 60})}
                min="30"
                max="180"
                step="30"
              />
            </FormGroup>

            <FormGroup>
              <Label>Availability Windows (optional)</Label>
              <div style={{ display: 'grid', gap: 8 }}>
                {(newEntry.windows || []).map((w, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8 }}>
                    <select value={w.dow} onChange={e => {
                      const val = parseInt(e.target.value);
                      const win = [...newEntry.windows]; win[i] = { ...win[i], dow: val }; setNewEntry({ ...newEntry, windows: win });
                    }}>
                      <option value={1}>Mon</option>
                      <option value={2}>Tue</option>
                      <option value={3}>Wed</option>
                      <option value={4}>Thu</option>
                      <option value={5}>Fri</option>
                      <option value={6}>Sat</option>
                      <option value={0}>Sun</option>
                    </select>
                    <input type="time" value={w.start} onChange={e => { const win = [...newEntry.windows]; win[i] = { ...win[i], start: e.target.value }; setNewEntry({ ...newEntry, windows: win }); }} />
                    <input type="time" value={w.end} onChange={e => { const win = [...newEntry.windows]; win[i] = { ...win[i], end: e.target.value }; setNewEntry({ ...newEntry, windows: win }); }} />
                    <Button variant="secondary" onClick={() => { const win = [...newEntry.windows]; win.splice(i,1); setNewEntry({ ...newEntry, windows: win }); }}>Remove</Button>
                  </div>
                ))}
                <Button variant="primary" onClick={() => setNewEntry({ ...newEntry, windows: [...(newEntry.windows||[]), { dow: 1, start: '09:00', end: '10:00' }] })}>+ Add window</Button>
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Notes (optional)</Label>
              <TextArea
                value={newEntry.notes}
                onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                placeholder="Any specific preferences or notes..."
              />
            </FormGroup>

            <ButtonGroup>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddEntry}>
                Add to Waitlist
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </WaitlistContainer>
  );
};