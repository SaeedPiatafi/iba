"use client";

import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  schoolName?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  schoolName = "Prestige Academy" 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  // Using reliable Unsplash images
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop&auto=format",
      alt: "School building",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop&auto=format",
      alt: "Students learning",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=800&fit=crop&auto=format",
      alt: "School library",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop&auto=format",
      alt: "Classroom activity",
    }
  ];

  const headlines = [
    {
      title: "Managed by IBA Sukkur University",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
        </svg>
      ),
      color: "text-[#2563EB]",
      bgColor: "bg-[#2563EB]/10"
    },
    {
      title: "Sukkur & Aga Khan Board",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-[#0D9488]",
      bgColor: "bg-[#0D9488]/10"
    },
    {
      title: "Computer & Science Labs",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-[#16A34A]",
      bgColor: "bg-[#16A34A]/10"
    }
  ];

  useEffect(() => {
    setIsClient(true);
    
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* REVERSED: Carousel on LEFT side in loading state */}
        <div className="lg:w-1/2 h-[50vh] lg:h-screen bg-gray-200 animate-pulse"></div>
        
        {/* REVERSED: Content on RIGHT side in loading state */}
        <div className="lg:w-1/2 p-8 lg:p-12 bg-white flex flex-col justify-center">
          <div className="space-y-6 max-w-md">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-7 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-gray-100 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* REVERSED: Carousel on LEFT side */}
      <div className="lg:w-1/2 relative overflow-hidden h-[50vh] lg:h-screen">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className="w-full flex-shrink-0 h-full relative"
            >
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <img 
                  src={slide.image} 
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                          </svg>
                          <span class="mt-2 text-gray-500 font-medium">${slide.alt}</span>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
              {/* Changed gradient direction for left placement */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 z-10"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 z-10"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-6' 
                  : 'bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Simple overlay - position remains same */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
          <p className="text-xs opacity-90">Campus Life & Facilities</p>
        </div>
      </div>

      {/* REVERSED: Content on RIGHT side */}
      <div className="lg:w-1/2 p-6 md:p-8 lg:p-12 bg-white flex flex-col justify-center">
        <div className="max-w-md mx-auto lg:mx-0">
          {/* Welcome Heading */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1F2937] mb-3 leading-tight">
              Welcome to <span className="text-[#2563EB]">{schoolName}</span>
            </h1>
          </div>

          {/* Increased Description */}
          <div className="mb-8">
            <p className="text-sm text-[#6B7280] leading-relaxed mb-3">
              A premier educational institution committed to excellence in academics and holistic development.
            </p>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              We provide a nurturing environment that fosters intellectual growth, character building, and prepares students for success in higher education and beyond.
            </p>
          </div>

          {/* Headlines List with shorter titles */}
          <div className="space-y-3 mb-8">
            {headlines.map((headline, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200"
              >
                <div className={`${headline.bgColor} p-2 rounded-lg flex-shrink-0`}>
                  <div className={headline.color}>
                    {headline.icon}
                  </div>
                </div>
                <span className="text-sm text-[#1F2937] font-medium leading-tight">
                  {headline.title}
                </span>
              </div>
            ))}
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default HeroSection;