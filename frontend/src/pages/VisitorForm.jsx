import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const QRImage = ({ value, size = 200 }) => (
  <img
    src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=0a1628&margin=10`}
    alt="Visitor QR"
    style={{ width: size, height: size, borderRadius: 12 }}
  />
);

const DEPARTMENTS = [
  {
    id: "chemical", name: "Chemical", icon: "⚗️", color: "#f59e0b",
    bgD: "linear-gradient(135deg,#78350f22,#f59e0b11)", bgL: "linear-gradient(135deg,#fef3c733,#f59e0b1a)",
    border: "#f59e0b44", tagline: "Hazardous Materials Zone",
    video: "https://www.youtube.com/embed/dCO6S7BwHTQ?autoplay=0",
    instructions: [
      { icon: "🥽", text: "Always wear PPE — goggles, gloves, lab coat" },
      { icon: "🚫", text: "No open flames near solvent storage areas" },
      { icon: "🧯", text: "Know the location of fire extinguishers" },
      { icon: "💧", text: "Wash hands before and after handling chemicals" },
      { icon: "📋", text: "Read SDS (Safety Data Sheets) before handling" },
      { icon: "🚪", text: "Ensure proper ventilation at all times" },
    ],
    quiz: [
      { q: "What does PPE stand for?", options: ["Personal Protective Equipment","Plant Protection Engine","Process Performance Evaluation","Primary Protective Element"], ans: 0 },
      { q: "Where should you wash your hands?", options: ["Only at lunch","Never needed","Before and after handling chemicals","Only if visible dirt"], ans: 2 },
      { q: "What should you read before handling chemicals?", options: ["Newspaper","SDS Sheet","Company handbook","Nothing needed"], ans: 1 },
      { q: "Open flames near solvent storage are:", options: ["Allowed carefully","Required for testing","Strictly prohibited","Fine on weekdays"], ans: 2 },
    ],
  },
  {
    id: "food", name: "Food Processing", icon: "🍱", color: "#22c55e",
    bgD: "linear-gradient(135deg,#14532d22,#22c55e11)", bgL: "linear-gradient(135deg,#dcfce733,#22c55e1a)",
    border: "#22c55e44", tagline: "Hygiene & Safety First",
    video: "https://www.youtube.com/embed/auzfTPp4moA?autoplay=0",
    instructions: [
      { icon: "🧴", text: "Sanitize hands every 30 minutes during work" },
      { icon: "👷", text: "Wear hair nets, gloves and aprons at all times" },
      { icon: "🌡️", text: "Monitor food temperature — cold chain must be maintained" },
      { icon: "🚳", text: "No personal food or drinks on the processing floor" },
      { icon: "🤧", text: "Report any illness immediately to supervisor" },
      { icon: "🧹", text: "Clean and sanitize all equipment after each use" },
    ],
    quiz: [
      { q: "How often should hands be sanitized on the food floor?", options: ["Once a day","Every 30 minutes","Only when dirty","Never"], ans: 1 },
      { q: "Which is NOT allowed on the processing floor?", options: ["Gloves","Hair nets","Personal food","Aprons"], ans: 2 },
      { q: "What must be maintained for perishables?", options: ["Color coding","Cold chain","Weight log","Noise level"], ans: 1 },
      { q: "What should you do if you feel sick?", options: ["Continue working","Take medicine silently","Report immediately to supervisor","Leave without telling anyone"], ans: 2 },
    ],
  },
  {
    id: "electrical", name: "Electrical", icon: "⚡", color: "#3b82f6",
    bgD: "linear-gradient(135deg,#1e3a8a22,#3b82f611)", bgL: "linear-gradient(135deg,#dbeafe33,#3b82f61a)",
    border: "#3b82f644", tagline: "High Voltage Safety Zone",
    video: "https://www.youtube.com/embed/rRjBX4gTkJ8?autoplay=0",
    instructions: [
      { icon: "🔌", text: "Never touch exposed wiring or open panels" },
      { icon: "🧤", text: "Use insulated gloves when working near live circuits" },
      { icon: "🚧", text: "Lockout/Tagout all equipment before maintenance" },
      { icon: "🌊", text: "Keep electrical panels away from water and moisture" },
      { icon: "👀", text: "Report any sparks, burning smell, or unusual sounds" },
      { icon: "🧯", text: "Use only Class C fire extinguisher for electrical fires" },
    ],
    quiz: [
      { q: "What procedure ensures safe maintenance of equipment?", options: ["Just unplug it","Lockout/Tagout","Cover with cloth","Turn off lights"], ans: 1 },
      { q: "For electrical fires, use which extinguisher?", options: ["Class A","Water hose","Class C","Sand bucket"], ans: 2 },
      { q: "Near live circuits you should wear:", options: ["Rubber boots only","Insulated gloves","Cotton gloves","Nothing special"], ans: 1 },
      { q: "Electrical panels must be kept away from:", options: ["Sunlight","Noise","Water and moisture","Open air"], ans: 2 },
    ],
  },
  {
    id: "mechanical", name: "Mechanical", icon: "⚙️", color: "#8b5cf6",
    bgD: "linear-gradient(135deg,#4c1d9522,#8b5cf611)", bgL: "linear-gradient(135deg,#ede9fe33,#8b5cf61a)",
    border: "#8b5cf644", tagline: "Heavy Machinery Zone",
    video: "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=0",
    instructions: [
      { icon: "⛑️", text: "Wear hard hat, safety boots and high-vis vest" },
      { icon: "🚷", text: "Never stand in the swing radius of cranes or arms" },
      { icon: "🔧", text: "Use correct tools — never improvise with wrong equipment" },
      { icon: "🛑", text: "Do not operate machinery without proper authorization" },
      { icon: "🔊", text: "Ear protection required in high-noise zones" },
      { icon: "🔍", text: "Inspect equipment before every use — report defects" },
    ],
    quiz: [
      { q: "What should you do before operating any machinery?", options: ["Nothing, just start it","Check authorization and inspect","Ask a colleague","Read the brand name"], ans: 1 },
      { q: "In high-noise zones you must wear:", options: ["Sunglasses","Ear protection","Thick socks","Face shield only"], ans: 1 },
      { q: "Where should you NOT stand near cranes?", options: ["Near the base","In swing radius","Behind it","10 meters away"], ans: 1 },
      { q: "What do you do if you find a defective machine?", options: ["Use it carefully","Ignore it","Fix it yourself","Report it immediately"], ans: 3 },
    ],
  },
];

const genVisitorId = () => `VIS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Field wrapper — defined OUTSIDE component so it never remounts ──────────
const Field = ({ label, icon, error, muted, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:600, color: muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>
      <span>{icon}</span>{label}
    </label>
    {children}
    {error && <div style={{ fontSize:11, color:"#f87171", marginTop:4 }}>⚠ {error}</div>}
  </div>
);

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


export default function VisitorForm() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(true);
  const T = dark ? DARK : LIGHT;

const [stage, setStage] = useState(1);
  const [anim, setAnim] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [form, setForm] = useState({
    visitorId: genVisitorId(), company: "", phone: "", hostEmployee: "",
    visitDate: "", purpose: "", status: "Pending", checkIn: "", checkOut: "", photo: null,
  });
  const [photoMode, setPhotoMode] = useState("file");
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [s1Errors, setS1Errors] = useState({});
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [selectedDept, setSelectedDept] = useState(null);
  const [videoWatched, setVideoWatched] = useState(false);
  const [instructionsRead, setInstructionsRead] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [otp, setOtp] = useState(null);
  const [otpInput, setOtpInput] = useState(["","","","","",""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [qrValue, setQrValue] = useState("");

  const go = (s) => { setAnim(false); setTimeout(() => { setStage(s); setAnim(true); }, 220); };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch { alert("Camera not accessible. Use file upload."); }
  };
  const stopCamera = () => { streamRef.current?.getTracks().forEach(t => t.stop()); setCameraActive(false); };
  const capturePhoto = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    const dataUrl = c.toDataURL("image/jpeg");
    setCapturedPhoto(dataUrl); setForm(f => ({ ...f, photo: dataUrl })); stopCamera();
  };
  const validateS1 = () => {
    const e = {};
    if (!form.company.trim()) e.company = "Required";
    if (!/^\+?[\d\s-]{8,}$/.test(form.phone)) e.phone = "Valid phone required";
    if (!form.hostEmployee.trim()) e.hostEmployee = "Required";
    if (!form.visitDate) e.visitDate = "Required";
    if (!form.purpose.trim()) e.purpose = "Required";
    if (!form.checkIn) e.checkIn = "Required";
    if (!form.photo && !capturedPhoto) e.photo = "Photo required";
    setS1Errors(e); return Object.keys(e).length === 0;
  };
  const submitQuiz = () => {
    const d = DEPARTMENTS.find(d => d.id === selectedDept);
    let score = 0;
    d.quiz.forEach((q, i) => { if (quizAnswers[i] === q.ans) score++; });
    setQuizScore(score); setQuizSubmitted(true);
    if (score >= 3) setTimeout(() => go(4), 1200);
  };
  const sendOTP = () => { const g = genOTP(); setOtp(g); setOtpSent(true); alert(`📱 OTP (Demo): ${g}`); };
  const verifyOTP = () => {
    if (otpInput.join("") === otp) {
      setOtpVerified(true);
      setQrValue(JSON.stringify({ id: form.visitorId, email: loginData.email, dept: selectedDept, date: form.visitDate, status: "Approved" }));
      setTimeout(() => go(5), 800);
    } else alert("Incorrect OTP. Try again.");
  };
const resetAll = () => {
    setStage(1);
    setForm({ visitorId: genVisitorId(), company: "", phone: "", hostEmployee: "", visitDate: "", purpose: "", status: "Pending", checkIn: "", checkOut: "", photo: null });
    setCapturedPhoto(null); setSelectedDept(null); setVideoWatched(false); setInstructionsRead(false);
    setQuizAnswers({}); setQuizSubmitted(false); setOtpSent(false); setOtpVerified(false); setOtpInput(["","","","","",""]);
    go(1);
  };

  const dept = DEPARTMENTS.find(d => d.id === selectedDept);
  const stageNames = ["Personal Info", "Safety Training", "Safety Quiz", "OTP & Submit"];
  const currentStepDisplay = Math.max(0, stage - 1);

  // ── Theme-reactive style helpers (plain objects, not components) ──────────
  const iS = { width:"100%", background:T.inputBg, border:`1.5px solid ${T.border}`, borderRadius:10, padding:"11px 14px", color:T.text, fontSize:14, outline:"none", transition:"border 0.2s,box-shadow 0.2s", fontFamily:"inherit", boxSizing:"border-box" };
  const card = { background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, padding:"32px 36px", boxShadow:T.shadow };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Outfit','DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", position:"relative", overflow:"hidden", transition:"background 0.35s,color 0.35s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box}
        input,select,textarea{font-family:'Outfit',sans-serif!important}
        input:focus,select:focus,textarea:focus{border-color:${T.accent}!important;box-shadow:0 0 0 3px ${T.accent}28!important;outline:none}
        .btn-p{background:linear-gradient(135deg,${T.accent},${T.accent2});border:none;color:#fff;font-weight:700;font-size:15px;border-radius:12px;padding:14px 32px;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif;letter-spacing:0.02em}
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 24px ${T.accent}44}
        .btn-s{background:transparent;border:1.5px solid ${T.border};color:${T.muted};font-weight:600;font-size:14px;border-radius:10px;padding:11px 24px;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .btn-s:hover{border-color:${T.accent};color:${T.accent}}
        .fade-up{animation:fu 0.35s cubic-bezier(.22,1,.36,1)}
        @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .qopt:hover{border-color:${T.accent}!important;background:${T.accent}12!important}
        .qopt{transition:all 0.2s;cursor:pointer}
        .otp-b{width:44px;height:54px;text-align:center;font-size:22px;font-weight:700;background:${T.inputBg};border:1.5px solid ${T.border};border-radius:10px;color:${T.text};font-family:'JetBrains Mono',monospace;transition:border 0.2s}
        .otp-b:focus{border-color:${T.accent}!important;box-shadow:0 0 0 3px ${T.accent}28!important;outline:none}
        .dc{transition:all 0.22s ease;cursor:pointer}
        .dc:hover{transform:scale(1.03);box-shadow:0 8px 28px rgba(0,0,0,0.13)}
        .tog{transition:all 0.28s ease;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .tog:hover{transform:scale(1.12) rotate(18deg)}
        select option{background:${T.surface};color:${T.text}}
      `}</style>

      {/* ── Dark/Light Toggle ── */}
      <button
        className="tog"
        onClick={() => setDark(d => !d)}
        title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        style={{
          position:"fixed", top:16, right:16, zIndex:9999,
          width:48, height:48, borderRadius:"50%",
          background:T.toggleBg, border:`1.5px solid ${T.toggleBorder}`,
          boxShadow: dark ? "0 4px 20px rgba(56,189,248,0.28)" : "0 4px 20px rgba(59,130,246,0.18)",
          fontSize:20, backdropFilter:"blur(10px)",
        }}
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {/* Blobs */}
      <div style={{ position:"absolute", width:420, height:420, borderRadius:"50%", background:T.blobA, filter:"blur(90px)", top:-120, left:-100, pointerEvents:"none", transition:"background 0.4s" }} />
      <div style={{ position:"absolute", width:320, height:320, borderRadius:"50%", background:T.blobB, filter:"blur(80px)", bottom:-80, right:-80, pointerEvents:"none", transition:"background 0.4s" }} />
      <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background: dark ? "rgba(52,211,153,0.05)" : "rgba(52,211,153,0.09)", filter:"blur(60px)", top:"40%", left:"55%", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:680, position:"relative", zIndex:1 }} className={anim ? "fade-up" : ""}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, background: dark ? "rgba(56,189,248,0.09)" : "rgba(2,132,199,0.07)", border:`1px solid ${T.accent}33`, borderRadius:40, padding:"6px 18px", marginBottom:12, transition:"background 0.3s" }}>
            <span style={{ fontSize:18 }}>🏭</span>
            <span style={{ fontSize:11, fontWeight:700, color:T.accent, letterSpacing:"0.12em", textTransform:"uppercase" }}>Smart Visitor Pre-Authorization</span>
          </div>

          {stage > 0 && stage < 5 && (
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
              {stageNames.map((name, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background: i < currentStepDisplay ? T.success : i === currentStepDisplay ? `linear-gradient(135deg,${T.accent},${T.accent2})` : T.surface2, border:`2px solid ${i <= currentStepDisplay ? (i < currentStepDisplay ? T.success : T.accent) : T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color: i <= currentStepDisplay ? "white" : T.muted, transition:"all 0.4s", boxShadow: i === currentStepDisplay ? `0 0 12px ${T.accent}55` : "none" }}>
                      {i < currentStepDisplay ? "✓" : i+1}
                    </div>
                    <span style={{ fontSize:9, color: i === currentStepDisplay ? T.accent : T.muted, fontWeight:600, whiteSpace:"nowrap", letterSpacing:"0.05em" }}>{name}</span>
                  </div>
                  {i < stageNames.length-1 && <div style={{ width:54, height:2, background: i < currentStepDisplay ? T.success : T.border, margin:"0 4px 20px", transition:"background 0.4s" }} />}
                </div>
              ))}
            </div>
          )}
        </div>



        {/* ══ STAGE 1 ══ */}
        {stage === 1 && (
          <div style={card}>
            <div style={{ marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <span style={{ background:`linear-gradient(135deg,${T.accent},${T.accent2})`, borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📝</span>
                <h3 style={{ fontSize:20, fontWeight:800, margin:0, color:T.text }}>Personal Information</h3>
              </div>
              <p style={{ color:T.muted, fontSize:12, marginLeft:42 }}>Fill in your visitor details accurately</p>
            </div>

            <div style={{ background: dark ? "rgba(56,189,248,0.07)" : "rgba(2,132,199,0.06)", border:`1.5px solid ${T.accent}33`, borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:10, color:T.muted, letterSpacing:"0.08em", fontWeight:600, textTransform:"uppercase" }}>🪪 Auto-generated Visitor ID</div>
                <div style={{ fontSize:17, fontFamily:"'JetBrains Mono',monospace", color:T.accent, fontWeight:700, marginTop:2 }}>{form.visitorId}</div>
              </div>
              <span style={{ background:T.success+"22", color:T.success, fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>SYSTEM GENERATED</span>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 18px" }}>
              <Field label="Company / Organization" icon="🏢" error={s1Errors.company} muted={T.muted}>
                <input style={iS} placeholder="e.g. TechCorp Ltd." value={form.company} onChange={e => setForm(f => ({ ...f, company:e.target.value }))} />
              </Field>
              <Field label="Phone Number" icon="📱" error={s1Errors.phone} muted={T.muted}>
                <input style={iS} placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone:e.target.value }))} />
              </Field>
              <Field label="Host Employee Name" icon="👨‍💼" error={s1Errors.hostEmployee} muted={T.muted}>
                <input style={iS} placeholder="e.g. Rajesh Kumar" value={form.hostEmployee} onChange={e => setForm(f => ({ ...f, hostEmployee:e.target.value }))} />
              </Field>
              <Field label="Visit Date" icon="📅" error={s1Errors.visitDate} muted={T.muted}>
                <input style={iS} type="date" value={form.visitDate} onChange={e => setForm(f => ({ ...f, visitDate:e.target.value }))} />
              </Field>
              <Field label="Check-In Time" icon="🟢" error={s1Errors.checkIn} muted={T.muted}>
                <input style={iS} type="time" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn:e.target.value }))} />
              </Field>
              <Field label="Check-Out Time (Expected)" icon="🔴" muted={T.muted}>
                <input style={iS} type="time" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut:e.target.value }))} />
              </Field>
            </div>

<Field label="Purpose of Visit" icon="🎯" error={s1Errors.purpose} muted={T.muted}>
              <textarea style={{ ...iS, height:72, resize:"none" }} placeholder="Describe the reason for your visit..." value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose:e.target.value }))} />
            </Field>

<Field label="Passport Photo" icon="📸" error={s1Errors.photo} muted={T.muted}>
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                {["file","camera"].map(m => (
                  <button key={m} onClick={() => { setPhotoMode(m); if (m==="camera") startCamera(); else stopCamera(); }}
                    style={{ flex:1, padding:"9px", borderRadius:9, border:`1.5px solid ${photoMode===m ? T.accent : T.border}`, background:photoMode===m ? T.accent+"18" : T.surface2, color:photoMode===m ? T.accent : T.muted, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s", fontFamily:"inherit" }}>
                    {m==="file" ? "📁 Upload File" : "📷 Live Camera"}
                  </button>
                ))}
              </div>
              {photoMode==="file" && (
                <label style={{ display:"flex", alignItems:"center", gap:10, background:T.surface2, border:`1.5px dashed ${T.border}`, borderRadius:10, padding:"14px 16px", cursor:"pointer" }}>
                  <span style={{ fontSize:24 }}>🖼️</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:T.text }}>Click to upload passport photo</div>
                    <div style={{ fontSize:11, color:T.muted }}>JPG, PNG — max 5MB</div>
                  </div>
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
                    const f = e.target.files[0];
                    if (f) { const r = new FileReader(); r.onload = ev => { setCapturedPhoto(ev.target.result); setForm(fr => ({ ...fr, photo:ev.target.result })); }; r.readAsDataURL(f); }
                  }} />
                </label>
              )}
              {photoMode==="camera" && (
                <div style={{ background:T.surface2, borderRadius:12, overflow:"hidden", position:"relative" }}>
                  <video ref={videoRef} autoPlay playsInline style={{ width:"100%", maxHeight:200, objectFit:"cover", display:cameraActive ? "block" : "none" }} />
                  <canvas ref={canvasRef} style={{ display:"none" }} />
                  {cameraActive && <button className="btn-p" style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", padding:"8px 24px", fontSize:13 }} onClick={capturePhoto}>📸 Capture</button>}
                  {!cameraActive && !capturedPhoto && <div style={{ padding:"20px", textAlign:"center", color:T.muted, fontSize:13 }}>Not started — <span style={{ color:T.accent, cursor:"pointer" }} onClick={startCamera}>click to start</span></div>}
                </div>
              )}
              {capturedPhoto && (
                <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:12, background:T.success+"18", border:`1px solid ${T.success}33`, borderRadius:10, padding:"10px 14px" }}>
                  <img src={capturedPhoto} alt="Photo" style={{ width:48, height:48, objectFit:"cover", borderRadius:8 }} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:T.success }}>✓ Photo captured</div>
                    <span style={{ fontSize:11, color:T.muted, cursor:"pointer", textDecoration:"underline" }} onClick={() => { setCapturedPhoto(null); setForm(f => ({ ...f, photo:null })); }}>Remove</span>
                  </div>
                </div>
              )}
            </Field>

<div style={{ display:"flex", gap:10, marginTop:8 }}>
              <button className="btn-s" onClick={() => navigate("/")}>← Back to Login</button>
              <button className="btn-p" style={{ flex:1 }} onClick={() => { if (validateS1()) go(2); }}>Continue to Safety Training →</button>
            </div>
          </div>
        )}

        {/* ══ STAGE 2 ══ */}
        {stage === 2 && (
          <div style={card}>
            <div style={{ marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <span style={{ background:"linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🛡️</span>
                <h3 style={{ fontSize:20, fontWeight:800, margin:0, color:T.text }}>Safety Training</h3>
              </div>
              <p style={{ color:T.muted, fontSize:12, marginLeft:42 }}>Select your department and complete safety training</p>
            </div>

            {!selectedDept ? (
              <>
                <p style={{ fontSize:13, color:T.muted, marginBottom:16, fontWeight:500 }}>Which department are you visiting?</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {DEPARTMENTS.map(d => (
                    <div key={d.id} className="dc" onClick={() => setSelectedDept(d.id)}
                      style={{ background: dark ? d.bgD : d.bgL, border:`1.5px solid ${d.border}`, borderRadius:14, padding:"18px 20px" }}>
                      <div style={{ fontSize:28, marginBottom:8 }}>{d.icon}</div>
                      <div style={{ fontSize:15, fontWeight:700, color:d.color }}>{d.name}</div>
                      <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>{d.tagline}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:16 }}><button className="btn-s" onClick={() => go(1)}>← Back</button></div>
              </>
            ) : (
              <div>
                <div style={{ background: dark ? dept.bgD : dept.bgL, border:`1px solid ${dept.border}`, borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:28 }}>{dept.icon}</span>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:dept.color }}>{dept.name} Department</div>
                      <div style={{ fontSize:11, color:T.muted }}>{dept.tagline}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:11, color:T.muted, cursor:"pointer", textDecoration:"underline" }} onClick={() => { setSelectedDept(null); setVideoWatched(false); setInstructionsRead(false); }}>Change</span>
                </div>

                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                    🎬 Safety Training Video
                    {videoWatched && <span style={{ background:T.success+"22", color:T.success, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>✓ WATCHED</span>}
                  </div>
                  <div style={{ background:"#000", borderRadius:12, overflow:"hidden", position:"relative", paddingBottom:"40%" }}>
                    <iframe src={dept.video} title="Safety" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }} allowFullScreen />
                  </div>
                  {!videoWatched && (
                    <button onClick={() => setVideoWatched(true)} style={{ marginTop:8, background:T.accent+"18", border:`1px solid ${T.accent}44`, color:T.accent, borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:600, cursor:"pointer", width:"100%", fontFamily:"inherit" }}>
                      ✓ Mark Video as Watched
                    </button>
                  )}
                </div>

                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                    📋 Safety Instructions
                    {instructionsRead && <span style={{ background:T.success+"22", color:T.success, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>✓ READ</span>}
                  </div>
                  <div style={{ background:T.surface2, borderRadius:12, padding:"16px" }}>
                    {dept.instructions.map((ins, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom: i<dept.instructions.length-1?10:0, paddingBottom: i<dept.instructions.length-1?10:0, borderBottom: i<dept.instructions.length-1?`1px solid ${T.border}`:"none" }}>
                        <span style={{ fontSize:18, flexShrink:0 }}>{ins.icon}</span>
                        <span style={{ fontSize:13, color:T.text, lineHeight:1.5 }}>{ins.text}</span>
                      </div>
                    ))}
                  </div>
                  {!instructionsRead && (
                    <button onClick={() => setInstructionsRead(true)} style={{ marginTop:8, background:T.accent+"18", border:`1px solid ${T.accent}44`, color:T.accent, borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:600, cursor:"pointer", width:"100%", fontFamily:"inherit" }}>
                      ✓ I Have Read All Instructions
                    </button>
                  )}
                </div>

                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn-s" onClick={() => go(1)}>← Back</button>
                  <button className="btn-p" style={{ flex:1, opacity: videoWatched && instructionsRead ? 1 : 0.45 }}
                    onClick={() => { if (videoWatched && instructionsRead) { setQuizAnswers({}); setQuizSubmitted(false); go(3); } else alert("Please watch the video and read all instructions first."); }}>
                    Take Safety Quiz →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ STAGE 3 ══ */}
        {stage === 3 && dept && (
          <div style={card}>
            <div style={{ marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <span style={{ background:"linear-gradient(135deg,#8b5cf6,#ec4899)", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🧠</span>
                <h3 style={{ fontSize:20, fontWeight:800, margin:0, color:T.text }}>Safety Quiz</h3>
              </div>
              <p style={{ color:T.muted, fontSize:12, marginLeft:42 }}>{dept.icon} {dept.name} — Answer all 4 questions (min 3/4 to pass)</p>
            </div>

            {dept.quiz.map((q, qi) => (
              <div key={qi} style={{ marginBottom:20, background:T.surface2, borderRadius:14, padding:"18px 20px", border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:12 }}>
                  <span style={{ color:T.accent, fontFamily:"'JetBrains Mono',monospace", marginRight:8 }}>Q{qi+1}.</span>{q.q}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {q.options.map((opt, oi) => {
                    const sel = quizAnswers[qi]===oi, cor = quizSubmitted&&oi===q.ans, wrn = quizSubmitted&&sel&&oi!==q.ans;
                    return (
                      <div key={oi} className="qopt" onClick={() => !quizSubmitted && setQuizAnswers(a => ({ ...a, [qi]:oi }))}
                        style={{ padding:"10px 14px", borderRadius:9, border:`1.5px solid ${cor?T.success:wrn?T.error:sel?T.accent:T.border}`, background:cor?T.success+"18":wrn?T.error+"18":sel?T.accent+"12":"transparent", display:"flex", alignItems:"center", gap:10, fontSize:13, color:cor?T.success:wrn?T.error:sel?T.accent:T.text, fontWeight:sel||cor?600:400 }}>
                        <span style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${cor?T.success:wrn?T.error:sel?T.accent:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, flexShrink:0 }}>
                          {cor?"✓":wrn?"✕":sel?"●":""}
                        </span>
                        {opt}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {quizSubmitted && (
              <div style={{ background: quizScore>=3?T.success+"18":T.error+"18", border:`1px solid ${quizScore>=3?T.success:T.error}44`, borderRadius:12, padding:"16px 20px", marginBottom:16, textAlign:"center" }}>
                <div style={{ fontSize:24, marginBottom:4 }}>{quizScore>=3?"🎉":"😔"}</div>
                <div style={{ fontSize:16, fontWeight:700, color:quizScore>=3?T.success:T.error }}>
                  {quizScore}/4 — {quizScore>=3?"Passed! Proceeding...":"Failed — Minimum 3/4 required"}
                </div>
                {quizScore < 3 && <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>Re-read the instructions and retake.</div>}
              </div>
            )}

            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-s" onClick={() => go(2)}>← Back</button>
              {!quizSubmitted ? (
                <button className="btn-p" style={{ flex:1 }} onClick={() => { if (Object.keys(quizAnswers).length<4) { alert("Answer all 4 questions"); return; } submitQuiz(); }}>Submit Quiz →</button>
              ) : quizScore < 3 ? (
                <button className="btn-p" style={{ flex:1 }} onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}>Retake Quiz 🔄</button>
              ) : null}
            </div>
          </div>
        )}

        {/* ══ STAGE 4 ══ */}
        {stage === 4 && (
          <div style={card}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:40, marginBottom:8 }}>🔐</div>
              <h3 style={{ fontSize:22, fontWeight:800, margin:0, background:`linear-gradient(135deg,${T.accent},${T.success})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Final Verification</h3>
              <p style={{ color:T.muted, fontSize:13, marginTop:6 }}>Generate and enter OTP to complete registration</p>
            </div>

            <div style={{ background:T.surface2, borderRadius:14, padding:"16px 20px", marginBottom:24, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:11, color:T.muted, fontWeight:600, letterSpacing:"0.08em", marginBottom:10, textTransform:"uppercase" }}>Registration Summary</div>
              {[
                { l:"Visitor ID", v:form.visitorId },
                { l:"Company", v:form.company },
                { l:"Host", v:form.hostEmployee },
                { l:"Visit Date", v:form.visitDate },
                { l:"Department", v:dept?.name },
                { l:"Quiz Score", v:`${quizScore}/4 — Passed ✓` },
              ].map((r, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"5px 0", borderBottom:i<5?`1px solid ${T.border}`:"none" }}>
                  <span style={{ color:T.muted }}>{r.l}</span>
                  <span style={{ color:T.text, fontWeight:600 }}>{r.v}</span>
                </div>
              ))}
            </div>

            {!otpSent ? (
              <button className="btn-p" style={{ width:"100%", fontSize:15 }} onClick={sendOTP}>📱 Generate & Send OTP</button>
            ) : (
              <>
                <p style={{ fontSize:13, color:T.muted, textAlign:"center", marginBottom:14 }}>Enter the 6-digit OTP sent to your registered phone</p>
                <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:20 }}>
                  {otpInput.map((v, i) => (
                    <input key={i} className="otp-b" maxLength={1} value={v}
                      onChange={e => { const val=e.target.value.replace(/\D/,""); const n=[...otpInput]; n[i]=val; setOtpInput(n); if (val&&i<5) document.getElementById(`otp-${i+1}`)?.focus(); }}
                      onKeyDown={e => { if (e.key==="Backspace"&&!v&&i>0) document.getElementById(`otp-${i-1}`)?.focus(); }}
                      id={`otp-${i}`} />
                  ))}
                </div>
                {!otpVerified ? (
                  <button className="btn-p" style={{ width:"100%" }} onClick={verifyOTP}>✓ Verify OTP & Generate QR Pass</button>
                ) : (
                  <div style={{ textAlign:"center", color:T.success, fontWeight:700, fontSize:15 }}>✓ Verified — Generating QR...</div>
                )}
                <p style={{ textAlign:"center", fontSize:12, color:T.muted, marginTop:10, cursor:"pointer" }} onClick={sendOTP}>Resend OTP</p>
              </>
            )}
          </div>
        )}

        {/* ══ STAGE 5 — QR Pass ══ */}
        {stage === 5 && (
          <div style={{ background:T.surface, border:`1.5px solid ${T.success}44`, borderRadius:20, padding:"36px", boxShadow:`0 0 40px ${T.success}18` }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:44, marginBottom:8 }}>🎉</div>
              <h2 style={{ fontSize:24, fontWeight:800, margin:0, background:`linear-gradient(135deg,${T.success},${T.accent})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Registration Complete!</h2>
              <p style={{ color:T.muted, fontSize:13, marginTop:6 }}>Your visitor pass has been generated. Show this QR at the gate.</p>
            </div>

            {/* Pass — always dark for scanability */}
            <div style={{ background:"linear-gradient(135deg,#0d1628,#111f36)", border:"1.5px solid rgba(52,211,153,0.35)", borderRadius:18, padding:"28px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(52,211,153,0.06)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:-20, left:-20, width:80, height:80, borderRadius:"50%", background:"rgba(56,189,248,0.05)", pointerEvents:"none" }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:10, color:"#64748b", letterSpacing:"0.1em", fontWeight:600, textTransform:"uppercase", marginBottom:4 }}>🏭 Smart Visitor Pass</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#e2e8f0" }}>{form.company || "Visitor"}</div>
                  <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Hosted by {form.hostEmployee}</div>
                </div>
                {capturedPhoto && <img src={capturedPhoto} alt="Visitor" style={{ width:56, height:56, borderRadius:12, objectFit:"cover", border:"2px solid rgba(52,211,153,0.4)" }} />}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                {[
                  { l:"Visitor ID", v:form.visitorId },
                  { l:"Company", v:form.company },
                  { l:"Department", v:dept?.name },
                  { l:"Visit Date", v:form.visitDate },
                  { l:"Check-In", v:form.checkIn },
                  { l:"Status", v:"✓ Approved" },
                ].map((f, i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.04)", borderRadius:9, padding:"9px 12px", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:9, color:"#64748b", marginBottom:2, textTransform:"uppercase", letterSpacing:"0.08em" }}>{f.l}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:f.l==="Status"?"#34d399":"#e2e8f0", fontFamily:f.l==="Visitor ID"?"'JetBrains Mono',monospace":"inherit" }}>{f.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", background:"rgba(255,255,255,0.96)", borderRadius:14, padding:"20px", gap:10 }}>
                {qrValue && <QRImage value={qrValue} size={180} />}
                <div style={{ fontSize:11, color:"#0a1628", fontFamily:"'JetBrains Mono',monospace", fontWeight:700, letterSpacing:"0.08em" }}>{form.visitorId}</div>
                <div style={{ fontSize:10, color:"#64748b" }}>Scan at entry gate for access</div>
              </div>
              <div style={{ marginTop:16, textAlign:"center", padding:"10px", background:"rgba(52,211,153,0.08)", borderRadius:10, border:"1px solid rgba(52,211,153,0.2)" }}>
                <div style={{ fontSize:11, color:"#34d399", fontWeight:600 }}>✓ Stored in MongoDB · Valid for visit date only</div>
              </div>
            </div>

            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button className="btn-p" style={{ flex:1 }} onClick={() => window.print()}>🖨️ Print Pass</button>
              <button className="btn-s" onClick={resetAll}>New Registration</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

