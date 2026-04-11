import React from 'react';
import { useBooking } from '../BookingContext';

/* ── TOKENS (Mirrored from Prototype) ── */
export const G = {
  green: "#0A6E4A", greenLight: "#12A06B", greenDeep: "#064D34",
  greenPale: "#E8F5EF", gold: "#E8A020", goldPale: "#FDF4E3",
  ink: "#0D1117", slate: "#1A202C", steel: "#4A5568", mist: "#94A3B8",
  cloud: "#F7F9FC", border: "#EEF2F7", white: "#FFFFFF",
  error: "#EF4444", blue: "#3B82F6",
};

export const FB = "'DM Sans', sans-serif";
export const FD = "'Syne', sans-serif";

export const StatusBar = ({ light = false }) => (
  <div className="status-bar" style={{ background: "inherit" }}>
    <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 15, color: light ? G.white : G.slate }}>9:41</span>
    <div style={{ width: 80, height: 18, borderRadius: 10, background: light ? G.white : G.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 8px" }}>
      <div style={{ width: 14, height: 7, borderRadius: 2, border: `1.5px solid ${light ? G.ink : G.white}`, position: "relative" }}>
        <div style={{ position: "absolute", inset: 1, right: 3, background: light ? G.ink : G.white, borderRadius: 1 }} />
        <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 2, height: 5, borderRadius: 1, background: light ? G.ink : G.white }} />
      </div>
    </div>
  </div>
);

export const BackBtn = ({ onBack, light = false }) => (
  <button onClick={onBack} style={{ background: light ? "rgba(255,255,255,0.2)" : G.cloud, border: "none", width: 40, height: 40, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: light ? G.white : G.slate, transition: "all 0.2s" }}>
    ←
  </button>
);

export const StepBar = ({ step, total, label }) => (
  <div style={{ padding: "0", flex: 1 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontFamily: FB, fontSize: 12, color: G.mist }}>Step {step} of {total}</span>
      <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 12, color: G.green }}>{label}</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${(step / total) * 100}%` }} />
    </div>
  </div>
);

export const BottomNav = ({ active = "home" }) => {
  const { goTo } = useBooking();
  const tabs = [
    { id: "home", icon: "H", label: "Home", screen: 2 },
    { id: "jobs", icon: "J", label: "My Jobs", screen: 9 },
    { id: "chat", icon: "C", label: "Chat", screen: 12 },
    { id: "profile", icon: "P", label: "Profile", screen: 0 },
  ];
  return (
    <div className="bottom-nav">
      {tabs.map(t => (
        <div key={t.id} className="nav-tab" onClick={() => goTo(t.screen)}>
          <div className="nav-icon" style={{ background: active === t.id ? G.greenPale : "transparent" }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
          </div>
          <span className="nav-label" style={{ color: active === t.id ? G.green : G.mist }}>{t.label}</span>
        </div>
      ))}
    </div>
  );
};
