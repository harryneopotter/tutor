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
import { useAppStore } from '../store/appStore';
import { ClassEvent, TimeSlot } from '../types';
import { FillSlotModal } from './FillSlotModal';
import { EventModal } from './EventModal';
import { AddEventModal } from './AddEventModal';

const CalendarContainer = styled.div`
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

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ExportButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f9fafb;
  }
`;

const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #f9fafb;
  }
`;

const WeekTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CalendarGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  overflow: auto;
`;

const TimeColumn = styled.div`
  border-right: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const TimeSlotLabel = styled.div`
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
  position: relative;
  min-width: 120px;
`;

const DayHeader = styled.div<{ isToday: boolean }>`
  height: 60px;
  padding: 8px 12px;
  border-bottom: 2px solid ${props => props.isToday ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.isToday ? '#eff6ff' : '#ffffff'};
  font-weight: 600;
  color: ${props => props.isToday ? '#1d4ed8' : '#374151'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  cursor: pointer;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const EventBlock = styled.div<{ eventType: 'tutor-class' | 'student-class' | 'missing-info' }>`
  position: absolute;
  left: 2px;
  right: 2px;
  background: ${props => {
    switch (props.eventType) {
      case 'tutor-class': return '#3b82f6';
      case 'student-class': return '#10b981';
      case 'missing-info': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  z-index: 1;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
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
    addEvent, 
    setSelectedEvent,
    deleteEvent,
    assignSlotFromWaitlist
  } = useAppStore();

  const formatICSDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      d.getFullYear().toString() +
      pad(d.getMonth() + 1) +
      pad(d.getDate()) + 'T' +
      pad(d.getHours()) +
      pad(d.getMinutes()) +
      pad(d.getSeconds())
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

    const dtstamp = formatICSDate(new Date());

    for (const ev of eventsInWeek) {
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      const student = students.find(su => su.id === ev.studentId)?.name || '';
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${ev.id}@tutor-vc`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push(`DTSTART:${formatICSDate(s)}`);
      lines.push(`DTEND:${formatICSDate(e)}`);
      lines.push(`SUMMARY:${ev.title}`);
      if (student) lines.push(`DESCRIPTION:Student: ${student}`);
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
    // Cancel the event and show fill slot modal
    deleteEvent(event.id);
    setCanceledEvent(event);
    setShowFillSlotModal(true);
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
    const slotStart = setMinutes(setHours(day, timeSlot.hour), timeSlot.minute);
    
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
          <NavButton onClick={goToPreviousWeek}>← Previous</NavButton>
          <span>{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</span>
          <NavButton onClick={goToNextWeek}>Next →</NavButton>
        </WeekNavigation>
        <HeaderActions>
          <ExportButton onClick={handleExportICS}>Export .ics</ExportButton>
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
            <DayHeader isToday={isSameDay(day, new Date())}>
              <DayName>{format(day, 'EEE')}</DayName>
              <DayNumber>{format(day, 'd')}</DayNumber>
            </DayHeader>
            
            {timeSlots.map((slot, slotIndex) => {
              const eventsInSlot = getEventsForSlot(day, slot);
              
              return (
                <TimeSlotCell 
                  key={slotIndex}
                  onClick={() => handleSlotClick(day, slot)}
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
                          }, 500);
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
      { (useAppStore.getState().selectedEvent) && showEventModal && (
        <EventModal 
          event={useAppStore.getState().selectedEvent as ClassEvent}
          onClose={() => setShowEventModal(false)}
        />
      )}
    </CalendarContainer>
  );
};
