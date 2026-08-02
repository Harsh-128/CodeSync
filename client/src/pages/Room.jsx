import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";

const socket = io("http://localhost:3000");

function Room() {

    const { roomId } = useParams();

    const [code, setCode] = useState(`#include <iostream>

using namespace std;

int main() {

    cout << "Welcome to CodeSync!";

    return 0;
}`);

    useEffect(() => {

        socket.emit("join-room", roomId);

        socket.on("code-update", (newCode) => {

            setCode(newCode);

        });

        return () => {

            socket.off("code-update");

        };

    }, [roomId]);

    const handleEditorChange = (value) => {

        setCode(value);

        socket.emit("code-change", {

            roomId,

            code: value

        });

    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>🚀 CodeSync Room</h1>

            <h2>Room ID: {roomId}</h2>

            <Editor
                height="80vh"
                language="cpp"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
            />

        </div>

    );

}

export default Room;