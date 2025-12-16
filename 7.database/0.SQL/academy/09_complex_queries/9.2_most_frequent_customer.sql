-- 가장 많은 과목을 듣는 학생(ENROLLED 기준)
SELECT e.student_id, COUNT(*) AS enrolled_cnt
FROM enrollments e
WHERE e.status='ENROLLED'
GROUP BY e.student_id
ORDER BY enrolled_cnt DESC
LIMIT 1;
