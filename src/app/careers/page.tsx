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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" /> We're Hiring
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
            Build something that<br />
            <span className="text-orange-500">matters for Ghana</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We are a small team solving a very large problem. Every person we hire has a direct and visible impact on the lives of thousands of Ghanaians — customers who need help, and taskers who are building their livelihoods.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-4 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center" style={{ fontFamily: "var(--font-jakarta)" }}>Why TaskGH</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {perks.map(p => (
              <div key={p.label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-xl">{p.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>Join our journey</h2>
          <p className="text-slate-500 text-base mb-10 max-w-lg mx-auto">
            We are currently scaling our operations and not actively recruiting for new roles. However, we're always looking for exceptional talent to join our future team.
          </p>
          
          <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Want to be notified?</h3>
            <p className="text-slate-500 text-sm mb-8">
              Send us your CV and a brief note about why you're interested in TaskGH. We'll reach out when a role matches your expertise.
            </p>
            <a href="mailto:careers@taskgh.com" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-100">
              Drop your CV <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
