-- 수강 중인 과목이 하나라도 있는 학생(EXISTS)
SELECT s.student_id, s.name
FROM students s
WHERE EXISTS (
  SELECT 1 FROM enrollments e
  WHERE e.student_id=s.student_id AND e.status='ENROLLED'
)
ORDER BY s.student_id;
