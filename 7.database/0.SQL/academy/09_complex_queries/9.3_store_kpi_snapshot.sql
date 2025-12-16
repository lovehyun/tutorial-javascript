-- 교수별 과목 수 + 수강 인원(부하)
WITH course_cnt AS (
  SELECT professor_id, COUNT(*) AS cnt
  FROM courses
  GROUP BY professor_id
),
enroll_cnt AS (
  SELECT c.professor_id, COUNT(*) AS enrolled_cnt
  FROM courses c
  JOIN enrollments e ON e.course_id=c.course_id AND e.status='ENROLLED'
  GROUP BY c.professor_id
)
SELECT p.professor_id, p.name,
       COALESCE(cc.cnt,0) AS course_cnt,
       COALESCE(ec.enrolled_cnt,0) AS enrolled_cnt
FROM professors p
LEFT JOIN course_cnt cc ON cc.professor_id=p.professor_id
LEFT JOIN enroll_cnt ec ON ec.professor_id=p.professor_id
ORDER BY enrolled_cnt DESC, course_cnt DESC;
