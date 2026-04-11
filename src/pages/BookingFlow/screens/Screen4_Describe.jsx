import React from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BackBtn, StepBar } from './shared';
import { Video, ArrowRight } from 'lucide-react';

export default function Screen4_Describe() {
    const { goNext, goBack, bookingData, setBookingData } = useBooking();

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "16px 24px 100px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <BackBtn onBack={goBack} />
                    <StepBar step={1} total={4} label="Problem Details" />
                </div>

                <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.slate, marginBottom: 8 }}>Describe the issue</h2>
                <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 24 }}>Provide as much detail as possible to help the Tasker understand the work.</p>

                <div style={{ marginBottom: 24 }}>
                    <label style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.slate, display: "block", marginBottom: 8 }}>What needs to be fixed?</label>
                    <textarea 
                        className="input" 
                        placeholder="e.g. My AC is making a loud noise and not cooling properly..." 
                        rows={6} 
                        value={bookingData.problemDescription} 
                        onChange={e => setBookingData(p => ({ ...p, problemDescription: e.target.value }))}
                    />
                </div>

                <div style={{ marginBottom: 32 }}>
                    <label style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.slate, display: "block", marginBottom: 12 }}>Add Photos (Recommended)</label>
                    <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ width: 100, height: 100, borderRadius: 16, border: `2px dashed ${G.border}`, background: G.cloud, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G.mist} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            <span style={{ fontFamily: FB, fontSize: 10, color: G.mist, fontWeight: 700 }}>ADD PHOTO</span>
                        </div>
                        <div style={{ width: 100, height: 100, borderRadius: 16, border: `2px dashed ${G.border}`, background: G.cloud, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <Video size={28} color={G.mist} style={{ marginBottom: 4 }} />
                            <span style={{ fontFamily: FB, fontSize: 10, color: G.mist, fontWeight: 700 }}>ADD VIDEO</span>
                        </div>
                    </div>
                </div>

                <div style={{ background: G.goldPale, borderRadius: 16, padding: "16px", display: "flex", gap: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
                    <p style={{ fontFamily: FB, fontSize: 12, color: "#856404", lineHeight: 1.5 }}>Clear descriptions and photos help you get more accurate quotes faster.</p>
                </div>

                <button className="btn btn-green" onClick={goNext} disabled={!bookingData.problemDescription} style={{ position: "fixed", bottom: 24, left: "5%", width: "90%", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    Continue <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
