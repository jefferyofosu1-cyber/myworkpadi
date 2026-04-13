import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  AlertTriangle, 
  Banknote, 
  TrendingUp, 
  Settings as SettingsIcon,
  Zap,
  CheckCircle,
  Camera,
  Flag,
  ArrowRight,
  ArrowDown,
  ChevronDown,
  MoreHorizontal,
  Info,
  Check,
  X,
  Phone,
  MessageSquare,
  Shield,
  Search,
  Plus,
  ArrowLeft,
  Smartphone
} from "lucide-react";

/* --- FONTS --- */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { -webkit-font-smoothing: antialiased; }

    @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes slideIn  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes spin     { to{transform:rotate(360deg)} }
    @keyframes barFill  { from{width:0} to{width:var(--w,100%)} }
    @keyframes countUp  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes ping     { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2);opacity:0} }
    @keyframes glow     { 0%,100%{box-shadow:0 0 8px rgba(10,110,74,0.3)} 50%{box-shadow:0 0 20px rgba(10,110,74,0.6)} }

    .page-enter { animation: fadeUp 0.35s ease both; }
    .slide-in   { animation: slideIn 0.3s ease both; }
    .fade-in    { animation: fadeIn 0.25s ease both; }

    .row-hover { transition: background 0.15s; cursor: pointer; }
    .row-hover:hover { background: rgba(255,255,255,0.02); }

    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px; cursor: pointer;
      transition: all 0.15s; border: 1px solid transparent;
      font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
      color: rgba(255,255,255,0.5); white-space: nowrap;
    }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
    .nav-item.active { background: rgba(10,110,74,0.18); color: #12A06B; border-color: rgba(10,110,74,0.3); }
    .nav-item .icon { font-size: 16px; width: 20px; display: flex; align-items: center; justify-content: center; }
    .nav-badge { margin-left: auto; background: #EF4444; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px; font-family: 'DM Sans', sans-serif; }

    .metric-card {
      background: #12121C; border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px; padding: 20px 22px;
      transition: border-color 0.2s;
    }
    .metric-card:hover { border-color: rgba(255,255,255,0.14); }

    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th {
      text-align: left; padding: 10px 16px;
      font-family: 'DM Sans', sans-serif; font-size: 11px;
      font-weight: 600; color: rgba(255,255,255,0.35);
      letter-spacing: 0.1em; text-transform: uppercase;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      white-space: nowrap;
    }
    .data-table td {
      padding: 13px 16px; font-family: 'DM Sans', sans-serif;
      font-size: 13px; color: rgba(255,255,255,0.85);
      border-bottom: 1px solid rgba(255,255,255,0.04);
      vertical-align: middle;
    }
    .data-table tr:last-child td { border-bottom: none; }

    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 8px; border: none;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      font-weight: 600; font-size: 13px; transition: all 0.15s;
      white-space: nowrap;
    }
    .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 7px; }
    .btn-green { background: #0A6E4A; color: #fff; }
    .btn-green:hover { background: #0D8559; }
    .btn-red { background: #EF4444; color: #fff; }
    .btn-red:hover { background: #DC2626; }
    .btn-gold { background: #E8A020; color: #fff; }
    .btn-gold:hover { background: #D4901A; }
    .btn-ghost { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.75); border: 1px solid rgba(255,255,255,0.1); }
    .btn-ghost:hover { background: rgba(255,255,255,0.12); }
    .btn-blue { background: #3B82F6; color: #fff; }
    .btn-blue:hover { background: #2563EB; }

    .badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 9px; border-radius: 6px;
      font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
      white-space: nowrap;
    }

    .input-field {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px; padding: 9px 12px; color: rgba(255,255,255,0.9);
      font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none;
      transition: border-color 0.15s;
    }
    .input-field::placeholder { color: rgba(255,255,255,0.28); }
    .input-field:focus { border-color: rgba(10,110,74,0.6); }
    select.input-field { cursor: pointer; appearance: none; }
    textarea.input-field { resize: vertical; line-height: 1.6; }

    .panel {
      background: #12121C; border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px; overflow: hidden;
    }
    .panel-header {
      padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex; align-items: center; justify-content: space-between;
    }
    .panel-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: rgba(255,255,255,0.9); }

    .progress-bar { height: 5px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 3px; animation: barFill 0.8s ease both; }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.72);
      backdrop-filter: blur(6px); z-index: 200;
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    .modal {
      background: #15151F; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px; padding: 28px; width: 540px; max-width: 95vw;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      animation: fadeUp 0.25s ease;
    }

    .chart-bar { transition: height 0.6s ease; cursor: pointer; }
    .chart-bar:hover { opacity: 0.8; }

    .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; position: relative; }
    .live-dot::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; background: rgba(16,185,129,0.3); animation: ping 1.8s ease-out infinite; }

    .scrollable { overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
    .scrollable::-webkit-scrollbar { width: 4px; }
    .scrollable::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    .tag { display: inline-block; padding: 2px 8px; border-radius: 5px; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
    .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

    .section-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 20px 0; }

    .action-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

    .toast-stack { position: fixed; bottom: 24px; right: 24px; z-index: 300; display: flex; flex-direction: column; gap: 10px; }
    .toast {
      background: #1E1E2E; border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px; padding: 14px 18px; display: flex; gap: 10px;
      align-items: center; min-width: 280px; max-width: 380px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      animation: slideIn 0.3s ease; font-family: 'DM Sans', sans-serif; font-size: 13px;
      color: rgba(255,255,255,0.9);
    }
  `}</style>
);

/* --- TOKENS --- */
const C = {
  bg: "#0D0D16", sidebar: "#0A0A13", surface: "#12121C",
  surface2: "#1A1A28", border: "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.13)",
  green: "#0A6E4A", greenLight: "#12A06B", greenPale: "rgba(10,110,74,0.18)",
  gold: "#E8A020", goldPale: "rgba(232,160,32,0.15)",
  red: "#EF4444", redPale: "rgba(239,68,68,0.15)",
  blue: "#3B82F6", bluePale: "rgba(59,130,246,0.15)",
  purple: "#A78BFA", purplePale: "rgba(167,139,250,0.15)",
  text: "rgba(255,255,255,0.9)", textSoft: "rgba(255,255,255,0.6)", textMuted: "rgba(255,255,255,0.3)",
};
const FD = "'Syne', sans-serif";
const FB = "'DM Sans', sans-serif";
const FM = "'JetBrains Mono', monospace";

/* --- HELPERS --- */
const Badge = ({ color, bg, children, dot }) => (
  <span className="badge" style={{ background: bg || color + "20", color, border: `1px solid ${color}33` }}>
    {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, animation: "pulse 1.5s infinite" }} />}
    {children}
  </span>
);

const Th = ({ children, style }) => (
  <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 13, color: C.text, ...style }}>{children}</p>
);

const Label = ({ children }) => (
  <p style={{ fontFamily: FB, fontSize: 11, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{children}</p>
);

const Row = ({ label, value, mono, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
    <span style={{ fontFamily: FB, fontSize: 13, color: C.textSoft }}>{label}</span>
    <span style={{ fontFamily: mono ? FM : FB, fontSize: mono ? 12 : 13, color: color || C.text, fontWeight: 500 }}>{value}</span>
  </div>
);

/* --- DATA --- */
const TASKERS_DATA = [
  { id: "TSK-001", name: "Emmanuel K.", phone: "+233 054 000 6712", skill: "AC Repair", area: "East Legon", rating: 4.9, jobs: 247, status: "active", badge: "Elite", joined: "Jan 2026", earnings: "GHS 4,820", disputes: 0, verified: true },
  { id: "TSK-002", name: "Abena M.",    phone: "+233 024 111 8833", skill: "Cleaning",  area: "Airport Area", rating: 4.8, jobs: 189, status: "active", badge: null,   joined: "Feb 2026", earnings: "GHS 3,240", disputes: 1, verified: true },
  { id: "TSK-003", name: "Kwabena O.", phone: "+233 055 222 4455", skill: "Plumbing",  area: "Cantonments", rating: 5.0, jobs: 312, status: "active", badge: "Elite", joined: "Dec 2025", earnings: "GHS 6,100", disputes: 0, verified: true },
  { id: "TSK-004", name: "Samuel T.",  phone: "+233 027 333 9900", skill: "Electrical", area: "Tema",       rating: 4.2, jobs: 34,  status: "suspended", badge: null, joined: "Mar 2026", earnings: "GHS 820",  disputes: 3, verified: true },
  { id: "TSK-005", name: "Grace A.",   phone: "+233 050 444 1122", skill: "Cleaning",  area: "Spintex",     rating: 0,   jobs: 0,   status: "pending",   badge: null, joined: "Apr 2026", earnings: "GHS 0",    disputes: 0, verified: false },
  { id: "TSK-006", name: "Kofi B.",    phone: "+233 024 555 3344", skill: "Painting & Decor", area: "Osu",         rating: 4.6, jobs: 58,  status: "active",    badge: null, joined: "Feb 2026", earnings: "GHS 1,890", disputes: 0, verified: true },
  { id: "TSK-007", name: "Ama D.",     phone: "+233 055 666 7788", skill: "Fumigation", area: "Adenta",     rating: 4.7, jobs: 92,  status: "active",    badge: null, joined: "Jan 2026", earnings: "GHS 2,340", disputes: 1, verified: true },
  { id: "TSK-008", name: "Mensah K.",  phone: "+233 020 777 9911", skill: "CCTV",      area: "East Legon",  rating: 0,   jobs: 0,   status: "pending",   badge: null, joined: "Apr 2026", earnings: "GHS 0",    disputes: 0, verified: false },
];

const DISPUTES_DATA = [
  { id: "DIS-441", booking: "BK-7841", customer: "Sandra A.", tasker: "Emmanuel K.", issue: "Job not completed properly - AC still not cooling after fix", amount: "GHS 355", status: "open",         raised: "2 hrs ago",   priority: "high",   evidence: 3 },
  { id: "DIS-440", booking: "BK-7823", customer: "Kofi B.",  tasker: "Samuel T.",  issue: "Tasker arrived 4 hours late, did poor electrical work",         amount: "GHS 200", status: "investigating", raised: "1 day ago",   priority: "high",   evidence: 5 },
  { id: "DIS-439", booking: "BK-7810", customer: "Ama S.",   tasker: "Abena M.",   issue: "Cleaning was incomplete - bathrooms not cleaned",               amount: "GHS 120", status: "investigating", raised: "2 days ago",  priority: "medium", evidence: 2 },
  { id: "DIS-438", booking: "BK-7795", customer: "Nana O.",  tasker: "Kofi B.",    issue: "Paint colour was wrong despite customer specifying it clearly",  amount: "GHS 280", status: "resolved",     raised: "3 days ago",  priority: "low",    evidence: 4 },
  { id: "DIS-437", booking: "BK-7781", customer: "Efua M.",  tasker: "Kwabena O.", issue: "Customer claims pipe still leaking after repair",               amount: "GHS 180", status: "resolved",     raised: "5 days ago",  priority: "medium", evidence: 2 },
];

const PAYOUTS_DATA = [
  { id: "PAY-9921", tasker: "Emmanuel K.", type: "Completion",        amount: "GHS 312.40", status: "paid",    momoRef: "MTN-441982", date: "Today 14:32",    booking: "BK-7841" },
  { id: "PAY-9920", tasker: "Kwabena O.", type: "Completion",        amount: "GHS 158.40", status: "paid",    momoRef: "MTN-441821", date: "Today 11:15",    booking: "BK-7839" },
  { id: "PAY-9919", tasker: "Abena M.",   type: "Materials deposit", amount: "GHS 88.00",  status: "paid",    momoRef: "TEL-228814", date: "Today 09:44",    booking: "BK-7837" },
  { id: "PAY-9918", tasker: "Ama D.",     type: "Completion",        amount: "GHS 106.40", status: "pending", momoRef: "-",          date: "Today 08:20",    booking: "BK-7835" },
  { id: "PAY-9917", tasker: "Samuel T.",  type: "Refund hold",       amount: "GHS 200.00", status: "held",    momoRef: "-",          date: "Yesterday 16:00",booking: "BK-7823" },
  { id: "PAY-9916", tasker: "Kofi B.",    type: "Completion",        amount: "GHS 246.40", status: "paid",    momoRef: "MTN-440112", date: "Yesterday 13:40",booking: "BK-7820" },
];

const BOOKINGS_DATA = [
  { id: "BK-7841", customer: "Sandra A.", tasker: "Emmanuel K.", service: "AC Repair",       status: "IN_PROGRESS",  amount: "GHS 355", area: "East Legon", time: "Today 2:00 PM" },
  { id: "BK-7840", customer: "Kofi B.",   tasker: "Abena M.",   service: "House Cleaning",   status: "COMPLETED",    amount: "GHS 120", area: "Airport Area", time: "Today 10:00 AM" },
  { id: "BK-7839", customer: "Efua M.",   tasker: "Kwabena O.", service: "Plumbing",         status: "PAID",         amount: "GHS 180", area: "Cantonments", time: "Today 9:00 AM" },
  { id: "BK-7838", customer: "Nana O.",   tasker: "-",          service: "Electrical",       status: "PENDING",      amount: "GHS 25",  area: "Spintex", time: "Today 3:00 PM" },
  { id: "BK-7837", customer: "Aba K.",    tasker: "Ama D.",     service: "Fumigation",       status: "DEPOSIT_PAID", amount: "GHS 150", area: "Adenta", time: "Today 11:00 AM" },
  { id: "BK-7836", customer: "Joe A.",    tasker: "Kofi B.",    service: "Painting",         status: "QUOTED",       amount: "GHS 280", area: "Osu", time: "Yesterday" },
  { id: "BK-7823", customer: "Kofi B.",   tasker: "Samuel T.",  service: "Electrical",       status: "DISPUTED",     amount: "GHS 200", area: "Tema", time: "Yesterday" },
];

const STATUS_COLORS = {
  PENDING: C.gold, IN_PROGRESS: C.blue, COMPLETED: C.greenLight,
  PAID: C.green, DEPOSIT_PAID: C.purple, QUOTED: "#F472B6",
  DISPUTED: C.red, CANCELLED: C.textMuted, REFUNDED: C.textMuted,
  active: C.green, pending: C.gold, suspended: C.red,
  open: C.red, investigating: C.gold, resolved: C.green,
  paid: C.green, held: C.gold, failed: C.red,
};

/* --- CHARTS --- */
const MiniBarChart = ({ data, color, height = 80 }) => {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
          <div className="chart-bar" style={{ width: "100%", borderRadius: "3px 3px 0 0", background: i === data.length - 1 ? color : color + "50", height: `${(d.v / max) * (height - 20)}px`, minHeight: 3 }} />
          {d.l && <p style={{ fontFamily: FM, fontSize: 9, color: C.textMuted }}>{d.l}</p>}
        </div>
      ))}
    </div>
  );
};

const SparkLine = ({ data, color, w = 120, h = 40 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min + 1)) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const DonutChart = ({ pct, color, size = 64, stroke = 7 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
};

/* --- SIDEBAR --- */
const NAV = [
  { id: "overview",    icon: <LayoutDashboard size={18} />, label: "Overview" },
  { id: "bookings",   icon: <ClipboardList size={18} />, label: "Bookings",      badge: 3 },
  { id: "taskers",    icon: <Users size={18} />, label: "Taskers",        badge: 2 },
  { id: "disputes",   icon: <AlertTriangle size={18} />, label: "Disputes",       badge: 2 },
  { id: "payouts",    icon: <Banknote size={18} />, label: "Payouts" },
  { id: "analytics",  icon: <TrendingUp size={18} />, label: "Analytics" },
  { id: "settings",   icon: <SettingsIcon size={18} />, label: "Settings" },
];

const Sidebar = ({ active, onChange, collapsed, onToggle, adminName }) => (
  <div style={{ width: collapsed ? 60 : 220, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "width 0.25s ease", flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>
    {/* Logo */}
    <div style={{ padding: collapsed ? "20px 16px" : "20px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={32} height={32} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="11" fill={C.green} /><path d="M13 27L21 19" stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="16" r="5" stroke="white" strokeWidth="2.2" fill="none" /><path d="M20 20L14.5 25.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" /><path d="M21 15.5L23 17.5L27 13.5" stroke="#E8A020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {!collapsed && <div><p style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: C.text }}>TaskGH</p><p style={{ fontFamily: FM, fontSize: 10, color: C.textMuted }}>Admin Console</p></div>}
    </div>

    {/* Nav */}
    <div style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3, overflowY: "auto" }}>
      {NAV.map(item => (
        <div key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => onChange(item.id)} style={{ justifyContent: collapsed ? "center" : "flex-start" }}>
          <span className="icon">{item.icon}</span>
          {!collapsed && <><span>{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}</>}
        </div>
      ))}
    </div>

    {/* Admin user */}
    <div style={{ padding: "14px 14px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: C.greenPale, border: `1px solid ${C.green}33`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 12, color: C.green, flexShrink: 0 }}>
        {adminName?.split(" ").map(n => n[0]).join("") || "AD"}
      </div>
      {!collapsed && <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontFamily: FB, fontWeight: 600, fontSize: 12, color: C.text }}>{adminName || "Admin"}</p><p style={{ fontFamily: FM, fontSize: 10, color: C.textMuted }}>Staff Access</p></div>}
      {!collapsed && <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, fontSize: 14 }}><ArrowLeft size={16} /></button>}
    </div>
  </div>
);

/* --- TOPBAR --- */
const Topbar = ({ title, subtitle, actions }) => (
  <div style={{ padding: "18px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifySpaceBetween: "space-between", background: C.surface, flexShrink: 0 }}>
    <div>
      <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: C.text }}>{title}</h1>
      {subtitle && <p style={{ fontFamily: FB, fontSize: 13, color: C.textSoft, marginTop: 2 }}>{subtitle}</p>}
    </div>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      {/* Live indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(16,185,129,0.1)", borderRadius: 8, padding: "6px 12px", border: "1px solid rgba(16,185,129,0.2)" }}>
        <div className="live-dot" />
        <span style={{ fontFamily: FM, fontSize: 11, color: "#10B981" }}>Live - Sat 11 Apr 2026</span>
      </div>
      {actions}
    </div>
  </div>
);

/* ==========================================================
   VIEWS
========================================================== */

/* --- OVERVIEW --- */
const Overview = ({ onNavigate, stats, loading }) => {
  const gmvData = [{ v: 1840, l: "Mon" }, { v: 920, l: "Tue" }, { v: 2640, l: "Wed" }, { v: 1980, l: "Thu" }, { v: 2200, l: "Fri" }, { v: 3100, l: "Sat" }, { v: 2847, l: "Sun" }];
  const metrics = [
    { label: "Total Escrow", value: `GHS ${stats?.volumeInEscrow?.toLocaleString() || '0'}`, sub: "Funds currently held", color: C.green, spark: [1200, 1800, 900, 2200, 1600, 2847], icon: <Banknote size={20} /> },
    { label: "Platform Jobs", value: stats?.totalJobs || '0', sub: "Total bookings created", color: C.blue, spark: [8, 12, 10, 14, 11, 14], icon: <ClipboardList size={20} /> },
    { label: "Active Disputes", value: stats?.activeDisputes || '0', sub: "Requiring attention", color: C.red, spark: [2, 1, 3, 2, 0, stats?.activeDisputes || 0], icon: <AlertTriangle size={20} /> },
    { label: "Avg match time", value: "4.2 min", sub: <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ArrowDown size={10} /> 0.8 min vs last wk</span>, color: C.purple, spark: [6, 5.5, 6.2, 4.8, 5.1, 4.2], icon: <Zap size={20} /> },
  ];

  const recentActivity = [
    { time: "14:32", type: "payout", msg: "GHS 312.40 released to Emmanuel K.", color: C.green },
    { time: "14:18", type: "dispute", msg: "New dispute raised - BK-7841 (AC Repair)", color: C.red },
    { time: "13:55", type: "booking", msg: "New booking BK-7841 - Sandra A. assigned to Emmanuel K.", color: C.blue },
    { time: "13:21", type: "tasker", msg: "Grace A. application submitted - pending review", color: C.gold },
    { time: "12:47", type: "payout", msg: "GHS 158.40 released to Kwabena O.", color: C.green },
    { time: "12:10", type: "booking", msg: "BK-7839 completed - Efua M. confirmed job done", color: C.greenLight },
    { time: "11:15", type: "booking", msg: "New booking BK-7838 - Nana O., Electrical, Spintex", color: C.blue },
    { time: "10:44", type: "system", msg: "MoMo API response time elevated (640ms avg)", color: C.gold },
  ];

  return (
    <div className="page-enter scrollable" style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={i} className="metric-card" style={{ animation: `fadeUp 0.4s ${i * 0.07}s ease both`, opacity: loading ? 0.6 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <Label>{m.label}</Label>
                <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: C.text, lineHeight: 1 }}>{m.value}</p>
                <p style={{ fontFamily: FB, fontSize: 11, color: m.color, marginTop: 5, fontWeight: 500 }}>{m.sub}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: m.color + "20", display: "flex", alignItems: "center", justifyContent: "center", color: m.color }}>{m.icon}</div>
                <SparkLine data={m.spark} color={m.color} w={80} h={36} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* GMV chart */}
        <div className="panel" style={{ gridColumn: "span 2" }}>
          <div className="panel-header">
            <p className="panel-title">Weekly GMV</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge color={C.green}>This week: GHS 15,530</Badge>
              <Badge color={C.gold}>Trending Up by 22%</Badge>
            </div>
          </div>
          <div style={{ padding: "20px 20px 14px" }}>
            <MiniBarChart data={gmvData} color={C.green} height={120} />
          </div>
        </div>

        {/* Platform health */}
        <div className="panel">
          <div className="panel-header"><p className="panel-title">Platform Health</p></div>
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Booking completion rate", pct: 94, color: C.green },
              { label: "Dispute rate", pct: 4.2, color: C.red, invert: true },
              { label: "Tasker acceptance rate", pct: 88, color: C.blue },
              { label: "MoMo success rate", pct: 97, color: C.gold },
            ].map((h, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: FB, fontSize: 12, color: C.textSoft }}>{h.label}</span>
                  <span style={{ fontFamily: FM, fontSize: 12, color: h.color, fontWeight: 600 }}>{h.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${h.pct}%`, background: h.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Activity feed */}
        <div className="panel">
          <div className="panel-header">
            <p className="panel-title">Live Activity</p>
            <div className="live-dot" />
          </div>
          <div className="scrollable" style={{ maxHeight: 300 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontFamily: FM, fontSize: 11, color: C.textMuted, whiteSpace: "nowrap", marginTop: 1 }}>{a.time}</span>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontFamily: FB, fontSize: 12, color: C.textSoft, lineHeight: 1.5 }}>{a.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="panel">
          <div className="panel-header"><p className="panel-title">Pending Actions</p></div>
          <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: <Users size={18} />, label: "2 Tasker applications to review", action: "Review", color: C.gold, onClick: () => onNavigate("taskers") },
              { icon: <AlertTriangle size={18} />, label: "2 open disputes need attention", action: "View", color: C.red, onClick: () => onNavigate("disputes") },
              { icon: <Banknote size={18} />, label: "1 payout pending manual release", action: "Release", color: C.green, onClick: () => onNavigate("payouts") },
              { icon: <ClipboardList size={18} />, label: "3 receipts flagged for review", action: "Check", color: C.purple, onClick: () => onNavigate("bookings") },
              { icon: <MessageSquare size={18} />, label: "Kofi B. raised a dispute - needs call", action: "Call", color: C.blue, onClick: () => onNavigate("disputes") },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "11px 14px", background: C.surface2, borderRadius: 12, border: `1px solid ${a.color}22` }}>
                <span style={{ color: a.color }}>{a.icon}</span>
                <span style={{ fontFamily: FB, fontSize: 13, color: C.textSoft, flex: 1, lineHeight: 1.4 }}>{a.label}</span>
                <button className="btn btn-sm btn-ghost" onClick={a.onClick}>{a.action}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- BOOKINGS --- */
const Bookings = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const statuses = ["All", "PENDING", "IN_PROGRESS", "COMPLETED", "PAID", "DISPUTED"];
  const filtered = BOOKINGS_DATA.filter(b =>
    (filter === "All" || b.status === filter) &&
    (search === "" || b.id.toLowerCase().includes(search.toLowerCase()) || b.customer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-enter" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ padding: "16px 28px", display: "flex", gap: 12, alignItems: "center", borderBottom: `1px solid ${C.border}`, flexShrink: 0, flexWrap: "wrap" }}>
        <input className="input-field" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${filter === s ? STATUS_COLORS[s] || C.green : C.border}`, background: filter === s ? (STATUS_COLORS[s] || C.green) + "20" : "transparent", color: filter === s ? STATUS_COLORS[s] || C.green : C.textMuted, fontFamily: FB, fontSize: 12, fontWeight: filter === s ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>{s}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Badge color={C.textMuted}>{filtered.length} bookings</Badge>
        </div>
      </div>
      <div className="scrollable" style={{ flex: 1, overflowY: "auto" }}>
        <table className="data-table" style={{ minWidth: 800 }}>
          <thead><tr><th>Booking ID</th><th>Customer</th><th>Tasker</th><th>Service</th><th>Status</th><th>Amount</th><th>Area</th><th>Time</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr key={i} className="row-hover">
                <td><span className="mono" style={{ color: C.blue }}>{b.id}</span></td>
                <td><span style={{ fontFamily: FB, fontWeight: 500, color: C.text }}>{b.customer}</span></td>
                <td><span style={{ color: b.tasker === "-" ? C.textMuted : C.text }}>{b.tasker}</span></td>
                <td>{b.service}</td>
                <td><Badge color={STATUS_COLORS[b.status] || C.textMuted} dot={b.status === "IN_PROGRESS"}>{b.status}</Badge></td>
                <td><span style={{ fontFamily: FD, fontWeight: 700, color: C.gold }}>{b.amount}</span></td>
                <td style={{ color: C.textSoft }}>{b.area}</td>
                <td style={{ color: C.textMuted, fontFamily: FM, fontSize: 11 }}>{b.time}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-sm btn-ghost">View</button>
                    {b.status === "DISPUTED" && <button className="btn btn-sm btn-red">Resolve</button>}
                    {b.status === "IN_PROGRESS" && <button className="btn btn-sm btn-blue">Track</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- TASKERS --- */
const Taskers = () => {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, color = C.green) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, color }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const filtered = TASKERS_DATA.filter(t => filter === "All" || t.status === filter.toLowerCase());

  const statusColors = { active: C.green, pending: C.gold, suspended: C.red };

  return (
    <div className="page-enter" style={{ flex: 1, display: "flex", minHeight: 0 }}>
      {/* Left: Tasker list */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
          {["All", "Active", "Pending", "Suspended"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${filter === f ? C.green : C.border}`, background: filter === f ? C.greenPale : "transparent", color: filter === f ? C.greenLight : C.textMuted, fontFamily: FB, fontSize: 12, fontWeight: filter === f ? 700 : 400, cursor: "pointer", transition: "all 0.15s" }}>{f}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Badge color={C.gold}>2 pending review</Badge>
            <button className="btn btn-green btn-sm"><Plus size={14} /> Invite Tasker</button>
          </div>
        </div>
        <div className="scrollable" style={{ flex: 1, overflowY: "auto" }}>
          <table className="data-table">
            <thead><tr><th>Tasker</th><th>Skill</th><th>Area</th><th>Rating</th><th>Jobs</th><th>Earnings</th><th>Status</th><th>Disputes</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={i} className="row-hover" onClick={() => setSelected(t)} style={{ background: selected?.id === t.id ? "rgba(10,110,74,0.07)" : "transparent" }}>
                  <td>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 12, color: C.green, flexShrink: 0 }}>{t.name.split(" ").map(w => w[0]).join("")}</div>
                      <div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: C.text }}>{t.name}</span>
                          {t.badge && <Badge color={C.gold}>{t.badge}</Badge>}
                        </div>
                        <span className="mono" style={{ color: C.textMuted, fontSize: 11 }}>{t.id}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: C.textSoft }}>{t.skill}</td>
                  <td style={{ color: C.textSoft }}>{t.area}</td>
                  <td><span style={{ fontFamily: FM, color: t.rating >= 4.8 ? C.gold : C.text, display: "flex", alignItems: "center", gap: 4 }}>{t.rating > 0 ? <><Star size={12} fill={C.gold} stroke={C.gold} /> {t.rating}</> : "-"}</span></td>
                  <td><span style={{ fontFamily: FM, color: C.text }}>{t.jobs}</span></td>
                  <td><span style={{ fontFamily: FD, fontWeight: 700, color: C.green }}>{t.earnings}</span></td>
                  <td><Badge color={statusColors[t.status]} dot={t.status === "active"}>{t.status}</Badge></td>
                  <td><span style={{ fontFamily: FM, color: t.disputes > 0 ? C.red : C.textMuted, display: "flex", alignItems: "center", gap: 4 }}>{t.disputes > 0 ? <><Flag size={12} /> {t.disputes}</> : "0"}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {t.status === "pending" && <button className="btn btn-sm btn-green" onClick={() => { setActionModal({ type: "approve", tasker: t }); }}>Approve</button>}
                      {t.status === "active" && <button className="btn btn-sm btn-ghost">View</button>}
                      {t.status === "suspended" && <button className="btn btn-sm btn-blue">Reinstate</button>}
                      {t.status !== "pending" && <button className="btn btn-sm btn-ghost" onClick={() => setActionModal({ type: "suspend", tasker: t })}><MoreHorizontal size={14} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Tasker detail panel */}
      {selected && (
        <div className="slide-in scrollable" style={{ width: 320, borderLeft: `1px solid ${C.border}`, background: C.surface, flexShrink: 0, overflowY: "auto" }}>
          <div style={{ padding: "20px 20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 18, color: C.green }}>{selected.name.split(" ").map(w => w[0]).join("")}</div>
                <div>
                  <Th>{selected.name}</Th>
                  <p style={{ fontFamily: FM, fontSize: 11, color: C.textMuted }}>{selected.id}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, fontSize: 18 }}><X size={18} /></button>
            </div>

            {selected.status === "pending" && (
              <div style={{ background: C.goldPale, borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: `1px solid ${C.gold}33` }}>
                <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 12, color: C.gold, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={14} /> Awaiting approval</p>
                <p style={{ fontFamily: FB, fontSize: 12, color: C.textSoft }}>ID documents uploaded. Review before activating.</p>
              </div>
            )}

            {[["Phone", selected.phone, true], ["Skill", selected.skill, false], ["Area", selected.area, false], ["Joined", selected.joined, false], ["Total earned", selected.earnings, false], ["Disputes", selected.disputes, false]].map(([k, v, mono]) => (
              <Row key={k} label={k} value={v} mono={mono} color={k === "Disputes" && selected.disputes > 0 ? C.red : undefined} />
            ))}

            <div style={{ marginTop: 12, display: "flex", gap: 16, justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <DonutChart pct={selected.rating > 0 ? (selected.rating / 5) * 100 : 0} color={C.gold} size={56} stroke={6} />
                <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 11, color: C.gold, marginTop: 4 }}>{selected.rating > 0 ? selected.rating : "N/A"}</p>
                <p style={{ fontFamily: FB, fontSize: 10, color: C.textMuted }}>Rating</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <DonutChart pct={Math.min((selected.jobs / 300) * 100, 100)} color={C.green} size={56} stroke={6} />
                <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 11, color: C.green, marginTop: 4 }}>{selected.jobs}</p>
                <p style={{ fontFamily: FB, fontSize: 10, color: C.textMuted }}>Jobs</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <DonutChart pct={selected.verified ? 100 : 30} color={selected.verified ? C.green : C.gold} size={56} stroke={6} />
                <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 11, color: selected.verified ? C.green : C.gold, marginTop: 4 }}>{selected.verified ? <CheckCircle size={12} /> : "!"}</p>
                <p style={{ fontFamily: FB, fontSize: 10, color: C.textMuted }}>ID Status</p>
              </div>
            </div>

            {selected.status === "pending" && (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="btn btn-green" style={{ width: "100%" }} onClick={() => { addToast(`${selected.name} approved and activated`, C.green); setSelected(null); }}><Check size={16} /> Approve & Activate</button>
                <button className="btn btn-ghost" style={{ width: "100%" }}>Request more info</button>
                <button className="btn btn-red" style={{ width: "100%" }} onClick={() => { addToast(`${selected.name} application rejected`, C.red); setSelected(null); }}>Reject Application</button>
              </div>
            )}
            {selected.status === "active" && (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="btn btn-ghost" style={{ width: "100%" }}>View all jobs</button>
                <button className="btn btn-ghost" style={{ width: "100%" }}><Smartphone size={14} /> Send WhatsApp</button>
                <button className="btn btn-red" style={{ width: "100%" }} onClick={() => { addToast(`${selected.name} suspended`, C.red); setSelected(null); }}>Suspend Tasker</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <Th style={{ marginBottom: 6 }}>{actionModal.type === "approve" ? "Approve Tasker" : "Suspend Tasker"}</Th>
            <p style={{ fontFamily: FB, fontSize: 13, color: C.textSoft, marginBottom: 20, lineHeight: 1.6 }}>
              {actionModal.type === "approve"
                ? `You are about to activate ${actionModal.tasker.name}. They will immediately start receiving job alerts.`
                : `You are about to suspend ${actionModal.tasker.name}. They will no longer receive jobs or be visible to customers.`}
            </p>
            {actionModal.type === "suspend" && (
              <div style={{ marginBottom: 16 }}>
                <Label>Reason for suspension</Label>
                <textarea className="input-field" rows={3} placeholder="Describe the reason..." style={{ width: "100%" }} />
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setActionModal(null)}>Cancel</button>
              <button className={`btn flex-1 ${actionModal.type === "approve" ? "btn-green" : "btn-red"}`} style={{ flex: 2 }} onClick={() => { addToast(actionModal.type === "approve" ? `${actionModal.tasker.name} activated!` : `${actionModal.tasker.name} suspended`, actionModal.type === "approve" ? C.green : C.red); setActionModal(null); }}>
                {actionModal.type === "approve" ? "Confirm Activation" : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast stack */}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- DISPUTES --- */
const Disputes = () => {
  const [selected, setSelected] = useState(DISPUTES_DATA[0]);
  const [resolution, setResolution] = useState("");
  const [outcome, setOutcome] = useState("full_refund");
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, color = C.green) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, color }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const priorityColor = { high: C.red, medium: C.gold, low: C.textSoft };

  return (
    <div className="page-enter" style={{ flex: 1, display: "flex", minHeight: 0 }}>
      {/* Left: dispute list */}
      <div style={{ width: 360, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 14, color: C.text }}>All Disputes</p>
            <Badge color={C.red} dot>2 open</Badge>
          </div>
        </div>
        <div className="scrollable" style={{ flex: 1, overflowY: "auto" }}>
          {DISPUTES_DATA.map((d, i) => (
            <div key={i} className="row-hover" onClick={() => setSelected(d)} style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, background: selected?.id === d.id ? "rgba(10,110,74,0.07)" : "transparent", borderLeft: `3px solid ${selected?.id === d.id ? C.green : "transparent"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span className="mono" style={{ color: C.blue, fontSize: 11 }}>{d.id}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <Badge color={priorityColor[d.priority]}>{d.priority}</Badge>
                  <Badge color={STATUS_COLORS[d.status]}>{d.status}</Badge>
                </div>
              </div>
              <p style={{ fontFamily: FB, fontSize: 13, color: C.text, marginBottom: 4 }}>{d.customer} vs {d.tasker}</p>
              <p style={{ fontFamily: FB, fontSize: 12, color: C.textMuted, lineHeight: 1.5, marginBottom: 6 }}>{d.issue.slice(0, 65)}...</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 13, color: C.gold }}>{d.amount}</span>
                <span style={{ fontFamily: FM, fontSize: 10, color: C.textMuted }}>{d.raised}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: dispute detail */}
      {selected && (
        <div className="slide-in scrollable" style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                <span className="mono" style={{ color: C.blue }}>{selected.id}</span>
                <Badge color={STATUS_COLORS[selected.status]}>{selected.status}</Badge>
                <Badge color={priorityColor[selected.priority]}>{selected.priority} priority</Badge>
              </div>
              <p style={{ fontFamily: FB, fontSize: 13, color: C.textSoft }}>Booking {selected.booking} - Raised {selected.raised}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm"><Phone size={14} /> Call customer</button>
              <button className="btn btn-ghost btn-sm"><Phone size={14} /> Call Tasker</button>
              <button className="btn btn-gold btn-sm"><MessageSquare size={14} /> WhatsApp both</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {/* Customer side */}
            <div className="panel">
              <div className="panel-header"><p className="panel-title">Customer</p></div>
              <div style={{ padding: "14px 18px" }}>
                {[["Name", selected.customer], ["Booking", selected.booking], ["Amount paid", selected.amount]].map(([k, v]) => <Row key={k} label={k} value={v} />)}
              </div>
            </div>
            {/* Tasker side */}
            <div className="panel">
              <div className="panel-header"><p className="panel-title">Tasker</p></div>
              <div style={{ padding: "14px 18px" }}>
                {[["Name", selected.tasker], ["Status", "Active"], ["Disputes", "1 prior"]].map(([k, v]) => <Row key={k} label={k} value={v} />)}
              </div>
            </div>
          </div>

          {/* Issue */}
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-header"><p className="panel-title">Issue Reported</p></div>
            <div style={{ padding: "16px 20px" }}>
              <p style={{ fontFamily: FB, fontSize: 14, color: C.text, lineHeight: 1.75, marginBottom: 14 }}>"{selected.issue}"</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Array.from({ length: selected.evidence }).map((_, i) => (
                  <div key={i} style={{ width: 72, height: 72, borderRadius: 10, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, cursor: "pointer" }}>
                    <Camera size={24} color={C.textMuted} />
                    <span style={{ fontFamily: FM, fontSize: 9, color: C.textMuted }}>Photo {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resolution panel */}
          {selected.status !== "resolved" && (
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-header"><p className="panel-title">Admin Resolution</p></div>
              <div style={{ padding: "16px 20px" }}>
                <Label>Select outcome</Label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {[
                    { id: "full_refund", label: "Full refund to customer", desc: "Release 100% back to customer MoMo" },
                    { id: "full_release", label: "Full release to Tasker", desc: "Release all escrowed funds to Tasker" },
                    { id: "partial", label: "Partial refund + partial release", desc: "Split escrowed funds between both parties" },
                    { id: "redo", label: "Free redo - send new Tasker", desc: "Platform absorbs cost, sends replacement Tasker" },
                    { id: "escalate", label: "Escalate to senior review", desc: "Move to senior admin queue" },
                  ].map(o => (
                    <div key={o.id} onClick={() => setOutcome(o.id)} style={{ padding: "12px 14px", borderRadius: 10, cursor: "pointer", border: `1.5px solid ${outcome === o.id ? C.green : C.border}`, background: outcome === o.id ? C.greenPale : "transparent", transition: "all 0.15s" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${outcome === o.id ? C.green : C.border}`, background: outcome === o.id ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                          {outcome === o.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                        </div>
                        <div>
                          <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: outcome === o.id ? C.greenLight : C.text }}>{o.label}</p>
                          <p style={{ fontFamily: FB, fontSize: 11, color: C.textMuted, marginTop: 1 }}>{o.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <Label>Admin notes (required)</Label>
                  <textarea className="input-field" rows={3} placeholder="Explain your decision and evidence reviewed..." value={resolution} onChange={e => setResolution(e.target.value)} style={{ width: "100%" }} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }}>Save draft</button>
                  <button className="btn btn-green" style={{ flex: 2 }} disabled={!resolution.trim()} onClick={() => addToast(`Dispute ${selected.id} resolved - ${outcome.replace("_", " ")}`, C.green)}>
                    Execute Resolution <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {selected.status === "resolved" && (
            <div style={{ background: C.greenPale, borderRadius: 14, padding: 16, border: `1px solid ${C.green}33`, display: "flex", gap: 10, alignItems: "center" }}>
              <CheckCircle size={22} color={C.greenLight} />
              <p style={{ fontFamily: FB, fontSize: 13, color: C.greenLight }}>This dispute has been resolved. Payment action was executed successfully.</p>
            </div>
          )}
        </div>
      )}

      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast"><div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />{t.msg}</div>
        ))}
      </div>
    </div>
  );
};

/* --- PAYOUTS --- */
const Payouts = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = (msg, color = C.green) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, color }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  return (
    <div className="page-enter" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Summary cards */}
      <div style={{ padding: "16px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 14, flexShrink: 0 }}>
        {[
          { label: "Paid today", val: "GHS 877.20", color: C.green },
          { label: "Pending release", val: "GHS 106.40", color: C.gold },
          { label: "Held (dispute)", val: "GHS 200.00", color: C.red },
          { label: "Platform earned", val: "GHS 105.26", color: C.purple },
        ].map((s, i) => (
          <div key={i} style={{ background: C.surface, borderRadius: 12, padding: "12px 18px", border: `1px solid ${s.color}22`, flex: 1 }}>
            <Label>{s.label}</Label>
            <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="scrollable" style={{ flex: 1, overflowY: "auto" }}>
        <table className="data-table" style={{ minWidth: 900 }}>
          <thead><tr><th>Payout ID</th><th>Tasker</th><th>Type</th><th>Amount</th><th>Booking</th><th>Status</th><th>MoMo Reference</th><th>Date/Time</th><th>Actions</th></tr></thead>
          <tbody>
            {PAYOUTS_DATA.map((p, i) => (
              <tr key={i} className="row-hover">
                <td><span className="mono" style={{ color: C.blue }}>{p.id}</span></td>
                <td><span style={{ fontFamily: FB, fontWeight: 500, color: C.text }}>{p.tasker}</span></td>
                <td><span style={{ fontFamily: FB, fontSize: 12, color: C.textSoft }}>{p.type}</span></td>
                <td><span style={{ fontFamily: FD, fontWeight: 800, color: C.gold }}>{p.amount}</span></td>
                <td><span className="mono" style={{ color: C.blue, fontSize: 11 }}>{p.booking}</span></td>
                <td>
                  <Badge color={STATUS_COLORS[p.status] || C.textMuted} dot={p.status === "pending"}>
                    {p.status}
                  </Badge>
                </td>
                <td>
                  {p.momoRef !== "-" ? (
                    <span className="mono" style={{ color: C.greenLight, fontSize: 11 }}>{p.momoRef}</span>
                  ) : (
                    <span style={{ color: C.textMuted }}>-</span>
                  )}
                </td>
                <td><span style={{ fontFamily: FM, fontSize: 11, color: C.textMuted }}>{p.date}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {p.status === "pending" && <button className="btn btn-sm btn-green" onClick={() => addToast(`GHS payment released to ${p.tasker} via MoMo`, C.green)}>Release</button>}
                    {p.status === "held" && <button className="btn btn-sm btn-gold" onClick={() => addToast(`Held payout for ${p.tasker} - awaiting dispute resolution`, C.gold)}>Held</button>}
                    {p.status === "paid" && <button className="btn btn-sm btn-ghost">Receipt</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual payout section */}
      <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: C.textSoft }}>Manual payout:</p>
          <input className="input-field" placeholder="Tasker name or ID" style={{ width: 200 }} />
          <input className="input-field" placeholder="Amount (GHS)" style={{ width: 140 }} type="number" />
          <select className="input-field" style={{ width: 160 }}>
            <option>MTN MoMo</option>
            <option>Telecel Cash</option>
            <option>AT Money</option>
          </select>
          <input className="input-field" placeholder="Reason / booking ref" style={{ flex: 1 }} />
          <button className="btn btn-gold" onClick={() => addToast("Manual payout initiated - pending MoMo confirmation", C.gold)}>Initiate Transfer <ArrowRight size={14} /></button>
        </div>
      </div>

      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast"><div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />{t.msg}</div>
        ))}
      </div>
    </div>
  );
};

/* --- ANALYTICS --- */
const Analytics = () => {
  const weeks = ["W1", "W2", "W3", "W4", "W5"];
  const gmvByWeek = [9200, 11400, 10800, 13200, 15530];
  const jobsByWeek = [38, 48, 44, 52, 61];
  const topServices = [
    { name: "AC Repair", jobs: 89, revenue: "GHS 4,890", pct: 28 },
    { name: "House Cleaning", jobs: 74, revenue: "GHS 3,200", pct: 23 },
    { name: "Plumbing", jobs: 62, revenue: "GHS 3,800", pct: 19 },
    { name: "Electrical", jobs: 54, revenue: "GHS 2,400", pct: 17 },
    { name: "Fumigation", jobs: 34, revenue: "GHS 1,900", pct: 11 },
    { name: "Others", jobs: 8, revenue: "GHS 440", pct: 2 },
  ];
  const topAreas = [
    { name: "East Legon", jobs: 98, pct: 30 },
    { name: "Airport Area", jobs: 74, pct: 23 },
    { name: "Cantonments", jobs: 62, pct: 19 },
    { name: "Spintex", jobs: 54, pct: 17 },
    { name: "Tema", jobs: 36, pct: 11 },
  ];

  return (
    <div className="page-enter scrollable" style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total GMV (all time)", val: "GHS 60,110", change: "+22%", color: C.green },
          { label: "Total jobs done", val: "321", change: "+18%", color: C.blue },
          { label: "Avg job value", val: "GHS 187", change: "+4%", color: C.gold },
          { label: "Active Taskers", val: "6 / 8", change: "75%", color: C.purple },
          { label: "Dispute rate", val: "4.2%", change: <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ArrowDown size={10} /> Target less than 5%</span>, color: C.greenLight },
        ].map((k, i) => (
          <div key={i} className="metric-card" style={{ animation: `fadeUp 0.4s ${i * 0.06}s ease both` }}>
            <Label>{k.label}</Label>
            <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: C.text }}>{k.val}</p>
            <p style={{ fontFamily: FB, fontSize: 11, color: k.color, marginTop: 4 }}>{k.change}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* GMV trend */}
        <div className="panel">
          <div className="panel-header"><p className="panel-title">GMV by Week (GHS)</p></div>
          <div style={{ padding: "16px 20px 20px" }}>
            <MiniBarChart data={gmvByWeek.map((v, i) => ({ v, l: weeks[i] }))} color={C.green} height={140} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ fontFamily: FM, fontSize: 11, color: C.textMuted }}>Lowest: GHS 9,200</span>
              <span style={{ fontFamily: FM, fontSize: 11, color: C.green }}>Highest: GHS 15,530</span>
            </div>
          </div>
        </div>
        {/* Jobs trend */}
        <div className="panel">
          <div className="panel-header"><p className="panel-title">Jobs by Week</p></div>
          <div style={{ padding: "16px 20px 20px" }}>
            <MiniBarChart data={jobsByWeek.map((v, i) => ({ v, l: weeks[i] }))} color={C.blue} height={140} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ fontFamily: FM, fontSize: 11, color: C.textMuted }}>Avg: {Math.round(jobsByWeek.reduce((a, b) => a + b, 0) / jobsByWeek.length)} jobs/wk</span>
              <span style={{ fontFamily: FM, fontSize: 11, color: C.blue }}>Total: {jobsByWeek.reduce((a, b) => a + b, 0)} jobs</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Top services */}
        <div className="panel">
          <div className="panel-header"><p className="panel-title">Top Services by Jobs</p></div>
          <div style={{ padding: "14px 20px" }}>
            {topServices.map((s, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: FB, fontSize: 13, color: C.text }}>{s.name}</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontFamily: FM, fontSize: 11, color: C.textMuted }}>{s.jobs} jobs</span>
                    <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 12, color: C.gold }}>{s.revenue}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.pct}%`, background: [C.green, C.blue, C.gold, C.purple, C.red, C.textMuted][i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top areas */}
        <div className="panel">
          <div className="panel-header"><p className="panel-title">Top Areas by Jobs</p></div>
          <div style={{ padding: "14px 20px" }}>
            {topAreas.map((a, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: FB, fontSize: 13, color: C.text }}>{a.name}</span>
                  <span style={{ fontFamily: FM, fontSize: 11, color: C.textMuted }}>{a.jobs} jobs ({a.pct}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${a.pct}%`, background: [C.green, C.blue, C.gold, C.purple, C.red][i] }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: "12px 14px", background: C.greenPale, borderRadius: 10, border: `1px solid ${C.green}22` }}>
              <p style={{ fontFamily: FB, fontSize: 12, color: C.greenLight, display: "flex", alignItems: "center", gap: 8 }}>
                <Info size={16} /> East Legon + Airport + Cantonments = 72% of all jobs. Consider prioritising Tasker recruitment in these areas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SETTINGS --- */
const Settings = () => {
  const [commission, setCommission] = useState(12);
  const [assessFee, setAssessFee] = useState(25);
  const [whatsapp, setWhatsapp] = useState(true);
  const [sms, setSms] = useState(true);
  const [autoRelease, setAutoRelease] = useState(true);
  const [toasts, setToasts] = useState([]);
  const addToast = (msg) => { const id = Date.now(); setToasts(t => [...t, { id, msg }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000); };

  const Toggle = ({ on, onChange }) => (
    <div onClick={onChange} style={{ width: 44, height: 24, borderRadius: 12, background: on ? C.green : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
      <div style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", background: "#fff", top: 3, left: on ? 23 : 3, transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );

  return (
    <div className="page-enter scrollable" style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
      <div style={{ maxWidth: 720 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Business rules */}
          <div className="panel">
            <div className="panel-header"><p className="panel-title">Business Rules</p></div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: C.text }}>Platform commission rate</p>
                  <p style={{ fontFamily: FB, fontSize: 12, color: C.textMuted }}>Deducted from every Tasker payout</p>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="range" min={8} max={20} value={commission} onChange={e => setCommission(Number(e.target.value))} style={{ width: 120, accentColor: C.green }} />
                  <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: C.gold, minWidth: 40 }}>{commission}%</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: C.text }}>Assessment fee (GHS)</p>
                  <p style={{ fontFamily: FB, fontSize: 12, color: C.textMuted }}>Charged per assessment visit, credited to total</p>
                </div>
                <input className="input-field" type="number" value={assessFee} onChange={e => setAssessFee(e.target.value)} style={{ width: 100, textAlign: "center", fontFamily: FD, fontWeight: 700, fontSize: 16 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: C.text }}>Auto-release on job completion</p>
                  <p style={{ fontFamily: FB, fontSize: 12, color: C.textMuted }}>Automatically trigger MoMo payout when customer confirms</p>
                </div>
                <Toggle on={autoRelease} onChange={() => setAutoRelease(a => !a)} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="panel">
            <div className="panel-header"><p className="panel-title">Notification Channels</p></div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "WhatsApp Business API", sub: "Job alerts, quote notifications, payment confirmations", on: whatsapp, toggle: () => setWhatsapp(w => !w) },
                { label: "Termii SMS", sub: "OTPs, urgent fallback alerts", on: sms, toggle: () => setSms(s => !s) },
                { label: "Firebase Push (Android)", sub: "In-app notifications for active users", on: true, toggle: () => {} },
              ].map((n, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: C.text }}>{n.label}</p>
                    <p style={{ fontFamily: FB, fontSize: 12, color: C.textMuted }}>{n.sub}</p>
                  </div>
                  <Toggle on={n.on} onChange={n.toggle} />
                </div>
              ))}
            </div>
          </div>

          {/* Coverage areas */}
          <div className="panel">
            <div className="panel-header">
              <p className="panel-title">Coverage Areas</p>
              <button className="btn btn-green btn-sm"><Plus size={14} /> Add area</button>
            </div>
            <div style={{ padding: "14px 20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["East Legon", "Airport Residential", "Cantonments", "Osu", "Labone", "Spintex", "Tema", "Adenta", "Madina", "Achimota", "Accra Central"].map(area => (
                  <div key={area} style={{ display: "flex", gap: 6, alignItems: "center", background: C.greenPale, borderRadius: 8, padding: "6px 12px", border: `1px solid ${C.green}33` }}>
                    <span style={{ fontFamily: FB, fontSize: 13, color: C.greenLight }}>{area}</span>
                    <span style={{ color: C.textMuted, cursor: "pointer", fontSize: 14 }}><X size={14} /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin accounts */}
          <div className="panel">
            <div className="panel-header">
              <p className="panel-title">Admin Accounts</p>
              <button className="btn btn-ghost btn-sm"><Plus size={14} /> Invite admin</button>
            </div>
            <div style={{ padding: "14px 20px" }}>
              {admins.length > 0 ? admins.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 13, color: C.green }}>{a.fullName.split(" ").map(w => w[0]).join("")}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: C.text }}>{a.fullName}</p>
                    <p style={{ fontFamily: FM, fontSize: 11, color: C.textMuted }}>{a.phoneNumber}</p>
                  </div>
                  <Badge color={a.role === 'super_admin' ? C.gold : C.blue}>{a.role.replace('_', ' ')}</Badge>
                  <Badge color={a.isActive ? C.green : C.textMuted}>{a.isActive ? "active" : "inactive"}</Badge>
                </div>
              )) : <p style={{ color: C.textMuted, padding: 20 }}>No admin accounts found</p>}
            </div>
          </div>

          <button className="btn btn-green" style={{ width: "fit-content", padding: "12px 28px" }} onClick={() => addToast("Settings saved successfully")}>Save all changes</button>
        </div>
      </div>

      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast"><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, flexShrink: 0 }} />{t.msg}</div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================
   ROOT
========================================================== */
export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [page, setPage] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [statsData, adminsData] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/profiles')
        ]);
        setStats(statsData);
        setAdmins(adminsData);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);

  const PAGE_TITLES = {
    overview: ["Overview", "Real-time platform health - " + new Date().toLocaleDateString()],
    bookings: ["Bookings", "All booking records across the platform"],
    taskers: ["Tasker Management", "Vetting, activation, and performance"],
    disputes: ["Dispute Resolution", "Open cases requiring admin action"],
    payouts: ["Payouts & Escrow", "MoMo releases, holds, and manual transfers"],
    analytics: ["Analytics", "GMV, jobs, services, and area performance"],
    settings: ["Settings", "Platform configuration and admin access"],
  };

  const views = { 
    overview: Overview, 
    bookings: Bookings, 
    taskers: Taskers, 
    disputes: Disputes, 
    payouts: Payouts, 
    analytics: Analytics, 
    settings: Settings 
  };
  
  const CurrentView = views[page];

  if (authLoading) return <div style={{ background: C.bg, height: '100vh' }} />;

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, overflow: "hidden", fontFamily: FB }}>
      <Fonts />
      <Sidebar 
          active={page} 
          onChange={p => setPage(p)} 
          collapsed={collapsed} 
          onToggle={() => setCollapsed(c => !c)} 
          adminName={user?.full_name}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Topbar
          title={PAGE_TITLES[page][0]}
          subtitle={PAGE_TITLES[page][1]}
          actions={
            <div style={{ display: "flex", gap: 8 }}>
              {!collapsed && <button onClick={() => setCollapsed(true)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: C.textMuted, fontFamily: FB, fontSize: 12 }}>Collapse <ArrowLeft size={12} /></button>}
              {page === "taskers" && <button className="btn btn-gold">Review pending (2) <ArrowRight size={14} /></button>}
              {page === "disputes" && <button className="btn btn-red">2 urgent <ArrowRight size={14} /></button>}
            </div>
          }
        />
        <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
          <CurrentView onNavigate={setPage} stats={stats} admins={admins} loading={loading} />
        </div>
      </div>
    </div>
  );
}
