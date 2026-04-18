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
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-24 transition-colors duration-300">
      {/* Cinematic White & Green Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[60%] h-[60%] bg-primary/5 dark:bg-primary/20 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -120, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] -right-[5%] w-[50%] h-[50%] bg-accent/5 dark:bg-accent/10 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-10 mix-blend-overlay" />
      </div>

      <motion.div style={{ y: y1, opacity, scale }} className="container mx-auto px-4 relative z-10 text-center">
        {/* Floating Verified Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-foreground/[0.03] border border-primary/20 backdrop-blur-xl px-5 py-2.5 rounded-full mb-10 shadow-sm"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-green" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Verified Professionals Only</span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-9xl font-black text-foreground leading-[0.85] mb-8 tracking-tighter"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          The smart way <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[shimmer_4s_infinite_linear]">
            to get things done.
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-semibold italic opacity-80"
        >
          Connecting you with trusted local workers who get the job done right. Experience the new standard for services in Ghana.
        </motion.p>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/booking" 
            className="group relative inline-flex items-center gap-3 bg-primary text-white font-black px-12 py-5 rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 hover:shadow-primary/40"
          >
            <span className="relative z-10 uppercase tracking-wider">Book Now</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link 
            href="/tasker/apply" 
            className="inline-flex items-center gap-3 bg-foreground/[0.04] border border-border text-foreground font-black px-12 py-5 rounded-2xl hover:bg-foreground/[0.08] transition-all active:scale-95 backdrop-blur-xl uppercase tracking-wider"
          >
            Work & Earn
          </Link>
        </motion.div>

        {/* Hero Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-border pt-12"
        >
          {[
            { label: "Vetted Taskers", val: "5k+", sub: "Verified Skills" },
            { label: "Platform Users", val: "40k+", sub: "Across Ghana" },
            { label: "Tasks Completed", val: "150k+", sub: "High Quality" },
            { label: "Trust Score", val: "4.9/5", sub: "User Rated" },
          ].map((s, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">{s.val}</div>
              <div className="text-[10px] font-black text-accent uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Parallax Elements */}
      <motion.div style={{ y: y2 }} className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <motion.div style={{ y: y1 }} className="absolute -top-40 -left-40 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
