
import { Channel } from '@/types/channel';
import { User } from '@/types/user';

// Helper function to generate random dates
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate mock channels
export const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'Tech Insider',
    description: 'Latest tech news and updates',
    subscriberCount: 1248,
    newSubscribers: 56,
    expiringSubscribers: 23,
    isActive: true,
    createdAt: '2023-02-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Digital Marketing',
    description: 'Marketing strategies and tips',
    subscriberCount: 875,
    newSubscribers: 32,
    expiringSubscribers: 15,
    isActive: true,
    createdAt: '2023-03-22T14:15:00Z',
  },
  {
    id: '3',
    name: 'Crypto Daily',
    description: 'Cryptocurrency updates and analysis',
    subscriberCount: 2103,
    newSubscribers: 128,
    expiringSubscribers: 45,
    isActive: true,
    createdAt: '2023-01-10T09:45:00Z',
  },
  {
    id: '4',
    name: 'Travel Enthusiasts',
    description: 'Travel destinations and tips',
    subscriberCount: 654,
    newSubscribers: 18,
    expiringSubscribers: 7,
    isActive: false,
    createdAt: '2023-04-05T16:20:00Z',
  },
];

// Generate mock users with realistic data
const generateMockUsers = (): User[] => {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const users: User[] = [];
  const userNames = [
    'John Smith', 'Emma Johnson', 'Michael Brown', 'Sophia Williams', 'William Davis',
    'Olivia Miller', 'James Wilson', 'Ava Moore', 'Benjamin Taylor', 'Charlotte Anderson',
    'Alexander White', 'Amelia Harris', 'Daniel Martin', 'Mia Thompson', 'Matthew Garcia',
    'Emily Martinez', 'Ethan Robinson', 'Abigail Clark', 'Jayden Lewis', 'Elizabeth Hall',
  ];
  
  // Generate 20 random users
  for (let i = 0; i < 20; i++) {
    const joinedAt = randomDate(oneYearAgo, now);
    
    // Set expiration date between 1 and 180 days from now
    const expiresAtDays = Math.floor(Math.random() * 180) + 1;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresAtDays);
    
    // Determine status based on expiration date
    let status: 'active' | 'expiring' | 'expired' = 'active';
    if (expiresAt < now) {
      status = 'expired';
    } else if (expiresAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      status = 'expiring';
    }
    
    const name = userNames[i];
    const username = name.toLowerCase().replace(' ', '.') + Math.floor(Math.random() * 1000);
    
    users.push({
      id: `user${i + 1}`,
      name,
      username,
      channelId: mockChannels[Math.floor(Math.random() * mockChannels.length)].id,
      joinedAt: joinedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status,
    });
  }
  
  return users;
};

export const mockUsers = generateMockUsers();

// Statistics for dashboard
export const dashboardStats = {
  totalChannels: mockChannels.length,
  totalSubscribers: mockChannels.reduce((sum, channel) => sum + channel.subscriberCount, 0),
  activeChannels: mockChannels.filter(channel => channel.isActive).length,
  newSubscribersThisWeek: mockChannels.reduce((sum, channel) => sum + channel.newSubscribers, 0),
  expiringSubscriptions: mockChannels.reduce((sum, channel) => sum + channel.expiringSubscribers, 0),
  averageSubscriptionLength: 38, // in days
};
