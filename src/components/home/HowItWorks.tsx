"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, ListChecks, CalendarCheck, ShieldCheck } from "lucide-react";

const steps = [
  {
    title: "Tell Us What You Need",
    desc: "Describe your task simply. From plumbing fixes to deep cleaning, our platform connects you with skilled professionals in Ghana.",
    icon: Search,
    color: "bg-primary",
  },
  {
    title: "Choose Your Expert",
    desc: "Browse verified workers near you. Check reviews, ratings, and portfolios to find the perfect match for your needs.",
    icon: ListChecks,
    color: "bg-primary-dark",
  },
  {
    title: "Schedule & Book",
    desc: "Pick a convenient time and confirm your booking. Our experts arrive ready to deliver exceptional service.",
    icon: CalendarCheck,
    color: "bg-accent",
  },
  {
    title: "Pay Securely",
    desc: "Enjoy peace of mind with secure payments. Funds are held safely until you approve the completed work.",
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 bg-background dark:bg-background relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 uppercase tracking-wide">
            How It <span className="text-primary italic">Works</span>
          </h2>
          <p className="text-muted text-lg">Four simple steps to get professional help. Trusted by thousands in Ghana.</p>
        </motion.div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY: pathLength, originY: 0 }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary via-accent to-primary md:-translate-x-1/2 rounded-full"
          />

          <motion.div
            className="space-y-12 md:space-y-24"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={stepVariants}
                className={`relative flex items-center gap-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Connector Node */}
                <div className={`absolute left-6 md:left-1/2 w-5 h-5 rounded-friendly border-4 border-white z-10 md:-translate-x-1/2 ${step.color} shadow-lg shadow-green`} />

                <div className="flex-1 pl-16 md:pl-0">
                  <div className={`inline-flex p-4 rounded-friendly bg-tint glass mb-4 hover-glow`}>
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2 uppercase tracking-wide">{step.title}</h3>
                  <p className="text-muted text-base leading-relaxed">{step.desc}</p>
                </div>
                <div className="hidden md:flex flex-1" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
