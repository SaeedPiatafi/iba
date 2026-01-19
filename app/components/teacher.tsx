// components/TeachersSection.tsx
'use client';

import { useEffect } from 'react';

export default function TeachersSection() {
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
  };

  // Teachers data
  const teachers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      designation: 'Professor of Business',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      delay: '0.1s'
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      designation: 'Finance Department Head',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      delay: '0.3s'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      designation: 'Marketing Expert',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      delay: '0.5s'
    },
    {
      id: 4,
      name: 'Mr. David Wilson',
      designation: 'Entrepreneurship Coach',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      delay: '0.7s'
    }
  ];

  // Add fadeInUp animation when component mounts
  useEffect(() => {
    const elements = document.querySelectorAll('.wow');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-16 md:py-20" style={{ backgroundColor: colors.card }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          {/* Section Title Badge */}
          <div className="inline-flex items-center mb-4">
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full"
              style={{ 
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
              }}
            >
              <span 
                className="text-sm font-bold uppercase tracking-wider"
                style={{ 
                  color: colors.primaryBlue,
                  fontFamily: 'var(--font-poppins)',
                  letterSpacing: '0.1em'
                }}
              >
                Instructors
              </span>
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{
              color: colors.textPrimary,
              fontFamily: 'var(--font-montserrat)',
            }}
          >
            Expert Instructors
          </h1>
          
          <p 
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
            style={{
              color: colors.textSecondary,
              fontFamily: 'var(--font-inter)',
              lineHeight: '1.6'
            }}
          >
            Learn from industry leaders and experienced educators dedicated to your success
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="wow fadeInUp group"
              data-wow-delay={teacher.delay}
            >
              <div 
                className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2"
                style={{ 
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* Image Container */}
                <div className="overflow-hidden relative h-64 md:h-72">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Generate initials as fallback
                      const nameParts = teacher.name.split(' ');
                      const initials = nameParts.map(part => part[0]).join('');
                      const svgString = `
                        <svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="800" height="600" fill="#2563EB"/>
                          <text x="400" y="300" text-anchor="middle" font-family="Arial" font-size="120" font-weight="bold" fill="white">${initials}</text>
                          <text x="400" y="420" text-anchor="middle" font-family="Arial" font-size="32" fill="white" opacity="0.9">${teacher.name}</text>
                        </svg>
                      `;
                      const blob = new Blob([svgString], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      e.currentTarget.src = url;
                    }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h5 
                    className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-blue-600"
                    style={{
                      color: colors.textPrimary,
                      fontFamily: 'var(--font-poppins)',
                    }}
                  >
                    {teacher.name}
                  </h5>
                  <div 
                    className="text-sm font-medium"
                    style={{
                      color: colors.secondaryTeal,
                      fontFamily: 'var(--font-inter)',
                    }}
                  >
                    {teacher.designation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/teachers"
            className="inline-flex items-center px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ 
              backgroundColor: colors.primaryBlue,
              fontFamily: 'var(--font-poppins)',
            }}
          >
            <span>View All Instructors</span>
            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        .wow {
          visibility: hidden;
        }
        
        .wow.animated {
          visibility: visible;
          animation-name: fadeInUp;
          animation-duration: 1s;
          animation-fill-mode: both;
        }
        
        .fadeInUp {
          animation-name: fadeInUp;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          
          h1 {
            font-size: 2rem !important;
          }
          
          .teacher-image {
            height: 250px !important;
          }
          
          .grid-cols-2 {
            gap: 1.5rem !important;
          }
        }
        
        @media (max-width: 640px) {
          .grid-cols-1 {
            gap: 2rem !important;
          }
          
          .teacher-image {
            height: 220px !important;
          }
          
          .py-16 {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
        }
        
        @media (min-width: 1024px) {
          .lg\\:grid-cols-4 {
            gap: 2rem !important;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Container width */
        .container {
          max-width: 1200px;
        }
        
        /* Image aspect ratio */
        .h-64 {
          height: 16rem;
        }
        
        @media (min-width: 768px) {
          .md\\:h-72 {
            height: 18rem;
          }
        }
        
        /* Card border radius */
        .rounded-xl {
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
}