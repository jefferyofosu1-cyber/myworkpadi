import React, { useState, useEffect } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BottomNav } from './shared';

export default function Screen12_InProgress() {
    const { goNext, selectedTasker } = useBooking();
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(goNext, 1500);
                    return 100;
                }
                return p + 10;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "16px 24px 100px" }}>
                <div style={{ padding: "40px 0 32px", textAlign: "center" }}>
                    <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 32px" }}>
                        <svg width="120" height="120" viewBox="0 0 120 120 shadow-lg">
                            <circle cx="60" cy="60" r="54" fill="none" stroke={G.cloud} strokeWidth="8" />
                            <circle cx="60" cy="60" r="54" fill="none" stroke={G.green} strokeWidth="8" strokeDasharray="339.29" strokeDashoffset={339.29 - (339.29 * progress) / 100} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
                        </svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
                    </div>
                    <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: G.slate, marginBottom: 8 }}>Work in Progress</h2>
                    <p style={{ fontFamily: FB, fontSize: 15, color: G.steel }}>{selectedTasker?.name || 'Kofi'} is working on your {service.name}.</p>
                </div>

                <div style={{ background: G.white, borderRadius: 24, border: `1.5px solid ${G.border}`, padding: "20px", marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                        <div className="shimmer" style={{ width: 44, height: 44, borderRadius: 12 }} />
                        <div style={{ flex: 1 }}>
                            <div className="shimmer" style={{ width: "60%", height: 12, marginBottom: 8 }} />
                            <div className="shimmer" style={{ width: "40%", height: 10 }} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <div className="shimmer" style={{ flex: 1, height: 80, borderRadius: 12 }} />
                        <div className="shimmer" style={{ flex: 1, height: 80, borderRadius: 12 }} />
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, background: G.goldPale, padding: "16px", borderRadius: 16 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <p style={{ fontFamily: FB, fontSize: 12, color: "#856404", lineHeight: 1.5, fontWeight: 600 }}>Happiness Guarantee active: You approve payment only after inspection.</p>
                </div>
            </div>
            <BottomNav active="jobs" />
        </div>
    );
}
