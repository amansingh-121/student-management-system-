import React from 'react';
import { User, SemesterResult, SubjectAttendance, FeeInvoice, TimetableSlot } from '../../types';
import {
  Award,
  Clock,
  CreditCard,
  BookOpen,
  FileText,
  Calendar,
  Download,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
} from 'lucide-react';

interface StudentDashboardProps {
  student: User;
  latestResult: SemesterResult;
  subjectAttendance: SubjectAttendance[];
  invoices: FeeInvoice[];
  timetableSlots?: TimetableSlot[];
  onNavigateTab: (tab: string) => void;
  onOpenMarksheetModal: () => void;
  onSimulateTimetableChange?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  latestResult,
  subjectAttendance,
  invoices,
  timetableSlots = [],
  onNavigateTab,
  onOpenMarksheetModal,
  onSimulateTimetableChange,
}) => {
  const totalAttended = subjectAttendance.reduce((a, b) => a + b.lecturesAttended, 0);
  const totalConducted = subjectAttendance.reduce((a, b) => a + b.totalLectures, 0);
  const overallAttendance = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;

  const pendingFeeInvoice = invoices.find((inv) => inv.dueAmount > 0);
  const atRiskAttendance = subjectAttendance.filter((s) => s.percentage < 75);

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner with SAP Fiori Horizon Style */}
      <div className="bg-gradient-to-r from-[#1b365d] to-[#2b4c7e] text-white p-6 rounded-lg shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-full border-2 border-white/80 object-cover shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Welcome back, {student.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded">
                  Regular Enrolled
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-0.5">
                {student.program} • Semester {student.currentSemester} • Roll ID: <span className="font-mono text-amber-300">{student.studentId}</span>
              </p>
              <p className="text-[11px] text-gray-300 mt-1">
                Academic Year 2025-2026 • Department of {student.department}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenMarksheetModal}
              className="px-3.5 py-2 bg-white text-[#1b365d] hover:bg-gray-100 rounded text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#0070f2]" />
              <span>Sem 5 Marksheet</span>
            </button>
            <button
              onClick={() => onNavigateTab('fees')}
              className="px-3.5 py-2 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Fee Invoices</span>
            </button>
          </div>
        </div>
      </div>

      {/* SAP Fiori Launchpad KPI Dynamic Tiles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            SAP Fiori Launchpad • Key Academic Indicators
          </h2>
          <span className="text-[11px] text-gray-500">Live Campus S/4HANA Feed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tile 1: Semester GPA */}
          <div
            onClick={() => onNavigateTab('results')}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold">Semester Results</span>
                <Award className="w-4 h-4 text-[#0070f2]" />
              </div>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-3xl font-extrabold text-[#0070f2]">
                  {latestResult.sgpa.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">SGPA</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                CGPA: {latestResult.cgpa.toFixed(2)} (Distinction)
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
              <span>View breakdown & marksheet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tile 2: Attendance Rate */}
          <div
            onClick={() => onNavigateTab('attendance')}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold">Attendance Rate</span>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className={`text-3xl font-extrabold ${overallAttendance >= 75 ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {overallAttendance.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">Overall</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                {totalAttended} of {totalConducted} classes attended
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
              {atRiskAttendance.length > 0 ? (
                <span className="text-amber-600 font-medium flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" /> 1 course below 75%
                </span>
              ) : (
                <span className="text-emerald-700 font-medium">Eligible for Exams</span>
              )}
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tile 3: Fee Status */}
          <div
            onClick={() => onNavigateTab('fees')}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold">Tuition & Fee Balance</span>
                <CreditCard className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-3xl font-extrabold text-amber-700">
                  {pendingFeeInvoice ? `₹${pendingFeeInvoice.dueAmount.toLocaleString('en-IN')}` : '₹0'}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                {pendingFeeInvoice ? 'Semester 6 Due: Sep 30' : 'All semester fees cleared'}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
              <span>Pay online / View receipts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tile 4: Digital Vault & Documents */}
          <div
            onClick={() => onNavigateTab('documents')}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-[#0070f2] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-semibold">Digital Documents</span>
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-3xl font-extrabold text-purple-800">6</span>
                <span className="text-xs text-gray-500">Verified Files</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                Transcripts, Bonafide, RFID ID Card
              </p>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-[#0070f2] mt-3">
              <span>Open document vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Today's Schedule & Academic Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes & Lecture Schedule */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-xs p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#0070f2]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Today's Class Schedule (Wednesday)
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {onSimulateTimetableChange && (
                <button
                  onClick={onSimulateTimetableChange}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[11px] font-semibold transition flex items-center space-x-1"
                  title="Simulate schedule changes or room relocations"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Simulate Change (Dummy)</span>
                </button>
              )}
              <button
                onClick={() => onNavigateTab('timetable')}
                className="text-[11px] text-[#0070f2] hover:underline font-semibold flex items-center"
              >
                <span>Full Timetable</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(timetableSlots.filter((s) => s.day === 'Wednesday').length > 0
              ? timetableSlots.filter((s) => s.day === 'Wednesday')
              : [
                  {
                    id: 'tt_wed_1',
                    timeSlot: '09:00 AM - 10:00 AM',
                    subjectCode: 'CS-501',
                    subjectTitle: 'Cloud Architecture & Microservices',
                    room: 'Hall B-204 (Tech Block)',
                    facultyName: 'Dr. Meera Nambiar',
                    status: 'Completed' as const,
                  },
                  {
                    id: 'tt_wed_2',
                    timeSlot: '10:15 AM - 11:15 AM',
                    subjectCode: 'CS-504',
                    subjectTitle: 'Artificial Intelligence & Machine Learning',
                    room: 'Hall A-108 (Aryabhatta Wing)',
                    facultyName: 'Prof. Vikram Sen',
                    status: 'Completed' as const,
                  },
                  {
                    id: 'tt_wed_3',
                    timeSlot: '02:00 PM - 03:00 PM',
                    subjectCode: 'CS-503',
                    subjectTitle: 'Software Engineering & SAP ABAP/UI5',
                    room: 'Computing Hall 4',
                    facultyName: 'Dr. Anita Desai',
                    status: 'Live' as const,
                  },
                  {
                    id: 'tt_wed_4',
                    timeSlot: '03:15 PM - 05:15 PM',
                    subjectCode: 'CS-505P',
                    subjectTitle: 'Cloud & AI Practical Lab (Batch B)',
                    room: 'Advanced Cloud Lab 3',
                    facultyName: 'Dr. Meera Nambiar',
                    status: 'Upcoming' as const,
                  },
                ]
            ).map((cls) => (
              <div
                key={cls.id}
                className={`p-3.5 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                  cls.status === 'Live'
                    ? 'border-red-300 bg-red-50/20'
                    : cls.status === 'Rescheduled'
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white border border-gray-200 rounded text-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#0070f2] mx-auto mb-0.5" />
                    <span className="text-[10px] font-mono text-gray-600 block">{cls.timeSlot.split(' ')[0]}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-[#0070f2]">{cls.subjectCode}</span>
                      <span className="font-semibold text-gray-900">{cls.subjectTitle}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] text-gray-500 mt-1">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {cls.room}
                      </span>
                      <span>Faculty: {cls.facultyName}</span>
                    </div>
                    {'notes' in cls && cls.notes && (
                      <span className="inline-block mt-1 text-[10px] text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded">
                        Note: {cls.notes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                      cls.status === 'Completed'
                        ? 'bg-gray-100 text-gray-600'
                        : cls.status === 'Live'
                        ? 'bg-red-100 text-red-700 animate-pulse font-bold'
                        : cls.status === 'Rescheduled'
                        ? 'bg-amber-100 text-amber-800 font-bold'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {cls.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Academic Status Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Fast Student Actions
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenMarksheetModal}
                className="w-full py-2 px-3 border border-gray-200 hover:border-[#0070f2] bg-gray-50 hover:bg-white text-gray-800 rounded font-medium transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#0070f2]" />
                  <span>Download Verified Marksheet</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => onNavigateTab('attendance')}
                className="w-full py-2 px-3 border border-gray-200 hover:border-[#0070f2] bg-gray-50 hover:bg-white text-gray-800 rounded font-medium transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>View Attendance Ledger</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => onNavigateTab('fees')}
                className="w-full py-2 px-3 border border-gray-200 hover:border-[#0070f2] bg-gray-50 hover:bg-white text-gray-800 rounded font-medium transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Pay Semester 6 Balance</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => onNavigateTab('documents')}
                className="w-full py-2 px-3 border border-gray-200 hover:border-[#0070f2] bg-gray-50 hover:bg-white text-gray-800 rounded font-medium transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Student RFID Identity Card</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Academic Standing Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Good Academic Standing</span>
            </div>
            <p className="text-emerald-700 text-[11px] leading-relaxed">
              Dean's Merit List Candidate. No backlogs, cumulative CGPA 8.72. Eligible for campus placement tier-1 recruitment drives in Semester 7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
