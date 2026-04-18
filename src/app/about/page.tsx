import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, MapPin, Users, Star, ShieldCheck, TrendingUp, Heart } from "lucide-react";

const stats = [
  { value: "40,000+", label: "Tasks Completed" },
  { value: "5,000+", label: "Verified Taskers" },
  { value: "12", label: "Cities in Ghana" },
  { value: "4.8 ★", label: "Average Rating" },
];

const values = [
  { icon: ShieldCheck, title: "Trust First", desc: "Every tasker is background-checked, ID-verified, and rated by real customers. No shortcuts, ever." },
  { icon: Heart, title: "Built for Ghana", desc: "We designed every part of this platform for how Ghanaians actually live and work — from Mobile Money to local language support." },
  { icon: TrendingUp, title: "Grow Together", desc: "When taskers earn more, Ghana prospers. We take only what is fair, so professionals can build real livelihoods on our platform." },
  { icon: Star, title: "Excellence as Standard", desc: "We hold our taskers to the highest standards. If you are not happy, we make it right — every time." },
];

const team = [
  { 
    name: "Jeffery Impraim", 
    title: "Founder & CEO", 
    initials: "JI", 
    color: "bg-blue-600",
    image: "/founder.jpg"
  },
];

export const metadata = {
  title: "About Us — TaskGH",
  description: "Learn about TaskGH's mission to build Ghana's most trusted marketplace for home and professional services.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-midnight selection:bg-accent/30">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-br from-primary via-midnight to-accent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" /> Made in Ghana, Built for Africa
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
            We're making skilled work<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">accessible to everyone</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            TaskGH was born out of a simple frustration: finding a trustworthy plumber, electrician, or cleaner in Accra was harder than it needed to be. We decided to fix that.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-black text-accent mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
              <div className="text-slate-500 text-sm font-medium uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-6 tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Our Story</h2>
          <div className="prose prose-invert prose-lg max-w-none space-y-5 text-slate-400 leading-relaxed">
            <p>
              In 2024, our founder was trying to find someone to fix a persistent electrical fault in his home in East Legon. After three cancelled appointments, two technicians who never showed up, and one who quoted triple the market rate, he thought — there has to be a better way.
            </p>
            <p>
              That frustration became TaskGH. We built a platform that puts trust and transparency at the centre: every tasker is verified, every job is protected by our escrow payment system, and every customer review is real.
            </p>
            <p>
              Today, TaskGH connects thousands of Ghanaians with skilled professionals every week — from emergency plumbing calls to full home renovations. We're proud of the income we've helped taskers build, and the peace of mind we've given customers who simply needed something done right.
            </p>
            <p>
              We're just getting started. Our vision is to become the infrastructure layer for skilled work across all of West Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-12 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>What we stand for</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white/[0.03] rounded-3xl p-8 border border-white/5 hover:border-accent/20 transition-all group">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-3 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>The team behind TaskGH</h2>
          <p className="text-slate-500 text-center text-sm mb-12 uppercase tracking-widest">Building the future of skilled work in Ghana.</p>
          <div className="flex justify-center">
            {team.map(m => (
              <div key={m.name} className="text-center group">
                <div className={`w-40 h-40 ${m.color} rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 overflow-hidden shadow-2xl ring-4 ring-white/10 transition-transform group-hover:scale-105 group-hover:shadow-indigo`}>
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    m.initials
                  )}
                </div>
                <p className="font-black text-white text-2xl mb-1">{m.name}</p>
                <p className="text-accent font-bold text-xs uppercase tracking-[0.2em]">{m.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[100px] -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Join the movement</h2>
          <p className="text-slate-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">Whether you need something done or want to earn doing what you're great at, TaskGH is for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="inline-flex items-center gap-2 bg-white text-midnight font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95">
              Book a Tasker <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/tasker/apply" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/10 transition-all active:scale-95">
              Become a Tasker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
