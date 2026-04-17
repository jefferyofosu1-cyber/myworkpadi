import Link from "next/link";
import { Zap, Star, Shield, Clock, ChevronRight, CheckCircle, Wrench, Zap as ZapIcon, Home, Truck, Brush, Wind, Hammer } from "lucide-react";
import Navbar from "@/components/Navbar";
import TrustBar from "@/components/TrustBar";

const services = [
  { icon: Wrench, name: "Plumbing", desc: "Leaks, pipes, fixtures & more", price: "From GH₵80", color: "bg-blue-50 text-blue-600" },
  { icon: ZapIcon, name: "Electrical", desc: "Wiring, sockets & installations", price: "From GH₵100", color: "bg-yellow-50 text-yellow-600" },
  { icon: Home, name: "Cleaning", desc: "Deep clean, regular & move-out", price: "From GH₵60", color: "bg-green-50 text-green-600" },
  { icon: Truck, name: "Moving", desc: "Packing, loading & delivery", price: "From GH₵120", color: "bg-purple-50 text-purple-600" },
  { icon: Brush, name: "Painting", desc: "Interior, exterior & touch-ups", price: "From GH₵90", color: "bg-pink-50 text-pink-600" },
  { icon: Wind, name: "AC Repair", desc: "Service, repair & installation", price: "From GH₵150", color: "bg-cyan-50 text-cyan-600" },
  { icon: Hammer, name: "Carpentry", desc: "Furniture, doors & custom work", price: "From GH₵110", color: "bg-orange-50 text-orange-600" },
  { icon: Wrench, name: "Others", desc: "Handyman & miscellaneous tasks", price: "From GH₵50", color: "bg-slate-50 text-slate-600" },
];

const steps = [
  { n: "01", title: "Describe your task", desc: "Tell us what you need — cleaning, repairs, or anything else." },
  { n: "02", title: "Pick a tasker", desc: "Browse verified professionals with real reviews and competitive rates." },
  { n: "03", title: "Book & pay securely", desc: "Your payment is held in escrow until the job is done to your satisfaction." },
  { n: "04", title: "Rate & review", desc: "Share your experience to help others and reward great taskers." },
];

const stats = [
  { value: "5,000+", label: "Verified Taskers" },
  { value: "40,000+", label: "Tasks Completed" },
  { value: "4.8★", label: "Avg. Rating" },
  { value: "15 min", label: "Avg. Response Time" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Ghana's #1 Task Marketplace · 40,000+ Jobs Done
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
              Get Any Task Done By{" "}
              <span className="text-blue-600">Trusted</span>{" "}
              <span className="text-orange-500">Professionals</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
              From plumbing to cleaning, electrical to painting — book vetted, background-checked taskers in minutes. Payments held in escrow until you're satisfied.
            </p>
            <p className="text-xs font-bold text-green-600 mb-4 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Book in 60 seconds · No account needed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 py-4 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5 transition-all"
              >
                Book a Task Now
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
            href="/tasker/apply"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base px-8 py-4 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:-translate-y-0.5 transition-all"
              >
                Become a Tasker
                <span className="text-orange-500 font-bold">→</span>
              </Link>
            </div>

            {/* Trust Bar */}
            <div className="mt-10">
              <TrustBar />
            </div>

            {/* Social proof ticker */}
            <div className="mt-6 inline-flex items-center gap-2 bg-white border border-slate-100 shadow-md rounded-full px-4 py-2">
              <div className="flex -space-x-2">
                {["J", "A", "K"].map((l, i) => (
                  <div key={i} className="w-7 h-7 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">{l}</div>
                ))}
              </div>
              <span className="text-xs text-slate-600 font-medium"><strong className="text-slate-800">140+ Ghanaians</strong> booked a task today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-blue-600 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
                <div className="text-blue-200 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 block">What we offer</span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
              Services for every need
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">Professional services across all categories, delivered by vetted and verified taskers.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((s) => (
              <Link
                key={s.name}
                href={`/booking?category=${s.name.toLowerCase()}`}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 hover:-translate-y-1 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1 text-sm">{s.name}</h3>
                <p className="text-slate-400 text-xs mb-3 leading-relaxed">{s.desc}</p>
                <p className="text-orange-500 font-bold text-xs">{s.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 block">Simple process</span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
              How TaskGH works
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-blue-200 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-5xl font-black text-blue-50 mb-4 leading-none" style={{ fontFamily: "var(--font-jakarta)" }}>{s.n}</div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tasker CTA Banner */}
      <section className="py-16 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
            Earn money on your schedule
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            Join 5,000+ taskers earning a great income doing what they love. Set your rates, choose your jobs.
          </p>
          <Link
            href="/tasker/apply"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-orange-900/30 hover:-translate-y-0.5 transition-all"
          >
            Apply as a Tasker
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 lg:col-span-1">
              <div className="mb-4">
                <img 
                  src="/logo.jpg" 
                  alt="TaskGH Logo" 
                  className="h-10 w-auto object-contain bg-white rounded-lg p-1"
                />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">Ghana's most trusted marketplace for professional home services.</p>
            </div>
            {[
              { title: "Services", links: ["Plumbing", "Electrical", "Cleaning", "Moving"] },
              { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><Link href="#" className="text-slate-400 text-sm hover:text-white transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
            © 2026 TaskGH. All rights reserved. Made with ❤️ in Ghana.
          </div>
        </div>
      </footer>
    </div>
  );
}
