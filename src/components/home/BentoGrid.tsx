"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Star, CheckCircle2, Wallet, Users, Clock, Globe } from "lucide-react";

const features = [
  {
    title: "Vetted Professionals",
    desc: "Every tasker undergoes a rigorous background check and skill verification.",
    icon: Shield,
    className: "md:col-span-2 md:row-span-2",
    color: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    title: "Secure Escrow",
    desc: "Funds are only released when you are 100% satisfied with the work.",
    icon: Wallet,
    className: "md:col-span-1 md:row-span-1",
    color: "bg-accent/20",
    iconColor: "text-accent",
  },
  {
    title: "Instant Booking",
    desc: "Book in under 60 seconds with our frictionless guest checkout.",
    icon: Zap,
    className: "md:col-span-1 md:row-span-1",
    color: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    title: "Real-time Matching",
    desc: "Our algorithm finds the best tasker near you instantly.",
    icon: Clock,
    className: "md:col-span-2 md:row-span-1",
    color: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
  },
];

export default function BentoGrid() {
  return (
    <section id="features" className="py-24 bg-midnight relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-4"
          >
            Built for <span className="text-accent">Trust</span>. Optimized for <span className="text-primary">Speed</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 max-w-xl mx-auto"
          >
            We've redesigned the service experience from the ground up for the modern Ghanaian economy.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`group relative p-8 rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col justify-end ${f.className}`}
            >
              <div className={`absolute top-6 left-6 p-4 rounded-2xl ${f.color} ${f.iconColor} group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                <f.icon className="w-6 h-6" />
              </div>
              
              <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                <h3 className="text-xl font-black text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">{f.desc}</p>
              </div>

              {/* Decorative Background Glow */}
              <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full ${f.color} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
