import { startOfWeek, startOfMonth, isSameWeek, isSameMonth, parseISO } from 'date-fns';

export const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;

    // Assumes HH:mm format
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    let diff = endMinutes - startMinutes;
    if (diff < 0) diff += 24 * 60; // Handle overnight? For now assume same day

    return diff / 60; // hours
};

export const getWeeklySummary = (entries) => {
    const now = new Date();

    return entries.reduce((acc, entry) => {
        if (entry.type === 'leave') return acc; // Don't count leave in hours
        const entryDate = parseISO(entry.date);
        if (isSameWeek(entryDate, now, { weekStartsOn: 1 })) {
            return acc + (parseFloat(entry.duration) || 0);
        }
        return acc;
    }, 0);
};

export const getMonthlySummary = (entries) => {
    const now = new Date();

    return entries.reduce((acc, entry) => {
        if (entry.type === 'leave') return acc; // Don't count leave in hours
        const entryDate = parseISO(entry.date);
        if (isSameMonth(entryDate, now)) {
            return acc + (parseFloat(entry.duration) || 0);
        }
        return acc;
    }, 0);
};

export const getLeaveCount = (entries) => {
    return entries.filter(e => e.type === 'leave').length;
};
