import React, { useState } from 'react';
import { G, FH, FB } from '../constants/theme';
import { ALL_SERVICES, CATS } from '../constants/data';

const SectionLabel = ({ children, color = G.green }) => (
  <div style={{ fontFamily:FB, fontSize:11, color, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:8 }}>{children}</div>
);

const Tag = ({ color, bg, children }) => (
  <span style={{
    display:"inline-block", padding:"3px 9px", borderRadius:20,
    background: bg || color+"18", color, border:`1px solid ${color}33`,
    fontFamily:FB, fontWeight:700, fontSize:10, letterSpacing:"0.05em",
  }}>{children}</span>
);

export default function ServicesPage() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  
  const filtered = ALL_SERVICES.filter(s =>
    (cat === "All" || s.cat === cat) &&
    (search === "" || s.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-enter" style={{ paddingTop:80 }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(150deg, ${G.black}, ${G.green})`, padding:"56px 40px 48px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:G.green+"22" }} />
        <div className="fade-up" style={{ maxWidth:600, margin:"0 auto", position:"relative" }}>
          <SectionLabel color={G.gold}>What We Offer</SectionLabel>
          <h1 style={{ fontFamily:FH, fontWeight:800, fontSize:42, color:G.white, marginBottom:12, letterSpacing:"-0.02em" }}>
            30+ Home Services<br /><span style={{ color:G.gold }}>All in One Place</span>
          </h1>
          <p style={{ fontFamily:FB, fontSize:16, color:"rgba(255,255,255,0.8)", lineHeight:1.7, marginBottom:28 }}>
            Fixed-price jobs you can book instantly, or assessment visits for complex repairs — all with escrow-protected payments.
          </p>
          <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:12, display:"flex", gap:12, backdropFilter:"blur(8px)", maxWidth:440, margin:"0 auto", border: '1px solid rgba(255,255,255,0.2)' }}>
            <input 
              placeholder="Search services..." 
              value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{ background:"transparent", border:"none", color:G.white, flex:1, fontSize:15, outline:'none', textAlign: 'center' }} 
            />
          </div>
        </div>
      </div>

      {/* Cat filters */}
      <div style={{ background:G.offWhite, borderBottom:`1px solid ${G.border}`, padding:"16px 40px", overflowX:"auto" }}>
        <div style={{ display:"flex", gap:8, minWidth:"max-content", justifyContent:'center' }}>
          {CATS.map(c => (
            <button key={c} className="tab-pill" onClick={() => setCat(c)} style={{
              background: cat===c ? G.green : G.white,
              color: cat===c ? G.white : G.steel,
              boxShadow: cat===c ? `0 3px 12px ${G.green}33` : "none",
              padding: "9px 18px", borderRadius: 100, border: `1px solid ${cat===c ? G.green : G.border}`, cursor: "pointer",
              fontFamily: FB, fontWeight: 600, fontSize: 13,
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ background:G.offWhite, padding:"40px", minHeight:400 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontFamily:FB, fontSize:13, color:G.mist, marginBottom:20 }}>
            {filtered.length} service{filtered.length!==1?"s":""} found
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20 }}>
            {filtered.map((svc,i) => (
              <div key={i} className="service-tile" style={{ position:"relative", background: "#fff", borderRadius: 20, padding: 24, border: `1.5px solid ${G.border}`, boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}>
                {svc.popular && (
                  <div style={{ position:"absolute", top:14, right:14 }}>
                    <Tag color={G.gold}>Popular</Tag>
                  </div>
                )}
                <div style={{ 
                  width: 48, height: 48, borderRadius: 12, background: G.greenPale, 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FH, fontWeight: 800, fontSize: 16, color: G.green, marginBottom: 16
                }}>
                  {svc.abbr}
                </div>
                <div style={{ fontFamily:FH, fontWeight:700, fontSize:18, color:G.black, marginBottom:6 }}>{svc.name}</div>
                <Tag color={G.steel}>{svc.cat}</Tag>
                <p style={{ fontFamily:FB, fontSize:13, color:G.steel, lineHeight:1.65, margin:"12px 0 16px" }}>{svc.desc}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontFamily:FB, fontSize:10, color:G.mist, marginBottom:2, fontWeight: 700 }}>{svc.type==="assessment"?"ASSESSMENT":"FIXED PRICE"}</div>
                    <div style={{ fontFamily:FH, fontWeight:800, fontSize:22, color:G.green }}>{svc.price}</div>
                  </div>
                  <button className="btn-primary" style={{ width:"auto", padding:"12px 24px", fontSize:14, borderRadius:12 }}>Book</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
