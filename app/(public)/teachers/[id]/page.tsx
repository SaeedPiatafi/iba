// app/teachers/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Icon Props Interface
interface IconProps {
  className?: string;
}

// Custom SVG icons
const GraduationCapIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 0 00-.788 0l-7 3a1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

const BackIcon = ({ className = "w-5 h-5 mr-2" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const BookIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const AwardIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const TeachingIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 0 00-.788 0l-7 3a1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

const EmptyIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
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

// Skeleton Loader Component
function TeacherProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 animate-pulse">
      <div className="max-w-6xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="h-6 bg-gray-300 rounded w-32 mb-8"></div>
        
        {/* Profile Card Skeleton */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Header Skeleton */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Image Skeleton */}
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto md:mx-0"></div>
              
              {/* Info Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto md:mx-0"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto md:mx-0"></div>
                <div className="h-5 bg-gray-300 rounded w-2/3 mx-auto md:mx-0"></div>
              </div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Bio Skeleton */}
                <div>
                  <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
                
                {/* Education Skeleton */}
                <div>
                  <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-8">
                {/* Classes Skeleton */}
                <div>
                  <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-12 bg-gray-300 rounded"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Display Component
function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
            onClick={() => window.history.back()}
            className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ 
  message, 
  icon: Icon = EmptyIcon,
  className = "text-gray-500"
}: { 
  message: string; 
  icon?: React.ComponentType<IconProps>;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className={`mb-4 ${className}`}>
        <Icon className="w-12 h-12" />
      </div>
      <p className="text-gray-600 text-center italic">{message}</p>
    </div>
  );
}

// Teacher Profile Component
export default function TeacherProfilePage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id;
  
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/teacher?id=${teacherId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to fetch teacher');
      }
      
      if (!result.data || result.data.length === 0) {
        throw new Error('Teacher not found');
      }
      
      setTeacher(result.data[0]);
    } catch (error) {
      console.error('Error fetching teacher:', error);
      setError(error instanceof Error ? error.message : 'Failed to load teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!teacher) return;
    
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

  // Show loading skeleton
  if (loading) {
    return <TeacherProfileSkeleton />;
  }

  // Show error state
  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchTeacher} />;
  }

  // Show not found
  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-yellow-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher Not Found</h2>
          <p className="text-gray-600 mb-6">The teacher you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/teachers')}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
          >
            Browse All Teachers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 md:mb-8 font-medium text-sm md:text-base transition-colors"
        >
          <BackIcon />
          Back to All Teachers
        </button>
        
        {/* Teacher Profile Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Profile Header */}
          <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Teacher Image */}
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg mx-auto md:mx-0">
                <img 
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              
              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{teacher.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm md:text-base">
                    {teacher.subject}
                  </span>
                  <span className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full font-semibold text-sm md:text-base">
                    {teacher.experience}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-800">{teacher.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* Bio Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-blue-600">
                      <UserIcon />
                    </div>
                    About the Teacher
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    <p className="text-gray-800 text-base md:text-lg leading-relaxed">{teacher.bio}</p>
                  </div>
                </section>
                
                {/* Education Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-teal-600">
                      <GraduationCapIcon />
                    </div>
                    Education Background
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    {teacher.education && teacher.education.length > 0 ? (
                      <div className="space-y-4">
                        {teacher.education.map((edu, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className={`${index === 0 ? 'bg-teal-600' : 'bg-blue-600'} text-white p-3 rounded-full`}>
                              <GraduationCapIcon />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {index === 0 ? 'Highest Degree' : 'Additional Education'}
                              </h3>
                              <p className="text-gray-800">{edu}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        message="No education background listed"
                        icon={GraduationCapIcon}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </section>
                
                {/* Teaching Experience Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-purple-600">
                      <TeachingIcon />
                    </div>
                    Teaching Experience
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    {teacher.teachingExperience && teacher.teachingExperience.length > 0 ? (
                      <div className="space-y-3">
                        {teacher.teachingExperience.map((exp, index) => (
                          <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                            <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                              <BriefcaseIcon />
                            </div>
                            <span className="text-gray-900 font-medium">{exp}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        message="No teaching experience listed"
                        icon={BriefcaseIcon}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </section>
                
                {/* Teaching Philosophy Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-green-600">
                      <BookIcon />
                    </div>
                    Teaching Philosophy
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    {teacher.teachingPhilosophy && teacher.teachingPhilosophy.trim() !== '' ? (
                      <p className="text-gray-800 text-base md:text-lg leading-relaxed italic">
                        "{teacher.teachingPhilosophy}"
                      </p>
                    ) : (
                      <EmptyState 
                        message="No teaching philosophy listed"
                        icon={BookIcon}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </section>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6 md:space-y-8">
                {/* Classes Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-pink-600">
                      <BookIcon />
                    </div>
                    Classes Teaching
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    {teacher.classLevels && teacher.classLevels.length > 0 ? (
                      <div className="space-y-3">
                        {teacher.classLevels.map((level, index) => (
                          <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                            <div className="bg-pink-100 text-pink-600 p-2 rounded-full">
                              <BookIcon />
                            </div>
                            <span className="text-gray-900 font-medium">{level}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        message="No classes listed"
                        icon={BookIcon}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </section>
                
                {/* Achievements Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-yellow-600">
                      <AwardIcon />
                    </div>
                    Awards & Achievements
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    {teacher.achievements && teacher.achievements.length > 0 ? (
                      <div className="space-y-3">
                        {teacher.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                            <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                              <AwardIcon />
                            </div>
                            <span className="text-gray-900 font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        message="No awards & achievements listed"
                        icon={AwardIcon}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}