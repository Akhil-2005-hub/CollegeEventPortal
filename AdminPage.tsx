
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useEvents } from '../context/EventContext';
import { Category, Event } from '../types';
import { generateEventDescription } from '../services/geminiService';
import { SparklesIcon } from '../components/icons/Icons';

type NewEventData = Omit<Event, 'id' | 'attendees' | 'gallery'>;

const AdminPage: React.FC = () => {
  const { addEvent } = useEvents();
  const [formData, setFormData] = useState<NewEventData>({
    title: '',
    description: '',
    date: '',
    venue: '',
    college: '',
    category: Category.Workshop,
    organizer: { name: '', contact: '' },
    imageUrl: '',
    capacity: 100,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'organizerName' || name === 'organizerContact') {
      setFormData(prev => ({
        ...prev,
        organizer: { ...prev.organizer, [name === 'organizerName' ? 'name' : 'contact']: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.category) {
      alert('Please enter a title and select a category first.');
      return;
    }
    setIsGenerating(true);
    setFormData(prev => ({ ...prev, description: '' }));
    
    try {
      const stream = generateEventDescription(formData.title, formData.category);
      for await (const chunk of stream) {
        setFormData(prev => ({ ...prev, description: prev.description + chunk }));
      }
    } catch (error) {
      console.error(error);
      setFormData(prev => ({ ...prev, description: 'Failed to generate description.' }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage('Creating event...');
    try {
      // Use picsum for image URL if not provided
      const finalFormData = {
        ...formData,
        imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.title.replace(/\s/g, '')}/800/600`,
        capacity: Number(formData.capacity),
      };
      await addEvent(finalFormData);
      setStatusMessage('Event created successfully!');
      // Reset form
       setFormData({
          title: '', description: '', date: '', venue: '', college: '', category: Category.Workshop,
          organizer: { name: '', contact: '' }, imageUrl: '', capacity: 100,
       });
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      setStatusMessage('Failed to create event.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700">
              {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <div className="relative">
            <textarea ref={descriptionRef} name="description" id="description" rows={4} value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700"></textarea>
            <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400">
              <SparklesIcon className="h-4 w-4 mr-1" />
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="college" className="block text-sm font-medium text-gray-700 dark:text-gray-300">College Name</label>
                <input type="text" name="college" id="college" value={formData.college} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Venue</label>
                <input type="text" name="venue" id="venue" value={formData.venue} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
                <input type="datetime-local" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</label>
                <input type="number" name="capacity" id="capacity" value={formData.capacity} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
                <label htmlFor="organizerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organizer Name</label>
                <input type="text" name="organizerName" id="organizerName" value={formData.organizer.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div>
                <label htmlFor="organizerContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organizer Contact</label>
                <input type="email" name="organizerContact" id="organizerContact" value={formData.organizer.contact} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700" />
            </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL (Optional)</label>
          <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Defaults to a random image" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700" />
        </div>

        <div className="text-right">
          <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Create Event
          </button>
        </div>
        {statusMessage && <p className="text-center text-green-600 dark:text-green-400">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default AdminPage;
