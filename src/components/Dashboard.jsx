import React, { useState } from 'react';
import { useTime } from '../context/TimeContext';
import { getWeeklySummary, getMonthlySummary, getLeaveCount } from '../utils/analytics';
import { Trash2, Clock, Calendar, AlertCircle, X } from 'lucide-react';
import CalendarView from './CalendarView';
import { format, isSameDay, parseISO } from 'date-fns';

const Dashboard = () => {
  const { entries, deleteEntry, activeUser } = useTime();
  const [selectedDate, setSelectedDate] = useState(null);

  const weeklyHours = getWeeklySummary(entries).toFixed(1);
  const monthlyHours = getMonthlySummary(entries).toFixed(1);
  const totalLeaves = getLeaveCount(entries);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  const selectedDateEntries = selectedDate 
    ? entries.filter(e => isSameDay(parseISO(e.date), selectedDate))
    : [];

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Clock size={24} /></div>
          <div className="stat-content">
            <h3>This Week</h3>
            <p className="stat-value">{weeklyHours} hrs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Calendar size={24} /></div>
          <div className="stat-content">
            <h3>This Month</h3>
            <p className="stat-value">{monthlyHours} hrs</p>
          </div>
        </div>
        <div className="stat-card leave-card">
          <div className="stat-icon alert"><AlertCircle size={24} /></div>
          <div className="stat-content">
            <h3>Total Leaves</h3>
            <p className="stat-value">{totalLeaves}</p>
          </div>
        </div>
      </div>

      <CalendarView entries={entries} onDateClick={handleDateClick} />

      {selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Tasks for {format(selectedDate, 'MMMM d, yyyy')}</h2>
                    <button className="btn-icon" onClick={closeModal}><X size={24} /></button>
                </div>
                
                <div className="modal-body">
                    {selectedDateEntries.length === 0 ? (
                        <p className="empty-state">No activity logged for this day.</p>
                    ) : (
                        <div className="day-entries">
                            {selectedDateEntries.map((entry) => (
                                <div key={entry.id} className={`day-entry ${entry.type}`}>
                                    <div className="entry-header">
                                        <span className={`badge ${entry.type}`}>{entry.type === 'work' ? 'WORK' : 'LEAVE'}</span>
                                        {entry.type === 'work' && <span className="entry-time">{entry.startTime} - {entry.endTime} ({entry.duration.toFixed(1)}h)</span>}
                                        <button onClick={() => deleteEntry(entry.id)} className="btn-icon delete-btn"><Trash2 size={16} /></button>
                                    </div>
                                    
                                    <div className="entry-tasks">
                                        {entry.type === 'work' ? (
                                            <ul className="task-list">
                                                {entry.description.split(',').map((task, idx) => (
                                                    <li key={idx} className="task-item">{task.trim()}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="leave-reason">{entry.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
