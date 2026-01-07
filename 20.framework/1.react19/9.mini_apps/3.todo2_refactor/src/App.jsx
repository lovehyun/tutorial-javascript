// App
//  ├─ ThemeToggle        (전역 UI)
//  └─ TodoPage           (페이지)
//       ├─ TodoInput
//       └─ TodoList

import { useEffect, useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import TodoPage from './pages/TodoPage';

export default function App() {
    const [theme, setTheme] = useState('light'); // light | dark

    // Bootstrap(v5.3+)는 data-bs-theme="dark|light"를 지원합니다.
    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme);
    }, [theme]);
    
    return (
        <div className="min-vh-100">
            <div className="container py-4">
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <TodoPage />
            </div>
        </div>
    );
}
