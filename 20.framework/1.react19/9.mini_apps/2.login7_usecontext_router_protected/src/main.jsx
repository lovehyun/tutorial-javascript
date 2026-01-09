// 수정된 파일 목록
// 변경: src/main.jsx
// 변경: src/App.jsx
// 변경: src/pages/LoginPage.jsx
// 변경: src/hooks/useLoginForm.js
// 추가: src/pages/HomePage.jsx
// 추가: src/pages/ProfilePage.jsx
// package.json에 react-router-dom 의존성 추가 (없으면 설치 필요)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './auth/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            {/* 전역 로그인 상태 공유를 위해 AuthProvider로 감쌉니다 */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
