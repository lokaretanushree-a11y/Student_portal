import React from 'react';
import { Student, AttendanceRecord, MarkRecord, Notice, UserSession } from '../../types/portal';
import { 
  User, 
  CalendarCheck, 
  GraduationCap, 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Mail, 
  Award 
} from 'lucide-react';

interface StudentDashboardViewProps {
  user: UserSession;
  students: Student[];
  attendance: AttendanceRecord[];
  marks: MarkRecord[];
  notices: Notice[];
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  user,
  students,
  attendance,
  marks,
  notices
}) => {
  // Find current student record (defaults to first student if not matched)
  const currentStudent = students.find((s) => s.rollNo === user.rollNo) || students[0];

  const studentAttendance = attendance.filter((a) => a.rollNo === currentStudent?.rollNo);
  const studentMarks = marks.filter((m) => m.rollNo === currentStudent?.rollNo);

  const presentCount = studentAttendance.filter((a) => a.status === 'PRESENT').length;
  const attendancePercentage = studentAttendance.length > 0 
    ? Math.round((presentCount / studentAttendance.length) * 100) 
    : 100;

  const isLowAttendance = attendancePercentage < 75;

  const calculateGpa = () => {
    if (studentMarks.length === 0) return '0.00';
    const totalPercentage = studentMarks.reduce((acc, m) => acc + (m.marksObtained / m.maxMarks) * 100, 0) / studentMarks.length;
    return (totalPercentage / 10).toFixed(2); // 10-point scale
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-200 text-2xl font-bold">
              {currentStudent?.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded font-mono">
                  {currentStudent?.rollNo}
                </span>
                <span className="text-xs text-slate-300">· {currentStudent?.className}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                {currentStudent?.name}
              </h1>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{currentStudent?.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Cumulative GPA</span>
              <span className="text-xl font-bold text-white font-mono">{calculateGpa()} / 10.0</span>
            </div>
            <Award className="w-8 h-8 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Attendance Compliance Meter */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Attendance Compliance Status</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Minimum 75% required by university regulations to sit for semester examinations.
            </p>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-extrabold ${isLowAttendance ? 'text-rose-600' : 'text-emerald-600'}`}>
              {attendancePercentage}%
            </span>
            <span className="text-xs text-slate-500">
              ({presentCount} of {studentAttendance.length} classes attended)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isLowAttendance ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
          />
        </div>

        {isLowAttendance ? (
          <div className="mt-4 flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Attendance Warning:</strong> Your attendance is below the required 75% threshold. Please consult your faculty mentor immediately.
            </span>
          </div>
        ) : (
          <div className="mt-4 flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>You meet the mandatory 75% attendance criteria. Keep up the good work!</span>
          </div>
        )}
      </div>

      {/* Grid: Course Marks & Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Marks */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Semester Course Performance</h3>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
              {studentMarks.length} Evaluated
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {studentMarks.length > 0 ? (
              studentMarks.map((m) => {
                const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
                return (
                  <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{m.subject}</h4>
                      <span className="text-xs text-slate-500">Max Score: {m.maxMarks}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-slate-900 font-mono">
                        {m.marksObtained}
                      </span>
                      <span className="text-xs text-slate-500 block">
                        {pct >= 90 ? 'Grade A+' : pct >= 80 ? 'Grade A' : pct >= 70 ? 'Grade B' : pct >= 60 ? 'Grade C' : 'Grade D'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No marks published yet for your registered roll number.
              </div>
            )}
          </div>
        </div>

        {/* Notices for Student */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900">Campus Announcements</h3>
            </div>
            <span className="text-xs text-slate-400">{notices.length} active</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {notices.map((n) => (
              <div key={n.id} className="p-4 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-slate-900">{n.title}</h4>
                  <span className="text-xs text-slate-400">{n.date}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {n.message}
                </p>
                <span className="inline-block mt-2 text-xs text-slate-400">
                  By {n.postedBy}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
