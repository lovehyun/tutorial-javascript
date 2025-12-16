#!/usr/bin/env node
/**
 * Academy(학사) DB용 대용량 샘플 데이터 생성기 (Node.js + SQLite)
 *
 * 목표
 * - 수백~수천 명 규모의 학생/교수/과목/수강/성적 데이터를 FK 제약을 지키며 생성합니다.
 * - 생성된 데이터는 SQLite DB에 직접 INSERT 하거나, .sql 파일로 내보낼 수 있습니다.
 *
 * 준비물(권장)
 * - Node.js 18+
 * - 패키지 설치:
 *     npm i better-sqlite3 dotenv
 *
 * 사용 예시
 * 1) DB에 직접 삽입 (권장)
 *     node academy_data_generator.js --db academy.db --students 2000 --professors 60 --courses 120 --seed 42
 *
 * 2) SQL 파일로만 생성 (나중에 .read로 실행)
 *     node academy_data_generator.js --out academy_bulk_insert.sql --students 5000 --seed 7
 *
 * 3) 특정 분포/옵션 조정
 *     node academy_data_generator.js --db academy.db --students 3000 --enroll-min 3 --enroll-max 7 --drop-rate 0.08 --seed 1
 *
 * 주의
 * - academy_init.sql로 스키마를 먼저 만든 뒤 실행하세요.
 *   (departments/students/professors/courses/enrollments/grades 테이블)
 *
 * 환경변수(선택)
 * - SQLITE_DB_PATH: 기본 DB 경로
 *     set SQLITE_DB_PATH=academy.db     (Windows)
 *     export SQLITE_DB_PATH=academy.db  (macOS/Linux)
 */

'use strict';

const fs = require('fs');
const path = require('path');

// env 로드(요구사항 스타일)
try {
  require('dotenv').config();
} catch (_) {
  // dotenv 없어도 실행되도록
}

// better-sqlite3는 동기 API로 대량 삽입에 유리
let Database;
try {
  Database = require('better-sqlite3');
} catch (e) {
  console.error('[ERROR] better-sqlite3가 필요합니다. 먼저 설치하세요: npm i better-sqlite3 dotenv');
  process.exit(1);
}

/**
 * 간단한 재현 가능한 RNG (mulberry32)
 * - 외부 라이브러리 없이 seed 기반 랜덤을 만들기 위해 사용
 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randint(rng, lo, hi) {
  // [lo, hi]
  return lo + Math.floor(rng() * (hi - lo + 1));
}

function choice(rng, arr) {
  return arr[randint(rng, 0, arr.length - 1)];
}

function sample(rng, arr, k) {
  // Fisher-Yates shuffle 부분 사용 (간단)
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(k, a.length));
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

function isoDate(d) {
  // d: JS Date
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function pickWeighted(rng, items) {
  // items: [{v, w}, ...]
  const total = items.reduce((s, it) => s + it.w, 0);
  const x = rng() * total;
  let acc = 0;
  for (const it of items) {
    acc += it.w;
    if (x <= acc) return it.v;
  }
  return items[items.length - 1].v;
}

// Box-Muller로 정규분포 근사
function randn(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function gaussian(rng, mean, std) {
  return mean + randn(rng) * std;
}

const DEFAULT_DEPTS = [
  ['D01', 'Computer Science'],
  ['D02', 'Business'],
  ['D03', 'Design'],
  ['D04', 'Data Science'],
  ['D05', 'Mechanical Eng'],
];

const COURSE_TITLES_BY_DEPT = {
  D01: ['Intro to Programming', 'Databases', 'AI Basics', 'Computer Networks', 'Operating Systems', 'Web Dev', 'Software Engineering'],
  D02: ['Accounting', 'Marketing', 'Finance', 'Business Analytics', 'Management', 'Entrepreneurship'],
  D03: ['Design Thinking', 'UX Research', 'Visual Design', 'Interaction Design', 'Typography'],
  D04: ['Statistics', 'Data Mining', 'Machine Learning', 'Data Visualization', 'Big Data Systems'],
  D05: ['Statics', 'Dynamics', 'Thermodynamics', 'Manufacturing', 'Materials'],
};

const SEMESTERS = ['2024-Fall', '2025-Spring', '2025-Fall'];

function scoreToLetter(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// ------------------------
// CLI 파싱(의존성 없이 최소 구현)
// ------------------------
function parseArgs(argv) {
  const args = {
    db: process.env.SQLITE_DB_PATH || '',
    out: '',
    seed: 42,
    students: 1000,
    professors: 50,
    courses: 120,
    enrollMin: 3,
    enrollMax: 6,
    dropRate: 0.07,
    gradeRate: 0.85,
    depts: DEFAULT_DEPTS.length,
    vacuum: false,
  };

  const get = (i) => (i + 1 < argv.length ? argv[i + 1] : '');

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--db') args.db = get(i++);
    else if (a === '--out') args.out = get(i++);
    else if (a === '--seed') args.seed = Number(get(i++));
    else if (a === '--students') args.students = Number(get(i++));
    else if (a === '--professors') args.professors = Number(get(i++));
    else if (a === '--courses') args.courses = Number(get(i++));
    else if (a === '--enroll-min') args.enrollMin = Number(get(i++));
    else if (a === '--enroll-max') args.enrollMax = Number(get(i++));
    else if (a === '--drop-rate') args.dropRate = Number(get(i++));
    else if (a === '--grade-rate') args.gradeRate = Number(get(i++));
    else if (a === '--depts') args.depts = Number(get(i++));
    else if (a === '--vacuum') args.vacuum = true;
    else if (a === '-h' || a === '--help') {
      printHelp();
      process.exit(0);
    }
  }
  return args;
}

function printHelp() {
  console.log(`
Academy DB 대용량 샘플 데이터 생성기(Node.js)

옵션:
  --db <path>         대상 SQLite DB 경로(직접 삽입). 비우면 --out만 사용
  --out <path>        INSERT SQL 파일 출력 경로(선택)
  --seed <int>        난수 시드(재현 가능)
  --students <int>    학생 수
  --professors <int>  교수 수
  --courses <int>     과목 수
  --enroll-min <int>  학생 1명당 최소 수강 과목 수
  --enroll-max <int>  학생 1명당 최대 수강 과목 수
  --drop-rate <0..1>  드랍 비율
  --grade-rate <0..1> 성적 생성 비율(ENROLLED 중 일부는 미채점)
  --depts <int>       사용할 학과 개수(기본 학과 목록에서 앞쪽부터)
  --vacuum            삽입 후 VACUUM 실행(시간 소요)
  -h, --help          도움말
`);
}

// ------------------------
// 데이터 생성
// ------------------------
function genStudents(rng, n, deptIds) {
  const first = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Oh', 'Han', 'Yoon', 'Kang', 'Lim', 'Song', 'Shin', 'Cho'];
  const second = ['Min', 'Jae', 'Su', 'Yu', 'Ha', 'Jun', 'Seo', 'Ji', 'Hye', 'Woo', 'Young', 'Eun', 'Hoon'];

  const base = new Date(2022, 2, 2); // 2022-03-02 (month 0-index)
  const out = [];

  for (let i = 1; i <= n; i++) {
    const studentId = `ST${String(i).padStart(5, '0')}`;
    const name = `${choice(rng, first)} ${choice(rng, second)}`;
    const year = Number(pickWeighted(rng, [{ v: '1', w: 0.28 }, { v: '2', w: 0.27 }, { v: '3', w: 0.24 }, { v: '4', w: 0.21 }]));
    const deptId = choice(rng, deptIds);

    const entered = new Date(base.getTime());
    entered.setDate(entered.getDate() + 365 * (4 - year) + randint(rng, -10, 10));

    out.push({ student_id: studentId, name, year, dept_id: deptId, entered_at: isoDate(entered) });
  }
  return out;
}

function genProfessors(rng, n, deptIds) {
  const lastnames = ['Ahn', 'Bae', 'Kim', 'Lee', 'Park', 'Chung', 'Kwon', 'Ryu', 'Jang', 'Hwang'];
  const out = [];
  for (let i = 1; i <= n; i++) {
    const professorId = `PR${String(i).padStart(4, '0')}`;
    const name = `Prof.${choice(rng, lastnames)}`;
    const deptId = choice(rng, deptIds);
    const tenureYears = Math.round(clamp(gaussian(rng, 6, 3), 0, 30));
    out.push({ professor_id: professorId, name, dept_id: deptId, tenure_years: tenureYears });
  }
  return out;
}

function genCourses(rng, n, deptIds, professors) {
  const profByDept = new Map();
  for (const d of deptIds) profByDept.set(d, []);
  for (const p of professors) {
    if (!profByDept.has(p.dept_id)) profByDept.set(p.dept_id, []);
    profByDept.get(p.dept_id).push(p);
  }

  const used = new Set();
  const out = [];
  for (let i = 1; i <= n; i++) {
    const courseId = `C${String(i).padStart(5, '0')}`;
    const deptId = choice(rng, deptIds);
    const pool = COURSE_TITLES_BY_DEPT[deptId] || ['Special Topics'];

    const baseTitle = choice(rng, pool);
    let suffix = '';
    if (used.has(baseTitle) || rng() < 0.25) suffix = ` (${randint(rng, 1, 3)})`;
    const title = baseTitle + suffix;
    used.add(title);

    const deptProfs = profByDept.get(deptId) || [];
    const professor = deptProfs.length ? choice(rng, deptProfs) : choice(rng, professors);

    const credits = choice(rng, [1, 2, 3]);
    const semester = choice(rng, SEMESTERS);

    out.push({ course_id: courseId, title, dept_id: deptId, professor_id: professor.professor_id, credits, semester });
  }
  return out;
}

function genEnrollmentsAndGrades(rng, students, courses, opts) {
  const { enrollMin, enrollMax, dropRate, gradeRate } = opts;

  const coursesBySem = new Map();
  for (const c of courses) {
    if (!coursesBySem.has(c.semester)) coursesBySem.set(c.semester, []);
    coursesBySem.get(c.semester).push(c);
  }

  const enrollments = [];
  const grades = [];
  let eIdx = 1;
  let gIdx = 1;

  for (const s of students) {
    const sem = choice(rng, SEMESTERS);
    const pool = coursesBySem.get(sem) || courses;
    const k = randint(rng, enrollMin, enrollMax);
    const chosen = sample(rng, pool, k);

    let base;
    if (sem.includes('Spring')) base = new Date(2025, 2, 1);       // 2025-03-01
    else if (sem.includes('Fall')) base = new Date(2025, 8, 1);    // 2025-09-01
    else base = new Date(2024, 8, 1);                              // 2024-09-01

    for (const c of chosen) {
      const enrollId = `E${String(eIdx).padStart(7, '0')}`;
      eIdx += 1;

      const enrolledAt = new Date(base.getTime());
      enrolledAt.setDate(enrolledAt.getDate() + randint(rng, 0, 14));

      const status = rng() < dropRate ? 'DROPPED' : 'ENROLLED';
      enrollments.push({
        enroll_id: enrollId,
        student_id: s.student_id,
        course_id: c.course_id,
        enrolled_at: isoDate(enrolledAt),
        status,
      });

      if (status === 'ENROLLED' && rng() < gradeRate) {
        const score = clamp(gaussian(rng, 78, 12), 0, 100);
        const letter = scoreToLetter(score);
        const gradeId = `G${String(gIdx).padStart(7, '0')}`;
        gIdx += 1;
        grades.push({ grade_id: gradeId, enroll_id: enrollId, score: Math.round(score * 10) / 10, letter });
      }
    }
  }

  return { enrollments, grades };
}

// ------------------------
// DB / SQL 출력
// ------------------------
function ensureSchemaExists(db) {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='students'").get();
  if (!row) {
    throw new Error('스키마가 없습니다. academy_init.sql로 먼저 테이블을 생성하세요.');
  }
}

function bulkInsert(db, depts, students, professors, courses, enrollments, grades) {
  db.pragma('foreign_keys = ON');

  const insertDept = db.prepare("INSERT OR IGNORE INTO departments(dept_id, dept_name) VALUES(?, ?)");
  const insertStudent = db.prepare("INSERT INTO students(student_id, name, year, dept_id, entered_at) VALUES(?, ?, ?, ?, ?)");
  const insertProfessor = db.prepare("INSERT INTO professors(professor_id, name, dept_id, tenure_years) VALUES(?, ?, ?, ?)");
  const insertCourse = db.prepare("INSERT INTO courses(course_id, title, dept_id, professor_id, credits, semester) VALUES(?, ?, ?, ?, ?, ?)");
  const insertEnroll = db.prepare("INSERT INTO enrollments(enroll_id, student_id, course_id, enrolled_at, status) VALUES(?, ?, ?, ?, ?)");
  const insertGrade = db.prepare("INSERT INTO grades(grade_id, enroll_id, score, letter) VALUES(?, ?, ?, ?)");

  const tx = db.transaction(() => {
    for (const d of depts) insertDept.run(d[0], d[1]);
    for (const s of students) insertStudent.run(s.student_id, s.name, s.year, s.dept_id, s.entered_at);
    for (const p of professors) insertProfessor.run(p.professor_id, p.name, p.dept_id, p.tenure_years);
    for (const c of courses) insertCourse.run(c.course_id, c.title, c.dept_id, c.professor_id, c.credits, c.semester);
    for (const e of enrollments) insertEnroll.run(e.enroll_id, e.student_id, e.course_id, e.enrolled_at, e.status);
    for (const g of grades) insertGrade.run(g.grade_id, g.enroll_id, g.score, g.letter);
  });

  tx();
}

function exportSql(outPath, depts, students, professors, courses, enrollments, grades) {
  const esc = (s) => String(s).replace(/'/g, "''");

  const lines = [];
  lines.push('PRAGMA foreign_keys = ON;');
  lines.push('BEGIN;');

  lines.push('-- departments');
  for (const [id, name] of depts) {
    lines.push(`INSERT OR IGNORE INTO departments(dept_id, dept_name) VALUES('${esc(id)}','${esc(name)}');`);
  }

  lines.push('-- students');
  for (const s of students) {
    lines.push(
      `INSERT INTO students(student_id,name,year,dept_id,entered_at) VALUES(` +
      `'${esc(s.student_id)}','${esc(s.name)}',${s.year},'${esc(s.dept_id)}','${esc(s.entered_at)}');`
    );
  }

  lines.push('-- professors');
  for (const p of professors) {
    lines.push(
      `INSERT INTO professors(professor_id,name,dept_id,tenure_years) VALUES(` +
      `'${esc(p.professor_id)}','${esc(p.name)}','${esc(p.dept_id)}',${p.tenure_years});`
    );
  }

  lines.push('-- courses');
  for (const c of courses) {
    lines.push(
      `INSERT INTO courses(course_id,title,dept_id,professor_id,credits,semester) VALUES(` +
      `'${esc(c.course_id)}','${esc(c.title)}','${esc(c.dept_id)}','${esc(c.professor_id)}',${c.credits},'${esc(c.semester)}');`
    );
  }

  lines.push('-- enrollments');
  for (const e of enrollments) {
    lines.push(
      `INSERT INTO enrollments(enroll_id,student_id,course_id,enrolled_at,status) VALUES(` +
      `'${esc(e.enroll_id)}','${esc(e.student_id)}','${esc(e.course_id)}','${esc(e.enrolled_at)}','${esc(e.status)}');`
    );
  }

  lines.push('-- grades');
  for (const g of grades) {
    lines.push(
      `INSERT INTO grades(grade_id,enroll_id,score,letter) VALUES(` +
      `'${esc(g.grade_id)}','${esc(g.enroll_id)}',${g.score},'${esc(g.letter)}');`
    );
  }

  lines.push('COMMIT;');
  fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf-8');
}

// ------------------------
// main
// ------------------------
(function main() {
  const args = parseArgs(process.argv);

  if (args.enrollMin > args.enrollMax) {
    console.error('[ERROR] --enroll-min은 --enroll-max보다 클 수 없습니다.');
    process.exit(1);
  }
  if (!(0 <= args.dropRate && args.dropRate <= 1)) {
    console.error('[ERROR] --drop-rate는 0~1 사이여야 합니다.');
    process.exit(1);
  }
  if (!(0 <= args.gradeRate && args.gradeRate <= 1)) {
    console.error('[ERROR] --grade-rate는 0~1 사이여야 합니다.');
    process.exit(1);
  }
  if (args.depts < 1 || args.depts > DEFAULT_DEPTS.length) {
    console.error(`[ERROR] --depts는 1~${DEFAULT_DEPTS.length} 범위여야 합니다.`);
    process.exit(1);
  }

  const depts = DEFAULT_DEPTS.slice(0, args.depts);
  const deptIds = depts.map((d) => d[0]);

  const rng = mulberry32(args.seed);

  const students = genStudents(rng, args.students, deptIds);
  const professors = genProfessors(rng, args.professors, deptIds);
  const courses = genCourses(rng, args.courses, deptIds, professors);
  const { enrollments, grades } = genEnrollmentsAndGrades(rng, students, courses, {
    enrollMin: args.enrollMin,
    enrollMax: args.enrollMax,
    dropRate: args.dropRate,
    gradeRate: args.gradeRate,
  });

  console.log('=== 생성 요약 ===');
  console.log(`departments : ${depts.length}`);
  console.log(`students    : ${students.length}`);
  console.log(`professors  : ${professors.length}`);
  console.log(`courses     : ${courses.length}`);
  console.log(`enrollments : ${enrollments.length}`);
  console.log(`grades      : ${grades.length}`);

  if (args.out) {
    exportSql(args.out, depts, students, professors, courses, enrollments, grades);
    console.log(`[OK] SQL 파일 생성: ${args.out}`);
  }

  if (args.db) {
    const db = new Database(args.db);
    try {
      ensureSchemaExists(db);
      bulkInsert(db, depts, students, professors, courses, enrollments, grades);
      console.log(`[OK] DB 삽입 완료: ${args.db}`);

      if (args.vacuum) {
        db.exec('VACUUM;');
        console.log('[OK] VACUUM 완료');
      }
    } finally {
      db.close();
    }
  }

  if (!args.db && !args.out) {
    console.log('아무 것도 하지 않았습니다. --db 또는 --out 중 하나는 지정하세요.');
  }
})();
