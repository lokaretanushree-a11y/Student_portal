import React, { useState } from 'react';
import { UserSession } from '../../types/portal';
import { GraduationCap, Lock, User, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: (session: UserSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
      onLogin({
        username: 'admin',
        name: 'College Dean / Admin',
        role: 'ADMIN'
      });
    } else if (username.toUpperCase() === 'CS202401' || username === 'student' || username === 'student1') {
      onLogin({
        username: username.toUpperCase(),
        name: 'Aarav Sharma',
        role: 'STUDENT',
        rollNo: 'CS202401'
      });
    } else if (username.trim() && password.trim()) {
      // Default to student if roll number pattern
      onLogin({
        username: username,
        name: username,
        role: 'STUDENT',
        rollNo: username
      });
    } else {
      setError('Invalid username or password. Please try the demo accounts below.');
    }
  };

  const handleQuickLogin = (role: 'ADMIN' | 'STUDENT') => {
    if (role === 'ADMIN') {
      onLogin({
        username: 'admin',
        name: 'Academic Dean',
        role: 'ADMIN'
      });
    } else {
      onLogin({
        username: 'CS202401',
        name: 'Aarav Sharma',
        role: 'STUDENT',
        rollNo: 'CS202401'
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 p-8 text-center text-white relative">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">College Student Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Sign in with your institutional credentials</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="flex items-center space-x-2 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / Roll No
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or Roll No (e.g. CS202401)"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="bg-slate-50 p-6 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block text-center mb-3">
              One-Click Demo Authentication
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="flex items-center justify-center space-x-2 py-2 px-3 bg-white border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-800 rounded-lg text-xs font-medium transition shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('STUDENT')}
                className="flex items-center justify-center space-x-2 py-2 px-3 bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-lg text-xs font-medium transition shadow-2xs"
              >
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>Student Login</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              Default accounts: Admin (admin / admin123) or Student (CS202401 / admin123)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
