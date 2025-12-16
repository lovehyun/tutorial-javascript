-- 목적: 별칭(AS)과 표현식(계산 컬럼)

-- Q: 상품 가격에 부가세 10%를 붙인 표시가격 보기
SELECT
  Id,
  Name,
  UnitPrice,
  CAST(UnitPrice * 1.1 AS INTEGER) AS price_with_vat
FROM items
ORDER BY UnitPrice DESC;

-- Q: 주문 시간을 날짜만 잘라서 보고 싶다면(문자열 함수)
SELECT
  Id,
  SUBSTR(OrderAt, 1, 10) AS order_date,
  UserId,
  StoreId
FROM orders
ORDER BY OrderAt;
