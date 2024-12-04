import React, { createContext, useState, useContext } from "react";

// React에서 제공하는 기능 import
// createContext: 새로운 Context를 생성
// useState: 상태 관리
// useContext: Context 값에 접근하기 위한 Hook

// Theme Context 생성
const ThemeContext = createContext();
// 새로운 Context를 생성하여 테마 관련 데이터를 공유할 준비를 합니다.
// 초기값은 생략했으므로 기본값은 `undefined`입니다.
// ThemeContext 변수 자체는 React에서 생성된 Context 객체입니다. 이 객체는 크게 두 가지 프로퍼티를 가지고 있습니다:
// 1. Provider: 데이터를 제공하기 위한 컴포넌트.
// 2. Consumer: 데이터를 소비하기 위한 컴포넌트.

// Theme Provider 컴포넌트
export const ThemeSelector = ({ children }) => {
    // 테마 상태를 관리하기 위한 상태 변수
    const [isDarkMode, setIsDarkMode] = useState(false);
    // isDarkMode: 현재 테마 상태를 저장 (true = 다크 모드, false = 라이트 모드)
    // setIsDarkMode: 상태를 변경하는 함수

    // 테마 변경 함수
    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
        // 이전 테마 상태(prevMode)를 반전시켜 테마를 전환
    };

    // Provider로 상태와 함수를 자식 컴포넌트에 전달
    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
            {/* children: ThemeProvider로 감싼 모든 하위 컴포넌트를 의미 */}
        </ThemeContext.Provider>
    );
};

// Custom Hook: 컨텍스트 사용
export const useTheme = () => useContext(ThemeContext);
// useContext를 사용하여 ThemeContext 값을 반환하는 커스텀 Hook
// 이를 통해 컴포넌트에서 `isDarkMode`와 `toggleTheme`에 간단히 접근 가능

// 한 번에 내보내기
// export { ThemeSelector, useTheme };
