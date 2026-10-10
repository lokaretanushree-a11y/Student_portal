import React, { useState } from 'react';
import { Student, MarkRecord } from '../../types/portal';
import { AVAILABLE_SUBJECTS } from '../../data/mockData';
import { GraduationCap, Award, CheckCircle2, AlertCircle, Save } from 'lucide-react';

interface MarksViewProps {
  students: Student[];
  marks: MarkRecord[];
  onSaveMarks: (record: Omit<MarkRecord, 'id'>) => { success: boolean; error?: string };
}

export const MarksView: React.FC<MarksViewProps> = ({
  students,
  marks,
  onSaveMarks
}) => {
  const [selectedRoll, setSelectedRoll] = useState(students[0]?.rollNo || '');
  const [selectedSubject, setSelectedSubject] = useState(AVAILABLE_SUBJECTS[0]);
  const [marksObtained, setMarksObtained] = useState<string>('85');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getGrade = (score: number) => {
    if (score >= 90) return { letter: 'A+', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { letter: 'A', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 70) return { letter: 'B', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' };
    if (score >= 60) return { letter: 'C', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (score >= 50) return { letter: 'D', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { letter: 'F', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const score = parseFloat(marksObtained);
    if (isNaN(score) || score < 0 || score > 100) {
      setError('Marks must be between 0 and 100.');
      return;
    }

    const student = students.find((s) => s.rollNo === selectedRoll);
    if (!student) {
      setError('Selected student not found.');
      return;
    }

    const res = onSaveMarks({
      rollNo: selectedRoll,
      studentName: student.name,
      subject: selectedSubject,
      marksObtained: score,
      maxMarks: 100
    });

    if (res.success) {
      setSuccess(`Marks recorded for ${student.name} in ${selectedSubject}!`);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(res.error || 'Failed to save marks.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Marks & Evaluations</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Enter examination marks and generate report grades
        </p>
      </div>

      {success && (
        <div className="flex items-center space-x-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marks Entry Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Record Test Score</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Student (rollNo)
              </label>
              <select
                name="rollNo"
                value={selectedRoll}
                onChange={(e) => setSelectedRoll(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {students.map((s) => (
                  <option key={s.rollNo} value={s.rollNo}>
                    {s.name} ({s.rollNo}) - {s.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Course Subject (subject)
              </label>
              <select
                name="subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {AVAILABLE_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Marks Obtained (out of 100)
              </label>
              <input
                type="number"
                name="marksObtained"
                min="0"
                max="100"
                step="0.5"
                value={marksObtained}
                onChange={(e) => setMarksObtained(e.target.value)}
                placeholder="e.g. 87.5"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Must be an integer or decimal between 0.00 and 100.00</p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-xs mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Marks Record</span>
            </button>
          </form>
        </div>

        {/* Marks Scorecard Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Student Grade Ledger</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
              {marks.length} Records
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 text-center">Score / Max</th>
                  <th className="py-3 px-4 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marks.length > 0 ? (
                  marks.map((m) => {
                    const grade = getGrade(m.marksObtained);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {m.studentName}
                          <span className="block text-xs text-slate-400 font-mono">{m.rollNo}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{m.subject}</td>
                        <td className="py-3 px-4 text-center font-mono font-medium">
                          {m.marksObtained} / {m.maxMarks}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${grade.color}`}>
                            {grade.letter}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No marks recorded yet. Use the form on the left to enter scores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
