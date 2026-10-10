import { Student, AttendanceRecord, MarkRecord, Notice, UserSession } from '../types/portal';

export const api = {
  // Auth
  async login(username: string, password: string): Promise<{ success: boolean; user: UserSession }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Invalid credentials');
    }
    return res.json();
  },

  // Students
  async getStudents(search?: string, className?: string): Promise<Student[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (className && className !== 'ALL') params.append('className', className);
    const res = await fetch(`/api/students?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getStudent(rollNo: string): Promise<Student> {
    const res = await fetch(`/api/students/${encodeURIComponent(rollNo)}`);
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  },

  async createStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create student' }));
      throw new Error(err.error || 'Failed to create student');
    }
    return res.json();
  },

  async updateStudent(rollNo: string, student: Partial<Student>): Promise<Student> {
    const res = await fetch(`/api/students/${encodeURIComponent(rollNo)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update student' }));
      throw new Error(err.error || 'Failed to update student');
    }
    return res.json();
  },

  async deleteStudent(rollNo: string): Promise<void> {
    const res = await fetch(`/api/students/${encodeURIComponent(rollNo)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete student');
  },

  // Attendance
  async getAttendance(rollNo?: string, subject?: string): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams();
    if (rollNo) params.append('rollNo', rollNo);
    if (subject && subject !== 'ALL') params.append('subject', subject);
    const res = await fetch(`/api/attendance?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch attendance');
    return res.json();
  },

  async recordAttendance(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to record attendance' }));
      throw new Error(err.error || 'Failed to record attendance');
    }
    return res.json();
  },

  // Marks
  async getMarks(rollNo?: string): Promise<MarkRecord[]> {
    const params = new URLSearchParams();
    if (rollNo) params.append('rollNo', rollNo);
    const res = await fetch(`/api/marks?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch marks');
    return res.json();
  },

  async recordMarks(mark: Omit<MarkRecord, 'id'>): Promise<MarkRecord> {
    const res = await fetch('/api/marks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mark)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to record marks' }));
      throw new Error(err.error || 'Failed to record marks');
    }
    return res.json();
  },

  // Notices
  async getNotices(): Promise<Notice[]> {
    const res = await fetch('/api/notices');
    if (!res.ok) throw new Error('Failed to fetch notices');
    return res.json();
  },

  async createNotice(notice: Omit<Notice, 'id'>): Promise<Notice> {
    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notice)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create notice' }));
      throw new Error(err.error || 'Failed to create notice');
    }
    return res.json();
  },

  async deleteNotice(id: number): Promise<void> {
    const res = await fetch(`/api/notices/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete notice');
  },

  // Dashboard Stats
  async getStats(): Promise<{
    totalStudents: number;
    totalAttendanceLogs: number;
    attendanceRate: number;
    totalMarksRecorded: number;
    totalNotices: number;
  }> {
    const res = await fetch('/api/dashboard/stats');
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // Student Dashboard
  async getStudentDashboard(rollNo: string): Promise<{
    student: Student;
    attendance: AttendanceRecord[];
    attendanceRate: number;
    marks: MarkRecord[];
    notices: Notice[];
  }> {
    const res = await fetch(`/api/student/dashboard/${encodeURIComponent(rollNo)}`);
    if (!res.ok) throw new Error('Failed to fetch student dashboard');
    return res.json();
  }
};
