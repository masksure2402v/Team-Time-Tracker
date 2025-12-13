import React, { useState } from 'react';
import { useTime } from '../context/TimeContext';
import { calculateDuration } from '../utils/analytics';
import { PlusCircle } from 'lucide-react';

const EntryForm = () => {
  const { addEntry } = useTime();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('work'); // 'work' or 'leave'
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    let duration = 0;

    if (type === 'work') {
        if (!startTime || !endTime) {
            setError('Please provide start and end time');
            return;
        }
        duration = calculateDuration(startTime, endTime);
        if (duration <= 0) {
            setError('End time must be after start time');
            return;
        }
    } else {
        // Leave is 0 working hours, but we track it as a leave day
        duration = 0; 
    }

    if (!description) {
      setError('Please provide a description');
      return;
    }

    addEntry({
      date,
      startTime: type === 'work' ? startTime : null,
      endTime: type === 'work' ? endTime : null,
      duration,
      description,
      type
    });

    // Reset form
    setStartTime('');
    setEndTime('');
    setDescription('');
    // Keep date and type for convenience
  };

  return (
    <div className="entry-form-container card">
      <h2>Add Activity Log</h2>
      <form onSubmit={handleSubmit} className="entry-form">
        
        <div className="form-group">
            <label>Entry Type</label>
            <div className="type-toggle">
                <label className={`radio-label ${type === 'work' ? 'active' : ''}`}>
                    <input 
                        type="radio" 
                        name="type" 
                        value="work" 
                        checked={type === 'work'} 
                        onChange={() => setType('work')} 
                    />
                    Work
                </label>
                <label className={`radio-label ${type === 'leave' ? 'active' : ''}`}>
                    <input 
                        type="radio" 
                        name="type" 
                        value="leave" 
                        checked={type === 'leave'} 
                        onChange={() => setType('leave')} 
                    />
                    Leave
                </label>
            </div>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        
        {type === 'work' && (
            <div className="form-row">
            <div className="form-group">
                <label>Start Time</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>End Time</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
            </div>
        )}

        <div className="form-group">
          <label>Description / Task</label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder={type === 'work' ? "e.g. Project TA Meeting" : "e.g. Sick Leave, Vacation"}
            required 
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-primary">
          <PlusCircle size={18} style={{ marginRight: '8px' }} />
          Add {type === 'work' ? 'Work' : 'Leave'} Entry
        </button>
      </form>
    </div>
  );
};

export default EntryForm;
