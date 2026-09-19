import { useState } from 'react';
import { X, CheckCircle, AlertOctagon, HelpCircle, Save, Award } from 'lucide-react';
import { TestAnalysis } from '../types';

interface TestAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAnalysis: (analysis: TestAnalysis) => void;
  savedAnalysis?: TestAnalysis | null;
}

export function TestAnalysisModal({
  isOpen,
  onClose,
  onSaveAnalysis,
  savedAnalysis
}: TestAnalysisModalProps) {
  if (!isOpen) return null;

  const [testType, setTestType] = useState<'Group III' | 'Group IV'>(savedAnalysis?.testType || 'Group III');
  const [date, setDate] = useState(savedAnalysis?.date || '2026-10-22');
  const [totalMarks, setTotalMarks] = useState<number>(savedAnalysis?.totalMarks || 100);
  const [score, setScore] = useState<number>(savedAnalysis?.score || 65);
  const [speedAssessment, setSpeedAssessment] = useState<'Good' | 'Needs Speedup' | 'Critical Time Issue'>(
    savedAnalysis?.speedAssessment || 'Needs Speedup'
  );

  const [forgottenText, setForgottenText] = useState(
    savedAnalysis?.forgottenTopics.join('\n') || 'Sec 185 loan to directors conditions\nForex options binomial tree calculation steps'
  );
  const [weakChaptersText, setWeakChaptersText] = useState(
    savedAnalysis?.weakChapters.join('\n') || 'SFM Portfolio Beta hedging\nDT International Tax - Equalisation Levy'
  );
  const [weakFormulasText, setWeakFormulasText] = useState(
    savedAnalysis?.weakFormulas.join('\n') || 'Black Scholes d1 / d2 calculation\nStandard costing overhead variances'
  );
  const [weakSectionsText, setWeakSectionsText] = useState(
    savedAnalysis?.weakSections.join('\n') || 'Sec 135 CSR penalty limits\nSec 194R vs Sec 194Q'
  );
  const [markLossText, setMarkLossText] = useState(
    savedAnalysis?.markLossReasons.join('\n') || 'Rushed in last 30 minutes; skipped full working notes\nMisread question sub-part (b)'
  );
  const [actionPlan, setActionPlan] = useState(
    savedAnalysis?.actionPlan || 'Dedicate 1 hour every morning of Phase 3 to weak sections and standard costing variances.'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const analysis: TestAnalysis = {
      testType,
      date,
      totalMarks,
      score,
      speedAssessment,
      forgottenTopics: forgottenText.split('\n').filter((s) => s.trim()),
      weakChapters: weakChaptersText.split('\n').filter((s) => s.trim()),
      weakFormulas: weakFormulasText.split('\n').filter((s) => s.trim()),
      weakSections: weakSectionsText.split('\n').filter((s) => s.trim()),
      markLossReasons: markLossText.split('\n').filter((s) => s.trim()),
      actionPlan
    };

    onSaveAnalysis(analysis);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-indigo-500/40 bg-slate-900 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-400">
              <Award className="h-3.5 w-3.5" />
              OCTOBER 22 DIAGNOSTIC REVIEW
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Full Mock Test Error Autopsy
            </h2>
            <p className="text-xs text-slate-300">
              &ldquo;This analysis is more important than the test score.&rdquo;
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Test Series</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
              >
                <option value="Group III">Group III (CLC, SFM, DT, SCM)</option>
                <option value="Group IV">Group IV (CFR, CMAD, IDT, E&S)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Test Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Score / Total</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-16 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white text-center font-bold"
                />
                <span className="text-slate-400 text-xs">/</span>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="w-16 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white text-center"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Speed Check</label>
              <select
                value={speedAssessment}
                onChange={(e) => setSpeedAssessment(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white"
              >
                <option value="Good">Fast / Finished on time</option>
                <option value="Needs Speedup">Needs Speedup (Last 15m rush)</option>
                <option value="Critical Time Issue">Critical Time Issue (&gt;15 marks left)</option>
              </select>
            </div>
          </div>

          {/* The 6 Mandatory Diagnostic Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">
                1. What did I forget? (Topics & Concepts)
              </label>
              <textarea
                value={forgottenText}
                onChange={(e) => setForgottenText(e.target.value)}
                rows={3}
                placeholder="One item per line..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">
                2. Which chapters are weak?
              </label>
              <textarea
                value={weakChaptersText}
                onChange={(e) => setWeakChaptersText(e.target.value)}
                rows={3}
                placeholder="One chapter per line..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-300 mb-1">
                3. Which formulas are weak?
              </label>
              <textarea
                value={weakFormulasText}
                onChange={(e) => setWeakFormulasText(e.target.value)}
                rows={3}
                placeholder="Formulas that slipped..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-300 mb-1">
                4. Which legal / tax sections are weak?
              </label>
              <textarea
                value={weakSectionsText}
                onChange={(e) => setWeakSectionsText(e.target.value)}
                rows={3}
                placeholder="Sections or sub-clauses missed..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-rose-300 mb-1">
                5. Where am I losing marks? (Presentation, steps, interpretation)
              </label>
              <textarea
                value={markLossText}
                onChange={(e) => setMarkLossText(e.target.value)}
                rows={2}
                placeholder="Root causes of mark deductions..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-emerald-300 mb-1">
                6. Targeted Buffer Action Plan (Next 48 Hours Fix)
              </label>
              <textarea
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
                rows={2}
                placeholder="What exactly will you patch before starting Phase 3?"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <Save className="h-4 w-4" />
              <span>Save Diagnostic Autopsy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
