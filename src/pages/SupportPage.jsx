import React, { useState } from 'react';
import { G, FH, FB } from '../constants/theme';
import { SUPPORT_CHANNELS, SUPPORT_FAQS } from '../constants/data';

const SectionLabel = ({ children, color = G.green }) => (
  <div style={{ fontFamily:FB, fontSize:11, color, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:8 }}>{children}</div>
);

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="page-enter" style={{ paddingTop:80 }}>
      {/* Hero */}
      <div style={{ background: G.black, padding: "80px 40px", textAlign: "center", position: "relative" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <SectionLabel color={G.gold}>Get in Touch</SectionLabel>
          <h1 style={{ fontFamily: FH, fontWeight: 800, fontSize: 44, color: G.white, marginBottom: 16, letterSpacing: '-0.02em' }}>How can we help?</h1>
          <p style={{ fontFamily: FB, fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
            Our support team is based in Accra and ready to assist you via WhatsApp, phone, or email.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px" }}>
        {/* Support Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 100 }}>
          {SUPPORT_CHANNELS.map((ch, i) => (
            <div key={i} style={{ background: G.white, border: `1.5px solid ${G.border}`, borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ width: 48, height: 48, background: G.greenPale, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FH, fontWeight: 800, fontSize: 16, color: G.green, marginBottom: 24 }}>
                0{i+1}
              </div>
              <h3 style={{ fontFamily: FH, fontWeight: 800, fontSize: 20, color: G.black, marginBottom: 10 }}>{ch.name}</h3>
              <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, lineHeight: 1.65, marginBottom: 24, flex: 1 }}>{ch.desc}</p>
              <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 800, color: G.gold, marginBottom: 16, textTransform: "uppercase", letterSpacing: '0.05em' }}>{ch.available}</div>
              <button style={{ 
                width: "100%", padding: "14px", borderRadius: 12, border: `1.5px solid ${G.border}`,
                background: G.offWhite, color: G.black, fontFamily: FB, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: 'all 0.2s'
              }}>{ch.action}</button>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 style={{ fontFamily: FH, fontWeight: 800, fontSize: 36, color: G.black, letterSpacing: '-0.02em' }}>Common Questions</h2>
          </div>

          <div style={{ border: `1px solid ${G.border}`, borderRadius: 24, overflow: "hidden", background: G.white, boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            {SUPPORT_FAQS.map((f, i) => (
              <div key={i} style={{ borderBottom: i < SUPPORT_FAQS.length-1 ? `1px solid ${G.border}` : "none" }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "24px 32px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}
                >
                  <div>
                    <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 800, color: G.green, background: G.greenPale, padding: "3px 10px", borderRadius: 6, marginRight: 14, verticalAlign: "middle", letterSpacing: '0.05em' }}>{f.cat}</span>
                    <span style={{ fontFamily: FH, fontWeight: 700, fontSize: 17, color: openFaq===i ? G.green : G.black }}>{f.q}</span>
                  </div>
                  <span style={{ fontSize: 24, color: G.mist, transform: openFaq===i ? "rotate(45deg)" : "none", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="fade-up" style={{ padding: "0 32px 32px 32px", fontFamily: FB, fontSize: 16, color: G.steel, lineHeight: 1.8 }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Happiness Guarantee */}
        <div style={{ marginTop: 100, background: G.offWhite, border: `1px solid ${G.border}`, borderRadius: 32, padding: 64, textAlign: "center", position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: G.gold }} />
           <h3 style={{ fontFamily: FH, fontWeight: 800, fontSize: 32, color: G.black, marginBottom: 16 }}>The TaskGH Happiness Guarantee</h3>
           <p style={{ fontFamily: FB, fontSize: 18, color: G.steel, lineHeight: 1.75, maxWidth: 640, margin: "0 auto" }}>
              If you're not satisfied with a job, we'll send another Tasker to fix it for free — or refund your money in full. Your peace of mind is our highest priority.
           </p>
        </div>
      </div>
    </div>
  );
}
