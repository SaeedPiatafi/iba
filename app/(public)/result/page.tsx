"use client";

import { useState, useRef } from "react";
import {
  Search,
  RefreshCw,
  Printer,
  Download,
  Calculator,
  FlaskConical,
  BookOpen,
  Globe,
  Cpu,
  Palette,
  Dumbbell,
  User,
  Hash,
  Calendar,
  Award,
  Percent,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";

// Interfaces
interface SubjectMark {
  marks: number;
  max_marks: number;
}

interface StudentResult {
  studentInfo: {
    name: string;
    fatherName: string;
    rollNumber: string;
    academicYear: string;
  };
  marks: Record<string, SubjectMark>;
  summary: {
    totalMarks: number;
    obtainMarks: number;
    percentage: number;
    grade: string;
    status: string;
  };
}

// Subject icons mapping
const subjectIcons: Record<string, any> = {
  Mathematics: Calculator,
  Science: FlaskConical,
  English: BookOpen,
  Urdu: BookOpen,
  Islamiat: Globe,
  "Pakistan Studies": Globe,
  "Computer Science": Cpu,
  Physics: FlaskConical,
  Chemistry: FlaskConical,
  Biology: FlaskConical,
  History: Globe,
  Geography: Globe,
  Art: Palette,
  "Physical Education": Dumbbell,
  Economics: Calculator,
  "Business Studies": BookOpen,
  Accounting: Calculator,
  "Computer Studies": Cpu,
  "General Science": FlaskConical,
};

// Subject colors
const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-600",
  Science: "bg-green-100 text-green-600",
  English: "bg-teal-100 text-teal-600",
  Urdu: "bg-orange-100 text-orange-600",
  Islamiat: "bg-purple-100 text-purple-600",
  "Pakistan Studies": "bg-red-100 text-red-600",
  "Computer Science": "bg-indigo-100 text-indigo-600",
  Physics: "bg-pink-100 text-pink-600",
  Chemistry: "bg-yellow-100 text-yellow-600",
  Biology: "bg-lime-100 text-lime-600",
  History: "bg-amber-100 text-amber-600",
  Geography: "bg-cyan-100 text-cyan-600",
  Economics: "bg-emerald-100 text-emerald-600",
  "Business Studies": "bg-violet-100 text-violet-600",
  Accounting: "bg-rose-100 text-rose-600",
  Art: "bg-fuchsia-100 text-fuchsia-600",
  "Physical Education": "bg-sky-100 text-sky-600",
};

export default function ResultPortal() {
  // State management
  const [rollNumber, setRollNumber] = useState<string>("");
  const [result, setResult] = useState<StudentResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [tableScrollPosition, setTableScrollPosition] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rollNumber.trim()) {
      setError("Please enter a roll number");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      // Build API URL - only roll number, no academic year
      const apiUrl = `/api/result?rollNumber=${encodeURIComponent(rollNumber.trim())}`;

      const response = await fetch(apiUrl);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No result found");
      }

      setResult(data.data);
      
    } catch (err: any) {
      console.error("Error fetching result:", err);
      setError(err.message || "Failed to fetch result. Please check the roll number and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setRollNumber("");
    setResult(null);
    setError("");
    setTableScrollPosition(0);
  };

  // Handle print
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Handle download PDF (placeholder)
  const handleDownloadPDF = () => {
    if (result) {
      alert("PDF download feature will be available soon!");
      // In production, implement actual PDF generation
      // window.open(`/api/result/pdf?rollNumber=${result.studentInfo.rollNumber}`, '_blank');
    }
  };

  // Handle table scroll
  const scrollTable = (direction: "left" | "right") => {
    if (tableRef.current) {
      const scrollAmount = 200;
      const newPosition =
        direction === "left"
          ? tableScrollPosition - scrollAmount
          : tableScrollPosition + scrollAmount;

      tableRef.current.scrollLeft = newPosition;
      setTableScrollPosition(newPosition);
    }
  };

  // Calculate grade color
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "from-green-500 to-emerald-600";
      case "A":
        return "from-blue-500 to-cyan-600";
      case "B":
        return "from-yellow-500 to-amber-600";
      case "C":
        return "from-orange-500 to-amber-600";
      case "D":
        return "from-red-500 to-rose-600";
      case "E":
        return "from-purple-500 to-violet-600";
      case "F":
        return "from-gray-500 to-slate-600";
      default:
        return "from-blue-500 to-cyan-600";
    }
  };

  // Calculate pass status for a subject
  const getSubjectPassStatus = (marks: number, maxMarks: number = 100) => {
    const percentage = (marks / maxMarks) * 100;
    return percentage >= 33;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Student Result Portal
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Enter your roll number to view your academic results
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Search Section */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-6 md:mb-8 border border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-6 flex items-center gap-3">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
            Search Result by Roll Number
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Roll Number Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-3">
                  <span className="flex items-center gap-2">
                    <Hash className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    Roll Number *
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="Enter your roll number"
                    className="w-full px-4 md:px-5 py-3 md:py-4 text-base md:text-lg border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200 bg-white placeholder-gray-400"
                    disabled={isLoading}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isLoading && (
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600 animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium mb-1">Error</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading || !rollNumber.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg md:rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-base md:text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 md:w-5 md:h-5" />
                    View Result
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg md:rounded-xl transition-all duration-200 flex items-center justify-center gap-3 border border-gray-300"
              >
                <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                Reset Form
              </button>
            </div>

            {/* Help Text */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Note:</span> Make sure to enter the correct roll number provided by your institution.
                The system will automatically show your most recent academic result.
              </p>
            </div>
          </form>
        </div>

        {/* Result Section */}
        {result && (
          <div className="space-y-6 md:space-y-8 animate-fadeIn">
            {/* Result Card */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-6 lg:p-8 border border-gray-200">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-1">
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    Academic Result - {result.studentInfo.academicYear}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    Official result issued by the institution
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePrint}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-200 flex items-center gap-2 md:gap-3 shadow-lg hover:shadow-xl"
                  >
                    <Printer className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Print Result</span>
                    <span className="sm:hidden">Print</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-200 flex items-center gap-2 md:gap-3 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </button>
                </div>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Student Name
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-bold text-gray-900">
                    {result.studentInfo.name}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Father's Name
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-bold text-gray-900">
                    {result.studentInfo.fatherName}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Roll Number
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-bold text-gray-900 font-mono">
                    {result.studentInfo.rollNumber}
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Academic Year
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-bold text-gray-900">
                    {result.studentInfo.academicYear}
                  </p>
                </div>
              </div>

              {/* Horizontal Scrollable Table Container */}
              <div className="mb-6 md:mb-8">
                {/* Table Header with Scroll Buttons for Mobile */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    Subject-wise Marks
                  </h3>
                  <div className="md:hidden flex items-center gap-2">
                    <button
                      onClick={() => scrollTable("left")}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => scrollTable("right")}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Table Container */}
                <div className="relative">
                  <div
                    ref={tableRef}
                    className="overflow-x-auto rounded-lg border border-gray-200"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="text-left p-3 md:p-4 rounded-tl-lg">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              <span>Subject</span>
                            </div>
                          </th>
                          <th className="text-left p-3 md:p-4">
                            <div className="flex items-center gap-2">
                              <Calculator className="w-4 h-4" />
                              <span>Max Marks</span>
                            </div>
                          </th>
                          <th className="text-left p-3 md:p-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>Marks Obtained</span>
                            </div>
                          </th>
                          <th className="text-left p-3 md:p-4">
                            <div className="flex items-center gap-2">
                              <Percent className="w-4 h-4" />
                              <span>Percentage</span>
                            </div>
                          </th>
                          <th className="text-left p-3 md:p-4 rounded-tr-lg">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              <span>Status</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(result.marks).map(
                          ([subject, subjectData], index) => {
                            const SubjectIcon = subjectIcons[subject] || BookOpen;
                            const isPass = getSubjectPassStatus(subjectData.marks, subjectData.max_marks);
                            const percentage = (subjectData.marks / subjectData.max_marks) * 100;

                            return (
                              <tr
                                key={`${subject}-${index}`}
                                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                              >
                                <td className="p-3 md:p-4">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg ${subjectColors[subject] || "bg-gray-100 text-gray-600"}`}
                                    >
                                      <SubjectIcon className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      {subject}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 md:p-4 text-gray-700 font-medium">
                                  {subjectData.max_marks}
                                </td>
                                <td className="p-3 md:p-4">
                                  <span className="font-bold text-lg text-gray-900">
                                    {subjectData.marks}
                                  </span>
                                </td>
                                <td className="p-3 md:p-4">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-semibold ${percentage >= 33 ? "text-green-600" : "text-red-600"}`}
                                    >
                                      {percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 md:p-4">
                                  {isPass ? (
                                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm font-semibold">
                                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                                      PASS
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm font-semibold">
                                      <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                                      FAIL
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Scroll indicator for mobile */}
                  <div className="md:hidden mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      ← Scroll horizontally to view all columns →
                    </p>
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 md:p-4 lg:p-6 rounded-xl border border-blue-200">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-blue-100 rounded-lg md:rounded-xl flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-600 mb-1 uppercase">
                        Total Marks
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                          {result.summary.obtainMarks}
                        </p>
                        <span className="text-sm md:text-base text-gray-500">
                          /
                        </span>
                        <p className="text-base md:text-lg text-gray-500">
                          {result.summary.totalMarks}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 md:p-4 lg:p-6 rounded-xl border border-teal-200">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-teal-100 rounded-lg md:rounded-xl flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Percent className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-600 mb-1 uppercase">
                        Percentage
                      </h3>
                      <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                        {result.summary.percentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 md:p-4 lg:p-6 rounded-xl border border-green-200">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-green-100 rounded-lg md:rounded-xl flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-600 mb-1 uppercase">
                        Result Status
                      </h3>
                      <p className={`text-lg md:text-xl lg:text-2xl font-bold ${
                        result.summary.status === 'Passed' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.summary.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3 md:p-4 lg:p-6 rounded-xl border bg-gradient-to-r ${getGradeColor(result.summary.grade)}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-white/20 rounded-lg md:rounded-xl flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-white/90 mb-1 uppercase">
                        Grade
                      </h3>
                      <p className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                        {result.summary.grade}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Information */}
              <div className="pt-4 md:pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-600 mb-1">
                      Issued by Examination Department
                    </p>
                    <p className="text-xs text-gray-500">
                      This is an official document. Any tampering is punishable.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm hidden sm:inline">
                        results@institution.edu.pk
                      </span>
                      <span className="text-sm sm:hidden">Email</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm hidden sm:inline">
                        (021) 123-4567
                      </span>
                      <span className="text-sm sm:hidden">Phone</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-6 lg:p-8 border border-gray-200">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                Important Instructions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        This result is provisional until verified by the examination board.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        Contact examination department within 7 days for any discrepancies.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        Keep this result safe for future reference and admission purposes.
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        Passing percentage: 33% in each subject.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        A+ Grade: 80% and above | A Grade: 70-79% | B Grade: 60-69%
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">
                        Original mark sheet will be issued within 15 working days.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Search className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Enter Roll Number to View Result
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Use your roll number to access your academic results. Make sure you enter the correct roll number provided by your institution.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Note:</span> The system will automatically show your most recent academic result.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Print styles */
        @media print {
          button,
          .hidden-print {
            display: none !important;
          }

          .bg-gradient-to-b,
          .bg-gradient-to-r {
            background: white !important;
          }

          .shadow-xl,
          .shadow-lg {
            box-shadow: none !important;
          }

          .border {
            border: 1px solid #000 !important;
          }

          .text-blue-600,
          .text-green-600,
          .text-red-600 {
            color: #000 !important;
          }

          /* Ensure table prints properly */
          table {
            min-width: 100% !important;
          }

          .overflow-x-auto {
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}