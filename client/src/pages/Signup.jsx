import { useState } from "react";
import { signup } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

function Signup() {

    const navigate = useNavigate();

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

            alert(res.message);

            navigate("/login");

        } catch (err) {

            alert(
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
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">

                    Sign Up

                </button>

            </form>

            <br />

            <Link to="/login">

                Already have an account?

            </Link>

        </div>

    );

}

export default Signup;