"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces
interface Teacher {
  id: number;
  name: string;
  subject: string;
  image: string;
  // Only these fields are needed for listing page
}

interface ApiResponse {
  success: boolean;
  data: Teacher[];
  count: number;
  timestamp: string;
  error?: string;
}

// Icons components - Updated with better sizing
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

const AddIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const ViewIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

// Skeleton Loading Components - Matching alumni size
const SkeletonTeacherCard = () => (
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
      <div className="grid grid-cols-3 gap-2">
        <div className="h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function AdminTeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch teachers from API - Request minimal data
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Add ?minimal=true parameter to get only essential data
      const response = await fetch('/api/teacher?minimal=true');
      
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
    }
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(query) ||
        teacher.subject.toLowerCase().includes(query)
      );
      setFilteredTeachers(filtered);
    }
  }, [searchQuery, teachers]);

  const handleAddNew = () => {
    router.push('/web-admin/teacher/new');
  };

  const handleEdit = (id: number) => {
    router.push(`/web-admin/teacher/edit/${id}`);
  };

  const handleView = (id: number) => {
    router.push(`/web-admin/teacher/${id}`);
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;
    
    try {
      setDeleteLoading(true);
      
      const response = await fetch(`/api/admin/teacher?id=${teacherToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete teacher');
      }

      // Remove teacher from local state
      setTeachers(prev => prev.filter(t => t.id !== teacherToDelete.id));
      setFilteredTeachers(prev => prev.filter(t => t.id !== teacherToDelete.id));
      
      // Close modal and reset
      setShowDeleteModal(false);
      setTeacherToDelete(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete teacher');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTeacherToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto"> {/* Changed to max-w-7xl to match alumni */}
        {/* Header - Always visible */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Management</h1>
          <p className="text-gray-600">Manage your teaching faculty and their profiles</p>
        </div>

        {/* Controls - Always visible */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Search - Matching alumni width */}
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search teachers by name or subject..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={handleAddNew}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 w-full sm:w-auto text-base"
            >
              <AddIcon />
              <span className="whitespace-nowrap">Add New Teacher</span>
            </button>
          </div>

          {/* Stats - Mobile responsive */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center text-gray-600">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Total Teachers: <span className="font-semibold ml-1">{teachers.length}</span>
            </span>
            <span className="flex items-center text-gray-600">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Showing: <span className="font-semibold ml-1">{filteredTeachers.length}</span>
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-600 font-medium mb-1">Error loading teachers</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Dismiss error"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Teachers Grid with Skeleton Loading - Matching alumni layout */}
        <div className="mb-8">
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Changed to match alumni: 4 columns on xl */}
              {loading ? (
                // Show skeleton loading cards
                Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonTeacherCard key={index} />
                ))
              ) : filteredTeachers.length > 0 ? (
                // Show actual teacher cards - Matching alumni card size
                filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
                  >
                    {/* Teacher Image - Matching alumni height (h-48) */}
                    <div className="relative h-48 bg-gray-100">
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
                                <div class="text-white text-4xl font-bold">${teacher.name.charAt(0)}</div>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                          <div className="text-white">
                            <UserIcon />
                          </div>
                        </div>
                      )}
                      {/* Optional: Add subject overlay at bottom like alumni */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="text-white text-sm font-medium">
                          {teacher.subject}
                        </div>
                      </div>
                    </div>

                    {/* Teacher Info - Matching alumni padding and structure */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Name - Matching alumni styling */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={teacher.name}>
                        {teacher.name}
                      </h3>
                      
                      {/* Subject - Matching alumni styling */}
                      <p className="text-blue-600 font-medium mb-4 truncate" title={teacher.subject}>
                        {teacher.subject}
                      </p>
                      
                      {/* Action Buttons - Grid of 3 matching alumni */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleEdit(teacher.id)}
                          className="inline-flex items-center justify-center p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                          aria-label={`Edit ${teacher.name}`}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(teacher)}
                          className="inline-flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                          aria-label={`Delete ${teacher.name}`}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                        <button
                          onClick={() => handleView(teacher.id)}
                          className="inline-flex items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200"
                          aria-label={`View ${teacher.name}'s profile`}
                          title="View Profile"
                        >
                          <ViewIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // No results message - Responsive
                <div className="col-span-full text-center py-12 px-4">
                  <div className="text-gray-400 mb-4 mx-auto w-20 h-20">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {searchQuery ? 'No teachers found' : 'No teachers available'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchQuery 
                      ? 'No teachers match your search criteria.' 
                      : 'Get started by adding your first teacher.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Clear Search
                      </button>
                    ) : (
                      <button
                        onClick={handleAddNew}
                        className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        <AddIcon />
                        <span>Add First Teacher</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Footer - Only show when not loading */}
        {!loading && !error && filteredTeachers.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredTeachers.length}</span> teachers
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - Responsive */}
      {showDeleteModal && teacherToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Delete Teacher</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{teacherToDelete.name}</span>? This action cannot be undone.
              </p>
              
              {/* Teacher Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    {teacherToDelete.image ? (
                      <img 
                        src={teacherToDelete.image} 
                        alt={teacherToDelete.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {teacherToDelete.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{teacherToDelete.name}</p>
                    <p className="text-gray-600 truncate">{teacherToDelete.subject}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {deleteLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Teacher'
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