import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Room from "./pages/Room";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: "#252526",
                        color: "#fff",
                        border: "1px solid #3b82f6",
                        borderRadius: "10px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#22c55e",
                            secondary: "#fff",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ef4444",
                            secondary: "#fff",
                        },
                    },
                }}
            />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/signup" element={<Signup />} />

                <Route
                    path="/room/:roomId"
                    element={
                        <ProtectedRoute>
                            <Room />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;