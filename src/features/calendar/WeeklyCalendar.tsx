import React, { useState } from 'react';
import styled from 'styled-components';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
  isSameDay,
  setHours,
  setMinutes
} from 'date-fns';
import { useAppStore } from '../../store/appStore';
import { ClassEvent, TimeSlot } from '../../types';
import { FillSlotModal } from './FillSlotModal';
import { EventModal } from './EventModal';
import { AddEventModal } from './AddEventModal';
import { Button as UIButton } from '../../ui/components/Button';

const CalendarContainer = styled.div`
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
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.glass1};
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.glassBorder};
  z-index: 10;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px; left: 0; right: 0; height: 8px;
    background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 100%);
    pointer-events: none;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;


const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;


const WeekTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink900};
  margin: 0;
`;

const CalendarGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  overflow: auto;
`;

const TimeColumn = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.ink400};
  background: ${({ theme }) => theme.colors.surface0};
`;

const TimeSlotLabel = styled.div`
  height: 60px;
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 11px;
  font-family: ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.colors.ink600};
  display: flex;
  align-items: flex-start;
`;

const DayColumn = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  min-width: 120px;
`;

const NowLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #ef4444;
  z-index: 2;
  pointer-events: none;
`;

const DayHeader = styled.div<{ $isToday: boolean }>`
  height: 64px;
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${props => props.$isToday ? props.theme.colors.surface1 : 'transparent'};
  font-weight: 600;
  color: ${props => props.$isToday ? props.theme.colors.info : props.theme.colors.ink900};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-out;
`;

const DayName = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

const DayNumber = styled.div`
  font-size: 16px;
`;

const TimeSlotCell = styled.div`
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  cursor: pointer;
  transition: background 0.1s ease-out;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface1}80;
  }
`;

const EventBlock = styled.div<{ eventType: 'tutor-class' | 'student-class' | 'missing-info' }>`
  position: absolute;
  left: 3px;
  right: 3px;
  background: ${props => {
    switch (props.eventType) {
      case 'tutor-class': return `linear-gradient(180deg, ${props.theme.colors.info} 0%, #0056B3 100%)`;
      case 'student-class': return `linear-gradient(180deg, ${props.theme.colors.success} 0%, #1E7E34 100%)`;
      case 'missing-info': return `linear-gradient(180deg, ${props.theme.colors.danger} 0%, #B71C1C 100%)`;
      default: return props.theme.colors.brand;
    }
  }};
  color: white;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 11px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.font.heading};
  z-index: 1;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow.skeuoRaised}, 0 4px 8px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);

  &::after {
    content: '';
    position: absolute;
    top: 1px; left: 1px; right: 1px; height: 45%;
    background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
    border-radius: inherit;
  }
  
  &:hover {
    filter: brightness(1.1);
    transform: scale(1.05) translateY(-2px);
    z-index: 50;
    box-shadow: 0 12px 24px rgba(0,0,0,0.2), ${({ theme }) => theme.shadow.skeuoRaised};
  }

  &:active {
    transform: scale(0.98);
    box-shadow: ${({ theme }) => theme.shadow.skeuoPressed};
    &::after { opacity: 0; }
  }
`;

// Generate time slots for 30-minute intervals from 6 AM to 10 PM
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      slots.push({
        hour,
        minute,
        label: format(setMinutes(setHours(new Date(), hour), minute), 'h:mm a')
      });
    }
  }
  return slots;
};

export const WeeklyCalendar: React.FC = () => {
  const {
    currentWeek,
    setCurrentWeek,
    events,
    students,
    waitlist,
    setSelectedEvent,
    deleteEvent,
    assignSlotFromWaitlist
  } = useAppStore();

  const formatICSDateUTC = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      d.getUTCFullYear().toString() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) + 'Z'
    );
  };

  const handleExportICS = () => {
    const eventsInWeek = events.filter(ev => {
      if (ev.deletedAt) return false;
      const s = new Date(ev.start);
      return s >= weekStart && s <= weekEnd;
    });

    const lines: string[] = [];
    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');
    lines.push('PRODID:-//Tutor VC//EN');

    const dtstamp = formatICSDateUTC(new Date());

    for (const ev of eventsInWeek) {
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      const student = students.find(su => su.id === ev.studentId)?.name || '';
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${ev.id}@tutor-vc`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push(`DTSTART:${formatICSDateUTC(s)}`);
      lines.push(`DTEND:${formatICSDateUTC(e)}`);
      lines.push(`SUMMARY:${ev.title.replace(/\r?\n/g, ' ')}`);
      if (student) lines.push(`DESCRIPTION:${('Student: ' + student).replace(/\r?\n/g, ' ')}`);
      lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classes_${format(weekStart, 'yyyyMMdd')}_${format(weekEnd, 'yyyyMMdd')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [showFillSlotModal, setShowFillSlotModal] = useState(false);
  const [canceledEvent, setCanceledEvent] = useState<ClassEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [addModal, setAddModal] = useState<{ open: boolean; startISO?: string }>({ open: false });

  const timeSlots = generateTimeSlots();
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleEventClick = (event: ClassEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEventLongPress = (event: ClassEvent) => {
    // Cancel the event and show fill slot modal (Quick Cancel)
    // We update the state to mark as canceled per PRD "quick cancel" flow
    // which then triggers the Fill Slot suggestions.
    if (window.confirm(`Quick cancel class for ${students.find(s => s.id === event.studentId)?.name}?`)) {
      deleteEvent(event.id);
      setCanceledEvent(event);
      setShowFillSlotModal(true);
    }
  };

  const handleAssignSlot = (studentId: string, duration: number) => {
    if (canceledEvent) {
      assignSlotFromWaitlist(canceledEvent.id, studentId, duration);
    }
  };

  const handleSkipFillSlot = () => {
    // Just close the modal, slot remains empty
    setShowFillSlotModal(false);
    setCanceledEvent(null);
  };

  const handleSlotClick = (day: Date, timeSlot: TimeSlot) => {
    const start = setMinutes(setHours(day, timeSlot.hour), timeSlot.minute);
    setAddModal({ open: true, startISO: start.toISOString() });
  };

  const getEventsForSlot = (day: Date, timeSlot: TimeSlot): ClassEvent[] => {
    return events.filter(event => {
      if (event.deletedAt) return false;
      if (event.canceled) return false;
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, day) &&
        eventStart.getHours() === timeSlot.hour &&
        eventStart.getMinutes() === timeSlot.minute;
    });
  };

  const getEventType = (event: ClassEvent): 'tutor-class' | 'student-class' | 'missing-info' => {
    if (!event.studentId) return 'missing-info';
    // For now, assume all are student classes - we'll refine this logic later
    return 'student-class';
  };

  return (
    <CalendarContainer>
      <Header>
        <WeekTitle>Weekly Calendar</WeekTitle>
        <WeekNavigation>
          <UIButton variant="secondary" size="sm" onClick={goToPreviousWeek}>← Previous</UIButton>
          <span>{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</span>
          <UIButton variant="secondary" size="sm" onClick={goToNextWeek}>Next →</UIButton>
        </WeekNavigation>
        <HeaderActions>
          <UIButton variant="secondary" size="sm" onClick={handleExportICS}>Export .ics</UIButton>
        </HeaderActions>
      </Header>

      <CalendarGrid>
        {/* Time column */}
        <TimeColumn>
          <div style={{ height: '60px' }}></div> {/* Header spacer */}
          {timeSlots.map((slot, index) => (
            <TimeSlotLabel key={index}>
              {slot.label}
            </TimeSlotLabel>
          ))}
        </TimeColumn>

        {/* Day columns */}
        {weekDays.map((day, dayIndex) => (
          <DayColumn key={dayIndex}>
            <DayHeader $isToday={isSameDay(day, new Date())}>
              <DayName>{format(day, 'EEE')}</DayName>
              <DayNumber>{format(day, 'd')}</DayNumber>
            </DayHeader>

            {(() => {
              const now = new Date();
              if (isSameDay(day, now)) {
                const startHour = 6;
                const endHour = 22;
                const h = now.getHours();
                const m = now.getMinutes();
                if (h >= startHour && h <= endHour) {
                  const totalMinutes = (h - startHour) * 60 + m;
                  const top = 60 + totalMinutes * 2;
                  return <NowLine style={{ top }} />;
                }
              }
              return null;
            })()}

            {timeSlots.map((slot, slotIndex) => {
              const eventsInSlot = getEventsForSlot(day, slot);
              const zebra = slot.hour % 2 === 1;
              const todayCol = isSameDay(day, new Date());
              const background = todayCol
                ? (zebra ? '#EEF2FF' : '#F8FAFF')
                : (zebra ? '#F3F6FB' : undefined);

              return (
                <TimeSlotCell
                  key={slotIndex}
                  onClick={() => handleSlotClick(day, slot)}
                  style={background ? { background } : undefined}
                >
                  {eventsInSlot.map((event, eventIndex) => {
                    let longPressTimer: NodeJS.Timeout;

                    return (
                      <EventBlock
                        key={event.id}
                        eventType={getEventType(event)}
                        style={{ top: `${eventIndex * 20}px` }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Event: ${event.title}`}
                        onKeyDown={(ke) => {
                          if (ke.key === 'Enter' || ke.key === ' ') {
                            ke.preventDefault();
                            handleEventClick(event);
                          }
                        }}
                        onMouseDown={() => {
                          longPressTimer = setTimeout(() => {
                            handleEventLongPress(event);
                          }, 400);
                        }}
                        onMouseUp={() => {
                          clearTimeout(longPressTimer);
                        }}
                        onMouseLeave={() => {
                          clearTimeout(longPressTimer);
                        }}
                        onTouchStart={() => {
                          longPressTimer = setTimeout(() => {
                            handleEventLongPress(event);
                          }, 500);
                        }}
                        onTouchEnd={() => {
                          clearTimeout(longPressTimer);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          clearTimeout(longPressTimer);
                          handleEventClick(event);
                        }}
                      >
                        {event.title}
                      </EventBlock>
                    );
                  })}
                </TimeSlotCell>
              );
            })}
          </DayColumn>
        ))}
      </CalendarGrid>

      {canceledEvent && (
        <FillSlotModal
          isOpen={showFillSlotModal}
          onClose={() => {
            setShowFillSlotModal(false);
            setCanceledEvent(null);
          }}
          canceledEvent={canceledEvent}
          availableStudents={students}
          waitlistEntries={waitlist}
          onAssignSlot={handleAssignSlot}
          onSkip={handleSkipFillSlot}
        />
      )}

      {/* Add event modal */}
      <AddEventModal
        isOpen={addModal.open}
        startISO={addModal.startISO || new Date().toISOString()}
        onClose={() => setAddModal({ open: false })}
      />

      {/* Event detail modal */}
      {/** Using selectedEvent from store */}
      {(useAppStore.getState().selectedEvent) && showEventModal && (
        <EventModal
          event={useAppStore.getState().selectedEvent as ClassEvent}
          onClose={() => setShowEventModal(false)}
        />
      )}
    </CalendarContainer>
  );
};
