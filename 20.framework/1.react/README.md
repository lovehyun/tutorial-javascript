# 프로젝트 구조

프로젝트는 클라이언트 측 React 애플리케이션과 서버 측 Express 애플리케이션으로 구성되어 있습니다.

## 전체 디렉토리 구조
```
project-root/
|-- client/         // React 프론트엔드 디렉토리
|   |-- public/
|   |   |-- index.html
|   |
|   |-- src/
|   |   |-- index.js
|   |   |-- App.js
|   |   |-- components/
|   |   |   |-- ...
|   |
|   |-- package.json
|
|-- server/         // Express 백엔드 디렉토리
|   |-- server.js
|   |-- package.json
|
|-- package.json    // 전체 프로젝트의 메타 정보 및 의존성
```

## React 프론트엔드 (client)

React 프론트엔드는 다음과 같은 구조를 가지고 있습니다:

- **public:** 정적 파일 및 HTML 파일이 포함된 디렉토리입니다.
  - `index.html`: React 앱의 진입점 HTML 파일입니다.

- **src:** React 앱의 소스 코드가 포함된 디렉토리입니다.
  - `index.js`: React 앱의 진입점 JavaScript 파일입니다.
  - `App.js`: 앱의 메인 컴포넌트입니다.
  - `components/`: 추가 컴포넌트들이 위치하는 디렉토리입니다.

- **package.json:** 프로젝트의 메타 정보와 프론트엔드 의존성이 정의된 파일입니다.

## Express 백엔드 (server)

Express 백엔드는 다음과 같은 구조를 가지고 있습니다:

- **server.js:** Express 애플리케이션의 진입점 JavaScript 파일입니다.

- **package.json:** 프로젝트의 메타 정보와 백엔드 의존성이 정의된 파일입니다.

# 설치

React 프론트엔드 및 Express 백엔드를 설치하기 위해 다음 명령어를 사용합니다.

## React 프론트엔드 설치:

```bash
npx create-react-app client
cd client
npm install axios
```

## Express 백엔드 모듈 설치:
```
mkdir server
cd server
npm init -y
npm install express
npm install nodemon --save-dev
```

# 배포

프로젝트를 배포하려면 다음 단계를 따르니다.

## React 앱 빌드

React 앱을 빌드하려면 다음 명령어를 실행합니다:

```
npm run build
```
빌드 명령은 build 디렉토리에 정적 파일들을 생성합니다.

## 웹 서버 설정

정적 파일들을 호스팅하기 위해 웹 서버를 설정해야 합니다. 여러 가지 방법이 있지만, 간단한 방법으로는 serve 또는 http-server 같은 간단한 정적 파일 서버를 사용할 수 있습니다.

### server를 사용하는 경우

```
# serve를 전역으로 설치하는 경우
npm install -g serve

# 빌드된 앱을 serve
serve -s build
```

또는

### http-server를 사용하는 경우

```
# http-server를 전역으로 설치하는 경우
npm install -g http-server

# 빌드된 앱을 http-server로 호스팅
http-server ./build -p 3000
```

이제 http://localhost:3000 (또는 사용하는 포트)에서 앱이 사용자에게 제공됩니다.


## 앱 통합 배포

express 로 개발된 앱에서 react의 프런트엔드를 서빙하려면 아래와 같은 방법으로 코드의 빌드 파일을 복사해 줍니다.

```
cp -r your-react-app/build your-express-server/public
```
