import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TrustPanel from "@/components/home/TrustPanel";
import BentoGrid from "@/components/home/BentoGrid";
import CategoryGrid from "@/components/home/CategoryGrid";
import HowItWorks from "@/components/home/HowItWorks";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-midnight selection:bg-accent/30">
      <main>
        {/* Cinematic Hero */}
        <HeroSection />

        {/* Dynamic Logo Marquee */}
        <TrustPanel />

        {/* Feature Bento Grid */}
        <BentoGrid />

        {/* Vertical How It Works */}
        <HowItWorks />

        {/* Immersive Service Categories */}
        <CategoryGrid />

        {/* High-Impact Final CTA */}
        <section className="py-24 bg-midnight relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-3xl mx-auto bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[3rem] p-12 md:p-20 shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>
                Ready to find <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">your professional?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of Ghanaians who trust MyWorkPadi for their home and business needs. Skip the calls, book with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/booking" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-midnight font-black px-12 py-5 rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95"
                >
                  Book Your First Task
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/tasker/apply" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
                >
                  Become a Tasker
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
