import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShieldCheck, ArrowRight, Star, Clock, Info, CheckCircle2 } from 'lucide-react';
import { G, FD, FB } from '../constants/theme';
import { ALL_SERVICES, CATS } from '../constants/data';

const ServiceCard = ({ svc, onBook }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -8 }}
    style={{ 
      background: 'white', 
      borderRadius: 28, 
      padding: 32, 
      border: `1.5px solid ${G.border}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative'
    }}
    onClick={() => onBook(svc)}
  >
    {svc.popular && (
      <div style={{ position: 'absolute', top: 20, right: 20, background: G.goldPale, color: G.gold, padding: '4px 12px', borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Popular
      </div>
    )}
    <div style={{ width: 56, height: 56, borderRadius: 16, background: G.greenPale, color: G.green, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontFamily: FD, fontWeight: 900, fontSize: 18 }}>
      {svc.abbr}
    </div>
    <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.black, marginBottom: 8 }}>{svc.name}</h3>
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: G.mist, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{svc.cat}</span>
    </div>
    <p style={{ color: G.steel, fontSize: 14, lineHeight: 1.6, flex: 1, marginBottom: 24 }}>{svc.desc}</p>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: `1px solid ${G.border}` }}>
      <div>
        <div style={{ fontSize: 10, color: G.mist, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{svc.type === "assessment" ? "Assessment" : "Fixed Price"}</div>
        <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 22, color: G.green }}>{svc.price}</div>
      </div>
      <div style={{ background: G.green, color: 'white', padding: '10px 20px', borderRadius: 12, fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        Book <ArrowRight size={14} />
      </div>
    </div>
  </motion.div>
);

export default function ServicesPage() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const filtered = ALL_SERVICES.filter(s =>
    (cat === "All" || s.cat === cat) &&
    (search === "" || s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleBook = (svc) => {
    navigate('/booking', { state: { service: svc } });
  };

  return (
    <div className="page-enter" style={{ background: G.offWhite, minHeight: '100vh', paddingBottom: 100 }}>
      {/* PREMIUM HERO */}
      <section style={{ 
        background: `linear-gradient(150deg, ${G.black} 0%, ${G.greenDeep} 100%)`, 
        padding: '120px 0 80px', 
        position: 'relative', 
        overflow: 'hidden',
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: G.gold, fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16, display: 'block' }}
          >
            Service Directory
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: FD, fontSize: 'clamp(40px, 6vw, 60px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.04em' }}
          >
            Accra's Best Pros.<br />
            <span style={{ color: G.gold }}>At Your Fingertips.</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}
          >
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', padding: 8, borderRadius: 24, display: 'flex', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 20, color: 'white' }}>
                <Search size={22} color="rgba(255,255,255,0.5)" style={{ marginRight: 16 }} />
                <input 
                  placeholder="What help do you need?" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', fontSize: 17, outline: 'none', fontWeight: 500 }}
                />
              </div>
              <button style={{ background: G.gold, color: G.black, padding: '14px 32px', borderRadius: 18, border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>Search</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FILTERS & STATS */}
      <section className="container" style={{ marginTop: -40, position: 'relative', zIndex: 10 }}>
        <div style={{ background: 'white', padding: '24px 32px', borderRadius: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }} className="hide-scroll">
            {CATS.map(c => (
              <button 
                key={c} 
                onClick={() => setCat(c)}
                style={{ 
                  background: cat === c ? G.green : 'transparent',
                  color: cat === c ? 'white' : G.steel,
                  padding: '10px 20px', borderRadius: 100, border: `1.5px solid ${cat === c ? G.green : G.border}`,
                  fontFamily: FB, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: '0.2s', whiteSpace: 'nowrap'
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, color: G.mist, fontWeight: 700 }}>Showing {filtered.length} Services</span>
          </div>
        </div>
      </section>

      {/* SERVICE LIST */}
      <section className="container" style={{ paddingTop: 60 }}>
        <AnimatePresence mode="popLayout">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
            {filtered.map((svc) => (
              <ServiceCard key={svc.id} svc={svc} onBook={handleBook} />
            ))}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '100px 0', color: G.mist }}
          >
            <Info size={48} style={{ marginBottom: 20 }} />
            <h3 style={{ fontFamily: FD, fontSize: 24, fontWeight: 800, color: G.black }}>No services found</h3>
            <p style={{ marginTop: 8 }}>Try adjusting your search or category filters.</p>
            <button onClick={() => {setSearch(""); setCat("All");}} style={{ marginTop: 24, color: G.green, fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>Clear all filters</button>
          </motion.div>
        )}
      </section>

      {/* TRUST SECTION */}
      <section className="container" style={{ marginTop: 100 }}>
        <div style={{ background: 'white', borderRadius: 48, padding: 60, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, border: `1px solid ${G.border}` }}>
          {[
            { i: <ShieldCheck size={28}/>, t: "Verified Experts", d: "Every professional passes a background check and skill assessment." },
            { i: <Clock size={28}/>, t: "Upfront Pricing", d: "No hidden fees. Know the service cost before you book." },
            { i: <CheckCircle2 size={28}/>, t: "Quality Guarantee", d: "If you're not happy, we'll make it right - free of charge." }
          ].map((item, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ background: G.greenPale, width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: G.green }}>
                {item.i}
              </div>
              <h4 style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: G.black, marginBottom: 12 }}>{item.t}</h4>
              <p style={{ color: G.steel, fontSize: 14, lineHeight: 1.6 }}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
