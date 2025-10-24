
import React from 'react';
import { Link } from 'react-router-dom';
import { Event, Category } from '../types';
import { CalendarIcon, LocationMarkerIcon, TagIcon, UsersIcon } from './icons/Icons';

interface EventCardProps {
  event: Event;
}

const categoryColors: { [key in Category]: string } = {
  [Category.Workshop]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [Category.Cultural]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [Category.Fest]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  [Category.Seminar]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [Category.Technical]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl flex flex-col">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={event.imageUrl} alt={event.title} />
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[event.category]}`}>
          {event.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-semibold">{event.college}</p>
        
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-primary-500" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <LocationMarkerIcon className="h-4 w-4 mr-2 text-primary-500" />
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
           <Link to={`/event/${event.id}`} className="w-full text-center bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300 block">
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
