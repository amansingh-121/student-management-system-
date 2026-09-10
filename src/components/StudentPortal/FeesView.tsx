import React, { useState } from 'react';
import { FeeInvoice, User } from '../../types';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle, ShieldCheck, ArrowRight, X, Receipt } from 'lucide-react';

interface FeesViewProps {
  invoices: FeeInvoice[];
  student: User;
  onPaySuccess: (invoiceId: string, paidAmount: number) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  invoices,
  student,
  onPaySuccess,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompletedSuccess, setPaymentCompletedSuccess] = useState(false);

  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalDue = invoices.reduce((acc, curr) => acc + curr.dueAmount, 0);

  const handleOpenPay = (inv: FeeInvoice) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.dueAmount);
    setPaymentCompletedSuccess(false);
    setPaymentModalOpen(true);
  };

  const handleOpenReceipt = (inv: FeeInvoice) => {
    setSelectedInvoice(inv);
    setReceiptModalOpen(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompletedSuccess(true);
      onPaySuccess(selectedInvoice.id, paymentAmount);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Total Invoiced Amount
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-extrabold text-gray-900">
              ₹{totalInvoiced.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-gray-500 block mt-2">
            Spanning Semester 4 to Semester 6
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Total Fees Paid
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-extrabold text-emerald-700">
              ₹{totalPaid.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-emerald-700 font-semibold">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            <span>{((totalPaid / totalInvoiced) * 100).toFixed(0)}% Cleared through SAP Gateway</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Outstanding Balance Due
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`text-3xl font-extrabold ${totalDue > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
                ₹{totalDue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          {totalDue > 0 && (
            <span className="text-[11px] text-amber-700 font-medium block mt-2 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 shrink-0" />
              Due Date: September 30, 2026
            </span>
          )}
        </div>
      </div>

      {/* Semester Fee Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Semester Fee Invoices & Financial Ledgers
            </h3>
            <span className="text-[11px] text-gray-500">
              Integrated with SAP Treasury & Student Accounts (FI-CA)
            </span>
          </div>
          <span className="text-xs text-gray-500">Currency: INR (₹)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice Number</th>
                <th className="py-3 px-4">Academic Semester</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
                <th className="py-3 px-3 text-right">Paid Amount</th>
                <th className="py-3 px-3 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Payment Status</th>
                <th className="py-3 px-4 text-center">Due / Paid Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-3 px-4 font-mono font-medium text-gray-900">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900 block">Semester {inv.semester}</span>
                    <span className="text-[10px] text-gray-500">{inv.academicYear}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-gray-900">
                    ₹{inv.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-semibold">
                    ₹{inv.paidAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-gray-900">
                    {inv.dueAmount > 0 ? (
                      <span className="text-amber-600">₹{inv.dueAmount.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-gray-400">₹0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'Partial'
                          ? 'bg-blue-100 text-[#0070f2]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status === 'Paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {inv.status === 'Partial' && <Clock className="w-3 h-3 mr-1" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600 font-mono text-[11px]">
                    {inv.status === 'Paid' ? inv.paymentDate : `Due by ${inv.dueDate}`}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {inv.dueAmount > 0 ? (
                        <button
                          onClick={() => handleOpenPay(inv)}
                          className="px-2.5 py-1 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-[11px] font-semibold transition shadow-xs flex items-center space-x-1"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay Now</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenReceipt(inv)}
                          className="px-2.5 py-1 border border-gray-300 hover:border-[#0070f2] bg-white text-gray-700 hover:text-[#0070f2] rounded text-[11px] font-medium transition flex items-center space-x-1"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fee Itemization Breakdown Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
          Detailed Semester 6 Fee Structure Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {invoices[1]?.breakdown.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded flex justify-between items-center">
              <span className="text-gray-700 font-medium">{item.label}</span>
              <span className="font-bold text-gray-900 font-mono">₹{item.amount.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Processing Modal */}
      {paymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-hidden">
          <div className="absolute inset-0" onClick={() => setPaymentModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-md max-h-[92vh] flex flex-col bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#354a5f] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs">SAP Campus Pay Gateway • Semester {selectedInvoice.semester}</span>
              </div>
              <button onClick={() => setPaymentModalOpen(false)} className="text-gray-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs flex-1 overflow-y-auto">
              {paymentCompletedSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-base text-gray-900">Payment Successful!</h4>
                  <p className="text-gray-600 mt-1 text-xs">
                    Amount ₹{paymentAmount.toLocaleString('en-IN')} successfully credited to University Accounts.
                  </p>
                  <p className="text-gray-500 mt-2 font-mono text-[11px]">
                    Reference ID: TXN_SAP_{Math.floor(100000000 + Math.random() * 900000000)}
                  </p>
                  <button
                    onClick={() => {
                      setPaymentModalOpen(false);
                      setReceiptModalOpen(true);
                    }}
                    className="mt-5 px-4 py-2 bg-[#0070f2] text-white rounded font-semibold text-xs shadow-xs"
                  >
                    View Official Receipt
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProcessPayment} className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded border border-blue-100 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Invoice Ref</span>
                      <span className="block font-mono font-bold text-gray-900">{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Remaining Due</span>
                      <span className="block font-bold text-base text-amber-700">₹{selectedInvoice.dueAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Payment Amount (INR)
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      max={selectedInvoice.dueAmount}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded font-bold text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                    />
                    <span className="text-[10px] text-gray-500 block mt-1">
                      You can pay partial installments or the entire balance.
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">
                      Select Payment Instrument
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'upi', label: 'UPI / QR' },
                        { id: 'card', label: 'Debit / Credit' },
                        { id: 'netbanking', label: 'NetBanking' },
                      ].map((m) => (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={`p-2 border rounded text-center transition font-medium text-[11px] ${
                            paymentMethod === m.id
                              ? 'border-[#0070f2] bg-blue-50 text-[#0070f2] font-bold'
                              : 'border-gray-300 text-gray-700'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded text-[11px] text-gray-600">
                    <span>Cardholder / Payer: <strong>{student.name}</strong></span>
                    <span className="block mt-0.5 font-mono text-[10px] text-gray-500">Student ID: {student.studentId}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded font-semibold transition flex items-center justify-center space-x-2 shadow-xs"
                  >
                    {isProcessing ? (
                      <span>Connecting to Bank Gateway...</span>
                    ) : (
                      <>
                        <span>Confirm & Pay ₹{paymentAmount.toLocaleString('en-IN')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Official Fee Receipt Modal */}
      {receiptModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="absolute inset-0" onClick={() => setReceiptModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="no-print bg-[#354a5f] text-white p-3 px-5 flex items-center justify-between shrink-0">
              <span className="font-bold text-xs">Official Fee Payment Receipt</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-[#0070f2] text-white rounded text-[11px] font-semibold flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Print Receipt</span>
                </button>
                <button onClick={() => setReceiptModalOpen(false)} className="text-gray-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Receipt document area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 text-xs text-gray-900 select-text">
              <div className="border-b-2 border-gray-900 pb-4 mb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base uppercase text-[#1d2d3e]">SAP Indian Institute of Technology & Management</h3>
                  <p className="text-[11px] text-gray-600">Finance & Accounts Section • Central Treasury, Bengaluru</p>
                  <p className="text-[10px] text-gray-500">GSTIN: 29AAATU1234F1Z5 • Govt. of Karnataka PAN/TAN Verified</p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                    OFFICIAL RECEIPT
                  </span>
                  <p className="text-[11px] font-mono mt-1 text-gray-700">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-[10px] text-gray-500">Date: {selectedInvoice.paymentDate || '2026-08-28'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded border border-gray-200 mb-4 text-[11px]">
                <div>
                  <span className="text-gray-500 block">Student Name:</span>
                  <span className="font-bold text-gray-900">{student.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Student Roll ID:</span>
                  <span className="font-mono font-bold text-gray-900">{student.studentId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Program:</span>
                  <span className="font-semibold text-gray-800">{student.program}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Semester:</span>
                  <span className="font-semibold text-gray-800">Semester {selectedInvoice.semester}</span>
                </div>
              </div>

              <table className="w-full border border-gray-200 mb-4 text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-2">Fee Head Description</th>
                    <th className="p-2 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedInvoice.breakdown.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2">{item.label}</td>
                      <td className="p-2 text-right font-mono">₹{item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td className="p-2">Total Invoiced Amount</td>
                    <td className="p-2 text-right font-mono">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-emerald-50 text-emerald-900 font-bold">
                    <td className="p-2">Total Amount Paid Received</td>
                    <td className="p-2 text-right font-mono">₹{selectedInvoice.paidAmount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center border-t border-gray-200 pt-3 text-[10px] text-gray-500">
                <span>Transaction Ref: {selectedInvoice.transactionRef || 'TXN_SAP_948210398'}</span>
                <span className="font-semibold text-gray-700">Authorised Treasury Officer, SAP ERP</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
