"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Types
interface Testimonial {
  id: number;
  name: string;
  graduation: string;
  current: string;
  text: string;
  avatarColor: string;
  textColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Testimonial[];
  count: number;
  error?: string;
}

// Icons
const AddIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
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

const ActiveIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const InactiveIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Available colors
  const avatarColors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-gray-500'
  ];

  const textColors = ['text-white', 'text-black'];

  // Fetch testimonials from admin API
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/testimonials');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load testimonials');
      }
      
      setTestimonials(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Handle toggle active status
  const toggleActiveStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          isActive: !currentStatus
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update testimonial');
      }

      // Update local state
      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === id
            ? { ...testimonial, isActive: !currentStatus }
            : testimonial
        )
      );
      
      alert('Testimonial status updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update testimonial');
    }
  };

  // Handle delete click
  const handleDeleteClick = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setShowDeleteModal(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${testimonialToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete testimonial');
      }

      // Update local state
      setTestimonials(prev => prev.filter(t => t.id !== testimonialToDelete.id));
      setShowDeleteModal(false);
      setTestimonialToDelete(null);
      
      alert('Testimonial deleted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to delete testimonial');
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTestimonialToDelete(null);
  };

  // Handle edit
  const handleEdit = (id: number) => {
    router.push(`/web-admin/testimonials/edit/${id}`);
  };

  // Handle add new
  const handleAddNew = () => {
    router.push('/web-admin/testimonials/new');
  };

  // Filter testimonials based on active status
  const filteredTestimonials = showActiveOnly
    ? testimonials.filter(t => t.isActive)
    : testimonials;

  // Stats
  const stats = {
    total: testimonials.length,
    active: testimonials.filter(t => t.isActive).length,
    inactive: testimonials.filter(t => !t.isActive).length,
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-200 rounded-lg mr-4">
                    <div className="w-8 h-8"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimonials Management</h1>
          <p className="text-gray-600">Manage alumni testimonials displayed on the public site</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Total Testimonials</div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Active</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Inactive</div>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Showing</div>
            <div className="text-2xl font-bold text-purple-600">{filteredTestimonials.length}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showActiveOnly"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="showActiveOnly" className="text-sm text-gray-700">
                Show active testimonials only
              </label>
            </div>
            
            <button
              onClick={fetchTestimonials}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-sm"
            >
              <RefreshIcon />
              Refresh
            </button>
          </div>

          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <AddIcon />
            Add New Testimonial
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Testimonials List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredTestimonials.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-4 md:p-6 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-2xl font-bold ${testimonial.textColor}`}>
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                          <p className="text-gray-600 text-sm">{testimonial.graduation}</p>
                          <p className="text-blue-600 font-medium text-sm">{testimonial.current}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {testimonial.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(testimonial.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 italic mb-4 line-clamp-3">
                        "{testimonial.text}"
                      </p>

                      {/* Color Indicators */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Avatar:</span>
                          <div className={`w-4 h-4 rounded-full ${testimonial.avatarColor}`}></div>
                          <span className="text-xs text-gray-700">{testimonial.avatarColor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Text:</span>
                          <div className={`text-xs px-2 py-1 rounded ${testimonial.textColor === 'text-black' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            {testimonial.textColor}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleActiveStatus(testimonial.id, testimonial.isActive)}
                          className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                            testimonial.isActive
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {testimonial.isActive ? <InactiveIcon /> : <ActiveIcon />}
                          {testimonial.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        <button
                          onClick={() => handleEdit(testimonial.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm flex items-center gap-1"
                        >
                          <EditIcon />
                          Edit
                        </button>
                        
                        <button
                          onClick={() => handleDeleteClick(testimonial)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm flex items-center gap-1"
                        >
                          <DeleteIcon />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials found</h3>
              <p className="text-gray-600 mb-4">
                {showActiveOnly 
                  ? "No active testimonials. Try showing all testimonials or add new ones." 
                  : "No testimonials have been added yet."}
              </p>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex items-center"
              >
                <AddIcon />
                Add First Testimonial
              </button>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold text-blue-600">{filteredTestimonials.length}</span> of{' '}
              <span className="font-semibold text-blue-600">{stats.total}</span> testimonials
              {showActiveOnly && ' (active only)'}
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && testimonialToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Testimonial?</h3>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full ${testimonialToDelete.avatarColor} flex items-center justify-center font-bold ${testimonialToDelete.textColor}`}>
                    {testimonialToDelete.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonialToDelete.name}</h4>
                    <p className="text-sm text-gray-600">{testimonialToDelete.graduation}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"{testimonialToDelete.text.substring(0, 100)}..."</p>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this testimonial? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}