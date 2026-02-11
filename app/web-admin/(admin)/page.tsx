// app/web-admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiHome,
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiDollarSign,
  FiFileText,
  FiUserPlus,
  FiImage,
  FiMessageSquare,
  FiBookOpen,
  FiActivity
} from 'react-icons/fi';

// Custom Champ icon component
const FiChamps = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default function AdminDashboardPage() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const quickLinks = [
    {
      title: 'Teachers Management',
      description: 'Manage teaching staff, profiles and information',
      icon: <FiUsers className="w-6 h-6" />,
      href: '/web-admin/teacher',
      color: 'blue'
    },
    {
      title: 'Alumni Management',
      description: 'Track and manage alumni records',
      icon: <FiAward className="w-6 h-6" />,
      href: '/web-admin/alumni',
      color: 'green'
    },
    {
      title: 'Results Management',
      description: 'Upload and manage exam results',
      icon: <FiCheckCircle className="w-6 h-6" />,
      href: '/web-admin/result',
      color: 'purple'
    },
    {
      title: 'Fee Management',
      description: 'Create and manage fee structures',
      icon: <FiDollarSign className="w-6 h-6" />,
      href: '/web-admin/fee',
      color: 'yellow'
    },
    {
      title: 'Resources Management',
      description: 'Manage study materials and resources',
      icon: <FiBookOpen className="w-6 h-6" />,
      href: '/web-admin/resources',
      color: 'indigo'
    },
    {
      title: 'Admissions',
      description: 'Process and track student admissions',
      icon: <FiUserPlus className="w-6 h-6" />,
      href: '/web-admin/admission',
      color: 'pink'
    },
    {
      title: 'Champions',
      description: 'Manage champion students and achievements',
      icon: <FiChamps />,
      href: '/web-admin/champs',
      color: 'red'
    },
    {
      title: 'Gallery Management',
      description: 'Upload and manage gallery images',
      icon: <FiImage className="w-6 h-6" />,
      href: '/web-admin/gallery',
      color: 'teal'
    },
    {
      title: 'Testimonials',
      description: 'Manage student and parent testimonials',
      icon: <FiMessageSquare className="w-6 h-6" />,
      href: '/web-admin/testimonials',
      color: 'orange'
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
      text: 'text-blue-700',
      icon: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      hover: 'hover:bg-green-100',
      text: 'text-green-700',
      icon: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100',
      text: 'text-purple-700',
      icon: 'text-purple-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      hover: 'hover:bg-yellow-100',
      text: 'text-yellow-700',
      icon: 'text-yellow-600'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      hover: 'hover:bg-indigo-100',
      text: 'text-indigo-700',
      icon: 'text-indigo-600'
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      hover: 'hover:bg-pink-100',
      text: 'text-pink-700',
      icon: 'text-pink-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      hover: 'hover:bg-red-100',
      text: 'text-red-700',
      icon: 'text-red-600'
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      hover: 'hover:bg-teal-100',
      text: 'text-teal-700',
      icon: 'text-teal-600'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100',
      text: 'text-orange-700',
      icon: 'text-orange-600'
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <div className="flex items-center">
          <p className="text-gray-600 mr-4">Welcome back! {greeting}!</p>
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Admin
          </span>
        </div>
      </div>

      {/* Quick Action Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link, index) => {
          const colors = colorClasses[link.color as keyof typeof colorClasses];
          
          return (
            <Link
              key={index}
              href={link.href}
              className={`block p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colors.bg} ${colors.border} ${colors.hover}`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${colors.bg.replace('50', '100')}`}>
                  <div className={colors.icon}>
                    {link.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${colors.text}`}>
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {link.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className={`${colors.icon} opacity-70`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              
              {/* Progress/Status Indicator (optional - can be dynamic later) */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-1 bg-white rounded-full border">
                  Manage
                </span>
                <span className="text-xs text-gray-500">
                  Click to open
                </span>
              </div>
            </Link>
          );
        })}
      </div>


      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help? Contact system administrator or refer to the user guide.
        </p>
      </div>
    </div>
  );
}