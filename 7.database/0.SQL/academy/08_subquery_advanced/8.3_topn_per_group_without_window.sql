-- 학과별 학생 평균점수 TOP1 (윈도우 함수 없이)
WITH student_avg AS (
  SELECT e.student_id, AVG(g.score) AS avg_score
  FROM enrollments e JOIN grades g ON g.enroll_id=e.enroll_id
  GROUP BY e.student_id
),
dept_student AS (
  SELECT s.dept_id, s.student_id, sa.avg_score
  FROM students s JOIN student_avg sa ON sa.student_id=s.student_id
)
SELECT ds.*
FROM dept_student ds
WHERE ds.avg_score = (
  SELECT MAX(x.avg_score) FROM dept_student x WHERE x.dept_id=ds.dept_id
)
ORDER BY ds.dept_id;
