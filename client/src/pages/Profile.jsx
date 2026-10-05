import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/profile.css";

function Profile() {
    const navigate = useNavigate();

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    })();

    // Redirect to login if user data is missing (e.g. storage was cleared)
    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    if (!user) return null;

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logged out successfully");

        navigate("/login");
    };

    return (
        <div className="profile-container">

            <div className="profile-card">

                <div className="avatar">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>

                <h2>{user?.username}</h2>

                <p>{user?.email}</p>

                <div className="info">

                    <p>
                        <strong>Username:</strong> {user?.username}
                    </p>

                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>

                </div>

                <div className="profile-buttons">

                    <button
                        className="back-btn"
                        onClick={() => navigate("/")}
                    >
                        🏠 Home
                    </button>

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Profile;