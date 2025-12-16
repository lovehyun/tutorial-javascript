-- 목적(실무 질문):
-- "상위 몇 개 상품이 전체 판매의 대부분을 차지하나요?" (파레토 감각)
-- 1) 상품별 매출
-- 2) 전체 대비 누적 비중(cumulative %) 계산
-- SQLite 윈도우 함수 없이도 가능하게 "정렬 + 누적합 서브쿼리" 트릭을 사용합니다.

WITH item_rev AS (
  SELECT
    i.Id AS item_id,
    i.Name AS item_name,
    SUM(oi.Qty * i.UnitPrice) AS revenue
  FROM items i
  JOIN orderitems oi ON oi.ItemId = i.Id
  JOIN orders o ON o.Id = oi.OrderId
  GROUP BY i.Id, i.Name
),
total AS (
  SELECT SUM(revenue) AS total_revenue FROM item_rev
)
SELECT
  a.item_id,
  a.item_name,
  a.revenue,
  ROUND(a.revenue * 100.0 / (SELECT total_revenue FROM total), 2) AS revenue_percent,
  ROUND(
    (SELECT SUM(b.revenue) FROM item_rev b WHERE b.revenue >= a.revenue) * 100.0 / (SELECT total_revenue FROM total),
    2
  ) AS cumulative_percent_approx
FROM item_rev a
ORDER BY a.revenue DESC;
