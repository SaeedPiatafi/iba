// app/web-admin/(admin)/layout.tsx
'use client';

import { ReactNode, useState } from 'react';
import AdminHeader from '@/app/components/adminheader';
import AdminSidebar from '@/app/components/admin-sidebar';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // For login page, render without sidebar/header
  if (pathname === '/web-admin/login') {
    return <>{children}</>;
  }

  // For all other admin pages, render with full layout
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onMenuClick={toggleMobileMenu} />
      <div className="flex">
        <AdminSidebar 
          isMobileOpen={isMobileMenuOpen} 
          onMobileClose={closeMobileMenu} 
        />
        <main className="flex-1 lg:ml-64">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}