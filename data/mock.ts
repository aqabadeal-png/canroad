import { User, HomePageCard } from '../types';

// In a real application, this data would come from a secure backend.
export const mockUsers: User[] = [
  {
    id: 'admin-01',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@canroad.example.com',
    phone: '+1-555-ADMIN-01',
    isActive: true,
    password: 'password123',
  },
  {
    id: 'mech-01',
    role: 'mechanic',
    name: 'Mike R.',
    email: 'mike@canroad.example.com',
    phone: '+1-555-123-4567',
    isActive: true,
    password: 'password123',
  },
  {
    id: 'mech-02',
    role: 'mechanic',
    name: 'Sarah Chen',
    email: 'sarah@canroad.example.com',
    phone: '+1-555-234-5678',
    isActive: true,
    password: 'password123',
  },
  {
    id: 'mech-03',
    role: 'mechanic',
    name: 'Leo Martin',
    email: 'leo@canroad.example.com',
    phone: '+1-555-345-6789',
    isActive: false,
    password: 'password123',
  },
  {
    id: 'acc-01',
    role: 'accounting',
    name: 'Finance Dept',
    email: 'accounting@canroad.example.com',
    phone: '+1-555-FIN-ANCE',
    isActive: true,
    password: 'password123',
  }
];

export const mockHomePageCards: HomePageCard[] = [
  {
    id: 'card-1',
    title: 'home.title',
    subtitle: 'home.subtitle',
    imageUrl: 'https://i.imghippo.com/files/hTTg1079AY.png',
    ctaText: 'home.cta',
    isEnabled: true,
    isPrimary: true,
    comingSoon: false,
  },
  {
    id: 'card-2',
    title: 'home.wash.title',
    subtitle: 'home.wash.subtitle',
    imageUrl: 'https://i.imghippo.com/files/aYpM1187J.png',
    ctaText: 'home.wash.cta',
    isEnabled: true,
    isPrimary: false,
    comingSoon: true,
  }
];

// This function will now be part of AuthContext to manage a dynamic list of users.
// We keep the logic here to be moved.
export const findUserByCredentials = (users: User[], email: string, password: string): User | null => {
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  // Check if user exists, is active, and password is correct
  if (user && user.isActive && password === user.password) {
    return user;
  }
  return null;
};