// app/gallery/page.jsx
'use client';

import { useState, useMemo, Suspense, lazy } from 'react';
import GalleryHeroSection from '../components/galleryhero';

// Lazy load the image component
const LazyImage = lazy(() => Promise.resolve({
  default: ({ src, alt, className, ...props }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}));

// Fallback component for lazy loading
const ImageFallback = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-200 animate-pulse flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12); // Initially show 12 images
  const [isLoading, setIsLoading] = useState(false);
  
  // Gallery categories as requested
  const filters = useMemo(() => [
    { id: 'all', name: 'All Photos', color: 'bg-blue-600' },
    { id: 'campus-life', name: 'Campus Life', color: 'bg-teal-600' },
    { id: 'events', name: 'Events', color: 'bg-purple-600' },
    { id: 'sports', name: 'Sports', color: 'bg-green-600' },
    { id: 'academics', name: 'Academics', color: 'bg-indigo-600' },
    { id: 'cultural', name: 'Cultural', color: 'bg-pink-600' },
  ], []);
  
  // 30 Optimized School Images (using smaller Unsplash sizes for faster loading)
  const galleryImages = useMemo(() => [
    // Campus Life (6 images)
    { id: 1, src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&h=500&fit=crop&auto=format&q=80', tags: ['campus-life'], alt: 'School campus aerial view' },
    { id: 2, src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&h=500&fit=crop&auto=format&q=80', tags: ['campus-life', 'academics'], alt: 'Students walking on campus' },
    { id: 3, src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=500&fit=crop&auto=format&q=80', tags: ['campus-life'], alt: 'Modern school building' },
    { id: 4, src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=500&fit=crop&auto=format&q=80', tags: ['campus-life'], alt: 'Campus courtyard' },
    { id: 5, src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&h=500&fit=crop&auto=format&q=80', tags: ['campus-life'], alt: 'School library interior' },
    { id: 6, src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&h=500&fit=crop&auto=format&q=80', tags: ['campus-life', 'academics'], alt: 'Student cafeteria' },
    
    // Events (6 images)
    { id: 7, src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop&auto=format&q=80', tags: ['events'], alt: 'Graduation ceremony' },
    { id: 8, src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&h=500&fit=crop&auto=format&q=80', tags: ['events', 'cultural'], alt: 'School festival' },
    { id: 9, src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop&auto=format&q=80', tags: ['events'], alt: 'Science fair exhibition' },
    { id: 10, src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=500&fit=crop&auto=format&q=80', tags: ['events'], alt: 'School assembly' },
    { id: 11, src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=500&fit=crop&auto=format&q=80', tags: ['events'], alt: 'Award ceremony' },
    { id: 12, src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=500&fit=crop&auto=format&q=80', tags: ['events'], alt: 'Parent-teacher meeting' },
    
    // Sports (6 images)
    { id: 13, src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&h=500&fit=crop&auto=format&q=80', tags: ['sports'], alt: 'Basketball tournament' },
    { id: 14, src: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&h=500&fit=crop&auto=format&q=80', tags: ['sports'], alt: 'Football practice' },
    { id: 15, src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&h=500&fit=crop&auto=format&q=80', tags: ['sports'], alt: 'Swimming competition' },
    { id: 16, src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=500&fit=crop&auto=format&q=80', tags: ['sports'], alt: 'Track and field event' },
    { id: 17, src: 'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=500&h=500&fit=crop&auto=format&q=80', tags: ['sports'], alt: 'Volleyball match' },
    { id: 18, src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=500&fit=crop&auto=format&q=80', tags: ['sports'], alt: 'Cricket practice' },
    
    // Academics (6 images)
    { id: 19, src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=500&fit=crop&auto=format&q=80', tags: ['academics'], alt: 'Chemistry lab experiment' },
    { id: 20, src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=500&h=500&fit=crop&auto=format&q=80', tags: ['academics'], alt: 'Library study session' },
    { id: 21, src: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&auto=format&q=80', tags: ['academics'], alt: 'Computer programming class' },
    { id: 22, src: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&h=500&fit=crop&auto=format&q=80', tags: ['academics'], alt: 'Physics demonstration' },
    { id: 23, src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&h=500&fit=crop&auto=format&q=80', tags: ['academics'], alt: 'Art class workshop' },
    { id: 24, src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=500&fit=crop&auto=format&q=80', tags: ['academics'], alt: 'Math classroom' },
    
    // Cultural (6 images)
    { id: 25, src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=500&fit=crop&auto=format&q=80', tags: ['cultural'], alt: 'Music concert' },
    { id: 26, src: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=500&h=500&fit=crop&auto=format&q=80', tags: ['cultural'], alt: 'Dance performance' },
    { id: 27, src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=500&fit=crop&auto=format&q=80', tags: ['cultural'], alt: 'Drama rehearsal' },
    { id: 28, src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=500&fit=crop&auto=format&q=80', tags: ['cultural'], alt: 'Art exhibition' },
    { id: 29, src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop&auto=format&q=80', tags: ['cultural'], alt: 'Poetry reading' },
    { id: 30, src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=500&fit=crop&auto=format&q=80', tags: ['cultural'], alt: 'Cultural festival' },
  ], []);

  // Filter images based on active filter
  const filteredImages = useMemo(() => 
    activeFilter === 'all' 
      ? galleryImages.slice(0, visibleCount) // Only show visible images
      : galleryImages.filter(image => image.tags.includes(activeFilter)).slice(0, visibleCount),
    [activeFilter, galleryImages, visibleCount]
  );

  // Check if there are more images to load
  const totalFiltered = useMemo(() => 
    activeFilter === 'all' 
      ? galleryImages.length 
      : galleryImages.filter(image => image.tags.includes(activeFilter)).length,
    [activeFilter, galleryImages]
  );

  const hasMoreImages = visibleCount < totalFiltered;
  
  // Handle filter change
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setVisibleCount(12); // Reset to initial count when filter changes
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
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200">
          <span class="text-3xl mb-2">📸</span>
          <span class="text-xs text-gray-500 text-center px-2">Image unavailable</span>
        </div>
      `;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pre-connect to Unsplash for faster loading */}
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      
      {/* Hero Section */}
      <GalleryHeroSection />
      
      {/* Gallery Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
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
              >
                {filter.name}
              </button>
            ))}
          </div>
          
          {/* Active Filter Info */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm md:text-base">
              Showing <span className="font-semibold text-blue-600">{filteredImages.length}</span> of{' '}
              <span className="font-semibold text-gray-800">{totalFiltered}</span> photos
              {activeFilter !== 'all' && (
                <> in <span className="font-semibold" style={{
                  color: filters.find(f => f.id === activeFilter)?.color.replace('bg-', '').replace('-600', '-700')
                }}>
                  {filters.find(f => f.id === activeFilter)?.name}
                </span></>
              )}
            </p>
          </div>
        </div>

        {/* Gallery Grid - Images Only */}
        {filteredImages.length === 0 ? (
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
                >
                  <Suspense fallback={<ImageFallback />}>
                    <LazyImage
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading={index < 6 ? "eager" : "lazy"} // First 6 images eager load
                      decoding="async"
                      width="500"
                      height="500"
                      onError={handleImageError}
                    />
                  </Suspense>
                  
                  {/* Simple Hover Overlay */}
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
            <div className="mt-6 md:mt-8 pt-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 text-sm md:text-base">
                  <span className="font-semibold text-gray-800">{filteredImages.length}</span> of{' '}
                  <span className="font-semibold text-gray-800">{totalFiltered}</span> images displayed
                </p>
                
                {/* Category Breakdown */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {filters.slice(1).map(filter => {
                    const count = galleryImages.filter(img => img.tags.includes(filter.id)).length;
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
          </>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center mt-12">
        <div className="container mx-auto px-4">
          <p className="text-gray-300 text-lg font-medium">School Gallery</p>
          <p className="text-gray-400 mt-2">Documenting educational journeys since 2024</p>
          <p className="text-gray-500 text-sm mt-4">Contact: gallery@school.edu • 📞 (123) 456-7890</p>
          <div className="mt-6 flex justify-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors">Facebook</button>
            <button className="text-gray-400 hover:text-white transition-colors">Instagram</button>
            <button className="text-gray-400 hover:text-white transition-colors">Twitter</button>
          </div>
        </div>
      </footer>
    </div>
  );
}