"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces
interface FormData {
  alt: string;
  imageUrl: string;
  tags: string[];
}

interface IconProps {
  className?: string;
}

// Icons with proper typing
const BackIcon = ({ className }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const SaveIcon = ({ className }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const UploadIcon = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const TagIcon = ({ className }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const AddIcon = ({ className }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const RemoveIcon = ({ className }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

export default function NewGalleryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    alt: '',
    imageUrl: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState<string>('');

  // Available tags for quick selection
  const availableTags: string[] = ['events', 'campus-life', 'academics', 'sports', 'cultural'];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'imageUrl' && uploadMethod === 'url') {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Show preview if URL is provided
      if (value.trim()) {
        setImagePreview(value);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Set the image URL (will be uploaded via API)
      setFormData(prev => ({
        ...prev,
        imageUrl: file.name // This will be replaced with the uploaded URL
      }));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadMethod === 'file') {
      const file = e.dataTransfer.files[0];
      if (file) {
        // Process the dropped file directly instead of creating synthetic event
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file (JPEG, PNG, etc.)');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Set the image URL
        setFormData(prev => ({
          ...prev,
          imageUrl: file.name // This will be replaced with the uploaded URL
        }));
      }
    }
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddCustomTag = () => {
    const tag = newTag.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const validateForm = (): boolean => {
    if (!formData.alt.trim()) {
      alert('Please enter alt text for the image');
      return false;
    }
    
    if (!formData.imageUrl.trim()) {
      alert('Please provide an image URL or upload a file');
      return false;
    }
    
    if (formData.tags.length === 0) {
      alert('Please add at least one tag');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare form data
      const formDataToSend = new FormData();
      formDataToSend.append('alt', formData.alt);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      
      // Handle file upload or URL
      if (uploadMethod === 'file' && fileInputRef.current?.files?.[0]) {
        formDataToSend.append('image', fileInputRef.current.files[0]);
      } else {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }
      
      // Submit to API
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload image');
      }
      
      alert('Image uploaded successfully!');
      router.push('/web-admin/gallery');
    } catch (error: any) {
      alert(error.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
          >
            <BackIcon className="w-5 h-5 mr-2" />
            Back to Gallery
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Gallery Image</h1>
          <p className="text-gray-600">Upload and organize images for the school gallery</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Method Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Upload Method
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('url');
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, imageUrl: '' }));
                }}
                className={`p-4 rounded-lg border-2 transition-all ${uploadMethod === 'url' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full mr-4 ${uploadMethod === 'url' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 ${uploadMethod === 'url' ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Image URL</h3>
                    <p className="text-sm text-gray-600">Paste image link from Unsplash, etc.</p>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('file');
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, imageUrl: '' }));
                }}
                className={`p-4 rounded-lg border-2 transition-all ${uploadMethod === 'file' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full mr-4 ${uploadMethod === 'file' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 ${uploadMethod === 'file' ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">File Upload</h3>
                    <p className="text-sm text-gray-600">Upload from your computer</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Image Input Section */}
            {uploadMethod === 'url' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Recommended: Use high-quality images from Unsplash or similar sources
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${imagePreview ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {imagePreview ? (
                    <div>
                      <div className="relative h-48 w-full mb-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-contain rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-gray-600">Click or drag to change image</p>
                    </div>
                  ) : (
                    <div>
                      <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                        <UploadIcon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Preview */}
            {(imagePreview || formData.imageUrl) && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Image Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview || formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <div class="text-gray-400">
                                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Ready to upload
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Image will appear in gallery with the details below.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Image Details
            </h2>
            
            <div className="space-y-6">
              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text *
                </label>
                <input
                  type="text"
                  name="alt"
                  value={formData.alt}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter descriptive alt text for the image"
                />
                <p className="mt-2 text-sm text-gray-500">
                  This text is important for accessibility and SEO
                </p>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Tags & Categories
            </h2>
            
            <div className="space-y-6">
              {/* Available Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select from available tags:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={formData.tags.includes(tag)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors flex items-center gap-1 ${formData.tags.includes(tag) ? 'bg-blue-100 text-blue-700 border-blue-300 cursor-not-allowed' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                    >
                      <TagIcon className="w-4 h-4" />
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Tag Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add custom tag:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter custom tag (e.g., graduation-2024)"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    <AddIcon className="w-5 h-5 mr-1" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Press Enter or click the + button to add custom tags
                </p>
              </div>

              {/* Selected Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selected Tags ({formData.tags.length})
                </label>
                {formData.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <div
                        key={tag}
                        className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <RemoveIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-700">
                      No tags selected. Please add at least one tag to categorize the image.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Preview */}
                <div className="md:w-1/3">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {imagePreview || formData.imageUrl ? (
                      <img
                        src={imagePreview || formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <div class="text-center">
                                <div class="text-gray-400 text-4xl mb-2">📷</div>
                                <div class="text-gray-500 text-sm">Image Preview</div>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-gray-400 text-4xl mb-2">📷</div>
                          <div className="text-gray-500 text-sm">No image selected</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Details Preview */}
                <div className="md:w-2/3">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {formData.alt || 'Image Alt Text'}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.length > 0 ? (
                          formData.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No tags selected</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">Status:</p>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Ready to upload
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Upload Date:</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
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
                  setFormData({
                    alt: '',
                    imageUrl: '',
                    tags: [],
                  });
                  setImagePreview(null);
                  setNewTag('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  alert('Form cleared successfully!');
                }}
                className="px-4 py-2.5 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                Clear All
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading Image...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-5 h-5 mr-2" />
                    Upload to Gallery
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