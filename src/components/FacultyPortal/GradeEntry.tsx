import React, { useState } from 'react';
import { CourseAssignment, StudentRecord } from '../../types';
import { Award, Save, CheckCircle2, AlertCircle, FileCheck, Send } from 'lucide-react';
import { usePersistentState, STORAGE_KEYS } from '../../utils/storage';

export interface StudentGradeInput {
  studentId: string;
  internal: number;
  external: number;
}

interface GradeEntryProps {
  courses: CourseAssignment[];
  students: StudentRecord[];
  onGradesPublished?: (courseCode: string, gradesMap?: Record<string, StudentGradeInput>) => void;
}

export const GradeEntry: React.FC<GradeEntryProps> = ({
  courses,
  students,
  onGradesPublished,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.code || 'CS-501');
  const [examType, setExamType] = useState<string>('final');

  // Prepopulate marks for enrolled students
  const initialGradesMap = () => {
    const map: Record<string, StudentGradeInput> = {};
    students.forEach((s, idx) => {
      const internalMarks = idx === 0 ? 28 : idx === 1 ? 29 : idx === 2 ? 21 : 26;
      const externalMarks = idx === 0 ? 64 : idx === 1 ? 67 : idx === 2 ? 46 : 60;
      map[s.id] = {
        studentId: s.id,
        internal: internalMarks,
        external: externalMarks,
      };
    });
    return map;
  };

  const [gradesMap, setGradesMap] = usePersistentState<Record<string, StudentGradeInput>>(
    STORAGE_KEYS.GRADES_MAP,
    initialGradesMap()
  );

  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const calculateGradeDetails = (internal: number, external: number) => {
    const total = internal + external;
    let grade = 'F';
    let points = 0;

    if (total >= 90) {
      grade = 'O (Outstanding)';
      points = 10;
    } else if (total >= 85) {
      grade = 'A+ (Excellent)';
      points = 10;
    } else if (total >= 80) {
      grade = 'A (Very Good)';
      points = 9;
    } else if (total >= 70) {
      grade = 'B+ (Good)';
      points = 8;
    } else if (total >= 60) {
      grade = 'B (Above Avg)';
      points = 7;
    } else if (total >= 50) {
      grade = 'C (Average)';
      points = 6;
    } else if (total >= 40) {
      grade = 'P (Pass)';
      points = 5;
    }

    return { total, grade, points, status: total >= 40 ? 'Pass' : 'Fail' };
  };

  const handleInternalChange = (studentId: string, val: number) => {
    const safeVal = Math.min(30, Math.max(0, val || 0));
    setGradesMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        internal: safeVal,
      },
    }));
    setPublishedSuccess(false);
  };

  const handleExternalChange = (studentId: string, val: number) => {
    const safeVal = Math.min(70, Math.max(0, val || 0));
    setGradesMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        external: safeVal,
      },
    }));
    setPublishedSuccess(false);
  };

  const handlePublish = () => {
    setPublishedSuccess(true);
    if (onGradesPublished) {
      onGradesPublished(selectedCourse, gradesMap);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Card */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#0070f2]" />
              <span>Faculty Examination & Grade Evaluation Workbench</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter internal assessment scores and semester external exam marks with automated grade-point calculation
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish to Student Portal</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-medium text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title} (Credits: {c.credits})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Evaluation Cycle</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-medium text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
            >
              <option value="final">End-Semester University Examination 2025-26</option>
              <option value="midterm">Midterm Continuous Assessment (Internal)</option>
            </select>
          </div>
        </div>
      </div>

      {publishedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Grades for {selectedCourse} published! Official semester marksheets have been regenerated in the Student Self-Service portal.</span>
        </div>
      )}

      {/* Grade Entry Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Evaluation Ledger ({students.length} Students Enrolled)
          </h3>
          <span className="text-xs text-gray-500 font-mono">Weightage: Internal 30% | External 70%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-3 text-center w-28">Internal Marks (Max 30)</th>
                <th className="py-3 px-3 text-center w-28">External Marks (Max 70)</th>
                <th className="py-3 px-3 text-center">Total (100)</th>
                <th className="py-3 px-3 text-center">Computed Grade</th>
                <th className="py-3 px-3 text-center">Grade Points</th>
                <th className="py-3 px-4 text-center">Pass / Fail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => {
                const data = gradesMap[student.id] || { studentId: student.id, internal: 25, external: 60 };
                const computed = calculateGradeDetails(data.internal, data.external);
                return (
                  <tr key={student.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-gray-300"
                        />
                        <span className="font-semibold text-gray-900">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-gray-700">{student.studentId}</td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={data.internal}
                        onChange={(e) => handleInternalChange(student.id, Number(e.target.value))}
                        className="w-16 p-1 border border-gray-300 rounded text-center font-bold text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={70}
                        value={data.external}
                        onChange={(e) => handleExternalChange(student.id, Number(e.target.value))}
                        className="w-16 p-1 border border-gray-300 rounded text-center font-bold text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-base text-gray-900">
                      {computed.total}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-blue-100 text-[#0070f2]">
                        {computed.grade.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-gray-800">
                      {computed.points}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          computed.status === 'Pass'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {computed.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
          <span>Grading Scheme: Relative and Absolute hybrid as per SAP University Academic Council Guidelines</span>
          <span className="font-semibold text-emerald-700">Digital Signatures Enabled</span>
        </div>
      </div>
    </div>
  );
};
