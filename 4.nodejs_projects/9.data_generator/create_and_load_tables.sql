-- items 테이블 생성
CREATE TABLE IF NOT EXISTS items (
    Id TEXT PRIMARY KEY,
    Name TEXT,
    Type TEXT,
    UnitPrice INTEGER
);

-- orders 테이블 생성
CREATE TABLE IF NOT EXISTS orders (
    Id TEXT PRIMARY KEY,
    OrderAt DATETIME,
    StoreId TEXT,
    UserId TEXT,
    FOREIGN KEY (StoreId) REFERENCES stores(Id),
    FOREIGN KEY (UserId) REFERENCES users(Id)
);

-- orderitems 테이블 생성
CREATE TABLE IF NOT EXISTS orderitems (
    Id TEXT PRIMARY KEY,
    OrderId TEXT,
    ItemId TEXT,
    FOREIGN KEY (OrderId) REFERENCES orders(Id),
    FOREIGN KEY (ItemId) REFERENCES items(Id)
);

-- store 테이블 생성
CREATE TABLE IF NOT EXISTS stores (
    Id TEXT PRIMARY KEY,
    Name TEXT,
    Type TEXT,
    Address TEXT
);

-- user 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    Id TEXT PRIMARY KEY,
    Name TEXT,
    Gender TEXT,
    Age INTEGER,
    Birthdate TEXT,
    Address TEXT
);

-- 추가 인덱스 생성
CREATE INDEX idx_users_name ON users (name);
CREATE INDEX idx_order_orderat ON orders(OrderAt);


-- NOT NULL 제약 조건 추가
ALTER TABLE orders
ADD CONSTRAINT chk_order_orderat_not_null CHECK (OrderAt IS NOT NULL);

ALTER TABLE stores
ADD CONSTRAINT chk_store_name_not_null CHECK (Name IS NOT NULL);

ALTER TABLE users
ADD CONSTRAINT chk_user_name_not_null CHECK (Name IS NOT NULL);
