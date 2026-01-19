// components/ContactHeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ContactHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden min-h-[250px] md:min-h-[350px] lg:min-h-[400px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Fallback background */}
        <div className="absolute inset-0 bg-blue-600"></div>
        
        {/* Image from public folder */}
        <div className="relative w-full h-full">
          <Image
            src="/images/contacthero.jpg"
            alt="Contact Us"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
            onLoadingComplete={() => console.log('Contact hero image loaded successfully')}
            onError={(e) => {
              console.error('Image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        {/* Black gradient overlay with opacity */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
          }}
        />
        
        {/* Blue tint overlay */}
        <div className="absolute inset-0 bg-blue-600/30 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              {/* Main Title with Animation */}
              <h1 
                className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 transform transition-all duration-700 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  lineHeight: '1.2',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)'
                }}
              >
                Contact Us
              </h1>

              {/* Breadcrumb Navigation */}
              <nav 
                aria-label="breadcrumb"
                className={`mb-4 md:mb-6 transform transition-all duration-700 delay-300 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <ol className="flex flex-wrap justify-center items-center space-x-2 md:space-x-3 text-sm md:text-base">
                  <li className="flex items-center">
                    <a
                      href="/"
                      className="text-white/95 hover:text-white transition-colors duration-300 flex items-center hover:scale-105 transform"
                      style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}
                    >
                      <svg 
                        className="w-4 h-4 mr-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                        />
                      </svg>
                      Home
                    </a>
                    <svg 
                      className="w-3 h-3 mx-2 text-white/70" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </li>
                  <li className="flex items-center">
                    <a
                      href="/about"
                      className="text-white/95 hover:text-white transition-colors duration-300 hover:scale-105 transform"
                      style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}
                    >
                      About
                    </a>
                    <svg 
                      className="w-3 h-3 mx-2 text-white/70" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </li>
                  <li className="flex items-center">
                    <span 
                      className="text-white font-semibold bg-black/20 px-2 py-1 rounded-md text-sm"
                      aria-current="page"
                      style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}
                    >
                      Contact
                    </span>
                  </li>
                </ol>
              </nav>

              {/* Description Text */}
              <p 
                className={`text-base md:text-lg lg:text-xl text-white/95 max-w-2xl mx-auto transform transition-all duration-700 delay-500 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: '1.5',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)'
                }}
              >
                Get in touch with us for any queries or information
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}