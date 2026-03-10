export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'workshop' | 'social' | 'volunteer' | 'meeting';
  imageUrl: string;
  spotsRemaining: number;
}

export const events: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'React Workshop: Building Accessible Components',
    date: '2026-02-20',
    time: '6:00 PM - 8:00 PM',
    location: 'Clark College, Room 204',
    description:
      'Learn how to build React components that work for everyone. We will cover ARIA attributes, keyboard navigation, and screen reader testing.',
    category: 'workshop',
    imageUrl: '/images/react-workshop.jpg',
    spotsRemaining: 12,
  },
  {
    id: 'evt-2',
    title: 'Community Garden Volunteer Day',
    date: '2026-02-22',
    time: '9:00 AM - 12:00 PM',
    location: 'Esther Short Park',
    description:
      'Help us plant spring vegetables and maintain the community garden beds. Bring gloves and water. All experience levels welcome.',
    category: 'volunteer',
    imageUrl: '/images/garden-day.jpg',
    spotsRemaining: 0,
  },
  {
    id: 'evt-3',
    title: 'Friday Game Night',
    date: '2026-02-27',
    time: '7:00 PM - 10:00 PM',
    location: 'Student Union, Main Hall',
    description:
      'Board games, card games, and video games. Snacks provided. Bring your favorite game to share!',
    category: 'social',
    imageUrl: '/images/game-night.jpg',
    spotsRemaining: 30,
  },
  {
    id: 'evt-4',
    title: 'Neighborhood Watch Meeting',
    date: '2026-03-01',
    time: '5:30 PM - 6:30 PM',
    location: 'Community Center, Room B',
    description:
      'Monthly meeting to discuss neighborhood safety, upcoming events, and community concerns. Open to all residents.',
    category: 'meeting',
    imageUrl: '/images/meeting.jpg',
    spotsRemaining: 50,
  },
];