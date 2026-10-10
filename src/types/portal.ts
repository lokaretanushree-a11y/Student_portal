export interface Student {
  id: number;
  rollNo: string;
  name: string;
  className: string;
  email: string;
}

export interface AttendanceRecord {
  id: number;
  rollNo: string;
  studentName: string;
  subject: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface MarkRecord {
  id: number;
  rollNo: string;
  studentName: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
}

export interface Notice {
  id: number;
  title: string;
  message: string;
  date: string;
  postedBy: string;
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
}

export interface UserSession {
  username: string;
  name: string;
  role: 'ADMIN' | 'STUDENT';
  rollNo?: string;
}
