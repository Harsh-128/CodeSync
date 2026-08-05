function ThemeSelector({ theme, setTheme }) {
    return (
        <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
        >
            <option value="vs-dark">VS Dark</option>
            <option value="light">VS Light</option>
            <option value="hc-black">High Contrast</option>
        </select>
    );
}

export default ThemeSelector;