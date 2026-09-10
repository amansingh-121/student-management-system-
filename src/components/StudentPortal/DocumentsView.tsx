import React, { useState } from 'react';
import { DocumentItem, User } from '../../types';
import { FileText, Download, UploadCloud, CheckCircle, Clock, ShieldCheck, Eye, Plus, X, Award } from 'lucide-react';

interface DocumentsViewProps {
  documents: DocumentItem[];
  student: User;
  onUploadDocument: (doc: DocumentItem) => void;
  onOpenSemesterMarksheet: (semesterNumber: number) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  student,
  onUploadDocument,
  onOpenSemesterMarksheet,
}) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentItem['type']>('Certificate');
  const [fileName, setFileName] = useState('');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !fileName) return;

    const newDoc: DocumentItem = {
      id: `doc_${Date.now()}`,
      title: docTitle,
      type: docType,
      fileName: fileName,
      fileSize: '1.1 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Ready to Download',
    };

    onUploadDocument(newDoc);
    setUploadModalOpen(false);
    setDocTitle('');
    setFileName('');
  };

  const handleDownloadDocument = (doc: DocumentItem) => {
    const content = `SAP University Verified Document Repository
==================================================
Title: ${doc.title}
File: ${doc.fileName}
Document Type: ${doc.type}
Issue / Upload Date: ${doc.uploadDate}
Verification Status: ${doc.status}
Digital Certificate Hash: SAP-DOC-AUTH-${Date.now().toString(16).toUpperCase()}
Issued By: Central Academic Office & University Treasury
==================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `document_${doc.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#0070f2]" />
            <h2 className="text-base font-bold text-gray-900">Student Document Management & Digital Vault</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Access verified semester transcripts, bona-fide certificates, fee receipts, and digital ID card
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIdCardModalOpen(true)}
            className="px-3 py-1.5 border border-gray-300 hover:border-[#0070f2] bg-white text-gray-700 hover:text-[#0070f2] rounded text-xs font-semibold transition shadow-xs flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#0070f2]" />
            <span>Digital ID Card</span>
          </button>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-xs font-semibold transition shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Verified Documents Repository ({documents.length} Files)
          </h3>
          <span className="text-xs text-gray-500 font-mono">SAP Document Management System (DMS)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f4f8] text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category / Type</th>
                <th className="py-3 px-4">File Name & Size</th>
                <th className="py-3 px-4">Upload / Issue Date</th>
                <th className="py-3 px-4 text-center">Verification Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-blue-50 text-[#0070f2] rounded shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-gray-900">{doc.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-gray-700 text-[11px] block">{doc.fileName}</span>
                    <span className="text-[10px] text-gray-400">{doc.fileSize}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-mono">{doc.uploadDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {doc.type === 'Marksheet' && doc.semester ? (
                      <button
                        onClick={() => onOpenSemesterMarksheet(doc.semester!)}
                        className="px-2.5 py-1 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded text-[11px] font-medium transition shadow-xs inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View & Print</span>
                      </button>
                    ) : doc.type === 'ID_Card' ? (
                      <button
                        onClick={() => setIdCardModalOpen(true)}
                        className="px-2.5 py-1 border border-[#0070f2] text-[#0070f2] hover:bg-blue-50 rounded text-[11px] font-medium transition inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View ID Card</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownloadDocument(doc)}
                        className="px-2.5 py-1 border border-gray-300 hover:border-[#0070f2] text-gray-700 hover:text-[#0070f2] hover:bg-blue-50/50 rounded text-[11px] font-medium transition inline-flex items-center space-x-1 cursor-pointer"
                        title="Download file"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-hidden">
          <div className="absolute inset-0" onClick={() => setUploadModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-md max-h-[92vh] flex flex-col bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#354a5f] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-4 h-4 text-blue-300" />
                <span className="font-bold text-xs">Upload Student Document to SAP DMS</span>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="text-gray-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Document Title / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical Exemption Certificate, Internship NOC"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Document Category
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentItem['type'])}
                  className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
                >
                  <option value="Certificate">Certificate / Award</option>
                  <option value="Bonafide">Bonafide / NOC Letter</option>
                  <option value="Marksheet">Previous Marksheet / Transfer</option>
                  <option value="Fee_Receipt">External Fee Challan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Select File (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                      if (!docTitle) {
                        setDocTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  className="w-full p-2 border border-dashed border-gray-300 rounded text-gray-600 bg-gray-50 text-xs"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded text-[11px] text-gray-600">
                Uploaded documents will be digitally indexed in the SAP S/4HANA Student Master Record for verification by the Dean of Academics.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded font-semibold transition shadow-xs"
              >
                Upload & Submit for Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Digital Student ID Card Modal */}
      {idCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-hidden">
          <div className="absolute inset-0" onClick={() => setIdCardModalOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-sm max-h-[92vh] flex flex-col bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="no-print bg-[#354a5f] text-white p-3 px-4 flex items-center justify-between shrink-0">
              <span className="font-bold text-xs">Digital Student Identity Card</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-2 py-0.5 bg-[#0070f2] text-white rounded text-[10px] font-semibold"
                >
                  Print
                </button>
                <button onClick={() => setIdCardModalOpen(false)} className="text-gray-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Realistic RFID Student ID Card */}
            <div className="p-6 bg-gradient-to-br from-[#0c3156] to-[#1c558c] text-white rounded-b-xl shadow-inner relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-white text-[#0070f2] font-black text-xs px-1.5 py-0.5 rounded">
                    SAP
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-white">SAP IIT & MANAGEMENT</h4>
                    <span className="text-[9px] text-gray-200 block">Bengaluru • AICTE & UGC Approved</span>
                  </div>
                </div>
                <span className="bg-amber-400 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                  STUDENT ID
                </span>
              </div>

              {/* Body */}
              <div className="flex space-x-4 items-center mb-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-20 h-24 object-cover rounded border-2 border-white/80 shadow-md shrink-0"
                />
                <div className="space-y-1 text-xs">
                  <span className="font-extrabold text-sm block text-white leading-tight">{student.name}</span>
                  <span className="font-mono text-[11px] text-amber-300 font-bold block">{student.studentId}</span>
                  <span className="text-[10px] text-gray-200 block">{student.program}</span>
                  <span className="text-[10px] text-gray-300 block">Semester 5 • Computer Science</span>
                  <span className="text-[9px] text-emerald-300 block font-mono">ABC ID: ABC-849-210-049</span>
                  <span className="text-[9px] text-gray-400 block font-mono">Blood Grp: B+ • Valid: 2023-2027</span>
                </div>
              </div>

              {/* Barcode & Security Strip */}
              <div className="border-t border-white/20 pt-3 flex items-center justify-between text-[9px] text-gray-300">
                <div className="font-mono text-[10px] tracking-widest text-gray-200">
                  ||||| ||| ||||||| |||| |||||
                </div>
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RFID NFC ACTIVATED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
