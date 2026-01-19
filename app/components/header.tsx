// components/header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
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

  // Regular navigation links (for non-admin routes)
  const regularNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Fee', href: '/fee' },
    { name: 'Contact', href: '/contact' },
  ];

  // Web Admin navigation links (for /web-admin routes)
  const webAdminNavLinks = [
    { name: 'Teachers', href: '/web-admin/teacher' },
    { name: 'Alumni', href: '/web-admin/alumni' },
    { name: 'Fee', href: '/web-admin/fee' },
    { name: 'Gallery', href: '/web-admin/gallery' },
    { name: 'Result', href: '/web-admin/result' },
  ];

  // Updated dropdown items for regular site (only shown on non-admin routes)
  const dropdownItems = [
    { name: 'Teachers', href: '/teachers' },
    { name: 'Alumni', href: '/alumni' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Result', href: '/result' }
  ];

  const whatsappNumber = '+923011228302'; // Replace with your number

  const closeMenu = () => {
    setIsOpen(false);
    setMobileDropdownOpen(false);
  };

  // Get active links based on route
  const getActiveLinks = () => {
    if (isWebAdminRoute) {
      return webAdminNavLinks;
    }
    return regularNavLinks;
  };

  // Get homepage link based on route
  const getHomepageLink = () => {
    if (isWebAdminRoute) {
      return '/web-admin';
    }
    return '/';
  };

  // Get logo text based on route
  const getLogoText = () => {
    if (isWebAdminRoute) {
      return {
        main: 'IBA Admin',
        sub: 'Administration Panel'
      };
    }
    return {
      main: 'IBA',
      sub: 'Institute of Business Administration'
    };
  };

  const logoText = getLogoText();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 w-full" style={{ backgroundColor: colors.card }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with IBA name */}
          <div className="flex items-center">
            <Link href={getHomepageLink()} className="flex items-center space-x-3 group" onClick={closeMenu}>
              <div 
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
                style={{ backgroundColor: colors.primaryBlue }}
              >
                <span className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  {isWebAdminRoute ? 'A' : 'IBA'}
                </span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight transition-all duration-300" style={{ 
                  color: colors.primaryBlue, 
                  fontFamily: 'var(--font-montserrat)' 
                }}>
                  {logoText.main}
                </h2>
                <span className="text-xs font-medium opacity-75 hidden sm:inline" style={{ 
                  color: colors.textSecondary, 
                  fontFamily: 'var(--font-poppins)' 
                }}>
                  {logoText.sub}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation with hover effects */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Show appropriate links based on route */}
            {getActiveLinks().map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className="px-4 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative overflow-hidden"
                  style={{
                    color: pathname === link.href ? colors.primaryBlue : colors.textPrimary,
                    fontFamily: 'var(--font-poppins)',
                    letterSpacing: '0.025em',
                  }}
                >
                  <span className="relative z-10">{link.name}</span>
                  {/* Hover background effect */}
                  <div 
                    className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-md"
                    style={{ backgroundColor: colors.background }}
                  ></div>
                  {/* Active indicator */}
                  {pathname === link.href && (
                    <div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 rounded-full transition-all duration-300"
                      style={{ backgroundColor: colors.primaryBlue }}
                    ></div>
                  )}
                </Link>
              </div>
            ))}

            {/* Pages Dropdown with improved hover - Only show on non-admin routes */}
            {!isWebAdminRoute && (
              <div className="relative group">
                <button
                  className="px-4 py-2 text-sm font-bold tracking-wide transition-all duration-300 flex items-center space-x-2 relative overflow-hidden group/btn"
                  style={{ 
                    color: colors.textPrimary,
                    fontFamily: 'var(--font-poppins)',
                    letterSpacing: '0.025em',
                  }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <span className="relative z-10">Pages</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 relative z-10 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  {/* Hover background effect */}
                  <div 
                    className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left rounded-md"
                    style={{ backgroundColor: colors.background }}
                  ></div>
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full left-0 mt-1 w-56 rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform origin-top ${
                    dropdownOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                  } z-50`}
                  style={{ 
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {dropdownItems.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-5 py-3.5 text-sm transition-all duration-200 border-b last:border-b-0 group/item relative overflow-hidden"
                      style={{ 
                        color: colors.textPrimary,
                        borderColor: colors.border,
                        fontFamily: 'var(--font-inter)',
                        transitionDelay: `${index * 50}ms`,
                        fontWeight: '500',
                      }}
                    >
                      <span className="relative z-10 flex items-center space-x-3">
                        <div 
                          className="w-2 h-2 rounded-full transition-all duration-300 group-hover/item:opacity-100 opacity-0"
                          style={{ backgroundColor: colors.secondaryTeal }}
                        ></div>
                        <span>{item.name}</span>
                      </span>
                      {/* Hover background effect */}
                      <div 
                        className="absolute inset-0 bg-gray-50 transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left"
                        style={{ backgroundColor: colors.background }}
                      ></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Button - Hide on admin routes */}
            {!isWebAdminRoute && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl ml-4 group/wa"
                style={{ 
                  backgroundColor: colors.accentGreen,
                  fontFamily: 'var(--font-poppins)',
                  letterSpacing: '0.025em',
                }}
              >
                <svg className="w-5 h-5 mr-3 transition-transform duration-300 group-hover/wa:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.917-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                </svg>
                <span className="relative">
                  WhatsApp
                </span>
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile WhatsApp Button - Hide on admin routes */}
            {!isWebAdminRoute && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 rounded-lg font-bold text-white transition-all duration-300 active:scale-95"
                style={{ 
                  backgroundColor: colors.accentGreen,
                  fontFamily: 'var(--font-poppins)',
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.917-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                </svg>
              </a>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg focus:outline-none transition-all duration-300 relative"
              style={{ color: colors.textPrimary }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {/* Improved hamburger icon with proper X */}
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
      </div>

      {/* Mobile Navigation - Fixed with overlay and scroll lock */}
      <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
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
              {/* User info/logo in mobile menu */}
              <div className="px-4 py-3 mb-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                <div className="flex items-center space-x-3">
                  <div 
                    className="flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: colors.primaryBlue }}
                  >
                    <span className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
                      {isWebAdminRoute ? 'A' : 'IBA'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: colors.textPrimary, fontFamily: 'var(--font-montserrat)' }}>
                      {logoText.main}
                    </h3>
                    <p className="text-xs" style={{ color: colors.textSecondary, fontFamily: 'var(--font-poppins)' }}>
                      {logoText.sub}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links - Show appropriate links based on route */}
              {getActiveLinks().map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-base transition-all duration-200 font-medium ${
                    pathname === link.href
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: pathname === link.href ? colors.primaryBlue : 'transparent',
                    color: pathname === link.href ? 'white' : colors.textPrimary,
                    fontFamily: 'var(--font-poppins)',
                  }}
                  onClick={closeMenu}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        pathname === link.href ? 'opacity-100 bg-white' : 'opacity-0'
                      }`}
                    ></div>
                    <span>{link.name}</span>
                  </div>
                </Link>
              ))}

              {/* Mobile Dropdown - Only show on non-admin routes */}
              {!isWebAdminRoute && (
                <div className="px-1">
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="w-full px-4 py-3 rounded-lg text-base font-medium text-left transition-all duration-200 flex items-center justify-between hover:bg-gray-50"
                    style={{
                      color: colors.textPrimary,
                      fontFamily: 'var(--font-poppins)',
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full opacity-0"></div>
                      <span>Pages</span>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Mobile Dropdown Items */}
                  <div
                    className={`pl-6 space-y-1 overflow-hidden transition-all duration-300 ${
                      mobileDropdownOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-3 rounded-lg text-base transition-all duration-200 hover:bg-gray-50"
                        style={{
                          color: colors.textSecondary,
                          fontFamily: 'var(--font-inter)',
                        }}
                        onClick={closeMenu}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: colors.secondaryTeal }}
                          ></div>
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile WhatsApp Button - Only show on non-admin routes */}
              {!isWebAdminRoute && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-3 rounded-lg font-bold text-white transition-all duration-300 active:scale-95 mt-4"
                  style={{ 
                    backgroundColor: colors.accentGreen,
                    fontFamily: 'var(--font-poppins)',
                  }}
                  onClick={closeMenu}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.917-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                    </svg>
                    <span>Chat on WhatsApp</span>
                  </div>
                </a>
              )}

              {/* Additional Info */}
              <div className="px-4 py-3 mt-6 rounded-lg" style={{ backgroundColor: colors.background }}>
                <p className="text-sm" style={{ color: colors.textSecondary, fontFamily: 'var(--font-inter)' }}>
                  {isWebAdminRoute ? 'Administration Panel' : 'Need help? Contact us anytime.'}
                </p>
                <p className="text-sm font-medium mt-1" style={{ color: colors.primaryBlue, fontFamily: 'var(--font-poppins)' }}>
                  {isWebAdminRoute ? 'admin@iba.edu' : 'info@iba.edu'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .mobile-logo-text {
            display: none;
          }
          
          nav {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .logo-container {
            min-width: 120px;
          }
          
          .mobile-whatsapp {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
        }
        
        /* Prevent body scroll when menu is open */
        body.menu-open {
          overflow: hidden;
        }
      `}</style>
    </nav>
  );
}