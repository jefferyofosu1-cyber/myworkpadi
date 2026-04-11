import React, { useState, useEffect } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, StepBar } from './shared';

export default function Screen7_Tasker() {
    const { goNext, setSelectedTasker } = useBooking();
    const [matching, setMatching] = useState(true);
    
    const taskers = [
        { id: 1, name: "Kofi Mensah", rating: 4.8, jobs: 142, initials: "KM", bio: "Expert AC technician with 8 years experience." },
        { id: 2, name: "Emmanuel Tetteh", rating: 4.9, jobs: 89, initials: "ET", bio: "Certified HVAC professional. Quick & reliable." }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setMatching(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleSelect = (t) => {
        setSelectedTasker(t);
        goNext();
    };

    if (matching) {
        return (
            <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, background: G.greenDeep }}>
                <StatusBar light />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
                    <div style={{ position: "relative", width: 140, height: 140, marginBottom: 40 }}>
                        <div className="ping-ring" style={{ inset: 0, animationDuration: "2s" }} />
                        <div className="ping-ring" style={{ inset: 10, animationDuration: "2s", animationDelay: "0.5s" }} />
                        <div style={{ position: "absolute", inset: 40, background: G.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid rgba(255,255,255,0.2)" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
                    </div>
                    <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: G.white, marginBottom: 12 }}>Matching Taskers...</h2>
                    <p style={{ fontFamily: FB, fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>We're notifying the best-rated professionals near you in Accra.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "16px 24px 100px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, marginTop: 12 }}>
                    <StepBar step={4} total={4} label="Match Found" />
                </div>
                
                <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.slate, marginBottom: 24 }}>Select your Tasker</h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {taskers.map(t => (
                        <div key={t.id} className="tasker-card" onClick={() => handleSelect(t)}>
                            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                                <div style={{ width: 60, height: 60, borderRadius: 16, background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.green }}>{t.initials}</div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate, marginBottom: 2 }}>{t.name}</h3>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontFamily: FB, fontSize: 13, color: G.gold, fontWeight: 700 }}>{t.rating}</span>
                                        <span style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>({t.jobs} jobs)</span>
                                    </div>
                                </div>
                                <div style={{ background: G.greenPale, color: G.green, padding: "4px 10px", borderRadius: 8, height: "fit-content", fontFamily: FB, fontWeight: 700, fontSize: 11 }}>TOP-RATED</div>
                            </div>
                            <p style={{ fontFamily: FB, fontSize: 13, color: G.steel, lineHeight: 1.5 }}>"{t.bio}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
