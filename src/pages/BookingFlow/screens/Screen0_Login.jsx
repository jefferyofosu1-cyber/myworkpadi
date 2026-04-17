import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBooking } from '../BookingContext';
import { G, FB, FD, SectionLabel } from './shared';
import { api } from '../../../utils/api';
import { ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';

export default function Screen0_Login() {
    const { goNext, setBookingData } = useBooking();
    const location = useLocation();
    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const contactParam = params.get('phone') || params.get('identifier');
        if (contactParam) {
            setIdentifier(contactParam);
        }
    }, [location]);

    const handleNext = async () => {
        setLoading(true);
        try {
            await api.post('/auth/trigger-otp', { identifier: identifier.trim() });
            setBookingData(prev => ({ ...prev, phone: identifier.trim() })); // keeping phone prop mapped in context for legacy backwards compat
            goNext();
        } catch (err) {
            alert(`Auth Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: G.gold, paddingTop: 80 }}>
            <div style={{ padding: "80px 40px", flex: 1, position: "relative", overflow: "hidden" }}>
                {/* Decorative Elements */}
                <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, alignItems: "center", position: "relative" }}>
                    {/* Left Column: Value Prop */}
                    <div className="fade-up">
                        <SectionLabel color={G.white}>Book a Professional</SectionLabel>
                        <h1 style={{ fontFamily: FD, fontWeight: 800, fontSize: 48, color: G.black, marginBottom: 20, letterSpacing: "-0.03em" }}>
                            Trusted Help.<br />Secured for You.
                        </h1>
                        <p style={{ fontFamily: FB, fontSize: 18, color: "rgba(0,0,0,0.65)", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                            Join thousands of homeowners in Accra who trust TaskGH for reliable repairs, cleaning, and more. 
                        </p>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {[
                                { icon: <ShieldCheck size={20} />, text: "Payments held in Escrow" },
                                { icon: <Zap size={20} />, text: "Vetted Professionals Only" },
                                { icon: <Heart size={20} />, text: "Happiness Guarantee" }
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

                    {/* Right Column: CTA Card */}
                    <div className="fade-up" style={{ background: G.white, borderRadius: 28, padding: 40, boxShadow: "0 24px 64px rgba(0,0,0,0.1)", border: `1px solid ${G.border}` }}>
                        <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.black, marginBottom: 12 }}>Get started now</h3>
                        <p style={{ fontFamily: FB, fontSize: 15, color: G.steel, marginBottom: 28 }}>Secure your booking with your phone or email.</p>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <label style={{ display: "block", fontFamily: FB, fontSize: 11, fontWeight: 800, color: G.black, marginBottom: 8, letterSpacing: '0.05em' }}>EMAIL OR PHONE</label>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <input 
                                        className="input"
                                        placeholder="user@gmail.com or +233..." 
                                        value={identifier} 
                                        onChange={e => setIdentifier(e.target.value)} 
                                        style={{ flex: 1, padding: "14px 18px", borderRadius: 14, border: `1.5px solid ${G.border}`, fontFamily: FB, fontSize: 15, outline: 'none' }} 
                                    />
                                </div>
                            </div>

                            <button 
                                className="btn btn-green" 
                                onClick={handleNext} 
                                disabled={identifier.length < 5 || loading}
                                style={{ padding: '16px', borderRadius: 14, fontSize: 16 }}
                            >
                                {loading ? (
                                    <div style={{ width: 24, height: 24, border: "3px solid rgba(255,255,255,0.3)", borderTopColor: G.white, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                ) : (
                                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>Continue to OTP <ArrowRight size={18} /></span>
                                )}
                            </button>
                            
                            <p style={{ textAlign: "center", fontSize: 12, color: G.mist, fontFamily: FB, marginTop: 4 }}>
                                We'll send a secure code to verify your account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Proof Section */}
            <div style={{ background: G.offWhite, padding: "60px 40px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 32, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Trusted by homeowners in these areas</p>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40, opacity: 0.5 }}>
                        {["East Legon", "Airport Hills", "Cantonments", "Osu", "Spintex", "Tema"].map(area => (
                            <span key={area} style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: G.black }}>{area}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
