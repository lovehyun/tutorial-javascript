-- 위험학생: F가 있거나 평균<70
WITH ss AS (
  SELECT e.student_id, g.score, g.letter
  FROM enrollments e JOIN grades g ON g.enroll_id=e.enroll_id
),
agg AS (
  SELECT student_id,
         AVG(score) AS avg_score,
         SUM(CASE WHEN letter='F' THEN 1 ELSE 0 END) AS f_cnt
  FROM ss
  GROUP BY student_id
)
SELECT s.student_id, s.name, a.avg_score, a.f_cnt
FROM students s JOIN agg a ON a.student_id=s.student_id
WHERE a.f_cnt >= 1 OR a.avg_score < 70
ORDER BY a.f_cnt DESC, a.avg_score ASC;
