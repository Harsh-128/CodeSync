import {
    useParams,
    useNavigate
} from "react-router-dom";

import Home from "../pages/Home";
import Room from "../pages/Room";

function RoomEntry() {

    const { roomId } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // User wants to login to the shared room
    const handleRoomLogin = () => {

        navigate("/login", {
            state: {
                from: {
                    pathname: `/room/${roomId}`
                }
            }
        });

    };

    // User wants to create a new account
    const handleRoomSignup = () => {

        navigate("/signup", {
            state: {
                from: {
                    pathname: `/room/${roomId}`
                }
            }
        });

    };

    // Already logged in → directly enter room
    if (token) {
        return <Room />;
    }

    // Not logged in → show Home page
    // with the room invitation
    return (
        <Home
            invitedRoomId={roomId}
            onRoomLogin={handleRoomLogin}
            onRoomSignup={handleRoomSignup}
        />
    );
}

export default RoomEntry;