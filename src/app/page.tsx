"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  Search,
  MessageSquare
} from "lucide-react";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import { WAITLIST_PERKS } from "@/constants/waitlist";

export default function HomePage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Clean White Header Section */}
      <section className="bg-white text-foreground pt-12 pb-32 px-4 relative overflow-hidden">
        {/* Subtle Decorative Background Rings */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] border-[40px] border-primary/5 rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] border-[20px] border-primary/5 rounded-full" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Header Branding */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-primary/20">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <span className="text-3xl font-black tracking-tight text-foreground" style={{ fontFamily: "var(--font-jakarta)" }}>
                Task<span className="text-primary underline decoration-primary/20 decoration-2 underline-offset-4">GH</span>
              </span>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-primary/5 backdrop-blur-md border border-primary/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Launching soon in Accra — Get early access
            </div>
          </div>

          {/* Hero Text */}
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tighter text-black" style={{ fontFamily: "var(--font-jakarta)" }}>
            Need a trusted plumber, electrician, <span className="text-primary">AC guy</span> or handyman?
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            Join the TaskGH early access list and be first to book trusted artisans in your area.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { label: "Verified artisans", icon: CheckCircle2 },
              { label: "Fast response", icon: Zap },
              { label: "Easy booking", icon: CheckCircle2 },
              { label: "Launching soon", icon: Zap },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600">
                <badge.icon className="w-3.5 h-3.5 text-primary" />
                {badge.label}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Main Form Section */}
      <section className="px-4 -mt-20 pb-24 relative z-20">
        <div className="max-w-2xl mx-auto bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden p-8 md:p-12">
          
          <div className="mb-10">
            <h2 className="text-2xl font-black text-foreground mb-1">Join the waitlist</h2>
            <p className="text-muted text-xs font-bold uppercase tracking-wide">Takes 30 seconds • Free • Cancel anytime</p>
          </div>

          <WaitlistForm />

          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-muted text-[10px] font-bold uppercase tracking-widest">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Your info is safe & never shared with third parties
          </div>
        </div>
      </section>

      {/* Trust & Perks Section */}
      <section className="bg-foreground/[0.02] py-24 px-4 overflow-hidden relative">
        <div className="max-w-4xl mx-auto">
          {/* Perks Grid */}
          <div className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Join now and get</h3>
            </div>

            <div className="grid gap-4">
              {WAITLIST_PERKS.map((perk) => (
                <div 
                  key={perk.id}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl ${perk.color} text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <perk.icon className="w-5 h-5" />
                  </div>
                  <span className="font-black text-foreground text-sm uppercase tracking-tight">{perk.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Branding Footer */}
      <footer className="py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
            <Search className="w-3 h-3 text-primary" />
          </div>
          <span className="text-sm font-black tracking-tight text-foreground" style={{ fontFamily: "var(--font-jakarta)" }}>
            Task<span className="text-primary underline decoration-primary/20 decoration-2 underline-offset-4">GH</span>
          </span>
        </div>
        <p className="text-muted text-[10px] font-bold uppercase tracking-widest">© 2026 taskgh.com | Accra, Ghana</p>
      </footer>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-6 left-4 right-4 z-50 flex items-center justify-center pointer-events-none md:hidden">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="pointer-events-auto bg-black text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-white/10"
        >
          Join Waitlist <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
