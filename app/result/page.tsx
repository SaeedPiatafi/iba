// app/result/page.tsx
'use client';

import { useState, useEffect, ReactNode } from 'react';
import { 
  Search, RefreshCw, Printer, Download, Calculator, 
  FlaskConical, BookOpen, Globe, Cpu, Palette, 
  Dumbbell, GraduationCap, User, Hash, Calendar,
  Award, Percent, CheckCircle, XCircle, Clock,
  LucideIcon
} from 'lucide-react';
import Resulthero from '../components/resulthero'

interface Subject {
  id: number;
  name: string;
  icon: string;
  colorClass: string;
  maxMarks: number;
  obtained: number;
}

interface StudentResult {
  id: string;
  name: string;
  fatherName: string;
  rollNumber: string;
  class: string;
  section: string;
  year: string;
  testType: string;
  attendance: string;
  attendanceDays: string;
  subjects: Subject[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  status: string;
  grade: string;
}

export default function ResultPortal() {
  // State management
  const [year, setYear] = useState<string>('');
  const [testType, setTestType] = useState<string>('');
  const [rollNumber, setRollNumber] = useState<string>('');
  const [result, setResult] = useState<StudentResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sample data
  const sampleResults: StudentResult[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      fatherName: 'Michael Johnson',
      rollNumber: 'STU2023-056',
      class: '10th Grade',
      section: 'A',
      year: '2023-2024',
      testType: 'First Term',
      attendance: '92%',
      attendanceDays: '138/150',
      subjects: [
        { id: 1, name: 'Mathematics', icon: 'Calculator', colorClass: 'bg-blue-100 text-blue-600', maxMarks: 100, obtained: 85 },
        { id: 2, name: 'Science', icon: 'FlaskConical', colorClass: 'bg-green-100 text-green-600', maxMarks: 100, obtained: 90 },
        { id: 3, name: 'English', icon: 'BookOpen', colorClass: 'bg-teal-100 text-teal-600', maxMarks: 100, obtained: 78 },
        { id: 4, name: 'Social Studies', icon: 'Globe', colorClass: 'bg-orange-100 text-orange-600', maxMarks: 100, obtained: 82 },
        { id: 5, name: 'Computer Science', icon: 'Cpu', colorClass: 'bg-blue-100 text-blue-600', maxMarks: 100, obtained: 95 },
        { id: 6, name: 'Art & Design', icon: 'Palette', colorClass: 'bg-purple-100 text-purple-600', maxMarks: 50, obtained: 45 },
        { id: 7, name: 'Physical Education', icon: 'Dumbbell', colorClass: 'bg-pink-100 text-pink-600', maxMarks: 50, obtained: 48 },
      ],
      totalMarks: 523,
      maxTotalMarks: 600,
      percentage: 87.2,
      status: 'PASS',
      grade: 'A+'
    },
    {
      id: '2',
      name: 'Alex Chen',
      fatherName: 'David Chen',
      rollNumber: 'STU2023-042',
      class: '10th Grade',
      section: 'B',
      year: '2023-2024',
      testType: 'Second Term',
      attendance: '88%',
      attendanceDays: '132/150',
      subjects: [
        { id: 1, name: 'Mathematics', icon: 'Calculator', colorClass: 'bg-blue-100 text-blue-600', maxMarks: 100, obtained: 92 },
        { id: 2, name: 'Science', icon: 'FlaskConical', colorClass: 'bg-green-100 text-green-600', maxMarks: 100, obtained: 88 },
        { id: 3, name: 'English', icon: 'BookOpen', colorClass: 'bg-teal-100 text-teal-600', maxMarks: 100, obtained: 81 },
        { id: 4, name: 'Social Studies', icon: 'Globe', colorClass: 'bg-orange-100 text-orange-600', maxMarks: 100, obtained: 76 },
        { id: 5, name: 'Computer Science', icon: 'Cpu', colorClass: 'bg-blue-100 text-blue-600', maxMarks: 100, obtained: 94 },
        { id: 6, name: 'Art & Design', icon: 'Palette', colorClass: 'bg-purple-100 text-purple-600', maxMarks: 50, obtained: 42 },
        { id: 7, name: 'Physical Education', icon: 'Dumbbell', colorClass: 'bg-pink-100 text-pink-600', maxMarks: 50, obtained: 46 },
      ],
      totalMarks: 519,
      maxTotalMarks: 600,
      percentage: 86.5,
      status: 'PASS',
      grade: 'A'
    }
  ];

  const testTypes = ['First Term', 'Second Term', 'Mid Term', 'Final Examination'];
  const academicYears = ['2023-2024', '2022-2023', '2021-2022', '2020-2021'];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!year || !testType || !rollNumber) {
      alert('Please fill all fields to view results.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const foundResult = sampleResults.find(r => 
        r.rollNumber === rollNumber && 
        r.year === year && 
        r.testType === testType
      );

      if (foundResult) {
        setResult(foundResult);
        setShowResult(true);
      } else {
        alert('No result found for the given criteria. Please check your inputs.');
      }
      
      setIsLoading(false);
    }, 800);
  };

  // Handle reset
  const handleReset = () => {
    setYear('');
    setTestType('');
    setRollNumber('');
    setResult(null);
    setShowResult(false);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Render icon component
  const renderIcon = (iconName: string, className: string = '') => {
    const icons: { [key: string]: ReactNode } = {
      Calculator: <Calculator className={`w-5 h-5 ${className}`} />,
      FlaskConical: <FlaskConical className={`w-5 h-5 ${className}`} />,
      BookOpen: <BookOpen className={`w-5 h-5 ${className}`} />,
      Globe: <Globe className={`w-5 h-5 ${className}`} />,
      Cpu: <Cpu className={`w-5 h-5 ${className}`} />,
      Palette: <Palette className={`w-5 h-5 ${className}`} />,
      Dumbbell: <Dumbbell className={`w-5 h-5 ${className}`} />,
    };
    
    return icons[iconName] || <BookOpen className={`w-5 h-5 ${className}`} />;
  };

  // Initialize with sample data
  useEffect(() => {
    setYear('2023-2024');
    setTestType('First Term');
    setRollNumber('STU2023-056');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Resulthero/>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600 mb-8 pb-4 border-b-2 border-blue-600 flex items-center gap-3">
            <Search className="w-6 h-6" />
            Search Your Result
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Academic Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-3">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Academic Year
                  </span>
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select Year</option>
                  {academicYears.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* Test Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-3">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-500" />
                    Test Type
                  </span>
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select Test Type</option>
                  {testTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-3">
                  <span className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-green-500" />
                    Roll Number
                  </span>
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter your roll number"
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Get Results
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 border border-gray-300"
              >
                <RefreshCw className="w-5 h-5" />
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        {showResult && result && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 animate-fadeIn">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-3">
                <Award className="w-7 h-7" />
                Academic Result
              </h2>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handlePrint}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <Printer className="w-5 h-5" />
                  Print Result
                </button>
                <button 
                  onClick={() => alert('Download feature coming soon!')}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Student Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-600">Student Name</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{result.name}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-600">Father's Name</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{result.fatherName}</p>
              </div>
              
              <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                <div className="flex items-center gap-3 mb-3">
                  <Hash className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-semibold text-gray-600">Roll Number</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{result.rollNumber}</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-600">Academic Year</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{result.year}</p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-semibold text-gray-600">Test Type</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{result.testType}</p>
              </div>
              
              <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-pink-600" />
                  <span className="text-sm font-semibold text-gray-600">Attendance</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{result.attendance} ({result.attendanceDays} days)</p>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="text-left p-4 rounded-tl-xl">Subject</th>
                    <th className="text-left p-4">Maximum Marks</th>
                    <th className="text-left p-4">Marks Obtained</th>
                    <th className="text-left p-4">Percentage</th>
                    <th className="text-left p-4 rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((subject) => {
                    const percentageNum = (subject.obtained / subject.maxMarks) * 100;
                    const percentageStr = percentageNum.toFixed(1);
                    const isPass = subject.obtained >= (subject.maxMarks * 0.33);
                    
                    return (
                      <tr key={subject.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${subject.colorClass}`}>
                              {renderIcon(subject.icon)}
                            </div>
                            <span className="font-medium text-gray-900">{subject.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{subject.maxMarks}</td>
                        <td className="p-4">
                          <span className="font-bold text-lg text-gray-900">{subject.obtained}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Percent className="w-4 h-4 text-gray-500" />
                            <span className={`font-semibold ${percentageNum >= 33 ? 'text-green-600' : 'text-red-600'}`}>
                              {percentageStr}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {isPass ? (
                            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                              <CheckCircle className="w-4 h-4" />
                              PASS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                              <XCircle className="w-4 h-4" />
                              FAIL
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Result Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Total Marks</h3>
                    <p className="text-3xl font-bold text-gray-900">{result.totalMarks}/{result.maxTotalMarks}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl border border-teal-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-teal-100 rounded-xl">
                    <Percent className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Percentage</h3>
                    <p className="text-3xl font-bold text-gray-900">{result.percentage}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Result Status</h3>
                    <p className="text-3xl font-bold text-gray-900">{result.status}</p>
                    <p className="text-sm text-gray-600 mt-1">Grade: {result.grade}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">Attendance</h3>
                    <p className="text-3xl font-bold text-gray-900">{result.attendance}</p>
                    <p className="text-sm text-gray-600 mt-1">{result.attendanceDays} days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        /* Print styles */
        @media print {
          button {
            display: none !important;
          }
          
          .bg-gray-50 {
            background-color: white !important;
          }
          
          .shadow-xl, .shadow-lg {
            box-shadow: none !important;
          }
          
          .border {
            border: 1px solid #e5e7eb !important;
          }
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
}