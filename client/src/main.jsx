import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Silently wake up the Render backend on app load.
// Free tier sleeps after 15 min — this ping fires immediately so the
// server is warm by the time the user tries to login (~30s cold start).
const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
fetch(`${BACKEND}/api/health`, { method: "GET" }).catch(() => {});

createRoot(document.getElementById('root')).render(
    <App />
)
