
import React from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { events, loading } = useEvents();

  const featuredEvent = events[0];
  const upcomingEvents = events.slice(1, 7);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Event Hero Section */}
      {featuredEvent && (
        <div className="relative bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <img src={`${featuredEvent.imageUrl.split('seed')[0]}seed/hero/1600/600`} alt={featuredEvent.title} className="absolute inset-0 w-full h-full object-cover opacity-30"/>
          <div className="relative container mx-auto px-6 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              {featuredEvent.title}
            </h1>
            <p className="text-lg md:text-xl text-primary-300 mb-2 font-semibold">
              {featuredEvent.college}
            </p>
            <p className="text-xl md:text-2xl text-white mb-8">
              {new Date(featuredEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <Link to={`/event/${featuredEvent.id}`} className="bg-primary-600 text-white font-bold py-3 px-8 rounded-full hover:bg-primary-700 transition-transform transform hover:scale-105 duration-300 text-lg">
              Discover More
            </Link>
          </div>
        </div>
      )}

      {/* Upcoming Events Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="text-center mt-12">
            <Link to="/events" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-8 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                View All Events
            </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
