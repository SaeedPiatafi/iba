"use client";

import { useState, ChangeEvent, FormEvent, KeyboardEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Icons
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
  location: string;
  email: string;
  skills: string[];
}

export default function NewAlumniPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Single source of truth for input data
  const [formData, setFormData] = useState<FormData>({
    name: '',
    graduationYear: new Date().getFullYear().toString(),
    profession: '',
    image: '',
    bio: '',
    achievements: [],
    education: [],
    location: '',
    email: '',
    skills: [],
  });

  // Input buffers for adding new items
  const [newAchievement, setNewAchievement] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // Track if input has content but wasn't added
  const [pendingEducation, setPendingEducation] = useState('');
  const [pendingAchievement, setPendingAchievement] = useState('');
  const [pendingSkill, setPendingSkill] = useState('');

  const handleBasicChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
      setPendingAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation.trim()]
      }));
      setNewEducation('');
      setPendingEducation('');
    }
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      setPendingSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First, add any pending items from input fields
      const finalFormData = { ...formData };
      
      // Add pending education if exists
      if (newEducation.trim() && !formData.education.includes(newEducation.trim())) {
        finalFormData.education = [...finalFormData.education, newEducation.trim()];
      }
      
      // Add pending achievement if exists
      if (newAchievement.trim() && !formData.achievements.includes(newAchievement.trim())) {
        finalFormData.achievements = [...finalFormData.achievements, newAchievement.trim()];
      }
      
      // Add pending skill if exists
      if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
        finalFormData.skills = [...finalFormData.skills, newSkill.trim()];
      }
      
      // Prepare final data with filtering
      const alumniData = {
        ...finalFormData,
        achievements: finalFormData.achievements.filter(ach => ach.trim()),
        education: finalFormData.education.filter(edu => edu.trim()),
        skills: finalFormData.skills.filter(skill => skill.trim()),
      };
      
      console.log('Submitting alumni data:', alumniData);
      
      // Submit to Admin API
      const response = await fetch('/api/admin/alumni', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alumniData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create alumni');
      }
      
      // Show success message
      setShowSuccess(true);
      
      // Wait a moment before redirecting so user can see success message
      setTimeout(() => {
        router.push('/web-admin/alumni');
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error('Error creating alumni:', error);
      alert(error instanceof Error ? error.message : 'Failed to create alumni. Please try again.');
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

  // Track input changes for pending items
  useEffect(() => {
    if (newEducation.trim() && newEducation !== pendingEducation) {
      setPendingEducation(newEducation);
    }
  }, [newEducation]);

  useEffect(() => {
    if (newAchievement.trim() && newAchievement !== pendingAchievement) {
      setPendingAchievement(newAchievement);
    }
  }, [newAchievement]);

  useEffect(() => {
    if (newSkill.trim() && newSkill !== pendingSkill) {
      setPendingSkill(newSkill);
    }
  }, [newSkill]);

  // Generate recent years for graduation year dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
          >
            <BackIcon />
            Back to Alumni
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Alumni</h1>
          <p className="text-gray-600">Fill in the details to add a new alumni profile</p>
        </div>

        {/* Success Notification */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-green-800">Alumni saved successfully!</p>
                <p className="text-sm text-green-700">Redirecting to alumni list...</p>
              </div>
            </div>
          </div>
        )}

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleBasicChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Michael Rodriguez"
                />
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year *
                </label>
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleBasicChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession *
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleBasicChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Software Engineer"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleBasicChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="San Francisco, CA"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleBasicChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="alumni@example.com"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleBasicChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <p className="mt-2 text-sm text-gray-500">Use a high-quality headshot image URL from Unsplash or similar service</p>
              </div>
            </div>
          </div>

          {/* Biography Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Biography
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleBasicChange}
                rows={6}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Write a biography about the alumni's journey and accomplishments..."
              />
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Education
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEducation}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewEducation(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'education')}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Add education (e.g., B.S. Computer Science, Class of 2020)"
                  />
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <AddIcon />
                  </button>
                </div>
                
                {/* Show current input as pending item */}
                {newEducation.trim() && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium mb-1">Pending Education:</p>
                    <p className="text-blue-800">{newEducation}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      This will be saved automatically when you click "Save Alumni Profile"
                    </p>
                  </div>
                )}
              </div>
              
              {formData.education.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Added Education:</p>
                  {formData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-800">{edu}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <RemoveIcon />
                      </button>
                    </div>
                  ))}
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
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'achievement')}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Add achievement (e.g., Summa Cum Laude, Research Grant)"
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <AddIcon />
                  </button>
                </div>
                
                {/* Show current input as pending item */}
                {newAchievement.trim() && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium mb-1">Pending Achievement:</p>
                    <p className="text-blue-800">{newAchievement}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      This will be saved automatically when you click "Save Alumni Profile"
                    </p>
                  </div>
                )}
              </div>
              
              {formData.achievements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Added Achievements:</p>
                  {formData.achievements.map((ach, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-800">{ach}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <RemoveIcon />
                      </button>
                    </div>
                  ))}
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
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'skill')}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Add skill (e.g., JavaScript, Machine Learning)"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <AddIcon />
                  </button>
                </div>
                
                {/* Show current input as pending item */}
                {newSkill.trim() && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium mb-1">Pending Skill:</p>
                    <p className="text-blue-800">{newSkill}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      This will be saved automatically when you click "Save Alumni Profile"
                    </p>
                  </div>
                )}
              </div>
              
              {formData.skills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Added Skills:</p>
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
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-blue-700 font-medium w-32">Education items:</span>
                <span className="text-blue-800">
                  {formData.education.length} added + {newEducation.trim() ? '1 pending' : '0 pending'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-blue-700 font-medium w-32">Achievements:</span>
                <span className="text-blue-800">
                  {formData.achievements.length} added + {newAchievement.trim() ? '1 pending' : '0 pending'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-blue-700 font-medium w-32">Skills:</span>
                <span className="text-blue-800">
                  {formData.skills.length} added + {newSkill.trim() ? '1 pending' : '0 pending'}
                </span>
              </div>
              <div className="text-xs text-blue-600 mt-3">
                Note: Pending items in input fields will be automatically saved when you submit the form.
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
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
      
      {/* Add CSS for fadeIn animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}