-- 목적: 인기 상품 TOP 5 (판매 수량 기준)

SELECT
  i.Id AS item_id,
  i.Name AS item_name,
  SUM(oi.Qty) AS sold_qty
FROM items i
JOIN orderitems oi ON oi.ItemId = i.Id
GROUP BY i.Id, i.Name
ORDER BY sold_qty DESC
LIMIT 5;
