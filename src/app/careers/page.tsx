import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, Briefcase, Globe, Zap, Users } from "lucide-react";

const openRoles = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Accra, Ghana (Hybrid)",
    type: "Full-time",
    desc: "Help us build the infrastructure that powers thousands of service transactions every week. You will work across our Next.js frontend and Supabase backend.",
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Accra, Ghana (Hybrid)",
    type: "Full-time",
    desc: "Own the end-to-end experience of our mobile-first booking flow. Deep empathy for Ghanaian users is essential.",
  },
  {
    title: "Tasker Success Manager",
    team: "Operations",
    location: "Kumasi or Accra",
    type: "Full-time",
    desc: "Onboard, support, and grow our network of verified taskers across Ghana. You will be the face of TaskGH to our supply side.",
  },
  {
    title: "Growth Marketing Manager",
    team: "Marketing",
    location: "Remote (Ghana-based)",
    type: "Full-time",
    desc: "Drive customer acquisition through performance marketing, partnerships, and community-led growth across our target cities.",
  },
];

const perks = [
  { icon: "💰", label: "Competitive salary + equity" },
  { icon: "🏥", label: "Full health coverage" },
  { icon: "🌍", label: "Remote-flexible culture" },
  { icon: "🚀", label: "Fast career growth" },
  { icon: "📚", label: "Learning & development budget" },
  { icon: "🎯", label: "Meaningful work with real impact" },
];

export const metadata = {
  title: "Careers — TaskGH",
  description: "Join the team building Ghana's most trusted task marketplace. Explore open roles at TaskGH.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-midnight selection:bg-accent/30 text-slate-300">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-br from-midnight via-primary/20 to-midnight" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" /> We're Hiring
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
            Build something that<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">matters for Ghana</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are a small team solving a very large problem. Every person we hire has a direct and visible impact on the lives of thousands of Ghanaians — customers who need help, and taskers who are building their livelihoods.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-4 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-10 text-center tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Why TaskGH</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {perks.map(p => (
              <div key={p.label} className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 hover:border-accent/30 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
                <span className="text-sm font-bold text-slate-300">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-24 px-4 bg-midnight">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-6 tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Join our journey</h2>
          <p className="text-slate-400 text-lg mb-12 max-w-lg mx-auto">
            We are currently scaling our operations and not actively recruiting for new roles. However, we're always looking for exceptional talent to join our future team.
          </p>
          
          <div className="bg-white/[0.03] rounded-[3rem] p-12 md:p-16 border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 ring-4 ring-primary/5">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Want to be notified?</h3>
            <p className="text-slate-400 text-base mb-10 max-w-md mx-auto">
              Send us your CV and a brief note about why you're interested in TaskGH. We'll reach out when a role matches your expertise.
            </p>
            <a href="mailto:careers@taskgh.com" className="inline-flex items-center gap-3 bg-white text-midnight font-black px-12 py-5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl">
              Drop your CV <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
