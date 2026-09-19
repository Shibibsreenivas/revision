import { useState } from 'react';
import { BookOpen, AlertTriangle, Plus, Search, Check, Trash2, Tag, ShieldAlert } from 'lucide-react';
import { SectionNoteEntry, MistakeEntry, SubjectId } from '../types';
import { SUBJECTS_MAP } from '../data/scheduleData';

interface NotebookTrackerProps {
  initialTab?: 'sections' | 'mistakes';
  sectionNotes: SectionNoteEntry[];
  onAddSectionNote: (note: SectionNoteEntry) => void;
  onDeleteSectionNote: (id: string) => void;
  mistakes: MistakeEntry[];
  onAddMistake: (mistake: MistakeEntry) => void;
  onToggleMistake: (id: string) => void;
  onDeleteMistake: (id: string) => void;
}

export function NotebookTracker({
  initialTab = 'sections',
  sectionNotes,
  onAddSectionNote,
  onDeleteSectionNote,
  mistakes,
  onAddMistake,
  onToggleMistake,
  onDeleteMistake
}: NotebookTrackerProps) {
  const [activeTab, setActiveTab] = useState<'sections' | 'mistakes'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');

  // Form states
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showMistakeForm, setShowMistakeForm] = useState(false);

  // New Section form
  const [secSubject, setSecSubject] = useState<'CLC' | 'DT' | 'IDT'>('CLC');
  const [secNumber, setSecNumber] = useState('');
  const [secTitle, setSecTitle] = useState('');
  const [secProvision, setSecProvision] = useState('');
  const [secConditions, setSecConditions] = useState('');
  const [secExceptions, setSecExceptions] = useState('');
  const [secPenalty, setSecPenalty] = useState('');
  const [secCase, setSecCase] = useState('');

  // New Mistake form
  const [mstSubject, setMstSubject] = useState<SubjectId>('DT');
  const [mstTopic, setMstTopic] = useState('');
  const [mstRef, setMstRef] = useState('');
  const [mstReason, setMstReason] = useState('');
  const [mstConcept, setMstConcept] = useState('');

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secNumber.trim() || !secTitle.trim()) return;

    const newEntry: SectionNoteEntry = {
      id: `sec-${Date.now()}`,
      subject: secSubject,
      sectionNumber: secNumber.trim(),
      title: secTitle.trim(),
      provisions: secProvision.trim() || 'General provision outline',
      conditions: secConditions.trim() || 'Thresholds / Applicability rules',
      exceptions: secExceptions.trim() || 'None specified',
      penaltyConsequence: secPenalty.trim() || 'Standard statutory penalty',
      caseApplication: secCase.trim() || 'Direct exam question application'
    };

    onAddSectionNote(newEntry);
    setSecNumber('');
    setSecTitle('');
    setSecProvision('');
    setSecConditions('');
    setSecExceptions('');
    setSecPenalty('');
    setSecCase('');
    setShowSectionForm(false);
  };

  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mstTopic.trim() || !mstReason.trim()) return;

    const newMistake: MistakeEntry = {
      id: `mst-${Date.now()}`,
      subject: mstSubject,
      topic: mstTopic.trim(),
      questionRef: mstRef.trim() || 'Self-test question',
      mistakeReason: mstReason.trim(),
      correctConcept: mstConcept.trim() || 'Review foundational note',
      dateAdded: new Date().toISOString().split('T')[0],
      resolved: false
    };

    onAddMistake(newMistake);
    setMstTopic('');
    setMstRef('');
    setMstReason('');
    setMstConcept('');
    setShowMistakeForm(false);
  };

  const filteredSections = sectionNotes.filter((s) => {
    const matchesQuery = 
      s.sectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provisions.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'ALL' || s.subject === filterSubject;
    return matchesQuery && matchesSubject;
  });

  const filteredMistakes = mistakes.filter((m) => {
    const matchesQuery =
      m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.questionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mistakeReason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'ALL' || m.subject === filterSubject;
    return matchesQuery && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sections'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Section-Number Notebook</span>
            <span className="rounded-full bg-blue-950 px-2 py-0.5 text-[10px] text-blue-300">
              {sectionNotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mistakes'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Mistake Book (DT / SFM / SCM)</span>
            <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300">
              {mistakes.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'sections' ? (
            <button
              onClick={() => setShowSectionForm(!showSectionForm)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-600/30 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{showSectionForm ? 'Cancel Entry' : 'Add Section (5-Points)'}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowMistakeForm(!showMistakeForm)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-600/30 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{showMistakeForm ? 'Cancel Entry' : 'Log Question Mistake'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Subject Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'sections' ? "Search section, provision or title..." : "Search mistake, chapter, or question..."}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 text-xs mr-1">Subject:</span>
          {['ALL', 'CLC', 'SFM', 'DT', 'SCM'].map((sub) => (
            <button
              key={sub}
              onClick={() => setFilterSubject(sub)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterSubject === sub
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* New Section Note Form */}
      {showSectionForm && (
        <form onSubmit={handleSaveSection} className="rounded-2xl border border-blue-500/40 bg-slate-900/95 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Add to Section-Number Notebook (The 5-Question Framework)
            </h3>
            <span className="text-[11px] text-slate-400">Companies Act & Tax Sections</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
              <select
                value={secSubject}
                onChange={(e) => setSecSubject(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                <option value="CLC">Corporate Laws (Companies Act)</option>
                <option value="DT">Direct Tax</option>
                <option value="IDT">Indirect Tax (GST/Customs)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Section Number</label>
              <input
                type="text"
                value={secNumber}
                onChange={(e) => setSecNumber(e.target.value)}
                placeholder="e.g. Sec 186 / Sec 115BAA"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Title / Concept</label>
              <input
                type="text"
                value={secTitle}
                onChange={(e) => setSecTitle(e.target.value)}
                placeholder="e.g. Loan and Investment by Company"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">1. Provision (What law mandates)</label>
              <textarea
                value={secProvision}
                onChange={(e) => setSecProvision(e.target.value)}
                rows={2}
                placeholder="Core statutory provision..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">2. Conditions (Thresholds & Limits)</label>
              <textarea
                value={secConditions}
                onChange={(e) => setSecConditions(e.target.value)}
                rows={2}
                placeholder="Limits: 60% paid-up + free reserves or 100% free reserves..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">3. Exceptions (Who is exempt?)</label>
              <textarea
                value={secExceptions}
                onChange={(e) => setSecExceptions(e.target.value)}
                rows={2}
                placeholder="Banking co, insurance co, housing finance co..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">4. Consequence / Penalty</label>
              <textarea
                value={secPenalty}
                onChange={(e) => setSecPenalty(e.target.value)}
                rows={2}
                placeholder="Fine on company, officer in default..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-blue-300 mb-1">5. Case Law / Practical Application</label>
            <input
              type="text"
              value={secCase}
              onChange={(e) => setSecCase(e.target.value)}
              placeholder="Important landmark case, board resolution timing, or exam pitfall"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowSectionForm(false)}
              className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer shadow"
            >
              Save Section Note
            </button>
          </div>
        </form>
      )}

      {/* New Mistake Form */}
      {showMistakeForm && (
        <form onSubmit={handleSaveMistake} className="rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Log Problem Mistake (Every wrong question goes here!)
            </h3>
            <span className="text-[11px] text-slate-400">DT, SFM, SCM practical errors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
              <select
                value={mstSubject}
                onChange={(e) => setMstSubject(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                <option value="DT">Direct Tax</option>
                <option value="SFM">Strategic Financial Mgmt</option>
                <option value="SCM">Strategic Cost Mgmt</option>
                <option value="CLC">Corporate Laws</option>
                <option value="CFR">CFR</option>
                <option value="IDT">Indirect Tax</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Topic / Chapter</label>
              <input
                type="text"
                value={mstTopic}
                onChange={(e) => setMstTopic(e.target.value)}
                placeholder="e.g. Forex Currency Swaps or PGBP Depr"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Question Reference</label>
              <input
                type="text"
                value={mstRef}
                onChange={(e) => setMstRef(e.target.value)}
                placeholder="e.g. Dec 2022 Q3(b) or Study Mat Ex 8"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-rose-300 mb-1">Why Did You Get It Wrong? (Root Cause)</label>
              <textarea
                value={mstReason}
                onChange={(e) => setMstReason(e.target.value)}
                rows={2}
                required
                placeholder="Misinterpreted question, calculator slip, forgot limit..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1">Correct Concept & Principle to Remember</label>
              <textarea
                value={mstConcept}
                onChange={(e) => setMstConcept(e.target.value)}
                rows={2}
                required
                placeholder="The exact rule, formula, or approach..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowMistakeForm(false)}
              className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 cursor-pointer shadow"
            >
              Log Into Mistake Book
            </button>
          </div>
        </form>
      )}

      {/* Content Display */}
      {activeTab === 'sections' ? (
        <div className="space-y-4">
          {filteredSections.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400 text-xs">
              No section entries match your criteria. Add one using the button above!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSections.map((sec) => (
                <div
                  key={sec.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 hover:border-slate-700 transition-colors shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-blue-600/20 border border-blue-500/30 px-2 py-0.5 font-mono text-xs font-bold text-blue-300">
                        {sec.sectionNumber}
                      </span>
                      <h4 className="text-base font-bold text-white">{sec.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] rounded bg-slate-800 px-2 py-0.5 text-slate-300">
                        {SUBJECTS_MAP[sec.subject]?.name || sec.subject}
                      </span>
                      <button
                        onClick={() => onDeleteSectionNote(sec.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-amber-400 font-bold block mb-1">1. Provision</span>
                      <p className="text-slate-300">{sec.provisions}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-amber-400 font-bold block mb-1">2. Conditions</span>
                      <p className="text-slate-300">{sec.conditions}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-amber-400 font-bold block mb-1">3. Exceptions</span>
                      <p className="text-slate-300">{sec.exceptions}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-amber-400 font-bold block mb-1">4. Penalty / Consequence</span>
                      <p className="text-slate-300">{sec.penaltyConsequence}</p>
                    </div>
                  </div>

                  {sec.caseApplication && (
                    <div className="mt-3 p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs">
                      <span className="text-blue-300 font-bold mr-2">5. Case / Practical Application:</span>
                      <span className="text-slate-200">{sec.caseApplication}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMistakes.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400 text-xs">
              No mistakes logged. Whenever you solve past papers and make an error, record it here!
            </div>
          ) : (
            filteredMistakes.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  m.resolved
                    ? 'border-slate-800 bg-slate-950/40 opacity-75'
                    : 'border-emerald-500/30 bg-slate-900/90'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleMistake(m.id)}
                      className={`flex h-5 w-5 items-center justify-center rounded border transition-colors cursor-pointer ${
                        m.resolved
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {m.resolved && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>
                    <span className="font-bold text-sm text-white">{m.topic}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      {SUBJECTS_MAP[m.subject]?.name || m.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-[11px]">{m.questionRef}</span>
                    <button
                      onClick={() => onDeleteMistake(m.id)}
                      className="text-slate-500 hover:text-rose-400 cursor-pointer ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20">
                    <span className="text-rose-400 font-bold block mb-1">What went wrong:</span>
                    <p className="text-slate-300">{m.mistakeReason}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold block mb-1">Correct Rule / Formula:</span>
                    <p className="text-slate-300">{m.correctConcept}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
