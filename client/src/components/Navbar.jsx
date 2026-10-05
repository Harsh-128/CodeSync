import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar({ roomId }) {
    const navigate = useNavigate();

    const copyRoomLink = async () => {
        try {
            const link = `${window.location.origin}/room/${roomId}`;
            await navigator.clipboard.writeText(link);
            toast.success("Room link copied!");
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out");
        navigate("/login");
    };

    return (
        <nav className="room-navbar">
            {/* Brand */}
            <div className="brand">
                <span className="brand-icon">&lt;/&gt;</span>
                <span className="brand-name">Code<span>Sync</span></span>
            </div>

            {/* Room ID */}
            <span className="room-id-badge">⬡ Room: {roomId}</span>

            {/* Actions */}
            <div className="nav-actions">
                <button className="nav-btn" onClick={copyRoomLink} title="Copy invite link">
                    🔗 Copy Link
                </button>
                <button className="nav-btn primary" onClick={() => navigate("/profile")} title="Profile">
                    👤 Profile
                </button>
                <button className="nav-btn" onClick={() => navigate("/")} title="Leave room">
                    ← Leave
                </button>
                <button className="nav-btn danger" onClick={logout} title="Logout">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
