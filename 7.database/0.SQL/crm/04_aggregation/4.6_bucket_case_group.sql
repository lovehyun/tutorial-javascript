-- 목적: CASE로 연령대 버킷 만들고 그룹핑

SELECT
  CASE
    WHEN Age < 25 THEN 'UNDER_25'
    WHEN Age < 30 THEN '25_29'
    WHEN Age < 35 THEN '30_34'
    ELSE '35_PLUS'
  END AS age_band,
  COUNT(*) AS user_cnt
FROM users
GROUP BY age_band
ORDER BY user_cnt DESC;
