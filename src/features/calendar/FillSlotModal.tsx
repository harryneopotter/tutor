import React from 'react';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';
import { ClassEvent, Student, WaitlistEntry } from '../../types';
import { rankWaitlistCandidates } from '../../utils/ranking';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(2, 6, 23, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadow.card};
  border: 1px solid ${({ theme }) => theme.colors.ink400};
`;

const ModalHeader = styled.div`
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink900};
  margin: 0 0 8px 0;
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.ink600};
  margin: 0;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink900};
  margin: 20px 0 12px 0;
`;

const StudentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const StudentCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.ink400};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface0};
  transition: background 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface1};
  }
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink900};
  margin-bottom: 2px;
`;

const StudentDetails = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ink600};
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 6px 12px;
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.brand};
          border-color: ${props.theme.colors.brand};
          color: white;
          &:hover { background: ${props.theme.colors.brandHover}; }
        `;
      case 'secondary':
        return `
          background: ${props.theme.colors.surface1};
          border-color: ${props.theme.colors.ink400};
          color: ${props.theme.colors.ink900};
          &:hover { background: ${props.theme.colors.surface0}; }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.danger};
          border-color: ${props.theme.colors.danger};
          color: white;
          &:hover { opacity: 0.9; }
        `;
      default:
        return `
          background: ${props.theme.colors.surface1};
          border-color: ${props.theme.colors.ink400};
          color: ${props.theme.colors.ink900};
        `;
    }
  }}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: ${({ theme }) => theme.colors.ink600};
  font-size: 14px;
`;

interface FillSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  canceledEvent: ClassEvent;
  availableStudents: Student[];
  waitlistEntries: WaitlistEntry[];
  onAssignSlot: (studentId: string, duration: number) => void;
  onSkip: () => void;
}

export const FillSlotModal: React.FC<FillSlotModalProps> = ({
  isOpen,
  onClose,
  canceledEvent,
  availableStudents,
  waitlistEntries,
  onAssignSlot,
  onSkip
}) => {
  if (!isOpen) return null;

  const eventStart = parseISO(canceledEvent.start);
  const eventEnd = parseISO(canceledEvent.end);
  const eventDuration = Math.round((eventEnd.getTime() - eventStart.getTime()) / (1000 * 60));

  // Rank and get top 3 students from waitlist based on windows and duration fit
  const suitableWaitlistEntries = rankWaitlistCandidates(eventDuration, waitlistEntries, availableStudents, { eventStart })
    .filter(entry => entry.durationMin <= eventDuration)
    .slice(0, 3);

  const handleAssign = (studentId: string, duration: number) => {
    onAssignSlot(studentId, duration);
    onClose();
  };

  const handleSkip = () => {
    onSkip();
    onClose();
  };

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="fill-slot-title" onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle id="fill-slot-title">Fill This Slot</ModalTitle>
          <ModalSubtitle>
            {format(eventStart, 'EEEE, MMM d')} • {format(eventStart, 'h:mm a')} - {format(eventEnd, 'h:mm a')} 
            ({eventDuration} minutes available)
          </ModalSubtitle>
        </ModalHeader>

        {suitableWaitlistEntries.length > 0 ? (
          <>
            <SectionTitle>🎯 Suggested Students (from waitlist)</SectionTitle>
            <StudentList>
              {suitableWaitlistEntries.map(entry => {
                const student = availableStudents.find(s => s.id === entry.studentId);
                if (!student) return null;
                
                return (
                  <StudentCard key={entry.id}>
                    <StudentInfo>
                      <StudentName>{student.name}</StudentName>
                      <StudentDetails>
                        {student.grade} • Requested {entry.durationMin} minutes
                        {entry.notes && ` • ${entry.notes}`}
                      </StudentDetails>
                    </StudentInfo>
                    <ActionButton 
                      variant="primary"
                      onClick={() => handleAssign(student.id, entry.durationMin)}
                    >
                      ✓ Assign
                    </ActionButton>
                  </StudentCard>
                );
              })}
            </StudentList>
          </>
        ) : (
          <EmptyState>
            No students in waitlist match this time slot duration.
            <br />
            You can manually assign from all students below.
          </EmptyState>
        )}

        {availableStudents.length > 0 && (
          <>
            <SectionTitle>👥 All Available Students</SectionTitle>
            <StudentList>
              {availableStudents
                .filter(student => !suitableWaitlistEntries.some(entry => entry.studentId === student.id))
                .slice(0, 5)
                .map(student => (
                  <StudentCard key={student.id}>
                    <StudentInfo>
                      <StudentName>{student.name}</StudentName>
                      <StudentDetails>
                        {student.grade}
                        {student.notes && ` • ${student.notes}`}
                      </StudentDetails>
                    </StudentInfo>
                    <ActionButton 
                      variant="secondary"
                      onClick={() => handleAssign(student.id, eventDuration)}
                    >
                      Assign
                    </ActionButton>
                  </StudentCard>
                ))}
            </StudentList>
          </>
        )}

        <ButtonGroup>
          <ActionButton variant="secondary" onClick={handleSkip}>
            Skip for now
          </ActionButton>
          <ActionButton variant="danger" onClick={onClose}>
            Close
          </ActionButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};
