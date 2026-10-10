import React, { useState, useEffect } from 'react';
import { Student } from '../../types/portal';
import { AVAILABLE_CLASSES } from '../../data/mockData';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id'>, isEdit: boolean) => { success: boolean; error?: string };
  editingStudent: Student | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingStudent
}) => {
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('CS - Year 3');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingStudent) {
      setRollNo(editingStudent.rollNo);
      setName(editingStudent.name);
      setClassName(editingStudent.className);
      setEmail(editingStudent.email);
    } else {
      setRollNo('');
      setName('');
      setClassName('CS - Year 3');
      setEmail('');
    }
    setError(null);
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form parameter validation (matching validate.js in J2EE project)
    if (!rollNo.trim()) {
      setError('Roll Number is required.');
      return;
    }
    if (!name.trim()) {
      setError('Student Full Name is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid college email address.');
      return;
    }

    const result = onSave(
      {
        rollNo: rollNo.trim().toUpperCase(),
        name: name.trim(),
        className: className.trim(),
        email: email.trim().toLowerCase()
      },
      Boolean(editingStudent)
    );

    if (!result.success) {
      setError(result.error || 'Failed to save student record.');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            {editingStudent ? <Save className="w-5 h-5 text-blue-400" /> : <UserPlus className="w-5 h-5 text-blue-400" />}
            <h3 className="font-semibold text-lg">
              {editingStudent ? 'Edit Student Details' : 'Enroll New Student'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Roll Number (Unique Identifier)
            </label>
            <input
              type="text"
              name="rollNo"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              disabled={Boolean(editingStudent)}
              placeholder="e.g. CS202488"
              className={`w-full px-3 py-2 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                editingStudent
                  ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                  : 'bg-white border-slate-300'
              }`}
              required
            />
            {editingStudent && (
              <p className="text-xs text-slate-500 mt-1">Roll number cannot be changed once enrolled.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Neha Deshmukh"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Class / Branch / Year
            </label>
            <select
              name="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AVAILABLE_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@college.edu"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
            >
              {editingStudent ? 'Update Student Record' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
