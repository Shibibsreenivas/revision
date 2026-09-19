/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  FileSpreadsheet, 
  Layers, 
  ExternalLink,
  Flame,
  CheckCircle2, 
  Clock,
  SlidersHorizontal,
  BookOpen,
  Download
} from 'lucide-react';

import { ProminentCountdownHeader } from './components/ProminentCountdownHeader';
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

  // View state: 'sheet' | 'matrix' | 'interactive'
  const [viewMode, setViewMode] = useState<'sheet' | 'matrix' | 'interactive'>('sheet');

  // Revision Progress State (persisted)
  const [progressList, setProgressList] = useState<SubjectProgress[]>(() => {
    try {
      const saved = localStorage.getItem('cma_subject_progress');
      return saved ? JSON.parse(saved) : DEFAULT_SUBJECT_PROGRESS;
    } catch {
      return DEFAULT_SUBJECT_PROGRESS;
    }
  });

  // Daily Study Logs (persisted)
  const [studyLogs, setStudyLogs] = useState<StudyLogRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cma_study_logs');
      return saved ? JSON.parse(saved) : [
        {
          date: '2026-09-18',
          completedHours: 9,
          targetHours: 10,
          completedTasks: ['CLC Sec 135 & 149 recall', 'SFM Forex hedging problems', 'DT Sec 194Q TDS rules'],
          reflection: 'Good speed on calculation problems. Need to drill section numbers for Independent Directors.'
        }
      ];
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
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(true);
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

  // Firebase auth initialization
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

  // Auto-download master workbook on prompt
  useEffect(() => {
    try {
      const hasDownloaded = sessionStorage.getItem('cma_has_downloaded_workbook');
      if (!hasDownloaded) {
        sessionStorage.setItem('cma_has_downloaded_workbook', 'true');
        downloadCompleteWorkbookCsv(
          'CMA_Final_83_Day_Complete_Revision_Workbook.csv',
          progressList,
          studyLogs,
          sectionNotes,
          mistakes
        );
      }
    } catch (e) {
      console.warn('Auto download error', e);
    }
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
        spreadsheetUrl={exportResult?.spreadsheetUrl || null}
        progressList={progressList}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Mode Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">View Mode:</span>
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-semibold">
              <button
                onClick={() => setViewMode('sheet')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  viewMode === 'sheet'
                    ? 'bg-emerald-600 text-white shadow'
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
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Phase 2 Deep Dive & Notebooks</span>
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

