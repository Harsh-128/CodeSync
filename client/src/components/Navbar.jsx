import { useNavigate } from "react-router-dom";

function Navbar({ roomId }) {
    const navigate = useNavigate();

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            alert("✅ Room ID copied!");
        } catch (err) {
            console.log(err);
        }
    };

    const leaveRoom = () => {
        navigate("/");
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#252526",
                padding: "18px 30px",
                borderRadius: "14px",
                marginBottom: "20px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.35)"
            }}
        >
            <div>
                <h2
                    style={{
                        margin: 0,
                        color: "white"
                    }}
                >
                    🚀 CodeSync
                </h2>

                <p
                    style={{
                        margin: "4px 0 0",
                        color: "#b3b3b3",
                        fontSize: "14px"
                    }}
                >
                    Real-Time Collaborative Editor
                </p>
            </div>

            <div
                style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px"
                }}
            >
                Room: {roomId}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px"
                }}
            >
                <button onClick={copyRoomId}>
                    📋 Copy
                </button>

                <button onClick={leaveRoom}>
                    🚪 Leave
                </button>
            </div>
        </nav>
    );
}

export default Navbar;