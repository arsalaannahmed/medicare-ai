import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Pill, Calendar, Plus, Trash2, ToggleLeft, ToggleRight, Clock, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Reminders() {
  const { reminders, addReminder, removeReminder, toggleReminder } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'medicine' | 'appointment'>('medicine');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Check reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      reminders.forEach(r => {
        if (r.enabled && r.time === currentTime) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(
              r.type === 'medicine' ? `Medicine Reminder: ${r.title}` : `Appointment Reminder: ${r.title}`,
              {
                body: r.type === 'medicine' ? `Time to take your medicine: ${r.title}` : `Upcoming appointment: ${r.title}`,
                icon: '/favicon.ico',
              }
            );
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [reminders]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !time) return;
    addReminder({ type, title: title.trim(), time, enabled: true });
    setTitle('');
    setTime('');
    setShowForm(false);
  };

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const medicineReminders = reminders.filter(r => r.type === 'medicine');
  const appointmentReminders = reminders.filter(r => r.type === 'appointment');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reminders</h1>
          <p className="text-gray-500">Set medicine and appointment reminders with browser notifications.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Reminder</span>
        </button>
      </motion.div>

      {/* Add Reminder Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">New Reminder</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('medicine')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      type === 'medicine' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Pill size={16} />
                    Medicine
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('appointment')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      type === 'appointment' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Calendar size={16} />
                    Appointment
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {type === 'medicine' ? 'Medicine Name' : 'Appointment Details'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={type === 'medicine' ? 'e.g., Paracetamol 500mg' : 'e.g., Dr. Sharma - Cardiology'}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Set Reminder
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Medicine Reminders */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Pill size={18} className="text-blue-500" />
          Medicine Reminders
          <span className="text-xs text-gray-400 font-normal">({medicineReminders.length})</span>
        </h3>
        {medicineReminders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <Pill size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No medicine reminders set</p>
          </div>
        ) : (
          <div className="space-y-2">
            {medicineReminders.map(r => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${r.enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Pill size={18} className={r.enabled ? 'text-blue-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${r.enabled ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{r.title}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <Clock size={12} />
                    {formatTime(r.time)}
                  </div>
                </div>
                <button
                  onClick={() => toggleReminder(r.id)}
                  className="p-1"
                >
                  {r.enabled ? (
                    <ToggleRight size={28} className="text-blue-600" />
                  ) : (
                    <ToggleLeft size={28} className="text-gray-300" />
                  )}
                </button>
                <button
                  onClick={() => removeReminder(r.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Reminders */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar size={18} className="text-emerald-500" />
          Appointment Reminders
          <span className="text-xs text-gray-400 font-normal">({appointmentReminders.length})</span>
        </h3>
        {appointmentReminders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No appointment reminders set</p>
          </div>
        ) : (
          <div className="space-y-2">
            {appointmentReminders.map(r => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${r.enabled ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <Calendar size={18} className={r.enabled ? 'text-emerald-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${r.enabled ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{r.title}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <Clock size={12} />
                    {formatTime(r.time)}
                  </div>
                </div>
                <button
                  onClick={() => toggleReminder(r.id)}
                  className="p-1"
                >
                  {r.enabled ? (
                    <ToggleRight size={28} className="text-emerald-600" />
                  ) : (
                    <ToggleLeft size={28} className="text-gray-300" />
                  )}
                </button>
                <button
                  onClick={() => removeReminder(r.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Permission */}
      {'Notification' in window && Notification.permission !== 'granted' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Bell size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Enable Notifications</p>
            <p className="text-xs text-amber-600 mt-0.5">Allow browser notifications to receive reminder alerts.</p>
            <button
              onClick={() => Notification.requestPermission()}
              className="mt-2 text-xs font-medium text-amber-700 underline hover:text-amber-800"
            >
              Enable notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
