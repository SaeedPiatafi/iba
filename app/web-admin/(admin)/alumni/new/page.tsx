"use client";

import { useState, ChangeEvent, FormEvent, KeyboardEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Icons (keep the same icons from your original code)
const BackIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const RemoveIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

interface FormData {
  name: string;
  graduationYear: string;
  profession: string;
  image: string;
  bio: string;
  achievements: string[];
  education: string[];
  email: string;
  skills: string[];
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error" | "";
}

// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function NewAlumniPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: '',
    type: '',
  });

  // Single source of truth for input data
  const [formData, setFormData] = useState<FormData>({
    name: '',
    graduationYear: new Date().getFullYear().toString(),
    profession: '',
    image: '',
    bio: '',
    achievements: [],
    education: [],
    email: '',
    skills: [],
  });

  // Input buffers for adding new items
  const [newAchievement, setNewAchievement] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Show notification with cleanup
  const showNotification = useCallback((message: string, type: "success" | "error" = "success") => {
    setNotification({ show: true, message, type });
    const timer = setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleBasicChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      showNotification(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`, 'error');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      showNotification(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`, 'error');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setFormData(prev => ({
        ...prev,
        image: reader.result as string // Set base64 preview as temporary image
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const addAchievement = useCallback(() => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  }, [newAchievement]);

  const removeAchievement = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  }, []);

  const addEducation = useCallback(() => {
    if (newEducation.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation.trim()]
      }));
      setNewEducation('');
    }
  }, [newEducation]);

  const removeEducation = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  }, []);

  const addSkill = useCallback(() => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  }, [newSkill]);

  const removeSkill = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    if (!formData.name.trim()) {
      showNotification('Please enter alumni name', 'error');
      return false;
    }
    if (!formData.graduationYear.trim()) {
      showNotification('Please enter graduation year', 'error');
      return false;
    }
    // Validate graduation year is a number between 1900 and current year + 5
    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(formData.graduationYear);
    if (isNaN(gradYear) || gradYear < 1900 || gradYear > currentYear + 5) {
      showNotification(`Please enter a valid graduation year between 1900 and ${currentYear + 5}`, 'error');
      return false;
    }
    if (!formData.profession.trim()) {
      showNotification('Please enter profession', 'error');
      return false;
    }
    if (!formData.email.trim()) {
      showNotification('Please enter email address', 'error');
      return false;
    }
    if (!formData.image.trim() && !selectedFile) {
      showNotification('Please select a profile image', 'error');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      showNotification('Please enter a valid email address', 'error');
      return false;
    }

    // Validate education array has at least one non-empty entry
    const validEducation = [...formData.education, newEducation].filter(edu => edu.trim() !== '');
    if (validEducation.length === 0) {
      showNotification('Please enter at least one education background', 'error');
      return false;
    }

    return true;
  }, [formData, newEducation, showNotification, selectedFile]);

  // Prepare form data for submission
  const prepareFormData = useCallback((): FormData => {
    const data = { ...formData };
    
    // Add current input values if they exist
    if (newEducation.trim()) {
      data.education = [...data.education, newEducation.trim()];
    }
    
    if (newAchievement.trim()) {
      data.achievements = [...data.achievements, newAchievement.trim()];
    }
    
    if (newSkill.trim()) {
      data.skills = [...data.skills, newSkill.trim()];
    }
    
    return data;
  }, [formData, newEducation, newAchievement, newSkill]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Prepare final data with filtering
      const preparedData = prepareFormData();
      const alumniData = {
        ...preparedData,
        achievements: preparedData.achievements.filter(ach => ach.trim()),
        education: preparedData.education.filter(edu => edu.trim()),
        skills: preparedData.skills.filter(skill => skill.trim()),
      };
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all fields to FormData
      Object.entries(alumniData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      
      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }
      
      // Submit to Admin API with FormData
      const response = await fetch('/api/admin/alumni', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create alumni');
      }
      
      // Show success notification
      showNotification('Alumni created successfully!', 'success');
      
      // Wait a moment before redirecting so user can see success message
      const redirectTimer = setTimeout(() => {
        router.push('/web-admin/alumni');
        router.refresh();
      }, 1500);

      return () => clearTimeout(redirectTimer);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create alumni. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, type: 'achievement' | 'education' | 'skill') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'achievement') addAchievement();
      if (type === 'education') addEducation();
      if (type === 'skill') addSkill();
    }
  };

  const currentYear = new Date().getFullYear();

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
              className="ml-auto pl-3 transition-opacity hover:opacity-70"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
            aria-label="Go back to alumni list"
          >
            <BackIcon />
            Back to Alumni
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Alumni</h1>
          <p className="text-gray-600">Fill in the details to add a new alumni profile</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleBasicChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Michael Rodriguez"
                  aria-required="true"
                />
              </div>

              {/* Graduation Year */}
              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year <span className="text-red-500">*</span>
                </label>
                <input
                  id="graduationYear"
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleBasicChange}
                  min="1900"
                  max={currentYear + 5}
                  step="1"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="e.g., 2020"
                  aria-required="true"
                />
                <p className="mt-2 text-sm text-gray-500">Enter a year between 1900 and {currentYear + 5}</p>
              </div>

              {/* Profession */}
              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                  Profession <span className="text-red-500">*</span>
                </label>
                <input
                  id="profession"
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleBasicChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Software Engineer"
                  aria-required="true"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleBasicChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="alumni@example.com"
                  aria-required="true"
                />
              </div>

              {/* Profile Image - Updated for file upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image <span className="text-red-500">*</span>
                </label>
                
                <div className="space-y-4">
                  {/* File Upload */}
                  <div className="flex items-center justify-center w-full">
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 ${selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {selectedFile ? (
                          <>
                            <svg className="w-8 h-8 mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
                            <p className="text-xs text-green-600">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                          </>
                        ) : (
                          <>
                            <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP (Max. 5MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {/* Or URL input */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or enter image URL</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="image"
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleBasicChange}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="https://images.unsplash.com/photo-..."
                      aria-label="Image URL"
                    />
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center"
                        aria-label="Remove selected file"
                      >
                        <RemoveIcon />
                      </button>
                    )}
                  </div>

                  {/* Image Preview */}
                  {(imagePreview || formData.image) && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-32 rounded-lg border border-gray-300 overflow-hidden">
                          <img
                            src={imagePreview || formData.image}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                            }}
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Image preview will be uploaded</p>
                          {selectedFile && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ File ready for upload: {selectedFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Biography Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Biography
            </h2>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Biography <span className="text-red-500">*</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleBasicChange}
                rows={6}
                maxLength={1000}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Write a biography about the alumni's journey and accomplishments..."
                aria-required="true"
              />
              <div className="mt-2 text-right text-xs text-gray-500">
                {formData.bio.length}/1000 characters
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Education
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEducation}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewEducation(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'education')}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Add education (e.g., B.S. Computer Science, Class of 2020)"
                  aria-label="Add education background"
                />
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  aria-label="Add education"
                >
                  <AddIcon />
                </button>
              </div>
              
              {(formData.education.length > 0 || newEducation.trim()) && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Education:</p>
                  {formData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-800">{edu}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800 p-1 transition-colors"
                        aria-label={`Remove education: ${edu}`}
                      >
                        <RemoveIcon />
                      </button>
                    </div>
                  ))}
                  {newEducation.trim() && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-800">{newEducation}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Achievements & Awards
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAchievement(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'achievement')}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Add achievement (e.g., Summa Cum Laude, Research Grant)"
                  aria-label="Add achievement"
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  aria-label="Add achievement"
                >
                  <AddIcon />
                </button>
              </div>
              
              {(formData.achievements.length > 0 || newAchievement.trim()) && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Achievements:</p>
                  {formData.achievements.map((ach, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-800">{ach}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-red-600 hover:text-red-800 p-1 transition-colors"
                        aria-label={`Remove achievement: ${ach}`}
                      >
                        <RemoveIcon />
                      </button>
                    </div>
                  ))}
                  {newAchievement.trim() && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-800">{newAchievement}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Skills
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'skill')}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Add skill (e.g., JavaScript, Machine Learning)"
                  aria-label="Add skill"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  aria-label="Add skill"
                >
                  <AddIcon />
                </button>
              </div>
              
              {(formData.skills.length > 0 || newSkill.trim()) && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200"
                      >
                        <span className="mr-2">{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          aria-label={`Remove skill: ${skill}`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {newSkill.trim() && (
                      <div className="flex items-center bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200">
                        <span className="mr-2">{newSkill}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              aria-label="Cancel and go back"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={loading ? "Saving alumni profile" : "Save alumni profile"}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : uploadingImage ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading Image...
                </>
              ) : (
                <>
                  <SaveIcon />
                  Save Alumni Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}