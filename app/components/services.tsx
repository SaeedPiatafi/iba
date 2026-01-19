// components/ServicesSection.tsx
'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function ServicesSection() {
  // Color palette
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

  // Services data
  const services = [
    {
      id: 1,
      title: 'Skilled Instructors',
      description: 'Learn from industry experts with years of teaching experience and practical knowledge.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      delay: '0.1s'
    },
    {
      id: 2,
      title: 'Online Classes',
      description: 'Access courses anytime, anywhere with our flexible online learning platform.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      delay: '0.3s'
    },
    {
      id: 3,
      title: 'Practical Projects',
      description: 'Hands-on projects that prepare you for real-world challenges and career opportunities.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      delay: '0.5s'
    },
    {
      id: 4,
      title: 'Digital Library',
      description: 'Extensive collection of e-books, research papers, and learning resources at your fingertips.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      delay: '0.7s'
    },
  ];

  // Intersection observer for scroll animations
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full mb-4"
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
              Our Services
            </span>
          </div>
          
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{
              color: colors.textPrimary,
              fontFamily: 'var(--font-montserrat)',
            }}
          >
            Quality Education Services
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{
              color: colors.textSecondary,
              fontFamily: 'var(--font-inter)',
              lineHeight: '1.6'
            }}
          >
            We provide comprehensive learning solutions designed to help students achieve their academic and career goals.
          </p>
        </div>

        {/* Services Grid */}
        <div 
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`service-card group relative overflow-hidden rounded-2xl transition-all duration-500 transform ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                backgroundColor: colors.card,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Hover effect overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primaryBlue}15 0%, ${colors.secondaryTeal}15 100%)`
                }}
              ></div>
              
              {/* Animated border on hover */}
              <div 
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-300"
                style={{ borderColor: `${colors.primaryBlue}40` }}
              ></div>
              
              {/* Service Content */}
              <div className="relative z-10 p-2 md:p-8 text-center">
                {/* Icon Container */}
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ 
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  }}
                >
                  <div style={{ color: colors.primaryBlue }}>
                    {service.icon}
                  </div>
                </div>
                
                {/* Title */}
                <h3 
                  className="text-xl md:text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-blue-600"
                  style={{
                    color: colors.textPrimary,
                    fontFamily: 'var(--font-montserrat)',
                  }}
                >
                  {service.title}
                </h3>
                
                {/* Description */}
                <p 
                  className="text-base md:text-lg mb-6 transition-colors duration-300 group-hover:text-gray-700"
                  style={{
                    color: colors.textSecondary,
                    fontFamily: 'var(--font-inter)',
                    lineHeight: '1.4'
                  }}
                >
                  {service.description}
                </p>
                
                
              </div>
              
              {/* Corner Decoration */}
              <div 
                className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{ 
                  background: `linear-gradient(135deg, transparent 50%, ${colors.primaryBlue}15 50%)`,
                  borderTopRightRadius: '0.75rem'
                }}
              ></div>
            </div>
          ))}
        </div>

      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .service-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        /* Hover lift effect */
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .service-card {
            margin-bottom: 1rem;
          }
          
          h2 {
            font-size: 2rem !important;
          }
          
          p {
            font-size: 1rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .grid-cols-2 {
            gap: 1.5rem !important;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  );
}