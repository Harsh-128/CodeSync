import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { login, signup } from "../services/auth";
import toast from "react-hot-toast";
import "./Home.css";

const FEATURES = [
  ["⚡", "Real-time Sync", "Code changes sync instantly across all collaborators via Socket.IO WebSockets."],
  ["▶", "Code Execution", "Run JavaScript, Python, and more directly in the browser sandbox."],
  ["◉", "Live Cursors", "See every collaborator's cursor position and presence in real time."],
  ["💬", "Built-in Chat", "Discuss code without leaving the editor using the integrated chat panel."],
];

const TECH_STACK = [
  ["⚛", "React"],
  ["🟢", "Node.js"],
  ["🔌", "Socket.IO"],
  ["🍃", "MongoDB"],
  ["🐳", "Docker"],
];

function Home({ invitedRoomId }) {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [recentRooms, setRecentRooms] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const username = user?.username || user?.name || user?.email || "Guest";

  useEffect(() => {
    try {
      setRecentRooms(JSON.parse(localStorage.getItem("recentRooms") || "[]"));
    } catch {
      setRecentRooms([]);
    }
  }, []);

  const saveRoom = (id) => {
    const cleanId = id.trim();
    if (!cleanId) return;

    let rooms = [];
    try {
      rooms = JSON.parse(localStorage.getItem("recentRooms") || "[]");
    } catch {
      rooms = [];
    }

    rooms = [
      { roomId: cleanId, joinedAt: new Date().toLocaleString("en-IN") },
      ...rooms.filter((room) => room.roomId !== cleanId),
    ].slice(0, 5);

    localStorage.setItem("recentRooms", JSON.stringify(rooms));
    setRecentRooms(rooms);
  };

  const createRoom = async () => {
    try {
      const res = await API.post("/rooms/create");
      const id = res?.data?.room?.roomId;
      if (!id) throw new Error("Room ID missing");

      saveRoom(id);
      toast.success("Room created successfully!");
      navigate(`/room/${id}`, { state: { username } });
    } catch (error) {
      console.error(error);
      toast.error("Could not create room. Please check the backend.");
    }
  };

  const joinRoom = () => {
    const id = roomId.trim();
    if (!id) {
      toast.error("Please enter a Room ID");
      return;
    }

    saveRoom(id);
    toast.success(`Joining ${id}`);
    navigate(`/room/${id}`, { state: { username } });
  };

  const openRoom = (id) => {
    saveRoom(id);
    navigate(`/room/${id}`, { state: { username } });
  };

  const deleteRoom = (id) => {
    const updated = recentRooms.filter((room) => room.roomId !== id);
    localStorage.setItem("recentRooms", JSON.stringify(updated));
    setRecentRooms(updated);
    toast.success("Room removed");
  };

  const copyText = async (text, message = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error("Copy failed");
    }
  };

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const submitAuth = async (event) => {
    event.preventDefault();

    if (!authEmail.trim() || !authPassword.trim()) {
      toast.error("Please enter your email and password");
      return;
    }

    if (authMode === "signup" && !authUsername.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === "login") {
        const res = await login({
          email: authEmail.trim(),
          password: authPassword,
        });

        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        setUser(res.user);
        toast.success(res.message || "Login successful!");

        setAuthOpen(false);
        setAuthEmail("");
        setAuthPassword("");
        setAuthUsername("");

        if (invitedRoomId) {
          navigate(`/room/${invitedRoomId}`, {
            replace: true,
            state: {
              username:
                res.user?.username ||
                res.user?.name ||
                res.user?.email ||
                "User",
            },
          });
        }
      } else {
        const res = await signup({
          username: authUsername.trim(),
          email: authEmail.trim(),
          password: authPassword,
        });

        toast.success(res.message || "Account created successfully!");
        setAuthMode("login");
        setAuthPassword("");

        toast.success(
          invitedRoomId
            ? "Account created! Now login to join the room."
            : "Account created! Please login."
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (authMode === "login" ? "Login failed" : "Signup failed")
      );
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="cs-home">
      {/* ── Navbar ── */}
      <header className="cs-nav">
        <div className="cs-nav-inner">
          {/* Brand */}
          <button
            className="cs-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Go to top"
          >
            <span className="cs-brand-icon">&lt;/&gt;</span>
            <span className="cs-brand-name">
              Code<span>Sync</span>
            </span>
          </button>

          {/* Desktop nav links */}
          <nav className="cs-nav-links" aria-label="Site navigation">
            <a href="#cs-features">Features</a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>

          {/* Auth actions */}
          <div className="cs-nav-actions">
            {user ? (
              <div className="cs-nav-user">
                <button
                  className="cs-nav-avatar-btn"
                  onClick={() => navigate("/profile")}
                  title="Open profile"
                  aria-label="Open profile"
                >
                  <span className="cs-avatar-initial">
                    {(user.username || user.name || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                  <span className="cs-nav-username">
                    {user.username || user.name || user.email}
                  </span>
                </button>
                <button
                  className="cs-btn-ghost"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  className="cs-btn-ghost"
                  onClick={() => openAuth("login")}
                >
                  Login
                </button>
                <button
                  className="cs-btn-primary"
                  onClick={() => openAuth("signup")}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="cs-hero" aria-label="Hero">
          <div className="cs-hero-glow" aria-hidden="true" />

          {/* Room invite card */}
          {invitedRoomId && (
            <div className="cs-invite-card" role="region" aria-label="Room invitation">
              <span className="cs-invite-icon" aria-hidden="true">👥</span>
              <div>
                <p className="cs-invite-label">ROOM INVITATION</p>
                <h3>You've been invited to collaborate</h3>
                <p>
                  Join room <strong>#{invitedRoomId}</strong> and start coding
                  together in real time.
                </p>
                <div className="cs-invite-actions">
                  <button
                    className="cs-btn-primary"
                    onClick={() => openAuth("login")}
                  >
                    Login to Join
                  </button>
                  <button
                    className="cs-btn-secondary"
                    onClick={() => openAuth("signup")}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="cs-hero-inner">
            <h1>
              Code Together,{" "}
              <span className="cs-gradient-text">in Real Time.</span>
            </h1>

            <p className="cs-hero-sub">
              A real-time collaborative code editor built with React, Node.js,
              Socket.IO and MongoDB. Open a room, share the link, start coding.
            </p>

            {/* Room input row */}
            <div className="cs-room-row">
              <input
                className="cs-room-input"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                placeholder="Enter Room ID or name"
                aria-label="Room ID or name"
              />
              <button className="cs-btn-primary" onClick={joinRoom}>
                Join Room
              </button>
              <button className="cs-btn-secondary" onClick={createRoom}>
                Create Room
              </button>
            </div>

            <p className="cs-hero-tagline">
              No installation needed&nbsp;·&nbsp;Works in your browser&nbsp;·&nbsp;Free to use
            </p>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="cs-features" className="cs-features" aria-label="Features">
          <div className="cs-section-inner">
            <h2 className="cs-section-title">Why developers choose CodeSync</h2>
            <p className="cs-section-sub">
              Everything you need for real-time collaborative coding, built on
              proven open-source technology.
            </p>

            <div className="cs-feature-grid">
              {FEATURES.map(([icon, title, desc]) => (
                <article className="cs-feature-card" key={title}>
                  <span className="cs-feature-icon" aria-hidden="true">
                    {icon}
                  </span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className="cs-tech" aria-label="Tech stack">
          <div className="cs-section-inner">
            <h2 className="cs-section-title">Built with modern technology</h2>
            <div className="cs-tech-row" role="list">
              {TECH_STACK.map(([icon, label]) => (
                <span className="cs-tech-badge" key={label} role="listitem">
                  <span aria-hidden="true">{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Recent Rooms ── */}
        {recentRooms.length > 0 && (
          <section className="cs-recent" aria-label="Recent rooms">
            <div className="cs-section-inner">
              <h2 className="cs-section-title">Your Recent Rooms</h2>
              <div className="cs-recent-list">
                {recentRooms.map((room) => (
                  <div className="cs-recent-card" key={room.roomId}>
                    <div className="cs-recent-info">
                      <strong>{room.roomId}</strong>
                      <small>{room.joinedAt}</small>
                    </div>
                    <div className="cs-recent-actions">
                      <button
                        className="cs-btn-ghost"
                        onClick={() => openRoom(room.roomId)}
                      >
                        Open
                      </button>
                      <button
                        className="cs-btn-ghost"
                        onClick={() =>
                          copyText(room.roomId, "Room ID copied")
                        }
                      >
                        Copy
                      </button>
                      <button
                        className="cs-btn-danger"
                        onClick={() => deleteRoom(room.roomId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="cs-footer">
        <p>
          © 2025 CodeSync&nbsp;·&nbsp;Built with React &amp; Socket.IO&nbsp;·&nbsp;
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            ⭐ GitHub
          </a>
        </p>
      </footer>

      {/* ── Auth Modal ── */}
      {authOpen && (
        <div
          className="cs-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={authMode === "login" ? "Login" : "Create Account"}
          onClick={(e) => {
            if (e.target === e.currentTarget) setAuthOpen(false);
          }}
        >
          <div className="cs-modal-card">
            <button
              className="cs-modal-close"
              onClick={() => setAuthOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="cs-modal-title">
              {authMode === "login" ? "Login" : "Create Account"}
            </h2>

            <form onSubmit={submitAuth} noValidate>
              {authMode === "signup" && (
                <div className="cs-field">
                  <label htmlFor="cs-auth-username">Username</label>
                  <input
                    id="cs-auth-username"
                    type="text"
                    placeholder="Your username"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              )}

              <div className="cs-field">
                <label htmlFor="cs-auth-email">Email</label>
                <input
                  id="cs-auth-email"
                  type="email"
                  placeholder="you@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="cs-field">
                <label htmlFor="cs-auth-password">Password</label>
                <input
                  id="cs-auth-password"
                  type="password"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  autoComplete={
                    authMode === "login" ? "current-password" : "new-password"
                  }
                />
              </div>

              <button
                type="submit"
                className="cs-btn-primary cs-btn-block"
                disabled={authLoading}
              >
                {authLoading
                  ? "Please wait…"
                  : authMode === "login"
                  ? "Login"
                  : "Create Account"}
              </button>
            </form>

            <p className="cs-modal-toggle">
              {authMode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthPassword("");
                    }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setAuthPassword("");
                    }}
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
