// components/AlumniHeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AlumniHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden min-h-[250px] md:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Main Background Image */}
        <div className="absolute inset-0 bg-gray-900">
          <Image
            src="/images/alumni.jpg" // Replace with your alumni image
            alt="Our Proud Alumni Network and Graduates"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
            onLoadingComplete={() => console.log('Alumni hero image loaded successfully')}
            onError={(e) => {
              console.error('Alumni image failed to load, using fallback');
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.className = "absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900";
              }
            }}
          />
        </div>
        
        {/* Black Gradient Overlay - Same design pattern */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4))',
          }}
        />
        
        {/* Optional: Additional decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              {/* Main Title with Animation */}
              <h1 
                className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-4 lg:mb-5 transform transition-all duration-700 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  lineHeight: '1.2',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)',
                  letterSpacing: '-0.025em'
                }}
              >
                Alumni Network
              </h1>

              {/* Breadcrumb Navigation */}
              <nav 
                aria-label="breadcrumb"
                className={`mb-4 md:mb-6 lg:mb-8 transform transition-all duration-700 delay-300 ${
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
                      href="/teacher"
                      className="text-white/95 hover:text-white transition-colors duration-300 hover:scale-105 transform"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                    >
                      Teachers
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
                      className="text-white font-semibold bg-white/20 px-3 py-1 rounded-md text-sm border border-white/30 backdrop-blur-sm"
                      aria-current="page"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                    >
                      Alumni
                    </span>
                  </li>
                </ol>
              </nav>

              {/* Description Text */}
              <p 
                className={`text-base md:text-lg lg:text-xl xl:text-2xl text-white/95 max-w-3xl mx-auto mb-6 md:mb-8 transform transition-all duration-700 delay-500 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: '1.6',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                Connecting generations of graduates who continue to make an impact worldwide
              </p>

              {/* Alumni Stats */}
              <div className={`flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6 mt-6 md:mt-8 transform transition-all duration-700 delay-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 min-w-[140px]">
                  <div className="flex flex-col items-center">
                    <div className="text-white font-bold text-2xl md:text-3xl">15,000+</div>
                    <div className="text-white/80 text-sm md:text-base mt-1">Alumni Worldwide</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 min-w-[140px]">
                  <div className="flex flex-col items-center">
                    <div className="text-white font-bold text-2xl md:text-3xl">50+</div>
                    <div className="text-white/80 text-sm md:text-base mt-1">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Alumni Icons */}
      <div className="absolute bottom-8 left-8 hidden lg:block">
        <svg className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
        </svg>
      </div>

      <div className="absolute top-8 right-8 hidden lg:block">
        <svg className="w-10 h-10 text-white/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
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
          
          .stats-container div {
            min-width: 120px !important;
            padding: 0.75rem !important;
          }
          
          button {
            padding: 0.75rem 1.5rem !important;
            font-size: 0.875rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .breadcrumb {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
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
          
          .decorative-icons {
            display: none;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Hover effects */
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
        }
        
        /* Animation for stats */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .stats-container div {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .stats-container div:nth-child(1) { animation-delay: 0.1s; }
        .stats-container div:nth-child(2) { animation-delay: 0.2s; }
        .stats-container div:nth-child(3) { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}