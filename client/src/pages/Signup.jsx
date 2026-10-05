import { useState } from "react";
import { signup } from "../services/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/auth.css";

function Signup() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm]       = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await signup(form);
            toast.success(res.message || "Account created! Please login.");

            navigate("/login", {
                replace: true,
                state: { from: location.state?.from || null }
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
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

                <h2 className="auth-title">Create account</h2>
                <p className="auth-subtitle">Start collaborating in real-time</p>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="auth-field">
                        <label className="auth-label">Username</label>
                        <input
                            className="auth-input"
                            type="text"
                            name="username"
                            placeholder="yourname"
                            value={form.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>

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
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        className="auth-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account…" : "Create Account"}
                    </button>

                </form>

                <div className="auth-footer">
                    Already have an account?
                    <Link to="/login" state={location.state}>Login</Link>
                </div>

            </div>
        </div>
    );
}

export default Signup;
