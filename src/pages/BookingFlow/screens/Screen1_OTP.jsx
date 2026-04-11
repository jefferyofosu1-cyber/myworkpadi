import React, { useState, useRef } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BackBtn } from './shared';
import { api } from '../../../utils/api';

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
                
                // Store session
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
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "20px 24px 40px" }}>
                <BackBtn onBack={goBack} />
                <div style={{ marginTop: 32, marginBottom: 36, textAlign: "center" }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                    <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: G.slate, marginBottom: 8 }}>Enter OTP</h2>
                    <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, lineHeight: 1.6 }}>We sent a code to<br /><strong style={{ color: G.slate }}>{bookingData.phone || '+233 054 *** 6712'}</strong></p>
                </div>
                
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 32 }}>
                    {otp.map((d, i) => (
                        <input 
                            key={i} 
                            ref={el => refs.current[i] = el} 
                            className={`otp-input ${d ? "filled" : ""}`} 
                            maxLength={1} 
                            value={d} 
                            onChange={e => handleChange(i, e.target.value)} 
                            onKeyDown={e => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()} 
                            disabled={isLoading}
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

                <button className="btn btn-outline" style={{ marginBottom: 16 }}>Resend Code</button>
                <p style={{ fontFamily: FB, fontSize: 12, color: G.mist, textAlign: "center" }}>Check your SMS inbox for the TaskGH code.</p>
            </div>
        </div>
    );
}
