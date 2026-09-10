import React, { useState } from 'react';
import { SubjectAttendance, DailyAttendanceRecord } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Calendar, ShieldAlert, Download, Filter } from 'lucide-react';

interface AttendanceViewProps {
  subjectAttendance: SubjectAttendance[];
  dailyLogs: DailyAttendanceRecord[];
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  subjectAttendance,
  dailyLogs,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const totalAttended = subjectAttendance.reduce((acc, curr) => acc + curr.lecturesAttended, 0);
  const totalConducted = subjectAttendance.reduce((acc, curr) => acc + curr.totalLectures, 0);
  const overallPercentage = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;

  const atRiskSubjects = subjectAttendance.filter((s) => s.percentage < 75);

  const filteredLogs = dailyLogs.filter((log) => {
    if (filterStatus === 'all') return true;
    return log.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleExportAttendanceSheet = () => {
    const headers = ['Course Code', 'Subject Title', 'Faculty Name', 'Attended', 'Total Lectures', 'Attendance %', 'Status'];
    const rows = subjectAttendance.map((s) => [
      `"${s.subjectCode}"`,
      `"${s.subjectTitle.replace(/"/g, '""')}"`,
      `"${s.facultyName}"`,
      s.lecturesAttended,
      s.totalLectures,
      `${s.percentage.toFixed(1)}%`,
      `"${s.status}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Student_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Attendance Header & Regulatory Notice Banner */}
      {atRiskSubjects.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-xs flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 block text-sm">
              Attendance Shortage Advisory Notice (SAP ERP Academic Rule §14.2)
            </span>
            <p className="text-amber-800 mt-1">
              You have <strong className="font-bold">{atRiskSubjects.length} course(s)</strong> with attendance below the mandatory <strong>75% University threshold</strong>. Shortage of attendance may lead to debarment from the final semester examination unless compensated by approved medical/institutional leave.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {atRiskSubjects.map((s) => (
                <span
                  key={s.subjectCode}
                  className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold"
                >
                  {s.subjectCode} ({s.subjectTitle}): {s.percentage.toFixed(1)}%
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Percentage Card */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Aggregate Attendance Rate
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className={`text-4xl font-extrabold ${overallPercentage >= 75 ? 'text-emerald-700' : 'text-amber-600'}`}>
                {overallPercentage.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">Min 75.0% required</span>
            </div>
            <div className="mt-2 flex items-center space-x-1.5 text-xs">
              {overallPercentage >= 75 ? (
                <span className="text-emerald-700 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Eligible for Semester Examination
                </span>
              ) : (
                <span className="text-amber-600 font-semibold flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Shortage Warning
                </span>
              )}
            </div>
          </div>

          {/* Radial visual indicator */}
          <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                overallPercentage >= 75 ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
            >
              {totalAttended}/{totalConducted}
            </div>
          </div>
        </div>

        {/* Lectures Attended vs Conducted */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Classes Attended / Conducted
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-extrabold text-[#0070f2]">
              {totalAttended}
            </span>
            <span className="text-xs text-gray-500 font-medium">attended of {totalConducted} total</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-[#0070f2] h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
          <span className="text-[11px] text-gray-500 block mt-2">
            Missed lectures: {totalConducted - totalAttended} sessions
          </span>
        </div>

        {/* Safe Margin / Buffer Calculator */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Attendance Safe Margin
            </span>
            <span className="text-xs text-gray-700 font-medium block mt-1">
              You can safely miss <strong className="text-gray-900 font-bold">4 more lectures</strong> across all subjects without falling below 75%.
            </span>
          </div>
          <button
            onClick={handleExportAttendanceSheet}
            className="w-full mt-3 py-2 px-3 border border-gray-300 hover:border-[#0070f2] bg-gray-50 hover:bg-white text-gray-800 rounded font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            title="Download attendance report CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#0070f2]" />
            <span>Export Official Attendance Sheet</span>
          </button>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Subject-Wise Attendance Breakdown (Semester 5)
            </h3>
            <span className="text-[11px] text-gray-500">
              Live automated synchronization from Faculty Daily Registers
            </span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            Updated: Today, 03:30 PM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Course Name & Faculty</th>
                <th className="py-3 px-4 text-center">Attended / Total</th>
                <th className="py-3 px-4">Attendance Progress</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subjectAttendance.map((sub) => {
                const isGood = sub.percentage >= 75;
                return (
                  <tr key={sub.subjectCode} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">{sub.subjectCode}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 block">{sub.subjectTitle}</span>
                      <span className="text-[10px] text-gray-500">Faculty: {sub.facultyName}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-gray-800">
                      {sub.lecturesAttended} / {sub.totalLectures}
                    </td>
                    <td className="py-3 px-4 w-48">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isGood ? 'bg-emerald-600' : 'bg-red-500'
                          }`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold text-xs ${isGood ? 'text-emerald-700' : 'text-red-600'}`}>
                        {sub.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isGood
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isGood ? 'Normal' : 'Shortage Alert'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Attendance Activity Log */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#0070f2]" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Recent Class Attendance Log (Punch Trail)
            </h3>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[11px] text-gray-500 mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Filter:
            </span>
            {['all', 'present', 'absent', 'late'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize transition ${
                  filterStatus === st
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Recorded By</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-3 px-4 font-mono font-medium text-gray-900">{log.date}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900 block">{log.subjectTitle}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{log.subjectCode}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{log.timeSlot}</td>
                  <td className="py-3 px-4 text-gray-600">{log.markedBy}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'Absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.status === 'Present' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {log.status === 'Absent' && <XCircle className="w-3 h-3 mr-1" />}
                      {log.status === 'Late' && <Clock className="w-3 h-3 mr-1" />}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
