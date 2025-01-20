## 1. 프로젝트 설정
프로젝트 초기화:

```bash
mkdir express-ts-app
cd express-ts-app
npm init -y
```

## 2. TypeScript 및 필요한 패키지 설치
```bash
npm install express
npm install --save-dev typescript @types/node @types/express ts-node-dev
```
- express: Express 프레임워크.
- typescript: TypeScript 컴파일러.
- @types/node: Node.js 타입 정의 파일.
- @types/express: Express 타입 정의 파일.
- ts-node-dev: TypeScript로 작성된 코드를 바로 실행 및 개발 중 재시작.

## 3. TypeScript 설정 파일 생성
```bash
npx tsc --init
```

tsconfig.json에서 다음을 수정합니다:
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```
- target: JavaScript ES6로 컴파일.
- module: CommonJS 모듈 시스템 사용.
- rootDir: TypeScript 소스 파일 디렉토리.
- outDir: 컴파일된 JavaScript 출력 디렉토리.
- esModuleInterop: ES 모듈과 CommonJS 간 호환성 설정.

추가로, express 에서는 export = 을 사용하고 있어 import 와 호환성이 없음. 추가로 설정 추가 필요.
```json
    "esModuleInterop": true
```

## 4. 프로젝트 디렉토리 구조 생성

```bash
/express-ts-app
├── /src
│   └── app.ts
├── tsconfig.json
├── package.json
```

## 5. 앱 실행 방법
TypeScript 코드를 직접 실행하려면 ts-node를 사용:

```bash
npx ts-node src/app.ts
```

또는 TypeScript 파일을 JavaScript로 컴파일 후 실행:

```bash
npx tsc
node dist/app.js
```

또는 프로젝트 파일 생성해서 실행

package.json 스크립트 수정
```json
"scripts": {
  "dev": "ts-node-dev src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

- dev: ts-node-dev로 개발 중 실시간 코드 변경 감지.
- build: TypeScript 코드를 JavaScript로 컴파일.
- start: 컴파일된 JavaScript 코드 실행.

```bash
npm run dev
```
