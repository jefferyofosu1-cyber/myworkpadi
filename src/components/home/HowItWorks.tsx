"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, ListChecks, CalendarCheck, ShieldCheck } from "lucide-react";

const steps = [
  {
    title: "1. Tell us what you need",
    desc: "Simply describe the job. Whether it's plumbing, cleaning, or a quick repair, we have the right person for you.",
    icon: Search,
    color: "bg-primary",
  },
  {
    title: "2. View Local Workers",
    desc: "See a list of workers near you. Read their reviews and see photos of their previous work to pick the best fit.",
    icon: ListChecks,
    color: "bg-primary-dark",
  },
  {
    title: "3. Pick a Time",
    desc: "Choose the worker you like and set a date and time that works for your schedule.",
    icon: CalendarCheck,
    color: "bg-accent",
  },
  {
    title: "4. Secure Payment",
    desc: "Pay safely through the platform. We hold your money and only pay the worker once you confirm the job is done.",
    icon: ShieldCheck,
    color: "bg-primary-light",
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
    <section id="how-it-works" ref={containerRef} className="py-24 bg-background relative transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-foreground mb-4"
          >
            How it <span className="text-primary italic">Works</span>
          </motion.h2>
          <p className="text-muted">TaskGH makes it easy to find quality help in four simple steps.</p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
          <motion.div 
            style={{ scaleY: pathLength, originY: 0 }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-accent to-primary md:-translate-x-1/2" 
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
                <div className={`absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-4 border-background z-10 md:-translate-x-1/2 ${step.color} shadow-lg shadow-primary/10`} />

                <div className="flex-1 pl-16 md:pl-0 md:text-right">
                  <div className={i % 2 === 0 ? "md:text-right" : "md:text-left"}>
                    <div className={`inline-flex p-3 rounded-2xl bg-foreground/5 text-foreground mb-4 border border-border shadow-xl`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted text-sm md:text-base leading-relaxed">{step.desc}</p>
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
