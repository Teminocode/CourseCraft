
import React, { useState } from 'react';
import Icon from './Icon';
// Fix: Use relative path for type imports
import { mockNotifications } from '../data/notifications';

const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = mockNotifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-100">
                <Icon name="user" className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border z-20">
                    <div className="p-4 font-bold border-b">Notifications</div>
                    <ul className="py-2">
                        {mockNotifications.map(n => (
                            <li key={n.id} className={`px-4 py-2 hover:bg-gray-100 ${!n.read ? 'font-semibold' : ''}`}>
                                {n.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
