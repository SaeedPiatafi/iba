// components/header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Admin navigation items
  const adminNavItems = [
    { name: 'Teacher', href: '/web-admin/teacher', icon: '👨‍🏫' },
    { name: 'Alumni', href: '/web-admin/alumni', icon: '🎓' },
    { name: 'Result', href: '/web-admin/result', icon: '📊' },
    { name: 'Fee', href: '/web-admin/fee', icon: '💰' },
    { name: 'Gallery', href: '/web-admin/gallery', icon: '🖼️' },
    { name: 'Resources', href: '/web-admin/resources', icon: '📚' },
  ];

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // Example: Clear authentication token and redirect
    // localStorage.removeItem('authToken');
    router.push('/admin-login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Admin Panel Header - Middle Section Only */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Admin Logo */}
            <div className="flex items-center">
              <Link href="/web-admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Dashboard Management</p>
                </div>
              </Link>
            </div>

            {/* Middle: Admin Navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {adminNavItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                  
                  {/* Active indicator */}
                  {(pathname === item.href || pathname.startsWith(item.href + '/')) && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Logout Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Desktop Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 font-medium"
              >
                <span>👋</span>
                <span>Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-4 pt-2 pb-4 space-y-1 border-t border-gray-200 bg-gray-50">
            {adminNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Mobile Logout Button */}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 w-full px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 font-medium"
            >
              <span className="text-xl">👋</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}