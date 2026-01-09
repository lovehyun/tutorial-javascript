// Bootstrap 스타일이 적용된 UI
// 버튼 클릭으로 라이트 / 다크 테마 전환
// 테마에 따라 배경 / 카드 / 리스트 색상 변경
// 실무에서 바로 쓰는 Todo CRUD 패턴

import { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import TodoApp from './components/TodoApp';

function App() {
    const [theme, setTheme] = useState('light'); // light | dark

    return (
        <div className={`min-vh-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <div className="container py-4">
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <TodoApp theme={theme} />
            </div>
        </div>
    );
}

export default App;
