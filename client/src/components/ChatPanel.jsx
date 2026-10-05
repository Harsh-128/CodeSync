import { useState, useEffect, useRef } from "react";

function ChatPanel({ messages, sendMessage, currentUser }) {
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage(text.trim());
        setText("");
    };

    return (
        <div className="right-panel">
            <div className="chat-header">💬 Chat</div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <p className="chat-empty">No messages yet</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={msg.id ?? index} className="chat-msg">
                            <div className={`chat-msg-sender ${msg.sender === currentUser ? "self" : ""}`}>
                                {msg.sender}
                            </div>
                            <div className="chat-msg-text">{msg.message}</div>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            <div className="chat-input-area">
                <input
                    className="chat-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                />
                <button className="chat-send-btn" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatPanel;
