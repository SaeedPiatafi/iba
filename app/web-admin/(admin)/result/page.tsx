'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Upload, Download, FileSpreadsheet, Trash2, RefreshCw, 
  CheckCircle, AlertCircle, Calendar, FileText, Users,
  Database, CloudUpload, Eye, Clock, HardDrive,
  XCircle, AlertTriangle, Info, X, ChevronRight, FileCheck,
  Plus, Lock, UploadCloud
} from 'lucide-react';

interface UploadInfo {
  id?: number;
  filename: string;
  file_size: number;
  academic_year: string;
  total_records: number;
  uploaded_at: string;
  storage_path?: string;
  storage_url?: string;
}

interface ImportResponse {
  success: boolean;
  message: string;
  data?: {
    fileInfo?: {
      filename: string;
      size: number;
      storagePath: string;
      storageUrl?: string;
      academicYear: string;
    };
    processingStats?: {
      totalRecordsInFile: number;
      successfullyInserted: number;
      failed: number;
      verificationCount: number;
      errorCount?: number;
    };
    errors?: string[];
    existingFile?: {
      filename: string;
      uploadDate: string;
      recordCount: number;
    };
  };
  timestamp?: string;
}

interface DeleteResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp?: string;
}

export default function AdminResultPage() {
  const [file, setFile] = useState<File | null>(null);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | ''>('');
  const [uploadHistory, setUploadHistory] = useState<UploadInfo[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<UploadInfo | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<ImportResponse['data'] | null>(null);
  const [existingFileForYear, setExistingFileForYear] = useState<UploadInfo | null>(null);
  const [systemStats, setSystemStats] = useState({
    totalStudents: 0,
    totalUploads: 0,
    academicYears: [] as string[],
    currentYear: '2024-2025'
  });

  // Load upload history and system stats on component mount
  useEffect(() => {
    fetchUploadHistory();
  }, []);

  // Check for existing file when academic year changes
  useEffect(() => {
    if (uploadHistory.length > 0) {
      const existing = uploadHistory.find(upload => upload.academic_year === academicYear);
      setExistingFileForYear(existing || null);
    } else {
      setExistingFileForYear(null);
    }
  }, [academicYear, uploadHistory]);

  const fetchUploadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch('/api/admin/result');
      const result = await response.json();
      
      console.log('Upload history response:', result);
      
      if (result.success) {
        if (result.data && Array.isArray(result.data.uploads)) {
          setUploadHistory(result.data.uploads);
        }
        
        if (result.data?.statistics) {
          setSystemStats({
            totalStudents: result.data.statistics.totalStudents || 0,
            totalUploads: result.data.statistics.totalUploads || 0,
            academicYears: result.data.statistics.academicYears || [],
            currentYear: result.data.currentYear || '2024-2025'
          });
        }
      } else {
        setUploadHistory([]);
      }
    } catch (error) {
      console.error('Error fetching upload history:', error);
      setUploadHistory([]);
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
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a file first');
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
      console.log('Upload response:', result);

      if (result.success) {
        const successMsg = result.message || 'File uploaded successfully!';
        setUploadMessage(successMsg);
        setUploadStatus('success');
        setFile(null);
        setSuccessData(result.data || null);
        
        // Clear file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Refresh history
        await fetchUploadHistory();
        
        // Show success modal after a brief delay
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 500);
      } else {
        // Check if error is due to existing file
        if (result.data?.existingFile) {
          setUploadMessage(result.message);
          setUploadStatus('error');
          setExistingFileForYear(result.data.existingFile);
        } else {
          setUploadMessage(result.message || 'Upload failed. Please check the file format.');
          setUploadStatus('error');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage('Network error. Please try again.');
      setUploadStatus('error');
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
      const response = await fetch(`/api/admin/result?year=${encodeURIComponent(fileToDelete.academic_year)}`, {
        method: 'DELETE',
      });

      const result: DeleteResponse = await response.json();
      console.log('Delete response:', result);

      if (result.success) {
        setUploadMessage(result.message || 'File deleted successfully!');
        setUploadStatus('success');
        setShowDeleteModal(false);
        setFileToDelete(null);
        setDeleteConfirmation('');
        setExistingFileForYear(null);
        
        // Refresh history
        await fetchUploadHistory();
      } else {
        setUploadMessage(result.message || 'Failed to delete file.');
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setUploadMessage('Error deleting file. Please try again.');
      setUploadStatus('error');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
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

  // Get statistics for display
  const getStats = () => {
    if (successData?.processingStats) {
      return {
        imported: successData.processingStats.successfullyInserted,
        totalInFile: successData.processingStats.totalRecordsInFile,
        failed: successData.processingStats.failed,
        verified: successData.processingStats.verificationCount
      };
    }
    return {
      imported: 0,
      totalInFile: 0,
      failed: 0,
      verified: 0
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Results Management System
          </h1>
          <p className="text-gray-600">
            Single File System: Only one result file per academic year allowed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-600" />
                  Upload Results
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>
              </div>

              {/* Single File Restriction Banner */}
              {existingFileForYear && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-yellow-800 mb-1">
                        File Already Exists for {academicYear}
                      </p>
                      <p className="text-yellow-700 mb-3">
                        A file named "<span className="font-medium">{existingFileForYear.filename}</span>" already exists for this academic year. 
                        You must delete it first before uploading a new one.
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Uploaded: {formatDate(existingFileForYear.uploaded_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{existingFileForYear.total_records?.toLocaleString()} students</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(existingFileForYear)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Academic Year Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Academic Year
                  </span>
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
                  disabled={isUploading || isDeleting}
                >
                  {systemStats.academicYears.length > 0 ? (
                    systemStats.academicYears.map(year => (
                      <option key={year} value={year}>
                        {year} {year === systemStats.currentYear ? '(Current)' : ''}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="2026-2027">2026-2027</option>
                    </>
                  )}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Only one file allowed per academic year
                </p>
              </div>

              {/* File Upload Area */}
              <div className="mb-6">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  file ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 
                  existingFileForYear ? 'border-gray-300 bg-gray-100 cursor-not-allowed' : 
                  'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
                }`}>
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    disabled={isUploading || existingFileForYear !== null}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className={`cursor-pointer block ${existingFileForYear ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      file ? 'bg-blue-100' : existingFileForYear ? 'bg-gray-200' : 'bg-gray-100'
                    }`}>
                      {file ? (
                        <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                      ) : existingFileForYear ? (
                        <Lock className="w-8 h-8 text-gray-400" />
                      ) : (
                        <Upload className={`w-8 h-8 ${isUploading ? 'text-gray-400' : 'text-blue-600'}`} />
                      )}
                    </div>
                    {file ? (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    ) : existingFileForYear ? (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">File Upload Locked</p>
                        <p className="text-sm text-gray-500">
                          Delete existing file to upload a new one
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          {isUploading ? 'Uploading...' : 'Drop your Excel file here or click to browse'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports .xlsx, .xls, .csv files (max 50MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {/* File Requirements */}
                <div className="mt-4 text-sm text-gray-600">
                  <p className="mb-2 font-medium">Required columns:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Name</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Roll Number</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>All Subjects</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Academic Year</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={isUploading || !file || existingFileForYear !== null}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
                  isUploading || !file || existingFileForYear
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : existingFileForYear ? (
                  <>
                    <Lock className="w-5 h-5" />
                    Delete Existing File First
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

            {/* System Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                System Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-lg font-bold text-gray-900">
                        {systemStats.totalStudents.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Files</p>
                      <p className="text-lg font-bold text-gray-900">
                        {systemStats.totalUploads}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Academic Years</p>
                      <p className="text-lg font-bold text-gray-900">
                        {systemStats.academicYears.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <HardDrive className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Year</p>
                      <p className="text-lg font-bold text-gray-900">
                        {systemStats.currentYear}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Existing Files */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                  Existing Files
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
                  <p className="text-gray-500 mt-2">Loading files...</p>
                </div>
              ) : uploadHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No files uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">Upload your first file to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadHistory.map((upload) => (
                    <div 
                      key={upload.id || upload.filename} 
                      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        upload.academic_year === academicYear 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            upload.academic_year === academicYear 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate" title={upload.filename}>
                              {upload.filename}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                upload.academic_year === academicYear 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {upload.academic_year}
                              </span>
                              <span className="text-xs text-gray-500">
                                {upload.total_records?.toLocaleString()} students
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(upload)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Upload Date:</span>
                          <span className="font-medium">{formatDate(upload.uploaded_at)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">File Size:</span>
                          <span className="font-medium">{formatFileSize(upload.file_size)}</span>
                        </div>
                        {upload.academic_year === academicYear && (
                          <div className="mt-2 pt-2 border-t border-blue-200">
                            <p className="text-blue-600 text-xs font-medium">
                              Currently selected year
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <h3 className="font-medium text-gray-900 mb-3">Single File System Rules:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-3 h-3 text-blue-600" />
                  </div>
                  <span><span className="font-bold">Only one file per academic year</span> is allowed in the system</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <span>To upload a new file, you must <span className="font-bold text-red-600">delete</span> the existing file first</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <span>Each file can contain unlimited student records (no 100 limit)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Technical Details:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Files are stored in secure cloud storage with automatic backup</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Supports large Excel files (up to 50MB, unlimited rows)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Automatic grade calculation and result processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Real-time data verification and error reporting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
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
                      <p className="font-bold text-gray-900 truncate">
                        {successData.fileInfo?.filename || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Academic Year</span>
                      <span className="font-bold text-blue-600">{successData.fileInfo?.academicYear || academicYear}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">File Size</p>
                      <p className="font-bold text-gray-900">{formatFileSize(successData.fileInfo?.size || 0)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Storage</span>
                      <span className="font-medium text-gray-700">Cloud Saved ✓</span>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-700 mb-1">{stats.totalInFile}</div>
                    <div className="text-sm font-medium text-green-800">Total in File</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700 mb-1">{stats.imported}</div>
                    <div className="text-sm font-medium text-blue-800">Imported</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-amber-700 mb-1">{stats.failed}</div>
                    <div className="text-sm font-medium text-amber-800">Failed</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-700 mb-1">{stats.verified}</div>
                    <div className="text-sm font-medium text-purple-800">Verified</div>
                  </div>
                </div>

                {/* Stats Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">Processing Details:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total students in file:</span>
                      <span className="font-medium">{stats.totalInFile}</span>
                    </li>
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Successfully imported:</span>
                      <span className="font-medium text-green-600">{stats.imported}</span>
                    </li>
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Failed to import:</span>
                      <span className="font-medium text-red-600">{stats.failed}</span>
                    </li>
                    <li className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Verified in database:</span>
                      <span className="font-medium text-blue-600">{stats.verified}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-yellow-800 mb-2">System Status</h4>
                    <p className="text-yellow-700 text-sm">
                      This file is now the only file for academic year {successData.fileInfo?.academicYear || academicYear}.
                      To upload a different file, you must delete this one first.
                    </p>
                    <p className="text-yellow-600 text-xs mt-2">
                      Students can search their results using their roll number at: <code className="bg-yellow-100 px-1 rounded">/result</code>
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
                  Continue to Dashboard
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
                  <span className="text-red-600">Year: {fileToDelete.academic_year}</span>
                  <span className="text-red-600">Students: {fileToDelete.total_records?.toLocaleString() || 0}</span>
                </div>
                <p className="text-red-700 text-sm mt-3">
                  <span className="font-medium">Warning:</span> Deleting this file will remove all student data for academic year {fileToDelete.academic_year}.
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
    </div>
  );
}