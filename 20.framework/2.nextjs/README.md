# 1. 프로젝트 생성

    ```bash
    npx create-next-app@latest my-next-app
    
    or

    npx create-next-app@14 my-next-app

    cd my-next-app
    npm run dev
    ```

# 2. pages/index.js 파일 수정
pages/index.js 파일을 열어서 다음과 같이 수정합니다:

    ```javascript
    export default function Home() {
        return (
            <div>
            <h1>Hello World!</h1>
            <p>Welcome to my Next.js app!</p>
            </div>
        )
    }
    ```

## 설명:
- Next.js는 기본적으로 파일 기반 라우팅을 사용하므로, pages/index.js 파일은 / 경로에 해당하는 페이지로 동작합니다.
- export default function Home()는 Next.js에서 해당 파일이 기본적으로 렌더링할 내용을 정의하는 함수입니다.
- HTML 태그인 <h1>과 <p>는 이 페이지에 "Hello World!"와 간단한 설명을 표시합니다.

# 3. 서버 실행

    ```bash
    npm run dev
    ```

이후 브라우저에서 http://localhost:3000으로 이동하면, "Hello World!"가 표시된 기본 Next.js 페이지를 확인할 수 있습니다.

이 간단한 예제를 통해 Next.js의 기본 구조를 이해할 수 있습니다:
- pages 폴더: Next.js는 이 폴더 안의 파일들을 자동으로 라우팅합니다.
- React 컴포넌트: Next.js는 React 기반으로 동작하며, 각 페이지는 React 컴포넌트로 구성됩니다.

이 기본 예제를 시작으로, Next.js의 다양한 기능(서버 사이드 렌더링, 정적 페이지 생성 등)을 확장해 나갈 수 있습니다.
