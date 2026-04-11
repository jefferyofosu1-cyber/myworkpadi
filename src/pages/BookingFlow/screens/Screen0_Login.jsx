import React, { useState } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar } from './shared';
import { api } from '../../../utils/api';

export default function Screen0_Login() {
    const { goNext, setBookingData } = useBooking();
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        setLoading(true);
        try {
            await api.post('/auth/trigger-otp', { identifier: `+233${phone}` });
            setBookingData(prev => ({ ...prev, phone: `+233${phone}` }));
            goNext();
        } catch (err) {
            alert(`Auth Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar light />
            <div style={{ flex: 1, background: `linear-gradient(170deg, ${G.greenDeep} 0%, ${G.green} 55%, #0D8559 100%)`, padding: "32px 24px 40px", display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "absolute", top: 80, left: -30, width: 140, height: 140, borderRadius: "50%", background: G.gold + "18" }} />
                <div className="screen-enter">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
                        <svg width={40} height={40} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="11" fill="rgba(255,255,255,0.2)" /><path d="M13 27L21 19" stroke={G.gold} strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="16" r="5" stroke="white" strokeWidth="2.2" fill="none" /><path d="M20 20L14.5 25.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" /><path d="M21 15.5L23 17.5L27 13.5" stroke={G.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.white }}>TaskGH</span>
                    </div>
                    <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 34, color: G.white, lineHeight: 1.15, marginBottom: 10, letterSpacing: "-0.02em" }}>Trusted Help<br />for Your Home</h1>
                    <p style={{ fontFamily: FB, fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: 32 }}>Book vetted Taskers in Accra. Payments protected until you're satisfied.</p>
                    <div style={{ background: G.white, borderRadius: 20, padding: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
                        <p style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate, marginBottom: 12 }}>Enter your phone number to continue</p>
                        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                            <div style={{ background: G.cloud, borderRadius: 14, border: `1.5px solid ${G.border}`, padding: "14px 14px", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                                <span style={{ fontSize: 16 }}>🇬🇭</span>
                                <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate }}>+233</span>
                            </div>
                            <input className="input" placeholder="0XX XXX XXXX" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1, fontSize: 16 }} />
                        </div>
                        <button className="btn btn-green" onClick={handleNext} disabled={phone.length < 9}>
                            {loading ? <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: G.white, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "Send OTP →"}
                        </button>
                        <p style={{ fontFamily: FB, fontSize: 11, color: G.mist, textAlign: "center", marginTop: 10 }}>We'll send a code via SMS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
