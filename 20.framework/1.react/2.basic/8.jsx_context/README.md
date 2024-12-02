# React 테마 스위처 실행 방법

이 문서는 React 프로젝트에서 테마 스위처를 구현하고 실행하는 방법을 설명합니다.

---

## 1. React 프로젝트 생성

React 프로젝트를 생성하고 필요한 패키지를 설치합니다.

```bash
npx create-react-app theme-switcher
cd theme-switcher
npm install bootstrap
```

---

# ThemeContext: 기능과 역할

---

## **1. ThemeContext의 기능**

`ThemeContext`는 React의 **Context API**를 활용해 테마 상태를 전역으로 관리하는 방법입니다. 이를 통해, 다음과 같은 기능을 제공합니다:

1. **전역 상태 관리**:
   - 테마 상태(`isDarkMode`)를 전역으로 공유하여, 컴포넌트 계층 구조를 통해 상태를 전달할 필요 없이 어디에서든 접근 가능하게 만듭니다.

2. **테마 전환(toggle)**:
   - 다크 모드와 라이트 모드를 전환하는 로직을 `toggleTheme` 메서드로 구현.

3. **UI 동기화**:
   - 테마 상태에 따라 컴포넌트 스타일을 동적으로 변경하여 사용자 경험을 향상.

---

## **2. ThemeContext의 역할**

### 1. **컨텍스트 생성**
   - `createContext`를 사용해 테마 관련 데이터를 저장하는 컨텍스트 생성.

### 2. **`Provider` 컴포넌트 제공**
   - 테마 상태(`isDarkMode`)와 전환 함수(`toggleTheme`)를 제공하는 `ThemeProvider` 구현.

### 3. **Hook을 통한 접근**
   - 커스텀 Hook(`useTheme`)을 제공하여, 자식 컴포넌트에서 간단히 테마 상태와 메서드에 접근.

---

## **3. ThemeContext의 코드 구현**

### **컨텍스트 생성**
`createContext`를 통해 초기 컨텍스트를 생성합니다. 초기 상태로 `null` 또는 빈 객체를 설정할 수 있습니다.

```javascript
import React, { createContext, useState, useContext } from "react";

// 컨텍스트 생성
const ThemeContext = createContext();
```

### **`ThemeProvider` 구현**
`ThemeProvider`는 컨텍스트의 `Provider` 역할을 하며, 자식 컴포넌트에 상태와 메서드를 제공합니다.

```javascript
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 테마 전환 함수
    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
```

---

## **5. 코드 구현 시 주의사항**

1. **`useContext`의 성능 문제**
   - `ThemeProvider`의 값이 변경되면 모든 자식 컴포넌트가 다시 렌더링됩니다.
   - 이 경우 **React.memo**를 사용하거나, 컨텍스트를 분리하여 영향을 줄일 수 있습니다.

2. **전역 상태 관리 필요성**
   - 테마와 같은 전역적으로 사용되는 상태만 Context API로 관리하는 것이 좋습니다.
   - 복잡한 상태 관리가 필요한 경우 Redux, Zustand 등의 상태 관리 라이브러리를 고려하세요.

3. **다수의 컨텍스트 사용**
   - 하나의 컨텍스트에 모든 상태를 넣는 대신, 상태별로 컨텍스트를 분리하면 더 깔끔하게 관리할 수 있습니다.

---

## **6. 요약**

1. **컨텍스트 생성**: `createContext`로 테마 상태 저장소 생성.
2. **`ThemeProvider` 구현**: 상태와 메서드를 자식 컴포넌트에 제공.
3. **커스텀 Hook**: `useContext`를 통해 간단히 상태에 접근.
4. **주의사항**:
   - 컨텍스트 사용은 전역적으로 필요한 상태에만 제한.
   - 성능 최적화를 위해 React.memo 및 컨텍스트 분리 활용.

---

**ThemeContext**는 React에서 전역 테마 관리와 같은 간단한 상태 공유에 매우 적합한 도구입니다. 추가적인 질문이 있으면 언제든 문의하세요! 😊
