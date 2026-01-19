// components/TeacherCard.jsx

import Link from 'next/link';
import { FaGraduationCap, FaBriefcase, FaAward, FaBookOpen } from 'react-icons/fa';

const TeacherCard = ({ teacher }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Teacher Image */}
      <div className="relative h-64 bg-gradient-to-r from-[#2563EB] to-[#0D9488] flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center text-white text-6xl">
          {teacher.name.charAt(0)}
        </div>
        <div className="absolute top-4 right-4 bg-[#16A34A] text-white text-xs font-bold py-1 px-3 rounded-full">
          {teacher.subject.split('&')[0].trim()}
        </div>
      </div>
      
      {/* Teacher Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{teacher.name}</h3>
        <p className="text-[#0D9488] font-medium mb-4">{teacher.subject}</p>
        
        {/* Quick Facts */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <FaGraduationCap className="text-[#2563EB] mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">{teacher.edducation.split(',')[0]}</p>
          </div>
          <div className="flex items-start gap-3">
            <FaBriefcase className="text-[#0D9488] mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">{teacher.experience.split(',')[0]}</p>
          </div>
          {teacher.achievements[0] && (
            <div className="flex items-start gap-3">
              <FaAward className="text-[#F59E0B] mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">{teacher.achievements[0]}</p>
            </div>
          )}
        </div>
        
        {/* Specializations */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaBookOpen className="text-[#8B5CF6]" />
            <h4 className="text-sm font-semibold text-gray-700">Specializations</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {teacher.specializations.slice(0, 2).map((spec, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 py-1 px-3 rounded-full"
              >
                {spec}
              </span>
            ))}
            {teacher.specializations.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-700 py-1 px-3 rounded-full">
                +{teacher.specializations.length - 2} more
              </span>
            )}
          </div>
        </div>
        
        {/* View Profile Button */}
        <Link 
          href={`/teachers/${teacher.id}`}
          className="block w-full text-center bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
};

export default TeacherCard;