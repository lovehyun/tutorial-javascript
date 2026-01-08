// npm i bootstrap
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const STORAGE_KEY = 'theme_dark'; // 'light' | 'dark'

export default function App() {
    const [theme, setTheme] = useState('light');

    // 1) 최초 1회: 저장값 복구
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') setTheme(saved);
    }, []);

    // 2) 변경 시: 저장 + 문서에 표식 붙이기
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, theme);

        /**
         * Bootstrap 5.3+ 테마 표식
         * <html data-bs-theme="dark"> 일 때 부트스트랩이 다크 스타일을 적용
         */
        document.documentElement.setAttribute('data-bs-theme', theme);
    }, [theme]);

    const isDark = theme === 'dark';

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
            <div className="card shadow-sm" style={{ maxWidth: 520, width: '100%' }}>
                <div className="card-body">
                    <h5 className="card-title mb-3">Bootstrap 테마 (data-bs-theme)</h5>

                    <div className="form-check form-switch mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="themeSwitch"
                            checked={isDark}
                            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                        />
                        <label className="form-check-label" htmlFor="themeSwitch">
                            다크 모드
                        </label>
                    </div>

                    <p className="text-body-secondary mb-3">
                        현재 테마: <b>{theme}</b>
                    </p>

                    <button className="btn btn-primary" onClick={() => alert('부트스트랩 버튼 동작!')}>
                        버튼 예시
                    </button>
                </div>
            </div>
        </div>
    );
}
