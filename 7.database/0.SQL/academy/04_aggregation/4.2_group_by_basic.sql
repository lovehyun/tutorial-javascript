-- 학과별 학생 수
SELECT dept_id, COUNT(*) AS student_cnt
FROM students
GROUP BY dept_id
ORDER BY student_cnt DESC;
