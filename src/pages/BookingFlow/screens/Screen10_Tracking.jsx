import React, { useState, useEffect } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BottomNav } from './shared';

export default function Screen10_Tracking() {
    const { goNext, selectedTasker } = useBooking();
    const [status, setStatus] = useState("Tasker arriving");

    useEffect(() => {
        const t1 = setTimeout(() => setStatus("Arrived at location"), 4000);
        const t2 = setTimeout(goNext, 6000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <div className="map-area" style={{ flex: 1, borderRadius: 0 }}>
                <StatusBar />
                <div style={{ position: "absolute", inset: 0, padding: 24, pointerEvents: "none" }}>
                   <div style={{ background: G.white, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: G.shadowMd, pointerEvents: "auto", border: "1.5px solid " + G.green }}>
                       <div style={{ width: 12, height: 12, borderRadius: "50%", background: G.green, position: "relative" }}>
                           <div className="ping-ring" style={{ inset: -6 }} />
                       </div>
                       <div>
                           <p style={{ fontFamily: FD, fontWeight: 700, fontSize: 13, color: G.green, textTransform: "uppercase", letterSpacing: 0.5 }}>{status}</p>
                           <p style={{ fontFamily: FB, fontSize: 14, color: G.slate, fontWeight: 600 }}>ETA: 4 mins away</p>
                       </div>
                   </div>
                </div>
                
                <div style={{ position: "absolute", top: "55%", left: "45%", width: 50, height: 50, borderRadius: "50%", background: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 10px 25px rgba(0,0,0,0.2)", border: "2px solid " + G.green }}>
                    <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 14, color: G.green }}>{selectedTasker?.initials || 'KM'}</div>
                    <div className="ping-ring" style={{ inset: -20, opacity: 0.4 }} />
                </div>
            </div>

            <div style={{ background: G.white, padding: "24px 24px 110px", borderRadius: "28px 28px 0 0", boxShadow: "0 -10px 40px rgba(0,0,0,0.08)", position: "relative", zIndex: 10 }}>
                <div style={{ width: 40, height: 4, background: G.border, borderRadius: 2, margin: "0 auto 24px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.green }}>{selectedTasker?.initials || 'KM'}</div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.slate }}>{selectedTasker?.name || 'Kofi Mensah'}</h3>
                        <p style={{ fontFamily: FB, fontSize: 14, color: G.mist }}>Expert AC Technician</p>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: G.goldPale, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                    </div>
                </div>
                <div style={{ background: G.cloud, borderRadius: 16, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span style={{ fontFamily: FB, fontSize: 13, color: G.slate, fontWeight: 600 }}>TaskGH Escrow Protection</span>
                    </div>
                    <span style={{ fontFamily: FB, fontSize: 12, color: G.green, fontWeight: 700 }}>ACTIVE</span>
                </div>
            </div>
            <BottomNav active="jobs" />
        </div>
    );
}
