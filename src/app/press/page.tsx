import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Newspaper, Download, ArrowRight, Mail } from "lucide-react";

const pressReleases = [
  {
    date: "April 2025",
    title: "TaskGH Surpasses 40,000 Tasks Completed in Ghana",
    excerpt: "The Accra-based home services marketplace reaches a major milestone, signaling growing consumer trust in digital service booking.",
  },
  {
    date: "February 2025",
    title: "TaskGH Launches Guest Booking — No Account Required",
    excerpt: "In a move to reduce friction, TaskGH now allows customers to book any service in under 60 seconds without creating an account.",
  },
  {
    date: "January 2025",
    title: "TaskGH Expands Verified Tasker Network to Kumasi and Takoradi",
    excerpt: "Ghana's leading task marketplace scales its vetted professional network to two additional major cities.",
  },
];

const facts = [
  { label: "Founded", value: "2024" },
  { label: "Headquarters", value: "Accra, Ghana" },
  { label: "Taskers", value: "5,000+" },
  { label: "Tasks completed", value: "40,000+" },
  { label: "Cities", value: "12 in Ghana" },
  { label: "Customer rating", value: "4.8 / 5.0" },
];

export const metadata = {
  title: "Press — TaskGH",
  description: "Press releases, media resources, and contact information for journalists covering TaskGH.",
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black px-5 py-2 rounded-full mb-8 uppercase tracking-[0.2em] shadow-inner">
            <Newspaper className="w-3.5 h-3.5" /> Media Relations
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-foreground leading-tight mb-8 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>
            TaskGH News
          </h1>
          <p className="text-xl text-muted max-w-xl mx-auto leading-relaxed font-medium">
            Resources for the press, creators, and partners covering our growth in Ghana.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-10">
        {/* Press Releases */}
        <div className="lg:col-span-2">
          <h2 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-10 ml-1">Official Releases</h2>
          <div className="space-y-6">
            {pressReleases.map(p => (
              <div key={p.title} className="bg-foreground/[0.02] border border-border rounded-[2.5rem] p-8 hover:border-primary/50 transition-all group">
                <p className="text-[10px] font-black text-muted/40 uppercase tracking-widest mb-3">{p.date}</p>
                <h3 className="text-lg font-black text-foreground mb-3 uppercase tracking-tight group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="text-muted text-sm font-medium leading-relaxed">{p.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Fast Facts */}
          <div className="bg-foreground/[0.02] border border-border rounded-[2.5rem] p-8 shadow-inner">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-8">Snapshot</h3>
            <div className="space-y-4">
              {facts.map(f => (
                <div key={f.label} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <span className="text-muted/40">{f.label}</span>
                  <span className="text-foreground">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Media Kit */}
          <div className="bg-primary border border-primary/20 rounded-[2.5rem] p-8 shadow-2xl shadow-primary/20">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3">Brand Assets</h3>
            <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed">Official logos, product renders, and brand guidelines.</p>
            <a href="/media-kit.zip" className="flex items-center justify-center gap-3 bg-white text-primary text-[10px] font-black py-5 px-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
              <Download className="w-4 h-4" /> Download Kit
            </a>
          </div>

          {/* Press Contact */}
          <div className="bg-accent/10 border border-accent/20 rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-3">Contact</h3>
            <p className="text-muted text-sm font-medium mb-8 leading-relaxed">Media inquiries are prioritized and processed within 24 hours.</p>
            <a href="mailto:press@taskgh.com" className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:underline">
              <Mail className="w-4 h-4" /> press@taskgh.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
