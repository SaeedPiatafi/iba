// app/web-admin/fees/new/page.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// Icons
const BackIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

interface FeeFormData {
  class: string;
  category: string;
  admissionFee: string;
  monthlyFee: string;
  annualFee: string;
  otherCharges: string;
  totalAnnual: string;
  description: string;
  isActive: boolean;
}

export default function NewFeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FeeFormData>({
    class: '',
    category: '',
    admissionFee: '',
    monthlyFee: '',
    annualFee: '',
    otherCharges: '',
    totalAnnual: '',
    description: '',
    isActive: true,
  });

  const parseCurrencyToNumber = (value: string): number => {
    if (typeof value !== 'string') return 0;
    const cleaned = value.replace(/[^\d]/g, '');
    return parseInt(cleaned) || 0;
  };

  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Type assertion for checkbox
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'monthlyFee' || name === 'otherCharges' || name === 'admissionFee') {
      // Calculate annual and total automatically
      const monthlyFee = name === 'monthlyFee' ? value : formData.monthlyFee;
      const otherCharges = name === 'otherCharges' ? value : formData.otherCharges;
      const admissionFee = name === 'admissionFee' ? value : formData.admissionFee;
      
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
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        annualFee,
        totalAnnual
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure all calculations are done
    const monthlyNum = parseCurrencyToNumber(formData.monthlyFee);
    const admissionNum = parseCurrencyToNumber(formData.admissionFee);
    const otherNum = parseCurrencyToNumber(formData.otherCharges);
    
    const annualNum = monthlyNum * 12;
    const totalNum = admissionNum + annualNum + otherNum;
    
    const finalFormData: FeeFormData = {
      ...formData,
      annualFee: formData.annualFee || formatCurrency(annualNum),
      totalAnnual: formData.totalAnnual || formatCurrency(totalNum)
    };
    
    // In real app, submit to API
    console.log('Fee Data:', finalFormData);
    
    setTimeout(() => {
      setLoading(false);
      router.push('/web-admin/fees');
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  const categories: string[] = ['Pre-School', 'Primary', 'Middle School', 'Secondary', 'Higher Secondary'];
  const classOptions: string[] = [
    'PG (Play Group)', 'KG (Kindergarten)', 
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8',
    'Class 9', 'Class 10',
    'Class 11', 'Class 12'
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Fee Structure</h1>
          <p className="text-gray-600">Fill in the fee details for a specific class</p>
        </div>

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
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select Class</option>
                  {classOptions.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
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
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
                <p className="mt-1 text-sm text-gray-500">Annual: {formData.annualFee || 'Rs. 0'}</p>
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

              {/* Status */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    id="isActive"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Fee Structure (Visible on public site)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fee Preview</h2>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{formData.class || 'Class Name'}</h3>
                  {formData.category && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-2">
                      {formData.category}
                    </span>
                  )}
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Admission Fee</p>
                  <p className="text-lg font-bold text-gray-900">{formData.admissionFee || 'Rs. 0'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Monthly Fee</p>
                  <p className="text-lg font-bold text-gray-900">{formData.monthlyFee || 'Rs. 0'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Other Charges</p>
                  <p className="text-lg font-bold text-gray-900">{formData.otherCharges || 'Rs. 0'}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg border border-blue-600">
                  <p className="text-sm text-white mb-1">Total Annual</p>
                  <p className="text-xl font-bold text-white">{formData.totalAnnual || 'Rs. 0'}</p>
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