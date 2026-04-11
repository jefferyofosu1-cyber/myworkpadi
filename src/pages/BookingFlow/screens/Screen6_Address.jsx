import React, { useState } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BackBtn, StepBar } from './shared';
import { MapPin, ArrowRight } from 'lucide-react';
import { api } from '../../../utils/api';

export default function Screen6_Address() {
    const { goNext, goBack, bookingData, setBookingData, service, user, setBookingId } = useBooking();
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const payload = {
                customer_id: user?.id || localStorage.getItem('taskgh_user_id'),
                category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Dummy for now, should map from service
                b_type: service.type,
                location_address: bookingData.address,
                location_lat: bookingData.lat,
                location_lng: bookingData.lng,
                problem_description: bookingData.problemDescription,
                scheduled_at: new Date().toISOString() // Simulating for now
            };
            
            const res = await api.post('/bookings', payload);
            setBookingId(res.data.id);
            goNext();
        } catch (err) {
            alert(`Booking Error: ${err.message}. (Did you seed categories in Supabase?)`);
            // Continue for demo if failed
            setBookingId("bk_test_123");
            goNext();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "16px 24px 100px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <BackBtn onBack={goBack} />
                    <StepBar step={3} total={4} label="Location" />
                </div>

                <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.slate, marginBottom: 8 }}>Task Location</h2>
                <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 24 }}>Where should we send the Tasker?</p>

                <div style={{ marginBottom: 24 }}>
                    <div className="map-area" style={{ height: 200, marginBottom: 20 }}>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${G.green}` }}>
                            <div className="ping-ring" style={{ width: 60, height: 60 }} />
                            <MapPin size={28} color={G.green} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.slate, display: "block", marginBottom: 8 }}>House No / Street Name</label>
                        <input className="input" placeholder="e.g. 12 Ring Road East, Osu" value={bookingData.address} onChange={e => setBookingData(p => ({ ...p, address: e.target.value }))} />
                    </div>

                    <div>
                        <label style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: G.slate, display: "block", marginBottom: 8 }}>Landmark (Optional)</label>
                        <input className="input" placeholder="e.g. Near the Total Fuel Station" value={bookingData.landmark} onChange={e => setBookingData(p => ({ ...p, landmark: e.target.value }))} />
                    </div>
                </div>

                <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px", display: "flex", gap: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    <p style={{ fontFamily: FB, fontSize: 12, color: G.green, fontWeight: 600, lineHeight: 1.5 }}>Available Taskers are being notified in your area based on this location.</p>
                </div>

                <button className="btn btn-green" onClick={handleConfirm} disabled={!bookingData.address || loading} style={{ position: "fixed", bottom: 24, left: "5%", width: "90%", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loading ? "Creating Booking..." : <>Confirm & Search Tasker <ArrowRight size={18} /></>}
                </button>
            </div>
        </div>
    );
}
