import React, { useMemo } from 'react';
import styled from 'styled-components';
import { isSameDay, parseISO, setHours, setMinutes, startOfDay, endOfDay, addMinutes, differenceInCalendarDays } from 'date-fns';
import { useAppStore } from '../store/appStore';
import { ClassEvent } from '../types';

const Container = styled.div`
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

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
  margin-bottom: 12px;
`;

const Info = styled.div`
  flex: 1;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  ${p => p.variant === 'primary' ? `
    background: #10b981; border-color: #10b981; color: white; &:hover { background: #059669; }
  ` : `
    background: white; border-color: #d1d5db; color: #374151; &:hover { background: #f9fafb; }
  `}
`;

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

function findNextAvailableSlotSameDay(targetStart: Date, durationMin: number, events: ClassEvent[]): { start: Date, end: Date } | null {
  const dayStart = startOfDay(targetStart);
  const dayEnd = endOfDay(targetStart);
  for (let t = new Date(targetStart); t <= dayEnd; t = addMinutes(t, 30)) {
    const candidateStart = t;
    const candidateEnd = addMinutes(t, durationMin);
    if (candidateEnd > dayEnd) break;
    const conflict = events.some(ev => {
      if (ev.deletedAt) return false;
      const s = parseISO(ev.start);
      const e = parseISO(ev.end);
      return isSameDay(s, candidateStart) && overlaps(candidateStart, candidateEnd, s, e);
    });
    if (!conflict) return { start: candidateStart, end: candidateEnd };
  }
  return null;
}

export const TrashView: React.FC = () => {
  const { events, restoreEvent, updateEventTimes, students } = useAppStore();

  const trashed = useMemo(() => events.filter(e => e.deletedAt), [events]);
  const live = useMemo(() => events.filter(e => !e.deletedAt), [events]);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Unknown';

  const tryRestore = (ev: ClassEvent) => {
    const start = parseISO(ev.start);
    const end = parseISO(ev.end);
    const conflict = live.some(l => overlaps(start, end, parseISO(l.start), parseISO(l.end)) && isSameDay(parseISO(l.start), start));
    if (!conflict) {
      restoreEvent(ev.id);
      return;
    }
    const next = findNextAvailableSlotSameDay(start, (end.getTime() - start.getTime()) / 60000, live);
    if (next) {
      updateEventTimes(ev.id, next.start.toISOString(), next.end.toISOString());
      restoreEvent(ev.id);
    } else {
      alert('No available slot today to restore this event.');
    }
  };

  return (
    <Container>
      <Header>
        <Title>Trash (Soft-Deleted Classes)</Title>
      </Header>
      <Content>
        {trashed.length === 0 ? (
          <div style={{ color: '#6b7280' }}>No deleted classes in the last 30 days.</div>
        ) : (
          trashed.map(ev => (
            <Card key={ev.id}>
              <Info>
                <div style={{ fontWeight: 600 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {getStudentName(ev.studentId)} • {new Date(ev.start).toLocaleString()} - {new Date(ev.end).toLocaleTimeString()} 
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                  {(() => {
                    const daysSince = ev.deletedAt ? differenceInCalendarDays(new Date(), new Date(ev.deletedAt)) : 0;
                    const left = Math.max(0, 30 - daysSince);
                    return `${left} day${left === 1 ? '' : 's'} left`;
                  })()}
                </div>
              </Info>
              <Actions>
                <Button onClick={() => tryRestore(ev)} variant="primary">Restore</Button>
              </Actions>
            </Card>
          ))
        )}
      </Content>
    </Container>
  );
};

