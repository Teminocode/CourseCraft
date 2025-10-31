
import type { Notification } from '../types';

export const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'sale',
        message: 'You made a new sale for "Ultimate Figma Masterclass"!',
        date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        read: false,
    },
    {
        id: '2',
        type: 'review',
        message: 'Jane Doe left a 5-star review on your product.',
        date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: false,
    },
    {
        id: '3',
        type: 'milestone',
        message: 'Congratulations! You reached 100 students.',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
    }
];
