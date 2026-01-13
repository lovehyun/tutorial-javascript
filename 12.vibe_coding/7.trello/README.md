# TaskFlow (Minimal Demo)

이 ZIP은 **최대한 단순하게** 동작 확인이 가능한 형태로 구성했습니다.

## 구조
- `TaskFlow_Project_Documentation.md` : 개요/API/ERD 문서
- `backend/` : Express + SQLite API
- `frontend/` : React(Vite) UI

## Quick Start (로컬)

### 1) Backend
```bash
cd backend
cp .env.example .env
npm i
npm run initdb
npm run dev
```

### 2) Frontend
새 터미널에서:
```bash
cd frontend
cp .env.example .env
npm i
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3001

## 사용 흐름
1) 회원가입 (가입 시 기본 워크스페이스/프로젝트/컬럼 자동 생성)
2) 로그인
3) 프로젝트 → 보드 열기
4) 태스크 추가 후 ←/→ 버튼으로 컬럼 이동, 삭제
