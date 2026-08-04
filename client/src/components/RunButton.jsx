function RunButton({ runCode }) {
    return (
        <button
            onClick={runCode}
            style={{
                padding: "12px 28px",
                background: "#3B82F6",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                transition: "0.2s"
            }}
            onMouseOver={(e) =>
                (e.target.style.background = "#2563EB")
            }
            onMouseOut={(e) =>
                (e.target.style.background = "#3B82F6")
            }
        >
            ▶ Run Code
        </button>
    );
}

export default RunButton;