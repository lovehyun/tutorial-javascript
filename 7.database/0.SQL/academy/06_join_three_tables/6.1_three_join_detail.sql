-- 학생별 수강 목록: students + enrollments + courses
SELECT s.student_id, s.name AS student_name,
       c.course_id, c.title, e.status
FROM students s
JOIN enrollments e ON e.student_id=s.student_id
JOIN courses c ON c.course_id=e.course_id
ORDER BY s.student_id, c.course_id;
