import React, { useState } from 'react';
import type { User } from '../types';
import { View } from '../App';
import Icon from './Icon';
import Button from './Button';

interface CreatorLayoutProps {
    currentUser: User;
    view: View;
    setView: (view: View) => void;
    onLogout: () => void;
    onAddNewProduct: () => void;
    children: React.ReactNode;
}

const navItems = [
    { view: 'dashboard', icon: 'chart-bar', label: 'Overview' },
    { view: 'products', icon: 'briefcase', label: 'Products' },
    { view: 'students', icon: 'user', label: 'Students' },
    { view: 'marketing', icon: 'share', label: 'Marketing' },
    { view: 'site_editor', icon: 'palette', label: 'Site Editor' },
    { view: 'settings', icon: 'settings', label: 'Settings' },
] as const;

const externalNavItems = [
    { view: 'storefront', icon: 'store', label: 'View Storefront' },
    { view: 'student_library', icon: 'library', label: 'View Student Library' },
] as const;

// Fix: Removed 'onboarding' as it's not a valid key for the 'View' type.
// The onboarding flow is handled by a different page state, not within the CreatorLayout.
const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard Overview',
    products: 'Product Management',
    students: 'Student Management',
    marketing: 'Marketing Tools',
    settings: 'Settings',
    site_editor: 'Site Editor',
    storefront: 'Storefront',
    student_library: 'My Library',
    affiliate_dashboard: 'Affiliate Dashboard',
    course_player: 'Course Player',
};

const CreatorLayout: React.FC<CreatorLayoutProps> = ({ currentUser, view, setView, onLogout, onAddNewProduct, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const NavLink: React.FC<{
        item: typeof navItems[number] | typeof externalNavItems[number];
        isExternal?: boolean;
    }> = ({ item, isExternal = false }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setView(item.view);
                setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                view === item.view
                    ? 'bg-cyan-100 text-cyan-800 font-semibold'
                    : `text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${isExternal ? 'font-normal' : 'font-medium'}`
            }`}
        >
            <Icon name={item.icon} className="w-5 h-5 shrink-0" />
            <span>{item.label}</span>
            {isExternal && <Icon name="external-link" className="w-4 h-4 ml-auto text-gray-400" />}
        </a>
    );

    const sidebarContent = (
         <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <a href="#" onClick={(e) => { e.preventDefault(); setView('dashboard'); }} className="font-bold text-2xl text-cyan-600">
                    CourseCraft
                </a>
            </div>
            <nav className="flex-1 space-y-1 p-3">
                {navItems.map(item => <NavLink key={item.view} item={item} />)}
            </nav>
            <div className="p-3 border-t">
                <div className="space-y-1">
                    {externalNavItems.map(item => <NavLink key={item.view} item={item} isExternal />)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r hidden lg:block shrink-0">
                {sidebarContent}
            </aside>
            
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 {sidebarContent}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{viewTitles[view] || 'CourseCraft'}</h1>
                            <p className="text-sm text-gray-500 hidden sm:block">Welcome back, {currentUser.name}!</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={onAddNewProduct} size="sm" className="hidden sm:inline-flex">
                            <Icon name="plus" className="w-4 h-4" />
                            <span className="ml-2">Add Product</span>
                        </Button>
                        <div className="relative">
                            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                {currentUser.name.charAt(0)}
                            </button>
                             {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20" onMouseLeave={() => setIsUserMenuOpen(false)}>
                                    <div className="py-1">
                                        <a href="#" onClick={e => { e.preventDefault(); setView('settings'); setIsUserMenuOpen(false);}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                            <Icon name="logout" className="w-4 h-4" />
                                            Log out
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 sm:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default CreatorLayout;