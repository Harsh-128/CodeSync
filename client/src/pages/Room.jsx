import ChatPanel from "../components/ChatPanel";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../styles/room.css";
import Navbar from "../components/Navbar";
import ThemeSelector from "../components/ThemeSelector";
import API from "../services/api";
import InputPanel from "../components/InputPanel";
import ExecutionHistory from "../components/ExecutionHistory";

import CodeEditor from "../components/CodeEditor";
import LanguageSelector from "../components/LanguageSelector";
import RunButton from "../components/RunButton";
import OutputPanel from "../components/OutputPanel";
import UsersPanel from "../components/UsersPanel";



const socket = io("http://localhost:3000");

function Room() {
    const { roomId } = useParams();
    const location = useLocation();
const username = location.state?.username || "Anonymous";


    const [language, setLanguage] = useState("cpp");
    const [theme, setTheme] = useState("vs-dark");
    

    const [code, setCode] = useState(`#include <iostream>

using namespace std;

int main() {

    cout << "Welcome to CodeSync!";

    return 0;
}`);

    const [output, setOutput] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const getDefaultCode = (lang) => {
    switch (lang) {
        case "cpp":
            return `#include <iostream>

using namespace std;

int main() {

    cout << "Welcome to CodeSync!";

    return 0;
}`;

        case "java":
            return `public class Main {

    public static void main(String[] args) {

        System.out.println("Welcome to CodeSync!");

    }

}`;

        case "python":
            return `print("Welcome to CodeSync!")`;

        case "javascript":
            return `console.log("Welcome to CodeSync!");`;

        default:
            return "";
    }
};
   

    useEffect(() => {

    socket.emit("join-room", {
        roomId,
        username
    });

   socket.on("code-update", (newCode) => {

    setCode(newCode);

    localStorage.setItem(
    `code-${roomId}-${language}`,
    newCode
);

});

    socket.on("users-update", (usersList) => {
        setUsers(usersList);
    });
    
    socket.on("receive-message", (message) => {
    setMessages((prev) => [...prev, message]);
});
   

    return () => {
        socket.off("code-update");
        socket.off("users-update");
         socket.off("receive-message");
    };

}, [roomId, username]);

    useEffect(() => {

    const savedCode = localStorage.getItem(
        `code-${roomId}-${language}`
    );

    if (savedCode) {
        setCode(savedCode);
    } else {
        setCode(getDefaultCode(language));
    }

}, [language, roomId]);

useEffect(() => {
    const savedHistory =
        JSON.parse(localStorage.getItem(`history-${roomId}`)) || [];

    setHistory(savedHistory);
}, [roomId]);

    const handleEditorChange = (value) => {

    setCode(value);

   localStorage.setItem(
    `code-${roomId}-${language}`,
    value
);

    socket.emit("code-change", {
        roomId,
        code: value,
    });

};

    const runCode = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
            const languageMap = {
                cpp: 54,
                java: 62,
                python: 71,
                javascript: 63,
            };
            console.log(code);

       const res = await API.post("/api/run-code", {
    language_id: languageMap[language],
    source_code: code,
    stdin: input,
});
            const result =
    res.data.result.stdout ||
    res.data.result.compile_output ||
    res.data.result.stderr ||
    res.data.result.message ||
    "No Output";

setOutput(result);

const newExecution = {
    language,
    code,
    input,
    output: result,
    time: new Date().toLocaleString(),
};

const updatedHistory = [
    newExecution,
    ...history
].slice(0, 10);

setHistory(updatedHistory);

localStorage.setItem(
    `history-${roomId}`,
    JSON.stringify(updatedHistory)
);
            setLoading(false);
        } 
        catch (error) {

    console.log("FULL ERROR:", error);

    console.log("Response:", error.response);

    console.log("Data:", error.response?.data);

    setOutput(
        error.response?.data?.message ||
        error.message ||
        "Error running code."
    );

    setLoading(false);
}
    };

    const sendMessage = (message) => {

    socket.emit("send-message", {
        roomId,
        message
    });

};

return (
    <div className="room-container">

        <Navbar roomId={roomId} />

        <div className="main-content">

            <div className="left-panel">
                <UsersPanel users={users} />
            </div>

            <div className="center-panel">

                <div className="top-controls">

                    <LanguageSelector
                        language={language}
                        setLanguage={setLanguage}
                    />

                    <ThemeSelector
                        theme={theme}
                        setTheme={setTheme}
                    />

                    <RunButton
                        runCode={runCode}
                        loading={loading}
                    />

                </div>

                <div className="editor-container">

                    <CodeEditor
                        language={language}
                        code={code}
                        onCodeChange={handleEditorChange}
                        theme={theme}
                    />

                </div>

                <InputPanel
                    input={input}
                    setInput={setInput}
                />

                <div className="output-container">
                    <OutputPanel output={output} />
                    <ExecutionHistory history={history} />
                </div>

            </div>

            <div className="right-panel">

                <ChatPanel
                    messages={messages}
                    sendMessage={sendMessage}
                />

            </div>

        </div>

    </div>
);
}
export default Room;

