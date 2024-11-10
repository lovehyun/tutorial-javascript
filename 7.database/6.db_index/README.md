# 기본 컨셉 소개
- 사용자 테이블 예제
```
-- 사용자 테이블 생성
CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY,
    UserName TEXT NOT NULL,
    Email TEXT NOT NULL
);

-- 데이터 삽입
INSERT INTO Users (UserName, Email) VALUES
    ('User1', 'user1@example.com'),
    ('User2', 'user2@example.com'),
    ('User3', 'user3@example.com');
    -- ... (추가적인 사용자 데이터)
```

- 인덱스가 없는 쿼리 예제
```
-- UserID를 기준으로 검색
-- 이 쿼리는 인덱스가 없어서 풀 스캔을 수행하게 됨
EXPLAIN QUERY PLAN
SELECT * FROM Users WHERE UserName = 'User2';
```
여기서 1초 이상이 소요되는 쿼리라고 가정합니다.

- 인덱스가 있는 쿼리 예제
```
-- 인덱스 생성
CREATE INDEX idx_UserName ON Users (UserName);

-- 다시 UserID를 기준으로 검색
-- 이번에는 인덱스를 이용하여 빠르게 결과를 가져옴
EXPLAIN QUERY PLAN
SELECT * FROM Users WHERE UserName = 'User2';
```

여기서는 성능이 향상되어 빠르게 결과가 나올 것입니다.


# DB 셋업
- 실제 데모를 위한 10만개 데이터를 기반으로 한 예제 구성

```
sqlite> .schema
CREATE TABLE employees (
            id INTEGER PRIMARY KEY,
            name TEXT,
            department TEXT,
            salary INTEGER
        );

sqlite> select count(*) from employees;
100000

sqlite> .timer on
```

## 셀러리 조회 예제

### 데이터 개수 조회
```
sqlite> select count(*) from employees where salary > 50000; 
54728
Run Time: real 0.009 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where salary > 50000;
54728
Run Time: real 0.010 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where salary > 50000 and salary < 70000;
21210
Run Time: real 0.012 user 0.000000 sys 0.000000
```

### 인덱스 생성
```
sqlite> create index idx_salary on employees(salary);
Run Time: real 0.045 user 0.000000 sys 0.015625

sqlite> .schema
CREATE TABLE employees (
            id INTEGER PRIMARY KEY,
            name TEXT,
            department TEXT,
            salary INTEGER
        );
CREATE INDEX idx_salary on employees(salary);
```

### 조회 다시 수행
```
sqlite> select count(*) from employees where salary > 50000;
54728
Run Time: real 0.002 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where salary > 50000 and salary < 70000;
21210
Run Time: real 0.001 user 0.000000 sys 0.000000
```

## 이름 조회 예제
```
sqlite> select count(*) from employees where name like '박%'; 
19969
Run Time: real 0.011 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where name like '박%';
19969
Run Time: real 0.013 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where name like '박%';
19969
Run Time: real 0.012 user 0.000000 sys 0.000000
```

### 인덱스 생성
```
sqlite> create index idx_name on employees(name);
Run Time: real 0.059 user 0.015625 sys 0.000000

sqlite> .schema                                  
CREATE TABLE employees (
            id INTEGER PRIMARY KEY,
            name TEXT,
            department TEXT,
            salary INTEGER
        );
CREATE INDEX idx_salary on employees(salary);
CREATE INDEX idx_name on employees(name);
```

### 이름 조회
```
sqlite> select count(*) from employees where name like '박%';
19969
Run Time: real 0.005 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where name like '박%';
19969
Run Time: real 0.007 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where name like '박%';
19969
Run Time: real 0.007 user 0.000000 sys 0.000000
```

### 인덱스 삭제 및 조회
```
sqlite> drop index idx_name;
Run Time: real 0.006 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where name like '박%';
19969
Run Time: real 0.014 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where name like '박%';
19969
Run Time: real 0.017 user 0.000000 sys 0.000000

sqlite> select count(*) from employees where name like '박%';
19969
Run Time: real 0.012 user 0.000000 sys 0.000000
```
