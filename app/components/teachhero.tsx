// components/TeacherHeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TeacherHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full overflow-hidden min-h-[250px] md:min-h-[350px] lg:min-h-[400px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Teacher-related images - Add your preferred teacher image to public/images/ */}
        <Image
          src="/images/teacher-hero.jpg" // You can also use: /images/teachers-hero.jpg, /images/faculty-hero.jpg, etc.
          alt="Inspiring Teachers and Faculty"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
          onLoadingComplete={() => console.log('Teacher hero image loaded successfully')}
          onError={(e) => {
            console.error('Image failed to load, trying alternatives');
            // Try different teacher-related images
            e.currentTarget.src = '/images/teachers.jpg';
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
                Our Esteemed Faculty
              </h1>

              {/* Alternative titles you can use:
                "Meet Our Teachers"
                "Dedicated Educators"
                "Faculty Members"
                "Teaching Staff"
                "Academic Mentors"
              */}

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
                      href="/alumni"
                      className="text-white/95 hover:text-white transition-colors duration-300 hover:scale-105 transform"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                    >
                      Alumni
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
                      className="text-white font-semibold bg-blue-900/30 px-2 py-1 rounded-md text-sm border border-white/20"
                      aria-current="page"
                      style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}
                    >
                      Faculty
                    </span>
                  </li>
                </ol>
              </nav>

              {/* Description Text - Teacher-focused */}
              <div className={`transform transition-all duration-700 delay-500 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <p 
                  className="text-base md:text-lg lg:text-xl text-white/95 max-w-2xl mx-auto mb-4"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    lineHeight: '1.5',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Meet our dedicated team of educators, mentors, and academic leaders committed to student success
                </p>
                
                {/* Teacher-specific stats or features */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6">
                  <div className="flex items-center text-white/90">
                    <svg className="w-5 h-5 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm md:text-base">Certified Educators</span>
                  </div>
                  
                  <div className="flex items-center text-white/90">
                    <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">Expert Mentors</span>
                  </div>
                  
                  <div className="flex items-center text-white/90">
                    <svg className="w-5 h-5 mr-2 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    <span className="text-sm md:text-base">Research Leaders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="flex items-center space-x-2 text-white/60">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">150+ Faculty Members</span>
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
          
          .stats-container {
            gap: 0.5rem !important;
          }
          
          .stats-container span {
            font-size: 0.75rem !important;
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
          
          .floating-stats {
            display: none;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Teacher-themed gradient animation */
        @keyframes teacherGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .gradient-overlay {
          animation: teacherGradient 15s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}