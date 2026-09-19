import { SubjectInfo, DayRevisionPlan, SubjectId } from '../types';

export const SUBJECTS_MAP: Record<SubjectId, SubjectInfo> = {
  CLC: {
    id: 'CLC',
    name: 'Corporate Laws',
    shortName: 'CLC',
    code: 'Paper 13',
    group: 'Group III',
    color: '#2563eb', // blue
    bgLight: 'rgba(37, 99, 235, 0.12)',
    borderColor: 'border-blue-500',
    iconName: 'Scale',
    tagline: 'Provision → Conditions → Exceptions → Penalty → Case law'
  },
  SFM: {
    id: 'SFM',
    name: 'Strategic Financial Management',
    shortName: 'SFM',
    code: 'Paper 14',
    group: 'Group III',
    color: '#9333ea', // purple
    bgLight: 'rgba(147, 51, 234, 0.12)',
    borderColor: 'border-purple-500',
    iconName: 'TrendingUp',
    tagline: 'Formulae, Speed & Problem Solving. Reading is not revision — solve!'
  },
  DT: {
    id: 'DT',
    name: 'Direct Tax + International Tax',
    shortName: 'DT',
    code: 'Paper 15',
    group: 'Group III',
    color: '#16a34a', // green
    bgLight: 'rgba(22, 163, 74, 0.12)',
    borderColor: 'border-emerald-500',
    iconName: 'FileText',
    tagline: 'Sections, Rates, Conditions, Exceptions & Mistake Book'
  },
  SCM: {
    id: 'SCM',
    name: 'Strategic Cost Management',
    shortName: 'SCM',
    code: 'Paper 16',
    group: 'Group III',
    color: '#ea580c', // orange
    bgLight: 'rgba(234, 88, 12, 0.12)',
    borderColor: 'border-orange-500',
    iconName: 'Activity',
    tagline: 'Conceptual understanding + Heavy problem practice'
  },
  CFR: {
    id: 'CFR',
    name: 'Corporate Financial Reporting',
    shortName: 'CFR',
    code: 'Paper 17',
    group: 'Group IV',
    color: '#0284c7', // sky
    bgLight: 'rgba(2, 132, 199, 0.12)',
    borderColor: 'border-sky-500',
    iconName: 'BookOpen',
    tagline: 'Ind AS / Standards & Comprehensive problems'
  },
  CMAD: {
    id: 'CMAD',
    name: 'Cost & Management Audit',
    shortName: 'CMAD',
    code: 'Paper 18',
    group: 'Group IV',
    color: '#ca8a04', // amber
    bgLight: 'rgba(202, 138, 4, 0.12)',
    borderColor: 'border-amber-500',
    iconName: 'CheckSquare',
    tagline: 'Standards, Audit rules & Answer writing presentation'
  },
  IDT: {
    id: 'IDT',
    name: 'Indirect Taxation',
    shortName: 'IDT',
    code: 'Paper 19',
    group: 'Group IV',
    color: '#dc2626', // red
    bgLight: 'rgba(220, 38, 38, 0.12)',
    borderColor: 'border-red-500',
    iconName: 'Layers',
    tagline: 'GST Provisions, Customs computations & Rule updates'
  },
  ES: {
    id: 'ES',
    name: 'Elective / Strategic Performance Mgmt',
    shortName: 'ES',
    code: 'Paper 20',
    group: 'Group IV',
    color: '#0d9488', // teal
    bgLight: 'rgba(13, 148, 136, 0.12)',
    borderColor: 'border-teal-500',
    iconName: 'Award',
    tagline: 'Rapid case coverage & conceptual mastery'
  },
  TEST_G3: {
    id: 'TEST_G3',
    name: 'Group III Full Mock Test',
    shortName: 'G3 Test',
    code: 'Papers 13-16',
    group: 'Group III',
    color: '#6366f1', // indigo
    bgLight: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'border-indigo-500',
    iconName: 'ClipboardCheck',
    tagline: 'Mixed exam test + deep diagnostic error analysis'
  },
  TEST_G4: {
    id: 'TEST_G4',
    name: 'Group IV Full Mock Test',
    shortName: 'G4 Test',
    code: 'Papers 17-20',
    group: 'Group IV',
    color: '#8b5cf6', // violet
    bgLight: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'border-violet-500',
    iconName: 'ClipboardCheck',
    tagline: 'Full Group IV mock exam + rigorous speed check'
  },
  SYLLABUS: {
    id: 'SYLLABUS',
    name: 'Syllabus Completion',
    shortName: 'Syllabus',
    code: 'Foundation',
    group: 'General',
    color: '#64748b', // slate
    bgLight: 'rgba(100, 116, 139, 0.12)',
    borderColor: 'border-slate-500',
    iconName: 'Target',
    tagline: 'Tie up loose ends and finish all initial syllabus coverage'
  }
};

export interface PhaseInfo {
  id: number;
  name: string;
  subTitle: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  focus: string;
  color: string;
  badge: string;
}

export const PHASES: PhaseInfo[] = [
  {
    id: 1,
    name: 'Phase 1: Finish Syllabus',
    subTitle: 'Sept 18 – Sept 25 (8 Days)',
    startDate: '2026-09-18',
    endDate: '2026-09-25',
    daysCount: 8,
    focus: 'Finish remaining chapters, seal loose ends, and prepare notebooks for revision.',
    color: 'from-slate-600 to-slate-800',
    badge: 'Foundation'
  },
  {
    id: 2,
    name: 'Phase 2: First Revision (Core Focus)',
    subTitle: 'Sept 26 – Oct 22 (27 Days)',
    startDate: '2026-09-26',
    endDate: '2026-10-22',
    daysCount: 27,
    focus: 'Your most important revision. Build strong understanding: CLC → SFM → DT → SCM + Group III Test.',
    color: 'from-blue-600 to-indigo-800',
    badge: 'Deep Understanding'
  },
  {
    id: 3,
    name: 'Phase 3: Second Revision',
    subTitle: 'Oct 23 – Nov 12 (21 Days)',
    startDate: '2026-10-23',
    endDate: '2026-11-12',
    daysCount: 21,
    focus: 'Compression + problem solving. Speed revision across Group III & Group IV subjects.',
    color: 'from-emerald-600 to-teal-800',
    badge: 'Speed & Compression'
  },
  {
    id: 4,
    name: 'Phase 4: Third Revision',
    subTitle: 'Nov 13 – Nov 29 (17 Days)',
    startDate: '2026-11-13',
    endDate: '2026-11-29',
    daysCount: 17,
    focus: 'Exam-Ready mode. Stop reading every line; rely on short notes, formula book, mistake book & PYQs.',
    color: 'from-amber-600 to-orange-800',
    badge: 'Exam-Oriented'
  },
  {
    id: 5,
    name: 'Phase 5: Final 10 Days',
    subTitle: 'Nov 30 – Dec 9 (10 Days)',
    startDate: '2026-11-30',
    endDate: '2026-12-09',
    daysCount: 10,
    focus: 'No new chapters. Recall → Solve → Correct → Recall again. Subject-wise rapid sprint.',
    color: 'from-purple-600 to-rose-800',
    badge: 'Final Sprint'
  },
  {
    id: 6,
    name: 'December 10 Onward: Exam Mode 🔥',
    subTitle: 'Dec 10+ (Exams Begin)',
    startDate: '2026-12-10',
    endDate: '2026-12-20',
    daysCount: 1,
    focus: 'No panic. No new material. No "I haven\'t studied enough." WRITE WHAT YOU KNOW.',
    color: 'from-rose-600 to-red-800',
    badge: 'EXAM TIME'
  }
];

export const PHASE_2_SUBJECT_SCHEDULE = [
  {
    subjectId: 'CLC' as SubjectId,
    title: 'Corporate Laws',
    dateRange: 'September 26 – October 1',
    days: 6,
    dailyHours: '9.5 – 11 Hours',
    breakdown: [
      { title: 'Detailed Revision', hours: 4.5, category: 'detailed' as const, description: 'Core provisions, chapter-wise in-depth study' },
      { title: 'Section / Provision Recall', hours: 2.0, category: 'recall' as const, description: 'Active recall of section numbers, sub-clauses, and limits' },
      { title: 'MCQs Practice', hours: 1.5, category: 'mcq' as const, description: 'Direct, case-scenario and application-based MCQs' },
      { title: 'Past Questions (PYQs)', hours: 1.5, category: 'past_questions' as const, description: 'Writing structured legal answers with provision citation' },
      { title: 'Rapid Recall Sprint', hours: 0.5, category: 'recall' as const, description: 'Quick-fire mental run-through of what was revised today' }
    ],
    goldenRule: "Don't merely read Companies Act. For EVERY chapter ask the 5 questions: Provision → Conditions → Exceptions → Consequence/Penalty → Case/application.",
    deliverable: 'Create and populate your Section-Number Notebook.'
  },
  {
    subjectId: 'SFM' as SubjectId,
    title: 'Strategic Financial Management',
    dateRange: 'October 2 – October 7',
    days: 6,
    dailyHours: '9 Hours',
    breakdown: [
      { title: 'Core Concepts', hours: 2.0, category: 'concepts' as const, description: 'Concept logic, derivatives, forex, portfolio theory, valuations' },
      { title: 'Problem Solving Practice', hours: 4.0, category: 'problems' as const, description: 'Solving standard patterns by hand on pen and paper' },
      { title: 'PYQ & MCQ Solving', hours: 2.0, category: 'past_questions' as const, description: 'Past exam numericals, RTP & MTP variations' },
      { title: 'Formula Revision & Speed', hours: 1.0, category: 'recall' as const, description: 'Formula notebook review + calculator speed drills' }
    ],
    goldenRule: "For SFM, reading is NOT revision. You need to SOLVE. Focus heavily on: Formulae, Concepts, Standard problem patterns, Calculator speed, Past exam questions, Mistake correction.",
    deliverable: 'Formula Book updated + Mistakes flagged.'
  },
  {
    subjectId: 'DT' as SubjectId,
    title: 'Direct Tax + International Tax',
    dateRange: 'October 8 – October 14',
    days: 7,
    dailyHours: '10 Hours',
    breakdown: [
      { title: 'Morning: Income-tax Concepts & Provisions', hours: 3.5, category: 'concepts' as const, description: 'PGBP, Capital Gains, Total Income, TDS/TCS, Deductions, MAT' },
      { title: 'Afternoon: Practical Computation Problems', hours: 3.0, category: 'problems' as const, description: 'Comprehensive computation formats and practical tax questions' },
      { title: 'Evening: International Taxation', hours: 2.0, category: 'detailed' as const, description: 'Transfer pricing, DTAA, Equalisation levy, NR taxation' },
      { title: 'Night: MCQs & PYQ Drills', hours: 1.5, category: 'past_questions' as const, description: 'Case-based MCQs, past papers & mistake logging' }
    ],
    goldenRule: "Your DT revision MUST include: Sections, Rates, Conditions, Exceptions, Computation formats, Important amendments, Practical questions.",
    deliverable: 'Create a DT Mistake Book — every single question you get wrong goes there!'
  },
  {
    subjectId: 'SCM' as SubjectId,
    title: 'Strategic Cost Management',
    dateRange: 'October 15 – October 21',
    days: 7,
    dailyHours: '9 Hours',
    breakdown: [
      { title: 'Concepts & Theories', hours: 3.0, category: 'concepts' as const, description: 'Target costing, life cycle, transfer pricing, JIT, OEE, cost models' },
      { title: 'Problem Practice', hours: 3.0, category: 'problems' as const, description: 'Linear programming, decision making, standard costing variances' },
      { title: 'PYQ / MCQ Drilling', hours: 2.0, category: 'past_questions' as const, description: 'Past examination practicals and analytical cases' },
      { title: 'Consolidation & Revision', hours: 1.0, category: 'recall' as const, description: 'Daily recap and formula/concept recall' }
    ],
    goldenRule: "SCM requires BOTH deep conceptual understanding and rigorous problem practice.",
    deliverable: 'SCM Summary charts & Key Case studies.'
  },
  {
    subjectId: 'TEST_G3' as SubjectId,
    title: 'GROUP III FULL TEST + BUFFER DAY',
    dateRange: 'October 22',
    days: 1,
    dailyHours: '8 – 9 Hours',
    breakdown: [
      { title: 'Full Group III Mixed Mock Test', hours: 3.5, category: 'problems' as const, description: 'Timed exam simulation across CLC, SFM, DT, SCM' },
      { title: 'Deep Diagnostic Analysis', hours: 3.0, category: 'detailed' as const, description: 'Analyse root causes: what was forgotten, weak chapters, weak formulas' },
      { title: 'Buffer & Weak Spot Patching', hours: 2.0, category: 'buffer' as const, description: 'Targeted fix for top 3 weak areas identified in mock' }
    ],
    goldenRule: "Don't start a new subject! Take a full Group III mixed test. This analysis is MORE IMPORTANT than the test score.",
    deliverable: '6-Question Diagnostic Analysis completed.'
  }
];

export const PHASE_3_SCHEDULE = [
  { dates: 'Oct 23–25', days: 3, subject: 'CLC', name: 'Corporate Laws', focus: 'Fast compression, section numbers, penalties, critical case laws' },
  { dates: 'Oct 26–28', days: 3, subject: 'SFM', name: 'Strategic Financial Management', focus: 'Core formula drill + tough numerical patterns & speed' },
  { dates: 'Oct 29–Nov 1', days: 4, subject: 'DT', name: 'Direct Tax + International Tax', focus: 'Computation speed, transfer pricing, TDS/TCS, amendments' },
  { dates: 'Nov 2–4', days: 3, subject: 'SCM', name: 'Strategic Cost Management', focus: 'Key case models, decision making, variances, cost formulas' },
  { dates: 'Nov 5–7', days: 3, subject: 'CFR', name: 'Corporate Financial Reporting', focus: 'Ind AS standards, consolidation, business combination' },
  { dates: 'Nov 8–9', days: 2, subject: 'CMAD', name: 'Cost & Management Audit', focus: 'Audit standards, CARO, Cost Audit rules, clean answer structure' },
  { dates: 'Nov 10', days: 1, subject: 'IDT', name: 'Indirect Taxation', focus: 'GST input tax credit, valuation, customs duty calculations' },
  { dates: 'Nov 11', days: 1, subject: 'ES', name: 'Elective & SPM', focus: 'High-yield conceptual coverage, scoring areas & cases' },
  { dates: 'Nov 12', days: 1, subject: 'TEST_G4', name: 'Full Group IV Test + Analysis', focus: 'Simulated 3-hour exam test + in-depth error autopsy' }
];

export const PHASE_4_ROTATION = [
  { dates: 'Nov 13–14', days: 2, subject: 'CLC', name: 'Corporate Laws' },
  { dates: 'Nov 15–16', days: 2, subject: 'SFM', name: 'Strategic Financial Management' },
  { dates: 'Nov 17–19', days: 3, subject: 'DT', name: 'Direct Tax + International Tax' },
  { dates: 'Nov 20–21', days: 2, subject: 'SCM', name: 'Strategic Cost Management' },
  { dates: 'Nov 22–23', days: 2, subject: 'CFR', name: 'Corporate Financial Reporting' },
  { dates: 'Nov 24–25', days: 2, subject: 'CMAD', name: 'Cost & Management Audit' },
  { dates: 'Nov 26', days: 1, subject: 'IDT', name: 'Indirect Taxation' },
  { dates: 'Nov 27', days: 1, subject: 'ES', name: 'Elective & SPM' },
  { dates: 'Nov 28', days: 1, subject: 'TEST_G3', name: 'Group III Mixed Revision' },
  { dates: 'Nov 29', days: 1, subject: 'TEST_G4', name: 'Group IV Mixed Revision' }
];

export const PHASE_5_FINAL_10_DAYS = [
  { date: 'Nov 30', subject: 'CLC', name: 'Corporate Laws', rule: 'Complete rapid revision' },
  { date: 'Dec 1', subject: 'SFM', name: 'Strategic Financial Management', rule: 'Formula + important problems' },
  { date: 'Dec 2', subject: 'DT', name: 'Direct Tax', rule: 'Provisions + computations' },
  { date: 'Dec 3', subject: 'SCM', name: 'Strategic Cost Management', rule: 'Formulas + important problems' },
  { date: 'Dec 4', subject: 'CFR', name: 'Corporate Financial Reporting', rule: 'Standards + important questions' },
  { date: 'Dec 5', subject: 'CMAD', name: 'Cost & Management Audit', rule: 'Standards/concepts + answer writing' },
  { date: 'Dec 6', subject: 'IDT', name: 'Indirect Taxation', rule: 'Provisions + computations' },
  { date: 'Dec 7', subject: 'ES', name: 'Elective & SPM', rule: 'Complete rapid revision' },
  { date: 'Dec 8', subject: 'TEST_G3', name: 'Group III Final', rule: 'Group III final rapid revision' },
  { date: 'Dec 9', subject: 'TEST_G4', name: 'Group IV Final', rule: 'Group IV final rapid revision + very light study' }
];

export const EXAM_MODE_DIRECTIVE = {
  title: "December 10 — EXAM MODE 🔥",
  motto: "WRITE WHAT YOU KNOW.",
  pillars: [
    { title: "No Panic", text: "You have spent 83 disciplined days building recall, solving problems, and plugging mistakes." },
    { title: "No New Material", text: "Do not open any new textbook, summary PDF, or unverified shortcut on exam day." },
    { title: "No 'I haven't studied enough'", text: "Confidence is key. Trust your notebook, your formula recall, and your rigorous repetition." },
    { title: "Execution Mindset", text: "Read questions with precision, allocate time strictly per mark, and write what you know." }
  ]
};

// Initial sample items for the Section Notebook & Mistake Book
export const DEFAULT_SECTION_NOTES = [
  {
    id: 'sec-1',
    subject: 'CLC' as const,
    sectionNumber: 'Sec 135',
    title: 'Corporate Social Responsibility (CSR)',
    provisions: 'Net worth >= 500 Cr OR Turnover >= 1000 Cr OR Net Profit >= 5 Cr during immediately preceding financial year.',
    conditions: 'Constitute CSR Committee (min 3 directors, 1 independent). Spend min 2% of avg net profits of preceding 3 years.',
    exceptions: 'If CSR obligation <= 50 Lakhs, CSR committee not mandatory; Board can discharge functions.',
    penaltyConsequence: 'Company liable to penalty of twice unspent amount or 1 Cr (whichever less); officer in default 1/10th or 2 Lakhs.',
    caseApplication: 'Ongoing project unspent amount transferred to Special Account within 30 days.'
  },
  {
    id: 'sec-2',
    subject: 'CLC' as const,
    sectionNumber: 'Sec 149',
    title: 'Company to Have Board of Directors (Independent Directors)',
    provisions: 'Public co: min 3 directors; Private co: min 2; OPC: 1. Max 15 (can increase via Special Resolution).',
    conditions: 'Listed company: at least 1/3rd Independent Directors. Unlisted public: Paid-up >= 10 Cr or TO >= 100 Cr or Borrowings > 50 Cr (min 2 ID).',
    exceptions: 'Section 8 companies exempt from minimum independent director requirement.',
    penaltyConsequence: 'Sec 172 general penalty for non-compliance.',
    caseApplication: 'Declaration of independence required at first board meeting of every FY.'
  },
  {
    id: 'sec-3',
    subject: 'DT' as const,
    sectionNumber: 'Sec 115BAA / 115BAB',
    title: 'Concessional Tax Regime for Domestic Companies',
    provisions: 'Sec 115BAA: 22% base tax rate (effective ~25.17% incl surcharge 10% & cess 4%). MAT not applicable.',
    conditions: 'Cannot claim deductions under Sec 10AA, 32(1)(iia), 33AB, 35, 35AD, or Chapter VI-A (except 80JJAA/80M).',
    exceptions: 'Brought forward loss attributable to unallowed deductions cannot be set off.',
    penaltyConsequence: 'Once option exercised, cannot be withdrawn for subsequent assessment years.',
    caseApplication: 'File Form 10-IC on or before due date specified u/s 139(1).'
  }
];

export const DEFAULT_SUBJECT_PROGRESS = [
  {
    subjectId: 'CLC' as SubjectId,
    name: 'Corporate Laws',
    status: 'In Progress' as const,
    hoursCompleted: 24,
    targetHours: 60,
    confidencePercent: 65,
    notes: 'Section notebook created; Focus on Sec 135, 149, 185, 186.',
    lastUpdated: '2026-09-18'
  },
  {
    subjectId: 'SFM' as SubjectId,
    name: 'Strategic Financial Management',
    status: 'In Progress' as const,
    hoursCompleted: 18,
    targetHours: 60,
    confidencePercent: 55,
    notes: 'Forex problems ongoing; calculator speed drills daily.',
    lastUpdated: '2026-09-18'
  },
  {
    subjectId: 'DT' as SubjectId,
    name: 'Direct Tax + International Tax',
    status: 'Not Started' as const,
    hoursCompleted: 12,
    targetHours: 70,
    confidencePercent: 50,
    notes: 'TDS/TCS and International tax transfer pricing scheduled.',
    lastUpdated: '2026-09-18'
  },
  {
    subjectId: 'SCM' as SubjectId,
    name: 'Strategic Cost Management',
    status: 'Not Started' as const,
    hoursCompleted: 10,
    targetHours: 65,
    confidencePercent: 50,
    notes: 'Standard costing variances + Transfer pricing chapters.',
    lastUpdated: '2026-09-18'
  },
  {
    subjectId: 'CFR' as SubjectId,
    name: 'Corporate Financial Reporting',
    status: 'Not Started' as const,
    hoursCompleted: 5,
    targetHours: 50,
    confidencePercent: 40,
    notes: 'Ind AS consolidation & financial instruments review.',
    lastUpdated: '2026-09-18'
  },
  {
    subjectId: 'CMAD' as SubjectId,
    name: 'Cost & Management Audit',
    status: 'Not Started' as const,
    hoursCompleted: 4,
    targetHours: 40,
    confidencePercent: 40,
    notes: 'Cost audit rules & CARO 2020 clauses.',
    lastUpdated: '2026-09-18'
  },
  {
    subjectId: 'IDT' as SubjectId,
    name: 'Indirect Taxation (GST & Customs)',
    status: 'Not Started' as const,
    hoursCompleted: 6,
    targetHours: 45,
    confidencePercent: 45,
    notes: 'Input Tax Credit (ITC) conditions & valuation rules.',
    lastUpdated: '2026-09-18'
  },
  {
    subjectId: 'ES' as SubjectId,
    name: 'Elective & SPM',
    status: 'Not Started' as const,
    hoursCompleted: 4,
    targetHours: 35,
    confidencePercent: 45,
    notes: 'Strategic performance measurement models.',
    lastUpdated: '2026-09-18'
  }
];

export const DEFAULT_MISTAKES = [
  {
    id: 'mst-1',
    subject: 'SFM' as SubjectId,
    topic: 'Forex Hedging - Cross Currency Rates',
    questionRef: 'Nov 2023 Exam Q2(b)',
    mistakeReason: 'Multiplied instead of dividing by the indirect quote when calculating bid/ask spreads.',
    correctConcept: 'Always convert to base currency first. When selling foreign currency to bank, use bank bid rate.',
    dateAdded: '2026-09-18',
    resolved: false
  },
  {
    id: 'mst-2',
    subject: 'DT' as SubjectId,
    topic: 'TDS u/s 194Q vs TCS u/s 206C(1H)',
    questionRef: 'Study Material Illustration 14',
    mistakeReason: 'Confused which section takes precedence when turnover of both buyer and seller exceeds 10 Cr.',
    correctConcept: 'Sec 194Q (buyer TDS at 0.1%) has primary overriding effect over Sec 206C(1H). If buyer deducts TDS, seller shall not collect TCS.',
    dateAdded: '2026-09-18',
    resolved: false
  }
];
