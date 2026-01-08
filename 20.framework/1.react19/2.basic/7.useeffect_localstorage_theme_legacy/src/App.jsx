import { useEffect, useState } from 'react';
import './App.css';

/**
 * localStorage에 저장할 key
 * - 새로고침/재방문 시 테마 유지 목적
 */
const STORAGE_KEY = 'theme_dark';

export default function App() {
    /**
     * React 상태 (UI 상태)
     * - true  => dark
     * - false => light
     */
    const [darkMode, setDarkMode] = useState(false);

    /**
     * 1) 최초 1회: localStorage에서 저장값 복구
     * - [] 이므로 마운트 시 1번만 실행
     */
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);

        // localStorage는 문자열만 저장하므로 'true' 비교
        if (saved === 'true') {
            setDarkMode(true);
        }
    }, []);

    /**
     * 2) darkMode가 바뀔 때마다:
     * - localStorage에 저장
     * - 문서에 직접 class를 붙였다/뗌 (레거시 방식)
     */
    useEffect(() => {
        // (1) 저장
        localStorage.setItem(STORAGE_KEY, String(darkMode));

        // (2) 적용: body에 class 토글
        // - darkMode가 true면 'dark' 클래스를 추가
        // - false면 제거
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }

        /**
         * 참고:
         * - React는 DOM을 직접 다루지 않는 게 원칙이지만,
         *   "document/body 조작" 같은 건 side-effect라서 useEffect에서 수행합니다.
         */
    }, [darkMode]);

    return (
        <div className="page">
            <div className="card">
                <h2>다크 모드 데모 (Legacy: class 토글)</h2>

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
