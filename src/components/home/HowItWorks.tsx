"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, ListChecks, CalendarCheck, ShieldCheck } from "lucide-react";

const steps = [
  {
    title: "1. Describe your task",
    desc: "Simply tell us what you need help with. Plumbing, cleaning, or repairs — we've covered every category.",
    icon: Search,
    color: "bg-blue-500",
  },
  {
    title: "2. View Verified Taskers",
    desc: "Compare local professionals based on verified ratings, reviews, and real-world task history.",
    icon: ListChecks,
    color: "bg-indigo-500",
  },
  {
    title: "3. Choose & Schedule",
    desc: "Pick your preferred professional and set a time that works for you. No initial phone calls required.",
    icon: CalendarCheck,
    color: "bg-accent",
  },
  {
    title: "4. Secure Transaction",
    desc: "Pay securely via MoMo. We hold funds in escrow and only pay the tasker once you approve the work.",
    icon: ShieldCheck,
    color: "bg-emerald-500",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 bg-midnight relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-4"
          >
            Frictionless <span className="text-primary italic">Workflow</span>
          </motion.h2>
          <p className="text-slate-400">How MyWorkPadi delivers excellence, step-by-step.</p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/5 md:-translate-x-1/2" />
          <motion.div 
            style={{ scaleY: pathLength, originY: 0 }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-accent to-emerald-500 md:-translate-x-1/2" 
          />

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex items-center gap-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Connector Node */}
                <div className={`absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-4 border-midnight z-10 md:-translate-x-1/2 ${step.color} shadow-lg shadow-white/10`} />

                <div className="flex-1 pl-16 md:pl-0 md:text-right">
                  <div className={i % 2 === 0 ? "md:text-right" : "md:text-left"}>
                    <div className={`inline-flex p-3 rounded-2xl bg-white/5 text-white mb-4 border border-white/10 shadow-xl`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                <div className="hidden md:flex flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
