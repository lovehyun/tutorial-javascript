-- 인덱스 예시
CREATE INDEX IF NOT EXISTS idx_enroll_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enroll_course  ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_grade_enroll   ON grades(enroll_id);
