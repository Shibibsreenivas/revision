import { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  Flame, 
  Calendar, 
  Clock, 
  Sparkles, 
  FileSpreadsheet, 
  LogIn, 
  LogOut, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { PHASES } from '../data/scheduleData';

interface CountdownHeaderProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenExportModal: () => void;
  activePhaseId: number;
  onSelectPhase: (phaseId: number) => void;
  currentDateOverride?: string;
  onToggleDateModal?: () => void;
  spreadsheetUrl?: string | null;
}

export function CountdownHeader({
  user,
  onSignIn,
  onSignOut,
  onOpenExportModal,
  activePhaseId,
  onSelectPhase,
  spreadsheetUrl
}: CountdownHeaderProps) {
  // Target Exam Date: December 10, 2026 at 09:00 AM local time
  const targetDate = new Date('2026-12-10T09:00:00');

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute progress
  // Journey start: Sept 20, 2026. Target: Dec 10, 2026
  const startDate = new Date('2026-09-20T00:00:00').getTime();
  const endDate = targetDate.getTime();
  const nowTime = new Date().getTime();
  const totalJourneyTime = endDate - startDate;
  const elapsedJourneyTime = Math.max(0, Math.min(nowTime - startDate, totalJourneyTime));
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedJourneyTime / totalJourneyTime) * 100)));

  return (
    <header className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-4 py-8 sm:px-8 lg:px-12">
      {/* Subtle background glow accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl"></div>

      <div className="mx-auto max-w-7xl">
        {/* Top bar: Brand, Google Sheets status & User auth */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm">
              <Flame className="h-5 w-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">83-Day Strategic Blueprint</span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400 border border-blue-500/20">
                  CMA Final Group III & IV
                </span>
              </div>
              <h2 className="text-sm font-semibold text-slate-300">Phase 2 Core Revision Engine</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {spreadsheetUrl && (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                id="view-sheet-btn"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Open Google Sheet</span>
              </a>
            )}

            <button
              onClick={onOpenExportModal}
              id="export-to-sheets-btn"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:border-amber-500/40 hover:bg-slate-800 transition-all hover:text-amber-300 shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>{spreadsheetUrl ? 'Sync to Google Sheets' : 'Export to Google Sheets'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="h-6 w-6 rounded-full border border-slate-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-slate-300 font-bold text-[10px]">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="max-w-[130px] truncate text-slate-300 font-medium">{user.displayName || user.email}</span>
                <button
                  onClick={onSignOut}
                  id="sign-out-btn"
                  title="Sign out"
                  className="ml-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                id="sign-in-google-btn"
                className="gsi-material-button inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/80 transition-colors cursor-pointer"
              >
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </div>
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Countdown & Heading Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Core Battle Motto */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              TARGET DATE: DECEMBER 10, 2026
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              DECEMBER 10TH <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-red-500">EXAM COUNTDOWN</span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-slate-300 max-w-2xl">
              <span className="text-amber-400 font-bold">WRITE WHAT YOU KNOW.</span> No panic. No new material. No &ldquo;I haven&apos;t studied enough.&rdquo; You go in with the preparation built over these 83 days.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>Daily Commitment: <strong>9 – 11 Hours</strong></span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Group III Target Order: <strong>CLC → SFM → DT → SCM</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Ticking Countdown Timer */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-amber-950/20 p-5 sm:p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Live Exam Ticker
                </span>
                <span className="text-xs font-mono text-slate-400">Target: Dec 10, 09:00 AM</span>
              </div>

              {/* Countdown Numbers Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                {/* Days */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5 sm:p-3 shadow-inner">
                  <span className="block font-['JetBrains_Mono',monospace] text-2xl sm:text-4xl font-extrabold text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-400/90">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5 sm:p-3 shadow-inner">
                  <span className="block font-['JetBrains_Mono',monospace] text-2xl sm:text-4xl font-extrabold text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Hours
                  </span>
                </div>

                {/* Minutes */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5 sm:p-3 shadow-inner">
                  <span className="block font-['JetBrains_Mono',monospace] text-2xl sm:text-4xl font-extrabold text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Mins
                  </span>
                </div>

                {/* Seconds */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5 sm:p-3 shadow-inner">
                  <span className="block font-['JetBrains_Mono',monospace] text-2xl sm:text-4xl font-extrabold text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-500/80">
                    Secs
                  </span>
                </div>
              </div>

              {/* Progress bar across 83-day timeline */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                  <span>83-Day Revision Journey</span>
                  <span className="text-amber-400 font-bold">{progressPercent}% Ready</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-amber-500 to-rose-500 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(5, progressPercent)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>Sept 18 (Start)</span>
                  <span>Phase 2 Focus</span>
                  <span>Dec 10 (Exam)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Navigation Bar */}
        <div className="mt-8 flex flex-nowrap items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {PHASES.map((phase) => {
            const isActive = activePhaseId === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className={`group relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-900/70 text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {phase.id}
                </span>
                <span className="whitespace-nowrap">{phase.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-amber-500/20 text-amber-200' : 'bg-slate-800/80 text-slate-500'
                }`}>
                  {phase.daysCount}d
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
