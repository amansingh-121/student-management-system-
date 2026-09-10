import React, { useState } from 'react';
import { StudentRecord } from '../../types';
import { CreditCard, Download, Search, CheckCircle, Clock, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';

interface FeeLedgerProps {
  students?: StudentRecord[];
}

export const FeeLedger: React.FC<FeeLedgerProps> = ({ students = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const baseTransactions = [
    {
      id: 'TXN-001',
      student: 'Aarav Sharma',
      studentId: 'SAP-CS-2023-049',
      amount: 48500,
      semester: 'Semester 5',
      date: '2025-08-10',
      status: 'Settled',
      method: 'Online NetBanking',
    },
    {
      id: 'TXN-002',
      student: 'Aarav Sharma',
      studentId: 'SAP-CS-2023-049',
      amount: 25000,
      semester: 'Semester 6',
      date: '2026-08-28',
      status: 'Partial (INR 26k Due)',
      method: 'UPI',
    },
    {
      id: 'TXN-003',
      student: 'Ananya Deshmukh',
      studentId: 'SAP-CS-2023-012',
      amount: 51000,
      semester: 'Semester 6',
      date: '2026-08-15',
      status: 'Settled',
      method: 'Debit Card',
    },
    {
      id: 'TXN-004',
      student: 'Rohan Verma',
      studentId: 'SAP-CS-2023-033',
      amount: 0,
      semester: 'Semester 6',
      date: 'Pending',
      status: 'Overdue (INR 51k)',
      method: 'Unpaid',
    },
    {
      id: 'TXN-005',
      student: 'Priya Sundaram',
      studentId: 'SAP-CS-2023-078',
      amount: 51000,
      semester: 'Semester 6',
      date: '2026-08-20',
      status: 'Settled',
      method: 'Online NetBanking',
    },
    {
      id: 'TXN-006',
      student: 'Vikramaditya Rao',
      studentId: 'SAP-ECE-2023-021',
      amount: 51000,
      semester: 'Semester 6',
      date: '2026-08-22',
      status: 'Settled',
      method: 'Credit Card',
    },
  ];

  // Map any newly enrolled student with 'Pending' fee status into live transactions
  const livePendingTransactions = students
    .filter((s) => s.feeStatus === 'Pending')
    .map((s, idx) => ({
      id: `FEE-ADM-${s.studentId.replace(/[^0-9]/g, '').slice(-4) || idx + 101}`,
      student: s.fullName,
      studentId: s.studentId,
      amount: 0,
      semester: `Semester ${s.currentSemester}`,
      date: 'New Enrollment',
      status: 'Pending (INR 52k Due)',
      method: 'Unpaid / Pending Registration Fee',
    }));

  const transactions = [...livePendingTransactions, ...baseTransactions];

  const totalCollected = 226500;
  const pendingCount = livePendingTransactions.length;
  const totalOutstanding = 77000 + pendingCount * 52000;
  const collectionRate = 74.6;

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportCSV = () => {
    setIsExporting(true);

    try {
      const headers = [
        'Transaction ID',
        'Student Name',
        'Roll ID',
        'Semester',
        'Date',
        'Amount Received (INR)',
        'Payment Method',
        'Settlement Status',
      ];

      const rows = filtered.map((t) => [
        `"${t.id}"`,
        `"${t.student.replace(/"/g, '""')}"`,
        `"${t.studentId}"`,
        `"${t.semester}"`,
        `"${t.date}"`,
        t.amount,
        `"${t.method.replace(/"/g, '""')}"`,
        `"${t.status.replace(/₹/g, 'INR ').replace(/"/g, '""')}"`,
      ]);

      // Prefix with UTF-8 BOM (\uFEFF) so Excel & WPS Office render characters perfectly without encoding artifacts
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `SAP_FICA_Ledger_Export_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Collected Campus Revenue
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-extrabold text-emerald-700">₹8.42 Cr</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            92.4% Target Realized
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Outstanding Tuition Dues
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-extrabold text-amber-700">
              ₹{(68.4 + (pendingCount * 52000) / 100000).toFixed(1)} Lakh
            </span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-1">
            {142 + pendingCount} student accounts with balance {pendingCount > 0 ? `(${pendingCount} new pending)` : ''}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Collection Efficiency
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-extrabold text-[#0070f2]">{collectionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-[#0070f2] h-1.5 rounded-full" style={{ width: `${collectionRate}%` }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            SAP Financial Export
          </span>
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className={`w-full mt-2 py-2 px-3 rounded font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs ${
              exportSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0070f2] hover:bg-[#0064d9] active:bg-[#0052b4] text-white cursor-pointer'
            }`}
            title="Download full FI-CA Fee Ledger report as CSV spreadsheet"
          >
            {exportSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-white" />
                <span>Downloaded CSV!</span>
              </>
            ) : isExporting ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Generating CSV...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export FI-CA Ledger (CSV)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Recent University Fee Transactions Audit Trail
            </h3>
            <span className="text-[11px] text-gray-500">SAP Treasury Bank Reconciliation Feed</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or txn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Txn ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll ID</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4 text-right">Amount Received</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">{t.id}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{t.student}</td>
                  <td className="py-3 px-4 font-mono text-gray-600">{t.studentId}</td>
                  <td className="py-3 px-4 text-gray-700">{t.semester}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{t.method}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status.includes('Settled')
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status.includes('Partial')
                          ? 'bg-blue-100 text-[#0070f2]'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t.status}
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
