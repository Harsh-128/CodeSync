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
                width: "300px",
                background: "#252526",
                color: "white",
                padding: "15px",
                borderRadius: "8px"
            }}
        >
            <h3>💬 Chat</h3>

            <div
                style={{
                    height: "300px",
                    overflowY: "auto",
                    marginBottom: "10px"
                }}
            >
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender}</strong>: {msg.message}
                    </p>
                ))}
            </div>

            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                style={{
                    width: "100%",
                    padding: "8px"
                }}
            />

            <button
                onClick={handleSend}
                style={{
                    marginTop: "10px"
                }}
            >
                Send
            </button>
        </div>
    );
}

export default ChatPanel;