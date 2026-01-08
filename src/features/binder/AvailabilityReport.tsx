import React from 'react';
import styled from 'styled-components';
import { startOfWeek, endOfWeek, eachDayOfInterval, setHours, setMinutes, format, isSameDay } from 'date-fns';
import { useAppStore } from '../../store/appStore';
import { useState } from 'react';
import { BarChart, Filter } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 24px;
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

const Controls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Select = styled.select`
  padding: 10px 14px;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.surface1} 0%, ${({ theme }) => theme.colors.surface0} 100%);
  color: ${({ theme }) => theme.colors.ink900};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom-color: ${({ theme }) => theme.colors.glassHighlight};
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.font.body};
  outline: none;
  box-shadow: ${({ theme }) => theme.shadow.skeuoRaised};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.info};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.info}25, ${({ theme }) => theme.shadow.skeuoRaised};
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

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  overflow: auto;
`;

const TimeColumn = styled.div`
  background: ${({ theme }) => theme.colors.surface0};
  border-right: 1px solid ${({ theme }) => theme.colors.ink400};
`;

const TimeLabel = styled.div`
  height: 60px;
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ink400};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.ink600};
  display: flex;
  align-items: center;
`;

const DayColumn = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.ink400};
`;

const DayHeader = styled.div`
  height: 60px;
  padding: 8px 12px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface1};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink600};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  & > div:first-child { text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; margin-bottom: 2px; }
  & > div:last-child { font-size: 18px; color: ${({ theme }) => theme.colors.ink900}; }
`;

const Cell = styled.div<{ level: 'free' | 'partial' | 'busy' }>`
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${props =>
    props.level === 'free' ? props.theme.colors.success :
      props.level === 'busy' ? '#FF69B4' : // HotPink/Pink for busy as per PRD
        props.theme.colors.warning};
  opacity: 0.15;
  transition: opacity 0.2s ease-out;
  &:hover {
    opacity: 0.3;
  }
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
        <Title>
          <BarChart size={28} />
          Availability Report
        </Title>
        <Controls>
          <div style={{ fontWeight: 600, opacity: 0.6, fontSize: 13, marginRight: 8 }}>
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.05)', padding: '4px 12px', borderRadius: '999px' }}>
            <Filter size={14} style={{ opacity: 0.5 }} />
            <Select
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              style={{ padding: 4, background: 'transparent', border: 'none', boxShadow: 'none' }}
            >
              <option value="">All Students</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
          </div>
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

