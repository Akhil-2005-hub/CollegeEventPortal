import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { CalendarIcon, LocationMarkerIcon, UsersIcon } from '../components/icons/Icons';
import PaymentModal from '../components/PaymentModal';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';


const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEventById } = useEvents();
  const { isAuthenticated, login, hasRegistered, user } = useAuth();
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  
  const event = getEventById(id || '');

  if (!event) {
    return <div className="text-center text-2xl font-bold">Event not found.</div>;
  }

  const addToGoogleCalendar = () => {
    const startTime = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const endTime = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.venue)}`;
    window.open(url, '_blank');
  };
  
  const handleSetReminder = () => {
    setReminderSet(true);
    alert('Reminder set! You will be notified 24 hours before the event. (This is a demo feature)');
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
        alert("Please 'login' to register for events. \n\nFor this demo, a login button will appear in the top right of the header.");
        login(); // Simulate login
    } else {
        setPaymentModalOpen(true);
    }
  };

  const isEventInThePast = new Date(event.date) < new Date();
  const isEventFull = event.attendees >= event.capacity;
  const alreadyRegistered = hasRegistered(event.id);

  const getRegistrationButton = () => {
    if (isEventInThePast) {
        return <button className="w-full text-white font-bold py-3 px-4 rounded-lg bg-gray-500 cursor-not-allowed" disabled>Event Over</button>;
    }
    if (alreadyRegistered) {
        return (
            <div className="space-y-2">
                <button className="w-full text-white font-bold py-3 px-4 rounded-lg bg-green-600 cursor-not-allowed" disabled>Registered</button>
                {!reminderSet ? (
                    <button onClick={handleSetReminder} className="w-full text-center bg-yellow-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
                        Set Reminder
                    </button>
                ) : (
                    <p className="text-sm text-center text-green-700 dark:text-green-300">✓ Reminder is set</p>
                )}
            </div>
        );
    }
    if (isEventFull) {
        return <button className="w-full text-white font-bold py-3 px-4 rounded-lg bg-red-500 cursor-not-allowed" disabled>Event Full</button>;
    }
    return (
        <button 
            onClick={handleRegisterClick}
            className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 bg-primary-600 hover:bg-primary-700"
        >
            {event.price > 0 ? `Register for ₹${event.price}` : 'Register for Free'}
        </button>
    );
  };


  return (
    <>
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        event={event}
      />
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <img className="w-full h-64 md:h-96 object-cover" src={event.imageUrl} alt={event.title} />
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{event.category} at {event.college}</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>{new Date(event.date).toDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <LocationMarkerIcon className="h-5 w-5 mr-2" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    <span>{event.attendees} / {event.capacity} registered</span>
                  </div>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{event.description}</p>
                
                {isEventInThePast && event.gallery && event.gallery.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Event Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.gallery.map((img, index) => (
                        <img key={index} src={img} alt={`Event gallery ${index + 1}`} className="rounded-lg object-cover w-full h-40 hover:opacity-80 transition-opacity" />
                      ))}
                    </div>
                  </div>
                )}

                 {/* Feedback Section */}
                {isEventInThePast && (
                    <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                         <h2 className="text-2xl font-bold mb-4">Event Feedback</h2>
                         {isAuthenticated && alreadyRegistered && <FeedbackForm eventId={event.id} user={user!} />}
                         <FeedbackList feedback={event.feedback || []} />
                    </div>
                )}

              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Registration</h3>
                  {getRegistrationButton()}
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Add to Calendar</h3>
                  <button onClick={addToGoogleCalendar} className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    Google Calendar
                  </button>
                  <button className="w-full mt-2 bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                    Outlook Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;