'use client';

import { useState, useMemo, Suspense, lazy, useEffect, useRef } from 'react';

// Define types
interface ImageType {
  id: number;
  src: string;
  tags: string[];
  alt: string;
}

interface FilterType {
  id: string;
  name: string;
  color: string;
}

interface GalleryData {
  academicYear: string;
  lastUpdated: string;
  images: ImageType[];
}

interface ApiResponse {
  success: boolean;
  data: GalleryData;
  count: number;
  total: number;
  tagCounts: { [key: string]: number };
  timestamp: string;
}

// Skeleton Loading Components
function GalleryCardSkeleton() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg md:rounded-xl bg-gray-200">
      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse"></div>
    </div>
  );
}

// Lazy load the image component
const LazyImage = lazy(() => 
  Promise.resolve({
    default: ({ src, alt, className, onClick, ...props }: { 
      src: string; 
      alt: string; 
      className?: string; 
      onClick?: () => void;
      loading?: 'lazy' | 'eager';
      decoding?: 'async' | 'auto' | 'sync';
      width?: string | number;
      height?: string | number;
      onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
      onLoad?: () => void;
    }) => (
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
        loading="lazy"
        decoding="async"
        {...props}
      />
    )
  }) as Promise<{ default: React.ComponentType<any> }>
);

// Fallback component for lazy loading
const ImageFallback = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-200 animate-pulse flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Popup carousel state
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  
  // Refs for smooth transitions
  const carouselRef = useRef<HTMLDivElement>(null);
  const popupImageRef = useRef<HTMLImageElement>(null);
  
  // Gallery categories as requested
  const filters = useMemo<FilterType[]>(() => [
    { id: 'all', name: 'All Photos', color: 'bg-blue-600' },
    { id: 'campus-life', name: 'Campus Life', color: 'bg-teal-600' },
    { id: 'events', name: 'Events', color: 'bg-purple-600' },
    { id: 'sports', name: 'Sports', color: 'bg-green-600' },
    { id: 'academics', name: 'Academics', color: 'bg-indigo-600' },
    { id: 'cultural', name: 'Cultural', color: 'bg-pink-600' },
  ], []);

  // Fetch gallery data from API
  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/gallery');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to fetch gallery data');
      }
      
      setGalleryData(result.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  // Filter images based on active filter
  const filteredImages = useMemo(() => {
    if (!galleryData) return [];
    
    if (activeFilter === 'all') {
      return galleryData.images.slice(0, visibleCount);
    }
    
    return galleryData.images
      .filter(image => image.tags.includes(activeFilter))
      .slice(0, visibleCount);
  }, [activeFilter, galleryData, visibleCount]);

  // All filtered images for carousel (not limited by visibleCount)
  const allFilteredImages = useMemo(() => {
    if (!galleryData) return [];
    
    if (activeFilter === 'all') {
      return galleryData.images;
    }
    
    return galleryData.images.filter(image => image.tags.includes(activeFilter));
  }, [activeFilter, galleryData]);

  // Check if there are more images to load
  const totalFiltered = useMemo(() => {
    if (!galleryData) return 0;
    
    if (activeFilter === 'all') {
      return galleryData.images.length;
    }
    
    return galleryData.images.filter(image => image.tags.includes(activeFilter)).length;
  }, [activeFilter, galleryData]);

  const hasMoreImages = visibleCount < totalFiltered;
  
  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setVisibleCount(12);
  };

  // Load more images
  const loadMoreImages = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 12, totalFiltered));
      setIsLoading(false);
    }, 300);
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200">
          <span class="text-3xl mb-2">📸</span>
          <span class="text-xs text-gray-500 text-center px-2">Image unavailable</span>
        </div>
      `;
    }
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Open popup with selected image
  const openPopup = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageLoading(true);
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close popup
  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Navigate to next image in carousel
  const nextImage = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === allFilteredImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Navigate to previous image in carousel
  const prevImage = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? allFilteredImages.length - 1 : prevIndex - 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPopupOpen) return;
      
      if (e.key === 'Escape') {
        closePopup();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPopupOpen]);

  // Find the index in allFilteredImages for a clicked image
  const findImageIndex = (imageId: number) => {
    return allFilteredImages.findIndex(img => img.id === imageId);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchGalleryData}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Always visible */}
      <div className="pt-8 md:pt-12 pb-4 md:pb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 text-center">
            Gallery
          </h1>
          <p className="text-gray-600 text-center mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Explore our collection of school memories, events, and activities
          </p>
        </div>
      </div>

      {/* Gallery Content */}
      <main className="container mx-auto px-4 pb-8 md:pb-12">
        {/* Filter Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
                  activeFilter === filter.id 
                    ? `${filter.color} text-white shadow-md transform scale-105` 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
                disabled={loading}
              >
                {filter.name}
              </button>
            ))}
          </div>
          
          {/* Active Filter Info */}
          {!loading && galleryData && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm md:text-base">
                Showing <span className="font-semibold text-blue-600">{filteredImages.length}</span> of{' '}
                <span className="font-semibold text-gray-800">{totalFiltered}</span> photos
                {activeFilter !== 'all' && (
                  <> in <span className="font-semibold" style={{
                    color: `var(--${filters.find(f => f.id === activeFilter)?.color.replace('bg-', '').replace('-600', '-700')})`
                  }}>
                    {filters.find(f => f.id === activeFilter)?.name}
                  </span></>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <GalleryCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="text-5xl md:text-6xl mb-4">📷</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">No photos found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
              {filteredImages.map((image, index) => (
                <div 
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-lg md:rounded-xl bg-gray-200 group cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  onClick={() => openPopup(findImageIndex(image.id))}
                >
                  <Suspense fallback={<ImageFallback />}>
                    <LazyImage
                      src={image.src.replace('w=800', 'w=500')}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading={index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      width="500"
                      height="500"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  </Suspense>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                    <p className="text-white text-xs font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {image.alt}
                    </p>
                  </div>

                  {/* Image Tag Indicator */}
                  <div className="absolute top-2 right-2">
                    {image.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 rounded-full bg-black/70 text-white mr-1 mb-1 hidden group-hover:inline-block"
                      >
                        {tag.split('-')[0]}
                      </span>
                    ))}
                  </div>

                  {/* Click indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 rounded-full p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMoreImages && (
              <div className="text-center mt-8 md:mt-12">
                <button
                  onClick={loadMoreImages}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Load More ({totalFiltered - visibleCount} more)
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Image Count */}
            {!loading && galleryData && (
              <div className="mt-6 md:mt-8 pt-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-gray-600 text-sm md:text-base">
                    <span className="font-semibold text-gray-800">{filteredImages.length}</span> of{' '}
                    <span className="font-semibold text-gray-800">{totalFiltered}</span> images displayed
                  </p>
                  
                  {/* Category Breakdown */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {filters.slice(1).map(filter => {
                      const count = galleryData.images.filter(img => img.tags.includes(filter.id)).length;
                      return count > 0 ? (
                        <span 
                          key={filter.id}
                          className={`text-xs px-3 py-1 rounded-full ${filter.color} text-white`}
                        >
                          {filter.name.split(' ')[0]}: {count}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Popup Carousel Modal */}
      {isPopupOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300"
          onClick={closePopup}
        >
          <div 
            className="relative w-full h-full max-w-7xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Main image container */}
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
                {/* Loading indicator */}
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Main image */}
                <img
                  ref={popupImageRef}
                  src={allFilteredImages[currentImageIndex]?.src}
                  alt={allFilteredImages[currentImageIndex]?.alt}
                  className={`max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300 ${
                    isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMxRjJGM0YiLz48dGV4dCB4PSI0MDAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjODg4QThDIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                    setIsImageLoading(false);
                  }}
                />
                
                {/* Image info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-lg">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                        {allFilteredImages[currentImageIndex]?.alt}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {allFilteredImages[currentImageIndex]?.tags.map(tag => (
                          <span 
                            key={tag} 
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              filters.find(f => f.id === tag)?.color || 'bg-gray-600'
                            }`}
                          >
                            {filters.find(f => f.id === tag)?.name || tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-white text-lg font-medium">
                      {currentImageIndex + 1} / {allFilteredImages.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail navigation */}
              <div className="mt-8 overflow-x-auto max-w-full">
                <div className="flex gap-3 px-4 pb-2">
                  {allFilteredImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => {
                        setIsImageLoading(true);
                        setCurrentImageIndex(index);
                      }}
                      className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-3 transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'border-white scale-110 shadow-lg' 
                          : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={image.src.replace('w=800', 'w=200')}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}