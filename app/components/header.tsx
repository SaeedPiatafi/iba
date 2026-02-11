// components/header.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showSections, setShowSections] = useState(true);
  const pathname = usePathname();

  // Check if we're on web-admin routes
  const isWebAdminRoute = pathname.startsWith('/web-admin');

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle scroll effect - Hide sections immediately on any downward scroll
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
          
          // Hide sections immediately on any downward scroll (even 1px)
          if (currentScrollY > lastScrollY && currentScrollY > 5) {
            // Scrolling DOWN - hide sections
            setShowSections(false);
            setIsScrolled(true);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling UP - show sections only if near top
            if (currentScrollY <= 10) {
              setShowSections(true);
              setIsScrolled(false);
            }
          }
          
          // Special case: If at very top (0-5px), always show sections
          if (currentScrollY <= 5) {
            setShowSections(true);
            setIsScrolled(false);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Color palette (from your specifications)
  const colors = {
    primaryBlue: '#2563EB',
    secondaryTeal: '#0D9488',
    accentGreen: '#16A34A',
    background: '#F9FAFB',
    card: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6',
    orange: '#F97316',
    pink: '#EC4899',
  };

  // Top section data
  const topSectionData = {
    lastAdmissionDate: 'Last Admission Date: Dec 15, 2024',
    schoolHours: 'School Hours: 8:00 AM - 2:00 PM',
    email: 'info@iba.edu'
  };

  // Main navigation tabs
  const mainNavTabs = [
    { name: 'Home', href: '/' },
    { name: 'Teachers', href: '/teachers' },
    { name: 'Alumni', href: '/alumni' },
    { name: 'Fee', href: '/fee' },
    { name: 'Contact', href: '/contact' },
    { name: 'Result', href: '/result' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
  ];

  // Lower navigation tabs
  const lowerNavTabs = [
    { name: 'Champs(AKU-EB)', href: '/champs' },
    
    { name: 'Student Resources', href: '/student-resources' },
    { name: 'Admission', href: '/admission' },
    { name: 'School system', href: '/school-system' },
  ];

  const closeMenu = () => {
    setIsOpen(false);
    setMobileDropdownOpen(false);
  };

  // Get homepage link based on route
  const getHomepageLink = () => {
    if (isWebAdminRoute) {
      return '/web-admin';
    }
    return '/';
  };



  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Section - Immediately hides on any scroll down */}
      <div 
        className={`hidden lg:block transition-all duration-300 ${
          showSections 
            ? 'max-h-12 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        style={{ 
          backgroundColor: colors.primaryBlue,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-2 transition-all duration-200 ${
            showSections ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
                {topSectionData.lastAdmissionDate}
              </span>
              <span className="text-sm font-medium text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
                {topSectionData.schoolHours}
              </span>
            </div>
            <div className="flex items-center">
              <a 
                href={`mailto:${topSectionData.email}`}
                className="text-sm font-medium text-white hover:underline transition-all duration-200"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {topSectionData.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section - Always visible */}
      <nav 
        className={`bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : 'shadow-md'
        }`}
        style={{ backgroundColor: colors.card }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${
            showSections ? 'h-14' : 'h-14'
          }`}>
            {/* Logo */}
            <div className="flex items-center">
              <Link href={getHomepageLink()} className="flex items-center space-x-4 group" onClick={closeMenu}>
                <div className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                  showSections ? 'w-14 h-14' : 'w-12 h-12'
                }`}>
                  <Image
                    src="/images/logo.jpg"
                    alt="IBA Logo"
                    width={showSections ? 56 : 48}
                    height={showSections ? 56 : 48}
                    className="object-cover"
                    priority
                  />
                </div>
                
              </Link>
            </div>

            {/* Desktop Main Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainNavTabs.map((tab) => (
                <div key={tab.name} className="relative group">
                  <Link
                    href={tab.href}
                    className={`px-4 py-2 font-bold tracking-wide transition-all duration-300 relative overflow-hidden ${
                      showSections ? 'text-sm' : 'text-sm'
                    }`}
                    style={{
                      color: pathname === tab.href ? colors.primaryBlue : colors.textPrimary,
                      fontFamily: 'var(--font-poppins)',
                      letterSpacing: '0.025em',
                    }}
                  >
                    <span className="relative z-10">{tab.name}</span>
                    {/* Hover background effect */}
                    <div 
                      className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-md"
                      style={{ backgroundColor: colors.background }}
                    ></div>
                    {/* Active indicator */}
                    {pathname === tab.href && (
                      <div 
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 rounded-full transition-all duration-300"
                        style={{ backgroundColor: colors.primaryBlue }}
                      ></div>
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg focus:outline-none transition-all duration-300 relative"
                style={{ color: colors.textPrimary }}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative w-6 h-6">
                  <span 
                    className={`absolute left-0 w-6 h-0.5 rounded-full transition-all duration-300 transform ${
                      isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                    }`} 
                    style={{ backgroundColor: colors.primaryBlue, top: '25%' }}
                  ></span>
                  <span 
                    className={`absolute left-0 w-6 h-0.5 rounded-full transition-all duration-300 ${
                      isOpen ? 'opacity-0' : 'opacity-100'
                    }`} 
                    style={{ backgroundColor: colors.primaryBlue, top: '50%', transform: 'translateY(-50%)' }}
                  ></span>
                  <span 
                    className={`absolute left-0 w-6 h-0.5 rounded-full transition-all duration-300 transform ${
                      isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                    }`} 
                    style={{ backgroundColor: colors.primaryBlue, bottom: '25%' }}
                  ></span>
                </div>
              </button>
            </div>
          </div>

          {/* Lower Section - Immediately hides on any scroll down, aligned left */}
          <div 
            className={`hidden lg:block border-t transition-all duration-300 ${
              showSections 
                ? 'max-h-9.5 opacity-100' 
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}
            style={{ 
              borderColor: showSections ? colors.border : 'transparent',
            }}
          >
            <div className={`transition-all duration-200 ${
              showSections ? 'translate-y-0 py-3' : '-translate-y-full py-0'
            }`}>
              <div className="flex items-center space-x-6">
                {lowerNavTabs.map((tab) => (
                  <div key={tab.name} className="relative group">
                    <Link
                      href={tab.href}
                      className="text-sm font-medium transition-all duration-300 relative overflow-hidden"
                      style={{
                        color: pathname === tab.href ? colors.primaryBlue : colors.textSecondary,
                        fontFamily: 'var(--font-inter)',
                      }}
                    >
                      <span className="relative z-10">{tab.name}</span>
                      {/* Hover underline effect */}
                      <div 
                        className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                        style={{ backgroundColor: colors.secondaryTeal }}
                      ></div>
                      {/* Active indicator */}
                      {pathname === tab.href && (
                        <div 
                          className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                          style={{ backgroundColor: colors.secondaryTeal }}
                        ></div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}>
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
        ></div>
        
        {/* Mobile Menu Panel */}
        <div className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Close button at top */}
          <div className="flex justify-end p-4 border-b" style={{ borderColor: colors.border }}>
            <button
              onClick={closeMenu}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable menu content */}
          <div className="h-[calc(100vh-80px)] overflow-y-auto">
            <div className="p-4 space-y-1">
              {/* Logo in mobile menu */}
              <div className="px-4 py-3 mb-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src="/images/logo.jpg"
                      alt="IBA Logo"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Main Navigation Tabs in Mobile */}
              <div className="mb-6">
                <h4 className="px-4 py-2 text-sm font-semibold uppercase tracking-wider" style={{ 
                  color: colors.primaryBlue,
                  fontFamily: 'var(--font-montserrat)'
                }}>
                  Main Menu
                </h4>
                {mainNavTabs.map((tab) => (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`block px-4 py-3 rounded-lg text-base transition-all duration-200 font-medium ${
                      pathname === tab.href
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: pathname === tab.href ? colors.primaryBlue : 'transparent',
                      color: pathname === tab.href ? 'white' : colors.textPrimary,
                      fontFamily: 'var(--font-poppins)',
                    }}
                    onClick={closeMenu}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          pathname === tab.href ? 'opacity-100 bg-white' : 'opacity-0'
                        }`}
                      ></div>
                      <span>{tab.name}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Lower Navigation Tabs in Mobile */}
              <div className="mb-6">
                <h4 className="px-4 py-2 text-sm font-semibold uppercase tracking-wider" style={{ 
                  color: colors.secondaryTeal,
                  fontFamily: 'var(--font-montserrat)'
                }}>
                  Quick Links
                </h4>
                {lowerNavTabs.map((tab) => (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`block px-4 py-3 rounded-lg text-base transition-all duration-200 font-medium ${
                      pathname === tab.href
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: pathname === tab.href ? colors.secondaryTeal : 'transparent',
                      color: pathname === tab.href ? 'white' : colors.textSecondary,
                      fontFamily: 'var(--font-inter)',
                    }}
                    onClick={closeMenu}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          pathname === tab.href ? 'opacity-100 bg-white' : 'opacity-0'
                        }`}
                      ></div>
                      <span>{tab.name}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Top Section Info in Mobile */}
              <div className="px-4 py-3 mt-6 rounded-lg" style={{ backgroundColor: colors.background }}>
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'var(--font-inter)' }}>
                    {topSectionData.lastAdmissionDate}
                  </p>
                  <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'var(--font-inter)' }}>
                    {topSectionData.schoolHours}
                  </p>
                  <a 
                    href={`mailto:${topSectionData.email}`}
                    className="text-sm font-medium block mt-2 hover:underline"
                    style={{ color: colors.primaryBlue, fontFamily: 'var(--font-poppins)' }}
                  >
                    {topSectionData.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for smooth transitions */}
      <style jsx>{`
        @media (max-width: 640px) {
          .mobile-logo-text {
            display: none;
          }
        }
        
        /* Instant hide/show with smooth transition */
        .instant-hide {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Prevent body scroll when menu is open */
        body.menu-open {
          overflow: hidden;
        }
        
        /* Optimize for performance */
        .optimize-transform {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
      `}</style>
    </header>
  );
}