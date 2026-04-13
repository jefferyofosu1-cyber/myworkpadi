import React, { useState } from 'react';
import { G, FH, FB } from '../constants/theme';
import { STEPS_DATA } from '../constants/data';

const SectionLabel = ({ children, color = G.green }) => (
  <div style={{ fontFamily:FB, fontSize:11, color, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:8 }}>{children}</div>
);

export default function HowItWorksPage() {
  const [active, setActive] = useState(0);
  const step = STEPS_DATA[active];

  return (
    <div className="page-enter" style={{ paddingTop:80 }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(150deg, ${G.black}, ${G.green})`, padding:"56px 40px 48px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, left:-40, width:180, height:180, borderRadius:"50%", background:G.green+"22" }} />
        <div className="fade-up" style={{ maxWidth:600, margin:"0 auto", position:"relative" }}>
          <SectionLabel color={G.gold}>Simple Process</SectionLabel>
          <h1 style={{ fontFamily:FH, fontWeight:800, fontSize:42, color:G.white, marginBottom:12, letterSpacing:"-0.02em" }}>
            Book a Tasker in<br /><span style={{ color:G.gold }}>5 Easy Steps</span>
          </h1>
          <p style={{ fontFamily:FB, fontSize:16, color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}>
            From opening the app to job done - every step is safe, transparent, and in your control.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:32 }}>
          {/* Step selector */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {STEPS_DATA.map((s, i) => (
              <div key={i} onClick={() => setActive(i)} style={{
                padding:"16px 18px", borderRadius:14, cursor:"pointer",
                background: active===i ? G.green : G.white,
                border:`1.5px solid ${active===i ? G.green : G.border}`,
                boxShadow: active===i ? `0 4px 20px ${G.green}33` : "0 1px 8px rgba(0,0,0,0.05)",
                transition:"all 0.2s",
              }}>
                <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                  <div style={{ 
                    width:32, height:32, borderRadius:"50%", 
                    background: active===i ? G.gold : G.cloud,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:FH, fontWeight:800, fontSize:12,
                    color: active===i ? G.black : G.green
                  }}>
                    {s.n}
                  </div>
                  <div>
                    <div style={{ fontFamily:FB, fontWeight:600, fontSize:14, color: active===i?G.white:G.slate }}>{s.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div key={active} className="page-enter" style={{ background:G.white, borderRadius:24, padding:40, border:`1.5px solid ${G.border}`, boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
              <div style={{ width:64, height:64, borderRadius:20, background:G.greenPale, border:`2px solid ${G.green}11`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FH, fontWeight:800, fontSize:24, color:G.green }}>
                {step.n}
              </div>
              <div>
                <div style={{ fontFamily:FH, fontWeight:700, fontSize:11, color:G.gold, letterSpacing:"0.15em" }}>STEP {step.n}</div>
                <h2 style={{ fontFamily:FH, fontWeight:800, fontSize:28, color:G.black, letterSpacing:"-0.02em" }}>{step.title}</h2>
              </div>
            </div>
            <p style={{ fontFamily:FB, fontSize:17, color:G.slate, lineHeight:1.75, marginBottom:24 }}>{step.desc}</p>
            <div style={{ background:G.cloud, borderRadius:16, padding:24, marginBottom:24, border: `1px solid ${G.border}` }}>
              <p style={{ fontFamily:FB, fontSize:15, color:G.steel, lineHeight:1.75 }}>{step.detail}</p>
            </div>
            <div style={{ background:G.greenPale, borderRadius:12, padding:"16px 20px", border:`1px solid ${G.green}11` }}>
              <p style={{ fontFamily:FB, fontSize:14, color:G.green, lineHeight:1.65, fontWeight:600 }}>{step.tip}</p>
            </div>
            <div style={{ display:"flex", gap:12, marginTop:32 }}>
              {active > 0 && <button className="btn-outline" onClick={() => setActive(active-1)} style={{ flex:1, padding: '14px' }}>Previous</button>}
              {active < STEPS_DATA.length-1
                ? <button className="btn-primary" onClick={() => setActive(active+1)} style={{ flex:2, padding: '14px' }}>Continue</button>
                : <button className="btn-primary" style={{ flex:2, padding: '14px' }}>Book Now</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
