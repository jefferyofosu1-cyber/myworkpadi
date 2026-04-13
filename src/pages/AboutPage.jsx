import { G, FH, FB } from '../constants/theme';

const SectionLabel = ({ children, color = G.green }) => (
  <div style={{ fontFamily:FB, fontSize:11, color, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:8 }}>{children}</div>
);

export default function AboutPage() {
  return (
    <div className="page-enter" style={{ paddingTop:80 }}>
      {/* Hero */}
      <div style={{ background:G.offWhite, padding:"72px 40px 64px", textAlign:"center", borderBottom:`1px solid ${G.border}` }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <SectionLabel>Our Story</SectionLabel>
          <h1 style={{ fontFamily:FH, fontWeight:800, fontSize:48, color:G.black, marginBottom:18, letterSpacing:"-0.03em" }}>
            Reinventing Trust in <br /><span style={{ color:G.green }}>Ghanaian Homes.</span>
          </h1>
          <p style={{ fontFamily:FB, fontSize:19, color:G.steel, lineHeight:1.8 }}>
            TaskGH was born out of a simple frustration: finding a reliable professional in Accra shouldn't feel like a gamble. We're building a platform where trust is the primary currency.
          </p>
        </div>
      </div>

      {/* Narrative */}
      <div style={{ background: G.white, padding: "80px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: FH, fontWeight: 800, fontSize: 32, color: G.black, marginBottom: 20 }}>The Problem We're Fixing</h2>
              <p style={{ fontFamily: FB, fontSize: 17, color: G.steel, lineHeight: 1.8, marginBottom: 24 }}>
                In the traditional informal sector, there's a lack of accountability. Prices fluctuate wildly, quality is hit-or-miss, and if something goes wrong after the job, the service person often disappears.
              </p>
              <p style={{ fontFamily: FB, fontSize: 17, color: G.steel, lineHeight: 1.8 }}>
                TaskGH solves this with <strong>Vetting</strong>, <strong>Transparency</strong>, and <strong>Escrow</strong>. We verify every professional, standardize pricing, and hold your funds safely until you're satisfied with the work.
              </p>
            </div>
            <div style={{ position: "relative" }}>
               <div style={{ background: G.green, borderRadius: 32, padding: 48, color: G.white, position: "relative", zIndex: 2 }}>
                  <div style={{ fontFamily: FH, fontWeight: 800, fontSize: 14, color: G.gold, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Mission</div>
                  <h3 style={{ fontFamily: FH, fontWeight: 800, fontSize: 26, marginBottom: 16 }}>Locally Rooted Excellence</h3>
                  <p style={{ fontFamily: FB, fontSize: 16, opacity: 0.9, lineHeight: 1.75 }}>
                     We understand the nuances of Accra - from the importance of materials transparency to the convenience of MoMo. TaskGH isn't just an app; it's a commitment to our community.
                  </p>
               </div>
               <div style={{ position: "absolute", top: 20, left: 20, right: -10, bottom: -10, border: `3px solid ${G.gold}`, borderRadius: 32, zIndex: 1 }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
