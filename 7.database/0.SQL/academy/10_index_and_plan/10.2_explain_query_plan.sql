EXPLAIN QUERY PLAN
SELECT s.student_id, s.name, AVG(g.score) AS avg_score
FROM students s
JOIN enrollments e ON e.student_id=s.student_id
JOIN grades g ON g.enroll_id=e.enroll_id
GROUP BY s.student_id, s.name;
