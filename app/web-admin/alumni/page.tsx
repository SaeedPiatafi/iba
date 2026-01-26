"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces
interface Alumni {
  id: number;
  name: string;
  graduationYear: string;
  profession: string;
  image: string;
  bio: string;
  achievements: string[];
  education: string[];
  location: string;
  email: string;
  skills: string[];
  createdAt?: string;
  updatedAt?: string;
}

// API response interface
interface ApiResponse {
  success: boolean;
  data: Alumni[];
  count: number;
  total?: number;
  timestamp: string;
  error?: string;
  message?: string;
}

// Update icon components
const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const EditIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const DeleteIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const AddIcon = ({ className = "w-5 h-5 mr-2" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const ChevronLeftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

// Skeleton Loading Components
const SkeletonAlumniCard = () => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
    {/* Image Skeleton */}
    <div className="relative h-48 bg-gray-300">
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="h-4 bg-gray-400 rounded w-1/3"></div>
      </div>
    </div>

    {/* Info Skeleton */}
    <div className="p-5">
      <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>

      {/* Buttons Skeleton */}
      <div className="flex space-x-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function AdminAlumniPage() {
  const router = useRouter();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alumniToDelete, setAlumniToDelete] = useState<Alumni | null>(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch alumni from API
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('/api/admin/alumni');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch alumni (${response.status})`);
        }
        
        const responseData: ApiResponse = await response.json();
        
        if (!responseData.success) {
          throw new Error(responseData.error || 'Failed to load alumni data');
        }
        
        // Check if data exists and is an array
        if (!responseData.data || !Array.isArray(responseData.data)) {
          setAlumni([]);
          setFilteredAlumni([]);
          setLoading(false);
          return;
        }
        
        // Ensure all alumni have the required fields
        const validatedAlumni = responseData.data.map((alum: any) => ({
          id: alum.id || 0,
          name: alum.name || 'Unknown Alumni',
          graduationYear: alum.graduationYear?.toString() || 'Unknown',
          profession: alum.profession || 'Not specified',
          image: alum.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          bio: alum.bio || '',
          achievements: Array.isArray(alum.achievements) ? alum.achievements : [],
          education: Array.isArray(alum.education) ? alum.education : [],
          location: alum.location || 'Location not specified',
          email: alum.email || '',
          skills: Array.isArray(alum.skills) ? alum.skills : [],
          createdAt: alum.createdAt,
          updatedAt: alum.updatedAt
        }));
        
        setAlumni(validatedAlumni);
        setFilteredAlumni(validatedAlumni);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching alumni:', err);
        setError(err instanceof Error ? err.message : 'Failed to load alumni');
        setAlumni([]);
        setFilteredAlumni([]);
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = alumni;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alum =>
        alum.name.toLowerCase().includes(query) ||
        alum.profession.toLowerCase().includes(query) ||
        alum.location.toLowerCase().includes(query) ||
        (alum.education && alum.education.some(edu => edu.toLowerCase().includes(query)))
      );
    }

    // Apply year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(alum => alum.graduationYear === selectedYear);
    }

    setFilteredAlumni(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedYear, alumni]);

  // Calculate pagination
  useEffect(() => {
    const total = filteredAlumni.length;
    const pages = Math.ceil(total / itemsPerPage);
    setTotalPages(pages);
    
    // Ensure current page is valid
    if (currentPage > pages && pages > 0) {
      setCurrentPage(pages);
    }
  }, [filteredAlumni, itemsPerPage, currentPage]);

  // Get alumni for current page
  const getCurrentPageAlumni = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAlumni.slice(startIndex, endIndex);
  };

  const handleAddNew = () => {
    router.push('/web-admin/alumni/new');
  };

  const handleEdit = (id: number) => {
    router.push(`/web-admin/alumni/edit/${id}`);
  };

  const handleDeleteClick = (alum: Alumni) => {
    setAlumniToDelete(alum);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!alumniToDelete) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch('/api/admin/alumni', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: alumniToDelete.id }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || 'Failed to delete alumni');
      }
      
      // Remove from state
      setAlumni(prev => prev.filter(a => a.id !== alumniToDelete.id));
      setFilteredAlumni(prev => prev.filter(a => a.id !== alumniToDelete.id));
      
      // Show success message
      alert(responseData.message || 'Alumni deleted successfully!');
      
      setShowDeleteModal(false);
      setAlumniToDelete(null);
    } catch (error) {
      console.error('Error deleting alumni:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete alumni. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAlumniToDelete(null);
  };

  // Get unique graduation years safely
  const graduationYears = alumni.length > 0 
    ? [...new Set(alumni.map(alum => alum.graduationYear))].sort((a, b) => parseInt(b) - parseInt(a))
    : [];

  // Refresh alumni data
  const refreshAlumni = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/alumni');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch alumni (${response.status})`);
      }
      
      const responseData: ApiResponse = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.error || 'Failed to load alumni data');
      }
      
      if (!responseData.data || !Array.isArray(responseData.data)) {
        setAlumni([]);
        setFilteredAlumni([]);
        setLoading(false);
        return;
      }
      
      const validatedAlumni = responseData.data.map((alum: any) => ({
        id: alum.id || 0,
        name: alum.name || 'Unknown Alumni',
        graduationYear: alum.graduationYear?.toString() || 'Unknown',
        profession: alum.profession || 'Not specified',
        image: alum.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        bio: alum.bio || '',
        achievements: Array.isArray(alum.achievements) ? alum.achievements : [],
        education: Array.isArray(alum.education) ? alum.education : [],
        location: alum.location || 'Location not specified',
        email: alum.email || '',
        skills: Array.isArray(alum.skills) ? alum.skills : [],
        createdAt: alum.createdAt,
        updatedAt: alum.updatedAt
      }));
      
      setAlumni(validatedAlumni);
      setFilteredAlumni(validatedAlumni);
      setLoading(false);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error refreshing alumni:', err);
      setError(err instanceof Error ? err.message : 'Failed to load alumni');
      setLoading(false);
    }
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const currentPageAlumni = getCurrentPageAlumni();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Always visible */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Management</h1>
              <p className="text-gray-600">Manage your distinguished alumni and their achievements</p>
            </div>
            <button
              onClick={refreshAlumni}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Controls - Always visible */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search alumni by name, profession, or location..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <AddIcon />
              Add New Alumni
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Graduation Year
              </label>
              <select
                value={selectedYear}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="all">All Years</option>
                {graduationYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Total Alumni: {alumni.length}
              </span>
            </div>

            {/* Items per page selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show per page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setItemsPerPage(Number(e.target.value))}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium mb-2">Error loading alumni data</p>
            <p className="text-red-700 text-sm mb-3">{error}</p>
            <div className="flex space-x-2">
              <button
                onClick={refreshAlumni}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/web-admin/alumni/new')}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded transition-colors"
              >
                Add First Alumni
              </button>
            </div>
          </div>
        )}

        {/* Alumni Grid with Skeleton Loading */}
        <div className="mb-8">
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                // Show skeleton loading cards
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <SkeletonAlumniCard key={index} />
                ))
              ) : currentPageAlumni.length > 0 ? (
                // Show actual alumni cards
                currentPageAlumni.map((alum) => (
                  <div
                    key={alum.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Alumni Image */}
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src={alum.image}
                        alt={alum.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="text-white text-sm font-medium">
                          Class of {alum.graduationYear}
                        </div>
                      </div>
                    </div>

                    {/* Alumni Info - Only name and profession */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{alum.name}</h3>
                      <p className="text-blue-600 font-medium mb-4 truncate">{alum.profession}</p>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(alum.id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors duration-200"
                        >
                          <EditIcon className="w-5 h-5" />
                          <span className="ml-2">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(alum)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors duration-200"
                        >
                          <DeleteIcon className="w-5 h-5" />
                          <span className="ml-2">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // No results message
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No alumni found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || selectedYear !== 'all' 
                      ? "No alumni match your search criteria." 
                      : "No alumni have been added yet. Start by adding your first alumni!"}
                  </p>
                  <div className="space-x-3">
                    {(searchQuery || selectedYear !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedYear('all');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Clear Filters
                      </button>
                    )}
                    {!searchQuery && selectedYear === 'all' && (
                      <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        <AddIcon />
                        Add First Alumni
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls - Only show if not loading and have data */}
        {!loading && !error && filteredAlumni.length > 0 && totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Page info */}
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, filteredAlumni.length)}
                </span> of{' '}
                <span className="font-semibold">{filteredAlumni.length}</span> alumni
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum as number)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats - Only show if not loading and have data */}
        {!loading && !error && alumni.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Graduation Years: </span>
                {graduationYears.slice(0, 5).join(', ')}
                {graduationYears.length > 5 && `, +${graduationYears.length - 5} more`}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Unique Professions: </span>
                {[...new Set(alumni.map(a => a.profession))].length}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Page: </span>
                {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && alumniToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Alumni</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{alumniToDelete.name}</span> (Class of {alumniToDelete.graduationYear})? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Deleting...</span>
                    </div>
                  ) : (
                    'Delete Alumni'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}