import React from 'react';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';
import { ClassEvent, Student, WaitlistEntry } from '../types';
import { rankWaitlistCandidates } from '../utils/ranking';

const ModalOverlay = styled.div`
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
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: #374151;
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
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  transition: background 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.div`
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
`;

const StudentDetails = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 6px 12px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
          &:hover { background: #2563eb; }
        `;
      case 'secondary':
        return `
          background: #ffffff;
          border-color: #d1d5db;
          color: #374151;
          &:hover { background: #f9fafb; }
        `;
      case 'danger':
        return `
          background: #ef4444;
          border-color: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #6b7280;
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