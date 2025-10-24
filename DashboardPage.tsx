import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Event } from '../types';

const DashboardPage: React.FC = () => {
    const { user, registrations, logout, cancelRegistration, friends, addFriend, removeFriend } = useAuth();
    const { events, loading } = useEvents();
    const [cancellationMessage, setCancellationMessage] = useState('');
    const [friendName, setFriendName] = useState('');
    const [friendEmail, setFriendEmail] = useState('');

    const { upcoming, past } = useMemo(() => {
        const upcoming: Event[] = [];
        const past: Event[] = [];
        registrations.forEach(reg => {
            const event = events.find(e => e.id === reg.eventId);
            if (event) {
                if (new Date(event.date) < new Date()) {
                    past.push(event);
                } else {
                    upcoming.push(event);
                }
            }
        });
        return { upcoming, past };
    }, [registrations, events]);

    const handleCancel = (eventId: string) => {
        cancelRegistration(eventId);
        setCancellationMessage('Cancellation request sent. You will be contacted by the event organizer via email regarding your refund if applicable. For this demo, the event has been removed from your list.');
        setTimeout(() => setCancellationMessage(''), 8000);
    };

    const handleAddFriend = (e: React.FormEvent) => {
        e.preventDefault();
        if (friendName && friendEmail) {
            addFriend(friendName, friendEmail);
            setFriendName('');
            setFriendEmail('');
        }
    };

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (!user) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Please log in to view your dashboard.</h2>
                <p className="mt-2 text-gray-500">You will be redirected.</p>
            </div>
        );
    }

    const findRegistrationForEvent = (eventId: string) => registrations.find(r => r.eventId === eventId);

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-extrabold">Welcome, {user.name}!</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">{user.email} - {user.college}</p>
                 <button onClick={logout} className="mt-4 text-sm font-medium text-red-600 hover:text-red-800">Logout</button>
            </div>

            {cancellationMessage && (
                <div className="p-4 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg text-blue-800 dark:text-blue-200">
                    {cancellationMessage}
                </div>
            )}

            {/* Upcoming Events */}
            <section>
                <h2 className="text-3xl font-bold mb-6">Your Upcoming Events</h2>
                {upcoming.length > 0 ? (
                    <div className="space-y-6">
                        {upcoming.map(event => {
                            const registration = findRegistrationForEvent(event.id);
                            return (
                                <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6 items-center">
                                    <img src={event.imageUrl} alt={event.title} className="w-full md:w-48 h-48 md:h-full object-cover rounded-md" />
                                    <div className="flex-grow">
                                        <Link to={`/event/${event.id}`} className="text-2xl font-bold hover:text-primary-500">{event.title}</Link>
                                        <p className="text-gray-600 dark:text-gray-400">{event.college}</p>
                                        <p className="font-semibold mt-1">{new Date(event.date).toLocaleString()}</p>
                                        <p>{event.venue}</p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="p-2 bg-white rounded-lg"><QRCodeSVG value={registration?.qrCodeValue || ''} size={128} /></div>
                                        <p className="text-xs text-center text-gray-500">Your unique entry code</p>
                                        <button onClick={() => handleCancel(event.id)} className="w-full text-center bg-red-100 text-red-800 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-200 transition-colors">
                                            Request Cancellation
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p>You have no upcoming registered events. <Link to="/events" className="text-primary-500 hover:underline">Explore events</Link>.</p>
                )}
            </section>
            
             {/* Past Events */}
            <section>
                <h2 className="text-3xl font-bold mb-6">Your Past Events</h2>
                {past.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {past.map(event => (
                             <div key={event.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover rounded-md mb-4" />
                                <h3 className="font-bold">{event.title}</h3>
                                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                                <Link to={`/event/${event.id}`} className="mt-2 block text-center w-full bg-gray-200 dark:bg-gray-700 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600">
                                    View & Give Feedback
                                </Link>
                             </div>
                         ))}
                     </div>
                ) : (
                    <p>You haven't attended any events yet.</p>
                )}
            </section>

             {/* Add Friends for Bulk Booking */}
            <section>
                <h2 className="text-3xl font-bold mb-6">Manage Friends</h2>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <p className="mb-4 text-gray-600 dark:text-gray-400">Add your friends' details here to quickly register them for events along with you.</p>
                    <form onSubmit={handleAddFriend} className="flex flex-col md:flex-row gap-4 mb-6">
                        <input type="text" placeholder="Friend's Name" value={friendName} onChange={e => setFriendName(e.target.value)} required className="flex-grow px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-primary-500"/>
                        <input type="email" placeholder="Friend's Email" value={friendEmail} onChange={e => setFriendEmail(e.target.value)} required className="flex-grow px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-primary-500"/>
                        <button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700">Add Friend</button>
                    </form>
                    {friends.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold">Your Friends:</h3>
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {friends.map(friend => (
                                    <li key={friend.id} className="py-2 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{friend.name}</p>
                                            <p className="text-sm text-gray-500">{friend.email}</p>
                                        </div>
                                        <button onClick={() => removeFriend(friend.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                 </div>
            </section>
        </div>
    );
};

export default DashboardPage;