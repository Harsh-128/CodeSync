function RunButton({ runCode, loading }) {
    return (
        <button
            onClick={runCode}
            disabled={loading}
            style={{
                padding: "12px 28px",
                background: loading ? "#6B7280" : "#3B82F6",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "0.2s",
                minWidth: "150px"
            }}
            onMouseOver={(e) => {
                if (!loading)
                    e.target.style.background = "#2563EB";
            }}
            onMouseOut={(e) => {
                if (!loading)
                    e.target.style.background = "#3B82F6";
            }}
        >
            {loading ? "⏳ Running..." : "▶ Run Code"}
        </button>
    );
}

export default RunButton;