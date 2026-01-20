// app/web-admin/alumni/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces
interface Alumni {
  id: number;
  name: string;
  graduationYear: number;
  currentPosition: string;
  company: string;
  image: string;
  email: string;
  phone: string;
  degree: string;
  achievements: string[];
  linkedin: string;
  isActive: boolean;
}

// Update icon components to accept className prop
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

const GraduationIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  // Mock API call to fetch alumni
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        // In real app, this would be an API call
        setTimeout(() => {
          const mockAlumni: Alumni[] = [
            {
              id: 1,
              name: "Michael Rodriguez",
              graduationYear: 2020,
              currentPosition: "Software Engineer",
              company: "Google",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              email: "m.rodriguez@gmail.com",
              phone: "+1 (555) 234-5678",
              degree: "Computer Science",
              achievements: ["Summa Cum Laude", "Dean's List", "Research Fellowship"],
              linkedin: "linkedin.com/in/michaelrodriguez",
              isActive: true
            },
            {
              id: 2,
              name: "Jennifer Chen",
              graduationYear: 2019,
              currentPosition: "Data Scientist",
              company: "Facebook",
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              email: "j.chen@alumni.edu",
              phone: "+1 (555) 345-6789",
              degree: "Mathematics & Statistics",
              achievements: ["Valedictorian", "Research Grant", "Published Paper"],
              linkedin: "linkedin.com/in/jenniferchen",
              isActive: true
            },
            {
              id: 3,
              name: "David Wilson",
              graduationYear: 2018,
              currentPosition: "Investment Banker",
              company: "Goldman Sachs",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              email: "d.wilson@alumni.edu",
              phone: "+1 (555) 456-7890",
              degree: "Economics",
              achievements: ["Wall Street Intern", "Finance Club President"],
              linkedin: "linkedin.com/in/davidwilson",
              isActive: true
            },
            {
              id: 4,
              name: "Sarah Thompson",
              graduationYear: 2021,
              currentPosition: "Medical Student",
              company: "Johns Hopkins University",
              image: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              email: "s.thompson@alumni.edu",
              phone: "+1 (555) 567-8901",
              degree: "Biology (Pre-Med)",
              achievements: ["Research Fellowship", "Community Service Award"],
              linkedin: "linkedin.com/in/sarahthompson",
              isActive: true
            },
            {
              id: 5,
              name: "Robert Kim",
              graduationYear: 2017,
              currentPosition: "Architect",
              company: "Foster + Partners",
              image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              email: "r.kim@alumni.edu",
              phone: "+1 (555) 678-9012",
              degree: "Architecture",
              achievements: ["Design Competition Winner", "Internship Award"],
              linkedin: "linkedin.com/in/robertkim",
              isActive: true
            },
            {
              id: 6,
              name: "Amanda Davis",
              graduationYear: 2020,
              currentPosition: "Marketing Director",
              company: "Nike",
              image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              email: "a.davis@alumni.edu",
              phone: "+1 (555) 789-0123",
              degree: "Business Administration",
              achievements: ["Marketing Competition Winner", "Entrepreneurship Award"],
              linkedin: "linkedin.com/in/amandadavis",
              isActive: false
            },
            {
              id: 7,
              name: "Thomas O'Connor",
              graduationYear: 2019,
              currentPosition: "Lawyer",
              company: "White & Case LLP",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              email: "t.oconnor@alumni.edu",
              phone: "+1 (555) 890-1234",
              degree: "Political Science",
              achievements: ["Debate Team Captain", "Legal Internship"],
              linkedin: "linkedin.com/in/thomasoconnor",
              isActive: true
            },
            {
              id: 8,
              name: "Lisa Hernandez",
              graduationYear: 2022,
              currentPosition: "Research Assistant",
              company: "MIT Media Lab",
              image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              email: "l.hernandez@alumni.edu",
              phone: "+1 (555) 901-2345",
              degree: "Computer Engineering",
              achievements: ["Research Grant", "Innovation Award"],
              linkedin: "linkedin.com/in/lisahernandez",
              isActive: true
            }
          ];
          setAlumni(mockAlumni);
          setFilteredAlumni(mockAlumni);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load alumni');
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
        alum.degree.toLowerCase().includes(query) ||
        alum.currentPosition.toLowerCase().includes(query) ||
        alum.company.toLowerCase().includes(query)
      );
    }

    // Apply year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(alum => alum.graduationYear.toString() === selectedYear);
    }

    setFilteredAlumni(filtered);
  }, [searchQuery, selectedYear, alumni]);

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

  const handleDeleteConfirm = () => {
    if (alumniToDelete) {
      setAlumni(prev => prev.filter(a => a.id !== alumniToDelete.id));
      setFilteredAlumni(prev => prev.filter(a => a.id !== alumniToDelete.id));
      setShowDeleteModal(false);
      setAlumniToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAlumniToDelete(null);
  };

  // Get unique graduation years
  const graduationYears = [...new Set(alumni.map(alum => alum.graduationYear))].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Management</h1>
          <p className="text-gray-600">Manage your distinguished alumni and their achievements</p>
        </div>

        {/* Controls */}
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
                placeholder="Search alumni by name, degree, or position..."
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
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Active: {alumni.filter(a => a.isActive).length}
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                Inactive: {alumni.filter(a => !a.isActive).length}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Alumni Grid */}
        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlumni.map((alum) => (
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
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${alum.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {alum.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="text-white text-sm font-medium">
                      Class of {alum.graduationYear}
                    </div>
                  </div>
                </div>

                {/* Alumni Info */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{alum.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{alum.degree}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{alum.currentPosition} at {alum.company}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Graduated: {alum.graduationYear}</span>
                    </div>
                    
                    {alum.achievements && alum.achievements.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700 mb-1">Achievements:</p>
                        <div className="flex flex-wrap gap-1">
                          {alum.achievements.slice(0, 2).map((ach, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                              {ach}
                            </span>
                          ))}
                          {alum.achievements.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{alum.achievements.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
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
                : "No alumni have been added yet."}
            </p>
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
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredAlumni.length}</span> of{' '}
                <span className="font-semibold text-blue-600">{alumni.length}</span> alumni
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Graduation Years: </span>
                {graduationYears.join(', ')}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Unique Degrees: </span>
                {[...new Set(alumni.map(a => a.degree))].length}
              </div>
            </div>
          </div>
        </div>
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
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Delete Alumni
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}