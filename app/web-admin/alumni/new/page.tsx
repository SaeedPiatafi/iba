// app/web-admin/alumni/new/page.tsx
"use client";

import { useState, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
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
  graduationYear: number;
  degree: string;
  currentPosition: string;
  company: string;
  image: string;
  email: string;
  phone: string;
  achievements: string[];
  linkedin: string;
  bio: string;
  isActive: boolean;
}

export default function NewAlumniPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    graduationYear: new Date().getFullYear(),
    degree: '',
    currentPosition: '',
    company: '',
    image: '',
    email: '',
    phone: '',
    achievements: [''],
    linkedin: '',
    bio: '',
    isActive: true,
  });

  const [newAchievement, setNewAchievement] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAchievement();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Prepare final data
    const alumniData = {
      ...formData,
      achievements: formData.achievements.filter(ach => ach.trim()),
    };
    
    // In real app, submit to API
    console.log('Alumni Data:', alumniData);
    
    setTimeout(() => {
      setLoading(false);
      router.push('/web-admin/alumni');
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  // Generate recent years for graduation year dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree/Program *
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Computer Science"
                />
              </div>

              {/* Current Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Position *
                </label>
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Software Engineer"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Organization *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Google"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <p className="mt-2 text-sm text-gray-500">Leave empty to use default avatar</p>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="alumni@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* LinkedIn */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
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
                  onKeyPress={handleKeyPress}
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
              
              {formData.achievements.length > 0 && (
                <div className="space-y-2">
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

          {/* Biography Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Biography
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Write a biography about the alumni's journey and accomplishments..."
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 mt-6">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                id="isActive"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active Alumni (Visible on public site)
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
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
    </div>
  );
}