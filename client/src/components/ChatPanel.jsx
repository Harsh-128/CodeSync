import { useState } from "react";

function ChatPanel({ messages, sendMessage }) {
    const [text, setText] = useState("");

    const handleSend = () => {
        if (!text.trim()) return;

        sendMessage(text);
        setText("");
    };

    return (
        <div
            style={{
                background: "#252526",
                borderRadius: "12px",
                padding: "20px",
                color: "white",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 20px rgba(0,0,0,0.35)"
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    marginTop: 0,
                    marginBottom: "20px"
                }}
            >
                💬 Chat
            </h2>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    marginBottom: "15px"
                }}
            >
                {messages.length === 0 ? (
                    <p
                        style={{
                            textAlign: "center",
                            color: "#888"
                        }}
                    >
                        No messages yet
                    </p>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                background: "#323233",
                                padding: "10px",
                                borderRadius: "10px",
                                marginBottom: "10px"
                            }}
                        >
                            <strong
                                style={{
                                    color: "#4CAF50"
                                }}
                            >
                                {msg.sender}
                            </strong>

                            <p
                                style={{
                                    margin: "5px 0 0"
                                }}
                            >
                                {msg.message}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    marginBottom: "10px"
                }}
            />

            <button
                onClick={handleSend}
                style={{
                    padding: "12px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#4CAF50",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Send
            </button>
        </div>
    );
}

export default ChatPanel;