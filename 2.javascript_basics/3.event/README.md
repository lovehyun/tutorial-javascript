# JavaScript 주요 전역 객체 (브라우저 환경 기준)

| 객체 | 설명 |
|------|------|
| window | 브라우저 창 자체를 의미하는 최상위 객체. 모든 전역 변수, 전역 함수, DOM 객체가 window의 속성으로 존재. |
| document | 웹 페이지 자체(DOM)를 의미. 페이지 내용을 조작, 읽기, 생성할 수 있음. |
| navigator | 브라우저의 정보를 담은 객체. 사용자 에이전트, 브라우저 버전, 플랫폼 등을 확인할 수 있음. |
| screen | 사용자의 모니터 정보를 제공. 해상도, 색상, 가로 세로 크기 등을 알 수 있음. |
| history | 브라우저의 방문 기록을 제어. 이전 페이지로 이동하거나 앞으로 가는 등의 작업 가능. |
| location | 현재 페이지의 URL 정보를 제공. 다른 URL로 이동하거나 쿼리 스트링 등을 확인할 수 있음. |
| console | 개발자 도구에 로그 출력을 위한 객체. (ex: console.log) |
| localStorage | 브라우저에 데이터를 영구 저장하는 객체. (탭/브라우저를 닫아도 유지) |
| sessionStorage | 브라우저에 데이터를 임시 저장하는 객체. (탭을 닫으면 사라짐) |
| fetch | HTTP 요청을 보내는 비동기 API. AJAX의 최신 버전. |
| alert, confirm, prompt | 브라우저의 팝업 창을 띄우는 기본 함수들. (window 객체 소속) |

## 각 객체 간단 설명

### 1. window
브라우저 탭 또는 창 전체를 의미. 모든 전역 변수, 전역 함수, DOM 객체가 window의 속성으로 존재.

```javascript
window.alert('Hello!');
```

### 2. document
현재 HTML 페이지(DOM 트리)에 접근하는 객체.

```javascript
const title = document.querySelector('h1');
title.textContent = 'Changed!';
```

### 3. navigator
브라우저 환경 정보를 제공.

```javascript
console.log(navigator.userAgent);
console.log(navigator.language);
```

### 4. screen
사용자의 디스플레이 정보를 가져올 수 있음.

```javascript
console.log(screen.width);
console.log(screen.height);
```

### 5. history
사용자가 방문한 페이지 목록을 다룰 수 있음.

```javascript
history.back();
history.forward();
```

### 6. location
현재 URL 정보 확인 및 변경 가능.

```javascript
console.log(location.href);
location.href = 'https://google.com';
```

### 7. console
로그, 에러, 경고 메시지 출력.

```javascript
console.log('Log message');
console.error('Error message');
console.warn('Warning message');
```

### 8. localStorage / sessionStorage
데이터 저장소
- localStorage: 브라우저를 껐다 켜도 데이터 유지
- sessionStorage: 브라우저를 닫으면 데이터 사라짐

```javascript
localStorage.setItem('key', 'value');
console.log(localStorage.getItem('key'));
```

### 9. fetch
비동기 HTTP 요청 (AJAX 대체)

```javascript
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data));
```

### 10. alert, confirm, prompt
사용자 입력 받기 또는 간단한 팝업 표시

```javascript
alert('Hello!');
confirm('Are you sure?');
prompt('Enter your name:');
```

## 정리
- window: 전체 브라우저
- document: 페이지 자체 (DOM)
- navigator: 브라우저 정보
- screen: 디스플레이 정보
- history: 방문 기록 제어
- location: URL 정보 제어
- console: 개발자 로그
- localStorage: 데이터 저장 (영구)
- sessionStorage: 데이터 저장 (임시)
- fetch: HTTP 요청
- alert/confirm/prompt: 팝업 함수
