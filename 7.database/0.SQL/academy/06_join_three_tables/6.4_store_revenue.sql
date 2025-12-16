-- 교수별 담당 과목 수
SELECT p.professor_id, p.name, COUNT(c.course_id) AS course_cnt
FROM professors p
LEFT JOIN courses c ON c.professor_id=p.professor_id
GROUP BY p.professor_id, p.name
ORDER BY course_cnt DESC;
