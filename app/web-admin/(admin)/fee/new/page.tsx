"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

// Icons
const BackIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

interface FeeFormData {
  className: string;
  category: string;
  admissionFee: string;
  monthlyFee: string;
  annualFee: string;
  otherCharges: string;
  totalAnnual: string;
  description: string;
}

interface DuplicateModal {
  visible: boolean;
  message: string;
  className: string;
}

// Class-Category Mapping
const CLASS_CATEGORY_MAP: Record<string, string> = {
  // Pre-School Classes
  "PG (Play Group)": "Pre-School",
  "KG (Kindergarten)": "Pre-School",
  "Nursery": "Pre-School",
  "Playgroup": "Pre-School",
  "KG-1": "Pre-School",
  "KG-2": "Pre-School",
  "KG": "Pre-School",
  
  // Primary Classes
  "Class 1": "Primary",
  "Class 2": "Primary",
  "Class 3": "Primary",
  "Class 4": "Primary",
  "Class 5": "Primary",
  "Grade 1": "Primary",
  "Grade 2": "Primary",
  "Grade 3": "Primary",
  "Grade 4": "Primary",
  "Grade 5": "Primary",
  
  // Middle School Classes
  "Class 6": "Middle School",
  "Class 7": "Middle School",
  "Class 8": "Middle School",
  "Grade 6": "Middle School",
  "Grade 7": "Middle School",
  "Grade 8": "Middle School",
  
  // Secondary Classes
  "Class 9": "Secondary",
  "Class 10": "Secondary",
  "Grade 9": "Secondary",
  "Grade 10": "Secondary",
  "Matric 9": "Secondary",
  "Matric 10": "Secondary",
  
  // Higher Secondary Classes
  "Class 11": "Higher Secondary",
  "Class 12": "Higher Secondary",
  "Grade 11": "Higher Secondary",
  "Grade 12": "Higher Secondary",
  "F.Sc 1": "Higher Secondary",
  "F.Sc 2": "Higher Secondary",
  "A-Level 1": "Higher Secondary",
  "A-Level 2": "Higher Secondary",
};

// Category colors for badges
const CATEGORY_COLORS: Record<string, string> = {
  "Pre-School": "bg-pink-100 text-pink-800 border-pink-200",
  "Primary": "bg-blue-100 text-blue-800 border-blue-200",
  "Middle School": "bg-green-100 text-green-800 border-green-200",
  "Secondary": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Higher Secondary": "bg-purple-100 text-purple-800 border-purple-200",
};

// Available class options
const CLASS_OPTIONS = [
  "PG (Play Group)",
  "KG (Kindergarten)",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const CATEGORY_OPTIONS = [
  "Pre-School",
  "Primary",
  "Middle School",
  "Secondary",
  "Higher Secondary",
];

export default function NewFeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [duplicateModal, setDuplicateModal] = useState<DuplicateModal>({
    visible: false,
    message: "",
    className: "",
  });
  const [formData, setFormData] = useState<FeeFormData>({
    className: "",
    category: "",
    admissionFee: "",
    monthlyFee: "",
    annualFee: "",
    otherCharges: "",
    totalAnnual: "",
    description: "",
  });

  // Format number to currency string with Rs. prefix
  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const showDuplicateModal = (className: string, message: string) => {
    setDuplicateModal({
      visible: true,
      message,
      className,
    });
  };

  const closeDuplicateModal = () => {
    setDuplicateModal({
      visible: false,
      message: "",
      className: "",
    });
  };

  // Handle class selection change
  const handleClassChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const className = e.target.value;
    
    // Set the class name
    setFormData(prev => ({
      ...prev,
      className
    }));

    // Auto-select category based on class
    if (className && CLASS_CATEGORY_MAP[className]) {
      setFormData(prev => ({
        ...prev,
        category: CLASS_CATEGORY_MAP[className]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        category: ""
      }));
    }
  };

  // Handle category change (manual override)
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value
    }));
  };

  // Handle fee input change - FIXED: No rounding
const handleFeeChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  // For number inputs, get the numeric value directly
  const numericValue = e.target.valueAsNumber;
  
  // Check if it's a valid number
  if (!isNaN(numericValue) && numericValue >= 0) {
    // Store as string without formatting
    setFormData(prev => ({
      ...prev,
      [name]: numericValue.toString()
    }));
  } else if (value === '') {
    // Allow empty value
    setFormData(prev => ({
      ...prev,
      [name]: ''
    }));
  }
};

  // Handle textarea change
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  // Calculate fees when monthly fee or other charges change
  useEffect(() => {
    const calculateFees = () => {
      const monthlyNum = parseFloat(formData.monthlyFee) || 0;
      const admissionNum = parseFloat(formData.admissionFee) || 0;
      const otherNum = parseFloat(formData.otherCharges) || 0;

      // Calculate annual fee (monthly * 12)
      const annualNum = monthlyNum * 12;
      const annualFee = formatCurrency(annualNum);

      // Calculate total (admission + annual + other charges)
      const totalNum = admissionNum + annualNum + otherNum;
      const totalAnnual = formatCurrency(totalNum);

      setFormData(prev => ({
        ...prev,
        annualFee,
        totalAnnual
      }));
    };

    calculateFees();
  }, [formData.monthlyFee, formData.admissionFee, formData.otherCharges]);

  // In NewFeePage.tsx - Update the handleSubmit function:
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Validate required fields
    if (!formData.className || !formData.category || !formData.monthlyFee) {
      throw new Error("Please fill in all required fields (*)");
    }

    // Parse numeric values - convert string numbers to actual numbers
    const admissionFee = parseFloat(formData.admissionFee) || 0;
    const monthlyFee = parseFloat(formData.monthlyFee) || 0;
    const otherCharges = parseFloat(formData.otherCharges) || 0;

    // Validate monthly fee is positive
    if (monthlyFee <= 0) {
      throw new Error("Monthly fee must be greater than 0");
    }

    // IMPORTANT: Send raw numbers, NOT formatted strings with "Rs."
    const finalFormData = {
      className: formData.className,
      category: formData.category,
      admissionFee: admissionFee, // Send as number, not "Rs. X,XXX"
      monthlyFee: monthlyFee,     // Send as number, not "Rs. X,XXX"
      otherCharges: otherCharges, // Send as number, not "Rs. X,XXX"
      description: formData.description,
    };


    // Submit to API
    const response = await fetch("/api/admin/fee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalFormData),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 409 && result.duplicate) {
        // Show duplicate fee structure modal
        showDuplicateModal(
          formData.className,
          result.error || "Fee structure for this class already exists",
        );
        setLoading(false);
        return;
      }
      throw new Error(result.error || "Failed to save fee data");
    }

    // Direct redirect without notification
    router.push("/web-admin/fee");
    router.refresh();
    
  } catch (err: any) {
    console.error("Error saving fee:", err);
    // Show error modal
    showDuplicateModal(
      formData.className,
      err.message || "Failed to save fee. Please try again."
    );
    setLoading(false);
  }
};

  const handleBack = () => {
    router.push("/web-admin/fee");
  };

  // Get category badge class
  const getCategoryBadgeClass = (category: string) => {
    return CATEGORY_COLORS[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
          >
            <BackIcon />
            Back to Fees
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Fee Structure
          </h1>
          <p className="text-gray-600">
            Create a new fee structure for a specific class
          </p>
        </div>

        {/* Duplicate Fee Structure Modal */}
        {duplicateModal.visible && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={closeDuplicateModal}
              ></div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Duplicate Fee Structure
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {duplicateModal.message}
                      </p>
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm font-medium text-yellow-800">
                          Class: {duplicateModal.className}
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          A fee structure for this class already exists in the system. Please choose a different class or edit the existing fee structure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={closeDuplicateModal}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/web-admin/fee");
                      closeDuplicateModal();
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    View All Fees
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Class Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class/Level *
                </label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleClassChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select Class</option>
                  {CLASS_OPTIONS.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Select a class and the category will be auto-selected
                </p>
              </div>

              {/* Category Display (Auto-selected) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  required
                  className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    formData.category ? getCategoryBadgeClass(formData.category).split(' ')[0] + ' bg-opacity-20' : ''
                  }`}
                >
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formData.category && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeClass(formData.category)}`}>
                      {formData.category} 
                      {formData.className && CLASS_CATEGORY_MAP[formData.className] === formData.category && (
                        <span className="ml-1">(Auto-selected)</span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleTextareaChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Describe what's included in the fee (e.g., textbooks, lab fees, uniform, etc.)"
                />
              </div>
            </div>
          </div>

          {/* Fee Structure Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Fee Details
            </h2>

            <div className="space-y-6">
              {/* Monthly Fee - Most Important */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Fee *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
                  </div>
                  <input
                    type="number"
                    name="monthlyFee"
                    value={formData.monthlyFee}
                    onChange={handleFeeChange}
                    required
                    min="1"
                    step="any"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter monthly fee"
                  />
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-gray-600">Annual: </span>
                  <span className="ml-2 font-semibold text-green-600">
                    {formData.annualFee || "Rs. 0"}
                  </span>
                  <span className="ml-4 text-gray-500">(Monthly × 12)</span>
                </div>
              </div>

              {/* Admission Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Fee
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
                  </div>
                  <input
                    type="number"
                    name="admissionFee"
                    value={formData.admissionFee}
                    onChange={handleFeeChange}
                    min="0"
                    step="any"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter one-time admission fee"
                  />
                </div>
              </div>

              {/* Other Charges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Charges
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
                  </div>
                  <input
                    type="number"
                    name="otherCharges"
                    value={formData.otherCharges}
                    onChange={handleFeeChange}
                    min="0"
                    step="any"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter other charges (lab, library, etc.)"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Optional: Additional one-time charges
                </p>
              </div>

              {/* Total Display - Simple */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Annual Fee:</span>
                  <span className="text-2xl font-bold text-blue-700">{formData.totalAnnual || "Rs. 0"}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Calculated as: Admission Fee + (Monthly Fee × 12) + Other Charges
                </p>
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
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Add CSS for animation */}
      <style jsx>{`
        /* Hide number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}