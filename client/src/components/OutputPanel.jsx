function OutputPanel({ output }) {
    return (
        <div
            style={{
                marginTop: "20px",
                padding: "15px",
                background: "#1e1e1e",
                color: "#00ff00",
                borderRadius: "8px"
            }}
        >
            <h3>Output</h3>

            <pre>{output}</pre>
        </div>
    );
}

export default OutputPanel;