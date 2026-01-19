// app/alumni/page.jsx

"use client";

import { useState, useEffect } from 'react';
import Alumnihero from '../components/alumnihero'
// Custom SVG icons as components
const GraduationCapIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const CompanyIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
  </svg>
);

// Alumni data with their current profession
const alumni = [
  {
    id: 1,
    name: "Alexandra Rodriguez",
    graduationYear: "2018",
    degree: "Computer Science",
    currentProfession: "Senior Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Specializes in machine learning and cloud computing. Led development of Google's latest search algorithm improvements.",
    achievements: ["Published 3 research papers", "Open source contributor", "Speaker at TechCon 2023"],
    higherEducation: "M.S. Computer Science, Stanford University"
  },
  {
    id: 2,
    name: "Michael Chen",
    graduationYear: "2016",
    degree: "Business Administration",
    currentProfession: "Investment Banker",
    company: "Goldman Sachs",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Specializes in mergers and acquisitions in the technology sector. Has closed over $5B in deals.",
    achievements: ["Forbes 30 Under 30", "Young Banker of the Year 2022", "Mentor for aspiring finance professionals"],
    higherEducation: "MBA, Harvard Business School"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    graduationYear: "2019",
    degree: "Biomedical Engineering",
    currentProfession: "Research Scientist",
    company: "Johnson & Johnson",
    location: "Boston, MA",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Leading research in regenerative medicine and tissue engineering. Part of team developing innovative medical devices.",
    achievements: ["2 patents filed", "Published in Nature Medicine", "National Science Award 2022"],
    higherEducation: "PhD Biomedical Engineering, MIT"
  },
  {
    id: 4,
    name: "David Park",
    graduationYear: "2017",
    degree: "Political Science",
    currentProfession: "Policy Advisor",
    company: "United Nations",
    location: "Geneva, Switzerland",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Working on international climate policy and sustainable development initiatives. Previously served at the State Department.",
    achievements: ["UN Youth Delegate", "Climate Policy Award 2021", "Published author on international relations"],
    higherEducation: "M.A. International Relations, Georgetown University"
  },
  {
    id: 5,
    name: "Jessica Williams",
    graduationYear: "2020",
    degree: "Graphic Design",
    currentProfession: "Creative Director",
    company: "Adobe",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Leads creative teams in developing innovative design solutions for major brands and digital products.",
    achievements: ["Webby Award winner", "Featured in Design Weekly", "Judge for international design competitions"],
    higherEducation: "MFA Design, Rhode Island School of Design"
  },
  {
    id: 6,
    name: "Robert Kim",
    graduationYear: "2015",
    degree: "Mechanical Engineering",
    currentProfession: "Aerospace Engineer",
    company: "SpaceX",
    location: "Hawthorne, CA",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Working on propulsion systems for next-generation spacecraft. Contributed to successful Mars mission design.",
    achievements: ["NASA Innovation Award", "3 technical patents", "Space Technology Pioneer 2023"],
    higherEducation: "M.S. Aerospace Engineering, Caltech"
  },
  {
    id: 7,
    name: "Amanda Thompson",
    graduationYear: "2019",
    degree: "Environmental Science",
    currentProfession: "Sustainability Consultant",
    company: "McKinsey & Company",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Advises Fortune 500 companies on sustainability strategies and circular economy implementation.",
    achievements: ["LEED Platinum certified", "Climate Action Leader", "Published sustainability framework"],
    higherEducation: "M.Sc. Environmental Management, Oxford University"
  },
  {
    id: 8,
    name: "Daniel Garcia",
    graduationYear: "2018",
    degree: "Finance",
    currentProfession: "Venture Capitalist",
    company: "Sequoia Capital",
    location: "Menlo Park, CA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Invests in early-stage technology startups. Focuses on AI, blockchain, and renewable energy sectors.",
    achievements: ["Forbes Midas List 2023", "Backed 3 unicorn startups", "Angel Investor of the Year"],
    higherEducation: "MBA, Stanford Graduate School of Business"
  },
  {
    id: 9,
    name: "Olivia Martinez",
    graduationYear: "2021",
    degree: "Psychology",
    currentProfession: "Clinical Psychologist",
    company: "Mayo Clinic",
    location: "Rochester, MN",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Specializes in cognitive behavioral therapy and mental health research. Leads adolescent mental health program.",
    achievements: ["Published clinical studies", "Mental Health Advocate Award", "Board Certified Psychologist"],
    higherEducation: "Psy.D. Clinical Psychology, University of Minnesota"
  },
  {
    id: 10,
    name: "Christopher Lee",
    graduationYear: "2017",
    degree: "Architecture",
    currentProfession: "Principal Architect",
    company: "Foster + Partners",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Leads sustainable architecture projects worldwide. Designs innovative buildings that harmonize with environment.",
    achievements: ["RIBA International Award", "Sustainable Design Pioneer", "Featured in Architectural Digest"],
    higherEducation: "M.Arch, Yale School of Architecture"
  }
];

// Alumni Card Component
function AlumniCard({ alumni, onViewProfile }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Alumni Image */}
      <div className="relative h-64 overflow-hidden">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="relative w-full h-full">
            <img 
              src={alumni.image}
              alt={alumni.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#2563EB] to-[#0D9488]">
                    <span class="text-white text-4xl font-bold">${alumni.name.charAt(0)}</span>
                  </div>
                `;
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Alumni Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1F2937] mb-1">{alumni.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[#0D9488]/10 text-[#0D9488] px-3 py-1 rounded-full text-sm font-medium">
            Class of {alumni.graduationYear}
          </div>
        </div>
        <p className="text-[#6B7280] text-sm mb-2">{alumni.degree}</p>
        <div className="mb-4">
          <p className="text-[#2563EB] font-semibold mb-1">{alumni.currentProfession}</p>
          <p className="text-[#4B5563] text-sm">{alumni.company}</p>
        </div>
        
        {/* View Profile Button */}
        <button
          onClick={() => onViewProfile(alumni.id)}
          className="w-full text-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

// Detailed Alumni Profile Component
function AlumniProfile({ alumni, onBack }) {
  // Scroll to top when profile opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center text-[#2563EB] hover:text-[#1D4ED8] mb-6 md:mb-8 font-medium text-sm md:text-base"
        >
          <BackIcon />
          Back to All Alumni
        </button>
        
        {/* Alumni Profile Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-[#E5E7EB]">
          {/* Simple Profile Header */}
          <div className="p-6 md:p-8 border-b border-[#E5E7EB]">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Alumni Image */}
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg mx-auto md:mx-0">
                <img 
                  src={alumni.image}
                  alt={alumni.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#2563EB] to-[#0D9488]">
                        <span class="text-white text-4xl font-bold">${alumni.name.charAt(0)}</span>
                      </div>
                    `;
                  }}
                />
              </div>
              
              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-2">{alumni.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <span className="bg-[#0D9488]/10 text-[#0D9488] px-4 py-2 rounded-full font-medium">
                    Class of {alumni.graduationYear}
                  </span>
                  <span className="text-[#2563EB] font-semibold text-lg">{alumni.currentProfession}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <CompanyIcon className="text-[#6B7280]" />
                    <span className="text-[#1F2937]">{alumni.company}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <LocationIcon className="text-[#6B7280]" />
                    <span className="text-[#1F2937]">{alumni.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* Bio Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-[#2563EB]">
                      <UserIcon />
                    </div>
                    Professional Journey
                  </h2>
                  <div className="bg-[#F9FAFB] p-4 md:p-6 rounded-xl border border-[#E5E7EB]">
                    <p className="text-[#1F2937] text-base md:text-lg leading-relaxed">{alumni.bio}</p>
                  </div>
                </section>
                
                {/* Education Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-[#0D9488]">
                      <GraduationCapIcon />
                    </div>
                    Education Background
                  </h2>
                  <div className="bg-[#F9FAFB] p-4 md:p-6 rounded-xl border border-[#E5E7EB]">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#0D9488] text-white p-3 rounded-full">
                          <GraduationCapIcon />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#1F2937] mb-2">University Degree</h3>
                          <p className="text-[#1F2937]">{alumni.degree}</p>
                          <p className="text-[#6B7280] text-sm">Class of {alumni.graduationYear}</p>
                        </div>
                      </div>
                      {alumni.higherEducation && (
                        <div className="flex items-start gap-4">
                          <div className="bg-[#8B5CF6] text-white p-3 rounded-full">
                            <GraduationCapIcon />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Higher Education</h3>
                            <p className="text-[#1F2937]">{alumni.higherEducation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                
                {/* Achievements Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-[#EC4899]">
                      <BriefcaseIcon />
                    </div>
                    Notable Achievements
                  </h2>
                  <div className="bg-[#F9FAFB] p-4 md:p-6 rounded-xl border border-[#E5E7EB]">
                    <div className="space-y-3">
                      {alumni.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#E5E7EB]">
                          <div className="bg-[#EC4899]/10 text-[#EC4899] p-2 rounded-full">
                            <BriefcaseIcon />
                          </div>
                          <span className="text-[#1F2937] font-medium">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6 md:space-y-8">
                {/* Current Position Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-[#2563EB]">
                      <CompanyIcon />
                    </div>
                    Current Position Details
                  </h2>
                  <div className="bg-[#F9FAFB] p-4 md:p-6 rounded-xl border border-[#E5E7EB]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#2563EB] text-white p-2 rounded-full">
                          <CompanyIcon />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1F2937] text-sm">Current Role</h3>
                          <p className="text-[#6B7280] text-sm font-medium">{alumni.currentProfession}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-[#0D9488] text-white p-2 rounded-full">
                          <BriefcaseIcon />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1F2937] text-sm">Company</h3>
                          <p className="text-[#6B7280] text-sm">{alumni.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-[#8B5CF6] text-white p-2 rounded-full">
                          <LocationIcon />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1F2937] text-sm">Location</h3>
                          <p className="text-[#6B7280] text-sm">{alumni.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                
                {/* Career Timeline */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-[#10B981]">
                      <BriefcaseIcon />
                    </div>
                    Career Overview
                  </h2>
                  <div className="bg-[#F9FAFB] p-4 md:p-6 rounded-xl border border-[#E5E7EB]">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B7280]">Years Since Graduation</span>
                        <span className="font-semibold text-[#1F2937]">{2024 - parseInt(alumni.graduationYear)} years</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B7280]">Industry</span>
                        <span className="font-semibold text-[#1F2937]">Professional</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6B7280]">Experience Level</span>
                        <span className="font-semibold text-[#1F2937]">Senior</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Alumni Page Component
export default function AlumniPage() {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlumni, setFilteredAlumni] = useState(alumni);

  const handleViewProfile = (alumniId) => {
    setSelectedAlumni(alumni.find(a => a.id === alumniId));
  };

  const handleBackToList = () => {
    setSelectedAlumni(null);
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAlumni(alumni);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = alumni.filter(alum =>
        alum.name.toLowerCase().includes(query) ||
        alum.degree.toLowerCase().includes(query) ||
        alum.currentProfession.toLowerCase().includes(query) ||
        alum.company.toLowerCase().includes(query)
      );
      setFilteredAlumni(filtered);
    }
  }, [searchQuery]);

  // If an alumni is selected, show their detailed profile
  if (selectedAlumni) {
    return <AlumniProfile alumni={selectedAlumni} onBack={handleBackToList} />;
  }

  // Main alumni list view
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Hero Section with Background Image */}
      <Alumnihero/>

      {/* Alumni Grid Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-20">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alumni by name, profession, or company..."
              className="w-full pl-10 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-center text-gray-600 mt-3 text-sm">
            Discover successful professionals from our alumni community
          </p>
        </div>

        {/* Alumni Grid Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F2937] mb-3 md:mb-4">
            Our Distinguished Alumni
          </h2>
          <p className="text-[#6B7280] max-w-3xl mx-auto text-sm sm:text-base md:text-lg px-2">
            Successful professionals across diverse industries, continuing to inspire excellence
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#0D9488] mx-auto mt-4 md:mt-6 rounded"></div>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {filteredAlumni.map((alum) => (
            <AlumniCard 
              key={alum.id} 
              alumni={alum} 
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <div className="text-[#6B7280] text-xl md:text-2xl mb-4 md:mb-6">
              No alumni found matching "{searchQuery}"
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition text-base md:text-lg"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Alumni Count */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Showing <span className="font-semibold text-[#2563EB]">{filteredAlumni.length}</span> of <span className="font-semibold text-[#2563EB]">{alumni.length}</span> alumni
          </p>
        </div>
      </section>
    </div>
  );
}