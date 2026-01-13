
# TaskFlow – 협업 중심 생산성 관리 웹서비스

## 1. 프로젝트 개요

### 1.1 프로젝트 명
TaskFlow

### 1.2 프로젝트 목적
TaskFlow는 팀 단위 협업을 지원하는 생산성 관리 웹서비스로,
프로젝트·태스크·상태(Kanban)를 기반으로 업무를 시각적으로 관리할 수 있도록 돕는 것을 목표로 합니다.

### 1.3 핵심 특징
- React 기반 SPA 프론트엔드
- Node.js(Express) REST API 백엔드
- JWT 기반 인증
- Kanban 보드 기반 태스크 관리
- 팀/워크스페이스 단위 협업

---

## 2. 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React, HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| DB | SQLite / MySQL |
| Auth | JWT |
| 협업 | REST API, JSON |

---

## 3. REST API 명세

### 3.1 공통 사항
- Base URL: `/api/v1`
- Header:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

### 3.2 인증(Auth)

#### 회원가입
- POST `/auth/signup`
```json
{ "email": "user@test.com", "password": "Pass1234!", "name": "홍길동" }
```

#### 로그인
- POST `/auth/login`
```json
{ "email": "user@test.com", "password": "Pass1234!" }
```

#### 내 정보 조회
- GET `/auth/me`

---

### 3.3 워크스페이스

#### 워크스페이스 목록
- GET `/workspaces`

#### 워크스페이스 생성
- POST `/workspaces`
```json
{ "name": "팀 A" }
```

---

### 3.4 프로젝트

#### 프로젝트 생성
- POST `/workspaces/:workspaceId/projects`
```json
{ "name": "웹 리뉴얼", "description": "메인 페이지 개선" }
```

#### 프로젝트 목록
- GET `/workspaces/:workspaceId/projects`

---

### 3.5 컬럼(Kanban)

#### 컬럼 생성
- POST `/projects/:projectId/columns`
```json
{ "name": "Todo", "order": 1 }
```

#### 컬럼 정렬 변경
- PATCH `/projects/:projectId/columns/reorder`

---

### 3.6 태스크(Task)

#### 태스크 생성
- POST `/columns/:columnId/tasks`
```json
{
  "title": "로그인 구현",
  "description": "JWT 적용",
  "assigneeId": "u2",
  "dueDate": "2026-01-20"
}
```

#### 태스크 이동
- PATCH `/tasks/:taskId/move`
```json
{ "fromColumnId": "c1", "toColumnId": "c2", "toOrder": 1 }
```

---

## 4. ERD (ASCII)

```
+------------------+       +------------------+
|      users       |       |   workspaces     |
|------------------|       |------------------|
| PK id            |<----+ | PK id            |
| email (UQ)       |     | | name             |
| password_hash    |     | | created_at       |
| name             |     | +------------------+
+------------------+     |
                         |
                         |   +---------------------------+
                         +---|       memberships         |
                             |---------------------------|
                             | PK id                     |
                             | FK workspace_id           |
                             | FK user_id                |
                             | role                      |
                             +---------------------------+

+------------------+        +------------------+
|     projects     |        |     columns      |
|------------------|        |------------------|
| PK id            |        | PK id            |
| FK workspace_id  |------->| FK project_id    |
| name             |        | name             |
+------------------+        | order            |
                            +------------------+

+------------------+
|      tasks       |
|------------------|
| PK id            |
| FK column_id     |
| title            |
| description      |
| assignee_id      |
| due_date         |
| order            |
+------------------+
```

---

## 5. 기대 효과
- 팀 협업 구조 이해
- REST API 설계 경험
- React 상태 관리 및 컴포넌트 설계 경험
- 실무형 포트폴리오 확보
