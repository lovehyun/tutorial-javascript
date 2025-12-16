-- 교수별 담당 과목 수 TOP
SELECT professor_id, COUNT(*) AS course_cnt
FROM courses
GROUP BY professor_id
ORDER BY course_cnt DESC;
