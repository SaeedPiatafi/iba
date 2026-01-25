// components/FeeStructure.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function FeeStructure() {
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

  // School fee structure data (KG to Class 12)
  const schoolFeeStructure = [
    {
      class: "KG (Kindergarten)",
      category: "Pre-School",
      admissionFee: "Rs. 15,000",
      monthlyFee: "Rs. 8,000",
      annualFee: "Rs. 96,000",
      otherCharges: "Rs. 5,000",
      totalAnnual: "Rs. 116,000",
      description: "Includes basic learning materials, art supplies, and activity fees"
    },
    {
      class: "PG (Play Group)",
      category: "Pre-School",
      admissionFee: "Rs. 12,000",
      monthlyFee: "Rs. 7,000",
      annualFee: "Rs. 84,000",
      otherCharges: "Rs. 4,500",
      totalAnnual: "Rs. 100,500",
      description: "Includes play materials, story books, and creative activities"
    },
    {
      class: "Class 1",
      category: "Primary",
      admissionFee: "Rs. 18,000",
      monthlyFee: "Rs. 9,000",
      annualFee: "Rs. 108,000",
      otherCharges: "Rs. 7,000",
      totalAnnual: "Rs. 133,000",
      description: "Includes textbooks, notebook, and basic stationery"
    },
    {
      class: "Class 2",
      category: "Primary",
      admissionFee: "Rs. 18,000",
      monthlyFee: "Rs. 9,000",
      annualFee: "Rs. 108,000",
      otherCharges: "Rs. 7,500",
      totalAnnual: "Rs. 133,500",
      description: "Includes textbooks, notebook, and basic stationery"
    },
    {
      class: "Class 3",
      category: "Primary",
      admissionFee: "Rs. 20,000",
      monthlyFee: "Rs. 10,000",
      annualFee: "Rs. 120,000",
      otherCharges: "Rs. 8,000",
      totalAnnual: "Rs. 148,000",
      description: "Includes textbooks, science kit, and art materials"
    },
    {
      class: "Class 4",
      category: "Primary",
      admissionFee: "Rs. 20,000",
      monthlyFee: "Rs. 10,000",
      annualFee: "Rs. 120,000",
      otherCharges: "Rs. 8,500",
      totalAnnual: "Rs. 148,500",
      description: "Includes textbooks, science kit, and art materials"
    },
    {
      class: "Class 5",
      category: "Primary",
      admissionFee: "Rs. 22,000",
      monthlyFee: "Rs. 11,000",
      annualFee: "Rs. 132,000",
      otherCharges: "Rs. 9,000",
      totalAnnual: "Rs. 163,000",
      description: "Includes textbooks, computer lab, and sports equipment"
    },
    {
      class: "Class 6",
      category: "Middle School",
      admissionFee: "Rs. 25,000",
      monthlyFee: "Rs. 12,000",
      annualFee: "Rs. 144,000",
      otherCharges: "Rs. 10,000",
      totalAnnual: "Rs. 179,000",
      description: "Includes science lab, computer lab, and library access"
    },
    {
      class: "Class 7",
      category: "Middle School",
      admissionFee: "Rs. 25,000",
      monthlyFee: "Rs. 12,000",
      annualFee: "Rs. 144,000",
      otherCharges: "Rs. 10,500",
      totalAnnual: "Rs. 179,500",
      description: "Includes science lab, computer lab, and library access"
    },
    {
      class: "Class 8",
      category: "Middle School",
      admissionFee: "Rs. 28,000",
      monthlyFee: "Rs. 13,000",
      annualFee: "Rs. 156,000",
      otherCharges: "Rs. 11,000",
      totalAnnual: "Rs. 195,000",
      description: "Includes advanced science lab and computer facilities"
    },
    {
      class: "Class 9",
      category: "Secondary",
      admissionFee: "Rs. 30,000",
      monthlyFee: "Rs. 15,000",
      annualFee: "Rs. 180,000",
      otherCharges: "Rs. 15,000",
      totalAnnual: "Rs. 225,000",
      description: "Includes science labs, computer lab, and career counseling"
    },
    {
      class: "Class 10",
      category: "Secondary",
      admissionFee: "Rs. 30,000",
      monthlyFee: "Rs. 15,000",
      annualFee: "Rs. 180,000",
      otherCharges: "Rs. 16,000",
      totalAnnual: "Rs. 226,000",
      description: "Includes board exam preparation and career counseling"
    },
    {
      class: "Class 11",
      category: "Higher Secondary",
      admissionFee: "Rs. 35,000",
      monthlyFee: "Rs. 18,000",
      annualFee: "Rs. 216,000",
      otherCharges: "Rs. 20,000",
      totalAnnual: "Rs. 271,000",
      description: "Science/Commerce/Arts streams with specialized labs"
    },
    {
      class: "Class 12",
      category: "Higher Secondary",
      admissionFee: "Rs. 35,000",
      monthlyFee: "Rs. 18,000",
      annualFee: "Rs. 216,000",
      otherCharges: "Rs. 22,000",
      totalAnnual: "Rs. 273,000",
      description: "Board exam preparation, university counseling, and career guidance"
    }
  ];

  const [selectedClass, setSelectedClass] = useState(schoolFeeStructure[0]);
  const [showDesktopList, setShowDesktopList] = useState(false);
  const dropdownRef = useRef<HTMLSelectElement>(null);

  // Handle class selection
  const handleClassSelect = (selectedClassItem: typeof schoolFeeStructure[0]) => {
    setSelectedClass(selectedClassItem);
    // Scroll to top of fee details section
    const feeDetailsSection = document.getElementById('fee-details-section');
    if (feeDetailsSection) {
      feeDetailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = schoolFeeStructure.find(c => c.class === e.target.value);
    if (selected) {
      handleClassSelect(selected);
    }
  };

  return (
    <div className="py-16 md:py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{
              color: colors.textPrimary,
              fontFamily: "var(--font-montserrat)",
              lineHeight: "1.2",
            }}
          >
            School Fee Details
          </h1>
        </div>

        {/* Class Selection - Dropdown for both mobile and desktop */}
       {/* Class Selection - Different for mobile vs desktop */}
<div className="mb-8">
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="mb-4 md:mb-0">
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Select Class
        </h2>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          Choose a class to view detailed fee structure
        </p>
      </div>
      
      {/* Desktop Toggle Button (Optional) */}
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
    </div>
    
    {/* Mobile: Horizontal Scrollable Menu */}
    <div className="md:hidden mb-6">
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide -mx-2 px-2">
          {schoolFeeStructure.map((classItem, index) => (
            <button
              key={index}
              onClick={() => handleClassSelect(classItem)}
              className={`flex-shrink-0 px-5 py-3 rounded-xl transition-all min-w-fit ${
                selectedClass.class === classItem.class
                  ? 'ring-2 ring-offset-2'
                  : 'hover:shadow-md'
              }`}
              style={{
                backgroundColor: selectedClass.class === classItem.class 
                  ? colors.primaryBlue 
                  : 'white',
                border: `1px solid ${
                  selectedClass.class === classItem.class 
                    ? colors.primaryBlue 
                    : colors.border
                }`,
                color: selectedClass.class === classItem.class 
                  ? 'white' 
                  : colors.textPrimary,
                whiteSpace: 'nowrap'
              }}
            >
              <div className="font-medium text-sm">
                {classItem.class}
              </div>
              <div className="text-xs opacity-90 mt-1">
                {classItem.category}
              </div>
            </button>
          ))}
        </div>
        
        {/* Scroll indicators */}
        <div className="flex justify-center space-x-1 mt-3">
          {[0, 1, 2].map((dot) => (
            <div 
              key={dot}
              className="w-1.5 h-1.5 rounded-full"
              style={{ 
                backgroundColor: dot === 0 ? colors.primaryBlue : colors.border 
              }}
            />
          ))}
        </div>
      </div>
    </div>
    
    {/* Desktop: Dropdown */}
    <div className="hidden md:block mb-6">
      <div className="relative">
        <select
          ref={dropdownRef}
          value={selectedClass.class}
          onChange={handleDropdownChange}
          className="w-full p-4 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:outline-none appearance-none"
          style={{
            borderColor: colors.primaryBlue,
            color: colors.textPrimary,
            backgroundColor: 'white',
            fontSize: '16px',
          }}
          size={1}
        >
          {schoolFeeStructure.map((classItem, index) => (
            <option key={index} value={classItem.class}>
              {classItem.class} ({classItem.category})
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
    

    {/* Desktop Class List (Optional View) - Keep existing */}
    {showDesktopList && (
      <div className="mt-6 border-t pt-6" style={{ borderColor: colors.border }}>
        <h3 className="font-medium mb-4" style={{ color: colors.textSecondary }}>
          Quick Class Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {schoolFeeStructure.map((classItem, index) => (
            <button
              key={index}
              onClick={() => handleClassSelect(classItem)}
              className={`text-left p-3 rounded-lg transition-all duration-300 ${
                selectedClass.class === classItem.class
                  ? 'ring-2 transform scale-[1.02]'
                  : 'hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: selectedClass.class === classItem.class 
                  ? `${colors.primaryBlue}10` 
                  : 'transparent',
                border: `1px solid ${
                  selectedClass.class === classItem.class 
                    ? colors.primaryBlue 
                    : colors.border
                }`,
              }}
            >
              <div className="font-medium text-sm" style={{ 
                color: selectedClass.class === classItem.class 
                  ? colors.primaryBlue 
                  : colors.textPrimary 
              }}>
                {classItem.class}
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
                  {classItem.totalAnnual}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

        {/* Selected Class Fee Details */}
        <div id="fee-details-section" className="mt-8">
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
                  {selectedClass.class}
                </h2>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-3xl md:text-4xl font-bold" style={{ color: colors.primaryBlue }}>
                  {selectedClass.totalAnnual}
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
                <div className="text-xl md:text-2xl font-bold" style={{ color: colors.primaryBlue }}>{selectedClass.admissionFee}</div>
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
                <div className="text-xl md:text-2xl font-bold" style={{ color: colors.secondaryTeal }}>{selectedClass.monthlyFee}</div>
                <p className="text-xs md:text-sm mt-2" style={{ color: colors.textSecondary }}>
                  × 12 months = {selectedClass.annualFee}
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
                <div className="text-xl md:text-2xl font-bold" style={{ color: colors.accentGreen }}>{selectedClass.otherCharges}</div>
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
                <div className="text-xl md:text-2xl font-bold" style={{ color: colors.primaryBlue }}>{selectedClass.totalAnnual}</div>
                <p className="text-xs md:text-sm mt-2" style={{ color: colors.textSecondary }}>
                  Complete yearly fee
                </p>
              </div>
            </div>

            {/* Important Notes Section */}
            <div className="mt-8 mb-8">
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
                    <h4 className="font-bold mb-3 text-lg" style={{ color: colors.textPrimary }}>📋 General Information:</h4>
                    <ul className="space-y-2 text-sm md:text-base" style={{ color: colors.textSecondary }}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>All fees are for the academic year 2025-26</span>
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
                    <h4 className="font-bold mb-3 text-lg" style={{ color: colors.textPrimary }}>💰 Payment & Discounts:</h4>
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
        </div>
      </div>
    </div>
  );
}