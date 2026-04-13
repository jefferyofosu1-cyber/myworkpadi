import { useState, useEffect, useRef } from "react";
import { 
  AlertTriangle, 
  Search, 
  CreditCard, 
  X, 
  WifiOff, 
  Bell, 
  ClipboardList, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileText,
  Gavel,
  Gift,
  Banknote,
  Smartphone,
  ChevronLeft,
  Wrench,
  DoorOpen,
  DollarSign,
  Home,
  Monitor,
  Check,
  Download,
  Share2,
  HelpCircle,
  Camera,
  MessageSquare,
  User,
  Star,
  Info,
  Pause,
  RefreshCw,
  Clock
} from "lucide-react";

/* --- FONTS & GLOBALS -------------------------------------------------------- */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { -webkit-font-smoothing: antialiased; }

    @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes scaleIn   { from{transform:scale(0.88);opacity:0} to{transform:scale(1);opacity:1} }
    @keyframes slideUp   { from{transform:translateY(100%)} to{transform:translateY(0)} }
    @keyframes slideLeft { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes spin      { to{transform:rotate(360deg)} }
    @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes bounce    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    @keyframes shake     { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
    @keyframes ping      { 0%{transform:scale(1);opacity:.9} 100%{transform:scale(2.2);opacity:0} }
    @keyframes barFill   { from{width:0} to{width:var(--w)} }
    @keyframes countUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 14px rgba(10,110,74,0.3)} 50%{box-shadow:0 0 32px rgba(10,110,74,0.6)} }
    @keyframes dash      { to{stroke-dashoffset:0} }
    @keyframes confetti  { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(80px) rotate(720deg);opacity:0} }

    .page-enter { animation: fadeUp 0.38s ease both; }
    .scale-in   { animation: scaleIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
    .slide-left { animation: slideLeft 0.3s ease both; }
    .float      { animation: float 3s ease-in-out infinite; }
    .bounce     { animation: bounce 0.7s ease both; }
    .shake      { animation: shake 0.4s ease; }

    .btn {
      display:inline-flex; align-items:center; justify-content:center; gap:7px;
      border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:600;
      transition:all 0.2s; white-space:nowrap; border-radius:14px;
    }
    .btn-lg  { padding:16px 32px; font-size:16px; border-radius:16px; }
    .btn-md  { padding:12px 22px; font-size:14px; }
    .btn-sm  { padding:8px 16px; font-size:13px; border-radius:10px; }
    .btn-xs  { padding:6px 12px; font-size:12px; border-radius:8px; }
    .btn-green { background:#0A6E4A; color:#fff; box-shadow:0 4px 16px rgba(10,110,74,0.3); }
    .btn-green:hover { background:#0D8559; transform:translateY(-1px); }
    .btn-gold  { background:#E8A020; color:#fff; box-shadow:0 4px 14px rgba(232,160,32,0.3); }
    .btn-gold:hover  { background:#D4901A; transform:translateY(-1px); }
    .btn-ghost { background:#F7F9FC; color:#4A5568; border:1.5px solid #EEF2F7; }
    .btn-ghost:hover { background:#EEF2F7; }
    .btn-outline { background:transparent; color:#0A6E4A; border:2px solid #0A6E4A; }
    .btn-outline:hover { background:#0A6E4A; color:#fff; }
    .btn-red   { background:#EF4444; color:#fff; box-shadow:0 4px 12px rgba(239,68,68,0.3); }
    .btn-red:hover   { background:#DC2626; transform:translateY(-1px); }
    .btn-dark  { background:rgba(255,255,255,0.12); color:#fff; border:1px solid rgba(255,255,255,0.2); }
    .btn-dark:hover  { background:rgba(255,255,255,0.22); }
    .btn-white { background:#fff; color:#0A6E4A; box-shadow:0 4px 14px rgba(0,0,0,0.1); }
    .btn-white:hover { background:#F0FDF4; }
    .btn:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }

    .input {
      width:100%; padding:13px 16px; border-radius:13px;
      border:1.5px solid #EEF2F7; background:#F7F9FC;
      font-family:'DM Sans',sans-serif; font-size:15px; color:#1A202C;
      outline:none; transition:all 0.2s;
    }
    .input:focus { border-color:#0A6E4A; background:#fff; box-shadow:0 0 0 3px rgba(10,110,74,0.08); }
    .input::placeholder { color:#94A3B8; }
    .input.error { border-color:#EF4444; box-shadow:0 0 0 3px rgba(239,68,68,0.08); }
    textarea.input { resize:none; line-height:1.6; }
    select.input { appearance:none; cursor:pointer; }

    .otp-box {
      width:56px; height:64px; border-radius:16px; text-align:center;
      border:2px solid #EEF2F7; background:#F7F9FC;
      font-family:'Syne',sans-serif; font-weight:700; font-size:26px; color:#1A202C;
      outline:none; transition:all 0.2s;
    }
    .otp-box:focus { border-color:#0A6E4A; background:#fff; box-shadow:0 0 0 3px rgba(10,110,74,0.1); }
    .otp-box.filled { border-color:#0A6E4A; background:#E8F5EF; color:#0A6E4A; }
    .otp-box.error  { border-color:#EF4444; animation:shake 0.35s ease; }

    .phone-shell {
      width:390px; background:#fff; border-radius:44px; overflow:hidden;
      display:flex; flex-direction:column; position:relative;
      box-shadow:0 0 0 10px #111,0 0 0 12px #222,0 40px 80px rgba(0,0,0,0.45),0 20px 40px rgba(0,0,0,0.3);
      min-height:844px;
    }
    .status-bar {
      height:44px; display:flex; align-items:center; justify-content:space-between;
      padding:12px 24px 0; flex-shrink:0;
    }
    .bottom-nav-bar {
      height:83px; display:flex; align-items:flex-start; padding:12px 0 0;
      border-top:1px solid rgba(0,0,0,0.06); background:inherit; flex-shrink:0;
    }
    .screen-scroll { flex:1; overflow-y:auto; scrollbar-width:none; }
    .screen-scroll::-webkit-scrollbar { display:none; }

    .card {
      background:#fff; border-radius:20px; border:1.5px solid #EEF2F7;
      box-shadow:0 2px 14px rgba(0,0,0,0.06);
    }
    .card-row {
      padding:14px 20px; display:flex; justify-content:space-between; align-items:center;
      border-bottom:1px solid #EEF2F7; transition:background 0.15s;
    }
    .card-row:last-child { border-bottom:none; }
    .card-row:hover { background:#F7F9FC; cursor:pointer; }

    .progress-bar { height:6px; background:#EEF2F7; border-radius:3px; overflow:hidden; }
    .progress-fill { height:100%; border-radius:3px; animation:barFill 0.8s ease both; }

    .shimmer {
      background:linear-gradient(90deg,#f0f2f5 25%,#e8eaed 50%,#f0f2f5 75%);
      background-size:200% 100%; animation:barFill 1.5s infinite; border-radius:8px;
    }

    .confetti-piece {
      position:absolute; width:8px; height:8px; border-radius:2px;
      animation:confetti 1s ease both;
    }

    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-thumb { background:#CBD5E0; border-radius:2px; }
  `}</style>
);

/* --- TOKENS ------------------------------------------------------------------ */
const G = {
  green:"#0A6E4A", greenL:"#12A06B", greenD:"#064D34",
  greenPale:"#E8F5EF", greenPale2:"#F0FDF4",
  gold:"#E8A020", goldPale:"#FDF4E3",
  ink:"#0D1117", slate:"#1A202C", steel:"#4A5568",
  mist:"#94A3B8", cloud:"#F7F9FC", border:"#EEF2F7",
  white:"#FFFFFF", red:"#EF4444", redPale:"#FEF2F2",
  blue:"#3B82F6", bluePale:"#EFF6FF",
  purple:"#8B5CF6", purplePale:"#F5F3FF",
  orange:"#F97316", orangePale:"#FFF7ED",
};
const FD = "'Syne',sans-serif";
const FB = "'DM Sans',sans-serif";
const FM = "'JetBrains Mono',monospace";

/* --- SHARED COMPONENTS ------------------------------------------------------- */
const Logo = ({ dark=false, size=32 }) => (
  <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="11" fill={G.green}/>
      <path d="M13 27L21 19" stroke={G.gold} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="16" r="5" stroke="white" strokeWidth="2.2" fill="none"/>
      <path d="M20 20L14.5 25.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M21 15.5L23 17.5L27 13.5" stroke={G.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span style={{ fontFamily:FD,fontWeight:800,fontSize:size*0.56,color:dark?G.white:G.ink,letterSpacing:"-0.02em" }}>
      Task<span style={{color:G.green}}>GH</span>
    </span>
  </div>
);

const Nav = ({ page, onChange }) => (
  <div style={{ position:"sticky",top:0,zIndex:100,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${G.border}`,padding:"0 32px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 20px rgba(0,0,0,0.05)" }}>
    <Logo/>
    <div style={{ display:"flex",gap:3,background:G.cloud,padding:3,borderRadius:12,border:`1px solid ${G.border}`,overflowX:"auto",maxWidth:760 }}>
      {[
        {id:"errors",   icon:<AlertTriangle size={14} />, label:"Error States"},
        {id:"auth",     icon:<ShieldCheck size={14} />, label:"Auth"},
        {id:"receipt",  icon:<FileText size={14} />, label:"Receipt"},
        {id:"dispute",  icon:<Gavel size={14} />, label:"Dispute"},
        {id:"referral", icon:<Gift size={14} />, label:"Referral"},
        {id:"earnings", icon:<Banknote size={14} />, label:"Earnings"},
        {id:"mobile",   icon:<Smartphone size={14} />, label:"Mobile Shell"},
      ].map(tab => (
        <button key={tab.id} onClick={()=>onChange(tab.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:FB,fontWeight:page===tab.id?600:400,fontSize:12,background:page===tab.id?G.white:"transparent",color:page===tab.id?G.green:G.steel,boxShadow:page===tab.id?"0 1px 6px rgba(0,0,0,0.08)":"none",transition:"all 0.15s",whiteSpace:"nowrap" }}>
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
    <button className="btn btn-green btn-sm">Book a Tasker</button>
  </div>
);

const Badge = ({ color, children, dot }) => (
  <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,background:color+"18",color,border:`1px solid ${color}33`,fontFamily:FB,fontSize:11,fontWeight:700 }}>
    {dot && <span style={{ width:5,height:5,borderRadius:"50%",background:color,animation:"pulse 1.5s infinite" }}/>}
    {children}
  </span>
);

const SLabel = ({ children }) => (
  <p style={{ fontFamily:FB,fontSize:11,color:G.mist,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>{children}</p>
);

/* ==================================================================
   PAGE 1 - ERROR & EMPTY STATES
================================================================== */
const ErrorsPage = () => {
  const [activeError, setActiveError] = useState("no-taskers");

  const errors = [
    {
      id:"no-taskers", label:"No Taskers Found",
      icon:<Search size={24} />, color:G.gold,
      title:"No Taskers Available Right Now",
      subtitle:"No verified AC Repair Taskers were found near East Legon",
      body:"All our Taskers in your area are currently busy or unavailable. Try expanding your area, choosing a different time, or checking back in a few minutes.",
      actions:[
        { label:"Expand search area", style:"btn-green" },
        { label:"Try a different time", style:"btn-outline" },
        { label:"Get notified when available", style:"btn-ghost" },
      ],
      tips:["8 Taskers in nearby areas like Osu and Cantonments","Try scheduling for tomorrow - more Taskers available","Polytank & Cleaning Taskers are available now"],
      illustration:"search",
    },
    {
      id:"payment-failed", label:"Payment Failed",
      icon:<CreditCard size={24} />, color:G.red,
      title:"Payment Didn't Go Through",
      subtitle:"Your MTN MoMo charge for GHS 25 was not completed",
      body:"This can happen if you cancelled the MoMo prompt, had insufficient balance, or if the network timed out. Your booking is still saved - try paying again.",
      actions:[
        { label:"Try payment again", style:"btn-green" },
        { label:"Use a different MoMo provider", style:"btn-outline" },
        { label:"Pay later (booking saved)", style:"btn-ghost" },
      ],
      tips:["Check your MoMo balance before retrying","Make sure to approve the push prompt within 2 minutes","Try Telecel Cash or AT Money if MTN fails"],
      illustration:"payment",
    },
    {
      id:"cancelled", label:"Job Cancelled",
      icon:<X size={24} />, color:G.mist,
      title:"Booking Cancelled",
      subtitle:"Booking BK-7841 has been cancelled",
      body:"Your AC Repair booking has been cancelled. If you paid an assessment fee, a full refund of GHS 25 will be returned to your MTN MoMo within 2 business days.",
      actions:[
        { label:"Book again", style:"btn-green" },
        { label:"Find a different Tasker", style:"btn-outline" },
        { label:"View refund status", style:"btn-ghost" },
      ],
      tips:["Refund will appear in 2 business days","You can rebook the same Tasker anytime","Contact support if refund doesn't arrive"],
      illustration:"cancelled",
    },
    {
      id:"network", label:"Network Error",
      icon:<WifiOff size={24} />, color:G.blue,
      title:"Connection Lost",
      subtitle:"Unable to load Taskers near you",
      body:"We couldn't reach our servers. This is usually a temporary issue with your internet connection. Please check your connection and try again.",
      actions:[
        { label:"Try again", style:"btn-green" },
        { label:"Go offline mode", style:"btn-ghost" },
      ],
      tips:["Check your WiFi or mobile data","This usually resolves in a few seconds","Your booking draft has been saved locally"],
      illustration:"network",
    },
    {
      id:"empty-inbox", label:"Empty Notifications",
      icon:<Bell size={24} />, color:G.green,
      title:"You're All Caught Up!",
      subtitle:"No new notifications",
      body:"When you book a Tasker, get a quote, or your payment is released, you'll see updates here.",
      actions:[
        { label:"Book your first Tasker", style:"btn-green" },
        { label:"Browse services", style:"btn-ghost" },
      ],
      tips:[],
      illustration:"empty",
    },
    {
      id:"no-bookings", label:"Empty Job History",
      icon:<ClipboardList size={24} />, color:G.green,
      title:"No Bookings Yet",
      subtitle:"Your job history will appear here",
      body:"Once you book your first Tasker, all your bookings, receipts, and job history will show up here for easy reference.",
      actions:[
        { label:"Make your first booking", style:"btn-green" },
      ],
      tips:[],
      illustration:"empty-jobs",
    },
  ];

  const active = errors.find(e => e.id === activeError);

  const IllustrationSVG = ({ type, color }) => {
    const shapes = {
      search: (
        <svg width={120} height={120} viewBox="0 0 120 120" fill="none">
          <circle cx="52" cy="52" r="32" stroke={color} strokeWidth="4" strokeDasharray="8 4"/>
          <line x1="76" y1="76" x2="96" y2="96" stroke={color} strokeWidth="4" strokeLinecap="round"/>
          <circle cx="52" cy="52" r="18" fill={color+"18"}/>
          <path d="M44 52h16M52 44v16" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      payment: (
        <svg width={120} height={120} viewBox="0 0 120 120" fill="none">
          <rect x="20" y="35" width="80" height="50" rx="12" fill={color+"15"} stroke={color} strokeWidth="3"/>
          <rect x="20" y="50" width="80" height="12" fill={color+"30"}/>
          <circle cx="90" cy="90" r="20" fill={G.redPale} stroke={G.red} strokeWidth="3"/>
          <path d="M84 96l12-12M96 96L84 84" stroke={G.red} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      cancelled: (
        <svg width={120} height={120} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="40" fill={G.cloud} stroke={color} strokeWidth="3" strokeDasharray="6 3"/>
          <path d="M44 60l10 10 22-22" stroke={G.mist} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
          <path d="M44 44l32 32M76 44L44 76" stroke={G.red} strokeWidth="3.5" strokeLinecap="round"/>
        </svg>
      ),
      network: (
        <svg width={120} height={120} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="38" fill={G.bluePale} stroke={G.blue} strokeWidth="3" opacity="0.5"/>
          {[0,1,2].map(i => <circle key={i} cx="60" cy="60" r={18+i*12} fill="none" stroke={G.blue} strokeWidth="2" strokeDasharray="4 6" opacity={0.6-i*0.15}/>)}
          <circle cx="60" cy="60" r="8" fill={G.blue}/>
          <path d="M60 40v-12M60 92v-12M40 60H28M92 60H80" stroke={G.blue} strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
          <path d="M50 84l14-48" stroke={G.red} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        </svg>
      ),
      empty: (
        <svg width={120} height={120} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="55" r="32" fill={G.greenPale} stroke={G.green} strokeWidth="2.5" strokeDasharray="6 3"/>
          <path d="M48 55l8 8 16-16" stroke={G.green} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M36 90q24-10 48 0" stroke={G.green} strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
        </svg>
      ),
      "empty-jobs": (
        <svg width={120} height={120} viewBox="0 0 120 120" fill="none">
          <rect x="25" y="30" width="70" height="60" rx="12" fill={G.greenPale} stroke={G.green} strokeWidth="2.5" strokeDasharray="6 3"/>
          <line x1="40" y1="52" x2="80" y2="52" stroke={G.green} strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
          <line x1="40" y1="63" x2="65" y2="63" stroke={G.green} strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
          <line x1="40" y1="74" x2="72" y2="74" stroke={G.green} strokeWidth="2.5" strokeLinecap="round" opacity="0.3"/>
        </svg>
      ),
    };
    return shapes[type] || shapes.empty;
  };

  return (
    <div style={{ minHeight:"100vh", background:G.cloud, padding:"32px 40px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <div className="page-enter" style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:FD,fontWeight:800,fontSize:28,color:G.slate,marginBottom:6 }}>Error & Empty States</h1>
          <p style={{ fontFamily:FB,fontSize:15,color:G.steel }}>Every failure screen, empty state, and edge case - each with helpful recovery paths.</p>
        </div>
        <div style={{ display:"flex",gap:24,alignItems:"flex-start" }}>
          {/* Sidebar selector */}
          <div style={{ width:220,flexShrink:0,display:"flex",flexDirection:"column",gap:8,position:"sticky",top:88 }}>
            {errors.map(e => (
              <button key={e.id} onClick={()=>setActiveError(e.id)} style={{ padding:"11px 16px",borderRadius:12,border:`1.5px solid ${activeError===e.id?e.color:G.border}`,background:activeError===e.id?e.color+"12":G.white,cursor:"pointer",fontFamily:FB,fontWeight:activeError===e.id?600:500,fontSize:13,color:activeError===e.id?e.color:G.steel,textAlign:"left",transition:"all 0.18s" }}>
                {e.label}
              </button>
            ))}
          </div>

          {/* Error display */}
          <div key={activeError} className="slide-left" style={{ flex:1 }}>
            {/* Full page error mockup */}
            <div style={{ background:G.white,borderRadius:24,border:`1.5px solid ${G.border}`,overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,0.07)",marginBottom:20 }}>
              {/* Mock top bar */}
              <div style={{ padding:"14px 24px",borderBottom:`1px solid ${G.border}`,display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:32,height:32,borderRadius:9,background:G.cloud,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer" }}><ChevronLeft size={16} /></div>
                <span style={{ fontFamily:FB,fontWeight:600,fontSize:14,color:G.steel }}>TaskGH</span>
              </div>

              {/* Error content */}
              <div style={{ padding:"60px 40px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center" }}>
                <div style={{ marginBottom:28 }} className="bounce">
                  <IllustrationSVG type={active.illustration} color={active.color}/>
                </div>
                <h2 style={{ fontFamily:FD,fontWeight:800,fontSize:26,color:G.slate,marginBottom:10,letterSpacing:"-0.02em" }}>{active.title}</h2>
                <p style={{ fontFamily:FB,fontSize:14,color:G.mist,marginBottom:12 }}>{active.subtitle}</p>
                <p style={{ fontFamily:FB,fontSize:14,color:G.steel,lineHeight:1.75,maxWidth:420,marginBottom:32 }}>{active.body}</p>

                <div style={{ display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:360 }}>
                  {active.actions.map((a,i) => (
                    <button key={i} className={`btn ${a.style} btn-md`} style={{ width:"100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      {a.label} {a.style === "btn-green" && <ArrowRight size={16} />}
                    </button>
                  ))}
                </div>

                {active.tips.length > 0 && (
                  <div style={{ marginTop:28,background:G.cloud,borderRadius:16,padding:"16px 20px",maxWidth:420,width:"100%",textAlign:"left" }}>
                    <p style={{ fontFamily:FB,fontWeight:600,fontSize:12,color:G.mist,marginBottom:10,letterSpacing:"0.08em",textTransform:"uppercase" }}>Helpful tips</p>
                    {active.tips.map((tip,i) => (
                      <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start",marginBottom:8 }}>
                        <div style={{ width:18,height:18,borderRadius:"50%",background:active.color+"20",display:"flex",alignItems:"center",justifyContent:"center",color:active.color,flexShrink:0,marginTop:1 }}><ArrowRight size={10} /></div>
                        <p style={{ fontFamily:FB,fontSize:13,color:G.steel,lineHeight:1.55 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Usage notes */}
            <div style={{ background:G.greenPale,borderRadius:16,padding:"14px 18px",border:`1px solid ${G.green}22` }}>
              <p style={{ fontFamily:FM,fontSize:11,color:G.green }}>Component: &lt;ErrorState type="{activeError}" /&gt; - Used in BookingPage, PaymentPage, SearchPage, NotificationsPage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================================================================
   PAGE 2 - AUTH (STANDALONE WEB)
================================================================== */
const AuthPage = () => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef([]);
  const [timer, setTimer] = useState(59);
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    if (step !== "otp") return;
    const t = setInterval(() => setTimer(s => Math.max(0, s-1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const handlePhone = () => {
    if (phone.length < 9) { setError("Please enter a valid Ghana phone number"); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1200);
  };

  const handleOTPChange = (i, val) => {
    const v = val.replace(/\D/, "");
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i+1]?.focus();
    if (next.every(d => d) && next.join("") === "123456") {
      setError(""); setLoading(true);
      setTimeout(() => { setLoading(false); setStep(isNew ? "profile" : "done"); }, 900);
    }
    if (next.every(d => d) && next.join("") !== "123456") {
      setTimeout(() => setError("Incorrect code. Try 123456 for demo"), 200);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${G.greenD} 0%,${G.green} 55%,#0D8559 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute",top:-80,right:-80,width:280,height:280,borderRadius:"50%",background:"rgba(255,255,255,0.05)" }}/>
      <div style={{ position:"absolute",bottom:-60,left:-60,width:220,height:220,borderRadius:"50%",background:G.gold+"12" }}/>

      <div style={{ width:"100%", maxWidth:440, position:"relative" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <Logo dark size={44}/>
        </div>

        {/* Card */}
        <div key={step} className="scale-in" style={{ background:G.white, borderRadius:24, padding:36, boxShadow:"0 24px 80px rgba(0,0,0,0.25)" }}>

          {step === "phone" && (
            <>
              <h2 style={{ fontFamily:FD,fontWeight:800,fontSize:26,color:G.slate,marginBottom:6 }}>Welcome Back</h2>
              <p style={{ fontFamily:FB,fontSize:14,color:G.steel,marginBottom:28,lineHeight:1.6 }}>Enter your Ghana phone number to continue. We'll send you a one-time code.</p>
              <SLabel>Your phone number</SLabel>
              <div style={{ display:"flex",gap:10,marginBottom:error?8:20 }}>
                <div style={{ background:G.cloud,border:`1.5px solid ${G.border}`,borderRadius:13,padding:"13px 14px",display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
                  <Smartphone size={16} color={G.mist} />
                  <span style={{ fontFamily:FB,fontWeight:600,fontSize:14,color:G.slate }}>+233</span>
                </div>
                <input className={`input ${error?"error":""}`} placeholder="054 XXX XXXX" value={phone} onChange={e=>{setPhone(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handlePhone()} type="tel"/>
              </div>
              {error && <p style={{ fontFamily:FB,fontSize:12,color:G.red,marginBottom:14 }}>{error}</p>}
              <button className="btn btn-green btn-md" style={{ width:"100%",marginBottom:16,fontSize:15 }} onClick={handlePhone} disabled={loading}>
                {loading ? <div style={{ width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:G.white,borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/> : <span style={{ display:"flex", alignItems:"center", gap:8 }}>Send OTP <ArrowRight size={16} /></span>}
              </button>
              <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:16 }}>
                <div style={{ flex:1,height:1,background:G.border }}/><span style={{ fontFamily:FB,fontSize:12,color:G.mist }}>or</span><div style={{ flex:1,height:1,background:G.border }}/>
              </div>
              <button className="btn btn-ghost btn-md" style={{ width:"100%" }} onClick={()=>{setIsNew(false);setPhone("054 000 1234");}}>Continue as returning user</button>
              <p style={{ fontFamily:FB,fontSize:12,color:G.mist,textAlign:"center",marginTop:16,lineHeight:1.6 }}>By continuing you agree to our <span style={{color:G.green,cursor:"pointer"}}>Terms</span> and <span style={{color:G.green,cursor:"pointer"}}>Privacy Policy</span></p>
            </>
          )}

          {step === "otp" && (
            <>
              <button onClick={()=>{setStep("phone");setOtp(["","","","","",""]);setError("");}} style={{ background:G.cloud,border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",color:G.steel }}><ChevronLeft size={18} /></button>
              <h2 style={{ fontFamily:FD,fontWeight:800,fontSize:26,color:G.slate,marginBottom:6 }}>Enter Code</h2>
              <p style={{ fontFamily:FB,fontSize:14,color:G.steel,marginBottom:6,lineHeight:1.6 }}>We sent a 6-digit code to <strong style={{color:G.slate}}>+233 {phone}</strong></p>
              <p style={{ fontFamily:FM,fontSize:12,color:G.green,marginBottom:28 }}>Demo: use code 123456</p>
              <div style={{ display:"flex",gap:8,justifyContent:"center",marginBottom:error?10:24 }}>
                {otp.map((d,i) => (
                  <input key={i} ref={el=>otpRefs.current[i]=el} className={`otp-box ${d?"filled":""} ${error?"error":""}`} maxLength={1} value={d}
                    onChange={e=>handleOTPChange(i,e.target.value)}
                    onKeyDown={e=>e.key==="Backspace"&&!d&&i>0&&otpRefs.current[i-1]?.focus()}/>
                ))}
              </div>
              {loading && <div style={{ display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginBottom:16,animation:"fadeIn 0.2s ease" }}><div style={{ width:16,height:16,border:`2px solid ${G.green}22`,borderTopColor:G.green,borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/><p style={{ fontFamily:FB,fontSize:13,color:G.green }}>Verifying...</p></div>}
              {error && <p style={{ fontFamily:FB,fontSize:12,color:G.red,textAlign:"center",marginBottom:14 }}>{error}</p>}
              <div style={{ textAlign:"center" }}>
                <p style={{ fontFamily:FB,fontSize:13,color:G.mist,marginBottom:6 }}>{timer > 0 ? `Resend in 0:${timer.toString().padStart(2,"0")}` : "Didn't receive a code?"}</p>
                {timer === 0 && <button style={{ background:"none",border:"none",cursor:"pointer",fontFamily:FB,fontWeight:600,fontSize:14,color:G.green }} onClick={()=>setTimer(59)}>Resend OTP</button>}
              </div>
            </>
          )}

          {step === "profile" && (
            <>
              <div style={{ textAlign:"center",marginBottom:24 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: G.green }}><User size={32} /></div>
                <h2 style={{ fontFamily:FD,fontWeight:800,fontSize:24,color:G.slate,marginBottom:6 }}>Welcome to TaskGH!</h2>
                <p style={{ fontFamily:FB,fontSize:14,color:G.steel }}>Quick setup - takes 30 seconds</p>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:20 }}>
                <div>
                  <SLabel>Your name *</SLabel>
                  <input className="input" placeholder="e.g. Sandra Asante" value={name} onChange={e=>setName(e.target.value)}/>
                </div>
                <div>
                  <SLabel>Area in Accra</SLabel>
                  <select className="input">
                    <option>East Legon</option>
                    <option>Airport Area</option>
                    <option>Cantonments</option>
                    <option>Osu</option>
                    <option>Spintex</option>
                    <option>Tema</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-green btn-md" style={{ width:"100%",fontSize:15 }} onClick={()=>setStep("done")} disabled={!name.trim()}>Complete Setup <ArrowRight size={16} /></button>
            </>
          )}

          {step === "done" && (
            <div style={{ textAlign:"center",padding:"12px 0" }}>
              <div style={{ width:72,height:72,borderRadius:"50%",background:G.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px" }} className="bounce">
                <Check size={32} color="white" />
              </div>
              <h2 style={{ fontFamily:FD,fontWeight:800,fontSize:24,color:G.slate,marginBottom:8 }}>{isNew?"You're in!":"Welcome back!"}</h2>
              <p style={{ fontFamily:FB,fontSize:14,color:G.steel,marginBottom:24,lineHeight:1.7 }}>{isNew?"Your account is ready. Book your first Tasker and get help today.":"Great to see you again. Your bookings and saved Taskers are ready."}</p>
              <button className="btn btn-green btn-lg" style={{ width:"100%" }} onClick={()=>setStep("phone")}>Go to Homepage <ArrowRight size={18} /></button>
            </div>
          )}
        </div>

        <p style={{ fontFamily:FB,fontSize:12,color:"rgba(255,255,255,0.5)",textAlign:"center",marginTop:20 }}><ShieldCheck size={12} style={{ display: "inline", marginRight: 4 }} /> Secured by TaskGH - No password needed</p>
      </div>
    </div>
  );
};

/* ==================================================================
   PAGE 3 - RECEIPT VIEWER
================================================================== */
const ReceiptPage = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{ minHeight:"100vh",background:G.cloud,padding:"32px 40px" }}>
      <div style={{ maxWidth:700,margin:"0 auto" }}>
        <div className="page-enter" style={{ marginBottom:24 }}>
          <h1 style={{ fontFamily:FD,fontWeight:800,fontSize:28,color:G.slate,marginBottom:4 }}>Receipt Viewer</h1>
          <p style={{ fontFamily:FB,fontSize:14,color:G.steel }}>Materials receipt uploaded by Tasker - Booking BK-7841</p>
        </div>

        {/* Verified banner */}
        <div style={{ background:G.greenPale,borderRadius:16,padding:"14px 20px",marginBottom:20,display:"flex",gap:12,alignItems:"center",border:`1px solid ${G.green}22` }} className="page-enter">
          <div style={{ width:40,height:40,borderRadius:12,background:G.green,display:"flex",alignItems:"center",justifyContent:"center",color: "white", flexShrink:0 }}><CheckCircle size={20} /></div>
          <div>
            <p style={{ fontFamily:FB,fontWeight:700,fontSize:14,color:G.green }}>Receipt verified by TaskGH admin</p>
            <p style={{ fontFamily:FM,fontSize:12,color:G.steel }}>Verified Sat 11 Apr 2026, 12:48 PM - Matches quoted materials list</p>
          </div>
          <Badge color={G.green} style={{ marginLeft:"auto" }}>Verified</Badge>
        </div>

        {/* Receipt card */}
        <div className="card page-enter" style={{ marginBottom:20 }}>
          {/* Header */}
          <div style={{ background:`linear-gradient(135deg,${G.green},${G.greenL})`,padding:"24px 28px",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
            <div>
              <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:4 }}>MATERIALS RECEIPT</p>
              <p style={{ fontFamily:FD,fontWeight:800,fontSize:22,color:G.white }}>Koala Shopping Centre</p>
              <p style={{ fontFamily:FB,fontSize:13,color:"rgba(255,255,255,0.75)" }}>Accra Mall Branch - Receipt #RCP-44821</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:4 }}>PURCHASE DATE</p>
              <p style={{ fontFamily:FD,fontWeight:700,fontSize:14,color:G.white }}>Sat 11 Apr 2026</p>
              <p style={{ fontFamily:FB,fontSize:12,color:"rgba(255,255,255,0.6)" }}>2:15 PM</p>
            </div>
          </div>

          {/* Tasker info */}
          <div style={{ padding:"16px 28px",borderBottom:`1px solid ${G.border}`,display:"flex",gap:14,alignItems:"center",background:G.greenPale2 }}>
            <div style={{ width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${G.green},${G.greenL})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FD,fontWeight:800,fontSize:14,color:G.white }}>EK</div>
            <div>
              <p style={{ fontFamily:FB,fontWeight:600,fontSize:14,color:G.slate }}>Uploaded by Emmanuel K.</p>
              <p style={{ fontFamily:FM,fontSize:11,color:G.mist }}>Tasker ID: TSK-001 - Booking: BK-7841</p>
            </div>
            <div style={{ marginLeft:"auto" }}>
              <button style={{ background:"none",border:`1px solid ${G.green}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:FB,fontWeight:600,fontSize:12,color:G.green }} onClick={()=>setExpanded(e=>!e)}>
                {expanded?"Hide photos":"View photos"}
              </button>
            </div>
          </div>

          {/* Receipt photo placeholder */}
          {expanded && (
            <div style={{ padding:"16px 28px",borderBottom:`1px solid ${G.border}`,background:G.cloud }}>
              <SLabel>Receipt photos (2)</SLabel>
              <div style={{ display:"flex",gap:12 }}>
                {[1,2].map(i => (
                  <div key={i} style={{ flex:1,height:180,borderRadius:14,background:`linear-gradient(135deg,${G.greenPale},#fff)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:`1.5px solid ${G.border}`,cursor:"pointer",transition:"all 0.2s" }}>
                    <Camera size={36} color={G.mist} style={{ marginBottom: 6 }} />
                    <p style={{ fontFamily:FB,fontSize:12,color:G.mist }}>Receipt photo {i}</p>
                    <p style={{ fontFamily:FM,fontSize:10,color:G.mist,marginTop:3 }}>Click to expand</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Line items */}
          <div style={{ padding:"20px 28px" }}>
            <SLabel>Materials purchased</SLabel>
            <table style={{ width:"100%",borderCollapse:"collapse",marginBottom:16 }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${G.border}` }}>
                  {["Item","Qty","Unit price","Total"].map(h => (
                    <th key={h} style={{ fontFamily:FB,fontSize:11,color:G.mist,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",padding:"8px 12px",textAlign:h==="Total"?"right":"left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name:"Refrigerant R410A (1kg canister)", qty:1, unit:120, total:120, match:true },
                  { name:"AC Filter Kit (universal, 2-pack)", qty:1, unit:45, total:45, match:true },
                  { name:"Copper pipe fitting (0.5 inch)", qty:2, unit:17.50, total:35, match:true },
                ].map((item,i) => (
                  <tr key={i} style={{ borderBottom:`1px solid ${G.border}`,background:i%2===0?"transparent":G.cloud+"60" }}>
                    <td style={{ padding:"13px 12px" }}>
                      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                        <p style={{ fontFamily:FB,fontSize:14,color:G.slate }}>{item.name}</p>
                        {item.match && <Badge color={G.green}><Check size={10} /> Matches quote</Badge>}
                      </div>
                    </td>
                    <td style={{ padding:"13px 12px",fontFamily:FM,fontSize:13,color:G.steel }}>{item.qty}</td>
                    <td style={{ padding:"13px 12px",fontFamily:FM,fontSize:13,color:G.steel }}>GHS {item.unit.toFixed(2)}</td>
                    <td style={{ padding:"13px 12px",fontFamily:FD,fontWeight:700,fontSize:14,color:G.slate,textAlign:"right" }}>GHS {item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ background:G.cloud,borderRadius:14,padding:"16px 20px" }}>
              {[
                { label:"Subtotal",             val:"GHS 200.00", color:G.slate },
                { label:"VAT (0%)",              val:"GHS 0.00",   color:G.mist },
                { label:"Quoted materials",      val:"GHS 200.00", color:G.steel },
                { label:"Variance",              val:"GHS 0.00", color:G.green },
              ].map(r => (
                <div key={r.label} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${G.border}` }}>
                  <span style={{ fontFamily:FB,fontSize:13,color:G.mist }}>{r.label}</span>
                  <span style={{ fontFamily:r.label==="Variance"?FM:FD,fontWeight:r.label.includes("Subtotal")?700:500,fontSize:13,color:r.color }}>{r.val}</span>
                </div>
              ))}
              <div style={{ display:"flex",justifyContent:"space-between",paddingTop:12 }}>
                <span style={{ fontFamily:FD,fontWeight:700,fontSize:16,color:G.slate }}>RECEIPT TOTAL</span>
                <span style={{ fontFamily:FD,fontWeight:800,fontSize:20,color:G.green }}>GHS 200.00</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding:"16px 28px",borderTop:`1px solid ${G.border}`,display:"flex",gap:10 }}>
            <button className="btn btn-green btn-sm"><Download size={14} /> Download PDF</button>
            <button className="btn btn-ghost btn-sm"><Share2 size={14} /> Share receipt</button>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft:"auto" }}><HelpCircle size={14} /> Dispute materials</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================================================================
   PAGE 4 - DISPUTE FLOW
================================================================== */
const DisputePage = () => {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    { id:"incomplete", icon:<Wrench size={22} />, label:"Job not completed properly", desc:"Work was done but doesn't meet the agreed standard" },
    { id:"noshow",     icon:<DoorOpen size={22} />, label:"Tasker didn't show up", desc:"Tasker accepted the job but never arrived" },
    { id:"materials",  icon:<FileText size={22} />, label:"Wrong materials purchased", desc:"Materials bought don't match what was quoted" },
    { id:"overcharge", icon:<DollarSign size={22} />, label:"Overcharged from quote", desc:"Final cost exceeded the approved quote" },
    { id:"damage",     icon:<Home size={22} />, label:"Property damage caused", desc:"Tasker caused damage during the job" },
    { id:"other",      icon:<HelpCircle size={22} />, label:"Other issue", desc:"Something else went wrong" },
  ];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ minHeight:"100vh",background:G.cloud,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div className="scale-in" style={{ background:G.white,borderRadius:24,padding:48,maxWidth:480,width:"100%",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,0.1)" }}>
        <div style={{ width:80,height:80,borderRadius:"50%",background:G.greenPale,display:"flex",alignItems:"center",justifyContent:"center",color: G.green, margin:"0 auto 20px" }} className="bounce"><CheckCircle size={40} /></div>
        <h2 style={{ fontFamily:FD,fontWeight:800,fontSize:24,color:G.slate,marginBottom:8 }}>Dispute Submitted</h2>
        <p style={{ fontFamily:FB,fontSize:14,color:G.steel,lineHeight:1.75,marginBottom:8 }}>Your dispute <strong style={{color:G.blue,fontFamily:FM}}>DIS-442</strong> has been raised against booking BK-7841.</p>
        <p style={{ fontFamily:FB,fontSize:13,color:G.mist,lineHeight:1.7,marginBottom:28 }}>Our team will review your evidence and contact both you and the Tasker within <strong style={{color:G.slate}}>4 hours</strong>. Payment of GHS 355 has been frozen until resolved.</p>
        <div style={{ background:G.greenPale,borderRadius:14,padding:"14px 18px",marginBottom:24,border:`1px solid ${G.green}22` }}>
          <p style={{ fontFamily:FB,fontSize:13,color:G.green,lineHeight:1.6 }}>Our Happiness Guarantee ensures you'll receive either a free redo or a full refund.</p>
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <button className="btn btn-ghost btn-md" style={{ flex:1 }} onClick={()=>{setSubmitted(false);setStep(1);setReason("");setDetails("");setPhotos(0);}}>Back</button>
          <button className="btn btn-green btn-md" style={{ flex:2 }}>Track dispute status <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:G.cloud,padding:"32px 40px" }}>
      <div style={{ maxWidth:680,margin:"0 auto" }}>
        {/* Header */}
        <div className="page-enter" style={{ marginBottom:24 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:6 }}>
            <div style={{ width:40,height:40,borderRadius:12,background:G.redPale,display:"flex",alignItems:"center",justifyContent:"center", color: G.red }}><AlertTriangle size={20} /></div>
            <h1 style={{ fontFamily:FD,fontWeight:800,fontSize:26,color:G.slate }}>Raise a Dispute</h1>
          </div>
          <p style={{ fontFamily:FB,fontSize:14,color:G.steel }}>Booking BK-7841 - AC Repair - Emmanuel K. - Today</p>
        </div>

        {/* Progress */}
        <div style={{ display:"flex",gap:6,marginBottom:28 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex:1,height:4,borderRadius:2,background:step>=s?G.red:G.border,transition:"background 0.3s" }}/>
          ))}
        </div>

        <div key={step} className="page-enter">
          {step === 1 && (
            <div className="card" style={{ padding:0,overflow:"hidden" }}>
              <div style={{ padding:"20px 24px",borderBottom:`1px solid ${G.border}` }}>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:17,color:G.slate }}>What's the issue?</p>
                <p style={{ fontFamily:FB,fontSize:13,color:G.mist,marginTop:4 }}>Select the reason that best describes your problem</p>
              </div>
              {reasons.map(r => (
                <div key={r.id} onClick={()=>setReason(r.id)} style={{ padding:"16px 24px",display:"flex",gap:14,alignItems:"center",borderBottom:`1px solid ${G.border}`,cursor:"pointer",background:reason===r.id?G.redPale:"transparent",transition:"background 0.15s" }}>
                  <div style={{ width:44,height:44,borderRadius:12,background:reason===r.id?G.red+"20":G.cloud,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{r.icon}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:FB,fontWeight:600,fontSize:14,color:reason===r.id?G.red:G.slate }}>{r.label}</p>
                    <p style={{ fontFamily:FB,fontSize:12,color:G.mist,marginTop:2 }}>{r.desc}</p>
                  </div>
                  <div style={{ width:20,height:20,borderRadius:"50%",border:`2px solid ${reason===r.id?G.red:G.border}`,background:reason===r.id?G.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s" }}>
                    {reason===r.id && <div style={{ width:8,height:8,borderRadius:"50%",background:G.white }}/>}
                  </div>
                </div>
              ))}
              <div style={{ padding:20 }}>
                <button className="btn btn-red btn-md" style={{ width:"100%" }} disabled={!reason} onClick={()=>setStep(2)}>Continue <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
              <div className="card" style={{ padding:24 }}>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:17,color:G.slate,marginBottom:6 }}>Describe what happened</p>
                <p style={{ fontFamily:FB,fontSize:13,color:G.mist,marginBottom:16 }}>Be as specific as possible - this helps our team resolve the dispute fairly and quickly.</p>
                <textarea className="input" rows={5} placeholder="e.g. The AC technician said the unit was fixed but it's still blowing warm air. I've tested it multiple times and the temperature hasn't changed..." value={details} onChange={e=>setDetails(e.target.value)} style={{ marginBottom:0 }}/>
                <p style={{ fontFamily:FM,fontSize:10,color:G.mist,marginTop:6,textAlign:"right" }}>{details.length}/500</p>
              </div>

              <div className="card" style={{ padding:24 }}>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:16,color:G.slate,marginBottom:6 }}>Upload evidence (optional)</p>
                <p style={{ fontFamily:FB,fontSize:13,color:G.mist,marginBottom:16 }}>Photos, videos, or screenshots strengthen your case significantly.</p>
                <div style={{ display:"flex",gap:12,marginBottom:14 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} onClick={()=>setPhotos(Math.max(photos,i+1))} style={{ width:80,height:80,borderRadius:14,background:i<photos?G.greenPale:G.cloud,border:`2px ${i<photos?"solid":"dashed"} ${i<photos?G.green:G.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s" }}>
                      {i < photos ? <><CheckCircle size={24} color={G.green} /><p style={{ fontFamily:FM,fontSize:9,color:G.green,marginTop:3 }}>Added</p></> : <><Camera size={20} color={G.mist} /><p style={{ fontFamily:FM,fontSize:9,color:G.mist,marginTop:3 }}>Photo</p></>}
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily:FB,fontSize:12,color:G.mist }}>Accepted: JPG, PNG, MP4. Max 10MB per file.</p>
              </div>

              <div style={{ display:"flex",gap:10 }}>
                <button className="btn btn-ghost btn-md" style={{ flex:1 }} onClick={()=>setStep(1)}>Back</button>
                <button className="btn btn-red btn-md" style={{ flex:2 }} disabled={details.length < 20} onClick={()=>setStep(3)}>Review dispute <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
              <div className="card" style={{ padding:24 }}>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:17,color:G.slate,marginBottom:16 }}>Review your dispute</p>
                {[
                  { label:"Booking",    val:"BK-7841 - AC Repair - Emmanuel K." },
                  { label:"Issue",      val:reasons.find(r=>r.id===reason)?.label || "-" },
                  { label:"Evidence",   val:`${photos} photo${photos===1?"":"s"} attached` },
                  { label:"Amount",     val:"GHS 355 (frozen in escrow)" },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${G.border}` }}>
                    <span style={{ fontFamily:FB,fontSize:13,color:G.mist }}>{r.label}</span>
                    <span style={{ fontFamily:FB,fontWeight:600,fontSize:13,color:G.slate }}>{r.val}</span>
                  </div>
                ))}
                <div style={{ marginTop:14,background:G.cloud,borderRadius:12,padding:"12px 14px" }}>
                  <p style={{ fontFamily:FB,fontSize:12,color:G.steel,lineHeight:1.65,fontStyle:"italic" }}>"{details.slice(0,120)}{details.length>120?"...":""}"</p>
                </div>
              </div>
              <div style={{ background:G.redPale,borderRadius:14,padding:"14px 18px",border:`1px solid ${G.red}22` }}>
                <p style={{ fontFamily:FB,fontSize:12,color:G.steel,lineHeight:1.65 }}>By submitting, you confirm this dispute is genuine. False disputes may affect your account standing. Payment of GHS 355 will be frozen until resolved.</p>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <button className="btn btn-ghost btn-md" style={{ flex:1 }} onClick={()=>setStep(2)}>Edit</button>
                <button className="btn btn-red btn-md" style={{ flex:2 }} onClick={handleSubmit}>Submit Dispute</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==================================================================
   PAGE 5 - REFERRAL & REWARDS
================================================================== */
const ReferralPage = () => {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("referral");

  const copyCode = () => { setCopied(true); setTimeout(()=>setCopied(false), 2500); };

  const friends = [
    { name:"Ama K.", status:"Signed up", reward:"GHS 20 pending", date:"2 days ago", done:false },
    { name:"Kofi B.", status:"First booking done", reward:"GHS 20 earned", date:"1 week ago", done:true },
    { name:"Efua M.", status:"First booking done", reward:"GHS 20 earned", date:"2 weeks ago", done:true },
  ];

  const badges = [
    { icon:<Star size={20} />, name:"First Referral", desc:"Refer your first friend", done:true },
    { icon:<Zap size={20} />, name:"3 Referrals",    desc:"Refer 3 friends who book", done:true },
    { icon:<CheckCircle size={20} />, name:"5 Referrals",    desc:"Refer 5 friends who book", done:false },
    { icon:<ShieldCheck size={20} />, name:"10 Referrals",   desc:"Super referrer", done:false },
  ];

  return (
    <div style={{ minHeight:"100vh",background:G.cloud }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(160deg,#1a0a4a,#3B21AC,${G.purple})`, padding:"44px 40px 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ position:"absolute",bottom:0,left:80,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ maxWidth:900,margin:"0 auto",position:"relative" }}>
          <div className="page-enter" style={{ display:"flex",gap:24,alignItems:"flex-end",paddingBottom:24 }}>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.55)",marginBottom:8,letterSpacing:"0.12em",textTransform:"uppercase" }}>Referral Programme</p>
              <h1 style={{ fontFamily:FD,fontWeight:800,fontSize:36,color:G.white,marginBottom:10,lineHeight:1.15 }}>Share TaskGH.<br/><span style={{color:G.gold}}>Earn GHS 20.</span></h1>
              <p style={{ fontFamily:FB,fontSize:15,color:"rgba(255,255,255,0.75)",lineHeight:1.7,maxWidth:480 }}>For every friend you refer who completes their first booking, you both get GHS 20 off your next job. No limit.</p>
            </div>
            <div style={{ textAlign:"right",flexShrink:0 }}>
              <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.55)",marginBottom:4 }}>YOUR EARNINGS SO FAR</p>
              <p style={{ fontFamily:FD,fontWeight:800,fontSize:48,color:G.gold,lineHeight:1 }}>GHS 40</p>
              <p style={{ fontFamily:FB,fontSize:13,color:"rgba(255,255,255,0.55)" }}>from 2 successful referrals</p>
            </div>
          </div>
          <div style={{ display:"flex",gap:0 }}>
            {["referral","activity","leaderboard"].map(t => (
              <button key={t} onClick={()=>setTab(t)} style={{ padding:"12px 24px",background:"none",border:"none",cursor:"pointer",fontFamily:FB,fontWeight:tab===t?700:500,fontSize:14,color:tab===t?G.white:"rgba(255,255,255,0.45)",borderBottom:`2.5px solid ${tab===t?G.gold:"transparent"}`,transition:"all 0.2s",textTransform:"capitalize" }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:"0 auto",padding:"28px 40px" }}>
        {tab === "referral" && (
          <div className="page-enter" style={{ display:"grid",gridTemplateColumns:"1fr 360px",gap:24 }}>
            <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
              {/* Referral code */}
              <div style={{ background:G.white,borderRadius:20,padding:28,border:`1.5px solid ${G.border}`,boxShadow:"0 2px 14px rgba(0,0,0,0.06)" }}>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:17,color:G.slate,marginBottom:6 }}>Your referral code</p>
                <p style={{ fontFamily:FB,fontSize:13,color:G.mist,marginBottom:20 }}>Share this code or link with friends. When they use it on their first booking, you both earn GHS 20.</p>
                <div style={{ display:"flex",gap:10,alignItems:"center",background:G.purplePale,borderRadius:14,padding:"14px 18px",border:`1.5px solid ${G.purple}33`,marginBottom:16 }}>
                  <p style={{ fontFamily:FM,fontWeight:600,fontSize:22,color:G.purple,flex:1,letterSpacing:"0.08em" }}>SANDRA20</p>
                  <button className="btn btn-sm" onClick={copyCode} style={{ background:copied?G.green:G.purple,color:G.white,borderRadius:10 }}>{copied?<><Check size={14} /> Copied!</>:"Copy code"}</button>
                </div>
                <div style={{ display:"flex",gap:10 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex:1 }}><MessageSquare size={14} /> Share on WhatsApp</button>
                  <button className="btn btn-ghost btn-sm" style={{ flex:1 }}><Share2 size={14} /> Copy link</button>
                  <button className="btn btn-ghost btn-sm" style={{ flex:1 }}><Smartphone size={14} /> Share via SMS</button>
                </div>
              </div>

              {/* How it works */}
              <div style={{ background:G.white,borderRadius:20,padding:24,border:`1.5px solid ${G.border}` }}>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:16,color:G.slate,marginBottom:18 }}>How it works</p>
                <div style={{ display:"flex",gap:0 }}>
                  {[
                    { n:"1", icon:<Share2 size={18} />, title:"Share your code", desc:"Send SANDRA20 to a friend" },
                    { n:"2", icon:<Smartphone size={18} />, title:"They sign up", desc:"Friend joins TaskGH" },
                    { n:"3", icon:<Wrench size={18} />, title:"They book", desc:"Friend completes first job" },
                    { n:"4", icon:<Banknote size={18} />, title:"You both earn", desc:"GHS 20 each, instantly" },
                  ].map((s,i,arr) => (
                    <div key={s.n} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",position:"relative" }}>
                      {i < arr.length-1 && <div style={{ position:"absolute",top:20,left:"50%",width:"100%",height:2,background:`linear-gradient(to right,${G.purple},${G.purple}44)` }}/>}
                      <div style={{ width:40,height:40,borderRadius:"50%",background:G.purplePale,border:`2px solid ${G.purple}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,zIndex:1,marginBottom:8 }}>{s.icon}</div>
                      <p style={{ fontFamily:FB,fontWeight:600,fontSize:13,color:G.slate,marginBottom:2 }}>{s.title}</p>
                      <p style={{ fontFamily:FB,fontSize:11,color:G.mist }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Friends list */}
              <div style={{ background:G.white,borderRadius:20,border:`1.5px solid ${G.border}`,overflow:"hidden" }}>
                <div style={{ padding:"18px 22px",borderBottom:`1px solid ${G.border}`,display:"flex",justifyContent:"space-between" }}>
                  <p style={{ fontFamily:FD,fontWeight:700,fontSize:16,color:G.slate }}>Your referrals</p>
                  <Badge color={G.green}>{friends.filter(f=>f.done).length} completed</Badge>
                </div>
                {friends.map((f,i) => (
                  <div key={i} style={{ padding:"16px 22px",borderBottom:i<friends.length-1?`1px solid ${G.border}`:"none",display:"flex",gap:14,alignItems:"center" }}>
                    <div style={{ width:40,height:40,borderRadius:12,background:G.purplePale,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FD,fontWeight:700,fontSize:13,color:G.purple }}>
                      {f.name.split(" ").map(w=>w[0]).join("")}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:FB,fontWeight:600,fontSize:14,color:G.slate }}>{f.name}</p>
                      <p style={{ fontFamily:FB,fontSize:12,color:G.mist }}>{f.status} - {f.date}</p>
                    </div>
                    <Badge color={f.done?G.green:G.gold}>{f.reward}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar */}
            <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
              <div style={{ background:`linear-gradient(135deg,${G.purple},#7C3AED)`,borderRadius:20,padding:22,color:G.white }}>
                <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:4,letterSpacing:"0.1em" }}>AVAILABLE BALANCE</p>
                <p style={{ fontFamily:FD,fontWeight:800,fontSize:36,marginBottom:4 }}>GHS 40</p>
                <p style={{ fontFamily:FB,fontSize:13,color:"rgba(255,255,255,0.7)",marginBottom:18 }}>Applied automatically to your next booking</p>
                <div style={{ display:"flex",gap:3,background:"rgba(255,255,255,0.1)",padding:3,borderRadius:10 }}>
                  <div style={{ flex:1,background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"8px",textAlign:"center" }}><p style={{ fontFamily:FM,fontSize:10,color:"rgba(255,255,255,0.8)" }}>Pending</p><p style={{ fontFamily:FD,fontWeight:700,fontSize:16 }}>GHS 20</p></div>
                  <div style={{ flex:1,background:"transparent",borderRadius:8,padding:"8px",textAlign:"center" }}><p style={{ fontFamily:FM,fontSize:10,color:"rgba(255,255,255,0.6)" }}>Total earned</p><p style={{ fontFamily:FD,fontWeight:700,fontSize:16 }}>GHS 40</p></div>
                </div>
              </div>

              <div style={{ background:G.white,borderRadius:20,padding:20,border:`1.5px solid ${G.border}` }}>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:15,color:G.slate,marginBottom:14 }}>Achievement badges</p>
                {badges.map((b,i) => (
                  <div key={i} style={{ display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:i<badges.length-1?`1px solid ${G.border}`:"none",opacity:b.done?1:0.5 }}>
                    <div style={{ width:40,height:40,borderRadius:12,background:b.done?G.purplePale:G.cloud,display:"flex",alignItems:"center",justifyContent:"center",color: b.done ? G.purple : G.mist }}>{b.icon}</div>
                    <div style={{ flex:1 }}><p style={{ fontFamily:FB,fontWeight:600,fontSize:13,color:G.slate }}>{b.name}</p><p style={{ fontFamily:FB,fontSize:11,color:G.mist }}>{b.desc}</p></div>
                    {b.done && <Check size={16} color={G.green} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "activity" && (
          <div className="page-enter" style={{ background:G.white,borderRadius:20,border:`1.5px solid ${G.border}`,overflow:"hidden" }}>
            <div style={{ padding:"18px 24px",borderBottom:`1px solid ${G.border}` }}><p style={{ fontFamily:FD,fontWeight:700,fontSize:16,color:G.slate }}>Reward History</p></div>
            {[
              { type:"earned", icon:<Banknote size={20} />, msg:"GHS 20 earned - Kofi B. completed first booking", date:"1 week ago",     amount:"+GHS 20", color:G.green },
              { type:"used",   icon:<Gift size={20} />, msg:"GHS 20 applied to booking BK-7801",                date:"10 days ago",    amount:"-GHS 20", color:G.mist },
              { type:"earned", icon:<Banknote size={20} />, msg:"GHS 20 earned - Efua M. completed first booking", date:"2 weeks ago",    amount:"+GHS 20", color:G.green },
              { type:"pending",icon:<Clock size={20} />, msg:"GHS 20 pending - Ama K. signed up (awaiting booking)", date:"2 days ago", amount:"Pending", color:G.gold },
            ].map((a,i) => (
              <div key={i} style={{ padding:"16px 24px",borderBottom:`1px solid ${G.border}`,display:"flex",gap:14,alignItems:"center" }}>
                <div style={{ width:42,height:42,borderRadius:12,background:a.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:FB,fontSize:14,color:G.slate }}>{a.msg}</p>
                  <p style={{ fontFamily:FM,fontSize:11,color:G.mist,marginTop:2 }}>{a.date}</p>
                </div>
                <p style={{ fontFamily:FD,fontWeight:800,fontSize:15,color:a.color }}>{a.amount}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "leaderboard" && (
          <div className="page-enter" style={{ background:G.white,borderRadius:20,border:`1.5px solid ${G.border}`,overflow:"hidden" }}>
            <div style={{ padding:"18px 24px",borderBottom:`1px solid ${G.border}`,display:"flex",justifyContent:"space-between" }}>
              <p style={{ fontFamily:FD,fontWeight:700,fontSize:16,color:G.slate }}>Top Referrers - April 2026</p>
              <Badge color={G.purple}>Live rankings</Badge>
            </div>
            {[
              { rank:1, name:"Kwame A.",   refs:14, earned:"GHS 280", you:false },
              { rank:2, name:"Ama S.",     refs:11, earned:"GHS 220", you:false },
              { rank:3, name:"Nana B.",    refs:8,  earned:"GHS 160", you:false },
              { rank:4, name:"Sandra A.", refs:2,  earned:"GHS 40",  you:true  },
              { rank:5, name:"Joe K.",     refs:1,  earned:"GHS 20",  you:false },
            ].map((p,i) => (
              <div key={i} style={{ padding:"16px 24px",borderBottom:`1px solid ${G.border}`,display:"flex",gap:14,alignItems:"center",background:p.you?G.purplePale:"transparent" }}>
                <div style={{ width:32,height:32,borderRadius:10,background:p.rank<=3?[G.gold,"#C0C0C0","#CD7F32"][p.rank-1]:G.cloud,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FD,fontWeight:700,fontSize:14,color:p.rank<=3?G.white:G.mist }}>{p.rank}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                    <p style={{ fontFamily:FB,fontWeight:600,fontSize:14,color:G.slate }}>{p.name}</p>
                    {p.you && <Badge color={G.purple}>You</Badge>}
                  </div>
                  <p style={{ fontFamily:FB,fontSize:12,color:G.mist,marginTop:1 }}>{p.refs} referrals</p>
                </div>
                <p style={{ fontFamily:FD,fontWeight:800,fontSize:15,color:p.you?G.purple:G.green }}>{p.earned}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ==================================================================
   PAGE 6 - TASKER EARNINGS DEEP-DIVE
================================================================== */
const EarningsPage = () => {
  const [period, setPeriod] = useState("week");
  const [commission, setCommission] = useState(12);

  const weekData = [180,0,355,240,120,480,312];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const maxW = Math.max(...weekData);

  const jobs = [
    { id:"BK-7841", service:"AC Repair",    customer:"Sandra A.", date:"Today",    gross:"GHS 355", commission:"GHS 42.60", net:"GHS 312.40", status:"paid",    momoRef:"MTN-441982" },
    { id:"BK-7823", service:"Electrical",   customer:"Kofi B.",   date:"Yesterday",gross:"GHS 200", commission:"GHS 24.00", net:"GHS 176.00", status:"paid",    momoRef:"MTN-441810" },
    { id:"BK-7810", service:"AC Servicing", customer:"Ama S.",    date:"Mon",      gross:"GHS 120", commission:"GHS 14.40", net:"GHS 105.60", status:"paid",    momoRef:"MTN-441702" },
    { id:"BK-7795", service:"Generator",    customer:"Nana K.",   date:"Sat",      gross:"GHS 280", commission:"GHS 33.60", net:"GHS 246.40", status:"paid",    momoRef:"MTN-441601" },
    { id:"BK-7781", service:"AC Install",   customer:"Joe A.",    date:"Thu",      gross:"GHS 450", commission:"GHS 54.00", net:"GHS 396.00", status:"held",    momoRef:"-" },
  ];

  return (
    <div style={{ minHeight:"100vh",background:G.cloud }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(160deg,#1A1500,#2A2000,#111118)`, padding:"32px 40px 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"rgba(232,160,32,0.1)" }}/>
        <div style={{ maxWidth:1100,margin:"0 auto",position:"relative" }}>
          <div className="page-enter" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingBottom:24 }}>
            <div>
              <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:6,letterSpacing:"0.12em",textTransform:"uppercase" }}>Earnings Dashboard</p>
              <h1 style={{ fontFamily:FD,fontWeight:800,fontSize:32,color:G.white,marginBottom:4 }}>Emmanuel K.</h1>
              <p style={{ fontFamily:FB,fontSize:14,color:"rgba(255,255,255,0.55)" }}>AC Technician - Elite Tasker - East Legon</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:4 }}>THIS WEEK NET</p>
              <p style={{ fontFamily:FD,fontWeight:800,fontSize:44,color:G.gold,lineHeight:1 }}>GHS 1,236</p>
              <p style={{ fontFamily:FB,fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:4 }}>after 12% commission</p>
            </div>
          </div>

          {/* Summary tiles */}
          <div style={{ display:"flex",gap:14,paddingBottom:24 }}>
            {[
              { label:"Total gross",     val:"GHS 1,405", color:G.white },
              { label:"Commission (12%)",val:"GHS 168.60",  color:"rgba(255,255,255,0.55)" },
              { label:"Jobs this week",  val:"5",           color:G.white },
              { label:"Avg per job",     val:"GHS 247",     color:G.white },
              { label:"Acceptance rate", val:"96%",         color:G.gold },
            ].map((s,i) => (
              <div key={i} style={{ flex:1,background:"rgba(255,255,255,0.07)",borderRadius:14,padding:"14px 16px",border:"1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ fontFamily:FM,fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:4 }}>{s.label.toUpperCase()}</p>
                <p style={{ fontFamily:FD,fontWeight:800,fontSize:18,color:s.color }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"28px 40px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",gap:20 }}>
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            {/* Bar chart */}
            <div style={{ background:G.white,borderRadius:20,padding:24,border:`1.5px solid ${G.border}`,boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:16,color:G.slate }}>Daily Earnings (GHS)</p>
                <div style={{ display:"flex",gap:6 }}>
                  {["week","month"].map(p => (
                    <button key={p} onClick={()=>setPeriod(p)} style={{ padding:"6px 14px",borderRadius:8,border:`1px solid ${period===p?G.gold:G.border}`,background:period===p?G.goldPale:"transparent",color:period===p?G.gold:G.mist,fontFamily:FB,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",textTransform:"capitalize" }}>{p}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex",gap:8,alignItems:"flex-end",height:120,marginBottom:8 }}>
                {weekData.map((v,i) => (
                  <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%",justifyContent:"flex-end" }}>
                    <p style={{ fontFamily:FM,fontSize:10,color:i===6?G.gold:G.mist,whiteSpace:"nowrap" }}>{v>0?v:""}</p>
                    <div style={{ width:"100%",borderRadius:"4px 4px 0 0",background:i===6?G.gold:v>0?G.green+"70":G.cloud,height:`${(v/maxW)*90}px`,minHeight:v>0?4:0,transition:"height 0.6s ease" }}/>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:8 }}>
                {days.map((d,i) => <div key={i} style={{ flex:1,textAlign:"center" }}><p style={{ fontFamily:FM,fontSize:10,color:i===6?G.gold:G.mist }}>{d}</p></div>)}
              </div>
            </div>

            {/* Job-by-job table */}
            <div style={{ background:G.white,borderRadius:20,border:`1.5px solid ${G.border}`,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ padding:"18px 22px",borderBottom:`1px solid ${G.border}`,display:"flex",justifyContent:"space-between" }}>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:16,color:G.slate }}>Job breakdown</p>
                <Badge color={G.green}>{jobs.filter(j=>j.status==="paid").length} paid</Badge>
              </div>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${G.border}` }}>
                    {["Job","Service","Date","Gross","Commission","Net","Status","MoMo ref"].map(h => (
                      <th key={h} style={{ padding:"10px 14px",fontFamily:FB,fontSize:11,color:G.mist,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",textAlign:"left",whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j,i) => (
                    <tr key={i} style={{ borderBottom:`1px solid ${G.border}`,transition:"background 0.15s",cursor:"pointer" }}>
                      <td style={{ padding:"13px 14px" }}><span style={{ fontFamily:FM,fontSize:11,color:G.blue }}>{j.id}</span></td>
                      <td style={{ padding:"13px 14px",fontFamily:FB,fontSize:13,color:G.slate }}>{j.service}</td>
                      <td style={{ padding:"13px 14px",fontFamily:FM,fontSize:12,color:G.mist }}>{j.date}</td>
                      <td style={{ padding:"13px 14px",fontFamily:FD,fontWeight:600,fontSize:13,color:G.slate }}>{j.gross}</td>
                      <td style={{ padding:"13px 14px",fontFamily:FM,fontSize:12,color:G.red }}>{j.commission}</td>
                      <td style={{ padding:"13px 14px",fontFamily:FD,fontWeight:700,fontSize:13,color:G.green }}>{j.net}</td>
                      <td style={{ padding:"13px 14px" }}><Badge color={j.status==="paid"?G.green:G.gold}>{j.status}</Badge></td>
                      <td style={{ padding:"13px 14px",fontFamily:FM,fontSize:11,color:j.momoRef==="-"?G.mist:G.greenL }}>{j.momoRef}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding:"14px 22px",borderTop:`1px solid ${G.border}`,display:"flex",justifyContent:"flex-end",gap:32,background:G.cloud }}>
                {[["Gross total","GHS 1,405",G.slate],["Commission","GHS 168.60",G.red],["Net total","GHS 1,236.40",G.green]].map(([l,v,c]) => (
                  <div key={l} style={{ textAlign:"right" }}>
                    <p style={{ fontFamily:FM,fontSize:10,color:G.mist }}>{l.toUpperCase()}</p>
                    <p style={{ fontFamily:FD,fontWeight:800,fontSize:16,color:c }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            {/* Commission calculator */}
            <div style={{ background:G.white,borderRadius:20,padding:22,border:`1.5px solid ${G.border}`,boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily:FD,fontWeight:700,fontSize:15,color:G.slate,marginBottom:16 }}>Commission Calculator</p>
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                  <p style={{ fontFamily:FB,fontSize:13,color:G.steel }}>Job value</p>
                  <p style={{ fontFamily:FD,fontWeight:700,fontSize:14,color:G.slate }}>GHS {commission*10}</p>
                </div>
                <input type="range" min={1} max={50} value={commission} onChange={e=>setCommission(Number(e.target.value))} style={{ width:"100%",accentColor:G.gold,marginBottom:4 }}/>
              </div>
              <div style={{ background:G.cloud,borderRadius:12,padding:14 }}>
                {[
                  { label:"Job value",      val:`GHS ${commission*10}`, color:G.slate },
                  { label:"Platform (12%)", val:`GHS ${(commission*10*0.12).toFixed(2)}`, color:G.red },
                  { label:"You receive",    val:`GHS ${(commission*10*0.88).toFixed(2)}`, color:G.green },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${G.border}` }}>
                    <span style={{ fontFamily:FB,fontSize:13,color:G.mist }}>{r.label}</span>
                    <span style={{ fontFamily:FD,fontWeight:700,fontSize:14,color:r.color }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MoMo payout history */}
            <div style={{ background:G.white,borderRadius:20,padding:20,border:`1.5px solid ${G.border}` }}>
              <p style={{ fontFamily:FD,fontWeight:700,fontSize:15,color:G.slate,marginBottom:14 }}>MoMo Payouts</p>
              {[
                { amount:"GHS 312.40", ref:"MTN-441982", date:"Today 14:32" },
                { amount:"GHS 176.00", ref:"MTN-441810", date:"Yesterday 11:15" },
                { amount:"GHS 105.60", ref:"MTN-441702", date:"Mon 09:44" },
                { amount:"GHS 246.40", ref:"MTN-441601", date:"Sat 13:40" },
              ].map((p,i) => (
                <div key={i} style={{ display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${G.border}` }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:G.greenPale,display:"flex",alignItems:"center",justifyContent:"center",color: G.green, flexShrink:0 }}><Banknote size={18} /></div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:FD,fontWeight:700,fontSize:14,color:G.green }}>{p.amount}</p>
                    <p style={{ fontFamily:FM,fontSize:10,color:G.mist }}>{p.ref} - {p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================================================================
   PAGE 7 - MOBILE APP SHELL
================================================================== */
const MobileShellPage = () => {
  const [screen, setScreen] = useState("splash");
  const [activeNav, setActiveNav] = useState("home");

  const StatusBar = ({ light=false }) => (
    <div className="status-bar" style={{ background:"inherit" }}>
      <span style={{ fontFamily:FB,fontWeight:700,fontSize:15,color:light?G.white:G.slate }}>9:41</span>
      <div style={{ display:"flex",gap:4,alignItems:"center" }}>
        <div style={{ display:"flex",gap:2,alignItems:"flex-end",height:12 }}>
          {[4,7,10,12].map((h,i)=><div key={i} style={{ width:3,height:h,borderRadius:1.5,background:light?G.white:i<3?G.slate:G.mist }}/>)}
        </div>
        <div style={{ width:14,height:10,borderRadius:2,border:`1.5px solid ${light?G.white:G.slate}`,position:"relative" }}>
          <div style={{ position:"absolute",inset:1,right:3,background:light?G.white:G.slate,borderRadius:1 }}/>
        </div>
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className="bottom-nav-bar" style={{ background:screen==="home"?G.white:"#111118" }}>
      {[
        { id:"home",    icon:<Home size={18} />, label:"Home" },
        { id:"jobs",    icon:<ClipboardList size={18} />, label:"My Jobs" },
        { id:"chat",    icon:<MessageSquare size={18} />, label:"Chat" },
        { id:"profile", icon:<User size={18} />, label:"Profile" },
      ].map(t => (
        <div key={t.id} onClick={()=>setActiveNav(t.id)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer" }}>
          <div style={{ width:44,height:28,borderRadius:10,background:activeNav===t.id?(screen==="home"?G.greenPale:"rgba(232,160,32,0.2)"):"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:activeNav===t.id?(screen==="home"?G.green:G.gold):(screen==="home"?G.mist:"rgba(255,255,255,0.4)") }}>{t.icon}</div>
          <span style={{ fontFamily:FB,fontSize:10,fontWeight:activeNav===t.id?700:400,color:activeNav===t.id?(screen==="home"?G.green:G.gold):(screen==="home"?G.mist:"rgba(255,255,255,0.4)") }}>{t.label}</span>
        </div>
      ))}
    </div>
  );

  const SplashScreen = () => (
    <div style={{ flex:1,background:`linear-gradient(160deg,${G.greenD},${G.green})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.07)" }}/>
      <div style={{ position:"absolute",bottom:-40,left:-40,width:160,height:160,borderRadius:"50%",background:G.gold+"15" }}/>
      <div className="float" style={{ marginBottom:28 }}>
        <svg width={80} height={80} viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="11" fill="rgba(255,255,255,0.2)"/>
          <path d="M13 27L21 19" stroke={G.gold} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="24" cy="16" r="5" stroke="white" strokeWidth="2.2" fill="none"/>
          <path d="M20 20L14.5 25.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M21 15.5L23 17.5L27 13.5" stroke={G.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p style={{ fontFamily:FD,fontWeight:800,fontSize:34,color:G.white,marginBottom:8 }}>Task<span style={{color:G.gold}}>GH</span></p>
      <p style={{ fontFamily:FB,fontSize:14,color:"rgba(255,255,255,0.65)" }}>Trusted Home Services</p>
      <div style={{ position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:12 }}>
        <div style={{ width:24,height:24,border:"3px solid rgba(255,255,255,0.3)",borderTopColor:G.white,borderRadius:"50%",animation:"spin 0.9s linear infinite" }}/>
        <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.4)" }}>Loading...</p>
      </div>
      <button className="btn btn-white btn-sm" style={{ position:"absolute",bottom:100, display: "flex", alignItems: "center", gap: 8 }} onClick={()=>setScreen("home")}>Skip to Home <ArrowRight size={14} /></button>
    </div>
  );

  const HomeScreen = () => (
    <>
      <div style={{ background:G.green,padding:"0 24px 20px",flexShrink:0 }}>
        <StatusBar light/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,marginBottom:18 }}>
          <div>
            <p style={{ fontFamily:FB,fontSize:12,color:"rgba(255,255,255,0.65)",marginBottom:2 }}>Good morning</p>
            <p style={{ fontFamily:FD,fontWeight:800,fontSize:20,color:G.white }}>Sandra Asante</p>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ width:42,height:42,borderRadius:13,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",color: "white" }}><Bell size={20} /></div>
            <div style={{ position:"absolute",top:8,right:8,width:9,height:9,borderRadius:"50%",background:G.red,border:`2px solid ${G.green}` }}/>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.15)",borderRadius:14,padding:"11px 14px",display:"flex",gap:10,alignItems:"center",border:"1px solid rgba(255,255,255,0.2)" }}>
          <Search size={16} color="rgba(255,255,255,0.65)" />
          <span style={{ fontFamily:FB,fontSize:14,color:"rgba(255,255,255,0.65)" }}>Search services...</span>
        </div>
      </div>
      <div className="screen-scroll" style={{ background:G.cloud,flex:1 }}>
        <div style={{ padding:"16px 20px" }}>
          {/* Live booking banner */}
          <div style={{ background:`linear-gradient(135deg,${G.green},${G.greenL})`,borderRadius:16,padding:"14px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"center" }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:G.gold,animation:"pulse 1.5s infinite" }}/>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:FB,fontWeight:600,fontSize:13,color:G.white }}>Emmanuel is working on your AC</p>
              <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.7)" }}>BK-7841 - 47 min elapsed</p>
            </div>
            <button style={{ background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,padding:"7px 12px",fontFamily:FB,fontWeight:600,fontSize:12,color:G.white,cursor:"pointer" }}>Track</button>
          </div>
          {/* Service grid */}
          <p style={{ fontFamily:FD,fontWeight:700,fontSize:15,color:G.slate,marginBottom:12 }}>Popular Services</p>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20 }}>
            {[
              { icon:<Clock size={24} />, n:"AC Repair", p:"GHS 25", hot:true },
              { icon:<Wrench size={24} />, n:"Plumbing", p:"GHS 25", hot:true },
              { icon:<Monitor size={24} />, n:"Cleaning", p:"GHS 120", hot:false },
              { icon:<Home size={24} />, n:"Polytank", p:"GHS 80", hot:false }
            ].map(s => (
              <div key={s.n} style={{ background:G.white,borderRadius:16,padding:"16px 14px",border:`1.5px solid ${G.border}`,cursor:"pointer" }}>
                {s.hot && <div style={{ float:"right",background:G.gold,color:G.white,fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:20,fontFamily:FB }}>HOT</div>}
                <div style={{ color: G.green, marginBottom: 8 }}>{s.icon}</div>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:13,color:G.slate,marginTop:8,marginBottom:3 }}>{s.n}</p>
                <p style={{ fontFamily:FD,fontWeight:800,fontSize:14,color:G.green }}>{s.p}</p>
              </div>
            ))}
          </div>
          {/* Trust row */}
          <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:4 }}>
            {[
              { label: "ID-Verified", icon: <ShieldCheck size={12} /> },
              { label: "Escrow", icon: <Lock size={12} /> },
              { label: "4.9 Rating", icon: <Star size={12} /> },
              { label: "Same-day", icon: <Zap size={12} /> }
            ].map(b => (
              <div key={b.label} style={{ background:G.greenPale,borderRadius:8,padding:"6px 12px",whiteSpace:"nowrap",border:`1px solid ${G.green}22`,flexShrink:0, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: G.green }}>{b.icon}</span>
                <p style={{ fontFamily:FB,fontSize:11,color:G.green,fontWeight:600 }}>{b.label}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </>
  );

  const screens = ["splash","home","tasker","jobs"];

  return (
    <div style={{ minHeight:"100vh",background:`linear-gradient(135deg,${G.ink} 0%,#10101E 50%,#161628 100%)`,padding:"40px",display:"flex",flexDirection:"column",alignItems:"center",gap:24 }}>
      <div>
        <h1 style={{ fontFamily:FD,fontWeight:800,fontSize:28,color:G.white,textAlign:"center",marginBottom:6 }}>Mobile App Shell</h1>
        <p style={{ fontFamily:FB,fontSize:14,color:"rgba(255,255,255,0.5)",textAlign:"center" }}>Production-ready iPhone frame with safe areas, status bar, and bottom nav</p>
      </div>

      {/* Screen selector */}
      <div style={{ display:"flex",gap:6,background:"rgba(255,255,255,0.07)",padding:4,borderRadius:12,border:"1px solid rgba(255,255,255,0.1)" }}>
        {screens.map(s => (
          <button key={s} onClick={()=>setScreen(s)} style={{ padding:"8px 18px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:FB,fontWeight:screen===s?600:400,fontSize:13,background:screen===s?"rgba(255,255,255,0.15)":"transparent",color:screen===s?G.white:"rgba(255,255,255,0.45)",transition:"all 0.15s",textTransform:"capitalize" }}>{s}</button>
        ))}
      </div>

      {/* Phone */}
      <div className="phone-shell float" style={{ background:screen==="splash"?G.green:screen==="tasker"?"#111118":G.white }}>
        {screen === "splash" && <SplashScreen/>}
        {screen === "home" && <>
          <HomeScreen/>
          <BottomNav/>
        </>}
        {screen === "tasker" && (
          <>
            <div style={{ background:"#111118",flex:1,display:"flex",flexDirection:"column" }}>
              <div style={{ background:`linear-gradient(160deg,#1A1500,#2A1F00,#111118)`,padding:"0 24px 20px",flexShrink:0 }}>
                <StatusBar light/>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginTop:12 }}>
                  <div>
                    <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:3 }}>GOOD MORNING</p>
                    <p style={{ fontFamily:FD,fontWeight:800,fontSize:20,color:G.white }}>Emmanuel K.</p>
                    <div style={{ display:"flex",gap:8,marginTop:6 }}>
                      <Badge color={G.gold}><Star size={10} fill={G.gold} stroke={G.gold} /> Elite</Badge>
                      <Badge color={G.green} dot>Available</Badge>
                    </div>
                  </div>
                  <div style={{ background:G.goldPale,borderRadius:14,padding:"12px 16px",border:`1px solid ${G.gold}33` }}>
                    <p style={{ fontFamily:FM,fontSize:10,color:G.gold }}>TODAY</p>
                    <p style={{ fontFamily:FD,fontWeight:800,fontSize:20,color:G.white }}>GHS 247</p>
                  </div>
                </div>
              </div>
              <div className="screen-scroll" style={{ flex:1,background:"#111118",padding:"16px 20px" }}>
                <div style={{ background:"rgba(232,160,32,0.15)",borderRadius:16,padding:16,marginBottom:16,border:"1px solid rgba(232,160,32,0.3)" }}>
                  <p style={{ fontFamily:FB,fontWeight:700,fontSize:14,color:G.gold,marginBottom:2 }}><Zap size={14} style={{ display: "inline", marginRight: 4 }} /> New job alert!</p>
                  <p style={{ fontFamily:FB,fontSize:12,color:"rgba(255,255,255,0.7)" }}>AC Repair - East Legon - GHS 355 - Today 2PM</p>
                  <div style={{ display:"flex",gap:8,marginTop:10 }}>
                    <button style={{ flex:1,padding:"8px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.6)",fontFamily:FB,fontSize:12,cursor:"pointer" }}>Decline</button>
                    <button style={{ flex:2,padding:"8px",borderRadius:10,border:"none",background:G.gold,color:G.white,fontFamily:FB,fontWeight:700,fontSize:13,cursor:"pointer" }}>Accept <ArrowRight size={14} /></button>
                  </div>
                </div>
                <p style={{ fontFamily:FD,fontWeight:700,fontSize:14,color:G.white,marginBottom:12 }}>Upcoming jobs</p>
                {[
                  { ic: <Clock size={20} />, n: "AC Repair", c: "Sandra A.", t: "Today 2PM", p: "GHS 355" },
                  { ic: <Zap size={20} />, n: "Electrical", c: "Kofi B.", t: "Fri 10AM", p: "GHS 25" }
                ].map(job => (
                  <div key={job.n} style={{ background:"rgba(255,255,255,0.06)",borderRadius:16,padding:16,marginBottom:10,border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer" }}>
                    <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                      <div style={{ width:44,height:44,borderRadius:12,background:"rgba(232,160,32,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color: G.gold, flexShrink:0 }}>{job.ic}</div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontFamily:FD,fontWeight:700,fontSize:14,color:G.white }}>{job.n}</p>
                        <p style={{ fontFamily:FB,fontSize:12,color:"rgba(255,255,255,0.55)" }}>{job.c} - {job.t}</p>
                      </div>
                      <p style={{ fontFamily:FD,fontWeight:800,fontSize:15,color:G.gold }}>{job.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <BottomNav/>
          </>
        )}
        {screen === "jobs" && (
          <>
            <div style={{ flex:1,display:"flex",flexDirection:"column",background:G.white }}>
              <div style={{ background:G.green,padding:"0 24px 20px",flexShrink:0 }}>
                <StatusBar light/>
                <p style={{ fontFamily:FD,fontWeight:800,fontSize:20,color:G.white,marginTop:10 }}>My Jobs</p>
              </div>
              <div className="screen-scroll" style={{ flex:1,padding:"16px 20px",background:G.cloud }}>
                {[
                  { icon:<Clock size={20} />,service:"AC Repair",tasker:"Emmanuel K.",date:"Today",amount:"GHS 355",status:"IN_PROGRESS",color:G.blue },
                  { icon:<Monitor size={20} />,service:"House Cleaning",tasker:"Abena M.",date:"Mon 8 Apr",amount:"GHS 120",status:"PAID",color:G.green },
                  { icon:<Wrench size={20} />,service:"Plumbing",tasker:"Kwabena O.",date:"Thu 4 Apr",amount:"GHS 240",status:"PAID",color:G.green },
                ].map((j,i) => (
                  <div key={i} style={{ background:G.white,borderRadius:16,padding:16,marginBottom:10,border:`1.5px solid ${G.border}`,cursor:"pointer" }}>
                    <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                      <div style={{ width:44,height:44,borderRadius:12,background:G.greenPale,display:"flex",alignItems:"center",justifyContent:"center",color: G.green, flexShrink:0 }}>{j.icon}</div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontFamily:FD,fontWeight:700,fontSize:14,color:G.slate }}>{j.service}</p>
                        <p style={{ fontFamily:FB,fontSize:12,color:G.steel }}>{j.tasker} - {j.date}</p>
                        <div style={{ marginTop:5 }}><Badge color={j.color} dot={j.status==="IN_PROGRESS"}>{j.status.replace("_"," ")}</Badge></div>
                      </div>
                      <p style={{ fontFamily:FD,fontWeight:800,fontSize:15,color:G.green }}>{j.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <BottomNav/>
          </>
        )}
      </div>

      <p style={{ fontFamily:FM,fontSize:11,color:"rgba(255,255,255,0.25)" }}>390x844px - iPhone 14 proportions - Safe areas included</p>
    </div>
  );
};

/* --- ROOT -------------------------------------------------------------------- */
export default function RemainingPages() {
  const [page, setPage] = useState("errors");
  const views = { errors:ErrorsPage, auth:AuthPage, receipt:ReceiptPage, dispute:DisputePage, referral:ReferralPage, earnings:EarningsPage, mobile:MobileShellPage };
  const Page = views[page];
  return (
    <div style={{ fontFamily:FB, minHeight:"100vh" }}>
      <Fonts/>
      {page !== "auth" && page !== "mobile" && <Nav page={page} onChange={setPage}/>}
      {(page === "auth" || page === "mobile") && (
        <div style={{ position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:200,display:"flex",gap:4,background:"rgba(0,0,0,0.6)",padding:4,borderRadius:12,backdropFilter:"blur(10px)" }}>
          {[
            {id:"errors",l:<AlertTriangle size={14} />},
            {id:"auth",l:<ShieldCheck size={14} />},
            {id:"receipt",l:<FileText size={14} />},
            {id:"dispute",l:<Gavel size={14} />},
            {id:"referral",l:<Gift size={14} />},
            {id:"earnings",l:<Banknote size={14} />},
            {id:"mobile",l:<Smartphone size={14} />}
          ].map(t => (
            <button key={t.id} onClick={()=>setPage(t.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:FB,fontSize:12,background:page===t.id?"rgba(255,255,255,0.25)":"transparent",color:page===t.id?G.white:"rgba(255,255,255,0.45)",transition:"all 0.15s" }}>{t.l}</button>
          ))}
        </div>
      )}
      <Page/>
    </div>
  );
}
