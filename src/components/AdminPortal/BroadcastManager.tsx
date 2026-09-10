import React, { useState } from 'react';
import { NotificationItem, UserRole } from '../../types';
import { Send, Bell, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

interface BroadcastManagerProps {
  onPublishNotification: (notification: NotificationItem) => void;
  notificationsList: NotificationItem[];
}

export const BroadcastManager: React.FC<BroadcastManagerProps> = ({
  onPublishNotification,
  notificationsList,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState<'all' | 'student' | 'teacher'>('all');
  const [type, setType] = useState<NotificationItem['type']>('announcement');
  const [priority, setPriority] = useState<NotificationItem['priority']>('High');
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      description,
      timestamp: 'Just now',
      read: false,
      type,
      priority,
      targetRole,
    };

    onPublishNotification(newNotif);
    setSuccessToast(true);
    setTitle('');
    setDescription('');
    setTimeout(() => {
      setSuccessToast(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
          <Radio className="w-5 h-5 text-[#0070f2]" />
          <span>SAP Broadcast Alert & Campus Circular Dispatcher</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Push real-time announcements and emergency notices directly to Student and Faculty notification trays
        </p>

        {successToast && (
          <div className="mt-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Broadcast alert published! Synced across all connected user devices in real-time.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Notification Headline / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. End-Semester Examination Schedule Published"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Notification Message Body *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detailed explanation, deadlines, or room instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Target Audience</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
              >
                <option value="all">Entire Campus (Students + Teachers)</option>
                <option value="student">Students Only (SSS Portal)</option>
                <option value="teacher">Faculty Only (FWB Portal)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
              >
                <option value="academic">Academic / Exam</option>
                <option value="fee">Fee & Treasury</option>
                <option value="attendance">Attendance Policy</option>
                <option value="announcement">General Institutional</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:border-[#0070f2]"
              >
                <option value="High">High Priority (Urgent Pop-up)</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority / Info</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded font-semibold transition flex items-center space-x-2 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Real-Time Broadcast</span>
          </button>
        </form>
      </div>

      {/* Active Broadcasts History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Broadcast Activity History
          </h3>
          <span className="text-xs text-gray-500 font-mono">Live SAP WebSocket Push Feed</span>
        </div>

        <div className="divide-y divide-gray-100">
          {notificationsList.map((item) => (
            <div key={item.id} className="p-4 flex items-start justify-between gap-4 text-xs hover:bg-gray-50/50">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{item.title}</span>
                  <span className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                    {item.type}
                  </span>
                  {item.priority === 'High' && (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      High Priority
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed text-[11px]">{item.description}</p>
                <span className="text-[10px] text-gray-400 block">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
