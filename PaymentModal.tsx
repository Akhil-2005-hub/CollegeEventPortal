import React, { useState, useEffect } from 'react';
import { Event, Friend } from '../types';
import { useAuth } from '../context/AuthContext';
import { XIcon } from './icons/Icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, event }) => {
  const { registerForEvent, friends } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setIsProcessing(false);
      setIsSuccess(false);
      setSelectedFriends([]);
    }
  }, [isOpen]);
  
  const handleFriendToggle = (friend: Friend) => {
    setSelectedFriends(prev => 
        prev.find(f => f.id === friend.id)
            ? prev.filter(f => f.id !== friend.id)
            : [...prev, friend]
    );
  };

  const totalAttendees = 1 + selectedFriends.length;
  const totalPrice = event.price * totalAttendees;
  const spotsAvailable = event.capacity - event.attendees;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAttendees > spotsAvailable) {
        alert(`Not enough spots available. Only ${spotsAvailable} spots left.`);
        return;
    }
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      // In a real app, you'd create registrations for all selected attendees.
      // For this demo, we'll just register the main user.
      registerForEvent(event.id);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
          onClose();
      }, 2000);
    }, 1500);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            <XIcon className="h-6 w-6" />
        </button>

        {isSuccess ? (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
                <p className="mt-2">You and your friends are registered. You can view this event in your dashboard.</p>
            </div>
        ) : (
            <>
                <h2 className="text-2xl font-bold mb-2">Complete Registration</h2>
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">{event.title}</p>
                
                {friends.length > 0 && spotsAvailable > 1 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Register friends too?</h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                            {friends.map(friend => (
                                <div key={friend.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`friend-${friend.id}`}
                                        checked={selectedFriends.some(f => f.id === friend.id)}
                                        onChange={() => handleFriendToggle(friend)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <label htmlFor={`friend-${friend.id}`} className="ml-3 block text-sm">
                                        {friend.name} ({friend.email})
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {event.price > 0 ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium">Card Number</label>
                                <input type="text" placeholder="•••• •••• •••• ••••" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 p-2" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium">Expiry Date</label>
                                    <input type="text" placeholder="MM/YY" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 p-2" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium">CVC</label>
                                    <input type="text" placeholder="•••" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 p-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Name on Card</label>
                                <input type="text" placeholder="Priya Sharma" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 p-2" />
                            </div>
                            <p className="text-sm text-gray-500">This is a demo. No real payment will be processed.</p>
                        </>
                    ) : <p className="text-center font-medium">Confirm your free registration for {totalAttendees} person(s).</p>}
                    
                    <button type="submit" disabled={isProcessing || totalAttendees > spotsAvailable} className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400">
                        {isProcessing ? 'Processing...' : (event.price > 0 ? `Pay ₹${totalPrice} for ${totalAttendees} person(s)` : `Confirm Registration for ${totalAttendees}`)}
                    </button>
                    {totalAttendees > spotsAvailable && <p className="text-red-500 text-sm text-center mt-2">Not enough spots available for {totalAttendees} people. Only {spotsAvailable} left.</p>}
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;