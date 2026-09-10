import React from 'react';
import { BarChart3, TrendingUp, Award, Users, ShieldCheck, PieChart, Activity } from 'lucide-react';

export const AnalyticsCenter: React.FC = () => {
  const departmentStats = [
    { name: 'Computer Science & Engineering', avgGpa: 8.42, passRate: 98.2, attendance: 89.1, students: 640 },
    { name: 'Electronics & Communication', avgGpa: 8.15, passRate: 96.5, attendance: 86.4, students: 480 },
    { name: 'Mechanical Engineering', avgGpa: 7.82, passRate: 94.0, attendance: 84.2, students: 420 },
    { name: 'Civil & Structural Engineering', avgGpa: 7.64, passRate: 92.8, attendance: 83.5, students: 360 },
    { name: 'Information Technology & AI', avgGpa: 8.56, passRate: 99.1, attendance: 91.2, students: 550 },
  ];

  const semesterGpaTrends = [
    { semester: 'Sem 1', gpa: 8.12 },
    { semester: 'Sem 2', gpa: 8.24 },
    { semester: 'Sem 3', gpa: 8.35 },
    { semester: 'Sem 4', gpa: 8.41 },
    { semester: 'Sem 5', gpa: 8.52 },
    { semester: 'Sem 6', gpa: 8.68 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#0070f2]" />
            <span>SAP Executive Academic Analytics & Intelligence Center</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Holistic cross-departmental KPI evaluation, grade distributions, and predictive student success metrics
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-[#0070f2] border border-blue-200 rounded self-start sm:self-auto">
          Academic Audit Period 2025-2026
        </span>
      </div>

      {/* Analytical Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Average GPA Bar Chart */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Department-Wise Average GPA Comparison
            </h3>
            <span className="text-[11px] text-gray-500">Benchmark: 8.0</span>
          </div>

          <div className="space-y-4">
            {departmentStats.map((dept) => {
              const widthPct = ((dept.avgGpa - 6.0) / 4.0) * 100;
              return (
                <div key={dept.name} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800 truncate max-w-[280px]">
                      {dept.name}
                    </span>
                    <span className="font-bold text-[#0070f2]">{dept.avgGpa.toFixed(2)} CGPA</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#0070f2] to-[#00a3ff] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, Math.min(100, widthPct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Semester GPA Progression Trend */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                University Cohort Progression Trend
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.56 CGPA Growth
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2 h-40 items-end pt-4 pb-2 border-b border-gray-200">
              {semesterGpaTrends.map((s) => {
                const heightPct = ((s.gpa - 7.5) / 1.5) * 100;
                return (
                  <div key={s.semester} className="flex flex-col items-center h-full justify-end">
                    <span className="text-[10px] font-bold text-[#0070f2] mb-1">{s.gpa.toFixed(2)}</span>
                    <div className="w-full max-w-[36px] bg-gray-100 rounded-t h-28 flex flex-col justify-end">
                      <div
                        className="w-full bg-emerald-600 rounded-t transition-all duration-300"
                        style={{ height: `${Math.max(15, Math.min(100, heightPct))}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-600 font-medium mt-1">{s.semester}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 text-[11px] text-gray-500 flex justify-between">
            <span>Overall University Pass Rate: <strong>96.8%</strong></span>
            <span>Accreditation Status: <strong>NAAC A++</strong></span>
          </div>
        </div>
      </div>

      {/* Department Compliance & Performance Ledger */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Academic Performance & Attendance Matrix by Department
          </h3>
          <span className="text-xs text-gray-500">Real-Time Data Cube</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Academic Department</th>
                <th className="py-3 px-4 text-center">Enrolled Students</th>
                <th className="py-3 px-4 text-center">Average CGPA</th>
                <th className="py-3 px-4 text-center">Avg Attendance</th>
                <th className="py-3 px-4 text-center">Semester Pass %</th>
                <th className="py-3 px-4 text-center">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departmentStats.map((dept) => (
                <tr key={dept.name} className="hover:bg-blue-50/40 transition">
                  <td className="py-3 px-4 font-semibold text-gray-900">{dept.name}</td>
                  <td className="py-3 px-4 text-center text-gray-700 font-medium">{dept.students}</td>
                  <td className="py-3 px-4 text-center font-bold text-[#0070f2]">{dept.avgGpa.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">{dept.attendance}%</td>
                  <td className="py-3 px-4 text-center font-bold text-gray-900">{dept.passRate}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Fully Compliant
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
