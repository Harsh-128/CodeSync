import ChatPanel from "../components/ChatPanel";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../styles/room.css";
import Navbar from "../components/Navbar";

import API from "../services/api";

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

    const [code, setCode] = useState(`#include <iostream>

using namespace std;

int main() {

    cout << "Welcome to CodeSync!";

    return 0;
}`);

    const [output, setOutput] = useState("");
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {

    socket.emit("join-room", {
        roomId,
        username
    });

    socket.on("code-update", (newCode) => {
        setCode(newCode);
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
        if (language === "cpp") {
            setCode(`#include <iostream>

using namespace std;

int main() {

    cout << "Welcome to CodeSync!";

    return 0;
}`);
        } else if (language === "java") {
            setCode(`public class Main {

    public static void main(String[] args) {

        System.out.println("Welcome to CodeSync!");

    }

}`);
        } else if (language === "python") {
            setCode(`print("Welcome to CodeSync!")`);
        } else if (language === "javascript") {
            setCode(`console.log("Welcome to CodeSync!");`);
        }
    }, [language]);

    const handleEditorChange = (value) => {
        setCode(value);

        socket.emit("code-change", {
            roomId,
            code: value,
        });
    };

    const runCode = async () => {
        try {
            const languageMap = {
                cpp: 54,
                java: 62,
                python: 71,
                javascript: 63,
            };

            const res = await API.post("/code/run", {
                language_id: languageMap[language],
                source_code: code,
            });

            setOutput(
                res.data.stdout ||
                res.data.compile_output ||
                res.data.stderr
            );
        } catch (error) {
            console.log(error);
            setOutput("Error running code.");
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

                    <RunButton runCode={runCode} />

                </div>

                <div className="editor-container">

                    <CodeEditor
                        language={language}
                        code={code}
                        onCodeChange={handleEditorChange}
                    />

                </div>

                <div className="output-container">
                    <OutputPanel output={output} />
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