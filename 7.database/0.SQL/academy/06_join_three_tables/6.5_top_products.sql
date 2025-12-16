-- 인기 과목 TOP 3(수강 인원 기준)
SELECT c.course_id, c.title, COUNT(e.enroll_id) AS enrolled_cnt
FROM courses c
JOIN enrollments e ON e.course_id=c.course_id AND e.status='ENROLLED'
GROUP BY c.course_id, c.title
ORDER BY enrolled_cnt DESC
LIMIT 3;
