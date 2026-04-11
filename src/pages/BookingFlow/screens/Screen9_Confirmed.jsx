import React, { useEffect } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar } from './shared';

export default function Screen9_Confirmed() {
    const { goNext, bookingId } = useBooking();
    
    useEffect(() => {
        const timer = setTimeout(goNext, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, background: G.green }}>
            <StatusBar light />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
                <div style={{ width: 100, height: 100, background: G.white, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, boxShadow: "0 15px 35px rgba(0,0,0,0.15)", animation: "fadeUp 0.5s ease both" }}>
                    <svg width={50} height={50} viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke={G.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 30, color: G.white, marginBottom: 12 }}>Booking Confirmed!</h2>
                <p style={{ fontFamily: FB, fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 8 }}>Order ID: <strong style={{color: G.white}}>#{bookingId || 'TASK-8802'}</strong></p>
                <p style={{ fontFamily: FB, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>Flash SMS confirmation has been sent to your phone. We're redirecting you to your live dashboard.</p>
            </div>
        </div>
    );
}
