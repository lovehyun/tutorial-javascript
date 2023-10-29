# 상태관리
## 개요
 - HTTP 요청은 stateless 한 상태로 요청과 응답을 받게 됨으로, 사용자의 로그인 정보 등의 인증 정보를 유지 할 필요성이 있음. 
## 세션이란?
 - 방문자의 접속 상태를 서버사이드에 기록. 웹 브라우저로부터 연결이 와서, 종료 될 때 까지의 상태.
## 쿠키란?
 - 방문자의 접속 상태를 클라이언트사이드(브라우저) 에 저장하기 위해 정보를 담는 공간 (메모리/파일)
## 동작 방식
 - 사용자가 로그인을 하면 (POST /user/login) 세션을 생성하고 (서버사이드 메모리), 이 정보 (세션ID) 를 클라이언트에 사이드에 전달하면, 클라이언트는 해당 정보를 쿠키에 저장해두고, 다른 페이지를 요청할 때마다 사용.
## JWT
 - JSON Web Token : Header + Payload + Signature (헤더+내용+서명)
 - ```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImhlbGxvIiwiaWF0IjoxNjMzNjY5NzUwLCJleHAiOjE2MzM2Njk4MTB9.fQsPlwh4ukk7LZdlCjs48n912RwuPrEQahYMg22MAfI```
 - typ : JWT, alg : HS256 (HMAC SHA256)
 - iat : issued at
 - exp : expiration

# 예제코드
## 3.session
 - npm install http express express-session memorystore session-file-store mysql express-mysql-session body-parser

## 10.jwt
 - npm install express jsonwebtoken dotenv 

## 11.passport
 - npm install http express express-session express-mysql-session body-parser passport passport-local
 - npm install better-sqlite3 better-express-store

## 12.passport-google-oauth
 - npm install http express express-session express-mysql-session passport passport-google-oauth2
 - npm install better-sqlite3 better-express-store
 - 로그인 버튼 가이드라인 준수 필요
   - https://developers.google.com/identity/branding-guidelines?hl=ko
 - 구글 console 에서 "API 및 서비스" 에서 Oauth Client 생성 및 다운로드 
   - https://console.developers.google.com/apis
     - 사용자 인증 정보 만들기
     - Oauth 클라이언트 ID
       - 웹 애플리케이션
       - google login test
       - URI : http://localhost:8080
       - 승인된 리디렉션 URI : http://localhost:8080/auth/google/callback

## 13.passport-oauth2
 - npm install http express express-session express-mysql-session passport passport-oauth2
 - npm install better-sqlite3 better-express-store

# 참고자료
- https://opentutorials.org/course/3400/21831
- https://expressjs.com/ko/guide/database-integration.html
