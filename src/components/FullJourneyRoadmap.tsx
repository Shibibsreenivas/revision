import { useState } from 'react';
import { 
  PHASES, 
  PHASE_2_SUBJECT_SCHEDULE,
  PHASE_3_SCHEDULE, 
  PHASE_4_ROTATION, 
  PHASE_5_FINAL_10_DAYS, 
  EXAM_MODE_DIRECTIVE,
  SUBJECTS_MAP 
} from '../data/scheduleData';
import { SubjectId } from '../types';
import { Flame, CheckCircle, Calendar, Clock, Sparkles, BookOpen, ShieldAlert, ArrowRight } from 'lucide-react';

interface FullJourneyRoadmapProps {
  activePhaseId: number;
  onSelectPhase: (phaseId: number) => void;
  onJumpToPhase2: () => void;
}

export function FullJourneyRoadmap({
  activePhaseId,
  onSelectPhase,
  onJumpToPhase2
}: FullJourneyRoadmapProps) {
  const currentPhase = PHASES.find((p) => p.id === activePhaseId) || PHASES[0];

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              The 81-Day Master Revision Path
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              Starting Tomorrow (Sept 20) to December 10 Exam Mode
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              A scientifically phased 4-cycle revision roadmap moving from deep understanding to compression, exam-readiness, and rapid recall.
            </p>
          </div>
          <button
            onClick={onJumpToPhase2}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 cursor-pointer self-start"
          >
            <BookOpen className="h-4 w-4" />
            <span>View First Revision Daily Protocols</span>
          </button>
        </div>

        {/* 5-Phase Milestone Chain */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PHASES.map((p) => {
            const isSelected = p.id === activePhaseId;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPhase(p.id)}
                className={`relative rounded-xl border p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500/70 bg-slate-850 ring-1 ring-amber-500/30'
                    : 'border-slate-800/80 bg-slate-950/60 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-400">Phase {p.id}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{p.daysCount}d</span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{p.name.replace(/Phase \d+: /, '')}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-1">{p.subTitle.split(' (')[0]}</p>
                <div className="mt-3">
                  <span className="inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {p.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep views for Phase 1 */}
      {activePhaseId === 1 && (
        <div className="rounded-2xl border border-blue-500/30 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                September 20 – October 18 (29 Days) — Starts Tomorrow
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                Phase 1: First Revision — Deep Understanding & Core Mastery
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Your most important revision starting tomorrow. Understanding + Rebuilding Group III in depth.
              </p>
            </div>
            <button
              onClick={onJumpToPhase2}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer self-start"
            >
              <span>Open Hourly Breakdown</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PHASE_2_SUBJECT_SCHEDULE.map((s, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-400">{s.dateRange}</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-bold text-slate-300 text-[11px]">
                    {s.days} {s.days === 1 ? 'Day' : 'Days'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">{s.title}</h4>
                <p className="text-xs text-amber-300/90 font-medium">Daily: {s.dailyHours}</p>
                <p className="text-xs text-slate-400 leading-relaxed italic border-t border-slate-800/80 pt-2">
                  &ldquo;{s.goldenRule}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep views for Phase 2 */}
      {activePhaseId === 2 && (
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              October 19 – November 9 (22 Days)
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Phase 2: Second Revision — Compression + Speed
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              &ldquo;Now revision accelerates. High-speed problem drilling across Group III and Group IV subjects.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PHASE_3_SCHEDULE.map((item, idx) => {
              return (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-emerald-400 font-bold">{item.dates}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-bold text-slate-300 text-[11px]">
                      {item.days} {item.days === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.focus}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Deep views for Phase 3 */}
      {activePhaseId === 3 && (
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              November 10 – November 29 (20 Days)
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Phase 3: Third Revision — Exam-Ready Mode
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              &ldquo;This is where you start becoming exam-ready. Rely on short notes, formula book, mistake book & simulated PYQs.&rdquo;
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md font-medium">Use Short Notes</span>
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md font-medium">Formula Book</span>
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md font-medium">Section Book</span>
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md font-medium">Mistake Book</span>
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md font-medium">PYQs & RTPs</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {PHASE_4_ROTATION.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold">{item.dates}</td>
                    <td className="py-3 px-4 text-white font-bold">{item.name}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{item.days} days</td>
                    <td className="py-3 px-4 text-xs text-slate-400">Targeted recall & marked questions only</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deep views for Phase 4 */}
      {activePhaseId === 4 && (
        <div className="rounded-2xl border border-purple-500/30 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              November 30 – December 9 (Final 10 Days)
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Phase 4: The Final 10-Day Rapid Sprint
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              &ldquo;This is NOT the time to learn new chapters. Your brain should now be operating on: <strong>Recall → Solve → Correct → Recall again.</strong>&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PHASE_5_FINAL_10_DAYS.map((d, idx) => (
              <div key={idx} className="rounded-xl border border-purple-500/20 bg-slate-950/70 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-purple-400">{d.date}</span>
                  <span className="rounded bg-purple-950 px-1.5 py-0.5 text-[10px] text-purple-300 font-bold">1 Day</span>
                </div>
                <h4 className="text-sm font-bold text-white">{d.name}</h4>
                <p className="text-xs text-slate-300 font-medium">{d.rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep views for Phase 5 */}
      {activePhaseId === 5 && (
        <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-950 p-8 shadow-2xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-bold text-rose-300">
              <Flame className="h-4 w-4 animate-bounce" />
              THE MOMENT OF TRUTH
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {EXAM_MODE_DIRECTIVE.title}
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-amber-400">
              {EXAM_MODE_DIRECTIVE.motto}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {EXAM_MODE_DIRECTIVE.pillars.map((pillar, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="text-base font-bold text-rose-300 mb-1">{pillar.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
