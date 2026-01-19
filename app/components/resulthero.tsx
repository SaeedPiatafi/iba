// components/ResultsHeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ResultsHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden min-h-[250px] md:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Main Background Image - Use academic/results-related image */}
        <div className="absolute inset-0 bg-gray-900">
          <Image
            src="/images/result-hero.jpg" // Replace with your results image
            alt="Academic Results and Achievements"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
            onLoadingComplete={() => console.log('Results hero image loaded successfully')}
            onError={(e) => {
              console.error('Results image failed to load, using fallback');
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.className = "absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900";
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
        
        {/* Additional decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
        
        {/* Optional: Graph pattern overlay for results theme */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)`,
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="max-w-5xl mx-auto">
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
                Academic Results
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
                      href="/gallery"
                      className="text-white/95 hover:text-white transition-colors duration-300 hover:scale-105 transform"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                    >
                      Gallery
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
                      Results
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
                Celebrating academic excellence and student achievements across all disciplines
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Academic Icons */}
      <div className="absolute bottom-8 left-8 hidden lg:block">
        <svg className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      </div>

      <div className="absolute top-8 right-8 hidden lg:block">
        <svg className="w-10 h-10 text-white/20 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
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
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          
          .stats-grid div {
            padding: 0.75rem !important;
            min-height: auto !important;
          }
          
          .quick-links button {
            padding: 0.75rem 1rem !important;
            font-size: 0.75rem !important;
            margin: 0.25rem !important;
          }
          
          .year-selector {
            padding: 0.5rem !important;
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
          
          .stats-grid {
            gap: 1rem !important;
          }
          
          .quick-links {
            flex-direction: column;
            align-items: center;
            gap: 0.75rem !important;
          }
          
          .quick-links button {
            width: 80%;
            max-width: 300px;
          }
          
          .decorative-icons {
            display: none;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Hover effects for buttons */
        button:hover {
          transform: translateY(-2px);
        }
        
        /* Custom select styling */
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
        
        /* Animation for stats */
        @keyframes countUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .stats-grid div {
          animation: countUp 0.6s ease-out forwards;
        }
        
        .stats-grid div:nth-child(1) { animation-delay: 0.1s; }
        .stats-grid div:nth-child(2) { animation-delay: 0.2s; }
        .stats-grid div:nth-child(3) { animation-delay: 0.3s; }
        .stats-grid div:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}