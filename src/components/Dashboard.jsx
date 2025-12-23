import React, { useState } from 'react';
import { useTime } from '../context/TimeContext';
import { getWeeklySummary, getMonthlySummary, getLeaveCount } from '../utils/analytics';
import { Trash2, Clock, Calendar, AlertCircle, X, Edit2, Check } from 'lucide-react';
import CalendarView from './CalendarView';
import { format, isSameDay, parseISO } from 'date-fns';
import { calculateDuration } from '../utils/analytics';

const Dashboard = () => {
  const { entries, deleteEntry, updateEntry, activeUser } = useTime();
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  const weeklyHours = getWeeklySummary(entries).toFixed(1);
  const monthlyHours = getMonthlySummary(entries).toFixed(1);
  const totalLeaves = getLeaveCount(entries);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setEditingId(null);
  };

  const startEditing = (entry) => {
    setEditingId(entry.id);
    setEditValue(entry.description);
    setEditStartTime(entry.startTime || '');
    setEditEndTime(entry.endTime || '');
  };

  const saveEdit = (id, type) => {
    const updates = { description: editValue };
    if (type === 'work') {
        const duration = calculateDuration(editStartTime, editEndTime);
        updates.startTime = editStartTime;
        updates.endTime = editEndTime;
        updates.duration = duration;
    }
    updateEntry(id, updates);
    setEditingId(null);
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
                                        <div className="header-left">
                                            <span className={`badge ${entry.type}`}>{entry.type === 'work' ? 'WORK' : 'LEAVE'}</span>
                                            {editingId === entry.id ? (
                                                entry.type === 'work' && (
                                                    <div className="edit-times">
                                                        <input type="time" value={editStartTime} onChange={e => setEditStartTime(e.target.value)} className="time-input-inline" />
                                                        <span>-</span>
                                                        <input type="time" value={editEndTime} onChange={e => setEditEndTime(e.target.value)} className="time-input-inline" />
                                                    </div>
                                                )
                                            ) : (
                                                entry.type === 'work' && <span className="entry-time">{entry.startTime} - {entry.endTime} ({entry.duration.toFixed(1)}h)</span>
                                            )}
                                        </div>
                                        <div className="header-actions">
                                            {editingId === entry.id ? (
                                                <button onClick={() => saveEdit(entry.id, entry.type)} className="btn-icon save-btn"><Check size={16} /></button>
                                            ) : (
                                                <button onClick={() => startEditing(entry)} className="btn-icon edit-btn"><Edit2 size={16} /></button>
                                            )}
                                            <button onClick={() => deleteEntry(entry.id)} className="btn-icon delete-btn"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    
                                    <div className="entry-tasks">
                                        {editingId === entry.id ? (
                                            <textarea 
                                                value={editValue} 
                                                onChange={e => setEditValue(e.target.value)} 
                                                className="edit-textarea" 
                                                autoFocus
                                            />
                                        ) : (
                                            entry.type === 'work' ? (
                                                <ul className="task-list">
                                                    {entry.description.split(',').map((task, idx) => (
                                                        <li key={idx} className="task-item">{task.trim()}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="leave-reason">{entry.description}</p>
                                            )
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
