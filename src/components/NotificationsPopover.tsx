import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { Bell, Check, Trash2, BookOpen, CreditCard, Clock, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationsPopoverProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onNavigate?: (tab: string) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onMarkAsRead,
  onClearAll,
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'academic' | 'fee' | 'attendance'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter(
    (n) => activeFilter === 'all' || n.type === activeFilter
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <BookOpen className="w-4 h-4 text-[#0070f2]" />;
      case 'fee':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-md shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
      {/* Header */}
      <div className="bg-[#354a5f] text-white px-4 py-3 flex items-center justify-between border-b border-gray-400">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-amber-300" />
          <span className="font-semibold text-sm">SAP Notification Center</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition p-1"
          title="Close notification drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center border-b border-gray-200 bg-gray-50 px-2 pt-1 gap-1 text-[11px]">
        {(['all', 'academic', 'fee', 'attendance'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-2.5 py-1.5 font-medium rounded-t transition uppercase text-[10px] tracking-wider ${
              activeFilter === filter
                ? 'border-b-2 border-[#0070f2] text-[#0070f2] bg-white font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Action toolbar */}
      <div className="px-3 py-1.5 bg-gray-100/70 border-b border-gray-200 flex justify-between items-center text-[11px] text-gray-600">
        <span>{filtered.length} total notifications</span>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="hover:text-[#0070f2] flex items-center space-x-1 font-medium"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="hover:text-red-600 flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No notifications in this category</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onMarkAsRead(item.id);
                if (item.actionPath && onNavigate) {
                  onNavigate(item.actionPath);
                  onClose();
                }
              }}
              className={`p-3 transition cursor-pointer hover:bg-blue-50/50 flex items-start space-x-3 ${
                !item.read ? 'bg-blue-50/30' : 'bg-white'
              }`}
            >
              <div className="p-2 rounded bg-gray-100 shrink-0 mt-0.5">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${!item.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {item.title}
                  </span>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#0070f2] shrink-0 ml-2" />
                  )}
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2 leading-tight">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-400">
                  <span>{item.timestamp}</span>
                  {item.priority === 'High' && (
                    <span className="text-red-600 font-semibold flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-0.5" /> High Priority
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="p-2 bg-gray-50 border-t border-gray-200 text-center text-[10px] text-gray-500">
        SAP Fiori Launchpad Real-Time Message Broker v2026.1
      </div>
    </div>
  );
};
