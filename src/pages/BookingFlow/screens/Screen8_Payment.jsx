import React from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BackBtn, StepBar } from './shared';
import { api } from '../../../utils/api';
import { ShieldCheck, Info, Lock, ArrowRight, Check } from 'lucide-react';

export default function Screen8_Payment() {
    const { goNext, goBack, service, provider, setProvider, bookingData, isProcessing, setIsProcessing, bookingId } = useBooking();

    const providers = [
        { id: "mtn", name: "MTN MoMo", icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg" },
        { id: "telecel", name: "Telecel Cash", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Telecel_Logo.svg" },
        { id: "at", name: "AT Money", icon: "https://upload.wikimedia.org/wikipedia/commons/2/23/AT_logo_Ghana.png" }
    ];

    const amountGHS = service.type === "assessment" ? 25.00 : 0.00;

    const handlePay = async () => {
        setIsProcessing(true);
        try {
            // Simulated payment delay (Paystack integration removed)
            await new Promise(res => setTimeout(res, 1500));
            goNext();
        } catch (err) {
            console.error("Payment Error:", err);
            goNext();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, background: G.white }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "16px 24px 140px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <BackBtn onBack={goBack} />
                    <StepBar step={4} total={4} label="Secure Payment" />
                </div>
                
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: G.ink, marginBottom: 8, letterSpacing: "-0.02em" }}>Secure Booking</h2>
                    <p style={{ fontFamily: FB, fontSize: 15, color: G.steel, lineHeight: 1.5 }}>Your funds stay safe in escrow until the job is done.</p>
                </div>

                <div style={{ background: G.cloud, borderRadius: 24, padding: "24px", marginBottom: 32, border: `1px solid ${G.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <span style={{ fontFamily: FB, fontSize: 15, color: G.steel }}>{service.name} ({service.type})</span>
                        <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: G.ink }}>GHS {amountGHS.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: `1px solid ${G.border}` }}>
                        <span style={{ fontFamily: FB, fontWeight: 800, fontSize: 17, color: G.ink }}>Total to Pay Now</span>
                        <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 20, color: G.green }}>GHS {amountGHS.toFixed(2)}</span>
                    </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                    <label style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: G.ink, display: "block", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pay with Mobile Money</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {providers.map(p => (
                            <div 
                                key={p.id} 
                                style={{ 
                                    display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 20, cursor: "pointer", 
                                    border: `2px solid ${provider === p.id ? G.green : G.border}`, 
                                    background: provider === p.id ? G.greenPale : G.white,
                                    transition: "all 0.2s"
                                }} 
                                onClick={() => setProvider(p.id)}
                            >
                                <div style={{ width: 44, height: 44, background: "white", borderRadius: 12, border: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img src={p.icon} alt={p.name} style={{ width: 32, height: 32, objectFit: "contain" }} />
                                </div>
                                <span style={{ flex: 1, fontFamily: FB, fontWeight: 700, fontSize: 16, color: G.ink }}>{p.name}</span>
                                {provider === p.id && (
                                    <div style={{ background: G.green, width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Check size={14} color="white" strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ESCROW EXPLAINER */}
                <div style={{ background: G.goldPale, borderRadius: 24, padding: "24px", marginBottom: 32, border: `1px solid ${G.gold}20` }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                        <Lock size={20} color={G.gold} />
                        <h4 style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: "#856404" }}>How Escrow Works</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                            "We hold your funds securely.",
                            "Tasker begins the work.",
                            "You approve the job once finished.",
                            "We release payment to the Tasker."
                        ].map((step, idx) => (
                            <div key={idx} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: G.gold }} />
                                <span style={{ fontFamily: FB, fontSize: 13, color: "#856404", fontWeight: 500 }}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: "0 10px", textAlign: "center", marginBottom: 40 }}>
                    <p style={{ fontSize: 12, color: G.mist, lineHeight: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <ShieldCheck size={14} /> Platform is secured. Your data is encrypted.
                    </p>
                </div>

                <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "20px 24px 32px", background: "linear-gradient(to top, white 80%, transparent)" }}>
                    <button 
                        className="btn btn-green" 
                        onClick={handlePay} 
                        disabled={isProcessing || !provider} 
                        style={{ width: "100%", height: 60, borderRadius: 20, fontSize: 17, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, boxShadow: `0 10px 30px ${G.green}30` }}
                    >
                        {isProcessing ? "Awaiting MoMo Prompt..." : `Pay GHS ${amountGHS.toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
