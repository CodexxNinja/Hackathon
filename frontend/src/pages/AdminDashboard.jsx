import { useEffect, useState } from "react";

// ── Theme tokens (mirrors VisitorForm) ────────────────────────────────────
const DARK = {
  bg: "#070d1a", surface: "#0d1628", surface2: "#111f36", surface3: "#0a1221",
  border: "rgba(148,163,184,0.10)", accent: "#38bdf8", accent2: "#818cf8",
  success: "#34d399", warning: "#fbbf24", error: "#f87171", text: "#e2e8f0",
  muted: "#64748b", inputBg: "#111f36", shadow: "0 0 32px rgba(56,189,248,0.10)",
  blobA: "rgba(56,189,248,0.07)", blobB: "rgba(129,140,248,0.08)",
  toggleBg: "#0d1628", toggleBorder: "rgba(56,189,248,0.35)",
  cardBorder: "rgba(148,163,184,0.08)", glass: "rgba(13,22,40,0.85)",
};
const LIGHT = {
  bg: "#eef4ff", surface: "#ffffff", surface2: "#f4f8ff", surface3: "#e8f0fe",
  border: "rgba(59,130,246,0.14)", accent: "#0284c7", accent2: "#6d28d9",
  success: "#059669", warning: "#d97706", error: "#dc2626", text: "#0f172a",
  muted: "#64748b", inputBg: "#f8fbff", shadow: "0 4px 28px rgba(59,130,246,0.10)",
  blobA: "rgba(56,189,248,0.14)", blobB: "rgba(129,140,248,0.12)",
  toggleBg: "#ffffff", toggleBorder: "rgba(59,130,246,0.28)",
  cardBorder: "rgba(59,130,246,0.10)", glass: "rgba(255,255,255,0.90)",
};

const DEPT_META = {
  chemical:   { color: "#f59e0b", icon: "⚗️", bg: "#f59e0b18" },
  food:       { color: "#22c55e", icon: "🍱", bg: "#22c55e18" },
  electrical: { color: "#3b82f6", icon: "⚡", bg: "#3b82f618" },
  mechanical: { color: "#8b5cf6", icon: "⚙️", bg: "#8b5cf618" },
};

const STATUS_META = {
  Approved: { color: "#34d399", bg: "#34d39918", label: "Approved" },
  Pending:  { color: "#fbbf24", bg: "#fbbf2418", label: "Pending"  },
  Rejected: { color: "#f87171", bg: "#f8717118", label: "Rejected" },
};

// ── Mock data (replace with real fetch from /get-visitors) ────────────────
const MOCK_VISITORS = [
  { _id:"1", visitorId:"VIS-A1B2C3", company:"TechCorp Ltd.",     hostEmployee:"Rajesh Kumar",  visitDate:"2025-07-18", checkIn:"09:00", checkOut:"17:00", department:"chemical",   purpose:"Audit & Inspection",        quizScore:4, status:"Approved", phone:"+91 98765 43210" },
  { _id:"2", visitorId:"VIS-D4E5F6", company:"GreenBuild Inc.",   hostEmployee:"Priya Sharma",  visitDate:"2025-07-18", checkIn:"10:30", checkOut:"15:00", department:"mechanical", purpose:"Equipment Commissioning",    quizScore:3, status:"Approved", phone:"+91 87654 32109" },
  { _id:"3", visitorId:"VIS-G7H8I9", company:"NovaPharma",        hostEmployee:"Amit Patel",    visitDate:"2025-07-19", checkIn:"11:00", checkOut:"13:00", department:"food",       purpose:"Quality Control Visit",      quizScore:4, status:"Pending",  phone:"+91 76543 21098" },
  { _id:"4", visitorId:"VIS-J1K2L3", company:"PowerGrid Corp",    hostEmployee:"Sunita Nair",   visitDate:"2025-07-19", checkIn:"08:30", checkOut:"16:30", department:"electrical", purpose:"Maintenance Review",         quizScore:2, status:"Rejected", phone:"+91 65432 10987" },
  { _id:"5", visitorId:"VIS-M4N5O6", company:"FreshFoods Co.",    hostEmployee:"Vikram Singh",  visitDate:"2025-07-20", checkIn:"09:00", checkOut:"12:00", department:"food",       purpose:"Supplier Verification",      quizScore:4, status:"Approved", phone:"+91 54321 09876" },
  { _id:"6", visitorId:"VIS-P7Q8R9", company:"ChemSolutions",     hostEmployee:"Deepa Menon",   visitDate:"2025-07-20", checkIn:"14:00", checkOut:"18:00", department:"chemical",   purpose:"Safety Protocol Review",     quizScore:3, status:"Approved", phone:"+91 43210 98765" },
  { _id:"7", visitorId:"VIS-S1T2U3", company:"MachineWorks Ltd.", hostEmployee:"Rohit Gupta",   visitDate:"2025-07-21", checkIn:"10:00", checkOut:"16:00", department:"mechanical", purpose:"Installation Oversight",     quizScore:4, status:"Pending",  phone:"+91 32109 87654" },
  { _id:"8", visitorId:"VIS-V4W5X6", company:"ElectroPower",      hostEmployee:"Anita Desai",   visitDate:"2025-07-21", checkIn:"09:30", checkOut:"14:30", department:"electrical", purpose:"Circuit Testing",            quizScore:3, status:"Approved", phone:"+91 21098 76543" },
];

// ── Mini spark line ───────────────────────────────────────────────────────
const SparkLine = ({ data, color, width = 80, height = 32 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ── Donut chart ───────────────────────────────────────────────────────────
const DonutChart = ({ slices, size = 120, stroke = 22 }) => {
  const r = (size - stroke) / 2, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      {slices.map((sl, i) => {
        const dash = (sl.value / total) * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={sl.color} strokeWidth={stroke}
            strokeDasharray={`${dash - 2} ${gap + 2}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.22,1,.36,1)" }}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
};

// ── Badge ─────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.Pending;
  return (
    <span style={{ background: m.bg, color: m.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em", border: `1px solid ${m.color}33` }}>
      {m.label}
    </span>
  );
};

// ── Score pill ────────────────────────────────────────────────────────────
const ScorePill = ({ score, T }) => {
  const color = score >= 3 ? T.success : T.error;
  return (
    <span style={{ background: color + "18", color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1px solid ${color}33` }}>
      {score}/4
    </span>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, color, spark, T }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.cardBorder}`, borderRadius: 18, padding: "22px 24px", boxShadow: T.shadow, display: "flex", flexDirection: "column", gap: 4, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "50%", background: color + "0e", filter: "blur(30px)", pointerEvents: "none" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ fontSize: 26, lineHeight: 1 }}>{icon}</div>
      {spark && <SparkLine data={spark} color={color} />}
    </div>
    <div style={{ fontSize: 30, fontWeight: 800, color: T.text, fontFamily: "'JetBrains Mono', monospace", marginTop: 8, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: T.muted }}>{sub}</div>}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)`, borderRadius: "0 0 18px 18px" }} />
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────
const Modal = ({ visitor, onClose, T, dark }) => {
  if (!visitor) return null;
  const dept = DEPT_META[visitor.department] || { color: T.accent, icon: "🏢", bg: T.accent + "18" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: 32, maxWidth: 480, width: "100%", boxShadow: `0 24px 60px rgba(0,0,0,0.4)`, animation: "fu 0.25s cubic-bezier(.22,1,.36,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Visitor Details</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{visitor.company}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{visitor.visitorId}</div>
          </div>
          <button onClick={onClose} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, width: 34, height: 34, cursor: "pointer", color: T.muted, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { l: "Host Employee", v: visitor.hostEmployee, icon: "👨‍💼" },
            { l: "Phone", v: visitor.phone, icon: "📱" },
            { l: "Visit Date", v: visitor.visitDate, icon: "📅" },
            { l: "Check-In", v: visitor.checkIn, icon: "🟢" },
            { l: "Check-Out", v: visitor.checkOut, icon: "🔴" },
            { l: "Purpose", v: visitor.purpose, icon: "🎯" },
          ].map((r, i) => (
            <div key={i} style={{ background: T.surface2, borderRadius: 10, padding: "10px 12px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 3, fontWeight: 600 }}>{r.icon} {r.l}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{r.v || "—"}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ background: dept.bg, border: `1px solid ${dept.color}44`, borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <span>{dept.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: dept.color }}>{visitor.department}</span>
          </div>
          <Badge status={visitor.status} />
          <ScorePill score={visitor.quizScore} T={T} />
        </div>

        {visitor.photo && (
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <img src={visitor.photo} alt="Visitor" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", border: `2px solid ${T.border}` }} />
            <span style={{ fontSize: 11, color: T.muted }}>Passport photo on file</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [dark, setDark] = useState(true);
  const T = dark ? DARK : LIGHT;

  const [visitors, setVisitors] = useState(MOCK_VISITORS);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState("");
  const [filterDept, setFilterDept]     = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey]   = useState("visitDate");
  const [sortDir, setSortDir]   = useState("desc");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [activeNav, setActiveNav] = useState("visitors");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anim, setAnim] = useState(true);

  // Fetch from backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/get-visitors");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setVisitors(data);
        }
      } catch {
        // use mock data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Derived stats
  const total = visitors.length;

  const deptCounts = ["chemical","food","electrical","mechanical"].map(d => ({
    name: d, value: visitors.filter(v => v.department === d).length,
    color: DEPT_META[d]?.color || T.accent,
    icon: DEPT_META[d]?.icon || "🏢",
  }));

  // Spark trend data
  const spark1 = [3,5,4,7,6,8,total];

  // Filtered & sorted
  const filtered = visitors
    .filter(v => {
      const q = search.toLowerCase();
      return (!q || v.company?.toLowerCase().includes(q) || v.visitorId?.toLowerCase().includes(q) || v.hostEmployee?.toLowerCase().includes(q))
        && (filterDept   === "all" || v.department === filterDept)
        && (filterStatus === "all" || v.status     === filterStatus);
    })
    .sort((a, b) => {
      const va = a[sortKey] || "", vb = b[sortKey] || "";
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const toggleSort = (key) => { if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("asc"); } };

  const navItems = [
    { id: "visitors",  icon: "👥", label: "Visitors" },
    { id: "settings",  icon: "⚙️", label: "Settings" },
  ];

  const iS = { background: T.inputBg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 14px", color: T.text, fontSize: 13, outline: "none", fontFamily: "inherit" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Outfit','DM Sans',sans-serif", transition: "background 0.35s,color 0.35s", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,select{font-family:'Outfit',sans-serif!important}
        input:focus,select:focus{border-color:${T.accent}!important;box-shadow:0 0 0 3px ${T.accent}28!important;outline:none}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:8px}
        .btn-p{background:linear-gradient(135deg,${T.accent},${T.accent2});border:none;color:#fff;font-weight:700;font-size:13px;border-radius:10px;padding:9px 20px;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .btn-p:hover{transform:translateY(-1px);box-shadow:0 6px 20px ${T.accent}44}
        .btn-s{background:transparent;border:1.5px solid ${T.border};color:${T.muted};font-weight:600;font-size:12px;border-radius:9px;padding:8px 16px;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif}
        .btn-s:hover{border-color:${T.accent};color:${T.accent}}
        .fade-up{animation:fu 0.35s cubic-bezier(.22,1,.36,1)}
        @keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .nav-item{cursor:pointer;transition:all 0.2s;border-radius:12px;border:1px solid transparent}
        .nav-item:hover{background:${T.surface2}!important;border-color:${T.border}!important}
        .tr:hover{background:${T.surface2}!important}
        .tr{transition:background 0.15s;cursor:pointer}
        .sort-btn{cursor:pointer;user-select:none;transition:color 0.15s}
        .sort-btn:hover{color:${T.accent}!important}
        .tog{transition:all 0.28s ease;cursor:pointer}
        .tog:hover{transform:scale(1.12) rotate(18deg)}
        select option{background:${dark ? "#0d1628" : "#fff"};color:${T.text}}
        .refresh-spin{animation:spin 1s linear infinite}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      `}</style>

      {/* ── Sidebar ── */}
      <div style={{
        width: sidebarOpen ? 220 : 72, flexShrink: 0, background: T.surface,
        borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(.22,1,.36,1)", overflow: "hidden",
        position: "relative", zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 18px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, minHeight: 72 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${T.accent},${T.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏭</div>
          {sidebarOpen && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.text, lineHeight: 1.2 }}>VisitorPro</div>
              <div style={{ fontSize: 10, color: T.muted, fontWeight: 500 }}>Admin Console</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => (
            <div key={item.id} className="nav-item"
              onClick={() => setActiveNav(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "11px 12px",
                background: activeNav === item.id ? T.accent + "18" : "transparent",
                borderColor: activeNav === item.id ? T.accent + "44" : "transparent",
                color: activeNav === item.id ? T.accent : T.muted,
              }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 13, fontWeight: activeNav === item.id ? 700 : 500, whiteSpace: "nowrap" }}>{item.label}</span>}
              {sidebarOpen && activeNav === item.id && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: T.accent }} />}
            </div>
          ))}
        </nav>

        {/* Collapse btn */}
        <div style={{ padding: "12px 10px", borderTop: `1px solid ${T.border}` }}>
          <div className="nav-item" onClick={() => setSidebarOpen(o => !o)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", color: T.muted }}>
            <span style={{ fontSize: 17, flexShrink: 0, transform: sidebarOpen ? "scaleX(-1)" : "scaleX(1)", transition: "transform 0.3s" }}>◀</span>
            {sidebarOpen && <span style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>Collapse</span>}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <header style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>
              {activeNav === "visitors"  && "Visitor Registry"}
              {activeNav === "settings"  && "Settings"}
            </div>
            <div style={{ fontSize: 11, color: T.muted }}>
              {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Refresh */}
            <button className="btn-s" style={{ padding: "7px 13px" }} onClick={async () => {
              setLoading(true);
              await new Promise(r => setTimeout(r, 800));
              setLoading(false);
            }}>
              <span className={loading ? "refresh-spin" : ""} style={{ display: "inline-block" }}>↻</span>
              {" "}{loading ? "Loading…" : "Refresh"}
            </button>
            {/* Theme toggle */}
            <button className="tog" onClick={() => setDark(d => !d)}
              style={{ width: 40, height: 40, borderRadius: "50%", background: T.toggleBg, border: `1.5px solid ${T.toggleBorder}`, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {dark ? "☀️" : "🌙"}
            </button>
            {/* Avatar */}
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${T.accent},${T.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", cursor: "pointer" }}>A</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: "28px" }} className="fade-up">

          {/* ── VISITORS TAB ── */}
          {activeNav === "visitors" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Total Visitors stat card */}
              <StatCard label="Total Visitors" value={total} sub="All time registrations" icon="👥" color={T.accent} spark={spark1} T={T} />

              {/* Filters */}
              <div style={{ background: T.surface, border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: "18px 22px", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", boxShadow: T.shadow }}>
                <div style={{ position: "relative", flex: "1 1 200px" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
                  <input style={{ ...iS, paddingLeft: 36, width: "100%" }} placeholder="Search company, visitor ID, host…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select style={{ ...iS, flex: "0 0 auto", minWidth: 140 }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                  <option value="all">All Departments</option>
                  {["chemical","food","electrical","mechanical"].map(d => <option key={d} value={d}>{DEPT_META[d].icon} {d}</option>)}
                </select>
                <select style={{ ...iS, flex: "0 0 auto", minWidth: 130 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="Approved">✅ Approved</option>
                  <option value="Pending">⏳ Pending</option>
                  <option value="Rejected">❌ Rejected</option>
                </select>
                <div style={{ fontSize: 12, color: T.muted, whiteSpace: "nowrap" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
                {(search || filterDept !== "all" || filterStatus !== "all") && (
                  <button className="btn-s" style={{ padding: "8px 14px" }} onClick={() => { setSearch(""); setFilterDept("all"); setFilterStatus("all"); }}>✕ Clear</button>
                )}
              </div>

              {/* Table */}
              <div style={{ background: T.surface, border: `1px solid ${T.cardBorder}`, borderRadius: 18, boxShadow: T.shadow, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: T.surface2, borderBottom: `1px solid ${T.border}` }}>
                        {[
                          { key: "visitorId",    label: "Visitor ID"  },
                          { key: "company",      label: "Company"     },
                          { key: "hostEmployee", label: "Host"        },
                          { key: "department",   label: "Department"  },
                          { key: "visitDate",    label: "Visit Date"  },
                          { key: "checkIn",      label: "Check-In"    },
                          { key: "quizScore",    label: "Quiz"        },
                          { key: "status",       label: "Status"      },
                          { key: null,           label: "Action"      },
                        ].map(h => (
                          <th key={h.label} className={h.key ? "sort-btn" : ""} onClick={() => h.key && toggleSort(h.key)}
                            style={{ padding: "12px 14px", fontSize: 10, color: sortKey === h.key ? T.accent : T.muted, fontWeight: 700, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", userSelect: "none" }}>
                            {h.label} {h.key && (sortKey === h.key ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 && (
                        <tr><td colSpan={9} style={{ padding: "40px", textAlign: "center", color: T.muted, fontSize: 14 }}>No visitors found</td></tr>
                      )}
                      {filtered.map((v, idx) => {
                        const dm = DEPT_META[v.department] || { color: T.accent, icon: "🏢" };
                        return (
                          <tr key={v._id} className="tr" style={{ borderBottom: `1px solid ${T.border}`, animationDelay: `${idx * 0.03}s` }}>
                            <td style={{ padding: "12px 14px", fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: T.accent, fontWeight: 700 }}>{v.visitorId}</td>
                            <td style={{ padding: "12px 14px" }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{v.company}</div>
                              <div style={{ fontSize: 11, color: T.muted }}>{v.phone}</div>
                            </td>
                            <td style={{ padding: "12px 14px", fontSize: 12, color: T.text }}>{v.hostEmployee}</td>
                            <td style={{ padding: "12px 14px" }}>
                              <span style={{ background: dm.color + "18", color: dm.color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, border: `1px solid ${dm.color}33` }}>
                                {dm.icon} {v.department}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", fontSize: 12, color: T.muted, fontFamily: "'JetBrains Mono',monospace" }}>{v.visitDate}</td>
                            <td style={{ padding: "12px 14px", fontSize: 12, color: T.muted }}>{v.checkIn || "—"}</td>
                            <td style={{ padding: "12px 14px" }}><ScorePill score={v.quizScore} T={T} /></td>
                            <td style={{ padding: "12px 14px" }}><Badge status={v.status} /></td>
                            <td style={{ padding: "12px 14px" }}>
                              <button className="btn-s" style={{ padding: "6px 12px", fontSize: 11 }} onClick={() => setSelectedVisitor(v)}>View →</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: "12px 18px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: T.muted }}>Showing {filtered.length} of {total} visitors</span>
                  <button className="btn-s" style={{ fontSize: 11, padding: "6px 14px" }} onClick={() => {
                    const csv = ["Visitor ID,Company,Host,Department,Date,Check-In,Check-Out,Score,Status",
                      ...filtered.map(v => `${v.visitorId},${v.company},${v.hostEmployee},${v.department},${v.visitDate},${v.checkIn},${v.checkOut},${v.quizScore}/4,${v.status}`)
                    ].join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url; a.download = "visitors.csv"; a.click();
                  }}>⬇ Export CSV</button>
                </div>
              </div>
            </div>
          )}


          {/* ── SETTINGS TAB ── */}
          {activeNav === "settings" && (
            <div style={{ maxWidth: 560 }}>
              <div style={{ background: T.surface, border: `1px solid ${T.cardBorder}`, borderRadius: 18, padding: "28px", boxShadow: T.shadow }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 20 }}>System Settings</div>
                {[
                  { label: "Backend API URL",    value: "http://localhost:5000",          icon: "🔗" },
                  { label: "Database",           value: "MongoDB Atlas — visitor_management", icon: "🗄️" },
                  { label: "Auth Mode",          value: "JWT + OTP Verification",         icon: "🔐" },
                  { label: "QR Expiry",          value: "Visit date only",                icon: "⏰" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 12, color: T.muted, fontFamily: "'JetBrains Mono',monospace" }}>{s.value}</span>
                  </div>
                ))}
                <div style={{ marginTop: 20, background: T.success + "10", border: `1px solid ${T.success}22`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span>🟢</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>System operational — all services running</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Detail Modal ── */}
      <Modal visitor={selectedVisitor} onClose={() => setSelectedVisitor(null)} T={T} dark={dark} />
    </div>
  );
}