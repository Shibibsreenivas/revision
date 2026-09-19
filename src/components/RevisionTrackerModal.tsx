import { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Save, 
  Clock, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  AlertCircle,
  Plus,
  Sliders
} from 'lucide-react';
import { SubjectProgress, RevisionStatus, SubjectId } from '../types';

interface RevisionTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressList: SubjectProgress[];
  onUpdateSubjectProgress: (updated: SubjectProgress) => void;
  onLogStudyHours: (subjectId: SubjectId, hours: number, taskDescription: string) => void;
}

export function RevisionTrackerModal({
  isOpen,
  onClose,
  progressList,
  onUpdateSubjectProgress,
  onLogStudyHours
}: RevisionTrackerModalProps) {
  if (!isOpen) return null;

  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('CLC');
  const activeSubject = progressList.find((p) => p.subjectId === selectedSubjectId) || progressList[0];

  const [status, setStatus] = useState<RevisionStatus>(activeSubject.status);
  const [hours, setHours] = useState<number>(activeSubject.hoursCompleted);
  const [targetHours, setTargetHours] = useState<number>(activeSubject.targetHours);
  const [confidence, setConfidence] = useState<number>(activeSubject.confidencePercent);
  const [notes, setNotes] = useState<string>(activeSubject.notes);

  // Quick log hours form
  const [quickHours, setQuickHours] = useState<number>(2);
  const [quickTask, setQuickTask] = useState<string>('Detailed revision + problem practice');
  const [showQuickLogSuccess, setShowQuickLogSuccess] = useState(false);

  // Whenever selected subject changes, sync local form
  const handleSelectSubject = (id: SubjectId) => {
    setSelectedSubjectId(id);
    const sub = progressList.find((p) => p.subjectId === id);
    if (sub) {
      setStatus(sub.status);
      setHours(sub.hoursCompleted);
      setTargetHours(sub.targetHours);
      setConfidence(sub.confidencePercent);
      setNotes(sub.notes);
    }
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SubjectProgress = {
      ...activeSubject,
      status,
      hoursCompleted: Number(hours),
      targetHours: Number(targetHours),
      confidencePercent: Number(confidence),
      notes: notes.trim(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onUpdateSubjectProgress(updated);
    onClose();
  };

  const handleApplyQuickHours = (addedHours: number) => {
    const newTotal = hours + addedHours;
    setHours(newTotal);
    const updated: SubjectProgress = {
      ...activeSubject,
      hoursCompleted: newTotal,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onUpdateSubjectProgress(updated);
    onLogStudyHours(selectedSubjectId, addedHours, quickTask);
    setShowQuickLogSuccess(true);
    setTimeout(() => setShowQuickLogSuccess(false), 2000);
  };

  const statusOptions: RevisionStatus[] = [
    'Not Started',
    'In Progress',
    'Phase 2 Done',
    'Phase 3 Done',
    'Exam Ready'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Track & Update Revision Progress</h3>
              <p className="text-xs text-slate-400">Update your hours, status, and confidence levels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subject Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Subject to Update:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {progressList.map((p) => {
              const isSelected = p.subjectId === selectedSubjectId;
              return (
                <button
                  key={p.subjectId}
                  type="button"
                  onClick={() => handleSelectSubject(p.subjectId)}
                  className={`flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-white ring-1 ring-amber-500/40'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold text-xs">{p.subjectId}</span>
                  <span className="text-[11px] truncate">{p.name}</span>
                  <span className="text-[10px] text-amber-400/90 font-mono mt-1">
                    {p.hoursCompleted}h / {p.targetHours}h
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Log Action Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Quick Log Hours for {activeSubject.name}
            </span>
            {showQuickLogSuccess && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Hours logged & saved!
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyQuickHours(1)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
            >
              +1 Hour
            </button>
            <button
              type="button"
              onClick={() => handleApplyQuickHours(2)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
            >
              +2 Hours
            </button>
            <button
              type="button"
              onClick={() => handleApplyQuickHours(4)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 cursor-pointer"
            >
              +4 Hours (Detailed Block)
            </button>
            <button
              type="button"
              onClick={() => handleApplyQuickHours(9)}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-xs font-bold text-blue-300 cursor-pointer"
            >
              +9 Hours (Full Day)
            </button>
          </div>
        </div>

        {/* Form Details */}
        <form onSubmit={handleSaveProgress} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Revision Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RevisionStatus)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Total Hours Completed
              </label>
              <input
                type="number"
                min="0"
                max="200"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Hours
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Confidence Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Exam Readiness & Confidence: <span className="text-amber-400 font-bold">{confidence}%</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {confidence >= 80 ? '🔥 Exam Ready' : confidence >= 60 ? '⚡ Strong' : '📖 In Progress'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Notes & Topics */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Chapters Revised / Key Reminders
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Completed Directors chapter; Formula revision done for Portfolio."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-slate-950 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save & Update Tracker</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
