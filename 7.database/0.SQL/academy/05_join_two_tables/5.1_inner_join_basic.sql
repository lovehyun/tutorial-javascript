-- 학생 + 학과
SELECT s.student_id, s.name, d.dept_name
FROM students s
JOIN departments d ON d.dept_id=s.dept_id
ORDER BY s.student_id;
