import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle2, ShieldCheck, Lock, Clock, Info, ArrowRight } from 'lucide-react';
import { G, FB, FD } from '../constants/theme';

const PricingCard = ({ title, price, subtitle, features, badge, type = "primary" }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    style={{ 
      background: 'white', 
      borderRadius: 32, 
      padding: 40, 
      border: `1.5px solid ${type === "primary" ? G.green : G.border}`,
      boxShadow: type === "primary" ? `0 20px 40px ${G.green}10` : '0 10px 30px rgba(0,0,0,0.03)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
  >
    {badge && (
      <div style={{ 
        position: 'absolute', top: 20, right: 20, background: G.goldPale, color: G.gold, 
        padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 800, 
        letterSpacing: '0.05em', textTransform: 'uppercase', border: `1px solid ${G.gold}40`
      }}>
        {badge}
      </div>
    )}
    <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.black, marginBottom: 8 }}>{title}</h3>
    <p style={{ fontFamily: FB, fontSize: 14, color: G.steel, marginBottom: 24 }}>{subtitle}</p>
    
    <div style={{ marginBottom: 32 }}>
      <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 42, color: type === "primary" ? G.green : G.black }}>{price}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: G.mist, marginLeft: 8 }}>/ task</span>
    </div>

    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
      {features.map((f, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ background: type === "primary" ? G.greenPale : G.cloud, padding: 4, borderRadius: '50%' }}>
            <CheckCircle2 size={16} color={type === "primary" ? G.green : G.mist} />
          </div>
          <span style={{ fontSize: 14, color: G.textSteel, fontWeight: 500 }}>{f}</span>
        </div>
      ))}
    </div>

    <button style={{ 
      width: '100%', padding: '16px', borderRadius: 16, border: 'none', 
      background: type === "primary" ? G.green : G.cloud, 
      color: type === "primary" ? 'white' : G.slate,
      fontFamily: FB, fontWeight: 800, fontSize: 15, cursor: 'pointer',
      transition: 'all 0.3s'
    }}>
      Get Started
    </button>
  </motion.div>
);

export default function PricingPage() {
  return (
    <div className="page-enter" style={{ background: G.offWhite, paddingBottom: 100 }}>
      {/* HERO */}
      <section style={{ padding: '120px 0 80px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: G.green, fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16, display: 'block' }}
          >
            Pricing Transparency
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: FD, fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, color: G.black, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.04em' }}
          >
            No Games. <span style={{ color: G.green }}>No Hidden Fees.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 18, lineHeight: 1.7, color: G.steel, maxWidth: 600, margin: '0 auto' }}
          >
            We believe trust starts with honest pricing. Know exactly what you are paying for before the work begins.
          </motion.p>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, marginBottom: 100 }}>
          <PricingCard 
            title="General Assessment"
            price="GHS 30"
            subtitle="For complex repairs where a Tasker needs to diagnose the issue first."
            features={[
              "Up to 30 mins diagnostic",
              "Expert troubleshooting",
              "Detailed written quote",
              "Deducted from final job cost",
              "Available same-day"
            ]}
          />
          <PricingCard 
            type="primary"
            title="Standard Service"
            price="GHS 120"
            badge="MOST POPULAR"
            subtitle="Transparent fixed-price tasks like basic cleaning, painting per wall, etc."
            features={[
              "No hidden assessment fees",
              "Professional equipment provided",
              "Happiness Guarantee included",
              "Escrow Payment Protection",
              "Verified Pro Taskers"
            ]}
          />
          <PricingCard 
            title="Emergency Care"
            price="GHS 200"
            subtitle="Priority matching within 45 minutes for urgent plumbing or electrical leaks."
            features={[
              "Instant matching (45 mins)",
              "24/7 Service availability",
              "Top 5% Taskers only",
              "Materials management assistance",
              "Priority phone support"
            ]}
          />
        </div>

        {/* TRUST TRIGGERS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 24, border: `1px solid ${G.border}` }}>
            <div style={{ background: G.greenPale, width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Lock size={24} color={G.green} />
            </div>
            <h4 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Safe Escrow</h4>
            <p style={{ color: G.steel, fontSize: 14, lineHeight: 1.6 }}>Your payment is held securely by TaskGH. We only release it to the Tasker after you click "Confirm Completion".</p>
          </div>
          
          <div style={{ background: 'white', padding: 32, borderRadius: 24, border: `1px solid ${G.border}` }}>
            <div style={{ background: G.goldPale, width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <ShieldCheck size={24} color={G.gold} />
            </div>
            <h4 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Happiness Guarantee</h4>
            <p style={{ color: G.steel, fontSize: 14, lineHeight: 1.6 }}>If the service isn't up to standard, our team will intervene to ensure it's fixed or you get a full refund.</p>
          </div>

          <div style={{ background: 'white', padding: 32, borderRadius: 24, border: `1px solid ${G.border}` }}>
            <div style={{ background: G.greenPale, width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Info size={24} color={G.green} />
            </div>
            <h4 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, marginBottom: 12 }}>No Cash Games</h4>
            <p style={{ color: G.steel, fontSize: 14, lineHeight: 1.6 }}>Tired of over-negotiating? Our prices are benchmarked to Accra's market rates to ensure fairness for both you and the Tasker.</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 100, background: G.green, borderRadius: 40, padding: 60, textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ fontFamily: FD, fontSize: 42, fontWeight: 900, marginBottom: 16 }}>Ready to get it done?</h2>
          <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>Join 2,400+ homes in Accra using TaskGH to handle their maintenance professionally.</p>
          <button style={{ background: 'white', color: G.green, padding: '18px 36px', borderRadius: 16, border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Book Your First Task <ArrowRight size={20} />
          </button>
          
          <div style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.1 }}>
            <Lock size={200} color="white" />
          </div>
        </div>
      </section>

      {/* FAQ SNIPPET */}
      <section className="container" style={{ marginTop: 120 }}>
        <h3 style={{ fontFamily: FD, fontSize: 32, fontWeight: 900, textAlign: 'center', marginBottom: 60 }}>Frequently Asked Questions</h3>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            { q: "How is the final price calculated?", a: "For fixed-price services, what you see is what you pay for labor. For assessment-based services, the Tasker provides a quote after checking the issue. If you agree, the assessment fee is deducted from the final labor cost." },
            { q: "Does the price include materials?", a: "No, pricing covers labor and professional expertise. You can either provide materials yourself or ask the Tasker to purchase them and upload the receipt to the app for reimbursement." },
            { q: "Is Mobile Money secure for payments?", a: "Yes, we use Paystack, Africa's leading payment processor. Your transaction is encrypted and we never see your MoMo PIN." }
          ].map((item, idx) => (
            <div key={idx} style={{ paddingBottom: 24, borderBottom: `1px solid ${G.border}` }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <HelpCircle size={20} color={G.green} style={{ marginTop: 4 }} />
                <h5 style={{ fontFamily: FD, fontSize: 18, fontWeight: 800, color: G.black }}>{item.q}</h5>
              </div>
              <p style={{ paddingLeft: 36, color: G.steel, fontSize: 15, lineHeight: 1.7 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
