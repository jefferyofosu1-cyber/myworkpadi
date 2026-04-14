import React, { useState } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, SectionLabel, BottomNav } from './shared';
import { Search, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Screen2_Home() {
    const { setService, goNext, user } = useBooking();
    const [cat, setCat] = useState("All");
    
    const categories = ["All", "Electrical", "Plumbing", "Cleaning", "Security"];
    const services = [
      { abbr: "AC", name: "AC Repair", type: "assessment", price: "GHS 300", color: "#0EA5E9", hot: true, desc: "Installation, repair and general servicing." },
      { abbr: "EL", name: "Electrical", type: "assessment", price: "GHS 300", color: "#F59E0B", hot: false, desc: "Wiring, fixtures, and fault detection." },
      { abbr: "PL", name: "Plumbing", type: "assessment", price: "GHS 300", color: "#3B82F6", hot: true, desc: "Leaks, blockage, and pipe installations." },
      { abbr: "CL", name: "House Cleaning", type: "fixed", price: "GHS 120", color: "#10B981", hot: false, desc: "Deep cleaning for homes and offices." },
      { abbr: "PT", name: "Polytank Cleaning", type: "fixed", price: "GHS 80", color: "#06B6D4", hot: false, desc: "Professional tank de-sludging." },
      { abbr: "PA", name: "Painting", type: "assessment", price: "GHS 300", color: "#EC4899", hot: false, desc: "Interior and exterior wall finishes." },
    ];

    const handleSelectService = (svc) => {
        setService(svc);
        goNext();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: G.white, paddingTop: 80 }}>
            {/* Premium Header / Hero Section */}
            <div style={{ background: G.gold, padding: "60px 40px 40px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                
                <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap" }}>
                        <div>
                            <SectionLabel color={G.white}>Welcome to TaskGH</SectionLabel>
                            <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 36, color: G.black, letterSpacing: "-0.02em", marginBottom: 8 }}>
                                What can we help<br />you with, {user?.full_name?.split(' ')[0] || 'Sandra'}?
                            </h2>
                            <p style={{ fontFamily: FB, fontSize: 16, color: "rgba(0,0,0,0.6)", maxWidth: 400 }}>
                                Select a service below to be matched with a verified professional in your area.
                            </p>
                        </div>
                        
                        {/* Search Bar */}
                        <div style={{ background: G.white, borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${G.border}`, width: "100%", maxWidth: 360, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                            <Search size={20} color={G.mist} />
                            <input 
                                placeholder="Search for AC, Cleaning..." 
                                style={{ border: "none", outline: "none", fontFamily: FB, fontSize: 15, width: "100%", color: G.slate }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, padding: "40px 40px 100px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    {/* Categories UI */}
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 32, scrollbarWidth: "none" }}>
                        {categories.map(c => (
                            <button 
                                key={c} 
                                onClick={() => setCat(c)} 
                                style={{ 
                                    padding: "10px 24px", borderRadius: 100, border: cat === c ? `2px solid ${G.green}` : `1.5px solid ${G.border}`, 
                                    cursor: "pointer", fontFamily: FB, fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", 
                                    background: cat === c ? G.green : G.white, color: cat === c ? G.white : G.steel, 
                                    boxShadow: cat === c ? `0 8px 16px ${G.green}33` : "none", transition: "all 0.2s" 
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.black }}>Verified Services</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: G.green, fontWeight: 700, fontSize: 14 }}>
                            <Sparkles size={16} /> Featured Pros
                        </div>
                    </div>

                    {/* Premium Service Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                        {services.map((svc, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleSelectService(svc)} 
                                style={{ 
                                    background: G.white, borderRadius: 24, padding: 32, border: `1.5px solid ${G.border}`, 
                                    cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", position: "relative",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: 16
                                }}
                                className="service-card-premium"
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{ width: 56, height: 56, borderRadius: 16, background: svc.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FD, fontWeight: 800, fontSize: 20, color: svc.color }}>
                                        {svc.abbr}
                                    </div>
                                    {svc.hot && (
                                        <div style={{ background: G.gold, color: G.black, fontFamily: FB, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20, letterSpacing: '0.05em' }}>
                                            TRENDING
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <h4 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.black, marginBottom: 4 }}>{svc.name}</h4>
                                    <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, lineHeight: 1.5 }}>{svc.desc}</p>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                                    {svc.type === "assessment" ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: G.goldPale, color: "#92400E", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                                            <ShieldCheck size={14} /> Assessment
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: G.greenPale, color: G.green, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                                            <Zap size={14} /> Fixed Price
                                        </div>
                                    )}
                                    <div style={{ marginLeft: "auto", fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.green }}>{svc.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Block */}
                    <div style={{ marginTop: 64, padding: 40, borderRadius: 32, background: G.offWhite, border: `1px solid ${G.border}`, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
                        <div>
                            <h5 style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.black, marginBottom: 12 }}>Happiness Guarantee</h5>
                            <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, lineHeight: 1.6 }}>If the job isn't done right, we'll make it right at no extra cost to you.</p>
                        </div>
                        <div>
                            <h5 style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.black, marginBottom: 12 }}>Secured Payments</h5>
                            <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, lineHeight: 1.6 }}>Your funds stay in escrow until you verify the work is completed to your satisfaction.</p>
                        </div>
                    </div>
                </div>
            </div>

            <BottomNav active="home" />

            <style>{`
                .service-card-premium:hover {
                    transform: translateY(-8px);
                    border-color: ${G.green}33;
                    box-shadow: 0 20px 40px rgba(10, 110, 74, 0.08);
                }
            `}</style>
        </div>
    );
}
