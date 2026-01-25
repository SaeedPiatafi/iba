// components/AdmissionRequirements.tsx
'use client';

import { useState } from 'react';

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

  // Admission process steps
  const admissionSteps = [
    {
      step: 1,
      title: "Application Form Submission",
      description: "Fill out and submit the admission application form either online or collect it from school office",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      step: 2,
      title: "Document Submission",
      description: "Submit all required documents along with the application form",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      step: 3,
      title: "Entrance Test",
      description: "Appear for the admission entrance test (for classes 1-12)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      step: 4,
      title: "Result Announcement & Fee Payment",
      description: "Receive admission result and complete fee payment to secure admission",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  // Document requirements - All in one list
  const documentRequirements = [
    "Birth Certificate (Original + 2 copies) - For all classes",
    "B-Form / Child Registration Certificate (CRC) - For all classes",
    "6 Passport-size photographs (blue background) - For all classes",
    "Previous School Leaving Certificate (if applicable) - For all classes",
    "Previous School Report Card / Transcript - For all classes",
    "Character Certificate from previous school - For Class 1-10",
    "Immunization Record - For Class 1 only",
    "Class 8 Mark Sheet & Certificate - For Class 9-10",
    "Transfer Certificate from previous school - For Class 9-12",
    "Matriculation (Class 10) Certificate & Marks Sheet - For Class 11-12",
    "Father's CNIC copy - For Class 9-12",
    "Migration Certificate (if from other board) - For Class 11-12"
  ];

  // Important dates
  const importantDates = [
    { date: "March 1, 2024", event: "Admission applications open" },
    { date: "April 15, 2024", event: "Last date for submission" },
    { date: "April 20-25, 2024", event: "Entrance tests (Classes 1-12)" },
    { date: "May 5, 2024", event: "Admission results announced" },
    { date: "May 10-15, 2024", event: "Fee submission deadline" },
    { date: "August 1, 2024", event: "Academic year begins" }
  ];

  // Eligibility criteria - without age column
  const eligibilityCriteria = [
    { class: "Class 1", requirement: "Must have completed Kindergarten" },
    { class: "Class 6", requirement: "Passed Class 5 with minimum 60%" },
    { class: "Class 9", requirement: "Passed Class 8 with minimum 60%" },
    { class: "Class 11 Science", requirement: "Passed Matric with minimum 70% in Science subjects" },
    { class: "Class 11 Commerce", requirement: "Passed Matric with minimum 65%" },
    { class: "Class 11 Arts", requirement: "Passed Matric with minimum 60%" }
  ];

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
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

            {/* Steps Timeline - Desktop */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1" style={{ backgroundColor: colors.border }}></div>
                
                {/* Steps */}
                <div className="space-y-12">
                  {admissionSteps.map((step, index) => (
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
                          {step.icon}
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
                  {admissionSteps.map((step) => (
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
                                {step.icon}
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
                <ul className="space-y-3">
                  {documentRequirements.map((doc, index) => (
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

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: colors.background }}>
                      <th className="py-3 px-4 text-left font-bold" style={{ color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}>Class</th>
                      <th className="py-3 px-4 text-left font-bold" style={{ color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}>Academic Requirement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibilityCriteria.map((criteria, index) => (
                      <tr key={index} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
                        <td className="py-3 px-4 font-medium" style={{ color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}>{criteria.class}</td>
                        <td className="py-3 px-4" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>{criteria.requirement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

              <div className="space-y-4">
                {importantDates.map((item, index) => (
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