"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Droplets, 
  Zap, 
  Sparkles, 
  Truck, 
  Hammer, 
  Paintbrush, 
  Wrench, 
  Settings,
  ArrowRight
} from "lucide-react";

const categories = [
  { name: "Plumbing", icon: Droplets, color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
  { name: "Electrical", icon: Zap, color: "from-yellow-500/20 to-orange-500/20", iconColor: "text-yellow-400" },
  { name: "Cleaning", icon: Sparkles, color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
  { name: "AC Repair", icon: Settings, color: "from-sky-500/20 to-blue-600/20", iconColor: "text-sky-400" },
  { name: "Carpentry", icon: Hammer, color: "from-orange-600/20 to-red-600/20", iconColor: "text-orange-400" },
  { name: "Painting", icon: Paintbrush, color: "from-pink-500/20 to-purple-600/20", iconColor: "text-pink-400" },
  { name: "Moving Help", icon: Truck, color: "from-slate-500/20 to-slate-700/20", iconColor: "text-slate-300" },
  { name: "Appliances", icon: Wrench, color: "from-indigo-500/20 to-blue-700/20", iconColor: "text-indigo-400" },
];

export default function CategoryGrid() {
  return (
    <section id="services" className="py-24 bg-midnight relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white mb-4"
            >
              What do you need <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">done today?</span>
            </motion.h2>
            <p className="text-slate-400">Select a category to find specialized taskers ready to help.</p>
          </div>
          <Link href="/booking" className="inline-flex items-center gap-2 text-accent font-bold group hover:underline underline-offset-8">
            View All Services <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/booking?category=${cat.name.toLowerCase().replace(" ", "-")}`}
                className="group relative block aspect-square rounded-[2.5rem] bg-white/[0.03] border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-indigo"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-between items-center text-center">
                  <div className={`p-5 rounded-3xl bg-midnight/50 backdrop-blur-xl ${cat.iconColor} shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    <cat.icon className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  
                  <div className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-10px]">
                    <span className="text-lg md:text-xl font-black text-white">{cat.name}</span>
                    <div className="mt-2 h-1 w-0 bg-accent mx-auto group-hover:w-full transition-all duration-500" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
