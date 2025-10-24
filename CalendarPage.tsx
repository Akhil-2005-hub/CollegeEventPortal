import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { Link } from 'react-router-dom';
import { Event } from '../types';

const CalendarPage: React.FC = () => {
  const { events } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  // --- Common Logic ---
  const eventsByDate: { [key: string]: Event[] } = events.reduce((acc, event) => {
    const eventDate = new Date(event.date).toDateString();
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {} as { [key: string]: Event[] });

  const changeDate = (offset: number) => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        if (view === 'month') {
            newDate.setMonth(prev.getMonth() + offset, 1);
        } else {
            newDate.setDate(prev.getDate() + (offset * 7));
        }
        return newDate;
    });
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // --- Month View Logic ---
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDayOfMonth = startOfMonth.getDay();
  const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1));

  // --- Week View Logic ---
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const daysInWeek = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
  });

  const getWeekTitle = () => {
      const endOfWeek = new Date(daysInWeek[6]);
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${startOfWeek.toLocaleString('default', { month: 'long' })} ${startOfWeek.getFullYear()}`;
      }
      return `${startOfWeek.toLocaleString('default', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleString('default', { month: 'short', day: 'numeric' })}, ${endOfWeek.getFullYear()}`;
  };

  const renderDay = (day: Date, isWeekView: boolean = false) => {
    const dayEvents = eventsByDate[day.toDateString()] || [];
    const isToday = day.toDateString() === new Date().toDateString();
    return (
      <div key={day.toISOString()} className={`border rounded-lg p-2 flex flex-col ${isWeekView ? 'min-h-[200px]' : 'min-h-[120px] md:min-h-[160px]'} ${isToday ? 'bg-primary-50 dark:bg-primary-900/50 border-primary-300 dark:border-primary-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
        <div className={`font-bold text-sm ${isToday ? 'text-primary-600 dark:text-primary-300' : ''}`}>{day.getDate()}</div>
        <div className="mt-1 space-y-1 overflow-y-auto">
          {dayEvents.map(event => (
            <Link to={`/event/${event.id}`} key={event.id} className="block p-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded hover:bg-primary-200 dark:hover:bg-primary-800 truncate" title={event.title}>
              {event.title}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
            <button onClick={() => changeDate(-1)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">&lt;</button>
            <button onClick={() => changeDate(1)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">&gt;</button>
             <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Today</button>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-center order-first sm:order-none">
            {view === 'month' ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : getWeekTitle()}
        </h1>
        <div className="flex rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
            <button onClick={() => setView('month')} className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${view === 'month' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Month</button>
            <button onClick={() => setView('week')} className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${view === 'week' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Week</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-bold text-sm md:text-base text-gray-600 dark:text-gray-300 py-2">{day}</div>
        ))}
        
        {view === 'month' ? (
          <>
            {Array.from({ length: startDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="border rounded-lg bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700"></div>
            ))}
            {daysInMonth.map(day => renderDay(day))}
          </>
        ) : (
          <>
            {daysInWeek.map(day => renderDay(day, true))}
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;