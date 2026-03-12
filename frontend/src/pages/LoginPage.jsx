import { useState } from "react";

const floatingOrbs = [
  { size: 300, x: 10, y: 15, color: "#a78bfa", delay: 0 },
  { size: 200, x: 70, y: 60, color: "#38bdf8", delay: 2 },
  { size: 250, x: 40, y: 80, color: "#34d399", delay: 4 },
  { size: 180, x: 85, y: 20, color: "#f472b6", delay: 1 },
];

const getStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }

  .login-root {
    min-height: 100vh;
    background: ${dark ? "#060612" : "#f0f4ff"};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.5s ease;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: ${dark ? "0.18" : "0.22"};
    animation: floatOrb 12s ease-in-out infinite;
    pointer-events: none;
    transition: opacity 0.5s ease;
  }

  @keyframes floatOrb {
    0%, 100% { transform: translateY(0px) scale(1); }
    33% { transform: translateY(-30px) scale(1.05); }
    66% { transform: translateY(20px) scale(0.97); }
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(${dark ? "rgba(167,139,250,0.04)" : "rgba(99,102,241,0.06)"} 1px, transparent 1px),
      linear-gradient(90deg, ${dark ? "rgba(167,139,250,0.04)" : "rgba(99,102,241,0.06)"} 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 2px;
    background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"};
    border-radius: 50px;
    padding: 5px;
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px ${dark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)"};
    transition: all 0.4s ease;
  }

  .theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 40px;
    border: none;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    white-space: nowrap;
  }

  .theme-btn-dark {
    background: ${dark ? "linear-gradient(135deg,#1e1b4b,#312e81)" : "transparent"};
    color: ${dark ? "#c4b5fd" : "rgba(0,0,0,0.3)"};
    box-shadow: ${dark ? "0 2px 12px rgba(99,102,241,0.3)" : "none"};
  }

  .theme-btn-light {
    background: ${!dark ? "linear-gradient(135deg,#fef9c3,#fde68a)" : "transparent"};
    color: ${!dark ? "#92400e" : "rgba(255,255,255,0.3)"};
    box-shadow: ${!dark ? "0 2px 12px rgba(251,191,36,0.3)" : "none"};
  }

  .theme-btn:hover { transform: scale(1.04); }

  .card-wrapper {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 460px;
    padding: 16px;
    animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.78)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"};
    border-radius: 24px;
    padding: 40px 36px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: ${dark
      ? "0 0 0 1px rgba(255,255,255,0.05), 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)"
      : "0 0 0 1px rgba(255,255,255,0.9), 0 32px 80px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.9)"};
    transition: all 0.4s ease;
  }

  .tab-bar {
    display: flex;
    background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
    border-radius: 14px;
    padding: 5px;
    gap: 4px;
    margin-bottom: 36px;
    border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
    transition: all 0.4s ease;
  }

  .tab-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: ${dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"};
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .tab-btn.active-user {
    background: linear-gradient(135deg, #a78bfa, #38bdf8);
    color: #fff;
    box-shadow: 0 4px 20px rgba(167,139,250,0.35);
  }
  .tab-btn.active-admin {
    background: linear-gradient(135deg, #f472b6, #fb923c);
    color: #fff;
    box-shadow: 0 4px 20px rgba(244,114,182,0.35);
  }
  .tab-btn:not(.active-user):not(.active-admin):hover {
    color: ${dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"};
    background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"};
  }

  .header {
    text-align: center;
    margin-bottom: 32px;
    animation: fadeUp 0.5s ease forwards;
    animation-delay: 0.15s;
    opacity: 0;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .icon-wrap {
    width: 60px; height: 60px; border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; font-size: 28px;
  }
  .icon-wrap-user {
    background: linear-gradient(135deg, rgba(167,139,250,0.2), rgba(56,189,248,0.2));
    border: 1px solid rgba(167,139,250,0.3);
    box-shadow: 0 0 30px rgba(167,139,250,0.15);
  }
  .icon-wrap-admin {
    background: linear-gradient(135deg, rgba(244,114,182,0.2), rgba(251,146,60,0.2));
    border: 1px solid rgba(244,114,182,0.3);
    box-shadow: 0 0 30px rgba(244,114,182,0.15);
  }

  .login-title {
    font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800;
    color: ${dark ? "#fff" : "#1e1b4b"}; letter-spacing: -0.5px; margin-bottom: 6px;
    transition: color 0.4s;
  }
  .login-subtitle {
    font-size: 14px; font-weight: 300;
    color: ${dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)"};
    transition: color 0.4s;
  }

  .form-group { margin-bottom: 18px; animation: fadeUp 0.5s ease forwards; opacity: 0; }
  .form-group:nth-child(1) { animation-delay: 0.25s; }
  .form-group:nth-child(2) { animation-delay: 0.35s; }
  .form-group:nth-child(3) { animation-delay: 0.42s; }

  .form-label {
    display: block; font-size: 12px; font-weight: 500; letter-spacing: 0.8px;
    text-transform: uppercase; margin-bottom: 8px;
    color: ${dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"};
    transition: color 0.4s;
  }

  .input-wrap { position: relative; }

  .input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%); font-size: 16px; opacity: 0.45; pointer-events: none;
  }

  .form-input {
    width: 100%; padding: 13px 14px 13px 42px;
    background: ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    border-radius: 12px;
    color: ${dark ? "#fff" : "#1e1b4b"};
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; transition: all 0.25s ease;
  }
  .form-input::placeholder { color: ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)"}; }
  .form-input:focus {
    background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(167,139,250,0.06)"};
    border-color: rgba(167,139,250,0.5);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.1);
  }
  .form-input.admin-focus:focus {
    border-color: rgba(244,114,182,0.5);
    box-shadow: 0 0 0 3px rgba(244,114,182,0.1);
  }

  .extras-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 26px;
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.45s; opacity: 0;
  }
  .remember-label {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    font-size: 13px; user-select: none;
    color: ${dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"};
    transition: color 0.4s;
  }
  .remember-check { width: 16px; height: 16px; accent-color: #a78bfa; cursor: pointer; }

  .forgot-link { font-size: 13px; color: rgba(167,139,250,0.85); text-decoration: none; cursor: pointer; transition: color 0.2s; }
  .forgot-link:hover { color: #a78bfa; }
  .forgot-link-admin { color: rgba(244,114,182,0.85); }
  .forgot-link-admin:hover { color: #f472b6; }

  .submit-btn {
    width: 100%; padding: 14px; border: none; border-radius: 12px;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 0.5px; cursor: pointer; position: relative; overflow: hidden;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.5s; opacity: 0;
  }
  .submit-btn-user {
    background: linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%);
    color: #fff; box-shadow: 0 6px 30px rgba(167,139,250,0.4);
  }
  .submit-btn-user:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(167,139,250,0.5); }
  .submit-btn-admin {
    background: linear-gradient(135deg, #f472b6 0%, #fb923c 100%);
    color: #fff; box-shadow: 0 6px 30px rgba(244,114,182,0.4);
  }
  .submit-btn-admin:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(244,114,182,0.5); }
  .submit-btn:active { transform: translateY(0); }

  .btn-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
    transform: translateX(-100%); transition: transform 0.5s ease;
  }
  .submit-btn:hover .btn-shimmer { transform: translateX(100%); }

  .divider {
    display: flex; align-items: center; gap: 12px; margin: 24px 0;
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.55s; opacity: 0;
  }
  .divider-line { flex: 1; height: 1px; background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}; transition: background 0.4s; }
  .divider-text { font-size: 12px; white-space: nowrap; color: ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)"}; transition: color 0.4s; }

  .social-row {
    display: flex; gap: 10px;
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.6s; opacity: 0;
  }
  .social-btn {
    flex: 1; padding: 11px;
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"};
    border-radius: 10px;
    color: ${dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)"};
    font-size: 13px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.25s ease; font-family: 'DM Sans', sans-serif;
  }
  .social-btn:hover {
    background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
    color: ${dark ? "#fff" : "#1e1b4b"};
    transform: translateY(-1px);
  }

  .secure-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px;
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
    border-radius: 20px; font-size: 11px; letter-spacing: 0.5px; margin-bottom: 28px;
    color: ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)"};
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.1s; opacity: 0;
    transition: all 0.4s;
  }
  .dot-green { width: 6px; height: 6px; background: #34d399; border-radius: 50%; box-shadow: 0 0 6px #34d399; animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .strength-wrap { margin-top: 8px; display: flex; gap: 4px; }
  .strength-seg { height: 3px; flex: 1; border-radius: 4px; background: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}; transition: background 0.3s; }

  .success-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: ${dark ? "rgba(6,6,18,0.95)" : "rgba(240,244,255,0.95)"};
    border-radius: 24px; z-index: 20;
    animation: cardIn 0.4s ease forwards;
  }
  .success-icon { font-size: 56px; margin-bottom: 16px; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .success-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: ${dark ? "#fff" : "#1e1b4b"}; margin-bottom: 8px; }
  .success-sub { font-size: 14px; color: ${dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)"}; }

  .card-footer {
    text-align: center; margin-top: 28px; font-size: 13px;
    color: ${dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)"};
    animation: fadeUp 0.5s ease forwards; animation-delay: 0.65s; opacity: 0;
    transition: color 0.4s;
  }
  .footer-link { color: rgba(167,139,250,0.85); cursor: pointer; text-decoration: none; font-weight: 500; transition: color 0.2s; }
  .footer-link:hover { color: #a78bfa; }
  .footer-link-admin { color: rgba(244,114,182,0.85); }
  .footer-link-admin:hover { color: #f472b6; }
`;

function StrengthBar({ password }) {
  const score = password.length === 0 ? 0
    : password.length < 4 ? 1
    : password.length < 8 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const colors = ["", "#ef4444", "#fb923c", "#facc15", "#34d399"];
  return (
    <div className="strength-wrap">
      {[1,2,3,4].map(i => (
        <div key={i} className="strength-seg" style={{ background: i <= score ? colors[score] : undefined }} />
      ))}
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const [dark, setDark] = useState(true);
  const [mode, setMode] = useState("user");
  const [form, setForm] = useState({ email: "", password: "", adminId: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [remember, setRemember] = useState(false);

  const isAdmin = mode === "admin";

  const handleSwitch = (m) => {
    setMode(m); setSuccess(false);
    setForm({ email: "", password: "", adminId: "" });
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { 
      setLoading(false); 
      setSuccess(true);
      if (onLogin) {
        setTimeout(() => onLogin(isAdmin), 800);
      }
    }, 1500);
  };

  return (
    <>
      <style>{getStyles(dark)}</style>
      <div className="login-root">

        {/* ── Theme Toggle Button ── */}
        <div className="theme-toggle">
          <button className="theme-btn theme-btn-dark" onClick={() => setDark(true)}>
            🌙 Dark
          </button>
          <button className="theme-btn theme-btn-light" onClick={() => setDark(false)}>
            ☀️ Light
          </button>
        </div>

        {floatingOrbs.map((orb, i) => (
          <div key={i} className="orb" style={{
            width: orb.size, height: orb.size,
            left: `${orb.x}%`, top: `${orb.y}%`,
            background: orb.color,
            animationDelay: `${orb.delay}s`,
          }} />
        ))}
        <div className="grid-overlay" />

        <div className="card-wrapper">
          <div className="card" style={{ position: "relative" }}>

            {success && (
              <div className="success-overlay">
                <div className="success-title">{isAdmin ? "Admin Access Granted" : "Welcome Back!"}</div>
                <div className="success-sub">{isAdmin ? "Redirecting to dashboard..." : "Logging you in..."}</div>
              </div>
            )}

            <div className="tab-bar">
              <button className={`tab-btn ${mode === "user" ? "active-user" : ""}`} onClick={() => handleSwitch("user")}>
                User
              </button>
              <button className={`tab-btn ${mode === "admin" ? "active-admin" : ""}`} onClick={() => handleSwitch("admin")}>
                Admin
              </button>
            </div>

        
            <div className="header" key={mode}>
              <div className={`icon-wrap ${isAdmin ? "icon-wrap-admin" : "icon-wrap-user"}`}>
                {isAdmin ? "🛡️" : "👤"}
              </div>
              <div className="login-title">{isAdmin ? "Admin Portal" : "Welcome Back"}</div>
              <div className="login-subtitle">
                {isAdmin ? "Restricted access — authorised personnel only" : "Sign in to continue your journey"}
              </div>
            </div>

            <div key={mode + "form"}>
              {isAdmin && (
                <div className="form-group">
                  <label className="form-label">Admin ID</label>
                  <div className="input-wrap">
                    <input className="form-input admin-focus" placeholder="ADM-XXXXXXXX"
                      value={form.adminId} onChange={e => setForm({ ...form, adminId: e.target.value })} />
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrap">
                  <input className={`form-input ${isAdmin ? "admin-focus" : ""}`} type="email"
                    placeholder={isAdmin ? "admin@company.com" : "you@example.com"}
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <input className={`form-input ${isAdmin ? "admin-focus" : ""}`} type="password"
                    placeholder="Enter your password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                {isAdmin && <StrengthBar password={form.password} />}
              </div>
            </div>

            <div className="extras-row">
              <label className="remember-label">
                <input type="checkbox" className="remember-check" checked={remember} onChange={() => setRemember(!remember)} />
                Remember me
              </label>
              <span className={`forgot-link ${isAdmin ? "forgot-link-admin" : ""}`}>Forgot password?</span>
            </div>

            <button className={`submit-btn ${isAdmin ? "submit-btn-admin" : "submit-btn-user"}`}
              onClick={handleSubmit} disabled={loading}>
              <span className="btn-shimmer" />
              {loading ? "Authenticating..." : isAdmin ? "Access Admin Panel" : "Sign In →"}
            </button>

            {!isAdmin && (
              <>
                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">or continue with</span>
                  <div className="divider-line" />
                </div>
                <div className="social-row">
                  <button className="social-btn"><span>G</span> Google</button>
                  <button className="social-btn"><span>⌘</span> Apple</button>
                  <button className="social-btn"><span>in</span> LinkedIn</button>
                </div>
              </>
            )}

            <div className="card-footer">
              {isAdmin
                ? <>Need access? <span className="footer-link footer-link-admin">Request permissions →</span></>
                : <>Don't have an account? <span className="footer-link">Create one →</span></>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

