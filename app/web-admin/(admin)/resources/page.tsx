// app/web-admin/resources/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types
type ResourceType = 'Book' | 'Video' | 'Article' | 'Practice' | 'Exam';

interface Resource {
  id: number;
  title: string;
  type: ResourceType;
  url: string;
  description: string;
  class: string;
  subject: string;
  tags?: string[];
  createdAt?: string;
}

interface Stats {
  total: number;
  byType: Record<ResourceType, number>;
  byClass: Record<string, number>;
  bySubject: Record<string, number>;
}

// Icons components
const BookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

const ArticleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const PracticeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
  </svg>
);

const ExamIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

// Skeleton Loading
const SkeletonResourceCard = () => (
  <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden animate-pulse">
    <div className="p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-lg"></div>
        <div className="h-4 bg-gray-300 rounded w-20 sm:w-24"></div>
      </div>
      <div className="h-4 sm:h-5 bg-gray-300 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export default function AdminResourcesPage() {
  const router = useRouter();
  
  // State
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    byType: {} as Record<ResourceType, number>,
    byClass: {},
    bySubject: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [filterClass, setFilterClass] = useState('All Classes');
  const [filterSubject, setFilterSubject] = useState('All Subjects');
  const [filterType, setFilterType] = useState('All Types');
  const [searchTerm, setSearchTerm] = useState('');

  // Simple class list (1-12)
  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12'
  ];

  // Common subjects for all classes
  const subjects = [
    'Mathematics', 'Science', 'English', 'Urdu', 'Islamiyat',
    'Social Studies', 'Pakistan Studies', 'Computer Science',
    'Physics', 'Chemistry', 'Biology', 'General Knowledge',
    'Economics', 'Business Studies', 'Accounting'
  ];

  // Resource types
  const resourceTypes: ResourceType[] = ['Book', 'Video', 'Article', 'Practice', 'Exam'];

  // Fetch resources
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/resources');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load resources');
      }
      
      setResources(result.data);
      setFilteredResources(result.data);
      
      if (result.stats) {
        setStats(result.stats);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resources');
      setLoading(false);
    }
  };

  // Get filtered subjects
  const getFilteredSubjects = () => {
    if (filterClass === 'All Classes') {
      const allSubjects = new Set<string>();
      resources.forEach(r => allSubjects.add(r.subject));
      return Array.from(allSubjects);
    }
    
    // Return all subjects for any class
    return subjects;
  };

  // Apply filters
  useEffect(() => {
    let filtered = resources;
    
    if (filterClass !== 'All Classes') {
      filtered = filtered.filter(r => r.class === filterClass);
    }
    
    if (filterSubject !== 'All Subjects') {
      filtered = filtered.filter(r => r.subject === filterSubject);
    }
    
    if (filterType !== 'All Types') {
      filtered = filtered.filter(r => r.type === filterType);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        (r.tags && r.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    setFilteredResources(filtered);
  }, [filterClass, filterSubject, filterType, searchTerm, resources]);

  // Get type icon
  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'Book': return <BookIcon />;
      case 'Video': return <VideoIcon />;
      case 'Article': return <ArticleIcon />;
      case 'Practice': return <PracticeIcon />;
      case 'Exam': return <ExamIcon />;
      default: return null;
    }
  };

  // Get type color
  const getTypeColor = (type: ResourceType) => {
    switch (type) {
      case 'Book': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Video': return 'bg-green-100 text-green-700 border-green-200';
      case 'Article': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Practice': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Exam': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Handle navigation to add new resource
  const handleAddNew = () => {
    router.push('/web-admin/resources/new');
  };

  // Handle edit
  const handleEdit = (resource: Resource) => {
    router.push(`/web-admin/resources/edit/${resource.id}`);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/resources?id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete resource');
      }
      
      // Refresh resources
      await fetchResources();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilterClass('All Classes');
    setFilterSubject('All Subjects');
    setFilterType('All Types');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Resource Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage educational resources for students. Changes will appear on the public website.</p>
        </div>

        {/* Stats Summary - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <BookIcon />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Resources</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <VideoIcon />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.byType?.Video || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600">Video Resources</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <ArticleIcon />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {Object.keys(stats.byClass || {}).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Classes Covered</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <PracticeIcon />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {Object.keys(stats.bySubject || {}).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Subjects Covered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resources by title or description..."
                className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Add New Button */}
            <button
              onClick={handleAddNew}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base"
            >
              <AddIcon />
              <span className="whitespace-nowrap">Add New Resource</span>
            </button>
          </div>

          {/* Stats Info */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <span className="flex items-center text-gray-600">
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2"></span>
              Total Resources: <span className="font-semibold ml-1">{stats.total}</span>
            </span>
            <span className="flex items-center text-gray-600">
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-2"></span>
              Showing: <span className="font-semibold ml-1">{filteredResources.length}</span>
            </span>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Filters - Sticky on mobile */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Resources</h3>
              
              <div className="space-y-4">
                {/* Class Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Filter by Class
                  </label>
                  <select
                    value={filterClass}
                    onChange={(e) => {
                      setFilterClass(e.target.value);
                      setFilterSubject('All Subjects');
                    }}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="All Classes">All Classes</option>
                    {classes.map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Filter by Subject
                  </label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="All Subjects">All Subjects</option>
                    {getFilteredSubjects().map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Filter by Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                  >
                    <option value="All Types">All Types</option>
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={resetFilters}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 border border-gray-300 text-sm sm:text-base"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Resources List */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Resources ({filteredResources.length})
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {filterClass !== 'All Classes' && `Class: ${filterClass} • `}
                    {filterSubject !== 'All Subjects' && `Subject: ${filterSubject} • `}
                    {filterType !== 'All Types' && `Type: ${filterType}`}
                  </p>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">
                  Showing {filteredResources.length} of {resources.length} resources
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-red-600 font-medium mb-1">Error</p>
                      <p className="text-red-700 text-xs sm:text-sm">{error}</p>
                    </div>
                    <button
                      onClick={() => setError('')}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Dismiss error"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {!error && (
                <div className="mb-6 sm:mb-8">
                  {loading ? (
                    // Skeleton Loading - Responsive grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonResourceCard key={index} />
                      ))}
                    </div>
                  ) : filteredResources.length > 0 ? (
                    // Resources Grid - Responsive
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filteredResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="bg-white rounded-lg sm:rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
                        >
                          <div className="p-4 sm:p-5 flex-1">
                            {/* Resource Header */}
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type).split(' ')[0]}`}>
                                <div className={getTypeColor(resource.type).split(' ')[1]}>
                                  {getTypeIcon(resource.type)}
                                </div>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getTypeColor(resource.type)}`}>
                                {resource.type}
                              </span>
                            </div>
                            
                            {/* Title */}
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 truncate" title={resource.title}>
                              {resource.title}
                            </h4>
                            
                            {/* Description */}
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                              {resource.description}
                            </p>
                            
                            {/* Metadata - Removed download icon */}
                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {resource.class}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {resource.subject}
                              </span>
                            </div>
                          </div>
                          
                          {/* Actions - Responsive buttons */}
                          <div className="border-t border-gray-200 p-3 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center text-xs sm:text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 w-full sm:w-auto"
                              >
                                <LinkIcon />
                                <span className="ml-2">Visit Link</span>
                              </a>
                              
                              <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                  onClick={() => handleEdit(resource)}
                                  className="inline-flex items-center justify-center p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 flex-1 sm:flex-none"
                                  aria-label={`Edit ${resource.title}`}
                                  title="Edit"
                                >
                                  <EditIcon />
                                  <span className="ml-2 text-xs sm:hidden">Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(resource.id)}
                                  className="inline-flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 flex-1 sm:flex-none"
                                  aria-label={`Delete ${resource.title}`}
                                  title="Delete"
                                >
                                  <DeleteIcon />
                                  <span className="ml-2 text-xs sm:hidden">Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // No Results
                    <div className="text-center py-8 sm:py-12 px-4">
                      <div className="text-gray-400 mb-3 sm:mb-4 mx-auto w-16 h-16 sm:w-20 sm:h-20">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                        {searchTerm ? 'No resources found' : 'No resources available'}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto">
                        {searchTerm 
                          ? 'No resources match your search criteria.' 
                          : 'Get started by adding your first resource.'
                        }
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {searchTerm ? (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
                          >
                            Clear Search
                          </button>
                        ) : (
                          <button
                            onClick={handleAddNew}
                            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
                          >
                            <AddIcon />
                            <span>Add First Resource</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        {!loading && !error && filteredResources.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredResources.length}</span> resources
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}