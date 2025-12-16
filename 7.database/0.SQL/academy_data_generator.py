#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Academy(학사) DB용 대용량 샘플 데이터 생성기 (SQLite3)

목표
- 수백~수천 명 규모의 학생/교수/과목/수강/성적 데이터를 "제약 조건(FK/체크)"을 지키면서 생성합니다.
- 생성된 데이터는 sqlite DB에 직접 INSERT 하거나, .sql 파일로 내보낼 수 있습니다.

사용 예시
1) DB에 직접 삽입 (권장)
    python academy_data_generator.py --db academy.db --students 2000 --professors 60 --courses 120 --seed 42

2) SQL 파일로만 생성 (나중에 .read로 실행)
    python academy_data_generator.py --out academy_bulk_insert.sql --students 5000 --seed 7

3) 특정 분포/옵션 조정
    python academy_data_generator.py --db academy.db --students 3000 --enroll-min 3 --enroll-max 7 --drop-rate 0.08 --seed 1

주의
- 이 스크립트는 "academy_init.sql로 스키마를 먼저 만든 뒤" 실행하는 것을 전제로 합니다.
  (departments/students/professors/courses/enrollments/grades 테이블)
- FK가 켜져 있으면(PRAGMA foreign_keys=ON) 제약이 어긋나면 바로 에러가 납니다.
  => 그래서 이 스크립트는 FK를 만족하도록 ID를 먼저 만들고 연결합니다.

환경변수 (선택)
- SQLITE_DB_PATH: 기본 DB 경로로 사용 가능
  예) set SQLITE_DB_PATH=academy.db  (Windows)
      export SQLITE_DB_PATH=academy.db (macOS/Linux)
"""
from __future__ import annotations

import argparse
import os
import random
import sqlite3
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Dict, List, Tuple

# 사용자가 원하던 스타일: 환경변수 로드 훅(프로젝트에서 공통으로 쓰기 좋게)
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    # dotenv가 없어도 실행되도록
    pass


def iso(d: date) -> str:
    return d.isoformat()


def pick_weighted(rng: random.Random, items: List[Tuple[str, float]]) -> str:
    """items: [(value, weight), ...]"""
    total = sum(w for _, w in items)
    x = rng.random() * total
    acc = 0.0
    for v, w in items:
        acc += w
        if x <= acc:
            return v
    return items[-1][0]


def clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


DEFAULT_DEPTS = [
    ("D01", "Computer Science"),
    ("D02", "Business"),
    ("D03", "Design"),
    ("D04", "Data Science"),
    ("D05", "Mechanical Eng"),
]

COURSE_TITLES_BY_DEPT = {
    "D01": ["Intro to Programming", "Databases", "AI Basics", "Computer Networks", "Operating Systems", "Web Dev", "Software Engineering"],
    "D02": ["Accounting", "Marketing", "Finance", "Business Analytics", "Management", "Entrepreneurship"],
    "D03": ["Design Thinking", "UX Research", "Visual Design", "Interaction Design", "Typography"],
    "D04": ["Statistics", "Data Mining", "Machine Learning", "Data Visualization", "Big Data Systems"],
    "D05": ["Statics", "Dynamics", "Thermodynamics", "Manufacturing", "Materials"],
}

SEMESTERS = ["2024-Fall", "2025-Spring", "2025-Fall"]


@dataclass
class Student:
    student_id: str
    name: str
    year: int
    dept_id: str
    entered_at: str


@dataclass
class Professor:
    professor_id: str
    name: str
    dept_id: str
    tenure_years: int


@dataclass
class Course:
    course_id: str
    title: str
    dept_id: str
    professor_id: str
    credits: int
    semester: str


@dataclass
class Enrollment:
    enroll_id: str
    student_id: str
    course_id: str
    enrolled_at: str
    status: str  # ENROLLED / DROPPED


@dataclass
class Grade:
    grade_id: str
    enroll_id: str
    score: float
    letter: str


class AcademyGenerator:
    def __init__(self, seed: int):
        self.rng = random.Random(seed)

    def gen_students(self, n: int, dept_ids: List[str], start_idx: int = 1) -> List[Student]:
        first = ["Kim", "Lee", "Park", "Choi", "Jung", "Oh", "Han", "Yoon", "Kang", "Lim", "Song", "Shin", "Cho"]
        second = ["Min", "Jae", "Su", "Yu", "Ha", "Jun", "Seo", "Ji", "Hye", "Woo", "Young", "Eun", "Hoon"]

        students: List[Student] = []
        base_date = date(2022, 3, 2)

        for i in range(start_idx, start_idx + n):
            sid = f"ST{i:05d}"
            name = f"{self.rng.choice(first)} {self.rng.choice(second)}"
            year = int(pick_weighted(self.rng, [("1", 0.28), ("2", 0.27), ("3", 0.24), ("4", 0.21)]))
            dept_id = self.rng.choice(dept_ids)

            entered = base_date + timedelta(days=365 * (4 - year) + self.rng.randint(-10, 10))
            students.append(Student(sid, name, year, dept_id, iso(entered)))
        return students

    def gen_professors(self, n: int, dept_ids: List[str], start_idx: int = 1) -> List[Professor]:
        lastnames = ["Ahn", "Bae", "Kim", "Lee", "Park", "Chung", "Kwon", "Ryu", "Jang", "Hwang"]
        profs: List[Professor] = []
        for i in range(start_idx, start_idx + n):
            pid = f"PR{i:04d}"
            name = f"Prof.{self.rng.choice(lastnames)}"
            dept_id = self.rng.choice(dept_ids)
            tenure = int(clamp(self.rng.gauss(6, 3), 0, 30))
            profs.append(Professor(pid, name, dept_id, tenure))
        return profs

    def gen_courses(self, n: int, dept_ids: List[str], professors: List[Professor], start_idx: int = 1) -> List[Course]:
        prof_by_dept: Dict[str, List[Professor]] = {d: [] for d in dept_ids}
        for p in professors:
            prof_by_dept[p.dept_id].append(p)

        courses: List[Course] = []
        used_titles = set()
        for i in range(start_idx, start_idx + n):
            cid = f"C{i:05d}"
            dept_id = self.rng.choice(dept_ids)
            title_pool = COURSE_TITLES_BY_DEPT.get(dept_id, ["Special Topics"])

            base_title = self.rng.choice(title_pool)
            suffix = ""
            if (base_title in used_titles) or (self.rng.random() < 0.25):
                suffix = f" ({self.rng.randint(1, 3)})"
            title = base_title + suffix
            used_titles.add(title)

            dept_profs = prof_by_dept.get(dept_id) or []
            professor = self.rng.choice(dept_profs) if dept_profs else self.rng.choice(professors)

            credits = self.rng.choice([1, 2, 3])
            semester = self.rng.choice(SEMESTERS)
            courses.append(Course(cid, title, dept_id, professor.professor_id, credits, semester))
        return courses

    def gen_enrollments_and_grades(
        self,
        students: List[Student],
        courses: List[Course],
        enroll_min: int,
        enroll_max: int,
        drop_rate: float,
        grade_rate: float,
        start_enroll_idx: int = 1,
        start_grade_idx: int = 1,
    ) -> Tuple[List[Enrollment], List[Grade]]:
        courses_by_sem: Dict[str, List[Course]] = {}
        for c in courses:
            courses_by_sem.setdefault(c.semester, []).append(c)

        enrollments: List[Enrollment] = []
        grades: List[Grade] = []
        e_idx = start_enroll_idx
        g_idx = start_grade_idx

        for s in students:
            sem = self.rng.choice(SEMESTERS)
            pool = courses_by_sem.get(sem, courses)

            k = self.rng.randint(enroll_min, enroll_max)
            chosen = self.rng.sample(pool, k=min(k, len(pool)))

            if "Spring" in sem:
                base = date(2025, 3, 1)
            elif "Fall" in sem:
                base = date(2025, 9, 1)
            else:
                base = date(2024, 9, 1)

            for c in chosen:
                enroll_id = f"E{e_idx:07d}"
                e_idx += 1

                enrolled_at = iso(base + timedelta(days=self.rng.randint(0, 14)))
                status = "DROPPED" if (self.rng.random() < drop_rate) else "ENROLLED"

                enrollments.append(Enrollment(enroll_id, s.student_id, c.course_id, enrolled_at, status))

                if status == "ENROLLED" and (self.rng.random() < grade_rate):
                    score = clamp(self.rng.gauss(78, 12), 0, 100)
                    letter = self.score_to_letter(score)
                    grade_id = f"G{g_idx:07d}"
                    g_idx += 1
                    grades.append(Grade(grade_id, enroll_id, round(score, 1), letter))

        return enrollments, grades

    @staticmethod
    def score_to_letter(score: float) -> str:
        if score >= 90:
            return "A"
        if score >= 80:
            return "B"
        if score >= 70:
            return "C"
        if score >= 60:
            return "D"
        return "F"


def ensure_schema_exists(conn: sqlite3.Connection) -> None:
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='students'")
    if cur.fetchone() is None:
        raise RuntimeError("스키마가 없습니다. academy_init.sql로 먼저 테이블을 생성하세요.")


def bulk_insert(conn: sqlite3.Connection, depts, students, profs, courses, enrollments, grades) -> None:
    cur = conn.cursor()
    cur.execute("PRAGMA foreign_keys = ON;")
    cur.execute("BEGIN;")

    cur.executemany(
        "INSERT OR IGNORE INTO departments(dept_id, dept_name) VALUES(?,?)",
        depts,
    )

    cur.executemany(
        "INSERT INTO students(student_id, name, year, dept_id, entered_at) VALUES(?,?,?,?,?)",
        [(s.student_id, s.name, s.year, s.dept_id, s.entered_at) for s in students],
    )

    cur.executemany(
        "INSERT INTO professors(professor_id, name, dept_id, tenure_years) VALUES(?,?,?,?)",
        [(p.professor_id, p.name, p.dept_id, p.tenure_years) for p in profs],
    )

    cur.executemany(
        "INSERT INTO courses(course_id, title, dept_id, professor_id, credits, semester) VALUES(?,?,?,?,?,?)",
        [(c.course_id, c.title, c.dept_id, c.professor_id, c.credits, c.semester) for c in courses],
    )

    cur.executemany(
        "INSERT INTO enrollments(enroll_id, student_id, course_id, enrolled_at, status) VALUES(?,?,?,?,?)",
        [(e.enroll_id, e.student_id, e.course_id, e.enrolled_at, e.status) for e in enrollments],
    )

    cur.executemany(
        "INSERT INTO grades(grade_id, enroll_id, score, letter) VALUES(?,?,?,?)",
        [(g.grade_id, g.enroll_id, g.score, g.letter) for g in grades],
    )

    conn.commit()


def export_sql(path: str, depts, students, profs, courses, enrollments, grades) -> None:
    def esc(s: str) -> str:
        return s.replace("'", "''")

    lines: List[str] = []
    lines.append("PRAGMA foreign_keys = ON;")
    lines.append("BEGIN;")
    lines.append("-- departments")
    for d_id, d_name in depts:
        lines.append(f"INSERT OR IGNORE INTO departments(dept_id, dept_name) VALUES('{esc(d_id)}','{esc(d_name)}');")

    lines.append("-- students")
    for s in students:
        lines.append(
            "INSERT INTO students(student_id,name,year,dept_id,entered_at) VALUES("
            f"'{esc(s.student_id)}','{esc(s.name)}',{s.year},'{esc(s.dept_id)}','{esc(s.entered_at)}');"
        )

    lines.append("-- professors")
    for p in profs:
        lines.append(
            "INSERT INTO professors(professor_id,name,dept_id,tenure_years) VALUES("
            f"'{esc(p.professor_id)}','{esc(p.name)}','{esc(p.dept_id)}',{p.tenure_years});"
        )

    lines.append("-- courses")
    for c in courses:
        lines.append(
            "INSERT INTO courses(course_id,title,dept_id,professor_id,credits,semester) VALUES("
            f"'{esc(c.course_id)}','{esc(c.title)}','{esc(c.dept_id)}','{esc(c.professor_id)}',{c.credits},'{esc(c.semester)}');"
        )

    lines.append("-- enrollments")
    for e in enrollments:
        lines.append(
            "INSERT INTO enrollments(enroll_id,student_id,course_id,enrolled_at,status) VALUES("
            f"'{esc(e.enroll_id)}','{esc(e.student_id)}','{esc(e.course_id)}','{esc(e.enrolled_at)}','{esc(e.status)}');"
        )

    lines.append("-- grades")
    for g in grades:
        lines.append(
            "INSERT INTO grades(grade_id,enroll_id,score,letter) VALUES("
            f"'{esc(g.grade_id)}','{esc(g.enroll_id)}',{g.score},'{esc(g.letter)}');"
        )

    lines.append("COMMIT;")

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Academy DB 대용량 샘플 데이터 생성기(SQLite3)",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )

    p.add_argument("--db", default=os.getenv("SQLITE_DB_PATH", ""), help="대상 SQLite DB 경로(직접 삽입). 비우면 --out만 사용")
    p.add_argument("--out", default="", help="INSERT SQL 파일로 내보낼 경로(선택)")

    p.add_argument("--seed", type=int, default=42, help="난수 시드(재현 가능)")

    p.add_argument("--students", type=int, default=1000, help="학생 수")
    p.add_argument("--professors", type=int, default=50, help="교수 수")
    p.add_argument("--courses", type=int, default=120, help="과목 수")

    p.add_argument("--enroll-min", type=int, default=3, help="학생 1명당 최소 수강 과목 수")
    p.add_argument("--enroll-max", type=int, default=6, help="학생 1명당 최대 수강 과목 수")

    p.add_argument("--drop-rate", type=float, default=0.07, help="수강 중 드랍 비율(0~1)")
    p.add_argument("--grade-rate", type=float, default=0.85, help="성적이 실제로 생성되는 비율(ENROLLED 중 일부는 미채점)")

    p.add_argument("--depts", type=int, default=len(DEFAULT_DEPTS), help="사용할 학과 개수(기본 학과 리스트에서 앞쪽부터 사용)")
    p.add_argument("--vacuum", action="store_true", help="삽입 후 VACUUM 실행(크기 최적화, 시간 소요)")

    return p.parse_args()


def main():
    args = parse_args()

    if args.enroll_min > args.enroll_max:
        raise SystemExit("--enroll-min은 --enroll-max보다 클 수 없습니다.")
    if not (0.0 <= args.drop_rate <= 1.0):
        raise SystemExit("--drop-rate는 0~1 사이여야 합니다.")
    if not (0.0 <= args.grade_rate <= 1.0):
        raise SystemExit("--grade-rate는 0~1 사이여야 합니다.")
    if args.depts < 1 or args.depts > len(DEFAULT_DEPTS):
        raise SystemExit(f"--depts는 1~{len(DEFAULT_DEPTS)} 범위여야 합니다.")

    depts = DEFAULT_DEPTS[: args.depts]
    dept_ids = [d[0] for d in depts]

    gen = AcademyGenerator(seed=args.seed)

    students = gen.gen_students(args.students, dept_ids, start_idx=1)
    professors = gen.gen_professors(args.professors, dept_ids, start_idx=1)
    courses = gen.gen_courses(args.courses, dept_ids, professors, start_idx=1)
    enrollments, grades = gen.gen_enrollments_and_grades(
        students=students,
        courses=courses,
        enroll_min=args.enroll_min,
        enroll_max=args.enroll_max,
        drop_rate=args.drop_rate,
        grade_rate=args.grade_rate,
        start_enroll_idx=1,
        start_grade_idx=1,
    )

    print("=== 생성 요약 ===")
    print(f"departments : {len(depts)}")
    print(f"students    : {len(students)}")
    print(f"professors  : {len(professors)}")
    print(f"courses     : {len(courses)}")
    print(f"enrollments : {len(enrollments)}")
    print(f"grades      : {len(grades)}")

    if args.out:
        export_sql(args.out, depts, students, professors, courses, enrollments, grades)
        print(f"[OK] SQL 파일 생성: {args.out}")

    if args.db:
        conn = sqlite3.connect(args.db)
        try:
            ensure_schema_exists(conn)
            bulk_insert(conn, depts, students, professors, courses, enrollments, grades)
            print(f"[OK] DB 삽입 완료: {args.db}")

            if args.vacuum:
                conn.execute("VACUUM;")
                print("[OK] VACUUM 완료")
        finally:
            conn.close()

    if not args.db and not args.out:
        print("아무 것도 하지 않았습니다. --db 또는 --out 중 하나는 지정하세요.")


if __name__ == "__main__":
    main()
