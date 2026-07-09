import { useState, useEffect } from "react";

const VALID_USERNAME = import.meta.env.VITE_AUTH_USERNAME || "admin";
const VALID_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || "password123";

const BasicAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if already authenticated in session
  useEffect(() => {
    const authStatus = sessionStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        setIsAuthenticated(true);
        sessionStorage.setItem("isAuthenticated", "true");
        setError("");
      } else {
        setError("Invalid username or password");
        setPassword("");
      }
      setLoading(false);
    }, 300);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAuthenticated");
    setUsername("");
    setPassword("");
  };

  // Add logout functionality accessible via window object for development
  useEffect(() => {
    if (isAuthenticated) {
      window.logout = handleLogout;
      return () => delete window.logout;
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f5f4f0] p-4 z-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="absolute inset-0 noise pointer-events-none opacity-40" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[rgba(232,93,38,0.1)] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-[rgba(90,80,60,0.1)] bg-white p-8 shadow-[0_8px_32px_rgba(26,24,20,0.09)]">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm">B</div>
          <span className="font-display text-lg font-bold text-[#1a1814]">Blog<span className="gradient-text">Byte</span></span>
        </div>

        <h1 className="font-display text-2xl font-bold text-[#1a1814] text-center mb-1.5">Preview access</h1>
        <p className="text-sm text-[#6b6358] text-center mb-6">
          BlogByte is still under active development. Sign in with the demo credentials below to look around.
        </p>

        <div className="mb-6 rounded-2xl border border-[rgba(232,93,38,0.2)] bg-[#fdf0ea] p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e85d26] mb-2">Demo credentials</p>
          <p className="text-sm text-[#1a1814]">
            Username: <span className="font-mono font-semibold">{VALID_USERNAME}</span>
          </p>
          <p className="text-sm text-[#1a1814]">
            Password: <span className="font-mono font-semibold">{VALID_PASSWORD}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <span className="text-red-500 text-sm">⚠️</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-[#1a1814] mb-1.5">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter username"
              autoFocus
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#1a1814] mb-1.5">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Enter preview →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BasicAuth;
