-- 학생 성적표: students + enrollments + courses + grades(LEFT)
SELECT s.student_id, s.name, c.title, e.status, g.score, g.letter
FROM students s
JOIN enrollments e ON e.student_id=s.student_id
JOIN courses c ON c.course_id=e.course_id
LEFT JOIN grades g ON g.enroll_id=e.enroll_id
ORDER BY s.student_id, c.course_id;
