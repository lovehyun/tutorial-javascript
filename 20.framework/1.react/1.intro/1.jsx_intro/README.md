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
