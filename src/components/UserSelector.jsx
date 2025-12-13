import React, { useState } from 'react';
import { useTime } from '../context/TimeContext';
import { UserPlus, User } from 'lucide-react';

const UserSelector = () => {
  const { users, activeUser, addUser, switchUser } = useTime();
  const [isAdding, setIsAdding] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();
    if (newUserName.trim()) {
      addUser(newUserName.trim());
      setNewUserName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="user-selector card">
      <div className="user-header">
        <div className="current-user">
            <User size={20} className="icon" />
            <select 
                value={activeUser?.id} 
                onChange={(e) => switchUser(e.target.value)}
                className="user-select"
            >
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </select>
        </div>
        <button 
            className="btn-icon" 
            onClick={() => setIsAdding(!isAdding)}
            title="Add New Member"
        >
            <UserPlus size={20} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddUser} className="add-user-form">
          <input 
            type="text" 
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Member Name"
            autoFocus
            className="small-input"
          />
          <button type="submit" className="btn-small">Add</button>
        </form>
      )}
    </div>
  );
};

export default UserSelector;
