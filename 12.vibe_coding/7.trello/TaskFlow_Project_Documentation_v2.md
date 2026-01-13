
# TaskFlow v2 – 협업 중심 생산성 관리 웹서비스

## 1. 프로젝트 개요

### 1.1 프로젝트 명
TaskFlow v2

### 1.2 프로젝트 목적
TaskFlow는 팀 단위 협업을 지원하는 생산성 관리 웹서비스로, 프로젝트·태스크·상태(Kanban/Gantt)를 기반으로 업무를 시각적으로 관리할 수 있도록 돕습니다. v2에서는 사용자 경험(UX) 개선과 백엔드 아키텍처 고도화에 집중하였습니다.

### 1.3 핵심 특징 (v2 변경사항 포함)
- **Layered Architecture**: Routes, Controllers, Services 계층 분리 (유지보수성 강화)
- **다양한 뷰 모드**: Kanban Board 및 Gantt Chart 지원 (Drag & Drop, Hover Tooltip)
- **샘플 데이터 생성**:
    - **Sample Project #1**: 영어, IT 스타트업 시나리오 (3 Columns)
    - **Sample Project #2**: 한국어, 마케팅 캠페인 시나리오 (4 Columns)
- **간편 로그인**: "Start with Sample User" 기능으로 즉시 데모 체험 가능 (`demo@sample.com`)
- **UI/UX 개선**: TailwindCSS 기반의 모던한 디자인, 커스텀 모달(Alert/Confirm) 시스템 적용

---

## 2. 기술 스택

| 구분 | 기술 | 설명 |
|---|---|---|
| **Frontend** | React, Vite | SPA 구현 |
| | TailwindCSS | 모던 UI 스타일링 |
| | @hello-pangea/dnd | Kanban Board Drag & Drop |
| | React Router DOM | SPA 라우팅 |
| | Context API | 전역 모달 관리 |
| **Backend** | Node.js, Express | REST API 서버 |
| | SQLite | 경량 관계형 데이터베이스 |
| | bcryptjs | 비밀번호 암호화 |
| | JWT | 무상태 인증 (Authentication) |
| | Nodemon | 개발 생산성 (Hot-reloading) |

---

## 3. 백엔드 아키텍처 (New)

기존의 단일 파일 구조(`routes.js`, `db.js`)에서 역할별로 디렉토리를 분리하여 확장성과 가독성을 높였습니다.

```
backend/src/
├── controllers/    # 요청 처리 및 응답 반환 (auth, project, task, workspace)
├── services/       # 비즈니스 로직 및 DB 연동 (auth, project, task, workspace)
├── routes/         # API 라우팅 정의 (domain별 파일 분리 + index.js 통합)
├── middlewares/    # 인증(auth) 등 미들웨어
├── database/       # DB 연결, 스키마 초기화(init), 시딩(seed)
└── utils/          # 공통 유틸리티 (helpers)
```

---

## 4. REST API 명세 (v2 업데이트)

### 4.1 공통 사항
- Base URL: `/api/v1`
- Header: `Authorization: Bearer <access_token>`

### 4.2 인증 (Auth)
#### 회원가입
- **POST** `/auth/signup`
- Body: `{ "email": "...", "password": "...", "name": "..." }`

#### 로그인
- **POST** `/auth/login`
- Body: `{ "email": "...", "password": "..." }`

#### 샘플 유저 시작 (v2 New)
- **POST** `/auth/sample`
- Response: 생성된 또는 검색된 `demo@sample.com` 유저 토큰 반환

#### 내 정보 조회
- **GET** `/auth/me`

### 4.3 워크스페이스 (Workspace)
#### 목록 조회
- **GET** `/workspaces`

### 4.4 프로젝트 (Project)
#### 프로젝트 목록
- **GET** `/workspaces/:workspaceId/projects`

#### 프로젝트 생성
- **POST** `/workspaces/:workspaceId/projects`
- Body: `{ "name": "...", "description": "..." }`

#### 샘플 프로젝트 생성 (v2 New)
- **POST** `/workspaces/:workspaceId/projects/seed`
- Body: `{ "type": 1 }` (1: English/IT, 2: Korean/Marketing)
- Description: 지정된 타입의 샘플 프로젝트와 realistic한 태스크 데이터를 자동 생성

#### 프로젝트 삭제
- **DELETE** `/projects/:projectId`

#### 보드 데이터 조회 (Kanban/Gantt)
- **GET** `/projects/:projectId/board`
- Response: 
    ```json
    {
      "id": "p_...",
      "projectName": "...",
      "columns": [{ "id": "...", "name": "...", "ord": 1 }],
      "tasksByColumn": { "c_...": [ ...tasks ] }
    }
    ```

### 4.5 태스크 (Task)
#### 태스크 생성
- **POST** `/columns/:columnId/tasks`
- Body: `{ "title": "...", "description": "..." }`

#### 태스크 이동
- **PATCH** `/tasks/:taskId/move`
- Body: `{ "toColumnId": "...", "toOrder": 2 }`

#### 태스크 수정
- **PATCH** `/tasks/:taskId`
- Body: `{ "title": "...", "description": "...", "startDate": "...", "endDate": "..." }`

#### 태스크 삭제
- **DELETE** `/tasks/:taskId`

---

## 5. ERD (Entity Relationship Diagram)

v2에는 Gantt Chart를 위한 날짜 필드(`start_date`, `end_date`)가 Task 테이블에 추가되었습니다.

```
+------------------+       +------------------+
|      users       |       |   workspaces     |
|------------------|       |------------------|
| PK id            |<----+ | PK id            |
| email (UQ)       |     | | name             |
| password_hash    |     | | created_at       |
| name             |     | +------------------+
| created_at (New) |     |
+------------------+     |
                         |
                         |   +---------------------------+
                         +---|       memberships         |
                             |---------------------------|
                             | PK id                     |
                             | FK workspace_id           |
                             | FK user_id                |
                             | role                      |
                             | joined_at  (New)          |
                             +---------------------------+

+------------------+        +------------------+
|     projects     |        |     columns      |
|------------------|        |------------------|
| PK id            |        | PK id            |
| FK workspace_id  |------->| FK project_id    |
| name             |        | name             |
| description (New)|        | ord              |
| created_by  (New)|        | created_at (New) |
| created_at  (New)|        +------------------+
+------------------+
         |
         |
         v
+------------------+
|      tasks       |
|------------------|
| PK id            |
| FK project_id    |
| FK column_id     |
| title            |
| description      |
| assignee_id      |
| due_date         |
| start_date (New) |
| end_date   (New) |
| priority   (New) |
| status     (New) |
| ord              |
| created_by (New) |
| created_at (New) |
+------------------+
```

---

## 6. 기대 효과
- **아키텍처 이해**: MVC 패턴과 유사한 Layered Architecture 경험
- **사용자 경험(UX) 중심 개발**: 로딩 상태, 시각적 피드백, 샘플 데이터 제공을 통한 온보딩 개선
- **풀스택 통합**: 프론트엔드(React)와 백엔드(Node/Express/DB)의 유기적인 연동 및 에러 핸들링
- **실무형 기능**: Gantt Chart, Drag & Drop, 커스텀 모달 등 실제 협업 툴의 핵심 기능 구현
