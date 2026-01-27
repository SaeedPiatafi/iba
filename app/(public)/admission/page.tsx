// components/AdmissionRequirements.tsx
'use client';

import { useState, useEffect } from 'react';

interface AdmissionStep {
  step: number;
  title: string;
  description: string;
}

interface ImportantDate {
  date: string;
  event: string;
}

interface EligibilityCriteria {
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

export default function AdmissionRequirements() {
  // Color palette
  const colors = {
    primaryBlue: "#2563EB",
    secondaryTeal: "#0D9488",
    accentGreen: "#16A34A",
    accentYellow: "#F59E0B",
    background: "#F9FAFB",
    card: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
  };

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdmissionData | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchAdmissionData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admission');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to load admission data');
        }
        
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admission data');
        console.error('Error fetching admission data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionData();
  }, []);

  // Get step icon based on step number
  const getStepIcon = (stepNumber: number) => {
    switch(stepNumber) {
      case 1:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 2:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 3:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 4:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  // Skeleton Loading Components
  const StepSkeleton = () => (
    <div className="hidden md:block">
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
        <div className="space-y-12">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`flex items-center ${step % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-1/2 ${step % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                <div className={`inline-block p-6 rounded-xl bg-gray-100 animate-pulse w-full max-w-md ${step % 2 === 0 ? 'float-right' : 'float-left'}`}>
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-gray-300 mx-6"></div>
              <div className="w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MobileStepSkeleton = () => (
    <div className="md:hidden">
      <div className="relative pl-8">
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-200"></div>
        <div className="space-y-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="relative">
              <div className="absolute left-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gray-300"></div>
              <div className="ml-8">
                <div className="p-5 rounded-xl bg-gray-100 animate-pulse">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
                    <div className="h-5 bg-gray-300 rounded w-2/3"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DocumentSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="flex items-start p-2 animate-pulse">
          <div className="mr-3 mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-gray-300"></div>
          <div className="h-5 bg-gray-300 rounded w-full"></div>
        </div>
      ))}
    </div>
  );

  const EligibilitySkeleton = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left">
              <div className="h-6 bg-gray-300 rounded w-24"></div>
            </th>
            <th className="py-3 px-4 text-left">
              <div className="h-6 bg-gray-300 rounded w-48"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <tr key={row} className={row % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-300 rounded w-32"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-5 bg-gray-300 rounded w-full"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const DateSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="flex items-start p-3 animate-pulse">
          <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-300 mr-4"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-12 md:py-16 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Error Loading Admission Information</h3>
          <p className="mb-4" style={{ color: colors.textSecondary }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: colors.primaryBlue,
              color: 'white'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - No skeleton loading */}
        <div className="text-center mb-8 md:mb-12">
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ 
              color: colors.textPrimary,
              fontFamily: "var(--font-montserrat)",
              lineHeight: "1.2"
            }}
          >
            Admission Requirements & Procedure
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            Everything you need to know about admission process, required documents, and important dates
          </p>
        </div>

        {/* Admission Process Steps */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: `${colors.primaryBlue}15` }}>
                <svg className="w-6 h-6" style={{ color: colors.primaryBlue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: colors.textPrimary }}>Admission Procedure</h2>
                <p className="text-sm md:text-base" style={{ color: colors.textSecondary }}>Step-by-step guide to secure admission</p>
              </div>
            </div>

            {/* Loading skeleton or actual content */}
            {loading ? (
              <>
                <StepSkeleton />
                <MobileStepSkeleton />
              </>
            ) : data ? (
              <>
                {/* Steps Timeline - Desktop */}
                <div className="hidden md:block">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1" style={{ backgroundColor: colors.border }}></div>
                    
                    {/* Steps */}
                    <div className="space-y-12">
                      {data.admissionSteps.map((step, index) => (
                        <div 
                          key={step.step} 
                          className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                        >
                          {/* Step Content */}
                          <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                            <div className={`inline-block p-6 rounded-xl ${index % 2 === 0 ? 'text-right' : 'text-left'}`} 
                              style={{ 
                                backgroundColor: `${colors.primaryBlue}05`,
                                border: `1px solid ${colors.border}`
                              }}>
                              <div className="flex items-center mb-2">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.primaryBlue }}>
                                  <div className="text-white font-bold">{step.step}</div>
                                </div>
                                <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{step.title}</h3>
                              </div>
                              <p className="mb-3" style={{ color: colors.textSecondary }}>{step.description}</p>
                            </div>
                          </div>
                          
                          {/* Step Circle */}
                          <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mx-6" 
                            style={{ 
                              backgroundColor: colors.primaryBlue,
                              border: `4px solid ${colors.background}`
                            }}>
                            <div className="text-white">
                              {getStepIcon(step.step)}
                            </div>
                          </div>
                          
                          {/* Empty Space */}
                          <div className="w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Steps Timeline - Mobile */}
                <div className="md:hidden">
                  <div className="relative pl-8">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-1" style={{ backgroundColor: colors.border }}></div>
                    
                    {/* Steps */}
                    <div className="space-y-8">
                      {data.admissionSteps.map((step) => (
                        <div key={step.step} className="relative">
                          {/* Step Circle */}
                          <div className="absolute left-0 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center" 
                            style={{ 
                              backgroundColor: colors.primaryBlue,
                              border: `3px solid ${colors.background}`
                            }}>
                            <div className="text-white text-xs font-bold">{step.step}</div>
                          </div>
                          
                          {/* Step Content */}
                          <div className="ml-8">
                            <div className="p-5 rounded-xl" 
                              style={{ 
                                backgroundColor: `${colors.primaryBlue}05`,
                                border: `1px solid ${colors.border}`
                              }}>
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.primaryBlue }}>
                                  <div className="text-white">
                                    {getStepIcon(step.step)}
                                  </div>
                                </div>
                                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{step.title}</h3>
                              </div>
                              <p className="text-sm" style={{ color: colors.textSecondary }}>{step.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Document Requirements & Eligibility */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Document Requirements - Single Box */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: `${colors.accentGreen}15` }}>
                  <svg className="w-6 h-6" style={{ color: colors.accentGreen }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Document Requirements</h2>
                  <p className="text-sm md:text-base" style={{ color: colors.textSecondary }}>All required documents for admission</p>
                </div>
              </div>

              {/* Single Document Requirements Box */}
              <div className="p-5 rounded-lg" 
                style={{ 
                  backgroundColor: `${colors.background}`,
                  border: `1px solid ${colors.border}`
                }}>
                <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: colors.primaryBlue }}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Required Documents for Admission
                </h3>
                
                {loading ? (
                  <DocumentSkeleton />
                ) : data ? (
                  <ul className="space-y-3">
                    {data.documentRequirements.map((doc, index) => (
                      <li key={index} className="flex items-start p-2 hover:bg-gray-50 rounded transition-colors">
                        <span className="mr-3 mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" 
                          style={{ 
                            backgroundColor: `${colors.primaryBlue}15`,
                            color: colors.primaryBlue
                          }}>
                          {index + 1}
                        </span>
                        <span style={{ color: colors.textSecondary }}>{doc}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="mt-6 p-4 rounded-lg" 
                style={{ 
                  backgroundColor: `${colors.accentYellow}05`,
                  border: `1px solid ${colors.accentYellow}20`
                }}>
                <p className="text-sm flex items-center" style={{ color: colors.textPrimary }}>
                  <svg className="w-5 h-5 mr-2" style={{ color: colors.accentYellow }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span><strong>Note:</strong> All documents must be original or attested copies. Photocopies should be clear and readable.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria & Important Dates */}
          <div className="space-y-8">
            {/* Eligibility Criteria - Without Age Column */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: `${colors.secondaryTeal}15` }}>
                  <svg className="w-6 h-6" style={{ color: colors.secondaryTeal }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Eligibility Criteria</h2>
                  <p className="text-sm md:text-base" style={{ color: colors.textSecondary }}>Academic requirements for admission</p>
                </div>
              </div>

              {loading ? (
                <EligibilitySkeleton />
              ) : data ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: colors.background }}>
                        <th className="py-3 px-4 text-left font-bold" style={{ color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}>Class</th>
                        <th className="py-3 px-4 text-left font-bold" style={{ color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}>Academic Requirement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.eligibilityCriteria.map((criteria, index) => (
                        <tr key={index} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
                          <td className="py-3 px-4 font-medium" style={{ color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}>{criteria.class}</td>
                          <td className="py-3 px-4" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>{criteria.requirement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              <div className="mt-4 text-sm" style={{ color: colors.textSecondary }}>
                <p>Note: Admission test required for classes 1-12. Minimum percentage requirements must be met.</p>
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: `${colors.accentYellow}15` }}>
                  <svg className="w-6 h-6" style={{ color: colors.accentYellow }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Important Dates</h2>
                  <p className="text-sm md:text-base" style={{ color: colors.textSecondary }}>Admission timeline for 2024-25</p>
                </div>
              </div>

              {loading ? (
                <DateSkeleton />
              ) : data ? (
                <div className="space-y-4">
                  {data.importantDates.map((item, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg flex flex-col items-center justify-center mr-4" 
                        style={{ 
                          backgroundColor: `${colors.primaryBlue}10`,
                          color: colors.primaryBlue
                        }}>
                        <div className="text-lg font-bold">{item.date.split(' ')[1]}</div>
                        <div className="text-xs">{item.date.split(' ')[0]}</div>
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: colors.textPrimary }}>{item.event}</div>
                        <div className="text-sm" style={{ color: colors.textSecondary }}>{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Contact & Additional Information - Simplified */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>
            Additional Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.primaryBlue }}>
                Admission Test Details
              </h3>
              <ul className="space-y-3" style={{ color: colors.textSecondary }}>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Test duration: 2 hours for classes 1-8, 3 hours for classes 9-12</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Subjects: English, Mathematics, Science (for relevant classes)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Bring original CNIC/B-Form and 2 passport photos on test day</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Test results announced within 5 working days</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.primaryBlue }}>
                Fee Information
              </h3>
              <ul className="space-y-3" style={{ color: colors.textSecondary }}>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Admission fee must be paid within 7 days of acceptance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>10% sibling discount available for second child</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Fee can be paid in installments upon request</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Fee paid in Sindh Bank branches only</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
              For Queries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>Email:</p>
                <p className="font-medium" style={{ color: colors.primaryBlue }}>admissions@ibaschool.edu.pk</p>
              </div>
              <div>
                <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>Phone:</p>
                <p className="font-medium" style={{ color: colors.primaryBlue }}>021-111-222-333</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}