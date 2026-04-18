import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, MapPin, Users, Star, ShieldCheck, TrendingUp, Heart } from "lucide-react";

const stats = [
  { value: "40,000+", label: "Tasks Completed" },
  { value: "5,000+", label: "Verified Taskers" },
  { value: "12", label: "Cities in Ghana" },
  { value: "4.8 ★", label: "Average Rating" },
];

const values = [
  { icon: ShieldCheck, title: "Trust First", desc: "Every tasker is background-checked, ID-verified, and rated by real customers. No shortcuts, ever." },
  { icon: Heart, title: "Built for Ghana", desc: "We designed every part of this platform for how Ghanaians actually live and work — from Mobile Money to local language support." },
  { icon: TrendingUp, title: "Grow Together", desc: "When taskers earn more, Ghana prospers. We take only what is fair, so professionals can build real livelihoods on our platform." },
  { icon: Star, title: "Excellence as Standard", desc: "We hold our taskers to the highest standards. If you are not happy, we make it right — every time." },
];

const team = [
  { 
    name: "Jeffery Impraim", 
    title: "Founder & CEO", 
    initials: "JI", 
    color: "bg-primary",
    image: "/founder.jpg"
  },
];

export const metadata = {
  title: "About Us — TaskGH",
  description: "Learn about TaskGH's mission to build Ghana's most trusted marketplace for home and professional services.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden text-center">
        {/* Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[10px] font-black px-5 py-2 rounded-full mb-8 uppercase tracking-[0.2em] border border-primary/20">
            <MapPin className="w-3.5 h-3.5" /> Built for Ghana
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-foreground leading-[0.85] tracking-tighter mb-8" style={{ fontFamily: "var(--font-jakarta)" }}>
            Service you can<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">finally trust.</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed font-medium">
            TaskGH was started because finding a reliable plumber, electrician, or cleaner in Ghana shouldn't feel like a gamble. We're here to build that bridge of trust.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 border-y border-border bg-foreground/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2 tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
              <div className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Vision */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-8 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Our Story</h2>
            <div className="space-y-6 text-muted text-lg font-medium leading-relaxed">
              <p>
                In early 2024, our founder Jeffery Impraim struggled for three weeks to find someone to fix a simple electrical fault. After technicians repeatedly failed to show up or quoted inconsistent prices, the vision for TaskGH was born.
              </p>
              <p>
                We realized that Ghana's skilled work economy was broken by a lack of trust and transparency. TaskGH isn't just an app; it's a movement to professionalize the local services sector.
              </p>
              <p>
                Today, we focus on background checks, transparent pricing, and real customer reviews to ensure that every job done through our platform is a job done right.
              </p>
            </div>
          </div>
          
          <div className="relative">
             <div className="absolute -inset-4 bg-primary/10 rounded-[4rem] blur-3xl animate-pulse" />
             <div className="relative bg-foreground/[0.02] border border-border rounded-[3rem] p-10 overflow-hidden group">
               <div className="grid grid-cols-2 gap-4">
                 {values.map(v => (
                   <div key={v.title} className="p-6 bg-background border border-border rounded-2xl hover:border-primary/30 transition-all hover:-translate-y-1 shadow-sm">
                     <v.icon className="w-6 h-6 text-primary mb-4" />
                     <h3 className="text-xs font-black text-foreground uppercase tracking-widest mb-2">{v.title}</h3>
                     <p className="text-[10px] text-muted font-bold leading-relaxed">{v.desc}</p>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-32 px-4 bg-foreground/[0.02] border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-foreground mb-4 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>The Founder</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-64 h-64 lg:w-80 lg:h-80 relative flex-shrink-0">
               <div className="absolute inset-0 bg-primary/20 rounded-[4rem] rotate-6 group-hover:rotate-0 transition-transform duration-500" />
               <div className="absolute inset-0 bg-background border-4 border-border rounded-[4rem] overflow-hidden shadow-2xl relative z-10 transition-transform hover:-translate-y-2">
                 <img src="/founder.jpg" alt="Jeffery Impraim" className="w-full h-full object-cover object-top" />
               </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-3xl font-black text-foreground mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>Jeffery Impraim</h3>
              <p className="text-primary text-sm font-black uppercase tracking-[0.2em] mb-6">Founder & CEO</p>
              <p className="text-muted text-lg font-medium leading-relaxed mb-8">
                "I built TaskGH for the millions of Ghanaians who deserve better. For the customers who want reliability, and for the skilled professionals who want fair work and respect. We are building a platform that makes life easier for everyone, and we're just getting started."
              </p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Based In</span>
                  <span className="text-sm font-black text-foreground uppercase tracking-tight">Accra, Ghana</span>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Mission</span>
                  <span className="text-sm font-black text-foreground uppercase tracking-tight">Trust & Empowerment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tighter uppercase" style={{ fontFamily: "var(--font-jakarta)" }}>Ready to experience<br/>the difference?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/booking" 
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-black px-12 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 text-xs uppercase tracking-[0.2em]">
              Book a Tasker <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
