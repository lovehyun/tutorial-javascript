-- 목적: BETWEEN / IN / CASE 기초

-- Q: 가격이 5,000~20,000 사이인 상품
SELECT Id, Name, UnitPrice
FROM items
WHERE UnitPrice BETWEEN 5000 AND 20000
ORDER BY UnitPrice;

-- Q: 특정 타입만 보고 싶다(Food, Electronics)
SELECT Id, Name, Type, UnitPrice
FROM items
WHERE Type IN ('Food','Electronics')
ORDER BY Type, UnitPrice DESC;

-- Q: 가격대 라벨(저가/중가/고가) 만들기
SELECT
  Id, Name, UnitPrice,
  CASE
    WHEN UnitPrice < 6000 THEN 'LOW'
    WHEN UnitPrice < 20000 THEN 'MID'
    ELSE 'HIGH'
  END AS price_band
FROM items
ORDER BY UnitPrice;
