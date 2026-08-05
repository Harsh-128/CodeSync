function ExecutionHistory({ history }) {
    return (
        <div
            style={{
                marginTop: "20px",
                background: "#252526",
                padding: "20px",
                borderRadius: "12px",
                color: "white"
            }}
        >
            <h2>📜 Execution History</h2>

            {history.length === 0 ? (
                <p>No executions yet.</p>
            ) : (
                history.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            borderBottom: "1px solid #444",
                            padding: "12px 0"
                        }}
                    >
                        <strong>{item.language.toUpperCase()}</strong>

                        <br />

                        <small>{item.time}</small>

                        <pre
                            style={{
                                whiteSpace: "pre-wrap",
                                color: "#00ff66"
                            }}
                        >
                            {item.output}
                        </pre>
                    </div>
                ))
            )}
        </div>
    );
}

export default ExecutionHistory;