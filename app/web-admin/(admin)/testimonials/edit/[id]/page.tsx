"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

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

interface FormData {
  name: string;
  graduation: string;
  current: string;
  text: string;
  avatarColor: string;
  textColor: string;
  isActive: boolean;
}

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

const DeleteIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    graduation: '',
    current: '',
    text: '',
    avatarColor: 'bg-blue-500',
    textColor: 'text-white',
    isActive: true,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [originalData, setOriginalData] = useState<Testimonial | null>(null);
  const [error, setError] = useState('');

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

  const textColors = [
    { value: 'text-white', label: 'White', bgColor: 'bg-gray-800' },
    { value: 'text-black', label: 'Black', bgColor: 'bg-gray-100' }
  ];

  // Load testimonial data
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`/api/admin/testimonials?id=${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch testimonial: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to load testimonial');
        }
        
        const testimonial = result.data;
        setOriginalData(testimonial);
        
        setFormData({
          name: testimonial.name,
          graduation: testimonial.graduation,
          current: testimonial.current,
          text: testimonial.text,
          avatarColor: testimonial.avatarColor,
          textColor: testimonial.textColor,
          isActive: testimonial.isActive,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load testimonial');
        router.push('/web-admin/testimonials');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTestimonial();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.graduation.trim()) {
      newErrors.graduation = 'Graduation year/class is required';
    }
    
    if (!formData.current.trim()) {
      newErrors.current = 'Current position/status is required';
    }
    
    if (!formData.text.trim()) {
      newErrors.text = 'Testimonial text is required';
    } else if (formData.text.length < 20) {
      newErrors.text = 'Testimonial text should be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...formData
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update testimonial');
      }
      
      alert('Testimonial updated successfully!');
      router.push('/web-admin/testimonials');
    } catch (error: any) {
      alert(error.message || 'Failed to update testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    
    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete testimonial');
      }
      
      alert('Testimonial deleted successfully!');
      router.push('/web-admin/testimonials');
    } catch (error: any) {
      alert(error.message || 'Failed to delete testimonial');
    } finally {
      setDeleting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Testimonial</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleBack}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Back to Testimonials
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            Back to Testimonials
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Testimonial</h1>
              <p className="text-gray-600">Update alumni testimonial details</p>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <DeleteIcon />
                  Delete Testimonial
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Alumni Information
            </h2>
            
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter alumni full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Graduation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year/Class *
                </label>
                <input
                  type="text"
                  name="graduation"
                  value={formData.graduation}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.graduation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Class of 2018, Batch 2020"
                />
                {errors.graduation && (
                  <p className="mt-1 text-sm text-red-600">{errors.graduation}</p>
                )}
              </div>

              {/* Current Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Position/Status *
                </label>
                <input
                  type="text"
                  name="current"
                  value={formData.current}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors.current ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Software Engineer at Google, Medical Student"
                />
                {errors.current && (
                  <p className="mt-1 text-sm text-red-600">{errors.current}</p>
                )}
              </div>
            </div>
          </div>

          {/* Testimonial Text */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Testimonial Text
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial Text *
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                required
                rows={6}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.text ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter the testimonial text (minimum 20 characters)..."
              />
              {errors.text && (
                <p className="mt-1 text-sm text-red-600">{errors.text}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {formData.text.length} characters (minimum 20)
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Appearance Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Avatar Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {avatarColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatarColor: color }))}
                      className={`aspect-square rounded-full ${color} flex items-center justify-center ${formData.avatarColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                      title={color}
                    >
                      {formData.avatarColor === color && (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {formData.avatarColor}
                </p>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Text Color on Avatar
                </label>
                <div className="space-y-2">
                  {textColors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, textColor: color.value }))}
                      className={`w-full p-3 rounded-lg flex items-center justify-between ${color.bgColor} ${formData.textColor === color.value ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <span className={`font-medium ${color.value === 'text-black' ? 'text-black' : 'text-white'}`}>
                        {color.label}
                      </span>
                      {formData.textColor === color.value && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  id="isActive"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (visible on public site)
                </label>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Active testimonials appear on the public site
                </span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                {/* Avatar Preview */}
                <div className={`w-16 h-16 rounded-full ${formData.avatarColor} flex items-center justify-center text-2xl font-bold ${formData.textColor} flex-shrink-0`}>
                  {formData.name ? formData.name.charAt(0) : 'A'}
                </div>
                
                {/* Content Preview */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {formData.name || 'Alumni Name'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formData.graduation || 'Graduation Year'}
                    </p>
                    <p className="text-blue-600 font-medium text-sm">
                      {formData.current || 'Current Position'}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 italic">
                    "{formData.text || 'Testimonial text will appear here...'}"
                  </p>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Status:</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {formData.isActive ? 'Active ★' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Created:</p>
                    <p className="text-xs text-gray-700">
                      {originalData?.createdAt ? new Date(originalData.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
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
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (originalData) {
                    setFormData({
                      name: originalData.name,
                      graduation: originalData.graduation,
                      current: originalData.current,
                      text: originalData.text,
                      avatarColor: originalData.avatarColor,
                      textColor: originalData.textColor,
                      isActive: originalData.isActive,
                    });
                    setErrors({});
                    alert('Changes reset to original values!');
                  }
                }}
                className="px-4 py-2.5 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                Reset Changes
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating Testimonial...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Update Testimonial
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}