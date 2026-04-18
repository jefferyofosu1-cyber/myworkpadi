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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-8" style={{ fontFamily: "var(--font-jakarta)" }}>Open Positions</h2>
          <div className="space-y-4">
            {openRoles.map(role => (
              <div key={role.title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">{role.team}</span>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">{role.type}</span>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">{role.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{role.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{role.desc}</p>
                  </div>
                  <a href={`mailto:careers@taskgh.com?subject=Application: ${role.title}`}
                    className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all group-hover:-translate-y-0.5">
                    Apply <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-slate-50 rounded-2xl p-6 text-center">
            <p className="text-slate-600 font-medium mb-1">Don't see a role that fits?</p>
            <p className="text-slate-400 text-sm mb-4">We're always interested in exceptional people. Send us a note.</p>
            <a href="mailto:careers@taskgh.com" className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
              careers@taskgh.com <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
