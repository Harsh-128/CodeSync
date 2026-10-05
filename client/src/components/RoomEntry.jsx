import { useParams, useNavigate, Navigate } from "react-router-dom";
import Room from "../pages/Room";

function RoomEntry() {
    const { roomId } = useParams();
    const token = localStorage.getItem("token");

    // Logged in → go straight into the room
    if (token) {
        return <Room />;
    }

    // Not logged in → redirect to login, preserving the room URL so
    // after login they land directly in the room
    return (
        <Navigate
            to="/login"
            replace
            state={{ from: { pathname: `/room/${roomId}` } }}
        />
    );
}

export default RoomEntry;
