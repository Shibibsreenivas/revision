import { useState } from 'react';
import { FileSpreadsheet, X, CheckCircle2, ExternalLink, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSignIn: () => void;
  onConfirmExport: () => Promise<void>;
  isExporting: boolean;
  exportResult: { spreadsheetId: string; spreadsheetUrl: string } | null;
  error: string | null;
  sectionNotesCount: number;
  mistakesCount: number;
}

export function GoogleSheetsModal({
  isOpen,
  onClose,
  user,
  onSignIn,
  onConfirmExport,
  isExporting,
  exportResult,
  error,
  sectionNotesCount,
  mistakesCount
}: GoogleSheetsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Google Sheets Integration</h3>
              <p className="text-xs text-slate-400">Export & Synchronize Your 83-Day Master Plan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content based on state */}
        {!user ? (
          <div className="space-y-4 py-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
              <ShieldCheck className="h-6 w-6 text-blue-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Google Authentication Required</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Sign in with Google to allow this application to generate a new spreadsheet in your Google Drive with your revision timeline and notebooks.
              </p>
            </div>
            <button
              onClick={onSignIn}
              className="gsi-material-button mx-auto inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
            >
              <span>Sign in with Google</span>
            </button>
          </div>
        ) : exportResult ? (
          <div className="space-y-4 py-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-300">Spreadsheet Created Successfully!</h4>
              <p className="text-xs text-slate-300">
                Your 83-day revision roadmap, Phase 2 daily hour protocols, section notebook, and mistake logs have been exported.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={exportResult.spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open in Google Sheets</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2.5">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>Spreadsheet Title:</span>
                <span className="text-emerald-400 font-mono text-[11px]">CMA Final 83-Day Revision Plan & Countdown</span>
              </div>
              <div className="border-t border-slate-800/80 pt-2 space-y-1 text-slate-400">
                <p>• <strong>Sheet 1:</strong> 83-Day Master Roadmap (Phases 1 to 5 + Dec 10 exam mode)</p>
                <p>• <strong>Sheet 2:</strong> Phase 2 Daily Hour Protocols (CLC, SFM, DT, SCM)</p>
                <p>• <strong>Sheet 3:</strong> Section Notebook ({sectionNotesCount} entries with 5-point framework)</p>
                <p>• <strong>Sheet 4:</strong> Mistake & Calculation Error Book ({mistakesCount} entries)</p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="rounded-lg bg-slate-800/60 p-3 text-slate-400">
              <p>
                <strong>User Confirmation:</strong> By clicking &ldquo;Confirm Export&rdquo;, a new Google Sheet will be created directly in your Google Drive under <strong className="text-white">{user.email}</strong>.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isExporting}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Exporting to Sheets...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Confirm & Export to Sheets</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
