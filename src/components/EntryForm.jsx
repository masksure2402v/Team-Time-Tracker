import React, { useState } from 'react';
import { useTime } from '../context/TimeContext';
import { calculateDuration } from '../utils/analytics';
import { PlusCircle } from 'lucide-react';

const EntryForm = () => {
  const { addEntry, users, activeUser } = useTime();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('work'); // 'work' or 'leave'
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([activeUser?.id]);
  const [error, setError] = useState('');

  // Update selected user when the active user changes in the dropdown
  React.useEffect(() => {
    if (activeUser && !selectedUserIds.includes(activeUser.id)) {
        setSelectedUserIds([activeUser.id]);
    }
  }, [activeUser]);

  const toggleUserSelection = (userId) => {
    setSelectedUserIds(prev => 
        prev.includes(userId) 
            ? prev.filter(id => id !== userId) 
            : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
        setSelectedUserIds([activeUser.id]);
    } else {
        setSelectedUserIds(users.map(u => u.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (selectedUserIds.length === 0) {
        setError('Please select at least one team member');
        return;
    }

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
    }, selectedUserIds);

    // Reset form
    setStartTime('');
    setEndTime('');
    setDescription('');
    // Keep date, type, and selected users for convenience if doing multiple logs
  };

  return (
    <div className="entry-form-container card">
      <h2>Add Activity Log</h2>
      <form onSubmit={handleSubmit} className="entry-form">
        
        <div className="form-group">
            <label>Apply to Members</label>
            <div className="member-selection-grid">
                <button 
                  type="button" 
                  className={`member-chip all-chip ${selectedUserIds.length === users.length ? 'active' : ''}`}
                  onClick={handleSelectAll}
                >
                    {selectedUserIds.length === users.length ? 'Deselect All' : 'Select All'}
                </button>
                {users.map(user => (
                    <button
                        key={user.id}
                        type="button"
                        className={`member-chip ${selectedUserIds.includes(user.id) ? 'active' : ''}`}
                        onClick={() => toggleUserSelection(user.id)}
                    >
                        {user.name}
                    </button>
                ))}
            </div>
        </div>

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
          <label>Description / Task (comma separated)</label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder={type === 'work' ? "e.g. Design UI, API Integration" : "e.g. Sick Leave, Vacation"}
            required 
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-primary">
          <PlusCircle size={18} style={{ marginRight: '8px' }} />
          Log for {selectedUserIds.length} {selectedUserIds.length === 1 ? 'Member' : 'Members'}
        </button>
      </form>
    </div>
  );
};

export default EntryForm;
