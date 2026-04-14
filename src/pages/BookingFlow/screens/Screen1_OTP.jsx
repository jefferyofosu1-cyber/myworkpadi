import React, { useState, useRef } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, SectionLabel, BackBtn } from './shared';
import { api } from '../../../utils/api';
import { ShieldCheck, MessageSquare, Lock } from 'lucide-react';

export default function Screen1_OTP() {
    const { goNext, goBack, bookingData, setUser } = useBooking();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [verified, setVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const refs = useRef([]);

    const handleChange = async (i, val) => {
        const v = val.replace(/\D/, "");
        const next = [...otp]; 
        next[i] = v; 
        setOtp(next);
        
        if (v && i < 5) refs.current[i + 1]?.focus();
        
        if (next.every(d => d !== "") && !verified) {
            setIsLoading(true);
            try {
                const result = await api.post('/auth/verify-otp', { 
                    identifier: bookingData.phone, 
                    token: next.join('') 
                });
                
                localStorage.setItem('taskgh_token', result.token);
                localStorage.setItem('taskgh_user_id', result.user.id);
                setUser(result.user);
                
                setVerified(true);
                setTimeout(goNext, 800);
            } catch (err) {
                alert(`Verification Error: ${err.message}`);
                setOtp(["", "", "", "", "", ""]);
                refs.current[0]?.focus();
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: G.gold, paddingTop: 80 }}>
            <div style={{ padding: "80px 40px", flex: 1, position: "relative", overflow: "hidden" }}>
                {/* Decorative Elements */}
                <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, alignItems: "center", position: "relative" }}>
                    {/* Left Column: Context */}
                    <div className="fade-up">
                        <div style={{ marginBottom: 24 }}>
                            <BackBtn onBack={goBack} light />
                        </div>
                        <SectionLabel color={G.white}>Account Verification</SectionLabel>
                        <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 48, color: G.black, marginBottom: 20, letterSpacing: "-0.03em" }}>
                            Security First.<br />Always.
                        </h1>
                        <p style={{ fontFamily: FB, fontSize: 18, color: "rgba(0,0,0,0.65)", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                            We've sent a 6-digit verification code to your phone to ensure your account and bookings remain secure.
                        </p>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {[
                                { icon: <MessageSquare size={20} />, text: `Sent to ${bookingData.phone}` },
                                { icon: <Lock size={20} />, text: "Single-use secure token" },
                                { icon: <ShieldCheck size={20} />, text: "Verified booking profile" }
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: G.green }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ fontFamily: FB, fontSize: 16, fontWeight: 700, color: G.black }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: OTP Card */}
                    <div className="fade-up" style={{ background: G.white, borderRadius: 28, padding: 40, boxShadow: "0 24px 64px rgba(0,0,0,0.1)", border: `1px solid ${G.border}` }}>
                        <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.black, marginBottom: 12 }}>Check your messages</h3>
                        <p style={{ fontFamily: FB, fontSize: 15, color: G.steel, marginBottom: 28 }}>Enter the code sent to your mobile device.</p>
                        
                        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 32 }}>
                            {otp.map((d, i) => (
                                <input 
                                    key={i} 
                                    ref={el => refs.current[i] = el} 
                                    className={`otp-input ${d ? "filled" : ""}`} 
                                    style={{ 
                                        width: "100%", maxWidth: 50, height: 64, borderRadius: 14, border: `2px solid ${G.border}`, 
                                        textAlign: "center", fontFamily: FD, fontWeight: 800, fontSize: 24, background: G.offWhite,
                                        transition: "all 0.2s"
                                    }}
                                    maxLength={1} 
                                    value={d} 
                                    onChange={e => handleChange(i, e.target.value)} 
                                    onKeyDown={e => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()} 
                                    disabled={isLoading || verified}
                                />
                            ))}
                        </div>

                        {isLoading && (
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <div style={{ width: 24, height: 24, border: `3px solid ${G.border}`, borderTopColor: G.green, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: '0 auto' }} />
                            </div>
                        )}

                        {verified && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, background: G.greenPale, borderRadius: 14, padding: "14px 18px", marginBottom: 20, animation: "fadeIn 0.3s ease" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: G.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width={14} height={14} viewBox="0 0 14 14"><path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                                </div>
                                <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.green }}>Verified! Signing you in...</span>
                            </div>
                        )}

                        <button className="btn btn-outline" style={{ width: "100%", padding: "16px", borderRadius: 14, marginBottom: 16 }}>Resend Code</button>
                        <p style={{ fontFamily: FB, fontSize: 12, color: G.mist, textAlign: "center" }}>Didn't receive a code? Resend available in 30s.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
