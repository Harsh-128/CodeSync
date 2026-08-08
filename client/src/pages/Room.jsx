import ChatPanel from "../components/ChatPanel";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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


/* =========================================================
   SOCKET CONNECTION
========================================================= */

const socket = io("https://codesync-backend-lifv.onrender.com");


function Room() {

    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();


    /* =========================================================
       USER
    ========================================================= */

    const [user] = useState(() => {

        try {

            return JSON.parse(
                localStorage.getItem("user") || "null"
            );

        } catch {

            return null;

        }

    });


    /*
       Priority:

       1. Username passed from Home
       2. Logged-in user's username
       3. Logged-in user's name
       4. Logged-in user's email
    */

    const username =
        location.state?.username ||
        user?.username ||
        user?.name ||
        user?.email ||
        "User";


    /* =========================================================
       ROOM STATE
    ========================================================= */

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


    /* =========================================================
       DEFAULT CODE
    ========================================================= */

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


    /* =========================================================
       AUTH CHECK
    ========================================================= */

    useEffect(() => {

        const token = localStorage.getItem("token");

        const savedUser = localStorage.getItem("user");

        if (!token || !savedUser) {

            navigate("/login", {
                replace: true,
                state: {
                    from: `/room/${roomId}`
                }
            });

        }

    }, [navigate, roomId]);


    /* =========================================================
       SOCKET ROOM CONNECTION
    ========================================================= */

    useEffect(() => {

        if (!roomId || !username) {
            return;
        }


        console.log("Joining room:", roomId);

        console.log("Username:", username);


        /*
           Join room
        */

        socket.emit("join-room", {

            roomId,

            username

        });


        /* -----------------------------------------
           CODE UPDATE
        ----------------------------------------- */

        const handleCodeUpdate = (newCode) => {

            /*
              Backend currently sends the code directly.
            */

            const updatedCode =
                typeof newCode === "string"
                    ? newCode
                    : newCode?.code;


            if (!updatedCode) {
                return;
            }


            setCode(updatedCode);


            localStorage.setItem(

                `code-${roomId}-${language}`,

                updatedCode

            );

        };


        /* -----------------------------------------
           USERS UPDATE
        ----------------------------------------- */

        const handleUsersUpdate = (usersList) => {

            console.log("Users in room:", usersList);

            setUsers(usersList || []);

        };


        /* -----------------------------------------
           CHAT MESSAGE
        ----------------------------------------- */

        const handleReceiveMessage = (message) => {

            setMessages((prev) => [

                ...prev,

                message

            ]);

        };


        socket.on(
            "code-update",
            handleCodeUpdate
        );


        socket.on(
            "users-update",
            handleUsersUpdate
        );


        socket.on(
            "receive-message",
            handleReceiveMessage
        );


        /* -----------------------------------------
           CLEANUP
        ----------------------------------------- */

        return () => {

            socket.off(
                "code-update",
                handleCodeUpdate
            );


            socket.off(
                "users-update",
                handleUsersUpdate
            );


            socket.off(
                "receive-message",
                handleReceiveMessage
            );

        };

    }, [roomId, username, language]);


    /* =========================================================
       LOAD SAVED CODE WHEN LANGUAGE CHANGES
    ========================================================= */

    useEffect(() => {

        const savedCode = localStorage.getItem(

            `code-${roomId}-${language}`

        );


        if (savedCode) {

            setCode(savedCode);

        } else {

            setCode(
                getDefaultCode(language)
            );

        }

    }, [language, roomId]);


    /* =========================================================
       LOAD EXECUTION HISTORY
    ========================================================= */

    useEffect(() => {

        try {

            const savedHistory = JSON.parse(

                localStorage.getItem(
                    `history-${roomId}`
                ) || "[]"

            );


            setHistory(savedHistory);

        } catch {

            setHistory([]);

        }

    }, [roomId]);


    /* =========================================================
       CODE EDITOR CHANGE
    ========================================================= */

    const handleEditorChange = (value) => {

        setCode(value);


        /*
           Save locally
        */

        localStorage.setItem(

            `code-${roomId}-${language}`,

            value

        );


        /*
           Send to other collaborators
        */

        socket.emit("code-change", {

            roomId,

            code: value

        });

    };


    /* =========================================================
       RUN CODE
    ========================================================= */

    const runCode = async () => {

        if (loading) {
            return;
        }


        setLoading(true);


        setOutput(
            "Running code...\nPlease wait..."
        );


        try {

            const languageMap = {

                cpp: 54,

                java: 62,

                python: 71,

                javascript: 63

            };


            const res = await API.post(

                "/api/run-code",

                {

                    language_id:
                        languageMap[language],

                    source_code:
                        code,

                    stdin:
                        input

                }

            );


            const result =

                res.data?.result?.stdout ||

                res.data?.result?.compile_output ||

                res.data?.result?.stderr ||

                res.data?.result?.message ||

                "No Output";


            setOutput(result);


            /* -----------------------------------------
               EXECUTION HISTORY
            ----------------------------------------- */

            const newExecution = {

                language,

                code,

                input,

                output: result,

                time:
                    new Date().toLocaleString()

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

        } catch (error) {

            console.error(
                "FULL ERROR:",
                error
            );


            console.error(
                "Response:",
                error.response
            );


            console.error(
                "Data:",
                error.response?.data
            );


            setOutput(

                error.response?.data?.message ||

                error.message ||

                "Error running code."

            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       SEND CHAT MESSAGE
    ========================================================= */

    const sendMessage = (message) => {

        if (!message?.trim()) {
            return;
        }


        socket.emit(

            "send-message",

            {

                roomId,

                message

            }

        );

    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="room-page">

            <Navbar roomId={roomId} />


            <div className="main-content">


                {/* =========================================
                    LEFT PANEL
                ========================================= */}

                <div className="left-panel">

                    <UsersPanel
                        users={users}
                    />

                </div>


                {/* =========================================
                    CENTER PANEL
                ========================================= */}

                <div className="center-panel">


                    {/* TOP CONTROLS */}

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


                    {/* CODE EDITOR */}

                    <div className="editor-container">

                        <CodeEditor

                            language={language}

                            code={code}

                            onCodeChange={
                                handleEditorChange
                            }

                            theme={theme}

                        />

                    </div>


                    {/* INPUT */}

                    <InputPanel

                        input={input}

                        setInput={setInput}

                    />


                    {/* OUTPUT */}

                    <div className="output-container">

                        <OutputPanel
                            output={output}
                        />


                        <ExecutionHistory
                            history={history}
                        />

                    </div>

                </div>


                {/* =========================================
                    RIGHT PANEL
                ========================================= */}

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