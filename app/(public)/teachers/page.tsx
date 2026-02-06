// app/teachers/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Icon Props Interface
interface IconProps {
  className?: string;
}

// Custom SVG icons
const SearchIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

// Teacher Type Definition
interface Teacher {
  id: number;
  name: string;
  subject: string;
  classLevels: string[];
  image: string;
  education: string[];
  experience: string;
  teachingExperience: string[];
  bio: string;
  achievements: string[];
  teachingPhilosophy: string;
  officeHours: string;
  roomNumber: string;
  email: string;
}

// API Response Type
interface ApiResponse {
  success: boolean;
  data: Teacher[];
  count: number;
  timestamp: string;
}

// Error Display Component
function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}

// Props for TeacherCard component
interface TeacherCardProps {
  teacher: Teacher;
  onViewProfile: (id: number) => void;
}

// Teacher Card Component
function TeacherCard({ teacher, onViewProfile }: TeacherCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    if (target.parentElement) {
      target.parentElement.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-600">
          <span class="text-white text-4xl font-bold">${teacher.name.charAt(0)}</span>
        </div>
      `;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      {/* Teacher Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="relative w-full h-full">
            <img 
              src={teacher.image}
              alt={teacher.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        </div>
      </div>
      
      {/* Teacher Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{teacher.name}</h3>
        <p className="text-blue-600 font-semibold mb-3 line-clamp-1">{teacher.subject}</p>
        
        {/* View Profile Button */}
        <div className="mt-auto">
          <button
            onClick={() => onViewProfile(teacher.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-sm"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Teacher Card Skeleton Component (only for cards)
function TeacherCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-full flex flex-col">
      <div className="h-48 bg-gray-300 animate-pulse"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded mb-4 animate-pulse w-3/4"></div>
        <div className="mt-auto">
          <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Main Teachers Page Component
export default function TeachersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const teachersPerPage = 10;

  // Fetch teachers data
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
  try {
    setLoading(true);
    setError('');
    
    const response = await fetch('/api/teacher'); 
    
    if (!response.ok) {
      throw new Error(`Failed to fetch teachers: ${response.status}`);
    }
    
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to load teachers');
    }
    
    setTeachers(result.data);
    setFilteredTeachers(result.data);
    setLoading(false);
    
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load teachers');
    setLoading(false);
    console.error('Error fetching teachers:', err);
  }
};

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTeachers(teachers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(query) ||
        teacher.subject.toLowerCase().includes(query) ||
        teacher.classLevels.some(level => level.toLowerCase().includes(query))
      );
      setFilteredTeachers(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, teachers]);

  const handleViewProfile = (teacherId: number) => {
    router.push(`/teachers/${teacherId}`);
  };

  // Pagination logic
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show error state
  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchTeachers} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading - Always visible */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Faculty
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
            Meet our dedicated and experienced teaching faculty members
          </p>
        </div>

        {/* Search Bar - Always visible */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teachers by name, subject, or grade..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Teachers Grid - Shows skeleton while loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <TeacherCardSkeleton key={index} />
            ))}
          </div>
        ) : currentTeachers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentTeachers.map((teacher) => (
                <TeacherCard 
                  key={teacher.id} 
                  teacher={teacher} 
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mb-12">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* Page Info */}
                <p className="text-gray-600 text-sm">
                  Showing {indexOfFirstTeacher + 1}-{Math.min(indexOfLastTeacher, filteredTeachers.length)} of {filteredTeachers.length} teachers
                </p>
              </div>
            )}

            {/* Results Count */}
            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Found <span className="font-semibold text-blue-600">{filteredTeachers.length}</span> teachers
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-600 text-xl mb-4">
              No teachers found matching "{searchQuery}"
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg transition-all duration-300"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}