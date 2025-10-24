import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Event, Feedback } from '../types';
import { getEvents, addEvent as addEventApi, addFeedback as addFeedbackApi } from '../services/mockApi';

interface EventContextType {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id' | 'attendees' | 'feedback'>) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  addFeedbackToEvent: (eventId: string, feedbackData: Omit<Feedback, 'id'|'date'>) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const addEvent = async (eventData: Omit<Event, 'id' | 'attendees' | 'feedback'>) => {
    const newEvent = await addEventApi(eventData);
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const getEventById = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };
  
  const addFeedbackToEvent = async (eventId: string, feedbackData: Omit<Feedback, 'id'|'date'>) => {
    const newFeedback = await addFeedbackApi(eventId, feedbackData);
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === eventId) {
        return { ...event, feedback: [...(event.feedback || []), newFeedback] };
      }
      return event;
    }));
  };

  return (
    <EventContext.Provider value={{ events, loading, addEvent, getEventById, addFeedbackToEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
