import React from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BackBtn } from './shared';
import { api } from '../../../utils/api';

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
            await api.post('/payments/initiate', {
                bookingId: bookingId,
                amount_ghs: amountGHS,
                phone: bookingData.phone,
                provider: provider,
                payment_type: service.type === 'assessment' ? 'assessment' : 'deposit'
            });
            goNext();
        } catch (err) {
            alert(`Payment Error: ${err.message}. Continue anyway for demo?`);
            goNext();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "16px 24px 100px" }}>
                <div style={{ marginBottom: 24, marginTop: 12 }}>
                    <BackBtn onBack={goBack} />
                </div>
                
                <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.slate, marginBottom: 8 }}>Secure Payment</h2>
                <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 32 }}>Your funds are held in escrow. Tasker only gets paid when you approve.</p>

                <div style={{ background: G.cloud, borderRadius: 20, padding: "20px", marginBottom: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontFamily: FB, fontSize: 14, color: G.steel }}>{service.name} ({service.type})</span>
                        <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 14, color: G.slate }}>GHS {amountGHS.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${G.border}` }}>
                        <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 16, color: G.slate }}>Total Due Now</span>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: G.green }}>GHS {amountGHS.toFixed(2)}</span>
                    </div>
                </div>

                <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: G.slate, marginBottom: 16 }}>Select MoMo Provider</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                    {providers.map(p => (
                        <div key={p.id} className={`momo-provider ${provider === p.id ? "selected" : ""}`} onClick={() => setProvider(p.id)}>
                            <img src={p.icon} alt={p.name} style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 4 }} />
                            <span style={{ flex: 1, fontFamily: FB, fontWeight: 600, fontSize: 14, color: G.slate }}>{p.name}</span>
                            <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${provider === p.id ? G.green : G.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {provider === p.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: G.green }} />}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px", display: "flex", gap: 12, marginBottom: 32 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <p style={{ fontFamily: FB, fontSize: 12, color: G.green, fontWeight: 600, lineHeight: 1.5 }}>Payments are secured via Paystack. Your financial data is never stored on TaskGH.</p>
                </div>

                <button className="btn btn-green" onClick={handlePay} disabled={isProcessing} style={{ position: "fixed", bottom: 24, left: "5%", width: "90%", zIndex: 10 }}>
                    {isProcessing ? "Awaiting MoMo Prompt..." : `Pay GHS ${amountGHS.toFixed(2)} with MoMo`}
                </button>
            </div>
        </div>
    );
}
