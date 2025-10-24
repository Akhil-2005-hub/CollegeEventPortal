import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../context/AuthContext';
import { SunIcon, MoonIcon, MenuIcon, XIcon, SparklesIcon } from './icons/Icons';

const Header: React.FC = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-500 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-600 dark:text-primary-400">
              <SparklesIcon className="h-6 w-6" />
              <span>Eventify</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/events" className={navLinkClass}>Events</NavLink>
              <NavLink to="/calendar" className={navLinkClass}>Calendar</NavLink>
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
               {isAuthenticated && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
            </div>
          </div>
          <div className="flex items-center">
             {isAuthenticated ? (
                <button onClick={logout} className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 mr-4">Logout</button>
             ) : (
                <div className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">Guest</div>
             )}
            <button
              onClick={() => toggleDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-primary-500"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Open main menu"
              >
                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/events" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Events</NavLink>
            <NavLink to="/calendar" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Calendar</NavLink>
            <NavLink to="/admin" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>
            {isAuthenticated ? (
                <>
                    <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
                    <a onClick={() => { logout(); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">Logout</a>
                </>
            ) : (
                 <div className="px-3 py-2 text-sm font-medium text-gray-500">Guest</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
