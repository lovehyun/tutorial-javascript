## 1. 리액트 프로젝트 생성
create-react-app 명령어를 사용하면 간단히 시작할 수 있습니다.

```bash
npx create-react-app my-app
cd my-app
```

## 2. 코드 수정
위의 "헬로우 월드" 코드를 src/App.js에 붙여넣습니다.

## 3. 개발 서버 실행
```bash
npm start
```

브라우저에서 http://localhost:3000에 접속하면 리액트 앱이 실행됩니다.

## 4. 프로덕션 빌드
프로덕션 환경용으로 최적화된 빌드를 생성하려면:

```bash
npm run build
```

build 폴더가 생성되고, 배포 가능한 정적 파일들이 포함됩니다.

## 5. 빌드된 파일 배포
### 정적 서버로 제공
build 폴더를 Nginx, Apache 또는 Vercel 등의 정적 호스팅 서비스로 배포합니다.

### 테스트 로컬 서버 실행
serve 패키지를 사용하면 빌드된 파일을 간단히 테스트할 수 있습니다:

```bash
npm install -g serve
serve -s build
```

serve 패키지로 제공되는 애플리케이션의 기본 포트는 3000입니다. 이를 변경하려면 -l(또는 --listen) 옵션을 사용하여 원하는 포트를 지정할 수 있습니다.

포트 변경 명령
```bash
serve -s build -l 4000
serve -s build -l tcp://0.0.0.0:5000
```

옵션 설명
-s build: 정적 파일을 제공하는 디렉터리(build)를 지정.
-l 4000: 4000번 포트로 서버를 실행. 원하는 포트 번호로 변경 가능.
-l tcp://0.0.0.0:5000 0.0.0.0 주소와 포트 5000번으로 오픈.

---

## 6. Express를 통한 배포

React 애플리케이션을 `npm run build` 명령으로 빌드한 후, Express를 사용하여 서빙하는 방법은 아래와 같습니다.

---

### 1. React 애플리케이션 빌드
1. React 프로젝트 디렉토리에서 아래 명령을 실행하여 `build` 디렉토리를 생성합니다:

    ```bash
    npm run build
    ```

2. `build` 디렉토리에는 React 애플리케이션의 정적 파일들이 포함됩니다.

---

### 2. Express 서버 생성
1. **Express 설치**  
   React 프로젝트 폴더에서 Express를 설치합니다:

    ```bash
    npm install express
    ```

2. **Express 서버 코드 작성**  
   React의 `build` 디렉토리를 정적 파일로 서빙하기 위해 `express.static`을 사용합니다.  
   `server.js` 파일을 생성하고 아래 코드를 추가합니다:

    ```javascript
    const express = require('express');
    const path = require('path');

    const app = express();

    // Build 폴더를 정적 파일로 서빙
    app.use(express.static(path.join(__dirname, 'build')));

    // 모든 요청에 대해 React의 index.html 반환
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    // 서버 실행
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    ```

---

### 3. 서버 실행
`server.js` 파일을 실행하여 Express 서버를 시작합니다:

```bash
node server.js
```

브라우저에서 http://localhost:3000에 접속하면 React 애플리케이션이 표시됩니다.

---

### 4. 주요 사항
- **정적 파일 서빙**:  
  `express.static`은 React의 `build` 폴더 안의 정적 파일 (`.html`, `.css`, `.js`)을 서빙합니다.

- **라우팅 처리**:  
  React는 클라이언트 사이드 라우팅을 사용하므로, Express에서 처리되지 않은 모든 요청은 React의 `index.html`을 반환해야 합니다.

- **환경 변수**:  
  `PORT`는 환경 변수로 설정하거나 기본값으로 3000번 포트를 사용합니다.

---

### 5. 배포 시 추가 고려 사항
1. **압축**:  
   `compression` 미들웨어를 사용하여 정적 파일을 Gzip으로 압축해 성능을 향상시킬 수 있습니다.

2. **보안**:  
   `helmet`과 같은 미들웨어를 추가하여 Express 서버의 보안을 강화합니다:

    ```bash
    npm install compression helmet
    ```

3. **수정된 `server.js` 코드**:

    ```javascript
    const express = require('express');
    const path = require('path');
    const compression = require('compression');
    const helmet = require('helmet');

    const app = express();

    // 보안 강화 및 압축 적용
    app.use(helmet());
    app.use(compression());

    // Build 폴더를 정적 파일로 서빙
    app.use(express.static(path.join(__dirname, 'build')));

    // 모든 요청에 대해 React의 index.html 반환
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    // 서버 실행
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    ```

---

위 과정을 따르면 React 빌드 결과물을 Express로 안정적으로 서빙할 수 있습니다.
