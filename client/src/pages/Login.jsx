import { useState } from "react";
import { login } from "../services/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/auth.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm]       = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await login(form);

            localStorage.setItem("token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));

            toast.success(res.message || "Login successful!");

            const from = location.state?.from?.pathname || "/";
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
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Brand */}
                <div className="auth-brand">
                    <span className="auth-brand-icon">&lt;/&gt;</span>
                    <span className="auth-brand-name">Code<span>Sync</span></span>
                </div>

                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Login to continue coding together</p>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="auth-field">
                        <label className="auth-label">Email</label>
                        <input
                            className="auth-input"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Password</label>
                        <input
                            className="auth-input"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        className="auth-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in…" : "Login"}
                    </button>

                </form>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/signup" state={location.state}>Sign up</Link>
                </div>

            </div>
        </div>
    );
}

export default Login;
