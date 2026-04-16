import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Award,
  Search,
  ChevronRight,
  Menu,
  X,
  Wind,
  Sparkles,
  Droplets,
  Palette,
  Bug
} from "lucide-react";
import "./LandingPage.css";

/* --- DATA --- */
const SERVICES = [
  { id: "ac", name: "AC Repair & Service", price: "GHS 300", icon: <Wind size={28} />, desc: "Expert assessment and repair for all brands." },
  { id: "clean", name: "Professional Cleaning", price: "GHS 120", icon: <Sparkles size={28} />, desc: "Deep cleaning for homes and offices." },
  { id: "plumb", name: "Master Plumbing", price: "GHS 250", icon: <Droplets size={28} />, desc: "Leak repairs and installations." },
  { id: "elec", name: "Electrical Works", price: "GHS 300", icon: <Zap size={28} />, desc: "Certified electricians for any job." },
  { id: "paint", name: "Modern Painting", price: "GHS 400", icon: <Palette size={28} />, desc: "Quality finishes for every wall." },
  { id: "fumi", name: "Fumigation", price: "GHS 150", icon: <Bug size={28} />, desc: "Safe and effective pest control." },
];

const STEPS = [
  { n: "01", title: "Describe your job", desc: "Select a service and describe your needs in 2 minutes." },
  { n: "02", title: "Get matched instantly", desc: "Our system finds the highest-rated Tasker near you." },
  { n: "03", title: "Secure MoMo escrow", desc: "Pay securely. Funds stay with us until you're happy." },
  { n: "04", title: "Review & finish", desc: "Confirm the work is done and rate your professional." },
];

/* --- COMPONENTS --- */

const Logo = () => (
  <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 32, height: 32, background: "#0A6E4A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CheckCircle size={20} color="white" />
    </div>
    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 22, color: "#0D1117", letterSpacing: "-0.04em" }}>
      Task<span style={{ color: "#0A6E4A" }}>GH</span>
    </span>
  </Link>
);

const TrustBar = () => (
  <div className="trust-bar">
    <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", overflowX: "auto", gap: 40 }}>
      {["4.9/5 Avg Rating", "2,400+ Jobs Done", "Verified Taskers", "100% Secure", "Accra's Favorite"].map(text => (
        <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <ShieldCheck size={16} color="#0A6E4A" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8" }}>{text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function LandingPage() {
  const [phone, setPhone] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStart = (e) => {
    e?.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length >= 9) {
      navigate(`/booking?phone=${cleanPhone}`);
    } else {
      alert("Please enter a valid phone number");
    }
  };

  return (
    <div className="landing-page">
      {/* NAVIGATION */}
      <nav className={scrolled ? "scrolled" : ""} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: 80, display: "flex", alignItems: "center", transition: "all 0.3s",
        padding: "0 24px"
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-only">
            {["Services", "How It Works", "Become a Tasker"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{ textDecoration: "none", color: "#1A202C", fontWeight: 600, fontSize: 15 }}>{l}</a>
            ))}
            <button className="hero-btn" onClick={() => navigate("/login")} style={{ padding: "10px 24px", fontSize: 14 }}>Log In</button>
          </div>

          <button onClick={() => setIsMenuOpen(true)} className="mobile-only" style={{ background: "none", border: "none" }}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ position: "fixed", inset: 0, zIndex: 1100, background: "white", padding: 32, display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
              <Logo />
              <button onClick={() => setIsMenuOpen(false)} style={{ background: "none", border: "none" }}><X size={28} /></button>
            </div>
            {["Services", "How It Works", "Become a Tasker"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setIsMenuOpen(false)} style={{ fontSize: 24, fontWeight: 800, color: "#0D1117", marginBottom: 24, textDecoration: "none" }}>{l}</a>
            ))}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
              <button className="hero-btn" style={{ width: "100%" }}>Book a Professional</button>
              <button className="hero-btn" style={{ width: "100%", background: "#F1F4F9", color: "#1A202C" }}>Tasker Login</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="hero-split">
        <div className="hero-container">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="hero-badge">
              <span>Handpicked for Accra & Tema</span>
              <Award size={14} color="#E8A020" />
            </div>
            <h1>The Best Care<br />For Your <span>Home.</span></h1>
            <p>
              Book vetted, ID-verified professionals for repairs and cleaning. Your money stays safe in escrow until the job is done right.
            </p>

            <form className="lead-form" onSubmit={handleStart}>
              <div className="input-group">
                <span>+233</span>
                <input 
                  type="tel" 
                  placeholder="Enter phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button type="submit" className="hero-btn">Get Started</button>
            </form>

            <div style={{ marginTop: 32, display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ display: "flex", gap: -10 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "#EEF2F7", border: "2px solid white", marginLeft: i === 1 ? 0 : -10, overflow: "hidden" }}>
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>Join 2,400+ happy homes in Accra</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-visual"
          >
            <div className="hero-image-wrapper">
              <img src="/assets/images/hero-tasker.png" alt="Accra Handyman" />
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="hero-stat-card stat-1"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: "#E8F5EF", padding: 8, borderRadius: 12 }}><Clock size={20} color="#0A6E4A" /></div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>Avg. Response</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0D1117" }}>12 Mins</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="hero-stat-card stat-2"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: "#FDF4E3", padding: 8, borderRadius: 12 }}><Star size={20} color="#E8A020" /></div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>Elite Tasker</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0D1117" }}>4.9/5 Rating</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <TrustBar />

      {/* SERVICES GRID */}
      <section id="services" style={{ padding: "120px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 80px" }}>
            <span className="section-tag">Our Categories</span>
            <h2 className="section-h2">What can we fix for you today?</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {SERVICES.map((s, idx) => (
              <motion.div 
                key={s.id}
                whileHover={{ y: -10 }}
                className="service-card"
                onClick={() => navigate(`/services/${s.id}`)}
              >
                <div className="service-icon-box">{s.icon}</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <div className="service-footer">
                  <div className="service-price">Starting {s.price}</div>
                  <div className="service-goto">Book Now <ArrowRight size={16} /></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <Link to="/services" style={{ color: "#0A6E4A", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              View All 30+ Services <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="process-section">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 80px" }}>
            <span className="section-tag">Simple & Transparent</span>
            <h2 className="section-h2">How TaskGH Works</h2>
          </div>

          <div className="process-grid">
            {STEPS.map((s, idx) => (
              <div key={idx} className="process-step">
                <div className="step-number">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TASKER CTA */}
      <section id="become-a-tasker" style={{ padding: "0 24px" }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="tasker-banner">
            <div>
              <h2>Be Your Own Boss. Get Paid Every Day.</h2>
              <p>Join Accra's elite professionals and earn GHS 2,000+ weekly on your own terms with guaranteed MoMo payments.</p>
              <Link to="/become-a-tasker" className="tasker-btn">Apply to Join TaskGH</Link>
            </div>
            <div style={{ opacity: 0.15, position: "absolute", right: -50, top: -50, pointerEvents: "none" }}>
              <Award size={400} color="white" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "100px 24px 60px", background: "#0D1117", color: "white" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 60, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 60 }}>
          <div>
            <Logo />
            <p style={{ marginTop: 24, opacity: 0.6, lineHeight: 1.7 }}>
              Accra's most trusted marketplace for home services. Quality work, verified professionals, and secure payments.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: 24 }}>Company</h4>
            {["About Us", "Careers", "Press", "Contact"].map(l => (
              <a key={l} href="/" style={{ display: "block", color: "white", opacity: 0.6, textDecoration: "none", marginBottom: 12 }}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ marginBottom: 24 }}>Quick Links</h4>
            {["All Services", "How It Works", "Become a Tasker", "Pricing"].map(l => (
              <Link key={l} to="/" style={{ display: "block", color: "white", opacity: 0.6, textDecoration: "none", marginBottom: 12 }}>{l}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ marginBottom: 24 }}>Follow Us</h4>
            <div style={{ display: "flex", gap: 16 }}>
              {["Instagram", "Facebook", "X"].map(l => (
                <div key={l} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Star size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 40, opacity: 0.4, fontSize: 13 }}>
          © 2026 TaskGH (MyWorkPadi). All rights reserved.
        </div>
      </footer>
    </div>
  );
}
