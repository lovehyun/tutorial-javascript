-- 점수 구간별 학생 수(성적이 있는 경우만)
SELECT
  CASE
    WHEN score >= 90 THEN '90+'
    WHEN score >= 80 THEN '80-89'
    WHEN score >= 70 THEN '70-79'
    ELSE 'UNDER_70'
  END AS score_band,
  COUNT(*) AS cnt
FROM grades
GROUP BY score_band
ORDER BY cnt DESC;
