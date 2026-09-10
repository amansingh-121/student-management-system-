import React from 'react';
import { User, CourseAssignment } from '../../types';
import { BookOpen, Users, CheckSquare, Award, Calendar, Clock, MapPin, ChevronRight, ArrowUpRight } from 'lucide-react';

interface FacultyDashboardProps {
  faculty: User;
  courses: CourseAssignment[];
  onNavigateTab: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  faculty,
  courses,
  onNavigateTab,
}) => {
  const totalStudents = courses.reduce((acc, c) => acc + c.enrolledStudentsCount, 0);

  return (
    <div className="space-y-6">
      {/* Faculty Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5282] text-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={faculty.avatar}
              alt={faculty.name}
              className="w-16 h-16 rounded-full border-2 border-white/80 object-cover shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{faculty.name}</h1>
                <span className="bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">
                  Faculty Lead
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-0.5">
                {faculty.program} • Faculty ID: <span className="font-mono text-amber-300">{faculty.teacherId}</span>
              </p>
              <p className="text-[11px] text-gray-300 mt-1">
                Department of {faculty.department} • Active Semester Cycle 2025-26
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => onNavigateTab('grades')}
              className="px-4 py-2 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Enter Grades</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Assigned Courses</span>
              <BookOpen className="w-4 h-4 text-[#0070f2]" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-[#0070f2]">{courses.length}</span>
              <span className="text-xs text-gray-500 ml-1">Courses</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">CS-501, CS-505P, CS-301</p>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
            <span>Course management</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Total Students</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-emerald-700">{totalStudents}</span>
              <span className="text-xs text-gray-500 ml-1">Enrolled</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">Across 3 class batches</p>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
            <span>Open roster</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('grades')}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Grade Submissions</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-amber-700">1</span>
              <span className="text-xs text-gray-500 ml-1">Pending</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">Semester 5 End-Term Draft</p>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
            <span>Review & Publish</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('analytics')}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Class Performance</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-purple-800">82.4%</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">98.4% Pass Percentage</p>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
            <span>View analytics & at-risk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Courses Overview List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Teaching Assignments & Course Load (Semester 5 & 3)
          </h3>
          <span className="text-xs text-gray-500">SAP Faculty Workload Portal</span>
        </div>

        <div className="divide-y divide-gray-100">
          {courses.map((course) => (
            <div key={course.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-[#0070f2] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {course.code}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900">{course.title}</h4>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1.5">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {course.schedule}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {course.room}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {course.enrolledStudentsCount} Students
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigateTab('attendance')}
                  className="px-3 py-1.5 border border-gray-300 hover:border-[#0070f2] bg-white text-gray-700 hover:text-[#0070f2] rounded text-xs font-semibold transition shadow-xs"
                >
                  Take Attendance
                </button>
                <button
                  onClick={() => onNavigateTab('grades')}
                  className="px-3 py-1.5 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-xs font-semibold transition shadow-xs"
                >
                  Enter Grades
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
