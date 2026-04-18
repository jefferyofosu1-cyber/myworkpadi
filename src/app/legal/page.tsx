import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FileText, ArrowRight, ShieldCheck, Eye, Cookie } from "lucide-react";

const docs = [
  {
    icon: FileText,
    title: "Terms of Service",
    desc: "The rules that govern your use of the TaskGH platform as a customer or worker.",
    href: "/terms",
    updated: "April 2025",
    color: "text-primary bg-primary/10",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Policy",
    desc: "How we collect, use, store, and protect your personal information.",
    href: "/privacy",
    updated: "April 2025",
    color: "text-accent bg-accent/10",
  },
  {
    icon: Cookie,
    title: "Cookie Policy",
    desc: "What cookies we use, why, and how you can manage your preferences.",
    href: "/cookies",
    updated: "April 2025",
    color: "text-primary bg-primary/10",
  },
];

export const metadata = {
  title: "Legal — TaskGH",
  description: "TaskGH's legal documents including Terms of Service, Privacy Policy, and Cookie Policy.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-4 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Policies</h1>
          <p className="text-muted leading-relaxed font-medium">
            We use simple, honest language. No legal jargon — just clarity on how we work to keep Ghana safe.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {docs.map(doc => (
            <Link key={doc.href} href={doc.href}
              className="flex items-start gap-5 bg-foreground/[0.02] border border-border rounded-3xl p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${doc.color} shadow-inner`}>
                <doc.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-lg font-black text-foreground uppercase tracking-tight">{doc.title}</h2>
                  <span className="text-[10px] font-black text-muted/40 uppercase tracking-widest">v2025.04</span>
                </div>
                <p className="text-muted text-sm font-medium leading-relaxed">{doc.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted/30 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
        <p className="text-center text-muted text-[10px] font-black uppercase tracking-[0.2em] mt-16">
          Questions? Contact <a href="mailto:legal@taskgh.com" className="text-primary hover:underline transition-colors">legal@taskgh.com</a>
        </p>
      </section>
    </div>
  );
}
