"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Type definitions
interface TeacherData {
  id: string;
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
  email: string;
}

const ViewTeacherPage = () => {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;
  
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!teacherId) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching teacher with ID:", teacherId);
        
        // Use the admin API with query parameter
        const response = await fetch(`/api/admin/teacher?id=${teacherId}`);
        
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch teacher: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("API response:", result);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to load teacher data');
        }
        
        if (!result.data) {
          throw new Error('Teacher not found');
        }
        
        setTeacher(result.data);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error fetching teacher:', error);
        setError(error instanceof Error ? error.message : 'Failed to load teacher data');
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  // Skeleton Loading Components
  const SkeletonText = ({ className = "", lines = 1 }: { className?: string; lines?: number }) => (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  );

  const SkeletonBox = ({ className = "" }: { className?: string }) => (
    <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
  );

  const SkeletonProfileImage = () => (
    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 animate-pulse"></div>
  );

  const SkeletonStat = () => (
    <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
      <div className="h-3 w-16 bg-gray-300/50 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-24 bg-gray-300/70 rounded animate-pulse"></div>
    </div>
  );

  const SkeletonListItem = ({ withDot = true }: { withDot?: boolean }) => (
    <div className="flex items-start gap-3">
      {withDot && <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 animate-pulse"></div>}
      <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
    </div>
  );

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header Skeleton */}
        <div className="mb-6 md:mb-8">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-4"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Teacher Header Skeleton */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <SkeletonProfileImage />
                
                {/* Basic Info Skeleton */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <div className="h-8 w-48 bg-blue-400/50 rounded animate-pulse mx-auto md:mx-0 mb-2"></div>
                    <div className="h-5 w-36 bg-blue-300/50 rounded animate-pulse mx-auto md:mx-0"></div>
                  </div>
                  
                  {/* Quick Stats Skeleton */}
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <SkeletonStat />
                    <SkeletonStat />
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Details Skeleton */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Bio Skeleton */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <SkeletonBox className="h-40" />
                  </div>

                  {/* Teaching Philosophy Skeleton */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <SkeletonBox className="h-40" />
                  </div>

                  {/* Teaching Experience Skeleton */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonListItem key={i} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column Skeleton */}
                <div className="space-y-8">
                  {/* Education Skeleton */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
                      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <SkeletonListItem key={i} />
                      ))}
                    </div>
                  </div>

                  {/* Achievements Skeleton */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonListItem key={i} />
                      ))}
                    </div>
                  </div>

                  {/* Class Levels Skeleton */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
                      <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-end">
                <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Teacher</h2>
            <p className="text-gray-600 mb-6">{error || 'Teacher not found'}</p>
            <button
              onClick={() => router.push('/web-admin/teacher')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Teachers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Teacher Profile</h1>
            <p className="text-gray-600 mt-1">Viewing details for {teacher.name}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/web-admin/teacher/edit/${teacherId}`)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
            <button
              onClick={() => router.push('/web-admin/teacher')}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Teacher Header with Image */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                {teacher.image ? (
                  <img 
                    src={teacher.image} 
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                          <div class="text-white text-3xl font-bold">${teacher.name.charAt(0)}</div>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                    <div className="text-3xl font-bold">{teacher.name.charAt(0)}</div>
                  </div>
                )}
              </div>
              
              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{teacher.name}</h2>
                <p className="text-blue-100 text-lg mb-3">{teacher.subject}</p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
                    <div className="text-sm text-blue-100">Experience</div>
                    <div className="font-bold">{teacher.experience}</div>
                  </div>
                  
                  <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
                    <div className="text-sm text-blue-100">Email</div>
                    <div className="font-bold truncate max-w-[200px]">{teacher.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Details */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Professional Biography
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-5">
                    <p className="text-gray-700 whitespace-pre-line">{teacher.bio}</p>
                  </div>
                </div>

                {/* Teaching Philosophy */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </span>
                    Teaching Philosophy
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-5">
                    <p className="text-gray-700 whitespace-pre-line">{teacher.teachingPhilosophy}</p>
                  </div>
                </div>

                {/* Teaching Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </span>
                    Teaching Experience
                  </h3>
                  <div className="space-y-3">
                    {teacher.teachingExperience && teacher.teachingExperience.length > 0 ? (
                      teacher.teachingExperience.map((exp, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <p className="text-gray-700 flex-1">{exp}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No teaching experience listed</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Education */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </span>
                    Education
                  </h3>
                  <div className="space-y-3">
                    {teacher.education && teacher.education.length > 0 ? (
                      teacher.education.map((edu, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <p className="text-gray-700 flex-1">{edu}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No education listed</p>
                    )}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    Achievements & Awards
                  </h3>
                  <div className="space-y-3">
                    {teacher.achievements && teacher.achievements.length > 0 ? (
                      teacher.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          <p className="text-gray-700 flex-1">{achievement}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No achievements listed</p>
                    )}
                  </div>
                </div>

                {/* Class Levels */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Teacher Levels
                  </h3>
                  <div className="space-y-2">
                    {teacher.classLevels && teacher.classLevels.length > 0 ? (
                      teacher.classLevels.map((level, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{level}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No class levels assigned</p>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons at Bottom */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => router.push('/web-admin/teacher')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Teachers
              </button>
              <button
                onClick={() => router.push(`/web-admin/teacher/edit/${teacherId}`)}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacherPage;