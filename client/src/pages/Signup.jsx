import { useState } from "react";
import { signup } from "../services/auth";
import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import toast from "react-hot-toast";

function Signup() {

    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        username: "",
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

            const res = await signup(form);

            toast.success(
                res.message || "Account created successfully!"
            );

            /*
             * Preserve where the user came from.
             *
             * If they came from:
             *
             * /room/alpha-sprint
             *
             * that information is stored in:
             *
             * location.state.from
             */

            const from =
                location.state?.from || null;


            /*
             * Send them to Login,
             * but keep the room information.
             */

            navigate("/login", {

                replace: true,

                state: {
                    from: from
                }

            });

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Signup failed"
            );

        }

    };

    return (

        <div style={{ padding: "40px" }}>

            <h2>Create Account</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <button type="submit">
                    Sign Up
                </button>

            </form>

            <br />

            <Link
                to="/login"
                state={location.state}
            >
                Already have an account?
            </Link>

        </div>

    );

}

export default Signup;