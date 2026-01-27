'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Teacher {
  id: number;
  name: string;
  designation: string;
  image: string;
  delay: string;
}

export default function TeachersSection() {
  const router = useRouter();
  
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

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teachers from API (limit to 4)
  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/teacher?limit=4');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch teachers: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTeachers(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch teachers');
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load teachers');
      // Fallback to empty array
      setTeachers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Add fadeInUp animation when component mounts
  useEffect(() => {
    if (isLoading) return;
    
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
  }, [isLoading]);

  // Handle View Profile button click
  const handleViewProfile = (teacherId: number) => {
    router.push(`/teachers/${teacherId}`);
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="wow fadeInUp" data-wow-delay={`${(index * 0.2) + 0.1}s`}>
          <div 
            className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse"
            style={{ 
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Image Skeleton */}
            <div className="h-64 md:h-72 bg-gray-200"></div>
            
            {/* Content Skeleton */}
            <div className="p-6 text-center space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state component
  const ErrorDisplay = () => (
    <div className="text-center py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Teachers</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchTeachers}
          className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors duration-300"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Teachers Available</h3>
        <p className="text-gray-600">Check back later for teacher information.</p>
      </div>
    </div>
  );

  return (
    <div className="py-10 md:py-20" style={{ backgroundColor: colors.card }}>
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

        {/* Loading State */}
        {isLoading && <SkeletonLoader />}

        {/* Error State */}
        {error && !isLoading && <ErrorDisplay />}

        {/* Empty State */}
        {!isLoading && !error && teachers.length === 0 && <EmptyState />}

        {/* Teachers Grid */}
        {!isLoading && !error && teachers.length > 0 && (
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
                        const container = e.currentTarget.parentElement;
                        if (container) {
                          container.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);">
                              <div class="text-center">
                                <div class="text-white text-6xl font-bold mb-2">${initials}</div>
                                <div class="text-white/90 text-lg">${teacher.name}</div>
                              </div>
                            </div>
                          `;
                        }
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
                    
                    {/* View Profile Button */}
                    <button
                      onClick={() => handleViewProfile(teacher.id)}
                      className="mt-4 w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-sm flex items-center justify-center gap-2"
                    >
                      <span>View Profile</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button - Only show if we have teachers */}
        {!isLoading && !error && teachers.length > 0 && (
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
        )}
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
          
          .h-64 {
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
          
          .h-64 {
            height: 220px !important;
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
      `}</style>
    </div>
  );
}