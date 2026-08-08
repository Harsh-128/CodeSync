import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { login, signup } from "../services/auth";
import toast from "react-hot-toast";
import "./Home.css";

const DEMO_ROOMS = [
  { language: "javascript", live: "4 live", title: "React 19 Concurrent Sprint", id: "room-react-vibe" },
  { language: "python", live: "7 live", title: "LLM Agent RAG Pipeline", id: "room-python-ai" },
  { language: "rust", private: true, title: "Distributed Raft Engine", id: "room-rust-core" },
  { language: "go", live: "5 live", title: "High-Throughput Gateway", id: "room-go-micro" },
];

const FEATURES = [
  ["⚡", "Sub-15ms CRDT Synchronization", "Lightning-fast conflict-free replicated data types keep every teammate synchronized while multiple developers edit simultaneously."],
  ["▣", "Isolated Execution Sandbox", "Run Node.js, Python, Rust, and Go code securely in isolated execution environments with real-time output."],
  ["◈", "Enterprise MongoDB & JWT Auth", "Secure room storage, authentication, role-based access and a clean foundation for GitHub or Google sign-in."],
  ["◉", "Built-in Spatial Audio & Chat", "Talk through blockers and discuss code without leaving your collaborative workspace."],
  ["▱", "Multi-Cursor & Presence Indicator", "See who is online, where teammates are working and when someone is actively typing."],
  ["◴", "Infinite Time-Travel History", "Keep important room states and make it easy to revisit previous collaborative work."],
];

const FAQS = [
  ["How does real-time collaboration work without merge conflicts?", "CodeSync keeps collaborators inside the same room and synchronizes edits through the real-time collaboration layer so everyone can work together without repeatedly sending files."],
  ["Can I run code directly inside the browser editor?", "Yes. The workspace is designed around writing and executing code together. The visible sandbox panel provides an interactive preview while your real execution backend handles actual programs."],
  ["Is my code stored securely in MongoDB?", "Your existing CodeSync backend is responsible for persistence and authentication. The landing page does not expose private room data; it only presents the workspace and navigation."],
  ["How do I invite teammates to my coding session?", "Create a room, copy the Room ID or share the room URL, then send it to your teammates. They can join from the home page or directly through the room route."],
];

const TESTIMONIALS = [
  ["“CodeSync replaced our messy screen-sharing workflow for college projects. Everyone can join the same room and start coding immediately.”", "Aarav Sharma", "VIT Student Developer"],
  ["“During our hackathon, CodeSync made it much easier to share code, debug together and keep the whole team on the same page.”", "Ananya Singh", "Hackathon Developer"],
  ["“Live collaborator presence makes remote debugging feel much closer to sitting together in the same lab.”", "Rohan Mehta", "MERN Stack Developer"],
];

const CODE = {
  javascript: `// CodeSync real-time collaboration
import { io } from "socket.io-client";

const socket = io(BACKEND_URL);
socket.emit("join-room", "room-react-vibe");

socket.on("code-update", (code) => {
  editor.setValue(code);
});`,
  python: `# MongoDB & FastAPI real-time state
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI, WebSocket

app = FastAPI(title="CodeSync Engine")
client = AsyncIOMotorClient(MONGO_URL)
db = client.codesync`,
  rust: `// Distributed collaboration service
use tokio::sync::broadcast;

let (tx, _rx) = broadcast::channel(100);
tx.send("code-update").unwrap();

println!("CodeSync room ready!");`,
  go: `// High-throughput WebSocket gateway
package main

import "fmt"

func main() {
    fmt.Println("CodeSync gateway ready")
}`,
};

function Home({ invitedRoomId }) {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [recentRooms, setRecentRooms] = useState([]);
  const [activeLang, setActiveLang] = useState("javascript");
  const [output, setOutput] = useState("[stdout] CodeSync Sandbox ready. Click Run Code to execute.");
  const [isRunning, setIsRunning] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [newsletter, setNewsletter] = useState("");
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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput(`Running ${activeLang.toUpperCase()} in CodeSync sandbox...\nInitializing execution context...`);

    window.setTimeout(() => {
      setIsRunning(false);
      setOutput(
        activeLang === "python"
          ? "[stdout] FastAPI app starting on port 8001...\n[stdout] Motor connected to MongoDB cluster (codesync)...\n[success] WebSocket ConnectionManager initialized.\n[metrics] Ready for incoming developer connections."
          : `[stdout] Connected to CodeSync room 'room-react-vibe'\n[stdout] ${activeLang.toUpperCase()} execution context ready.\n[success] Program executed successfully.`
      );
    }, 900);
  };

  const changeLanguage = (lang) => {
    setActiveLang(lang);
    setOutput(`[stdout] Switched execution context to ${lang.toUpperCase()}. Ready.`);
  };

  const shareRoom = async () => {
    const url = `${window.location.origin}/room/${invitedRoomId || "codesync-demo"}`;
    await copyText(url, "Room link copied");
    setShareOpen(false);
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

    // Save authentication
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    setUser(res.user);

    toast.success(res.message || "Login successful!");

    // Clear login form
    setAuthOpen(false);
    setAuthEmail("");
    setAuthPassword("");
    setAuthUsername("");

    // If user came through a shared room link,
    // send them directly into that room.
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

    toast.success(
        res.message || "Account created successfully!"
    );

    // Switch to login after account creation.
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

  const continueWithGithub = () => {
    toast.success("GitHub sign-in is ready to connect");
  };

  const subscribe = () => {
    if (!newsletter.trim()) {
      toast.error("Enter your email first");
      return;
    }
    toast.success("Thanks! You're subscribed.");
    setNewsletter("");
  };

  return (
    <div className="codesync-home">
      <div className="page-glow page-glow-one" />
      <div className="page-glow page-glow-two" />

      {/* Announcement */}
      <div className="announcement">
        <span className="announcement-star">✦</span>
        <span>CodeSync v2.5 released with sub-10ms CRDT sync & AI Copilot!</span>
        <button onClick={() => scrollTo("playground")}>Try Live Demo <span>→</span></button>
      </div>

      {/* Navbar */}
      <header className="site-header">
        <div className="nav-shell">
          <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="brand-icon">&lt;/&gt;</span>
            <span className="brand-name">Code<span>Sync</span></span>
            <span className="brand-pill">Socket.IO + React</span>
          </button>

          <nav className="desktop-nav">
            <button onClick={() => scrollTo("features")}>Features</button>
            <button onClick={() => scrollTo("playground")}>Live Sandbox</button>
            <button onClick={() => scrollTo("rooms")}>Active Rooms</button>
            <button onClick={() => scrollTo("pricing")}>Pricing</button>
            <button onClick={() => scrollTo("faq")}>FAQ</button>
          </nav>

          <div className="nav-actions">
            {user ? (
              <div className="nav-user">
                <button
                  className="nav-user-profile"
                  type="button"
                  onClick={() => navigate("/profile")}
                  title="Open profile"
                >
                  <span className="nav-user-avatar">
                    {(user.username || user.name || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                  <span className="nav-user-name">
                    {user.username || user.name || user.email}
                  </span>
                </button>

                <button
                  className="nav-logout"
                  type="button"
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
                <button className="nav-signin" onClick={() => openAuth("login")}>
                  Login
                </button>
                <button className="nav-cta" onClick={() => openAuth("signup")}>
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-section">

          {invitedRoomId && (
            <div className="room-invite-card">
              <div className="room-invite-icon">👥</div>

              <div className="room-invite-content">
                <span className="room-invite-label">
                  ROOM INVITATION
                </span>

                <h3>You've been invited to collaborate</h3>

                <p>
                  Join room <strong>#{invitedRoomId}</strong> and start
                  coding together in real time.
                </p>

                <div className="room-invite-actions">
                  <button
                    type="button"
                    className="invite-login-btn"
                    onClick={() => openAuth("login")}
                  >
                    Login to Join
                  </button>

                  <button
                    type="button"
                    className="invite-signup-btn"
                    onClick={() => openAuth("signup")}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="hero-badge">
            <span>♨</span>
            Real-time multiplayer coding powered by Node.js, Express & WebSockets
          </div>

          <h1>Code Together, at the Speed of <span>Thought.</span></h1>

          <p className="hero-copy">
            The ultimate real-time collaborative code editor with sub-15ms CRDT
            synchronization, isolated multi-language container execution, and built-in
            spatial voice.
          </p>

          <div className="join-box">
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              placeholder="Enter room name or ID (e.g. #alpha-sprint)"
              aria-label="Room name or ID"
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>

          <div className="hero-proof">
            <span><b className="online-dot" /> 4,821 active developers online</span>
            <span>✓ No installation required</span>
            <span>✓ Free forever tier available</span>
          </div>
        </section>

        {/* Live playground */}
        <section id="playground" className="playground-section section-anchor">
          <div className="workspace-window">
            <div className="workspace-toolbar">
              <div className="window-left">
                <span className="traffic red" />
                <span className="traffic yellow" />
                <span className="traffic green" />
                <span className="toolbar-divider" />
                <span className="room-url">◉ &nbsp;codesync.live/room/alpha-sprint</span>
              </div>

              <div className="language-tabs">
                {Object.keys(CODE).map((lang) => (
                  <button
                    key={lang}
                    className={activeLang === lang ? "active" : ""}
                    onClick={() => changeLanguage(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="workspace-actions">
                <div className="avatars">
                  {[
                    ["Aarav", "https://i.pravatar.cc/100?img=12"],
                    ["Priya", "https://i.pravatar.cc/100?img=47"],
                    ["Rohan", "https://i.pravatar.cc/100?img=33"],
                    ["Kavya", "https://i.pravatar.cc/100?img=44"],
                  ].map(([name, photo]) => (
                    <img
                      key={name}
                      className="avatar"
                      src={photo}
                      alt={`${name} collaborator`}
                    />
                  ))}
                </div>
                <button className="outline-btn" onClick={() => setShareOpen(true)}>⌯ Share</button>
                <button className="run-btn" onClick={runCode}>{isRunning ? "Running..." : "▶ Run Code"}</button>
              </div>
            </div>

            <div className="workspace-body">
              <div className="code-panel">
                <div className="typing-pill"><i /> Aarav Sharma is typing at line 12...</div>
                <div className="code-topline">
                  <span className="code-room-icon">◎</span>
                  <span>codesync.live/room/alpha-sprint</span>
                </div>
                <pre className="editor-code">{CODE[activeLang]}</pre>
              </div>

              <aside className="workspace-sidebar">
                <div>
                  <div className="sidebar-title">
                    <span>COLLABORATORS (4)</span>
                    <i />
                  </div>

                  <div className="collaborator-list">
                    {[
                      ["Aarav Sharma", "Line 3, col 12", "blue"],
                      ["Priya Singh", "Line 11, col 25", "green"],
                      ["Rohan Mehta", "Line 9, col 8", "orange"],
                      ["Kavya Nair", "Line 15, col 4", "purple"],
                    ].map(([name, line, color]) => (
                      <button key={name} className="collaborator" onClick={() => toast.success(`${name} is online`)}>
                        <img
                          className={`mini-avatar ${color}`}
                          src={
                            name === "Aarav Sharma"
                              ? "https://i.pravatar.cc/100?img=12"
                              : name === "Priya Singh"
                                ? "https://i.pravatar.cc/100?img=47"
                                : name === "Rohan Mehta"
                                  ? "https://i.pravatar.cc/100?img=33"
                                  : "https://i.pravatar.cc/100?img=44"
                          }
                          alt={name}
                        />
                        <span>
                          <strong>{name}</strong>
                          <small>{line}</small>
                        </span>
                        <i className={`presence ${color}`} />
                      </button>
                    ))}
                  </div>

                  <div className="sandbox-title">›_ SANDBOX OUTPUT</div>
                  <pre className="sandbox-output">{output}</pre>
                </div>

                <button className={`voice-row ${voiceActive ? "connected" : ""}`} onClick={() => setVoiceActive(!voiceActive)}>
                  <span>♩ &nbsp; Spatial Voice</span>
                  <b>{voiceActive ? "Connected" : "Connect"}</b>
                </button>
              </aside>
            </div>
          </div>
        </section>

        {/* Active rooms */}
        <section id="rooms" className="rooms-section section-anchor">
          <div className="section-intro rooms-intro">
            <div>
              <span className="section-tag">Live Public Rooms</span>
              <h2>Jump Into Active Coding Sessions</h2>
            </div>
            <p>Connect with developers across India and worldwide right now. Pick a room or spin up your own secure Node.js workspace in 1 click.</p>
          </div>

          <div className="room-grid">
            {DEMO_ROOMS.map((room) => (
              <article className="room-card" key={room.id}>
                <div className="room-card-top">
                  <span className="language-badge">{room.language}</span>
                  {room.private ? <span className="private-badge">⌑ Private</span> : <span className="live-badge">♧ {room.live}</span>}
                </div>
                <h3>{room.title}</h3>
                <p>Room ID: <code>{room.id}</code></p>
                <button onClick={() => openRoom(room.id)}>Join Session <span>→</span></button>
              </article>
            ))}
          </div>

          {recentRooms.length > 0 && (
            <div className="recent-rooms">
              <div className="recent-heading">
                <span className="section-tag">Your Rooms</span>
                <h3>Recently opened</h3>
              </div>
              <div className="recent-grid">
                {recentRooms.map((room) => (
                  <div className="recent-card" key={room.roomId}>
                    <div>
                      <strong>{room.roomId}</strong>
                      <small>{room.joinedAt}</small>
                    </div>
                    <div>
                      <button onClick={() => openRoom(room.roomId)}>Open</button>
                      <button onClick={() => copyText(room.roomId, "Room ID copied")}>Copy</button>
                      <button className="danger" onClick={() => deleteRoom(room.roomId)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Features */}
        <section id="features" className="features-section section-anchor">
          <div className="center-heading">
            <span className="section-tag cyan">Engineered for Velocity</span>
            <h2>Everything your engineering team<br />needs to build at lightning speed</h2>
            <p>Built from the ground up with React, Node.js, Express, Socket.IO, and MongoDB for flawless real-time performance.</p>
          </div>

          <div className="feature-grid">
            {FEATURES.map(([icon, title, text]) => (
              <button className="feature-card" key={title} onClick={() => { toast.success(`${title} is available inside your CodeSync room`); scrollTo("playground"); }}>
                <span className="feature-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="center-heading compact">
            <span className="section-tag purple">Trusted by Indian Developers</span>
            <h2>Loved by developers building<br />the next generation of products</h2>
          </div>

          <div className="testimonial-grid">
            {TESTIMONIALS.map(([quote, name, role]) => (
              <article className="testimonial-card" key={name}>
                <p>{quote}</p>
                <div className="person">
                  <span className="person-avatar">{name.split(" ").map((x) => x[0]).join("")}</span>
                  <span><strong>{name}</strong><small>{role}</small></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="pricing-section section-anchor">
          <div className="center-heading">
            <span className="section-tag green">Simple, Transparent Pricing</span>
            <h2>Invest in your engineering<br />productivity</h2>
            <p>Start free with your team, upgrade as your infrastructure grows.</p>
          </div>

          <div className="pricing-grid">
            <article className="price-card">
              <h3>Student</h3>
              <p>Perfect for college projects, pair programming, DSA practice and hackathons.</p>
              <div className="price">₹0 <small>/forever</small></div>
              {["Up to 5 collaborators per room", "Unlimited public rooms", "Basic Node.js & Python sandbox", "Community Socket.IO servers", "Standard syntax themes"].map((x) => <div className="check-row" key={x}>✓ <span>{x}</span></div>)}
              <button onClick={() => openAuth("signup")}>Start Coding Free</button>
            </article>

            <article className="price-card popular">
              <div className="popular-ribbon">MOST POPULAR FOR<br />TEAMS</div>
              <h3>Pro Developer</h3>
              <p>Supercharge professional engineering teams and remote pair programming.</p>
              <div className="price">₹199 <small>/per month</small></div>
              {["Unlimited collaborators per room", "Private password-protected rooms", "Multi-language sandbox", "Built-in Spatial Voice & Chat", "MongoDB persistent room snapshots", "Priority relay nodes"].map((x) => <div className="check-row" key={x}>✓ <span>{x}</span></div>)}
              <button onClick={() => openAuth("signup")}>Start 14-Day Free Trial</button>
            </article>

            <article className="price-card">
              <h3>Enterprise</h3>
              <p>For security-conscious organizations requiring custom infrastructure and audit controls.</p>
              <div className="price">₹799 <small>/per user / month</small></div>
              {["Self-hosted or dedicated cloud cluster", "SAML / SSO & Advanced RBAC", "SOC2 Type II & HIPAA Compliance", "Dedicated WebSocket relay channels", "Custom Docker execution runtimes", "Dedicated engineering support"].map((x) => <div className="check-row" key={x}>✓ <span>{x}</span></div>)}
              <button onClick={() => toast.success("Enterprise enquiry flow ready to connect")}>Contact Enterprise Sales</button>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq-section section-anchor">
          <div className="center-heading compact">
            <span className="section-tag cyan">Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {FAQS.map(([question, answer], index) => (
              <button className={`faq-item ${openFaq === index ? "open" : ""}`} key={question} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <span>
                  <strong>{question}</strong>
                  {openFaq === index && <small>{answer}</small>}
                </span>
                <b>{openFaq === index ? "⌃" : "⌄"}</b>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <button className="brand footer-brand-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <span className="brand-icon">&lt;/&gt;</span>
              <span className="brand-name">Code<span>Sync</span></span>
            </button>
            <p>Real-time collaborative code editor built for modern engineering teams with React, Node.js, Express, Socket.IO and MongoDB.</p>
            <div className="socials">
              <button onClick={() => toast.success("GitHub link can be connected here")}>◉</button>
              <button onClick={() => toast.success("Community link can be connected here")}>◎</button>
            </div>
          </div>

          <div>
            <h4>PRODUCT</h4>
            <button onClick={() => scrollTo("playground")}>Live Sandbox</button>
            <button onClick={() => scrollTo("rooms")}>Active Rooms</button>
            <button onClick={() => scrollTo("features")}>CRDT Sync Engine</button>
            <button onClick={() => scrollTo("pricing")}>Enterprise Pricing</button>
          </div>

          <div>
            <h4>RESOURCES</h4>
            <button onClick={() => scrollTo("faq")}>Documentation</button>
            <button onClick={() => scrollTo("faq")}>Socket.IO Architecture</button>
            <button onClick={() => scrollTo("faq")}>MongoDB Schema Guide</button>
            <button onClick={() => toast.success("API status: operational")}>API Status</button>
          </div>

          <div>
            <h4>STAY UPDATED</h4>
            <p>Subscribe for release notes & developer tutorials.</p>
            <div className="subscribe">
              <input value={newsletter} onChange={(e) => setNewsletter(e.target.value)} placeholder="developer@company.com" />
              <button onClick={subscribe}>Join</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CodeSync Inc. All rights reserved. Built with React & Socket.IO.</span>
          <div>
            <button onClick={() => toast("Privacy Policy coming soon")}>Privacy Policy</button>
            <button onClick={() => toast("Terms of Service coming soon")}>Terms of Service</button>
            <button onClick={() => toast("Security information coming soon")}>Security</button>
          </div>
        </div>
      </footer>

      {authOpen && (
        <div className="modal-backdrop auth-backdrop" onClick={() => setAuthOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-close" aria-label="Close" onClick={() => setAuthOpen(false)}>×</button>

            <div className="auth-heading">
              <h2>{authMode === "login" ? "Welcome Back to SynapseCode" : "Create Your SynapseCode Account"}</h2>
              <p>
                {authMode === "login"
                  ? "Login to continue to your rooms, projects and saved coding sessions."
                  : "Sign up for free to create private rooms, collaborate and save your sessions."}
              </p>
            </div>

            <button className="github-button" type="button" onClick={continueWithGithub}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.85 10.91.57.1.78-.25.78-.55v-2.13c-3.19.69-3.86-1.35-3.86-1.35-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.35.78 1.04.78 2.1v3.11c0 .3.21.66.79.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <div className="auth-divider"><span></span><em>or email</em><span></span></div>

            <form onSubmit={submitAuth}>
              {authMode === "signup" && (
                <>
                  <label className="auth-label" htmlFor="auth-username">Username</label>
                  <input
                    id="auth-username"
                    className="auth-input"
                    type="text"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="your username"
                    autoComplete="username"
                  />
                </>
              )}

              <label className="auth-label" htmlFor="auth-email">Developer Email</label>
              <input
                id="auth-email"
                className="auth-input"
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="alex@company.com"
                autoComplete="email"
              />

              <label className="auth-label" htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                className="auth-input"
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
              />

              <button className="auth-submit" type="submit" disabled={authLoading}>
                {authLoading ? "Please wait..." : authMode === "login" ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="auth-switch">
              {authMode === "login" ? "New to CodeSync?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              >
                {authMode === "login" ? "Sign Up" : "Login"}
              </button>
            </div>
          </div>
        </div>
      )}

      {shareOpen && (
        <div className="modal-backdrop" onClick={() => setShareOpen(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShareOpen(false)}>×</button>
            <span className="modal-icon">⌯</span>
            <h2>Share CodeSync Room</h2>
            <p>Invite your teammates to join the current collaborative room.</p>
            <div className="share-input">
              <input readOnly value={`${window.location.origin}/room/${invitedRoomId || "codesync-demo"}`} />
              <button onClick={shareRoom}>Copy</button>
            </div>
            <button className="modal-primary" onClick={() => setShareOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;