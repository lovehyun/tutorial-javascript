

# 네이버 로그인 및 OAuth 2.0 인증 프로세스

네이버 로그인은 OAuth 2.0 인증 프로토콜을 기반으로 동작하며, 사용자 인증 정보를 직접 공유하지 않고 **엑세스 토큰(access token)**을 통해 인증을 대체합니다.

---

## 네이버 로그인 구성 요소

- **클라이언트 애플리케이션**: 네이버 로그인을 구현한 웹 또는 모바일 애플리케이션.
- **네이버 인증 서버**: 사용자 인증 및 권한 부여를 처리하는 네이버의 서버.
- **리소스 서버 (네이버 API)**: 사용자의 프로필 데이터 등 리소스를 제공하는 서버.

---

## OAuth 2.0 인증 프로세스

### 단계별 흐름

#### 1. **사용자가 로그인 요청**
- 사용자가 클라이언트 애플리케이션의 "네이버로 로그인" 버튼을 클릭합니다.
- 애플리케이션은 **네이버 인증 서버**로 인증 요청을 보냅니다.

**요청 URL 예시**:
```
https://nid.naver.com/oauth2.0/authorize
```

**요청 파라미터**:
- `response_type`: `code` (인증 코드를 요청)
- `client_id`: 애플리케이션의 클라이언트 ID
- `redirect_uri`: 인증 완료 후 사용자 리디렉션 URL
- `state`: CSRF 공격 방지를 위한 임의의 값

---

#### 2. **사용자가 동의**
- 네이버 인증 서버는 사용자에게 정보 제공 동의 화면을 보여줍니다.
- 사용자가 동의하면 **인증 코드 (authorization code)**가 발급됩니다.

**리디렉션 URL 예시**:
```
https://your-app.com/callback?code=AUTH_CODE&state=STATE
```

---

#### 3. **엑세스 토큰 요청**
- 클라이언트 애플리케이션은 인증 코드(`code`)를 사용하여 **엑세스 토큰**을 요청합니다.

**토큰 요청 URL**:
```
https://nid.naver.com/oauth2.0/token
```

**요청 방식**: `POST`

**요청 파라미터**:
- `grant_type`: `authorization_code`
- `client_id`: 애플리케이션의 클라이언트 ID
- `client_secret`: 애플리케이션의 클라이언트 시크릿
- `code`: 사용자 인증 후 받은 인증 코드
- `state`: 초기 요청에서 사용한 `state`

---

#### 4. **엑세스 토큰 및 리프레시 토큰 수신**
- 네이버 인증 서버는 요청이 성공하면 **엑세스 토큰(access_token)**과 **리프레시 토큰(refresh_token)**을 반환합니다.

**응답 예시**:
```json
{
    "access_token": "AAA...BBB",
    "refresh_token": "CCC...DDD",
    "token_type": "bearer",
    "expires_in": 3600
}
```

---

#### 5. **네이버 API 호출**
- 클라이언트 애플리케이션은 엑세스 토큰을 사용하여 **네이버 리소스 서버**에 API 요청을 보냅니다.

**요청 URL 예시**:
```
https://openapi.naver.com/v1/nid/me
```

**헤더**:
```
Authorization: Bearer ACCESS_TOKEN
```

**응답 예시**:
```json
{
    "resultcode": "00",
    "message": "success",
    "response": {
        "id": "1234567890",
        "nickname": "홍길동",
        "profile_image": "http://example.com/image.png",
        "age": "20-29",
        "gender": "M",
        "email": "hong@example.com",
        "birthday": "10-05",
        "name": "홍길동"
    }
}
```

---

#### 6. **사용자 정보 활용**
- 클라이언트 애플리케이션은 응답 데이터를 사용하여 사용자 세션을 설정하거나, 애플리케이션 내 사용자 정보를 업데이트합니다.

---

## OAuth 2.0 인증 흐름 요약

1. **사용자 로그인 요청** → 인증 서버로 이동
2. **사용자 동의** → 인증 코드 발급
3. **엑세스 토큰 요청** → 인증 코드 사용
4. **엑세스 토큰 수신** → API 호출
5. **네이버 API로 사용자 정보 요청**

---

## 참고 자료

- [네이버 로그인 API 문서](https://developers.naver.com/docs/login/overview/)
- [OAuth 2.0 표준](https://oauth.net/2/)

---

# 네이버 로그인 사용자 동의 철회 안내

네이버 로그인 API에서 사용자 동의를 철회하려면 사용자가 직접 네이버 계정 관리 페이지를 통해 동의 상태를 철회해야 합니다. 네이버는 애플리케이션 개발자에게 동의 철회를 직접 처리할 수 있는 API를 제공하지 않습니다.

---

## 사용자 동의 철회 URL

1. **네이버 계정 관리 페이지**:  
   사용자는 아래 URL로 이동하여 **연결된 서비스 관리**에서 특정 애플리케이션에 대한 동의를 철회할 수 있습니다.

   ```
   https://nid.naver.com/user2/help/myInfo
   ```

2. **사용자가 해야 할 작업**:
   1. 네이버 계정으로 로그인.
   2. **보안 및 개인정보 관리** > **내 정보 관리** > **연결된 서비스 관리**로 이동.
   3. 애플리케이션 목록에서 특정 애플리케이션의 연결을 해제.

---

## 동의 철회 이후의 동작

- **API 호출 실패**:  
  동의가 철회된 이후, 애플리케이션이 API를 호출하려고 하면 인증 실패(`401 Unauthorized`) 상태 코드가 반환됩니다.
  
- **재동의 필요**:  
  사용자가 다시 애플리케이션에 로그인하면, 동의 화면이 다시 표시되고 동의를 받아야 데이터를 다시 받을 수 있습니다.

---

## 애플리케이션 내에서 사용자 동의 상태 확인 방법

네이버는 동의 철회 API를 제공하지 않지만, 애플리케이션에서 사용자 동의 상태를 간접적으로 확인할 수 있습니다.

### 1. **API 호출 시도**
사용자의 `access token`을 이용하여 API를 호출합니다. 호출이 실패하면, 사용자가 동의를 철회했거나 `access token`이 만료되었을 가능성이 있습니다.

### 2. **예제 코드**

```javascript
const axios = require('axios');

const accessToken = '사용자_엑세스_토큰';

axios.get('https://openapi.naver.com/v1/nid/me', {
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
})
.then(response => {
    console.log('사용자 정보:', response.data);
})
.catch(error => {
    if (error.response && error.response.status === 401) {
        console.error('사용자 동의가 철회되었거나 토큰이 만료되었습니다.');
    } else {
        console.error('오류 발생:', error.message);
    }
});
```

### 3. **401 Unauthorized 처리**
- 사용자에게 다시 동의를 요청하거나, 재로그인을 유도합니다.

---

## 관련 참고 자료

- [네이버 로그인 API 문서](https://developers.naver.com/docs/login/overview/)
- [네이버 고객센터 - 동의 철회 방법 안내](https://help.naver.com/)

---

## 요약

- 사용자 동의 철회는 **네이버 계정 관리 페이지**에서만 가능합니다.
- 동의 철회 후, 애플리케이션은 API 호출 실패를 통해 간접적으로 철회를 인지할 수 있습니다.
- 사용자가 동의 철회 후 다시 로그인하면, **동의 화면**이 다시 표시됩니다.
