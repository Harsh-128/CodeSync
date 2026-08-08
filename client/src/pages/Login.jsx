import { useState } from "react";
import { login } from "../services/auth";
import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import toast from "react-hot-toast";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await login(form);

            // Save authentication
            localStorage.setItem("token", res.token);

            localStorage.setItem(
                "user",
                JSON.stringify(res.user)
            );

            toast.success(
                res.message || "Login successful!"
            );

            /*
             * Check whether the user came from
             * a shared room link.
             *
             * Example:
             * /room/alpha-sprint
             */

            const from =
                location.state?.from?.pathname || "/";

            /*
             * If user came from a room link,
             * send them directly into that room.
             */

            if (from.startsWith("/room/")) {

                navigate(from, {
                    replace: true,
                    state: {
                        username:
                            res.user?.username ||
                            res.user?.name ||
                            res.user?.email ||
                            "User"
                    }
                });

            } else {

                // Normal login → Home
                navigate("/", {
                    replace: true
                });

            }

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Login failed"
            );

        }

    };

    return (

        <div style={{ padding: "40px" }}>

            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

            <br />

            <Link to="/signup">
                Create New Account
            </Link>

        </div>

    );
}

export default Login;