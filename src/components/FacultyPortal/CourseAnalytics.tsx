import React, { useState } from 'react';
import { CourseAssignment, StudentRecord } from '../../types';
import { BarChart3, AlertTriangle, CheckCircle2, TrendingUp, BellRing, Users, Sparkles } from 'lucide-react';

interface CourseAnalyticsProps {
  courses: CourseAssignment[];
  students: StudentRecord[];
  onSendAdvisory: (studentName: string) => void;
}

export const CourseAnalytics: React.FC<CourseAnalyticsProps> = ({
  courses,
  students,
  onSendAdvisory,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(courses[0]?.code || 'CS-501');
  const [alertSentMap, setAlertSentMap] = useState<Record<string, boolean>>({});

  const currentCourse = courses.find((c) => c.code === selectedCourseCode) || courses[0];

  // Calculate grade distribution
  const gradeDistribution = [
    { grade: 'O', count: 18, percentage: 28, color: 'bg-emerald-600' },
    { grade: 'A+', count: 24, percentage: 38, color: 'bg-blue-600' },
    { grade: 'A', count: 14, percentage: 22, color: 'bg-cyan-600' },
    { grade: 'B+', count: 5, percentage: 8, color: 'bg-amber-500' },
    { grade: 'B', count: 2, percentage: 3, color: 'bg-orange-500' },
    { grade: 'F', count: 1, percentage: 1, color: 'bg-red-600' },
  ];

  // At-risk students: Attendance < 75% or CGPA < 7.5
  const atRiskStudents = students.filter(
    (s) => s.attendanceRate < 75 || s.cgpa < 7.5
  );

  const handleSendAlert = (student: StudentRecord) => {
    setAlertSentMap((prev) => ({ ...prev, [student.id]: true }));
    onSendAdvisory(student.fullName);
  };

  return (
    <div className="space-y-6">
      {/* Header & Course selector */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[#0070f2]" />
            <span>SAP UI5 Class Analytics & At-Risk Diagnostic Center</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Statistical distribution of grades, attendance health, and proactive student intervention
          </p>
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
          >
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Class Average Score
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-extrabold text-[#0070f2]">
              {currentCourse.classAverageMarks}%
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            +3.8% vs Department Average
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Pass Percentage
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-extrabold text-emerald-700">98.4%</span>
          </div>
          <span className="text-[11px] text-gray-500 block mt-1">
            63 of 64 students cleared
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Average Attendance
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-extrabold text-gray-900">
              {currentCourse.attendanceRate}%
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            Satisfies Board criteria
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Identified At-Risk
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-extrabold text-red-600">
              {atRiskStudents.length}
            </span>
            <span className="text-xs text-gray-500">Students</span>
          </div>
          <span className="text-[11px] text-red-600 font-medium block mt-1">
            Requires academic advisory
          </span>
        </div>
      </div>

      {/* Grade Distribution Chart (SAP Micro-Column Chart) */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
          Grade Distribution (Gaussian Bell Curve Breakdown)
        </h3>

        <div className="space-y-3">
          {gradeDistribution.map((item) => (
            <div key={item.grade} className="flex items-center text-xs">
              <span className="w-8 font-bold text-gray-800 shrink-0 font-mono">{item.grade}</span>
              <div className="flex-1 mx-3 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full ${item.color} transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ width: `${item.percentage * 2.5}%` }}
                >
                  {item.percentage > 10 && (
                    <span className="text-[10px] text-white font-bold">{item.count}</span>
                  )}
                </div>
              </div>
              <span className="w-16 text-right font-medium text-gray-600 shrink-0">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* At-Risk Students Early Warning Interventions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Students Requiring Academic Attention ({atRiskStudents.length} Found)
            </h3>
          </div>
          <span className="text-xs text-amber-800 font-medium">Auto-flagged by SAP Early Warning System</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll ID</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Current CGPA</th>
                <th className="py-3 px-4">Identified Risk Factor</th>
                <th className="py-3 px-4 text-center">Intervention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {atRiskStudents.map((student) => {
                const isSent = alertSentMap[student.id];
                return (
                  <tr key={student.id} className="hover:bg-amber-50/30 transition">
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
                    <td className="py-3 px-4">
                      <span className={`font-bold ${student.attendanceRate < 75 ? 'text-red-600' : 'text-gray-800'}`}>
                        {student.attendanceRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-800">{student.cgpa.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                        {student.attendanceRate < 75 ? 'Attendance Shortage (<75%)' : 'Academic Advisory'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSendAlert(student)}
                        disabled={isSent}
                        className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center space-x-1 mx-auto ${
                          isSent
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                        }`}
                      >
                        {isSent ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Warning Sent</span>
                          </>
                        ) : (
                          <>
                            <BellRing className="w-3.5 h-3.5" />
                            <span>Send Warning</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
