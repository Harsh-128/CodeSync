import { useState } from "react";
import { login } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

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

            localStorage.setItem("token", res.token);

            localStorage.setItem(
                "user",
                JSON.stringify(res.user)
            );

            alert(res.message);

            navigate("/");

        } catch (err) {

            alert(
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