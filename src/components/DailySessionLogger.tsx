import { useState } from 'react';
import { Clock, CheckCircle, Calendar, Plus, Flame } from 'lucide-react';
import { StudyLogRecord } from '../types';

interface DailySessionLoggerProps {
  logs: StudyLogRecord[];
  onAddLog: (log: StudyLogRecord) => void;
  defaultTargetHours?: number;
}

export function DailySessionLogger({
  logs,
  onAddLog,
  defaultTargetHours = 9.5
}: DailySessionLoggerProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [logDate, setLogDate] = useState(todayStr);
  const [hours, setHours] = useState(defaultTargetHours);
  const [taskText, setTaskText] = useState('');
  const [reflection, setReflection] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tasks = taskText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const newRecord: StudyLogRecord = {
      date: logDate,
      completedHours: Number(hours),
      targetHours: defaultTargetHours,
      completedTasks: tasks.length > 0 ? tasks : ['Detailed revision + active recall'],
      reflection: reflection.trim() || 'Strong revision session'
    };

    onAddLog(newRecord);
    setTaskText('');
    setReflection('');
    setIsAdding(false);
  };

  const totalHoursLogged = logs.reduce((acc, curr) => acc + curr.completedHours, 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Flame className="h-4 w-4" />
            Daily Study Consistency
          </span>
          <h3 className="text-lg font-bold text-white">
            Daily Hours & Session Log
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Total Logged</span>
            <span className="text-base font-extrabold text-amber-400 font-mono">
              {totalHoursLogged.toFixed(1)} hrs
            </span>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isAdding ? 'Close' : 'Log Today'}</span>
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-amber-500/30 bg-slate-950 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hours Studied</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="18"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Hours</label>
              <div className="px-3 py-1.5 text-xs text-amber-400 font-mono rounded-lg border border-slate-700 bg-slate-800/50">
                {defaultTargetHours} Hours
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Completed Modules & Tasks (one per line)
            </label>
            <textarea
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              rows={2}
              placeholder="e.g. Sec 186 loan limits&#10;50 MCQs solved&#10;Calculator speed practice"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quick Reflection</label>
            <input
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Good focus, active recall was fast..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
            >
              Save Daily Log
            </button>
          </div>
        </form>
      )}

      {logs.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-2">
          No daily logs saved yet. Start logging your 9–11 hour daily study blocks to monitor consistency.
        </p>
      ) : (
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {logs.slice(0, 5).map((log, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-300 font-bold">{log.date}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">
                    {log.completedTasks.join(', ')}
                  </span>
                </div>
                {log.reflection && (
                  <p className="text-[11px] text-slate-500 italic">{log.reflection}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className={`font-mono font-bold ${
                  log.completedHours >= log.targetHours ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {log.completedHours}h
                </span>
                <span className="text-[10px] text-slate-500 block">/ {log.targetHours}h</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
