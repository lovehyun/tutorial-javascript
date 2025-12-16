-- 파생테이블로 학과별 평균 점수(성적 있는 학생만)
WITH student_avg AS (
  SELECT e.student_id, AVG(g.score) AS avg_score
  FROM enrollments e JOIN grades g ON g.enroll_id=e.enroll_id
  GROUP BY e.student_id
)
SELECT s.dept_id, ROUND(AVG(sa.avg_score),2) AS dept_avg_score
FROM students s
JOIN student_avg sa ON sa.student_id=s.student_id
GROUP BY s.dept_id
ORDER BY dept_avg_score DESC;
