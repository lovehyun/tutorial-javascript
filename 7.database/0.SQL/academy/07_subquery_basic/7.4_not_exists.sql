-- 성적이 하나도 없는 학생(NOT EXISTS)
SELECT s.student_id, s.name
FROM students s
WHERE NOT EXISTS (
  SELECT 1
  FROM enrollments e JOIN grades g ON g.enroll_id=e.enroll_id
  WHERE e.student_id=s.student_id
)
ORDER BY s.student_id;
