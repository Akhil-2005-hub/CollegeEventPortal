import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import { DarkModeProvider } from './hooks/useDarkMode';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <EventProvider>
          <HashRouter>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <Header />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/event/:id" element={<EventDetailPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </HashRouter>
        </EventProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
