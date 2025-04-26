# 디렉토리 구조
```
public/
├── index.html         # 트윗 목록
├── login.html         # 로그인
├── register.html      # 회원가입
├── profile.html       # 프로필
├── tweet.html         # 트윗 작성
├── js/
│   ├── common.js      # 로그인/플래시 공통 처리
│   ├── index.js       # 트윗 목록 관리
│   ├── login.js       # 로그인 관리
│   ├── register.js    # 회원가입 관리
│   ├── profile.js     # 프로필 관리
│   ├── tweet.js       # 트윗 작성 관리
├── css/
│   └── style.css      # 공통 스타일
```

---

# 데이터베이스 정규화 과정 실습

> 잘못 설계된 비정규화 테이블에서 시작해서, 정규화를 거치면서 어떻게 테이블이 개선되는지 단계별로 쿼리와 함께 설명합니다.

---

# 1. 잘못 설계된 비정규화 테이블 (초기 상태)

**정규화 필요 이유:**
- 한 셀에 여러 값을 저장하는 비정규화로 인해 검색, 수정, 삭제가 어려워짐.
- 데이터 중복, 무결성 문제 발생 가능성.

**초기 테이블:** 모든 걸 한 곳에 저장 (트윗 + 좋아요 사용자)

```sql
CREATE TABLE tweet_raw (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user_id INTEGER,
    likes_user_ids TEXT  -- 콤마로 구분된 여러 user_id
);
```

**예시 데이터 삽입:**
```sql
INSERT INTO tweet_raw (content, user_id, likes_user_ids) VALUES
('첫 번째 트윗', 1, '2,3'),
('두 번째 트윗', 2, '1');
```

**초기 데이터 상태:**
| id | content | user_id | likes_user_ids |
|:---|:---|:---|:---|
| 1 | 첫 번째 트윗 | 1 | 2,3 |
| 2 | 두 번째 트윗 | 2 | 1 |

**문제점:**
- likes_user_ids에 여러 명(2,3)이 하나의 문자열로 저장됨
- 다중값 컬럼 → 1NF 위반
- 검색/수정/삭제 어려움

---

# 2. 1차 정규화 (1NF) - 다중값 분리

**정규화 필요 이유:**
- 하나의 컬럼에 여러 값을 저장하는 것을 방지하여 데이터의 일관성을 유지함.
- 각 셀에 하나의 값만 있도록 해야 검색과 수정이 간편해짐.

### 새로운 테이블 설계
```sql
CREATE TABLE tweet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user_id INTEGER
);

CREATE TABLE like_relation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_id INTEGER,
    user_id INTEGER
);
```

### 데이터 이전 예시
```sql
-- 트윗 데이터 이관
INSERT INTO tweet (id, content, user_id)
SELECT id, content, user_id FROM tweet_raw;

-- 좋아요 데이터 수동 분리 이관
INSERT INTO like_relation (tweet_id, user_id) VALUES (1, 2);
INSERT INTO like_relation (tweet_id, user_id) VALUES (1, 3);
INSERT INTO like_relation (tweet_id, user_id) VALUES (2, 1);
```

**정규화 후 데이터 상태:**

**tweet 테이블**
| id | content | user_id |
|:---|:---|:---|
| 1 | 첫 번째 트윗 | 1 |
| 2 | 두 번째 트윗 | 2 |

**like_relation 테이블**
| id | tweet_id | user_id |
|:---|:---|:---|
| 1 | 1 | 2 |
| 2 | 1 | 3 |
| 3 | 2 | 1 |

**변경사항:**
- 트윗과 좋아요를 별도 테이블로 분리
- likes_user_ids 컬럼 제거

**장점:**
- 트윗 1개에 좋아요 여러 개를 쉽게 표현 가능 (1:N 관계)
- 관리/검색/수정이 쉬워짐

---

# 3. 2차 정규화 (2NF) - 부분 종속 제거

**정규화 필요 이유:**
- 기본키 일부에만 종속된 속성을 제거하여 데이터 구조를 명확히 함.
- 트윗 1개에 대해 좋아요 개수를 보여줘야 함. 그런데 좋아요 수는 별도로 저장이 안 돼 있음. 그래서 매번 tweet 하나를 가져올 때마다 like 테이블을 다 조회해서 count를 세야 함.
- 트윗과 좋아요 개수 관리 책임을 분리해 성능 최적화.

**likes_count가 없는 상태**
- 한 트윗당 매번 like_relation 서브쿼리를 돌려야 합니다.

```sql
SELECT 
    tweet.id, 
    tweet.content, 
    tweet.user_id, 
    (SELECT COUNT(*) FROM like_relation WHERE tweet_id = tweet.id) AS likes_count
FROM tweet
ORDER BY tweet.id DESC;
```

**tweet 테이블에 likes_count 컬럼 추가 (선택사항)**

```sql
ALTER TABLE tweet ADD COLUMN likes_count INTEGER DEFAULT 0;
```

**like_relation 삽입할 때 likes_count 업데이트 예시**
```sql
-- 좋아요 추가할 때
INSERT INTO like_relation (tweet_id, user_id) VALUES (1, 4);
UPDATE tweet SET likes_count = likes_count + 1 WHERE id = 1;

-- 좋아요 취소할 때
DELETE FROM like_relation WHERE tweet_id = 1 AND user_id = 4;
UPDATE tweet SET likes_count = likes_count - 1 WHERE id = 1;
```

**정규화 후 데이터 상태 (likes_count 적용):**
- 트윗 테이블에 아예 likes_count 컬럼이 있으니까

```sql
SELECT 
    id, 
    content, 
    user_id, 
    likes_count
FROM tweet
ORDER BY id DESC;
```

**tweet 테이블**
| id | content | user_id | likes_count |
|:---|:---|:---|:---|
| 1 | 첫 번째 트윗 | 1 | 2 |
| 2 | 두 번째 트윗 | 2 | 1 |

**like_relation 테이블**
(동일)

**장점:**
- 트윗 조회할 때 likes_count만 보면 되므로 속도 향상
- 매번 COUNT(*) 하지 않아도 됨

---

# 4. 3차 정규화 (3NF) - 이행적 종속 제거

**정규화 필요 이유:**
- 기본키 이외의 속성이 다른 비기본키 속성에 종속되지 않도록 분리.
- 사용자(user) 정보를 따로 관리하여 중복을 방지하고 일관성을 유지.

**사용자(user) 테이블 분리**

```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
);
```

### 초기 사용자 데이터 삽입 예시
```sql
INSERT INTO user (username, email, password) VALUES
('user1', 'user1@example.com', 'password1'),
('user2', 'user2@example.com', 'password2'),
('user3', 'user3@example.com', 'password3');
```

**정규화 후 데이터 상태:**

**user 테이블**
| id | username | email | password |
|:---|:---|:---|:---|
| 1 | user1 | user1@example.com | password1 |
| 2 | user2 | user2@example.com | password2 |
| 3 | user3 | user3@example.com | password3 |

**tweet 테이블**
| id | content | user_id | likes_count |
|:---|:---|:---|:---|
| 1 | 첫 번째 트윗 | 1 | 2 |
| 2 | 두 번째 트윗 | 2 | 1 |

**like_relation 테이블**
| id | tweet_id | user_id |
|:---|:---|:---|
| 1 | 1 | 2 |
| 2 | 1 | 3 |
| 3 | 2 | 1 |

---

# 최종 테이블 요약

| 테이블 | 설명 |
|:---|:---|
| user | 사용자 정보 저장 (id, username, email, password) |
| tweet | 트윗 정보 저장 (id, content, user_id, likes_count) |
| like_relation | 어떤 사용자가 어떤 트윗을 좋아요 했는지 기록 |


---

# 📌 요약

| 단계 | 설명 |
|:---|:---|
| 초기 | tweet_raw 테이블에 다 몰아넣음 (likes_user_ids에 여러 값) |
| 1차 정규화 | likes_user_ids 분리 → like_relation 테이블 생성 |
| 2차 정규화 | tweet에 likes_count 따로 관리 |
| 3차 정규화 | user 테이블 분리, 외래키 참조 관계 설정 |

✅ 이렇게 정규화 과정을 통해 데이터 중복 없이, 검색/수정/삭제가 쉬운 구조가 완성되었습니다!

---

# 추가 추천
- 실제 좋아요 100만 건 이상 쌓이면 성능 차이 체험해보기
- 댓글(comment) 기능 추가할 때 정규화 연습해보기

---
---
---

# 5. 댓글(Comment) 기능 추가 시 정규화

**정규화 필요 이유:**
- 한 트윗에 여러 개의 댓글이 달릴 수 있음 (1:N 관계)
- 댓글도 작성자(user)와 연결되어야 함
- 트윗 데이터와 댓글 데이터를 명확히 분리하여 관리해야 함

---

## 5.1 잘못된(비정규화된) 설계 예시

**(비추) 트윗 테이블에 댓글을 그냥 콤마로 넣는다면:**

```sql
ALTER TABLE tweet ADD COLUMN comments TEXT;
```

**예시 데이터:**
| id | content | user_id | likes_count | comments |
|:---|:---|:---|:---|:---|
| 1 | 첫 번째 트윗 | 1 | 2 | "좋아요!,멋져요" |
| 2 | 두 번째 트윗 | 2 | 1 | "굿!" |

❗ 문제점:
- 여러 댓글을 콤마(,)로 구분하는 다중값 → 1NF 위반
- 댓글별로 작성자, 시간 저장 불가
- 검색/수정/삭제 비효율

---

## 5.2 1차 정규화 (1NF) 적용 → 댓글 테이블 분리

### 새로운 테이블 설계

```sql
CREATE TABLE comment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tweet_id) REFERENCES tweet(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
```

- 댓글은 tweet_id를 외래키로 가지며, 트윗에 소속됨
- 작성자 user_id도 외래키로 연결
- 작성 시간(created_at)도 자동 저장

---

## 5.3 예시 데이터 삽입

```sql
INSERT INTO comment (tweet_id, user_id, content) VALUES (1, 2, '좋아요!');
INSERT INTO comment (tweet_id, user_id, content) VALUES (1, 3, '멋져요!');
INSERT INTO comment (tweet_id, user_id, content) VALUES (2, 1, '굿!');
```

---

## 5.4 정규화 후 데이터 상태

**comment 테이블**
| id | tweet_id | user_id | content | created_at |
|:---|:---|:---|:---|:---|
| 1 | 1 | 2 | 좋아요! | 2025-04-27 12:00:00 |
| 2 | 1 | 3 | 멋져요! | 2025-04-27 12:01:00 |
| 3 | 2 | 1 | 굿! | 2025-04-27 12:02:00 |

---

# 📌 최종 테이블 요약 (댓글 추가 후)

| 테이블 | 설명 |
|:---|:---|
| user | 사용자 정보 저장 (id, username, email, password) |
| tweet | 트윗 정보 저장 (id, content, user_id, likes_count) |
| like_relation | 어떤 사용자가 어떤 트윗을 좋아요 했는지 기록 |
| comment | 어떤 사용자가 어떤 트윗에 댓글을 달았는지 기록 |

---

# 🎯 요약

| 단계 | 설명 |
|:---|:---|
| 댓글을 트윗에 콤마로 저장 (비정규화) | 관리 불편, 검색/수정 어려움 |
| 댓글을 comment 테이블로 분리 (정규화) | 1:N 관계로 댓글 관리 가능, 작성자/시간 기록 가능 |

✅ 댓글 기능 추가 시에도 테이블을 분리하여 정규화를 지키는 것이 필수입니다!

