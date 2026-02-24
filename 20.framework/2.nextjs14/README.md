
# Next.js 프로젝트 셋업 및 실행 가이드

이 문서는 Next.js 프로젝트를 처음 설정하고 실행하는 방법을 초보자를 대상으로 설명하며, 기본 파일 구조와 간단한 수정 및 기능 추가 방법도 포함합니다.

---

## 1. Next.js란?
Next.js는 React를 기반으로 하는 프레임워크로, 서버 사이드 렌더링(SSR) 및 정적 사이트 생성(SSG)을 지원하여 빠르고 SEO 친화적인 웹사이트를 개발할 수 있습니다.

---

## 2. 사전 준비
1. **Node.js 설치**
   - [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전을 다운로드하고 설치합니다.
   - 설치 후, 터미널에서 다음 명령어로 버전을 확인합니다:
     ```bash
     node -v
     npm -v
     ```

2. **코드 편집기**
   - [Visual Studio Code](https://code.visualstudio.com/)를 추천합니다.

---

## 3. Next.js 프로젝트 생성
1. **프로젝트 디렉토리 생성**
   ```bash
   mkdir my-next-app
   cd my-next-app
   ```

2. **Next.js 설치**
   ```bash
   npm info create-next-app version
   npx create-next-app@latest .
   ```

3. **설치 도중 묻는 질문**
   - TypeScript 사용 여부: 필요하면 `Yes`, 그렇지 않으면 `No`를 선택하세요.
   - ESLint 설정 여부: 코딩 스타일을 유지하고 싶다면 `Yes`를 선택하세요.

---

## 4. 프로젝트 실행
1. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   실행 후, 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인합니다.

2. **프로덕션 빌드**
   - 프로덕션 빌드 생성:
     ```bash
     npm run build
     ```
   - 로컬에서 빌드된 결과 테스트:
     ```bash
     npm start
     ```

---

## 5. 기본 디렉토리 구조
Next.js 프로젝트의 주요 디렉토리 및 파일 구조는 다음과 같습니다:

```
my-next-app/
├── pages/
│   ├── api/
│   │   └── hello.js      # API 라우트를 정의
│   ├── _app.js           # 전역 설정 파일
│   ├── index.js          # 메인 페이지 (홈)
│   └── about.js          # 예제 추가 페이지
├── public/
│   └── favicon.ico       # 정적 파일 (이미지, 아이콘 등)
├── styles/
│   ├── globals.css       # 전역 스타일
│   └── Home.module.css   # 특정 컴포넌트 스타일
├── .gitignore            # Git에서 제외할 파일 정의
├── package.json          # 프로젝트 설정 및 의존성
└── README.md             # 프로젝트 설명 파일
```

---

## 6. 간단한 수정
1. **홈페이지 내용 수정**
   - `pages/index.js` 파일을 열고 아래 내용을 수정합니다:
     ```javascript
     export default function Home() {
       return (
         <div>
           <h1>환영합니다, Next.js에 오신 것을 환영합니다!</h1>
           <p>이 사이트는 Next.js로 만들어졌습니다.</p>
         </div>
       );
     }
     ```

2. **CSS 스타일 변경**
   - `styles/globals.css` 파일을 열고 전역 스타일을 추가하거나 수정합니다:
     ```css
     body {
       font-family: Arial, sans-serif;
       margin: 0;
       padding: 0;
       background-color: #f0f0f0;
     }
     ```

---

## 7. 간단한 기능 추가
1. **새로운 페이지 추가**
   - `pages/about.js` 파일을 생성하고 다음 코드를 추가합니다:
     ```javascript
     export default function About() {
       return (
         <div>
           <h1>About Page</h1>
           <p>이 페이지는 Next.js의 라우팅 기능을 보여줍니다.</p>
         </div>
       );
     }
     ```
   - 브라우저에서 [http://localhost:3000/about](http://localhost:3000/about)를 열어 확인하세요.

2. **간단한 API 추가**
   - `pages/api/greeting.js` 파일을 생성하고 다음 코드를 추가합니다:
     ```javascript
     export default function handler(req, res) {
       res.status(200).json({ message: 'Hello, Next.js API!' });
     }
     ```
   - 브라우저에서 [http://localhost:3000/api/greeting](http://localhost:3000/api/greeting)를 열어 확인하세요.

---

## 8. 추가 학습 자료
- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://reactjs.org/)

