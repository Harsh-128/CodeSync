function RunButton({ runCode }) {
    return (
        <button
            onClick={runCode}
            style={{
                marginBottom: "15px",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: "16px"
            }}
        >
            ▶ Run Code
        </button>
    );
}

export default RunButton;