// components/TestimonialsSection.tsx
'use client';

import { useState, useEffect } from 'react';

export default function TestimonialsSection() {
  // Alumni Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Ahmed Raza',
      graduation: 'Class of 2020 - Aga Khan Board',
      current: 'Software Engineer at Techlogix',
      text: 'The Aga Khan Board curriculum and computer lab facilities gave me a solid foundation for my computer science degree. The teachers were incredibly supportive.',
      avatarColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      name: 'Sana Khan',
      graduation: 'Class of 2019 - Sindh Board',
      current: 'Medical Student at Dow University',
      text: 'Excellent science faculty and lab facilities prepared me well for medical entrance exams. The biology and chemistry teachers were exceptional.',
      avatarColor: 'bg-teal-100 text-teal-600'
    },
    {
      id: 3,
      name: 'Bilal Siddiqui',
      graduation: 'Class of 2021 - Aga Khan Board',
      current: 'Business Student at IBA Karachi',
      text: 'The business studies program and career counseling helped me secure admission in IBA. The mock interviews were particularly helpful.',
      avatarColor: 'bg-green-100 text-green-600'
    },
    {
      id: 4,
      name: 'Ayesha Malik',
      graduation: 'Class of 2018 - Sindh Board',
      current: 'Architect at Design Associates',
      text: 'The art and design facilities along with excellent physics teaching helped me pursue architecture. Still grateful for the foundation I received.',
      avatarColor: 'bg-purple-100 text-purple-600'
    },
    {
      id: 5,
      name: 'Usman Ali',
      graduation: 'Class of 2022 - Aga Khan Board',
      current: 'Engineering Student at NUST',
      text: 'The mathematics and physics faculty were outstanding. Their teaching methods made complex concepts easy to understand for engineering entrance.',
      avatarColor: 'bg-orange-100 text-orange-600'
    },
    {
      id: 6,
      name: 'Fatima Hassan',
      graduation: 'Class of 2017 - Sindh Board',
      current: 'Chartered Accountant',
      text: 'The commerce program was excellent. The accounting teachers provided real-world insights that helped me in my CA journey.',
      avatarColor: 'bg-pink-100 text-pink-600'
    },
    {
      id: 7,
      name: 'Omar Farooq',
      graduation: 'Class of 2020 - Aga Khan Board',
      current: 'Data Analyst at Systems Limited',
      text: 'Computer lab facilities and programming basics taught in school gave me an edge in university. The IT faculty was ahead of its time.',
      avatarColor: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 8,
      name: 'Zainab Shah',
      graduation: 'Class of 2021 - Sindh Board',
      current: 'Law Student at University of London',
      text: 'The debating society and English language skills developed here were crucial for my law career. Excellent communication skills training.',
      avatarColor: 'bg-rose-100 text-rose-600'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('next');
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('prev');
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setDirection(index > currentIndex ? 'next' : 'prev');
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

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

        {/* Testimonial Carousel */}
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
              <div className={`w-14 h-14 rounded-full ${testimonials[currentIndex].avatarColor} flex items-center justify-center text-xl font-bold mr-4`}>
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
            className="absolute left-0 md:-left-16 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 md:-right-16 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial"
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
              />
            ))}
          </div>
        </div>

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