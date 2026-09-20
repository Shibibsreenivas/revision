import { PHASES, PHASE_2_SUBJECT_SCHEDULE, PHASE_3_SCHEDULE, PHASE_4_ROTATION, PHASE_5_FINAL_10_DAYS, SUBJECTS_MAP } from '../data/scheduleData';
import { SectionNoteEntry, MistakeEntry } from '../types';

export function getRoadmapSheetData(): (string | number)[][] {
  return [
    ['81-DAY MASTER REVISION JOURNEY & EXAM COUNTDOWN (TARGET: DECEMBER 10TH)'],
    ['Motto: "WRITE WHAT YOU KNOW — No panic. No new material. No \'I haven\'t studied enough.\' You go in with the preparation built over 80+ days."'],
    ['Target Exam Date:', '2026-12-10 09:00:00', 'Total Duration:', '81 Days (Sept 20 – Dec 10)'],
    [''],
    ['Phase ID', 'Phase Name', 'Dates', 'Days', 'Strategic Focus', 'Action Philosophy'],
    ...PHASES.map((p) => [
      `Phase ${p.id}`,
      p.name,
      p.subTitle,
      p.daysCount,
      p.focus,
      p.badge
    ]),
    [''],
    ['PHASE 2 - SPEED & COMPRESSION ROTATION (Oct 19 - Nov 9)'],
    ['Dates', 'Days', 'Subject Code', 'Subject Name', 'Key Directive / Focus'],
    ...PHASE_3_SCHEDULE.map((p3) => [
      p3.dates,
      p3.days,
      p3.subject,
      p3.name,
      p3.focus
    ]),
    [''],
    ['PHASE 3 - THIRD REVISION ROTATION (Nov 10 - Nov 29)'],
    ['Dates', 'Days', 'Subject Code', 'Subject Name', 'Study Rules & Materials'],
    ...PHASE_4_ROTATION.map((p4) => [
      p4.dates,
      p4.days,
      p4.subject,
      p4.name,
      'Use short notes, formula book, section notebook, mistake book & PYQs'
    ]),
    [''],
    ['PHASE 4 - FINAL 10 DAYS SPRINT (Nov 30 - Dec 9)'],
    ['Date', 'Subject', 'Focus Rule', 'Mindset'],
    ...PHASE_5_FINAL_10_DAYS.map((p5) => [
      p5.date,
      p5.name,
      p5.rule,
      'Recall → Solve → Correct → Recall again'
    ]),
    [''],
    ['DECEMBER 10TH', 'EXAM MODE 🔥', 'WRITE WHAT YOU KNOW.', 'Enter with full confidence and calmness']
  ];
}

export function getPhase2ProtocolSheetData(): (string | number)[][] {
  return [
    ['PHASE 1: FIRST REVISION — HOURLY PROTOCOLS & CORE METHODOLOGY (Sept 20 - Oct 18)'],
    ['This is your most important revision starting tomorrow. Understanding + Rebuilding.'],
    ['Order: Corporate Law → SFM → DT → SCM → Group III Test Day'],
    [''],
    ['Subject', 'Dates', 'Duration', 'Daily Target Hours', 'Golden Directive', 'Deliverable / Output Notebook'],
    ...PHASE_2_SUBJECT_SCHEDULE.map((s) => [
      s.title,
      s.dateRange,
      `${s.days} Days`,
      s.dailyHours,
      s.goldenRule,
      s.deliverable
    ]),
    [''],
    ['DETAILED HOURLY TIME ALLOCATION TABLE'],
    ['Subject', 'Session Component', 'Hours Allocated', 'Category', 'Exact Tasks & Methodology'],
    ...PHASE_2_SUBJECT_SCHEDULE.flatMap((s) => 
      s.breakdown.map((b) => [
        s.title,
        b.title,
        `${b.hours} hrs`,
        b.category.toUpperCase(),
        b.description || ''
      ])
    ),
    [''],
    ['OCTOBER 18 — GROUP III TEST & BUFFER DAY ANALYSIS QUESTIONS'],
    ['Question 1: What did I forget?'],
    ['Question 2: Which chapters are weak?'],
    ['Question 3: Which formulas are weak?'],
    ['Question 4: Which sections are weak?'],
    ['Question 5: Where am I losing marks?'],
    ['Question 6: Are my answers fast enough?'],
    ['* Remember: This diagnostic analysis is MORE IMPORTANT than the test score!']
  ];
}

export function getSectionNotebookSheetData(sectionNotes: SectionNoteEntry[]): (string | number)[][] {
  return [
    ['SECTION-NUMBER NOTEBOOK (5-POINT LEGAL FRAMEWORK)'],
    ['Rule: For EVERY chapter/provision ask: Provision → Conditions → Exceptions → Consequence/Penalty → Case/Application'],
    [''],
    ['Subject', 'Section Number', 'Title / Concept', '1. Provision Details', '2. Conditions Required', '3. Exceptions', '4. Consequence / Penalty', '5. Case Law / Application'],
    ...sectionNotes.map((sn) => [
      SUBJECTS_MAP[sn.subject]?.name || sn.subject,
      sn.sectionNumber,
      sn.title,
      sn.provisions,
      sn.conditions,
      sn.exceptions,
      sn.penaltyConsequence,
      sn.caseApplication
    ])
  ];
}

export function getMistakeBookSheetData(mistakes: MistakeEntry[]): (string | number)[][] {
  return [
    ['MISTAKE BOOK & ERROR CORRECTION LOG'],
    ['Rule: Every single question or calculation you get wrong in solving past papers/mocks goes here.'],
    [''],
    ['ID', 'Subject', 'Topic / Chapter', 'Question Reference', 'Reason for Mistake', 'Correct Concept / Formula', 'Date Logged', 'Resolved Status'],
    ...mistakes.map((m, idx) => [
      `#${idx + 1}`,
      SUBJECTS_MAP[m.subject]?.name || m.subject,
      m.topic,
      m.questionRef,
      m.mistakeReason,
      m.correctConcept,
      m.dateAdded,
      m.resolved ? 'RESOLVED' : 'PENDING REVIEW'
    ])
  ];
}

export function getRevisionTrackerSheetData(
  progress: import('../types').SubjectProgress[],
  studyLogs: import('../types').StudyLogRecord[]
): (string | number)[][] {
  const totalHours = progress.reduce((acc, p) => acc + p.hoursCompleted, 0);
  const totalTarget = progress.reduce((acc, p) => acc + p.targetHours, 0);
  const avgConfidence = Math.round(
    progress.reduce((acc, p) => acc + p.confidencePercent, 0) / (progress.length || 1)
  );

  return [
    ['CMA FINAL REVISION TRACKER & STATUS DASHBOARD (TARGET: DEC 10TH)'],
    ['Overall Status:', `${totalHours} hrs completed of ${totalTarget} hrs target (${Math.round((totalHours/totalTarget)*100)}%)`, 'Average Confidence:', `${avgConfidence}%`],
    [''],
    ['Subject Code', 'Subject Name', 'Revision Status', 'Hours Done', 'Target Hours', '% Completed', 'Confidence Level', 'Key Notes / Last Updated'],
    ...progress.map((p) => [
      p.subjectId,
      p.name,
      p.status.toUpperCase(),
      p.hoursCompleted,
      p.targetHours,
      `${Math.round((p.hoursCompleted / p.targetHours) * 100)}%`,
      `${p.confidencePercent}%`,
      `${p.notes} (Updated: ${p.lastUpdated})`
    ]),
    [''],
    ['RECENT DAILY STUDY SESSIONS LOG'],
    ['Date', 'Hours Studied', 'Target Hours', 'Completed Modules', 'Reflection'],
    ...studyLogs.slice(0, 15).map((l) => [
      l.date,
      l.completedHours,
      l.targetHours,
      l.completedTasks.join('; '),
      l.reflection
    ])
  ];
}

export function getCompleteWorkbookSheetData(
  progress: import('../types').SubjectProgress[],
  studyLogs: import('../types').StudyLogRecord[],
  sectionNotes: SectionNoteEntry[],
  mistakes: MistakeEntry[]
): (string | number)[][] {
  return [
    ['========================================================================================'],
    ['CMA FINAL 83-DAY MASTER REVISION BLUEPRINT & EXAM COUNTDOWN (TARGET: DECEMBER 10TH)'],
    ['Motto: "WRITE WHAT YOU KNOW — No panic. No new material. No \'I haven\'t studied enough.\'"'],
    ['========================================================================================'],
    [''],
    ['--- TAB 1: REVISION TRACKER & STATUS ---'],
    ...getRevisionTrackerSheetData(progress, studyLogs),
    [''],
    [''],
    ['--- TAB 2: 83-DAY MASTER ROADMAP ---'],
    ...getRoadmapSheetData(),
    [''],
    [''],
    ['--- TAB 3: PHASE 2 HOURLY PROTOCOLS (CLC -> SFM -> DT -> SCM) ---'],
    ...getPhase2ProtocolSheetData(),
    [''],
    [''],
    ['--- TAB 4: SECTION NOTEBOOK (5-POINTS FRAMEWORK) ---'],
    ...getSectionNotebookSheetData(sectionNotes),
    [''],
    [''],
    ['--- TAB 5: MISTAKE BOOK ---'],
    ...getMistakeBookSheetData(mistakes)
  ];
}

export function downloadCompleteWorkbookCsv(
  filename: string,
  progress: import('../types').SubjectProgress[],
  studyLogs: import('../types').StudyLogRecord[],
  sectionNotes: SectionNoteEntry[],
  mistakes: MistakeEntry[]
) {
  const rows = getCompleteWorkbookSheetData(progress, studyLogs, sectionNotes, mistakes);
  downloadCsv(filename, rows);
}

export function rowsToCsv(rows: (string | number)[][]): string {
  return rows
    .map((row) =>
      row
        .map((val) => {
          const str = String(val ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    )
    .join('\n');
}

export function rowsToTsv(rows: (string | number)[][]): string {
  return rows
    .map((row) =>
      row.map((val) => String(val ?? '').replace(/\t/g, ' ').replace(/\n/g, ' ')).join('\t')
    )
    .join('\n');
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(rowsToCsv(rows));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
