import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },

  {
    title: 'Competitive Calls',
    url: '/dashboard/open-calls',
    icon: 'billing', // Using billing icon as a placeholder for grants/money
    shortcut: ['o', 'c'],
    isActive: false,
    items: []
  },
  {
    title: 'Bilateral',
    url: '/dashboard/bilateral-engagements',
    icon: 'user', // Using user icon for relationships
    shortcut: ['b', 'e'],
    isActive: false,
    items: []
  },
  {
    title: 'Opportunities',
    url: '/dashboard/opportunities',
    icon: 'search', // Using search icon for finding opportunities
    shortcut: ['o', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Team',
    url: '/dashboard/team',
    icon: 'user',
    shortcut: ['t', 'm'],
    isActive: false,
    allowedRoles: ['admin'],
    items: []
  },
  {
    title: 'Grant Drafter',
    url: '/dashboard/grant-drafter',
    icon: 'user', // Placeholder, ideally a document or pencil icon if available
    shortcut: ['g', 'd'],
    isActive: false,
    items: []
  },
  {
    title: 'Knowledge',
    url: '/dashboard/knowledge',
    icon: 'page',
    shortcut: ['k', 'b'],
    isActive: false,
    items: []
  },
  {
    title: 'External Drives',
    url: '/dashboard/external-drives',
    icon: 'cloud',
    shortcut: ['e', 'd'],
    isActive: false,
    items: []
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];

export interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  initials: string;
}

export const dummyUsers: User[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
