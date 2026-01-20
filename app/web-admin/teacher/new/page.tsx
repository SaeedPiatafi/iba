// app/web-admin/teacher/new/page.tsx
"use client";

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// Type definitions
interface TeacherData {
  name: string;
  subject: string;
  classLevels: string[];
  image: string;
  imageFile: File | null;
  education: string[];
  experience: string;
  teachingExperience: string[];
  bio: string;
  achievements: string[];
  teachingPhilosophy: string;
  email: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | '';
}

const AddTeacherPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialTeacherData: TeacherData = {
    name: '',
    subject: '',
    classLevels: [],
    image: '',
    imageFile: null,
    education: [''],
    experience: '',
    teachingExperience: [''],
    bio: '',
    achievements: [''],
    teachingPhilosophy: '',
    email: ''
  };

  const [teacherData, setTeacherData] = useState<TeacherData>(initialTeacherData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedClassLevels, setSelectedClassLevels] = useState<string[]>([]);
  const [notification, setNotification] = useState<Notification>({ show: false, message: '', type: '' });
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const classLevelOptions = [
    'Primary Teacher (1-5)',
    'Secondary Teacher (6-8)',
    'Higher Secondary Teacher (9-10)',
    'Senior Secondary Teacher (11-12)'
  ];

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeacherData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please select a valid image file (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB', 'error');
      return;
    }

    setTeacherData(prev => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file) // For preview
    }));

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setTeacherData(prev => ({
      ...prev,
      imageFile: null,
      image: ''
    }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle array input change
  const handleArrayInputChange = (field: keyof TeacherData, index: number, value: string) => {
    const newArray = [...teacherData[field] as string[]];
    newArray[index] = value;
    setTeacherData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  // Add array field
  const addArrayField = (field: keyof TeacherData) => {
    setTeacherData(prev => ({
      ...prev,
      [field]: [...prev[field] as string[], '']
    }));
  };

  // Remove array field
  const removeArrayField = (field: keyof TeacherData, index: number) => {
    const fieldArray = teacherData[field] as string[];
    if (fieldArray.length === 1) return;
    
    const newArray = fieldArray.filter((_, i) => i !== index);
    setTeacherData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  // Handle class level toggle
  const handleClassLevelToggle = (level: string) => {
    setSelectedClassLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!teacherData.name.trim()) {
      showNotification('Please enter teacher name', 'error');
      return false;
    }
    if (!teacherData.subject.trim()) {
      showNotification('Please enter subject', 'error');
      return false;
    }
    if (selectedClassLevels.length === 0) {
      showNotification('Please select at least one class level', 'error');
      return false;
    }
    if (!teacherData.email.trim()) {
      showNotification('Please enter email address', 'error');
      return false;
    }
    if (!teacherData.experience.trim()) {
      showNotification('Please enter years of experience', 'error');
      return false;
    }
    if (!teacherData.bio.trim()) {
      showNotification('Please enter professional biography', 'error');
      return false;
    }
    if (!teacherData.teachingPhilosophy.trim()) {
      showNotification('Please enter teaching philosophy', 'error');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Prepare data for submission
    const submissionData = {
      ...teacherData,
      classLevels: selectedClassLevels,
      id: Date.now() // Generate a temporary ID
    };

    // In a real app, you would upload the image file here
    // and get back a URL to store in your database

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Submitting teacher data:', submissionData);
      
      showNotification('Teacher added successfully! Redirecting...', 'success');
      
      // Reset form
      setTimeout(() => {
        setTeacherData(initialTeacherData);
        setSelectedClassLevels([]);
        setImagePreview('');
        
        // Redirect to teachers list
        router.push('/web-admin/teachers');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding teacher:', error);
      showNotification('Failed to add teacher. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push('/web-admin/teachers');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-md ${notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'} border rounded-lg p-4 shadow-lg transition-all duration-300`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${notification.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
              {notification.type === 'error' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              className="ml-auto pl-3"
            >
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Teacher</h1>
            <p className="text-gray-600 mt-1">Fill in the details below to add a new teacher to the system</p>
          </div>
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={teacherData.name}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter teacher's full name"
                  />
                </div>
              </div>
              
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={teacherData.subject}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Mathematics & Physics"
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={teacherData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="teacher@school.edu"
                  />
                </div>
              </div>
              
              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="experience"
                    value={teacherData.experience}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., 15 years teaching experience"
                  />
                </div>
              </div>
              
              {/* Profile Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Image Preview */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                      {imagePreview || teacherData.image ? (
                        <img 
                          src={imagePreview || teacherData.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-1 text-xs text-gray-500">No image selected</p>
                        </div>
                      )}
                    </div>
                    {(imagePreview || teacherData.image) && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Upload Controls */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <button
                          type="button"
                          onClick={handleImageUploadClick}
                          className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload Photo
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          JPEG, PNG, GIF or WebP. Max 5MB.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Or enter image URL
                        </label>
                        <input
                          type="url"
                          name="image"
                          value={teacherData.image}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Class Levels */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  {classLevelOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleClassLevelToggle(level)}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedClassLevels.includes(level)
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedClassLevels.length} level(s) selected
                </p>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center mb-3 sm:mb-0">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </span>
                Education Background
              </h2>
              <button
                type="button"
                onClick={() => addArrayField('education')}
                className="inline-flex items-center text-sm bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Education
              </button>
            </div>
            
            <div className="space-y-4">
              {teacherData.education.map((edu, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">{index + 1}.</span>
                    </div>
                    <input
                      type="text"
                      value={edu}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleArrayInputChange('education', index, e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., PhD in Mathematics, Stanford University"
                    />
                  </div>
                  {teacherData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('education', index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove education"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Experience Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center mb-3 sm:mb-0">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </span>
                Teaching Experience
              </h2>
              <button
                type="button"
                onClick={() => addArrayField('teachingExperience')}
                className="inline-flex items-center text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Experience
              </button>
            </div>
            
            <div className="space-y-4">
              {teacherData.teachingExperience.map((exp, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">{index + 1}.</span>
                    </div>
                    <input
                      type="text"
                      value={exp}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleArrayInputChange('teachingExperience', index, e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., Head of Mathematics Department (2015-Present)"
                    />
                  </div>
                  {teacherData.teachingExperience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('teachingExperience', index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove experience"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center mb-3 sm:mb-0">
                <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                Achievements & Awards
              </h2>
              <button
                type="button"
                onClick={() => addArrayField('achievements')}
                className="inline-flex items-center text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Achievement
              </button>
            </div>
            
            <div className="space-y-4">
              {teacherData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">{index + 1}.</span>
                    </div>
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleArrayInputChange('achievements', index, e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                      placeholder="e.g., National Mathematics Teacher of the Year 2022"
                    />
                  </div>
                  {teacherData.achievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('achievements', index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove achievement"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bio & Philosophy Section */}
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </span>
              Biography & Philosophy
            </h2>
            
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Biography <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="bio"
                    value={teacherData.bio}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Write a brief professional biography..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {teacherData.bio.length}/500 characters
                  </div>
                </div>
              </div>
              
              {/* Teaching Philosophy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Philosophy <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="teachingPhilosophy"
                    value={teacherData.teachingPhilosophy}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Describe the teacher's teaching philosophy..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {teacherData.teachingPhilosophy.length}/500 characters
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Quick Preview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Basic Info:</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                      {imagePreview || teacherData.image ? (
                        <img 
                          src={imagePreview || teacherData.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{teacherData.name || "Not provided"}</p>
                      <p className="text-sm text-gray-600">{teacherData.subject || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-700 w-24">Email:</span>
                      <span className="text-sm text-gray-600">{teacherData.email || "Not provided"}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-700 w-24">Experience:</span>
                      <span className="text-sm text-gray-600">{teacherData.experience || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Details:</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Teacher Levels:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedClassLevels.length > 0 ? (
                        selectedClassLevels.map((level) => (
                          <span key={level} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {level}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">None selected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Education:</span>
                    <p className="text-sm text-gray-600">{teacherData.education.length} item(s)</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Experience:</span>
                    <p className="text-sm text-gray-600">{teacherData.teachingExperience.length} item(s)</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Achievements:</span>
                    <p className="text-sm text-gray-600">{teacherData.achievements.length} item(s)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all fields?')) {
                  setTeacherData(initialTeacherData);
                  setSelectedClassLevels([]);
                  setImagePreview('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  showNotification('Form cleared successfully', 'success');
                }
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Clear All
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || selectedClassLevels.length === 0}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Teacher...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Teacher
                </>
              )}
            </button>
          </div>
          
          {/* Required Fields Note */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> indicates required fields
            </p>
            <p className="text-sm text-gray-500 mt-1">
              All teacher information will be displayed on the public website after submission.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherPage;