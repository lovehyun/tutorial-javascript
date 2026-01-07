import { useEffect, useState } from 'react';
import './App.css';

const KEY = 'dark'; // 로컬 스토리지 변수

export default function App() {
    const [darkMode, setDarkMode] = useState(false);

    // 1) 저장값 복구
    useEffect(() => {
        const saved = localStorage.getItem(KEY);
        if (saved === 'true') setDarkMode(true);
    }, []);

    // 2) 저장 + 테마 적용
    useEffect(() => {
        localStorage.setItem(KEY, String(darkMode));

        // CSS가 읽을 수 있게 문서에 "표식"만 붙임
        document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    }, [darkMode]);

    return (
        <div className="page">
            <div className="card">
                <h2>다크 모드 데모 (CSS 파일)</h2>

                <label className="row">
                    <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
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
