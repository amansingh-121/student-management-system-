import React, { useState } from 'react';
import { CourseAssignment, StudentRecord } from '../../types';
import { Check, X, Clock, Users, Calendar, CheckCircle2, Save, Sparkles, Filter } from 'lucide-react';

interface AttendanceMarkerProps {
  courses: CourseAssignment[];
  students: StudentRecord[];
  onAttendanceSubmitted?: (courseCode: string, date: string, attendanceData: Record<string, string>, timeSlot: string) => void;
}

export const AttendanceMarker: React.FC<AttendanceMarkerProps> = ({
  courses,
  students,
  onAttendanceSubmitted,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.code || 'CS-501');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM - 10:00 AM');
  
  // Student ID to status map
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>(() => {
    const initial: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    students.forEach((s) => {
      // default most to present, one to absent for realism
      initial[s.id] = s.studentId.includes('033') ? 'Absent' : 'Present';
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentCourse = courses.find((c) => c.code === selectedCourse) || courses[0];

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setSavedSuccess(false);
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    students.forEach((s) => {
      updated[s.id] = 'Present';
    });
    setAttendanceMap(updated);
    setSavedSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    if (onAttendanceSubmitted) {
      onAttendanceSubmitted(selectedCourse, selectedDate, attendanceMap, timeSlot);
    }
    setTimeout(() => {
      setSavedSuccess(false);
    }, 6000);
  };

  const presentCount = Object.values(attendanceMap).filter((v) => v === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === 'Absent').length;
  const lateCount = Object.values(attendanceMap).filter((v) => v === 'Late').length;
  const totalCount = students.length;
  const attendanceRate = totalCount > 0 ? ((presentCount + lateCount * 0.5) / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header & Course Selection Toolbar */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#0070f2]" />
              <span>Faculty Attendance Roll Register (SAP Roll-Call)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select course, mark daily student presence, and synchronize with university attendance ledger
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded text-xs font-semibold transition flex items-center space-x-1.5 self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All Present (1-Click)</span>
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Select Assigned Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-medium text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title} (Sem {c.semester})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Session Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-medium text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Lecture Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-medium text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
            >
              <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM (Period 1)</option>
              <option value="11:30 AM - 01:00 PM">11:30 AM - 01:00 PM (Period 3)</option>
              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM (Period 5)</option>
              <option value="03:15 PM - 05:15 PM">03:15 PM - 05:15 PM (Lab Session)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Session Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Enrolled</span>
          <span className="text-2xl font-extrabold text-gray-900">{totalCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-emerald-200 shadow-xs bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Present</span>
          <span className="text-2xl font-extrabold text-emerald-700">{presentCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-red-200 shadow-xs bg-red-50/20">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">Absent</span>
          <span className="text-2xl font-extrabold text-red-600">{absentCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-xs bg-amber-50/20">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Late</span>
          <span className="text-2xl font-extrabold text-amber-700">{lateCount}</span>
        </div>
      </div>

      {/* Student Roster Marking Table */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Student Attendance Roster ({students.length} Students)
          </h3>
          <span className="text-xs text-gray-500 font-mono">
            {currentCourse.schedule} • {currentCourse.room}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll ID</th>
                <th className="py-3 px-4">Overall Attendance</th>
                <th className="py-3 px-4 text-center">Mark Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => {
                const status = attendanceMap[student.id] || 'Present';
                return (
                  <tr key={student.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-gray-300"
                        />
                        <div>
                          <span className="font-semibold text-gray-900 block">{student.fullName}</span>
                          <span className="text-[10px] text-gray-500">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">{student.studentId}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-bold ${
                            student.attendanceRate >= 75 ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {student.attendanceRate.toFixed(1)}%
                        </span>
                        {student.attendanceRate < 75 && (
                          <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded font-bold">
                            Warning
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex rounded border border-gray-200 p-0.5 bg-gray-50">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Present')}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            status === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            status === 'Absent'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Late')}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            status === 'Late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer with Submit Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">
              Attendance entries synchronize across student portal, ledger, and timetable.
            </span>
            {savedSuccess && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 animate-in fade-in">
                ✓ Updated everywhere in real-time
              </span>
            )}
          </div>
          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-2 text-white rounded font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-xs ${
              savedSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-[#0070f2] hover:bg-[#0064d9]'
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Committed to SAP Ledger</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Submit & Commit to SAP Ledger</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
