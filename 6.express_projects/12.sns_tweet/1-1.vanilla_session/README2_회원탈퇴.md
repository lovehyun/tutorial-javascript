# SQLite3: ON DELETE CASCADE 없이 사용자 삭제 시 발생하는 문제 분석

---

## 질문

> 
> 지금의 테이블 구조에서 ON DELETE CASCADE가 없는데, 이 상황에서 사용자를 삭제하면 삭제 이상현상(data inconsistency)이 다른 테이블에서 발생하는가?

---

## 결론

**네, 현재 구조에서 사용자를 삭제하면 트윗(tweet)과 좋아요(like) 테이블에서 삭제 이상현상(data inconsistency)이 발생합니다.**

(즉, 삭제된 사용자의 데이터가 tweet, like 테이블에 고아 상태(Orphaned Data)로 남게 됩니다.)

---

## 발생하는 이상현상(Data Inconsistency)

| 발생 문제 | 설명 |
|:---|:---|
| 고아 트윗 발생 (Orphaned Tweets) | tweet.user_id가 존재하지 않는 user를 참조하는 데이터가 남음 |
| 고아 좋아요 발생 (Orphaned Likes) | like.user_id가 존재하지 않는 user를 참조하거나, like.tweet_id가 삭제된 tweet를 참조함 |
| 데이터 무결성 손상 (Broken Referential Integrity) | JOIN 시 오류 발생 가능성, 조회 시 NULL 결과 발생 가능성 |
| 서버 API 오류 위험 | 예: 사용자를 찾거나 트윗/좋아요를 조회할 때 서버 오류 발생 가능성 |

---

## 원인

- SQLite3에서 FOREIGN KEY 제약조건은 기본적으로 활성화되어 있지 않음.
- `PRAGMA foreign_keys = ON;` 명령을 통해 별도로 활성화해야만 무결성 제약이 적용됨.
- FOREIGN KEY에 `ON DELETE CASCADE` 옵션이 없는 경우, 부모 테이블(user) 삭제 시 자식 테이블(tweet, like)이 자동으로 삭제되지 않음.

---

## 해결 방법

**테이블을 새로 재구성하여 ON DELETE CASCADE를 추가해야 합니다.**

```sql
BEGIN TRANSACTION;
-- 백업, DROP, CREATE, 복구
COMMIT;
```

### 전체 트랜잭션(SQL 스크립트)

```sql
-- 트랜잭션 시작
BEGIN TRANSACTION;

-- tweet 테이블 백업
CREATE TABLE tweet_backup AS SELECT * FROM tweet;

-- like 테이블 백업
CREATE TABLE like_backup AS SELECT * FROM like;

-- 기존 테이블 삭제
DROP TABLE like;
DROP TABLE tweet;

-- 새 tweet 테이블 생성 (ON DELETE CASCADE 추가)
CREATE TABLE tweet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    likes_count INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 새 like 테이블 생성 (ON DELETE CASCADE 추가)
CREATE TABLE like (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tweet_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY(tweet_id) REFERENCES tweet(id) ON DELETE CASCADE
);

-- 데이터 복원
INSERT INTO tweet (id, content, user_id, likes_count)
SELECT id, content, user_id, likes_count FROM tweet_backup;

INSERT INTO like (id, user_id, tweet_id)
SELECT id, user_id, tweet_id FROM like_backup;

-- 임시 백업 테이블 삭제
DROP TABLE tweet_backup;
DROP TABLE like_backup;

-- 트랜잭션 완료
COMMIT;
```

---

## 주의사항

- 반드시 DB 연결 후 `PRAGMA foreign_keys = ON;`을 실행해야 FOREIGN KEY 제약이 적용됩니다.

```sql
PRAGMA foreign_keys = ON;
```

- Node.js, Flask 등에서도 연결 직후 이 명령어를 실행해야 합니다.

Node.js 예시:
```javascript
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        db.run('PRAGMA foreign_keys = ON');
    }
});
```

---

## 적용 결과

| 테이블 | ON DELETE CASCADE 적용 여부 |
|:---|:---|
| tweet | user 삭제 시 tweet 자동 삭제 |
| like | user 삭제 시 like 자동 삭제, tweet 삭제 시 like 자동 삭제 |

사용자가 탈퇴하면:
- 작성한 트윗(tweet) 자동 삭제
- 작성한 좋아요(like) 자동 삭제
- 트윗이 삭제되면 해당 트윗에 달린 좋아요도 삭제됨

데이터 무결성(Referential Integrity)을 완벽히 유지할 수 있습니다.

---

# 최종 요약

> SQLite에서 FOREIGN KEY 제약을 제대로 적용하려면 `PRAGMA foreign_keys = ON;`을 설정하고, 테이블 생성 시 반드시 `ON DELETE CASCADE`를 명시해야 합니다.

> 그렇지 않으면 사용자 삭제 시 트윗(tweet)과 좋아요(like) 테이블에 고아 데이터(Orphaned Data)가 남아 데이터 무결성이 손상될 수 있습니다.

---

# 참고

- ON DELETE CASCADE를 적용해도 서비스 정책에 따라 '사용자 탈퇴 시 글을 남길 것인지'에 대한 정책 결정이 필요합니다.
- 모든 데이터를 삭제하는 정책이면 CASCADE가 필수적이며, 일부 데이터만 유지하는 경우 추가적인 애플리케이션 로직이 필요할 수 있습니다.

# 사용자가 회원탈퇴할 때 작성한 글과 좋아요를 어떻게 처리해야 하는가?

---

## 질문2

> 사용자가 회원탈퇴를 한다고 그 사용자가 작성한 모든 글과 좋아요를 지우는 것이 맞는가?

---

## 답변2

아주 중요한 질문을 해주셨습니다.  
이건 "기술"을 넘어서 "서비스 정책(Service Policy)"과 "사용자 경험(UX)"까지 연결되는 문제입니다.

---

## 결론

"사용자가 회원탈퇴할 때 그 사용자가 쓴 글과 좋아요를 어떻게 처리할지"는 **서비스 정책에 따라 다릅니다.**  
**정답은 없습니다. 선택해야 합니다.**

---

## 크게 3가지 선택지가 있습니다.

| 선택 | 설명 | 장단점 |
|:---|:---|:---|
| 1. 전부 삭제 | 회원탈퇴 시 작성한 글, 댓글, 좋아요 모두 삭제 | ✅ 개인정보 완전 삭제<br>❌ 커뮤니티/게시판 흐름 깨질 수 있음 |
| 2. 글은 남기고 사용자만 탈퇴 처리 (탈퇴 회원 표시) | 글은 남겨두고, 작성자만 "탈퇴한 회원" 등으로 표시 | ✅ 게시판/데이터 유지<br>✅ 익명성 보장<br>❌ 완전한 개인정보 삭제는 아님 |
| 3. 글/댓글은 사용자 동의 받아 선택적으로 삭제 | 탈퇴 과정에서 사용자가 "내 글도 모두 삭제할지" 선택 | ✅ 사용자 자율성 최대화<br>❌ 개발 복잡성 증가 |

---

## 실제 서비스 예시

| 서비스 | 탈퇴 시 처리 방법 |
|:---|:---|
| 인스타그램 | 탈퇴하면 사진/좋아요 모두 삭제 |
| 페이스북 | 탈퇴하면 데이터 삭제 (30일 대기 후 완전 삭제) |
| 디시인사이드, 클리앙 | 탈퇴해도 글은 남기고, 작성자는 \"탈퇴한 회원\"으로 표시 |
| 회사 내부 게시판 | 글 남김 (작성자 이름을 \"탈퇴한 사용자\"로 변경) |

---

## 각각 장단점 비교

| 방법 | 장점 | 단점 |
|:---|:---|:---|
| 모두 삭제 | 개인정보 확실히 삭제 | 데이터/커뮤니티 맥락 파괴 가능성 |
| 글 남기고 사용자 비표시 | 커뮤니티 기록 유지, 사용자 보호 | 개인정보 완전 삭제는 아님 |
| 삭제 여부 선택 | 사용자 자율성 존중 | 구현 복잡성, 사용자 응답 처리 필요 |

---

## 기술적으로 보면

- **모두 삭제할 경우**: FOREIGN KEY에 `ON DELETE CASCADE`를 걸어 user 삭제 시 연쇄 삭제 가능
- **글은 남기되 탈퇴 표시할 경우**: `user_id`를 NULL 처리하거나, \"탈퇴한 사용자\" 별도 시스템 계정으로 연결
- **삭제 여부를 선택할 경우**: 탈퇴 프로세스에서 사용자가 선택한 옵션에 따라 데이터 삭제 쿼리 실행

---

## 개인적인 추천

| 상황 | 추천 방법 |
|:---|:---|
| 커뮤니티 게시판, 포럼 | 글/댓글은 남기고 작성자는 \"탈퇴한 사용자\"로 표시 |
| 개인 SNS, 블로그 | 사용자의 요청에 따라 전부 삭제 (사진, 글 포함) |
| 기업 내부 시스템 | 보안 정책에 따라 개인정보 규정 준수, 필요 시 전부 삭제 |

❗ **요즘은 개인정보 보호법(GDPR)과 데이터 삭제 권리(DSR)가 강화되어,**  
**\"회원 요청 시 내 모든 데이터 삭제\"를 지원하는 것이 기본 트렌드입니다.**

---

## 최종 정리

| 질문 | 답변 |
|:---|:---|
| 탈퇴 시 글/좋아요 다 삭제해야 하나요? | ❌ 무조건은 아님. 서비스 정책에 따라 결정해야 함 |
| 서비스에 따라 다를 수 있나요? | ✔️ 네. 커뮤니티는 글 남기고, SNS는 삭제하는 경우가 많습니다 |
| 기술적으로 모두 삭제 가능하나요? | ✔️ FOREIGN KEY + ON DELETE CASCADE로 쉽게 구현 가능 |
| 선택적으로 삭제하고 싶으면? | ✔️ 탈퇴 과정에서 \"글/좋아요도 삭제하시겠습니까?\" 옵션 추가 필요 |

---
