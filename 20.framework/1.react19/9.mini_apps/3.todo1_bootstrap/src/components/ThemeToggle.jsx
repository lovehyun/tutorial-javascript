function ThemeToggle({ theme, setTheme }) {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="d-flex justify-content-end mb-3">
            <button className={`btn ${theme === 'light' ? 'btn-dark' : 'btn-light'}`} onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
        </div>
    );
}

export default ThemeToggle;
