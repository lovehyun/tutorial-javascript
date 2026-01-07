export default function ThemeToggle({ theme, setTheme }) {
    const toggle = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-outline-secondary" onClick={toggle}>
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
        </div>
    );
}
