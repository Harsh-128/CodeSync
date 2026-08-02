function LanguageSelector({ language, setLanguage }) {
    return (
        <div style={{ marginBottom: "15px" }}>
            <label><b>Select Language: </b></label>

            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
            </select>
        </div>
    );
}

export default LanguageSelector;