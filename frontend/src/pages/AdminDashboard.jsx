import { useEffect, useState } from "react";

const visitors = [
  { id: "VIS-001", name: "Arjun Mehta", company: "TechCorp Ltd.", phone: "+91 98765 43210", host: "Rajesh Kumar", date: "2026-03-11", time: "09:15 AM", status: "Approved", purpose: "Equipment Demo", checkIn: "09:20 AM", checkOut: "11:45 AM", inside: false, passId: "PASS-2024-001", validity: "4 hrs" },
  { id: "VIS-002", name: "Priya Sharma", company: "Innovate Solutions", phone: "+91 87654 32109", host: "Anita Desai", date: "2026-03-11", time: "10:00 AM", status: "Pending", purpose: "Business Meeting", checkIn: null, checkOut: null, inside: false, passId: null, validity: null },
  { id: "VIS-003", name: "Mohammed Farhan", company: "SafeGuard Systems", phone: "+91 76543 21098", host: "Vikram Singh", date: "2026-03-11", time: "10:30 AM", status: "Approved", purpose: "Safety Audit", checkIn: "10:35 AM", checkOut: null, inside: true, passId: "PASS-2024-002", validity: "6 hrs" },
  { id: "VIS-004", name: "Sneha Patel", company: "GreenTech Pvt.", phone: "+91 65432 10987", host: "Ravi Nair", date: "2026-03-11", time: "11:00 AM", status: "Rejected", purpose: "Sales Pitch", checkIn: null, checkOut: null, inside: false, passId: null, validity: null },
  { id: "VIS-005", name: "David Fernandez", company: "LogiPrime Inc.", phone: "+91 54321 09876", host: "Sunita Joshi", date: "2026-03-11", time: "11:30 AM", status: "Approved", purpose: "Logistics Review", checkIn: "11:40 AM", checkOut: null, inside: true, passId: "PASS-2024-003", validity: "3 hrs" },
  { id: "VIS-006", name: "Kavya Reddy", company: "SmartAuto Corp.", phone: "+91 43210 98765", host: "Deepak Menon", date: "2026-03-11", time: "02:00 PM", status: "Pending", purpose: "Partnership Discussion", checkIn: null, checkOut: null, inside: false, passId: null, validity: null },
  { id: "VIS-007", name: "Rohan Gupta", company: "FutureTech Labs", phone: "+91 32109 87654", host: "Priya Iyer", date: "2026-03-10", time: "09:00 AM", status: "Approved", purpose: "Technical Consultation", checkIn: "09:05 AM", checkOut: "01:30 PM", inside: false, passId: "PASS-2024-004", validity: "5 hrs" },
  { id: "VIS-008", name: "Aisha Khan", company: "NovaMed Pvt.", phone: "+91 21098 76543", host: "Karthik Rao", date: "2026-03-10", time: "03:00 PM", status: "Approved", purpose: "Compliance Check", checkIn: "03:10 PM", checkOut: "05:00 PM", inside: false, passId: "PASS-2024-005", validity: "2 hrs" },
];

const newRequests = [
  { id: "REQ-001", name: "Nikhil Sharma", company: "AutoDrive Systems", phone: "+91 99887 76655", email: "nikhil@autodrive.com", host: "Manish Tiwari", purpose: "Demo Presentation", date: "2026-03-11", time: "03:00 PM" },
  { id: "REQ-002", name: "Laura Chen", company: "Global Imports Ltd.", phone: "+91 88776 65544", email: "laura@globalimports.com", host: "Pooja Bhatt", purpose: "Vendor Meeting", date: "2026-03-11", time: "04:30 PM" },
];

const statusColor = (status, dark) => {
  if (status === "Approved") return dark ? "#34d399" : "#059669";
  if (status === "Pending") return dark ? "#fbbf24" : "#d97706";
  if (status === "Rejected") return dark ? "#f87171" : "#dc2626";
  return "#6b7280";
};

const statusBg = (status, dark) => {
  if (status === "Approved") return dark ? "rgba(52,211,153,0.15)" : "rgba(5,150,105,0.1)";
  if (status === "Pending") return dark ? "rgba(251,191,36,0.15)" : "rgba(217,119,6,0.1)";
  if (status === "Rejected") return dark ? "rgba(248,113,113,0.15)" : "rgba(220,38,38,0.1)";
  return "transparent";
};

export default function AdminDashboard() {
  const [dark, setDark] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCompany, setFilterCompany] = useState("");
  const [requests, setRequests] = useState(newRequests);
  const [time, setTime] = useState(new Date());
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [animIn, setAnimIn] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const switchTab = (tab) => {
    setAnimIn(false);
    setTimeout(() => { setActiveTab(tab); setAnimIn(true); }, 180);
  };

  const d = {
    bg: dark ? "#0a0f1a" : "#f0f4f8",
    surface: dark ? "#111827" : "#ffffff",
    surface2: dark ? "#1a2235" : "#f8fafc",
    border: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    text: dark ? "#e2e8f0" : "#1a202c",
    muted: dark ? "#64748b" : "#94a3b8",
    accent: "#3b82f6",
    accent2: "#8b5cf6",
    green: dark ? "#34d399" : "#059669",
    yellow: dark ? "#fbbf24" : "#d97706",
    red: dark ? "#f87171" : "#dc2626",
    cyan: dark ? "#22d3ee" : "#0891b2",
  };

  const stats = [
    { label: "Total Today", value: visitors.filter(v => v.date === "2026-03-11").length, icon: "👥", color: d.accent, bg: "rgba(59,130,246,0.12)" },
    { label: "Pending", value: visitors.filter(v => v.status === "Pending").length, icon: "⏳", color: d.yellow, bg: dark ? "rgba(251,191,36,0.12)" : "rgba(217,119,6,0.1)" },
    { label: "Approved", value: visitors.filter(v => v.status === "Approved").length, icon: "✅", color: d.green, bg: dark ? "rgba(52,211,153,0.12)" : "rgba(5,150,105,0.1)" },
    { label: "Rejected", value: visitors.filter(v => v.status === "Rejected").length, icon: "🚫", color: d.red, bg: dark ? "rgba(248,113,113,0.12)" : "rgba(220,38,38,0.1)" },
    { label: "Inside Now", value: visitors.filter(v => v.inside).length, icon: "🏭", color: d.cyan, bg: dark ? "rgba(34,211,238,0.12)" : "rgba(8,145,178,0.1)" },
    { label: "Checked Out", value: visitors.filter(v => v.checkOut).length, icon: "🚪", color: d.accent2, bg: "rgba(139,92,246,0.12)" },
  ];

  const filtered = visitors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || v.status === filterStatus;
    const matchCompany = !filterCompany || v.company.toLowerCase().includes(filterCompany.toLowerCase());
    return matchSearch && matchStatus && matchCompany;
  });

  const navItems = [
    { id: "overview", icon: "⬡", label: "Overview" },
    { id: "requests", icon: "📋", label: "New Requests", badge: requests.length },
    { id: "visitors", icon: "👤", label: "Visitor List" },
    { id: "checkin", icon: "🔄", label: "Check-In/Out" },
    { id: "passes", icon: "🎫", label: "Visitor Passes" },
    { id: "history", icon: "📂", label: "History" },
  ];

  const handleApprove = (id) => setRequests(r => r.filter(x => x.id !== id));
  const handleReject = (id) => setRequests(r => r.filter(x => x.id !== id));

  const cardStyle = {
    background: d.surface,
    border: `1px solid ${d.border}`,
    borderRadius: 16,
    padding: "24px",
    transition: "all 0.3s ease",
  };

  return (
    <div style={{ minHeight: "100vh", background: d.bg, color: d.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: "flex", transition: "all 0.3s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 10px; }
        .nav-item { cursor: pointer; transition: all 0.2s ease; position: relative; }
        .nav-item:hover { background: rgba(59,130,246,0.1) !important; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important; }
        .stat-card { transition: all 0.25s ease; }
        .table-row:hover { background: rgba(59,130,246,0.05) !important; }
        .action-btn:hover { transform: scale(1.05); }
        .action-btn { transition: all 0.2s ease; cursor: pointer; border: none; }
        .page-anim { animation: fadeSlide 0.25s ease; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .badge-pulse { animation: badgePulse 2s infinite; }
        @keyframes badgePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .glass { backdrop-filter: blur(12px); }
        .search-input:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        .toggle-btn:hover { transform: scale(1.1); }
        .toggle-btn { transition: transform 0.2s; cursor: pointer; }
        .inside-dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; display: inline-block; animation: badgePulse 1.5s infinite; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 240, background: dark ? "#0d1424" : "#1e293b", display: "flex", flexDirection: "column", padding: "0 0 24px", position: "sticky", top: 0, height: "100vh", flexShrink: 0, borderRight: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)"}` }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏭</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.05em", lineHeight: 1.2 }}>SMART VISITOR</div>
              <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>PRE-AUTHORIZATION</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "8px 12px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: "0.1em", padding: "12px 8px 6px", textTransform: "uppercase" }}>Navigation</div>
          {navItems.map(item => (
            <div key={item.id} className="nav-item" onClick={() => switchTab(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 2, background: activeTab === item.id ? "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(139,92,246,0.1))" : "transparent", borderLeft: activeTab === item.id ? "2px solid #3b82f6" : "2px solid transparent" }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: activeTab === item.id ? 600 : 400, color: activeTab === item.id ? "#e2e8f0" : "#94a3b8", flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span className="badge-pulse" style={{ background: "#ef4444", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{item.badge}</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: "0 12px" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>ADMIN</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Rajiv Malhotra</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Security Manager</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
              <span className="inside-dot"></span>
              <span style={{ fontSize: 10, color: "#34d399" }}>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ background: d.surface, borderBottom: `1px solid ${d.border}`, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: d.text }}>
              {navItems.find(n => n.id === activeTab)?.label}
            </div>
            <div style={{ fontSize: 11, color: d.muted, fontFamily: "'Space Mono', monospace" }}>
              {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })} · {time.toLocaleTimeString("en-IN")}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: dark ? "rgba(34,211,238,0.1)" : "rgba(8,145,178,0.1)", border: `1px solid ${d.cyan}30`, borderRadius: 8, padding: "5px 12px", fontSize: 12, color: d.cyan, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              <span className="inside-dot" style={{ background: d.cyan }}></span>
              {visitors.filter(v => v.inside).length} inside premises
            </div>
            <button className="toggle-btn" onClick={() => setDark(!dark)}
              style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${d.border}`, background: d.surface2, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }} className={animIn ? "page-anim" : ""}>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {stats.map((s, i) => (
                  <div key={i} className="stat-card" style={{ ...cardStyle, background: s.bg, border: `1px solid ${s.color}25`, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: d.muted, marginTop: 3, fontWeight: 500 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
                <div style={cardStyle}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: d.text, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: d.accent }}>⬡</span> Recent Visitors
                  </div>
                  <div>
                    {visitors.slice(0, 5).map((v, i) => (
                      <div key={i} className="table-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px", borderRadius: 8, borderBottom: i < 4 ? `1px solid ${d.border}` : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: `hsl(${i * 55 + 200},60%,${dark ? 30 : 70}%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: dark ? "#e2e8f0" : "#1a202c", flexShrink: 0 }}>
                            {v.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: d.text }}>{v.name}</div>
                            <div style={{ fontSize: 11, color: d.muted }}>{v.company}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {v.inside && <span className="inside-dot"></span>}
                          <span style={{ fontSize: 11, fontWeight: 600, color: statusColor(v.status, dark), background: statusBg(v.status, dark), padding: "3px 10px", borderRadius: 20 }}>{v.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={cardStyle}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: d.text }}>⏳ Pending Requests</div>
                    {requests.map((r, i) => (
                      <div key={i} style={{ padding: "10px 0", borderBottom: i < requests.length - 1 ? `1px solid ${d.border}` : "none" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: d.text }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: d.muted, marginTop: 2 }}>{r.company} · {r.time}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                          <button className="action-btn" onClick={() => handleApprove(r.id)} style={{ flex: 1, padding: "5px 0", borderRadius: 7, background: dark ? "rgba(52,211,153,0.15)" : "rgba(5,150,105,0.1)", color: d.green, fontSize: 11, fontWeight: 600 }}>✓ Approve</button>
                          <button className="action-btn" onClick={() => handleReject(r.id)} style={{ flex: 1, padding: "5px 0", borderRadius: 7, background: dark ? "rgba(248,113,113,0.15)" : "rgba(220,38,38,0.1)", color: d.red, fontSize: 11, fontWeight: 600 }}>✕ Reject</button>
                        </div>
                      </div>
                    ))}
                    {requests.length === 0 && <div style={{ fontSize: 12, color: d.muted, textAlign: "center", padding: "12px 0" }}>No pending requests</div>}
                  </div>

                  <div style={{ ...cardStyle, background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))", border: `1px solid rgba(99,102,241,0.2)` }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: d.text, marginBottom: 10 }}>🏭 Visitors Inside Now</div>
                    {visitors.filter(v => v.inside).map((v, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span className="inside-dot"></span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: d.text }}>{v.name}</div>
                          <div style={{ fontSize: 10, color: d.muted }}>In since {v.checkIn}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW REQUESTS */}
          {activeTab === "requests" && (
            <div>
              {requests.length === 0 && (
                <div style={{ ...cardStyle, textAlign: "center", padding: "48px" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: d.muted }}>No pending requests</div>
                </div>
              )}
              {requests.map((req, i) => (
                <div key={req.id} style={{ ...cardStyle, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, color: d.muted, fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>{req.id}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: d.text }}>{req.name}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: d.yellow, background: dark ? "rgba(251,191,36,0.12)" : "rgba(217,119,6,0.1)", padding: "4px 12px", borderRadius: 20 }}>⏳ Pending Review</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                    {[
                      { label: "Company", value: req.company, icon: "🏢" },
                      { label: "Phone", value: req.phone, icon: "📱" },
                      { label: "Email", value: req.email, icon: "✉️" },
                      { label: "Host Employee", value: req.host, icon: "👨‍💼" },
                      { label: "Purpose", value: req.purpose, icon: "🎯" },
                      { label: "Visit Time", value: `${req.date} · ${req.time}`, icon: "📅" },
                    ].map((f, j) => (
                      <div key={j} style={{ background: d.surface2, borderRadius: 10, padding: "12px 14px", border: `1px solid ${d.border}` }}>
                        <div style={{ fontSize: 10, color: d.muted, marginBottom: 4, fontWeight: 500 }}>{f.icon} {f.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: d.text }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: d.surface2, borderRadius: 10, padding: "12px 14px", border: `1px dashed ${d.border}`, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: d.muted, fontSize: 12 }}>
                    📎 ID Proof — Not yet uploaded
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="action-btn" onClick={() => handleApprove(req.id)}
                      style={{ flex: 1, padding: "12px", borderRadius: 10, background: "linear-gradient(90deg, #059669, #34d399)", color: "white", fontSize: 14, fontWeight: 600 }}>
                      ✓ Approve Visitor
                    </button>
                    <button className="action-btn" onClick={() => handleReject(req.id)}
                      style={{ flex: 1, padding: "12px", borderRadius: 10, background: dark ? "rgba(248,113,113,0.15)" : "rgba(220,38,38,0.1)", border: `1px solid ${d.red}40`, color: d.red, fontSize: 14, fontWeight: 600 }}>
                      ✕ Reject Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISITOR LIST */}
          {activeTab === "visitors" && (
            <div>
              {/* Search & Filter */}
              <div style={{ ...cardStyle, marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search visitor name or company..."
                  style={{ flex: 2, minWidth: 200, background: d.surface2, border: `1px solid ${d.border}`, borderRadius: 10, padding: "10px 14px", color: d.text, fontSize: 13 }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  style={{ flex: 1, minWidth: 130, background: d.surface2, border: `1px solid ${d.border}`, borderRadius: 10, padding: "10px 14px", color: d.text, fontSize: 13 }}>
                  {["All", "Approved", "Pending", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input value={filterCompany} onChange={e => setFilterCompany(e.target.value)} placeholder="Filter by company..."
                  style={{ flex: 1, minWidth: 150, background: d.surface2, border: `1px solid ${d.border}`, borderRadius: 10, padding: "10px 14px", color: d.text, fontSize: 13 }} />
                <div style={{ fontSize: 12, color: d.muted, whiteSpace: "nowrap" }}>{filtered.length} results</div>
              </div>

              <div style={cardStyle}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${d.border}` }}>
                      {["Visitor ID", "Name", "Company", "Phone", "Host", "Date", "Status"].map((h, i) => (
                        <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, color: d.muted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v, i) => (
                      <tr key={i} className="table-row" style={{ borderBottom: `1px solid ${d.border}`, cursor: "pointer" }} onClick={() => setSelectedVisitor(v)}>
                        <td style={{ padding: "12px 12px", fontSize: 11, color: d.accent, fontFamily: "'Space Mono', monospace" }}>{v.id}</td>
                        <td style={{ padding: "12px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: `hsl(${i * 55 + 200},60%,${dark ? 30 : 70}%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: dark ? "#e2e8f0" : "#1a202c", flexShrink: 0 }}>{v.name.charAt(0)}</div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: d.text }}>{v.name}</span>
                            {v.inside && <span className="inside-dot"></span>}
                          </div>
                        </td>
                        <td style={{ padding: "12px 12px", fontSize: 12, color: d.muted }}>{v.company}</td>
                        <td style={{ padding: "12px 12px", fontSize: 12, color: d.muted, fontFamily: "'Space Mono', monospace" }}>{v.phone}</td>
                        <td style={{ padding: "12px 12px", fontSize: 12, color: d.text }}>{v.host}</td>
                        <td style={{ padding: "12px 12px", fontSize: 11, color: d.muted, fontFamily: "'Space Mono', monospace" }}>{v.date}</td>
                        <td style={{ padding: "12px 12px" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: statusColor(v.status, dark), background: statusBg(v.status, dark), padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{v.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <div style={{ textAlign: "center", padding: "32px", color: d.muted, fontSize: 13 }}>No visitors match your filters</div>}
              </div>

              {/* Visitor Detail Modal */}
              {selectedVisitor && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setSelectedVisitor(null)}>
                  <div style={{ background: d.surface, borderRadius: 20, padding: 28, width: 440, border: `1px solid ${d.border}`, boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: d.text }}>{selectedVisitor.name}</div>
                      <button onClick={() => setSelectedVisitor(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: d.muted }}>✕</button>
                    </div>
                    {[
                      { label: "Visitor ID", value: selectedVisitor.id },
                      { label: "Company", value: selectedVisitor.company },
                      { label: "Phone", value: selectedVisitor.phone },
                      { label: "Host Employee", value: selectedVisitor.host },
                      { label: "Visit Date", value: selectedVisitor.date },
                      { label: "Purpose", value: selectedVisitor.purpose },
                      { label: "Status", value: selectedVisitor.status },
                      { label: "Check-In", value: selectedVisitor.checkIn || "—" },
                      { label: "Check-Out", value: selectedVisitor.checkOut || "—" },
                    ].map((f, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${d.border}`, fontSize: 13 }}>
                        <span style={{ color: d.muted }}>{f.label}</span>
                        <span style={{ color: f.label === "Status" ? statusColor(f.value, dark) : d.text, fontWeight: 500 }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CHECK-IN / CHECK-OUT */}
          {activeTab === "checkin" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={cardStyle}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: d.green, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="inside-dot"></span> Currently Inside
                  </div>
                  {visitors.filter(v => v.inside).map((v, i) => (
                    <div key={i} style={{ background: dark ? "rgba(52,211,153,0.08)" : "rgba(5,150,105,0.05)", border: `1px solid rgba(52,211,153,0.2)`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: d.text }}>{v.name}</div>
                          <div style={{ fontSize: 11, color: d.muted, marginTop: 2 }}>{v.company}</div>
                        </div>
                        <span style={{ background: dark ? "rgba(52,211,153,0.15)" : "rgba(5,150,105,0.1)", color: d.green, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>INSIDE</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                        <div style={{ background: d.surface2, borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 9, color: d.muted, marginBottom: 2 }}>CHECK-IN</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: d.green, fontFamily: "'Space Mono', monospace" }}>{v.checkIn}</div>
                        </div>
                        <div style={{ background: d.surface2, borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 9, color: d.muted, marginBottom: 2 }}>HOST</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: d.text }}>{v.host}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 11, color: d.muted }}>Gate: <span style={{ color: d.accent, fontWeight: 600 }}>Main Gate — Entry Authorized</span></div>
                    </div>
                  ))}
                </div>

                <div style={cardStyle}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: d.muted, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                    🚪 Checked Out Today
                  </div>
                  {visitors.filter(v => v.checkOut).map((v, i) => (
                    <div key={i} style={{ background: d.surface2, border: `1px solid ${d.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: d.text }}>{v.name}</div>
                          <div style={{ fontSize: 11, color: d.muted, marginTop: 2 }}>{v.company}</div>
                        </div>
                        <span style={{ background: dark ? "rgba(100,116,139,0.2)" : "rgba(148,163,184,0.2)", color: d.muted, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>LEFT</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                        <div style={{ background: d.surface, borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 9, color: d.muted, marginBottom: 2 }}>CHECK-IN</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: d.text, fontFamily: "'Space Mono', monospace" }}>{v.checkIn}</div>
                        </div>
                        <div style={{ background: d.surface, borderRadius: 8, padding: "8px 10px" }}>
                          <div style={{ fontSize: 9, color: d.muted, marginBottom: 2 }}>CHECK-OUT</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: d.text, fontFamily: "'Space Mono', monospace" }}>{v.checkOut}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VISITOR PASSES */}
          {activeTab === "passes" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {visitors.filter(v => v.passId).map((v, i) => (
                <div key={i} style={{ background: `linear-gradient(135deg, ${dark ? "#111827" : "#ffffff"}, ${dark ? "#1a2235" : "#f0f7ff"})`, border: `1px solid ${d.accent}30`, borderRadius: 16, padding: 24, position: "relative", overflow: "hidden" }}>
                  {/* Decorative circle */}
                  <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))", pointerEvents: "none" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, color: d.muted, fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>VISITOR PASS</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: d.text }}>{v.name}</div>
                    </div>
                    <div style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 10, padding: "6px 12px" }}>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", marginBottom: 1 }}>PASS ID</div>
                      <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: "white", fontWeight: 700 }}>{v.passId}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    {[
                      { l: "Host", v: v.host },
                      { l: "Date", v: v.date },
                      { l: "Purpose", v: v.purpose },
                      { l: "Validity", v: v.validity },
                    ].map((f, j) => (
                      <div key={j} style={{ background: d.surface2, borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 9, color: d.muted, marginBottom: 2 }}>{f.l.toUpperCase()}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: d.text }}>{f.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: `1px dashed ${d.border}`, paddingTop: 12 }}>
                    <div style={{ width: 52, height: 52, background: dark ? "#0a0f1a" : "#f0f4f8", borderRadius: 8, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, padding: 4 }}>
                      {Array.from({ length: 9 }).map((_, k) => (
                        <div key={k} style={{ background: [0,2,6,8].includes(k) ? d.accent : (k === 4 ? "transparent" : d.muted + "40"), borderRadius: 2 }}></div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: d.muted, marginBottom: 2 }}>QR / PASS NUMBER</div>
                      <div style={{ fontSize: 12, fontFamily: "'Space Mono', monospace", color: d.accent, fontWeight: 700 }}>#{v.passId?.replace("PASS-", "")}-{v.date.replace(/-/g, "")}</div>
                      <div style={{ fontSize: 10, color: v.inside ? d.green : d.muted, marginTop: 2 }}>{v.inside ? "✓ Active" : "Completed"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HISTORY */}
          {activeTab === "history" && (
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 600, color: d.text, marginBottom: 16 }}>📂 Visit History</div>
              {visitors.filter(v => v.checkIn).map((v, i) => (
                <div key={i} className="table-row" style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 10px", borderBottom: `1px solid ${d.border}`, borderRadius: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `hsl(${i * 55 + 200},60%,${dark ? 30 : 70}%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: dark ? "#e2e8f0" : "#1a202c", flexShrink: 0 }}>{v.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: d.text }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: d.muted }}>{v.company} · Host: {v.host}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: d.muted }}>Purpose</div>
                    <div style={{ fontSize: 12, color: d.text, fontWeight: 500 }}>{v.purpose}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: d.muted }}>Date</div>
                    <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: d.text }}>{v.date}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: d.muted }}>In / Out</div>
                    <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: d.text }}>{v.checkIn} → {v.checkOut || "—"}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: statusColor(v.status, dark), background: statusBg(v.status, dark), padding: "3px 10px", borderRadius: 20 }}>{v.status}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

