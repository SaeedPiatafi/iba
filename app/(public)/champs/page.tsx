// components/ChampsAKUEB.tsx
'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: number;
  name: string;
  percentage: number;
  image: string;
  year: number;
  class: string;
}

interface ApiResponse {
  success: boolean;
  data: Student[];
  count: number;
  timestamp: string;
  error?: string;
}

export default function ChampsAKUEB() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 8;

  // Fetch data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/champs');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to load students data');
        }
        
        // Ensure data is an array
        if (result.data && Array.isArray(result.data)) {
          setStudents(result.data);
        } else {
          console.warn('API returned non-array data:', result.data);
          setStudents([]);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load students data');
        console.error('Error fetching students:', err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil((students?.length || 0) / studentsPerPage);

  // Get current students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = (students || []).slice(indexOfFirstStudent, indexOfLastStudent);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Color palette
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    accentYellow: "#F59E0B",
    background: "#F9FAFB",
    card: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
  };

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
      style={{ border: `1px solid ${colors.border}` }}
    >
      {/* Image skeleton */}
      <div className="h-48" style={{ backgroundColor: colors.background }}></div>
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Name skeleton */}
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        
        <div className="space-y-3 mb-4">
          {/* Percentage skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
          
          {/* Class skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          
          {/* Year skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
            <div className="h-6 bg-gray-200 rounded w-1/5"></div>
          </div>
        </div>
        
        {/* Performance bar skeleton */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  // StudentCard Component
  const StudentCard = ({ student }: { student: Student }) => {
    const [imgError, setImgError] = useState(false);
    
    return (
      <div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        style={{ border: `1px solid ${colors.border}` }}
      >
        {/* Student Image */}
        <div className="h-48 relative overflow-hidden">
          {imgError ? (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.primaryBlue}10` }}
            >
              <span 
                className="text-3xl font-bold"
                style={{ color: colors.primaryBlue }}
              >
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          ) : (
            <img 
              src={student.image} 
              alt={student.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          )}
        </div>

        {/* Student Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {student.name}
          </h3>
          
          <div className="space-y-3 mb-4">
            {/* Percentage */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: colors.textSecondary }}>Percentage:</span>
              <div className="flex items-center">
                <span className="text-lg font-bold mr-1" style={{ color: colors.primaryBlue }}>
                  {student.percentage}%
                </span>
                {student.percentage >= 95 ? (
                  <svg className="w-5 h-5" style={{ color: colors.accentGreen }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : student.percentage >= 90 ? (
                  <svg className="w-5 h-5" style={{ color: colors.primaryBlue }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                ) : null}
              </div>
            </div>
            
            {/* Class */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: colors.textSecondary }}>Class:</span>
              <span className="text-sm font-medium px-2 py-1 rounded" 
                style={{ 
                  backgroundColor: `${colors.secondaryTeal}10`,
                  color: colors.secondaryTeal
                }}>
                {student.class}
              </span>
            </div>
            
            {/* Year */}
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: colors.textSecondary }}>Year:</span>
              <span className="text-sm font-medium px-2 py-1 rounded-full" 
                style={{ 
                  backgroundColor: `${colors.accentGreen}15`,
                  color: colors.accentGreen
                }}>
                {student.year}
              </span>
            </div>
          </div>

          {/* Performance Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: colors.textSecondary }}>Performance Score</span>
              <span className="font-medium" style={{ color: colors.primaryBlue }}>{student.percentage}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.border}` }}>
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${student.percentage}%`,
                  backgroundColor: student.percentage >= 95 ? colors.accentGreen :
                                 student.percentage >= 90 ? colors.primaryBlue :
                                 colors.accentYellow
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 md:py-16" suppressHydrationWarning style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Always shown without skeleton */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ 
              color: colors.textPrimary,
              fontFamily: "var(--font-montserrat)",
              lineHeight: "1.2"
            }}
          >
            Champs(AKU-EB)
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            Celebrating our top-performing students in the Aga Khan University Examination Board
          </p>
        </div>

        {/* Students Grid with Skeleton Loading */}
        <div className="mb-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination - Only show when not loading and there are students */}
        {!loading && students.length > 0 && (
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            {/* Page Info */}
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, students.length)} of {students.length} students
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                style={{ 
                  color: currentPage === 1 ? colors.textSecondary : colors.primaryBlue,
                  border: `1px solid ${colors.border}`
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show page numbers around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        currentPage === pageNum 
                          ? 'transform scale-105 shadow-md' 
                          : 'hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: currentPage === pageNum ? colors.primaryBlue : 'transparent',
                        color: currentPage === pageNum ? 'white' : colors.textPrimary,
                        border: `1px solid ${currentPage === pageNum ? colors.primaryBlue : colors.border}`,
                        fontWeight: currentPage === pageNum ? 'bold' : 'normal'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Ellipsis for many pages */}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2" style={{ color: colors.textSecondary }}>...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ 
                        color: colors.textPrimary,
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                style={{ 
                  color: currentPage === totalPages ? colors.textSecondary : colors.primaryBlue,
                  border: `1px solid ${colors.border}`
                }}
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}