
# ✅ Tailwind CSS 설치 및 프로덕션 사용 가이드

Tailwind CSS는 빠르고 직관적인 CSS 프레임워크입니다. 하지만 `cdn.tailwindcss.com` 사용은 **개발 환경**에서만 권장되며, **프로덕션 환경**에서는 최적화된 빌드와 보안을 위해 CLI 방식을 사용해야 합니다.

---

## 📦 1. 프로젝트에 Tailwind CSS 설치

```bash
npm install -D tailwindcss
npx tailwindcss init
```

- `tailwindcss`를 개발 의존성으로 설치합니다.
- `npx tailwindcss init` 명령어는 `tailwind.config.js` 파일을 생성합니다.

---

## 🛠️ 2. Tailwind 설정 파일 (`tailwind.config.js`) 설정

`tailwind.config.js` 파일에서 프로젝트의 템플릿 파일을 지정해야 합니다.

```javascript
// tailwind.config.js
module.exports = {
  content: ["./*.html"], // HTML 파일을 대상으로 Tailwind CSS 적용
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- `content`: Tailwind CSS가 적용될 파일을 지정합니다.
- `theme`: 사용자 정의 테마를 설정할 수 있습니다.

---

## 🧩 3. Tailwind CSS 사용 준비 (`styles.css` 파일 작성)

새로운 `styles.css` 파일을 생성하고 아래의 코드를 추가합니다.

```css
/* styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🏗️ 4. CSS 빌드 (프로덕션 최적화)

최적화된 CSS 파일을 생성하기 위해 다음 명령어를 실행합니다.

```bash
npx tailwindcss -i ./styles.css -o ./dist/output.css --minify
```

- `-i`: 입력 파일 지정
- `-o`: 출력 파일 경로
- `--minify`: CSS 파일을 압축하여 프로덕션 환경에 적합하게 만듭니다.

---

## 🖥️ 5. HTML 파일에서 Tailwind CSS 연결

HTML 파일에서 최적화된 CSS를 로드합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tailwind CSS 적용 예제</title>
    <link rel="stylesheet" href="./dist/output.css">
</head>
<body class="bg-gray-100 text-center p-10">
    <h1 class="text-3xl font-bold text-blue-500">Tailwind CSS 프로덕션 적용 예제</h1>
</body>
</html>
```

---

## ✅ 6. Tailwind CLI의 장점
- ✅ **최적화:** 사용한 클래스만 빌드하여 CSS 크기 최소화
- ✅ **보안:** 외부 스크립트 로드 없이 로컬에서 실행
- ✅ **커스터마이징:** `tailwind.config.js`를 통한 고급 설정 가능
- ✅ **버전 고정:** `package.json`에 Tailwind 버전 고정

---

## 🎯 7. 최종 요약
- **CDN 방식**은 **개발 환경**에서만 사용
- **CLI 방식**은 **프로덕션 환경**에 적합 (성능 & 보안 강화)
- **최적화 빌드:** `npx tailwindcss -i ./styles.css -o ./dist/output.css --minify`

---

## 🎉 Tailwind CSS를 프로젝트에 성공적으로 추가했습니다!
