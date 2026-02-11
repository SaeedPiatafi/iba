"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AdmissionStep {
  _id?: string;
  step: number;
  title: string;
  description: string;
}

interface ImportantDate {
  _id?: string;
  date: string;
  event: string;
}

interface EligibilityCriteria {
  _id?: string;
  class: string;
  requirement: string;
}

interface AdmissionData {
  admissionSteps: AdmissionStep[];
  documentRequirements: string[];
  importantDates: ImportantDate[];
  eligibilityCriteria: EligibilityCriteria[];
}

interface ApiResponse {
  success: boolean;
  data: AdmissionData;
  timestamp: string;
  error?: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | '';
}

export default function AdminAdmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<AdmissionData | null>(null);
  const [activeTab, setActiveTab] = useState('steps');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [stepErrors, setStepErrors] = useState<{[key: string]: string}>({});
  const [notification, setNotification] = useState<Notification>({ show: false, message: '', type: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
  } | null>(null);
  
  // Refs for scrolling
  const editFormRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Color palette for admin interface
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    accentYellow: "#F59E0B",
    accentRed: "#DC2626",
    background: "#F8FAFC",
    card: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Show confirmation dialog
  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    setConfirmConfig({
      title,
      message,
      onConfirm,
      onCancel,
      confirmText,
      cancelText
    });
    setShowConfirmDialog(true);
  };

  // Handle confirm
  const handleConfirm = () => {
    if (confirmConfig?.onConfirm) {
      confirmConfig.onConfirm();
    }
    setShowConfirmDialog(false);
    setConfirmConfig(null);
  };

  // Handle cancel
  const handleCancel = () => {
    if (confirmConfig?.onCancel) {
      confirmConfig.onCancel();
    }
    setShowConfirmDialog(false);
    setConfirmConfig(null);
  };

  // Fetch admission data
  useEffect(() => {
    fetchAdmissionData();
  }, []);

  // Scroll to edit form when editMode changes
  useEffect(() => {
    if (editMode && editFormRef.current) {
      setTimeout(() => {
        editFormRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [editMode]);

  // Auto-hide notification
  useEffect(() => {
    if (notification.show && notificationRef.current) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const fetchAdmissionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/admission?admin=true');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load admission data');
      }
      
      setData(result.data);
    } catch (err) {
      // Initialize with empty data structure if API fails
      setData({
        admissionSteps: [],
        documentRequirements: [],
        importantDates: [],
        eligibilityCriteria: [],
      });
      showNotification('Failed to load admission data. Using local storage.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  // Save admission data
  const saveAdmissionData = async (section: string, updatedData: any) => {
    try {
      setSaving(true);
      
      // Prepare the payload based on section
      let payload = {};
      if (section === 'steps') {
        payload = { admissionSteps: updatedData };
      } else if (section === 'documents') {
        payload = { documentRequirements: updatedData };
      } else if (section === 'dates') {
        payload = { importantDates: updatedData };
      } else if (section === 'eligibility') {
        payload = { eligibilityCriteria: updatedData };
      }

      const response = await fetch('/api/admin/admission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setData(prev => ({
          ...prev!,
          ...payload
        }));
        
        // Exit edit mode
        setEditMode(null);
        setEditData(null);
        setStepErrors({});
        
        // Scroll back to top
        if (tabsRef.current) {
          tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Show success message
        showNotification('Data saved successfully!', 'success');
      }
    } catch (error) {
      showNotification('Failed to save data. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Validate step data
  const validateStepData = (stepData: any) => {
    const errors: {[key: string]: string} = {};
    
    if (!stepData.step || stepData.step < 1) {
      errors.step = 'Step number must be at least 1';
    }
    
    if (!stepData.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!stepData.description?.trim()) {
      errors.description = 'Description is required';
    }
    
    // Check for duplicate step numbers
    if (data?.admissionSteps) {
      const existingStep = data.admissionSteps.find(s => s.step === stepData.step);
      if (existingStep && editData?.index === undefined) {
        errors.step = `Step ${stepData.step} already exists`;
      }
    }
    
    return errors;
  };

  // Handle edit actions with validation
  const handleEdit = (section: string, item?: any, index?: number) => {
    setEditMode(section);
    setStepErrors({});
    
    if (section === 'new-step') {
      const currentSteps = data?.admissionSteps || [];
      const maxStep = currentSteps.length > 0 
        ? Math.max(...currentSteps.map(s => s.step)) 
        : 0;
      setEditData({ step: maxStep + 1, title: '', description: '' });
    } else if (section === 'edit-step' && index !== undefined) {
      setEditData({ ...item, index });
    } else if (section === 'new-document') {
      setEditData({ text: '' });
    } else if (section === 'edit-document' && index !== undefined) {
      setEditData({ text: item, index });
    } else if (section === 'new-date') {
      setEditData({ date: '', event: '' });
    } else if (section === 'edit-date' && index !== undefined) {
      setEditData({ ...item, index });
    } else if (section === 'new-eligibility') {
      setEditData({ class: '', requirement: '' });
    } else if (section === 'edit-eligibility' && index !== undefined) {
      setEditData({ ...item, index });
    }
  };

  // Handle save with validation
  // Handle save with validation
const handleSave = (section: string) => {
  if (!editData) return;

  let updatedData: any = [];

  if (section === 'steps') {
    // Validate step data
    const errors = validateStepData(editData);
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      // Show first error as notification
      const firstError = Object.values(errors)[0];
      showNotification(firstError, 'error');
      return;
    }

    // Check if step number can be changed when there are exactly 4 steps
    if (data?.admissionSteps.length === 4 && editData.index !== undefined) {
      const existingStep = data.admissionSteps[editData.index];
      if (existingStep.step !== editData.step) {
        showConfirm(
          'Change Step Number',
          'There are exactly 4 steps configured. Changing step numbers might break existing references. Continue?',
          () => proceedWithStepSave(updatedData, section),
          undefined,
          'Continue',
          'Cancel'
        );
        return;
      }
    }

    if (editData.index !== undefined) {
      // Edit existing step
      updatedData = [...(data?.admissionSteps || [])];
      updatedData[editData.index] = {
        step: editData.step,
        title: editData.title.trim(),
        description: editData.description.trim()
      };
    } else {
      // Add new step
      updatedData = [...(data?.admissionSteps || []), {
        step: editData.step,
        title: editData.title.trim(),
        description: editData.description.trim()
      }];
    }
    saveAdmissionData(section, updatedData);
    
  } else if (section === 'documents') {
    if (!editData.text?.trim()) {
      showNotification('Document requirement cannot be empty', 'error');
      return;
    }
    
    if (editData.index !== undefined) {
      updatedData = [...(data?.documentRequirements || [])];
      updatedData[editData.index] = editData.text.trim();
    } else {
      updatedData = [...(data?.documentRequirements || []), editData.text.trim()];
    }
    saveAdmissionData(section, updatedData);
    
  } else if (section === 'dates') {
    if (!editData.date?.trim() || !editData.event?.trim()) {
      showNotification('Date and event are required', 'error');
      return;
    }
    
    // Validate date format
    const dateObj = new Date(editData.date);
    if (isNaN(dateObj.getTime())) {
      showNotification('Invalid date format. Please select a valid date from the calendar.', 'error');
      return;
    }
    
    // Format date to YYYY-MM-DD for consistent storage
    const formattedDate = dateObj.toISOString().split('T')[0];
    
    if (editData.index !== undefined) {
      updatedData = [...(data?.importantDates || [])];
      updatedData[editData.index] = {
        date: formattedDate,
        event: editData.event.trim()
      };
    } else {
      updatedData = [...(data?.importantDates || []), {
        date: formattedDate,
        event: editData.event.trim()
      }];
    }
    
    // Sort dates in ascending order before saving
    updatedData.sort((a: ImportantDate, b: ImportantDate) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    saveAdmissionData(section, updatedData);
    
  } else if (section === 'eligibility') {
    if (!editData.class?.trim() || !editData.requirement?.trim()) {
      showNotification('Class and requirement are required', 'error');
      return;
    }
    
    if (editData.index !== undefined) {
      updatedData = [...(data?.eligibilityCriteria || [])];
      updatedData[editData.index] = {
        class: editData.class.trim(),
        requirement: editData.requirement.trim()
      };
    } else {
      updatedData = [...(data?.eligibilityCriteria || []), {
        class: editData.class.trim(),
        requirement: editData.requirement.trim()
      }];
    }
    saveAdmissionData(section, updatedData);
  }
};
  // Proceed with step save after confirmation
  const proceedWithStepSave = (updatedData: any, section: string) => {
    if (editData.index !== undefined) {
      // Edit existing step
      updatedData = [...(data?.admissionSteps || [])];
      updatedData[editData.index] = {
        step: editData.step,
        title: editData.title.trim(),
        description: editData.description.trim()
      };
    } else {
      // Add new step
      updatedData = [...(data?.admissionSteps || []), {
        step: editData.step,
        title: editData.title.trim(),
        description: editData.description.trim()
      }];
    }
    saveAdmissionData(section, updatedData);
  };

  // Handle delete with confirmation
  const handleDelete = (section: string, index: number) => {
    if (section === 'steps' && data?.admissionSteps.length === 4) {
      showConfirm(
        'Delete Admission Step',
        'Warning: Deleting a step when there are exactly 4 steps might affect the admission process flow. Continue?',
        () => proceedWithDelete(section, index),
        undefined,
        'Delete',
        'Cancel'
      );
    } else {
      showConfirm(
        'Delete Item',
        'Are you sure you want to delete this item?',
        () => proceedWithDelete(section, index),
        undefined,
        'Delete',
        'Cancel'
      );
    }
  };

  // Proceed with delete after confirmation
  const proceedWithDelete = (section: string, index: number) => {
    let updatedData: any = [];

    if (section === 'steps') {
      updatedData = data?.admissionSteps.filter((_, i) => i !== index) || [];
    } else if (section === 'documents') {
      updatedData = data?.documentRequirements.filter((_, i) => i !== index) || [];
    } else if (section === 'dates') {
      updatedData = data?.importantDates.filter((_, i) => i !== index) || [];
    } else if (section === 'eligibility') {
      updatedData = data?.eligibilityCriteria.filter((_, i) => i !== index) || [];
    }

    saveAdmissionData(section, updatedData);
  };

  // Handle step number change with validation
  const handleStepNumberChange = (value: number) => {
    const newValue = Math.max(1, value);
    const currentSteps = data?.admissionSteps || [];
    
    // Check if step number already exists (except when editing the same step)
    const existingStep = currentSteps.find(s => s.step === newValue);
    const isExistingStep = existingStep && editData?.index === undefined;
    
    setEditData({...editData, step: newValue});
    
    if (isExistingStep) {
      setStepErrors({...stepErrors, step: `Step ${newValue} already exists`});
    } else {
      const newErrors = {...stepErrors};
      delete newErrors.step;
      setStepErrors(newErrors);
    }
  };

  // Cancel editing and scroll to top
  const handleEditCancel = () => {
    setEditMode(null);
    setEditData(null);
    setStepErrors({});
    
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showNotification('Edit cancelled', 'info');
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 mb-4 sm:mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 sm:h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-48 sm:h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Notification Toast */}
        {notification.show && (
          <div 
            ref={notificationRef}
            className={`fixed top-4 right-4 z-50 max-w-md ${
              notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              notification.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              'bg-green-50 border-green-200 text-green-800'
            } border rounded-lg p-4 shadow-lg transition-all duration-300 transform ${notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            style={{ zIndex: 1000 }}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${
                notification.type === 'error' ? 'text-red-400' :
                notification.type === 'warning' ? 'text-yellow-400' :
                notification.type === 'info' ? 'text-blue-400' :
                'text-green-400'
              }`}>
                {notification.type === 'error' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : notification.type === 'warning' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : notification.type === 'info' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button 
                onClick={() => setNotification({ show: false, message: '', type: '' })}
                className="ml-2 flex-shrink-0"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && confirmConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{confirmConfig.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{confirmConfig.message}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                >
                  {confirmConfig.cancelText || 'Cancel'}
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  {confirmConfig.confirmText || 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2" style={{ color: colors.textPrimary }}>
            Admission Management
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            Manage admission procedures, requirements, and important information
          </p>
        </div>

        {/* Tabs Navigation - Removed 4 tabs */}
        <div className="mb-4 sm:mb-6 md:mb-8" ref={tabsRef}>
          <div className="flex flex-wrap gap-1 sm:gap-2 border-b overflow-x-auto" style={{ borderColor: colors.border }}>
            {['steps', 'documents', 'dates', 'eligibility'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setEditMode(null);
                  setEditData(null);
                  setStepErrors({});
                }}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? `border-b-2 ${tab === 'steps' ? 'border-blue-600 text-blue-600' : 
                      tab === 'documents' ? 'border-green-600 text-green-600' :
                      tab === 'dates' ? 'border-yellow-600 text-yellow-600' :
                      'border-teal-600 text-teal-600'}`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab === 'steps' && 'Admission Steps'}
                {tab === 'documents' && 'Document Requirements'}
                {tab === 'dates' && 'Important Dates'}
                {tab === 'eligibility' && 'Eligibility Criteria'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md md:shadow-lg p-3 sm:p-4 md:p-6">
          
          {/* Floating scroll to top button */}
          {typeof window !== 'undefined' && window.scrollY > 400 && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          )}
          
          {/* Admission Steps Section */}
          {activeTab === 'steps' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Admission Procedure Steps
                </h2>
                <button
                  onClick={() => handleEdit('new-step')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-xs sm:text-sm md:text-base w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Step
                </button>
              </div>

              {/* Step validation warning */}
              {data?.admissionSteps.length === 4 && (
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 md:p-4 rounded-lg border border-yellow-300 bg-yellow-50">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base text-yellow-800">
                      <strong>Note:</strong> There are exactly 4 steps configured. Changing step numbers or deleting steps might affect the admission process flow.
                    </span>
                  </div>
                </div>
              )}

              {/* Edit Step Form */}
              {editMode && editMode.includes('step') && (
                <div 
                  ref={editFormRef}
                  className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 rounded-lg shadow-md" 
                  style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}
                >
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                    {editMode === 'new-step' ? 'Add New Step' : 'Edit Step'}
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1.5">Step Number *</label>
                      <input
                        type="number"
                        value={editData.step}
                        onChange={(e) => handleStepNumberChange(parseInt(e.target.value) || 1)}
                        className={`w-full p-2 text-sm sm:text-base border rounded ${stepErrors.step ? 'border-red-500' : ''}`}
                        style={{ borderColor: stepErrors.step ? colors.error : colors.border }}
                        min="1"
                      />
                      {stepErrors.step && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">{stepErrors.step}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1.5">Title *</label>
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => {
                          setEditData({...editData, title: e.target.value});
                          if (e.target.value.trim()) {
                            const newErrors = {...stepErrors};
                            delete newErrors.title;
                            setStepErrors(newErrors);
                          }
                        }}
                        className={`w-full p-2 text-sm sm:text-base border rounded ${stepErrors.title ? 'border-red-500' : ''}`}
                        style={{ borderColor: stepErrors.title ? colors.error : colors.border }}
                        placeholder="Enter step title"
                      />
                      {stepErrors.title && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">{stepErrors.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1.5">Description *</label>
                      <textarea
                        value={editData.description}
                        onChange={(e) => {
                          setEditData({...editData, description: e.target.value});
                          if (e.target.value.trim()) {
                            const newErrors = {...stepErrors};
                            delete newErrors.description;
                            setStepErrors(newErrors);
                          }
                        }}
                        className={`w-full p-2 text-sm sm:text-base border rounded ${stepErrors.description ? 'border-red-500' : ''}`}
                        style={{ borderColor: stepErrors.description ? colors.error : colors.border }}
                        rows={3}
                        placeholder="Enter step description"
                      />
                      {stepErrors.description && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">{stepErrors.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2">
                      <button
                        onClick={() => handleSave('steps')}
                        disabled={saving}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm flex-1"
                      >
                        {saving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : editMode === 'new-step' ? 'Add Step' : 'Update Step'}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm flex-1"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {data?.admissionSteps.sort((a, b) => a.step - b.step).map((step, index) => (
                  <div key={index} className="p-3 sm:p-4 md:p-6 rounded-lg border hover:shadow-sm transition-shadow" style={{ borderColor: colors.border }}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base" 
                          style={{ backgroundColor: colors.primaryBlue }}>
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 sm:mb-2" style={{ color: colors.textPrimary }}>
                            {step.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleEdit('edit-step', step, index)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete('steps', index)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {data?.admissionSteps.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primaryBlue}10` }}>
                      <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.primaryBlue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium mb-2">No Steps Added Yet</h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">Start by adding your first admission step</p>
                    <button
                      onClick={() => handleEdit('new-step')}
                      className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add First Step
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Document Requirements Section */}
          {activeTab === 'documents' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Document Requirements
                </h2>
                <button
                  onClick={() => handleEdit('new-document')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-xs sm:text-sm md:text-base w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Document
                </button>
              </div>

              {/* Edit Document Form */}
              {editMode && editMode.includes('document') && (
                <div 
                  ref={editFormRef}
                  className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 rounded-lg shadow-md" 
                  style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}
                >
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                    {editMode === 'new-document' ? 'Add New Document Requirement' : 'Edit Document Requirement'}
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1.5">Document Requirement *</label>
                      <textarea
                        value={editData.text}
                        onChange={(e) => setEditData({...editData, text: e.target.value})}
                        className="w-full p-2 text-sm sm:text-base border rounded"
                        style={{ borderColor: colors.border }}
                        rows={3}
                        placeholder="Enter document requirement description"
                      />
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2">
                      <button
                        onClick={() => handleSave('documents')}
                        disabled={saving}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm flex-1"
                      >
                        {saving ? 'Saving...' : editMode === 'new-document' ? 'Add Document' : 'Update Document'}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm flex-1"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents List */}
              <div className="space-y-2 sm:space-y-3">
                {data?.documentRequirements.map((doc, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start mb-2 sm:mb-0">
                      <span className="mr-2 sm:mr-3 mt-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs" 
                        style={{ backgroundColor: `${colors.accentGreen}15`, color: colors.accentGreen }}>
                        {index + 1}
                      </span>
                      <span className="text-sm sm:text-base flex-1">{doc}</span>
                    </div>
                    <div className="flex gap-1 sm:gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleEdit('edit-document', doc, index)}
                        className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete('documents', index)}
                        className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                {data?.documentRequirements.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.accentGreen}10` }}>
                      <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.accentGreen }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium mb-2">No Document Requirements</h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">Add required documents for admission</p>
                    <button
                      onClick={() => handleEdit('new-document')}
                      className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add First Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Important Dates Section */}
{activeTab === 'dates' && (
  <div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: colors.textPrimary }}>
        Important Dates
      </h2>
      <button
        onClick={() => handleEdit('new-date')}
        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center text-xs sm:text-sm md:text-base w-full sm:w-auto"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Date
      </button>
    </div>

    {/* Edit Date Form */}
    {editMode && editMode.includes('date') && (
      <div 
        ref={editFormRef}
        className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 rounded-lg shadow-md" 
        style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}
      >
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
          {editMode === 'new-date' ? 'Add New Important Date' : 'Edit Important Date'}
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1.5">Date *</label>
            <input
              type="date"
              value={editData.date}
              onChange={(e) => setEditData({...editData, date: e.target.value})}
              className="w-full p-2 text-sm sm:text-base border rounded"
              style={{ borderColor: colors.border }}
            />
            <p className="text-xs text-gray-500 mt-1">Select a date from the calendar</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1.5">Event *</label>
            <input
              type="text"
              value={editData.event}
              onChange={(e) => setEditData({...editData, event: e.target.value})}
              className="w-full p-2 text-sm sm:text-base border rounded"
              style={{ borderColor: colors.border }}
              placeholder="e.g., Admission Test for Class 1-5"
            />
          </div>
          <div className="flex flex-col xs:flex-row gap-2">
            <button
              onClick={() => handleSave('dates')}
              disabled={saving}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm flex-1"
            >
              {saving ? 'Saving...' : editMode === 'new-date' ? 'Add Date' : 'Update Date'}
            </button>
            <button
              onClick={handleEditCancel}
              className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm flex-1"
              style={{ borderColor: colors.border }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Dates List - Sorted in Ascending Order */}
    <div className="space-y-3 sm:space-y-4">
      {data?.importantDates
        .slice() // Create a copy to avoid mutating original array
        .sort((a, b) => {
          // Parse dates for proper sorting
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        })
        .map((item, index) => {
          // Format date for display
          const dateObj = new Date(item.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          const dayOfMonth = dateObj.getDate();
          const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
          const year = dateObj.getFullYear();
          
          return (
            <div key={index} className="flex items-start justify-between p-3 sm:p-4 rounded-lg border hover:shadow-sm transition-all" 
                 style={{ borderColor: colors.border }}>
              <div className="flex items-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg flex flex-col items-center justify-center mr-3 sm:mr-4" 
                  style={{ 
                    backgroundColor: dateObj >= new Date() ? 
                      `${colors.primaryBlue}10` : 
                      `${colors.textSecondary}10`,
                    color: dateObj >= new Date() ? 
                      colors.primaryBlue : 
                      colors.textSecondary
                  }}>
                  <div className="text-sm sm:text-base md:text-lg font-bold">{dayOfMonth}</div>
                  <div className="text-xs">{monthName}</div>
                </div>
                <div>
                  <div className="font-medium text-sm sm:text-base mb-1">{item.event}</div>
                  <div className="text-xs sm:text-sm text-gray-600 flex items-center">
                    <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formattedDate}
                    {dateObj < new Date() && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        Past
                      </span>
                    )}
                    {dateObj >= new Date() && dateObj <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => handleEdit('edit-date', item, index)}
                  className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete('dates', index)}
                  className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      
      {data?.importantDates.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: `${colors.accentYellow}10` }}>
            <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.accentYellow }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-medium mb-2">No Important Dates</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Add important dates for the admission process. Use the calendar to select dates easily.
          </p>
          <button
            onClick={() => handleEdit('new-date')}
            className="px-4 sm:px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add First Date
          </button>
        </div>
      )}
    </div>
  </div>
)}

          {/* Eligibility Criteria Section */}
          {activeTab === 'eligibility' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Eligibility Criteria
                </h2>
                <button
                  onClick={() => handleEdit('new-eligibility')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center text-xs sm:text-sm md:text-base w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Criteria
                </button>
              </div>

              {/* Edit Eligibility Form */}
              {editMode && editMode.includes('eligibility') && (
                <div 
                  ref={editFormRef}
                  className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 rounded-lg shadow-md" 
                  style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}
                >
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                    {editMode === 'new-eligibility' ? 'Add New Eligibility Criteria' : 'Edit Eligibility Criteria'}
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1.5">Class/Grade *</label>
                      <input
                        type="text"
                        value={editData.class}
                        onChange={(e) => setEditData({...editData, class: e.target.value})}
                        className="w-full p-2 text-sm sm:text-base border rounded"
                        style={{ borderColor: colors.border }}
                        placeholder="e.g., Class 1-5 or Kindergarten"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1.5">Academic Requirement *</label>
                      <textarea
                        value={editData.requirement}
                        onChange={(e) => setEditData({...editData, requirement: e.target.value})}
                        className="w-full p-2 text-sm sm:text-base border rounded"
                        style={{ borderColor: colors.border }}
                        rows={3}
                        placeholder="Enter academic requirements"
                      />
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2">
                      <button
                        onClick={() => handleSave('eligibility')}
                        disabled={saving}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm flex-1"
                      >
                        {saving ? 'Saving...' : editMode === 'new-eligibility' ? 'Add Criteria' : 'Update Criteria'}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm flex-1"
                        style={{ borderColor: colors.border }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Eligibility Table */}
              <div className="overflow-x-auto rounded-lg border" style={{ borderColor: colors.border }}>
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 text-left font-bold text-gray-700 text-xs sm:text-sm md:text-base">Class/Grade</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 text-left font-bold text-gray-700 text-xs sm:text-sm md:text-base">Academic Requirement</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 text-left font-bold text-gray-700 text-xs sm:text-sm md:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.eligibilityCriteria.map((criteria, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}>
                        <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 font-medium text-xs sm:text-sm md:text-base border-t" style={{ borderColor: colors.border }}>
                          {criteria.class}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 text-xs sm:text-sm md:text-base border-t" style={{ borderColor: colors.border }}>
                          {criteria.requirement}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 border-t" style={{ borderColor: colors.border }}>
                          <div className="flex gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit('edit-eligibility', criteria, index)}
                              className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete('eligibility', index)}
                              className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {data?.eligibilityCriteria.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 sm:py-12 text-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.secondaryTeal}10` }}>
                            <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.secondaryTeal }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <h3 className="text-lg sm:text-xl font-medium mb-2">No Eligibility Criteria</h3>
                          <p className="text-gray-600 text-sm sm:text-base mb-6">Add eligibility criteria for different classes</p>
                          <button
                            onClick={() => handleEdit('new-eligibility')}
                            className="px-4 sm:px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 inline-flex items-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add First Criteria
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{data?.admissionSteps.length || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">Admission Steps</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{data?.documentRequirements.length || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">Document Requirements</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">{data?.importantDates.length || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">Important Dates</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">{data?.eligibilityCriteria.length || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">Eligibility Criteria</div>
          </div>
        </div>
      </div>
    </div>
  );
}