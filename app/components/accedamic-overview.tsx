"use client";

import React from 'react';

const AcademicOverview = () => {
  const academicLevels = [
    {
      level: "Pre-School",
      classes: "KG - Class 1",
      board: "Montessori & Early Learning",
      color: "bg-[#FEF3C7]",
      icon: (
        <svg className="w-6 h-6 text-[#D97706]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0012 2H7zM5 6.172V4h10v2.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063a2 2 0 00.586-1.414H6.828a2 2 0 00.586 1.414L8.88 9.707a2 2 0 01-.586 1.414L5.12 14.12a3 3 0 01-2.122.879H4.83a2 2 0 001.415-3.414l4-4a3 3 0 00.879-2.121V6.172z" clipRule="evenodd" />
        </svg>
      ),
      description: "Play-based learning and foundational skills"
    },
    {
      level: "Primary",
      classes: "Class 2 - Class 5",
      board: "Sukkur Board Curriculum",
      color: "bg-[#DBEAFE]",
      icon: (
        <svg className="w-6 h-6 text-[#2563EB]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
      description: "Core subjects with emphasis on literacy and numeracy"
    },
    {
      level: "Middle",
      classes: "Class 6 - Class 8",
      board: "Sukkur Board Curriculum",
      color: "bg-[#D1FAE5]",
      icon: (
        <svg className="w-6 h-6 text-[#0D9488]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      description: "Expanded curriculum with introduction to sciences"
    },
    {
      level: "Secondary",
      classes: "Class 9 - Class 10",
      board: " Aga Khan Board",
      color: "bg-[#F3E8FF]",
      icon: (
        <svg className="w-6 h-6 text-[#8B5CF6]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      ),
      description: "Matriculation preparation with practical lectures"
    },
    {
      level: "Higher Secondary",
      classes: "Class 11 - Class 12",
      board: "Aga Khan Board",
      color: "bg-[#FCE7F3]",
      icon: (
        <svg className="w-6 h-6 text-[#EC4899]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      ),
      description: "Intermediate (F.Sc) with specialization"
    }
  ];


  return (
    <div className="min-h-[50vh] bg-white py-5 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-3">
            Academic Overview
          </h2>
          <p className="text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto">
            Comprehensive education from KG to 12th grade with dual board options
          </p>
        </div>

        {/* Academic Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {academicLevels.map((level, index) => (
            <div 
              key={index} 
              className={`${level.color} rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-white">
                  {level.icon}
                </div>
               
              </div>
              
              <h3 className="font-bold text-[#1F2937] text-lg mb-1">
                {level.level}
              </h3>
              
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700">
                  {level.classes}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {level.board}
                </p>
              </div>
              
              <p className="text-xs text-gray-600 leading-relaxed">
                {level.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicOverview;