PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS orderitems;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  Id TEXT PRIMARY KEY,
  Name TEXT NOT NULL,
  Gender TEXT CHECK (Gender IN ('M','F')),
  Age INTEGER CHECK (Age >= 0),
  Birthdate TEXT,
  Address TEXT
);

CREATE TABLE stores (
  Id TEXT PRIMARY KEY,
  Name TEXT NOT NULL,
  Type TEXT,
  Address TEXT
);

CREATE TABLE items (
  Id TEXT PRIMARY KEY,
  Name TEXT NOT NULL,
  Type TEXT,
  UnitPrice INTEGER NOT NULL CHECK (UnitPrice >= 0)
);

CREATE TABLE orders (
  Id TEXT PRIMARY KEY,
  OrderAt TEXT NOT NULL,
  StoreId TEXT NOT NULL,
  UserId TEXT NOT NULL,
  FOREIGN KEY(StoreId) REFERENCES stores(Id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY(UserId)  REFERENCES users(Id)  ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE orderitems (
  Id TEXT PRIMARY KEY,
  OrderId TEXT NOT NULL,
  ItemId TEXT NOT NULL,
  Qty INTEGER NOT NULL DEFAULT 1 CHECK (Qty > 0),
  FOREIGN KEY(OrderId) REFERENCES orders(Id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(ItemId)  REFERENCES items(Id)  ON DELETE RESTRICT ON UPDATE CASCADE
);

-- users
INSERT INTO users VALUES
('U001','김지민','F',23,'2002-03-14','Seoul'),
('U002','이수현','M',31,'1994-11-02','Incheon'),
('U003','박민준','M',27,'1998-01-20','Suwon'),
('U004','최유나','F',29,'1996-07-09','Seoul'),
('U005','정하늘','F',21,'2004-05-30','Daejeon'),
('U006','오준호','M',35,'1990-02-11','Busan'),
('U007','한서연','F',33,'1992-08-19','Seoul');

-- stores
INSERT INTO stores VALUES
('S001','강남분식','Food','Seoul Gangnam'),
('S002','홍대카페','Cafe','Seoul Mapo'),
('S003','부산횟집','Food','Busan Haeundae'),
('S004','판교테크마트','Retail','Seongnam Pangyo'),
('S005','제주기념품샵','Retail','Jeju');

-- items
INSERT INTO items VALUES
('I001','김밥','Food',3500),
('I002','떡볶이','Food',4500),
('I003','라면','Food',4000),
('I004','아메리카노','Drink',4500),
('I005','라떼','Drink',5500),
('I006','치즈케이크','Dessert',6500),
('I007','광어회','Food',28000),
('I008','우동','Food',6000),
('I009','이어폰','Electronics',19000),
('I010','USB-C 케이블','Electronics',9000),
('I011','무선마우스','Electronics',29000),
('I012','기념 자석','Souvenir',7000),
('I013','감귤 초콜릿','Souvenir',12000);

-- orders
INSERT INTO orders VALUES
('O001','2025-12-01 12:10:00','S001','U001'),
('O002','2025-12-01 13:05:00','S001','U002'),
('O003','2025-12-02 18:40:00','S002','U001'),
('O004','2025-12-03 19:10:00','S002','U003'),
('O005','2025-12-04 12:00:00','S001','U003'),
('O006','2025-12-05 20:30:00','S003','U004'),
('O007','2025-12-06 12:20:00','S001','U004'),
('O008','2025-12-07 14:00:00','S002','U002'),
('O009','2025-12-08 11:50:00','S001','U001'),
('O010','2025-12-09 20:10:00','S003','U002'),
('O011','2025-12-10 10:15:00','S004','U006'),
('O012','2025-12-10 11:00:00','S004','U002'),
('O013','2025-12-11 15:10:00','S005','U007'),
('O014','2025-12-11 15:40:00','S005','U002'),
('O015','2025-12-12 09:05:00','S001','U006');

-- orderitems
INSERT INTO orderitems VALUES
('OI001','O001','I001',2), ('OI002','O001','I002',1),
('OI003','O002','I003',1), ('OI004','O002','I001',1),
('OI005','O003','I004',2), ('OI006','O003','I006',1),
('OI007','O004','I005',1), ('OI008','O004','I006',1),
('OI009','O005','I002',2), ('OI010','O005','I008',1),
('OI011','O006','I007',1),
('OI012','O007','I001',1), ('OI013','O007','I003',1),
('OI014','O008','I004',1), ('OI015','O008','I005',1),
('OI016','O009','I001',3),
('OI017','O010','I007',1), ('OI018','O010','I008',2),
('OI019','O011','I009',1), ('OI020','O011','I010',2),
('OI021','O012','I011',1), ('OI022','O012','I010',1),
('OI023','O013','I012',2), ('OI024','O013','I013',1),
('OI025','O014','I013',2), ('OI026','O014','I012',1),
('OI027','O015','I001',1), ('OI028','O015','I003',2);
