import React, { useState } from 'react';
import { Notice } from '../../types/portal';
import { Bell, Send, Trash2, Calendar, CheckCircle2, Megaphone } from 'lucide-react';

interface NoticesViewProps {
  notices: Notice[];
  onAddNotice: (notice: Omit<Notice, 'id'>) => void;
  onDeleteNotice: (id: number) => void;
  isAdmin: boolean;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  notices,
  onAddNotice,
  onDeleteNotice,
  isAdmin
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('2026-10-10');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onAddNotice({
      title: title.trim(),
      message: message.trim(),
      date: date,
      postedBy: isAdmin ? 'Admin Office' : 'Staff Coordinator',
      priority: 'NORMAL'
    });

    setTitle('');
    setMessage('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">College Notice Board</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Broadcast academic alerts, circulars, and campus event notices
        </p>
      </div>

      {showSuccess && (
        <div className="flex items-center space-x-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Notice published to all students and staff!</span>
        </div>
      )}

      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        {/* Post Notice Form (Only visible to admin) */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs h-fit">
            <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100">
              <Megaphone className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Publish Notice</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Title (title)
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Lab Submissions"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Announcement Date (date)
                </label>
                <input
                  type="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Message Body (message)
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write clear notification details for students and faculty..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-xs mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish Notice</span>
              </button>
            </form>
          </div>
        )}

        {/* Notices Feed */}
        <div className={`${isAdmin ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'} space-y-4`}>
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{notice.date}</span>
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {notice.postedBy}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{notice.title}</h3>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => onDeleteNotice(notice.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed whitespace-pre-line">
                {notice.message}
              </p>
            </div>
          ))}

          {notices.length === 0 && (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>No notices currently active on the board.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
