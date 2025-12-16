-- 수강 + 성적(없을 수도)
SELECT e.enroll_id, e.student_id, e.course_id, e.status,
       g.score, g.letter
FROM enrollments e
LEFT JOIN grades g ON g.enroll_id=e.enroll_id
ORDER BY e.enroll_id;
