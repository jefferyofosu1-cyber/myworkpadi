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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background dark:bg-background pt-24 pb-12">
      {/* Subtle animated background for depth */}
      <div className="absolute inset-0 z-0 text-foreground">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        style={{ y: y1, opacity, scale }}
        className="container mx-auto px-4 relative z-10 text-center flex-1 flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Trust-building badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-tint glass px-6 py-3 rounded-friendly mb-10 hover-glow"
        >
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="uppercase-label text-sm">Verified Professionals Only</span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-tight mb-8 tracking-tighter"
        >
          The Smart Way <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            To Get Things Done
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          variants={itemVariants}
          className="text-muted text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
        >
          Connect with trusted local workers in Ghana. Premium service, guaranteed satisfaction. Your reliable solution for every task.
        </motion.p>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/booking"
              className="group inline-flex items-center gap-3 bg-primary text-white font-black px-10 py-4 rounded-friendly shadow-lg hover:shadow-green transition-all uppercase tracking-wide"
            >
              Book Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/tasker/apply"
              className="inline-flex items-center gap-3 bg-tint glass border border-border text-foreground font-black px-10 py-4 rounded-friendly hover:bg-white/10 dark:hover:bg-white/10 transition-all uppercase tracking-wide"
            >
              Work & Earn
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-accent" />
            <span>5-Star Rated</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>Fast Response</span>
          </div>
        </motion.div>

        {/* Hero Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-border pt-12 w-full max-w-4xl"
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
