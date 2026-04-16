import React, { useState } from 'react';
import { useBooking } from '../BookingContext';
import { G, FB, FD, StatusBar, BackBtn, StepBar } from './shared';
import { Video, ArrowRight, Camera, X, ShieldCheck, Info } from 'lucide-react';

export default function Screen4_Describe() {
    const { goNext, goBack, bookingData, setBookingData } = useBooking();
    const [tempFiles, setTempFiles] = useState([]);

    const handleFileAdd = () => {
        // Mock file addition for the UI
        if (tempFiles.length < 4) {
            setTempFiles([...tempFiles, { id: Date.now(), type: 'image' }]);
        }
    };

    const removeFile = (id) => {
        setTempFiles(tempFiles.filter(f => f.id !== id));
    };

    return (
        <div className="screen-enter" style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, background: G.white }}>
            <StatusBar />
            <div className="screen-content" style={{ padding: "16px 24px 120px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <BackBtn onBack={goBack} />
                    <StepBar step={1} total={4} label="Problem Details" />
                </div>

                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: G.ink, marginBottom: 8, letterSpacing: "-0.02em" }}>What can we fix?</h2>
                    <p style={{ fontFamily: FB, fontSize: 15, color: G.steel, lineHeight: 1.5 }}>The more details you provide, the more accurate your quote will be.</p>
                </div>

                <div style={{ marginBottom: 32 }}>
                    <label style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: G.ink, display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</label>
                    <textarea 
                        className="input" 
                        placeholder="e.g. My AC is making a rattling noise and the air isn't cold..." 
                        rows={5} 
                        style={{ padding: 20, borderRadius: 20, border: `1.5px solid ${G.border}`, background: G.white, fontSize: 16 }}
                        value={bookingData.problemDescription} 
                        onChange={e => setBookingData(p => ({ ...p, problemDescription: e.target.value }))}
                    />
                </div>

                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <label style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: G.ink, textTransform: "uppercase", letterSpacing: "0.05em" }}>Photos & Videos</label>
                        <span style={{ fontSize: 12, color: G.green, fontWeight: 700 }}>Recommended</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                        {tempFiles.map(file => (
                            <div key={file.id} style={{ position: "relative", aspectRatio: "1/1", borderRadius: 16, background: G.cloud, overflow: "hidden", border: `1px solid ${G.border}` }}>
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: G.mist }}>
                                    <Camera size={24} />
                                </div>
                                <button onClick={() => removeFile(file.id)} style={{ position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        
                        {tempFiles.length < 6 && (
                            <button onClick={handleFileAdd} style={{ aspectRatio: "1/1", borderRadius: 16, border: `2px dashed ${G.border}`, background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "all 0.2s" }}>
                                <div style={{ background: G.greenPale, padding: 8, borderRadius: 12 }}><Camera size={20} color={G.green} /></div>
                                <span style={{ fontFamily: FB, fontSize: 10, color: G.steel, fontWeight: 700 }}>ADD FILE</span>
                            </button>
                        )}
                    </div>
                    
                    <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <Info size={14} color={G.mist} style={{ marginTop: 2 }} />
                        <p style={{ fontSize: 11, color: G.mist, lineHeight: 1.4 }}>Taskers who see photos match up to 50% faster and provide firmer quotes.</p>
                    </div>
                </div>

                <div style={{ background: G.greenPale, borderRadius: 24, padding: "20px", display: "flex", gap: 16, border: `1px solid ${G.green}20` }}>
                    <div style={{ background: G.green, width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ShieldCheck size={24} color="white" />
                    </div>
                    <div>
                        <h4 style={{ fontFamily: FD, fontWeight: 800, fontSize: 15, color: G.ink, marginBottom: 4 }}>Happiness Guarantee</h4>
                        <p style={{ fontFamily: FB, fontSize: 12, color: G.green, lineHeight: 1.6, fontWeight: 500 }}>If you're not satisfied with the job, we'll send another pro or refund you. Your home is safe with TaskGH.</p>
                    </div>
                </div>

                <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "20px 24px 32px", background: "linear-gradient(to top, white 80%, transparent)" }}>
                    <button className="btn btn-green" onClick={goNext} disabled={!bookingData.problemDescription} style={{ width: "100%", height: 60, borderRadius: 20, fontSize: 17, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, boxShadow: `0 10px 30px ${G.green}30` }}>
                        Continue <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
