// app/components/admin-sidebar.tsx (using inline code)
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiAward, 
  FiCheckCircle, 
  FiUserPlus, 
  FiImage, 
  FiFileText, 
  FiAward as FiChamps, 
  FiShield,
  FiDollarSign,
  FiX,
  FiLogOut
} from 'react-icons/fi';

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Simple menu items - including Fee menu
  const menuItems = [
    { name: 'Dashboard', href: '/web-admin', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Teachers', href: '/web-admin/teacher', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Alumni', href: '/web-admin/alumni', icon: <FiAward className="w-5 h-5" /> },
    { name: 'Result', href: '/web-admin/result', icon: <FiCheckCircle className="w-5 h-5" /> },
    { name: 'Fee', href: '/web-admin/fee', icon: <FiDollarSign className="w-5 h-5" /> },
    { name: 'Resources', href: '/web-admin/resources', icon: <FiFileText className="w-5 h-5" /> },
    { name: 'Admission', href: '/web-admin/admission', icon: <FiUserPlus className="w-5 h-5" /> },
    { name: 'Champs', href: '/web-admin/champs', icon: <FiChamps className="w-5 h-5" /> },
    { name: 'Security', href: '/web-admin/security', icon: <FiShield className="w-5 h-5" /> },
    { name: 'Gallery', href: '/web-admin/gallery', icon: <FiImage className="w-5 h-5" /> },
  ];

  // Check if current path is active
  const isActive = (href: string) => {
    if (href === '/web-admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call the logout API
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Logout failed');
      }

      // Clear any stored tokens
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        
        // Also clear specific cookies
        document.cookie.split(';').forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
      }

      // Show success message
      console.log('Logout successful:', data.message);
      
      // Redirect to login page after a brief delay
      setTimeout(() => {
        router.push('/web-admin/login');
        router.refresh(); // Refresh to clear any cached auth state
      }, 500);
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Show error message to user
      alert('Logout failed. Please try again.');
      
      // Still redirect to login page on error
      setTimeout(() => {
        router.push('/web-admin/login');
      }, 500);
    } finally {
      setIsLoggingOut(false);
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Fixed Sidebar Container */}
      <aside className={`
        fixed inset-0 top-0 z-40 lg:z-30 lg:top-16
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 flex-shrink-0
        bg-white border-r border-gray-200
        h-screen lg:h-[calc(100vh-4rem)] flex flex-col
      `}>
        
        {/* Mobile Header with Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IBA</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Menu</h1>
            </div>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Scrollable Menu Section */}
        <div className="flex-1 overflow-y-auto pt-2 lg:pt-0">
          <nav className="p-2">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      onMobileClose();
                    }}
                    className={`
                      flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
                      ${active 
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className={`${active ? 'text-blue-600' : 'text-gray-400'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Fixed Logout Button at Bottom */}
        <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 
                     bg-red-50 hover:bg-red-100 text-red-600 rounded-lg 
                     transition-colors duration-200 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}