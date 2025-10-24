import React from 'react';
import { Feedback } from '../types';

interface FeedbackListProps {
    feedback: Feedback[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedback }) => {
    if (!feedback || feedback.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400">No feedback yet for this event.</p>;
    }

    return (
        <div className="space-y-6">
            {feedback.map(item => (
                <div key={item.id} className="p-4 border-l-4 border-primary-500 bg-gray-50 dark:bg-gray-900 rounded-r-lg">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">{item.userName}</p>
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < item.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>★</span>
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2 italic">"{item.comment}"</p>
                    <p className="text-xs text-gray-400 text-right mt-2">{new Date(item.date).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    )
}

export default FeedbackList;
