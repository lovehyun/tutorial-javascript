-- 목적: 그룹별 TOP-N (윈도우 함수 없이) : 매장별 인기상품 TOP2

WITH store_item AS (
  SELECT
    o.StoreId,
    i.Id AS item_id,
    i.Name AS item_name,
    SUM(oi.Qty) AS sold_qty
  FROM orders o
  JOIN orderitems oi ON oi.OrderId = o.Id
  JOIN items i ON i.Id = oi.ItemId
  GROUP BY o.StoreId, i.Id, i.Name
)
SELECT si.*
FROM store_item si
WHERE (
  SELECT COUNT(*)
  FROM store_item x
  WHERE x.StoreId = si.StoreId
    AND x.sold_qty > si.sold_qty
) < 2
ORDER BY si.StoreId, si.sold_qty DESC, si.item_id;
