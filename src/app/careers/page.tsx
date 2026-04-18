import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, Briefcase, Globe, Zap, Users, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Careers — TaskGH",
  description: "Join the team building Ghana's most trusted task marketplace. Explore future opportunities at TaskGH.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[10px] font-black px-5 py-2 rounded-full mb-8 uppercase tracking-[0.2em] border border-primary/20">
            <Briefcase className="w-3.5 h-3.5" /> Building for Ghana
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-foreground leading-[0.85] tracking-tighter mb-8" style={{ fontFamily: "var(--font-jakarta)" }}>
            Our journey is just<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">beginning.</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed font-medium">
            We're building a world-class team to solve a fundamental problem for millions of Ghanaians. While we aren't actively hiring today, we're always looking for pioneers.
          </p>
        </div>
      </section>

      {/* Recruitment Status */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-foreground/[0.02] rounded-[3rem] p-12 md:p-20 border border-border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:scale-110 transition-transform">
              <Users className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>
              Recruitment is currently paused
            </h2>
            <p className="text-muted text-lg mb-12 max-w-lg mx-auto font-medium leading-relaxed">
              We are scaling intentionally. If you believe your expertise could help move Ghana forward, we'd love to have your details on file for when we expand our team.
            </p>
            
            <a href="mailto:careers@taskgh.com" 
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-black px-12 py-6 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 shadow-2xl shadow-primary/20 text-xs uppercase tracking-[0.2em]">
              Send your CV <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            <div className="mt-16 pt-16 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Engineering", icon: Zap },
                { label: "Operations", icon: Globe },
                { label: "Design", icon: Briefcase },
                { label: "Growth", icon: TrendingUp }
              ].map(dep => (
                <div key={dep.label} className="text-center">
                  <div className="text-xs font-black text-muted uppercase tracking-widest">{dep.label}</div>
                  <div className="text-[10px] text-muted/40 font-bold mt-1">COMING SOON</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
