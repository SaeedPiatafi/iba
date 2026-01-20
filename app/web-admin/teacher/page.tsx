// app/web-admin/teacher/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces
interface Teacher {
  id: number;
  name: string;
  subject: string;
  image: string;
  isActive: boolean;
  email: string;
  phone: string;
}

// Icons components with proper typing
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

const UserIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  // Mock API call to fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        // In real app, this would be an API call
        setTimeout(() => {
          const mockTeachers: Teacher[] = [
            {
              id: 1,
              name: "Dr. Sarah Johnson",
              subject: "Mathematics & Physics",
              image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              isActive: true,
              email: "s.johnson@school.edu",
              phone: "+1 (555) 123-4567"
            },
            {
              id: 2,
              name: "Mr. David Chen",
              subject: "Computer Science",
              image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              isActive: true,
              email: "d.chen@school.edu",
              phone: "+1 (555) 234-5678"
            },
            {
              id: 3,
              name: "Ms. Maria Rodriguez",
              subject: "Literature & Languages",
              image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              isActive: true,
              email: "m.rodriguez@school.edu",
              phone: "+1 (555) 345-6789"
            },
            {
              id: 4,
              name: "Mr. James Wilson",
              subject: "History & Social Studies",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              isActive: false,
              email: "j.wilson@school.edu",
              phone: "+1 (555) 456-7890"
            },
            {
              id: 5,
              name: "Dr. Lisa Thompson",
              subject: "Biology & Chemistry",
              image: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
              isActive: true,
              email: "l.thompson@school.edu",
              phone: "+1 (555) 567-8901"
            }
          ];
          setTeachers(mockTeachers);
          setFilteredTeachers(mockTeachers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load teachers');
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(query) ||
        teacher.subject.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query)
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

  const handleDeleteClick = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (teacherToDelete) {
      setTeachers(prev => prev.filter(t => t.id !== teacherToDelete.id));
      setFilteredTeachers(prev => prev.filter(t => t.id !== teacherToDelete.id));
      setShowDeleteModal(false);
      setTeacherToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTeacherToDelete(null);
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Management</h1>
          <p className="text-gray-600">Manage your teaching faculty and their profiles</p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search teachers by name, subject, or email..."
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
            Add New Teacher
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Teachers Grid */}
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {/* Teacher Image */}
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
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {teacher.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{teacher.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{teacher.subject}</p>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-gray-600 truncate">
                      <span className="font-medium">Email:</span> {teacher.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {teacher.phone}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(teacher.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors duration-200"
                    >
                      <EditIcon />
                      <span className="ml-2">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(teacher)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors duration-200"
                    >
                      <DeleteIcon />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No teachers found</h3>
            <p className="text-gray-600 mb-6">No teachers match your search criteria.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredTeachers.length}</span> of{' '}
                <span className="font-semibold text-blue-600">{teachers.length}</span> teachers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Active: {teachers.filter(t => t.isActive).length}
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                Inactive: {teachers.filter(t => !t.isActive).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && teacherToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Teacher</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{teacherToDelete.name}</span>? This action cannot be undone.
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
                  Delete Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}