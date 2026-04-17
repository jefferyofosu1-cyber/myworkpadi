import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Award,
  ChevronRight,
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
  const navigate = useNavigate();

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

    </div>
  );
}
