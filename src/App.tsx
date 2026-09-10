import React, { useState } from 'react';
import {
  User,
  UserRole,
  NotificationItem,
  DocumentItem,
  StudentRecord,
  TimetableSlot,
  DailyAttendanceRecord,
  SubjectAttendance,
  SemesterResult,
  FeeInvoice,
  CourseAssignment,
} from './types';
import {
  usePersistentState,
  STORAGE_KEYS,
  resetAllStorage,
} from './utils/storage';
import {
  CURRENT_STUDENT,
  CURRENT_TEACHER,
  CURRENT_ADMIN,
  SEMESTER_RESULTS,
  STUDENT_ATTENDANCE,
  DAILY_ATTENDANCE_LOG,
  FEE_INVOICES,
  STUDENT_DOCUMENTS,
  NOTIFICATIONS,
  FACULTY_COURSES,
  ALL_STUDENTS_RECORD,
  STUDENT_TIMETABLE,
} from './mockData';

// Shell & Navigation
import { FioriShellBar } from './components/FioriShellBar';
import { LoginModal } from './components/LoginModal';
import { MarksheetModal } from './components/MarksheetModal';

// Student Portal Views
import { StudentDashboard } from './components/StudentPortal/StudentDashboard';
import { SemesterResults } from './components/StudentPortal/SemesterResults';
import { AttendanceView } from './components/StudentPortal/AttendanceView';
import { FeesView } from './components/StudentPortal/FeesView';
import { DocumentsView } from './components/StudentPortal/DocumentsView';
import { TimetableView } from './components/StudentPortal/TimetableView';

// Faculty Portal Views
import { FacultyDashboard } from './components/FacultyPortal/FacultyDashboard';
import { AttendanceMarker } from './components/FacultyPortal/AttendanceMarker';
import { GradeEntry } from './components/FacultyPortal/GradeEntry';
import { CourseAnalytics } from './components/FacultyPortal/CourseAnalytics';

// Admin Portal Views
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { StudentManagement } from './components/AdminPortal/StudentManagement';
import { FeeLedger } from './components/AdminPortal/FeeLedger';
import { AnalyticsCenter } from './components/AdminPortal/AnalyticsCenter';
import { BroadcastManager } from './components/AdminPortal/BroadcastManager';

// Icons
import {
  LayoutDashboard,
  Award,
  Clock,
  CreditCard,
  FolderLock,
  CheckSquare,
  BarChart3,
  Users,
  ShieldCheck,
  Radio,
  FileCheck2,
  Calendar,
} from 'lucide-react';

export default function App() {
  // Current active user & navigation tab
  const [currentUser, setCurrentUser] = usePersistentState<User>(STORAGE_KEYS.CURRENT_USER, CURRENT_STUDENT);
  const [activeTab, setActiveTab] = usePersistentState<string>(STORAGE_KEYS.ACTIVE_TAB, 'dashboard');

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMarksheetOpen, setIsMarksheetOpen] = useState(false);
  const [marksheetSemester, setMarksheetSemester] = useState<number>(5);

  // Application Data State - Persisted across reloads and roles
  const [notifications, setNotifications] = usePersistentState<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, NOTIFICATIONS);
  const [results, setResults] = usePersistentState<SemesterResult[]>(STORAGE_KEYS.RESULTS, SEMESTER_RESULTS);
  const [subjectAttendance, setSubjectAttendance] = usePersistentState<SubjectAttendance[]>(STORAGE_KEYS.ATTENDANCE, STUDENT_ATTENDANCE);
  const [dailyLogs, setDailyLogs] = usePersistentState<DailyAttendanceRecord[]>(STORAGE_KEYS.DAILY_LOGS, DAILY_ATTENDANCE_LOG);
  const [feeInvoices, setFeeInvoices] = usePersistentState<FeeInvoice[]>(STORAGE_KEYS.FEES, FEE_INVOICES);
  const [documents, setDocuments] = usePersistentState<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, STUDENT_DOCUMENTS);
  const [allStudents, setAllStudents] = usePersistentState<StudentRecord[]>(STORAGE_KEYS.ALL_STUDENTS, ALL_STUDENTS_RECORD);
  const [facultyCourses, setFacultyCourses] = usePersistentState<CourseAssignment[]>(STORAGE_KEYS.FACULTY_COURSES, FACULTY_COURSES);
  const [timetableSlots, setTimetableSlots] = usePersistentState<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, STUDENT_TIMETABLE);

  // Full reset back to factory demo state
  const handleResetAllData = () => {
    resetAllStorage();
    setCurrentUser(CURRENT_STUDENT);
    setActiveTab('dashboard');
    setNotifications(NOTIFICATIONS);
    setResults(SEMESTER_RESULTS);
    setSubjectAttendance(STUDENT_ATTENDANCE);
    setDailyLogs(DAILY_ATTENDANCE_LOG);
    setFeeInvoices(FEE_INVOICES);
    setDocuments(STUDENT_DOCUMENTS);
    setAllStudents(ALL_STUDENTS_RECORD);
    setFacultyCourses(FACULTY_COURSES);
    setTimetableSlots(STUDENT_TIMETABLE);
  };

  // Switch Role Handler
  const handleSwitchRole = (role: UserRole) => {
    if (role === 'student') {
      setCurrentUser(CURRENT_STUDENT);
    } else if (role === 'teacher') {
      setCurrentUser(CURRENT_TEACHER);
    } else {
      setCurrentUser(CURRENT_ADMIN);
    }
    setActiveTab('dashboard');
  };

  // Login Success
  const handleLoginSuccess = (role: UserRole) => {
    handleSwitchRole(role);
  };

  // Timetable Handlers (Interactive & Dummy Updates)
  const handleSimulateTimetableChange = () => {
    setTimetableSlots((prev) => {
      const hasSimulated = prev.some((s) => s.id === 'tt_sim_sap');
      if (hasSimulated) {
        // Alternating toggle - room relocation and extra seminar
        return prev.map((slot) => {
          if (slot.id === 'tt_wed_1') {
            return {
              ...slot,
              room: slot.room.includes('Seminar') ? 'Hall B-204 (Tech Block)' : 'Seminar Hall 1 (Main Campus)',
              status: 'Rescheduled' as const,
              notes: 'Room relocated for campus smart interactive board demo',
            };
          }
          return slot;
        });
      }

      // Add a special SAP Labs India industry guest masterclass and mark slot 4 as rescheduled
      const updated = prev.map((slot) => {
        if (slot.id === 'tt_wed_4') {
          return {
            ...slot,
            status: 'Rescheduled' as const,
            notes: 'Lab rescheduled to Friday afternoon due to SAP University Alliances Masterclass',
          };
        }
        return slot;
      });

      const newSlot: TimetableSlot = {
        id: 'tt_sim_sap',
        day: 'Wednesday',
        periodNumber: 5,
        timeSlot: '03:30 PM - 05:00 PM',
        subjectCode: 'SAP-BTP',
        subjectTitle: 'SAP BTP & Generative AI in Industry Masterclass',
        room: 'Auditorium Block C (Live Streamed)',
        facultyName: 'Industry Lead (SAP Labs India)',
        type: 'Seminar',
        status: 'Upcoming',
        notes: 'Mandatory session for B.Tech CS 5th Semester students',
      };

      return [...updated, newSlot];
    });

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Timetable Updated by Dean Academics',
      description: 'Wednesday schedule has been revised with an industry guest session on SAP BTP in Auditorium C.',
      timestamp: 'Just now',
      read: false,
      type: 'academic',
      priority: 'High',
      actionPath: 'timetable',
      targetRole: 'all',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleResetTimetable = () => {
    setTimetableSlots(STUDENT_TIMETABLE);
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Timetable Restored',
      description: 'Weekly timetable reset to default academic calendar.',
      timestamp: 'Just now',
      read: false,
      type: 'academic',
      priority: 'Low',
      actionPath: 'timetable',
      targetRole: 'student',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateSlot = (updatedSlot: TimetableSlot) => {
    setTimetableSlots((prev) =>
      prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s))
    );
  };

  // Teacher Attendance Submission: Updates Student's Attendance in Real Time!
  const handleTeacherAttendanceSubmitted = (
    courseCode: string,
    date: string,
    attendanceData: Record<string, string>,
    timeSlot: string
  ) => {
    // 1. Identify logged-in student Aarav Sharma ('std_01')
    const aaravRecord = allStudents.find((s) => s.id === 'std_01' || s.fullName === 'Aarav Sharma');
    const aaravStatus = (aaravRecord ? attendanceData[aaravRecord.id] : undefined) || 'Present';

    // 2. Find subject info or course object
    const courseObj = facultyCourses.find((c) => c.code === courseCode);
    const subjectName = courseObj?.title || courseCode;

    // 3. Update subjectAttendance
    const exists = subjectAttendance.some((s) => s.subjectCode === courseCode);
    let updatedSubjects: SubjectAttendance[];

    if (exists) {
      updatedSubjects = subjectAttendance.map((item) => {
        if (item.subjectCode === courseCode) {
          const newTotal = item.totalLectures + 1;
          const newAttended =
            aaravStatus === 'Present' || aaravStatus === 'Late'
              ? item.lecturesAttended + 1
              : item.lecturesAttended;
          const newPct = Number(((newAttended / newTotal) * 100).toFixed(1));
          const newStatus = newPct < 65 ? 'Critical' : newPct < 75 ? 'Warning' : 'Good';
          return {
            ...item,
            totalLectures: newTotal,
            lecturesAttended: newAttended,
            percentage: newPct,
            lastAttended: aaravStatus === 'Absent' ? `Absent on ${date}` : `Today, ${timeSlot.split(' ')[0]}`,
            status: newStatus as 'Good' | 'Warning' | 'Critical',
          };
        }
        return item;
      });
    } else {
      const newTotal = 1;
      const newAttended = aaravStatus === 'Present' || aaravStatus === 'Late' ? 1 : 0;
      const newPct = Number(((newAttended / newTotal) * 100).toFixed(1));
      updatedSubjects = [
        ...subjectAttendance,
        {
          subjectCode: courseCode,
          subjectTitle: subjectName,
          facultyName: currentUser.name,
          lecturesAttended: newAttended,
          totalLectures: newTotal,
          percentage: newPct,
          lastAttended: aaravStatus === 'Absent' ? `Absent on ${date}` : `Today, ${timeSlot.split(' ')[0]}`,
          status: newPct < 75 ? 'Warning' : 'Good',
        },
      ];
    }
    setSubjectAttendance(updatedSubjects);

    // Calculate Aarav's exact aggregate attendance percentage across all courses
    const totalAttended = updatedSubjects.reduce((acc, curr) => acc + curr.lecturesAttended, 0);
    const totalConducted = updatedSubjects.reduce((acc, curr) => acc + curr.totalLectures, 0);
    const aaravExactRate = totalConducted > 0 ? Number(((totalAttended / totalConducted) * 100).toFixed(1)) : 88.4;

    // 4. Prepend to student dailyLogs
    const newLogRecord: DailyAttendanceRecord = {
      id: `att_${Date.now()}`,
      date: date,
      subjectCode: courseCode,
      subjectTitle: subjectName,
      timeSlot: timeSlot,
      status: aaravStatus as 'Present' | 'Absent' | 'Late',
      markedBy: currentUser.name,
    };
    setDailyLogs((prev) => [newLogRecord, ...prev]);

    // 5. Update student roster overall attendance rates immediately
    setAllStudents((prev) =>
      prev.map((student) => {
        if (student.id === 'std_01' || student.fullName === 'Aarav Sharma') {
          return {
            ...student,
            attendanceRate: aaravExactRate,
          };
        }
        const marked = attendanceData[student.id];
        if (!marked) return student;
        const currentRate = student.attendanceRate;
        let delta = 0;
        if (marked === 'Present') delta = 0.5;
        else if (marked === 'Absent') delta = -1.8;
        else if (marked === 'Late') delta = 0.2;
        const updatedRate = Math.min(100, Math.max(35, Number((currentRate + delta).toFixed(1))));
        return {
          ...student,
          attendanceRate: updatedRate,
        };
      })
    );

    // 6. Update course overall average attendance in faculty courses
    const sessionPresent = Object.values(attendanceData).filter((v) => v === 'Present' || v === 'Late').length;
    const sessionTotal = Object.keys(attendanceData).length || 1;
    const sessionAttendancePct = Number(((sessionPresent / sessionTotal) * 100).toFixed(1));

    setFacultyCourses((prev) =>
      prev.map((c) =>
        c.code === courseCode
          ? {
              ...c,
              attendanceRate: Number(((c.attendanceRate * 0.7) + (sessionAttendancePct * 0.3)).toFixed(1)),
            }
          : c
      )
    );

    // 7. Update Class Timetable slot status to 'Completed'
    setTimetableSlots((prev) =>
      prev.map((slot) => {
        if (slot.subjectCode === courseCode) {
          return {
            ...slot,
            status: 'Completed' as const,
            notes: `Attendance recorded by ${currentUser.name} on ${date}`,
          };
        }
        return slot;
      })
    );

    // 8. Push real-time notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Attendance Updated: ${courseCode} (${aaravStatus})`,
      description: `Faculty ${currentUser.name} submitted attendance for ${courseCode} on ${date} (${timeSlot}). Status marked: ${aaravStatus}. Aggregate attendance is now ${aaravExactRate}%.`,
      timestamp: 'Just now',
      read: false,
      type: 'attendance',
      priority: aaravStatus === 'Absent' ? 'High' : 'Medium',
      actionPath: 'attendance',
      targetRole: 'all',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Fee Payment Handler
  const handlePaySuccess = (invoiceId: string, paidAmount: number) => {
    setFeeInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paidAmount + paidAmount;
          const newDue = Math.max(0, inv.totalAmount - newPaid);
          return {
            ...inv,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newDue === 0 ? 'Paid' : 'Partial',
            paymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return inv;
      })
    );

    // Add receipt to documents
    const receiptDoc: DocumentItem = {
      id: `rcpt_${Date.now()}`,
      title: `Fee Payment Receipt (₹${paidAmount.toLocaleString('en-IN')})`,
      type: 'Fee_Receipt',
      fileName: `SAP_Receipt_${Date.now()}.pdf`,
      fileSize: '320 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Ready to Download',
    };
    setDocuments((prev) => [receiptDoc, ...prev]);

    // Push notification
    const payNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Fee Payment Received',
      description: `Payment of ₹${paidAmount.toLocaleString('en-IN')} has been acknowledged by the University Treasury.`,
      timestamp: 'Just now',
      read: false,
      type: 'fee',
      priority: 'Medium',
      actionPath: 'fees',
      targetRole: 'student',
    };
    setNotifications((prev) => [payNotif, ...prev]);
  };

  // Document Upload Handler
  const handleUploadDocument = (doc: DocumentItem) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  // Notification Handlers
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Admin: Broadcast notice
  const handlePublishBroadcast = (notif: NotificationItem) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  // Admin: Add student
  const handleAddStudent = (newStudent: StudentRecord) => {
    setAllStudents((prev) => [newStudent, ...prev]);

    // Push notification to inform campus admin & treasury
    const enrollNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Student Enrolled: ${newStudent.fullName}`,
      description: `${newStudent.fullName} (${newStudent.studentId}) successfully registered for Semester ${newStudent.currentSemester} in ${newStudent.department}. Tuition fee status: Pending.`,
      timestamp: 'Just now',
      read: false,
      type: 'academic',
      priority: 'Medium',
      actionPath: 'students',
      targetRole: 'admin',
    };
    setNotifications((prev) => [enrollNotif, ...prev]);
  };

  // Admin: Update student fee status (Paid / Pending)
  const handleUpdateStudentFeeStatus = (id: string, feeStatus: 'Paid' | 'Pending' | 'Partial') => {
    setAllStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, feeStatus } : s))
    );

    const feeNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Fee Status Updated`,
      description: `Student tuition fee clearance status changed to "${feeStatus}" in SAP Treasury Ledger.`,
      timestamp: 'Just now',
      read: false,
      type: 'fee',
      priority: 'Low',
      actionPath: 'fees',
      targetRole: 'admin',
    };
    setNotifications((prev) => [feeNotif, ...prev]);
  };

  // Admin: Delete student
  const handleDeleteStudent = (id: string) => {
    setAllStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Teacher: Advisory warning
  const handleSendAdvisory = (studentName: string) => {
    const advNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Academic Advisory Issued: ${studentName}`,
      description: `Attendance / Performance warning issued for student ${studentName} as per University regulations.`,
      timestamp: 'Just now',
      read: false,
      type: 'attendance',
      priority: 'High',
      targetRole: 'all',
    };
    setNotifications((prev) => [advNotif, ...prev]);
  };

  // Navigation Items by Role
  const getNavItems = () => {
    if (currentUser.role === 'student') {
      return [
        { id: 'dashboard', label: 'Launchpad', icon: LayoutDashboard },
        { id: 'results', label: 'Semester Results & Marksheets', icon: Award },
        { id: 'attendance', label: 'Attendance Ledger', icon: Clock },
        { id: 'timetable', label: 'Class Timetable', icon: Calendar },
        { id: 'fees', label: 'Tuition Fees & Payments', icon: CreditCard },
        { id: 'documents', label: 'Digital Document Vault', icon: FolderLock },
      ];
    } else if (currentUser.role === 'teacher') {
      return [
        { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
        { id: 'attendance', label: 'Mark Attendance', icon: CheckSquare },
        { id: 'grades', label: 'Grade & Marksheet Entry', icon: Award },
        { id: 'analytics', label: 'Class Analytics & At-Risk', icon: BarChart3 },
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Student Master Directory', icon: Users },
        { id: 'fees', label: 'FI-CA Fee Treasury', icon: CreditCard },
        { id: 'analytics', label: 'Campus Analytics Intelligence', icon: BarChart3 },
        { id: 'broadcast', label: 'Broadcast Circulars', icon: Radio },
      ];
    }
  };

  const navItems = getNavItems();

  // Find semester result for modal
  const selectedResultForModal =
    results.find((r) => r.semesterNumber === marksheetSemester) || results[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f8] text-[#1d2d3e]">
      {/* Top SAP Fiori Shell Bar */}
      <FioriShellBar
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onMarkAsRead={handleMarkNotificationAsRead}
        onClearAll={handleClearAllNotifications}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onResetData={handleResetAllData}
      />

      {/* SAP Fiori Quartz / Horizon Sub-Header Navigation Bar */}
      <nav className="no-print bg-white border-b border-gray-200 shadow-2xs sticky top-0 z-30 px-3 md:px-6">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-2.5 px-3 rounded text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 border-b-2 ${
                    isActive
                      ? 'border-[#0070f2] text-[#0070f2] bg-blue-50/50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0070f2]' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center text-[11px] text-gray-500 space-x-3 pr-2">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              S/4HANA Cloud Connected
            </span>
            <span className="text-gray-300">|</span>
            <span className="font-mono">SAP UI5 v1.120</span>
          </div>
        </div>
      </nav>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {/* STUDENT PORTAL VIEWS */}
        {currentUser.role === 'student' && (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                student={currentUser}
                latestResult={results[0]}
                subjectAttendance={subjectAttendance}
                invoices={feeInvoices}
                timetableSlots={timetableSlots}
                onSimulateTimetableChange={handleSimulateTimetableChange}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenMarksheetModal={() => {
                  setMarksheetSemester(5);
                  setIsMarksheetOpen(true);
                }}
              />
            )}

            {activeTab === 'results' && (
              <SemesterResults results={results} student={currentUser} />
            )}

            {activeTab === 'attendance' && (
              <AttendanceView
                subjectAttendance={subjectAttendance}
                dailyLogs={dailyLogs}
              />
            )}

            {activeTab === 'timetable' && (
              <TimetableView
                timetableSlots={timetableSlots}
                onSimulateTimetableChange={handleSimulateTimetableChange}
                onResetTimetable={handleResetTimetable}
                onUpdateSlot={handleUpdateSlot}
              />
            )}

            {activeTab === 'fees' && (
              <FeesView
                invoices={feeInvoices}
                student={currentUser}
                onPaySuccess={handlePaySuccess}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsView
                documents={documents}
                student={currentUser}
                onUploadDocument={handleUploadDocument}
                onOpenSemesterMarksheet={(sem) => {
                  setMarksheetSemester(sem);
                  setIsMarksheetOpen(true);
                }}
              />
            )}
          </>
        )}

        {/* TEACHER / FACULTY PORTAL VIEWS */}
        {currentUser.role === 'teacher' && (
          <>
            {activeTab === 'dashboard' && (
              <FacultyDashboard
                faculty={currentUser}
                courses={facultyCourses}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceMarker
                courses={facultyCourses}
                students={allStudents}
                onAttendanceSubmitted={handleTeacherAttendanceSubmitted}
              />
            )}

            {activeTab === 'grades' && (
              <GradeEntry
                courses={facultyCourses}
                students={allStudents}
                onGradesPublished={(course, submittedGrades) => {
                  if (submittedGrades && submittedGrades['std_01']) {
                    const studentMarks = submittedGrades['std_01'];
                    const totalMarks = studentMarks.internal + studentMarks.external;
                    let letterGrade = 'F';
                    let gradePt = 0;
                    if (totalMarks >= 90) { letterGrade = 'O'; gradePt = 10; }
                    else if (totalMarks >= 85) { letterGrade = 'A+'; gradePt = 10; }
                    else if (totalMarks >= 80) { letterGrade = 'A'; gradePt = 9; }
                    else if (totalMarks >= 70) { letterGrade = 'B+'; gradePt = 8; }
                    else if (totalMarks >= 60) { letterGrade = 'B'; gradePt = 7; }
                    else if (totalMarks >= 50) { letterGrade = 'C'; gradePt = 6; }
                    else if (totalMarks >= 40) { letterGrade = 'P'; gradePt = 5; }

                    setResults((prev) =>
                      prev.map((sem) => {
                        if (sem.semesterNumber === 5) {
                          const updatedSubjects = sem.subjects.map((sub) =>
                            sub.code === course
                              ? {
                                  ...sub,
                                  marksObtained: totalMarks,
                                  grade: letterGrade,
                                  gradePoint: gradePt,
                                }
                              : sub
                          );
                          const totalCredits = updatedSubjects.reduce((a, b) => a + b.credits, 0);
                          const weightedPts = updatedSubjects.reduce((a, b) => a + b.credits * b.gradePoint, 0);
                          const newSgpa = totalCredits > 0 ? Number((weightedPts / totalCredits).toFixed(2)) : sem.sgpa;
                          return {
                            ...sem,
                            subjects: updatedSubjects,
                            sgpa: newSgpa,
                          };
                        }
                        return sem;
                      })
                    );
                  }

                  const notif: NotificationItem = {
                    id: `notif_${Date.now()}`,
                    title: `Grades Published for ${course}`,
                    description: `Faculty Dr. Meera Nambiar published evaluated marks for course ${course}. Marksheet and GPA ledger updated.`,
                    timestamp: 'Just now',
                    read: false,
                    type: 'academic',
                    priority: 'High',
                    targetRole: 'all',
                  };
                  setNotifications((prev) => [notif, ...prev]);
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <CourseAnalytics
                courses={facultyCourses}
                students={allStudents}
                onSendAdvisory={handleSendAdvisory}
              />
            )}
          </>
        )}

        {/* ADMIN PORTAL VIEWS */}
        {currentUser.role === 'admin' && (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard
                admin={currentUser}
                studentsCount={allStudents.length}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'students' && (
              <StudentManagement
                students={allStudents}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
                onUpdateFeeStatus={handleUpdateStudentFeeStatus}
              />
            )}

            {activeTab === 'fees' && <FeeLedger students={allStudents} />}

            {activeTab === 'analytics' && <AnalyticsCenter />}

            {activeTab === 'broadcast' && (
              <BroadcastManager
                onPublishNotification={handlePublishBroadcast}
                notificationsList={notifications}
              />
            )}
          </>
        )}
      </main>

      {/* Official Marksheet Modal (Print-Ready) */}
      <MarksheetModal
        isOpen={isMarksheetOpen}
        onClose={() => setIsMarksheetOpen(false)}
        semesterResult={selectedResultForModal}
        student={currentUser}
      />

      {/* SAP SSO Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={currentUser.role}
      />

      {/* Footer */}
      <footer className="no-print mt-auto bg-white border-t border-gray-200 py-3 px-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">SAP S/4HANA Campus ERP Suite</span>
            <span>•</span>
            <span>Higher Education & Research Edition 2026</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Active Session: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})</span>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-[#0070f2] hover:underline font-medium"
            >
              Switch Role
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
