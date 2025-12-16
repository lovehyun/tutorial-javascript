-- 학과별 학생 비중
WITH d AS (
  SELECT dept_id, COUNT(*) AS cnt FROM students GROUP BY dept_id
),
t AS (SELECT SUM(cnt) AS total_cnt FROM d)
SELECT dept_id, cnt,
       ROUND(cnt*100.0/(SELECT total_cnt FROM t),2) AS ratio_percent
FROM d
ORDER BY cnt DESC;
