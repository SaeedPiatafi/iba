'use client';

import { useState, useEffect, useCallback } from 'react';

interface Testimonial {
  id: number;
  name: string;
  graduation: string;
  current: string;
  text: string;
  avatarColor: string;
  textColor: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials from API
  const fetchTestimonials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/testimonials');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTestimonials(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch testimonials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load testimonials');
      // Fallback to empty array
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (testimonials.length === 0 || isLoading) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length, isLoading]);

  const handleNext = () => {
    if (isAnimating || testimonials.length === 0) return;
    
    setIsAnimating(true);
    setDirection('next');
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating || testimonials.length === 0) return;
    
    setIsAnimating(true);
    setDirection('prev');
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex || testimonials.length === 0) return;
    
    setIsAnimating(true);
    setDirection(index > currentIndex ? 'next' : 'prev');
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-pulse">
        {/* Quote Icon Skeleton */}
        <div className="mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded"></div>
        </div>

        {/* Text Skeleton */}
        <div className="space-y-3 mb-8">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Avatar and Info Skeleton */}
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gray-200 rounded-full mr-4"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-40 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-36"></div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorDisplay = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Testimonials</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchTestimonials}
          className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors duration-300"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Testimonials Available</h3>
        <p className="text-gray-600">Check back later for alumni testimonials.</p>
      </div>
    </div>
  );

  return (
    <div className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-[#2563EB]/10 text-[#2563EB] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            Alumni Testimonials
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Alumni Say
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our successful alumni about how their school experience shaped their careers
          </p>
        </div>

        {/* Loading State */}
        {isLoading && <SkeletonLoader />}

        {/* Error State */}
        {error && !isLoading && <ErrorDisplay />}

        {/* Empty State */}
        {!isLoading && !error && testimonials.length === 0 && <EmptyState />}

        {/* Testimonial Carousel */}
        {!isLoading && !error && testimonials.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            {/* Testimonial Card */}
            <div 
              key={currentIndex}
              className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-500 transform ${
                direction === 'next' 
                  ? 'animate-slide-in-right' 
                  : 'animate-slide-in-left'
              }`}
              style={{ 
                opacity: isAnimating ? 0.8 : 1,
                transform: isAnimating ? 'scale(0.98)' : 'scale(1)'
              }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <svg className="w-10 h-10 text-[#2563EB]/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial Text */}
              <p className="text-lg md:text-xl text-gray-700 italic mb-8 leading-relaxed">
                "{testimonials[currentIndex].text}"
              </p>

              {/* Alumni Info */}
              <div className="flex items-center">
                <div className={`w-14 h-14 rounded-full ${testimonials[currentIndex].avatarColor} flex items-center justify-center text-xl font-bold ${testimonials[currentIndex].textColor} mr-4`}>
                  {testimonials[currentIndex].name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {testimonials[currentIndex].graduation}
                  </p>
                  <p className="text-[#2563EB] font-medium text-sm mt-1">
                    {testimonials[currentIndex].current}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-0 md:-left-16 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous testimonial"
              disabled={isAnimating || testimonials.length === 0}
            >
              <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 md:-right-16 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next testimonial"
              disabled={isAnimating || testimonials.length === 0}
            >
              <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-[#2563EB] w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}