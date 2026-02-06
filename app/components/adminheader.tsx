// app/components/adminheader.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiMenu } from 'react-icons/fi';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/web-admin" className="flex items-center space-x-3">
              {/* Logo from public/images/logo.jpg */}
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-blue-50 border border-blue-100">
                <Image
                  src="/images/logo.jpg"
                  alt="IBA School Logo"
                  fill
                  className="object-contain p-1"
                  sizes="40px"
                  priority
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-gray-900">IBA School Admin</h1>
                <p className="text-xs text-gray-500">Management Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Open menu"
          >
            <FiMenu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Desktop: Welcome Text (replaces logout button) */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome, Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}