// components/GalleryHeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GalleryHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden min-h-[250px] md:min-h-[350px] lg:min-h-[400px] xl:min-h-[450px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Main Background Image - Use a gallery/photo-related image */}
        <div className="absolute inset-0 bg-gray-900">
          <Image
            src="/images/gallery-hero.jpg" // Replace with your gallery image
            alt="Campus Gallery and Photo Collection"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
            onLoadingComplete={() => console.log('Gallery hero image loaded successfully')}
            onError={(e) => {
              console.error('Gallery image failed to load, using fallback');
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.className = "absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900";
              }
            }}
          />
        </div>
        
        {/* Black Gradient Overlay - Same design pattern */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))',
          }}
        />
        
        {/* Additional decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
        
        {/* Optional: Grid pattern overlay for gallery theme */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>
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
                Campus Gallery
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
                      href="/about"
                      className="text-white/95 hover:text-white transition-colors duration-300 hover:scale-105 transform"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
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
                      className="text-white font-semibold bg-white/20 px-3 py-1 rounded-md text-sm border border-white/30 backdrop-blur-sm"
                      aria-current="page"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                    >
                      Photo Gallery
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
                Explore our campus life through photos of events, activities, and memorable moments
              </p>

              {/* Gallery Categories */}
              <div className={`flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4 mt-6 md:mt-8 transform transition-all duration-700 delay-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <span className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full text-sm md:text-base border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer">
                  Campus Life
                </span>
                <span className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full text-sm md:text-base border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer">
                  Events
                </span>
                <span className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full text-sm md:text-base border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer">
                  Sports
                </span>
                <span className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full text-sm md:text-base border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer">
                  Academics
                </span>
                <span className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full text-sm md:text-base border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer">
                  Cultural
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gallery Icons */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <svg className="w-10 h-10 text-white/20 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>

      <div className="absolute top-10 right-10 hidden lg:block">
        <svg className="w-12 h-12 text-white/20" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
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
          
          .categories span {
            padding: 0.5rem 1rem !important;
            font-size: 0.75rem !important;
          }
          
          .stats-container div {
            min-width: 120px !important;
            padding: 0.75rem !important;
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
          
          .categories {
            gap: 0.5rem !important;
          }
          
          .decorative-icons {
            display: none;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Hover effects for categories */
        .categories span:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
        }
        
        /* Grid pattern animation */
        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }
        
        .grid-pattern {
          animation: gridMove 20s linear infinite;
        }
        
        /* Animation for categories */
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .categories span {
          animation: fadeInScale 0.5s ease-out forwards;
        }
        
        .categories span:nth-child(1) { animation-delay: 0.1s; }
        .categories span:nth-child(2) { animation-delay: 0.2s; }
        .categories span:nth-child(3) { animation-delay: 0.3s; }
        .categories span:nth-child(4) { animation-delay: 0.4s; }
        .categories span:nth-child(5) { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}