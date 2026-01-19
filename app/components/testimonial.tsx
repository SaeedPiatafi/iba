// components/TestimonialsSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function TestimonialsSection() {
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

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      profession: 'Business Graduate',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      text: 'IBA eLEARNING transformed my career with practical approach and industry-relevant curriculum.',
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Williams',
      profession: 'Finance Analyst',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      text: 'Flexible online platform made balancing work and study possible. Expert instructors were game-changers.',
      rating: 5
    },
    {
      id: 3,
      name: 'Michael Chen',
      profession: 'Marketing Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      text: 'Outstanding faculty and cutting-edge curriculum gave me confidence to excel in marketing career.',
      rating: 5
    },
    {
      id: 4,
      name: 'Emma Rodriguez',
      profession: 'Entrepreneur',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      text: 'Entrepreneurship program gave me tools and confidence to start my own business. Life-changing!',
      rating: 5
    },
    {
      id: 5,
      name: 'David Kim',
      profession: 'Data Analyst',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005-128?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      text: 'The data science program was exceptional. Real-world projects helped me land my dream job.',
      rating: 5
    },
    {
      id: 6,
      name: 'Lisa Wang',
      profession: 'Product Manager',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      text: 'Excellent mentorship and networking opportunities. The alumni community is incredibly supportive.',
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine items per slide based on screen size
  const getItemsPerSlide = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3; // Large screens: 3 items
    if (window.innerWidth >= 768) return 2;  // Medium screens: 2 items
    return 1; // Small screens: 1 item
  };

  // Handle window resize
  useEffect(() => {
    const updateItemsPerSlide = () => {
      setItemsPerSlide(getItemsPerSlide());
      // Reset index to valid range
      setCurrentIndex(0);
    };
    
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  // Auto-play carousel with animation
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= itemsPerSlide) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length, itemsPerSlide, currentIndex]);

  // Animate slide transition
  const animateSlide = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Add animation class to container
    if (containerRef.current) {
      containerRef.current.classList.add(`slide-${direction}`);
    }
    
    // Remove animation class after transition completes
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.remove(`slide-${direction}`);
      }
      setIsAnimating(false);
    }, 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    
    animateSlide('next');
    setIsAutoPlaying(false);
    
    setTimeout(() => {
      setCurrentIndex((prev) => 
        prev >= testimonials.length - itemsPerSlide ? 0 : prev + 1
      );
      setTimeout(() => setIsAutoPlaying(true), 8000);
    }, 250);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    
    animateSlide('prev');
    setIsAutoPlaying(false);
    
    setTimeout(() => {
      setCurrentIndex((prev) => 
        prev === 0 ? testimonials.length - itemsPerSlide : prev - 1
      );
      setTimeout(() => setIsAutoPlaying(true), 8000);
    }, 250);
  };

  // Calculate visible testimonials
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerSlide);

  return (
    <div className="py-12 md:py-16" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with animation */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center mb-3">
            <div 
              className="inline-flex items-center px-3 py-1.5 rounded-full animate-pulse-subtle"
              style={{ 
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
              }}
            >
              <span 
                className="text-xs font-bold uppercase tracking-wider"
                style={{ 
                  color: colors.primaryBlue,
                  fontFamily: 'var(--font-poppins)',
                  letterSpacing: '0.1em'
                }}
              >
                Testimonials
              </span>
            </div>
          </div>
          
          <h1 
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 animate-fade-in"
            style={{
              color: colors.textPrimary,
              fontFamily: 'var(--font-montserrat)',
            }}
          >
            What Our Students Say
          </h1>
          
          <p 
            className="text-base md:text-lg max-w-xl mx-auto animate-fade-in-delay"
            style={{
              color: colors.textSecondary,
              fontFamily: 'var(--font-inter)',
              lineHeight: '1.6'
            }}
          >
            Hear from our successful alumni about their learning experiences
          </p>
        </div>

        {/* Testimonials Container with slide animation */}
        <div className="relative" ref={containerRef}>
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 testimonial-slide">
            {visibleTestimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className="bg-white rounded-lg p-4 md:p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-card-in"
                style={{ 
                  border: `1px solid ${colors.border}`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Student Info Row */}
                <div className="flex items-center mb-3">
                  {/* Student Image with animation */}
                  <div className="flex-shrink-0 mr-3">
                    <div 
                      className="rounded-full overflow-hidden transform transition-transform duration-300 hover:scale-110"
                      style={{ 
                        width: '48px',
                        height: '48px',
                        border: `2px solid ${colors.primaryBlue}`,
                      }}
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const nameParts = testimonial.name.split(' ');
                          const initials = nameParts.map(part => part[0]).join('');
                          e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="${colors.primaryBlue}"/><text x="24" y="32" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="white">${initials}</text></svg>`;
                        }}
                      />
                    </div>
                  </div>

                  {/* Name and Profession */}
                  <div className="flex-1">
                    <h5 
                      className="text-sm md:text-base font-bold transition-colors duration-300 hover:text-blue-600"
                      style={{
                        color: colors.textPrimary,
                        fontFamily: 'var(--font-poppins)',
                      }}
                    >
                      {testimonial.name}
                    </h5>
                    <p 
                      className="text-xs md:text-sm transition-colors duration-300"
                      style={{
                        color: colors.secondaryTeal,
                        fontFamily: 'var(--font-inter)',
                      }}
                    >
                      {testimonial.profession}
                    </p>
                  </div>

                  {/* Star Rating with pulse animation */}
                  <div className="flex animate-rating-pulse">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-3 h-3 md:w-4 md:h-4 ml-0.5 transition-transform duration-300 hover:scale-125"
                        style={{ color: colors.accentGreen }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Testimonial Text with floating quote */}
                <div className="relative">
                  {/* Animated Quote Icon */}
                  <svg 
                    className="absolute -left-1 -top-1 w-5 h-5 animate-float"
                    style={{ color: colors.primaryBlue, opacity: 0.2 }}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  
                  <p 
                    className="text-sm md:text-base pl-4 transition-colors duration-300"
                    style={{
                      color: colors.textSecondary,
                      fontFamily: 'var(--font-inter)',
                      lineHeight: '1.6'
                    }}
                  >
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation - Only show if multiple items */}
          {testimonials.length > itemsPerSlide && (
            <>
              {/* Navigation Buttons with hover animations */}
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 md:-translate-x-3 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white shadow-md hover:shadow-lg transition-all duration-300 z-10 animate-slide-in-left hover:scale-110"
                style={{ 
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                aria-label="Previous testimonials"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 transform transition-transform duration-300 group-hover:-translate-x-1" style={{ color: colors.primaryBlue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 md:translate-x-3 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white shadow-md hover:shadow-lg transition-all duration-300 z-10 animate-slide-in-right hover:scale-110"
                style={{ 
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                aria-label="Next testimonials"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 transform transition-transform duration-300 group-hover:translate-x-1" style={{ color: colors.primaryBlue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Animated Slide Indicators */}
              <div className="flex justify-center mt-6 space-x-1.5">
                {Array.from({ length: Math.ceil(testimonials.length / itemsPerSlide) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isAnimating) {
                        setCurrentIndex(index * itemsPerSlide);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-150 ${
                      Math.floor(currentIndex / itemsPerSlide) === index ? 'scale-125' : 'scale-100'
                    }`}
                    style={{
                      backgroundColor: Math.floor(currentIndex / itemsPerSlide) === index ? colors.primaryBlue : colors.border,
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        /* Slide animations */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        @keyframes ratingPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes bounceSubtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        @keyframes slideNext {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          50% {
            opacity: 0;
            transform: translateX(-20px);
          }
          51% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slidePrev {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          50% {
            opacity: 0;
            transform: translateX(20px);
          }
          51% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Animation classes */
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .animate-card-in {
          animation: cardIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-rating-pulse {
          animation: ratingPulse 2s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounceSubtle 2s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        /* Slide transition animations */
        .slide-next .testimonial-slide {
          animation: slideNext 0.5s ease-in-out;
        }
        
        .slide-prev .testimonial-slide {
          animation: slidePrev 0.5s ease-in-out;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .testimonial-card {
            padding: 1rem;
          }
        }
        
        @media (max-width: 640px) {
          .py-12 {
            padding-top: 2.5rem;
            padding-bottom: 2.5rem;
          }
          
          .grid-cols-1 {
            gap: 1rem;
          }
        }
        
        @media (min-width: 1024px) {
          .lg\\:grid-cols-3 {
            gap: 1.5rem;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Container width */
        .container {
          max-width: 1200px;
        }
      `}</style>
    </div>
  );
}