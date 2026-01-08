import { useEffect, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'theme_dark';

export default function App() {
    const [darkMode, setDarkMode] = useState(false);

    // 최초 1회: localStorage에 저장된 테마 상태 복구
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'true') setDarkMode(true);
    }, []);

    // darkMode 변경 시
    useEffect(() => {
        // 상태 저장
        localStorage.setItem(STORAGE_KEY, String(darkMode));

        /**
         * marker(표식)만 붙이기
         * document.documentElement = <html>
         * <html data-theme="dark"> 또는 <html data-theme="light">
         *
         * - JS는 스타일을 바꾸지 않음
         * - 현재 테마 "정보"만 문서에 기록
         * - 실제 스타일 변경은 CSS가 처리
         */
        document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    }, [darkMode]);

    return (
        <div className="page">
            <div className="card">
                <h2>다크 모드 (Modern)</h2>

                <label className="row">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    다크 모드
                </label>

                <p className="muted">현재 상태: {darkMode ? 'ON' : 'OFF'}</p>

                <button className="btn" onClick={() => alert('동작 확인')}>
                    버튼 예시
                </button>
            </div>
        </div>
    );
}
