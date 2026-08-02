import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Home() {

    const navigate = useNavigate();

    const createRoom = async () => {

        console.log("Button Clicked");

        try {

            const res = await API.post("/rooms/create");

            console.log(res.data);

            navigate(`/room/${res.data.room.roomId}`);

        } catch (err) {

            console.log(err);
            alert("Failed to create room");

        }

    };

    return (

        <div>

            <h1>🚀 CodeSync</h1>

            <p>Real-Time Collaborative Code Editor</p>

            <button onClick={createRoom}>
                Create Room
            </button>

            <button>
                Join Room
            </button>

        </div>

    );

}

export default Home;