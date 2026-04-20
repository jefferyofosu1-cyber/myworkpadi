"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Shield, Star } from "lucide-react";

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="col-span-2 lg:col-span-1" variants={itemVariants}>
            <div className="mb-4">
              <img
                src="/logo.jpg"
                alt="TaskGH Logo"
                className="h-10 w-auto object-contain bg-background rounded-friendly p-1"
              />
            </div>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Ghana's most trusted marketplace for professional home services. Connecting you with verified experts.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-primary" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-accent" />
                <span>Rated 4.9</span>
              </div>
            </div>
          </motion.div>
          {[
            {
              title: "Services",
              links: [
                { label: "Plumbing", href: "/booking?category=plumbing" },
                { label: "Electrical", href: "/booking?category=electrical" },
                { label: "Cleaning", href: "/booking?category=cleaning" },
                { label: "Moving Help", href: "/booking?category=moving" },
                { label: "All Services", href: "/booking" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
                { label: "Press", href: "/press" },
                { label: "Become a Tasker", href: "/tasker/apply" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Legal Hub", href: "/legal" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
              ],
            },
          ].map((col) => (
            <motion.div key={col.title} variants={itemVariants}>
              <h4 className="text-foreground font-black text-sm mb-4 uppercase tracking-wide">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-muted text-sm hover:text-primary transition-colors font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="border-t border-border pt-6 text-center text-muted text-sm"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          © {new Date().getFullYear()} TaskGH. All rights reserved. Made with <Heart className="w-4 h-4 inline text-red-500" /> in Ghana.
        </motion.div>
      </div>
    </footer>
  );
}
