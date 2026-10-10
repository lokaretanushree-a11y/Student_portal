import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  GraduationCap, 
  Bell, 
  LayoutDashboard,
  UserCircle
} from 'lucide-react';

export type PortalTab = 
  | 'admin-dashboard' 
  | 'students' 
  | 'attendance' 
  | 'marks' 
  | 'notices' 
  | 'student-dashboard';

interface NavigationProps {
  role: 'ADMIN' | 'STUDENT';
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ role, activeTab, setActiveTab }) => {
  const adminLinks = [
    { id: 'admin-dashboard' as PortalTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students' as PortalTab, label: 'Student Directory', icon: Users },
    { id: 'attendance' as PortalTab, label: 'Attendance', icon: CalendarCheck },
    { id: 'marks' as PortalTab, label: 'Marks & Grades', icon: GraduationCap },
    { id: 'notices' as PortalTab, label: 'Notice Board', icon: Bell },
  ];

  const studentLinks = [
    { id: 'student-dashboard' as PortalTab, label: 'My Dashboard', icon: UserCircle },
    { id: 'notices' as PortalTab, label: 'Campus Notices', icon: Bell },
  ];

  const links = role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-800 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
