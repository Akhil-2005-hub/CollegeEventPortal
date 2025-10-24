import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Registration, Friend } from '../types';

// Mock User Data
const MOCK_USER: User = {
  id: 'user123',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  college: 'Delhi University'
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  registrations: Registration[];
  friends: Friend[];
  login: () => void;
  logout: () => void;
  registerForEvent: (eventId: string) => void;
  cancelRegistration: (eventId: string) => void;
  hasRegistered: (eventId: string) => boolean;
  addFriend: (name: string, email: string) => void;
  removeFriend: (friendId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
     return isAuthenticated ? MOCK_USER : null;
  });
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem('userRegistrations');
    return saved ? JSON.parse(saved) : [];
  });
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('userFriends');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
    if (isAuthenticated) {
        setUser(MOCK_USER);
    } else {
        setUser(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('userRegistrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('userFriends', JSON.stringify(friends));
  }, [friends]);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    // Optional: clear registrations on logout if desired
    // setRegistrations([]); 
  };

  const registerForEvent = (eventId: string) => {
    if (!isAuthenticated || !user) return;
    if (registrations.some(reg => reg.eventId === eventId)) return;

    const newRegistration: Registration = {
        registrationId: `reg-${eventId}-${user.id}-${Date.now()}`,
        eventId,
        userId: user.id,
        date: new Date().toISOString(),
        qrCodeValue: JSON.stringify({ eventId, userId: user.id, name: user.name })
    };
    setRegistrations(prev => [...prev, newRegistration]);
  };
  
  const cancelRegistration = (eventId: string) => {
    setRegistrations(prev => prev.filter(reg => reg.eventId !== eventId));
  };

  const hasRegistered = (eventId: string): boolean => {
    return registrations.some(reg => reg.eventId === eventId);
  }

  const addFriend = (name: string, email: string) => {
    const newFriend: Friend = { id: `friend-${Date.now()}`, name, email };
    setFriends(prev => [...prev, newFriend]);
  };

  const removeFriend = (friendId: string) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, registrations, friends, login, logout, registerForEvent, cancelRegistration, hasRegistered, addFriend, removeFriend }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};