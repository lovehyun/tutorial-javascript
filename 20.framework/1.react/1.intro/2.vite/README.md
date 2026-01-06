# Vite(React) 프로젝트 **실전 배포 통합 가이드**
## 빌드 → 확인 → Nginx / Node / Express (중요 개념 보강판)

이 문서는 **Vite로 만든 React 프로젝트를 실제 운영 환경에 배포할 때 반드시 알아야 할 핵심 개념**을
기존 가이드에 **Express 배포 시 가장 치명적인 구조적 포인트까지 통합**하여 정리한 문서입니다.

> 🔴 **가장 중요한 결론**
> - Vite의 배포 결과물은 `dist/` 폴더 **자체가 아니라**
> - **`dist/` 안에 들어 있는 “내용물” 전체**입니다.

---

## 0. 핵심 요약 (반드시 읽기)

### ✅ 정답 구조
```
public/
├─ index.html
├─ assets/
│  ├─ *.js
│  ├─ *.css
│  └─ *.svg
└─ 기타 정적 파일
```

### ❌ 잘못된 구조 (하얀 화면 원인 1위)
```
public/
└─ dist/
   ├─ index.html
   └─ assets/
```

> ❗ **`dist` 폴더를 한 단계 더 감싸면 브라우저가 JS/CSS를 절대 찾지 못합니다.**

---

## 1. 개발 / 빌드 / 배포 용어 정리

| 단계 | 명령 | 설명 |
|---|---|---|
| 개발 | `npm run dev` | Vite 개발 서버 (HMR, 운영 ❌) |
| 빌드 | `npm run build` | 운영용 정적 파일 생성 |
| 확인 | `npm run preview` | 빌드 결과 로컬 확인 |
| 배포 | 정적 서빙 | Nginx / Node / Express |

---

## 2. Vite 빌드 & 로컬 확인

```bash
npm install
npm run build
npm run preview
```

- `dist/` 생성됨
- 이 안의 파일이 **그대로 운영 서버에 올라감**

---

## 3. dist 구조를 반드시 이해해야 하는 이유

빌드된 `index.html` 내부에는 이미 **절대 경로**가 박혀 있습니다.

```html
<script type="module" src="/assets/index-abc123.js"></script>
<link rel="stylesheet" href="/assets/index-abc123.css">
```

➡ 브라우저는 무조건 다음을 요청합니다:

```
GET /assets/index-abc123.js
```

👉 따라서 **웹서버의 document root 바로 아래에 `assets/`가 존재해야만** 정상 동작합니다.

---

## 4. 배포 방식 A: Nginx 정적 배포 (실무 최다 사용)

### 4-1) 서버에 dist 업로드
```
/var/www/myapp/dist/
```

### 4-2) Nginx 설정 (SPA 필수)

```nginx
server {
  listen 80;
  server_name example.com;

  root /var/www/myapp/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. 배포 방식 B: Node.js로 dist 직접 서빙

### B-1) serve (가장 간단)

```bash
npm i -g serve
serve -s dist -l 5000
```

---

### B-2) 순수 Node 서버 (SPA fallback 포함)

```js
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dist = path.join(__dirname, "dist");

http.createServer((req, res) => {
  let filePath = path.join(dist, req.url === "/" ? "index.html" : req.url);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(dist, "index.html");
  }
  fs.createReadStream(filePath).pipe(res);
}).listen(5000);
```

---

## 6. 🔥 배포 방식 C: Express 배포 (가장 많이 터지는 구간 집중 설명)

### 6-1) Express 배포의 본질

> Express는 **빌드 도구가 아니라**
> 👉 **정적 파일을 “그대로 전달”하는 역할**만 합니다.

따라서 Vite가 만든 구조를 **절대 바꾸면 안 됩니다.**

---

### 6-2) 올바른 Express + Vite 구조

```
my-express-app/
├─ public/
│  ├─ index.html        ← dist/index.html
│  ├─ assets/           ← dist/assets/*
│  └─ favicon.svg
├─ routes/
├─ app.js
```

❌ `public/dist/index.html` ❌  
✅ `public/index.html` ⭕

---

### 6-3) 파일 복사 방법

```bash
npm run build
cp -R dist/* ../my-express-app/public/
```

---

### 6-4) Express 설정 (SPA 필수)

```js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

app.use(express.static(publicDir));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(3000);
```

---

## 7. 서브 경로(`/myapp/`) 배포 시 반드시 필요한 base 설정

```js
// vite.config.js
export default {
  base: "/myapp/"
};
```

```bash
npm run build
```

⚠️ base 설정과 실제 서버 경로가 다르면 **JS/CSS 전부 404**

---

## 8. Express 배포 체크리스트 (실무)

- [ ] dist **내용물만** public에 있는가?
- [ ] public/index.html 존재하는가?
- [ ] public/assets/* 존재하는가?
- [ ] `express.static(public)` 설정했는가?
- [ ] SPA fallback(`app.get("*")`) 설정했는가?
- [ ] base 설정과 서버 경로가 일치하는가?

---

## 9. 실무 추천 조합

| 상황 | 추천 |
|---|---|
| 프론트/백 완전 분리 | Nginx + dist |
| 단일 서버 | Express + public |
| 내부/테스트 | serve |
| 대규모 | Nginx + CDN |

---

## 10. 최종 결론

> **Vite는 “정적 파일 생성기”이고**  
> **Express/Nginx는 “그 파일을 그대로 전달하는 서버”입니다.**
>
> 구조를 한 단계라도 틀리면  
> 👉 에러 없이 **하얀 화면**이 나옵니다.

---
