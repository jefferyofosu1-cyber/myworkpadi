import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, DollarSign, Calendar, ArrowRight, CheckCircle2, Award, Info, Users, Smartphone } from 'lucide-react';
import { G, FB, FD } from '../constants/theme';

const BenefitCard = ({ icon, title, desc, idx }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1 }}
    viewport={{ once: true }}
    style={{ background: 'white', padding: 32, borderRadius: 28, border: `1px solid ${G.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
  >
    <div style={{ background: G.greenPale, width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G.green, marginBottom: 24 }}>
      {icon}
    </div>
    <h3 style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: G.black, marginBottom: 16 }}>{title}</h3>
    <p style={{ fontFamily: FB, fontSize: 15, color: G.steel, lineHeight: 1.7 }}>{desc}</p>
  </motion.div>
);

export default function BecomeATaskerPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', skill: 'AC Repair' });

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
    else alert("Application submitted! We will contact you via WhatsApp for verification.");
  };

  return (
    <div className="page-enter" style={{ background: G.offWhite, paddingBottom: 100 }}>
      {/* HERO SECTION - SPLIT */}
      <section style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: G.white, paddingTop: 80 }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 60, alignItems: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: G.goldPale, padding: '8px 16px', borderRadius: 100, marginBottom: 24, border: `1px solid ${G.gold}30` }}>
              <Award size={14} color={G.gold} />
              <span style={{ fontSize: 11, fontWeight: 800, color: G.gold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Join Accra's #1 Network</span>
            </div>
            <h1 style={{ fontFamily: FD, fontSize: 'clamp(44px, 6vw, 68px)', fontWeight: 900, color: G.black, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.04em' }}>
              Be Your Own Boss.<br /><span style={{ color: G.green }}>Earn GHS 4,000+</span> Weekly.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.7, color: G.steel, maxWidth: 520, marginBottom: 40 }}>
              Join 200+ top-rated professionals in Accra earning more on their own terms. Same-day MoMo payments and verified leads delivered to your phone.
            </p>

            <div style={{ display: 'flex', gap: 24, marginBottom: 40, flexWrap: 'wrap' }}>
              {[
                { icon: <Zap size={18} />, text: "Fast Onboarding" },
                { icon: <DollarSign size={18} />, text: "Daily MoMo Payouts" },
                { icon: <ShieldCheck size={18} />, text: "Verified Jobs" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ color: G.green }}>{item.icon}</div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: G.slate }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* QUICK APPLY FORM */}
            <form onSubmit={handleNext} style={{ background: 'white', padding: 10, borderRadius: 24, display: 'flex', gap: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.08)', border: `1px solid ${G.border}`, maxWidth: 500 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 20 }}>
                <Smartphone size={20} color={G.mist} style={{ marginRight: 12 }} />
                <input 
                  type="tel" 
                  placeholder="Enter phone number" 
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: 16, fontFamily: FB, fontWeight: 600 }}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <button type="submit" style={{ background: G.black, color: 'white', padding: '16px 32px', borderRadius: 16, border: 'none', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}>
                Quick Apply
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ position: 'relative' }}
            className="desktop-only"
          >
            <div style={{ borderRadius: 40, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.15)', aspectRatio: '4/5' }}>
              <img src="/assets/images/recruitment-hero.png" alt="Recruitment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <motion.div 
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              style={{ position: 'absolute', bottom: 40, left: -40, background: 'white', padding: '24px', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: `1px solid ${G.border}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: G.greenPale, width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={24} color={G.green} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: G.mist }}>Earned Last Week</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: G.ink }}>GHS 4,850</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY JOIN US */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 80px' }}>
            <span style={{ color: G.green, fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16, display: 'block' }}>Benefits</span>
            <h2 style={{ fontFamily: FD, fontSize: 44, fontWeight: 900, color: G.black }}>Grow your business with TaskGH</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <BenefitCard 
              idx={0}
              icon={<Users size={28} />}
              title="Endless Leads"
              desc="Forget hunting for work. We bring pre-qualified jobs in your neighborhood directly to your phone."
            />
            <BenefitCard 
              idx={1}
              icon={<DollarSign size={28} />}
              title="Guaranteed Payment"
              desc="No more chasing clients. Our escrow system ensures you're paid immediately after job completion."
            />
            <BenefitCard 
              idx={2}
              icon={<Calendar size={28} />}
              title="Total Flexibility"
              desc="Work when you want. Toggle your availability in the app and only take the jobs that fit your schedule."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FOR TASKERS */}
      <section style={{ background: G.white, padding: '120px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 80, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: FD, fontSize: 48, fontWeight: 900, color: G.black, marginBottom: 40, lineHeight: 1.1 }}>One application.<br />Infinite opportunities.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  { n: "01", t: "Apply Online", d: "Fill out our quick form and tell us about your professional skills." },
                  { n: "02", t: "Verification", d: "Submit your Ghana Card and references for our trust check." },
                  { n: "03", t: "Download App", d: "Get the TaskGH Pro app and complete your profile setup." },
                  { n: "04", t: "Start Earning", d: "Accept jobs, finish tasks, and get paid same-day via MoMo." }
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24 }}>
                    <div style={{ fontFamily: FD, fontSize: 24, fontWeight: 900, color: G.green, opacity: 0.3 }}>{s.n}</div>
                    <div>
                      <h4 style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, color: G.black, marginBottom: 8 }}>{s.t}</h4>
                      <p style={{ color: G.steel, fontSize: 16, lineHeight: 1.6 }}>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ background: G.offWhite, padding: 60, borderRadius: 48, border: `1px solid ${G.border}` }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{ background: G.greenPale, width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <ShieldCheck size={40} color={G.green} />
                </div>
                <h3 style={{ fontFamily: FD, fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Safety & Trust</h3>
                <p style={{ color: G.steel, fontSize: 16 }}>We vet every customer and ensure you're protected during every job.</p>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 0, listStyle: 'none' }}>
                {[
                  "Mobile Money Escrow Protection",
                  "24/7 Professional Support",
                  "Job Damage Insurance Coverage",
                  "Verified Customer Identity"
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ background: G.green, width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={14} color="white" />
                    </div>
                    <span style={{ fontWeight: 700, color: G.slate }}>{text}</span>
                  </li>
                ))}
              </ul>
              <button style={{ width: '100%', marginTop: 40, background: G.green, color: 'white', padding: '20px', borderRadius: 20, border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                Start My Application <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
