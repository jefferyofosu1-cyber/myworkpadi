import { useState, useEffect, useRef } from "react";

/* --- FONTS --- */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { -webkit-font-smoothing: antialiased; }

    @keyframes fadeUp    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes slideUp   { from { transform:translateY(100%); } to { transform:translateY(0); } }
    @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse     { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:.7} }
    @keyframes spin      { to { transform:rotate(360deg); } }
    @keyframes ripple    { from{transform:scale(0);opacity:.6} to{transform:scale(3);opacity:0} }
    @keyframes bounce    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes progress  { from{width:0} to{width:100%} }
    @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes checkmark { from{stroke-dashoffset:100} to{stroke-dashoffset:0} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
    @keyframes ping      { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.2);opacity:0} }

    .screen-enter { animation: fadeUp 0.35s ease both; }
    .fade-in  { animation: fadeIn 0.3s ease both; }
    .float    { animation: float 2.5s ease-in-out infinite; }

    /* Phone shell */
    .phone-shell {
      width: 390px; min-height: 844px;
      background: #fff; border-radius: 44px;
      box-shadow:
        0 0 0 10px #1a1a2e,
        0 0 0 12px #2d2d45,
        0 40px 80px rgba(0,0,0,0.4),
        0 20px 40px rgba(0,0,0,0.25);
      overflow: hidden; position: relative;
      display: flex; flex-direction: column;
    }

    /* Status bar */
    .status-bar {
      height: 44px; background: inherit;
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 12px 24px 0;
      position: relative; z-index: 10;
      flex-shrink: 0;
    }

    /* Bottom nav */
    .bottom-nav {
      height: 83px; display: flex;
      align-items: flex-start; padding: 12px 0 0;
      border-top: 1px solid #F0F0F0;
      background: #fff; flex-shrink: 0;
    }
    .nav-tab {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; gap: 3px; cursor: pointer;
      padding: 0 4px;
    }
    .nav-icon { width: 44px; height: 28px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-family: 'Syne', sans-serif; font-weight: 700; }
    .nav-label { font-size: 10px; font-weight: 500; font-family: 'DM Sans', sans-serif; }

    /* Screen scroll area */
    .screen-content {
      flex: 1; overflow-y: auto;
      scrollbar-width: none; -ms-overflow-style: none;
    }
    .screen-content::-webkit-scrollbar { display: none; }

    /* Cards */
    .service-card {
      background: #fff; border-radius: 20px; padding: 20px;
      border: 1.5px solid #EEF2F7;
      box-shadow: 0 2px 16px rgba(0,0,0,0.06);
      cursor: pointer; transition: all 0.2s;
      position: relative; overflow: hidden;
    }
    .service-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(10,110,74,0.15); border-color: #0A6E4A44; }
    .service-card.selected { border-color: #0A6E4A; box-shadow: 0 0 0 3px rgba(10,110,74,0.12); }

    .tasker-card {
      border: 1.5px solid #EEF2F7; border-radius: 20px;
      background: #fff; padding: 18px;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    }
    .tasker-card:hover { border-color: #0A6E4A55; box-shadow: 0 6px 20px rgba(10,110,74,0.1); }
    .tasker-card.selected { border-color: #0A6E4A; box-shadow: 0 0 0 3px rgba(10,110,74,0.12); background: #f8fdf9; }

    /* Buttons */
    .btn {
      width: 100%; padding: 17px; border-radius: 16px;
      border: none; cursor: pointer; font-family: 'DM Sans',sans-serif;
      font-weight: 600; font-size: 16px; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-green { background: #0A6E4A; color: #fff; box-shadow: 0 4px 18px rgba(10,110,74,0.35); }
    .btn-green:hover { background: #0D8559; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(10,110,74,0.42); }
    .btn-green:active { transform: scale(0.99); }
    .btn-green:disabled { background: #94A3B8; box-shadow: none; cursor: not-allowed; transform: none; }
    .btn-gold { background: #E8A020; color: #fff; box-shadow: 0 4px 18px rgba(232,160,32,0.35); }
    .btn-gold:hover { background: #D4901A; transform: translateY(-1px); }
    .btn-outline { background: transparent; color: #0A6E4A; border: 2px solid #0A6E4A; box-shadow: none; }
    .btn-outline:hover { background: #0A6E4A; color: #fff; }
    .btn-light { background: #F7F9FC; color: #4A5568; border: 1.5px solid #EEF2F7; box-shadow: none; }
    .btn-light:hover { background: #EEF2F7; }

    /* Input */
    .input {
      width: 100%; padding: 14px 16px;
      border-radius: 14px; border: 1.5px solid #EEF2F7;
      font-family: 'DM Sans',sans-serif; font-size: 15px; color: #1A202C;
      background: #F7F9FC; outline: none; transition: all 0.2s;
    }
    .input:focus { border-color: #0A6E4A; background: #fff; box-shadow: 0 0 0 3px rgba(10,110,74,0.08); }
    textarea.input { resize: none; line-height: 1.6; }
    select.input { appearance: none; cursor: pointer; }

    /* Shimmer skeleton */
    .shimmer {
      background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }

    /* Step progress */
    .progress-bar { height: 3px; background: #EEF2F7; border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; background: #0A6E4A; border-radius: 2px; transition: width 0.4s ease; }

    /* MoMo input */
    .momo-provider {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px; border-radius: 14px;
      border: 1.5px solid #EEF2F7; cursor: pointer;
      transition: all 0.2s; background: #F7F9FC;
    }
    .momo-provider.selected { border-color: #0A6E4A; background: #f0f9f5; box-shadow: 0 0 0 3px rgba(10,110,74,0.08); }
    .momo-provider:hover:not(.selected) { border-color: #0A6E4A44; }

    /* Rating stars */
    .star { font-size: 16px; cursor: pointer; transition: transform 0.15s; }
    .star:hover { transform: scale(1.2); }

    /* Toast */
    .toast {
      position: absolute; bottom: 100px; left: 20px; right: 20px;
      background: #1A202C; color: #fff; border-radius: 14px;
      padding: 14px 18px; font-family: 'DM Sans',sans-serif; font-size: 14px;
      display: flex; align-items: center; gap: 10px;
      animation: slideUp 0.3s ease; z-index: 200;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    }

    /* Overlay sheet */
    .sheet-overlay {
      position: absolute; inset: 0; background: rgba(0,0,0,0.5);
      z-index: 100; backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }
    .bottom-sheet {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: #fff; border-radius: 28px 28px 0 0;
      padding: 24px 24px 40px;
      animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1);
      z-index: 101; max-height: 90%;
      overflow-y: auto;
    }
    .sheet-handle { width: 40px; height: 4px; background: #EEF2F7; border-radius: 2px; margin: 0 auto 20px; }

    /* Chat bubble */
    .bubble-out { background: #0A6E4A; color: #fff; border-radius: 20px 20px 4px 20px; padding: 12px 16px; max-width: 75%; margin-left: auto; }
    .bubble-in  { background: #F7F9FC; color: #1A202C; border-radius: 20px 20px 20px 4px; padding: 12px 16px; max-width: 75%; border: 1px solid #EEF2F7; }

    /* Map placeholder */
    .map-area {
      width: 100%; border-radius: 16px; overflow: hidden;
      background: #E8F5EF;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }

    /* OTP input */
    .otp-input {
      width: 52px; height: 60px; border-radius: 14px;
      border: 2px solid #EEF2F7; text-align: center;
      font-family: 'Syne',sans-serif; font-weight: 700;
      font-size: 24px; color: #1A202C; outline: none;
      transition: all 0.2s; background: #F7F9FC;
    }
    .otp-input:focus { border-color: #0A6E4A; background: #fff; box-shadow: 0 0 0 3px rgba(10,110,74,0.1); }
    .otp-input.filled { border-color: #0A6E4A; background: #E8F5EF; color: #0A6E4A; }

    /* Live tracking ping */
    .ping-ring {
      position: absolute; border-radius: 50%;
      background: rgba(10,110,74,0.25);
      animation: ping 1.8s ease-out infinite;
    }

    ::-webkit-scrollbar { display: none; }
  `}</style>
);

/* --- TOKENS --- */
const G = {
  green: "#0A6E4A", greenLight: "#12A06B", greenDeep: "#064D34",
  greenPale: "#E8F5EF", gold: "#E8A020", goldPale: "#FDF4E3",
  ink: "#0D1117", slate: "#1A202C", steel: "#4A5568", mist: "#94A3B8",
  cloud: "#F7F9FC", border: "#EEF2F7", white: "#FFFFFF",
  error: "#EF4444", blue: "#3B82F6",
};
const FD = "'Syne', sans-serif";
const FB = "'DM Sans', sans-serif";

/* --- ICONS (Purged Emojis) --- */
const Icons = {
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Shield: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Camera: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Lightbulb: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  Bolt: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Location: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Chat: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Wrench: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Map: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  HomeIcon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  History: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>,
  ProfileIcon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Lock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Cash: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="12" cy="15" r="2"/></svg>,
  Refresh: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>,
  ArrowRight: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  ArrowLeft: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
};

/* --- SHARED COMPONENTS --- */
const StatusBar = ({ light = false }) => (
  <div className="status-bar" style={{ background: "inherit" }}>
    <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 15, color: light ? G.white : G.slate }}>9:41</span>
    <div style={{ width: 80, height: 18, borderRadius: 10, background: light ? G.white : G.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 8px" }}>
      <div style={{ width: 14, height: 7, borderRadius: 2, border: `1.5px solid ${light ? G.ink : G.white}`, position: "relative" }}>
        <div style={{ position: "absolute", inset: 1, right: 3, background: light ? G.ink : G.white, borderRadius: 1 }} />
        <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 2, height: 5, borderRadius: 1, background: light ? G.ink : G.white }} />
      </div>
    </div>
  </div>
);

const BottomNav = ({ active = "home" }) => {
  const tabs = [
    { id: "home", initials: "H", label: "Home" },
    { id: "jobs", initials: "J", label: "My Jobs" },
    { id: "chat", initials: "C", label: "Chat" },
    { id: "profile", initials: "P", label: "Profile" },
  ];
  return (
    <div className="bottom-nav">
      {tabs.map(t => (
        <div key={t.id} className="nav-tab">
          <div className="nav-icon" style={{ background: active === t.id ? G.greenPale : "transparent", color: active === t.id ? G.green : G.mist }}>
            {t.initials}
          </div>
          <span className="nav-label" style={{ color: active === t.id ? G.green : G.mist }}>{t.label}</span>
        </div>
      ))}
    </div>
  );
};

const BackBtn = ({ onBack, light = false }) => (
  <button onClick={onBack} style={{ background: light ? "rgba(255,255,255,0.2)" : G.cloud, border: "none", width: 40, height: 40, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: light ? G.white : G.slate, transition: "all 0.2s" }}>
    <Icons.ArrowLeft />
  </button>
);

const StepBar = ({ step, total, label }) => (
  <div style={{ padding: "12px 24px 0", flex: 1 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>Step {step} of {total}</span>
      <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 12, color: G.green }}>{label}</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${(step / total) * 100}%` }} />
    </div>
  </div>
);

/* --- SCREEN DEFINITIONS --- */

// SCREEN 0: Phone number entry (Login)
const Screen0_Login = ({ onNext }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const handleNext = () => { setLoading(true); setTimeout(() => { setLoading(false); onNext(); }, 1400); };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar light />
      <div style={{ flex: 1, background: `linear-gradient(170deg, ${G.greenDeep} 0%, ${G.green} 55%, #0D8559 100%)`, padding: "32px 24px 40px", display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", top: 80, left: -30, width: 140, height: 140, borderRadius: "50%", background: G.gold + "18" }} />
        <div className="screen-enter">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, color: G.white, fontSize: 18 }}>TG</div>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.white }}>TaskGH</span>
          </div>
          <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 34, color: G.white, lineHeight: 1.15, marginBottom: 10, letterSpacing: "-0.02em" }}>Trusted Help<br />for Your Home</h1>
          <p style={{ fontFamily: FB, fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: 24 }}>Book vetted Taskers in Accra. Payments protected until you're satisfied.</p>
          <div style={{ background: G.white, borderRadius: 20, padding: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate, marginBottom: 12 }}>Enter your phone number to continue</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ background: G.cloud, borderRadius: 14, border: `1.5px solid ${G.border}`, padding: "14px 14px", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <span style={{ fontFamily: FB, fontWeight: 800, fontSize: 12, color: G.slate }}>GH</span>
                <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate }}>+233</span>
              </div>
              <input className="input" placeholder="0XX XXX XXXX" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1, fontSize: 16 }} />
            </div>
            <button className="btn btn-green" onClick={handleNext} disabled={phone.length < 9}>
              {loading ? <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: G.white, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <span style={{ display: "flex", alignItems: "center", gap: 8 }}>Send OTP <Icons.ArrowRight /></span>}
            </button>
            <p style={{ fontFamily: FB, fontSize: 11, color: G.mist, textAlign: "center", marginTop: 10 }}>We'll send a 6-digit code via SMS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// SCREEN 1: OTP Verification
const Screen1_OTP = ({ onNext, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const refs = useRef([]);
  const handleChange = (i, val) => {
    const v = val.replace(/\D/, "");
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d !== "") && !verified) { setTimeout(() => { setVerified(true); setTimeout(onNext, 800); }, 300); }
  };
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div className="screen-content" style={{ padding: "20px 24px 40px" }}>
        <BackBtn onBack={onBack} />
        <div style={{ marginTop: 32, marginBottom: 36, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: G.green }}>
            <Icons.Chat />
          </div>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: G.slate, marginBottom: 8 }}>Enter OTP</h2>
          <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, lineHeight: 1.6 }}>We sent a 6-digit code to<br /><strong style={{ color: G.slate }}>+233 054 *** 6712</strong></p>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          {otp.map((d, i) => (
            <input key={i} ref={el => refs.current[i] = el} className={`otp-input ${d ? "filled" : ""}`} maxLength={1} value={d} onChange={e => handleChange(i, e.target.value)} onKeyDown={e => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()} />
          ))}
        </div>
        {verified && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: G.greenPale, borderRadius: 14, padding: "14px 18px", marginBottom: 20, animation: "fadeIn 0.3s ease" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: G.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.Check />
            </div>
            <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.green }}>Verified!</span>
          </div>
        )}
        <button className="btn btn-outline" style={{ marginBottom: 16 }}>Resend OTP (0:47)</button>
        <p style={{ fontFamily: FB, fontSize: 12, color: G.mist, textAlign: "center" }}>Didn't get the code? Check your SMS inbox.</p>
      </div>
    </div>
  );
};

// SCREEN 2: Home / Service Browser
const Screen2_Home = ({ onNext, onSelectService }) => {
  const [cat, setCat] = useState("All");
  const categories = ["All", "Electrical", "Plumbing", "Cleaning", "Security"];
  const services = [
    { abbr: "AC", name: "AC Repair", type: "assessment", price: "GHS 25", color: "#0EA5E9", hot: true },
    { abbr: "EL", name: "Electrical", type: "assessment", price: "GHS 25", color: "#F59E0B", hot: false },
    { abbr: "PL", name: "Plumbing", type: "assessment", price: "GHS 25", color: "#3B82F6", hot: true },
    { abbr: "CL", name: "Cleaning", type: "fixed", price: "GHS 120", color: "#10B981", hot: false },
    { abbr: "PK", name: "Polytank", type: "fixed", price: "GHS 80", color: "#06B6D4", hot: false },
    { abbr: "PA", name: "Painting", type: "assessment", price: "GHS 25", color: "#EC4899", hot: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ background: G.green, padding: "44px 24px 24px", flexShrink: 0 }}>
        <StatusBar light />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 8 }}>
          <div>
            <p style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Good morning</p>
            <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.white }}>Sandra Asante</h2>
          </div>
          <div style={{ position: "relative", color: G.white }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.Bell />
            </div>
            <div style={{ position: "absolute", top: 8, right: 8, width: 10, height: 10, borderRadius: "50%", background: G.gold, border: "2px solid " + G.green }} />
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
          <Icons.Search />
          <span style={{ fontFamily: FB, fontSize: 15 }}>Search services...</span>
        </div>
      </div>
      <div className="screen-content" style={{ background: G.cloud, flex: 1 }}>
        <div style={{ padding: "20px 24px 0", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ padding: "8px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: FB, fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", background: cat === c ? G.green : G.white, color: cat === c ? G.white : G.steel, boxShadow: cat === c ? `0 3px 10px ${G.green}44` : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate }}>Popular Services</h3>
            <span style={{ fontFamily: FB, fontSize: 13, color: G.green, fontWeight: 600 }}>See all</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {services.map((svc, i) => (
              <div key={i} className="service-card" onClick={() => onSelectService(svc)} style={{ position: "relative" }}>
                {svc.hot && <div style={{ position: "absolute", top: 10, right: 10, background: G.gold, color: G.white, fontFamily: FB, fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>HOT</div>}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: svc.color + '18', color: svc.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontFamily: FD, fontWeight: 800, marginBottom: 10 }}>{svc.abbr}</div>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 14, color: G.slate, marginBottom: 4 }}>{svc.name}</div>
                <div style={{ fontFamily: FB, fontSize: 11, color: svc.type === "assessment" ? G.gold : G.green, fontWeight: 600, marginBottom: 8 }}>
                  {svc.type === "assessment" ? "Assessment" : "Fixed Price"}
                </div>
                <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: G.green }}>{svc.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
};

// SCREEN 3: Service Detail
const Screen3_ServiceDetail = ({ service, onNext, onBack }) => (
  <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ background: `linear-gradient(160deg, ${G.greenDeep}, ${G.green})`, padding: "0 24px 28px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <StatusBar light />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, marginTop: 8 }}>
        <BackBtn onBack={onBack} light />
        <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Service Details</span>
        <div style={{ width: 40 }} />
      </div>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.2)", color: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontFamily: FD, fontWeight: 800, marginBottom: 12 }}>{service?.abbr || "AC"}</div>
      <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: G.white, marginBottom: 6 }}>{service?.name || "AC Repair & Servicing"}</h1>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "5px 12px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <span style={{ fontFamily: FB, fontSize: 12, color: G.white }}>Assessment visit</span>
        </div>
        <div style={{ background: G.gold + "33", borderRadius: 20, padding: "5px 12px", border: `1px solid ${G.gold}44`, color: G.gold, display: "flex", alignItems: "center", gap: 4 }}>
          <Icons.Star />
          <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700 }}>4.9 - 312 jobs</span>
        </div>
      </div>
    </div>
    <div className="screen-content" style={{ flex: 1, background: G.white, padding: "20px 24px" }}>
      <div style={{ background: G.cloud, borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, lineHeight: 1.7 }}>Our certified AC technicians diagnose, clean, regas, and repair all brands. Available same-day in most areas of Accra.</p>
      </div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.slate, marginBottom: 12 }}>What's included</h3>
        {["On-site assessment of the fault", "Full diagnosis report", "Quote before any work starts", "Satisfaction guarantee"].map((item, i, arr) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${G.border}` : "none" }}>
            <div style={{ color: G.green }}><Icons.Check /></div>
            <span style={{ fontFamily: FB, fontSize: 13, color: G.slate }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ background: G.greenPale, borderRadius: 16, padding: 20, marginBottom: 20, border: `1px solid ${G.green}22` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: FB, fontSize: 11, color: G.greenLight, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Assessment Fee</p>
            <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: G.green }}>GHS 25</p>
            <p style={{ fontFamily: FB, fontSize: 11, color: G.steel }}>Credited toward total job cost</p>
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: G.green, display: "flex", alignItems: "center", justifyContent: "center", color: G.white }}>
            <Icons.Shield />
          </div>
        </div>
      </div>
    </div>
    <div style={{ padding: "16px 24px 28px", background: G.white, borderTop: `1px solid ${G.border}` }}>
      <button className="btn btn-green" onClick={onNext} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Book Assessment <Icons.ArrowRight /></button>
    </div>
  </div>
);

// SCREEN 4: Describe Problem
const Screen4_Describe = ({ onNext, onBack }) => {
  const [desc, setDesc] = useState("");
  const [photos, setPhotos] = useState(0);
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <BackBtn onBack={onBack} />
          <StepBar step={1} total={5} label="Describe Problem" />
        </div>
      </div>
      <div className="screen-content" style={{ flex: 1, padding: "16px 24px 24px" }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.slate, marginBottom: 6 }}>What's the problem?</h2>
        <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 24 }}>Help your Tasker prepare before arriving.</p>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.steel, display: "block", marginBottom: 8 }}>Describe the issue *</label>
          <textarea className="input" rows={4} placeholder="e.g. My AC unit is not cooling. It turns on but only blows warm air..." value={desc} onChange={e => setDesc(e.target.value)} style={{ minHeight: 110 }} />
          <p style={{ fontFamily: FB, fontSize: 11, color: G.mist, marginTop: 6, textAlign: "right" }}>{desc.length}/300</p>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.steel, display: "block", marginBottom: 12 }}>Add photos (optional)</label>
          <div style={{ display: "flex", gap: 12 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} onClick={() => setPhotos(p => Math.max(p, i + 1))} style={{ width: 84, height: 84, borderRadius: 16, border: `2px dashed ${i < photos ? G.green : G.border}`, background: i < photos ? G.greenPale : G.cloud, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", color: i < photos ? G.green : G.mist }}>
                {i < photos ? <Icons.Check /> : <Icons.Camera />}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: G.goldPale, borderRadius: 16, padding: "16px", border: `1px solid ${G.gold}33`, display: "flex", gap: 12 }}>
          <div style={{ color: G.gold }}><Icons.Lightbulb /></div>
          <p style={{ fontFamily: FB, fontSize: 12, color: "#856404", lineHeight: 1.6 }}>Clear descriptions and photos help you get more accurate quotes faster.</p>
        </div>
      </div>
      <div style={{ padding: "16px 24px 28px", borderTop: `1px solid ${G.border}` }}>
        <button className="btn btn-green" onClick={onNext} disabled={desc.length < 10} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Continue <Icons.ArrowRight /></button>
      </div>
    </div>
  );
};

// SCREEN 5: Pick Date & Time
const Screen5_DateTime = ({ onNext, onBack }) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTime, setSelectedTime] = useState("2:00 PM");
  const days = [
    { d: "Today", n: "10", available: true },
    { d: "Fri", n: "11", available: true },
    { d: "Sat", n: "12", available: true },
    { d: "Sun", n: "13", available: false },
    { d: "Mon", n: "14", available: true },
  ];
  const times = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM", "5:00 PM"];
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <BackBtn onBack={onBack} />
          <StepBar step={2} total={5} label="Pick Time" />
        </div>
      </div>
      <div className="screen-content" style={{ flex: 1, padding: "16px 24px 24px" }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.slate, marginBottom: 6 }}>When do you need help?</h2>
        <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 24 }}>Pick a date and time that works for you.</p>
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.steel, marginBottom: 12 }}>Select date</p>
          <div style={{ display: "flex", gap: 8 }}>
            {days.map((d, i) => (
              <div key={i} onClick={() => d.available && setSelectedDay(i)} style={{ flex: 1, borderRadius: 16, padding: "14px 6px", textAlign: "center", cursor: d.available ? "pointer" : "default", transition: "all 0.2s", background: selectedDay === i ? G.green : G.cloud, border: `1.5px solid ${selectedDay === i ? G.green : G.border}`, opacity: d.available ? 1 : 0.4 }}>
                <p style={{ fontFamily: FB, fontSize: 11, color: selectedDay === i ? "rgba(255,255,255,0.8)" : G.mist, marginBottom: 4 }}>{d.d}</p>
                <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: selectedDay === i ? G.white : G.slate }}>{d.n}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.steel, marginBottom: 12 }}>Select time</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {times.map((t, i) => (
              <button key={i} onClick={() => setSelectedTime(t)} style={{ padding: "12px 8px", borderRadius: 12, border: `1.5px solid ${selectedTime === t ? G.green : G.border}`, background: selectedTime === t ? G.greenPale : G.cloud, color: selectedTime === t ? G.green : G.steel, fontFamily: FB, fontWeight: selectedTime === t ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px 20px", border: `1px solid ${G.green}22`, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ color: G.gold }}><Icons.Bolt /></div>
          <div>
            <p style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: G.green }}>Same-day available!</p>
            <p style={{ fontFamily: FB, fontSize: 12, color: G.steel }}>8 Taskers available today in your area</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 24px 28px", borderTop: `1px solid ${G.border}` }}>
        <button className="btn btn-green" onClick={onNext} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Confirm Time <Icons.ArrowRight /></button>
      </div>
    </div>
  );
};

// SCREEN 6: Enter Address
const Screen6_Address = ({ onNext, onBack }) => {
  const [addr, setAddr] = useState("");
  const suggestions = ["East Legon, Accra", "Airport Residential Area", "Cantonments, Accra"];
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <BackBtn onBack={onBack} />
          <StepBar step={3} total={5} label="Your Address" />
        </div>
      </div>
      <div className="screen-content" style={{ flex: 1, padding: "16px 24px 24px" }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.slate, marginBottom: 6 }}>Where do you need help?</h2>
        <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 20 }}>Enter your address so we can match you with nearby Taskers.</p>
        <div style={{ marginBottom: 20 }}>
          <input className="input" placeholder="Search your address..." value={addr} onChange={e => setAddr(e.target.value)} style={{ marginBottom: 8 }} />
          {addr.length > 1 && (
            <div style={{ background: G.white, borderRadius: 14, border: `1px solid ${G.border}`, overflow: "hidden", animation: "slideDown 0.2s ease" }}>
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => setAddr(s)} style={{ padding: "14px 16px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? `1px solid ${G.border}` : "none", display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ color: G.mist }}><Icons.Location /></div>
                  <span style={{ fontFamily: FB, fontSize: 14, color: G.slate }}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="map-area" style={{ height: 210, marginBottom: 20, background: G.cloud, border: `1.5px solid ${G.border}` }}>
          <div style={{ textAlign: "center", padding: 20, color: G.mist }}>
            <Icons.Map />
            <p style={{ fontFamily: FB, fontSize: 13, color: G.steel, marginTop: 12 }}>Map View Loaded</p>
          </div>
          <div style={{ position: "absolute", bottom: 14, right: 14, background: G.white, borderRadius: 12, padding: "10px 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div style={{ color: G.green }}><Icons.Location /></div>
            <span style={{ fontFamily: FB, fontSize: 12, color: G.green, fontWeight: 700 }}>Use my location</span>
          </div>
        </div>
        <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px", border: `1px solid ${G.green}22`, display: "flex", gap: 12 }}>
          <div style={{ color: G.gold }}><Icons.Bolt /></div>
          <p style={{ fontFamily: FB, fontSize: 12, color: G.green, fontWeight: 600, lineHeight: 1.5 }}>Available Taskers are being notified in your area based on this location.</p>
        </div>
      </div>
      <div style={{ padding: "16px 24px 28px", borderTop: `1px solid ${G.border}` }}>
        <button className="btn btn-green" onClick={onNext} disabled={!addr} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Confirm Address <Icons.ArrowRight /></button>
      </div>
    </div>
  );
};

// SCREEN 7: Choose Tasker
const Screen7_Tasker = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 1800); }, []);
  const taskers = [
    { name: "Emmanuel K.", init: "EK", role: "Electrician & AC Technician", rating: 4.9, jobs: 247, dist: "1.2km", price: "GHS 80/hr", badge: "Elite", verified: true, avail: true },
    { name: "Kweku A.", init: "KA", role: "AC specialist", rating: 4.7, jobs: 134, dist: "2.4km", price: "GHS 70/hr", badge: null, verified: true, avail: true },
    { name: "Samuel O.", init: "SO", role: "General Electrician", rating: 4.8, jobs: 89, dist: "3.1km", price: "GHS 65/hr", badge: null, verified: true, avail: false },
  ];
  if (loading) return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div style={{ padding: "20px 24px 0" }}><BackBtn onBack={onBack} /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <div style={{ position: "relative", width: 84, height: 84 }}>
          <div className="ping-ring" style={{ width: 84, height: 84, top: 0, left: 0 }} />
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", color: G.green, position: "relative", border: `2px solid ${G.green}44` }}>
            <Icons.Search />
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "0 40px" }}>
          <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.slate, marginBottom: 8 }}>Finding nearby Taskers...</p>
          <p style={{ fontFamily: FB, fontSize: 14, color: G.mist }}>Matching rating, distance & availability</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", padding: "0 24px" }}>
          {[1, 2].map(i => <div key={i} className="shimmer" style={{ height: 110, borderRadius: 20 }} />)}
        </div>
      </div>
    </div>
  );
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <BackBtn onBack={onBack} />
          <StepBar step={4} total={5} label="Choose Tasker" />
        </div>
      </div>
      <div className="screen-content" style={{ flex: 1, padding: "16px 24px 24px" }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.slate, marginBottom: 4 }}>Choose your Tasker</h2>
        <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 20 }}>3 verified Taskers found near you</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {taskers.map((t, i) => (
            <div key={i} className={`tasker-card ${selected === i ? "selected" : ""}`} onClick={() => t.avail && setSelected(i)} style={{ opacity: t.avail ? 1 : 0.5, cursor: t.avail ? "pointer" : "default" }}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${G.green}, ${G.greenLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.white }}>{t.init}</div>
                  {t.verified && <div style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: G.green, border: `3.5px solid ${G.white}`, display: "flex", alignItems: "center", justifyContent: "center", color: G.white }}><Icons.Check /></div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate }}>{t.name}</p>
                    {t.badge && <div style={{ background: G.goldPale, color: G.gold, fontFamily: FB, fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 20, border: `1px solid ${G.gold}44` }}>{t.badge}</div>}
                  </div>
                  <p style={{ fontFamily: FB, fontSize: 12, color: G.steel, marginBottom: 8 }}>{t.role}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 4, alignItems: "center", color: G.gold }}>
                      <Icons.Star />
                      <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700 }}>{t.rating}</span>
                    </div>
                    <span style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>-</span>
                    <span style={{ fontFamily: FB, fontSize: 12, color: G.steel }}>{t.jobs} jobs</span>
                    <span style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>-</span>
                    <span style={{ fontFamily: FB, fontSize: 12, color: G.slate, fontWeight: 700 }}>{t.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "16px 24px 28px", borderTop: `1px solid ${G.border}` }}>
        <button className="btn btn-green" onClick={onNext} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Continue with {taskers[selected].name.split(" ")[0]} <Icons.ArrowRight /></button>
      </div>
    </div>
  );
};

// SCREEN 8: Payment
const Screen8_Payment = ({ onNext, onBack }) => {
  const [provider, setProvider] = useState("mtn");
  const [loading, setLoading] = useState(false);
  const providers = [
    { id: "mtn", name: "MTN MoMo", color: "#F59E0B", init: "M" },
    { id: "vodafone", name: "Vodafone Cash", color: "#EF4444", init: "V" },
    { id: "airteltigo", name: "AirtelTigo Money", color: "#3B82F6", init: "A" },
  ];
  const handlePay = () => { setLoading(true); setTimeout(() => { setLoading(false); onNext(); }, 2200); };
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <BackBtn onBack={onBack} />
          <StepBar step={5} total={5} label="Payment" />
        </div>
      </div>
      <div className="screen-content" style={{ flex: 1, padding: "16px 24px 24px" }}>
        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.slate, marginBottom: 4 }}>Confirm & Pay</h2>
        <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 20 }}>Your payment is held in escrow until the job is done.</p>
        <div style={{ background: G.white, borderRadius: 20, border: `1.5px solid ${G.border}`, overflow: "hidden", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "18px 20px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: G.slate }}>AC Assessment visit</span>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.green }}>GHS 25</span>
          </div>
          <div style={{ padding: "14px 20px", background: G.greenPale, borderTop: `1px solid ${G.green}11` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ color: G.green }}><Icons.Shield /></div>
              <p style={{ fontFamily: FB, fontSize: 12, color: G.green, fontWeight: 600 }}>Happiness Guarantee: GHS 25 held in escrow.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: G.slate, marginBottom: 14 }}>Pay with MoMo</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {providers.map(p => (
              <div key={p.id} className={`momo-provider ${provider === p.id ? "selected" : ""}`} onClick={() => setProvider(p.id)}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: p.color, color: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 14 }}>{p.init}</div>
                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: G.slate, flex: 1 }}>{p.name}</span>
                <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2.5px solid ${provider === p.id ? G.green : G.border}`, background: provider === p.id ? G.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  {provider === p.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.white }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.steel, display: "block", marginBottom: 10 }}>MoMo number</label>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ background: G.cloud, border: `1.5px solid ${G.border}`, borderRadius: 14, padding: "14px 14px", fontFamily: FB, fontWeight: 800, fontSize: 12, color: G.steel }}>+233</div>
            <input className="input" placeholder="054 XXX XXXX" defaultValue="054 000 6712" style={{ flex: 1 }} />
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 24px 28px", borderTop: `1px solid ${G.border}` }}>
        <button className="btn btn-green" onClick={handlePay} disabled={loading}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: G.white, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Processing...
            </div>
          ) : <><Icons.Shield /> Pay GHS 25 Lock</>}
        </button>
      </div>
    </div>
  );
};

// SCREEN 9: Booking Confirmed
const Screen9_Confirmed = ({ onNext }) => (
  <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <StatusBar />
    <div className="screen-content" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ position: "relative", marginBottom: 28 }}>
        <div className="ping-ring" style={{ width: 100, height: 100, top: 0, left: 0 }} />
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: G.green, display: "flex", alignItems: "center", justifyContent: "center", color: G.white, position: "relative" }}>
          <Icons.Check />
        </div>
      </div>
      <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: G.slate, marginBottom: 10, letterSpacing: "-0.02em" }}>Confirmed!</h1>
      <p style={{ fontFamily: FB, fontSize: 15, color: G.steel, lineHeight: 1.7, maxWidth: 300, marginBottom: 32 }}>Emmanuel K. will arrive at <strong style={{ color: G.slate }}>2:00 PM today</strong>. You'll be notified when he starts moving.</p>
      
      <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px 20px", width: "100%", display: "flex", gap: 12, alignItems: "center", marginBottom: 24, border: `1px solid ${G.green}22` }}>
        <div style={{ color: G.green }}><Icons.Chat /></div>
        <p style={{ fontFamily: FB, fontSize: 13, color: G.green, fontWeight: 600 }}>Confirmation sent via SMS</p>
      </div>
    </div>
    <div style={{ padding: "16px 24px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
      <button className="btn btn-green" onClick={onNext} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Track Emmanuel Live <Icons.ArrowRight /></button>
      <button className="btn btn-light" onClick={onNext}>View Bookings</button>
    </div>
  </div>
);

// SCREEN 10: Live Tracking
const Screen10_Tracking = ({ onNext, onBack }) => {
  const [eta, setEta] = useState(18);
  useEffect(() => { const t = setInterval(() => setEta(e => Math.max(0, e - 1)), 3000); return () => clearInterval(t); }, []);
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div className="screen-content" style={{ flex: 1 }}>
        <div className="map-area" style={{ height: 340, borderRadius: 0, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #E8F5EF 0%, #C8E6DA 50%, #A8D5C4 100%)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(10,110,74,0.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          </div>
          <div style={{ position: "absolute", bottom: 90, left: "45%" }}>
            <div style={{ position: "relative" }}>
              <div className="ping-ring" style={{ width: 56, height: 56, top: 0, left: 0 }} />
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: G.green, border: "4px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: G.white, boxShadow: "0 4px 12px rgba(10,110,74,0.3)", position: "relative" }}>
                <Icons.Wrench />
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", top: 18, left: 18, background: "rgba(255,255,255,0.95)", borderRadius: 16, padding: "14px 18px", backdropFilter: "blur(12px)", boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}>
            <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.green }}>{eta} min</p>
            <p style={{ fontFamily: FB, fontSize: 12, color: G.steel, fontWeight: 600 }}>ETA - Arriving soon</p>
          </div>
        </div>
        <div style={{ padding: "24px", position: "relative", marginTop: -24, background: G.white, borderRadius: "28px 28px 0 0", boxShadow: "0 -10px 40px rgba(0,0,0,0.05)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: G.green, color: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 22, marginBottom: 16 }}>EK</div>
          <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.slate, marginBottom: 4 }}>Emmanuel K.</h3>
          <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 20 }}>Certified AC Technician</p>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 52, borderRadius: 16, background: G.greenPale, color: G.green, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icons.Chat /></div>
            <div style={{ flex: 1, height: 52, borderRadius: 16, background: G.greenPale, color: G.green, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icons.Phone /></div>
          </div>
          <div style={{ background: G.goldPale, borderRadius: 16, padding: "16px", border: `1px solid ${G.gold}22`, display: "flex", gap: 12 }}>
            <div style={{ color: G.gold }}><Icons.Shield /></div>
            <p style={{ fontFamily: FB, fontSize: 12, color: G.steel, lineHeight: 1.6, fontWeight: 600 }}>Happiness Guarantee active: You approve payment only after inspection.</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 24px 28px", borderTop: `1px solid ${G.border}` }}>
        <button className="btn btn-green" onClick={onNext} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Confirm Arrival <Icons.ArrowRight /></button>
      </div>
    </div>
  );
};

// SCREEN 11: Quote Review
const Screen11_Quote = ({ onNext, onBack }) => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <BackBtn onBack={onBack} />
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.slate }}>Review Quote</h2>
        </div>
      </div>
      <div className="screen-content" style={{ flex: 1, padding: "16px 24px 24px" }}>
        <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px 20px", display: "flex", gap: 12, alignItems: "center", marginBottom: 20, border: `1px solid ${G.green}22` }}>
          <div style={{ color: G.green }}><Icons.Chat /></div>
          <div>
            <p style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: G.green }}>Price submitted</p>
            <p style={{ fontFamily: FB, fontSize: 11, color: G.steel }}>Review labor and materials</p>
          </div>
        </div>
        <div style={{ background: G.white, borderRadius: 20, border: `1.5px solid ${G.border}`, overflow: "hidden", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "18px 20px", borderBottom: `1px solid ${G.border}`, background: G.cloud, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.steel }}>Labour</span>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: G.slate }}>GHS 180</span>
          </div>
          <div style={{ padding: "18px 20px", borderBottom: `1px solid ${G.border}`, background: G.cloud, display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.steel }}>Parts</span>
              <div onClick={() => setShowDetail(!showDetail)} style={{ background: G.white, borderRadius: 8, padding: "2px 8px", cursor: "pointer", border: `1px solid ${G.border}` }}><span style={{ fontFamily: FB, fontSize: 11, color: G.green, fontWeight: 700 }}>{showDetail ? "Hide" : "Details"}</span></div>
            </div>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: G.slate }}>GHS 200</span>
          </div>
          {showDetail && (
            <div style={{ padding: "14px 20px", background: "#FAFAFA", animation: "slideDown 0.2s ease" }}>
              {[["Refrigerant R410A", "120"], ["Filter kit", "45"], ["Pipe clips", "35"]].map(([item, cost], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: FB, fontSize: 12, color: G.steel }}>- {item}</span>
                  <span style={{ fontFamily: FB, fontSize: 12, color: G.slate, fontWeight: 700 }}>GHS {cost}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ padding: "18px 20px", borderTop: `1.5px solid ${G.border}`, background: G.greenPale, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.green }}>TOTAL COST</span>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.green }}>GHS 355</span>
          </div>
        </div>
        <div style={{ background: G.cloud, borderRadius: 16, padding: "16px", border: `1.5px solid ${G.border}`, display: "flex", gap: 12 }}>
          <div style={{ color: G.green }}><Icons.Shield /></div>
          <p style={{ fontFamily: FB, fontSize: 12, color: G.steel, lineHeight: 1.6 }}>Safe Escrow: Your deposit is protected. He must upload a receipt to release parts funds.</p>
        </div>
      </div>
      <div style={{ padding: "16px 24px 28px", borderTop: `1px solid ${G.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
        <button className="btn btn-green" onClick={onNext} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Approve & Pay GHS 177.50 <Icons.ArrowRight /></button>
        <button className="btn btn-light" style={{ border: "none" }}>Negotiate Price</button>
      </div>
    </div>
  );
};

// SCREEN 12: Job In Progress
const Screen12_InProgress = ({ onNext, onBack }) => {
  const [chat, setChat] = useState([
    { from: "tasker", text: "Starting work now. I've got the refrigerant and filter." },
    { from: "me", text: "Sounds good, Emmanuel!" },
    { from: "tasker", text: "Compressor test passed. Replacing the filter now." },
  ]);
  const [msg, setMsg] = useState("");
  const send = () => { if (msg.trim()) { setChat([...chat, { from: "me", text: msg }]); setMsg(""); } };
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ background: G.green, padding: "0 24px 18px", flexShrink: 0 }}>
        <StatusBar light />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <BackBtn onBack={onBack} light />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: G.white }}>Emmanuel K.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.gold, animation: "pulse 1.5s infinite" }} />
              <p style={{ fontFamily: FB, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Job in progress</p>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "6px 12px", color: G.white, fontFamily: FD, fontWeight: 800, fontSize: 13 }}>02:14</div>
        </div>
      </div>
      <div className="screen-content" style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: 12, background: G.cloud }}>
        {chat.map((m, i) => (
          <div key={i} className={m.from === "me" ? "bubble-out" : "bubble-in"} style={{ maxWidth: "80%", ...(m.from === "me" ? { marginLeft: "auto" } : {}) }}>
            <p style={{ fontFamily: FB, fontSize: 14, lineHeight: 1.6 }}>{m.text}</p>
          </div>
        ))}
        <div style={{ background: G.greenPale, borderRadius: 14, padding: "14px", border: `1px solid ${G.green}22`, marginTop: 10 }}>
          <p style={{ fontFamily: FB, fontSize: 13, color: G.green, fontWeight: 700, marginBottom: 4 }}>Receipt uploaded</p>
          <p style={{ fontFamily: FB, fontSize: 12, color: G.steel }}>Part purchase verified - GHS 200</p>
        </div>
      </div>
      <div style={{ padding: "14px 20px", background: G.white, borderTop: `1px solid ${G.border}`, display: "flex", gap: 12 }}>
        <input className="input" placeholder="Message..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} style={{ flex: 1 }} />
        <button onClick={send} style={{ width: 48, height: 48, borderRadius: 14, background: G.green, border: "none", color: G.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.ArrowRight /></button>
      </div>
      <div style={{ padding: "16px 24px 28px", background: G.white }}>
        <button className="btn btn-green" onClick={onNext}><Icons.Check /> Complete Work</button>
      </div>
    </div>
  );
};

// SCREEN 13: Rate & Review
const Screen13_Review = ({ onNext }) => {
  const [stars, setStars] = useState(5);
  const tags = ["Professional", "Clean", "Expert", "On time"];
  const [selectedTags, setSelectedTags] = useState(new Set([0, 1]));
  return (
    <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <StatusBar />
      <div className="screen-content" style={{ flex: 1, padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg, ${G.green}, #0D8559)`, color: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 26, margin: "0 auto 16px" }}>EK</div>
          <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.slate, marginBottom: 6 }}>Review Emmanuel</h2>
          <p style={{ fontFamily: FB, fontSize: 14, color: G.steel }}>Help others find great Taskers</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
          {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className="star" onClick={() => setStars(s)} style={{ fontSize: 32, color: s <= stars ? G.gold : G.border }}>
              <Icons.Star />
            </span>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: G.slate, marginBottom: 12 }}>What stood out?</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tags.map((tag, i) => (
              <div key={i} onClick={() => { const s = new Set(selectedTags); s.has(i) ? s.delete(i) : s.add(i); setSelectedTags(s); }} style={{ padding: "10px 18px", borderRadius: 100, cursor: "pointer", border: `1.5px solid ${selectedTags.has(i) ? G.green : G.border}`, background: selectedTags.has(i) ? G.greenPale : G.white, color: selectedTags.has(i) ? G.green : G.steel, fontFamily: FB, fontSize: 13, fontWeight: 600 }}>{tag}</div>
            ))}
          </div>
        </div>
        <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px 20px", border: `1px solid ${G.green}22`, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ color: G.green }}><Icons.Cash /></div>
          <p style={{ fontFamily: FB, fontSize: 13, color: G.green, fontWeight: 600 }}>Remaining funds released to Tasker.</p>
        </div>
      </div>
      <div style={{ padding: "16px 24px 28px", borderTop: `1px solid ${G.border}` }}>
        <button className="btn btn-green" onClick={onNext} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Submit Review <Icons.ArrowRight /></button>
      </div>
    </div>
  );
};

// SCREEN 14: Job Complete
const Screen14_Complete = ({ onNext }) => (
  <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <StatusBar />
    <div className="screen-content" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", background: G.greenPale, color: G.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, animation: "bounce 1s ease 0.3s both" }}>
        <Icons.Check />
      </div>
      <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 32, color: G.slate, marginBottom: 12, letterSpacing: "-0.02em" }}>Done & Dusted!</h1>
      <p style={{ fontFamily: FB, fontSize: 15, color: G.steel, lineHeight: 1.7, maxWidth: 300, marginBottom: 40 }}>Your task is complete and payment is released. Your home is now sorted.</p>
      
      <div style={{ background: G.cloud, borderRadius: 24, padding: "24px", width: "100%", border: `1.5px solid ${G.border}`, marginBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[["Service cost", "GHS 355"], ["Tasker", "Emmanuel"], ["Payment", "Paystack"], ["Status", "Paid"]].map(([k, v], i) => (
            <div key={i} style={{ textAlign: "left" }}>
              <p style={{ fontFamily: FB, fontSize: 11, color: G.mist, marginBottom: 4, textTransform: "uppercase" }}>{k}</p>
              <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: G.slate }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ padding: "16px 24px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
      <button className="btn btn-green" onClick={onNext}><Icons.HomeIcon /> Back to Home</button>
      <button className="btn btn-light" style={{ border: "none" }} onClick={onNext}>View Receipts</button>
    </div>
  </div>
);

/* --- SCREEN REGISTRY --- */
const SCREENS = [
  Screen0_Login, Screen1_OTP, Screen2_Home, Screen3_ServiceDetail,
  Screen4_Describe, Screen5_DateTime, Screen6_Address, Screen7_Tasker,
  Screen8_Payment, Screen9_Confirmed, Screen10_Tracking, Screen11_Quote,
  Screen12_InProgress, Screen13_Review, Screen14_Complete,
];

const SCREEN_LABELS = [
  "Auth Start", "Verification", "Browse", "Detail",
  "Assessment", "Scheduling", "Location", "Matching",
  "Checkout", "Success", "Live Map", "Price Quote",
  "Work Mode", "Review", "Finish",
];

/* --- DESKTOP WRAPPER --- */
export default function PrototypeFlow() {
  const [screen, setScreen] = useState(0);
  const [service, setService] = useState({ abbr: "AC", name: "AC Repair & Servicing", type: "assessment", price: "GHS 25" });
  const goNext = () => setScreen(s => Math.min(s + 1, SCREENS.length - 1));
  const goBack = () => setScreen(s => Math.max(s - 1, 0));
  const goTo = (i) => setScreen(i);

  const CurrentScreen = SCREENS[screen];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${G.greenDeep} 0%, #1a2040 50%, #0D1117 100%)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 24, fontFamily: FB }}>
      <Fonts />
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: G.green, color: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 16 }}>TG</div>
        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.white }}>TaskGH</span>
        <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.4)", borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: 14, letterSpacing: 0.5 }}>PLATFORM PROTOTYPE V4</span>
      </div>

      <div style={{ display: "flex", gap: 40, alignItems: "flex-start", width: "100%", maxWidth: 1000, justifyContent: "center" }}>
        {/* Navigation Sidebar */}
        <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 12, paddingTop: 20 }}>
          <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Screen Map</p>
          {SCREEN_LABELS.map((label, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ textAlign: "left", padding: "12px 16px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: FB, fontSize: 12, fontWeight: screen === i ? 700 : 500, background: screen === i ? G.gold : "rgba(255,255,255,0.06)", color: screen === i ? G.white : "rgba(255,255,255,0.5)", transition: "all 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{i + 1}. {label}</span>
              {screen > i && <div style={{ color: G.gold }}><Icons.Check /></div>}
            </button>
          ))}
        </div>

        {/* Phone Rendering */}
        <div className="phone-shell float">
          <CurrentScreen onNext={goNext} onBack={goBack} service={service} onSelectService={(s) => { setService(s); goNext(); }} />
        </div>

        {/* Info Sidebar */}
        <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 20, paddingTop: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 24, padding: 20, border: "1px solid rgba(255,255,255,0.12)" }}>
            <p style={{ fontFamily: FB, fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Current State</p>
            <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.white, marginBottom: 6 }}>{SCREEN_LABELS[screen]}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: G.greenLight, width: `${((screen + 1) / SCREENS.length) * 100}%`, transition: "width 0.5s ease" }} />
              </div>
              <span style={{ fontFamily: FB, fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>{screen + 1}/{SCREENS.length}</span>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 24, padding: 20, border: "1px solid rgba(255,255,255,0.12)" }}>
            <p style={{ fontFamily: FB, fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Core Features</p>
            {[
              { label: "Mone-Mobile OTP Auth", done: screen > 1 },
              { label: "Real-time Tasker Matching", done: screen > 7 },
              { label: "Escrow Payment Logic", done: screen > 8 },
              { label: "Live Milestone Tracking", done: screen > 10 },
              { label: "Verified Rating System", done: screen >= 13 },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: f.done ? G.green : "rgba(255,255,255,0.1)", color: G.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>{f.done && <Icons.Check />}</div>
                <span style={{ fontFamily: FB, fontSize: 13, color: f.done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", fontWeight: f.done ? 600 : 400 }}>{f.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={goBack} disabled={screen === 0} style={{ flex: 1, padding: "14px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: G.white, opacity: screen === 0 ? 0.3 : 1, cursor: "pointer", fontFamily: FB, fontWeight: 700, fontSize: 13 }}>Back</button>
            <button onClick={goNext} disabled={screen === SCREENS.length - 1} style={{ flex: 1, padding: "14px", borderRadius: 16, border: "none", background: G.gold, color: G.white, opacity: screen === SCREENS.length - 1 ? 0.3 : 1, cursor: "pointer", fontFamily: FB, fontWeight: 700, fontSize: 13 }}>Next Step</button>
          </div>
        </div>
      </div>
    </div>
  );
}
