"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Users,
  Database,
  CloudUpload,
  Eye,
  Clock,
  HardDrive,
  XCircle,
  AlertTriangle,
  Info,
  X,
  ChevronRight,
  FileCheck,
  Plus,
  Lock,
  UploadCloud,
  Loader2,
  BookOpen,
  School,
  UserCheck,
} from "lucide-react";

interface UploadInfo {
  id: string;
  filename: string;
  file_size: number;
  academic_year: string;
  class_name: string;
  total_records: number;
  uploaded_at: string;
}

interface ExistingFile {
  id: string;
  filename: string;
  uploadDate: string;
  recordCount: number;
  className: string;
  academicYear: string;
}

// Skeleton Loading Component
const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Upload Card Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>

        {/* File Upload Area Skeleton */}
        <div className="mb-6">
          <div className="h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300"></div>
        </div>

        {/* Upload Button Skeleton */}
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>

      {/* System Rules Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>

      {/* Existing Files Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AdminResultPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | "">(
    "",
  );
  const [uploadHistory, setUploadHistory] = useState<UploadInfo[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<UploadInfo | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [existingFileForExtractedData, setExistingFileForExtractedData] =
    useState<UploadInfo | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Load upload history on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUploadHistory().finally(() => {
        setPageLoading(false);
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const fetchUploadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch("/api/admin/result", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const result = await response.json();

      if (result.success && result.data?.uploads) {
        setUploadHistory(result.data.uploads);
      } else {
        setUploadHistory([]);
      }
    } catch (error) {
      setUploadHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadMessage("");
      setUploadStatus("");
      setShowSuccessModal(false);

      // Clear file input value to allow re-selecting same file
      e.target.value = "";
    }
  };

  const checkForExistingFile = (
    className: string,
    academicYear: string,
  ): UploadInfo | null => {
    if (!className || !academicYear) return null;

    const existing = uploadHistory.find(
      (upload) =>
        upload.academic_year === academicYear &&
        upload.class_name === className,
    );

    return existing || null;
  };

  const validateForm = () => {
    if (!file) {
      setUploadMessage("Please select a file first");
      setUploadStatus("error");
      return false;
    }

    // File type validation
    const allowedTypes = [".xlsx", ".xls", ".csv"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(`.${fileExtension}`)) {
      setUploadMessage(
        "Please select a valid Excel or CSV file (.xlsx, .xls, .csv)",
      );
      setUploadStatus("error");
      return false;
    }

    // File size validation (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setUploadMessage("File size should be less than 50MB");
      setUploadStatus("error");
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    // Add null check for file
    if (!file) {
      setUploadMessage("No file selected");
      setUploadStatus("error");
      return;
    }

    setIsUploading(true);
    setUploadMessage("");
    setUploadStatus("");
    setShowSuccessModal(false);
    setExistingFileForExtractedData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/result", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadMessage(result.message || "File uploaded successfully!");
        setUploadStatus("success");
        setFile(null);
        setSuccessData(result.data || null);

        // Refresh history
        await fetchUploadHistory();

        // Show success modal after a brief delay
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 500);
      } else {
        // Check if error is due to existing file
        if (response.status === 409 && result.data?.existingFile) {
          const existingFile = result.data.existingFile;
          setUploadMessage(result.message);
          setUploadStatus("error");

          // Create UploadInfo object from existing file data
          const existingUploadInfo: UploadInfo = {
            id: existingFile.id,
            filename: existingFile.filename,
            file_size: 0,
            academic_year: existingFile.academicYear,
            class_name: existingFile.className,
            total_records: existingFile.recordCount,
            uploaded_at: existingFile.uploadDate,
          };

          setExistingFileForExtractedData(existingUploadInfo);
        } else {
          setUploadMessage(
            result.message || "Upload failed. Please check the file format.",
          );
          setUploadStatus("error");
        }
      }
    } catch (error) {
      setUploadMessage("Network error. Please try again.");
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (upload: UploadInfo) => {
    setFileToDelete(upload);
    setDeleteConfirmation("");
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    if (deleteConfirmation !== "DELETE") {
      setUploadMessage('Please type "DELETE" to confirm deletion');
      setUploadStatus("error");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/result?id=${fileToDelete.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setUploadMessage(result.message || "File deleted successfully!");
        setUploadStatus("success");
        setShowDeleteModal(false);
        setFileToDelete(null);
        setDeleteConfirmation("");
        setExistingFileForExtractedData(null);

        // Refresh history
        await fetchUploadHistory();
      } else {
        setUploadMessage(result.message || "Failed to delete file.");
        setUploadStatus("error");
      }
    } catch (error) {
      setUploadMessage("Error deleting file. Please try again.");
      setUploadStatus("error");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      "Name,Father Name,Roll Number,Mathematics*,Science*,English*,Urdu*,Islamiat*,Pakistan Studies*,Computer Science*,Physics*,Total Marks,Obtain Marks,Percentage,Status,Grade,Academic Year,Class",
      "Ahmed Raza,Mohammad Raza,2024-SC-101,92,88,85,90,94,86,95,89,800,719,89.88,PASS,A+,2024-2025,Class 10",
      "Sana Mirza,Shahid Mirza,2024-SC-102,78,82,75,85,90,80,88,84,800,662,82.75,PASS,A,2024-2025,Class 10",
      'Note: Must include "Class" and "Academic Year" columns in your file',
      "Note: Subject columns should end with * (e.g., Mathematics*)",
    ].join("\n");

    const blob = new Blob([templateHeaders], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result_template.csv";
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
        verified: successData.processingStats.verificationCount,
      };
    }
    return {
      imported: 0,
      totalInFile: 0,
      failed: 0,
      verified: 0,
    };
  };

  const stats = getStats();

  // Check if file exists for current file
  const fileExistsForCurrentSelection = existingFileForExtractedData !== null;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            <FileText className="w-8 h-8 inline-block mr-2 text-blue-600" />
            Results Management System
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-500" />
            Single File System: Only one result file per academic year & class
            allowed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <UploadCloud className="w-5 h-5 text-blue-600" />
                  )}
                  {isUploading ? "Uploading Results..." : "Upload Results"}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    disabled={isUploading}
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>
              </div>

              {/* Single File Restriction Banner */}
              {fileExistsForCurrentSelection && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-yellow-800 mb-1">
                        File Already Exists for{" "}
                        {existingFileForExtractedData.class_name} -{" "}
                        {existingFileForExtractedData.academic_year}
                      </p>
                      <p className="text-yellow-700 mb-3">
                        A file named "
                        <span className="font-medium">
                          {existingFileForExtractedData.filename}
                        </span>
                        " already exists for this class and academic year. You
                        must delete it first before uploading a new one.
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4" />
                          <span>
                            Class: {existingFileForExtractedData.class_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Uploaded:{" "}
                            {formatDate(
                              existingFileForExtractedData.uploaded_at,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          <span>
                            {existingFileForExtractedData.total_records?.toLocaleString()}{" "}
                            students
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteClick(existingFileForExtractedData)
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      disabled={isUploading}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div className="mb-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    file
                      ? "border-blue-500 bg-blue-50 scale-[1.02]"
                      : fileExistsForCurrentSelection
                        ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                        : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
                  } ${isUploading || fileExistsForCurrentSelection ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    disabled={isUploading || fileExistsForCurrentSelection}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer block ${fileExistsForCurrentSelection || isUploading ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <div
                      className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        file
                          ? "bg-blue-100"
                          : fileExistsForCurrentSelection
                            ? "bg-gray-200"
                            : "bg-gray-100"
                      }`}
                    >
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      ) : file ? (
                        <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                      ) : fileExistsForCurrentSelection ? (
                        <Lock className="w-8 h-8 text-gray-400" />
                      ) : (
                        <Upload className="w-8 h-8 text-blue-600" />
                      )}
                    </div>
                    {isUploading ? (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          Uploading...
                        </p>
                        <p className="text-sm text-gray-500">
                          Please wait while we process your file
                        </p>
                      </div>
                    ) : file ? (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        {fileExistsForCurrentSelection && (
                          <p className="text-xs text-red-600 mt-2">
                            ⚠️ File already exists for this Class & Year
                          </p>
                        )}
                      </div>
                    ) : fileExistsForCurrentSelection ? (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          File Upload Disabled
                        </p>
                        <p className="text-sm text-gray-500">
                          Delete existing file to upload a new one
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          Drop your Excel file here or click to browse
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
                  <p className="mb-2 font-medium">
                    Required columns in your file:
                  </p>
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
                      <span>Class</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Academic Year</span>
                    </div>
                  </div>
                  <p className="text-xs text-red-600 mt-2">
                    Note: Class and Academic Year must be columns in your
                    CSV/Excel file
                  </p>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={isUploading || !file || fileExistsForCurrentSelection}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
                  isUploading || !file || fileExistsForCurrentSelection
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl"
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : fileExistsForCurrentSelection ? (
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
                <div
                  className={`mt-4 p-4 rounded-lg ${uploadStatus === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <div className="flex items-center gap-3">
                    {uploadStatus === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <p
                      className={
                        uploadStatus === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {uploadMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* System Rules & Instructions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                System Rules & Instructions
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2">
                    Single File System Rules:
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Lock className="w-3 h-3 text-blue-600" />
                      </div>
                      <span>
                        <span className="font-bold">
                          Only one file per class and academic year
                        </span>{" "}
                        combination is allowed
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <span>
                        Class and Academic Year are{" "}
                        <span className="font-bold">
                          automatically extracted
                        </span>{" "}
                        from your file
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 font-bold">3</span>
                      </div>
                      <span>
                        If a file exists,{" "}
                        <span className="font-bold">
                          file input and upload are disabled
                        </span>{" "}
                        until you delete the existing file
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-2">
                    File Requirements:
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>
                        Must include{" "}
                        <span className="font-bold">
                          "Class" and "Academic Year"
                        </span>{" "}
                        columns
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>
                        Include Name, Roll Number, Subjects, Marks, Percentage,
                        Grade, Status
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Maximum file size: 50MB</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Use template for correct format</span>
                    </li>
                  </ul>
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
                  disabled={isLoadingHistory || isUploading}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoadingHistory ? "animate-spin" : ""}`}
                  />
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
                  <p className="text-sm text-gray-400 mt-1">
                    Upload your first file to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadHistory.map((upload) => (
                    <div
                      key={upload.id}
                      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        existingFileForExtractedData?.id === upload.id
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              existingFileForExtractedData?.id === upload.id
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-bold text-gray-900 truncate"
                              title={upload.filename}
                            >
                              {upload.filename}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded ${
                                  existingFileForExtractedData?.academic_year ===
                                  upload.academic_year
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {upload.academic_year}
                              </span>
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded ${
                                  existingFileForExtractedData?.class_name ===
                                  upload.class_name
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {upload.class_name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(upload)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete file"
                          disabled={isUploading || isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Upload Date:</span>
                          <span className="font-medium">
                            {formatDate(upload.uploaded_at)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">File Size:</span>
                          <span className="font-medium">
                            {formatFileSize(upload.file_size)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Students:</span>
                          <span className="font-medium">
                            {upload.total_records?.toLocaleString()}
                          </span>
                        </div>
                        {existingFileForExtractedData?.id === upload.id && (
                          <div className="mt-2 pt-2 border-t border-blue-200">
                            <p className="text-blue-600 text-xs font-medium">
                              ⚠️ Currently selected - upload disabled
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
                    <h2 className="text-2xl font-bold text-gray-900">
                      Import Successful!
                    </h2>
                    <p className="text-gray-600">
                      File uploaded and processed successfully
                    </p>
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
                        {successData.fileInfo?.filename || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Academic Year
                      </span>
                      <span className="font-bold text-blue-600">
                        {successData.fileInfo?.academicYear || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Class</p>
                      <p className="font-bold text-gray-900">
                        {successData.fileInfo?.className || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">File Size</span>
                      <span className="font-medium text-gray-700">
                        {formatFileSize(successData.fileInfo?.size || 0)}
                      </span>
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
                    <div className="text-2xl font-bold text-green-700 mb-1">
                      {stats.totalInFile}
                    </div>
                    <div className="text-sm font-medium text-green-800">
                      Total in File
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700 mb-1">
                      {stats.imported}
                    </div>
                    <div className="text-sm font-medium text-blue-800">
                      Imported
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-amber-700 mb-1">
                      {stats.failed}
                    </div>
                    <div className="text-sm font-medium text-amber-800">
                      Failed
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-700 mb-1">
                      {stats.verified}
                    </div>
                    <div className="text-sm font-medium text-purple-800">
                      Verified
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-2">
                        System Status
                      </h4>
                      <p className="text-yellow-700 text-sm">
                        This file is now the only file for{" "}
                        {successData.fileInfo?.className || "N/A"} -{" "}
                        {successData.fileInfo?.academicYear || "N/A"}. To upload
                        a different file, you must delete this one first.
                      </p>
                      <p className="text-yellow-600 text-xs mt-2">
                        Students can search their results using their roll
                        number at:{" "}
                        <code className="bg-yellow-100 px-1 rounded">
                          /result
                        </code>
                      </p>
                    </div>
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
                  <h3 className="text-xl font-bold text-gray-900">
                    Delete File
                  </h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-medium mb-2">File to delete:</p>
                <p className="text-red-700 font-mono">
                  {fileToDelete.filename}
                </p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-red-600">
                    Year: {fileToDelete.academic_year}
                  </span>
                  <span className="text-red-600">
                    Class: {fileToDelete.class_name}
                  </span>
                  <span className="text-red-600">
                    Students:{" "}
                    {fileToDelete.total_records?.toLocaleString() || 0}
                  </span>
                </div>
                <p className="text-red-700 text-sm mt-3">
                  <span className="font-medium">Warning:</span> Deleting this
                  file will remove all student data for{" "}
                  {fileToDelete.class_name} - {fileToDelete.academic_year}.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type{" "}
                  <span className="font-mono font-bold text-red-600">
                    DELETE
                  </span>{" "}
                  to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="Type DELETE here"
                  autoFocus
                  disabled={isDeleting}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setFileToDelete(null);
                    setDeleteConfirmation("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || deleteConfirmation !== "DELETE"}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    deleteConfirmation === "DELETE"
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    "Delete Permanently"
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
