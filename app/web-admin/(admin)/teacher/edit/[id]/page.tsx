"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

// Type definitions
interface TeacherData {
  id: string;
  name: string;
  subject: string;
  email: string;
  classLevels: string[];
  image: string;
  education: string[];
  experience: string;
  teachingExperience: string[];
  bio: string;
  achievements: string[];
  teachingPhilosophy: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error" | "";
}

// Allowed file types for upload
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EditTeacherPage = () => {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialTeacherData: TeacherData = {
    id: "",
    name: "",
    subject: "",
    email: "",
    classLevels: [],
    image: "",
    education: [""],
    experience: "",
    teachingExperience: [""],
    bio: "",
    achievements: [""],
    teachingPhilosophy: "",
  };

  const [teacherData, setTeacherData] = useState<TeacherData>(initialTeacherData);
  const [originalTeacherData, setOriginalTeacherData] = useState<TeacherData>(initialTeacherData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedClassLevels, setSelectedClassLevels] = useState<string[]>([]);
  const [originalClassLevels, setOriginalClassLevels] = useState<string[]>([]);
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: "",
    type: "",
  });
  
  // New state for file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const classLevelOptions = [
    "Primary Teacher (1-5)",
    "Secondary Teacher (6-8)",
    "Higher Secondary Teacher (9-10)",
    "Senior Secondary Teacher (11-12)",
  ];

  // Show notification
  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Function to safely parse class levels from API response
  const parseClassLevels = (classLevels: any): string[] => {
    if (!classLevels) return [];
    
    if (Array.isArray(classLevels)) {
      return classLevels.filter(level => 
        typeof level === 'string' && classLevelOptions.includes(level)
      );
    }
    
    if (typeof classLevels === 'string') {
      try {
        const parsed = JSON.parse(classLevels);
        if (Array.isArray(parsed)) {
          return parsed.filter(level => 
            typeof level === 'string' && classLevelOptions.includes(level)
          );
        }
      } catch (error) {
        if (classLevelOptions.includes(classLevels)) {
          return [classLevels];
        }
      }
    }
    
    return [];
  };

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!teacherId) {
        showNotification("Teacher ID is missing", "error");
        setIsLoading(false);
        setTimeout(() => router.push("/web-admin/teacher"), 2000);
        return;
      }

      try {
        setIsLoading(true);

        const response = await fetch(`/api/admin/teacher?id=${teacherId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch teacher: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to load teacher");
        }

        if (!result.data) {
          throw new Error("Teacher not found");
        }

        // Transform API data
        const teacher = result.data;
        const transformedTeacher: TeacherData = {
          id: teacher.id || "",
          name: teacher.name || "",
          subject: teacher.subject || "",
          email: teacher.email || "",
          classLevels: parseClassLevels(teacher.classLevels || teacher.class_levels),
          image: teacher.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          education: Array.isArray(teacher.education) ? teacher.education : (teacher.education ? [teacher.education] : [""]),
          experience: teacher.experience || "",
          teachingExperience: Array.isArray(teacher.teachingExperience) ? teacher.teachingExperience : 
                           Array.isArray(teacher.teaching_experience) ? teacher.teaching_experience : [""],
          bio: teacher.bio || "",
          achievements: Array.isArray(teacher.achievements) ? teacher.achievements : [""],
          teachingPhilosophy: teacher.teachingPhilosophy || teacher.teaching_philosophy || "",
        };


        // Set the data
        setTeacherData(transformedTeacher);
        setOriginalTeacherData(transformedTeacher);
        setSelectedClassLevels(transformedTeacher.classLevels);
        setOriginalClassLevels(transformedTeacher.classLevels);
        
        // Set image preview
        if (transformedTeacher.image) {
          setImagePreview(transformedTeacher.image);
        }
        
        setIsLoading(false);
      } catch (error) {
        showNotification(
          error instanceof Error ? error.message : "Failed to load teacher data",
          "error"
        );
        setIsLoading(false);
        setTimeout(() => router.push("/web-admin/teacher"), 2000);
      }
    };

    fetchTeacherData();
  }, [teacherId, router]);

  // Sync selectedClassLevels with teacherData.classLevels
  useEffect(() => {
    setTeacherData(prev => ({
      ...prev,
      classLevels: selectedClassLevels
    }));
  }, [selectedClassLevels]);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      showNotification(`Invalid file type. Allowed types: JPEG, JPG, PNG, WebP, GIF, SVG`, 'error');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      showNotification(`File too large. Maximum size is 5MB`, 'error');
      return;
    }

    setSelectedFile(file);
    setTeacherData(prev => ({ ...prev, image: '' }));
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle file from drag and drop
  const handleFileFromDragDrop = (file: File) => {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      showNotification(`Invalid file type. Allowed types: JPEG, JPG, PNG, WebP, GIF, SVG`, 'error');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      showNotification(`File too large. Maximum size is 5MB`, 'error');
      return;
    }

    setSelectedFile(file);
    setTeacherData(prev => ({ ...prev, image: '' }));
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop - FIXED VERSION
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileFromDragDrop(file);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(teacherData.image || ''); // Reset to original image
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove image URL
  const removeImageUrl = () => {
    setTeacherData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
    showNotification('Image removed', 'success');
  };

  // Check if form has changes
  const hasChanges = (): boolean => {
    // Check basic fields
    const basicFieldsChanged = [
      "name",
      "subject",
      "experience",
      "bio",
      "teachingPhilosophy",
      "email",
    ].some((field) => {
      const key = field as keyof TeacherData;
      return teacherData[key] !== originalTeacherData[key];
    });

    // Check image changes
    const imageChanged = selectedFile !== null || 
      teacherData.image !== originalTeacherData.image;

    // Check array fields
    const educationChanged =
      JSON.stringify(teacherData.education.filter((e) => e.trim() !== "")) !==
      JSON.stringify(originalTeacherData.education.filter((e) => e.trim() !== ""));

    const teachingExperienceChanged =
      JSON.stringify(teacherData.teachingExperience.filter((e) => e.trim() !== "")) !==
      JSON.stringify(originalTeacherData.teachingExperience.filter((e) => e.trim() !== ""));

    const achievementsChanged =
      JSON.stringify(teacherData.achievements.filter((e) => e.trim() !== "")) !==
      JSON.stringify(originalTeacherData.achievements.filter((e) => e.trim() !== ""));

    // Check class levels
    const classLevelsChanged =
      JSON.stringify([...selectedClassLevels].sort()) !==
      JSON.stringify([...originalClassLevels].sort());

    return (
      basicFieldsChanged ||
      imageChanged ||
      educationChanged ||
      teachingExperienceChanged ||
      achievementsChanged ||
      classLevelsChanged
    );
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'image' && value.trim() !== '') {
      // Clear file selection when URL is entered
      setSelectedFile(null);
      setImagePreview(value.trim());
    }
    
    setTeacherData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle array input change
  const handleArrayInputChange = (field: keyof TeacherData, index: number, value: string) => {
    const newArray = [...(teacherData[field] as string[])];
    newArray[index] = value;
    setTeacherData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  // Add array field
  const addArrayField = (field: keyof TeacherData) => {
    setTeacherData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }));
  };

  // Remove array field
  const removeArrayField = (field: keyof TeacherData, index: number) => {
    const fieldArray = teacherData[field] as string[];
    if (fieldArray.length <= 1) return; // Keep at least one field

    const newArray = fieldArray.filter((_, i) => i !== index);
    setTeacherData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  // Handle class level toggle
  const handleClassLevelToggle = (level: string) => {
    setSelectedClassLevels((prev) => {
      if (prev.includes(level)) {
        return prev.filter((l) => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!teacherData.name.trim()) {
      showNotification("Please enter teacher name", "error");
      return false;
    }
    if (!teacherData.subject.trim()) {
      showNotification("Please enter subject", "error");
      return false;
    }
    if (selectedClassLevels.length === 0) {
      showNotification("Please select at least one class level", "error");
      return false;
    }
    if (!teacherData.email.trim()) {
      showNotification("Please enter email address", "error");
      return false;
    }
    if (!teacherData.experience.trim()) {
      showNotification("Please enter years of experience", "error");
      return false;
    }
    if (!teacherData.bio.trim()) {
      showNotification("Please enter professional biography", "error");
      return false;
    }
    if (!teacherData.teachingPhilosophy.trim()) {
      showNotification("Please enter teaching philosophy", "error");
      return false;
    }

    // Validate education array has at least one non-empty entry
    const validEducation = teacherData.education.filter((edu) => edu.trim() !== "");
    if (validEducation.length === 0) {
      showNotification("Please enter at least one education background", "error");
      return false;
    }

    return true;
  };

  // Handle form submission (Update) - Updated for file upload
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if there are any changes
    if (!hasChanges()) {
      showNotification("No changes detected to update", "error");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Create FormData for file upload
    const formData = new FormData();
    
    // Add teacher data to FormData
    formData.append('id', teacherData.id);
    formData.append('name', teacherData.name.trim());
    formData.append('subject', teacherData.subject.trim());
    formData.append('email', teacherData.email.trim());
    formData.append('classLevels', JSON.stringify(selectedClassLevels));
    formData.append('experience', teacherData.experience.trim());
    formData.append('education', JSON.stringify(teacherData.education.filter(edu => edu.trim() !== '')));
    formData.append('teachingExperience', JSON.stringify(teacherData.teachingExperience.filter(exp => exp.trim() !== '')));
    formData.append('bio', teacherData.bio.trim());
    formData.append('achievements', JSON.stringify(teacherData.achievements.filter(ach => ach.trim() !== '')));
    formData.append('teachingPhilosophy', teacherData.teachingPhilosophy.trim());
    
    // Add image file or URL
    if (selectedFile) {
      formData.append('image', selectedFile);
    } else if (teacherData.image.trim()) {
      formData.append('image', teacherData.image.trim());
    }

    try {

      // Call the update API with FormData
      const response = await fetch("/api/admin/teacher", {
        method: "PUT",
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update teacher");
      }

      // Update original data after successful submission
      setOriginalTeacherData(teacherData);
      setOriginalClassLevels([...selectedClassLevels]);
      // Reset file selection after successful update
      if (selectedFile) {
        setSelectedFile(null);
      }

      showNotification("Teacher updated successfully!", "success");

      // Refresh the page data
      setTimeout(() => {
        router.refresh();
        router.push("/web-admin/teacher");
      }, 1500);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to update teacher. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges()) {
      if (
        window.confirm(
          "Are you sure you want to cancel? All unsaved changes will be lost."
        )
      ) {
        router.push("/web-admin/teacher");
      }
    } else {
      router.push("/web-admin/teacher");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${teacherData.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Call the delete API
      const response = await fetch(`/api/admin/teacher?id=${teacherData.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete teacher");
      }

      showNotification("Teacher deleted successfully! Redirecting...", "success");

      setTimeout(() => {
        router.push("/web-admin/teacher");
        router.refresh();
      }, 1500);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to delete teacher. Please try again.",
        "error"
      );
      setIsSubmitting(false);
    }
  };

  // Handle reset changes
  const handleResetChanges = () => {
    if (window.confirm("Are you sure you want to reset all changes?")) {
      setTeacherData({ ...originalTeacherData });
      setSelectedClassLevels([...originalClassLevels]);
      setSelectedFile(null);
      setImagePreview(originalTeacherData.image || '');
      showNotification("Changes reset successfully", "success");
    }
  };

  // Check if update button should be disabled
  const isUpdateDisabled = isSubmitting || !hasChanges();

  // Get button tooltip message
  const getButtonTooltip = () => {
    if (isSubmitting) return "Saving changes...";
    if (selectedClassLevels.length === 0) return "Please select at least one class level";
    if (!hasChanges()) return "No changes to save";
    return "Update teacher";
  };

  // Skeleton Loading Component
  const SkeletonInput = ({ className = "" }: { className?: string }) => (
    <div className={`h-12 bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
  );

  const SkeletonTextArea = ({ className = "" }: { className?: string }) => (
    <div className={`h-32 bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Form Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
            {/* Basic Info Skeleton */}
            <div className="mb-8">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <SkeletonInput />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <SkeletonInput className="w-full" />
                </div>
              </div>
            </div>

            {/* Class Levels Skeleton */}
            <div className="mb-8">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Education Skeleton */}
            <div className="mb-8">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <SkeletonInput key={i} className="w-full" />
                ))}
              </div>
            </div>

            {/* Form Actions Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-gray-200">
              <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Notification Toast */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-md ${
            notification.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-green-50 border-green-200 text-green-800"
          } border rounded-lg p-4 shadow-lg transition-all duration-300`}
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${notification.type === "error" ? "text-red-400" : "text-green-400"}`}>
              {notification.type === "error" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification({ show: false, message: "", type: "" })}
              className="ml-auto pl-3"
            >
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 group"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Teacher</h1>
            <p className="text-gray-600 mt-1">
              Update the details for {teacherData.name || "Teacher"}
            </p>
            {hasChanges() && (
              <div className="flex items-center mt-2 text-sm text-amber-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>You have unsaved changes</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/teachers/${teacherId}`)}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              View Public
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={teacherData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter teacher's full name"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={teacherData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Mathematics"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={teacherData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="teacher@school.edu"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="experience"
                  value={teacherData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., 10 years teaching experience"
                />
              </div>

              {/* Profile Image Upload/URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                
                {/* Current image preview */}
                {(imagePreview || selectedFile) && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-3">Current image:</p>
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-lg border border-gray-300 overflow-hidden bg-gray-100">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOWM5YzljIj5JbWFnZSBQcmV2aWV3PC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                        </div>
                        {(selectedFile || teacherData.image) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedFile) {
                                removeSelectedFile();
                              } else {
                                removeImageUrl();
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            aria-label="Remove image"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">
                          {selectedFile 
                            ? `New file: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`
                            : 'Current image URL'
                          }
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setTeacherData(prev => ({ ...prev, image: '' }));
                            setImagePreview('');
                          }}
                          className="inline-flex items-center text-sm text-red-600 hover:text-red-800 mt-2"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Remove Image
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Upload new image options */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-2">Upload new image or enter URL:</p>
                  
                  {/* File Upload Section */}
                  <div 
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300 hover:border-blue-400 hover:bg-blue-50`}
                  >
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      PNG, JPG, GIF, WebP, SVG up to 5MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload-edit"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                  
                  {/* OR Separator */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>
                  
                  {/* URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={teacherData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Class Levels */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  {classLevelOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleClassLevelToggle(level)}
                      className={`px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                        selectedClassLevels.includes(level)
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-700 text-white shadow-lg transform scale-105 ring-2 ring-blue-200"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center">
                        {selectedClassLevels.includes(level) ? (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{level}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 mr-2 border-2 border-gray-300 rounded flex items-center justify-center">
                              <div className="w-2 h-2 bg-transparent rounded"></div>
                            </div>
                            <span>{level}</span>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">
                          {selectedClassLevels.length} level(s) selected:
                        </span>{" "}
                        {selectedClassLevels.length > 0 ? selectedClassLevels.join(", ") : "None"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center mb-3 sm:mb-0">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 0 00-.788 0l-7 3a1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </span>
                Education Background <span className="text-red-500">*</span>
              </h2>
              <button
                type="button"
                onClick={() => addArrayField("education")}
                className="inline-flex items-center text-sm bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Education
              </button>
            </div>

            <div className="space-y-4">
              {teacherData.education.map((edu, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={edu}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleArrayInputChange("education", index, e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., PhD in Mathematics, Stanford University"
                      required={index === 0}
                    />
                  </div>
                  {teacherData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField("education", index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove education"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Experience Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center mb-3 sm:mb-0">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </span>
                Teaching Experience
              </h2>
              <button
                type="button"
                onClick={() => addArrayField("teachingExperience")}
                className="inline-flex items-center text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {teacherData.teachingExperience.map((exp, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={exp}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleArrayInputChange("teachingExperience", index, e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="e.g., Head of Mathematics Department (2015-Present)"
                    />
                  </div>
                  {teacherData.teachingExperience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField("teachingExperience", index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove experience"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center mb-3 sm:mb-0">
                <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                Achievements & Awards
              </h2>
              <button
                type="button"
                onClick={() => addArrayField("achievements")}
                className="inline-flex items-center text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Achievement
              </button>
            </div>

            <div className="space-y-4">
              {teacherData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleArrayInputChange("achievements", index, e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                      placeholder="e.g., National Mathematics Teacher of the Year 2022"
                    />
                  </div>
                  {teacherData.achievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField("achievements", index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove achievement"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bio & Philosophy Section */}
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </span>
              Biography & Philosophy
            </h2>

            <div className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Biography <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="bio"
                    value={teacherData.bio}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Write a brief professional biography..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {teacherData.bio.length}/500 characters
                  </div>
                </div>
              </div>

              {/* Teaching Philosophy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Philosophy <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="teachingPhilosophy"
                    value={teacherData.teachingPhilosophy}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Describe the teacher's teaching philosophy..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {teacherData.teachingPhilosophy.length}/500 characters
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete Teacher
              </button>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleResetChanges}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasChanges() || isSubmitting}
                title={!hasChanges() ? "No changes to reset" : ""}
              >
                Reset Changes
              </button>

              <button
                type="submit"
                disabled={isUpdateDisabled}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[160px]"
                title={getButtonTooltip()}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Update Teacher
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Required Fields Note */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> indicates required fields
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherPage;