-- 과목별 수강 인원 파레토 감각(누적 비중 근사)
WITH course_pop AS (
  SELECT c.course_id, c.title, COUNT(*) AS enrolled_cnt
  FROM courses c
  JOIN enrollments e ON e.course_id=c.course_id AND e.status='ENROLLED'
  GROUP BY c.course_id, c.title
),
total AS (SELECT SUM(enrolled_cnt) AS total_cnt FROM course_pop)
SELECT
  a.course_id, a.title, a.enrolled_cnt,
  ROUND(a.enrolled_cnt*100.0/(SELECT total_cnt FROM total),2) AS percent,
  ROUND(
    (SELECT SUM(b.enrolled_cnt) FROM course_pop b WHERE b.enrolled_cnt >= a.enrolled_cnt)
    *100.0/(SELECT total_cnt FROM total),2
  ) AS cumulative_percent_approx
FROM course_pop a
ORDER BY a.enrolled_cnt DESC;
