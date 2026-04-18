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
  { name: "Plumbing", icon: Droplets, color: "from-primary/20 to-accent/20", iconColor: "text-primary" },
  { name: "Electrical", icon: Zap, color: "from-accent/20 to-primary/20", iconColor: "text-accent" },
  { name: "Cleaning", icon: Sparkles, color: "from-primary/20 to-accent/20", iconColor: "text-primary" },
  { name: "Air Condition", icon: Settings, color: "from-accent/20 to-primary/20", iconColor: "text-accent" },
  { name: "Carpentry", icon: Hammer, color: "from-primary/20 to-accent/20", iconColor: "text-primary" },
  { name: "Painting", icon: Paintbrush, color: "from-accent/20 to-primary/20", iconColor: "text-accent" },
  { name: "Moving Help", icon: Truck, color: "from-primary/20 to-accent/20", iconColor: "text-primary" },
  { name: "Fridge & TV", icon: Wrench, color: "from-accent/20 to-primary/20", iconColor: "text-accent" },
];

export default function CategoryGrid() {
  return (
    <section id="services" className="py-24 bg-background relative transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-foreground mb-4"
            >
              How can we <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">help you today?</span>
            </motion.h2>
            <p className="text-muted">Choose a service below to find a reliable worker ready to start.</p>
          </div>
          <Link href="/booking" className="inline-flex items-center gap-2 text-primary font-bold group hover:underline underline-offset-8">
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
                className="group relative block aspect-square rounded-[2.5rem] bg-foreground/[0.03] border border-border overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-green"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-between items-center text-center">
                  <div className={`p-5 rounded-3xl bg-background/50 backdrop-blur-xl ${cat.iconColor} shadow-2xl group-hover:scale-110 transition-transform duration-500 border border-border/50`}>
                    <cat.icon className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  
                  <div className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-10px]">
                    <span className="text-lg md:text-xl font-black text-foreground">{cat.name}</span>
                    <div className="mt-2 h-1 w-0 bg-primary mx-auto group-hover:w-full transition-all duration-500" />
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
