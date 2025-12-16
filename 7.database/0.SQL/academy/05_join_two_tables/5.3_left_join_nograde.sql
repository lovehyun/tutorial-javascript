-- '성적이 없는 수강' 찾기(= 미채점)
SELECT e.enroll_id, e.student_id, e.course_id
FROM enrollments e
LEFT JOIN grades g ON g.enroll_id=e.enroll_id
WHERE g.grade_id IS NULL
ORDER BY e.enroll_id;
