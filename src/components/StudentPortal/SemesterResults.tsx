import React, { useState } from 'react';
import { SemesterResult, User } from '../../types';
import { MarksheetModal } from '../MarksheetModal';
import { Award, Download, Printer, TrendingUp, CheckCircle, FileText, ChevronRight, BarChart2 } from 'lucide-react';

interface SemesterResultsProps {
  results: SemesterResult[];
  student: User;
}

export const SemesterResults: React.FC<SemesterResultsProps> = ({ results, student }) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [showMarksheetModal, setShowMarksheetModal] = useState<boolean>(false);

  const currentResult = results.find((r) => r.semesterNumber === selectedSemester) || results[0];

  return (
    <div className="space-y-6">
      {/* Page Title & Semester Selector Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#0070f2]" />
            <h2 className="text-base font-bold text-gray-900">Semester Grade Card & Marksheet Portal</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            View credit points, internal/external evaluation, and download verified semester marksheet
          </p>
        </div>

        {/* Semester selector tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          {results.map((res) => (
            <button
              key={res.semesterNumber}
              onClick={() => setSelectedSemester(res.semesterNumber)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1 ${
                selectedSemester === res.semesterNumber
                  ? 'bg-[#0070f2] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>Semester {res.semesterNumber}</span>
              {res.semesterNumber === 5 && (
                <span className="text-[10px] bg-white/25 text-white px-1 rounded ml-1">Latest</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlight Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-medium text-gray-500 block uppercase tracking-wider">
            Semester {currentResult.semesterNumber} SGPA
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-extrabold text-[#0070f2]">
              {currentResult.sgpa.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">/ 10.0</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>Highest distinction band</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-medium text-gray-500 block uppercase tracking-wider">
            Cumulative CGPA
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-extrabold text-emerald-700">
              {currentResult.cgpa.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">/ 10.0</span>
          </div>
          <span className="text-[11px] text-gray-500 block mt-2">
            Weighted across {results.length} semesters
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-medium text-gray-500 block uppercase tracking-wider">
            Credits Earned
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-extrabold text-gray-900">
              {currentResult.totalCredits}
            </span>
            <span className="text-xs text-gray-500">Credits</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-emerald-600 font-medium">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            <span>100% Courses Cleared</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-medium text-gray-500 block uppercase tracking-wider">
              Formal Transcript
            </span>
            <span className="text-xs font-semibold text-gray-800 block mt-1">
              Serial #{currentResult.marksheetNo}
            </span>
          </div>
          <button
            onClick={() => setShowMarksheetModal(true)}
            className="w-full mt-3 py-2 px-3 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Marksheet</span>
          </button>
        </div>
      </div>

      {/* GPA Progression Trend Chart (SAP UI5 Analytical Card) */}
      <div className="bg-white p-4 md:p-5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-[#0070f2]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Academic Progression (SGPA Trend Across Semesters)
            </h3>
          </div>
          <span className="text-[11px] text-gray-500">Degree Target: Honours &gt; 8.5 CGPA</span>
        </div>

        {/* Visual Chart with bars */}
        <div className="grid grid-cols-5 gap-3 h-32 items-end pt-4 pb-2 border-b border-gray-200">
          {results.slice().reverse().map((res) => {
            const heightPercent = ((res.sgpa - 7.0) / 3.0) * 100;
            const isCurrent = res.semesterNumber === selectedSemester;
            return (
              <div
                key={res.semesterNumber}
                onClick={() => setSelectedSemester(res.semesterNumber)}
                className="flex flex-col items-center group cursor-pointer h-full justify-end"
              >
                <span className={`text-[11px] font-bold mb-1 ${isCurrent ? 'text-[#0070f2]' : 'text-gray-600'}`}>
                  {res.sgpa.toFixed(2)}
                </span>
                <div className="w-full max-w-[48px] bg-gray-100 rounded-t overflow-hidden flex flex-col justify-end h-24">
                  <div
                    style={{ height: `${Math.max(20, Math.min(100, heightPercent))}%` }}
                    className={`w-full rounded-t transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-t from-[#0070f2] to-[#00a3ff]'
                        : 'bg-gray-300 group-hover:bg-[#0070f2]/60'
                    }`}
                  />
                </div>
                <span className={`text-[11px] mt-2 font-medium ${isCurrent ? 'text-[#0070f2] font-bold' : 'text-gray-500'}`}>
                  Sem {res.semesterNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Course Grades Table (SAP Responsive Table) */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Semester {currentResult.semesterNumber} Course-Wise Grade Breakdown ({currentResult.academicYear})
            </h3>
            <span className="text-[11px] text-gray-500">
              Exam Session: {currentResult.examMonthYear} • Issue Date: {currentResult.issueDate}
            </span>
          </div>
          <button
            onClick={() => setShowMarksheetModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-gray-300 hover:border-[#0070f2] bg-white text-gray-700 hover:text-[#0070f2] rounded text-xs font-medium transition self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Grade Sheet</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-3 text-center">Credits</th>
                <th className="py-3 px-3 text-center">Internal (30)</th>
                <th className="py-3 px-3 text-center">External (70)</th>
                <th className="py-3 px-3 text-center">Total (100)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Grade Points</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentResult.subjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-blue-50/40 transition">
                  <td className="py-3 px-4 font-mono font-medium text-gray-900">{sub.code}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900 block">{sub.title}</span>
                    <span className="text-[10px] text-gray-500">Instructor: {sub.facultyName}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-gray-700">{sub.credits}</td>
                  <td className="py-3 px-3 text-center text-gray-600">{sub.internalMarks}</td>
                  <td className="py-3 px-3 text-center text-gray-600">{sub.externalMarks}</td>
                  <td className="py-3 px-3 text-center font-bold text-gray-900">{sub.totalMarks}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-blue-100 text-[#0070f2]">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-gray-800">{sub.gradePoints}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Calculation Note */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Formula: SGPA = Σ (Course Credits × Grade Points) / Total Semester Credits</span>
          <span className="font-medium text-[#0070f2]">Verified by SAP Higher Ed Academic Controller</span>
        </div>
      </div>

      {/* Marksheet Modal */}
      <MarksheetModal
        isOpen={showMarksheetModal}
        onClose={() => setShowMarksheetModal(false)}
        semesterResult={currentResult}
        student={student}
      />
    </div>
  );
};
