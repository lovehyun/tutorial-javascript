PRAGMA foreign_keys=ON;
-- 목적: 최소 테이블로 관계 만들기(개념 연습)
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

CREATE TABLE students (student_id TEXT PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE courses (course_id TEXT PRIMARY KEY, title TEXT NOT NULL);
CREATE TABLE enrollments (
  enroll_id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES students(student_id),
  FOREIGN KEY(course_id) REFERENCES courses(course_id)
);
