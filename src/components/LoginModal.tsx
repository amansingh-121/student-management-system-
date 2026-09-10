import React, { useState } from 'react';
import { UserRole } from '../types';
import { GraduationCap, Briefcase, Shield, Lock, User, KeyRound, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, customName?: string) => void;
  initialRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'student',
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);
  const [username, setUsername] = useState(
    initialRole === 'student'
      ? 'SAP-CS-2023-049'
      : initialRole === 'teacher'
      ? 'SAP-FAC-CS-018'
      : 'admin.erp@sap-campus.edu'
  );
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    if (role === 'student') {
      setUsername('SAP-CS-2023-049');
    } else if (role === 'teacher') {
      setUsername('SAP-FAC-CS-018');
    } else {
      setUsername('admin.erp@sap-campus.edu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(activeTab);
      onClose();
    }, 450);
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(role);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-hidden">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md max-h-[92vh] flex flex-col bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white transition p-1 z-20 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with SAP Brand */}
        <div className="bg-[#354a5f] text-white p-5 sm:p-6 text-center relative overflow-hidden shrink-0">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#0070f2]/20 rounded-full blur-xl pointer-events-none" />
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0070f2] to-[#0052cc] text-white font-bold text-sm px-3 py-1 rounded shadow-sm mb-3">
            <span>SAP</span>
            <span className="text-white/70 font-normal">|</span>
            <span className="text-xs font-normal">S/4HANA</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight">University ERP & SIS Portal</h2>
          <p className="text-xs text-gray-300 mt-1">
            Single Sign-On (SSO) Authentication for Students, Faculty & Admin
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* 3 Role Selection Tabs */}
          <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50 text-xs font-medium sticky top-0 z-10">
          <button
            type="button"
            onClick={() => handleTabChange('student')}
            className={`py-3 px-2 flex flex-col items-center justify-center space-y-1 transition border-b-2 ${
              activeTab === 'student'
                ? 'border-[#0070f2] text-[#0070f2] bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('teacher')}
            className={`py-3 px-2 flex flex-col items-center justify-center space-y-1 transition border-b-2 ${
              activeTab === 'teacher'
                ? 'border-amber-600 text-amber-700 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Teacher</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`py-3 px-2 flex flex-col items-center justify-center space-y-1 transition border-b-2 ${
              activeTab === 'admin'
                ? 'border-purple-600 text-purple-700 bg-white font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form Area */}
        <div className="p-6">
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Active Security Realm:
            </span>
            <div className="flex items-center text-xs font-medium text-gray-700 bg-blue-50/60 border border-blue-100 rounded px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shrink-0 animate-pulse" />
              {activeTab === 'student' && 'Student Self-Service (SSS) - View marksheet, attendance, fees'}
              {activeTab === 'teacher' && 'Faculty Workbench (FWB) - Take attendance & enter grades'}
              {activeTab === 'admin' && 'Enterprise Campus Controller (ECC) - University administration'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {activeTab === 'student' ? 'Student Enrollment ID / Roll No.' : activeTab === 'teacher' ? 'Faculty ID' : 'Administrator Email'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-hidden focus:border-[#0070f2] focus:ring-1 focus:ring-[#0070f2]"
                  placeholder="Enter your system identifier"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password / Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-hidden focus:border-[#0070f2] focus:ring-1 focus:ring-[#0070f2]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#0070f2] focus:ring-0"
                />
                <span className="text-gray-600 text-[11px]">Remember credentials</span>
              </label>
              <a href="#reset" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#0070f2] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-xs"
            >
              {isLoading ? (
                <span>Authenticating with SAP Realm...</span>
              ) : (
                <>
                  <span>Sign In as {activeTab.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Logins */}
          <div className="mt-5 pt-4 border-t border-gray-200">
            <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">
              1-Click Demo Profiles (Direct Access)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="p-2 border border-blue-200 hover:border-[#0070f2] bg-blue-50/50 hover:bg-blue-50 text-[#0070f2] rounded text-center transition font-medium"
              >
                <span className="block font-bold text-[11px]">Aarav Sharma</span>
                <span className="text-[10px] text-gray-500 block">Student (Sem 5)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('teacher')}
                className="p-2 border border-amber-200 hover:border-amber-600 bg-amber-50/50 hover:bg-amber-50 text-amber-800 rounded text-center transition font-medium"
              >
                <span className="block font-bold text-[11px]">Dr. Meera</span>
                <span className="text-[10px] text-gray-500 block">Teacher / Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 border border-purple-200 hover:border-purple-600 bg-purple-50/50 hover:bg-purple-50 text-purple-800 rounded text-center transition font-medium"
              >
                <span className="block font-bold text-[11px]">Rajesh Varma</span>
                <span className="text-[10px] text-gray-500 block">Registrar Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-2.5 border-t border-gray-200 text-center text-[10px] text-gray-500 flex items-center justify-between shrink-0">
          <span>Enterprise Encryption: TLS 1.3 / AES-256</span>
          <span className="font-mono">BUILD 2026.09.09</span>
        </div>
      </div>
    </div>
  );
};
