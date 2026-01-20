// app/web-admin/teacher/edit/page.tsx
"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Icons with proper typing
interface IconProps {
  className?: string;
}

const BackIcon = ({ className = "w-5 h-5 mr-2" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const SaveIcon = ({ className = "w-5 h-5 mr-2" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const AddIcon = ({ className = "w-5 h-5 mr-1" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const RemoveIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

// Type definitions - Added id to FormData interface
interface FormData {
  id?: number; // Added id as optional
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
  phone: string;
  isActive: boolean;
}

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    subject: '',
    classLevels: [],
    image: '',
    education: [],
    experience: '',
    teachingExperience: [],
    bio: '',
    achievements: [],
    teachingPhilosophy: '',
    officeHours: '',
    roomNumber: '',
    email: '',
    phone: '',
    isActive: true,
  });

  const [newClassLevel, setNewClassLevel] = useState<string>('');
  const [newEducation, setNewEducation] = useState<string>('');
  const [newTeachingExp, setNewTeachingExp] = useState<string>('');
  const [newAchievement, setNewAchievement] = useState<string>('');

  // Mock teacher data - in real app, fetch from API
  const mockTeacherData: FormData = {
    id: 1, // Now valid since id is in FormData interface
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
    email: "s.johnson@school.edu",
    phone: "+1 (555) 123-4567",
    isActive: true
  };

  useEffect(() => {
    // Simulate API call to fetch teacher data
    const fetchTeacherData = () => {
      setLoading(true);
      setTimeout(() => {
        // In real app: fetch teacher data by ID from API
        // For now, using mock data
        setFormData(mockTeacherData);
        setLoading(false);
      }, 800);
    };

    fetchTeacherData();
  }, [params.id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value
    }));
  };

  // Handle array fields
  const addClassLevel = () => {
    if (newClassLevel.trim()) {
      setFormData(prev => ({
        ...prev,
        classLevels: [...prev.classLevels, newClassLevel.trim()]
      }));
      setNewClassLevel('');
    }
  };

  const removeClassLevel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      classLevels: prev.classLevels.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation.trim()]
      }));
      setNewEducation('');
    }
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addTeachingExperience = () => {
    if (newTeachingExp.trim()) {
      setFormData(prev => ({
        ...prev,
        teachingExperience: [...prev.teachingExperience, newTeachingExp.trim()]
      }));
      setNewTeachingExp('');
    }
  };

  const removeTeachingExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teachingExperience: prev.teachingExperience.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleClassLevelKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addClassLevel();
    }
  };

  const handleEducationKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEducation();
    }
  };

  const handleTeachingExpKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTeachingExperience();
    }
  };

  const handleAchievementKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAchievement();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    // Prepare final data
    const teacherData = {
      ...formData,
      classLevels: formData.classLevels.filter(level => level.trim()),
      education: formData.education.filter(edu => edu.trim()),
      teachingExperience: formData.teachingExperience.filter(exp => exp.trim()),
      achievements: formData.achievements.filter(ach => ach.trim()),
    };
    
    // In real app, update teacher via API
    console.log('Updated Teacher Data:', teacherData);
    
    setTimeout(() => {
      setSaving(false);
      // Show success message and redirect
      alert('Teacher profile updated successfully!');
      router.push('/web-admin/teacher');
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
          >
            <BackIcon />
            Back to Teachers
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Teacher Profile</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Update teacher information and save changes</p>
            <span className="text-sm text-gray-500">ID: #{params.id}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Dr. Sarah Johnson"
                />
              </div>

              {/* Subject */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject/Department *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Mathematics & Physics"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <div className="mt-3">
                  {formData.image && (
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                <span class="text-gray-400 text-sm">No image</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">Current profile image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="15 years teaching experience"
                />
              </div>

              {/* Class Levels */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Levels
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newClassLevel}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewClassLevel(e.target.value)}
                      onKeyPress={handleClassLevelKeyPress}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Add new class level"
                    />
                    <button
                      type="button"
                      onClick={addClassLevel}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <AddIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {formData.classLevels.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Current class levels:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.classLevels.map((level, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            {level}
                            <button
                              type="button"
                              onClick={() => removeClassLevel(index)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <RemoveIcon className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="teacher@school.edu"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Office Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Hours
                </label>
                <input
                  type="text"
                  name="officeHours"
                  value={formData.officeHours}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Monday-Friday: 2:00 PM - 4:00 PM"
                />
              </div>

              {/* Room Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Room 302, Science Building"
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Education Background
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEducation}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewEducation(e.target.value)}
                  onKeyPress={handleEducationKeyPress}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Add new education"
                />
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <AddIcon className="w-5 h-5" />
                </button>
              </div>
              
              {formData.education.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Current education:</p>
                  {formData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-800">{edu}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <RemoveIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Teaching Experience Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Teaching Experience
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTeachingExp}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTeachingExp(e.target.value)}
                  onKeyPress={handleTeachingExpKeyPress}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Add new teaching experience"
                />
                <button
                  type="button"
                  onClick={addTeachingExperience}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <AddIcon className="w-5 h-5" />
                </button>
              </div>
              
              {formData.teachingExperience.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Current teaching experience:</p>
                  {formData.teachingExperience.map((exp, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-800">{exp}</span>
                      <button
                        type="button"
                        onClick={() => removeTeachingExperience(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <RemoveIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Awards & Achievements
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAchievement(e.target.value)}
                  onKeyPress={handleAchievementKeyPress}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Add new achievement"
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <AddIcon className="w-5 h-5" />
                </button>
              </div>
              
              {formData.achievements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Current achievements:</p>
                  {formData.achievements.map((ach, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-800">{ach}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <RemoveIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Biography Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Biography & Philosophy
            </h2>
            
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Write a detailed biography about the teacher..."
                />
              </div>

              {/* Teaching Philosophy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Philosophy
                </label>
                <textarea
                  name="teachingPhilosophy"
                  value={formData.teachingPhilosophy}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Describe the teacher's teaching philosophy..."
                />
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  id="isActive"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Teacher (Visible on public site)
                </label>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview Changes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Teacher Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {formData.name}</p>
                  <p><span className="font-medium">Subject:</span> {formData.subject}</p>
                  <p><span className="font-medium">Experience:</span> {formData.experience}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Info</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {formData.email}</p>
                  <p><span className="font-medium">Phone:</span> {formData.phone || 'Not set'}</p>
                  <p><span className="font-medium">Office:</span> {formData.roomNumber}</p>
                  <p><span className="font-medium">Hours:</span> {formData.officeHours}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Class Levels:</p>
                  <p className="text-sm text-gray-600">{formData.classLevels.length} levels</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Education Items:</p>
                  <p className="text-sm text-gray-600">{formData.education.length} items</p>
                </div>
              </div>
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
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  // Reset form to original data
                  setFormData(mockTeacherData);
                  alert('Changes discarded. Original data restored.');
                }}
                className="px-4 py-2.5 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}