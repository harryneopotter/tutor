import React from 'react';
import styled from 'styled-components';
import { startOfWeek, endOfWeek, eachDayOfInterval, setHours, setMinutes, format, isSameDay } from 'date-fns';
import { useAppStore } from '../store/appStore';
import { ClassEvent } from '../types';
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e1e5e9;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Select = styled.select`
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  overflow: auto;
`;

const TimeColumn = styled.div`
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
`;

const TimeLabel = styled.div`
  height: 60px;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
`;

const DayColumn = styled.div`
  border-right: 1px solid #e5e7eb;
`;

const DayHeader = styled.div`
  height: 60px;
  padding: 8px 12px;
  border-bottom: 2px solid #e5e7eb;
  background: #ffffff;
  font-weight: 600;
  color: #374151;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Cell = styled.div<{ level: 'free' | 'partial' | 'busy' }>`
  height: 60px;
  border-bottom: 1px solid #e5e7eb;
  background: ${p => p.level === 'free' ? '#d1fae5' : p.level === 'busy' ? '#fca5a5' : '#86efac'};
`;

function generateTimeSlots() {
  const slots: { hour: number; minute: number; label: string }[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const date = setMinutes(setHours(new Date(), hour), minute);
      slots.push({ hour, minute, label: format(date, 'h:mm a') });
    }
  }
  return slots;
}

function minutesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  const start = Math.max(aStart.getTime(), bStart.getTime());
  const end = Math.min(aEnd.getTime(), bEnd.getTime());
  return Math.max(0, end - start) / 60000;
}

export const AvailabilityReport: React.FC = () => {
  const { currentWeek, events, students } = useAppStore();
  const [studentFilter, setStudentFilter] = useState<string>('');
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const slots = generateTimeSlots();
  const filteredEvents = studentFilter ? events.filter(e => e.studentId === studentFilter) : events;

  const cellLevel = (day: Date, hour: number, minute: number): 'free' | 'partial' | 'busy' => {
    const slotStart = setMinutes(setHours(day, hour), minute);
    const slotEnd = setMinutes(setHours(day, hour), minute + 30);

    let occupied = 0;
    for (const ev of filteredEvents) {
      if (ev.deletedAt) continue;
      const evStart = new Date(ev.start);
      const evEnd = new Date(ev.end);
      if (!isSameDay(evStart, slotStart)) continue;
      occupied += minutesOverlap(slotStart, slotEnd, evStart, evEnd);
      if (occupied >= 30) break;
    }
    if (occupied <= 0) return 'free';
    if (occupied >= 30) return 'busy';
    return 'partial';
  };

  return (
    <Container>
      <Header>
        <Title>Availability Report</Title>
        <Controls>
          <div>{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</div>
          <Select value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)}>
            <option value="">All students</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </Controls>
      </Header>
      <Grid>
        <TimeColumn>
          <div style={{ height: '60px' }} />
          {slots.map((s, i) => (<TimeLabel key={i}>{s.label}</TimeLabel>))}
        </TimeColumn>
        {days.map((day, di) => (
          <DayColumn key={di}>
            <DayHeader>
              <div style={{ fontSize: 12 }}>{format(day, 'EEE')}</div>
              <div style={{ fontSize: 16 }}>{format(day, 'd')}</div>
            </DayHeader>
            {slots.map((s, si) => (
              <Cell key={si} level={cellLevel(day, s.hour, s.minute)} />
            ))}
          </DayColumn>
        ))}
      </Grid>
    </Container>
  );
}

