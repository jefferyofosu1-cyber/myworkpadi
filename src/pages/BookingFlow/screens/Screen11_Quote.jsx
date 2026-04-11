import React from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, StepBar, BottomNav } from './shared';
import { FileText, ArrowRight } from 'lucide-react';

export default function Screen11_Quote() {
    const { goNext, service } = useBooking();
    
    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "16px 24px 100px" }}>
                <div style={{ padding: "20px 0 32px", textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: G.goldPale, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <FileText size={32} color={G.gold} />
                    </div>
                    <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.slate, marginBottom: 8 }}>Service Quote</h2>
                    <p style={{ fontFamily: FB, fontSize: 14, color: G.steel }}>The Tasker has inspected the issue and provided a finalized quote.</p>
                </div>

                <div style={{ background: G.white, borderRadius: 24, border: `1.5px solid ${G.border}`, padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: 24 }}>
                    <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate, marginBottom: 20 }}>Work Breakdown</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: FB, fontSize: 14, color: G.steel }}>Labor Cost</span>
                            <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate }}>GHS 150.00</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: FB, fontSize: 14, color: G.steel }}>Spare Parts (Capacitor)</span>
                            <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate }}>GHS 80.00</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: FB, fontSize: 14, color: G.steel }}>Service Fee</span>
                            <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate }}>GHS 20.00</span>
                        </div>
                        <div style={{ height: 1, background: G.border, margin: "4px 0" }} />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 16, color: G.slate }}>Total Final Quote</span>
                            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: G.green }}>GHS 250.00</span>
                        </div>
                    </div>
                </div>

                <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px", display: "flex", gap: 12, marginBottom: 32 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <p style={{ fontFamily: FB, fontSize: 12, color: G.green, fontWeight: 600, lineHeight: 1.5 }}>Happiness Guarantee: You only approve this payment when the job is completed to your satisfaction.</p>
                </div>

                <div style={{ display: "flex", gap: 12, position: "fixed", bottom: 24, left: "5%", width: "90%", zIndex: 10 }}>
                    <button className="btn btn-light" style={{ flex: 1 }}>Decline</button>
                    <button className="btn btn-green" onClick={goNext} style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        Approve Quote <ArrowRight size={18} />
                    </button>
                </div>
            </div>
            <BottomNav active="jobs" />
        </div>
    );
}
