import React, { useState, useEffect, useCallback } from 'react';
import { Student, AttendanceRecord, MarkRecord, Notice, UserSession } from './types/portal';
import { Header } from './components/Header';
import { Navigation, PortalTab } from './components/Navigation';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { StudentListView } from './components/admin/StudentListView';
import { StudentFormModal } from './components/admin/StudentFormModal';
import { AttendanceView } from './components/admin/AttendanceView';
import { MarksView } from './components/admin/MarksView';
import { NoticesView } from './components/admin/NoticesView';
import { StudentDashboardView } from './components/student/StudentDashboardView';
import { LoginView } from './components/auth/LoginView';
import { api } from './services/api';

export default function App() {
  // Current user session (Admin default for instant access, user can switch or log out)
  const [user, setUser] = useState<UserSession | null>({
    username: 'admin',
    name: 'Dean of Academics',
    role: 'ADMIN'
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<PortalTab>('admin-dashboard');

  // Application Data States (synced with Express backend)
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal and Notification Banners
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Fetch all backend data
  const loadPortalData = useCallback(async () => {
    try {
      setIsSyncing(true);
      const [fetchedStudents, fetchedAttendance, fetchedMarks, fetchedNotices] = await Promise.all([
        api.getStudents(),
        api.getAttendance(),
        api.getMarks(),
        api.getNotices()
      ]);
      setStudents(fetchedStudents);
      setAttendance(fetchedAttendance);
      setMarks(fetchedMarks);
      setNotices(fetchedNotices);
    } catch (err) {
      console.error('Error fetching backend data:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]);

  // Authentication Handlers
  const handleLogin = (session: UserSession) => {
    setUser(session);
    if (session.role === 'ADMIN') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('student-dashboard');
    }
    loadPortalData();
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSwitchPersona = (role: 'ADMIN' | 'STUDENT') => {
    if (role === 'ADMIN') {
      setUser({
        username: 'admin',
        name: 'Dean of Academics',
        role: 'ADMIN'
      });
      setActiveTab('admin-dashboard');
    } else {
      setUser({
        username: 'CS202401',
        name: 'Aarav Sharma',
        role: 'STUDENT',
        rollNo: 'CS202401'
      });
      setActiveTab('student-dashboard');
    }
  };

  // Student CRUD Operations (Talking to Express Backend)
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormModalOpen(true);
  };

  const handleSaveStudent = (
    studentData: Omit<Student, 'id'>,
    isEdit: boolean
  ): { success: boolean; error?: string } => {
    if (isEdit) {
      api.updateStudent(studentData.rollNo, studentData)
        .then(() => {
          loadPortalData();
          setSuccessBanner(`Student ${studentData.name} updated successfully.`);
          setTimeout(() => setSuccessBanner(null), 4000);
        })
        .catch((err) => {
          console.error(err);
        });
      return { success: true };
    } else {
      // Create student
      api.createStudent(studentData)
        .then(() => {
          loadPortalData();
          setSuccessBanner(`Student ${studentData.name} enrolled successfully.`);
          setTimeout(() => setSuccessBanner(null), 4000);
        })
        .catch((err) => {
          alert(err.message || 'Failed to add student');
        });
      return { success: true };
    }
  };

  const handleDeleteStudent = async (rollNo: string) => {
    try {
      await api.deleteStudent(rollNo);
      await loadPortalData();
      setSuccessBanner(`Student record (${rollNo}) deleted.`);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete student');
    }
  };

  // Attendance Operations
  const handleMarkAttendance = async (recordData: Omit<AttendanceRecord, 'id'>) => {
    try {
      await api.recordAttendance(recordData);
      await loadPortalData();
    } catch (err: any) {
      alert(err.message || 'Failed to save attendance');
    }
  };

  // Marks Operations
  const handleSaveMarks = (
    recordData: Omit<MarkRecord, 'id'>
  ): { success: boolean; error?: string } => {
    if (recordData.marksObtained < 0 || recordData.marksObtained > recordData.maxMarks) {
      return {
        success: false,
        error: `Marks must be between 0 and ${recordData.maxMarks}`
      };
    }

    api.recordMarks(recordData)
      .then(() => loadPortalData())
      .catch((err) => alert(err.message));

    return { success: true };
  };

  // Notices Operations
  const handleAddNotice = async (noticeData: Omit<Notice, 'id'>) => {
    try {
      await api.createNotice(noticeData);
      await loadPortalData();
    } catch (err: any) {
      alert(err.message || 'Failed to post notice');
    }
  };

  const handleDeleteNotice = async (id: number) => {
    try {
      await api.deleteNotice(id);
      await loadPortalData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete notice');
    }
  };

  // If not authenticated, render Login View
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
        <LoginView onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onSwitchPersona={handleSwitchPersona}
        isSyncing={isSyncing}
      />

      {/* Navigation Bar */}
      <Navigation
        role={user.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'admin-dashboard' && user.role === 'ADMIN' && (
          <AdminDashboardView
            students={students}
            attendance={attendance}
            marks={marks}
            notices={notices}
            onNavigate={setActiveTab}
            onOpenNewStudent={handleOpenAddStudent}
          />
        )}

        {activeTab === 'students' && (
          <StudentListView
            students={students}
            onAddNew={handleOpenAddStudent}
            onEdit={handleOpenEditStudent}
            onDelete={handleDeleteStudent}
            successMessage={successBanner}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            students={students}
            attendance={attendance}
            onMarkAttendance={handleMarkAttendance}
          />
        )}

        {activeTab === 'marks' && (
          <MarksView
            students={students}
            marks={marks}
            onSaveMarks={handleSaveMarks}
          />
        )}

        {activeTab === 'notices' && (
          <NoticesView
            notices={notices}
            onAddNotice={handleAddNotice}
            onDeleteNotice={handleDeleteNotice}
            isAdmin={user.role === 'ADMIN'}
          />
        )}

        {activeTab === 'student-dashboard' && (
          <StudentDashboardView
            user={user}
            students={students}
            attendance={attendance}
            marks={marks}
            notices={notices}
          />
        )}
      </main>

      {/* Student Enrollment / Edit Modal */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveStudent}
        editingStudent={editingStudent}
      />
    </div>
  );
}
