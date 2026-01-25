// app/teachers/page.tsx
"use client";

import { useState, useEffect, ReactNode } from 'react';

// Icon Props Interface
interface IconProps {
  className?: string;
}

// Custom SVG icons as components with proper typing
const GraduationCapIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 0 00-.788 0l-7 3a1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
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

const BookIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
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

const AwardIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const TeachingIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 0 00-.788 0l-7 3a1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

// Teacher Type Definition
interface Teacher {
  id: number;
  name: string;
  subject: string;
  classLevels: string[];
  image: string;
  education: string[];
  experience: string;
  teachingExperience: string[];
  bio: string;
  achievements: string[];
  teachingPhilosophy: string;
  officeHours: string;
  roomNumber: string;
  email: string;
}

// Teacher data with additional fields for profile
const teachersData: Teacher[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    subject: "Mathematics & Physics",
    classLevels: ["9th Grade", "10th Grade", "11th Grade", "12th Grade"],
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "PhD in Mathematics, Stanford University",
      "M.S. in Physics, MIT",
      "B.S. in Mathematics, Harvard University"
    ],
    experience: "15 years teaching experience",
    teachingExperience: [
      "Head of Mathematics Department (2015-Present)",
      "Senior Mathematics Teacher, Current School (2010-2015)",
      "Mathematics Lecturer, University of California (2008-2010)"
    ],
    bio: "Dr. Johnson specializes in making complex mathematical concepts accessible and engaging for all students. Her innovative teaching methods have helped hundreds of students excel in advanced mathematics.",
    achievements: [
      "National Mathematics Teacher of the Year 2022",
      "Published 5 research papers in mathematics education",
      "Developed award-winning curriculum for advanced mathematics"
    ],
    teachingPhilosophy: "Believes in creating an inclusive learning environment where every student can discover their mathematical potential through practical applications and real-world problem-solving.",
    officeHours: "Monday-Friday: 2:00 PM - 4:00 PM",
    roomNumber: "Room 302, Science Building",
    email: "s.johnson@school.edu"
  },
  {
    id: 2,
    name: "Mr. David Chen",
    subject: "Computer Science",
    classLevels: ["10th Grade", "11th Grade", "12th Grade"],
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "M.S. in Computer Science, MIT",
      "B.S. in Software Engineering, Carnegie Mellon"
    ],
    experience: "10 years in tech industry + 5 years teaching",
    teachingExperience: [
      "Computer Science Department Lead (2018-Present)",
      "Senior Software Engineer, Google (2013-2018)",
      "Software Developer, Microsoft (2010-2013)"
    ],
    bio: "Former software engineer turned educator, Mr. Chen brings real-world programming experience to the classroom, preparing students for careers in technology.",
    achievements: [
      "Google Developer Expert",
      "Created school's first AI and Machine Learning course",
      "Led student teams to national coding competition wins"
    ],
    teachingPhilosophy: "Focuses on project-based learning and collaboration to develop both technical skills and creative problem-solving abilities in students.",
    officeHours: "Tuesday-Thursday: 3:00 PM - 5:00 PM",
    roomNumber: "Room 205, Tech Center",
    email: "d.chen@school.edu"
  },
  {
    id: 3,
    name: "Ms. Maria Rodriguez",
    subject: "Literature & Languages",
    classLevels: ["9th Grade", "10th Grade", "11th Grade"],
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "M.A. in English Literature, Cambridge University",
      "B.A. in Comparative Literature, University of Oxford",
      "TESOL Certification"
    ],
    experience: "12 years teaching experience",
    teachingExperience: [
      "Head of English Department (2017-Present)",
      "English Teacher, International School (2012-2017)",
      "ESL Instructor, Language Institute (2010-2012)"
    ],
    bio: "Ms. Rodriguez fosters a love for literature through interactive discussions and creative writing workshops that inspire students to become lifelong readers.",
    achievements: [
      "Published author of 2 poetry collections",
      "State Literature Teacher Award 2021",
      "Organizer of annual school literary festival"
    ],
    teachingPhilosophy: "Emphasizes critical thinking and empathy through literary analysis, helping students connect classic works with contemporary issues.",
    officeHours: "Monday-Wednesday-Friday: 1:00 PM - 3:00 PM",
    roomNumber: "Room 101, Humanities Building",
    email: "m.rodriguez@school.edu"
  },
  {
    id: 4,
    name: "Mr. James Wilson",
    subject: "History & Social Studies",
    classLevels: ["9th Grade", "10th Grade"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "M.A. in History, University of Chicago",
      "B.A. in Political Science, Columbia University",
      "Teaching Credential in Social Studies"
    ],
    experience: "18 years teaching experience",
    teachingExperience: [
      "Social Studies Department Chair (2015-Present)",
      "History Teacher, Current School (2006-2015)",
      "Museum Educator, Smithsonian (2004-2006)"
    ],
    bio: "Mr. Wilson makes history come alive through engaging storytelling and primary source analysis, connecting past events to current affairs.",
    achievements: [
      "National History Day Teacher of the Year 2020",
      "Published historical research on civil rights movement",
      "Developed interactive history curriculum adopted statewide"
    ],
    teachingPhilosophy: "Uses primary sources and debates to help students develop historical thinking skills and understand multiple perspectives.",
    officeHours: "Tuesday-Thursday: 2:30 PM - 4:30 PM",
    roomNumber: "Room 215, Social Studies Wing",
    email: "j.wilson@school.edu"
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    subject: "Biology & Chemistry",
    classLevels: ["11th Grade", "12th Grade"],
    image: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "PhD in Biochemistry, Johns Hopkins University",
      "M.S. in Molecular Biology, UC Berkeley",
      "B.S. in Chemistry, Stanford University"
    ],
    experience: "14 years teaching + 6 years research",
    teachingExperience: [
      "Science Department Head (2016-Present)",
      "Research Scientist, Biotech Company (2008-2014)",
      "University Lab Instructor (2006-2008)"
    ],
    bio: "Dr. Thompson's hands-on laboratory approach helps students develop scientific inquiry skills while exploring the wonders of biological systems.",
    achievements: [
      "Published 8 papers in peer-reviewed journals",
      "NSF Grant recipient for science education",
      "Lead organizer of school science fair for 8 years"
    ],
    teachingPhilosophy: "Focuses on inquiry-based learning where students design and conduct experiments to discover scientific principles firsthand.",
    officeHours: "Monday-Wednesday-Friday: 8:00 AM - 10:00 AM",
    roomNumber: "Room 410, Science Laboratory",
    email: "l.thompson@school.edu"
  },
  {
    id: 6,
    name: "Mr. Robert Kim",
    subject: "Physical Education",
    classLevels: ["9th Grade", "10th Grade", "11th Grade", "12th Grade"],
    image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "M.S. in Sports Science, University of Michigan",
      "B.S. in Kinesiology, UCLA",
      "Certified Personal Trainer"
    ],
    experience: "9 years coaching + 6 years teaching",
    teachingExperience: [
      "Athletic Director (2018-Present)",
      "Head Basketball Coach (2015-2018)",
      "Strength and Conditioning Coach, College (2012-2015)"
    ],
    bio: "Coach Kim focuses on developing physical fitness, teamwork, and sportsmanship while promoting lifelong healthy habits.",
    achievements: [
      "State Championship Coach 2022",
      "Developed award-winning fitness curriculum",
      "Certified in multiple sports training methodologies"
    ],
    teachingPhilosophy: "Promotes physical literacy and lifelong fitness through inclusive, varied, and enjoyable physical activities for all skill levels.",
    officeHours: "Daily: 7:30 AM - 8:30 AM",
    roomNumber: "Gymnasium Office",
    email: "r.kim@school.edu"
  },
  {
    id: 7,
    name: "Ms. Amina Hassan",
    subject: "Art & Creative Design",
    classLevels: ["10th Grade", "11th Grade"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "B.F.A. in Fine Arts, Rhode Island School of Design",
      "M.F.A. in Visual Arts, School of the Art Institute of Chicago"
    ],
    experience: "7 years teaching + 5 years professional artist",
    teachingExperience: [
      "Art Department Coordinator (2019-Present)",
      "Gallery Manager and Artist (2015-2019)",
      "Art Instructor, Community Center (2013-2015)"
    ],
    bio: "Ms. Hassan encourages creative expression through various media while teaching technical skills and art history fundamentals.",
    achievements: [
      "Solo exhibitions in 3 major cities",
      "Art Education Innovation Grant recipient",
      "Student art showcased in national competitions"
    ],
    teachingPhilosophy: "Fosters creative confidence and technical skill through exploration of diverse materials and art historical contexts.",
    officeHours: "Tuesday-Thursday: 4:00 PM - 6:00 PM",
    roomNumber: "Room 108, Art Studio",
    email: "a.hassan@school.edu"
  },
  {
    id: 8,
    name: "Mr. Thomas O'Reilly",
    subject: "Music & Performing Arts",
    classLevels: ["9th Grade", "10th Grade", "11th Grade"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "M.M. in Music Education, Juilliard School",
      "B.M. in Performance, Berklee College of Music"
    ],
    experience: "11 years teaching + 8 years performing",
    teachingExperience: [
      "Director of Performing Arts (2017-Present)",
      "Professional Musician and Composer (2010-2017)",
      "Music Teacher, Private School (2009-2010)"
    ],
    bio: "Mr. O'Reilly directs award-winning music programs and teaches students to appreciate music theory, history, and performance.",
    achievements: [
      "Grammy Music Educator Award nominee",
      "Composed original score for school musical",
      "Student ensembles won multiple state competitions"
    ],
    teachingPhilosophy: "Combines technical mastery with creative expression to help students discover their unique musical voice.",
    officeHours: "Monday-Wednesday-Friday: 3:30 PM - 5:30 PM",
    roomNumber: "Room 201, Music Building",
    email: "t.oreilly@school.edu"
  },
  {
    id: 9,
    name: "Ms. Jennifer Park",
    subject: "Economics & Business",
    classLevels: ["11th Grade", "12th Grade"],
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "MBA, Harvard Business School",
      "B.A. in Economics, Wharton School",
      "Certified Financial Analyst"
    ],
    experience: "7 years teaching + 8 years corporate",
    teachingExperience: [
      "Business Department Head (2019-Present)",
      "Financial Analyst, Investment Bank (2014-2019)",
      "Economics Consultant (2012-2014)"
    ],
    bio: "With corporate experience, Ms. Park brings practical business knowledge to the classroom, preparing students for economic literacy.",
    achievements: [
      "Developed school's first entrepreneurship program",
      "Student investment club achieved 25% returns",
      "Business plan competition state champion"
    ],
    teachingPhilosophy: "Connects economic theory with real-world applications through case studies, simulations, and guest speakers.",
    officeHours: "Monday-Thursday: 1:00 PM - 3:00 PM",
    roomNumber: "Room 305, Business Wing",
    email: "j.park@school.edu"
  },
  {
    id: 10,
    name: "Dr. Michael Brown",
    subject: "Psychology & Counseling",
    classLevels: ["12th Grade"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    education: [
      "PhD in Clinical Psychology, UCLA",
      "M.A. in Counseling Psychology, Northwestern",
      "Licensed Clinical Psychologist"
    ],
    experience: "13 years teaching + 10 years clinical practice",
    teachingExperience: [
      "Head of Counseling Department (2018-Present)",
      "Clinical Psychologist, Private Practice (2012-2018)",
      "University Professor (2008-2012)"
    ],
    bio: "Dr. Brown helps students understand human behavior and mental processes while providing academic counseling and support.",
    achievements: [
      "Published 3 psychology textbooks",
      "Developed school wellness program",
      "State Psychology Educator of the Year 2023"
    ],
    teachingPhilosophy: "Integrates psychological science with practical life skills to promote student well-being and academic success.",
    officeHours: "By appointment",
    roomNumber: "Room 103, Counseling Center",
    email: "m.brown@school.edu"
  }
];

// Props for TeacherCard component
interface TeacherCardProps {
  teacher: Teacher;
  onViewProfile: (id: number) => void;
}

// Teacher Card Component
function TeacherCard({ teacher, onViewProfile }: TeacherCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    if (target.parentElement) {
      target.parentElement.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-600">
          <span class="text-white text-4xl font-bold">${teacher.name.charAt(0)}</span>
        </div>
      `;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      {/* Teacher Image - Fixed Height */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="relative w-full h-full">
            <img 
              src={teacher.image}
              alt={teacher.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        </div>
      </div>
      
      {/* Teacher Info - Fixed Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{teacher.name}</h3>
        <p className="text-blue-600 font-semibold mb-3 line-clamp-1">{teacher.subject}</p>
        
        {/* View Profile Button at bottom */}
        <div className="mt-auto">
          <button
            onClick={() => onViewProfile(teacher.id)}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-sm"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Props for TeacherProfile component
interface TeacherProfileProps {
  teacher: Teacher;
  onBack: () => void;
}

// Detailed Teacher Profile Component
function TeacherProfile({ teacher, onBack }: TeacherProfileProps) {
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
          <span class="text-white text-4xl font-bold">${teacher.name.charAt(0)}</span>
        </div>
      `;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 md:mb-8 font-medium text-sm md:text-base transition-colors"
        >
          <BackIcon />
          Back to All Teachers
        </button>
        
        {/* Teacher Profile Card - Alumni Style */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Profile Header */}
          <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Teacher Image */}
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg mx-auto md:mx-0">
                <img 
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              
              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{teacher.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm md:text-base">
                    {teacher.subject}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-800">{teacher.email}</span>
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
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-blue-600">
                      <UserIcon />
                    </div>
                    About the Teacher
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    <p className="text-gray-800 text-base md:text-lg leading-relaxed">{teacher.bio}</p>
                  </div>
                </section>
                
                {/* Education Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-teal-600">
                      <GraduationCapIcon />
                    </div>
                    Education Background
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    <div className="space-y-4">
                      {teacher.education.map((edu, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`${index === 0 ? 'bg-teal-600' : 'bg-blue-600'} text-white p-3 rounded-full`}>
                            <GraduationCapIcon />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {index === 0 ? 'Highest Degree' : 'Additional Education'}
                            </h3>
                            <p className="text-gray-800">{edu}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                
                {/* Teaching Experience Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-purple-600">
                      <TeachingIcon />
                    </div>
                    Teaching Experience
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    <div className="space-y-3">
                      {teacher.teachingExperience.map((exp, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                          <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                            <BriefcaseIcon />
                          </div>
                          <span className="text-gray-900 font-medium">{exp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                
                {/* Teaching Philosophy Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-green-600">
                      <BookIcon />
                    </div>
                    Teaching Philosophy
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    <p className="text-gray-800 text-base md:text-lg leading-relaxed italic">
                      "{teacher.teachingPhilosophy}"
                    </p>
                  </div>
                </section>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6 md:space-y-8">
                {/* Classes Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-pink-600">
                      <BookIcon />
                    </div>
                    Classes Teaching
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    <div className="space-y-3">
                      {teacher.classLevels.map((level, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                          <div className="bg-pink-100 text-pink-600 p-2 rounded-full">
                            <BookIcon />
                          </div>
                          <span className="text-gray-900 font-medium">{level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                
                {/* Achievements Section */}
                <section>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                    <div className="text-yellow-600">
                      <AwardIcon />
                    </div>
                    Awards & Achievements
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200">
                    <div className="space-y-3">
                      {teacher.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                          <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                            <AwardIcon />
                          </div>
                          <span className="text-gray-900 font-medium">{achievement}</span>
                        </div>
                      ))}
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

// Main Teachers Page Component
export default function TeachersPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(teachersData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const teachersPerPage = 10;

  const handleViewProfile = (teacherId: number) => {
    const foundTeacher = teachersData.find(t => t.id === teacherId);
    setSelectedTeacher(foundTeacher || null);
  };

  const handleBackToList = () => {
    setSelectedTeacher(null);
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTeachers(teachersData);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = teachersData.filter(teacher =>
        teacher.name.toLowerCase().includes(query) ||
        teacher.subject.toLowerCase().includes(query)
      );
      setFilteredTeachers(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchQuery]);

  // Pagination logic
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If a teacher is selected, show their detailed profile
  if (selectedTeacher) {
    return <TeacherProfile teacher={selectedTeacher} onBack={handleBackToList} />;
  }

  // Main teachers list view
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Faculty
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
            Meet our dedicated and experienced teaching faculty members
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teachers by name or subject..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {currentTeachers.map((teacher) => (
            <TeacherCard 
              key={teacher.id} 
              teacher={teacher} 
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600 text-xl mb-4">
              No teachers found matching "{searchQuery}"
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg transition-all duration-300"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
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
                  className={`px-4 py-2 rounded-lg transition-colors ${
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
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>

            {/* Page Info */}
            <p className="text-gray-600 text-sm">
              Showing {indexOfFirstTeacher + 1}-{Math.min(indexOfLastTeacher, filteredTeachers.length)} of {filteredTeachers.length} teachers
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{filteredTeachers.length}</span> teachers
          </p>
        </div>
      </div>
    </div>
  );
}