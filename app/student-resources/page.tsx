// components/StudentResources.tsx
'use client';

import { useState, useEffect } from 'react';

interface Resource {
  id: number;
  title: string;
  type: 'Book' | 'Video' | 'Article' | 'Practice' | 'Exam';
  link: string;
  description: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    classes: string[];
    subjectsByClass: Record<string, string[]>;
    resources: Record<string, Record<string, Resource[]>>;
  };
  timestamp: string;
  error?: string;
}

export default function StudentResources() {
  // Color palette
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    accentPurple: "#7C3AED",
    accentOrange: "#F97316",
    background: "#F9FAFB",
    card: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    sidebarBg: "#F8FAFC",
  };

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse['data'] | null>(null);
  const [selectedClass, setSelectedClass] = useState("Class 9");
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [currentSubjects, setCurrentSubjects] = useState<string[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/resources');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to load resources data');
        }
        
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resources data');
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Update subjects based on selected class
  useEffect(() => {
    if (!data) return;

    if (selectedClass.includes("6") || selectedClass.includes("7") || selectedClass.includes("8")) {
      setCurrentSubjects(data.subjectsByClass["Class 6-8"] || []);
    } else if (selectedClass.includes("9") || selectedClass.includes("10")) {
      setCurrentSubjects(data.subjectsByClass["Class 9-10"] || []);
    } else if (selectedClass.includes("Science")) {
      setCurrentSubjects(data.subjectsByClass["Science"] || []);
    } else if (selectedClass.includes("Commerce")) {
      setCurrentSubjects(data.subjectsByClass["Commerce"] || []);
    } else if (selectedClass.includes("Arts")) {
      setCurrentSubjects(data.subjectsByClass["Arts"] || []);
    }
    
    // Reset to first subject when class changes
    if (selectedClass.includes("6") || selectedClass.includes("7") || selectedClass.includes("8")) {
      setSelectedSubject("Mathematics");
    } else if (selectedClass.includes("9") || selectedClass.includes("10")) {
      setSelectedSubject("Mathematics");
    } else if (selectedClass.includes("Science")) {
      setSelectedSubject("Mathematics");
    } else if (selectedClass.includes("Commerce")) {
      setSelectedSubject("Principles of Accounting");
    } else if (selectedClass.includes("Arts")) {
      setSelectedSubject("English Literature");
    }
  }, [selectedClass, data]);

  // Get resources for selected class and subject
  const getResources = () => {
    if (!data || !data.resources) return [];
    
    const classResources = data.resources[selectedClass];
    if (!classResources) {
      // Fallback to Class 9 if no resources for selected class
      return data.resources["Class 9"]?.[selectedSubject] || [];
    }
    return classResources[selectedSubject] || [];
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Book': return colors.primaryBlue;
      case 'Video': return colors.secondaryTeal;
      case 'Article': return colors.accentGreen;
      case 'Practice': return colors.accentPurple;
      case 'Exam': return colors.accentOrange;
      default: return colors.textPrimary;
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Book':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'Video':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'Article':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case 'Practice':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'Exam':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div 
      className="bg-white rounded-xl p-5 animate-pulse"
      style={{ border: `1px solid ${colors.border}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
      
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen py-8 md:py-12" suppressHydrationWarning style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section - Always visible */}
          <div className="text-center mb-8 md:mb-12">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ 
                color: colors.textPrimary,
                fontFamily: "var(--font-montserrat)",
                lineHeight: "1.2"
              }}
            >
              Student Resources Hub
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Access study materials, videos, and practice resources for your subjects
            </p>
          </div>

          {/* Class Selection Skeleton */}
          <div className="mb-8 md:mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="h-14 bg-gray-200 rounded-xl max-w-md"></div>
            </div>
          </div>

          {/* Desktop Layout Skeleton */}
          <div className="hidden lg:flex lg:flex-row gap-8">
            {/* Subjects Sidebar Skeleton */}
            <div className="w-1/4">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources Main Content Skeleton */}
            <div className="w-3/4">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Resources Grid Skeleton - 2 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout Skeleton */}
          <div className="block lg:hidden">
            {/* Mobile Subject Selection Skeleton */}
            <div className="mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="flex overflow-x-auto pb-4 space-x-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-xl w-32 flex-shrink-0"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Resources Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen py-12 md:py-16 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Error Loading Resources</h3>
          <p className="mb-4" style={{ color: colors.textSecondary }}>{error || 'Failed to load resources'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: colors.primaryBlue,
              color: 'white'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12" suppressHydrationWarning style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Always visible */}
        <div className="text-center mb-8 md:mb-12">
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ 
              color: colors.textPrimary,
              fontFamily: "var(--font-montserrat)",
              lineHeight: "1.2"
            }}
          >
            Student Resources Hub
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            Access study materials, videos, and practice resources for your subjects
          </p>
        </div>

        {/* Class Selection - Dropdown */}
        <div className="mb-8 md:mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                Select Your Class
              </h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Choose your class from the dropdown below
              </p>
            </div>
            
            {/* Dropdown for Class Selection */}
            <div className="relative max-w-md">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:outline-none appearance-none"
                style={{
                  borderColor: colors.primaryBlue,
                  color: colors.textPrimary,
                  backgroundColor: 'white',
                  fontSize: '16px',
                }}
              >
                {data.classes.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5" style={{ color: colors.primaryBlue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Mobile Layout */}
        <div className="block lg:hidden">
          {/* Mobile Subject Selection - Scrollable Menu */}
          <div className="mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                Select Subject
              </h3>
              
              {/* Mobile Scrollable Subjects */}
              <div className="relative">
                <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                  Scroll horizontally to see all subjects →
                </p>
                <div className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide -mx-2 px-2">
                  {currentSubjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`flex-shrink-0 px-5 py-3 rounded-xl transition-all min-w-fit ${
                        selectedSubject === subject
                          ? 'ring-2 ring-offset-2'
                          : 'hover:shadow-md'
                      }`}
                      style={{
                        backgroundColor: selectedSubject === subject 
                          ? colors.primaryBlue 
                          : 'white',
                        border: `1px solid ${
                          selectedSubject === subject 
                            ? colors.primaryBlue 
                            : colors.border
                        }`,
                        color: selectedSubject === subject 
                          ? 'white' 
                          : colors.textPrimary,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <div className="font-medium text-sm">
                        {subject}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Scroll indicators */}
                <div className="flex justify-center space-x-1 mt-3">
                  {[0, 1, 2].map((dot) => (
                    <div 
                      key={dot}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ 
                        backgroundColor: dot === 0 ? colors.primaryBlue : colors.border 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Resources Display */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Subject Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                {selectedSubject}
              </h2>
              <p className="text-lg" style={{ color: colors.textSecondary }}>
                Resources for {selectedClass}
              </p>
            </div>

            {/* Mobile Resources List */}
            {getResources().length > 0 ? (
              <div className="space-y-4">
                {getResources().map((resource) => (
                  <div 
                    key={resource.id}
                    className="rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
                    style={{ 
                      border: `1px solid ${colors.border}`,
                      backgroundColor: 'white'
                    }}
                  >
                    {/* Resource Type Badge */}
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2"
                        style={{ backgroundColor: `${getTypeColor(resource.type)}15` }}>
                        <div style={{ color: getTypeColor(resource.type) }}>
                          {getTypeIcon(resource.type)}
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${getTypeColor(resource.type)}15`,
                          color: getTypeColor(resource.type)
                        }}>
                        {resource.type}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold mb-2" style={{ color: colors.textPrimary }}>
                      {resource.title}
                    </h3>
                    
                    <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                      {resource.description}
                    </p>
                    
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 rounded-lg transition-colors hover:shadow-sm text-sm w-full justify-center"
                      style={{ 
                        backgroundColor: `${colors.primaryBlue}10`,
                        color: colors.primaryBlue
                      }}
                    >
                      <span>Open Resource</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.textSecondary}10` }}>
                  <svg className="w-8 h-8" style={{ color: colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                  No Resources Available
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Select a different subject for resources
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Desktop Layout */}
        <div className="hidden lg:flex lg:flex-row gap-8">
          {/* Subjects Sidebar */}
          <div className="w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                Subjects for {selectedClass}
              </h3>
              
              <div className="space-y-2">
                {currentSubjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedSubject === subject
                        ? 'transform scale-[1.02]'
                        : 'hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: selectedSubject === subject 
                        ? `${colors.primaryBlue}10` 
                        : 'transparent',
                      border: `1px solid ${
                        selectedSubject === subject 
                          ? colors.primaryBlue 
                          : colors.border
                      }`,
                      color: selectedSubject === subject 
                        ? colors.primaryBlue 
                        : colors.textPrimary,
                    }}
                  >
                    <div className="font-medium">{subject}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resources Main Content */}
          <div className="w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Subject Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                    {selectedSubject} Resources
                  </h2>
                  <p className="text-lg" style={{ color: colors.textSecondary }}>
                    For {selectedClass}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Filter:</span>
                  <select 
                    className="px-3 py-2 rounded-lg border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="all">All Types</option>
                    <option value="book">Books</option>
                    <option value="video">Videos</option>
                    <option value="article">Articles</option>
                    <option value="practice">Practice</option>
                    <option value="exam">Exams</option>
                  </select>
                </div>
              </div>

              {/* Resources Grid - 2 columns on desktop */}
              {getResources().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getResources().map((resource) => (
                    <div 
                      key={resource.id}
                      className="rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      style={{ 
                        border: `1px solid ${colors.border}`,
                        backgroundColor: 'white'
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${getTypeColor(resource.type)}15` }}>
                            <div style={{ color: getTypeColor(resource.type) }}>
                              {getTypeIcon(resource.type)}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: `${getTypeColor(resource.type)}15`,
                                color: getTypeColor(resource.type)
                              }}>
                              {resource.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                        {resource.title}
                      </h3>
                      
                      <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                        {resource.description}
                      </p>
                      
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-lg transition-colors hover:shadow-sm"
                        style={{ 
                          backgroundColor: `${colors.primaryBlue}10`,
                          color: colors.primaryBlue
                        }}
                      >
                        <span>Open Resource</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.textSecondary}10` }}>
                    <svg className="w-10 h-10" style={{ color: colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                    No Resources Available
                  </h3>
                  <p className="max-w-md mx-auto" style={{ color: colors.textSecondary }}>
                    We're adding more resources for {selectedSubject} in {selectedClass}. 
                    Please check back soon or select a different subject.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}