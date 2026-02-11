"use client";

import { useState, useEffect, useCallback, useMemo, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

// Types
interface GalleryImage {
  id: number;
  src: string;
  tags: string[];
  alt: string;
  uploadedAt: string;
}

type ViewMode = 'grid' | 'list';

// Icons components (unchanged)
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

// Image Skeleton Loader
const ImageSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="flex space-x-2">
        <div className="h-8 bg-gray-200 rounded-lg flex-1"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function AdminGalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Available tags
  const AVAILABLE_TAGS = ['events', 'campus-life', 'academics', 'sports', 'cultural'] as const;

  // Memoized stats calculation
  const stats = useMemo(() => {
    const totalImages = images.length;
    const imagesByCategory = AVAILABLE_TAGS.reduce((acc, tag) => {
      acc[tag] = images.filter(img => img.tags.includes(tag)).length;
      return acc;
    }, {} as Record<string, number>);
    
    return { totalImages, imagesByCategory };
  }, [images]);

  // Load images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/gallery');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to load gallery images');
        }
        
        setImages(result.data);
        setFilteredImages(result.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery images');
        
        // Fallback to empty array
        setImages([]);
        setFilteredImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Optimized filter function
  const filterImages = useCallback(() => {
    let filtered = [...images];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(img =>
        img.alt?.toLowerCase().includes(query) ||
        img.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(img =>
        selectedTags.every(tag => img.tags.includes(tag))
      );
    }

    return filtered;
  }, [searchQuery, selectedTags, images]);

  // Update filtered images when dependencies change
  useEffect(() => {
    const filtered = filterImages();
    setFilteredImages(filtered);
  }, [filterImages]);

  // Image click handler
  const handleImageClick = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
  }, []);

  // Image error handler
  const handleImageError = useCallback((id: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const image = images.find(img => img.id === id);
    const parent = target.parentElement;
    
    if (parent && image) {
      parent.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
          <div class="text-white text-4xl font-bold mb-2">📷</div>
          <div class="text-white text-sm text-center px-4">${image.alt || 'Image'}</div>
        </div>
      `;
    }
  }, [images]);

  // Navigation handlers
  const handleAddNew = useCallback(() => {
    router.push('/web-admin/gallery/new');
  }, [router]);

  const handleEdit = useCallback((id: number) => {
    router.push(`/web-admin/gallery/edit/${id}`);
  }, [router]);

  const handleDeleteClick = useCallback((image: GalleryImage) => {
    setImageToDelete(image);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!imageToDelete) return;

    try {
      const response = await fetch(`/api/admin/gallery?id=${imageToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete image');
      }

      // Update local state
      setImages(prev => prev.filter(img => img.id !== imageToDelete.id));
      setFilteredImages(prev => prev.filter(img => img.id !== imageToDelete.id));
      
      setShowDeleteModal(false);
      setImageToDelete(null);
      
      // Show success message
      alert('Image deleted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to delete image');
    }
  }, [imageToDelete]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
    setImageToDelete(null);
  }, []);

  // Tag filter handlers
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTags([]);
  }, []);

  // Close modal handler
  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Handle modal backdrop click
  const handleModalBackdropClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  }, [handleCloseModal]);

  // Render loading skeleton
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ImageSkeleton key={i} />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">Manage and organize school gallery images</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Total Images</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalImages}</div>
          </div>
          
          {AVAILABLE_TAGS.map(tag => (
            <div key={tag} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600 mb-1 capitalize">{tag}</div>
              <div className="text-2xl font-bold text-green-600">{stats.imagesByCategory[tag] || 0}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-6">
          {/* Search and Add Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images by alt text or tags..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
              >
                {viewMode === 'grid' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <AddIcon />
                Add New
              </button>
            </div>
          </div>

          {/* Tag Filters */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={clearAllFilters}
                className={`px-3 py-1.5 text-sm rounded-lg border ${selectedTags.length === 0 && !searchQuery ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
              >
                All Images
              </button>
              {AVAILABLE_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-sm rounded-lg border flex items-center gap-1 ${selectedTags.includes(tag) ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  {selectedTags.includes(tag) && ' ✓'}
                </button>
              ))}
            </div>
            
            {(selectedTags.length > 0 || searchQuery) && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  Filtered by: {searchQuery && `"${searchQuery}"`} {selectedTags.length > 0 && searchQuery && ', '}
                  {selectedTags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')}
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Gallery Images */}
        {filteredImages.length > 0 ? (
          viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image Container */}
                  <div 
                    className="relative h-40 bg-gray-100 overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => handleImageError(image.id, e)}
                    />
                  </div>

                  {/* Image Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{image.alt}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {image.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(image.id)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded"
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(image)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded"
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredImages.map((image) => (
                  <div key={image.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div 
                        className="h-16 w-24 flex-shrink-0 overflow-hidden rounded cursor-pointer"
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.parentElement) {
                              target.parentElement.innerHTML = `
                                <div class="h-full w-full flex items-center justify-center bg-gray-100">
                                  <span class="text-gray-400">📷</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{image.alt}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          {image.tags.map(tag => (
                            <span key={tag} className="text-xs text-gray-500 capitalize">
                              {tag}
                            </span>
                          ))}
                          <span className="text-xs text-gray-400">
                            • {new Date(image.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(image.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(image)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedTags.length > 0 
                ? "Try adjusting your search or filters." 
                : "No images have been uploaded yet."}
            </p>
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold text-blue-600">{filteredImages.length}</span> of{' '}
              <span className="font-semibold text-blue-600">{images.length}</span> images
            </div>
            <div>
              <span className="font-medium">View: </span>
              {viewMode === 'grid' ? 'Grid View' : 'List View'}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50" 
          onClick={handleModalBackdropClick}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative h-[50vh] bg-black">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center">
                          <div class="text-white text-6xl mb-4">📷</div>
                          <div class="text-white text-xl">${selectedImage.alt}</div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedImage.alt}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedImage.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="text-sm text-gray-500">
                  Uploaded: {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && imageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Image?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<span className="font-medium">{imageToDelete.alt}</span>"? 
                This action cannot be undone.
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