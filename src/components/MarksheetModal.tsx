import React, { useRef, useEffect } from 'react';
import { SemesterResult, User } from '../types';
import { Printer, Download, CheckCircle, ShieldCheck, X, Award } from 'lucide-react';

interface MarksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  semesterResult: SemesterResult;
  student: User;
}

export const MarksheetModal: React.FC<MarksheetModalProps> = ({
  isOpen,
  onClose,
  semesterResult,
  student,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Dialog Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Pinned Action Header bar - hidden during print, NEVER scrolls off screen */}
        <div className="no-print shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#354a5f] text-white border-b border-gray-400">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <Award className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="font-semibold text-xs sm:text-sm tracking-wide truncate">
              SAP S/4HANA Academic Transcripts • Semester {semesterResult.semesterNumber} Grade Card
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-xs font-medium shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Download PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-300 hover:text-white rounded hover:bg-white/10 transition"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Marksheet Document Area */}
        <div
          ref={printRef}
          id="printable-marksheet"
          className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6 md:p-8 bg-white text-gray-900 printable-content select-text"
        >
          {/* Institutional Header with SAP University Seal */}
          <div className="border-b-2 border-gray-800 pb-5 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-[#354a5f] text-white flex items-center justify-center font-bold text-xl border-2 border-amber-400 shadow-sm shrink-0">
                  SAP
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-[#1d2d3e]">
                    SAP Indian Institute of Technology & Management
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">
                    Autonomous Institute Approved by AICTE, New Delhi & UGC • Accredited NAAC Grade A++
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Electronic City Phase 1, Hosur Road, Bengaluru, Karnataka - 560100, India | www.sap-campus.edu.in
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold rounded">
                  OFFICIAL GRADE CARD (UGC/AICTE)
                </span>
                <p className="text-[11px] text-gray-500 mt-1">
                  Marksheet No: <span className="font-mono font-medium text-gray-800">{semesterResult.marksheetNo}</span>
                </p>
                <p className="text-[11px] text-gray-500">
                  Date of Issue: <span className="font-medium text-gray-800">{semesterResult.issueDate}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Student & Examination Details Grid */}
          <div className="bg-[#f8f9fa] border border-gray-200 rounded p-4 mb-6 text-xs grid grid-cols-2 sm:grid-cols-4 gap-y-2.5 gap-x-4">
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Student Full Name</span>
              <span className="font-bold text-gray-900 text-sm">{student.name}</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Roll / PRN No.</span>
              <span className="font-mono font-bold text-gray-900 text-sm">{student.studentId || 'SAP-CS-2023-049'}</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Mother's Name</span>
              <span className="font-semibold text-gray-800">Smt. Sunita Sharma</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Father's Name</span>
              <span className="font-semibold text-gray-800">Shri Rajeshwar Sharma</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Academic Program</span>
              <span className="font-semibold text-gray-800">{student.program || 'B.Tech - Computer Science'}</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Department</span>
              <span className="font-semibold text-gray-800">{student.department}</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Academic Bank of Credits (ABC ID)</span>
              <span className="font-mono font-semibold text-gray-800">ABC-849-210-049</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Semester / Year</span>
              <span className="font-semibold text-gray-800">Semester {semesterResult.semesterNumber} (Year {Math.ceil(semesterResult.semesterNumber / 2)})</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Academic Session</span>
              <span className="font-semibold text-gray-800">{semesterResult.academicYear}</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Examination Cycle</span>
              <span className="font-semibold text-gray-800">{semesterResult.examMonthYear}</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Center Code</span>
              <span className="font-semibold text-gray-800">C-104 (Bengaluru Main)</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase text-[10px] font-semibold">Overall Result Status</span>
              <span className="inline-flex items-center text-emerald-700 font-bold">
                <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {semesterResult.resultStatus}
              </span>
            </div>
          </div>

          {/* Subject-wise Marks & Grades Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs text-left border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-[#e9edf0] text-gray-800 font-bold border-b border-gray-300">
                  <th className="p-2 border-r border-gray-300 text-center w-10">#</th>
                  <th className="p-2 border-r border-gray-300 w-24">Course Code</th>
                  <th className="p-2 border-r border-gray-300">Course Title</th>
                  <th className="p-2 border-r border-gray-300 text-center w-16">Credits</th>
                  <th className="p-2 border-r border-gray-300 text-center w-20">Internal (30)</th>
                  <th className="p-2 border-r border-gray-300 text-center w-20">External (70)</th>
                  <th className="p-2 border-r border-gray-300 text-center w-20">Total (100)</th>
                  <th className="p-2 border-r border-gray-300 text-center w-16">Letter Grade</th>
                  <th className="p-2 border-r border-gray-300 text-center w-16">Grade Points</th>
                  <th className="p-2 text-center w-16">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {semesterResult.subjects.map((sub, idx) => (
                  <tr key={sub.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                    <td className="p-2 border-r border-gray-200 text-center text-gray-500">{idx + 1}</td>
                    <td className="p-2 border-r border-gray-200 font-mono font-medium text-gray-900">{sub.code}</td>
                    <td className="p-2 border-r border-gray-200 font-medium text-gray-900">
                      {sub.title}
                      <span className="block text-[10px] text-gray-500 font-normal">Instructor: {sub.facultyName}</span>
                    </td>
                    <td className="p-2 border-r border-gray-200 text-center font-semibold">{sub.credits}</td>
                    <td className="p-2 border-r border-gray-200 text-center">{sub.internalMarks}</td>
                    <td className="p-2 border-r border-gray-200 text-center">{sub.externalMarks}</td>
                    <td className="p-2 border-r border-gray-200 text-center font-bold text-gray-900">{sub.totalMarks}</td>
                    <td className="p-2 border-r border-gray-200 text-center font-bold text-[#0070f2]">{sub.grade}</td>
                    <td className="p-2 border-r border-gray-200 text-center font-semibold">{sub.gradePoints}</td>
                    <td className="p-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Performance Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-300 rounded bg-[#fafafa] p-4 mb-8 text-xs">
            <div className="flex items-center space-x-3 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-4">
              <div className="p-2.5 bg-blue-100 text-[#0070f2] rounded-full">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-gray-500 block text-[11px] font-medium">Semester GPA (SGPA)</span>
                <span className="text-2xl font-bold text-[#0070f2]">{semesterResult.sgpa.toFixed(2)}</span>
                <span className="text-[10px] text-gray-500 block">On a 10.0 Scale</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-4">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-full">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-gray-500 block text-[11px] font-medium">Cumulative GPA (CGPA)</span>
                <span className="text-2xl font-bold text-emerald-700">{semesterResult.cgpa.toFixed(2)}</span>
                <span className="text-[10px] text-gray-500 block">Up to Semester {semesterResult.semesterNumber}</span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex justify-between text-gray-700 mb-1">
                <span>Total Credits Registered:</span>
                <span className="font-bold">{semesterResult.totalCredits}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-1">
                <span>Total Credits Earned:</span>
                <span className="font-bold text-emerald-700">{semesterResult.totalCredits}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Classification:</span>
                <span className="font-bold text-[#354a5f]">{semesterResult.resultStatus}</span>
              </div>
            </div>
          </div>

          {/* Grading Legend & University Seal / Signatures */}
          <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-end text-[11px]">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Grading Scale & Equivalents:</p>
              <p className="text-gray-600 leading-relaxed">
                <strong className="text-gray-800">O</strong> (90-100, Point 10) • <strong className="text-gray-800">A+</strong> (85-89, Point 10) • <strong className="text-gray-800">A</strong> (80-84, Point 9) • <strong className="text-gray-800">B+</strong> (70-79, Point 8) • <strong className="text-gray-800">B</strong> (60-69, Point 7) • Minimum passing marks: 40% in each course.
              </p>
              <div className="mt-3 flex items-center space-x-2 text-[10px] text-gray-500">
                <div className="w-12 h-12 bg-gray-100 border border-gray-300 flex items-center justify-center font-mono text-[9px] text-center p-1">
                  [QR-VERIFY]
                </div>
                <span>Digitally signed and verifiable via SAP S/4HANA Academic Portal verification code: <strong>{semesterResult.marksheetNo}</strong></span>
              </div>
            </div>

            <div className="flex justify-between md:justify-end md:space-x-12 pt-6">
              <div className="text-center">
                <div className="h-10 border-b border-dashed border-gray-400 w-32 mb-1 flex items-center justify-center">
                  <span className="font-serif italic text-gray-700 text-xs">Meera Nambiar</span>
                </div>
                <span className="text-[10px] font-semibold text-gray-700 block">Class Coordinator</span>
                <span className="text-[9px] text-gray-500">Dept. of Computer Science</span>
              </div>

              <div className="text-center">
                <div className="h-10 border-b border-dashed border-gray-400 w-36 mb-1 flex items-center justify-center">
                  <span className="font-serif italic text-blue-900 font-bold text-xs">Rajesh Varma</span>
                </div>
                <span className="text-[10px] font-bold text-gray-900 block">Controller of Examinations</span>
                <span className="text-[9px] text-gray-500">SAP University, Bengaluru</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
