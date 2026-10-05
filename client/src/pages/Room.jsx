import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import "../styles/room.css";

import Navbar from "../components/Navbar";
import ChatPanel from "../components/ChatPanel";
import UsersPanel from "../components/UsersPanel";
import CodeEditor from "../components/CodeEditor";
import API from "../services/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const LANGUAGES = [
    { label: "C++",        value: "cpp",        id: 54 },
    { label: "Python",     value: "python",     id: 71 },
    { label: "JavaScript", value: "javascript", id: 63 },
    { label: "Java",       value: "java",       id: 62 },
];

const THEMES = [
    { label: "VS Dark",       value: "vs-dark"  },
    { label: "VS Light",      value: "light"    },
    { label: "High Contrast", value: "hc-black" },
];

const DEFAULT_CODE = {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Welcome to CodeSync!" << endl;
    return 0;
}`,
    python:     `print("Welcome to CodeSync!")`,
    javascript: `console.log("Welcome to CodeSync!");`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to CodeSync!");
    }
}`,
};


function Room() {
    const { roomId }  = useParams();
    const location    = useLocation();
    const navigate    = useNavigate();

    /* ── User ── */
    const [user] = useState(() => {
        try { return JSON.parse(localStorage.getItem("user") || "null"); }
        catch { return null; }
    });

    const username =
        location.state?.username ||
        user?.username || user?.name || user?.email || "User";

    /* ── Room state ── */
    const [language, setLanguage] = useState("cpp");
    const [theme,    setTheme]    = useState("vs-dark");
    const [code,     setCode]     = useState(DEFAULT_CODE.cpp);
    const [input,    setInput]    = useState("");
    const [output,   setOutput]   = useState("");
    const [loading,  setLoading]  = useState(false);
    const [users,    setUsers]    = useState([]);
    const [messages, setMessages] = useState([]);

    /* ── Language ref for socket handler (avoids stale closure) ── */
    const languageRef = useRef(language);
    useEffect(() => { languageRef.current = language; }, [language]);

    /* ── Auth guard ── */
    useEffect(() => {
        if (!localStorage.getItem("token") || !localStorage.getItem("user")) {
            navigate("/login", {
                replace: true,
                state: { from: { pathname: `/room/${roomId}` } }
            });
        }
    }, [navigate, roomId]);

    /* ── Socket ── */
    const socketRef = useRef(null);
    const [socketReady, setSocketReady] = useState(false);

    useEffect(() => {
        if (!roomId || !username) return;

        const s = io(BACKEND_URL);
        socketRef.current = s;

        const joinRoom = () => {
            s.emit("join-room", { roomId, username });
            setSocketReady(true);
        };
        s.on("connect", joinRoom);
        if (s.connected) joinRoom();

        s.on("code-update", (newCode) => {
            const updated = typeof newCode === "string" ? newCode : newCode?.code;
            if (!updated) return;
            setCode(updated);
            localStorage.setItem(`code-${roomId}-${languageRef.current}`, updated);
        });

        s.on("users-update",    (list) => setUsers(list || []));
        s.on("receive-message", (msg)  => setMessages(prev => [
            ...prev,
            { ...msg, id: `${Date.now()}-${Math.random()}` }
        ]));

        return () => { s.disconnect(); socketRef.current = null; setSocketReady(false); };
    }, [roomId, username]);

    /* ── Load saved code on language change ── */
    useEffect(() => {
        const saved = localStorage.getItem(`code-${roomId}-${language}`);
        setCode(saved || DEFAULT_CODE[language] || "");
    }, [language, roomId]);

    /* ── Handlers ── */
    const handleEditorChange = (value) => {
        setCode(value);
        localStorage.setItem(`code-${roomId}-${language}`, value);
        socketRef.current?.emit("code-change", { roomId, code: value });
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setOutput("");
    };

    const runCode = async () => {
        if (loading) return;
        setLoading(true);
        setOutput("Running…");

        try {
            const lang = LANGUAGES.find(l => l.value === language);
            const res  = await API.post("/code/run", {
                language_id: lang.id,
                source_code: code,
                stdin:       input,
            });

            setOutput(
                res.data?.stdout ||
                res.data?.output ||
                res.data?.stderr ||
                "No output"
            );
        } catch (err) {
            setOutput(err.response?.data?.message || err.message || "Error running code");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = (msg) => {
        if (!msg?.trim()) return;
        socketRef.current?.emit("send-message", { roomId, message: msg });
    };

    const isError = output.toLowerCase().includes("error") ||
                    output.toLowerCase().includes("failed");

    /* ── Render ── */
    return (
        <div className="room-page">

            <Navbar roomId={roomId} />

            <div className="main-content">

                {/* ── LEFT — Users ── */}
                <UsersPanel users={users} />

                {/* ── CENTER — Editor + IO ── */}
                <div className="center-panel">

                    {/* Toolbar */}
                    <div className="editor-toolbar">
                        {/* Language */}
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            title="Language"
                        >
                            {LANGUAGES.map(l => (
                                <option key={l.value} value={l.value}>{l.label}</option>
                            ))}
                        </select>

                        {/* Theme */}
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            title="Theme"
                        >
                            {THEMES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>

                        {/* Run button */}
                        <button
                            className="run-btn"
                            onClick={runCode}
                            disabled={loading}
                        >
                            {loading
                                ? <><span className="spinner" /> Running…</>
                                : <>▶ Run Code</>
                            }
                        </button>
                    </div>

                    {/* Monaco Editor */}
                    <div className="editor-container">
                        <CodeEditor
                            language={language}
                            code={code}
                            onCodeChange={handleEditorChange}
                            theme={theme}
                            socketRef={socketRef}
                            socketReady={socketReady}
                            roomId={roomId}
                            username={username}
                        />
                    </div>

                    {/* Input / Output side by side */}
                    <div className="io-area">
                        {/* stdin */}
                        <div className="io-pane">
                            <div className="io-label">⌨ Input (stdin)</div>
                            <textarea
                                className="io-textarea"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter program input here…"
                                spellCheck={false}
                            />
                        </div>

                        {/* stdout */}
                        <div className="io-pane">
                            <div className="io-label output-label">▶ Output</div>
                            <div className={`io-output ${isError ? "error" : ""} ${!output ? "placeholder" : ""}`}>
                                {output || "Output will appear here after running…"}
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── RIGHT — Chat ── */}
                <ChatPanel
                    messages={messages}
                    sendMessage={sendMessage}
                    currentUser={username}
                />

            </div>

        </div>
    );
}

export default Room;
