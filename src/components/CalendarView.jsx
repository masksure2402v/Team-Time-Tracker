import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ entries, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }); // Start on Monday
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getDayStatus = (day) => {
    const dayEntries = entries.filter(e => isSameDay(parseISO(e.date), day));
    if (dayEntries.length === 0) return null;
    
    // Priority: Leave > Work
    if (dayEntries.some(e => e.type === 'leave')) return 'leave';
    return 'work';
  };

  return (
    <div className="calendar-container card">
      <div className="calendar-header">
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="calendar-nav">
          <button onClick={prevMonth} className="btn-icon"><ChevronLeft size={20}/></button>
          <button onClick={nextMonth} className="btn-icon"><ChevronRight size={20}/></button>
        </div>
      </div>
      
      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {days.map(day => {
          const status = getDayStatus(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div 
              key={day.toISOString()} 
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${status ? `status-${status}` : ''}`}
              onClick={() => onDateClick(day)}
            >
              <span className="day-number">{format(day, 'd')}</span>
            </div>
          );
        })}
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
            <span className="dot dot-work"></span> Working Day
        </div>
        <div className="legend-item">
            <span className="dot dot-leave"></span> Leave Day
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
