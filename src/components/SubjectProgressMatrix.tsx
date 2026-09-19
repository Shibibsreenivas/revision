import { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  Plus, 
  Sliders, 
  BookOpen, 
  TrendingUp, 
  Check, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { SubjectProgress, RevisionStatus, SubjectId, StudyLogRecord } from '../types';
import { SUBJECTS_MAP } from '../data/scheduleData';

interface SubjectProgressMatrixProps {
  progressList: SubjectProgress[];
  onUpdateSubject: (updated: SubjectProgress) => void;
  onOpenQuickUpdateModal: () => void;
  studyLogs: StudyLogRecord[];
  onAddStudyLog: (log: StudyLogRecord) => void;
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
}

export function SubjectProgressMatrix({
  progressList,
  onUpdateSubject,
  onOpenQuickUpdateModal,
  studyLogs,
  onAddStudyLog,
  completedTasks,
  onToggleTask
}: SubjectProgressMatrixProps) {
  const [selectedGroup, setSelectedGroup] = useState<'ALL' | 'Group III' | 'Group IV'>('ALL');
  const [editingNotesId, setEditingNotesId] = useState<SubjectId | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Daily revision quick tasks for Phase 2:
  const dailyProtocols = [
    { id: 'clc_det', sub: 'CLC', title: 'Detailed Revision (4–5 hrs)', desc: 'Provision → Conditions → Exceptions → Penalty → Case' },
    { id: 'clc_rec', sub: 'CLC', title: 'Section / Provision Recall (2 hrs)', desc: 'Active memory retrieval without looking at book' },
    { id: 'clc_mcq', sub: 'CLC', title: 'MCQs Solving (1.5 hrs)', desc: 'Solve 40-50 multiple choice questions with timing' },
    { id: 'clc_pyq', sub: 'CLC', title: 'Past Exam Questions (1–1.5 hrs)', desc: 'Analyze past 5 terms questions and ICAI pattern' },
    { id: 'clc_rap', sub: 'CLC', title: 'Rapid Recall (30 mins)', desc: 'Quick 30 min flashcard style section number check' },

    { id: 'sfm_con', sub: 'SFM', title: 'SFM Concept Revision (2 hrs)', desc: 'Formulae & standard problem patterns' },
    { id: 'sfm_prb', sub: 'SFM', title: 'SFM Problem Solving (4 hrs)', desc: 'Handwritten calculations — reading is not revision!' },
    { id: 'sfm_pyq', sub: 'SFM', title: 'SFM PYQs / MCQs (2 hrs)', desc: 'Past questions and calculator speed practice' },
    { id: 'sfm_for', sub: 'SFM', title: 'SFM Formula Notebook (1 hr)', desc: 'Formula derivation and mistake book entry' },

    { id: 'dt_mrn', sub: 'DT', title: 'DT Morning Provisions (3–4 hrs)', desc: 'Income tax concepts, rates, conditions, exemptions' },
    { id: 'dt_aft', sub: 'DT', title: 'DT Practical Computations (3 hrs)', desc: 'Total income computation & capital gains problems' },
    { id: 'dt_eve', sub: 'DT', title: 'DT International Tax (2 hrs)', desc: 'Transfer pricing, DTAA, Equalisation levy' },
    { id: 'dt_mst', sub: 'DT', title: 'DT Mistake Book (1 hr)', desc: 'Record every wrong question in DT mistake log' },

    { id: 'scm_con', sub: 'SCM', title: 'SCM Concepts & Models (3 hrs)', desc: 'Cost management philosophies & value chain' },
    { id: 'scm_prb', sub: 'SCM', title: 'SCM Problems & Numerical (3 hrs)', desc: 'Standard costing, transfer pricing & variance analysis' },
    { id: 'scm_pyq', sub: 'SCM', title: 'SCM PYQs & RTPs (2 hrs)', desc: 'Case study format questions' }
  ];

  const handleStatusChange = (subject: SubjectProgress, newStatus: RevisionStatus) => {
    onUpdateSubject({
      ...subject,
      status: newStatus,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleQuickAddHour = (subject: SubjectProgress, deltaHours: number) => {
    onUpdateSubject({
      ...subject,
      hoursCompleted: subject.hoursCompleted + deltaHours,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleSaveNotes = (subject: SubjectProgress) => {
    onUpdateSubject({
      ...subject,
      notes: tempNotes.trim(),
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setEditingNotesId(null);
  };

  const filteredList = progressList.filter((p) => {
    const meta = SUBJECTS_MAP[p.subjectId];
    if (selectedGroup === 'ALL') return true;
    return meta?.group === selectedGroup;
  });

  const totalCompletedHours = progressList.reduce((acc, p) => acc + p.hoursCompleted, 0);
  const totalTargetHours = progressList.reduce((acc, p) => acc + p.targetHours, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Group Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sliders className="h-4 w-4" />
            Live Revision Tracker
          </span>
          <h2 className="text-xl font-extrabold text-white">
            Subject Progress & Hourly Commitment Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any status or use &ldquo;+1h / +2h&rdquo; buttons to update your progress instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-semibold">
            {(['ALL', 'Group III', 'Group IV'] as const).map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedGroup === grp
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenQuickUpdateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Open Full Update Panel</span>
          </button>
        </div>
      </div>

      {/* 8-Subject Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredList.map((p) => {
          const meta = SUBJECTS_MAP[p.subjectId];
          const pct = Math.min(100, Math.round((p.hoursCompleted / p.targetHours) * 100));

          return (
            <div
              key={p.subjectId}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3.5 hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
                    {p.subjectId}
                  </span>
                  <span className="text-[11px] text-slate-400">{meta?.group}</span>
                </div>

                {/* Status selector */}
                <select
                  value={p.status}
                  onChange={(e) => handleStatusChange(p, e.target.value as RevisionStatus)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-bold cursor-pointer border ${
                    p.status === 'Exam Ready'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                      : p.status === 'Phase 2 Done' || p.status === 'Phase 3 Done'
                      ? 'bg-blue-950/80 border-blue-500/40 text-blue-300'
                      : p.status === 'In Progress'
                      ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Phase 2 Done">Phase 2 Done</option>
                  <option value="Phase 3 Done">Phase 3 Done</option>
                  <option value="Exam Ready">Exam Ready 🔥</option>
                </select>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{p.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{meta?.tagline}</p>
              </div>

              {/* Progress bar and hours */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono">
                  <span className="text-slate-300 font-bold">{p.hoursCompleted} / {p.targetHours} hrs</span>
                  <span className="text-amber-400 font-bold">{pct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct >= 80 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>

              {/* Confidence badge */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-bold text-slate-200">{p.confidencePercent}%</span>
              </div>

              {/* Quick +Hours Buttons */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-bold mr-1">Log:</span>
                <button
                  onClick={() => handleQuickAddHour(p, 1)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 cursor-pointer"
                  title="Add 1 Hour"
                >
                  +1h
                </button>
                <button
                  onClick={() => handleQuickAddHour(p, 2)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 cursor-pointer"
                  title="Add 2 Hours"
                >
                  +2h
                </button>
                <button
                  onClick={() => handleQuickAddHour(p, 4)}
                  className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold cursor-pointer"
                  title="Add 4 Hours"
                >
                  +4h
                </button>
              </div>

              {/* Notes / Last revised */}
              <div className="pt-1 text-[11px] text-slate-400 border-t border-slate-800/80">
                {editingNotesId === p.subjectId ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      className="w-full rounded bg-slate-800 border border-slate-700 px-2 py-1 text-xs text-white"
                      placeholder="Add topic note..."
                    />
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="text-[10px] text-slate-400 px-2 py-0.5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(p)}
                        className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      setEditingNotesId(p.subjectId);
                      setTempNotes(p.notes);
                    }}
                    className="truncate hover:text-slate-200 cursor-pointer italic"
                    title="Click to edit notes"
                  >
                    &ldquo;{p.notes || 'Click to add revision notes...'}&rdquo;
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DAILY HOURLY PROTOCOLS & INTERACTIVE CHECKLIST */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Phase 2 Daily Revision Protocols (Check Off Daily Progress)
            </h3>
            <p className="text-xs text-slate-400">
              Check off tasks as you complete your hourly revision sessions today.
            </p>
          </div>
          <div className="text-xs text-amber-400 font-mono font-semibold">
            {Object.values(completedTasks).filter(Boolean).length} / {dailyProtocols.length} Completed
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dailyProtocols.map((task) => {
            const isDone = Boolean(completedTasks[task.id]);
            return (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                  isDone
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-slate-300'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-600'
                  }`}
                >
                  {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 font-mono">
                      {task.sub}
                    </span>
                    <h5 className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </h5>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{task.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
