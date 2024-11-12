# SQLite3에서 users, products, orders 테이블을 연결하는 예제 코드
이 예제에서는 users, products, orders 세 개의 테이블을 생성하고, 각 테이블을 관계형 데이터베이스의 형태로 연결합니다.

## 1. users 테이블 생성
users 테이블은 사용자 정보를 저장합니다.

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    email TEXT UNIQUE
);
```


## 2. products 테이블 생성
products 테이블은 제품 정보를 저장합니다.

```sql
코드 복사
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    price REAL NOT NULL
);
```


## 3. orders 테이블 생성 (users, products 테이블과 연결)
orders 테이블은 주문 정보를 저장하며, user_id와 product_id를 통해 users와 products 테이블을 참조합니다.

```sql
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    order_date DATE DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```


## 4. 데이터 삽입
세 테이블에 데이터를 삽입하여 테스트할 수 있습니다.

```sql
-- users 테이블에 데이터 삽입
INSERT INTO users (name, age, gender, email) VALUES ('Alice', 25, 'Female', 'alice@example.com');
INSERT INTO users (name, age, gender, email) VALUES ('Bob', 30, 'Male', 'bob@example.com');
INSERT INTO users (name, age, gender, email) VALUES ('Charlie', 22, 'Male', 'charlie@example.com');
INSERT INTO users (name, age, gender, email) VALUES ('Diana', 28, 'Female', 'diana@example.com');
INSERT INTO users (name, age, gender, email) VALUES ('Eve', 35, 'Female', 'eve@example.com');

-- products 테이블에 데이터 삽입
INSERT INTO products (product_name, price) VALUES ('Laptop', 1000.0);
INSERT INTO products (product_name, price) VALUES ('Mouse', 25.0);
INSERT INTO products (product_name, price) VALUES ('Keyboard', 45.0);
INSERT INTO products (product_name, price) VALUES ('Monitor', 300.0);
INSERT INTO products (product_name, price) VALUES ('Printer', 150.0);

-- orders 테이블에 데이터 삽입 (Alice와 Bob의 주문)
INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 1, 1);  -- Alice가 Laptop 1개 주문
INSERT INTO orders (user_id, product_id, quantity) VALUES (1, 2, 2);  -- Alice가 Mouse 2개 주문
INSERT INTO orders (user_id, product_id, quantity) VALUES (2, 3, 1);  -- Bob이 Keyboard 1개 주문
INSERT INTO orders (user_id, product_id, quantity) VALUES (3, 4, 1);  -- Charlie가 Monitor 1개 주문
INSERT INTO orders (user_id, product_id, quantity) VALUES (3, 5, 1);  -- Charlie가 Printer 1개 주문
INSERT INTO orders (user_id, product_id, quantity) VALUES (4, 1, 1);  -- Diana가 Laptop 1개 주문
INSERT INTO orders (user_id, product_id, quantity) VALUES (4, 2, 3);  -- Diana가 Mouse 3개 주문
INSERT INTO orders (user_id, product_id, quantity) VALUES (5, 3, 2);  -- Eve가 Keyboard 2개 주문
INSERT INTO orders (user_id, product_id, quantity) VALUES (5, 4, 1);  -- Eve가 Monitor 1개 주문
INSERT INTO orders (user_id, product_id, quantity) VALUES (5, 5, 1);  -- Eve가 Printer 1개 주문
```


## 5. 다양한 쿼리 예제
### 5.1 사용자별 주문 내역 조회
각 사용자가 주문한 제품의 이름과 수량을 조회합니다.

```sql
SELECT users.name AS UserName, products.product_name AS ProductName, orders.quantity, orders.order_date
FROM orders
JOIN users ON orders.user_id = users.id
JOIN products ON orders.product_id = products.product_id;
```

### 5.2 특정 사용자의 주문 내역 조회
특정 사용자의 이메일을 기준으로 주문 내역을 조회할 수 있습니다.

```sql
-- Alice의 주문 내역 조회
SELECT users.name, products.product_name, orders.quantity, orders.order_date
FROM orders
JOIN users ON orders.user_id = users.id
JOIN products ON orders.product_id = products.product_id
WHERE users.email = 'alice@example.com';
```

### 5.2 특정 나이대의 사용자가 주문한 제품 조회
나이가 25세 이상인 사용자가 주문한 제품을 조회합니다.

```sql
SELECT users.name AS UserName, users.age, products.product_name AS ProductName, 
       orders.quantity
FROM orders
JOIN users ON orders.user_id = users.id
JOIN products ON orders.product_id = products.product_id
WHERE users.age >= 25;
```

25세 이상인 사용자가 주문한 상품을 총수량으로 소팅해서 내림차순으로...
```sql
SELECT 
    products.product_name AS 상품, 
    SUM(orders.quantity) AS 총수량, 
    MAX(orders.order_date) AS 최근주문일자
FROM 
    orders 
JOIN 
    users ON orders.user_id = users.id
JOIN 
    products ON orders.product_id = products.product_id
WHERE 
    users.age >= 25
GROUP BY 
    products.product_name
ORDER BY 
    총수량 DESC;
```

### 5.3 성별에 따른 총 지출 금액 조회
성별에 따른 총 지출 금액을 계산하여 조회합니다.

```sql
SELECT users.gender, SUM(orders.quantity * products.price) AS TotalSpent
FROM orders
JOIN users ON orders.user_id = users.id
JOIN products ON orders.product_id = products.product_id
GROUP BY users.gender;
```

### 5.4 각 주문의 총 금액 조회
주문별로 총 금액(제품 가격 * 수량)을 계산하여 조회합니다.

```sql
SELECT orders.order_id, users.name AS UserName, products.product_name, 
       orders.quantity, products.price, (orders.quantity * products.price) AS TotalPrice
FROM orders
JOIN users ON orders.user_id = users.id
JOIN products ON orders.product_id = products.product_id;
```

### 5.5 제품별로 주문된 총 수량 조회
각 제품이 얼마나 주문되었는지 조회할 수 있습니다.

```sql
SELECT products.product_name, SUM(orders.quantity) AS TotalQuantityOrdered
FROM orders
JOIN products ON orders.product_id = products.product_id
GROUP BY products.product_name;
```

### 5.6 사용자별 총 지출 금액 조회
각 사용자가 모든 주문에서 지출한 총 금액을 계산하여 조회합니다.

```sql
SELECT users.name AS UserName, SUM(orders.quantity * products.price) AS TotalSpent
FROM orders
JOIN users ON orders.user_id = users.id
JOIN products ON orders.product_id = products.product_id
GROUP BY users.name;
```

### 5.7 특정 제품을 주문한 사용자 조회
특정 제품을 주문한 사용자 목록을 조회합니다.

```sql
-- Laptop을 주문한 사용자 조회
SELECT users.name, users.email
FROM orders
JOIN users ON orders.user_id = users.id
JOIN products ON orders.product_id = products.product_id
WHERE products.product_name = 'Laptop';
```

```sql
SELECT 
    users.name, 
    users.email, 
    orders.order_date AS 주문일자
FROM 
    orders
JOIN 
    users ON orders.user_id = users.id
JOIN 
    products ON orders.product_id = products.product_id
WHERE 
    products.product_name = 'Laptop';
```

```sql
-- Laptop을 주문한 사용자와 최종 주문 날짜 조회
SELECT 
    users.name, 
    users.email, 
    MAX(orders.order_date) AS 최종주문일자
FROM 
    orders
JOIN 
    users ON orders.user_id = users.id
JOIN 
    products ON orders.product_id = products.product_id
WHERE 
    products.product_name = 'Laptop'
GROUP BY 
    users.name, users.email;
```

### 5.8 주문 내역이 없는 사용자 조회
주문을 한 번도 하지 않은 사용자를 조회합니다.

```sql
SELECT name, email 
FROM users
WHERE id NOT IN (SELECT user_id FROM orders);
```

### 5.9 분(minute) 단위 매출 통계
- strftime('%Y-%m-%d %H:%M', order_date)를 사용하여 order_date를 YYYY-MM-DD HH:MM 형식으로 변환하여 분 단위로 그룹화합니다.
- SUM(orders.quantity * products.price)를 통해 각 분에 해당하는 주문의 매출을 합산합니다.
- GROUP BY OrderMinute로 각 분 단위로 매출을 집계합니다.
- ORDER BY OrderMinute를 통해 결과를 시간 순으로 정렬합니다.

```sql
SELECT 
    strftime('%Y-%m-%d %H:%M', order_date) AS OrderMinute,
    SUM(orders.quantity * products.price) AS TotalSales
FROM 
    orders
JOIN 
    products ON orders.product_id = products.product_id
GROUP BY 
    OrderMinute
ORDER BY 
    OrderMinute;
```


## 6. 테이블 삭제
테이블을 정리하고 데이터베이스를 초기화하려면 다음 명령을 사용할 수 있습니다.

```sql
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
```
