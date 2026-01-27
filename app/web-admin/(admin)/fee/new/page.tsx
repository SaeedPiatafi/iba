"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
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

const SuccessIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
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

interface Notification {
  type: "success" | "error" | "warning" | "info";
  message: string;
  visible: boolean;
}

interface DuplicateModal {
  visible: boolean;
  message: string;
  className: string;
}

export default function NewFeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification>({
    type: "info",
    message: "",
    visible: false,
  });
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

  const parseCurrencyToNumber = (value: string): number => {
    if (typeof value !== "string") return 0;
    const cleaned = value.replace(/[^\d]/g, "");
    return parseInt(cleaned) || 0;
  };

  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const showNotification = (
    type: "success" | "error" | "warning" | "info",
    message: string,
  ) => {
    setNotification({
      type,
      message,
      visible: true,
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 5000);
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Hide notifications when user starts typing
    if (notification.visible) {
      setNotification((prev) => ({ ...prev, visible: false }));
    }
    if (duplicateModal.visible) {
      closeDuplicateModal();
    }

    if (
      name === "monthlyFee" ||
      name === "otherCharges" ||
      name === "admissionFee"
    ) {
      // Calculate annual and total automatically
      const monthlyFee = name === "monthlyFee" ? value : formData.monthlyFee;
      const otherCharges =
        name === "otherCharges" ? value : formData.otherCharges;
      const admissionFee =
        name === "admissionFee" ? value : formData.admissionFee;

      // Parse values to numbers
      const monthlyNum = parseCurrencyToNumber(monthlyFee);
      const otherNum = parseCurrencyToNumber(otherCharges);
      const admissionNum = parseCurrencyToNumber(admissionFee);

      // Calculate annual fee (monthly * 12)
      const annualNum = monthlyNum * 12;
      const annualFee = formatCurrency(annualNum);

      // Calculate total (admission + annual + other charges)
      const totalNum = admissionNum + annualNum + otherNum;
      const totalAnnual = formatCurrency(totalNum);

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        annualFee,
        totalAnnual,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure all calculations are done
      const monthlyNum = parseCurrencyToNumber(formData.monthlyFee);
      const admissionNum = parseCurrencyToNumber(formData.admissionFee);
      const otherNum = parseCurrencyToNumber(formData.otherCharges);

      const annualNum = monthlyNum * 12;
      const totalNum = admissionNum + annualNum + otherNum;

      const finalFormData = {
        className: formData.className,
        category: formData.category,
        admissionFee: formData.admissionFee,
        monthlyFee: formData.monthlyFee,
        otherCharges: formData.otherCharges,
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

      // Show success notification
      showNotification(
        "success",
        result.message || "Fee structure saved successfully!",
      );

      // Redirect to fees list after 2 seconds
      setTimeout(() => {
        router.push("/web-admin/fee");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      console.error("Error saving fee:", err);
      showNotification(
        "error",
        err.message || "Failed to save fee. Please try again.",
      );
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/web-admin/fee");
  };

  const getNotificationStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <SuccessIcon />;
      case "error":
        return <ErrorIcon />;
      case "warning":
        return <WarningIcon />;
      case "info":
        return (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const categories: string[] = [
    "Pre-School",
    "Primary",
    "Middle School",
    "Secondary",
    "Higher Secondary",
  ];
  const classOptions: string[] = [
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
            Fill in the fee details for a specific class
          </p>
        </div>

        {/* Success/Error Notification */}
        {notification.visible && (
          <div
            className={`mb-6 p-4 border rounded-lg ${getNotificationStyles(notification.type)}`}
          >
            <div className="flex items-center">
              {getNotificationIcon(notification.type)}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}

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
                    <WarningIcon />
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
                          A fee structure for this class already exists in the
                          system. Please choose a different class or edit the
                          existing fee structure.
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
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Class Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class/Level *
                </label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select Class</option>
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {formData.className &&
                    "Check if this class already has a fee structure"}
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
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
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Describe what's included in the fee (e.g., textbooks, lab fees, etc.)"
                />
              </div>
            </div>
          </div>

          {/* Fee Structure Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Fee Structure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Admission Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Fee *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
                  </div>
                  <input
                    type="text"
                    name="admissionFee"
                    value={formData.admissionFee}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="15,000"
                  />
                </div>
              </div>

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
                    type="text"
                    name="monthlyFee"
                    value={formData.monthlyFee}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="8,000"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Annual: {formData.annualFee || "Rs. 0"}
                </p>
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
                    type="text"
                    name="otherCharges"
                    value={formData.otherCharges}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="5,000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Fee Preview
            </h2>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {formData.className || "Class Name"}
                  </h3>
                  {formData.category && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-2">
                      {formData.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Admission Fee</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formData.admissionFee || "Rs. 0"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Monthly Fee</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formData.monthlyFee || "Rs. 0"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Other Charges</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formData.otherCharges || "Rs. 0"}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg border border-blue-600">
                  <p className="text-sm text-white mb-1">Total Annual</p>
                  <p className="text-xl font-bold text-white">
                    {formData.totalAnnual || "Rs. 0"}
                  </p>
                </div>
              </div>

              {formData.description && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-2">Description:</p>
                  <p className="text-gray-800">{formData.description}</p>
                </div>
              )}
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
                  Save Fee Structure
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}