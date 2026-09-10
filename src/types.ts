export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  studentId?: string;
  teacherId?: string;
  adminId?: string;
  enrollmentYear?: number;
  currentSemester?: number;
  program?: string;
  phone?: string;
  address?: string;
}

export interface SubjectGrade {
  code: string;
  title: string;
  credits: number;
  internalMarks: number;
  maxInternal: number;
  externalMarks: number;
  maxExternal: number;
  totalMarks: number;
  maxTotal: number;
  grade: string;
  gradePoints: number;
  status: 'Pass' | 'Fail' | 'Ongoing';
  facultyName: string;
}

export interface SemesterResult {
  semesterNumber: number;
  academicYear: string;
  subjects: SubjectGrade[];
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  resultStatus: 'Passed' | 'Passed with Distinction' | 'Failed' | 'Awaited';
  examMonthYear: string;
  issueDate: string;
  marksheetNo: string;
}

export interface SubjectAttendance {
  subjectCode: string;
  subjectTitle: string;
  facultyName: string;
  lecturesAttended: number;
  totalLectures: number;
  percentage: number;
  lastAttended: string;
  status: 'Good' | 'Warning' | 'Critical'; // Warning if < 75%, Critical if < 65%
}

export interface DailyAttendanceRecord {
  id: string;
  date: string;
  subjectCode: string;
  subjectTitle: string;
  timeSlot: string;
  status: 'Present' | 'Absent' | 'Late';
  markedBy: string;
}

export interface FeeBreakdown {
  label: string;
  amount: number;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  semester: number;
  academicYear: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  breakdown: FeeBreakdown[];
  paymentDate?: string;
  transactionRef?: string;
  paymentMethod?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'Marksheet' | 'Bonafide' | 'ID_Card' | 'Admission_Offer' | 'Fee_Receipt' | 'Certificate';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Verification' | 'Ready to Download';
  downloadUrl?: string;
  semester?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'academic' | 'fee' | 'attendance' | 'announcement';
  priority: 'High' | 'Medium' | 'Low';
  actionPath?: string;
  targetRole?: UserRole | 'all';
}

export interface StudentRecord {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  program: string;
  currentSemester: number;
  cgpa: number;
  attendanceRate: number;
  feeStatus: 'Paid' | 'Partial' | 'Pending';
  status: 'Active' | 'On Leave' | 'Graduated';
  avatarUrl: string;
}

export interface CourseAssignment {
  id: string;
  code: string;
  title: string;
  department: string;
  semester: number;
  credits: number;
  enrolledStudentsCount: number;
  schedule: string;
  room: string;
  classAverageMarks: number;
  attendanceRate: number;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  periodNumber: number;
  timeSlot: string;
  subjectCode: string;
  subjectTitle: string;
  room: string;
  facultyName: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar';
  status: 'Upcoming' | 'Live' | 'Completed' | 'Rescheduled';
  notes?: string;
}

