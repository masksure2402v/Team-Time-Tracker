import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TimeContext = createContext();

export const useTime = () => {
  return useContext(TimeContext);
};

export const TimeProvider = ({ children }) => {
  // Users Entry
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('ta_users');
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Default User' }];
  });

  const [activeUserId, setActiveUserId] = useState(() => {
    return localStorage.getItem('ta_active_user') || 'default';
  });

  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('ta_entries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ta_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ta_active_user', activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem('ta_entries', JSON.stringify(entries));
  }, [entries]);

  const addUser = (name) => {
    const newUser = { id: uuidv4(), name };
    setUsers((prev) => [...prev, newUser]);
    setActiveUserId(newUser.id);
  };

  const switchUser = (id) => {
    setActiveUserId(id);
  };

  const addEntry = (entry, userIds = null) => {
    const targets = userIds || [activeUserId];
    const newEntries = targets.map(uid => ({
      id: uuidv4(),
      userId: uid,
      createdAt: new Date().toISOString(),
      type: entry.type || 'work', // 'work' or 'leave'
      ...entry,
    }));
    setEntries((prev) => [...newEntries, ...prev]);
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id, updatedFields) => {
    setEntries((prev) => prev.map((entry) => 
      entry.id === id ? { ...entry, ...updatedFields } : entry
    ));
  };

  // Filter entries for the active user
  const userEntries = entries.filter((entry) => entry.userId === activeUserId || (!entry.userId && activeUserId === 'default'));
  const activeUser = users.find(u => u.id === activeUserId) || users[0];

  return (
    <TimeContext.Provider value={{ 
      entries: userEntries, 
      allEntries: entries,
      addEntry, 
      deleteEntry,
      updateEntry,
      users,
      activeUser,
      addUser,
      switchUser
    }}>
      {children}
    </TimeContext.Provider>
  );
};
