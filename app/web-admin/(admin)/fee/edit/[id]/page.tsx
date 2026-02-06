"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

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
  otherCharges: string;
  description: string;
}

const CLASS_CATEGORY_MAP: Record<string, string> = {
  "PG (Play Group)": "Pre-School",
  "KG (Kindergarten)": "Pre-School",
  "Nursery": "Pre-School",
  "Playgroup": "Pre-School",
  "KG-1": "Pre-School",
  "KG-2": "Pre-School",
  "KG": "Pre-School",
  "Class 1": "Primary",
  "Class 2": "Primary",
  "Class 3": "Primary",
  "Class 4": "Primary",
  "Class 5": "Primary",
  "Class 6": "Middle School",
  "Class 7": "Middle School",
  "Class 8": "Middle School",
  "Class 9": "Secondary",
  "Class 10": "Secondary",
  "Class 11": "Higher Secondary",
  "Class 12": "Higher Secondary",
};

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

export default function EditFeePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  
  const [formData, setFormData] = useState<FeeFormData>({
    className: "",
    category: "",
    admissionFee: "",
    monthlyFee: "",
    otherCharges: "",
    description: "",
  });

  // Fetch fee data
  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log('Fetching fee with ID:', id);
        
        const response = await fetch(`/api/admin/fee?id=${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch fee data: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.success && result.data) {
          const fee = result.data;
          
          // Extract numeric values from formatted currency strings
          const extractNumber = (currencyStr: string): string => {
            if (!currencyStr) return '0';
            // Remove "Rs. " and commas
            const cleaned = currencyStr.replace('Rs. ', '').replace(/,/g, '');
            return cleaned;
          };
          
          setFormData({
            className: fee.className || '',
            category: fee.category || '',
            admissionFee: extractNumber(fee.admissionFee),
            monthlyFee: extractNumber(fee.monthlyFee),
            otherCharges: extractNumber(fee.otherCharges),
            description: fee.description || ''
          });
        } else {
          throw new Error(result.error || 'Invalid fee data');
        }
      } catch (err: any) {
        console.error('Error fetching fee:', err);
        setError(err.message || 'Failed to load fee data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeeData();
    }
  }, [id]);

  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const handleClassChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const className = e.target.value;
    
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
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value
    }));
  };

  const handleFeeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  const calculateAnnualFee = (): string => {
    const monthlyNum = parseFloat(formData.monthlyFee) || 0;
    return formatCurrency(monthlyNum * 12);
  };

  const calculateTotalAnnual = (): string => {
    const monthlyNum = parseFloat(formData.monthlyFee) || 0;
    const admissionNum = parseFloat(formData.admissionFee) || 0;
    const otherNum = parseFloat(formData.otherCharges) || 0;
    return formatCurrency(admissionNum + (monthlyNum * 12) + otherNum);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!formData.className || !formData.category || !formData.monthlyFee) {
        throw new Error("Please fill in all required fields (*)");
      }

      const monthlyFee = parseFloat(formData.monthlyFee) || 0;
      if (monthlyFee <= 0) {
        throw new Error("Monthly fee must be greater than 0");
      }

      const updateData = {
        id: parseInt(id),
        className: formData.className,
        category: formData.category,
        admissionFee: parseFloat(formData.admissionFee) || 0,
        monthlyFee: monthlyFee,
        otherCharges: parseFloat(formData.otherCharges) || 0,
        description: formData.description,
      };

      console.log("Updating fee:", updateData);

      const response = await fetch("/api/admin/fee", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update fee");
      }

      // Show success message
      setSuccess("Fee structure updated successfully!");
      
      // Wait a moment then redirect
      setTimeout(() => {
        router.push("/web-admin/fee");
        router.refresh();
      }, 1500);
      
    } catch (err: any) {
      console.error("Error updating fee:", err);
      setError(err.message || "Failed to update fee. Please try again.");
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push("/web-admin/fee");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-300 rounded"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
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
            type="button"
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
          >
            <BackIcon />
            Back to Fees
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Fee Structure
          </h1>
          <p className="text-gray-600">
            Update fee structure for {formData.className}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-600">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Information */}
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
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                  placeholder="Describe what's included in the fee"
                />
              </div>
            </div>
          </div>

          {/* Fee Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Fee Details
            </h2>

            <div className="space-y-6">
              {/* Monthly Fee */}
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
                    step="1"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter monthly fee"
                  />
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-gray-600">Annual: </span>
                  <span className="ml-2 font-semibold text-green-600">
                    {calculateAnnualFee()}
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
                    step="1"
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
                    step="1"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter other charges"
                  />
                </div>
              </div>

              {/* Total Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Annual Fee:</span>
                  <span className="text-2xl font-bold text-blue-700">{calculateTotalAnnual()}</span>
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
              disabled={saving}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <SaveIcon />
                  Update Fee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}