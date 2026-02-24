dependencies
- "express": 백엔드 API 서버를 돌리기 위한 프레임워크.

devDependencies
- "typescript": TS 컴파일러.
- "ts-node": ts-node 방식으로 TypeScript를 직접 실행하기 위해 필요.
- "ts-node-dev": 개발 모드에서 자동 재기동 지원 (nodemon 스타일).
  → npm run dev 하면 즉시 코드 변경 반영됨.
- "@types/node": Node.js 내장 모듈 타입을 제공 (readline, process, __dirname 등).
- "@types/express": Express 타입 정보 제공.

scripts
- npm run dev	개발 모드 실행 (ts-node-dev, 자동 reload)
- npm run build	TS → JS 빌드 (dist 폴더 생성)
- npm run start	빌드된 dist/server.js 실행
개발할 때는 dev, 배포할 때는 build → start 순서로 쓰면 됩니다.
