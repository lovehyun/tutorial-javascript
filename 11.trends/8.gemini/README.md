# Google AI Studio (Gemini) API – Node.js 최소 예제 (최신 기준)

이 문서는 **Google AI Studio에서 발급한 API Key**를 사용하여  
**Node.js에서 Gemini API로 텍스트 요청 → 응답을 받는 최신·권장 방식**을 정리한 문서입니다.

> ⚠️ **중요**
> - 기존 `@google/generative-ai` SDK는 **레거시(Deprecated)** 상태입니다.
> - 최신 공식 SDK는 **`@google/genai`** 이며, 이 문서는 해당 SDK 기준으로 작성되었습니다.
> - 레거시 SDK 사용 시 404 오류, 모델 미지원 문제가 빈번히 발생합니다.

---

## 0) 공식 문서 링크 (반드시 참고)

아래 문서들은 **Google 공식 문서**이며, 모델 변경·쿼터·SDK 업데이트 시  
가장 정확한 기준이 됩니다.

- Google AI Studio  
  https://aistudio.google.com/

- Gemini API 개요 (공식)  
  https://ai.google.dev/gemini-api/docs

- Gemini API – JavaScript SDK  
  https://ai.google.dev/gemini-api/docs/get-started/javascript

- 사용 가능한 모델 목록 (Models)  
  https://ai.google.dev/gemini-api/docs/models

- API Key 발급  
  https://aistudio.google.com/app/apikey

- Rate Limits / Quotas  
  https://ai.google.dev/gemini-api/docs/rate-limits

---

## 1) API Key 발급

1. https://aistudio.google.com/app/apikey 접속
2. **Create API Key** 클릭
3. 발급된 키 복사

---

## 2) 프로젝트 생성 및 설치 (권장)

```bash
mkdir gemini-node
cd gemini-node
npm init -y

# 최신 공식 SDK
npm install @google/genai dotenv
```

---

## 3) 환경변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
GOOGLE_API_KEY=YOUR_API_KEY_HERE
```

---

## 4) 최소 실행 예제 (최신 SDK)

### `index.js`

```js
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ quiet: true });

if (!process.env.GOOGLE_API_KEY) {
  console.error("GOOGLE_API_KEY가 없습니다. .env 파일을 확인하세요.");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "인공지능을 초등학생도 이해할 수 있게 3문장으로 설명해 주세요.",
  });

  console.log(response.text);
}

run().catch(console.error);
```

실행:

```bash
node index.js
```

---

## 5) 무료 버전 사용량(쿼터) 정리

### 핵심 요약

- AI Studio 웹(UI) 사용은 무료
- API 호출에는 **쿼터(레이트 리밋)** 적용
- 쿼터는 **프로젝트 단위**로 관리

### 제한 기준

| 항목 | 설명 |
|---|---|
| RPM | 분당 요청 수 |
| TPM | 분당 토큰 수 |
| RPD | 일일 요청 수 |

> 정확한 수치는 **AI Studio → View your active rate limits** 메뉴에서 확인하세요.

---

## 6) 사용 가능한 모델 확인 (중요)

모델 이름은 시점에 따라 변경됩니다.  
404 오류를 피하려면 **실제 사용 가능한 모델을 먼저 확인**해야 합니다.

### 모델 목록 조회 스크립트

```js
// list-models.js
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const res = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models",
  {
    headers: {
      "x-goog-api-key": process.env.GOOGLE_API_KEY,
    },
  }
);

const data = await res.json();
console.log(data.models.map(m => m.name));
```

```bash
node list-models.js
```

출력된 모델 중 **generateContent 지원 모델만 사용**하세요.

---

## 7) 대표 모델 선택 가이드 (실무 기준)

> 실제 사용 가능 여부는 반드시 위 모델 목록으로 확인

| 모델 | 권장 용도 |
|---|---|
| gemini-3-flash-preview | 빠른 응답, 데모, 프론트엔드 |
| gemini-3-pro-preview | 추론, 분석, 품질 중시 |
| *-preview | 실험·학습 |
| *-stable | 운영(프로덕션) |

---

## 8) ❌ 사용하지 말아야 할 것 (레거시 SDK)

```bash
npm install @google/generative-ai   # ❌ 사용 금지
```

- Deprecated 상태
- 최신 모델 미지원
- `model not found (404)` 오류 빈번

👉 **항상 `@google/genai` 사용**
