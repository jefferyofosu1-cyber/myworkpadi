import React, { useState } from 'react';
import { G, FH, FB } from '../constants/theme';

const SectionLabel = ({ children, color = G.green }) => (
  <div style={{ fontFamily:FB, fontSize:11, color, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:8 }}>{children}</div>
);

export default function BecomeATaskerPage() {
  return (
    <div className="page-enter" style={{ paddingTop:80 }}>
      {/* Hero */}
      <div style={{ background: G.gold, padding: "80px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, alignItems: "center", position: "relative" }}>
          <div className="fade-up">
            <SectionLabel color={G.white}>For Professionals</SectionLabel>
            <h1 style={{ fontFamily: FH, fontWeight: 800, fontSize: 48, color: G.black, marginBottom: 20, letterSpacing: "-0.03em" }}>
              Be Your Own Boss.<br />Earn on Your Terms.
            </h1>
            <p style={{ fontFamily: FB, fontSize: 18, color: "rgba(0,0,0,0.65)", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              Join Accra's most trusted network of skilled professionals. Same-day MoMo payments, flexible hours, and pre-qualified leads delivered to your phone.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {["Same-day MoMo Pay", "Total Flexibility", "Verified Jobs"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.06)", padding: "10px 20px", borderRadius: 100, border: "1px solid rgba(0,0,0,0.1)" }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: G.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: G.white }}>✓</div>
                  <span style={{ fontFamily: FB, fontSize: 14, fontWeight: 700, color: G.black }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up" style={{ background: G.white, borderRadius: 28, padding: 40, boxShadow: "0 24px 64px rgba(0,0,0,0.1)", border: `1px solid ${G.border}` }}>
            <h3 style={{ fontFamily: FH, fontWeight: 800, fontSize: 24, color: G.black, marginBottom: 12 }}>Apply in 60 seconds</h3>
            <p style={{ fontFamily: FB, fontSize: 15, color: G.steel, marginBottom: 28 }}>Tell us your skills and we'll start your vetting process today.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontFamily: FB, fontSize: 11, fontWeight: 800, color: G.black, marginBottom: 8, letterSpacing: '0.05em' }}>FULL NAME</label>
                <input placeholder="Enter your name" style={{ width: "100%", padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${G.border}`, fontFamily: FB, fontSize: 15, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: FB, fontSize: 11, fontWeight: 800, color: G.black, marginBottom: 8, letterSpacing: '0.05em' }}>PHONE NUMBER</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ padding: "14px 16px", borderRadius: 14, background: G.offWhite, color: G.steel, fontSize: 15, fontFamily: FB, fontWeight: 700, border: `1.5px solid ${G.border}` }}>+233</div>
                  <input placeholder="e.g. 54 123 4567" style={{ flex: 1, padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${G.border}`, fontFamily: FB, fontSize: 15, outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: FB, fontSize: 11, fontWeight: 800, color: G.black, marginBottom: 8, letterSpacing: '0.05em' }}>PRIMARY SKILL</label>
                <select style={{ width: "100%", padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${G.border}`, fontFamily: FB, fontSize: 15, background: G.white, outline: 'none' }}>
                   <option>AC Repair</option>
                   <option>Plumbing</option>
                   <option>Electrical</option>
                   <option>Cleaning</option>
                   <option>Carpentry</option>
                </select>
              </div>
              <button className="btn-primary" style={{ marginTop: 12, padding: '16px', background: G.black }}>Submit Application</button>
              <p style={{ textAlign: "center", fontSize: 12, color: G.mist, fontFamily: FB, marginTop: 4 }}>By clicking submit, you agree to our Tasker Terms.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: G.offWhite, padding: "100px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {[
              { title: "Boost Your Earnings", desc: "Our top taskers earn over GHS 4,000 monthly. We handle the marketing, you handle the work." },
              { title: "Work When You Want", desc: "Use the TaskGH app to toggle 'Available' to receive leads or 'Away' when you're busy." },
              { title: "Get Paid Safely", desc: "No more chasing clients for payment. Escrow ensures you get paid promptly for every job." },
            ].map((b, i) => (
              <div key={i} style={{ padding: 40, background: G.white, borderRadius: 24, border: `1px solid ${G.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: G.greenPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FH, fontWeight: 800, fontSize: 14, color: G.green, marginBottom: 24 }}>
                  0{i+1}
                </div>
                <h3 style={{ fontFamily: FH, fontWeight: 800, fontSize: 22, color: G.black, marginBottom: 16 }}>{b.title}</h3>
                <p style={{ fontFamily: FB, fontSize: 16, color: G.steel, lineHeight: 1.75 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
