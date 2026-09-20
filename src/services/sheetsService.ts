import { getAccessToken } from './auth';
import { PHASES, PHASE_2_SUBJECT_SCHEDULE, PHASE_3_SCHEDULE, PHASE_4_ROTATION, PHASE_5_FINAL_10_DAYS, SUBJECTS_MAP } from '../data/scheduleData';
import { SectionNoteEntry, MistakeEntry } from '../types';

export interface ExportToSheetsResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
}

export async function exportRevisionPlanToGoogleSheets(
  sectionNotes: SectionNoteEntry[],
  mistakes: MistakeEntry[]
): Promise<ExportToSheetsResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('You must be signed in with Google to export to Google Sheets.');
  }

  // 1. Prepare sheet data
  // Sheet 1: 81-Day Journey & Phases
  const roadmapRows: (string | number)[][] = [
    ['81-DAY REVISION JOURNEY & EXAM COUNTDOWN (TARGET: DECEMBER 10TH)'],
    ['Motto: "WRITE WHAT YOU KNOW — No panic. No new material. You go in with the preparation built over 80+ days."'],
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
    ['Dates', 'Days', 'Subject Code', 'Subject Name', 'Study Rules'],
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
    ['DECEMBER 10TH — EXAM DAY', 'WRITE WHAT YOU KNOW 🔥', 'Paper begins', 'Enter with full confidence and calmness']
  ];

  // Sheet 2: Phase 1 Daily Protocol (First Revision)
  const phase2Rows: (string | number)[][] = [
    ['PHASE 1: FIRST REVISION — HOURLY PROTOCOLS & CORE METHODOLOGY (Sept 20 - Oct 18)'],
    ['This is your most important revision starting tomorrow. Understanding + Rebuilding.'],
    [''],
    ['Subject', 'Dates', 'Duration', 'Daily Hours', 'Golden Directive', 'Deliverable / Output Notebook'],
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

  // Sheet 3: Section Number Notebook (Provision -> Conditions -> Exceptions -> Consequence -> Case)
  const sectionRows: (string | number)[][] = [
    ['SECTION-NUMBER NOTEBOOK (5-POINT LEGAL FRAMEWORK)'],
    ['Rule: For EVERY chapter/provision ask: Provision → Conditions → Exceptions → Consequence/Penalty → Case/Application'],
    [''],
    ['Subject', 'Section Number', 'Title / Concept', 'Provision Details', 'Conditions Required', 'Exceptions', 'Consequence / Penalty', 'Case Law / Practical Application'],
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

  // Sheet 4: Mistake Book
  const mistakeRows: (string | number)[][] = [
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

  // 2. Create the Spreadsheet using Sheets API
  const createPayload = {
    properties: {
      title: `CMA Final 83-Day Revision Plan & Countdown (Dec 10 Exam)`
    },
    sheets: [
      {
        properties: {
          title: '83-Day Roadmap',
          gridProperties: { frozenRowCount: 4 }
        }
      },
      {
        properties: {
          title: 'Phase 2 Daily Protocol',
          gridProperties: { frozenRowCount: 4 }
        }
      },
      {
        properties: {
          title: 'Section Notebook (5-Points)',
          gridProperties: { frozenRowCount: 4 }
        }
      },
      {
        properties: {
          title: 'Mistake Book',
          gridProperties: { frozenRowCount: 4 }
        }
      }
    ]
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createPayload)
  });

  if (!createRes.ok) {
    const errJson = await createRes.json().catch(() => ({}));
    const message = errJson?.error?.message || createRes.statusText;
    throw new Error(`Google Sheets API error (${createRes.status}): ${message}`);
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl = createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 3. Populate data into the created sheets
  const updateDataPayload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: "'83-Day Roadmap'!A1",
        values: roadmapRows
      },
      {
        range: "'Phase 2 Daily Protocol'!A1",
        values: phase2Rows
      },
      {
        range: "'Section Notebook (5-Points)'!A1",
        values: sectionRows
      },
      {
        range: "'Mistake Book'!A1",
        values: mistakeRows
      }
    ]
  };

  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateDataPayload)
    }
  );

  if (!updateRes.ok) {
    console.warn('Batch update values partially failed, spreadsheet created:', spreadsheetUrl);
  }

  return {
    spreadsheetId,
    spreadsheetUrl
  };
}
