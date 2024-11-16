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

http://localhost:5000에서 확인할 수 있습니다.
