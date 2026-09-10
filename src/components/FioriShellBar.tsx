import React, { useState, useRef, useEffect } from 'react';
import { User, NotificationItem, UserRole } from '../types';
import {
  Bell,
  UserCheck,
  GraduationCap,
  Briefcase,
  Shield,
  ChevronDown,
  LogOut,
  RefreshCw,
  HelpCircle,
  Menu,
} from 'lucide-react';
import { NotificationsPopover } from './NotificationsPopover';

interface FioriShellBarProps {
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  onOpenLogin: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onNavigateTab?: (tab: string) => void;
  onGlobalSearch?: (term: string) => void;
  onResetData?: () => void;
}

export const FioriShellBar: React.FC<FioriShellBarProps> = ({
  currentUser,
  onSwitchRole,
  onOpenLogin,
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  onClearAll,
  onNavigateTab,
  onResetData,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'student':
        return (
          <span className="bg-blue-100 text-[#0070f2] border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </span>
        );
      case 'teacher':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Faculty Workbench</span>
          </span>
        );
      case 'admin':
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Campus Admin</span>
          </span>
        );
    }
  };

  return (
    <header className="no-print bg-[#354a5f] text-white h-12 flex items-center justify-between px-3 md:px-5 border-b border-[#2c3e50] shadow-sm select-none relative z-40">
      {/* Brand & Institution Info */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Authentic SAP Logo Pill */}
        <div className="flex items-center space-x-2.5 cursor-pointer hover:opacity-95 transition">
          <div className="bg-gradient-to-r from-[#0070f2] to-[#0052cc] text-white font-bold text-xs px-2.5 py-1 rounded shadow-xs tracking-wider border border-white/20">
            SAP
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight text-white leading-none">
              S/4HANA Campus ERP
            </span>
            <span className="text-[10px] text-gray-300 tracking-normal font-normal mt-0.5">
              Indian Institute of Technology & Management
            </span>
          </div>
        </div>
      </div>

      {/* Center Academic Session Badge (Clean & Informative) */}
      <div className="hidden md:flex items-center space-x-2.5 text-xs text-gray-300 bg-[#253648]/70 px-3.5 py-1 rounded-full border border-white/10 shadow-inner">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-white">Academic Session 2024–2025</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-300">Bengaluru Main Campus</span>
      </div>

      {/* Right Actions & Utilities */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Notifications Icon with Badge & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded hover:bg-white/10 text-gray-200 hover:text-white transition relative focus:outline-hidden"
            title="SAP Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#354a5f]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <NotificationsPopover
            isOpen={showNotifications}
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
            onMarkAllAsRead={onMarkAllAsRead}
            onMarkAsRead={onMarkAsRead}
            onClearAll={onClearAll}
            onNavigate={onNavigateTab}
          />
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1 rounded hover:bg-white/10 transition focus:outline-hidden"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-white/40"
            />
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-gray-100 max-w-[110px] truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-gray-300 uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
          </button>

          {/* User Profile Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-11 w-64 bg-white text-gray-800 rounded-md shadow-2xl border border-gray-300 py-2 z-50 animate-in fade-in duration-100 text-xs">
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                <p className="font-bold text-gray-900 text-sm">{currentUser.name}</p>
                <p className="text-gray-500 text-[11px] truncate">{currentUser.email}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-500">
                    ID: {currentUser.studentId || currentUser.teacherId || currentUser.adminId}
                  </span>
                  {getRoleBadge(currentUser.role)}
                </div>
              </div>

              {/* Fast switch options */}
              <div className="py-1">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Switch Active Portal
                </div>
                <button
                  onClick={() => {
                    onSwitchRole('student');
                    setShowUserMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-blue-50 ${
                    currentUser.role === 'student' ? 'text-[#0070f2] font-semibold bg-blue-50/50' : 'text-gray-700'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-[#0070f2]" />
                  <span>Student View (Aarav Sharma)</span>
                </button>
                <button
                  onClick={() => {
                    onSwitchRole('teacher');
                    setShowUserMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-amber-50 ${
                    currentUser.role === 'teacher' ? 'text-amber-700 font-semibold bg-amber-50/50' : 'text-gray-700'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <span>Faculty View (Dr. Meera Nambiar)</span>
                </button>
                <button
                  onClick={() => {
                    onSwitchRole('admin');
                    setShowUserMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-purple-50 ${
                    currentUser.role === 'admin' ? 'text-purple-700 font-semibold bg-purple-50/50' : 'text-gray-700'
                  }`}
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Admin View (Registrar Office)</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1 mt-1 space-y-0.5">
                {onResetData && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (window.confirm('Reset all portal data (attendance rolls, fee invoices, grades, documents, and timetable) back to factory demo defaults?')) {
                        onResetData();
                      }
                    }}
                    className="w-full px-3 py-1.5 text-left text-gray-600 hover:bg-gray-100 flex items-center space-x-2 font-medium transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                    <span>Reset All Data to Demo</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenLogin();
                  }}
                  className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Change User / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
