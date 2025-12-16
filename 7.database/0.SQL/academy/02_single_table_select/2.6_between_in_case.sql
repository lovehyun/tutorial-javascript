-- 학년 버킷
SELECT
  student_id, name, year,
  CASE
    WHEN year IN (1,2) THEN 'LOWER'
    ELSE 'UPPER'
  END AS year_band
FROM students
ORDER BY year, student_id;
