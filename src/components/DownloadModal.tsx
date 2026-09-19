import { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  Check, 
  Copy, 
  FolderDown, 
  Sparkles,
  ExternalLink,
  Table
} from 'lucide-react';
import { 
  getRoadmapSheetData, 
  getPhase2ProtocolSheetData, 
  getSectionNotebookSheetData, 
  getMistakeBookSheetData, 
  getRevisionTrackerSheetData,
  downloadCsv,
  downloadCompleteWorkbookCsv,
  rowsToTsv 
} from '../services/sheetsDataGenerator';
import { SubjectProgress, StudyLogRecord, SectionNoteEntry, MistakeEntry } from '../types';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressList: SubjectProgress[];
  studyLogs: StudyLogRecord[];
  sectionNotes: SectionNoteEntry[];
  mistakes: MistakeEntry[];
  onOpenGoogleDriveExport: () => void;
  spreadsheetUrl: string | null;
}

export function DownloadModal({
  isOpen,
  onClose,
  progressList,
  studyLogs,
  sectionNotes,
  mistakes,
  onOpenGoogleDriveExport,
  spreadsheetUrl
}: DownloadModalProps) {
  if (!isOpen) return null;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleDownloadCompleteWorkbook = () => {
    downloadCompleteWorkbookCsv(
      'CMA_Final_83_Day_Complete_Revision_Workbook.csv',
      progressList,
      studyLogs,
      sectionNotes,
      mistakes
    );
  };

  const handleDownloadIndividual = (
    key: 'tracker' | 'roadmap' | 'phase2' | 'sections' | 'mistakes',
    filename: string
  ) => {
    let rows: (string | number)[][] = [];
    if (key === 'tracker') rows = getRevisionTrackerSheetData(progressList, studyLogs);
    else if (key === 'roadmap') rows = getRoadmapSheetData();
    else if (key === 'phase2') rows = getPhase2ProtocolSheetData();
    else if (key === 'sections') rows = getSectionNotebookSheetData(sectionNotes);
    else if (key === 'mistakes') rows = getMistakeBookSheetData(mistakes);

    downloadCsv(filename, rows);
  };

  const handleCopyTsv = (
    key: 'all' | 'tracker' | 'roadmap' | 'phase2' | 'sections' | 'mistakes'
  ) => {
    let rows: (string | number)[][] = [];
    if (key === 'tracker') rows = getRevisionTrackerSheetData(progressList, studyLogs);
    else if (key === 'roadmap') rows = getRoadmapSheetData();
    else if (key === 'phase2') rows = getPhase2ProtocolSheetData();
    else if (key === 'sections') rows = getSectionNotebookSheetData(sectionNotes);
    else if (key === 'mistakes') rows = getMistakeBookSheetData(mistakes);
    else if (key === 'all') {
      rows = [
        ...getRevisionTrackerSheetData(progressList, studyLogs),
        [''],
        ...getRoadmapSheetData(),
        [''],
        ...getPhase2ProtocolSheetData()
      ];
    }

    const tsv = rowsToTsv(rows);
    navigator.clipboard.writeText(tsv);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sheetsList = [
    {
      id: 'tracker' as const,
      name: 'Revision Tracker & Status',
      desc: 'All 8 subjects, hours completed, readiness %, and daily study logs.',
      filename: 'CMA_Revision_Tracker.csv'
    },
    {
      id: 'roadmap' as const,
      name: '83-Day Master Roadmap',
      desc: 'All 5 revision phases from Sept 18 to Dec 10 exam sprint.',
      filename: '83_Day_Master_Roadmap.csv'
    },
    {
      id: 'phase2' as const,
      name: 'Phase 2 Daily Protocols (CLC → SFM → DT → SCM)',
      desc: 'Hourly breakdown: detailed revision, recall, MCQs, past questions.',
      filename: 'Phase_2_Hourly_Protocols.csv'
    },
    {
      id: 'sections' as const,
      name: 'Section Notebook (5-Points Framework)',
      desc: 'Provision → Conditions → Exceptions → Penalty → Case law.',
      filename: 'Section_Notebook_5_Points.csv'
    },
    {
      id: 'mistakes' as const,
      name: 'Mistake Book (DT / SFM / SCM)',
      desc: 'Track wrong attempts, root cause, and correct legal/practical concepts.',
      filename: 'Mistake_Book.csv'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Download className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Download Revision Sheets & Plan</h3>
              <p className="text-xs text-slate-400">
                Download formatted files for Google Sheets, Microsoft Excel, or CSV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Highlight Banner: Complete Workbook */}
        <div className="rounded-xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              <Sparkles className="h-3 w-3" /> Recommended
            </span>
            <h4 className="text-base font-bold text-white">
              Complete 83-Day Revision Workbook (.CSV)
            </h4>
            <p className="text-xs text-slate-300">
              Includes all 5 sheets (Roadmap + Tracker + Phase 2 Protocols + Section Notebook + Mistake Book) in one master spreadsheet file.
            </p>
          </div>

          <button
            onClick={handleDownloadCompleteWorkbook}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-xs font-black text-slate-950 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
          >
            <FolderDown className="h-4 w-4" />
            <span>Download Master File</span>
          </button>
        </div>

        {/* Individual Sheets Download List */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Download Individual Sheet Tabs:
          </label>

          <div className="space-y-2">
            {sheetsList.map((sheet) => (
              <div
                key={sheet.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Table className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-white">{sheet.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{sheet.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyTsv(sheet.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy formatted for Google Sheets (Ctrl+V)"
                  >
                    {copiedKey === sheet.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-slate-400" />
                        <span>Copy TSV</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadIndividual(sheet.id, sheet.filename)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-[11px] font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <Download className="h-3 w-3 text-emerald-400" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Drive Option */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Prefer a live Google Sheet in Google Drive?</span>
              <span className="text-[11px] text-slate-400 block">
                Create or open the synced sheet directly in your Google account.
              </span>
            </div>
          </div>

          {spreadsheetUrl ? (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-colors shadow shrink-0"
            >
              <span>Open in Google Sheets</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenGoogleDriveExport();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors shadow cursor-pointer shrink-0"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Create in Google Drive</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
