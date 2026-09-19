import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  FileSpreadsheet, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Award,
  Download
} from 'lucide-react';
import { SubjectProgress } from '../types';

interface ProminentCountdownHeaderProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenExportModal: () => void;
  onOpenTrackerModal: () => void;
  onOpenDownloadModal: () => void;
  spreadsheetUrl: string | null;
  progressList: SubjectProgress[];
}

export function ProminentCountdownHeader({
  user,
  onSignIn,
  onSignOut,
  onOpenExportModal,
  onOpenTrackerModal,
  onOpenDownloadModal,
  spreadsheetUrl,
  progressList
}: ProminentCountdownHeaderProps) {
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
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute 83-day timeline progress
  const startDate = new Date('2026-09-18T00:00:00').getTime();
  const endDate = targetDate.getTime();
  const nowTime = new Date().getTime();
  const totalJourneyTime = endDate - startDate;
  const elapsedJourneyTime = Math.max(0, Math.min(nowTime - startDate, totalJourneyTime));
  const timelineProgressPercent = Math.min(100, Math.max(1, Math.round((elapsedJourneyTime / totalJourneyTime) * 100)));

  // Compute revision metrics
  const totalHoursLogged = progressList.reduce((acc, p) => acc + p.hoursCompleted, 0);
  const totalHoursTarget = progressList.reduce((acc, p) => acc + p.targetHours, 0);
  const hoursPercent = Math.round((totalHoursLogged / (totalHoursTarget || 1)) * 100);
  const avgConfidence = Math.round(
    progressList.reduce((acc, p) => acc + p.confidencePercent, 0) / (progressList.length || 1)
  );

  return (
    <header className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-4 py-6 sm:px-8 shadow-2xl">
      {/* Visual background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl"></div>

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Mini Bar: Strategic Identity + Sheets Sync + Auth */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Flame className="h-4 w-4 animate-pulse" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                83-Day Strategic Blueprint
              </span>
              <span className="rounded bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                CMA Final Group III & IV
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download Hub Button */}
            <button
              onClick={onOpenDownloadModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 px-3.5 py-1.5 text-xs font-bold text-emerald-300 transition-colors shadow cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download (.CSV / Sheets)</span>
            </button>

            {/* Quick Track & Update Button */}
            <button
              onClick={onOpenTrackerModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-colors shadow cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Track & Update Revision</span>
            </button>

            {/* Google Sheets button */}
            {spreadsheetUrl ? (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Open Google Sheet</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <button
                onClick={onOpenExportModal}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                <span>Export to Google Sheets</span>
              </button>
            )}

            {/* User auth state */}
            {user ? (
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-5 w-5 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-slate-300 text-[11px] truncate max-w-[120px]">{user.displayName || user.email}</span>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="text-slate-500 hover:text-rose-400 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="gsi-material-button inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* PROMINENT LIVE COUNTDOWN & DIRECTIVE DISPLAY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Battle Directive & Revision Summary */}
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-300">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              TARGET DATE: DECEMBER 10, 2026 • 09:00 AM
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              DECEMBER 10TH <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-red-500">EXAM COUNTDOWN</span>
            </h1>

            <p className="text-sm sm:text-base font-medium text-slate-300">
              <strong className="text-amber-400">&ldquo;WRITE WHAT YOU KNOW.&rdquo;</strong> No panic. No new material. No &ldquo;I haven&apos;t studied enough.&rdquo; You go in with the preparation built over these 83 days.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Revision Done</span>
                <span className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
                  {totalHoursLogged} / {totalHoursTarget} hrs
                </span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${hoursPercent}%` }}></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Readiness</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
                  {avgConfidence}% Avg
                </span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${avgConfidence}%` }}></div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Phase</span>
                <span className="text-xs sm:text-sm font-bold text-blue-300 truncate block">
                  Phase 2 (Sept 26)
                </span>
                <span className="text-[10px] text-slate-400 font-mono block mt-1">CLC → SFM → DT → SCM</span>
              </div>
            </div>
          </div>

          {/* Right Column: PROMINENT LIVE VISUAL COUNTDOWN BOXES */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 p-5 sm:p-6 shadow-2xl ring-1 ring-amber-500/20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Live Exact Countdown
                  </span>
                </div>
                <button
                  onClick={onOpenTrackerModal}
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Update Hours & Status</span>
                </button>
              </div>

              {/* 4 BOLD COUNTDOWN DIGIT BOXES: DAYS, HOURS, MINS, SECS */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                {/* DAYS */}
                <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-3 sm:p-4 shadow-inner">
                  <span className="block font-['JetBrains_Mono',monospace] text-3xl sm:text-5xl font-black text-white tracking-tight">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-400 mt-1 block">
                    DAYS
                  </span>
                </div>

                {/* HOURS */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 sm:p-4 shadow-inner">
                  <span className="block font-['JetBrains_Mono',monospace] text-3xl sm:text-5xl font-black text-white tracking-tight">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-300 mt-1 block">
                    HOURS
                  </span>
                </div>

                {/* MINUTES */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 sm:p-4 shadow-inner">
                  <span className="block font-['JetBrains_Mono',monospace] text-3xl sm:text-5xl font-black text-white tracking-tight">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-300 mt-1 block">
                    MINS
                  </span>
                </div>

                {/* SECONDS */}
                <div className="rounded-xl border border-rose-500/30 bg-slate-950 p-3 sm:p-4 shadow-inner">
                  <span className="block font-['JetBrains_Mono',monospace] text-3xl sm:text-5xl font-black text-rose-400 tracking-tight animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-rose-400 mt-1 block">
                    SECS
                  </span>
                </div>
              </div>

              {/* 83-Day Timeline Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                  <span>83-Day Path (Sept 18 → Dec 10)</span>
                  <span className="text-amber-400 font-bold">{timelineProgressPercent}% Elapsed</span>
                </div>
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-amber-400 to-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${timelineProgressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
