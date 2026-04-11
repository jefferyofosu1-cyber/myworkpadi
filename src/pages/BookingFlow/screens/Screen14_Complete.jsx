import React from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar } from './shared';
import { useNavigate } from 'react-router-dom';

export default function Screen14_Complete() {
    const { bookingId } = useBooking();
    const navigate = useNavigate();

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, background: `linear-gradient(135deg, ${G.greenDeep} 0%, ${G.green} 100%)` }}>
            <StatusBar light />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
                <div style={{ position: "relative", marginBottom: 40 }}>
                    <div style={{ width: 120, height: 120, background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                    <div style={{ position: "absolute", top: -10, right: -10, width: 44, height: 44, background: G.gold, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${G.green}` }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                </div>
                
                <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 32, color: G.white, marginBottom: 12, lineHeight: 1.1 }}>Job Successfully Completed</h2>
                <p style={{ fontFamily: FB, fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 40, maxWidth: 280 }}>Thank you for using TaskGH. Your home is now in great shape!</p>

                <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 24, padding: "24px", width: "100%", marginBottom: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <span style={{ fontFamily: FB, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Booking ID</span>
                        <span style={{ fontFamily: FB, color: G.white, fontWeight: 700 }}>#{bookingId || 'TASK-8802'}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: FB, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Status</span>
                        <span style={{ background: G.gold, color: G.white, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>RELEASED</span>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
                    <button className="btn btn-green" style={{ background: G.white, color: G.green }} onClick={() => navigate('/')}>Return to Home</button>
                    <button className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.3)", color: G.white }}>Download Receipt</button>
                </div>
            </div>
            
            <p style={{ fontFamily: FB, fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", padding: 24 }}>© 2026 TaskGH Ghana. All rights reserved.</p>
        </div>
    );
}
