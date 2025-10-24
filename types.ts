export enum Category {
  Workshop = 'Workshop',
  Cultural = 'Cultural',
  Fest = 'Fest',
  Seminar = 'Seminar',
  Technical = 'Technical',
}

export interface Organizer {
  name: string;
  contact: string;
}

export interface Feedback {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  college: string;
  category: Category;
  organizer: Organizer;
  imageUrl: string;
  attendees: number;
  capacity: number;
  price: number; // 0 for free events
  gallery?: string[];
  feedback?: Feedback[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
}

export interface Friend {
    id: string;
    name: string;
    email: string;
}

export interface Registration {
    registrationId: string;
    eventId: string;
    userId: string;
    date: string;
    qrCodeValue: string;
}