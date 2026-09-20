export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
}

export type SubjectId = 
  | 'CLC' // Corporate Laws
  | 'SFM' // Strategic Financial Management
  | 'DT'  // Direct Tax + International Tax
  | 'SCM' // Strategic Cost Management
  | 'CFR' // Corporate Financial Reporting
  | 'CMAD'// Cost & Management Audit
  | 'IDT' // Indirect Taxation
  | 'ES'  // Elective & SPM (E&S)
  | 'TEST_G3'
  | 'TEST_G4'
  | 'SYLLABUS';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  shortName: string;
  code: string;
  group: 'Group III' | 'Group IV' | 'General';
  color: string;
  bgLight: string;
  borderColor: string;
  iconName: string;
  tagline: string;
}

export interface DailyHourBlock {
  title: string;
  hours: number;
  category: 'detailed' | 'recall' | 'mcq' | 'problems' | 'past_questions' | 'concepts' | 'buffer';
  description?: string;
}

export interface DayRevisionPlan {
  dayNumber: number; // 1 to 83
  dateStr: string;   // e.g. "2026-09-26"
  displayDate: string; // e.g. "Sept 26"
  phaseId: number;   // 1 to 5, or 6 for exam
  phaseName: string;
  subjectId: SubjectId;
  subjectTitle: string;
  summary: string;
  dailyRoutine: DailyHourBlock[];
  keyDirectives: string[];
  fiveQuestionChecklist?: boolean; // Provision -> Conditions -> Exceptions -> Consequence -> Case
  isTestDay?: boolean;
}

export interface MistakeEntry {
  id: string;
  subject: SubjectId;
  topic: string;
  questionRef: string;
  mistakeReason: string;
  correctConcept: string;
  dateAdded: string;
  resolved: boolean;
}

export interface SectionNoteEntry {
  id: string;
  subject: 'CLC' | 'DT' | 'IDT';
  sectionNumber: string;
  title: string;
  provisions: string;
  conditions: string;
  exceptions: string;
  penaltyConsequence: string;
  caseApplication: string;
}

export interface TestAnalysis {
  testType: 'Group III' | 'Group IV';
  date: string;
  totalMarks?: number;
  score?: number;
  forgottenTopics: string[];
  weakChapters: string[];
  weakFormulas: string[];
  weakSections: string[];
  markLossReasons: string[];
  speedAssessment: 'Good' | 'Needs Speedup' | 'Critical Time Issue';
  actionPlan: string;
}

export interface StudyLogRecord {
  date: string;
  completedHours: number;
  targetHours: number;
  completedTasks: string[];
  reflection: string;
}

export interface SheetsSyncStatus {
  isExporting: boolean;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  lastSynced: string | null;
  error: string | null;
}

export type RevisionStatus = 'Not Started' | 'In Progress' | 'Phase 2 Done' | 'Phase 3 Done' | 'Exam Ready';

export interface SubjectProgress {
  subjectId: SubjectId;
  name: string;
  status: RevisionStatus;
  hoursCompleted: number;
  targetHours: number;
  confidencePercent: number;
  notes: string;
  lastUpdated: string;
}
