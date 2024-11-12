# SQLite3 학습을 위한 기본 명령어와 예제 코드

SQLite3을 학습하기 위한 기본적인 명령어와 예제 코드입니다. 각각의 명령어와 예제를 통해 SQLite3의 사용법과 주요 기능을 익힐 수 있습니다.

## 1. 데이터베이스 생성 및 연결

```sql
-- 데이터베이스 생성 및 연결
sqlite3 test.db
```


## 2. 테이블 생성
```sql
-- 예제: users 테이블 생성
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    email TEXT UNIQUE
);
```


## 3. 데이터 삽입
```sql
-- 예제: users 테이블에 데이터 삽입
INSERT INTO users (name, age, email) VALUES ('Alice', 25, 'alice@example.com');
INSERT INTO users (name, age, email) VALUES ('Bob', 30, 'bob@example.com');
```

### 3.2 테이블 수정 및 데이터 삽입
```sql
-- users 테이블에 gender 열 추가
ALTER TABLE users ADD COLUMN gender TEXT;

-- 데이터 삽입 (성별 포함)
-- Alice의 성별 업데이트
UPDATE users SET gender = 'Female' WHERE name = 'Alice';

-- Bob의 성별 업데이트
UPDATE users SET gender = 'Male' WHERE name = 'Bob';

-- INSERT INTO users (name, age, email, gender) VALUES ('Alice', 25, 'alice@example.com', 'Female');
-- INSERT INTO users (name, age, email, gender) VALUES ('Bob', 30, 'bob@example.com', 'Male');
INSERT INTO users (name, age, email, gender) VALUES ('Charlie', 22, 'charlie@example.com', 'Male');
INSERT INTO users (name, age, email, gender) VALUES ('Diana', 28, 'diana@example.com', 'Female');
INSERT INTO users (name, age, email, gender) VALUES ('Eve', 35, 'eve@example.com', 'Female');
```


## 4. 데이터 조회
```sql
-- 모든 데이터를 조회
SELECT * FROM users;

-- 특정 조건으로 조회 (나이가 25 이상인 사용자)
SELECT * FROM users WHERE age >= 25;
```

### 4.2 평균, 최소, 최대 구하기
- 평균, 최소, 최대 구하기
```sql
-- 평균 나이
SELECT AVG(age) AS AverageAge FROM users;

-- 최소 나이
SELECT MIN(age) AS MinAge FROM users;

-- 최대 나이
SELECT MAX(age) AS MaxAge FROM users;

-- 모두 다
SELECT AVG(age) AS AverageAge, MIN(age) AS MinAge, MAX(age) AS MaxAge FROM users;
```

- 남여 숫자 및 성비 구하기
```sql
-- 남자, 여자 숫자 구하기
SELECT gender, COUNT(*) AS Count FROM users GROUP BY gender;

-- 전체 사용자 수
SELECT COUNT(*) AS Totalusers FROM users;

-- 성별별 비율 구하기
SELECT gender, 
       (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users)) AS Percentage
FROM users
GROUP BY gender;
```


## 5. 데이터 업데이트
```sql
-- 예제: 특정 사용자의 나이 업데이트
UPDATE users SET age = 26 WHERE name = 'Alice';
```


## 6. 데이터 삭제
```sql
-- 예제: 특정 사용자를 삭제
DELETE FROM users WHERE name = 'Bob';
```


## 7. 조건부 조회 및 정렬
```sql
-- 나이가 20 이상인 사용자를 나이 순으로 정렬하여 조회
SELECT * FROM users WHERE age >= 20 ORDER BY age ASC;

SELECT * FROM users WHERE age >= 20 ORDER BY age DESC;
```


## 8. 테이블 수정
```sql
-- 예제: users 테이블에 새로운 열 추가
ALTER TABLE users ADD COLUMN phone TEXT;
```


## 9. 집계 함수 사용
```sql
-- 사용자 나이의 평균 구하기
SELECT AVG(age) FROM users;

-- 나이가 가장 많은 사용자 조회
SELECT MAX(age) FROM users;
```


## 10. 테이블 삭제
```sql
-- 예제: users 테이블 삭제
DROP TABLE IF EXISTS users;
```


## 11. 트랜잭션 사용
```sql
-- 트랜잭션 시작
BEGIN TRANSACTION;

-- 여러 작업 수행
INSERT INTO users (name, age, email) VALUES ('Bob', 22, 'bob@example.com');
UPDATE users SET age = 28 WHERE name = 'Alice';

-- 커밋 (모든 작업이 성공적으로 완료되었을 때만 저장)
COMMIT;

-- 롤백 (오류가 발생하면 되돌리기)
ROLLBACK;
```


## 12. 인덱스 생성 및 사용
```sql
-- users 테이블의 email 열에 인덱스 생성
CREATE INDEX idx_email ON users (email);

-- 인덱스가 사용되는 조회
SELECT * FROM users WHERE email = 'alice@example.com';
```

SQLite3는 이러한 기본적인 명령어와 함께 집계, 그룹화, 트랜잭션, 인덱싱 등을 지원하므로, 이를 활용하여 다양한 데이터를 효율적으로 관리할 수 있습니다.
