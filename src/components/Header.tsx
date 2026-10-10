import React from 'react';
import { UserSession } from '../types/portal';
import { 
  GraduationCap, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

interface HeaderProps {
  user: UserSession;
  onLogout: () => void;
  onSwitchPersona: (role: 'ADMIN' | 'STUDENT') => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onSwitchPersona,
  isSyncing
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* College Brand with Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">StudentPortal</span>
              {isSyncing && (
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">College Student Management System</p>
          </div>
        </div>

        {/* User Session & Role Toggle */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            {user.role === 'ADMIN' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <UserCheck className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-slate-300">
              <strong className="text-white">{user.name}</strong> ({user.role})
            </span>
          </div>

          {/* Quick persona toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSwitchPersona(user.role === 'ADMIN' ? 'STUDENT' : 'ADMIN')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition font-medium"
              title="Switch user role for testing"
            >
              Switch to {user.role === 'ADMIN' ? 'Student' : 'Admin'}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition font-medium"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
