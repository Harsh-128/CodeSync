import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Home() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");

    const createRoom = async () => {

        if (!username.trim()) {
            alert("Please enter your name");
            return;
        }

        try {

            const res = await API.post("/rooms/create");

            navigate(`/room/${res.data.room.roomId}`, {
                state: {
                    username
                }
            });

        } catch (err) {

            console.log(err);
            alert("Failed to create room");

        }

    };

    const joinRoom = () => {

        if (!username.trim() || !roomId.trim()) {

            alert("Enter Username and Room ID");

            return;

        }

        navigate(`/room/${roomId}`, {

            state: {
                username
            }

        });

    };

    return (

        <div style={{ padding: "30px" }}>

            <h1>🚀 CodeSync</h1>

            <p>Real-Time Collaborative Code Editor</p>

            <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                    padding: "10px",
                    width: "300px",
                    marginBottom: "15px"
                }}
            />

            <br />

            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={{
                    padding: "10px",
                    width: "300px",
                    marginBottom: "20px"
                }}
            />

            <br />

            <button onClick={createRoom}>
                Create Room
            </button>

            <button
                onClick={joinRoom}
                style={{ marginLeft: "10px" }}
            >
                Join Room
            </button>

        </div>

    );

}

export default Home;