// FIX: Import the `Feedback` type to resolve reference errors.
import { Event, Category, Feedback } from '../types';

let mockEvents: Event[] = [
  {
    id: '1',
    title: 'TechKriti 2024 - Annual Tech Fest',
    description: 'A grand celebration of technology and innovation at IIT Kanpur. Join us for coding competitions, robotics workshops, and expert talks from industry leaders. A platform for students to showcase their technical prowess and learn about the latest trends in the tech world.',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Main Auditorium, IIT Kanpur',
    college: 'Indian Institute of Technology, Kanpur',
    category: Category.Technical,
    organizer: { name: 'Dept. of Computer Science', contact: 'techkriti@iitk.ac.in' },
    imageUrl: 'https://picsum.photos/seed/techfest/800/600',
    attendees: 450,
    capacity: 500,
    price: 250,
    gallery: ['https://picsum.photos/seed/gallery1/800/600', 'https://picsum.photos/seed/gallery2/800/600', 'https://picsum.photos/seed/gallery3/800/600'],
    feedback: [],
  },
  {
    id: '2',
    title: 'Mood Indigo - Cultural Extravaganza',
    description: 'Experience a mesmerizing evening of music, dance, and drama at Asia\'s largest college cultural festival. Mood Indigo at IIT Bombay brings together talented artists from various colleges to create a cultural spectacle. From classical performances to modern pop, there\'s something for everyone.',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Open Air Theatre, IIT Bombay',
    college: 'Indian Institute of Technology, Bombay',
    category: Category.Cultural,
    organizer: { name: 'Student Cultural Committee', contact: 'moodi@iitb.ac.in' },
    imageUrl: 'https://picsum.photos/seed/cultural/800/600',
    attendees: 800,
    capacity: 1000,
    price: 500,
    feedback: [],
  },
   {
    id: '6',
    title: 'Past Coding Workshop',
    description: 'A look back at our intensive coding workshop where participants built amazing projects.',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'CS Block, Delhi University',
    college: 'Delhi University',
    category: Category.Workshop,
    organizer: { name: 'Coding Society', contact: 'code@du.ac.in' },
    imageUrl: 'https://picsum.photos/seed/pastworkshop/800/600',
    attendees: 60,
    capacity: 60,
    price: 100,
    gallery: ['https://picsum.photos/seed/pastgallery1/800/600', 'https://picsum.photos/seed/pastgallery2/800/600'],
    feedback: [
        { id: 'f1', userName: 'Aisha Sharma', rating: 5, comment: 'Amazing workshop! Learned so much.', date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()},
        { id: 'f2', userName: 'Rohan Verma', rating: 4, comment: 'Great content, but could have been longer.', date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()}
    ],
  },
  {
    id: '3',
    title: 'AI & Machine Learning Workshop',
    description: 'A hands-on workshop covering the fundamentals of Artificial Intelligence and Machine Learning. Participants will build their own models and work on real-world datasets. Perfect for beginners and enthusiasts alike. Hosted by BITS Pilani.',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Room 404, Innovation Hub, BITS Pilani',
    college: 'Birla Institute of Technology and Science, Pilani',
    category: Category.Workshop,
    organizer: { name: 'AI Club', contact: 'ai-club@bits-pilani.ac.in' },
    imageUrl: 'https://picsum.photos/seed/workshop/800/600',
    attendees: 45,
    capacity: 50,
    price: 150,
    gallery: ['https://picsum.photos/seed/gallery4/800/600'],
    feedback: [],
  },
  {
    id: '4',
    title: 'E-Summit by FMS Delhi',
    description: 'A seminar series featuring successful entrepreneurs and venture capitalists. Learn about the startup ecosystem, funding strategies, and the journey of building a successful business from scratch. An invaluable opportunity for aspiring entrepreneurs.',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Convention Hall, FMS Delhi',
    college: 'Faculty of Management Studies, Delhi',
    category: Category.Seminar,
    organizer: { name: 'E-Cell', contact: 'ecell@fms.edu' },
    imageUrl: 'https://picsum.photos/seed/seminar/800/600',
    attendees: 250,
    capacity: 300,
    price: 0,
    feedback: [],
  },
  {
    id: '5',
    title: 'Oasis - The Annual College Fest',
    description: 'The biggest fest of the year is here! Oasis at BITS Pilani is a 4-day mega event with pro-shows, celebrity performances, gaming tournaments, food stalls, and much more. Get ready for an unforgettable experience.',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'BITS Campus, Pilani',
    college: 'Birla Institute of Technology and Science, Pilani',
    category: Category.Fest,
    organizer: { name: 'Student Union', contact: 'oasis@bits-pilani.ac.in' },
    imageUrl: 'https://picsum.photos/seed/fest/800/600',
    attendees: 1800,
    capacity: 2000,
    price: 1200,
    feedback: [],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getEvents = async (): Promise<Event[]> => {
  await delay(500);
  return [...mockEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const addEvent = async (eventData: Omit<Event, 'id' | 'attendees' | 'feedback'>): Promise<Event> => {
  await delay(500);
  const newEvent: Event = {
    ...eventData,
    id: String(Date.now()),
    attendees: 0,
    feedback: [],
  };
  mockEvents.unshift(newEvent);
  return newEvent;
};

export const addFeedback = async (eventId: string, feedbackData: Omit<Feedback, 'id' | 'date'>): Promise<Feedback> => {
    await delay(300);
    const newFeedback: Feedback = {
        ...feedbackData,
        id: String(Date.now()),
        date: new Date().toISOString(),
    };
    const eventIndex = mockEvents.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        mockEvents[eventIndex].feedback?.push(newFeedback);
    }
    return newFeedback;
}