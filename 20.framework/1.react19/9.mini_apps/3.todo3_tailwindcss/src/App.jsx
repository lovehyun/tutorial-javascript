import { useEffect, useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import TodoPage from './pages/TodoPage';

export default function App() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <div className="layout">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <TodoPage />
        </div>
    );
}
