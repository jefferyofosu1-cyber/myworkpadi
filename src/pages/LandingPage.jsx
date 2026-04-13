import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { G as ThemeG } from "../constants/theme";

/* --- TOKENS (Synced with Global) --- */
const G = {
  green:     ThemeG.green,
  gold:      ThemeG.gold,
  black:     ThemeG.black,
  offWhite:  ThemeG.offWhite,
  ink:       ThemeG.black,
  slate:     ThemeG.slate,
  steel:     ThemeG.steel,
  mist:      ThemeG.mist,
  cloud:     ThemeG.cloud,
  border:    ThemeG.border,
  white:     ThemeG.white,
  greenPale: ThemeG.greenPale,
};

const FH = "'Space Grotesk', sans-serif";
const FB = "'Inter', sans-serif";

/* --- DATA (Themed) --- */
const SERVICES = [
  { abbr:"AC",  color:G.gold,  name:"AC Repair",        type:"assessment", price:"GHS 25",  popular:true  },
  { abbr:"EL",  color:G.gold,  name:"Electrical",        type:"assessment", price:"GHS 25",  popular:false },
  { abbr:"PL",  color:G.gold,  name:"Plumbing",          type:"assessment", price:"GHS 25",  popular:true  },
  { abbr:"CL",  color:G.gold,  name:"House Cleaning",    type:"fixed",      price:"GHS 120", popular:false },
  { abbr:"GR",  color:G.gold,  name:"Generator Repair",  type:"assessment", price:"GHS 25",  popular:false },
  { abbr:"PT",  color:G.gold,  name:"Polytank Cleaning", type:"fixed",      price:"GHS 80",  popular:true  },
  { abbr:"PA",  color:G.gold,  name:"Painting",          type:"assessment", price:"GHS 25",  popular:false },
  { abbr:"FU",  color:G.gold,  name:"Fumigation",        type:"fixed",      price:"GHS 150", popular:false },
];

const TASKERS = [
  { name:"Emmanuel K.", role:"Electrician & AC Technician", rating:4.9, jobs:247, area:"East Legon",  badge:"Elite", avatar:"EK", verified:true },
  { name:"Abena M.",    role:"Professional Cleaner",        rating:4.8, jobs:189, area:"Airport Area", badge:null,    avatar:"AM", verified:true },
  { name:"Kwabena O.",  role:"Master Plumber",              rating:5.0, jobs:312, area:"Cantonments",  badge:"Elite", avatar:"KO", verified:true },
  { name:"Ama S.",      role:"Fumigation Specialist",       rating:4.7, jobs:98,  area:"Spintex",      badge:null,    avatar:"AS", verified:true },
];

const REVIEWS = [
  { name:"Sandra A.", area:"East Legon",    stars:5, text:"Emmanuel fixed my AC in under 2 hours. The escrow payment made me feel so safe - I knew my money was protected until I confirmed the job. Will use again!", service:"AC Repair" },
  { name:"Kofi B.",   area:"Airport Hills", stars:5, text:"Finally a platform that vets their taskers properly. Abena cleaned my home thoroughly. The booking process was seamless.", service:"House Cleaning" },
  { name:"Efua M.",   area:"Cantonments",   stars:5, text:"Kwabena fixed a bad pipe leak on a Saturday morning within 3 hrs of booking. The quote was transparent. No surprises.", service:"Plumbing" },
  { name:"Nana K.",   area:"Spintex",       stars:4, text:"The polytank cleaning service was incredible. They sent before/after photos. Never realized how dirty it actually was!", service:"Polytank Cleaning" },
];

const STATS = [
  { val:"2,400+", label:"Happy Customers" },
  { val:"180+",   label:"Verified Taskers" },
  { val:"4.9",    label:"Average Rating" },
  { val:"< 2hrs", label:"Avg Response" },
];

const STEPS = [
  { n:"01", title:"Choose your service",  desc:"Browse 30+ home services. Pick a fixed price or request an assessment for complex jobs." },
  { n:"02", title:"Get matched instantly", desc:"We find the nearest verified Tasker. See their ratings and job history before confirming." },
  { n:"03", title:"Pay safely via MoMo",  desc:"Your money stays in escrow until you're satisfied. Materials advance protected by receipt upload." },
  { n:"04", title:"Job done. You confirm.",desc:"Once you confirm work is complete, payment releases. Rate your Tasker and you're done." },
];

const FAQS = [
  { q:"How are Taskers verified?",             a:"Every Tasker submits a Ghana Card or Voter ID, passes a background check, and provides at least one professional reference. Only approved Taskers appear on the platform." },
  { q:"What if I'm not happy with the job?",   a:"Our Happiness Guarantee means we'll send another Tasker to fix it free, or refund you in full. Just raise a dispute within 24 hours." },
  { q:"How does the escrow payment work?",     a:"When you pay, funds are held securely - not released to the Tasker until you confirm the job is done. For materials, 50% is released upfront and the Tasker must upload a receipt." },
  { q:"What areas in Accra do you cover?",     a:"We cover East Legon, Airport Residential, Cantonments, Osu, Spintex, Tema, Adenta, and Madina. More areas launching soon." },
  { q:"How quickly can I get a Tasker?",       a:"Most bookings are matched within 30 minutes. Many services are available same-day in our high-coverage areas." },
  { q:"What payment methods do you accept?",   a:"MTN MoMo, Telecel Cash, and AT Money. Card payments coming soon." },
];

/* ================================ COMPONENTS ================================ */

/* NAV */
const Nav = ({ onMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? `1px solid ${G.border}` : "none",
      transition:"all 0.3s", padding:"0 24px",
    }}>
      <div style={{ maxWidth:1180, margin:"0 auto", height:68, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Logo dark={!scrolled} size={32} />

        {/* Desktop nav links */}
        <div style={{ display:"flex", gap:32, alignItems:"center" }}>
          {["Services","How It Works","Become a Tasker"].map(l => (
            <span key={l} style={{
              fontFamily:FB, fontSize:15, fontWeight:500, cursor:"pointer",
              color: scrolled ? G.slate : "rgba(255,255,255,0.88)",
              transition:"color 0.2s",
              display: "none", // hidden mobile, shown via inline below
            }}
              className="desktop-nav-link"
            >{l}</span>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button className="btn-ghost" style={{
            fontSize:13, padding:"9px 18px",
            background: scrolled ? G.greenPale : "rgba(255,255,255,0.14)",
            color: scrolled ? G.green : G.white,
            border: scrolled ? `1.5px solid ${G.green}33` : "1.5px solid rgba(255,255,255,0.28)",
          }}>Become a Tasker</button>
          <button onClick={onMenu} style={{ background:"none", border:"none", cursor:"pointer", padding:6 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:22, height:2, borderRadius:2, background: scrolled ? G.slate : G.white }} />
              ))}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

/* MENU DRAWER */
const MenuDrawer = ({ open, onClose }) => (
  <>
    {open && (
      <div onClick={onClose} style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
        zIndex:300, backdropFilter:"blur(4px)", animation:"fadeIn 0.2s ease",
      }} />
    )}
    <div style={{
      position:"fixed", top:0, right:0, bottom:0, width:"min(80%, 320px)",
      background:G.white, zIndex:400, padding:28,
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)",
      display:"flex", flexDirection:"column",
      boxShadow:"-8px 0 32px rgba(0,0,0,0.12)",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
        <Logo size={30} />
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", display: "flex", alignItems: "center", justifyContent: "center", color:G.steel }}><X size={24} /></button>
      </div>
      {["Services","How It Works","Become a Tasker","About","Support"].map(link => (
        <div key={link} onClick={onClose} style={{
          padding:"16px 0", borderBottom:`1px solid ${G.border}`,
          fontFamily:FB, fontWeight:500, fontSize:16, color:G.slate, cursor:"pointer",
        }}>{link}</div>
      ))}
      <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:12 }}>
        <button className="btn-primary" style={{ width:"100%" }}>Book a Tasker</button>
        <button className="btn-outline" style={{ width:"100%" }}>Log In</button>
      </div>
    </div>
  </>
);

/* --- HERO --- */
const Hero = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    const cleanPhone = phone.replace(/\D/g, "");
    navigate(`/booking?phone=${cleanPhone}`);
  };

  return (
    <section style={{
      background: `linear-gradient(150deg, ${ThemeG.greenDeep || ThemeG.green} 0%, ${G.green} 100%)`,
      position: "relative", overflow: "hidden", minHeight: "85vh",
      display: "flex", alignItems: "center", padding: "80px 0"
    }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", borderRadius: 100, padding: "8px 16px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.2)" }}>
            <span style={{ fontFamily: FH, fontSize: 11, fontWeight: 800, color: G.gold }}>ACCRA</span>
            <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.9)" }}>Trust is our currency.</span>
          </div>
          <h1 style={{ fontFamily: FH, fontWeight: 800, fontSize: "clamp(40px, 8vw, 64px)", color: G.white, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.03em" }}>
            The Best Care<br />For Your <span style={{ color: G.gold }}>Home.</span>
          </h1>
          <p style={{ fontFamily: FB, fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
            Book vetted Taskers for repairs, cleaning, and more. Payments secured in escrow until the job is done right.
          </p>
          <div style={{ background: G.white, borderRadius: 16, padding: 8, display: "flex", gap: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", maxWidth: 460 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 12 }}>
              <span style={{ color: G.mist, fontSize: 15, fontWeight: 600, marginRight: 8 }}>+233</span>
              <input 
                placeholder="Enter phone number" 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
                style={{ border: "none", outline: "none", width: "100%", fontSize: 16, fontFamily: FB }} 
              />
            </div>
            <button className="btn-primary" onClick={handleStart} style={{ borderRadius: 12 }}>Get Started</button>
          </div>
          <div style={{ marginTop: 32, display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["ID-Verified", "Escrow Protection", "4.9/5 Rating"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: G.gold }} />
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* --- SERVICES --- */
const ServicesSection = () => (
  <section style={{ padding: "100px 0", background: G.offWhite }}>
    <div className="container">
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ color: G.green, fontWeight: 800, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Categories</div>
        <h2 style={{ fontSize: 42, marginBottom: 20 }}>How can we help you?</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        {SERVICES.map((s, i) => (
          <Link to="/services" key={i} style={{ background: G.white, border: `1.5px solid ${G.border}`, borderRadius: 24, padding: 32, transition: "all 0.3s" }} className="hover-card">
            <div style={{ fontSize: 40, marginBottom: 20 }}>{s.abbr}</div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>{s.name}</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <span style={{ color: G.gold, fontWeight: 700, fontSize: 18 }}>{s.price}</span>
               <span style={{ color: G.green, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>Book Now <ArrowRight size={14} /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

/* --- REVIEWS --- */
const ReviewsSection = () => (
    <section style={{ padding: "100px 0", background: G.white }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40 }}>
           {/* Simple and elegant review grid */}
           {REVIEWS.slice(0, 3).map((r, i) => (
             <div key={i} style={{ border: `1.5px solid ${G.border}`, padding: 32, borderRadius: 24 }}>
                <div style={{ color: G.gold, display: "flex", gap: 4, marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <svg key={s} width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  ))}
                </div>
                <p style={{ fontStyle: "italic", marginBottom: 24, lineHeight: 1.8, color: G.steel }}>"{r.text}"</p>
                <div style={{ fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: G.mist }}>{r.area} - {r.service}</div>
             </div>
           ))}
        </div>
      </div>
    </section>
);

/* --- FINAL CLEAN COMPONENT --- */
export default function LandingPage() {
  return (
    <div className="page-enter">
      <Hero />
      <ServicesSection />
      <ReviewsSection />
      {/* Tasker CTA */}
      <section style={{ background: G.green, padding: "80px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: G.white, fontSize: 36, marginBottom: 16 }}>Become a Tasker</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 500, margin: "0 auto 32px" }}>Join Accra's elite professionals and earn on your own terms with guaranteed MoMo payments.</p>
          <Link to="/become-a-tasker" className="btn-primary" style={{ background: G.white, color: G.green }}>Apply Now</Link>
        </div>
      </section>
    </div>
  );
}
