# 1단계: Next.js와 Tailwind CSS 설치

1. **Node.js**가 설치되어 있는지 확인하고, **Next.js** 프로젝트를 생성합니다. 터미널을 열고 아래 명령어를 실행합니다:

    ```bash
    npx create-next-app@latest my-shadcn-app --typescript --eslint
    ```

2. 프로젝트 디렉토리로 이동합니다:

    ```bash
    cd my-shadcn-app
    ```

3. **Tailwind CSS**를 설치합니다:

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

4. `tailwind.config.js` 파일을 수정하여 Tailwind가 적용될 파일 경로를 설정합니다:

    ```js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

5. **Tailwind CSS**를 프로젝트에 적용하려면 `globals.css` 파일을 생성하고 다음과 같은 내용을 추가합니다:

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

6. 이제 Next.js 프로젝트를 시작하여 모든 설정이 제대로 되었는지 확인합니다:

    ```bash
    npm run dev
    ```

# 2단계: Shadcn 초기화

Shadcn은 명령어를 통해 컴포넌트를 쉽게 추가할 수 있는 도구입니다.

1. **Shadcn**을 설치하고 초기화합니다:

    ```bash
    npx shadcn-ui@latest init
    ```

2. 간단한 UI 컴포넌트(예: 버튼)를 추가하기 위해 다음 명령어를 실행합니다:

    ```bash
    npx shadcn-ui@latest add button
    ```

    이 명령어는 `components` 폴더에 버튼 컴포넌트를 생성합니다.

# 3단계: Shadcn 컴포넌트 사용하기

1. 프로젝트의 `pages/index.tsx` 파일을 열고, Shadcn에서 추가한 버튼을 다음과 같이 사용합니다:

    ```tsx
    import { Button } from '../components/button';

    export default function Home() {
      return (
        <div className="flex justify-center items-center h-screen">
          <Button variant="default">Hello World</Button>
        </div>
      )
    }
    ```

    여기서는 `Button` 컴포넌트를 가져와 **Tailwind CSS**의 flexbox 유틸리티를 사용하여 페이지 중앙에 배치합니다.

# 4단계: 프로젝트 실행

1. 다시 한번 개발 서버를 실행하여 변경 사항을 확인합니다:

    ```bash
    npm run dev
    ```

2. 브라우저에서 `http://localhost:3000`으로 이동하면 "Hello World" 버튼이 표시된 페이지를 볼 수 있습니다.

# 5단계: 버튼 커스터마이징

**Shadcn**에서 제공하는 버튼 컴포넌트는 **Tailwind CSS**로 쉽게 커스터마이징할 수 있습니다. 예를 들어, 버튼의 스타일을 변경하려면 다음과 같이 `variant` 속성을 바꿔줄 수 있습니다:

    ```tsx
    <Button variant="destructive">Delete</Button>
    ```

이렇게 하면 버튼의 스타일이 `destructive`(위험) 타입으로 변경됩니다.

# 요약

- **Next.js**와 **Tailwind CSS**를 설치하여 기본 프로젝트를 설정합니다.
- **Shadcn**을 초기화하고 필요한 UI 컴포넌트를 추가합니다.
- 컴포넌트를 **Next.js** 페이지에서 불러와 사용합니다.
- **Tailwind CSS**를 활용해 커스터마이징하여 UI를 빠르게 개발할 수 있습니다.
