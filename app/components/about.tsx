// components/AboutSection.tsx
"use client";

import { useState, useEffect } from "react";

export default function AboutSection() {
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    background: "#F9FAFB",
    card: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
  };

  // Updated features list with arrows
  const features = [
    {
      title: "Managed by IBA Sukkur University",
      color: colors.primaryBlue,
    },
    {
      title: "We offer Aga Khan and Sindh Board",
      color: colors.secondaryTeal,
    },
    {
      title: "Computer and Science Lab Faculty",
      color: colors.accentGreen,
    },
    {
      title: "Career Support",
      color: "#8B5CF6",
    }
  ];

  // Carousel images - FIXED: Using direct image URLs
  const carouselImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop&auto=format",
      alt: "School Campus"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop&auto=format",
      alt: "Classroom Learning"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop&auto=format",
      alt: "Science Laboratory"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop&auto=format",
      alt: "Computer Lab"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop&auto=format",
      alt: "Library"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&h=800&fit=crop&auto=format",
      alt: "Students Activity"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="py-12 md:py-16 bg-white" style={{ backgroundColor: colors.card }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Carousel */}
          <div className="lg:w-1/2">
            <div className="relative overflow-hidden rounded-2xl shadow-xl h-[400px] lg:h-[500px]">
              {/* Carousel */}
              <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselImages.map((image) => (
                  <div key={image.id} className="w-full flex-shrink-0 h-full relative">
                    <div className="w-full h-full bg-gray-100">
                      <img 
                        src={image.src} 
                        alt={image.alt}
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
                                <span class="mt-2 text-gray-500 font-medium">${image.alt}</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 z-10"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 z-10"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {carouselImages.map((_, index) => (
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
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:w-1/2">
            {/* Section Title */}
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4"
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                  color: colors.primaryBlue,
                }}
              >
                About Our School
              </span>

              {/* Main Heading */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Welcome to <span className="text-blue-600">Islamia public higher secondary school</span>
              </h1>

              {/* Description Paragraphs */}
              <div className="space-y-4 mb-8">
                <p className="text-gray-600 leading-relaxed">
                  Established as a premier educational institution, we are committed to providing 
                  excellence in academics and holistic development for students from KG to 12th grade.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  With strong university backing and modern facilities, we prepare students for 
                  success in higher education and beyond through innovative teaching methods and 
                  comprehensive support systems.
                </p>
              </div>

              {/* Features List with arrows at start (no boxes) */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 group"
                  >
                    {/* Arrow at start */}
                    <div className="pt-1 flex-shrink-0">
                      <svg 
                        className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" 
                        style={{ color: feature.color }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                    
                    {/* Feature text */}
                    <span 
                      className="text-gray-800 font-medium transition-colors duration-300 group-hover:text-gray-900"
                      style={{ color: colors.textPrimary }}
                    >
                      {feature.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}