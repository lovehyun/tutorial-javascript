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
npm install --save-dev typescript @types/node @types/express ts-node
```

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
추가로, express 에서는 export = 을 상요하고 있어 import 와 호환성이 없음. 추가로 설정 추가 필요.
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
