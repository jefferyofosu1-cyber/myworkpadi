import React from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BackBtn } from './shared';

export default function Screen3_ServiceDetail() {
    const { service, goNext, goBack } = useBooking();
    
    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <div style={{ background: G.greenDeep, height: 260, position: "relative", flexShrink: 0 }}>
                <div style={{ padding: "12px 24px" }}><StatusBar light /></div>
                <div style={{ padding: "0 24px" }}><BackBtn onBack={goBack} light /></div>
                <div className="float" style={{ position: "absolute", bottom: -40, left: 24, width: 90, height: 90, borderRadius: 28, background: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
                    {service.icon}
                </div>
            </div>
            
            <div className="screen-content" style={{ padding: "60px 24px 100px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                        <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: G.slate, marginBottom: 4 }}>{service.name}</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 14, color: G.gold }}>&#9733;</span>)}</div>
                            <span style={{ fontFamily: FB, fontSize: 13, color: G.mist }}>4.9 (120+ reviews)</span>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <span style={{ fontFamily: FB, fontSize: 12, color: G.mist, display: "block" }}>Starts from</span>
                        <strong style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.green }}>{service.price}</strong>
                    </div>
                </div>

                <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px", display: "flex", gap: 14, marginBottom: 24 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontFamily: FD, fontWeight: 700, fontSize: 14, color: G.green, marginBottom: 2 }}>Happiness Guarantee</h4>
                        <p style={{ fontFamily: FB, fontSize: 12, color: G.slate, opacity: 0.8, lineHeight: 1.5 }}>Your payment is held in escrow and only released once you confirm the job is done perfectly.</p>
                    </div>
                </div>

                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, color: G.slate, marginBottom: 12 }}>What's Included</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                    {["Vetted & Background checked professionals", "On-site assessment & digital quote", "TaskGH Escrow protection", "24/7 Support mediation"].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: G.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width={10} height={10} viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                            </div>
                            <span style={{ fontFamily: FB, fontSize: 14, color: G.steel }}>{item}</span>
                        </div>
                    ))}
                </div>

                <button className="btn btn-green" onClick={goNext} style={{ position: "fixed", bottom: 24, left: "5%", width: "90%", zIndex: 10 }}>
                    Book Service Now →
                </button>
            </div>
        </div>
    );
}
