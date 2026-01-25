// app/alumni/page.tsx
"use client";

import { useState, useEffect, ReactNode } from 'react';

// Icon Props Interface
interface IconProps {
  className?: string;
}

// Custom SVG icons as components
const GraduationCapIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const BackIcon = ({ className = "w-5 h-5 mr-2" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const LocationIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const BookIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
);

const AwardIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// Alumni Type Definition
interface AlumniType {
  id: number;
  name: string;
  graduationYear: string;
  profession: string;
  image: string;
  bio: string;
  achievements: string[];
  education: string[];
  location: string;
  email: string;
  skills: string[];
}

// Alumni data with updated structure
const alumniData: AlumniType[] = [
  {
    id: 1,
    name: "Alexandra Rodriguez",
    graduationYear: "2018",
    profession: "Senior Software Engineer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Specializes in machine learning and cloud computing. Passionate about creating scalable solutions and mentoring junior developers.",
    achievements: ["Published 3 research papers in AI", "Open source contributor", "Speaker at TechCon 2023", "Google Developer Expert"],
    education: ["B.S. Computer Science, Class of 2018", "M.S. Computer Science, Stanford University"],
    location: "San Francisco, CA",
    email: "alexandra@example.com",
    skills: ["Machine Learning", "Cloud Computing", "Python", "TensorFlow"]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    graduationYear: "2019",
    profession: "English Professor",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Dedicated educator with a passion for 19th-century literature. Currently teaching at a prestigious university and conducting research on Victorian novels.",
    achievements: ["Published author of 2 books", "National Teaching Excellence Award 2022", "Editor of Literary Review Journal"],
    education: ["B.A. English Literature, Class of 2019", "M.A. English, Cambridge University", "PhD in Literature, Oxford University"],
    location: "Boston, MA",
    email: "sarah.johnson@university.edu",
    skills: ["Literary Analysis", "Academic Writing", "Curriculum Development", "Research Methodology"]
  },
  {
    id: 3,
    name: "Michael Chen",
    graduationYear: "2020",
    profession: "Software Developer",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Full-stack developer specializing in web applications and mobile development. Enjoys solving complex problems and building user-friendly interfaces.",
    achievements: ["Built award-winning mobile app", "Contributor to major open-source projects", "Tech innovation award winner"],
    education: ["B.S. Software Engineering, Class of 2020", "Certified Full-Stack Developer"],
    location: "New York, NY",
    email: "michael.chen@example.com",
    skills: ["JavaScript", "React", "Node.js", "Mobile Development"]
  },
  {
    id: 4,
    name: "Jessica Williams",
    graduationYear: "2017",
    profession: "English Professor",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Focuses on post-colonial literature and creative writing. Leads writing workshops and mentors aspiring authors.",
    achievements: ["Poetry collection published", "Creative Writing Award 2021", "Featured in literary magazines"],
    education: ["B.A. English Literature, Class of 2017", "MFA Creative Writing, Iowa Writers' Workshop"],
    location: "Chicago, IL",
    email: "jessica.williams@college.edu",
    skills: ["Creative Writing", "Poetry", "Literary Criticism", "Workshop Facilitation"]
  },
  {
    id: 5,
    name: "David Park",
    graduationYear: "2019",
    profession: "Software Developer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Backend developer with expertise in distributed systems and database architecture. Enjoys optimizing performance and scalability.",
    achievements: ["Database optimization expert", "System architecture design award", "Conference speaker"],
    education: ["B.S. Computer Science, Class of 2019", "Advanced Database Management Certification"],
    location: "Seattle, WA",
    email: "david.park@example.com",
    skills: ["Database Design", "System Architecture", "Python", "DevOps"]
  },
  {
    id: 6,
    name: "Robert Kim",
    graduationYear: "2016",
    profession: "Software Developer",
    image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Mobile app developer with expertise in iOS and Android platforms. Has published multiple successful apps with millions of downloads.",
    achievements: ["App Store featured developer", "Mobile innovation award", "Published technical articles"],
    education: ["B.S. Software Engineering, Class of 2016", "Mobile Development Certification"],
    location: "Austin, TX",
    email: "robert.kim@example.com",
    skills: ["iOS Development", "Android Development", "Swift", "Kotlin"]
  },
  {
    id: 7,
    name: "Amanda Thompson",
    graduationYear: "2018",
    profession: "English Professor",
    image: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Specializes in Shakespearean literature and drama. Director of university theater productions and literary festivals.",
    achievements: ["Shakespeare research grant recipient", "Theater production awards", "Academic journal editor"],
    education: ["B.A. English Literature, Class of 2018", "PhD in Renaissance Literature, University of London"],
    location: "London, UK",
    email: "amanda.thompson@university.edu",
    skills: ["Shakespeare Studies", "Drama", "Theater Production", "Academic Research"]
  },
  {
    id: 8,
    name: "Daniel Garcia",
    graduationYear: "2021",
    profession: "Software Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Frontend developer passionate about creating beautiful, accessible user interfaces. Focuses on user experience and modern web technologies.",
    achievements: ["UI/UX design awards", "Accessibility compliance expert", "Open-source UI library maintainer"],
    education: ["B.S. Computer Science, Class of 2021", "UI/UX Design Certification"],
    location: "Portland, OR",
    email: "daniel.garcia@example.com",
    skills: ["React", "TypeScript", "UI/UX Design", "Accessibility"]
  },
  {
    id: 9,
    name: "Olivia Martinez",
    graduationYear: "2019",
    profession: "English Professor",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Focuses on contemporary American literature and cultural studies. Editor of academic publications and mentor to graduate students.",
    achievements: ["Cultural studies research award", "Published critical essays", "Conference organizer"],
    education: ["B.A. English Literature, Class of 2019", "PhD in American Literature, Columbia University"],
    location: "Philadelphia, PA",
    email: "olivia.martinez@college.edu",
    skills: ["Cultural Studies", "Critical Theory", "Academic Editing", "Mentoring"]
  },
  {
    id: 10,
    name: "Christopher Lee",
    graduationYear: "2020",
    profession: "Software Developer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "DevOps engineer specializing in cloud infrastructure and CI/CD pipelines. Enjoys automating processes and improving development workflows.",
    achievements: ["Cloud architecture certifications", "Infrastructure as code expert", "Technical blog writer"],
    education: ["B.S. Software Engineering, Class of 2020", "AWS Solutions Architect Certification"],
    location: "Denver, CO",
    email: "chris.lee@example.com",
    skills: ["DevOps", "Cloud Computing", "CI/CD", "Infrastructure"]
  }
];

// Props for AlumniCard component
interface AlumniCardProps {
  alumni: AlumniType;
  onViewProfile: (id: number) => void;
}

// Alumni Card Component (Simplified)
function AlumniCard({ alumni, onViewProfile }: AlumniCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    if (target.parentElement) {
      target.parentElement.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-600">
          <span class="text-white text-4xl font-bold">${alumni.name.charAt(0)}</span>
        </div>
      `;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      {/* Alumni Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="relative w-full h-full">
            <img 
              src={alumni.image}
              alt={alumni.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        </div>
      </div>
      
      {/* Alumni Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{alumni.name}</h3>
        <p className="text-blue-600 font-semibold mb-4 line-clamp-1">{alumni.profession}</p>
        
        {/* View Profile Button */}
        <div className="mt-auto">
          <button
            onClick={() => onViewProfile(alumni.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-sm"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Props for AlumniProfile component
interface AlumniProfileProps {
  alumni: AlumniType;
  onBack: () => void;
}

// Detailed Alumni Profile Component (Responsive)
function AlumniProfile({ alumni, onBack }: AlumniProfileProps) {
  // Scroll to top when profile opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    if (target.parentElement) {
      target.parentElement.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-600">
          <span class="text-white text-4xl font-bold">${alumni.name.charAt(0)}</span>
        </div>
      `;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 md:mb-6 font-medium text-sm md:text-base transition-colors"
        >
          <BackIcon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          Back to All Alumni
        </button>
        
        {/* Alumni Profile Card - Responsive */}
        <div className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg md:shadow-xl overflow-hidden border border-gray-200">
          {/* Profile Header - Responsive */}
          <div className="p-4 sm:p-5 md:p-6 lg:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 lg:gap-8">
              {/* Alumni Image - Responsive */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg mx-auto md:mx-0">
                <img 
                  src={alumni.image}
                  alt={alumni.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              
              {/* Basic Info - Responsive */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{alumni.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3 md:mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base">
                    {alumni.profession}
                  </span>
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base">
                    Class of {alumni.graduationYear}
                  </span>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-800 text-sm sm:text-base break-all">{alumni.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <LocationIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    <span className="text-gray-800 text-sm sm:text-base">{alumni.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Details Section - Responsive */}
          <div className="p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                {/* Bio Section */}
                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-blue-600">
                      <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    Professional Bio
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl border border-gray-200">
                    <p className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed">{alumni.bio}</p>
                  </div>
                </section>
                
                {/* Education Section */}
                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-teal-600">
                      <GraduationCapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    Education Background
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl border border-gray-200">
                    <div className="space-y-3 sm:space-y-4">
                      {alumni.education.map((edu, index) => (
                        <div key={index} className="flex items-start gap-3 sm:gap-4">
                          <div className={`${index === 0 ? 'bg-teal-600' : 'bg-blue-600'} text-white p-2 sm:p-3 rounded-full`}>
                            <GraduationCapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1">
                              {index === 0 ? 'Primary Degree' : 'Additional Education'}
                            </h3>
                            <p className="text-gray-800 text-sm sm:text-base">{edu}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                
                {/* Skills Section */}
                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-purple-600">
                      <BriefcaseIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    Skills & Expertise
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {alumni.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-purple-100 text-purple-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
              
              {/* Right Column */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                {/* Achievements Section */}
                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-yellow-600">
                      <AwardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    Awards & Achievements
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl border border-gray-200">
                    <div className="space-y-2 sm:space-y-3">
                      {alumni.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-lg border border-gray-200">
                          <div className="bg-yellow-100 text-yellow-600 p-1 sm:p-2 rounded-full">
                            <AwardIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                          <span className="text-gray-900 font-medium text-xs sm:text-sm md:text-base">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                
                {/* Alumni Info Section */}
                <section>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-pink-600">
                      <BookIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    Alumni Information
                  </h2>
                  <div className="bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl border border-gray-200">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="bg-pink-100 text-pink-600 p-1 sm:p-2 rounded-full">
                          <BookIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div>
                          <span className="text-gray-900 font-medium text-xs sm:text-sm md:text-base block">Graduation Year</span>
                          <span className="text-gray-600 text-xs sm:text-sm">Class of {alumni.graduationYear}</span>
                        </div>
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
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniType | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniType[]>(alumniData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const alumniPerPage = 8;

  const handleViewProfile = (alumniId: number) => {
    const foundAlumni = alumniData.find(a => a.id === alumniId);
    setSelectedAlumni(foundAlumni || null);
  };

  const handleBackToList = () => {
    setSelectedAlumni(null);
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAlumni(alumniData);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = alumniData.filter(alum =>
        alum.name.toLowerCase().includes(query) ||
        alum.profession.toLowerCase().includes(query)
      );
      setFilteredAlumni(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
  const indexOfLastAlumni = currentPage * alumniPerPage;
  const indexOfFirstAlumni = indexOfLastAlumni - alumniPerPage;
  const currentAlumni = filteredAlumni.slice(indexOfFirstAlumni, indexOfLastAlumni);
  const totalPages = Math.ceil(filteredAlumni.length / alumniPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If an alumni is selected, show their detailed profile
  if (selectedAlumni) {
    return <AlumniProfile alumni={selectedAlumni} onBack={handleBackToList} />;
  }

  // Main alumni list view
  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8 lg:py-12 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading - Responsive */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Our Distinguished Alumni
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base md:text-lg px-2">
            Meet our successful alumni making a difference in various professional fields
          </p>
        </div>

        {/* Search Bar - Responsive */}
        <div className="max-w-xl sm:max-w-2xl mx-auto mb-8 md:mb-12 px-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alumni by name or profession..."
              className="w-full pl-10 pr-10 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Alumni Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 md:mb-12 px-2">
          {currentAlumni.map((alum) => (
            <AlumniCard 
              key={alum.id} 
              alumni={alum} 
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredAlumni.length === 0 && (
          <div className="text-center py-8 md:py-12 px-2">
            <div className="text-gray-600 text-lg sm:text-xl md:text-2xl mb-3 md:mb-6">
              No alumni found matching "{searchQuery}"
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg transition-all duration-300 text-sm sm:text-base"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Pagination - Responsive */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-8 md:mb-12 px-2">
            <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>

            {/* Page Info */}
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Showing {indexOfFirstAlumni + 1}-{Math.min(indexOfLastAlumni, filteredAlumni.length)} of {filteredAlumni.length} alumni
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="pt-4 sm:pt-6 border-t border-gray-200 text-center px-2">
          <p className="text-gray-600 text-sm sm:text-base">
            Found <span className="font-semibold text-blue-600">{filteredAlumni.length}</span> alumni
          </p>
        </div>
      </div>
    </div>
  );
}