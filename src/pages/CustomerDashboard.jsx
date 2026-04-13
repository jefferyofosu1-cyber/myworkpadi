import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import { 
  Search, 
  Wrench, 
  User, 
  Star, 
  MapPin, 
  Shield, 
  CheckCircle, 
  Zap, 
  Lock, 
  LockKeyhole,
  Camera, 
  X, 
  Link as LinkIcon, 
  Snowflake, 
  Droplets, 
  Zap as Lightbulb, 
  Briefcase, 
  Menu, 
  LayoutGrid,
  Check,
  Info,
  Calendar,
  MessageSquare,
  Phone,
  ChevronRight,
  Clock,
  Heart,
  AlertTriangle,
  Settings as SettingsIcon,
  ClipboardList,
  Palette,
  Trash2,
  Brush,
  Droplet
} from "lucide-react";

/* --- FONTS & GLOBALS --- */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { -webkit-font-smoothing: antialiased; }

    @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.5} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes spin      { to{transform:rotate(360deg)} }
    @keyframes scaleIn   { from{transform:scale(0.94);opacity:0} to{transform:scale(1);opacity:1} }
    @keyframes barFill   { from{width:0} to{width:var(--w)} }

    .page-enter { animation: fadeUp 0.4s ease both; }
    .fade-in    { animation: fadeIn 0.3s ease both; }
    .scale-in   { animation: scaleIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }

    /* --- SHARED NAV --- */
    .top-nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(255,255,255,0.96); backdrop-filter: blur(14px);
      border-bottom: 1px solid #EEF2F7;
      padding: 0 40px; height: 64px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 1px 16px rgba(0,0,0,0.05);
    }

    /* --- CARDS --- */
    .tasker-search-card {
      background: #fff; border-radius: 20px; border: 1.5px solid #EEF2F7;
      box-shadow: 0 2px 16px rgba(0,0,0,0.06);
      cursor: pointer; transition: all 0.22s; overflow: hidden;
    }
    .tasker-search-card:hover {
      transform: translateY(-4px); border-color: #0A6E4A44;
      box-shadow: 0 12px 36px rgba(10,110,74,0.13);
    }
    .tasker-search-card.selected {
      border-color: #0A6E4A; box-shadow: 0 0 0 3px rgba(10,110,74,0.1);
    }

    .filter-chip {
      padding: 8px 16px; border-radius: 100px;
      border: 1.5px solid #EEF2F7; background: #fff;
      font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: 13px;
      cursor: pointer; transition: all 0.18s; white-space: nowrap; color: #4A5568;
    }
    .filter-chip:hover { border-color: #0A6E4A44; color: #0A6E4A; }
    .filter-chip.active {
      background: #0A6E4A; color: #fff; border-color: #0A6E4A;
      box-shadow: 0 3px 12px rgba(10,110,74,0.35);
    }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      padding: 12px 24px; border-radius: 14px; border: none; cursor: pointer;
      font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: 15px;
      transition: all 0.2s; white-space: nowrap;
    }
    .btn-sm { padding: 9px 18px; font-size: 13px; border-radius: 10px; }
    .btn-xs { padding: 6px 12px; font-size: 12px; border-radius: 8px; }
    .btn-green { background: #0A6E4A; color: #fff; box-shadow: 0 4px 16px rgba(10,110,74,0.32); }
    .btn-green:hover { background: #0D8559; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(10,110,74,0.4); }
    .btn-outline { background: transparent; color: #0A6E4A; border: 2px solid #0A6E4A; }
    .btn-outline:hover { background: #0A6E4A; color: #fff; }
    .btn-ghost { background: #F7F9FC; color: #4A5568; border: 1.5px solid #EEF2F7; box-shadow: none; }
    .btn-ghost:hover { background: #EEF2F7; }
    .btn-gold { background: #E8A020; color: #fff; box-shadow: 0 4px 16px rgba(232,160,32,0.32); }
    .btn-gold:hover { background: #D4901A; transform: translateY(-1px); }
    .btn-red { background: #FEF2F2; color: #EF4444; border: 1.5px solid #FECACA; box-shadow: none; }
    .btn-red:hover { background: #EF4444; color: #fff; }

    .input {
      width: 100%; padding: 12px 16px; border-radius: 12px;
      border: 1.5px solid #EEF2F7; background: #F7F9FC;
      font-family: 'DM Sans',sans-serif; font-size: 14px; color: #1A202C;
      outline: none; transition: all 0.2s;
    }
    .input:focus { border-color: #0A6E4A; background: #fff; box-shadow: 0 0 0 3px rgba(10,110,74,0.08); }
    .input::placeholder { color: #94A3B8; }
    select.input { appearance: none; cursor: pointer; }

    .tab-pill {
      padding: 9px 20px; border-radius: 100px; border: none; cursor: pointer;
      font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: 13px;
      transition: all 0.2s; white-space: nowrap;
    }

    .shimmer-box {
      background: linear-gradient(90deg, #f0f2f5 25%, #e8eaed 50%, #f0f2f5 75%);
      background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 10px;
    }

    .review-card {
      background: #fff; border-radius: 16px; padding: 20px;
      border: 1.5px solid #EEF2F7; box-shadow: 0 2px 10px rgba(0,0,0,0.04);
      transition: box-shadow 0.2s;
    }
    .review-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08); }

    .booking-row {
      background: #fff; border-radius: 16px; padding: 18px 20px;
      border: 1.5px solid #EEF2F7; transition: all 0.2s; cursor: pointer;
    }
    .booking-row:hover { border-color: #0A6E4A33; box-shadow: 0 4px 16px rgba(10,110,74,0.08); }

    .account-section {
      background: #fff; border-radius: 20px; border: 1.5px solid #EEF2F7;
      overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    }
    .account-row {
      padding: 16px 20px; display: flex; justify-content: space-between;
      align-items: center; border-bottom: 1px solid #EEF2F7; cursor: pointer;
      transition: background 0.15s;
    }
    .account-row:hover { background: #F7F9FC; }
    .account-row:last-child { border-bottom: none; }

    .stat-bubble {
      display: flex; flex-direction: column; align-items: center;
      padding: 16px 20px; border-radius: 16px; border: 1.5px solid #EEF2F7;
      background: #F7F9FC; gap: 3px;
    }

    .map-placeholder {
      background: linear-gradient(135deg, #E8F5EF 0%, #D4EDDF 50%, #C2E4CF 100%);
      border-radius: 16px; overflow: hidden; position: relative;
    }

    .badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 20px;
      font-family: 'DM Sans',sans-serif; font-size: 11px; font-weight: 700;
      white-space: nowrap;
    }

    .progress-ring { transform: rotate(-90deg); transform-origin: 50% 50%; }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-thumb { background: #CBD5E0; border-radius: 2px; }
  `}</style>
);

/* --- DESIGN TOKENS --- */
const G = {
  green: "#0A6E4A", greenLight: "#12A06B", greenDeep: "#064D34",
  greenPale: "#E8F5EF", gold: "#E8A020", goldPale: "#FDF4E3",
  ink: "#0D1117", slate: "#1A202C", steel: "#4A5568",
  mist: "#94A3B8", cloud: "#F7F9FC", border: "#EEF2F7", white: "#FFFFFF",
  red: "#EF4444", redPale: "#FEF2F2", blue: "#3B82F6", bluePale: "#EFF6FF",
  purple: "#8B5CF6", purplePale: "#F5F3FF",
};
const FD = "'Syne', sans-serif";
const FB = "'DM Sans', sans-serif";
const FM = "'JetBrains Mono', monospace";

/* --- SHARED COMPONENTS --- */
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
    <svg width={32} height={32} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="11" fill={G.green} />
      <path d="M13 27L21 19" stroke={G.gold} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="16" r="5" stroke="white" strokeWidth="2.2" fill="none" />
      <path d="M20 20L14.5 25.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M21 15.5L23 17.5L27 13.5" stroke={G.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.ink, letterSpacing: "-0.02em" }}>
      Task<span style={{ color: G.green }}>GH</span>
    </span>
  </div>
);

const Nav = ({ page, onChangePage }) => (
  <div className="top-nav">
    <Logo />
    <div style={{ display: "flex", gap: 6, background: G.cloud, padding: 4, borderRadius: 12, border: `1px solid ${G.border}` }}>
      {[
        { id: "search", label: "Search", icon: <Search size={14} /> },
        { id: "profile", label: "Tasker Profile", icon: <Wrench size={14} /> },
        { id: "account", label: "My Account", icon: <User size={14} /> },
      ].map(tab => (
        <button key={tab.id} onClick={() => onChangePage(tab.id)} style={{
          padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer",
          fontFamily: FB, fontWeight: page === tab.id ? 600 : 400, fontSize: 13,
          background: page === tab.id ? G.white : "transparent",
          color: page === tab.id ? G.green : G.steel,
          boxShadow: page === tab.id ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
          transition: "all 0.15s",
          display: "flex", alignItems: "center", gap: 6
        }}>
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <button className="btn btn-ghost btn-sm">Log in</button>
      <button className="btn btn-green btn-sm">Book a Tasker</button>
    </div>
  </div>
);

const Badge = ({ color, bg, children, dot }) => (
  <span className="badge" style={{ background: bg || color + "18", color, border: `1px solid ${color}33` }}>
    {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, animation: "pulse 1.5s infinite" }} />}
    {children}
  </span>
);

const Stars = ({ n = 5, size = 14 }) => (
  <div style={{ display: "flex", gap: 1 }}>
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={size} 
        fill={i < Math.round(n) ? G.gold : "transparent"} 
        stroke={i < Math.round(n) ? G.gold : G.mist} 
        strokeWidth={2}
      />
    ))}
  </div>
);

const RingChart = ({ pct, color, size = 56, stroke = 6 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={G.border} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        className="progress-ring" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    COMPLETED: { color: G.green, label: "Completed" },
    IN_PROGRESS: { color: G.blue, label: "In Progress" },
    PAID: { color: G.greenLight, label: "Paid" },
    PENDING: { color: G.gold, label: "Pending" },
    CANCELLED: { color: G.mist, label: "Cancelled" },
    DISPUTED: { color: G.red, label: "Disputed" },
    QUOTED: { color: G.purple, label: "Quoted" },
  };
  const m = map[status] || { color: G.mist, label: status };
  return <Badge color={m.color} dot={status === "IN_PROGRESS"}>{m.label}</Badge>;
};

/* ==================================================
   PAGE 1: SEARCH & FILTER RESULTS
================================================== */

const TASKERS = [
  { id: 1, name: "Emmanuel K.", init: "EK", skill: "AC Repair & Servicing", rating: 4.9, reviews: 247, jobs: 312, dist: 1.2, price: 80, area: "East Legon", badge: "Elite", avail: "Today", verified: true, bio: "10+ years fixing all AC brands. Same-day available in East Legon and nearby areas.", cats: ["AC Repair", "Electrical"], responseTime: "< 5 min" },
  { id: 2, name: "Kwabena O.", init: "KO", skill: "Master Plumber", rating: 5.0, reviews: 312, jobs: 401, dist: 2.4, price: 75, area: "Cantonments", badge: "Elite", avail: "Today", verified: true, bio: "Certified plumber specialising in emergency leaks, burst pipes, and full bathroom installations.", cats: ["Plumbing", "Borehole"], responseTime: "< 10 min" },
  { id: 3, name: "Abena M.", init: "AM", skill: "Professional Cleaner", rating: 4.8, reviews: 189, jobs: 224, dist: 3.1, price: 60, area: "Airport Area", badge: null, avail: "Today", verified: true, bio: "Detailed home cleaning with eco-friendly products. Weekly and monthly packages available.", cats: ["House Cleaning", "Deep Cleaning"], responseTime: "< 15 min" },
  { id: 4, name: "Kofi B.", init: "KB", skill: "Painter & Decorator", rating: 4.6, reviews: 58, jobs: 74, dist: 4.0, price: 65, area: "Osu", badge: null, avail: "Fri", verified: true, bio: "Interior and exterior painting. Emulsion, oil, and textured finishes. Free colour consultation.", cats: ["Painting"], responseTime: "< 20 min" },
  { id: 5, name: "Ama D.", init: "AD", skill: "Fumigation Specialist", rating: 4.7, reviews: 92, jobs: 108, dist: 4.8, price: 55, area: "Adenta", badge: null, avail: "Today", verified: true, bio: "Licensed fumigation for cockroaches, mosquitoes, rats, and bedbugs. Safe for children and pets.", cats: ["Fumigation", "Pest Control"], responseTime: "< 30 min" },
  { id: 6, name: "Samuel O.", init: "SO", skill: "CCTV & Security", rating: 4.8, reviews: 67, jobs: 89, dist: 5.5, price: 70, area: "Spintex", badge: null, avail: "Sat", verified: true, bio: "IP camera installation, DVR setup, remote viewing configuration for homes and businesses.", cats: ["CCTV", "Security"], responseTime: "< 20 min" },
];

const SERVICES_LIST = ["All", "AC Repair", "Plumbing", "Cleaning", "Painting", "Electrical", "Fumigation", "CCTV", "Carpentry"];

const SearchPage = ({ taskers, loading: externalLoading, onViewProfile }) => {
  const [query, setQuery] = useState("AC Repair");
  const [area, setArea] = useState("East Legon");
  const [sort, setSort] = useState("rating");
  const [service, setService] = useState("All");
  const [priceMax, setPriceMax] = useState(150);
  const [availToday, setAvailToday] = useState(false);
  const [eliteOnly, setEliteOnly] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const filtered = (taskers || [])
    .filter(t => service === "All" || (t.skills && t.skills.some(s => s.toLowerCase().includes(service.toLowerCase()))))
    .filter(t => t.hourlyRate <= priceMax)
    .filter(t => !availToday || t.isAvailable)
    .sort((a, b) => sort === "rating" ? b.rating - a.rating : sort === "price" ? a.hourlyRate - b.hourlyRate : 0);

  const isLoading = loading || externalLoading;

  return (
    <div style={{ minHeight: "100vh", background: G.cloud }}>
      {/* Hero search bar */}
      <div style={{ background: `linear-gradient(160deg, ${G.greenDeep}, ${G.green})`, padding: "36px 40px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1 className="page-enter" style={{ fontFamily: FD, fontWeight: 800, fontSize: 30, color: G.white, marginBottom: 6 }}>
            Find Taskers Near You
          </h1>
          <p style={{ fontFamily: FB, fontSize: 15, color: "rgba(255,255,255,0.75)", marginBottom: 20 }}>
            ID-verified professionals - Escrow-protected payments - Happiness guarantee
          </p>
          <div style={{ display: "flex", gap: 10, background: G.white, borderRadius: 16, padding: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", maxWidth: 700 }}>
            <div style={{ flex: 1, display: "flex", gap: 10, alignItems: "center", paddingLeft: 12 }}>
              <Search size={18} color={G.mist} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="What do you need help with?" style={{ flex: 1, border: "none", outline: "none", fontFamily: FB, fontSize: 15, color: G.slate, background: "transparent" }} />
            </div>
            <div style={{ width: 1, background: G.border, margin: "8px 0" }} />
            <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "0 12px" }}>
              <MapPin size={16} color={G.mist} />
              <input value={area} onChange={e => setArea(e.target.value)} placeholder="Area in Accra" style={{ width: 140, border: "none", outline: "none", fontFamily: FB, fontSize: 14, color: G.slate, background: "transparent" }} />
            </div>
            <button className="btn btn-green" onClick={handleSearch} style={{ borderRadius: 10 }}>
              {loading ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: G.white, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Service filter pills */}
      <div style={{ background: G.white, borderBottom: `1px solid ${G.border}`, padding: "14px 40px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 8, maxWidth: 1100, margin: "0 auto", width: "max-content" }}>
          {SERVICES_LIST.map(s => (
            <button key={s} className={`filter-chip ${service === s ? "active" : ""}`} onClick={() => setService(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 40px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>
        {/* Filter sidebar */}
        <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: G.white, borderRadius: 20, border: `1.5px solid ${G.border}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${G.border}` }}>
              <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.slate }}>Filters</p>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Sort */}
              <div>
                <p style={{ fontFamily: FB, fontSize: 12, color: G.mist, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Sort by</p>
                {[
                  { id: "rating", label: "Highest rated", icon: <Star size={14} /> }, 
                  { id: "price", label: "Lowest price", icon: <Briefcase size={14} /> }, 
                  { id: "dist", label: "Nearest first", icon: <MapPin size={14} /> }
                ].map(opt => (
                  <div key={opt.id} onClick={() => setSort(opt.id)} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", cursor: "pointer", borderBottom: `1px solid ${G.border}` }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sort === opt.id ? G.green : G.border}`, background: sort === opt.id ? G.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", flexShrink: 0 }}>
                      {sort === opt.id && <div style={{ width: 7, height: 7, borderRadius: "50%", background: G.white }} />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: sort === opt.id ? G.green : G.steel, fontWeight: sort === opt.id ? 600 : 400 }}>
                      <span style={{ color: sort === opt.id ? G.green : G.mist }}>{opt.icon}</span>
                      <span style={{ fontFamily: FB, fontSize: 13 }}>{opt.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ fontFamily: FB, fontSize: 12, color: G.mist, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Max hourly rate</p>
                  <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 13, color: G.green }}>GHS {priceMax}</p>
                </div>
                <input type="range" min={40} max={150} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{ width: "100%", accentColor: G.green }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontFamily: FM, fontSize: 10, color: G.mist }}>GHS 40</span>
                  <span style={{ fontFamily: FM, fontSize: 10, color: G.mist }}>GHS 150</span>
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Available today only", val: availToday, set: setAvailToday },
                  { label: "Elite Taskers only", val: eliteOnly, set: setEliteOnly, icon: <Star size={12} fill={G.gold} stroke={G.gold} /> },
                ].map(({ label, val, set, icon }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: FB, fontSize: 13, color: G.steel }}>{label}</span>
                      {icon}
                    </div>
                    <div onClick={() => set(v => !v)} style={{ width: 42, height: 24, borderRadius: 12, background: val ? G.green : G.border, cursor: "pointer", position: "relative", transition: "background 0.25s" }}>
                      <div style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", background: G.white, top: 3, left: val ? 21 : 3, transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust callout */}
          <div style={{ background: G.greenPale, borderRadius: 16, padding: 16, border: `1px solid ${G.green}22` }}>
            <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 14, color: G.green, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={16} /> All Taskers are:
            </p>
            {["ID-verified (Ghana Card)", "Background checked", "Rated by real customers", "Covered by our Happiness Guarantee"].map(p => (
              <div key={p} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                <CheckCircle size={14} color={G.green} />
                <span style={{ fontFamily: FB, fontSize: 12, color: G.steel }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, color: G.slate }}>{filtered.length} Taskers found</p>
              <p style={{ fontFamily: FB, fontSize: 13, color: G.mist }}>for "{service}" near {area}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["list", "grid"].map(v => (
                <button key={v} onClick={() => setViewMode(v)} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${viewMode === v ? G.green : G.border}`, background: viewMode === v ? G.greenPale : G.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: viewMode === v ? G.green : G.mist, transition: "all 0.15s" }}>
                  {v === "list" ? <Menu size={18} /> : <LayoutGrid size={18} />}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[1, 2, 3].map(i => <div key={i} className="shimmer-box" style={{ height: 140, borderRadius: 20 }} />)}
            </div>
          ) : viewMode === "list" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filtered.map((t, i) => (
                <div key={t.id} className="tasker-search-card" onClick={() => { setSelected(t); onViewProfile(t); }}
                  style={{ animation: `fadeUp 0.4s ${i * 0.07}s ease both` }}>
                  <div style={{ padding: "20px 22px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                    {/* Avatar */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${G.green}, ${G.greenLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.white }}>{t.init}</div>
                      {t.verified && <div style={{ position: "absolute", bottom: -3, right: -3, width: 20, height: 20, borderRadius: "50%", background: G.green, border: `2.5px solid ${G.white}`, display: "flex", alignItems: "center", justifyContent: "center", color: G.white }}><Check size={12} strokeWidth={4} /></div>}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, color: G.slate }}>{t.name}</p>
                          {t.badge && <Badge color={G.gold}><Star size={10} fill={G.gold} stroke={G.gold} /> {t.badge}</Badge>}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.green }}>GHS {t.hourlyRate}<span style={{ fontFamily: FB, fontWeight: 400, fontSize: 12, color: G.mist }}>/hr</span></p>
                        </div>
                      </div>
                      <p style={{ fontFamily: FB, fontSize: 13, color: G.steel, marginBottom: 8 }}>{t.skills.join(", ")}</p>
                      <p style={{ fontFamily: FB, fontSize: 13, color: G.mist, lineHeight: 1.55, marginBottom: 10 }}>Expert professional with verified skills ready to help.</p>
                      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <Stars n={t.rating} size={13} />
                          <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.slate }}>{t.rating}</span>
                          <span style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>(84)</span>
                        </div>
                        <span style={{ fontFamily: FB, fontSize: 13, color: G.mist }}>-</span>
                        <span style={{ fontFamily: FB, fontSize: 12, color: G.steel }}>{t.totalJobs} jobs done</span>
                        <span style={{ fontFamily: FB, fontSize: 13, color: G.mist }}>-</span>
                        <div style={{ padding: "4px 8px", background: G.cloud, borderRadius: 6, display: "flex", gap: 3, alignItems: "center" }}>
                          <Clock size={12} color={G.mist} />
                          <p style={{ fontFamily: FM, fontSize: 11, color: G.mist }}>Replies {t.responseTime}</p>
                        </div>
                        <span style={{ fontFamily: FB, fontSize: 13, color: G.mist }}>-</span>
                        <div style={{ padding: "4px 8px", background: G.greenPale, borderRadius: 6, display: "flex", gap: 3, alignItems: "center" }}>
                          <Check size={12} color={G.green} />
                          <p style={{ fontFamily: FM, fontSize: 11, color: G.green }}>{t.avail}</p>
                        </div>
                        <span style={{ fontFamily: FB, fontSize: 13, color: G.mist }}>-</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: G.green }}>
                          <MapPin size={12} />
                          <span style={{ fontFamily: FB, fontSize: 12 }}>{t.residentialArea}</span>
                        </div>
                        <span style={{ fontFamily: FB, fontSize: 13, color: G.mist }}>-</span>
                        <Badge color={t.isAvailable ? G.green : G.gold}>
                          {t.isAvailable ? <Check size={10} strokeWidth={3} /> : <Clock size={10} />}
                          {t.isAvailable ? "Today" : "Away"}
                        </Badge>
                        <Badge color={G.blue}><Zap size={10} fill={G.blue} stroke={G.blue} /> Replies fast</Badge>
                      </div>
                    </div>
                    {/* CTA */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                      <button className="btn btn-green btn-sm" onClick={e => { e.stopPropagation(); onViewProfile(t); }}>Book Now</button>
                      <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); onViewProfile(t); }}>View Profile</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {filtered.map((t, i) => (
                <div key={t.id} className="tasker-search-card" onClick={() => onViewProfile(t)} style={{ animation: `fadeUp 0.4s ${i * 0.07}s ease both`, padding: 20 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${G.green}, ${G.greenLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.white }}>{t.init}</div>
                    <div>
                      <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.slate }}>{t.name}</p>
                      <p style={{ fontFamily: FB, fontSize: 12, color: G.steel }}>{t.skill}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                    <Star size={12} fill={G.gold} stroke={G.gold} />
                    <span style={{ fontFamily: FM, fontSize: 12, color: G.slate, fontWeight: 700 }}>{t.rating}</span>
                    <span style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>- {t.jobs} jobs</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: G.green }}>GHS {t.hourlyRate}/hr</p>
                    <button className="btn btn-green btn-xs">Book</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==================================================
   PAGE 2: TASKER PUBLIC PROFILE
================================================== */

const REVIEWS_DATA = [
  { name: "Sandra A.", area: "East Legon", stars: 5, date: "2 days ago", service: "AC Repair", text: "Emmanuel was fantastic. He arrived on time, diagnosed the problem quickly, and fixed it within 2 hours. The escrow payment system made me feel completely safe. Would absolutely hire again!", verified: true },
  { name: "Kofi B.", area: "Cantonments", stars: 5, date: "1 week ago", service: "Electrical Fault", text: "Very professional and knowledgeable. Explained everything clearly. Fixed a persistent electrical fault that 2 other electricians had failed to sort. Highly recommended!", verified: true },
  { name: "Ama S.", area: "Airport Area", stars: 4, date: "2 weeks ago", service: "AC Servicing", text: "Good service overall. Arrived slightly late but communicated well. The AC is working perfectly now. Will book again.", verified: true },
  { name: "Nana K.", area: "Spintex", stars: 5, date: "3 weeks ago", service: "Generator Repair", text: "Emmanuel fixed my generator in record time. He even stayed an extra 30 minutes to make sure everything was running properly. Above and beyond!", verified: true },
  { name: "Joe A.", area: "Labone", stars: 5, date: "1 month ago", service: "AC Installation", text: "Excellent work installing our new AC unit. Clean, professional, and very reasonably priced. The receipt upload system for materials was really reassuring.", verified: true },
];

const ProfilePage = ({ tasker }) => {
  const t = tasker || TASKERS[0];
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const ratingBreakdown = [
    { stars: 5, pct: 84 }, { stars: 4, pct: 10 }, { stars: 3, pct: 4 }, { stars: 2, pct: 1 }, { stars: 1, pct: 1 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: G.cloud }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${G.greenDeep} 0%, ${G.green} 60%, #0D8559 100%)`, padding: "40px 40px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 100, width: 180, height: 180, borderRadius: "50%", background: G.gold + "12" }} />
        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>
          <div className="page-enter" style={{ display: "flex", gap: 24, alignItems: "flex-end", paddingBottom: 24 }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 100, height: 100, borderRadius: 24, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 36, color: G.white, border: "3px solid rgba(255,255,255,0.3)" }}>{t.init}</div>
              <div style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, borderRadius: "50%", background: G.green, border: `3px solid ${G.white}`, display: "flex", alignItems: "center", justifyContent: "center", color: G.white }}><Check size={16} strokeWidth={4} /></div>
            </div>
            {/* Name & info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: G.white, letterSpacing: "-0.02em" }}>{t.name}</h1>
                {t.badge && <Badge color={G.gold} bg={G.gold + "33"}><Star size={12} fill={G.gold} stroke={G.gold} /> {t.badge} Tasker</Badge>}
                <p style={{ fontFamily: FB, fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 10 }}>{t.skill} - {t.area}</p>
              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <Stars n={t.rating} size={15} />
                  <span style={{ fontFamily: FM, fontSize: 13, color: G.gold, fontWeight: 800 }}>{t.rating} rating</span>
                  <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>-</span>
                  <span style={{ fontFamily: FM, fontSize: 13, color: G.white, fontWeight: 600 }}>{t.jobs} jobs</span>
                  <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>-</span>
                  <Badge color={G.white} bg="rgba(255,255,255,0.15)">{t.badge}</Badge>
                </div>
                <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>-</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.85)" }}>
                  <MapPin size={13} />
                  <span style={{ fontFamily: FB, fontSize: 13 }}>{t.dist} km away</span>
                </div>
                <Badge color="rgba(255,255,255,0.9)" bg="rgba(255,255,255,0.15)"><Zap size={12} fill="white" stroke="white" /> Replies in {t.responseTime}</Badge>
              </div>
            </div>
            {/* CTA */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <button className="btn btn-ghost" onClick={() => { setShareToast(true); setTimeout(() => setShareToast(false), 2500); }} style={{ background: "rgba(255,255,255,0.15)", color: G.white, border: "1px solid rgba(255,255,255,0.25)", borderRadius: 12 }}>
                <LinkIcon size={16} /> Share
              </button>
              <button className="btn btn-gold" onClick={() => setBookingOpen(true)} style={{ borderRadius: 12, fontSize: 16, padding: "12px 28px" }}>Book Emmanuel <ChevronRight size={18} /></button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {["overview", "reviews", "gallery"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "14px 24px", background: "none", border: "none", cursor: "pointer", fontFamily: FB, fontWeight: activeTab === tab ? 700 : 500, fontSize: 14, color: activeTab === tab ? G.white : "rgba(255,255,255,0.55)", borderBottom: `2.5px solid ${activeTab === tab ? G.gold : "transparent"}`, transition: "all 0.2s", textTransform: "capitalize" }}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 40px" }}>
        {activeTab === "overview" && (
          <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
            {/* Left */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* About */}
              <div style={{ background: G.white, borderRadius: 20, padding: 24, border: `1.5px solid ${G.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate, marginBottom: 12 }}>About Emmanuel</p>
                <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, lineHeight: 1.75 }}>{t.bio} With over 10 years of hands-on experience across residential and commercial properties in Accra, Emmanuel brings both technical expertise and genuine care to every job. He's certified in R410A refrigerant handling and holds an ECOWAS electrical safety certificate.</p>
              </div>

              {/* Services */}
              <div style={{ background: G.white, borderRadius: 20, padding: 24, border: `1.5px solid ${G.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate, marginBottom: 16 }}>Services Offered</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    { icon: <Snowflake size={20} />, name: "AC Repair & Diagnosis", type: "Assessment", price: "GHS 25 assessment + quote" },
                    { icon: <Snowflake size={20} />, name: "AC Gas Recharge (R410A)", type: "Fixed", price: "GHS 180-220" },
                    { icon: <Snowflake size={20} />, name: "AC Deep Clean & Service", type: "Fixed", price: "GHS 120" },
                    { icon: <Zap size={20} />, name: "Electrical Fault Finding", type: "Assessment", price: "GHS 25 assessment + quote" },
                    { icon: <Briefcase size={20} />, name: "Generator Repair", type: "Assessment", price: "GHS 25 assessment + quote" },
                  ].map((svc, i, arr) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${G.border}` : "none" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{svc.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate }}>{svc.name}</p>
                        <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                          <Badge color={svc.type === "Assessment" ? G.gold : G.green}>{svc.type}</Badge>
                          <span style={{ fontFamily: FM, fontSize: 12, color: G.steel }}>{svc.price}</span>
                        </div>
                      </div>
                      <button className="btn btn-green btn-xs" onClick={() => setBookingOpen(true)}>Book</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating breakdown */}
              <div style={{ background: G.white, borderRadius: 20, padding: 24, border: `1.5px solid ${G.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate, marginBottom: 16 }}>Rating Breakdown</p>
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 52, color: G.green, lineHeight: 1 }}>{t.rating}</p>
                    <Stars n={t.rating} size={16} />
                    <p style={{ fontFamily: FB, fontSize: 12, color: G.mist, marginTop: 4 }}>{t.reviews} reviews</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    {ratingBreakdown.map(r => (
                      <div key={r.stars} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontFamily: FM, fontSize: 11, color: G.mist, minWidth: 12 }}>{r.stars}</span>
                        <Star size={11} fill={G.gold} stroke={G.gold} />
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: G.cloud, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 3, background: G.gold, width: `${r.pct}%`, animation: "barFill 0.8s ease both" }} />
                        </div>
                        <span style={{ fontFamily: FM, fontSize: 11, color: G.mist, minWidth: 28, textAlign: "right" }}>{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top 2 reviews */}
              <div>
                <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate, marginBottom: 14 }}>Recent Reviews</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {REVIEWS_DATA.slice(0, 2).map((r, i) => (
                    <div key={i} className="review-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 13, color: G.green }}>{r.name.split(" ").map(w => w[0]).join("")}</div>
                          <div>
                            <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate }}>{r.name}</p>
                            <div style={{ display: "flex", gap: 3, alignItems: "center" }}><Stars n={r.stars} size={11} /></div>
                            <p style={{ fontFamily: FB, fontSize: 12 }}>{r.area} - {r.date}</p>
                          </div>
                        </div>
                        <div>
                          <Stars n={r.stars} size={13} />
                          <p style={{ fontFamily: FM, fontSize: 10, color: G.mist, marginTop: 2, textAlign: "right" }}>{r.service}</p>
                        </div>
                      </div>
                      <p style={{ fontFamily: FB, fontSize: 13, color: G.steel, lineHeight: 1.7, fontStyle: "italic" }}>"{r.text}"</p>
                      {r.verified && <div style={{ marginTop: 8 }}><Badge color={G.green}><CheckCircle size={10} /> Verified booking</Badge></div>}
                    </div>
                  ))}
                  <button className="btn btn-ghost" onClick={() => setActiveTab("reviews")} style={{ width: "100%", justifyContent: "center" }}>See all {t.reviews} reviews <ChevronRight size={16} /></button>
                </div>
              </div>
            </div>

            {/* Right sticky panel */}
            <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 16, height: "fit-content" }}>
              {/* Booking card */}
              <div style={{ background: G.white, borderRadius: 20, padding: 24, border: `1.5px solid ${G.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <p style={{ fontFamily: FM, fontSize: 11, color: G.mist, marginBottom: 3 }}>HOURLY RATE</p>
                    <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: G.green }}>GHS {t.price}<span style={{ fontFamily: FB, fontWeight: 400, fontSize: 14, color: G.mist }}>/hr</span></p>
                  </div>
                  <Badge color={G.green} dot>Available Today</Badge>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
                  {[
                    { val: t.rating, label: "Rating", icon: <Star size={18} fill={G.gold} stroke={G.gold} /> },
                    { val: t.jobs, label: "Jobs done", icon: <CheckCircle size={18} color={G.green} /> },
                    { val: t.responseTime, label: "Response", icon: <Zap size={18} fill={G.blue} stroke={G.blue} /> },
                  ].map(s => (
                    <div key={s.label} className="stat-bubble">
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                      <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 14, color: G.slate }}>{s.val}</p>
                      <p style={{ fontFamily: FB, fontSize: 10, color: G.mist }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <button className="btn btn-green" style={{ width: "100%", fontSize: 16, padding: "15px", marginBottom: 10 }} onClick={() => setBookingOpen(true)}>Book Emmanuel Now <ChevronRight size={18} /></button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-outline btn-sm" style={{ flex: 1 }}><MessageSquare size={16} /> Message</button>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}><Phone size={16} /> Call</button>
                </div>
                <div style={{ marginTop: 14, background: G.greenPale, borderRadius: 12, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                  <Lock size={16} color={G.green} />
                  <p style={{ fontFamily: FB, fontSize: 12, color: G.green }}>Payment held in escrow until you confirm the job is done</p>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ background: G.white, borderRadius: 20, padding: 18, border: `1.5px solid ${G.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                {[
                  { icon: <User size={20} color={G.green} />, title: "Ghana Card verified", sub: "ID checked by our team" },
                  { icon: <Shield size={20} color={G.blue} />, title: "Background checked", sub: "Clean record confirmed" },
                  { icon: <Star size={20} color={G.gold} fill={G.gold} />, title: "Elite Tasker", sub: "100+ jobs, 4.9+ rating" },
                  { icon: <CheckCircle size={20} color={G.green} />, title: "MoMo payouts", sub: "Gets paid same-day on completion" }
                ].map(({ icon, title, sub }) => (
                  <div key={title} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${G.border}` }}>
                    {icon}
                    <div>
                      <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.slate }}>{title}</p>
                      <p style={{ fontFamily: FB, fontSize: 11, color: G.mist }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {REVIEWS_DATA.map((r, i) => (
                <div key={i} className="review-card" style={{ animation: `fadeUp 0.4s ${i * 0.07}s ease both` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.green }}>{r.name.split(" ").map(w => w[0]).join("")}</div>
                      <div>
                        <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate }}>{r.name}</p>
                        <div style={{ display: "flex", gap: 3, alignItems: "center" }}><Stars n={r.stars} size={11} /></div>
                        <p style={{ fontFamily: FB, fontSize: 12 }}>{r.area} - {r.date}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Stars n={r.stars} size={14} />
                      <p style={{ fontFamily: FM, fontSize: 11, color: G.mist, marginTop: 2 }}>{r.service}</p>
                    </div>
                  </div>
                  <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, lineHeight: 1.75, fontStyle: "italic", marginBottom: 8 }}>"{r.text}"</p>
                  {r.verified && <Badge color={G.green}><CheckCircle size={10} /> Verified booking</Badge>}
                </div>
              ))}
            </div>
            <div style={{ position: "sticky", top: 88 }}>
              <div style={{ background: G.white, borderRadius: 20, padding: 24, border: `1.5px solid ${G.border}` }}>
                <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 24, color: G.green, textAlign: "center" }}>{t.rating}</p>
                <div style={{ textAlign: "center", marginBottom: 16 }}><Stars n={t.rating} size={18} /></div>
                {ratingBreakdown.map(r => (
                  <div key={r.stars} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontFamily: FM, fontSize: 11, color: G.mist, minWidth: 8 }}>{r.stars}</span>
                    <Star size={11} fill={G.gold} stroke={G.gold} />
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: G.cloud }}>
                      <div style={{ height: "100%", borderRadius: 3, background: G.gold, width: `${r.pct}%` }} />
                    </div>
                    <span style={{ fontFamily: FM, fontSize: 11, color: G.mist, minWidth: 28 }}>{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="page-enter">
            <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, color: G.slate, marginBottom: 16 }}>Recent Work Photos</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ borderRadius: 16, background: `linear-gradient(135deg, ${G.greenPale}, ${G.white})`, height: 200, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${G.border}`, cursor: "pointer", transition: "all 0.2s" }} className="tasker-search-card">
                  <div style={{ textAlign: "center" }}>
                    <Camera size={36} color={G.mist} style={{ marginBottom: 6 }} />
                    <p style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>Job photo {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking modal */}
      {bookingOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", animation: "fadeIn 0.2s ease" }} onClick={() => setBookingOpen(false)}>
          <div className="scale-in" style={{ background: G.white, borderRadius: 24, padding: 32, width: 460, boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.slate }}>Book {t.name}</p>
              <button onClick={() => setBookingOpen(false)} style={{ background: G.cloud, border: "none", width: 32, height: 32, borderRadius: 8, cursor: "pointer", color: G.steel, display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flex: "column", gap: 14, marginBottom: 20 }}>
              <div style={{ marginBottom: 14 }}><label style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: G.steel, display: "block", marginBottom: 7 }}>Select service</label>
                <select className="input"><option>AC Repair & Diagnosis (Assessment - GHS 25)</option><option>AC Gas Recharge (Fixed - GHS 180)</option><option>Electrical Fault (Assessment - GHS 25)</option></select>
              </div>
              <div style={{ marginBottom: 14 }}><label style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: G.steel, display: "block", marginBottom: 7 }}>Preferred date & time</label>
                <input className="input" type="datetime-local" defaultValue="2026-04-12T14:00" />
              </div>
              <div style={{ marginBottom: 20 }}><label style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: G.steel, display: "block", marginBottom: 7 }}>Your address</label>
                <input className="input" placeholder="Enter your address in Accra" />
              </div>
            </div>
            <div style={{ background: G.greenPale, borderRadius: 12, padding: 14, marginBottom: 20, display: "flex", gap: 8 }}>
              <LockKeyhole size={16} color={G.green} />
              <p style={{ fontFamily: FB, fontSize: 12, color: G.green, lineHeight: 1.6 }}>Assessment fee of GHS 25 is held in escrow until you approve the quote. Credited toward your total.</p>
            </div>
            <button className="btn btn-green" style={{ width: "100%", fontSize: 16 }}>Continue to Payment <ChevronRight size={18} /></button>
          </div>
        </div>
      )}

      {shareToast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: G.slate, color: G.white, borderRadius: 12, padding: "12px 20px", fontFamily: FB, fontSize: 14, zIndex: 300, animation: "fadeIn 0.2s ease", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
          <LinkIcon size={16} /> Profile link copied to clipboard!
        </div>
      )}
    </div>
  );
};

/* ==================================================
   PAGE 3: CUSTOMER ACCOUNT & JOB HISTORY
================================================== */

const BOOKINGS_HISTORY = [
  { id: "BK-7841", service: "AC Repair & Servicing", tasker: "Emmanuel K.", taskerInit: "EK", date: "Today, 2:00 PM", amount: "GHS 355", status: "IN_PROGRESS", area: "East Legon", rating: null, type: "AC" },
  { id: "BK-7820", service: "House Cleaning", tasker: "Abena M.", taskerInit: "AM", date: "Mon 8 Apr", amount: "GHS 120", status: "PAID", area: "Airport Area", rating: 5, type: "Cleaning" },
  { id: "BK-7802", service: "Plumbing Repair", tasker: "Kwabena O.", taskerInit: "KO", date: "Thu 4 Apr", amount: "GHS 240", status: "PAID", area: "East Legon", rating: 5, type: "Plumbing" },
  { id: "BK-7775", service: "Electrical Fault", tasker: "Emmanuel K.", taskerInit: "EK", date: "Fri 28 Mar", amount: "GHS 180", status: "COMPLETED", area: "East Legon", rating: null, type: "Electrical" },
  { id: "BK-7750", service: "Polytank Cleaning", tasker: "Ama D.", taskerInit: "AD", date: "Mon 24 Mar", amount: "GHS 80", status: "PAID", area: "Adenta", rating: 4, type: "Plumbing" },
  { id: "BK-7720", service: "AC Repair", tasker: "Emmanuel K.", taskerInit: "EK", date: "Tue 18 Mar", amount: "GHS 310", status: "PAID", area: "East Legon", rating: 5, type: "AC" },
  { id: "BK-7690", service: "Painting", tasker: "Kofi B.", taskerInit: "KB", date: "Fri 8 Mar", amount: "GHS 450", status: "CANCELLED", area: "Osu", rating: null, type: "Painting" },
];

const AccountPage = ({ user, bookings, onSignOut }) => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const statuses = ["All", "requested", "assigned", "arrived", "in_progress", "completed", "confirmed", "paid", "cancelled"];
  const filtered = (bookings || []).filter(b => filter === "All" || b.status === filter);

  const totalSpent = filtered.filter(b => b.status === "paid").reduce((s, b) => s + (b.total_quote_ghs || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: G.cloud }}>
      {/* Profile hero */}
      <div style={{ background: `linear-gradient(160deg, ${G.ink}, #1E2340)`, padding: "36px 40px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: G.green + "18" }} />
        <div style={{ position: "absolute", bottom: 0, left: 100, width: 140, height: 140, borderRadius: "50%", background: G.gold + "12" }} />
        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>
          <div className="page-enter" style={{ display: "flex", gap: 20, alignItems: "flex-end", paddingBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: 22, background: `linear-gradient(135deg, ${G.green}, ${G.greenLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 28, color: G.white, border: "3px solid rgba(255,255,255,0.2)", flexShrink: 0 }}>
                {user?.full_name?.split(" ").map(n => n[0]).join("") || "U"}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: G.white, marginBottom: 4 }}>{user?.full_name || "TaskGH User"}</h1>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <p style={{ fontFamily: FB, fontSize: 14, color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={14} /> {user?.residential_area || "Accra, Ghana"}</p>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>-</span>
                <p style={{ fontFamily: FB, fontSize: 14, color: "rgba(255,255,255,0.65)" }}>Member since Jan 2026</p>
                <Badge color={G.gold} bg={G.gold + "33"}>Trusted Customer</Badge>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(e => !e)} style={{ background: "rgba(255,255,255,0.1)", color: G.white, border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12 }}>
              {editMode ? "Save changes" : "Edit profile"}
            </button>
          </div>

          {/* Summary stats */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {[{ val: bookings.length, label: "Total bookings", color: G.blue }, { val: bookings.filter(b => b.status === "paid").length, label: "Completed", color: G.green }, { val: `GHS ${totalSpent.toLocaleString()}`, label: "Total spent", color: G.gold }, { val: "4.9", label: "Avg Rating", color: G.gold }].map((s, i) => (
              <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.12)" }}>
                <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: s.color }}>{s.val}</p>
                <p style={{ fontFamily: FB, fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0 }}>
            {[{ id: "bookings", label: "Job History", icon: <ClipboardList size={14} /> }, { id: "taskers", label: "Saved Taskers", icon: <Heart size={14} /> }, { id: "settings", label: "Account Settings", icon: <SettingsIcon size={14} /> }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "13px 24px", background: "none", border: "none", cursor: "pointer", fontFamily: FB, fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 14, color: activeTab === tab.id ? G.white : "rgba(255,255,255,0.5)", borderBottom: `2.5px solid ${activeTab === tab.id ? G.gold : "transparent"}`, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 40px" }}>

        {/* --- JOB HISTORY --- */}
        {activeTab === "bookings" && (
          <div className="page-enter">
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {statuses.map(s => (
                  <button key={s} className={`tab-pill ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)} style={{ background: filter === s ? G.green : G.white, color: filter === s ? G.white : G.steel, border: `1.5px solid ${filter === s ? G.green : G.border}`, boxShadow: filter === s ? `0 3px 10px ${G.green}44` : "0 1px 4px rgba(0,0,0,0.05)" }}>
                    {s === "All" ? "All" : s.replace("_", " ")} {s === "All" ? `(${bookings.length})` : `(${bookings.filter(b => b.status === s).length})`}
                  </button>
                ))}
              </div>
              <p style={{ fontFamily: FM, fontSize: 12, color: G.mist }}>{filtered.length} bookings</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((b, i) => (
                <div key={b.id} className="booking-row" onClick={() => setSelectedBooking(selectedBooking?.id === b.id ? null : b)} style={{ animation: `fadeUp 0.4s ${i * 0.06}s ease both`, borderColor: selectedBooking?.id === b.id ? G.green + "55" : G.border }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", color: G.green, flexShrink: 0 }}>
                        {b.categories?.name?.includes("AC") ? <Snowflake size={24} /> : b.categories?.name?.includes("Clean") ? <Brush size={24} /> : <Wrench size={24} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.slate }}>{b.categories?.name || "General Task"}</p>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: G.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 700, fontSize: 9, color: G.white }}>
                                {b.tasker?.profiles?.full_name?.split(" ").map(n => n[0]).join("") || "T"}
                            </div>
                            <p style={{ fontFamily: FB, fontSize: 13, color: G.steel }}>{b.tasker?.profiles?.full_name || "Assigned Tasker"}</p>
                            <Star size={11} fill={G.gold} stroke={G.gold} />
                            <p style={{ fontFamily: FB, fontSize: 12, color: G.mist, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {b.location_address?.split(",")[0] || "Accra"}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: G.green }}>GHS {b.total_quote_ghs || b.assessment_fee_ghs}</p>
                          <p style={{ fontFamily: FM, fontSize: 11, color: G.mist, marginTop: 2 }}>{new Date(b.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                        <StatusBadge status={b.status} />
                        <span className="mono" style={{ fontSize: 11, color: G.mist }}>{b.id}</span>
                        {b.rating && <div style={{ display: "flex", gap: 3, alignItems: "center" }}><Stars n={b.rating} size={12} /><span style={{ fontFamily: FM, fontSize: 11, color: G.steel }}>{b.rating}</span></div>}
                        {b.status === "IN_PROGRESS" && <Badge color={G.blue} dot>Live now</Badge>}
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {selectedBooking?.id === b.id && (
                    <div className="fade-in" style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${G.border}`, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {b.status === "PAID" && !b.rating && <button className="btn btn-gold btn-sm">Rate this job</button>}
                      {b.status === "PAID" && <button className="btn btn-green btn-sm">Rebook {b.tasker.split(" ")[0]}</button>}
                      {b.status === "IN_PROGRESS" && <button className="btn btn-green btn-sm">Track live</button>}
                      {b.status === "IN_PROGRESS" && <button className="btn btn-ghost btn-sm">Chat</button>}
                      {b.status === "COMPLETED" && <button className="btn btn-gold btn-sm">Confirm & Pay</button>}
                      <button className="btn btn-ghost btn-sm">View receipt</button>
                      {(b.status === "COMPLETED" || b.status === "PAID") && <button className="btn btn-red btn-sm" style={{ marginLeft: "auto" }}>Raise dispute</button>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SAVED TASKERS --- */}
        {activeTab === "taskers" && (
          <div className="page-enter">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, color: G.slate }}>Saved Taskers</p>
              <button className="btn btn-green btn-sm">Browse all Taskers</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {taskers.slice(0, 4).map((t, i) => (
                <div key={i} className="tasker-search-card" style={{ padding: 20, animation: `fadeUp 0.4s ${i * 0.08}s ease both` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${G.green}, ${G.greenLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.white }}>
                        {t.fullName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: G.red }}><Heart size={20} fill={G.red} /></button>
                  </div>
                  <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.slate, marginBottom: 2 }}>{t.fullName}</p>
                  <p style={{ fontFamily: FB, fontSize: 12, color: G.steel, marginBottom: 8 }}>{t.skills.join(", ")}</p>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
                    <Stars n={t.rating} size={12} />
                    <span style={{ fontFamily: FM, fontSize: 12, color: G.slate, fontWeight: 600 }}>{t.rating}</span>
                    <span style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>- {t.totalJobs} jobs</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-green btn-xs" style={{ flex: 1 }}>Book</button>
                    <button className="btn btn-ghost btn-xs">Profile</button>
                  </div>
                </div>
              ))}
              {/* Add more slot */}
              <div style={{ border: `2px dashed ${G.border}`, borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "border-color 0.2s", minHeight: 180 }} className="tasker-search-card">
                <div style={{ width: 48, height: 48, borderRadius: 14, background: G.cloud, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>+</div>
                <p style={{ fontFamily: FB, fontSize: 13, color: G.mist, textAlign: "center" }}>Browse more Taskers to save</p>
              </div>
            </div>
          </div>
        )}

        {/* --- ACCOUNT SETTINGS --- */}
        {activeTab === "settings" && (
          <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Personal info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="account-section">
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${G.border}` }}>
                  <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.slate }}>Personal Information</p>
                </div>
                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                  {[["Full name", user?.full_name], ["Phone", user?.phone_number], ["Email", user?.email || "No email set"], ["Location", user?.residential_area]].map(([label, val]) => (
                    <div key={label}>
                      <label style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: G.mist, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
                      <input className="input" defaultValue={val} disabled={!editMode} style={{ background: editMode ? G.cloud : G.white, cursor: editMode ? "text" : "default" }} />
                    </div>
                  ))}
                  {editMode && <button className="btn btn-green btn-sm" style={{ alignSelf: "flex-start" }}>Save changes</button>}
                </div>
              </div>

              <div className="account-section">
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${G.border}` }}>
                  <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.slate }}>Payment Methods</p>
                </div>
                {[{ id: "mtn", name: "MTN MoMo", number: "054 *** 8812", primary: true, icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg" }, { id: "telecel", name: "Telecel Cash", number: "020 *** 4422", primary: false, icon: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Telecel_Logo.svg" }].map((p, i) => (
                  <div key={i} className="account-row">
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: G.white, border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <img src={p.icon} alt={p.name} style={{ width: 24, height: 24, objectFit: "contain" }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.slate }}>{p.name}</p>
                        <p style={{ fontFamily: FM, fontSize: 11, color: G.mist }}>{p.number}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {p.primary && <Badge color={G.green}>Primary</Badge>}
                      <button className="btn btn-ghost btn-xs">Edit</button>
                    </div>
                  </div>
                ))}
                <div className="account-row" style={{ borderBottom: "none" }}>
                  <p style={{ fontFamily: FB, fontSize: 13, color: G.green, fontWeight: 600 }}>+ Add payment method</p>
                  <ChevronRight size={18} color={G.green} />
                </div>
              </div>
            </div>

            {/* Notifications + security */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="account-section">
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${G.border}` }}>
                  <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.slate }}>Notifications</p>
                </div>
                {[
                  ["Job confirmations", true],
                  ["Tasker on the way alerts", true],
                  ["Payment receipts", true],
                  ["Promotional offers", false],
                  ["Platform updates", false],
                ].map(([label, on], i, arr) => (
                  <div key={label} className="account-row" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${G.border}` : "none" }}>
                    <p style={{ fontFamily: FB, fontSize: 14, color: G.slate }}>{label}</p>
                    <div style={{ width: 42, height: 24, borderRadius: 12, background: on ? G.green : G.border, position: "relative", cursor: "pointer", transition: "background 0.25s" }}>
                      <div style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", background: G.white, top: 3, left: on ? 21 : 3, transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    </div>
                  </div>
          {/* Security */}
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${G.border}` }}>
                  <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.slate }}>Security</p>
                </div>
                {[["Change phone number", <ChevronRight size={18} />], ["Delete account", <Trash2 size={18} />]].map(([label, icon]) => (
                  <div key={label} className="account-row" style={{ borderBottom: label === "Change phone number" ? `1px solid ${G.border}` : "none" }}>
                    <p style={{ fontFamily: FB, fontSize: 14, color: label === "Delete account" ? G.red : G.slate }}>{label}</p>
                    <span style={{ color: label === "Delete account" ? G.red : G.mist }}>{icon}</span>
                  </div>
                ))}
              </div>

              <div className="account-section" style={{ background: G.greenPale, border: `1.5px solid ${G.green}22` }}>
                <div style={{ padding: "20px" }}>
                  <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.green, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}><Shield size={18} /> Your Happiness Guarantee</p>
                  <p style={{ fontFamily: FB, fontSize: 13, color: G.steel, lineHeight: 1.7, marginBottom: 12 }}>If any job doesn't meet your expectations, we'll send another Tasker free or refund you in full - within 24 hours of completion.</p>
                  <button className="btn btn-outline btn-sm">Learn more</button>
                </div>
              </div>

              <button className="btn btn-ghost" style={{ color: G.red, borderColor: G.red + "33", background: G.redPale }}>Sign out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================
   ROOT - PAGE SWITCHER
========================================================== */
export default function CustomerDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [page, setPage] = useState("search");
  const [taskers, setTaskers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileTasker, setProfileTasker] = useState(null);

  // 1. Fetch Taskers for Discovery
  useEffect(() => {
    async function fetchTaskers() {
      try {
        const data = await api.get('/profiles/taskers');
        setTaskers(data.taskers || []);
      } catch (err) {
        console.error('Failed to fetch taskers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTaskers();
  }, []);

  // 2. Fetch User Bookings if logged in
  useEffect(() => {
    if (user) {
      async function fetchBookings() {
        try {
          const data = await api.get('/bookings/me');
          setBookings(data.data || []);
        } catch (err) {
          console.error('Failed to fetch bookings:', err);
        }
      }
      fetchBookings();
    }
  }, [user]);

  const handleViewProfile = (tasker) => {
    setProfileTasker(tasker);
    setPage("profile");
  };

  if (authLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #0A6E4A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style></div>;

  return (
    <div style={{ fontFamily: FB, background: G.cloud, minHeight: "100vh" }}>
      <Fonts />
      <Nav page={page} onChangePage={setPage} />
      {page === "search"  && <SearchPage taskers={taskers} loading={loading} onViewProfile={handleViewProfile} />}
      {page === "profile" && <ProfilePage tasker={profileTasker || taskers[0]} />}
      {page === "account" && <AccountPage user={user} bookings={bookings} onSignOut={logout} />}
    </div>
  );
}
