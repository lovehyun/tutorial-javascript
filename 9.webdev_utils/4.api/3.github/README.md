
# GitHub API 사용법 (Node.js)

## 개요
GitHub API는 GitHub의 리포지토리, 사용자 정보, 이슈 등 다양한 데이터를 프로그램matically 접근할 수 있게 해줍니다. 이 문서에서는 Node.js를 사용하여 GitHub API와 연동하는 방법을 소개합니다.

---

## 주요 API 엔드포인트

### 1. 사용자 정보 가져오기
- **URL**: `https://api.github.com/users/{username}`
- **기능**: 특정 사용자의 정보를 가져옵니다.

### 2. 리포지토리 정보 가져오기
- **URL**: `https://api.github.com/repos/{owner}/{repo}`
- **기능**: 특정 리포지토리의 정보를 가져옵니다.

### 3. 리포지토리 이슈 목록 가져오기
- **URL**: `https://api.github.com/repos/{owner}/{repo}/issues`
- **기능**: 특정 리포지토리의 이슈 목록을 가져옵니다.

---

## 예제 코드

### 1. 사용자 정보 가져오기

```javascript
const axios = require('axios');

async function getUserInfo(username) {
    const url = `https://api.github.com/users/${username}`;
    try {
        const response = await axios.get(url);
        console.log("사용자 정보:", response.data);
    } catch (error) {
        console.error("에러 발생:", error.message);
    }
}

// 'octocat' 사용자의 정보 가져오기
getUserInfo('octocat');
```

### 2. 리포지토리 정보 가져오기

```javascript
const axios = require('axios');

async function getRepoInfo(owner, repo) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    try {
        const response = await axios.get(url);
        console.log("리포지토리 정보:", response.data);
    } catch (error) {
        console.error("에러 발생:", error.message);
    }
}

// 특정 리포지토리 정보 가져오기
getRepoInfo('octocat', 'Hello-World');
```

### 3. 리포지토리 이슈 목록 가져오기

```javascript
const axios = require('axios');

async function getRepoIssues(owner, repo) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
    try {
        const response = await axios.get(url);
        console.log("이슈 목록:", response.data);
    } catch (error) {
        console.error("에러 발생:", error.message);
    }
}

// 특정 리포지토리의 이슈 가져오기
getRepoIssues('octocat', 'Hello-World');
```

---

## 참고 사항
1. **Rate Limit**: 비인증 요청은 시간당 60번으로 제한됩니다. 인증을 통해 더 많은 요청을 보낼 수 있습니다.
2. **Authentication**: 인증 요청을 위해 `Authorization` 헤더에 개인 액세스 토큰을 추가하세요.

### 인증 요청 예제
```javascript
const axios = require('axios');

async function getAuthenticatedUserInfo(username, token) {
    const url = `https://api.github.com/users/${username}`;
    const headers = {
        Authorization: `token ${token}`
    };
    try {
        const response = await axios.get(url, { headers });
        console.log("인증된 사용자 정보:", response.data);
    } catch (error) {
        console.error("에러 발생:", error.message);
    }
}

// 사용자 정보 가져오기
getAuthenticatedUserInfo('octocat', 'your_personal_access_token_here');
```

---

## 참고 링크
- [GitHub API 공식 문서](https://docs.github.com/en/rest)
- [GitHub Personal Access Token 생성 방법](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## .env 파일 예제 (토큰 저장)
```
GITHUB_TOKEN=your_personal_access_token_here
```

---

## 실행 예제
```
node example.js
```

---

## 주의 사항
- **토큰 보안**: 개인 액세스 토큰은 노출되지 않도록 주의하세요.
- **요청 속도 제한**: 인증 없이 요청 시 제한이 더 엄격하니 인증을 사용하는 것을 권장합니다.
