// components/AboutHeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AboutHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden min-h-[250px] md:min-h-[350px] lg:min-h-[400px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Image from public folder - Use absolute path */}
        <Image
          src="/images/abouthero.jpg" // Absolute path from public folder
          alt="University Campus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
          onLoadingComplete={() => console.log('Hero image loaded successfully')}
          onError={(e) => {
            console.error('Image failed to load');
            // Try different extensions
            e.currentTarget.src = '/images/abouthero.png';
          }}
        />
        
        {/* Single gradient overlay with reduced opacity */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))',
          }}
        />
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
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)'
                }}
              >
                About Us
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
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
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
                      href="/fee"
                      className="text-white/95 hover:text-white transition-colors duration-300 hover:scale-105 transform"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                    >
                      fee
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
                      className="text-white font-semibold bg-black/10 px-2 py-1 rounded-md text-sm"
                      aria-current="page"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                    >
                      About
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
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                }}
              >
                Empowering the next generation of leaders through excellence in education and innovation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .min-h-\\[250px\\] {
            min-height: 200px !important;
          }
          
          h1 {
            font-size: 1.75rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .container {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
          
          .breadcrumb {
            margin-bottom: 1rem !important;
          }
          
          p {
            font-size: 0.875rem !important;
            padding: 0 0.5rem;
            line-height: 1.4 !important;
          }
        }
        
        @media (max-width: 768px) {
          .breadcrumb {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          h1 {
            font-size: 2.25rem !important;
          }
          
          .container {
            padding-top: 2.5rem !important;
            padding-bottom: 2.5rem !important;
          }
          
          p {
            font-size: 1rem !important;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}