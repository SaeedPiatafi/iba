// components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
  };

  // Carousel slides data with new images
  const slides = [
    {
      id: 1,
      title: 'Excellence in Education Since 1995',
      subtitle: 'Pioneering Academic Excellence',
      description: 'At IBA, we nurture young minds with innovative teaching methods, state-of-the-art facilities, and a commitment to holistic development.',
      cta1: 'Explore Programs',
      cta2: 'Admissions Open',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWR1Y2F0aW9ufGVufDB8fDB8fHww'
    },
    {
      id: 2,
      title: 'Shaping Future Leaders',
      subtitle: 'Comprehensive Learning Environment',
      description: 'Our dedicated faculty and modern curriculum empower students to excel academically while developing essential life skills for tomorrow\'s challenges.',
      cta1: 'Meet Our Faculty',
      cta2: 'View Campus',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      title: 'Where Curiosity Meets Innovation',
      subtitle: 'STEM & Beyond',
      description: 'From robotics labs to art studios, we provide diverse learning opportunities that inspire creativity and critical thinking in every student.',
      cta1: 'STEM Programs',
      cta2: 'Arts & Culture',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative overflow-hidden h-screen">
      {/* Carousel Container - Full height with padding for header */}
      <div className="relative h-full w-full pt-20">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with subtle overlay */}
            <div className="absolute inset-0">
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                {/* Subtle gradient overlay - reduced opacity */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/30"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  {/* Subtitle with white background */}
                  <div 
                    className="inline-flex items-center px-4 py-2 rounded-full mb-4 md:mb-6 bg-white animate-fadeInUp"
                  >
                    <span 
                      className="text-xs sm:text-sm font-bold uppercase tracking-wider"
                      style={{ 
                        color: colors.primaryBlue,
                        fontFamily: 'var(--font-poppins)',
                        letterSpacing: '0.1em'
                      }}
                    >
                      {slide.subtitle}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white animate-fadeInUp leading-tight sm:leading-snug"
                    style={{
                      fontFamily: 'var(--font-montserrat)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p 
                    className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-2xl text-white animate-fadeInUp leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      animationDelay: '200ms',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                    <a
                      href="/programs"
                      className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 text-center"
                      style={{
                        backgroundColor: colors.primaryBlue,
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-poppins)',
                        minWidth: '180px',
                      }}
                    >
                      <span className="text-sm sm:text-base md:text-lg">
                        {slide.cta1}
                      </span>
                    </a>
                    <a
                      href="/admissions"
                      className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 border-2 border-white text-white text-center hover:bg-white/10"
                      style={{
                        fontFamily: 'var(--font-poppins)',
                        backgroundColor: 'transparent',
                        minWidth: '180px',
                      }}
                    >
                      <span className="text-sm sm:text-base md:text-lg">
                        {slide.cta2}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 md:left-8 top-1/2 transform -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide ? 'scale-125' : 'scale-100'
              }`}
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: index === currentSlide ? colors.primaryBlue : 'rgba(255, 255, 255, 0.5)',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Straight Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div 
          className="h-12 bg-gradient-to-t from-white to-transparent"
        ></div>
        <div className="h-4 bg-white"></div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
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
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          section {
            height: 100vh;
            max-height: 100vh;
          }
          
          h1 {
            font-size: 2rem !important;
            line-height: 1.2 !important;
          }
          
          p {
            font-size: 1rem !important;
            line-height: 1.5 !important;
          }
          
          .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .bottom-gradient {
            height: 8px !important;
          }
        }
        
        @media (max-width: 480px) {
          h1 {
            font-size: 1.75rem !important;
          }
          
          .bottom-gradient {
            height: 6px !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          h1 {
            font-size: 2.5rem !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          h1 {
            font-size: 3.5rem !important;
          }
        }
        
        @media (min-width: 1025px) {
          h1 {
            font-size: 4rem !important;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.3s ease;
        }
        
        /* Image overlay adjustment */
        .bg-gradient-overlay {
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.5) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.3) 100%
          );
        }
      `}</style>
    </section>
  );
}