# Multi-Shoot

3개의 게임 룸 × 5명 멀티플레이어 슈팅 갤러리. WebSocket(Socket.IO) 실시간 동기화, SQLite 영구 저장, Docker + reverse proxy 친화적 설계.

## 주요 기능

- **로비**: 3개의 게임 룸 (각 5명 max), 채팅, 명예의 전당
- **게임 룸**: 게임 진행 중에도 자유롭게 입퇴장 가능
- **솔로 모드**: `나홀로하기` — 서버 통신 없이 혼자 플레이
- **명예의 전당 / 통계 대시보드**: SQLite 영구 저장, IP/플레이수/점수/스테이지별 4대 대시보드
- **닉네임**: localStorage 저장, 언제든 변경 가능
- **역프록시 친화**: `X-Forwarded-For` 기반 클라이언트 IP, prefix 기반 경로 자동 감지, ws/wss 자동 결정

## 구조

```
.
├── server.js                # 엔트리 포인트
├── package.json
├── Dockerfile
├── docker-compose.yml
├── nginx.conf               # 예시 (선택)
├── server/
│   ├── config.js
│   ├── utils.js
│   ├── db.js                # SQLite 스키마/쿼리
│   ├── lobby.js             # 로비 + 채팅 매니저
│   ├── room.js              # 룸별 게임 시뮬레이션
│   └── routes.js            # REST API
├── public/
│   ├── index.html           # 로비
│   ├── room.html            # 게임 (멀티)
│   ├── solo.html            # 게임 (싱글)
│   ├── stats.html           # 통계 대시보드
│   ├── css/
│   │   ├── common.css
│   │   ├── lobby.css
│   │   ├── room.css
│   │   └── stats.css
│   └── js/
│       ├── socket.js        # Socket.IO 연결 헬퍼 (prefix 자동감지)
│       ├── nickname.js      # localStorage 닉네임 관리
│       ├── lobby.js
│       ├── room.js
│       └── stats.js
└── data/                    # SQLite 파일 (자동 생성)
```

## 실행

### 로컬

```bash
npm install
npm start
# → http://localhost:3000
```

### Docker

```bash
docker compose up --build
# → http://localhost:3000
```

### Docker + nginx 역프록시 (prefix `/shoot/`)

```bash
docker compose --profile proxy up --build
# → http://localhost:8080/shoot/
```

`nginx.conf` 가 `/shoot/` 를 backend `/` 로 forward 하면서 `X-Forwarded-For` / `X-Forwarded-Proto` / WebSocket 업그레이드 헤더를 모두 전달합니다.

## API

| Method | Path                | 용도 |
|--------|---------------------|------|
| GET    | `/api/halloffame`   | 점수/스테이지 TOP 10 |
| GET    | `/api/stats`        | 4대 대시보드 데이터 |
| GET    | `/api/whoami`       | 클라이언트 IP (디버그) |

WebSocket 이벤트는 `server/lobby.js`, `server/room.js` 의 `socket.on(...)` 핸들러를 참고하세요.

## 환경변수

| 키        | 기본값                          | 설명 |
|-----------|--------------------------------|------|
| `PORT`    | `3000`                          | HTTP 리스닝 포트 |
| `DB_PATH` | `./data/multi-shoot.db`         | SQLite 파일 경로 |

## 게임 룰 (간단)

- 3행에서 과녁이 좌우로 이동, 잠시 멈춰서 **앞면(불스아이) 회전 노출** → 노출 중일 때만 점수 인정
- **빨간 과녁** = 진짜, **녹색 스마일** = 가짜 (-5점)
- 점수 안→밖 5단계 → 정확도 등급에 따라 환산:
  - ≥80% → 10/7/5/3/1   ≥60% → 8/6/5/3/1   ≥40% → 6/5/3/2/1
  - ≥30% → 4/3/1/1/1    ≥20% → 3/1/1/1/1   <20% → 1/1/1/1/1
- 100점마다 **STAGE ↑** → 속도/가짜비율/바람/과녁크기 변화 (스테이지 5/10에서 과녁 1/2, 1/4 축소)
- 1초 이상 클릭 홀드 → 클릭 위치 기준 **스코프 줌**, 떼면 발사
- 바람 (스테이지 2부터) — 탄알이 시간이 지날수록 더 휨

## 멀티플레이어 동기화 모델

- 서버가 게임 시뮬레이션 권한 (targets/bullets/wind/stage)
- 클라이언트는 발사 이벤트만 전송, 매 60fps 마다 마지막 스냅샷 렌더
- 서버 tick: 30Hz, broadcast: 20Hz (config.js 에서 조정 가능)
- 본인 캐논/탄알은 진한 색, 상대방은 같은 색이지만 투명도 낮춤 → 누구의 탄알인지 구분
