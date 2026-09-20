/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User } from './types';
import { 
  FileSpreadsheet, 
  Layers, 
  ExternalLink,
  Flame,
  CheckCircle2, 
  Clock,
  SlidersHorizontal,
  BookOpen,
  Download,
  MapPin,
  Calendar
} from 'lucide-react';

import { ProminentCountdownHeader } from './components/ProminentCountdownHeader';
import { FullJourneyRoadmap } from './components/FullJourneyRoadmap';
import { GoogleSheetAppView } from './components/GoogleSheetAppView';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { DownloadModal } from './components/DownloadModal';
import { Phase2DeepDive } from './components/Phase2DeepDive';
import { NotebookTracker } from './components/NotebookTracker';
import { TestAnalysisModal } from './components/TestAnalysisModal';
import { RevisionTrackerModal } from './components/RevisionTrackerModal';
import { SubjectProgressMatrix } from './components/SubjectProgressMatrix';

import { initAuth, googleSignIn, logout } from './services/auth';
import { exportRevisionPlanToGoogleSheets } from './services/sheetsService';
import { DEFAULT_SECTION_NOTES, DEFAULT_MISTAKES, DEFAULT_SUBJECT_PROGRESS } from './data/scheduleData';
import { downloadCompleteWorkbookCsv } from './services/sheetsDataGenerator';
import { SectionNoteEntry, MistakeEntry, TestAnalysis, SubjectProgress, StudyLogRecord, SubjectId } from './types';

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // View state: 'roadmap' | 'sheet' | 'matrix' | 'interactive'
  const [viewMode, setViewMode] = useState<'roadmap' | 'sheet' | 'matrix' | 'interactive'>('roadmap');
  const [activePhaseId, setActivePhaseId] = useState<number>(1);

  const CURRENT_REVISION_CYCLE = '2026-09-20-day1-reset';

  // Revision Progress State (persisted with automatic reset for Sept 20 start)
  const [progressList, setProgressList] = useState<SubjectProgress[]>(() => {
    try {
      const cycle = localStorage.getItem('cma_revision_cycle');
      if (cycle !== CURRENT_REVISION_CYCLE) {
        localStorage.setItem('cma_revision_cycle', CURRENT_REVISION_CYCLE);
        localStorage.setItem('cma_subject_progress', JSON.stringify(DEFAULT_SUBJECT_PROGRESS));
        localStorage.removeItem('cma_study_logs');
        localStorage.removeItem('cma_completed_tasks');
        return DEFAULT_SUBJECT_PROGRESS;
      }
      const saved = localStorage.getItem('cma_subject_progress');
      return saved ? JSON.parse(saved) : DEFAULT_SUBJECT_PROGRESS;
    } catch {
      return DEFAULT_SUBJECT_PROGRESS;
    }
  });

  // Daily Study Logs (persisted)
  const [studyLogs, setStudyLogs] = useState<StudyLogRecord[]>(() => {
    try {
      const cycle = localStorage.getItem('cma_revision_cycle');
      if (cycle !== CURRENT_REVISION_CYCLE) return [];
      const saved = localStorage.getItem('cma_study_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Notebooks & Mistakes state
  const [sectionNotes, setSectionNotes] = useState<SectionNoteEntry[]>(() => {
    try {
      const saved = localStorage.getItem('cma_section_notes');
      return saved ? JSON.parse(saved) : DEFAULT_SECTION_NOTES;
    } catch {
      return DEFAULT_SECTION_NOTES;
    }
  });

  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => {
    try {
      const saved = localStorage.getItem('cma_mistakes');
      return saved ? JSON.parse(saved) : DEFAULT_MISTAKES;
    } catch {
      return DEFAULT_MISTAKES;
    }
  });

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const cycle = localStorage.getItem('cma_revision_cycle');
      if (cycle !== CURRENT_REVISION_CYCLE) return {};
      const saved = localStorage.getItem('cma_completed_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [testAnalysis, setTestAnalysis] = useState<TestAnalysis | null>(null);

  // Sheets modal & status
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isTestAnalysisModalOpen, setIsTestAnalysisModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{ spreadsheetId: string; spreadsheetUrl: string } | null>(null);
  const [sheetsError, setSheetsError] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('cma_subject_progress', JSON.stringify(progressList));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [progressList]);

  useEffect(() => {
    try {
      localStorage.setItem('cma_study_logs', JSON.stringify(studyLogs));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [studyLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('cma_section_notes', JSON.stringify(sectionNotes));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [sectionNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('cma_mistakes', JSON.stringify(mistakes));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [mistakes]);

  useEffect(() => {
    try {
      localStorage.setItem('cma_completed_tasks', JSON.stringify(completedTasks));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [completedTasks]);

  // Candidate profile initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAuthToken(token);
      },
      () => {
        setUser(null);
        setAuthToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAuthToken(res.accessToken);
      }
    } catch (err: any) {
      if (
        err?.code !== 'auth/popup-closed-by-user' &&
        err?.code !== 'auth/cancelled-popup-request'
      ) {
        console.warn('Google Sign In:', err?.message || err);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAuthToken(null);
    } catch (err) {
      console.error('Sign Out failed:', err);
    }
  };

  const handleExportToSheets = async () => {
    setIsExporting(true);
    setSheetsError(null);
    try {
      const result = await exportRevisionPlanToGoogleSheets(sectionNotes, mistakes);
      setExportResult(result);
    } catch (err: any) {
      console.error('Export failed:', err);
      setSheetsError(err.message || 'Failed to export to Google Sheets.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpdateSubjectProgress = (updated: SubjectProgress) => {
    setProgressList((prev) =>
      prev.map((p) => (p.subjectId === updated.subjectId ? updated : p))
    );
  };

  const handleLogStudyHours = (subjectId: SubjectId, hours: number, taskDescription: string) => {
    const newLog: StudyLogRecord = {
      date: new Date().toISOString().split('T')[0],
      completedHours: hours,
      targetHours: 9,
      completedTasks: [`${subjectId}: ${taskDescription}`],
      reflection: `Completed ${hours} hrs session on ${subjectId}.`
    };
    setStudyLogs((prev) => [newLog, ...prev]);
  };

  const handleResetAll = () => {
    try {
      localStorage.setItem('cma_revision_cycle', CURRENT_REVISION_CYCLE);
      localStorage.setItem('cma_subject_progress', JSON.stringify(DEFAULT_SUBJECT_PROGRESS));
      localStorage.removeItem('cma_study_logs');
      localStorage.removeItem('cma_completed_tasks');
    } catch (e) {
      console.warn('LocalStorage clear failed', e);
    }

    setProgressList(DEFAULT_SUBJECT_PROGRESS);
    setStudyLogs([]);
    setCompletedTasks({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. PROMINENT LIVE COUNTDOWN TIMER IN THE HEADER */}
      <ProminentCountdownHeader
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenExportModal={() => {
          setExportResult(null);
          setSheetsError(null);
          setIsSheetsModalOpen(true);
        }}
        onOpenTrackerModal={() => setIsTrackerModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onResetAll={handleResetAll}
        spreadsheetUrl={exportResult?.spreadsheetUrl || null}
        progressList={progressList}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Mode Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">View Mode:</span>
            <div className="flex flex-wrap items-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-semibold">
              <button
                onClick={() => setViewMode('roadmap')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  viewMode === 'roadmap'
                    ? 'bg-blue-600 text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>81-Day Plan & Roadmap</span>
              </button>

              <button
                onClick={() => setViewMode('sheet')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  viewMode === 'sheet'
                    ? 'bg-emerald-600 text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Google Sheet Grid</span>
              </button>

              <button
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  viewMode === 'matrix'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Revision Tracker & Updates</span>
              </button>

              <button
                onClick={() => setViewMode('interactive')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  viewMode === 'interactive'
                    ? 'bg-purple-600 text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Phase 1 Protocols & Notebooks</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/50 px-3.5 py-1.5 text-xs font-bold text-emerald-300 transition-colors shadow cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Download (.CSV / Sheets)</span>
            </button>

            <button
              onClick={() => setIsTrackerModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-colors shadow cursor-pointer"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Log Study Hours</span>
            </button>

            {exportResult && (
              <a
                href={exportResult.spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Open Google Sheet</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Dynamic View Display */}
        {viewMode === 'roadmap' && (
          <div className="space-y-6">
            {/* Day 1 Starting Tomorrow Briefing Banner */}
            <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 p-5 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 text-[11px] font-mono font-bold text-blue-300">
                      <Calendar className="h-3 w-3" /> Starts Tomorrow • Sept 20, 2026
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-300">
                      Day 1 of 81
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Phase 1: Corporate Laws & Compliance (Sept 20 – Sept 26)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                    Starting Day 1 tomorrow with <span className="text-amber-300 font-semibold">9 hours/day target</span>. 
                    Build your <span className="text-emerald-300 font-semibold">Section Notebook</span> using the 5-Points Framework (Provision → Conditions → Exceptions → Penalty → Case Law) and complete past exam questions.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setViewMode('interactive')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Hourly Protocols</span>
                  </button>
                  <button
                    onClick={() => setViewMode('sheet')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    <span>Sheet Grid</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Full Journey Interactive Text Roadmap */}
            <FullJourneyRoadmap
              activePhaseId={activePhaseId}
              onSelectPhase={setActivePhaseId}
              onJumpToPhase2={() => setViewMode('interactive')}
            />
          </div>
        )}

        {viewMode === 'sheet' && (
          <GoogleSheetAppView
            user={user}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            onCreateGoogleSheet={() => {
              setExportResult(null);
              setSheetsError(null);
              setIsSheetsModalOpen(true);
            }}
            onOpenTrackerModal={() => setIsTrackerModalOpen(true)}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            isExporting={isExporting}
            spreadsheetUrl={exportResult?.spreadsheetUrl || null}
            sectionNotes={sectionNotes}
            mistakes={mistakes}
            progressList={progressList}
            studyLogs={studyLogs}
            onAddSectionNote={(n) => setSectionNotes((prev) => [n, ...prev])}
            onAddMistake={(m) => setMistakes((prev) => [m, ...prev])}
          />
        )}

        {viewMode === 'matrix' && (
          <SubjectProgressMatrix
            progressList={progressList}
            onUpdateSubject={handleUpdateSubjectProgress}
            onOpenQuickUpdateModal={() => setIsTrackerModalOpen(true)}
            studyLogs={studyLogs}
            onAddStudyLog={(log) => setStudyLogs((prev) => [log, ...prev])}
            completedTasks={completedTasks}
            onToggleTask={(taskId) =>
              setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }))
            }
          />
        )}

        {viewMode === 'interactive' && (
          <div className="space-y-6">
            <Phase2DeepDive
              onOpenSectionNotebook={() => setViewMode('sheet')}
              onOpenMistakeBook={() => setViewMode('sheet')}
              onOpenTestAnalysis={() => setIsTestAnalysisModalOpen(true)}
              completedTasks={completedTasks}
              onToggleTask={(taskId) =>
                setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }))
              }
            />
            <NotebookTracker
              sectionNotes={sectionNotes}
              onAddSectionNote={(n) => setSectionNotes((prev) => [n, ...prev])}
              onDeleteSectionNote={(id) => setSectionNotes((prev) => prev.filter((s) => s.id !== id))}
              mistakes={mistakes}
              onAddMistake={(m) => setMistakes((prev) => [m, ...prev])}
              onToggleMistake={(id) =>
                setMistakes((prev) =>
                  prev.map((m) => (m.id === id ? { ...m, resolved: !m.resolved } : m))
                )
              }
              onDeleteMistake={(id) => setMistakes((prev) => prev.filter((m) => m.id !== id))}
            />
          </div>
        )}
      </main>

      {/* Revision Tracker & Update Modal */}
      <RevisionTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        progressList={progressList}
        onUpdateSubjectProgress={handleUpdateSubjectProgress}
        onLogStudyHours={handleLogStudyHours}
      />

      {/* Complete Download & Export Hub Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        progressList={progressList}
        studyLogs={studyLogs}
        sectionNotes={sectionNotes}
        mistakes={mistakes}
        onOpenGoogleDriveExport={() => {
          setExportResult(null);
          setSheetsError(null);
          setIsSheetsModalOpen(true);
        }}
        spreadsheetUrl={exportResult?.spreadsheetUrl || null}
      />

      {/* Confirmation & Export Dialog */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        user={user}
        onSignIn={handleSignIn}
        onConfirmExport={handleExportToSheets}
        isExporting={isExporting}
        exportResult={exportResult}
        error={sheetsError}
        sectionNotesCount={sectionNotes.length}
        mistakesCount={mistakes.length}
      />

      {/* Test Analysis Modal */}
      <TestAnalysisModal
        isOpen={isTestAnalysisModalOpen}
        onClose={() => setIsTestAnalysisModalOpen(false)}
        onSaveAnalysis={(a) => setTestAnalysis(a)}
        savedAnalysis={testAnalysis}
      />
    </div>
  );
}

