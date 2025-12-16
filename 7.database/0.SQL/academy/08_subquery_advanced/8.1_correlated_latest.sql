-- 학생별 최고 점수 과목 1개(상관 서브쿼리)
WITH sg AS (
  SELECT e.student_id, e.course_id, g.score
  FROM enrollments e
  JOIN grades g ON g.enroll_id=e.enroll_id
)
SELECT sg1.*
FROM sg sg1
WHERE sg1.score = (
  SELECT MAX(sg2.score) FROM sg sg2 WHERE sg2.student_id=sg1.student_id
)
ORDER BY sg1.student_id;
