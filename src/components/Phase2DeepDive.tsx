import { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  BookOpen, 
  Calculator, 
  AlertTriangle, 
  FileText, 
  ChevronRight, 
  Award,
  Zap,
  Check,
  Plus
} from 'lucide-react';
import { PHASE_2_SUBJECT_SCHEDULE, SUBJECTS_MAP } from '../data/scheduleData';
import { SubjectId, SectionNoteEntry, MistakeEntry } from '../types';

interface Phase2DeepDiveProps {
  onOpenSectionNotebook: () => void;
  onOpenMistakeBook: () => void;
  onOpenTestAnalysis: () => void;
  completedTasks: Record<string, boolean>;
  onToggleTask: (taskId: string) => void;
}

export function Phase2DeepDive({
  onOpenSectionNotebook,
  onOpenMistakeBook,
  onOpenTestAnalysis,
  completedTasks,
  onToggleTask
}: Phase2DeepDiveProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('CLC');

  const currentSubject = PHASE_2_SUBJECT_SCHEDULE.find(
    (s) => s.subjectId === selectedSubjectId
  ) || PHASE_2_SUBJECT_SCHEDULE[0];

  const meta = SUBJECTS_MAP[currentSubject.subjectId];

  return (
    <div className="space-y-6">
      {/* Banner introduction for Phase 2 */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
              PHASE 1: FIRST REVISION (SEPTEMBER 20 – OCTOBER 18) — STARTS TOMORROW
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The Most Critical Revision of Your Prep
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-3xl">
              Retaining the exact requested sequence starting tomorrow (Sept 20): <strong className="text-white">Corporate Law → SFM → DT → SCM</strong>, ending with the <strong className="text-amber-400">Oct 18 Group III Mixed Test & Analysis Day</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenSectionNotebook}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/15 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-600/25 transition-colors cursor-pointer shadow-sm"
            >
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>Section Notebook</span>
            </button>
            <button
              onClick={onOpenMistakeBook}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-600/15 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-600/25 transition-colors cursor-pointer shadow-sm"
            >
              <AlertTriangle className="h-4 w-4 text-emerald-400" />
              <span>Mistake Book</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {PHASE_2_SUBJECT_SCHEDULE.map((subj) => {
          const isSelected = subj.subjectId === selectedSubjectId;
          const sMeta = SUBJECTS_MAP[subj.subjectId];
          const isTest = subj.subjectId === 'TEST_G3';

          return (
            <button
              key={subj.subjectId}
              onClick={() => setSelectedSubjectId(subj.subjectId)}
              className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-amber-500/60 bg-slate-900 shadow-md ring-1 ring-amber-500/30'
                  : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {subj.days} {subj.days === 1 ? 'Day' : 'Days'}
                </span>
                <span 
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: sMeta?.color || '#3b82f6' }}
                ></span>
              </div>
              <h3 className="font-bold text-sm text-white line-clamp-1">
                {subj.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                {subj.dateRange}
              </p>
              {isTest && (
                <span className="mt-2 inline-block rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                  BUFFER & TEST
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Subject Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Daily Hour Allocation & Golden Rule */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Daily Hour Breakdown */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Daily Protocol
                </span>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>{currentSubject.title}</span>
                  <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {currentSubject.dateRange}
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Daily Hours</span>
                <span className="text-lg font-extrabold text-amber-400 font-mono">
                  {currentSubject.dailyHours}
                </span>
              </div>
            </div>

            {/* Hour Allocation Rows */}
            <div className="space-y-3">
              {currentSubject.breakdown.map((item, idx) => {
                const taskId = `p2-${currentSubject.subjectId}-${idx}`;
                const isChecked = !!completedTasks[taskId];

                return (
                  <div
                    key={idx}
                    onClick={() => onToggleTask(taskId)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'border-emerald-500/30 bg-emerald-950/15'
                        : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}>
                        {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm font-bold ${isChecked ? 'text-emerald-300 line-through' : 'text-white'}`}>
                          {item.title}
                        </h4>
                        <span className="inline-flex items-center gap-1 rounded bg-slate-800/90 px-2 py-0.5 font-mono text-xs font-semibold text-amber-300">
                          <Clock className="h-3 w-3" />
                          {item.hours} hrs
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Golden Rule Callout */}
            <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Golden Directive for {currentSubject.title}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {currentSubject.goldenRule}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Subject-Specific Framework & Checklists */}
        <div className="lg:col-span-5 space-y-6">
          {/* Specific guidance card based on subject */}
          {currentSubject.subjectId === 'CLC' && (
            <div className="rounded-2xl border border-blue-500/30 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                <HelpCircle className="h-5 w-5" />
                <h3 className="font-bold text-base text-white">The 5-Question Legal Rule</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;Don&apos;t merely read Companies Act.&rdquo; For every chapter and provision, mentally test yourself against this sequence:
              </p>

              <div className="space-y-2 pt-1">
                {[
                  { step: '1', title: 'Provision', desc: 'What does the law mandate or allow?' },
                  { step: '2', title: 'Conditions', desc: 'Thresholds, paid-up capital, turnover, approvals.' },
                  { step: '3', title: 'Exceptions', desc: 'Private co, Sec 8, Govt co exemptions or non-applicability.' },
                  { step: '4', title: 'Consequence / Penalty', desc: 'Fines on company, officers in default, void contracts.' },
                  { step: '5', title: 'Case / Application', desc: 'Practical situation, court precedents, past exam scenario.' }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-extrabold">
                      {s.step}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-white block">{s.title}</span>
                      <span className="text-[11px] text-slate-400">{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenSectionNotebook}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Open Section-Number Notebook</span>
                </button>
              </div>
            </div>
          )}

          {currentSubject.subjectId === 'SFM' && (
            <div className="rounded-2xl border border-purple-500/30 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-purple-400">
                <Calculator className="h-5 w-5" />
                <h3 className="font-bold text-base text-white">SFM Core Solving Pillars</h3>
              </div>
              <p className="text-xs text-slate-300">
                &ldquo;For SFM, reading is not revision. You need to solve.&rdquo;
              </p>

              <div className="space-y-2.5">
                {[
                  { title: 'Formula Master Sheet', desc: 'Formulas must be on your fingertips without second-guessing.' },
                  { title: 'Calculator Speed', desc: 'Memorize memory key shortcuts (M+, M-, MRC) & compounding sequences.' },
                  { title: 'Standard Problem Patterns', desc: 'Forex cover, portfolio beta rebalancing, Black-Scholes steps.' },
                  { title: 'Full Pen-and-Paper Working', desc: 'Never audit numericals with eyes; write every step and journal.' },
                  { title: 'Mistake Correction', desc: 'Log calculation slips and incorrect sign conventions immediately.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-xs text-purple-300 block">{item.title}</span>
                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenMistakeBook}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-500 transition-colors cursor-pointer shadow-lg shadow-purple-600/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Record SFM Problem Error</span>
                </button>
              </div>
            </div>
          )}

          {currentSubject.subjectId === 'DT' && (
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <FileText className="h-5 w-5" />
                <h3 className="font-bold text-base text-white">Direct Tax 4-Part Daily Split</h3>
              </div>
              <p className="text-xs text-slate-300">
                &ldquo;Create a DT mistake book. Every question you get wrong goes there.&rdquo;
              </p>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-emerald-400 mb-0.5">
                    <span>Morning</span>
                    <span>Concepts & Provisions</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Income-tax provisions, sections, rates, recent amendments.</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-blue-400 mb-0.5">
                    <span>Afternoon</span>
                    <span>Practical Problems</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Total income computation formats, MAT/AMT, PGBP adjustments.</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-amber-400 mb-0.5">
                    <span>Evening</span>
                    <span>International Tax</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Transfer pricing, non-resident taxation, DTAA Sec 90/91 relief.</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-rose-400 mb-0.5">
                    <span>Night</span>
                    <span>MCQs & Past Papers</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Speed drilling and mistake book updates.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenMistakeBook}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>Update DT Mistake Book</span>
                </button>
              </div>
            </div>
          )}

          {currentSubject.subjectId === 'SCM' && (
            <div className="rounded-2xl border border-orange-500/30 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-orange-400">
                <Award className="h-5 w-5" />
                <h3 className="font-bold text-base text-white">SCM Dual-Power Strategy</h3>
              </div>
              <p className="text-xs text-slate-300">
                &ldquo;SCM requires both conceptual understanding and problem practice.&rdquo;
              </p>

              <div className="space-y-2.5">
                {[
                  { title: 'Decision Making & Marginal Costing', desc: 'Pricing decisions, shutdown point, limiting factor calculations.' },
                  { title: 'Standard Costing & Variance Analysis', desc: 'Reconciliation statements, planning vs operational variances.' },
                  { title: 'Modern Business Models', desc: 'Target costing, life cycle, JIT, Kaizen, balanced scorecard.' },
                  { title: 'Transfer Pricing Case Studies', desc: 'Opportunity cost approach, dual pricing, international transfer.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="font-bold text-xs text-orange-300 block">{item.title}</span>
                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSubject.subjectId === 'TEST_G3' && (
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold text-base text-white">Oct 22 Diagnostic Protocol</h3>
              </div>
              <p className="text-xs text-slate-300">
                &ldquo;Don&apos;t start a new subject. Take a full Group III mixed test. This analysis is more important than the test score.&rdquo;
              </p>

              <div className="space-y-2">
                {[
                  'What did I forget?',
                  'Which chapters are weak?',
                  'Which formulas are weak?',
                  'Which sections are weak?',
                  'Where am I losing marks?',
                  'Are my answers fast enough?'
                ].map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 p-2 rounded bg-slate-950 border border-slate-800/80">
                    <span className="font-bold text-amber-400">Q{idx + 1}:</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenTestAnalysis}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  <FileText className="h-4 w-4" />
                  <span>Launch Test Diagnostic Sheet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
