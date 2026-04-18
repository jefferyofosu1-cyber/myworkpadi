"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Star, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-midnight pt-20">
      {/* Cinematic Background Gradients */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -120, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[100px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-50 mix-blend-overlay" />
      </div>

      <motion.div style={{ y: y1, opacity, scale }} className="container mx-auto px-4 relative z-10 text-center">
        {/* Floating Verified Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-neon" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Ghana's Most Trusted Network</span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Skilled help at the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[shimmer_4s_infinite_linear]">
            Speed of Thought.
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          The premium marketplace for verified taskers in Ghana. From emergency plumbing to full-scale cleaning, booked in 60 seconds.
        </motion.p>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/booking" 
            className="group relative inline-flex items-center gap-2 bg-white text-midnight font-bold px-10 py-5 rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Book a Task Now</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link 
            href="/tasker/apply" 
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/10 transition-all active:scale-95 backdrop-blur-xl"
          >
            Become a Tasker
          </Link>
        </motion.div>

        {/* Hero Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10"
        >
          {[
            { label: "Vetted Taskers", val: "5k+", sub: "Verified Skills" },
            { label: "Active Users", val: "40k+", sub: "Across Ghana" },
            { label: "Daily Bookings", val: "150+", sub: "Real-time" },
            { label: "Safety Rating", val: "4.9/5", sub: "User Trusted" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-white mb-1">{s.val}</div>
              <div className="text-[10px] font-black text-accent uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Parallax Elements */}
      <motion.div style={{ y: y2 }} className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <motion.div style={{ y: y1 }} className="absolute -top-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
