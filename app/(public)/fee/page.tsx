'use client';

import { useState, useEffect, useRef } from 'react';

// Color palette
const colors = {
  primaryBlue: "#2563EB",
  secondaryTeal: "#0D9488",
  accentGreen: "#16A34A",
  background: "#F9FAFB",
  card: "#FFFFFF",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
};

// Types
interface FeeItem {
  id: number;
  className: string;
  category: string;
  admissionFee: number;
  monthlyFee: number;
  otherCharges: number;
  description: string;
  annualFee: number;
  totalAnnual: number;
  formattedAdmissionFee: string;
  formattedMonthlyFee: string;
  formattedAnnualFee: string;
  formattedOtherCharges: string;
  formattedTotalAnnual: string;
}

interface FeeData {
  currency: string;
  schoolName: string;
  feeStructure: FeeItem[];
}

interface ApiResponse {
  success: boolean;
  data: FeeData;
  count: number;
  total: number;
  timestamp: string;
}

// Skeleton Loading Components
function FeeCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-full flex flex-col">
      <div className="h-48 bg-gray-300 animate-pulse"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded mb-3 animate-pulse w-3/4"></div>
        <div className="mt-auto">
          <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

function DetailCardSkeleton() {
  return (
    <div className="p-4 md:p-6 rounded-xl bg-white border border-gray-200">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-300 animate-pulse mr-3"></div>
        <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
      </div>
      <div className="h-8 bg-gray-300 rounded mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
    </div>
  );
}

export default function FeePage() {
  const [selectedClass, setSelectedClass] = useState<FeeItem | null>(null);
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDesktopList, setShowDesktopList] = useState(false);
  const dropdownRef = useRef<HTMLSelectElement>(null);

  // Fetch fee data
  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/fee');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to fetch fee data');
      }
      
      setFeeData(result.data);
      // Set first class as selected by default
      if (result.data.feeStructure.length > 0) {
        setSelectedClass(result.data.feeStructure[0]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load fee information');
    } finally {
      setLoading(false);
    }
  };

  // Handle class selection
  const handleClassSelect = (selectedClassItem: FeeItem) => {
    setSelectedClass(selectedClassItem);
    // Scroll to top of fee details section
    const feeDetailsSection = document.getElementById('fee-details-section');
    if (feeDetailsSection) {
      feeDetailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!feeData) return;
    const selected = feeData.feeStructure.find(c => c.id === parseInt(e.target.value));
    if (selected) {
      handleClassSelect(selected);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchFeeData}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Always visible */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            School Fee Structure
          </h1>
          {loading ? (
            <div className="h-6 bg-gray-300 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
          ) : feeData ? (
            <p className="text-gray-600 text-base sm:text-lg">
              Transparent and comprehensive fee information for all classes
            </p>
          ) : null}
        </div>

        {/* Class Selection Section - Always visible */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                  Select Class
                </h2>
                <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                  {loading ? 'Loading classes...' : 'Choose a class to view detailed fee structure'}
                </p>
              </div>
              
              {!loading && feeData && (
                <button
                  onClick={() => setShowDesktopList(!showDesktopList)}
                  className="hidden md:inline-flex items-center px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border"
                  style={{ 
                    color: colors.primaryBlue,
                    borderColor: colors.border
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showDesktopList ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                  {showDesktopList ? 'Hide Class List' : 'Show Class List'}
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ) : feeData ? (
              <>
                {/* Mobile: Horizontal Scrollable Menu */}
                <div className="md:hidden mb-6">
                  <div className="relative">
                    <div className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide -mx-2 px-2">
                      {feeData.feeStructure.map((classItem) => (
                        <button
                          key={classItem.id}
                          onClick={() => handleClassSelect(classItem)}
                          className={`flex-shrink-0 px-5 py-3 rounded-xl transition-all min-w-fit ${
                            selectedClass?.id === classItem.id
                              ? 'ring-2 ring-offset-2'
                              : 'hover:shadow-md'
                          }`}
                          style={{
                            backgroundColor: selectedClass?.id === classItem.id 
                              ? colors.primaryBlue 
                              : 'white',
                            border: `1px solid ${
                              selectedClass?.id === classItem.id 
                                ? colors.primaryBlue 
                                : colors.border
                            }`,
                            color: selectedClass?.id === classItem.id 
                              ? 'white' 
                              : colors.textPrimary,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <div className="font-medium text-sm">
                            {classItem.className}
                          </div>
                          <div className="text-xs opacity-90 mt-1">
                            {classItem.category}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Desktop: Dropdown */}
                <div className="hidden md:block mb-6">
                  <div className="relative">
                    <select
                      ref={dropdownRef}
                      value={selectedClass?.id || ''}
                      onChange={handleDropdownChange}
                      className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:outline-none appearance-none"
                      style={{
                        borderColor: colors.primaryBlue,
                        color: colors.textPrimary,
                        backgroundColor: 'white',
                        fontSize: '16px',
                      }}
                    >
                      {feeData.feeStructure.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.className} ({classItem.category})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5" style={{ color: colors.primaryBlue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Desktop Class List (Optional View) */}
                {showDesktopList && (
                  <div className="mt-6 border-t pt-6" style={{ borderColor: colors.border }}>
                    <h3 className="font-medium mb-4" style={{ color: colors.textSecondary }}>
                      Quick Class Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {feeData.feeStructure.map((classItem) => (
                        <button
                          key={classItem.id}
                          onClick={() => handleClassSelect(classItem)}
                          className={`text-left p-3 rounded-lg transition-all duration-300 ${
                            selectedClass?.id === classItem.id
                              ? 'ring-2 transform scale-[1.02]'
                              : 'hover:bg-gray-50'
                          }`}
                          style={{
                            backgroundColor: selectedClass?.id === classItem.id 
                              ? `${colors.primaryBlue}10` 
                              : 'transparent',
                            border: `1px solid ${
                              selectedClass?.id === classItem.id 
                                ? colors.primaryBlue 
                                : colors.border
                            }`,
                          }}
                        >
                          <div className="font-medium text-sm" style={{ 
                            color: selectedClass?.id === classItem.id 
                              ? colors.primaryBlue 
                              : colors.textPrimary 
                          }}>
                            {classItem.className}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                              backgroundColor: 
                                classItem.category === 'Pre-School' ? `${colors.accentGreen}15` :
                                classItem.category === 'Primary' ? `${colors.primaryBlue}15` :
                                classItem.category === 'Middle School' ? `${colors.secondaryTeal}15` :
                                `${colors.accentGreen}15`,
                              color: 
                                classItem.category === 'Pre-School' ? colors.accentGreen :
                                classItem.category === 'Primary' ? colors.primaryBlue :
                                classItem.category === 'Middle School' ? colors.secondaryTeal :
                                colors.accentGreen,
                            }}>
                              {classItem.category}
                            </span>
                            <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                              {classItem.formattedTotalAnnual}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Selected Class Fee Details */}
        <div id="fee-details-section" className="mt-8">
          {loading ? (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.border }}>
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <DetailCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : selectedClass && feeData ? (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b" style={{ borderColor: colors.border }}>
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm px-3 py-1 rounded-full mr-3" style={{ 
                      backgroundColor: 
                        selectedClass.category === 'Pre-School' ? `${colors.accentGreen}15` :
                        selectedClass.category === 'Primary' ? `${colors.primaryBlue}15` :
                        selectedClass.category === 'Middle School' ? `${colors.secondaryTeal}15` :
                        `${colors.accentGreen}15`,
                      color: 
                        selectedClass.category === 'Pre-School' ? colors.accentGreen :
                        selectedClass.category === 'Primary' ? colors.primaryBlue :
                        selectedClass.category === 'Middle School' ? colors.secondaryTeal :
                        colors.accentGreen,
                    }}>
                      {selectedClass.category}
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      Annual Total
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold" style={{ color: colors.textPrimary }}>
                    {selectedClass.className}
                  </h2>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-3xl md:text-4xl font-bold" style={{ color: colors.primaryBlue }}>
                    {selectedClass.formattedTotalAnnual}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Total Annual Fee</div>
                </div>
              </div>

              <p className="text-lg mb-8" style={{ color: colors.textSecondary }}>
                {selectedClass.description}
              </p>

              {/* Fee Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="p-4 md:p-6 rounded-xl" style={{ backgroundColor: `${colors.primaryBlue}05`, border: `1px solid ${colors.primaryBlue}20` }}>
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mr-2 md:mr-3" style={{ backgroundColor: colors.primaryBlue }}>
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>Admission</h3>
                  </div>
                  <div className="text-xl md:text-2xl font-bold" style={{ color: colors.primaryBlue }}>{selectedClass.formattedAdmissionFee}</div>
                  <p className="text-xs md:text-sm mt-2" style={{ color: colors.textSecondary }}>
                    One-time fee (non-refundable)
                  </p>
                </div>

                <div className="p-4 md:p-6 rounded-xl" style={{ backgroundColor: `${colors.secondaryTeal}05`, border: `1px solid ${colors.secondaryTeal}20` }}>
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mr-2 md:mr-3" style={{ backgroundColor: colors.secondaryTeal }}>
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>Monthly</h3>
                  </div>
                  <div className="text-xl md:text-2xl font-bold" style={{ color: colors.secondaryTeal }}>{selectedClass.formattedMonthlyFee}</div>
                  <p className="text-xs md:text-sm mt-2" style={{ color: colors.textSecondary }}>
                    × 12 months = {selectedClass.formattedAnnualFee}
                  </p>
                </div>

                <div className="p-4 md:p-6 rounded-xl" style={{ backgroundColor: `${colors.accentGreen}05`, border: `1px solid ${colors.accentGreen}20` }}>
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mr-2 md:mr-3" style={{ backgroundColor: colors.accentGreen }}>
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>Other Charges</h3>
                  </div>
                  <div className="text-xl md:text-2xl font-bold" style={{ color: colors.accentGreen }}>{selectedClass.formattedOtherCharges}</div>
                  <p className="text-xs md:text-sm mt-2" style={{ color: colors.textSecondary }}>
                    Annual charges (exams, activities, etc.)
                  </p>
                </div>

                <div className="p-4 md:p-6 rounded-xl" style={{ backgroundColor: `${colors.primaryBlue}10`, border: `2px solid ${colors.primaryBlue}` }}>
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mr-2 md:mr-3" style={{ backgroundColor: colors.primaryBlue }}>
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>Annual Total</h3>
                  </div>
                  <div className="text-xl md:text-2xl font-bold" style={{ color: colors.primaryBlue }}>{selectedClass.formattedTotalAnnual}</div>
                  <p className="text-xs md:text-sm mt-2" style={{ color: colors.textSecondary }}>
                    Complete yearly fee
                  </p>
                </div>
              </div>

              {/* Important Notes Section */}
              <div className="mt-8">
                <div className="p-6 rounded-xl" style={{ 
                  backgroundColor: `${colors.primaryBlue}05`, 
                  border: `2px solid ${colors.primaryBlue}20` 
                }}>
                  <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: colors.primaryBlue }}>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Important Notes & Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3 text-lg flex items-center" style={{ color: colors.textPrimary }}>
                        <span className="mr-2">📋</span>
                        General Information:
                      </h4>
                      <ul className="space-y-2 text-sm md:text-base" style={{ color: colors.textSecondary }}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>All fees are for the current academic year</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Admission fee is one-time and non-refundable</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Monthly fee is payable by the 10th of each month</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3 text-lg flex items-center" style={{ color: colors.textPrimary }}>
                        <span className="mr-2">💰</span>
                        Payment & Discounts:
                      </h4>
                      <ul className="space-y-2 text-sm md:text-base" style={{ color: colors.textSecondary }}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Sibling discount:</strong> 10% for second child</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Early bird discount:</strong> 5% if paid annually in advance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Fee paid in Sindh bank</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}