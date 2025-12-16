-- 학생 목록에 수강 과목 수를 붙이기(SELECT 서브쿼리)
SELECT
  s.student_id,
  s.name,
  (SELECT COUNT(*) FROM enrollments e WHERE e.student_id=s.student_id AND e.status='ENROLLED') AS enrolled_cnt
FROM students s
ORDER BY enrolled_cnt DESC;
