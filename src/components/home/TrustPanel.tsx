"use client";

import { motion } from "framer-motion";

const logos = [
  "Paystack", "Supabase", "Google", "Vercel", "Stripe", "Amazon", "MTN Momo", "Telecel Cash"
];

export default function TrustPanel() {
  return (
    <section className="py-12 bg-midnight/50 border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">
          Trusted by thousands across Ghana 
        </p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <div className="flex animate-[scroll_40s_linear_infinite] gap-12 items-center whitespace-nowrap px-6">
          {[...logos, ...logos].map((logo, i) => (
            <div 
              key={i} 
              className="text-2xl md:text-4xl font-black text-white/10 hover:text-accent/40 transition-colors cursor-default select-none uppercase tracking-tighter italic"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
