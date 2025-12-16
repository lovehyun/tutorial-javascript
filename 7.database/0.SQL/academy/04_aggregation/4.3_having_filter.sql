-- 수강 인원 2명 이상 과목
SELECT course_id, COUNT(*) AS enrolled_cnt
FROM enrollments
WHERE status='ENROLLED'
GROUP BY course_id
HAVING COUNT(*) >= 2
ORDER BY enrolled_cnt DESC;
