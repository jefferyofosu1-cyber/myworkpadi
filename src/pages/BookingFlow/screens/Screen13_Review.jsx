import React, { useState } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar } from './shared';

export default function Screen13_Review() {
    const { goNext, selectedTasker } = useBooking();
    const [rating, setRating] = useState(0);

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "40px 24px 100px" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ width: 90, height: 90, borderRadius: "50%", background: G.greenPale, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                    <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: G.slate, marginBottom: 8 }}>Job Completed!</h2>
                    <p style={{ fontFamily: FB, fontSize: 16, color: G.steel }}>How was your experience with {selectedTasker?.name || 'Kofi'}?</p>
                </div>

                <div style={{ background: G.white, borderRadius: 24, border: `1.5px solid ${G.border}`, padding: "32px 24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", marginBottom: 32 }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <span key={i} onClick={() => setRating(i)} style={{ fontSize: 40, cursor: "pointer", filter: rating >= i ? "none" : "grayscale(1) opacity(0.3)", transform: rating === i ? "scale(1.2)" : "scale(1)", transition: "all 0.2s" }}>
                                &#9733;
                            </span>
                        ))}
                    </div>
                    <textarea className="input" placeholder="Leave a comment (optional)..." rows={4} style={{ textAlign: "left" }} />
                </div>

                <div style={{ background: G.greenPale, borderRadius: 16, padding: "16px", display: "flex", gap: 12, marginBottom: 32 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <p style={{ fontFamily: FB, fontSize: 12, color: G.green, fontWeight: 600, lineHeight: 1.5 }}>By submitting, you approve the release of escrow funds to the Tasker.</p>
                </div>

                <button className="btn btn-green" onClick={goNext} disabled={rating === 0} style={{ position: "fixed", bottom: 24, left: "5%", width: "90%", zIndex: 10 }}>
                    Submit Review & Finish
                </button>
            </div>
        </div>
    );
}
