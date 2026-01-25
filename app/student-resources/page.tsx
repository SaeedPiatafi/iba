// components/StudentResources.tsx
'use client';

import { useState, useEffect } from 'react';

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

  // Classes data
  const classes = [
    "Class 6", "Class 7", "Class 8", "Class 9", 
    "Class 10", "Class 11 Science", "Class 11 Commerce", 
    "Class 11 Arts", "Class 12 Science", "Class 12 Commerce", 
    "Class 12 Arts"
  ];

  // Subjects data for each class category
  const subjectsByClass: Record<string, string[]> = {
    "Class 6-8": [
      "Mathematics", "Science", "English", "Social Studies", 
      "Computer Science", "Urdu", "Islamiyat", "General Knowledge"
    ],
    "Class 9-10": [
      "Mathematics", "Physics", "Chemistry", "Biology", 
      "English", "Urdu", "Islamiyat", "Pakistan Studies",
      "Computer Science"
    ],
    "Science": [
      "Mathematics", "Physics", "Chemistry", "Biology",
      "English", "Urdu", "Islamiyat", "Pakistan Studies",
      "Computer Science"
    ],
    "Commerce": [
      "Principles of Accounting", "Business Studies", "Economics",
      "Mathematics", "Statistics", "English", "Urdu",
      "Islamiyat", "Pakistan Studies"
    ],
    "Arts": [
      "English Literature", "Urdu Literature", "Islamic Studies",
      "Pakistan Studies", "Sociology", "Psychology", "Geography",
      "History", "Political Science"
    ]
  };

  // Resources data structure
  const resources: Record<string, Record<string, Array<{
    id: number;
    title: string;
    type: 'Book' | 'Video' | 'Article' | 'Practice' | 'Exam';
    link: string;
    description: string;
  }>>> = {
    "Class 6": {
      "Mathematics": [
        { id: 1, title: "Basic Algebra Guide", type: "Book", link: "https://example.com/math6-book", description: "Complete guide to algebra basics" },
        { id: 2, title: "Fractions and Decimals", type: "Video", link: "https://khanacademy.org/fractions", description: "Video lessons on fractions" },
        { id: 3, title: "Math Practice Problems", type: "Practice", link: "https://example.com/math-practice", description: "Interactive practice problems" },
        { id: 4, title: "Geometry Basics", type: "Video", link: "https://khanacademy.org/geometry", description: "Introduction to geometry" },
      ],
      "Science": [
        { id: 5, title: "Science Textbook", type: "Book", link: "https://example.com/science6-book", description: "Full science curriculum" },
        { id: 6, title: "Biology Basics", type: "Video", link: "https://khanacademy.org/biology-basics", description: "Introduction to biology" },
        { id: 7, title: "Science Experiments", type: "Article", link: "https://example.com/science-experiments", description: "Fun science experiments" },
      ],
      "English": [
        { id: 8, title: "English Grammar", type: "Book", link: "https://example.com/english-grammar", description: "Complete grammar guide" },
        { id: 9, title: "Vocabulary Builder", type: "Practice", link: "https://example.com/vocabulary", description: "Interactive vocabulary exercises" },
      ],
    },
    "Class 7": {
      "Mathematics": [
        { id: 10, title: "Algebra Fundamentals", type: "Book", link: "https://example.com/algebra7-book", description: "Algebra concepts for Class 7" },
        { id: 11, title: "Geometry Advanced", type: "Video", link: "https://khanacademy.org/geometry-advanced", description: "Advanced geometry topics" },
      ],
      "Science": [
        { id: 12, title: "Physics Basics", type: "Book", link: "https://example.com/physics7-book", description: "Introduction to physics" },
        { id: 13, title: "Chemistry Experiments", type: "Video", link: "https://example.com/chemistry-videos", description: "Chemistry lab experiments" },
      ],
    },
    "Class 8": {
      "Mathematics": [
        { id: 14, title: "Advanced Mathematics", type: "Book", link: "https://example.com/math8-book", description: "Complete Class 8 math" },
        { id: 15, title: "Algebra Practice", type: "Practice", link: "https://example.com/algebra-practice", description: "Algebra practice problems" },
      ],
      "Science": [
        { id: 16, title: "General Science", type: "Book", link: "https://example.com/science8-book", description: "Science textbook Class 8" },
      ],
    },
    "Class 9": {
      "Physics": [
        { id: 17, title: "Physics Concepts", type: "Book", link: "https://example.com/physics9-book", description: "Complete physics guide" },
        { id: 18, title: "Motion and Force", type: "Video", link: "https://khanacademy.org/physics-motion", description: "Video lectures on motion" },
        { id: 19, title: "Past Papers 2023", type: "Exam", link: "https://example.com/past-papers", description: "Previous year exam papers" },
        { id: 20, title: "Physics Formulas", type: "Article", link: "https://example.com/physics-formulas", description: "Important formulas sheet" },
      ],
      "Chemistry": [
        { id: 21, title: "Chemistry Textbook", type: "Book", link: "https://example.com/chemistry9-book", description: "Official chemistry textbook" },
        { id: 22, title: "Chemical Reactions", type: "Video", link: "https://khanacademy.org/chemical-reactions", description: "Chemical reactions explained" },
      ],
      "Mathematics": [
        { id: 23, title: "Mathematics Class 9", type: "Book", link: "https://example.com/math9-book", description: "Complete math textbook" },
        { id: 24, title: "Algebra Tutorials", type: "Video", link: "https://khanacademy.org/algebra", description: "Algebra video lessons" },
      ],
    },
    "Class 10": {
      "Physics": [
        { id: 25, title: "Physics Class 10", type: "Book", link: "https://example.com/physics10-book", description: "Complete physics guide" },
        { id: 26, title: "Electricity Tutorials", type: "Video", link: "https://khanacademy.org/electricity", description: "Electricity and circuits" },
      ],
    },
    "Class 11 Science": {
      "Physics": [
        { id: 27, title: "Advanced Physics", type: "Book", link: "https://example.com/physics11-book", description: "FSC Part 1 Physics" },
        { id: 28, title: "Mechanics Videos", type: "Video", link: "https://khanacademy.org/mechanics", description: "Complete mechanics course" },
      ],
      "Chemistry": [
        { id: 29, title: "Organic Chemistry", type: "Book", link: "https://example.com/organic-chem", description: "Organic chemistry guide" },
        { id: 30, title: "Chemical Bonding", type: "Video", link: "https://khanacademy.org/chemical-bonding", description: "Video lessons on bonding" },
      ],
    },
    "Class 12 Science": {
      "Mathematics": [
        { id: 31, title: "Calculus Complete", type: "Book", link: "https://example.com/calculus-book", description: "Advanced calculus topics" },
        { id: 32, title: "Integration Tutorials", type: "Video", link: "https://khanacademy.org/integration", description: "Step-by-step integration" },
      ],
    },
  };

  // State
  const [selectedClass, setSelectedClass] = useState("Class 9");
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [currentSubjects, setCurrentSubjects] = useState<string[]>([]);

  // Update subjects based on selected class
  useEffect(() => {
    if (selectedClass.includes("6") || selectedClass.includes("7") || selectedClass.includes("8")) {
      setCurrentSubjects(subjectsByClass["Class 6-8"]);
    } else if (selectedClass.includes("9") || selectedClass.includes("10")) {
      setCurrentSubjects(subjectsByClass["Class 9-10"]);
    } else if (selectedClass.includes("Science")) {
      setCurrentSubjects(subjectsByClass["Science"]);
    } else if (selectedClass.includes("Commerce")) {
      setCurrentSubjects(subjectsByClass["Commerce"]);
    } else if (selectedClass.includes("Arts")) {
      setCurrentSubjects(subjectsByClass["Arts"]);
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
  }, [selectedClass]);

  // Get resources for selected class and subject
  const getResources = () => {
    const classResources = resources[selectedClass];
    if (!classResources) {
      // Fallback to Class 9 if no resources for selected class
      return resources["Class 9"]?.[selectedSubject] || [];
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

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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
                {classes.map((className) => (
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

              {/* Resources Grid */}
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