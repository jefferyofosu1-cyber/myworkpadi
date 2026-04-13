import { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { 
  MapPin, 
  Bell, 
  Sparkles, 
  Home, 
  Wrench, 
  CheckCircle, 
  Check,
  MessageSquare, 
  Phone, 
  Lock, 
  LockKeyhole,
  CreditCard, 
  Receipt, 
  Clock, 
  Star, 
  PartyPopper, 
  Shield, 
  Rocket, 
  Snowflake, 
  Zap, 
  Droplets, 
  Brush, 
  Container, 
  Bug, 
  Camera, 
  X, 
  ArrowRight, 
  Smartphone,
  ChevronRight,
  Send,
  Milestone
} from "lucide-react";

/* --- FONTS & GLOBAL STYLES --- */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { -webkit-font-smoothing: antialiased; }

    @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes slideLeft { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideRight{ from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideUp   { from{transform:translateY(100%)} to{transform:translateY(0)} }
    @keyframes scaleIn   { from{transform:scale(0.88);opacity:0} to{transform:scale(1);opacity:1} }
    @keyframes ping      { 0%{transform:scale(1);opacity:.9} 100%{transform:scale(2.4);opacity:0} }
    @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes spin      { to{transform:rotate(360deg)} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes bounce    { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} 60%{transform:translateY(-5px)} }
    @keyframes ripple    { from{transform:scale(0);opacity:.6} to{transform:scale(4);opacity:0} }
    @keyframes dash      { to{stroke-dashoffset:0} }
    @keyframes slideNotif { from{opacity:0;transform:translateX(110%)} to{opacity:1;transform:translateX(0)} }
    @keyframes barGrow   { from{width:0} to{width:var(--w)} }
    @keyframes pathDraw  { from{stroke-dashoffset:600} to{stroke-dashoffset:0} }
    @keyframes dotMove   { 0%{offset-distance:0%} 100%{offset-distance:100%} }
    @keyframes glow      { 0%,100%{box-shadow:0 0 12px rgba(10,110,74,0.4)} 50%{box-shadow:0 0 28px rgba(10,110,74,0.7)} }
    @keyframes carDrive  { 0%{left:12%} 100%{left:72%} }
    @keyframes checkDraw { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }

    .page-enter  { animation: fadeUp 0.4s ease both; }
    .slide-left  { animation: slideLeft 0.35s ease both; }
    .slide-right { animation: slideRight 0.35s ease both; }
    .scale-in    { animation: scaleIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
    .float       { animation: float 3s ease-in-out infinite; }
    .bounce-anim { animation: bounce 0.7s ease both; }

    /* --- DATA --- */
    .top-nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(255,255,255,0.97); backdrop-filter: blur(16px);
      border-bottom: 1px solid #EEF2F7;
      padding: 0 40px; height: 64px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 1px 20px rgba(0,0,0,0.05);
    }

    /* --- SETTINGS --- */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      border-radius: 14px; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-weight: 600;
      transition: all 0.2s; white-space: nowrap;
    }
    .btn-lg  { padding: 16px 32px; font-size: 16px; border-radius: 16px; }
    .btn-md  { padding: 12px 22px; font-size: 14px; }
    .btn-sm  { padding: 8px 16px; font-size: 13px; border-radius: 10px; }
    .btn-xs  { padding: 6px 12px; font-size: 12px; border-radius: 8px; }

    .btn-green  { background: #0A6E4A; color: #fff; box-shadow: 0 4px 16px rgba(10,110,74,0.3); }
    .btn-green:hover  { background: #0D8559; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(10,110,74,0.4); }
    .btn-outline { background: transparent; color: #0A6E4A; border: 2px solid #0A6E4A; }
    .btn-outline:hover { background: #0A6E4A; color: #fff; }
    .btn-ghost  { background: #F7F9FC; color: #4A5568; border: 1.5px solid #EEF2F7; }
    .btn-ghost:hover  { background: #EEF2F7; }
    .btn-gold   { background: #E8A020; color: #fff; box-shadow: 0 4px 14px rgba(232,160,32,0.3); }
    .btn-gold:hover   { background: #D4901A; transform: translateY(-1px); }
    .btn-red    { background: #EF4444; color: #fff; }
    .btn-red:hover    { background: #DC2626; }
    .btn-white  { background: #fff; color: #0A6E4A; box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    .btn-white:hover  { background: #F0FDF4; }
    .btn-dark   { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
    .btn-dark:hover   { background: rgba(255,255,255,0.22); }

    /* --- NOTIF CARDS --- */
    .notif-item {
      padding: 16px 20px; cursor: pointer; transition: background 0.15s;
      border-bottom: 1px solid #EEF2F7; position: relative;
    }
    .notif-item:hover { background: #F7F9FC; }
    .notif-item.unread { background: #F0FDF4; }
    .notif-item.unread:hover { background: #E8F5EF; }

    .notif-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 20px;
      font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    }

    /* --- TRACKING --- */
    .status-step {
      display: flex; align-items: flex-start; gap: 14px;
      padding: 12px 0; position: relative;
    }
    .step-dot {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; flex-shrink: 0; position: relative; z-index: 1;
      transition: all 0.4s;
    }
    .step-line {
      position: absolute; left: 13px; top: 28px;
      width: 2px; height: calc(100% + 0px);
      z-index: 0; transition: background 0.4s;
    }

    /* --- ONBOARDING --- */
    .onboard-progress {
      display: flex; gap: 6px; justify-content: center; margin-bottom: 28px;
    }
    .ob-dot {
      height: 5px; border-radius: 3px; transition: all 0.35s ease;
    }

    .feature-card {
      border-radius: 20px; padding: 24px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: default;
    }
    .feature-card:hover { transform: translateY(-4px); }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #CBD5E0; border-radius: 2px; }
  `}</style>
);

/* --- TOKENS --- */
const G = {
  green:"#0A6E4A", greenLight:"#12A06B", greenDeep:"#064D34",
  greenPale:"#E8F5EF", greenPale2:"#F0FDF4",
  gold:"#E8A020", goldPale:"#FDF4E3",
  ink:"#0D1117", slate:"#1A202C", steel:"#4A5568",
  mist:"#94A3B8", cloud:"#F7F9FC", border:"#EEF2F7",
  white:"#FFFFFF", red:"#EF4444", redPale:"#FEF2F2",
  blue:"#3B82F6", bluePale:"#EFF6FF",
  purple:"#8B5CF6", purplePale:"#F5F3FF",
  orange:"#F97316", orangePale:"#FFF7ED",
};
const FD = "'Syne', sans-serif";
const FB = "'DM Sans', sans-serif";
const FM = "'JetBrains Mono', monospace";

/* --- SHARED --- */
const Logo = ({ dark = false }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
    <svg width={32} height={32} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="11" fill={G.green}/>
      <path d="M13 27L21 19" stroke={G.gold} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="16" r="5" stroke="white" strokeWidth="2.2" fill="none"/>
      <path d="M20 20L14.5 25.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M21 15.5L23 17.5L27 13.5" stroke={G.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span style={{ fontFamily:FD, fontWeight:800, fontSize:20, color:dark?G.white:G.ink, letterSpacing:"-0.02em" }}>
      Task<span style={{color:G.green}}>GH</span>
    </span>
  </div>
);

const Nav = ({ page, onChangePage }) => (
  <div className="top-nav">
    <Logo/>
    <div style={{ display:"flex", gap:4, background:G.cloud, padding:4, borderRadius:12, border:`1px solid ${G.border}` }}>
      {[
        { id:"tracking",      label:"Live Tracking", icon: <MapPin size={14} /> },
        { id:"notifications", label:"Notifications", icon: <Bell size={14} /> },
        { id:"onboarding",    label:"Onboarding",    icon: <Sparkles size={14} /> },
      ].map(tab => (
        <button key={tab.id} onClick={() => onChangePage(tab.id)} style={{
          padding:"8px 18px", borderRadius:9, border:"none", cursor:"pointer",
          fontFamily:FB, fontWeight:page===tab.id?600:400, fontSize:13,
          background:page===tab.id?G.white:"transparent",
          color:page===tab.id?G.green:G.steel,
          boxShadow:page===tab.id?"0 1px 6px rgba(0,0,0,0.08)":"none",
          transition:"all 0.15s", position:"relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {tab.icon}
            {tab.label}
          </div>
          {tab.id==="notifications" && <div style={{ position:"absolute", top:6, right:10, width:8, height:8, borderRadius:"50%", background:G.red, border:`2px solid ${G.white}` }}/>}
        </button>
      ))}
    </div>
    <div style={{ display:"flex", gap:10 }}>
      <button className="btn btn-ghost btn-sm">Log in</button>
      <button className="btn btn-green btn-sm">Book a Tasker</button>
    </div>
  </div>
);

const Badge = ({ color, children, dot, pulse: doPulse }) => (
  <span className="notif-badge" style={{ background:color+"18", color, border:`1px solid ${color}33` }}>
    {dot && <span style={{ width:5, height:5, borderRadius:"50%", background:color, animation:doPulse?"pulse 1.5s infinite":"none" }}/>}
    {children}
  </span>
);

/* ==========================================================================
   PAGE 1 - REAL-TIME JOB TRACKING
========================================================================== */

const TrackingPage = ({ user, booking, loading }) => {
  const [eta, setEta] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    if (booking) {
      const statusMap = { 'PENDING': 0, 'IN_PROGRESS': 3, 'CONFIRMED': 5, 'COMPLETED': 5 };
      setActiveStep(statusMap[booking.status] || 0);
    }
  }, [booking]);

  const STEPS_CONFIG = [
    { id:"booked",    label:"Booking Confirmed",     sub: booking ? "Tasker accepted your job" : "Select a job to track", done:true,  time: booking ? new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-" },
    { id:"enroute",   label:"Tasker En Route",        sub:"Tasker is driving to your location",        done:activeStep > 1,  time: "-" },
    { id:"arrived",   label:"Tasker Arrived",         sub:"Tasker is at your gate",                    done:activeStep > 2,  time: "-" },
    { id:"started",   label:"Work in Progress",       sub:"Tasker started working",                    done:activeStep > 3,  time: "-" },
    { id:"completed", label:"Job Completed",          sub:"Waiting for your confirmation",               done:activeStep > 4, time: "-" },
    { id:"paid",      label:"Payment Released",       sub:`GHS ${booking?.amount || '0'} will go to Tasker`, done:activeStep > 5, time: "-" },
  ];
  const [chatOpen, setChatOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [msgs, setMsgs] = useState([
    { from:"tasker", text:"On my way! Got all the parts", time:"2:04 PM" },
    { from:"me",     text:"Great! Gate code is 1234", time:"2:05 PM" },
    { from:"tasker", text:"The issue was the refrigerant + a blocked filter. Replacing both now. Should be done in about 45 min.", time:"2:30 PM" },
    { from:"me",     text:"Sounds good. Thanks for the update!", time:"2:32 PM" },
  ]);
  const [draft, setDraft] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, chatOpen]);

  const sendMsg = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { from:"me", text:draft, time:"Now" }]);
    setDraft("");
    setTimeout(() => setMsgs(m => [...m, { from:"tasker", text:"Got it!", time:"Now" }]), 1200);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setConfirmOpen(false);
    setActiveStep(5);
  };

  const stepColor = (i) => {
    if (i < activeStep) return G.green;
    if (i === activeStep) return G.gold;
    return G.mist;
  };

  return (
    <div style={{ minHeight:"100vh", background:G.cloud }}>
      {/* Map hero */}
      <div style={{
        height:380, position:"relative", overflow:"hidden",
        background:"linear-gradient(160deg,#0A2015 0%,#0E3020 40%,#143825 100%)",
      }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(10,110,74,0.15) 1px, transparent 1px)", backgroundSize:"28px 28px" }}/>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 1200 380" preserveAspectRatio="none">
          <path d="M 80 320 C 200 300 350 260 500 240 C 650 220 780 200 960 180" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="28" strokeLinecap="round"/>
          <path d="M 80 320 C 200 300 350 260 500 240 C 650 220 780 200 960 180" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="30" strokeDasharray="40 20" strokeLinecap="round"/>
          <path d="M 80 320 C 200 300 350 260 500 240 C 650 220 780 200 960 180" fill="none" stroke="rgba(232,160,32,0.35)" strokeWidth="2" strokeDasharray="16 12" strokeLinecap="round" style={{ strokeDashoffset:600, animation:"pathDraw 2s ease both" }}/>
        </svg>

        <div style={{ position:"absolute", top:130, right:160, display:"flex", flexDirection:"column", alignItems:"center", animation:"float 3s ease-in-out infinite" }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:G.blue, border:`3px solid ${G.white}`, display:"flex", alignItems:"center", justifyContent:"center", color: G.white, boxShadow:"0 4px 14px rgba(59,130,246,0.5)" }}><Home size={22} /></div>
          <div style={{ width:0, height:0, borderLeft:"8px solid transparent", borderRight:"8px solid transparent", borderTop:`10px solid ${G.blue}`, marginTop:-1 }}/>
          <div style={{ background:"rgba(0,0,0,0.6)", color:G.white, fontFamily:FB, fontSize:11, padding:"3px 8px", borderRadius:6, marginTop:4, backdropFilter:"blur(4px)", whiteSpace:"nowrap" }}>Your home</div>
        </div>

        <div style={{ position:"absolute", top:220, animation:"carDrive 8s linear infinite", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <div style={{ borderRadius:"50%", background:"rgba(10,110,74,0.4)", position:"absolute", top:-4, left:-4, width:50, height:50, animation:"ping 2s ease-out infinite" }}/>
            <div style={{ width:42, height:42, borderRadius:"50%", background:G.green, border:`3px solid ${G.white}`, display:"flex", alignItems:"center", justifyContent:"center", color: G.white, boxShadow:`0 4px 14px rgba(10,110,74,0.6)`, position:"relative" }}><Wrench size={20} /></div>
          </div>
          <div style={{ width:0, height:0, borderLeft:"7px solid transparent", borderRight:"7px solid transparent", borderTop:`9px solid ${G.green}`, marginTop:-1 }}/>
          <div style={{ background:G.green, color:G.white, fontFamily:FB, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6, marginTop:4, whiteSpace:"nowrap" }}>{booking?.tasker_profiles?.profiles?.full_name || "Tasker"} - In Transit</div>
        </div>

        <div style={{ position:"absolute", top:16, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.55)", backdropFilter:"blur(12px)", borderRadius:16, padding:"10px 20px", border:"1px solid rgba(255,255,255,0.15)", display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:G.green, animation:"pulse 1.5s infinite" }}/>
            <span style={{ fontFamily:FM, fontSize:12, color:G.greenLight }}>LIVE</span>
          </div>
          <div style={{ width:1, height:16, background:"rgba(255,255,255,0.2)" }}/>
          <span style={{ fontFamily:FD, fontWeight:800, fontSize:22, color:G.white, lineHeight:1 }}>{booking ? booking.status : 'No Active Job'}</span>
        </div>

        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 24px", background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent)", display:"flex", gap:10, justifyContent:"center" }}>
          <button className="btn btn-dark btn-sm" onClick={() => setChatOpen(c => !c)}><MessageSquare size={14} /> Chat with Tasker</button>
          <button className="btn btn-dark btn-sm"><Phone size={14} /> Call</button>
        </div>
      </div>

      {!booking ? (
        <div style={{ padding: 60, textAlign: "center", background: G.white, borderRadius: 20, margin: "40px auto", maxWidth: 600, border: `1px solid ${G.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <MapPin size={48} color={G.mist} style={{ marginBottom: 16 }} />
          <p style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.slate, marginBottom: 8 }}>No active jobs to track</p>
          <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 24 }}>Book a Tasker to see live location and status updates here.</p>
          <button className="btn btn-green btn-md">Book a Tasker now</button>
        </div>
      ) : (
        <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 24px 60px", display:"grid", gridTemplateColumns: chatOpen ? "1fr 360px" : "1fr", gap:20, transition:"all 0.3s" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {!confirmed ? (
              <div style={{ background:G.white, borderRadius:20, padding:24, border:`1.5px solid ${G.border}`, boxShadow:"0 4px 24px rgba(0,0,0,0.07)", animation:"fadeUp 0.4s ease both" }}>
                <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:20 }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:`linear-gradient(135deg,${G.green},${G.greenLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FD, fontWeight:800, fontSize:18, color:G.white }}>
                    {booking.tasker_profiles?.profiles?.full_name?.split(" ").map(n => n[0]).join("") || "TK"}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:FD, fontWeight:700, fontSize:17, color:G.slate }}>{booking.tasker_profiles?.profiles?.full_name || "Assigned Tasker"}</p>
                    <p style={{ fontFamily:FB, fontSize:13, color:G.steel }}>Verified Professional - BK-{booking.id.slice(0,5)}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontFamily:FM, fontSize:11, color:G.mist }}>Booking ID</p>
                    <p style={{ fontFamily:FM, fontSize:13, color:G.blue }}>BK-{booking.id.slice(0,5)}</p>
                  </div>
                </div>

                <div>
                  {STEPS_CONFIG.map((step, i) => (
                    <div key={step.id} className="status-step" onClick={() => setActiveStep(Math.max(activeStep, i))}>
                      {i < STEPS_CONFIG.length - 1 && (
                        <div className="step-line" style={{ background:i < activeStep ? G.green : G.border }}/>
                      )}
                      <div className="step-dot" style={{
                        background: i < activeStep ? G.greenPale : i === activeStep ? G.goldPale : G.cloud,
                        border: `2px solid ${stepColor(i)}`,
                        color: stepColor(i),
                      }}>
                        {i < activeStep ? <Check size={14} strokeWidth={4} /> : i === activeStep ? <div style={{width:6,height:6,borderRadius:"50%",background:G.gold}}/> : String(i+1)}
                      </div>
                      <div style={{ flex:1, paddingTop:3 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <p style={{ fontFamily:FB, fontWeight:i<=activeStep?600:400, fontSize:14, color:i<=activeStep?G.slate:G.mist }}>{step.label}</p>
                          <p style={{ fontFamily:FM, fontSize:11, color:G.mist }}>{step.time}</p>
                        </div>
                        <p style={{ fontFamily:FB, fontSize:12, color:G.mist, marginTop:2 }}>{step.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bounce-anim" style={{ background:`linear-gradient(135deg,${G.greenPale},${G.white})`, borderRadius:20, padding:32, border:`2px solid ${G.green}33`, textAlign:"center", boxShadow:`0 0 40px rgba(10,110,74,0.1)` }}>
                <div style={{ width:80, height:80, borderRadius:"50%", background:G.green, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                  <svg width={36} height={36} viewBox="0 0 36 36" fill="none">
                    <path d="M6 18L14 26L30 10" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray:60, strokeDashoffset:0, animation:"checkDraw 0.6s ease both 0.3s" }}/>
                  </svg>
                </div>
                <p style={{ fontFamily:FD, fontWeight:800, fontSize:24, color:G.slate, marginBottom:6 }}>Job Confirmed Complete!</p>
                <p style={{ fontFamily:FB, fontSize:14, color:G.steel, marginBottom:20 }}>GHS {booking.amount} released to Tasker. Your job is finished!</p>
              </div>
            )}

            <div style={{ background:G.white, borderRadius:20, padding:20, border:`1.5px solid ${G.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.05)", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { icon:<Snowflake size={20} />, label:"Service",        val: booking.category || "General Service" },
                { icon:<MapPin size={20} />, label:"Location",       val: booking.address || "Your Address" },
                { icon:<CreditCard size={20} />, label:"Total amount",   val: `GHS ${booking.amount}` },
                { icon:<Lock size={20} />, label:"Escrow status",  val: "Securely Held" },
                { icon:<Receipt size={20} />, label:"Receipt",        val: "Uploaded" },
                { icon:<Clock size={20} />,  label:"Time elapsed",  val: "Active session" },
              ].map((item, i) => (
                <div key={i} style={{ background:G.cloud, borderRadius:12, padding:"12px 14px", display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ color: G.steel, display: "flex" }}>{item.icon}</span>
                  <div>
                    <p style={{ fontFamily:FB, fontSize:11, color:G.mist, marginBottom:2 }}>{item.label}</p>
                    <p style={{ fontFamily:FB, fontWeight:600, fontSize:13, color:G.slate }}>{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm completion CTA */}
            {!confirmed && (
              <div style={{ background:`linear-gradient(135deg,${G.green},${G.greenLight})`, borderRadius:20, padding:22, display:"flex", gap:16, alignItems:"center", boxShadow:`0 6px 24px rgba(10,110,74,0.3)` }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:FD, fontWeight:800, fontSize:17, color:G.white, marginBottom:4 }}>Is the job done to your satisfaction?</p>
                  <p style={{ fontFamily:FB, fontSize:13, color:"rgba(255,255,255,0.8)" }}>Tapping "Confirm" releases payment to {booking.tasker_profiles?.profiles?.full_name?.split(" ")[0] || "Tasker"} and closes the job.</p>
                </div>
                <button className="btn btn-white btn-md" onClick={() => setConfirmOpen(true)} style={{ flexShrink:0, fontFamily:FD, fontWeight:700, fontSize:15 }}><CheckCircle size={16} /> Confirm Done</button>
              </div>
            )}
          </div>

          {/* Chat panel */}
          {chatOpen && (
            <div className="slide-left" style={{ background:G.white, borderRadius:20, border:`1.5px solid ${G.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.08)", display:"flex", flexDirection:"column", maxHeight:600, overflow:"hidden" }}>
              <div style={{ padding:"16px 18px", borderBottom:`1px solid ${G.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ fontFamily:FD, fontWeight:700, fontSize:15, color:G.slate }}>Chat with {booking.tasker_profiles?.profiles?.full_name?.split(" ")[0] || "Tasker"}</p>
                  <div style={{ display:"flex", gap:5, alignItems:"center", marginTop:3 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:G.green, animation:"pulse 1.5s infinite" }}/>
                    <p style={{ fontFamily:FB, fontSize:12, color:G.green }}>Online - Usually replies instantly</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ background:G.cloud, border:"none", width:30, height:30, borderRadius:8, cursor:"pointer", color:G.steel, display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} /></button>
              </div>
              <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:10, background:G.cloud }}>
                {msgs.map((m, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start", animation:"fadeIn 0.25s ease" }}>
                    <div style={{
                      maxWidth:"78%", padding:"11px 14px", borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                      background:m.from==="me"?G.green:G.white,
                      color:m.from==="me"?G.white:G.slate,
                      border:m.from==="me"?"none":`1px solid ${G.border}`,
                      boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
                    }}>
                      <p style={{ fontFamily:FB, fontSize:13, lineHeight:1.6 }}>{m.text}</p>
                      <p style={{ fontFamily:FM, fontSize:10, color:m.from==="me"?"rgba(255,255,255,0.6)":G.mist, marginTop:4, textAlign:"right" }}>{m.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef}/>
              </div>
               <div style={{ padding:"10px 14px", borderTop:`1px solid ${G.border}`, display:"flex", gap:8 }}>
                 <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Type a message..." style={{ flex:1, padding:"11px 14px", borderRadius:12, border:`1.5px solid ${G.border}`, fontFamily:FB, fontSize:13, outline:"none", background:G.cloud, transition:"border-color 0.2s" }} onFocus={e=>e.target.style.borderColor=G.green} onBlur={e=>e.target.style.borderColor=G.border}/>
                 <button onClick={sendMsg} style={{ width:42, height:42, borderRadius:12, background:G.green, border:"none", cursor:"pointer", color:G.white, display:"flex", alignItems:"center", justifyContent:"center" }}><Send size={18} /></button>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Confirm modal */}
      {confirmOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)", animation:"fadeIn 0.2s ease" }} onClick={() => setConfirmOpen(false)}>
          <div className="scale-in" style={{ background:G.white, borderRadius:24, padding:32, width:440, boxShadow:"0 24px 80px rgba(0,0,0,0.2)", textAlign:"center" }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:G.greenPale, display:"flex", alignItems:"center", justifyContent:"center", color: G.green, margin:"0 auto 18px" }}><CheckCircle size={32} /></div>
            <p style={{ fontFamily:FD, fontWeight:800, fontSize:22, color:G.slate, marginBottom:8 }}>Confirm Job Completion?</p>
            <p style={{ fontFamily:FB, fontSize:14, color:G.steel, lineHeight:1.7, marginBottom:6 }}>This will release <strong style={{color:G.green}}>GHS {booking?.amount}</strong> to {booking?.tasker_profiles?.profiles?.full_name?.split(" ")[0] || "Tasker"}'s MoMo wallet.</p>
            <p style={{ fontFamily:FB, fontSize:13, color:G.mist, marginBottom:24 }}>You have 24 hours after confirmation to raise a dispute if needed.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn btn-ghost btn-md" style={{ flex:1 }} onClick={() => setConfirmOpen(false)}>Not yet</button>
              <button className="btn btn-green btn-md" style={{ flex:2 }} onClick={handleConfirm}>Yes, release payment <ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==================================================================================================
   PAGE 2 - NOTIFICATIONS & INBOX
================================================================================================== */

const NOTIF_DATA = [
   { id:1,  type:"payment",  icon:<CreditCard size={20} />, title:"Payment released to Emmanuel",      body:"GHS 312.40 has been sent to Emmanuel K.'s MTN MoMo for AC Repair job BK-7841.", time:"Just now",    unread:true,  badge:"Payment", badgeColor:G.green,  booking:"BK-7841" },
   { id:2,  type:"job",      icon:<CheckCircle size={20} />, title:"Job confirmed complete",             body:"You confirmed Emmanuel's AC Repair job is done. Would you like to leave a review?", time:"2 min ago",  unread:true,  badge:"Job done", badgeColor:G.green, booking:"BK-7841" },
   { id:3,  type:"alert",    icon:<MapPin size={20} />, title:"Emmanuel arrived at your location", body:"Your Tasker has arrived at 42 Okponglo Close, East Legon. Tap to confirm work start.", time:"18 min ago", unread:true,  badge:"Tracking", badgeColor:G.blue,  booking:"BK-7841" },
   { id:4,  type:"quote",    icon:<MessageSquare size={20} />, title:"Quote ready for review",             body:"Emmanuel sent a quote of GHS 355 (Labour: GHS 180 + Materials: GHS 200 - Assessment: GHS 25). Tap to approve or decline.", time:"42 min ago", unread:true,  badge:"Quote",    badgeColor:G.gold,  booking:"BK-7841" },
   { id:5,  type:"booking",  icon:<Wrench size={20} />, title:"Emmanuel accepted your job",         body:"Your AC Repair booking has been confirmed. Emmanuel will arrive at 2:00 PM today.", time:"1 hr ago",   unread:true,  badge:"Booking",  badgeColor:G.blue,  booking:"BK-7841" },
   { id:6,  type:"payment",  icon:<Lock size={20} />, title:"Assessment fee held in escrow",      body:"GHS 25 is safely held. It will be credited toward your total when you approve the quote.", time:"1 hr ago",   unread:false, badge:"Escrow",   badgeColor:G.purple,booking:"BK-7841" },
   { id:7,  type:"booking",  icon:<Receipt size={20} />, title:"Booking BK-7841 created",            body:"AC Repair assessment booked for Today 2:00 PM with Emmanuel K. at East Legon.", time:"1 hr ago",   unread:false, badge:"Booking",  badgeColor:G.blue,  booking:"BK-7841" },
   { id:8,  type:"review",   icon:<Star size={20} />, title:"Rate your last job",                 body:"How did Abena M. do on your House Cleaning on Monday? Your review helps other families.", time:"2 days ago", unread:false, badge:"Review",   badgeColor:G.gold,  booking:"BK-7820" },
   { id:9,  type:"promo",    icon:<PartyPopper size={20} />, title:"Refer a friend, earn GHS 20",        body:"Share your referral code SANDRA20 and both you and your friend get GHS 20 off your next booking.", time:"3 days ago", unread:false, badge:"Promo",    badgeColor:G.orange,booking:null },
   { id:10, type:"system",   icon:<Shield size={20} />, title:"Your Happiness Guarantee reminder",  body:"Remember: if any job isn't right, raise a dispute within 24 hours. We'll fix it or refund you.", time:"1 week ago", unread:false, badge:"Info",     badgeColor:G.mist,  booking:null },
 ];

const NotificationsPage = ({ user }) => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const data = await api.get('/notifications');
        setNotifs(data);
        if (data.length > 0) setSelected(data[0]);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchNotifs();
  }, [user]);

  const filters = ["All", "Payments", "Jobs", "Bookings", "Promos"];
  const unreadCount = notifs.filter(n => !n.is_read).length;

  const filterMap = { All:null, Payments:"payment", Jobs:"job", Bookings:"booking", Promos:"promo" };
  const filtered = notifs.filter(n => !filterMap[filter] || n.type === filterMap[filter]);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifs(ns => ns.map(n => n.id === id ? {...n, is_read:true} : n));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const typeIcons = { payment:<CreditCard size={18} />, job:<CheckCircle size={18} />, alert:<MapPin size={18} />, quote:<MessageSquare size={18} />, booking:<Receipt size={18} />, review:<Star size={18} />, promo:<PartyPopper size={18} />, system:<Shield size={18} /> };
  const badgeColors = { payment:G.green, job:G.green, alert:G.blue, quote:G.gold, booking:G.blue, review:G.gold, promo:G.orange, system:G.mist };

  return (
    <div style={{ minHeight:"100vh", background:G.cloud }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(160deg,${G.ink},#1E2340)`, padding:"28px 40px 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:G.green+"18" }}/>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative" }}>
          <div className="page-enter" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", paddingBottom:20 }}>
            <div>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                <h1 style={{ fontFamily:FD, fontWeight:800, fontSize:28, color:G.white }}>Notifications</h1>
                {unreadCount > 0 && (
                  <div style={{ background:G.red, color:G.white, borderRadius:100, padding:"3px 10px", fontFamily:FB, fontSize:12, fontWeight:700 }}>{unreadCount} new</div>
                )}
              </div>
              <p style={{ fontFamily:FB, fontSize:14, color:"rgba(255,255,255,0.55)" }}>All updates about your bookings, payments, and account</p>
            </div>
          </div>
          {/* Filter tabs */}
          <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,0.1)" }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding:"13px 22px", background:"none", border:"none", cursor:"pointer", fontFamily:FB, fontWeight:filter===f?700:500, fontSize:14, color:filter===f?G.white:"rgba(255,255,255,0.45)", borderBottom:`2.5px solid ${filter===f?G.gold:"transparent"}`, transition:"all 0.2s" }}>
                {f}
                {f === "All" && unreadCount > 0 && <span style={{ marginLeft:6, background:G.red, color:G.white, borderRadius:100, padding:"1px 6px", fontSize:10, fontWeight:700 }}>{unreadCount}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"24px 40px", display:"grid", gridTemplateColumns:"1fr 380px", gap:20, alignItems:"start" }}>
        {/* Notification list */}
        <div style={{ background:G.white, borderRadius:20, border:`1.5px solid ${G.border}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(0,0,0,0.06)" }}>
           {filtered.length === 0 && (
             <div style={{ padding:60, textAlign:"center" }}>
               <Bell size={48} color={G.mist} style={{ marginBottom: 12 }} />
               <p style={{ fontFamily:FD, fontWeight:700, fontSize:18, color:G.slate, marginBottom:6 }}>All caught up!</p>
               <p style={{ fontFamily:FB, fontSize:14, color:G.mist }}>No notifications in this category.</p>
             </div>
           )}
          {filtered.map((n, i) => (
            <div key={n.id} className={`notif-item ${!n.is_read?"unread":""}`} onClick={() => { setSelected(n); markRead(n.id); }}
              style={{ borderLeft:`3px solid ${selected?.id===n.id?G.green:"transparent"}`, animation:`fadeUp 0.35s ${i*0.05}s ease both` }}>
              <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                {/* Icon */}
                <div style={{ width:44, height:44, borderRadius:14, background:(badgeColors[n.type]||G.mist)+"15", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:`1px solid ${(badgeColors[n.type]||G.mist)}22`, color: badgeColors[n.type]||G.mist }}>
                  {typeIcons[n.type] || <Bell size={22} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:4 }}>
                    <p style={{ fontFamily:FB, fontWeight:!n.is_read?700:600, fontSize:14, color:G.slate, lineHeight:1.3 }}>{n.title}</p>
                    <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                      {!n.is_read && <div style={{ width:8, height:8, borderRadius:"50%", background:G.green, flexShrink:0 }}/>}
                      <p style={{ fontFamily:FM, fontSize:11, color:G.mist, whiteSpace:"nowrap" }}>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <p style={{ fontFamily:FB, fontSize:13, color:G.steel, lineHeight:1.55, marginBottom:8 }}>{n.body.slice(0, 90)}{n.body.length>90?"...":""}</p>
                  <Badge color={badgeColors[n.type]||G.mist}>{n.type.toUpperCase()}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div style={{ position:"sticky", top:88, display:"flex", flexDirection:"column", gap:16 }}>
          {selected ? (
            <div className="scale-in" style={{ background:G.white, borderRadius:20, padding:24, border:`1.5px solid ${G.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.07)" }}>
              <div style={{ width:52, height:52, borderRadius:16, background:selected.badgeColor+"15", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:16, border:`1px solid ${selected.badgeColor}22` }}>{selected.icon}</div>
              <Badge color={selected.badgeColor}>{selected.badge}</Badge>
              <p style={{ fontFamily:FD, fontWeight:800, fontSize:18, color:G.slate, margin:"10px 0 10px", lineHeight:1.25 }}>{selected.title}</p>
              <p style={{ fontFamily:FB, fontSize:14, color:G.steel, lineHeight:1.75, marginBottom:16 }}>{selected.body}</p>
              <p style={{ fontFamily:FM, fontSize:11, color:G.mist, marginBottom:20 }}>{selected.time}</p>

              {/* Context actions */}
               <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                 {selected.type === "payment"  && <><button className="btn btn-green btn-sm" style={{width:"100%"}}>View payment receipt <ChevronRight size={14} /></button><button className="btn btn-ghost btn-sm" style={{width:"100%"}}>View booking BK-7841</button></>}
                 {selected.type === "quote"    && <><button className="btn btn-gold btn-sm" style={{width:"100%"}}>Review & Approve Quote <ChevronRight size={14} /></button><button className="btn btn-ghost btn-sm" style={{width:"100%"}}>Decline quote</button></>}
                 {selected.type === "job"      && <><button className="btn btn-gold btn-sm" style={{width:"100%"}}><Star size={14} /> Leave a Review</button><button className="btn btn-green btn-sm" style={{width:"100%"}}>Rebook Tasker</button></>}
                 {selected.type === "alert"    && <><button className="btn btn-blue btn-sm" style={{width:"100%", background:G.blue, color:G.white}}><MapPin size={14} /> Open Live Tracking</button><button className="btn btn-ghost btn-sm" style={{width:"100%"}}><MessageSquare size={14} /> Chat with Tasker</button></>}
                 {selected.type === "review"   && <><button className="btn btn-gold btn-sm" style={{width:"100%"}}><Star size={14} /> Rate Job Now</button></>}
                 {selected.type === "booking"  && <><button className="btn btn-blue btn-sm" style={{width:"100%", background:G.blue, color:G.white}}><Receipt size={14} /> View Booking Details</button><button className="btn btn-ghost btn-sm" style={{width:"100%"}}><MessageSquare size={14} /> Chat with Tasker</button></>}
                 {selected.type === "promo"    && <><button className="btn btn-gold btn-sm" style={{width:"100%"}}><PartyPopper size={14} /> Share Referral Code</button><button className="btn btn-ghost btn-sm" style={{width:"100%"}}>How does referral work?</button></>}
                 {selected.type === "system"   && <button className="btn btn-ghost btn-sm" style={{width:"100%"}}><Shield size={14} /> Learn about our Guarantee</button>}
               </div>
            </div>
          ) : (
            <div style={{ background:G.white, borderRadius:20, padding:40, border:`1.5px solid ${G.border}`, textAlign:"center" }}>
               <Milestone size={40} color={G.mist} style={{ marginBottom: 12 }} />
               <p style={{ fontFamily:FB, fontSize:14, color:G.mist }}>Select a notification to see details and actions</p>
             </div>
          )}

          {/* Notification preferences card */}
          <div style={{ background:G.white, borderRadius:20, padding:20, border:`1.5px solid ${G.border}` }}>
            <p style={{ fontFamily:FD, fontWeight:700, fontSize:14, color:G.slate, marginBottom:14 }}>Notification Settings</p>
            {[
              ["Job alerts",       true,  G.green ],
              ["Payment updates",  true,  G.green ],
              ["WhatsApp alerts",  true,  G.blue  ],
              ["SMS fallback",     true,  G.blue  ],
              ["Promotions",       false, G.mist  ],
            ].map(([label, on, color]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${G.border}` }}>
                <span style={{ fontFamily:FB, fontSize:13, color:G.steel }}>{label}</span>
                <div style={{ width:38, height:22, borderRadius:11, background:on?color:G.border, position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                  <div style={{ position:"absolute", width:16, height:16, borderRadius:"50%", background:G.white, top:3, left:on?19:3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================================================================================================
   PAGE 3 - ONBOARDING WALKTHROUGH
================================================================================================== */

const ONBOARD_STEPS = [
   {
     id:"welcome",
     icon:<Milestone size={48} />,
     title:"Welcome to TaskGH",
     subtitle:"Ghana's most trusted home services platform",
     color:G.green,
     bg:`linear-gradient(160deg,${G.greenDeep} 0%,${G.green} 60%,#0D8559 100%)`,
     content: null,
     cta:"Get Started",
     skip:true,
   },
   {
     id:"services",
     icon:<Wrench size={48} />,
     title:"30+ Home Services",
     subtitle:"Everything your home needs, in one place",
     color:G.blue,
     bg:`linear-gradient(160deg,#1a2a5e 0%,#1E40AF 60%,#2563EB 100%)`,
     content:"services",
     cta:"Next",
     skip:true,
   },
   {
     id:"taskers",
     icon:<CheckCircle size={48} />,
     title:"Vetted Professionals Only",
     subtitle:"Every Tasker is ID-verified before joining",
     color:G.gold,
     bg:`linear-gradient(160deg,#3d2800 0%,#92400E 60%,#B45309 100%)`,
     content:"taskers",
     cta:"Next",
     skip:true,
   },
   {
     id:"escrow",
     icon:<Lock size={48} />,
     title:"Your Money is Always Safe",
     subtitle:"Escrow protection on every single payment",
     color:G.purple,
     bg:`linear-gradient(160deg,#1e1040 0%,#5B21B6 60%,#7C3AED 100%)`,
     content:"escrow",
     cta:"Next",
     skip:true,
   },
   {
     id:"momo",
     icon:<Smartphone size={48} />,
     title:"Pay via MoMo",
     subtitle:"MTN, Telecel, or AT - your choice",
     color:"#E8A020",
     bg:`linear-gradient(160deg,#3d1f00 0%,${G.gold} 100%)`,
     content:"momo",
     cta:"Next",
     skip:true,
   },
   {
     id:"ready",
     icon:<Rocket size={48} />,
     title:"You're Ready to Go!",
     subtitle:"Book your first Tasker in under 2 minutes",
     color:G.green,
     bg:`linear-gradient(160deg,${G.greenDeep} 0%,${G.green} 60%,${G.greenLight} 100%)`,
     content:"ready",
     cta:"Book My First Tasker",
     skip:false,
   },
 ];

const ServiceGrid = () => (
   <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, width:"100%", maxWidth:520, margin:"0 auto" }}>
     {[
       { icon:<Snowflake size={24} />, label:"AC Repair" },
       { icon:<Zap size={24} />, label:"Electrical" },
       { icon:<Droplets size={24} />, label:"Plumbing" },
       { icon:<Brush size={24} />, label:"Cleaning" },
       { icon:<Brush size={24} />, label:"Painting" },
       { icon:<Container size={24} />, label:"Polytank" },
       { icon:<Bug size={24} />, label:"Fumigation" },
       { icon:<Camera size={24} />, label:"CCTV" }
     ].map((svc) => (
       <div key={svc.label} style={{ background:"rgba(255,255,255,0.12)", borderRadius:16, padding:"16px 8px", textAlign:"center", border:"1px solid rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", cursor:"default" }}>
         <div style={{ color: G.white, marginBottom: 8, display: "flex", justifyContent: "center" }}>{svc.icon}</div>
         <p style={{ fontFamily:FB, fontSize:11, color:"rgba(255,255,255,0.9)", fontWeight:600 }}>{svc.label}</p>
       </div>
     ))}
   </div>
 );

const TaskerCards = () => (
  <div style={{ display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:480, margin:"0 auto" }}>
    {[
      { init:"EK", name:"Emmanuel K.", role:"AC Technician", rating:4.9, jobs:247, badge:"Elite", color:"#10B981" },
      { init:"KO", name:"Kwabena O.", role:"Master Plumber", rating:5.0, jobs:312, badge:"Elite", color:"#3B82F6" },
    ].map((t,i) => (
      <div key={i} className="float" style={{ background:"rgba(255,255,255,0.12)", borderRadius:18, padding:"16px 18px", border:"1px solid rgba(255,255,255,0.18)", backdropFilter:"blur(8px)", display:"flex", gap:14, alignItems:"center", animationDelay:`${i*0.5}s` }}>
        <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FD, fontWeight:800, fontSize:18, color:G.white, position:"relative" }}>
          {t.init}
          <div style={{ position:"absolute", bottom:-3, right:-3, width:18, height:18, borderRadius:"50%", background:G.green, border:`2px solid rgba(255,255,255,0.3)`, display:"flex", alignItems:"center", justifyContent:"center", color: G.white }}><Check size={10} strokeWidth={4} /></div>
        </div>
        <div style={{ flex:1 }}>
           <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:2 }}>
             <p style={{ fontFamily:FD, fontWeight:700, fontSize:15, color:G.white }}>{t.name}</p>
             <span style={{ background:G.gold+"33", color:G.gold, fontFamily:FB, fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:20, border:`1px solid ${G.gold}44`, display: "flex", alignItems: "center", gap: 3 }}>
               <Star size={10} fill={G.gold} stroke={G.gold} /> {t.badge}
             </span>
           </div>
          <p style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,0.7)" }}>{t.role}</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ fontFamily:FD, fontWeight:800, fontSize:16, color:G.gold, display: "flex", alignItems: "center", gap: 4 }}><Star size={14} fill={G.gold} stroke={G.gold} /> {t.rating}</p>
          <p style={{ fontFamily:FB, fontSize:11, color:"rgba(255,255,255,0.6)" }}>{t.jobs} jobs</p>
        </div>
      </div>
    ))}
    <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:16, padding:"12px 18px", border:"1px dashed rgba(255,255,255,0.2)", textAlign:"center" }}>
      <p style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 4 }}>+178 more verified Taskers <ArrowRight size={12} /></p>
    </div>
  </div>
);

const EscrowFlow = () => {
    const steps = [
      { icon:<CreditCard size={24} />, label:"You pay", sub:"MoMo charge" },
      { icon:<LockKeyhole size={24} />, label:"Escrow holds", sub:"Safe & secure" },
      { icon:<Wrench size={24} />, label:"Job done", sub:"You confirm" },
      { icon:<CheckCircle size={24} />, label:"Tasker paid", sub:"Auto-release" },
    ];
   return (
     <div style={{ width:"100%", maxWidth:500, margin:"0 auto" }}>
       <div style={{ display:"flex", alignItems:"center", gap:0 }}>
         {steps.map((s,i) => (
           <div key={s.label} style={{ flex: 1, display: "flex", alignItems: "center" }}>
             <div style={{ flex:1, textAlign:"center" }}>
               <div style={{ width:54, height:54, borderRadius:16, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color: G.white, margin:"0 auto 8px", backdropFilter:"blur(8px)" }}>{s.icon}</div>
               <p style={{ fontFamily:FB, fontWeight:700, fontSize:12, color:G.white }}>{s.label}</p>
               <p style={{ fontFamily:FB, fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:2 }}>{s.sub}</p>
             </div>
             {i < steps.length-1 && <div style={{ color:"rgba(255,255,255,0.4)", flexShrink:0, margin:"0 4px", marginBottom:24 }}><ChevronRight size={18} /></div>}
           </div>
         ))}
       </div>
       <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:14, padding:"14px 18px", marginTop:20, border:"1px solid rgba(255,255,255,0.15)" }}>
         <p style={{ fontFamily:FB, fontSize:13, color:"rgba(255,255,255,0.9)", lineHeight:1.65, textAlign:"center", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
           <Shield size={16} /> Your money never goes directly to the Tasker until <strong>you</strong> confirm the job is done to your satisfaction.
         </p>
       </div>
    </div>
  );
};

const MomoStep = () => (
  <div style={{ width:"100%", maxWidth:420, margin:"0 auto", display:"flex", flexDirection:"column", gap:12 }}>
    {[
      { icon:"https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg", name:"MTN MoMo",          color:"#F59E0B", note:"Most popular in Ghana" },
      { icon:"https://upload.wikimedia.org/wikipedia/commons/e/e0/Telecel_Logo.svg", name:"Telecel Cash",      color:"#EF4444", note:"Available across Accra" },
      { icon:"https://upload.wikimedia.org/wikipedia/commons/2/23/AT_logo_Ghana.png", name:"AT Money",   color:"#3B82F6", note:"Fast & reliable" },
    ].map((p,i) => (
      <div key={p.name} className="float" style={{ background:"rgba(255,255,255,0.12)", borderRadius:16, padding:"16px 20px", border:"1px solid rgba(255,255,255,0.2)", display:"flex", gap:14, alignItems:"center", animationDelay:`${i*0.2}s` }}>
        <img src={p.icon} alt={p.name} style={{ width: 28, height: 28, objectFit: "contain" }} />
        <div style={{ flex:1 }}>
          <p style={{ fontFamily:FD, fontWeight:700, fontSize:16, color:G.white }}>{p.name}</p>
          <p style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,0.6)" }}>{p.note}</p>
        </div>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8, padding:"5px 12px" }}>
            <p style={{ fontFamily:FM, fontSize:11, color:G.white, display: "flex", alignItems: "center", gap: 4 }}>Supported <Check size={10} /></p>
          </div>
      </div>
    ))}
    <p style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,0.5)", textAlign:"center", marginTop:4 }}>No credit card needed - Pay directly from your mobile money wallet</p>
  </div>
);

const ReadyStep = () => (
  <div style={{ width:"100%", maxWidth:480, margin:"0 auto" }}>
      {[
        { icon:<Shield size={28} />, title:"Happiness Guarantee", desc:"Job not right? Free redo or full refund." },
        { icon:<Zap size={28} />, title:"Same-Day Booking", desc:"Many services available today." },
        { icon:<LockKeyhole size={28} />, title:"Escrow Protected", desc:"Pay only when you're satisfied." },
        {icon:<Phone size={28} />, title:"7-Day Support", desc:"WhatsApp us anytime, 7AM-10PM." },
      ].map((f,i) => (
        <div key={i} className="feature-card" style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.18)" }}>
          <div style={{ color: G.white, marginBottom:8 }}>{f.icon}</div>
          <p style={{ fontFamily:FD, fontWeight:700, fontSize:14, color:G.white, marginBottom:4 }}>{f.title}</p>
          <p style={{ fontFamily:FB, fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{f.desc}</p>
        </div>
      ))}
    </div>
);

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("left");
  const [phoneAnim, setPhoneAnim] = useState(false);

  const current = ONBOARD_STEPS[step];
  const isFirst = step === 0;
  const isLast  = step === ONBOARD_STEPS.length - 1;

  const go = (n) => {
    setDirection(n > step ? "left" : "right");
    setStep(n);
  };

  const next = () => !isLast && go(step + 1);
  const prev = () => !isFirst && go(step - 1);

  useEffect(() => {
    setPhoneAnim(true);
    const t = setTimeout(() => setPhoneAnim(false), 400);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div style={{ minHeight:"100vh", background:G.cloud, display:"flex", flexDirection:"column" }}>
      {/* Full-screen hero step area */}
      <div style={{ flex:"none", minHeight:500, background:current.bg, position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 40px 28px", transition:"background 0.5s ease" }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-60, left:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }}/>

        {/* Progress dots */}
        <div className="onboard-progress">
          {ONBOARD_STEPS.map((_,i) => (
            <div key={i} onClick={() => go(i)} className="ob-dot" style={{ width:i===step?28:8, background:i===step?"rgba(255,255,255,0.95)":i<step?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.2)", cursor:"pointer" }}/>
          ))}
        </div>

        {/* Main content */}
        <div key={step} className={direction==="left"?"slide-left":"slide-right"} style={{ textAlign:"center", maxWidth:640, width:"100%" }}>
          {/* Big icon */}
          <div style={{ marginBottom:18, display:"flex", justifyContent: "center", animation:"bounce 0.7s ease both", color: G.white }}>{current.icon}</div>
          <h1 style={{ fontFamily:FD, fontWeight:800, fontSize:isFirst?40:34, color:G.white, lineHeight:1.15, marginBottom:12, letterSpacing:"-0.02em" }}>{current.title}</h1>
          <p style={{ fontFamily:FB, fontSize:17, color:"rgba(255,255,255,0.75)", marginBottom:32, lineHeight:1.6 }}>{current.subtitle}</p>

          {/* Step-specific content */}
          {current.content === "services" && <ServiceGrid/>}
          {current.content === "taskers"  && <TaskerCards/>}
          {current.content === "escrow"   && <EscrowFlow/>}
          {current.content === "momo"     && <MomoStep/>}
          {current.content === "ready"    && <ReadyStep/>}
        </div>

        {/* Nav */}
        <div style={{ display:"flex", gap:12, marginTop:32, alignItems:"center" }}>
          {!isFirst && (
            <button className="btn btn-dark btn-md" onClick={prev}><ArrowRight size={16} style={{transform:"rotate(180deg)"}} /> Back</button>
          )}
           <button className="btn btn-white btn-lg" onClick={isLast ? () => {} : next} style={{ minWidth:200, fontFamily:FD, fontWeight:700, fontSize:16, color:current.color }}>
            {current.cta} <ChevronRight size={18} />
          </button>
          {current.skip && !isLast && (
            <button onClick={() => go(ONBOARD_STEPS.length-1)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:FB, fontSize:13, color:"rgba(255,255,255,0.45)", padding:"8px 12px" }}>Skip <ChevronRight size={14} /></button>
          )}
        </div>
      </div>

      {/* Below hero - step details / explainers */}
      <div style={{ flex:1, background:G.white, padding:"32px 40px" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>
          {step === 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {[
                { icon:<Wrench size={32} />, title:"30+ Services", desc:"AC repair, plumbing, cleaning, electrical, painting, fumigation and more." },
                { icon:<Shield size={32} />, title:"Vetted Taskers", desc:"Every professional is ID-checked and background-verified before joining." },
                { icon:<Lock size={32} />, title:"Safe Payments", desc:"Your money is held in escrow until you confirm the job is done right." },
              ].map((f,i) => (
                <div key={i} style={{ background:G.cloud, borderRadius:18, padding:22, border:`1.5px solid ${G.border}`, animation:`fadeUp 0.5s ${i*0.1}s ease both` }}>
                  <div style={{ color: G.slate, marginBottom:12 }}>{f.icon}</div>
                  <p style={{ fontFamily:FD, fontWeight:700, fontSize:14, color:G.slate, marginBottom:4 }}>{f.title}</p>
                  <p style={{ fontFamily:FB, fontSize:13, color:G.steel, lineHeight:1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="page-enter">
              <p style={{ fontFamily:FD, fontWeight:700, fontSize:18, color:G.slate, marginBottom:16 }}>Fixed Price vs Assessment</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[
                  { type:"Fixed Price", color:G.green, icon:<Check size={16} />, desc:"You see the full price before booking. No surprises. Great for house cleaning, polytank cleaning, TV mounting, fumigation.", examples:["House Cleaning - GHS 120","Polytank Cleaning - GHS 80","Fumigation - GHS 150"] },
                  { type:"Assessment Visit", color:G.gold, icon:<Receipt size={16} />, desc:"Tasker visits, inspects the problem, and sends you a quote. You approve before any work starts. Perfect for repairs.", examples:["AC Repair - GHS 25 assessment","Plumbing - GHS 25 assessment","Electrical - GHS 25 assessment"] },
                ].map((t,i) => (
                  <div key={i} style={{ background:G.cloud, borderRadius:18, padding:22, border:`1.5px solid ${t.color}33`, borderTop:`3px solid ${t.color}` }}>
                    <p style={{ fontFamily:FD, fontWeight:700, fontSize:16, color:t.color, marginBottom:8 }}>{t.type}</p>
                    <p style={{ fontFamily:FB, fontSize:13, color:G.steel, lineHeight:1.65, marginBottom:14 }}>{t.desc}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {t.examples.map(ex => (
                        <div key={ex} style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <div style={{ width:16, height:16, borderRadius:"50%", background:t.color+"20", display:"flex", alignItems:"center", justifyContent:"center", color:t.color, flexShrink:0 }}>
                            <Check size={10} strokeWidth={4} />
                          </div>
                          <span style={{ fontFamily:FM, fontSize:12, color:G.steel }}>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="page-enter">
              <p style={{ fontFamily:FD, fontWeight:700, fontSize:18, color:G.slate, marginBottom:16 }}>Our Vetting Process</p>
              <div style={{ display:"flex", gap:0 }}>
                {[
                  { n:"01", icon:<Smartphone size={20} />, title:"Apply", desc:"Tasker fills in details and uploads their Ghana Card" },
                  { n:"02", icon:<Search size={20} />, title:"Review", desc:"Our team checks the ID and calls at least one reference" },
                  { n:"03", icon:<CheckCircle size={20} />, title:"Approved", desc:"Tasker is activated and can start receiving jobs" },
                  { n:"04", icon:<Star size={20} />, title:"Rated", desc:"Every job earns a review - bad Taskers are removed" },
                ].map((s,i,arr) => (
                  <div key={s.n} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", position:"relative" }}>
                    {i < arr.length-1 && <div style={{ position:"absolute", top:22, left:"50%", width:"100%", height:2, background:`linear-gradient(to right, ${G.gold}, ${G.gold}44)` }}/>}
                    <div style={{ width:44, height:44, borderRadius:"50%", background:G.gold, display:"flex", alignItems:"center", justifyContent:"center", color: G.white, position:"relative", zIndex:1, marginBottom:10 }}>{s.icon}</div>
                    <p style={{ fontFamily:FD, fontWeight:700, fontSize:14, color:G.slate, marginBottom:4 }}>{s.title}</p>
                    <p style={{ fontFamily:FB, fontSize:12, color:G.steel, lineHeight:1.5, padding:"0 8px" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="page-enter">
              <p style={{ fontFamily:FD, fontWeight:700, fontSize:18, color:G.slate, marginBottom:16 }}>How Escrow Works - Step by Step</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                {[
                  { icon:<CreditCard size={28} />, n:"1", title:"You pay",          desc:"MoMo charge goes to our secure escrow system, not the Tasker.", color:G.purple },
                  { icon:<LockKeyhole size={28} />, n:"2", title:"Funds held",        desc:"Money sits safely in escrow while the Tasker does the work.", color:G.blue },
                  { icon:<Receipt size={28} />, n:"3", title:"Materials receipt", desc:"For assessment jobs, Tasker uploads purchase receipt before work starts.", color:G.gold },
                  { icon:<CheckCircle size={28} />, n:"4", title:"You confirm",       desc:"Once you're happy, tap 'Done' and payment is released instantly.", color:G.green },
                ].map((s,i) => (
                  <div key={s.n} style={{ background:G.cloud, borderRadius:16, padding:18, border:`1.5px solid ${s.color}22`, borderTop:`3px solid ${s.color}` }}>
                    <div style={{ color: s.color, marginBottom:10 }}>{s.icon}</div>
                    <p style={{ fontFamily:FD, fontWeight:700, fontSize:14, color:s.color, marginBottom:6 }}>Step {s.n}: {s.title}</p>
                    <p style={{ fontFamily:FB, fontSize:12, color:G.steel, lineHeight:1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="page-enter">
              <p style={{ fontFamily:FD, fontWeight:700, fontSize:18, color:G.slate, marginBottom:16 }}>How to Pay with MoMo</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ background:G.cloud, borderRadius:18, padding:22, border:`1.5px solid ${G.border}` }}>
                  <p style={{ fontFamily:FD, fontWeight:700, fontSize:15, color:G.slate, marginBottom:14 }}>Payment steps</p>
                  {["Select your MoMo provider (MTN, Telecel, or AT)", "Enter your phone number", "You'll receive a MoMo push prompt on your phone", "Approve the payment in the MoMo app or via USSD", "Funds are instantly held in escrow"].map((s,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                      <div style={{ width:22, height:22, borderRadius:"50%", background:G.goldPale, border:`1.5px solid ${G.gold}33`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FD, fontWeight:700, fontSize:11, color:G.gold, flexShrink:0 }}>{i+1}</div>
                      <p style={{ fontFamily:FB, fontSize:13, color:G.steel, lineHeight:1.55 }}>{s}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ background:G.greenPale, borderRadius:18, padding:20, border:`1px solid ${G.green}22` }}>
                    <p style={{ fontFamily:FD, fontWeight:700, fontSize:14, color:G.green, marginBottom:6 }}>No credit card needed</p>
                    <p style={{ fontFamily:FB, fontSize:13, color:G.steel, lineHeight:1.65 }}>TaskGH works entirely on mobile money. No bank account or card required.</p>
                  </div>
                  <div style={{ background:G.goldPale, borderRadius:18, padding:20, border:`1px solid ${G.gold}22` }}>
                    <p style={{ fontFamily:FD, fontWeight:700, fontSize:14, color:G.gold, marginBottom:6 }}>Refunds go back to MoMo</p>
                    <p style={{ fontFamily:FB, fontSize:13, color:G.steel, lineHeight:1.65 }}>If anything goes wrong, refunds are processed directly to your MoMo wallet within 2 business days.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="page-enter">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                {[
                  { icon:<Smartphone size={24} />, title:"Open the app",             desc:"Go to taskgh.com or open the TaskGH app on your phone.", n:"01" },
                  { icon:<Search size={24} />, title:"Browse services",           desc:"Pick your service category - fixed price or assessment visit.", n:"02" },
                  { icon:<Wrench size={24} />, title:"Choose a Tasker",           desc:"See ratings, reviews, distance, and hourly rate before confirming.", n:"03" },
                  { icon:<Wallet size={24} />, title:"Pay via MoMo",              desc:"Funds go into escrow. The Tasker gets paid only when you're happy.", n:"04" },
                  { icon:<CheckCircle size={24} />, title:"Job done, you confirm",      desc:"Tap 'Done' to release payment. Then rate your Tasker.", n:"05" },
                  { icon:<RefreshCw size={24} />, title:"Rebook anytime",            desc:"Loved your Tasker? Rebook with one tap from your job history.", n:"06" },
                ].map((s,i) => (
                  <div key={i} style={{ background:G.cloud, borderRadius:16, padding:18, border:`1.5px solid ${G.border}`, animation:`fadeUp 0.4s ${i*0.07}s ease both` }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                      <span style={{ fontFamily:FM, fontSize:11, color:G.mist }}>{s.n}</span>
                      <span style={{ fontSize:24, color: G.green }}>{s.icon}</span>
                    </div>
                    <p style={{ fontFamily:FD, fontWeight:700, fontSize:14, color:G.slate, marginBottom:6 }}>{s.title}</p>
                    <p style={{ fontFamily:FB, fontSize:12, color:G.steel, lineHeight:1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- ROOT --- */
export default function CustomerAppExpansion() {
  const [page, setPage] = useState("tracking");

  const pages = { tracking:TrackingPage, notifications:NotificationsPage, onboarding:OnboardingPage };
  const Page = pages[page];

  return (
    <div style={{ fontFamily:FB, minHeight:"100vh" }}>
      <Fonts/>
      <Nav page={page} onChangePage={setPage}/>
      <Page/>
    </div>
  );
}
