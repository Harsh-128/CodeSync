import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import "../styles/profile.css";

const LANG_ICONS = {
    cpp:        "⚙️",
    python:     "🐍",
    javascript: "🟨",
    java:       "☕",
};

function Profile() {
    const navigate = useNavigate();

    const user = (() => {
        try { return JSON.parse(localStorage.getItem("user") || "null"); }
        catch { return null; }
    })();

    const [history,  setHistory]  = useState([]);
    const [loading,  setLoading]  = useState(true);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) { navigate("/login", { replace: true }); }
    }, [user, navigate]);

    // Fetch room history from backend
    useEffect(() => {
        if (!user?._id && !user?.id) return;

        const userId = user._id || user.id;

        API.get(`/room-history/${userId}`)
            .then(res => {
                const data = res.data?.history || res.data || [];
                setHistory(Array.isArray(data) ? data : []);
            })
            .catch(() => setHistory([]))
            .finally(() => setLoading(false));
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out");
        navigate("/login");
    };

    const joinRoom = (roomId) => {
        navigate(`/room/${roomId}`, { state: { username: user?.username } });
    };

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric"
            });
        } catch { return "—"; }
    };

    if (!user) return null;

    const joinedDate = user.createdAt
        ? formatDate(user.createdAt)
        : "—";

    return (
        <div className="profile-page">

            {/* Topbar */}
            <div className="profile-topbar">
                <div className="brand" onClick={() => navigate("/")}>
                    <span className="brand-icon">&lt;/&gt;</span>
                    Code<span>Sync</span>
                </div>
                <button className="topbar-btn" onClick={() => navigate("/")}>
                    ← Home
                </button>
                <button className="topbar-btn danger" onClick={logout}>
                    Logout
                </button>
            </div>

            {/* Content */}
            <div className="profile-content">

                {/* Left — User card */}
                <div className="profile-card">

                    <div className="profile-avatar">
                        {(user.username || "U").charAt(0).toUpperCase()}
                    </div>

                    <h2 className="profile-name">{user.username}</h2>
                    <p className="profile-email">{user.email}</p>

                    {/* Stats */}
                    <div className="profile-stats">
                        <div className="stat-box">
                            <div className="stat-value">{history.length}</div>
                            <div className="stat-label">Rooms Joined</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">
                                {[...new Set(history.map(h => h.roomId))].length}
                            </div>
                            <div className="stat-label">Unique Rooms</div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="profile-info">
                        <div className="profile-info-row">
                            <span className="profile-info-label">Username</span>
                            <span className="profile-info-value">{user.username}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">Email</span>
                            <span className="profile-info-value">{user.email}</span>
                        </div>
                        <div className="profile-info-row">
                            <span className="profile-info-label">Member Since</span>
                            <span className="profile-info-value">{joinedDate}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="btn-home" onClick={() => navigate("/")}>
                            🏠 Home
                        </button>
                        <button className="btn-logout" onClick={logout}>
                            🚪 Logout
                        </button>
                    </div>

                </div>

                {/* Right — Room history */}
                <div className="history-panel">

                    <h3 className="history-title">
                        📜 Room History
                    </h3>

                    {loading ? (
                        <p className="history-loading">Loading history...</p>
                    ) : history.length === 0 ? (
                        <p className="history-empty">
                            No rooms joined yet.<br />
                            <span style={{ fontSize: "11px" }}>
                                Create or join a room to see it here.
                            </span>
                        </p>
                    ) : (
                        <div className="history-list">
                            {history.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="history-item"
                                    onClick={() => joinRoom(item.roomId)}
                                >
                                    <div className="history-item-left">
                                        <div className="history-room-icon">
                                            {LANG_ICONS[item.language] || "💻"}
                                        </div>
                                        <div>
                                            <div className="history-room-id">
                                                #{item.roomId}
                                            </div>
                                            <div className="history-room-meta">
                                                {formatDate(item.joinedAt || item.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span className="history-lang-badge">
                                            {item.language || "cpp"}
                                        </span>
                                        <button
                                            className="history-join-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                joinRoom(item.roomId);
                                            }}
                                        >
                                            Rejoin →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Profile;
