import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../../store/appStore';
import { Button as UIButton } from '../../ui/components/Button';
import { Modal as UIModal } from '../../ui/components/Modal';
import { Input as UIInput } from '../../ui/components/Input';
import { TextArea as UITextArea } from '../../ui/components/TextArea';
import { useToast } from '../../ui/components/ToastProvider';
import { UserPlus, Trash2, Clock, CalendarDays } from 'lucide-react';

const WaitlistContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  position: relative;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px; left: 0; right: 0; height: 8px;
    background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 100%);
    pointer-events: none;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink900};
  margin: 0;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 12px;
`;


const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const WaitlistGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const WaitlistCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors.glass1};
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.colors.glassBorder};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.liquidGlass};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.glassHighlight}, transparent);
    opacity: 0.5;
  }
  
  &:hover {
    box-shadow: 0 12px 48px rgba(0,0,0,0.12);
    transform: translateY(-4px);
  }
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
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.info}15;
  color: ${({ theme }) => theme.colors.info};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 11px;
  font-weight: 700;
  margin: 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;


const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
`;


const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink600};
  margin-bottom: 8px;
  font-family: ${({ theme }) => theme.font.heading};
  letter-spacing: -0.01em;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;
  font-family: ${({ theme }) => theme.font.body};
  background: ${({ theme }) => theme.colors.surface0}80;
  color: ${({ theme }) => theme.colors.ink900};
  outline: none;
  transition: all ${({ theme }) => theme.transition.speed} ${({ theme }) => theme.transition.default};
  
  &:focus {
    background: ${({ theme }) => theme.colors.surface1};
    border-color: ${({ theme }) => theme.colors.info};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.info}20;
  }
`;





export const WaitlistManagement: React.FC = () => {
  const { students, waitlist, addWaitlistEntry, removeWaitlistEntry } = useAppStore();
  const { showToast } = useToast();
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
      const studentName = getStudentName(newEntry.studentId);
      showToast(`${studentName} added to waitlist`, 'success');
      setNewEntry({ studentId: '', durationMin: 60, notes: '', windows: [] });
      setShowAddModal(false);
    }
  };

  const handleRemoveEntry = (id: string, studentId: string) => {
    const studentName = getStudentName(studentId);
    removeWaitlistEntry(id);
    showToast(`${studentName} removed from waitlist`, 'info');
  };

  return (
    <WaitlistContainer>
      <Header>
        <Title>
          <Clock size={28} />
          Waitlist Management
        </Title>
        <UIButton variant="primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} style={{ marginRight: 8 }} />
          Add Student
        </UIButton>
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
                <Duration>
                  <CalendarDays size={12} style={{ marginRight: 6 }} />
                  {entry.durationMin} min
                </Duration>
                <UIButton variant="danger" size="sm" onClick={() => handleRemoveEntry(entry.id, entry.studentId)}>
                  <Trash2 size={16} />
                </UIButton>
              </WaitlistCard>
            ))}
          </WaitlistGrid>
        )}
      </Content>

      <UIModal
        open={showAddModal}
        title="Add Student to Waitlist"
        onClose={() => setShowAddModal(false)}
        footer={
          <>
            <UIButton variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</UIButton>
            <UIButton variant="primary" onClick={handleAddEntry}>Add to Waitlist</UIButton>
          </>
        }
      >
        <FormGroup>
          <Label>Student</Label>
          <Select
            value={newEntry.studentId}
            onChange={(e) => setNewEntry({ ...newEntry, studentId: e.target.value })}
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
          <UIInput
            type="number"
            value={newEntry.durationMin}
            onChange={(e) => setNewEntry({ ...newEntry, durationMin: parseInt(e.target.value) || 60 })}
            min={30}
            max={180}
            step={30}
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
                <UIButton variant="secondary" size="sm" onClick={() => { const win = [...newEntry.windows]; win.splice(i, 1); setNewEntry({ ...newEntry, windows: win }); }}>Remove</UIButton>
              </div>
            ))}
            <UIButton variant="primary" onClick={() => setNewEntry({ ...newEntry, windows: [...(newEntry.windows || []), { dow: 1, start: '09:00', end: '10:00' }] })}>+ Add window</UIButton>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>Notes (optional)</Label>
          <UITextArea
            value={newEntry.notes}
            onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
            placeholder="Any specific preferences or notes..."
            rows={3}
          />
        </FormGroup>
      </UIModal>
    </WaitlistContainer>
  );
};
