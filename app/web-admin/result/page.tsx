// app/web-admin/results/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Icons
const AddIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const ExcelIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-8 h-8 ${className}`} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

// Type definitions
interface ResultFile {
  id: string;
  term: string;
  year: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  totalStudents: number;
  uploader: string;
}

interface GroupedResults {
  [year: string]: ResultFile[];
}

export default function AdminResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<ResultFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [resultToDelete, setResultToDelete] = useState<ResultFile | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Available terms and years
  const testTypes: string[] = ['First Term', 'Second Term', 'Mid Term', 'Final Examination'];
  const academicYears: string[] = ['2024-2025', '2023-2024', '2022-2023', '2021-2022'];

  // Mock API call to fetch result files
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          const mockResults: ResultFile[] = [
            {
              id: '1',
              term: 'Mid Term',
              year: '2024-2025',
              fileName: 'midterm_results_2025.xlsx',
              fileSize: '2.4 MB',
              uploadedAt: '2024-10-15',
              totalStudents: 150,
              uploader: 'Admin User'
            },
            {
              id: '2',
              term: 'First Term',
              year: '2024-2025',
              fileName: 'first_term_2025.xlsx',
              fileSize: '2.1 MB',
              uploadedAt: '2024-08-20',
              totalStudents: 150,
              uploader: 'Admin User'
            },
            {
              id: '3',
              term: 'Final Examination',
              year: '2023-2024',
              fileName: 'final_exam_2024.xlsx',
              fileSize: '3.2 MB',
              uploadedAt: '2024-03-10',
              totalStudents: 145,
              uploader: 'Admin User'
            },
            {
              id: '4',
              term: 'Second Term',
              year: '2023-2024',
              fileName: 'second_term_2024.xlsx',
              fileSize: '2.8 MB',
              uploadedAt: '2023-12-15',
              totalStudents: 148,
              uploader: 'Admin User'
            },
            {
              id: '5',
              term: 'First Term',
              year: '2023-2024',
              fileName: 'first_term_2024.xlsx',
              fileSize: '2.0 MB',
              uploadedAt: '2023-09-05',
              totalStudents: 150,
              uploader: 'Admin User'
            },
            {
              id: '6',
              term: 'Final Examination',
              year: '2022-2023',
              fileName: 'final_exam_2023.xlsx',
              fileSize: '3.0 MB',
              uploadedAt: '2023-03-12',
              totalStudents: 142,
              uploader: 'Admin User'
            },
          ];
          setResults(mockResults);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Failed to load results:', err);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleAddNew = () => {
    setShowUploadModal(true);
  };

  const handleDeleteClick = (result: ResultFile) => {
    setResultToDelete(result);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (resultToDelete) {
      setResults(prev => prev.filter(r => r.id !== resultToDelete.id));
      setShowDeleteModal(false);
      setResultToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setResultToDelete(null);
  };

  const handleDownload = (result: ResultFile) => {
    // In real app, this would download the Excel file
    alert(`Downloading: ${result.fileName}`);
  };

  const handleView = (result: ResultFile) => {
    // In real app, this would open/view the Excel file
    alert(`Opening Excel file: ${result.fileName}\n\nThis would redirect to or preview the Excel file.`);
  };

  const handleUpload = () => {
    if (!selectedTerm || !selectedYear) {
      alert('Please select both term and year');
      return;
    }

    // In real app, this would upload the Excel file
    const newResult: ResultFile = {
      id: Date.now().toString(),
      term: selectedTerm,
      year: selectedYear,
      fileName: `${selectedTerm.toLowerCase().replace(/\s+/g, '_')}_${selectedYear.split('-')[1]}.xlsx`,
      fileSize: '2.5 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      totalStudents: 0,
      uploader: 'Admin User'
    };

    setResults(prev => [newResult, ...prev]);
    setShowUploadModal(false);
    setSelectedTerm('');
    setSelectedYear('');
    
    alert(`Excel file for ${selectedTerm} ${selectedYear} has been uploaded successfully!`);
  };

  const handleUploadCancel = () => {
    setShowUploadModal(false);
    setSelectedTerm('');
    setSelectedYear('');
  };

  // Group results by year for better organization
  const groupedResults: GroupedResults = results.reduce((acc: GroupedResults, result) => {
    if (!acc[result.year]) {
      acc[result.year] = [];
    }
    acc[result.year].push(result);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Results Management</h1>
          <p className="text-gray-600">Manage Excel result files by term and academic year</p>
        </div>

        {/* Add New Button */}
        <div className="mb-8">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <AddIcon />
            Upload New Result Excel
          </button>
        </div>

        {/* Results Grid */}
        <div className="space-y-8">
          {Object.entries(groupedResults).map(([year, yearResults]) => (
            <div key={year} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Academic Year: {year}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {yearResults.map((result) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                      <div className="flex items-center justify-between mb-2">
                        <ExcelIcon className="text-white" />
                        <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                          Excel File
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{result.term}</h3>
                      <p className="text-blue-100 text-sm">{result.year}</p>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">File:</span>
                          <span className="text-gray-900 truncate">{result.fileName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Size:</span>
                          <span className="text-gray-900">{result.fileSize}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Students:</span>
                          <span className="text-gray-900">{result.totalStudents}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Uploaded:</span>
                          <span className="text-gray-900">{result.uploadedAt}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(result)}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          View Results
                        </button>
                        <button
                          onClick={() => handleDownload(result)}
                          className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 font-medium rounded-lg transition-colors duration-200"
                          title="Download Excel"
                        >
                          <DownloadIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(result)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ExcelIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No result files found</h3>
              <p className="text-gray-600 mb-6">
                No Excel result files have been uploaded yet. Upload your first result file to get started.
              </p>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Upload First Result File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Result Excel File</h3>
              <p className="text-gray-600 mb-6">Select term and year, then upload Excel file</p>
              
              <div className="space-y-4">
                {/* Term Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term/Test Type *
                  </label>
                  <select
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Term</option>
                    {testTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Year Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year *
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Year</option>
                    {academicYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excel File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                      <ExcelIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        Excel files only (.xlsx, .xls)
                      </p>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        id="file-upload"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    File should contain student results with columns: Roll No, Name, Subjects, Marks, etc.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleUploadCancel}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Upload Excel File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && resultToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Result File</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the result file for <span className="font-semibold">{resultToDelete.term} {resultToDelete.year}</span>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600">
                    This will permanently delete the Excel file and all associated results.
                  </p>
                </div>
              </div>
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
                  Delete File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}