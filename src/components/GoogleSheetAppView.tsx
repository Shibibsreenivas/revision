import { useState } from 'react';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  LogIn, 
  LogOut, 
  Sparkles, 
  Clock, 
  Flame, 
  Save, 
  Plus,
  Share2,
  Table
} from 'lucide-react';
import { User } from '../types';
import { 
  getRoadmapSheetData, 
  getPhase2ProtocolSheetData, 
  getSectionNotebookSheetData, 
  getMistakeBookSheetData, 
  getRevisionTrackerSheetData,
  downloadCsv, 
  rowsToTsv 
} from '../services/sheetsDataGenerator';
import { SectionNoteEntry, MistakeEntry, SubjectProgress, StudyLogRecord } from '../types';

interface GoogleSheetAppViewProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onCreateGoogleSheet: () => void;
  onOpenTrackerModal: () => void;
  onOpenDownloadModal: () => void;
  isExporting: boolean;
  spreadsheetUrl: string | null;
  sectionNotes: SectionNoteEntry[];
  mistakes: MistakeEntry[];
  progressList: SubjectProgress[];
  studyLogs: StudyLogRecord[];
  onAddSectionNote: (entry: SectionNoteEntry) => void;
  onAddMistake: (entry: MistakeEntry) => void;
}

export function GoogleSheetAppView({
  user,
  onSignIn,
  onSignOut,
  onCreateGoogleSheet,
  onOpenTrackerModal,
  onOpenDownloadModal,
  isExporting,
  spreadsheetUrl,
  sectionNotes,
  mistakes,
  progressList,
  studyLogs,
  onAddSectionNote,
  onAddMistake
}: GoogleSheetAppViewProps) {
  const [activeSheetTab, setActiveSheetTab] = useState<'tracker' | 'roadmap' | 'phase2' | 'sections' | 'mistakes'>('tracker');
  const [copied, setCopied] = useState(false);

  // Compute live countdown
  const targetDate = new Date('2026-12-10T09:00:00');
  const [countdownStr, setCountdownStr] = useState('');

  useState(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdownStr('EXAM DAY HAS ARRIVED 🔥');
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdownStr(`${d}d ${h}h ${m}m ${s}s`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  });

  const getActiveRows = () => {
    switch (activeSheetTab) {
      case 'tracker':
        return getRevisionTrackerSheetData(progressList, studyLogs);
      case 'roadmap':
        return getRoadmapSheetData();
      case 'phase2':
        return getPhase2ProtocolSheetData();
      case 'sections':
        return getSectionNotebookSheetData(sectionNotes);
      case 'mistakes':
        return getMistakeBookSheetData(mistakes);
    }
  };

  const activeRows = getActiveRows();

  // Column letters A, B, C, D, E, F, G, H...
  const maxCols = Math.max(...activeRows.map((r) => r.length), 6);
  const colLetters = Array.from({ length: maxCols }, (_, i) => String.fromCharCode(65 + i));

  const handleCopyCurrentTab = () => {
    const tsv = rowsToTsv(activeRows);
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const filename = `${activeSheetTab}_83_day_revision_plan.csv`;
    downloadCsv(filename, activeRows);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden font-sans">
      {/* 1. Google Sheets App Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* Green Google Sheets Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                CMA Final 81-Day Revision Plan & Countdown (Dec 10 Exam)
              </h1>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                Google Sheet
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="hover:text-slate-200 cursor-pointer">File</span>
              <span>•</span>
              <span className="hover:text-slate-200 cursor-pointer">Edit</span>
              <span>•</span>
              <span className="hover:text-slate-200 cursor-pointer">View</span>
              <span>•</span>
              <span className="hover:text-slate-200 cursor-pointer">Insert</span>
              <span>•</span>
              <span className="text-amber-400 font-mono">Last saved to memory</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenTrackerModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-colors shadow cursor-pointer"
          >
            <span>Update Revision</span>
          </button>

          {/* Direct link if created */}
          {spreadsheetUrl ? (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open in Google Sheets</span>
            </a>
          ) : (
            <button
              onClick={onCreateGoogleSheet}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>{isExporting ? 'Generating Sheet...' : 'Create in My Google Drive'}</span>
            </button>
          )}

          <button
            onClick={handleCopyCurrentTab}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Copies table formatted so you can paste (Ctrl+V) directly into any Google Sheet"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>{copied ? 'Copied for Sheets!' : 'Copy for Sheets'}</span>
          </button>

          <button
            onClick={onOpenDownloadModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/50 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-colors shadow cursor-pointer"
            title="Download full workbook or individual sheets"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Download All Sheets</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Download currently active sheet tab as CSV"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Download Tab CSV</span>
          </button>

          {/* User auth */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-800 pl-2">
              <span className="text-[11px] text-slate-400 truncate max-w-[120px]">{user.email}</span>
              <button
                onClick={onSignOut}
                title="Sign out"
                className="text-slate-400 hover:text-rose-400 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5 text-blue-400" />
              <span>Connect Drive</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Formula Bar (`fx`) with Real-Time December 10 Countdown */}
      <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs">
        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-400 border-r border-slate-800 pr-3">
          <span className="italic text-emerald-400 text-sm">fx</span>
          <span className="text-slate-200">A1</span>
        </div>

        <div className="flex-1 font-mono text-slate-300 truncate">
          <span className="text-amber-400 font-bold">=COUNTDOWN</span>
          <span className="text-slate-400">(</span>
          <span className="text-emerald-300">&quot;2026-12-10&quot;</span>
          <span className="text-slate-400">, </span>
          <span className="text-rose-300">&quot;EXAM MODE 🔥 - WRITE WHAT YOU KNOW&quot;</span>
          <span className="text-slate-400">)</span>
        </div>

        {/* Live Countdown Chip */}
        <div className="inline-flex items-center gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 font-mono text-xs font-bold text-amber-300">
          <Clock className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span>DEC 10 COUNTDOWN: {countdownStr}</span>
        </div>
      </div>

      {/* 3. The Interactive Google Sheet Spreadsheet Grid */}
      <div className="flex-1 overflow-auto bg-slate-900 scrollbar-thin">
        <table className="w-full border-collapse text-left text-xs font-sans">
          {/* Column Letters Bar: A, B, C, D, E, F... */}
          <thead className="sticky top-0 z-10 bg-slate-950 text-slate-400 select-none border-b border-slate-800">
            <tr>
              {/* Corner empty header for row numbers */}
              <th className="w-12 border-r border-slate-800 bg-slate-950 p-2 text-center text-[11px] font-mono text-slate-500"></th>
              {colLetters.map((col) => (
                <th
                  key={col}
                  className="border-r border-slate-800 px-3 py-1.5 text-center text-xs font-mono font-semibold text-slate-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Row Data Cells */}
          <tbody className="divide-y divide-slate-800/80 font-sans">
            {activeRows.map((row, rowIndex) => {
              const rowNum = rowIndex + 1;
              const isMainHeading = rowIndex === 0;
              const isSubHeading = rowIndex === 1;
              const isTableHeader = rowNum === 4 || rowNum === 5 || rowNum === 8;

              return (
                <tr
                  key={rowIndex}
                  className={`transition-colors ${
                    isMainHeading
                      ? 'bg-amber-500/15 font-bold text-amber-200'
                      : isSubHeading
                      ? 'bg-slate-950/60 italic text-slate-300'
                      : isTableHeader
                      ? 'bg-slate-800/90 font-bold text-white'
                      : 'hover:bg-slate-800/40 text-slate-200'
                  }`}
                >
                  {/* Row Number Index: 1, 2, 3... */}
                  <td className="w-12 border-r border-slate-800 bg-slate-950 p-2 text-center font-mono text-[11px] text-slate-500 select-none">
                    {rowNum}
                  </td>

                  {/* Columns */}
                  {colLetters.map((_, colIndex) => {
                    const cellVal = row[colIndex];
                    const valStr = cellVal !== undefined ? String(cellVal) : '';

                    return (
                      <td
                        key={colIndex}
                        className={`border-r border-slate-800/80 px-3 py-2 leading-relaxed ${
                          isMainHeading && colIndex === 0
                            ? 'text-sm font-extrabold text-amber-300'
                            : ''
                        }`}
                      >
                        {valStr}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Google Sheets Bottom Tab Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-800 bg-slate-950 px-2 py-1 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          <button
            onClick={() => setActiveSheetTab('tracker')}
            className={`flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 font-medium border-t-2 transition-all cursor-pointer ${
              activeSheetTab === 'tracker'
                ? 'border-amber-500 bg-slate-900 text-white font-bold'
                : 'border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Revision Tracker & Status</span>
          </button>

          <button
            onClick={() => setActiveSheetTab('roadmap')}
            className={`flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 font-medium border-t-2 transition-all cursor-pointer ${
              activeSheetTab === 'roadmap'
                ? 'border-emerald-500 bg-slate-900 text-white font-bold'
                : 'border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>81-Day Master Roadmap</span>
          </button>

          <button
            onClick={() => setActiveSheetTab('phase2')}
            className={`flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 font-medium border-t-2 transition-all cursor-pointer ${
              activeSheetTab === 'phase2'
                ? 'border-emerald-500 bg-slate-900 text-white font-bold'
                : 'border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <span>Phase 1 Daily Protocol (CLC→SFM→DT→SCM)</span>
          </button>

          <button
            onClick={() => setActiveSheetTab('sections')}
            className={`flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 font-medium border-t-2 transition-all cursor-pointer ${
              activeSheetTab === 'sections'
                ? 'border-emerald-500 bg-slate-900 text-white font-bold'
                : 'border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
            <span>Section Notebook (5-Points)</span>
          </button>

          <button
            onClick={() => setActiveSheetTab('mistakes')}
            className={`flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 font-medium border-t-2 transition-all cursor-pointer ${
              activeSheetTab === 'mistakes'
                ? 'border-emerald-500 bg-slate-900 text-white font-bold'
                : 'border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span>Mistake Book (DT / SFM / SCM)</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 px-3 py-1 font-mono">
          Ready • 4 Sheets Connected
        </div>
      </div>
    </div>
  );
}
