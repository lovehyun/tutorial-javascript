# 기존 express-session 방식 대신 jwt 방식으로 변경
```
app.js         ← Express 서버 (JWT 사용)
public/
  ├── index.html     ← 수정 없음
  ├── login.html     ← 수정 없음
  ├── register.html  ← 수정 없음
  ├── profile.html   ← 수정 없음
  ├── tweet.html     ← 수정 없음
  ├── css/
  │    └── style.css  ← 수정 없음
  ├── js/
       ├── common.js  ← 수정 (JWT 대응)
       ├── index.js   ← 수정 (Authorization 헤더 추가)
       ├── login.js   ← 수정 (토큰 저장)
       ├── register.js← 수정 없음
       ├── profile.js ← 수정 (Authorization 추가)
       ├── tweet.js   ← 수정 (Authorization 추가)
```

# 수정 요약
```
파일 | 변경내용
app.js | express-session 제거, JWT 발급 및 인증 적용
common.js | localStorage에서 토큰 관리, fetch에 Authorization 추가
login.js | 로그인 후 토큰 저장
index.js | Authorization 헤더 추가
profile.js | Authorization 헤더 추가
tweet.js | Authorization 헤더 추가
```
