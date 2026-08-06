import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Toaster } from "react-hot-toast";

function Home() {

    const navigate = useNavigate();

   
    const [roomId, setRoomId] = useState("");
    const [recentRooms, setRecentRooms] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
const username = user?.username || "Guest";
useEffect(() => {
    const rooms = JSON.parse(localStorage.getItem("recentRooms")) || [];
    setRecentRooms(rooms);
}, []);
const saveRoom = (id) => {
    let rooms = JSON.parse(localStorage.getItem("recentRooms")) || [];

    rooms = rooms.filter(room => room.roomId !== id);

    rooms.unshift({
        roomId: id,
        joinedAt: new Date().toLocaleString()
    });

    rooms = rooms.slice(0, 5);

    localStorage.setItem("recentRooms", JSON.stringify(rooms));
    setRecentRooms(rooms);
};

   const createRoom = async () => {

    try {

        const res = await API.post("/rooms/create");
        saveRoom(res.data.room.roomId);

        navigate(`/room/${res.data.room.roomId}`, {
            state: {
                username
            }
        });

    } catch (err) {

        console.log(err);
        toast.error("Failed to create room");

    }

};

   const joinRoom = () => {

    if (!roomId.trim()) {

      toast.error("Please enter a Room ID");

        return;

    }

    saveRoom(roomId);
    navigate(`/room/${roomId}`, {

        state: {
            username
        }

    });

};

    return (

        <div style={{ padding: "30px" }}>

            <h1>🚀 CodeSync</h1>
            
            <h3>Welcome, {username} 👋</h3>

            <p>Real-Time Collaborative Code Editor</p>

            

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

            <hr style={{ margin: "30px 0" }} />

<h3>🕒 Recent Rooms</h3>

{recentRooms.length === 0 ? (
    <p>No recent rooms</p>
) : (
    recentRooms.map((room) => (
        <div
            key={room.roomId}
            style={{
                background: "#252526",
                color: "white",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "15px",
                width: "420px",
                marginInline: "auto",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}
        >
            <h4>📁 Room: {room.roomId}</h4>

            <p>🕒 Joined: {room.joinedAt}</p>

            <div
                style={{
                   display: "flex",
justifyContent: "space-between",
marginTop: "15px"
                }}
            >
                <button
                    onClick={() =>
                        navigate(`/room/${room.roomId}`, {
                            state: { username }
                        })
                    }
                >
                    🚀 Join
                </button>

                <button
                    onClick={() =>
                        navigator.clipboard.writeText(room.roomId)
                    }
                >
                    📋 Copy
                </button>

                <button
                    onClick={() => {
                        const updated = recentRooms.filter(
                            (r) => r.roomId !== room.roomId
                        );

                        localStorage.setItem(
                            "recentRooms",
                            JSON.stringify(updated)
                        );

                        setRecentRooms(updated);
                    }}
                >
                    🗑 Delete
                </button>
            </div>
        </div>
    ))
)}

        </div>

    );

}

export default Home;