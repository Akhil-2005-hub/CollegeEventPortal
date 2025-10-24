import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { User } from '../types';

interface FeedbackFormProps {
    eventId: string;
    user: User;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ eventId, user }) => {
    const { addFeedbackToEvent } = useEvents();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            alert('Please provide a rating and a comment.');
            return;
        }
        setIsSubmitting(true);
        await addFeedbackToEvent(eventId, { userName: user.name, rating, comment });
        setRating(0);
        setComment('');
        setIsSubmitting(false);
    }
    
    return (
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4">Leave Your Feedback</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Your Rating</label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button type="button" key={star} onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium">Your Review</label>
                    <textarea 
                        id="comment" 
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={3}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800 focus:ring-primary-500"
                    />
                </div>
                <div className="text-right">
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400">
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FeedbackForm;
