'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Upload, Download, FileSpreadsheet, Trash2, RefreshCw, 
  CheckCircle, AlertCircle, Calendar, FileText, Users,
  Database, CloudUpload, Eye, Clock, HardDrive,
  XCircle, AlertTriangle, Info, X, ChevronRight, FileCheck
} from 'lucide-react';

interface UploadInfo {
  filename: string;
  size: number;
  year: string;
  uploadDate: string;
  totalStudents: number;
  id?: string;
}

interface UploadHistory {
  uploads: UploadInfo[];
}

interface ImportResponse {
  success: boolean;
  message: string;
  data?: {
    totalImported: number;
    totalNow: number;
    duplicatesRemoved: number;
    uploadInfo: UploadInfo;
  };
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export default function AdminResultPage() {
  const [file, setFile] = useState<File | null>(null);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | ''>('');
  const [uploadHistory, setUploadHistory] = useState<UploadInfo[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<UploadInfo | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileExists, setFileExists] = useState(false);
  const [existingFileInfo, setExistingFileInfo] = useState<UploadInfo | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<ImportResponse['data'] | null>(null);

  // Load upload history on component mount
  useEffect(() => {
    fetchUploadHistory();
  }, []);

  // Check if any file exists
  useEffect(() => {
    if (uploadHistory.length > 0) {
      setFileExists(true);
      setExistingFileInfo(uploadHistory[0]); // Show the existing file
    } else {
      setFileExists(false);
      setExistingFileInfo(null);
    }
  }, [uploadHistory]);

  const fetchUploadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch('/api/admin/result');
      const result = await response.json();
      
      if (result.success && result.data?.uploads) {
        setUploadHistory(result.data.uploads);
      }
    } catch (error) {
      console.error('Error fetching upload history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadMessage('');
      setUploadStatus('');
      setShowSuccessModal(false);
      
      // Preview first 5 rows
      previewExcelFile(selectedFile);
    }
  };

  const previewExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (data) {
          setPreviewData([
            { fileName: file.name, size: formatFileSize(file.size) }
          ]);
          setShowPreview(true);
        }
      } catch (error) {
        console.error('Error previewing file:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a file first');
      setUploadStatus('error');
      return;
    }

    // Check if file already exists (only one file allowed)
    if (fileExists) {
      setUploadMessage(`A file already exists in the system. Please delete it first before uploading a new file.`);
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadMessage('');
    setUploadStatus('');
    setShowSuccessModal(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('academicYear', academicYear);

    try {
      const response = await fetch('/api/admin/result', {
        method: 'POST',
        body: formData,
      });

      const result: ImportResponse = await response.json();

      if (result.success) {
        const successMsg = `${result.message}`;
        setUploadMessage(successMsg);
        setUploadStatus('success');
        setFile(null);
        setFileExists(true);
        setExistingFileInfo(result.data?.uploadInfo || null);
        setSuccessData(result.data || null);
        
        // Clear file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Refresh history
        fetchUploadHistory();
        
        // Show success modal after a brief delay
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 300);
      } else {
        setUploadMessage(result.message || 'Upload failed');
        setUploadStatus('error');
      }
    } catch (error) {
      setUploadMessage('Network error. Please try again.');
      setUploadStatus('error');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (upload: UploadInfo) => {
    setFileToDelete(upload);
    setDeleteConfirmation('');
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    
    if (deleteConfirmation !== 'DELETE') {
      setUploadMessage('Please type "DELETE" to confirm deletion');
      setUploadStatus('error');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/result?filename=${encodeURIComponent(fileToDelete.filename)}&year=${fileToDelete.year}`, {
        method: 'DELETE',
      });

      const result: DeleteResponse = await response.json();

      if (result.success) {
        // Remove from local state
        setUploadHistory([]);
        setFileExists(false);
        setExistingFileInfo(null);
        setUploadMessage('File deleted successfully! You can now upload a new file.');
        setUploadStatus('success');
        setShowSuccessModal(false);
      } else {
        setUploadMessage(`Failed to delete file: ${result.message}`);
        setUploadStatus('error');
      }
    } catch (error) {
      setUploadMessage('Error deleting file. Please try again.');
      setUploadStatus('error');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setFileToDelete(null);
      setDeleteConfirmation('');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      'Name,Father Name,Roll Number,Mathematics,Science,English,Urdu,Islamiat,Pakistan Studies,Computer Science,Physics,Total Marks,Max Total Marks,Percentage,Status,Grade,Academic Year',
      'Ahmed Raza,Mohammad Raza,2024-SC-101,92,88,85,90,94,86,95,89,719,800,89.88,PASS,A+,2024-2025',
      'Sana Mirza,Shahid Mirza,2024-SC-102,78,82,75,85,90,80,88,84,662,800,82.75,PASS,A,2024-2025',
      'Note: Use - (dash) for subjects not offered in class, e.g., -, -, 85, 90, 94, 86, 95, 89'
    ].join('\n');
    
    const blob = new Blob([templateHeaders], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Results Management
          </h1>
          <p className="text-gray-600">
            Upload Excel files containing student results (Only one file allowed at a time)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CloudUpload className="w-5 h-5 text-blue-600" />
                  Upload Excel File
                </h2>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>

              {/* Single File Restriction Notice */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 mb-1">
                      Single File System
                    </p>
                    <p className="text-blue-700 text-sm">
                      Only <span className="font-bold">one result file</span> is allowed at a time in the system. 
                      To upload a new file, you must first delete the existing file.
                    </p>
                  </div>
                </div>
              </div>

              {/* File Exists Warning */}
              {fileExists && existingFileInfo && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 mb-1">
                        File Already Exists
                      </p>
                      <p className="text-yellow-700 text-sm mb-2">
                        A result file already exists in the system. You must delete it first before uploading a new file.
                      </p>
                      <div className="bg-yellow-100 p-3 rounded-md">
                        <p className="text-yellow-800 font-medium">Existing File:</p>
                        <p className="text-yellow-700">{existingFileInfo.filename}</p>
                        <div className="flex gap-4 mt-1 text-sm">
                          <span className="text-yellow-600">Year: {existingFileInfo.year}</span>
                          <span className="text-yellow-600">Students: {existingFileInfo.totalStudents}</span>
                          <span className="text-yellow-600">Uploaded: {formatDate(existingFileInfo.uploadDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div className="mb-6">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  fileExists 
                    ? 'border-yellow-300 bg-yellow-50 cursor-not-allowed' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}>
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    disabled={fileExists}
                  />
                  <label htmlFor="file-upload" className={`cursor-pointer block ${fileExists ? 'cursor-not-allowed' : ''}`}>
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      fileExists ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {file ? (
                        <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                      ) : (
                        <Upload className={`w-8 h-8 ${fileExists ? 'text-yellow-600' : 'text-blue-600'}`} />
                      )}
                    </div>
                    {file ? (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    ) : (
                      <div>
                        <p className={`font-medium mb-1 ${
                          fileExists ? 'text-yellow-800' : 'text-gray-900'
                        }`}>
                          {fileExists ? 'File exists in system' : 'Drop your Excel file here or click to browse'}
                        </p>
                        <p className={`text-sm ${
                          fileExists ? 'text-yellow-700' : 'text-gray-500'
                        }`}>
                          {fileExists ? 'Delete existing file first to upload new' : 'Supports .xlsx, .xls, .csv files (max 10MB)'}
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {/* File Requirements */}
                <div className="mt-4 text-sm text-gray-600">
                  <p className="mb-2 font-medium">Required columns:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Name</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Father Name</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Roll Number</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Mathematics</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Science</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>All Subjects</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium mb-1">Note about subjects:</p>
                    <p className="text-blue-700 text-sm">
                      If a subject is not offered in a class, use <code className="bg-blue-100 px-1 rounded">-</code> (dash) for that subject. 
                      The system will exclude it from calculations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Year Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Academic Year
                  </span>
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={fileExists}
                >
                  <option value="2023-2024">2023-2024</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                </select>
                {fileExists && (
                  <p className="text-yellow-600 text-sm mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Cannot change year while file exists
                  </p>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={isUploading || !file || fileExists}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
                  fileExists
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : fileExists ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    File Exists - Cannot Upload
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Results
                  </>
                )}
              </button>

              {/* Upload Status Message */}
              {uploadMessage && (
                <div className={`mt-4 p-4 rounded-lg ${uploadStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-3">
                    {uploadStatus === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <p className={uploadStatus === 'success' ? 'text-green-700' : 'text-red-700'}>
                      {uploadMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                System Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${fileExists ? 'bg-yellow-50' : 'bg-green-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${fileExists ? 'bg-yellow-100' : 'bg-green-100'}`}>
                      <FileText className={`w-5 h-5 ${fileExists ? 'text-yellow-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">System Status</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {fileExists ? 'File Exists' : 'Ready to Upload'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {existingFileInfo ? existingFileInfo.totalStudents : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <HardDrive className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">File Size</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {existingFileInfo ? formatFileSize(existingFileInfo.size) : '0 KB'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Current File Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  Current File
                </h2>
                <button
                  onClick={fetchUploadHistory}
                  disabled={isLoadingHistory}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {isLoadingHistory ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading...</p>
                </div>
              ) : !fileExists ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No file uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">Upload your first file to get started</p>
                </div>
              ) : existingFileInfo ? (
                <div className="space-y-6">
                  {/* Current File Card */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate" title={existingFileInfo.filename}>
                            {existingFileInfo.filename}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                              {existingFileInfo.year}
                            </span>
                            <span className="text-xs text-gray-500">
                              {existingFileInfo.totalStudents} students
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(existingFileInfo)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Upload Date:
                        </span>
                        <span className="font-medium">{formatDate(existingFileInfo.uploadDate)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">File Size:</span>
                        <span className="font-medium">{formatFileSize(existingFileInfo.size)}</span>
                      </div>
                    </div>

                    {/* Warning Message */}
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-700 text-sm">
                        <span className="font-medium">Note:</span> Only one file is allowed. Delete this file to upload a new one.
                      </p>
                    </div>
                  </div>

                  {/* Delete Section */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Delete File
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Deleting this file will remove all student data from the system. This action cannot be undone.
                    </p>
                    <button
                      onClick={() => handleDeleteClick(existingFileInfo)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Current File
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            System Rules & Instructions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">System Rules:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 font-bold">1</span>
                  </div>
                  <span><span className="font-bold">Only one file</span> is allowed in the system at any time</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 font-bold">2</span>
                  </div>
                  <span>To upload a new file, you <span className="font-bold">must delete</span> the existing file first</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <span>File can be for any academic year (2023-2024, 2024-2025, etc.)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">File Requirements:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>File must be in Excel (.xlsx, .xls) or CSV format</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Maximum file size: 10MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Use <code className="bg-gray-100 px-1 rounded">-</code> (dash) for subjects not offered</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>First row must contain column headers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal Popup */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    <FileCheck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Import Successful!</h2>
                    <p className="text-gray-600">File uploaded and processed successfully</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* File Details */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  File Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">File Name</p>
                      <p className="font-bold text-gray-900 truncate" title={successData.uploadInfo.filename}>
                        {successData.uploadInfo.filename}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Academic Year</span>
                      <span className="font-bold text-blue-600">{successData.uploadInfo.year}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">File Size</p>
                      <p className="font-bold text-gray-900">{formatFileSize(successData.uploadInfo.size)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Upload Date</span>
                      <span className="font-medium text-gray-700">{formatDate(successData.uploadInfo.uploadDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Import Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-green-600" />
                  Import Summary
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-green-700 mb-2">{successData.totalImported}</div>
                    <div className="text-sm font-medium text-green-800">Students Imported</div>
                    <div className="text-xs text-green-600 mt-1">From uploaded file</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-blue-700 mb-2">{successData.totalNow}</div>
                    <div className="text-sm font-medium text-blue-800">Total in Database</div>
                    <div className="text-xs text-blue-600 mt-1">After processing</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-amber-700 mb-2">{successData.duplicatesRemoved}</div>
                    <div className="text-sm font-medium text-amber-800">Duplicates Removed</div>
                    <div className="text-xs text-amber-600 mt-1">Automatically filtered</div>
                  </div>
                </div>

                {/* Stats Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">Processing Details:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total rows in file:</span>
                      <span className="font-medium">{successData.totalImported}</span>
                    </li>
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duplicate entries found:</span>
                      <span className="font-medium">{successData.duplicatesRemoved}</span>
                    </li>
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Unique students added:</span>
                      <span className="font-medium">{successData.totalNow}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-yellow-800 mb-2">Important Notice</h4>
                    <p className="text-yellow-700 text-sm">
                      Only <span className="font-bold">one file</span> is allowed at a time in the system. 
                      To upload a different file, you must first delete this file from the system.
                    </p>
                    <p className="text-yellow-600 text-xs mt-2">
                      You can delete this file from the "Current File" section on the right.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Continue
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    handleDeleteClick(successData.uploadInfo);
                  }}
                  className="flex-1 px-6 py-3 border border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete This File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && fileToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete File</h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-medium mb-2">File to delete:</p>
                <p className="text-red-700 font-mono">{fileToDelete.filename}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-red-600">Year: {fileToDelete.year}</span>
                  <span className="text-red-600">Students: {fileToDelete.totalStudents}</span>
                </div>
                <p className="text-red-700 text-sm mt-3">
                  <span className="font-medium">Warning:</span> Deleting this file will remove all student data from the system.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="Type DELETE here"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setFileToDelete(null);
                    setDeleteConfirmation('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || deleteConfirmation !== 'DELETE'}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    deleteConfirmation === 'DELETE'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete Permanently'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Animation for upload button */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        /* Modal animation */
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-enter {
          animation: modalFadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}