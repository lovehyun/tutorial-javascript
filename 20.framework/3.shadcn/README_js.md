
# React에서 shadcn 사용 가이드

**shadcn**은 React와 Tailwind CSS를 활용하여 UI 컴포넌트를 쉽게 구성하고 스타일링할 수 있도록 돕는 라이브러리입니다. Radix UI를 기반으로 Tailwind CSS와 완벽히 통합된 환경을 제공합니다.

---

## 1. shadcn 소개

### shadcn의 주요 특징
- **Radix UI 통합**: 접근성을 지원하는 고품질 컴포넌트 제공.
- **Tailwind CSS 기반**: 모든 스타일링이 Tailwind CSS로 이루어짐.
- **확장 가능한 컴포넌트**: 프로젝트의 디자인 시스템으로 확장 가능.

---

## 2. 프로젝트 설정

1. **React 프로젝트 생성**:
   ```bash
   npx create-react-app my-app
   cd my-app
   ```

2. **Tailwind CSS 설치**:
   Tailwind CSS를 설정하지 않았다면 다음 명령어로 설치합니다.
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init
   ```

3. **Tailwind 설정 파일 수정**:
   `tailwind.config.js` 파일을 열고 `content`를 설정합니다.
   ```javascript
   module.exports = {
     content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

4. **CSS 파일 구성**:
   `src/index.css` 파일에 Tailwind CSS 지시어를 추가합니다.
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. **CSS 파일 불러오기**:
   `src/index.js`에서 CSS 파일을 불러옵니다.
   ```javascript
   import './index.css';
   ```

---

## 3. shadcn 설치

1. **shadcn 설치**:
   프로젝트에 shadcn을 설치하려면 아래 명령어를 실행합니다.
   ```bash
   npx shadcn init
   ```

2. **컴포넌트 추가**:
   원하는 UI 컴포넌트를 추가하려면 명령어를 사용합니다. 예를 들어, 버튼 컴포넌트를 추가하려면:
   ```bash
   npx shadcn add button
   ```

   이는 Tailwind CSS와 Radix UI를 결합한 구성 요소를 생성합니다.

---

## 4. shadcn 컴포넌트 사용

1. **컴포넌트 임포트**:
   `shadcn add button` 명령어를 실행하면 `src/components/ui/button.js`에 버튼 컴포넌트가 생성됩니다. 이를 가져와 사용합니다.
   ```javascript
   import React from "react";
   import { Button } from "@/components/ui/button";

   const App = () => {
     return (
       <div className="flex justify-center items-center h-screen bg-gray-100">
         <Button variant="primary">클릭하세요</Button>
       </div>
     );
   };

   export default App;
   ```

2. **컴포넌트 스타일 커스터마이징**:
   Tailwind CSS를 사용하여 버튼 스타일을 커스터마이징할 수 있습니다. `button.js` 내부의 클래스를 수정하거나 확장합니다.

---

## 5. 주요 명령어

| 명령어                      | 설명                                              |
|-----------------------------|---------------------------------------------------|
| `npx shadcn init`           | shadcn 프로젝트를 초기화합니다.                   |
| `npx shadcn add [component]`| 원하는 컴포넌트를 추가합니다. 예: `button`         |
| `npx shadcn update`         | 설치된 컴포넌트를 최신 상태로 업데이트합니다.      |

---

## 6. 권장 컴포넌트

shadcn에서 제공하는 주요 컴포넌트:
1. **버튼** (`button`)
2. **입력 필드** (`input`)
3. **모달** (`dialog`)
4. **툴팁** (`tooltip`)
5. **드롭다운 메뉴** (`dropdown-menu`)

---

## 결론

**shadcn**은 Tailwind CSS와 Radix UI를 결합하여 React 프로젝트에서 UI를 빠르고 일관되게 구성할 수 있는 강력한 도구입니다. 특히 디자인 시스템을 구축하거나 Tailwind를 잘 활용하려는 개발자에게 유용합니다.

프로젝트 요구사항에 따라 **shadcn**을 도입하여 효율적인 UI 컴포넌트를 구축해 보세요! 🚀
