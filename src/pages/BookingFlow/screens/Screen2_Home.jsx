import React, { useState } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BottomNav } from './shared';

export default function Screen2_Home() {
    const { setService, goNext, user } = useBooking();
    const [cat, setCat] = useState("All");
    
    const categories = ["All", "Electrical", "Plumbing", "Cleaning", "Security"];
    const services = [
      { abbr: "AC", name: "AC Repair", type: "assessment", price: "GHS 300", color: "#0EA5E9", hot: true },
      { abbr: "EL", name: "Electrical", type: "assessment", price: "GHS 300", color: "#F59E0B", hot: false },
      { abbr: "PL", name: "Plumbing", type: "assessment", price: "GHS 300", color: "#3B82F6", hot: true },
      { abbr: "CL", name: "House Cleaning", type: "fixed", price: "GHS 120", color: "#10B981", hot: false },
      { abbr: "PT", name: "Polytank Cleaning", type: "fixed", price: "GHS 80", color: "#06B6D4", hot: false },
      { abbr: "PA", name: "Painting", type: "assessment", price: "GHS 300", color: "#EC4899", hot: false },
    ];

    const handleSelectService = (svc) => {
        setService(svc);
        goNext();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <div style={{ background: G.green, padding: "44px 24px 24px", flexShrink: 0 }}>
                <StatusBar light />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 8 }}>
                    <div>
                        <p style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Welcome back</p>
                        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.white }}>{user?.full_name || 'Sandra Asante'}</h2>
                    </div>
                    <div style={{ position: "relative" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
                        <div style={{ position: "absolute", top: 8, right: 8, width: 10, height: 10, borderRadius: "50%", background: G.gold, border: "2px solid " + G.green }} />
                    </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.2)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <span style={{ fontFamily: FB, fontSize: 15, color: "rgba(255,255,255,0.7)" }}>Search services...</span>
                </div>
            </div>
            
            <div className="screen-content" style={{ background: G.cloud, flex: 1 }}>
                <div style={{ padding: "20px 24px 0", marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                        {categories.map(c => (
                            <button key={c} onClick={() => setCat(c)} style={{ padding: "8px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: FB, fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", background: cat === c ? G.green : G.white, color: cat === c ? G.white : G.steel, boxShadow: cat === c ? `0 3px 10px ${G.green}44` : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}>{c}</button>
                        ))}
                    </div>
                </div>
                
                <div style={{ padding: "0 24px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate }}>Popular Services</h3>
                        <span style={{ fontFamily: FB, fontSize: 13, color: G.green, fontWeight: 600 }}>See all</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
                        {services.map((svc, i) => (
                            <div key={i} className="service-card" onClick={() => handleSelectService(svc)} style={{ position: "relative" }}>
                                {svc.hot && <div style={{ position: "absolute", top: 10, right: 10, background: G.gold, color: G.white, fontFamily: FB, fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 20, letterSpacing: '0.05em' }}>HOT</div>}
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: svc.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FD, fontWeight: 800, fontSize: 16, color: svc.color, marginBottom: 10 }}>{svc.abbr}</div>
                                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 14, color: G.slate, marginBottom: 4 }}>{svc.name}</div>
                                <div style={{ fontFamily: FB, fontSize: 11, color: svc.type === "assessment" ? G.gold : G.green, fontWeight: 600, marginBottom: 8 }}>
                                    {svc.type === "assessment" ? "Assessment" : "Fixed Price"}
                                </div>
                                <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: G.green }}>{svc.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <BottomNav active="home" />
        </div>
    );
}
