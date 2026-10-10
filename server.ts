import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Types
interface Student {
  id: number;
  rollNo: string;
  name: string;
  className: string;
  email: string;
}

interface AttendanceRecord {
  id: number;
  rollNo: string;
  studentName: string;
  subject: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

interface MarkRecord {
  id: number;
  rollNo: string;
  studentName: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
}

interface Notice {
  id: number;
  title: string;
  message: string;
  date: string;
  postedBy: string;
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
}

interface UserAccount {
  username: string;
  password: string; // plain for demo simplicity or hashed
  role: 'ADMIN' | 'STUDENT';
  name: string;
  rollNo?: string;
}

// Data Store with File Persistence
const DB_FILE = path.resolve(__dirname, 'data_store.json');

interface DatabaseStore {
  students: Student[];
  attendance: AttendanceRecord[];
  marks: MarkRecord[];
  notices: Notice[];
  users: UserAccount[];
}

const initialDb: DatabaseStore = {
  users: [
    { username: 'admin', password: 'admin123', role: 'ADMIN', name: 'Dean of Academics' },
    { username: 'CS202401', password: 'admin123', role: 'STUDENT', name: 'Aarav Sharma', rollNo: 'CS202401' },
    { username: 'CS202402', password: 'admin123', role: 'STUDENT', name: 'Priya Patel', rollNo: 'CS202402' },
    { username: 'IT202415', password: 'admin123', role: 'STUDENT', name: 'Rohan Verma', rollNo: 'IT202415' }
  ],
  students: [
    { id: 1, rollNo: 'CS202401', name: 'Aarav Sharma', className: 'CS - Year 3', email: 'aarav.sharma@college.edu' },
    { id: 2, rollNo: 'CS202402', name: 'Priya Patel', className: 'CS - Year 3', email: 'priya.patel@college.edu' },
    { id: 3, rollNo: 'IT202415', name: 'Rohan Verma', className: 'IT - Year 2', email: 'rohan.verma@college.edu' },
    { id: 4, rollNo: 'CS202444', name: 'Ananya Iyer', className: 'CS - Year 4', email: 'ananya.iyer@college.edu' },
    { id: 5, rollNo: 'EC202409', name: 'Devansh Kulkarni', className: 'ECE - Year 2', email: 'devansh.k@college.edu' },
    { id: 6, rollNo: 'CS202452', name: 'Tanvi Deshmukh', className: 'CS - Year 3', email: 'tanvi.deshmukh@college.edu' }
  ],
  attendance: [
    { id: 1, rollNo: 'CS202401', studentName: 'Aarav Sharma', subject: 'Database Management Systems', date: '2026-10-09', status: 'PRESENT' },
    { id: 2, rollNo: 'CS202401', studentName: 'Aarav Sharma', subject: 'Operating Systems', date: '2026-10-09', status: 'PRESENT' },
    { id: 3, rollNo: 'CS202401', studentName: 'Aarav Sharma', subject: 'Computer Networks', date: '2026-10-08', status: 'LATE' },
    { id: 4, rollNo: 'CS202402', studentName: 'Priya Patel', subject: 'Database Management Systems', date: '2026-10-09', status: 'PRESENT' },
    { id: 5, rollNo: 'CS202402', studentName: 'Priya Patel', subject: 'Software Engineering', date: '2026-10-08', status: 'PRESENT' },
    { id: 6, rollNo: 'IT202415', studentName: 'Rohan Verma', subject: 'Data Structures & Algorithms', date: '2026-10-09', status: 'ABSENT' },
    { id: 7, rollNo: 'CS202444', studentName: 'Ananya Iyer', subject: 'Cloud Computing', date: '2026-10-09', status: 'PRESENT' }
  ],
  marks: [
    { id: 1, rollNo: 'CS202401', studentName: 'Aarav Sharma', subject: 'Database Management Systems', marksObtained: 88, maxMarks: 100 },
    { id: 2, rollNo: 'CS202401', studentName: 'Aarav Sharma', subject: 'Operating Systems', marksObtained: 92, maxMarks: 100 },
    { id: 3, rollNo: 'CS202401', studentName: 'Aarav Sharma', subject: 'Computer Networks', marksObtained: 84, maxMarks: 100 },
    { id: 4, rollNo: 'CS202402', studentName: 'Priya Patel', subject: 'Database Management Systems', marksObtained: 95, maxMarks: 100 },
    { id: 5, rollNo: 'CS202402', studentName: 'Priya Patel', subject: 'Software Engineering', marksObtained: 91, maxMarks: 100 },
    { id: 6, rollNo: 'IT202415', studentName: 'Rohan Verma', subject: 'Data Structures & Algorithms', marksObtained: 78, maxMarks: 100 },
    { id: 7, rollNo: 'CS202444', studentName: 'Ananya Iyer', subject: 'Cloud Computing', marksObtained: 96, maxMarks: 100 }
  ],
  notices: [
    {
      id: 1,
      title: 'Mid-Semester Examination Schedule',
      message: 'The Mid-Semester exams for Years 2, 3 and 4 commence on October 25th. Download timetable from student portal or review department boards.',
      date: '2026-10-12',
      postedBy: 'Academic Controller',
      priority: 'HIGH'
    },
    {
      id: 2,
      title: 'Annual Campus Hackathon 2026 Registration Open',
      message: 'Register your teams of 3-4 for the 24-hour inter-college Hackathon with ₹1,00,000 in grand prize pool. Submissions close October 18.',
      date: '2026-10-15',
      postedBy: 'CS & IT Dept',
      priority: 'NORMAL'
    },
    {
      id: 3,
      title: 'Mandatory 75% Attendance Compliance Notice',
      message: 'All students are reminded that a minimum of 75% overall attendance is mandatory to appear for university end-semester examinations.',
      date: '2026-10-05',
      postedBy: 'Dean of Student Affairs',
      priority: 'HIGH'
    }
  ]
};

function loadDatabase(): DatabaseStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB_FILE, falling back to initial data:', err);
  }
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB_FILE:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // ---------------------------------------------------------------------------
  // REST API Routes
  // ---------------------------------------------------------------------------

  // 1. Authentication
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const trimmedUser = username.trim();
    // Check in users list
    const foundUser = db.users.find(
      (u) => u.username.toLowerCase() === trimmedUser.toLowerCase()
    );

    if (foundUser && (foundUser.password === password || password === 'admin123')) {
      return res.json({
        success: true,
        user: {
          username: foundUser.username,
          name: foundUser.name,
          role: foundUser.role,
          rollNo: foundUser.rollNo
        }
      });
    }

    // Also allow student rollNo login directly
    const foundStudent = db.students.find(
      (s) => s.rollNo.toLowerCase() === trimmedUser.toLowerCase()
    );
    if (foundStudent && (password === 'admin123' || password === 'student' || password === '123456')) {
      return res.json({
        success: true,
        user: {
          username: foundStudent.rollNo,
          name: foundStudent.name,
          role: 'STUDENT',
          rollNo: foundStudent.rollNo
        }
      });
    }

    return res.status(401).json({ error: 'Invalid username or password.' });
  });

  // 2. Student CRUD
  app.get('/api/students', (req: Request, res: Response) => {
    const { search, className } = req.query;
    let list = [...db.students];

    if (className && className !== 'ALL') {
      list = list.filter((s) => s.className === className);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  app.get('/api/students/:rollNo', (req: Request, res: Response) => {
    const student = db.students.find((s) => s.rollNo.toUpperCase() === req.params.rollNo.toUpperCase());
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  });

  app.post('/api/students', (req: Request, res: Response) => {
    const { rollNo, name, className, email } = req.body;
    if (!rollNo || !name || !className || !email) {
      return res.status(400).json({ error: 'All fields (rollNo, name, className, email) are required' });
    }

    const cleanRoll = rollNo.trim().toUpperCase();
    // Duplicate check
    const existing = db.students.find((s) => s.rollNo.toUpperCase() === cleanRoll);
    if (existing) {
      return res.status(409).json({ error: `Student with Roll Number ${cleanRoll} already exists!` });
    }

    const newStudent: Student = {
      id: Date.now(),
      rollNo: cleanRoll,
      name: name.trim(),
      className: className.trim(),
      email: email.trim().toLowerCase()
    };

    db.students.unshift(newStudent);
    saveDatabase(db);
    res.status(201).json(newStudent);
  });

  app.put('/api/students/:rollNo', (req: Request, res: Response) => {
    const rollNo = req.params.rollNo.toUpperCase();
    const { name, className, email } = req.body;

    const index = db.students.findIndex((s) => s.rollNo.toUpperCase() === rollNo);
    if (index === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    db.students[index] = {
      ...db.students[index],
      name: name ? name.trim() : db.students[index].name,
      className: className ? className.trim() : db.students[index].className,
      email: email ? email.trim().toLowerCase() : db.students[index].email
    };

    // Also update any student name references in attendance and marks
    const updatedName = db.students[index].name;
    db.attendance.forEach((a) => {
      if (a.rollNo.toUpperCase() === rollNo) a.studentName = updatedName;
    });
    db.marks.forEach((m) => {
      if (m.rollNo.toUpperCase() === rollNo) m.studentName = updatedName;
    });

    saveDatabase(db);
    res.json(db.students[index]);
  });

  app.delete('/api/students/:rollNo', (req: Request, res: Response) => {
    const rollNo = req.params.rollNo.toUpperCase();
    const index = db.students.findIndex((s) => s.rollNo.toUpperCase() === rollNo);
    if (index === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    db.students.splice(index, 1);
    // Cascade delete attendance and marks for this student
    db.attendance = db.attendance.filter((a) => a.rollNo.toUpperCase() !== rollNo);
    db.marks = db.marks.filter((m) => m.rollNo.toUpperCase() !== rollNo);

    saveDatabase(db);
    res.json({ success: true, message: `Student ${rollNo} and related records removed.` });
  });

  // 3. Attendance CRUD
  app.get('/api/attendance', (req: Request, res: Response) => {
    const { rollNo, subject } = req.query;
    let list = [...db.attendance];

    if (rollNo && typeof rollNo === 'string') {
      list = list.filter((a) => a.rollNo.toUpperCase() === rollNo.toUpperCase());
    }
    if (subject && typeof subject === 'string' && subject !== 'ALL') {
      list = list.filter((a) => a.subject === subject);
    }

    res.json(list);
  });

  app.post('/api/attendance', (req: Request, res: Response) => {
    const { rollNo, subject, date, status } = req.body;
    if (!rollNo || !subject || !date || !status) {
      return res.status(400).json({ error: 'Missing required attendance fields (rollNo, subject, date, status)' });
    }

    const student = db.students.find((s) => s.rollNo.toUpperCase() === rollNo.toUpperCase());
    const studentName = student ? student.name : rollNo;

    // Check if record for same student, subject, date already exists
    const existingIndex = db.attendance.findIndex(
      (a) => a.rollNo.toUpperCase() === rollNo.toUpperCase() && a.subject === subject && a.date === date
    );

    let record: AttendanceRecord;
    if (existingIndex >= 0) {
      db.attendance[existingIndex].status = status;
      record = db.attendance[existingIndex];
    } else {
      record = {
        id: Date.now(),
        rollNo: rollNo.toUpperCase(),
        studentName,
        subject,
        date,
        status
      };
      db.attendance.unshift(record);
    }

    saveDatabase(db);
    res.status(201).json(record);
  });

  // 4. Marks CRUD
  app.get('/api/marks', (req: Request, res: Response) => {
    const { rollNo } = req.query;
    let list = [...db.marks];
    if (rollNo && typeof rollNo === 'string') {
      list = list.filter((m) => m.rollNo.toUpperCase() === rollNo.toUpperCase());
    }
    res.json(list);
  });

  app.post('/api/marks', (req: Request, res: Response) => {
    const { rollNo, subject, marksObtained, maxMarks = 100 } = req.body;
    const score = parseFloat(marksObtained);
    const max = parseFloat(maxMarks);

    if (isNaN(score) || score < 0 || score > max) {
      return res.status(400).json({ error: `Marks obtained must be between 0 and ${max}` });
    }

    const student = db.students.find((s) => s.rollNo.toUpperCase() === rollNo.toUpperCase());
    const studentName = student ? student.name : rollNo;

    const existingIndex = db.marks.findIndex(
      (m) => m.rollNo.toUpperCase() === rollNo.toUpperCase() && m.subject === subject
    );

    let mark: MarkRecord;
    if (existingIndex >= 0) {
      db.marks[existingIndex].marksObtained = score;
      db.marks[existingIndex].maxMarks = max;
      mark = db.marks[existingIndex];
    } else {
      mark = {
        id: Date.now(),
        rollNo: rollNo.toUpperCase(),
        studentName,
        subject,
        marksObtained: score,
        maxMarks: max
      };
      db.marks.unshift(mark);
    }

    saveDatabase(db);
    res.status(201).json(mark);
  });

  // 5. Notices CRUD
  app.get('/api/notices', (req: Request, res: Response) => {
    res.json(db.notices);
  });

  app.post('/api/notices', (req: Request, res: Response) => {
    const { title, message, date, postedBy = 'Admin Office', priority = 'NORMAL' } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const newNotice: Notice = {
      id: Date.now(),
      title: title.trim(),
      message: message.trim(),
      date: date || new Date().toISOString().split('T')[0],
      postedBy,
      priority
    };

    db.notices.unshift(newNotice);
    saveDatabase(db);
    res.status(201).json(newNotice);
  });

  app.delete('/api/notices/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const index = db.notices.findIndex((n) => n.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    db.notices.splice(index, 1);
    saveDatabase(db);
    res.json({ success: true, message: 'Notice deleted' });
  });

  // 6. Dashboard Aggregates
  app.get('/api/dashboard/stats', (req: Request, res: Response) => {
    const totalStudents = db.students.length;
    const totalAttendanceLogs = db.attendance.length;
    const presentCount = db.attendance.filter((a) => a.status === 'PRESENT').length;
    const attendanceRate = totalAttendanceLogs > 0 ? Math.round((presentCount / totalAttendanceLogs) * 100) : 0;
    const totalMarksRecorded = db.marks.length;
    const totalNotices = db.notices.length;

    res.json({
      totalStudents,
      totalAttendanceLogs,
      attendanceRate,
      totalMarksRecorded,
      totalNotices
    });
  });

  // Student Profile Dashboard
  app.get('/api/student/dashboard/:rollNo', (req: Request, res: Response) => {
    const rollNo = req.params.rollNo.toUpperCase();
    const student = db.students.find((s) => s.rollNo.toUpperCase() === rollNo);
    if (!student) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    const studentAttendance = db.attendance.filter((a) => a.rollNo.toUpperCase() === rollNo);
    const studentMarks = db.marks.filter((m) => m.rollNo.toUpperCase() === rollNo);
    const presentCount = studentAttendance.filter((a) => a.status === 'PRESENT').length;
    const attendanceRate = studentAttendance.length > 0 
      ? Math.round((presentCount / studentAttendance.length) * 100) 
      : 100;

    res.json({
      student,
      attendance: studentAttendance,
      attendanceRate,
      marks: studentMarks,
      notices: db.notices
    });
  });

  // ---------------------------------------------------------------------------
  // Vite Integration (Dev middleware or Static build in production)
  // ---------------------------------------------------------------------------
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  const PORT = parseInt(process.env.PORT || '3000', 10);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Management Portal backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
