export default function ThemeToggle({ theme, setTheme }) {
    return (
        <div className="mb-4 flex justify-end">
            <button className="btn-outline" onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
        </div>
    );
}
