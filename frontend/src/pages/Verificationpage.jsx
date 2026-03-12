import { useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Shared theme (identical to VisitorForm)
// ─────────────────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#070d1a", surface: "#0d1628", surface2: "#111f36",
  border: "rgba(148,163,184,0.1)", accent: "#38bdf8", accent2: "#818cf8",
  success: "#34d399", text: "#e2e8f0", muted: "#64748b", error: "#f87171",
  inputBg: "#111f36", shadow: "0 0 32px rgba(56,189,248,0.13)",
  blobA: "rgba(56,189,248,0.07)", blobB: "rgba(129,140,248,0.08)",
  toggleBg: "#0d1628", toggleBorder: "rgba(56,189,248,0.35)",
};
const LIGHT = {
  bg: "#eef4ff", surface: "#ffffff", surface2: "#f4f8ff",
  border: "rgba(59,130,246,0.14)", accent: "#0284c7", accent2: "#6d28d9",
  success: "#059669", text: "#0f172a", muted: "#64748b", error: "#dc2626",
  inputBg: "#f8fbff", shadow: "0 4px 28px rgba(59,130,246,0.10)",
  blobA: "rgba(56,189,248,0.14)", blobB: "rgba(129,140,248,0.12)",
  toggleBg: "#ffffff", toggleBorder: "rgba(59,130,246,0.28)",
};

const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─────────────────────────────────────────────────────────────────────────────
// Demo visitor database — simulates MongoDB records
// In production replace with real API call: fetch(`/api/visitors/${id}`)
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_DB = {
  "VIS-DEMO01": {
    visitorId: "VIS-DEMO01", name: "Arjun Mehta", company: "TechCorp Ltd.",
    phone: "+91 98765 43210", hostEmployee: "Rajesh Kumar",
    visitDate: "2026-03-12", purpose: "Equipment Demo", dept: "electrical",
    checkIn: "09:30", checkOut: "13:00", status: "Approved",
    photo: null,
  },
  "VIS-DEMO02": {
    visitorId: "VIS-DEMO02", name: "Priya Sharma", company: "Innovate Solutions",
    phone: "+91 87654 32109", hostEmployee: "Anita Desai",
    visitDate: "2026-03-12", purpose: "Safety Audit", dept: "chemical",
    checkIn: "10:00", checkOut: "14:00", status: "Approved",
    photo: null,
  },
};

const DEPT_LABELS = {
  chemical: "⚗️ Chemical", food: "🍱 Food Processing",
  electrical: "⚡ Electrical", mechanical: "⚙️ Mechanical",
};

// ─────────────────────────────────────────────────────────────────────────────
// jsQR — lightweight QR decoder loaded from CDN via script tag
// ─────────────────────────────────────────────────────────────────────────────
function useJsQR() {
  const [ready, setReady] = useState(!!window.jsQR);
  useEffect(() => {
    if (window.jsQR) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

// ─────────────────────────────────────────────────────────────────────────────
// QR Scanner component — streams camera, decodes every 200ms
// ─────────────────────────────────────────────────────────────────────────────
function QRScanner({ onScan, active, T }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const jsQRReady = useJsQR();
  const [camError, setCamError] = useState(null);
  const [camStarted, setCamStarted] = useState(false);
  const [scanning, setScanning] = useState(false);

  const stopCam = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    cancelAnimationFrame(rafRef.current);
    setCamStarted(false);
    setScanning(false);
  }, []);

  const startCam = useCallback(async () => {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamStarted(true);
      setScanning(true);
    } catch (e) {
      setCamError("Camera access denied or unavailable.");
    }
  }, []);

  // Decode loop
  useEffect(() => {
    if (!camStarted || !jsQRReady || !scanning) return;
    const tick = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) { rafRef.current = requestAnimationFrame(tick); return; }
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      try {
        const code = window.jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
        if (code) { setScanning(false); stopCam(); onScan(code.data); return; }
      } catch {}
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [camStarted, jsQRReady, scanning, onScan, stopCam]);

  useEffect(() => { if (!active) stopCam(); }, [active, stopCam]);
  useEffect(() => () => stopCam(), [stopCam]);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Viewport */}
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "4/3", border: `2px solid ${camStarted ? T.accent : T.border}`, boxShadow: camStarted ? `0 0 28px ${T.accent}33` : "none", transition: "border 0.3s, box-shadow 0.3s" }}>
        <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: camStarted ? "block" : "none" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Idle state */}
        {!camStarted && !camError && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "linear-gradient(135deg,#0a1628,#111f36)" }}>
            <div style={{ fontSize: 52 }}>📷</div>
            <div style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Camera not started</div>
            <button onClick={startCam} style={{ background: `linear-gradient(135deg,${T.accent},${T.accent2})`, border: "none", color: "white", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Start Camera
            </button>
          </div>
        )}

        {/* Error state */}
        {camError && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "#0a1628" }}>
            <div style={{ fontSize: 36 }}>⚠️</div>
            <div style={{ fontSize: 13, color: T.error, textAlign: "center", padding: "0 16px" }}>{camError}</div>
            <button onClick={startCam} style={{ background: T.error + "22", border: `1px solid ${T.error}`, color: T.error, borderRadius: 8, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Retry</button>
          </div>
        )}

        {/* Scanning overlay */}
        {camStarted && scanning && (
          <>
            {/* Corner brackets */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ position: "relative", width: "55%", height: "55%" }}>
                {[["top:0,left:0","borderTop,borderLeft"], ["top:0,right:0","borderTop,borderRight"], ["bottom:0,left:0","borderBottom,borderLeft"], ["bottom:0,right:0","borderBottom,borderRight"]].map(([pos, borders], i) => {
                  const [v, h] = pos.split(",");
                  const [vp, vv] = v.split(":");
                  const [hp, hv] = h.split(":");
                  const bs = Object.fromEntries(borders.split(",").map(b => [b, `3px solid ${T.accent}`]));
                  return <div key={i} style={{ position: "absolute", width: 24, height: 24, [vp]: vv, [hp]: hv, ...bs }} />;
                })}
                {/* Scan line */}
                <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${T.accent},transparent)`, animation: "scanLine 2s linear infinite", top: 0 }} />
              </div>
            </div>
            {/* Status badge */}
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "5px 14px", display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent, display: "inline-block", animation: "pulse 1.2s infinite" }} />
              <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>Scanning for QR…</span>
            </div>
          </>
        )}
      </div>

      {/* Controls below scanner */}
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        {!camStarted ? (
          <button onClick={startCam} disabled={!jsQRReady} style={{ flex: 1, background: jsQRReady ? `linear-gradient(135deg,${T.accent},${T.accent2})` : T.surface2, border: "none", color: jsQRReady ? "white" : T.muted, borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, cursor: jsQRReady ? "pointer" : "default", fontFamily: "inherit", transition: "all 0.2s" }}>
            {jsQRReady ? "▶ Start Camera & Scan" : "Loading scanner…"}
          </button>
        ) : (
          <button onClick={stopCam} style={{ flex: 1, background: T.error + "18", border: `1px solid ${T.error}44`, color: T.error, borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            ⏹ Stop Camera
          </button>
        )}
      </div>

      {/* Manual input fallback */}
      <ManualEntry onScan={onScan} T={T} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Manual QR entry — for demo / testing without physical QR
// ─────────────────────────────────────────────────────────────────────────────
function ManualEntry({ onScan, T }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");

  const tryParse = () => {
    if (!val.trim()) return;
    onScan(val.trim());
    setVal(""); setOpen(false);
  };

  return (
    <div style={{ marginTop: 14 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "transparent", border: `1px dashed ${T.border}`, color: T.muted, borderRadius: 10, padding: "9px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
        {open ? "▲ Hide Manual Entry" : "⌨ Enter QR code manually (demo)"}
      </button>
      {open && (
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <input
            value={val} onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && tryParse()}
            placeholder='Paste QR data or type Visitor ID e.g. VIS-DEMO01'
            style={{ flex: 1, background: T.inputBg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 13, outline: "none", fontFamily: "inherit" }}
          />
          <button onClick={tryParse} style={{ background: `linear-gradient(135deg,${T.accent},${T.accent2})`, border: "none", color: "white", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            Look up
          </button>
        </div>
      )}
      {/* Demo shortcuts */}
      {open && (
        <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
          {["VIS-DEMO01", "VIS-DEMO02"].map(id => (
            <button key={id} onClick={() => onScan(id)} style={{ flex: 1, background: T.accent + "12", border: `1px solid ${T.accent}33`, color: T.accent, borderRadius: 8, padding: "7px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              🧪 {id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Info row helper
// ─────────────────────────────────────────────────────────────────────────────
function InfoRow({ label, value, accent, T, mono }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "10px 14px", background: T.surface2, borderRadius: 10, border: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 9, color: T.muted, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: accent || T.text, fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit", lineHeight: 1.3 }}>{value || "—"}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OTP Stage — step 2 of verification
// ─────────────────────────────────────────────────────────────────────────────
function OTPStage({ visitor, onSuccess, onBack, T }) {
  const [otp, setOtp] = useState(null);
  const [inputs, setInputs] = useState(["", "", "", "", "", ""]);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [shake, setShake] = useState(false);

  const sendOTP = () => {
    const g = genOTP();
    setOtp(g);
    setSent(true);
    alert(`📱 OTP Sent to ${visitor.phone} (Demo): ${g}`);
  };

  const verify = () => {
    if (inputs.join("") === otp) {
      setVerified(true);
      setTimeout(onSuccess, 1000);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🔐</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: T.text }}>OTP Verification</h3>
        <p style={{ color: T.muted, fontSize: 12, marginTop: 5 }}>Verify identity before granting access</p>
      </div>

      {/* Mini visitor card */}
      <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${T.accent},${T.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {visitor.photo ? <img src={visitor.photo} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} /> : "👤"}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{visitor.name || visitor.visitorId}</div>
          <div style={{ fontSize: 11, color: T.muted }}>{visitor.company} · {visitor.phone}</div>
        </div>
        <span style={{ marginLeft: "auto", background: T.success + "22", color: T.success, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>✓ QR Verified</span>
      </div>

      {!sent ? (
        <button onClick={sendOTP} style={{ width: "100%", background: `linear-gradient(135deg,${T.accent},${T.accent2})`, border: "none", color: "white", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          📱 Send OTP to {visitor.phone}
        </button>
      ) : (
        <>
          <p style={{ textAlign: "center", fontSize: 13, color: T.muted, marginBottom: 14 }}>
            Enter the 6-digit OTP sent to <strong style={{ color: T.text }}>{visitor.phone}</strong>
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20, animation: shake ? "shakeLine 0.5s" : "none" }}>
            {inputs.map((v, i) => (
              <input
                key={i}
                id={`votp-${i}`}
                maxLength={1}
                value={v}
                onChange={e => {
                  const val = e.target.value.replace(/\D/, "");
                  const n = [...inputs]; n[i] = val; setInputs(n);
                  if (val && i < 5) document.getElementById(`votp-${i + 1}`)?.focus();
                }}
                onKeyDown={e => { if (e.key === "Backspace" && !v && i > 0) document.getElementById(`votp-${i - 1}`)?.focus(); }}
                style={{ width: 46, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700, background: T.inputBg, border: `1.5px solid ${verified ? T.success : T.border}`, borderRadius: 10, color: verified ? T.success : T.text, fontFamily: "'JetBrains Mono', monospace", outline: "none", transition: "border 0.2s" }}
              />
            ))}
          </div>

          {!verified ? (
            <button onClick={verify} style={{ width: "100%", background: `linear-gradient(135deg,${T.accent},${T.accent2})`, border: "none", color: "white", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              ✓ Verify & Grant Entry
            </button>
          ) : (
            <div style={{ textAlign: "center", color: T.success, fontWeight: 700, fontSize: 15, animation: "fadeUp 0.3s ease" }}>
              ✅ Verified — Granting access…
            </div>
          )}

          <p onClick={sendOTP} style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 10, cursor: "pointer", textDecoration: "underline" }}>Resend OTP</p>
        </>
      )}

      <button onClick={onBack} style={{ width: "100%", marginTop: 12, background: "transparent", border: `1.5px solid ${T.border}`, color: T.muted, borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        ← Back to Scanner
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Access Granted screen
// ─────────────────────────────────────────────────────────────────────────────
function AccessGranted({ visitor, onReset, T }) {
  return (
    <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease" }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, background: `linear-gradient(135deg,${T.success},${T.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Access Granted
      </h2>
      <p style={{ color: T.muted, fontSize: 13, marginTop: 6, marginBottom: 24 }}>Visitor identity verified. Entry authorised.</p>

      <div style={{ background: `linear-gradient(135deg,${T.success}18,${T.accent}10)`, border: `1.5px solid ${T.success}44`, borderRadius: 16, padding: "20px", marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 4 }}>{visitor.name || visitor.visitorId}</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 12 }}>{visitor.company}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { l: "Visitor ID", v: visitor.visitorId },
            { l: "Department", v: DEPT_LABELS[visitor.dept] || visitor.dept },
            { l: "Host", v: visitor.hostEmployee },
            { l: "Check-In", v: visitor.checkIn },
          ].map((r, i) => (
            <div key={i} style={{ background: T.surface, borderRadius: 9, padding: "9px 12px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 9, color: T.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.l}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{r.v || "—"}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: "8px 14px", background: T.success + "18", borderRadius: 8, border: `1px solid ${T.success}33` }}>
          <span style={{ fontSize: 12, color: T.success, fontWeight: 700 }}>🕒 Entry logged at {new Date().toLocaleTimeString("en-IN")}</span>
        </div>
      </div>

      <button onClick={onReset} style={{ width: "100%", background: `linear-gradient(135deg,${T.accent},${T.accent2})`, border: "none", color: "white", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        🔄 Scan Next Visitor
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Verification Page
// ─────────────────────────────────────────────────────────────────────────────
export default function VerificationPage() {
  const [dark, setDark] = useState(true);
  const T = dark ? DARK : LIGHT;

  // vStep: "scan" | "info" | "otp" | "done"
  const [vStep, setVStep] = useState("scan");
  const [scannedRaw, setScannedRaw] = useState(null);
  const [visitor, setVisitor] = useState(null);
  const [lookupError, setLookupError] = useState(null);
  const [anim, setAnim] = useState(true);

  const transition = (step) => { setAnim(false); setTimeout(() => { setVStep(step); setAnim(true); }, 200); };

  // Parse QR data and look up visitor
  const handleScan = useCallback((raw) => {
    setLookupError(null);
    let id = raw.trim();

    // Try parsing as JSON (from our QR generator)
    try {
      const parsed = JSON.parse(raw);
      id = parsed.id || parsed.visitorId || raw.trim();
    } catch {}

    // Look up in mock DB (replace with real API in production)
    const found = MOCK_DB[id];
    if (found) {
      setScannedRaw(raw);
      setVisitor(found);
      transition("info");
    } else {
      setLookupError(`No visitor found for ID: "${id}". Try VIS-DEMO01 or VIS-DEMO02.`);
    }
  }, []);

  const reset = () => {
    setVisitor(null); setScannedRaw(null); setLookupError(null);
    transition("scan");
  };

  const statusBadge = (s) => ({
    Approved: { bg: T.success + "22", color: T.success },
    Pending: { bg: "#fbbf2422", color: "#fbbf24" },
    Rejected: { bg: T.error + "22", color: T.error },
  }[s] || { bg: T.surface2, color: T.muted });

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Outfit','DM Sans',sans-serif", padding: "24px 20px", position: "relative", overflow: "hidden", transition: "background 0.35s,color 0.35s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box}
        input{font-family:'Outfit',sans-serif!important}
        input:focus{border-color:${T.accent}!important;box-shadow:0 0 0 3px ${T.accent}28!important;outline:none}
        .fade-up{animation:fadeUp 0.3s cubic-bezier(.22,1,.36,1)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scanLine{0%{top:0}50%{top:calc(100% - 2px)}100%{top:0}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.85)}}
        @keyframes shakeLine{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px ${T.success}44}50%{box-shadow:0 0 40px ${T.success}77}}
        .tog{transition:all 0.28s ease;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .tog:hover{transform:scale(1.13) rotate(18deg)}
      `}</style>

      {/* ── Dark/Light Toggle ── */}
      <button className="tog" onClick={() => setDark(d => !d)} title={dark ? "Switch to Light" : "Switch to Dark"}
        style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, width: 48, height: 48, borderRadius: "50%", background: T.toggleBg, border: `1.5px solid ${T.toggleBorder}`, boxShadow: dark ? "0 4px 20px rgba(56,189,248,0.28)" : "0 4px 20px rgba(59,130,246,0.18)", fontSize: 20, backdropFilter: "blur(10px)" }}>
        {dark ? "☀️" : "🌙"}
      </button>

      {/* Ambient blobs */}
      <div style={{ position: "fixed", width: 420, height: 420, borderRadius: "50%", background: T.blobA, filter: "blur(90px)", top: -120, left: -100, pointerEvents: "none", transition: "background 0.4s" }} />
      <div style={{ position: "fixed", width: 320, height: 320, borderRadius: "50%", background: T.blobB, filter: "blur(80px)", bottom: -80, right: -80, pointerEvents: "none", transition: "background 0.4s" }} />

      {/* ── Page Header ── */}
      <div style={{ textAlign: "center", marginBottom: 28, position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: dark ? "rgba(56,189,248,0.09)" : "rgba(2,132,199,0.07)", border: `1px solid ${T.accent}33`, borderRadius: 40, padding: "6px 20px", marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>🏭</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Smart Visitor · Gate Verification</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: T.text }}>Visitor Entry Verification</h1>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 5 }}>Scan visitor QR pass → Confirm identity → Grant access</p>

        {/* Step pills */}
        <div style={{ display: "inline-flex", gap: 6, marginTop: 14, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 40, padding: "5px 8px" }}>
          {[["scan", "1. Scan QR", "📷"], ["info", "2. Verify Info", "🪪"], ["otp", "3. OTP Check", "🔐"], ["done", "4. Access", "✅"]].map(([step, label, icon]) => {
            const steps = ["scan", "info", "otp", "done"];
            const idx = steps.indexOf(step), cur = steps.indexOf(vStep);
            const active = step === vStep, done = idx < cur;
            return (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 30, background: active ? `linear-gradient(135deg,${T.accent},${T.accent2})` : done ? T.success + "22" : "transparent", transition: "all 0.3s" }}>
                <span style={{ fontSize: 13 }}>{done ? "✓" : icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: active ? "white" : done ? T.success : T.muted, whiteSpace: "nowrap" }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: vStep === "scan" ? "1fr 1fr" : vStep === "done" ? "1fr" : "1fr 1fr", gap: 20, position: "relative", zIndex: 1, transition: "grid-template-columns 0.4s" }}>

        {/* ══ LEFT — Scanner (hidden after done) ══ */}
        {vStep !== "done" && (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: "28px", boxShadow: T.shadow }} className={anim ? "fade-up" : ""}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${T.accent},${T.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📷</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>QR Code Scanner</div>
                <div style={{ fontSize: 11, color: T.muted }}>Point camera at visitor's QR pass</div>
              </div>
            </div>

            <QRScanner onScan={handleScan} active={vStep === "scan"} T={T} />

            {lookupError && (
              <div style={{ marginTop: 12, background: T.error + "18", border: `1px solid ${T.error}33`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: T.error }}>
                ⚠ {lookupError}
              </div>
            )}

            {/* Instructions */}
            <div style={{ marginTop: 18, background: T.surface2, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Instructions</div>
              {[
                ["📱", "Ask visitor to open their QR pass on their phone"],
                ["🎯", "Hold QR code steady within the green brackets"],
                ["💡", "Ensure good lighting for faster detection"],
                ["⌨", "Use manual entry below if camera unavailable"],
              ].map(([icon, text], i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 3 ? 8 : 0 }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ RIGHT — Info / OTP / Done ══ */}
        <div style={{ background: T.surface, border: `1px solid ${vStep === "done" ? T.success + "44" : T.border}`, borderRadius: 20, padding: "28px", boxShadow: vStep === "done" ? `0 0 40px ${T.success}18` : T.shadow, transition: "border 0.4s, box-shadow 0.4s" }} className={anim ? "fade-up" : ""}>

          {/* ── Scan placeholder ── */}
          {vStep === "scan" && (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, minHeight: 360 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.surface2, border: `2px dashed ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>👤</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 5 }}>Awaiting QR Scan</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>Visitor information will appear<br />here after QR code is scanned</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 240 }}>
                {[["📋", "Visitor details"], ["🏭", "Department & purpose"], ["⏱", "Check-in / check-out times"], ["📸", "Photo ID preview"]].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: T.surface2, borderRadius: 8, border: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 15 }}>{icon}</span>
                    <span style={{ fontSize: 12, color: T.muted }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Visitor Info (step 2) ── */}
          {vStep === "info" && visitor && (
            <div className={anim ? "fade-up" : ""}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg,${T.accent}44,${T.accent2}44)`, border: `2px solid ${T.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, overflow: "hidden" }}>
                  {visitor.photo ? <img src={visitor.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Visitor" /> : "👤"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>{visitor.name || "Unknown"}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{visitor.company}</div>
                </div>
                <span style={{ ...statusBadge(visitor.status), fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  {visitor.status === "Approved" ? "✓ " : ""}{visitor.status}
                </span>
              </div>

              {/* QR decode raw */}
              <div style={{ background: T.success + "12", border: `1px solid ${T.success}33`, borderRadius: 10, padding: "9px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>✅</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.success }}>QR Code Successfully Scanned</div>
                  <div style={{ fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>{visitor.visitorId}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                <InfoRow label="Visitor ID" value={visitor.visitorId} accent={T.accent} T={T} mono />
                <InfoRow label="Phone" value={visitor.phone} T={T} />
                <InfoRow label="Host Employee" value={visitor.hostEmployee} T={T} />
                <InfoRow label="Visit Date" value={visitor.visitDate} T={T} mono />
                <InfoRow label="Check-In" value={visitor.checkIn} T={T} mono />
                <InfoRow label="Check-Out" value={visitor.checkOut} T={T} mono />
              </div>

              <InfoRow label="Department" value={DEPT_LABELS[visitor.dept] || visitor.dept} accent={T.accent2} T={T} />
              <div style={{ marginTop: 8 }}>
                <InfoRow label="Purpose of Visit" value={visitor.purpose} T={T} />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={reset} style={{ background: "transparent", border: `1.5px solid ${T.border}`, color: T.muted, borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Rescan</button>
                {visitor.status === "Approved" ? (
                  <button onClick={() => transition("otp")} style={{ flex: 1, background: `linear-gradient(135deg,${T.accent},${T.accent2})`, border: "none", color: "white", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    Proceed to OTP Verification →
                  </button>
                ) : (
                  <div style={{ flex: 1, background: T.error + "18", border: `1px solid ${T.error}33`, borderRadius: 12, padding: "13px", fontSize: 13, fontWeight: 700, color: T.error, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ⛔ Access Denied — Visitor not approved
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── OTP Stage ── */}
          {vStep === "otp" && visitor && (
            <OTPStage
              visitor={visitor}
              onSuccess={() => transition("done")}
              onBack={() => transition("info")}
              T={T}
            />
          )}

          {/* ── Access Granted ── */}
          {vStep === "done" && visitor && (
            <AccessGranted visitor={visitor} onReset={reset} T={T} />
          )}
        </div>
      </div>
    </div>
  );
}