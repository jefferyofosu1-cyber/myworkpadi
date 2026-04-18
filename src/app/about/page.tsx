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
  { name: "Jeffery Impraim", title: "Founder & CEO", initials: "JI", color: "bg-blue-600" },
];

export const metadata = {
  title: "About Us — TaskGH",
  description: "Learn about TaskGH's mission to build Ghana's most trusted marketplace for home and professional services.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" /> Made in Ghana, Built for Africa
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
            We're making skilled work<br />
            <span className="text-blue-600">accessible to everyone</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            TaskGH was born out of a simple frustration: finding a trustworthy plumber, electrician, or cleaner in Accra was harder than it needed to be. We decided to fix that.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-black text-blue-600 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
              <div className="text-slate-500 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>Our Story</h2>
          <div className="prose prose-slate prose-lg max-w-none space-y-5 text-slate-600 leading-relaxed">
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
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-12 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>What we stand for</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-3 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>The team behind TaskGH</h2>
          <p className="text-slate-400 text-center text-sm mb-12">Building the future of skilled work in Ghana.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(m => (
              <div key={m.name} className="text-center">
                <div className={`w-20 h-20 ${m.color} rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4`}>
                  {m.initials}
                </div>
                <p className="font-bold text-slate-800">{m.name}</p>
                <p className="text-slate-400 text-sm">{m.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
        <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>Join the movement</h2>
        <p className="text-blue-100 mb-8 max-w-lg mx-auto">Whether you need something done or want to earn doing what you're great at, TaskGH is for you.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/booking" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all shadow-lg">
            Book a Tasker <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/tasker/apply" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all">
            Become a Tasker <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
