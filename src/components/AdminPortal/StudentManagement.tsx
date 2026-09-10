import React, { useState, useRef } from 'react';
import { StudentRecord } from '../../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Camera,
  Upload,
  Clock,
  CreditCard,
  Image as ImageIcon,
} from 'lucide-react';

interface StudentManagementProps {
  students: StudentRecord[];
  onAddStudent: (newStudent: StudentRecord) => void;
  onDeleteStudent: (id: string) => void;
  onUpdateFeeStatus?: (id: string, feeStatus: 'Paid' | 'Pending' | 'Partial') => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onDeleteStudent,
  onUpdateFeeStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [feeFilter, setFeeFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for new student
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [program, setProgram] = useState('B.Tech - CSE');
  const [semester, setSemester] = useState<number>(1);
  const [cgpa, setCgpa] = useState(8.5);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !studentId) return;

    const fallbackAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    ];
    const defaultAvatar = fallbackAvatars[Math.floor(Math.random() * fallbackAvatars.length)];

    const newRecord: StudentRecord = {
      id: `std_${Date.now()}`,
      studentId,
      fullName,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@sap-campus.edu.in`,
      phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      department,
      program,
      currentSemester: semester,
      cgpa,
      attendanceRate: 100.0,
      feeStatus: 'Pending',
      status: 'Active',
      avatarUrl: photoPreview || defaultAvatar,
    };

    onAddStudent(newRecord);
    setModalOpen(false);
    setFullName('');
    setStudentId('');
    setEmail('');
    setPhotoPreview('');
    setSemester(1);
    setCgpa(8.5);
  };

  const pendingCount = students.filter((s) => s.feeStatus === 'Pending').length;
  const paidCount = students.filter((s) => s.feeStatus === 'Paid').length;

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || s.department.includes(deptFilter);
    const matchesFee = feeFilter === 'all' || s.feeStatus === feeFilter;
    return matchesSearch && matchesDept && matchesFee;
  });

  return (
    <div className="space-y-6">
      {/* Header & Registration Action */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#0070f2]" />
            <span>SAP Central Student Master Directory (Master Data Hub)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Administer student enrollment records, academic standings, photo repository, and fee clearance
          </p>
        </div>

        <button
          onClick={() => {
            setStudentId(`SAP-CS-2026-${Math.floor(100 + Math.random() * 900)}`);
            setSemester(1);
            setPhotoPreview('');
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* KPI Metric Strip & Fee Status Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setFeeFilter('all')}
          className={`p-3 rounded-lg border shadow-xs cursor-pointer transition ${
            feeFilter === 'all' ? 'bg-blue-50/80 border-[#0070f2] ring-1 ring-[#0070f2]' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Total Enrolled</span>
            <Users className="w-4 h-4 text-[#0070f2]" />
          </div>
          <p className="text-xl font-bold text-gray-900 mt-1">{students.length}</p>
          <span className="text-[10px] text-gray-500 mt-0.5 block">Active University Database</span>
        </div>

        <div
          onClick={() => setFeeFilter('Pending')}
          className={`p-3 rounded-lg border shadow-xs cursor-pointer transition ${
            feeFilter === 'Pending' ? 'bg-red-50 border-red-500 ring-1 ring-red-400' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-red-700 font-semibold">Fees Pending</span>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
              <Clock className="w-3 h-3 mr-0.5" /> Due
            </span>
          </div>
          <p className="text-xl font-bold text-red-600 mt-1">{pendingCount} Students</p>
          <span className="text-[10px] text-red-600/80 mt-0.5 block">Includes new enrollments</span>
        </div>

        <div
          onClick={() => setFeeFilter('Paid')}
          className={`p-3 rounded-lg border shadow-xs cursor-pointer transition ${
            feeFilter === 'Paid' ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-emerald-700 font-semibold">Fees Paid</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-1">{paidCount} Students</p>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">Cleared in SAP Treasury</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Intake Eligible</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-gray-900 mt-1">Sem 1 & 2 Only</p>
          <span className="text-[10px] text-gray-500 mt-0.5 block">Standard Admission Policy</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, roll ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Fee Status Filter */}
          <div className="flex items-center space-x-1">
            <CreditCard className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value)}
              className="py-1.5 px-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-hidden focus:border-[#0070f2]"
            >
              <option value="all">All Fee Status ({students.length})</option>
              <option value="Pending">Fees Pending ({pendingCount})</option>
              <option value="Paid">Fees Paid ({paidCount})</option>
              <option value="Partial">Partial Dues</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="py-1.5 px-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-hidden focus:border-[#0070f2]"
            >
              <option value="all">All Departments</option>
              <option value="Computer">Computer Science & Eng</option>
              <option value="Electronics">Electronics & Comm</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil & Environmental</option>
            </select>
          </div>

          <span className="text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filtered.length}</strong> records
          </span>
        </div>
      </div>

      {/* Student Directory Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Enrolled Students Records ({filtered.length} Active Records)
          </h3>
          <span className="text-xs text-gray-500 font-mono">Synced with S/4HANA Master Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student Name & Photo</th>
                <th className="py-3 px-4">Roll ID</th>
                <th className="py-3 px-4">Department & Program</th>
                <th className="py-3 px-3 text-center">Semester</th>
                <th className="py-3 px-3 text-center">CGPA</th>
                <th className="py-3 px-3 text-center">Attendance</th>
                <th className="py-3 px-4 text-center">Fee Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.avatarUrl}
                        alt={student.fullName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 shadow-2xs shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-gray-900 block">{student.fullName}</span>
                        <span className="text-[10px] text-gray-500">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-800">{student.studentId}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900 block">{student.department}</span>
                    <span className="text-[10px] text-gray-500">{student.program}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 font-semibold text-gray-800">
                      Sem {student.currentSemester}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-700">{student.cgpa.toFixed(2)}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-bold ${
                        student.attendanceRate >= 75 ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {student.attendanceRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        student.feeStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : student.feeStatus === 'Partial'
                          ? 'bg-blue-100 text-[#0070f2]'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {student.feeStatus === 'Pending' && <Clock className="w-3 h-3 mr-1 text-red-600" />}
                      {student.feeStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      {student.feeStatus === 'Pending' && onUpdateFeeStatus && (
                        <button
                          onClick={() => onUpdateFeeStatus(student.id, 'Paid')}
                          className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded text-[10px] font-semibold transition"
                          title="Mark Tuition Fees as Paid in SAP Treasury"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Remove record for ${student.fullName}?`)) {
                            onDeleteStudent(student.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100"
                        title="Delete Student Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register New Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-hidden">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-lg max-h-[94vh] flex flex-col bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#354a5f] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-xs">SAP S/4HANA Student Enrollment Registry</span>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 text-xs flex-1 overflow-y-auto">
              {/* Photo Upload Option */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="relative group shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-[#0070f2] flex items-center justify-center shadow-xs">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Student preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => setPhotoPreview('')}
                      className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 shadow-sm hover:bg-red-700"
                      title="Remove Photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <span className="font-bold text-gray-800 text-xs">Student Photo Upload</span>
                    {photoPreview && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" /> Photo Attached
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Upload student passport photo (PNG, JPG, WebP) or drag and drop
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-xs font-semibold text-gray-800 shadow-2xs transition"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#0070f2]" />
                      <span>{photoPreview ? 'Change Photo' : 'Upload Student Photo'}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diya Sengupta"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Generated Roll ID *</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded font-mono font-bold text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">University Email Address</label>
                <input
                  type="email"
                  placeholder="name@sap-campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Academic Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil & Environmental Eng">Civil & Environmental Eng</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Degree Program</label>
                  <input
                    type="text"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                  />
                </div>
              </div>

              {/* Semester Dropdown - STRICTLY SEMESTER 1 & 2 ONLY */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Enrollment Semester *
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full p-2 border border-[#0070f2] bg-blue-50/40 rounded font-semibold text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                  >
                    <option value={1}>Semester 1 (Freshman Intake)</option>
                    <option value={2}>Semester 2 (Lateral / Spring Intake)</option>
                  </select>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    New enrollments permitted only for 1st or 2nd semester.
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Initial CGPA (10 pt scale)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded font-bold text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                  />
                </div>
              </div>

              {/* Fee Notice Banner */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2.5 text-[11px] text-red-900">
                <Clock className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  <strong>Fee Status: Pending.</strong> As per university policy, new enrollments are created with tuition fee marked as <strong>Pending</strong> in the SAP Treasury ledger until remitted.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded font-semibold transition shadow-xs mt-2"
              >
                Confirm Enrollment & Create SAP Student Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
