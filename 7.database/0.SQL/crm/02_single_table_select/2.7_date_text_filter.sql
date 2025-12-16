-- 목적: SQLite에서 날짜를 보통 TEXT로 저장할 때의 필터 감각
-- OrderAt은 'YYYY-MM-DD HH:MM:SS' 문자열입니다.
-- 이런 포맷은 문자열 비교만으로도 날짜 범위 필터가 잘 됩니다.

-- Q: 2025-12-10 당일 주문
SELECT Id, OrderAt, UserId, StoreId
FROM orders
WHERE OrderAt >= '2025-12-10 00:00:00'
  AND OrderAt <  '2025-12-11 00:00:00'
ORDER BY OrderAt;

-- Q: 12월 1주(12/01~12/07) 주문
SELECT Id, OrderAt, UserId, StoreId
FROM orders
WHERE OrderAt >= '2025-12-01'
  AND OrderAt <  '2025-12-08'
ORDER BY OrderAt;
