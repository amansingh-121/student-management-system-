import React, { useState } from 'react';
import { TimetableSlot, DayOfWeek } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  RotateCcw,
  Plus,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Radio,
  Layers,
  ChevronRight,
  Edit3,
} from 'lucide-react';

interface TimetableViewProps {
  timetableSlots: TimetableSlot[];
  onSimulateTimetableChange: () => void;
  onResetTimetable: () => void;
  onUpdateSlot?: (slot: TimetableSlot) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TimetableView: React.FC<TimetableViewProps> = ({
  timetableSlots,
  onSimulateTimetableChange,
  onResetTimetable,
  onUpdateSlot,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Wednesday');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  const daySlots = timetableSlots
    .filter((slot) => slot.day === selectedDay)
    .sort((a, b) => a.periodNumber - b.periodNumber);

  const getStatusBadge = (status: TimetableSlot['status']) => {
    switch (status) {
      case 'Live':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mr-1" />
            LIVE NOW
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Conducted
          </span>
        );
      case 'Rescheduled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
            Updated / Rescheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <Clock className="w-3 h-3 mr-1 text-gray-500" />
            Upcoming
          </span>
        );
    }
  };

  const getTypeColor = (type: TimetableSlot['type']) => {
    switch (type) {
      case 'Lab':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Seminar':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Tutorial':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-blue-100 text-[#0070f2] border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Toolbar */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#0070f2]" />
              <h1 className="text-base font-bold text-gray-900">
                Academic Timetable & Lecture Schedule
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              B.Tech Computer Science & Engineering • Semester 5 • Section A • Academic Term 2025–2026
            </p>
          </div>

          {/* Interactive Simulation & View Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onSimulateTimetableChange}
              className="px-3.5 py-1.5 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded-md text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
              title="Simulate dynamic timetable changes like rescheduled class or extra SAP session"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Schedule Update (Dummy)</span>
            </button>

            <button
              onClick={onResetTimetable}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-semibold transition flex items-center space-x-1 border border-gray-300"
              title="Reset to default weekly timetable"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
              <span>Reset</span>
            </button>

            <div className="flex items-center bg-gray-100 p-0.5 rounded-md border border-gray-200 text-xs">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 rounded transition font-medium ${
                  viewMode === 'day'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Day View
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded transition font-medium ${
                  viewMode === 'week'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week Grid
              </button>
            </div>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center overflow-x-auto no-scrollbar space-x-2">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap mr-1">Select Day:</span>
          {DAYS.map((day) => {
            const isToday = day === 'Wednesday';
            const isSelected = selectedDay === day;
            const slotCount = timetableSlots.filter((s) => s.day === day).length;
            return (
              <button
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  setViewMode('day');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#354a5f] text-white shadow-xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{day}</span>
                {isToday && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${isSelected ? 'bg-amber-400 text-gray-900' : 'bg-amber-100 text-amber-800'}`}>
                    Today
                  </span>
                )}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {slotCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center space-x-2">
              <span>{selectedDay}'s Scheduled Periods ({daySlots.length} Classes)</span>
              {selectedDay === 'Wednesday' && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-semibold border border-emerald-300">
                  Current Day
                </span>
              )}
            </h2>
            <span className="text-[11px] text-gray-500">
              Classes commence at 09:00 AM IST
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {daySlots.map((slot, index) => (
              <div
                key={slot.id}
                className={`bg-white rounded-lg border transition shadow-xs overflow-hidden ${
                  slot.status === 'Live'
                    ? 'border-red-400 ring-2 ring-red-100'
                    : slot.status === 'Rescheduled'
                    ? 'border-amber-400 bg-amber-50/10'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Time & Period Indicator */}
                  <div className="flex items-start sm:items-center space-x-3 shrink-0">
                    <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center font-mono">
                      <span className="text-[9px] uppercase font-bold text-gray-500">Period</span>
                      <span className="text-base font-extrabold text-gray-900">{slot.periodNumber}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-900 font-mono flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-gray-400" />
                          {slot.timeSlot}
                        </span>
                        {getStatusBadge(slot.status)}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTypeColor(slot.type)}`}>
                          {slot.type}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#0070f2]">
                          {slot.subjectCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Subject & Faculty Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {slot.subjectTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-1">
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {slot.facultyName}
                      </span>
                      <span className="flex items-center font-medium text-gray-700">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {slot.room}
                      </span>
                    </div>
                    {slot.notes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded mt-2">
                        <span className="font-semibold">Note:</span> {slot.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Quick Action / Custom Edit */}
                  <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                    <button
                      onClick={() => setEditingSlot(slot)}
                      className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-[#0070f2] hover:bg-blue-50 rounded transition flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Slot</span>
                    </button>
                    <span className="text-[10px] text-gray-400 font-mono mt-1">
                      {slot.id}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {daySlots.length === 0 && (
              <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-gray-700">No scheduled classes for {selectedDay}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enjoy your academic preparation day or check upcoming assignments.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WEEK MATRIX VIEW */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-[#f0f4f8] border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Comprehensive Weekly Academic Grid (B.Tech CS Sem 5)
            </h3>
            <span className="text-xs text-gray-500 font-mono">5 Periods / Day</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3 border-r border-gray-200 w-28">Day</th>
                  <th className="py-3 px-3 border-r border-gray-200">Period 1<br /><span className="text-gray-400 font-normal">09:00 - 10:00</span></th>
                  <th className="py-3 px-3 border-r border-gray-200">Period 2<br /><span className="text-gray-400 font-normal">10:15 - 11:15</span></th>
                  <th className="py-3 px-3 border-r border-gray-200">Period 3<br /><span className="text-gray-400 font-normal">11:30 - 12:30</span></th>
                  <th className="py-3 px-3 border-r border-gray-200">Period 4<br /><span className="text-gray-400 font-normal">02:00 - 03:00 / Lab</span></th>
                  <th className="py-3 px-3">Period 5<br /><span className="text-gray-400 font-normal">03:15 - 05:15</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {DAYS.map((day) => {
                  const slotsForDay = timetableSlots.filter((s) => s.day === day);
                  const isToday = day === 'Wednesday';
                  return (
                    <tr key={day} className={`hover:bg-blue-50/20 transition ${isToday ? 'bg-blue-50/30' : ''}`}>
                      <td className="py-3 px-3 font-bold border-r border-gray-200 bg-gray-50/50">
                        <div className="flex items-center space-x-1.5">
                          <span>{day}</span>
                          {isToday && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </div>
                      </td>
                      {[1, 2, 3, 4, 5].map((period) => {
                        const slot = slotsForDay.find((s) => s.periodNumber === period);
                        return (
                          <td
                            key={period}
                            className="py-2.5 px-3 border-r border-gray-200 align-top min-w-[150px]"
                          >
                            {slot ? (
                              <div
                                onClick={() => setEditingSlot(slot)}
                                className={`p-2 rounded border transition cursor-pointer hover:shadow-xs ${
                                  slot.status === 'Live'
                                    ? 'bg-red-50 border-red-300'
                                    : slot.status === 'Rescheduled'
                                    ? 'bg-amber-50 border-amber-300'
                                    : 'bg-white border-gray-200 hover:border-blue-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-bold text-[#0070f2] text-[11px]">
                                    {slot.subjectCode}
                                  </span>
                                  <span className={`text-[8px] font-bold px-1 rounded ${getTypeColor(slot.type)}`}>
                                    {slot.type}
                                  </span>
                                </div>
                                <span className="font-semibold text-gray-900 block text-[11px] truncate mt-0.5">
                                  {slot.subjectTitle}
                                </span>
                                <span className="text-[10px] text-gray-500 block truncate">
                                  {slot.room}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-300 text-[11px] italic">Free / Study</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-hidden">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#354a5f] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-xs">Edit Timetable Slot ({editingSlot.day} • Period {editingSlot.periodNumber})</span>
              </div>
              <button
                onClick={() => setEditingSlot(null)}
                className="text-gray-300 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateSlot && editingSlot) {
                  onUpdateSlot(editingSlot);
                }
                setEditingSlot(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject Code & Title</label>
                <input
                  type="text"
                  value={`${editingSlot.subjectCode} - ${editingSlot.subjectTitle}`}
                  disabled
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-gray-600 cursor-not-allowed font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Lecture Room / Lab</label>
                  <input
                    type="text"
                    value={editingSlot.room}
                    onChange={(e) => setEditingSlot({ ...editingSlot, room: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#0070f2] focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={editingSlot.timeSlot}
                    onChange={(e) => setEditingSlot({ ...editingSlot, timeSlot: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#0070f2] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={editingSlot.facultyName}
                    onChange={(e) => setEditingSlot({ ...editingSlot, facultyName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#0070f2] focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={editingSlot.status}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        status: e.target.value as TimetableSlot['status'],
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:border-[#0070f2] focus:outline-hidden"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live / Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Rescheduled">Rescheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Custom Notes / Advisory</label>
                <input
                  type="text"
                  value={editingSlot.notes || ''}
                  onChange={(e) => setEditingSlot({ ...editingSlot, notes: e.target.value })}
                  placeholder="e.g. Special Lab Session / Room Relocated"
                  className="w-full p-2 border border-gray-300 rounded focus:border-[#0070f2] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0070f2] hover:bg-[#0064d9] text-white rounded font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
