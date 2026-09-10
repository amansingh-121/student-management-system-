import React from 'react';
import { User, StudentRecord } from '../../types';
import { Users, Briefcase, CreditCard, ShieldCheck, Activity, Radio, Plus, ChevronRight, ArrowUpRight } from 'lucide-react';

interface AdminDashboardProps {
  admin: User;
  studentsCount: number;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  studentsCount,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Administrator Header */}
      <div className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={admin.avatar}
              alt={admin.name}
              className="w-16 h-16 rounded-full border-2 border-white/80 object-cover shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{admin.name}</h1>
                <span className="bg-purple-400 text-purple-950 text-[10px] font-bold px-2 py-0.5 rounded">
                  System Admin
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-0.5">
                {admin.department} • Administrator ID: <span className="font-mono text-amber-300">{admin.adminId}</span>
              </p>
              <p className="text-[11px] text-gray-300 mt-1">
                University ERP Central Authority • SAP S/4HANA Cloud Instance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('students')}
              className="px-4 py-2 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={() => onNavigateTab('broadcast')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Total Students</span>
              <Users className="w-4 h-4 text-[#0070f2]" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-[#0070f2]">2,450</span>
              <span className="text-xs text-gray-500 ml-1">Enrolled</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">+140 In Current Intake</p>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
            <span>Manage directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('analytics')}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Active Faculty</span>
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-emerald-700">184</span>
              <span className="text-xs text-gray-500 ml-1">Professors</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">1:13 Teacher-Student Ratio</p>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
            <span>View departments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Fee Collections</span>
              <CreditCard className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-amber-700">₹8.42 Cr</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">92.4% Semester Target Met</p>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
            <span>Treasury ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('analytics')}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] transition cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">Campus Attendance</span>
              <Activity className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-purple-800">86.8%</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">Regulatory Standard: 75.0%</p>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
            <span>Intelligence center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Action Quick Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div
          onClick={() => onNavigateTab('students')}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#0070f2] transition cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-[#0070f2] rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 block text-sm">Student Enrollment Master</span>
              <span className="text-gray-500">Add or edit student database profiles</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>

        <div
          onClick={() => onNavigateTab('fees')}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#0070f2] transition cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 block text-sm">FI-CA Fee Reconciliation</span>
              <span className="text-gray-500">Audit tuition payments & dues</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>

        <div
          onClick={() => onNavigateTab('broadcast')}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#0070f2] transition cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 block text-sm">Broadcast Emergency Notice</span>
              <span className="text-gray-500">Push real-time alert to all portals</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};
