// app/web-admin/results/new/page.jsx
"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Icons
const BackIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const ExcelIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

export default function NewResultPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState({
    term: '',
    year: '',
  });

  // Options
  const testTypes = ['First Term', 'Second Term', 'Mid Term', 'Final Examination'];
  const academicYears = ['2024-2025', '2023-2024', '2022-2023', '2021-2022'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's an Excel file
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
        alert('Please upload an Excel file (.xlsx or .xls)');
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = {
        target: {
          files: [file]
        }
      };
      handleFileSelect(event);
    }
  };

  const validateForm = () => {
    if (!formData.term) {
      alert('Please select a term');
      return false;
    }
    
    if (!formData.year) {
      alert('Please select academic year');
      return false;
    }
    
    if (!selectedFile) {
      alert('Please select an Excel file to upload');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // In real app, upload file to server
    console.log('Uploading file:', {
      term: formData.term,
      year: formData.year,
      fileName: fileName,
      fileSize: selectedFile.size
    });
    
    // Simulate file upload
    setTimeout(() => {
      setLoading(false);
      alert(`Excel file uploaded successfully for ${formData.term} ${formData.year}!`);
      router.push('/web-admin/results');
    }, 2000);
  };

  const handleBack = () => {
    router.back();
  };

  const handleClear = () => {
    setSelectedFile(null);
    setFileName('');
    setFormData({
      term: '',
      year: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
          >
            <BackIcon />
            Back to Results
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Result Excel File</h1>
          <p className="text-gray-600">Select term, year, and upload Excel file with student results</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Term and Year Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Term & Year Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term/Test Type *
                </label>
                <select
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select Term</option>
                  {testTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  e.g., Mid Term, Final Examination
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select Year</option>
                  {academicYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  e.g., 2024-2025
                </p>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Excel File Upload</h2>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                selectedFile 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".xlsx,.xls"
                className="hidden"
              />
              
              {selectedFile ? (
                <div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full mr-4">
                      <ExcelIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{fileName}</p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Click or drag to change file</p>
                </div>
              ) : (
                <div>
                  <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                    <ExcelIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Click to upload or drag and drop Excel file
                    </p>
                    <p className="text-xs text-gray-500">
                      .xlsx or .xls files only (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File Requirements */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Excel File Requirements:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Must be in Excel format (.xlsx or .xls)
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Should contain student results with proper columns
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Recommended columns: Roll No, Name, Subjects, Marks, etc.
                </li>
              </ul>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Preview</h2>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {formData.term || '[Term Name]'}
                    </h3>
                    <p className="text-gray-600">{formData.year || '[Academic Year]'}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                    Excel File
                  </span>
                </div>
                
                {selectedFile ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <ExcelIcon className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{fileName}</p>
                      <p className="text-xs text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-600">No file selected</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Upload Status:</p>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedFile ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedFile ? 'Ready to upload' : 'Waiting for file'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Clear All
            </button>
            
            <div className="flex items-center gap-4">
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
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    Upload Excel File
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