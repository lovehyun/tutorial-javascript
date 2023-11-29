
# 주요 단계별 미션

## 초급 레벨 과제

- M1. 10명의 사람의 이름을 랜덤으로 생성하시오. (영문 이름 샘플 10개 참조해서)
- M1-2. 성별, 생년월일, 나이를 랜덤으로 생성하시오. (나이 주의 = 생년월일 기반 계산)
- M1-3. 주소를 랜덤으로 생성하시오.
  > generator1-1

- M2. 사람의 이름을 더 늘리려면? 주소를 더 늘리려면?
  소스코드를 변경하지 않고 데이터 파일 (예, names.txt, cities.txt) 을 읽어 이름/주소를 동적으로 증가하시오.
  > generator1-2

- M3. 출력 결과를 화면이 아닌 csv 파일로 출력하시오.
  > generator1-3


## 중급 레벨 과제

- M4. 코드를 리펙토링하여 개별 항목별로 기능을 분리하시오.
  > generator2

- M5. 생성하는 개수를 동적으로 입력받고, 원하는 출력 타입 (console, csv) 에 따라 결과물을 출력하시오.
  이름을 한국 이름으로 (성/이름), 그리고 주소도 한국 도로명 주소 형태로 생성하시오.
  객체지향 설계를 하여, 신규 타입이(상점 등) 추가 될때 확장성 있게 설계하시오. (상속을 통해 필수 generate 함수를 구현하도록..)
  > generator3

- M6. 위 내용들을 참조해서 새로운 타입인 상점(store) 데이터를 생성하시오. (독립적인 코드로 구성)
  상점의 이름, 타입(커피샵 유형), 주소를 생성하시오
  > generator4


## 중삽급 레벨 과제

- M7. 위 "사용자" 생성 코드와 "상점" 생성 코드를 하나로 합치시오.
  이때 객체지향 설계를 고려하고 디렉토리 구조 등을 적절하게 설계하시오. (사용자와 상점의 공통 니즈인 주소 생성 공통화)
  데이터 타입 별로 객체 설계 (User, Store 객제 설계)
  > generator5

- M8. 새로운 타입인 "상품(item)" 정보를 생성하는 코드를 추가하시오.
  위 객체지향 설계에 따라 models 추가, generator 추가
  > generator6

- M8-1. 모델별 간단한 테스트 코드를 작성하시오.
  User 객체의 생성, Store 객체의 생성, Item 객체의 생성 등
  > generator6


## 고급 레벨 과제

- M9. 젠체 코드를 리펙토링 하시오.
  새로운 타입에 융통성 있게 대응하기 위한 (예, 주문(Order) 정보 등)
  > generator7

- M9-1. 디자인 패턴을 적용해서 Factory Pattern, 새로운 타입들이 추가 될 때마다 용이하게 코드를 관리하시오. 버그가 발생하지 않도록 Singleton Pattern 등을 도입해서 코드를 효율적으로 관리하시오.
  > generator8


- M10. 추가적인 아이템(주문상품)을 새로 개발된 위 코드에 추가하시오.
  최종 목표는: user, store, item, order, orderitem
  > generator9
  > generator10

----------

# 데이터 포멧

- user.csv - 고객DB
```
Id,Name,Gender,Age,Birthdate,Address
2dfec01b-0a2e-49ce-80dd-3c1bc3388e4a,조지훈,Female,48,1974-07-13,대구 강남구 2로 59
1365f7d4-f7f3-4695-9609-b3e7f4904ba1,윤지아,Female,20,2003-04-10,대구 서구 54길 21
f46de106-5a36-408a-bab9-abf2287acf1d,윤지원,Male,52,1971-02-18,대구 서구 59길 71
d616ba74-822d-4047-8d22-f90dc5f280e2,윤민지,Female,19,2003-08-14,인천 중구 61로 18
a3500ca3-643c-4853-ba0c-98da276c5de9,김지아,Female,29,1993-08-09,대구 강서구 100길 61
```

- store.csv - 상점DB
```
Id,Name,Type,Address
09046a45-9d98-465e-86fc-0dca8d68299e,스타벅스 신촌4호점,스타벅스,서울 남구 48로 53
1342b08e-6a37-42e3-be4a-737c74358300,투썸 홍대3호점,투썸,서울 강남구 34로 73
b713d31d-abfe-4085-85df-7759cd89453e,이디야 송파2호점,이디야,대구 중구 79로 80
2a2b7c2f-2d4c-43f1-8ee7-af7a22ff0f32,스타벅스 서초2호점,스타벅스,광주 강서구 66로 25
2b5458ff-f006-4792-9ac5-7dd6162adf86,이디야 송파7호점,이디야,대구 남구 86길 13
```

- item.csv - 상품DB
```
Id,Name,Type,UnitPrice
72c09e2b-f170-40a7-ac71-b9b939ea8b47,Espresso Coffee,Coffee,2500
cb2e72af-1c19-4db8-a703-a41fcb895968,Americano Coffee,Coffee,3000
ac6e6e61-2d9d-40c0-9d41-80e675857eca,Grape Juice,Juice,3000
c09d0b02-3392-4061-ba0f-ce0cb421ae94,Mocha Coffee,Coffee,5000
65553ac2-1e11-479b-8605-2a28e469883e,Mocha Coffee,Coffee,5000
```

 - order.csv - 주문DB
```
Id,OrderAt,StoreId,UserId
42362a10-11db-4ab1-924a-62e232ca9e94,2023-02-08 20:34:13,2b5458ff-f006-4792-9ac5-7dd6162adf86,2dfec01b-0a2e-49ce-80dd-3c1bc3388e4a
8e4e5fce-e40d-4184-a310-86e451cabfaf,2023-07-27 10:08:18,2a2b7c2f-2d4c-43f1-8ee7-af7a22ff0f32,2dfec01b-0a2e-49ce-80dd-3c1bc3388e4a
e709ee4b-a56f-49e8-808b-a4cad78bc823,2023-09-16 08:06:53,2b5458ff-f006-4792-9ac5-7dd6162adf86,f46de106-5a36-408a-bab9-abf2287acf1d
ef12f5a2-4356-4603-8ba2-eb78e8eac0a4,2023-10-13 21:35:09,1342b08e-6a37-42e3-be4a-737c74358300,f46de106-5a36-408a-bab9-abf2287acf1d
81b64f16-853e-4914-bb34-4387d4c2cf8c,2023-03-19 21:35:41,1342b08e-6a37-42e3-be4a-737c74358300,2dfec01b-0a2e-49ce-80dd-3c1bc3388e4a
```

 - order_item.csv - 주문상품DB
```
Id,OrderId,ItemId
752766cb-18a1-44ce-87cf-c2851a923f7c,42362a10-11db-4ab1-924a-62e232ca9e94,65553ac2-1e11-479b-8605-2a28e469883e
7ed2c346-aba2-4f4b-a581-569c6af14b09,e709ee4b-a56f-49e8-808b-a4cad78bc823,c09d0b02-3392-4061-ba0f-ce0cb421ae94
88a4191b-73e6-4793-85cc-2ccb4fd0b1c1,81b64f16-853e-4914-bb34-4387d4c2cf8c,72c09e2b-f170-40a7-ac71-b9b939ea8b47
b1904f4b-3c26-4384-af25-729654b1370f,e709ee4b-a56f-49e8-808b-a4cad78bc823,c09d0b02-3392-4061-ba0f-ce0cb421ae94
406cfa69-2f8a-4951-9e8f-525b1f41e6c0,81b64f16-853e-4914-bb34-4387d4c2cf8c,c09d0b02-3392-4061-ba0f-ce0cb421ae94
```


----------

# 데이터 SQLITE IMPORT

1. DB 생성
```
sqlite3 mycrm.db
```

1. 데이터 로딩
(한글 깨짐 현상은, csv 파일 로딩 후 UTF-8로 다시 저장해서 사용.)
```
.mode csv

.import user.csv users
.import store.csv stores
.import item.csv items
.import order.csv orders
.import orderitem.csv orderitems
```

```

-- item.csv 파일 로드 (필요 시 .import 뒤에 --skip 1 을 통해 헤더 제외)
.mode csv

.import user.csv users --skip 1
.import store.csv stores --skip 1
.import item.csv items --skip 1
.import order.csv orders --skip 1
.import orderitem.csv orderitems --skip 1

```

1. 데이터 확인
```
sqlite> .schema
CREATE TABLE IF NOT EXISTS "users"(
"Id" TEXT, "Name" TEXT, "Gender" TEXT, "Age" TEXT,
 "Birthdate" TEXT, "Address" TEXT);
CREATE TABLE IF NOT EXISTS "stores"(
"Id" TEXT, "Name" TEXT, "Type" TEXT, "Address" TEXT);
CREATE TABLE IF NOT EXISTS "items"(
"Id" TEXT, "Name" TEXT, "Type" TEXT, "UnitPrice" TEXT);
CREATE TABLE IF NOT EXISTS "orders"(
"Id" TEXT, "OrderAt" TEXT, "StoreId" TEXT, "UserId" TEXT);
CREATE TABLE IF NOT EXISTS "orderitems"(
"Id" TEXT, "OrderId" TEXT, "ItemId" TEXT);
```

1. (필요시) 데이터 컬럼 속성 변경 (굳이 안해도 무방)
```
-- 새로운 테이블 생성
CREATE TABLE new_users (
    Id INTEGER,
    Name TEXT,
    Gender TEXT,
    Age INTEGER,
    Birthdate TEXT,
    Address TEXT
);

-- 기존 테이블의 데이터를 새로운 테이블로 복사
INSERT INTO new_users (Id, Name, Gender, Age, Birthdate, Address)
SELECT Id, Name, Gender, CAST(Age AS INTEGER), Birthdate, Address
FROM users;

-- 기존 테이블 삭제
DROP TABLE users;

-- 새로운 테이블의 이름을 기존 테이블의 이름으로 변경
ALTER TABLE new_users RENAME TO users;
```

5. 인덱스 생성 
(생성 전후의 성능 비교 해볼 것)
```
CREATE INDEX idx_users_name ON users (name);

-- 그 외에 추가 인덱스
CREATE INDEX idx_orderitems_orderid ON orderitems(OrderId);
```

6. (필요시) 삭제 CONTRAINT 를 통한 무결성 향상
외래 키를 설정하고 ON DELETE CASCADE를 사용하면 부모 테이블의 기본 키 값이 삭제될 때 자식 테이블에서 해당 값을 참조하는 모든 레코드가 삭제됩니다.

```
-- 예시: order 테이블의 StoreId가 store 테이블의 Id를 참조하는 경우
CREATE TABLE IF NOT EXISTS orders (
    Id TEXT PRIMARY KEY,
    OrderAt DATETIME,
    StoreId TEXT,
    UserId TEXT,
    FOREIGN KEY (StoreId) REFERENCES stores(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES users(Id)
);
```

# 다양한 SQL 퀴즈

## 초급
1. 모든 사용자의 이름과 나이 조회
```
SELECT Name, Age FROM users;
```

2. 최근 주문한 5개의 주문 조회
```
SELECT * FROM orders ORDER BY OrderAt DESC LIMIT 5;

SELECT * FROM orders o JOIN stores s ON o.storeid = s.id ORDER BY OrderAt DESC LIMIT 5;

SELECT o.id,o.orderat,s.name,u.name FROM orders o JOIN stores s ON o.storeid = s.id JOIN users u ON o.userid = u.id ORDER BY OrderAt DESC LIMIT 5;
```

3. 커피 종류 상품만 조회
```
SELECT * FROM items WHERE Type = 'Coffee';
```

4. 서울에 위치한 매장 조회
```
SELECT * FROM stores WHERE Address LIKE '%서울%';
```

5. 2000년도 이후에 태어난 여자 고객의 목록
```
SELECT * FROM users WHERE Gender = 'Female' AND CAST(SUBSTR(Birthdate, 1, 4) AS INTEGER) >= 2000;
```

6. 가장 나이가 많은 고객은?
```
SELECT * FROM users ORDER BY Age DESC LIMIT 1;
```

7. 가장 비싼 상품은?
```
SELECT * FROM items ORDER BY UnitPrice DESC LIMIT 1;
```

8. 각 매장별로 판매된 상품 수 조회
```
SELECT
    s.Name AS StoreName,
    COUNT(oi.Id) AS SoldItems
FROM stores s
    LEFT JOIN orders o ON s.Id = o.StoreId
    LEFT JOIN orderitems oi ON o.Id = oi.OrderId
GROUP BY StoreName;
```

9. 전체 주문 내역 조회
```
SELECT
    o.Id AS OrderId,
    o.OrderAt,
    u.Name AS UserName,
    s.Name AS StoreName,
    i.Name AS ItemName
FROM orders o
    JOIN users u ON o.UserId = u.Id
    JOIN stores s ON o.StoreId = s.Id
    JOIN orderitems oi ON o.Id = oi.OrderId
    JOIN items i ON oi.ItemId = i.Id;
```

## 중급
1. 사용자별 주문 횟수와 총 구매액 조회
```
-- 사용자별 주문 횟수와 총 구매액 조회 (JOIN 없음)
SELECT
    UserId,
    COUNT(orders.Id) AS OrderCount,
    SUM((SELECT UnitPrice FROM items WHERE items.Id = orderitems.ItemId)) AS TotalSpent
FROM orders
JOIN orderitems ON orders.Id = orderitems.OrderId
GROUP BY UserId;

-- 사용자별 주문 횟수와 총 구매액 조회 (JOIN 포함)
SELECT
    u.Name AS UserName,
    u.Id AS UserId,
    COUNT(orders.Id) AS OrderCount,
    SUM((SELECT UnitPrice FROM items WHERE items.Id = orderitems.ItemId)) AS TotalSpent
FROM orders
JOIN orderitems ON orders.Id = orderitems.OrderId
JOIN users u ON orders.UserId = u.Id
GROUP BY UserId, UserName;
```

2. 상점의 월간 매출액 조회
```
SELECT
    strftime('%Y-%m', o.OrderAt) AS Month,
    s.Name AS StoreName,
    SUM(i.UnitPrice) AS MonthlySales
FROM orders o
    JOIN orderitems oi ON o.Id = oi.OrderId
    JOIN items i ON oi.ItemId = i.Id
    JOIN stores s ON o.StoreId = s.Id
GROUP BY Month, StoreName
ORDER BY Month, MonthlySales DESC;
```

3. 연간 수입이 가장 많은 매장 Top10 조회
```
SELECT
    strftime('%Y', o.OrderAt) AS Year,
    s.Name AS StoreName,
    SUM(i.UnitPrice) AS AnnualSales
FROM orders o
    JOIN orderitems oi ON o.Id = oi.OrderId
    JOIN items i ON oi.ItemId = i.Id
    JOIN stores s ON o.StoreId = s.Id
GROUP BY Year, StoreName
ORDER BY Year, AnnualSales DESC
LIMIT 10;
```

4. 각 아이템의 판매량 및 매출액 조회
```
SELECT
    i.Name AS ItemName,
    COUNT(oi.Id) AS SalesCount,
    SUM(i.UnitPrice) AS TotalRevenue
FROM orderitems oi
    JOIN items i ON oi.ItemId = i.Id
GROUP BY ItemName
ORDER BY SalesCount DESC;
```

5. 각 사용자의 총 주문 횟수 및 소비액 조회 (Top 20 Only)
```
SELECT
    u.Name AS UserName,
    COUNT(o.Id) AS OrderCount,
    SUM(i.UnitPrice) AS TotalSpent
FROM orders o
    JOIN orderitems oi ON o.Id = oi.OrderId
    JOIN items i ON oi.ItemId = i.Id
    JOIN users u ON o.UserId = u.Id
GROUP BY UserName
ORDER BY TotalSpent DESC
LIMIT 20;
```

6. 지역별 (시와 동까지 분할한 것을 기준으로) 매출액 조회
```
WITH AddressParts AS (
    SELECT
        Id,
        Name AS StoreName,
        SUBSTR(Address, 1, INSTR(Address, '구') + 1) AS City
    FROM stores
)

-- 지역별 매출액 조회
SELECT
    ap.City,
    SUM(i.UnitPrice) AS TotalSales
FROM orders o
    JOIN orderitems oi ON o.Id = oi.OrderId
    JOIN items i ON oi.ItemId = i.Id
    JOIN stores s ON o.StoreId = s.Id
    JOIN AddressParts ap ON s.Id = ap.Id
GROUP BY City
ORDER BY City;
```

7. 스타벅스 강남 1호점에 방문한 Top5 단골 고객은?
```
-- 스타벅스 강남 1호점에 방문한 Top5 단골 고객 조회
SELECT
    u.Name AS RegularCustomer,
    COUNT(o.Id) AS VisitCount
FROM orders o
    JOIN stores s ON o.StoreId = s.Id
    JOIN users u ON o.UserId = u.Id
WHERE s.Name = '스타벅스 강남1호점'
GROUP BY RegularCustomer
ORDER BY VisitCount DESC
LIMIT 5;
```

8. 매장별 월간 매출액 조회 (최근 3개월)
```
SELECT
    s.Name AS StoreName,
    strftime('%Y-%m', o.OrderAt) AS Month,
    SUM(i.UnitPrice) AS MonthlySales
FROM orders o
    JOIN stores s ON o.StoreId = s.Id
    JOIN orderitems oi ON o.Id = oi.OrderId
    JOIN items i ON oi.ItemId = i.Id
WHERE OrderAt >= date('now', '-2 months')
GROUP BY StoreName, Month;
```

