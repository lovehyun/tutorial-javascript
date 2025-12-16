-- 학생별 평균 점수(성적 있는 과목 기준)
SELECT s.student_id, s.name, ROUND(AVG(g.score),2) AS avg_score
FROM students s
JOIN enrollments e ON e.student_id=s.student_id
JOIN grades g ON g.enroll_id=e.enroll_id
GROUP BY s.student_id, s.name
ORDER BY avg_score DESC;
