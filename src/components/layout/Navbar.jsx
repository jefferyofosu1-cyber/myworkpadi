import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';
import { G, FH, FB } from '../../constants/theme';

const Logo = () => (
  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={G.green}/>
      <path d="M21 15.5L23 17.5L27 13.5" stroke={G.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 20.5L13.5 14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M13 27L21 19" stroke={G.gold} strokeWidth="3" strokeLinecap="round"/>
    </svg>
    <span style={{ fontFamily:FH, fontWeight:800, fontSize:20, color:G.ink, letterSpacing:"-0.03em" }}>
      Task<span style={{ color:G.green }}>GH</span>
    </span>
  </div>
);

const NavLink = ({ to, children, active }) => (
  <Link to={to} style={{
    fontFamily:FB, fontSize:14, fontWeight:600, color: active ? G.green : G.slate,
    textDecoration:"none", transition:"color 0.2s", position:"relative",
    padding:"8px 0"
  }}>
    {children}
    {active && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:G.green, borderRadius:2 }} />}
  </Link>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null); // 'services' | 'more' | null
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdown(null);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        background: scrolled ? "rgba(255,255,255,0.96)" : (isHome ? "transparent" : "rgba(255,255,255,0.85)"),
        backdropFilter: scrolled ? "blur(12px)" : (isHome ? "none" : "blur(12px)"),
        borderBottom: (scrolled && !isHome) ? `1px solid ${G.border}` : "1px solid transparent",
        transition:"all 0.3s", padding:"0 40px",
        height: 80, display: "flex", alignItems: "center"
      }}>
        <div className="nav-container" style={{ maxWidth:1200, margin:"0 auto", width: "100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link to="/" style={{ textDecoration:"none" }}><Logo /></Link>

          {/* Desktop Links - Centered */}
          <div style={{ display:"none", gap:32, alignItems:"center", flex: 1, justifyContent: "center" }} className="desktop-links">
            <div 
              onMouseEnter={() => setDropdown('services')} 
              onMouseLeave={() => setDropdown(null)}
              style={{ position:"relative", padding:"20px 0" }}
            >
              <NavLink to="/services" active={location.pathname === '/services'}>
                Services <ChevronDown size={12} style={{ marginLeft: 4, opacity: 0.6 }} />
              </NavLink>
              
              {dropdown === 'services' && (
                <div style={{
                  position:"absolute", top:50, left:-20, width:600, background:G.white,
                  borderRadius:20, padding:24, boxShadow:"0 20px 50px rgba(0,0,0,0.12)",
                  border:`1px solid ${G.border}`, display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:12,
                  animation: "fadeIn 0.2s ease"
                }}>
                  {[
                    { title: "Electrical & Cooling", links: ["AC Repair", "Wiring", "Generators"] },
                    { title: "Plumbing & Water", links: ["Pipe Leaks", "Polytanks", "Pumps"] },
                    { title: "Cleaning & Fumigation", links: ["Home Cleaning", "Pest Control", "Sofa Cleaning"] },
                    { title: "Mounting & Fixes", links: ["TV Mounting", "Carpentry", "Tiling"] },
                  ].map(cat => (
                    <div key={cat.title}>
                      <div style={{ fontFamily:FH, fontWeight:700, fontSize:12, color:G.green, letterSpacing:"0.05em", marginBottom:8 }}>{cat.title}</div>
                      {cat.links.map(l => (
                        <Link key={l} to="/services" style={{ display:"block", fontFamily:FB, fontSize:13, color:G.slate, textDecoration:"none", padding:"6px 0", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color=G.green} onMouseLeave={e=>e.target.style.color=G.slate}>{l}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/how-it-works" active={location.pathname === '/how-it-works'}>How It Works</NavLink>
            <NavLink to="/become-a-tasker" active={location.pathname === '/become-a-tasker'}>Become a Tasker</NavLink>
            
            <div 
              onMouseEnter={() => setDropdown('more')} 
              onMouseLeave={() => setDropdown(null)}
              style={{ position:"relative", padding:"20px 0" }}
            >
              <span style={{ fontFamily:FB, fontSize:14, fontWeight:600, color:G.slate, cursor:"pointer", display: "flex", alignItems: "center" }}>More <ChevronDown size={12} style={{ marginLeft: 4, opacity: 0.6 }} /></span>
              {dropdown === 'more' && (
                <div style={{
                  position:"absolute", top:50, right:0, width:180, background:G.white,
                  borderRadius:16, padding:12, boxShadow:"0 12px 32px rgba(0,0,0,0.1)",
                  border:`1px solid ${G.border}`, animation: "fadeIn 0.2s ease"
                }}>
                  <Link to="/about" style={{ display:"block", padding:"10px 14px", fontFamily:FB, fontSize:14, color:G.slate, textDecoration:"none", borderRadius:8 }} className="dropdown-item">About Us</Link>
                  <Link to="/support" style={{ display:"block", padding:"10px 14px", fontFamily:FB, fontSize:14, color:G.slate, textDecoration:"none", borderRadius:8 }} className="dropdown-item">Support</Link>
                </div>
              )}
            </div>
          </div>

          <div className="navbar-actions" style={{ display:"flex", gap:16, alignItems:"center", marginLeft: 'auto' }}>
            <Link to="/signup" style={{ 
              fontFamily:FB, fontSize:14, fontWeight:600, color:G.green, 
              textDecoration:"none", padding:"10px 18px", borderRadius:10, background:G.greenPale
            }} className="desktop-only">Log In</Link>
            <Link to="/booking" className="btn-primary desktop-only" style={{ padding:"10px 22px", borderRadius:10, fontSize:14 }}>Book Now</Link>
            <button 
              onClick={() => setMenuOpen(true)}
              style={{ background:"none", border:"none", cursor:"pointer", padding:8 }}
              className="mobile-only"
            >
              <div style={{ width:24, height:2, background:G.slate, marginBottom:6 }} />
              <div style={{ width:24, height:2, background:G.slate, marginBottom:6 }} />
              <div style={{ width:16, height:2, background:G.slate, marginLeft:"auto" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)", zIndex:1100 }} onClick={() => setMenuOpen(false)}>
          <div style={{
            position:"absolute", top:0, right:0, bottom:0, width:300, background:G.white,
            padding:32, boxShadow:"-10px 0 40px rgba(0,0,0,0.1)", display:"flex", flexDirection:"column",
            animation: "slideInLeft 0.3s ease"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40 }}>
              <Logo />
              <button onClick={() => setMenuOpen(false)} style={{ background:"none", border:"none", display: "flex", alignItems: "center", justifyContent: "center", color:G.mist }}><X size={28} /></button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              {['Services', 'How It Works', 'Become a Tasker', 'About', 'Support'].map(l => (
                <Link key={l} to={`/${l.toLowerCase().replace(/ /g, '-')}`} style={{
                  fontFamily:FH, fontSize:20, fontWeight:700, color:G.slate, textDecoration:"none"
                }}>{l}</Link>
              ))}
            </div>
            <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:12 }}>
              <Link to="/booking" className="btn-primary" style={{ width:"100%", textAlign: "center" }}>Book Now</Link>
              <Link to="/login" className="btn-outline" style={{ width:"100%", textAlign: "center", padding: "14px 28px", borderRadius: 14 }}>Log In</Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @media (min-width: 900px) { .desktop-links { display: flex !important; } .mobile-only { display: none !important; } }
        @media (max-width: 900px) { nav { padding: 0 20px !important; } .nav-container { padding: 0 !important; } }
        .dropdown-item:hover { background: ${G.cloud}; color: ${G.green} !important; }
      `}</style>
    </>
  );
}
