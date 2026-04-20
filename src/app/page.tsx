"use client";

import { Search, CheckCircle2 } from "lucide-react";
import WaitlistForm from "@/components/waitlist/WaitlistForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      {/* Minimal Branding */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <span className="text-3xl font-black tracking-tight text-foreground" style={{ fontFamily: "var(--font-jakarta)" }}>
            Task<span className="text-primary underline decoration-primary/20 decoration-2 underline-offset-4">GH</span>
          </span>
        </div>
        
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Launching soon in Accra — Get early access
        </div>
      </div>

      {/* Focused Form Card */}
      <div className="w-full max-w-2xl bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black text-foreground mb-1 underline decoration-primary/10 decoration-4 underline-offset-4">Join the waitlist</h2>
          <p className="text-muted text-[10px] font-black uppercase tracking-widest mt-2">Takes 30 seconds • Free • Professional Artisans</p>
        </div>

        <WaitlistForm />

        <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-muted text-[10px] font-bold uppercase tracking-widest">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Your info is safe & never shared
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="mt-12 text-center">
        <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">© 2026 taskgh.com | Accra, Ghana</p>
      </footer>
    </div>
  );
}
