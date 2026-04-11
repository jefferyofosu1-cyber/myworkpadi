import React from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BackBtn, StepBar } from './shared';

export default function Screen5_DateTime() {
    const { goNext, goBack, bookingData, setBookingData } = useBooking();

    const days = [
        { label: "Today", date: "Apr 24" },
        { label: "Tomorrow", date: "Apr 25" },
        { label: "Sun", date: "Apr 26" },
        { label: "Mon", date: "Apr 27" },
        { label: "Tue", date: "Apr 28" }
    ];

    const times = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "16px 24px 100px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <BackBtn onBack={goBack} />
                    <StepBar step={2} total={4} label="Schedule" />
                </div>

                <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: G.slate, marginBottom: 8 }}>When do you need help?</h2>
                <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 24 }}>Select a preferred date and time for the Tasker to arrive.</p>

                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10 }}>
                        {days.map((d, i) => (
                            <div key={i} onClick={() => setBookingData(p => ({ ...p, scheduledDay: i }))} style={{ minWidth: 80, padding: "16px 12px", borderRadius: 16, border: `1.5px solid ${bookingData.scheduledDay === i ? G.green : G.border}`, background: bookingData.scheduledDay === i ? G.greenPale : G.white, textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                                <span style={{ display: "block", fontFamily: FB, fontSize: 12, fontWeight: 600, color: bookingData.scheduledDay === i ? G.green : G.mist, marginBottom: 4 }}>{d.label}</span>
                                <span style={{ display: "block", fontFamily: FD, fontSize: 16, fontWeight: 800, color: G.slate }}>{d.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
                    {times.map(t => (
                        <div key={t} onClick={() => setBookingData(p => ({ ...p, scheduledTime: t }))} style={{ padding: "14px", borderRadius: 14, border: `1.5px solid ${bookingData.scheduledTime === t ? G.green : G.border}`, background: bookingData.scheduledTime === t ? G.greenPale : G.white, textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                            <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 14, color: bookingData.scheduledTime === t ? G.green : G.slate }}>{t}</span>
                        </div>
                    ))}
                </div>

                <div style={{ background: G.cloud, borderRadius: 16, padding: "20px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: G.white, display: "flex", alignItems: "center", justifyCenter: "center", fontSize: 20 }}>⏰</div>
                    <div>
                        <p style={{ fontFamily: FB, fontSize: 14, color: G.slate, fontWeight: 600 }}>Arrival Window</p>
                        <p style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>Professional will arrive within 30 mins of selected time.</p>
                    </div>
                </div>

                <button className="btn btn-green" onClick={goNext} style={{ position: "fixed", bottom: 24, left: "5%", width: "90%", zIndex: 10 }}>
                    Confirm Time →
                </button>
            </div>
        </div>
    );
}
