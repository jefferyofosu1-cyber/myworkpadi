import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FileText, ArrowRight, ShieldCheck, Eye, Cookie } from "lucide-react";

const docs = [
  {
    icon: FileText,
    title: "Terms of Service",
    desc: "The rules that govern your use of the TaskGH platform as a customer or tasker.",
    href: "/terms",
    updated: "April 2025",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Policy",
    desc: "How we collect, use, store, and protect your personal information.",
    href: "/privacy",
    updated: "April 2025",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Cookie,
    title: "Cookie Policy",
    desc: "What cookies we use, why, and how you can manage your preferences.",
    href: "/cookies",
    updated: "April 2025",
    color: "text-orange-600 bg-orange-50",
  },
];

export const metadata = {
  title: "Legal — TaskGH",
  description: "TaskGH's legal documents including Terms of Service, Privacy Policy, and Cookie Policy.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>Legal</h1>
          <p className="text-slate-500 leading-relaxed">
            We believe in plain, honest language. Our legal documents are written to be understood, not to hide anything.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {docs.map(doc => (
            <Link key={doc.href} href={doc.href}
              className="flex items-start gap-5 bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${doc.color}`}>
                <doc.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h2 className="font-bold text-slate-900">{doc.title}</h2>
                  <span className="text-xs text-slate-400">Updated {doc.updated}</span>
                </div>
                <p className="text-slate-500 text-sm">{doc.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
        <p className="text-center text-slate-400 text-sm mt-12">
          Questions about our policies?{" "}
          <a href="mailto:legal@taskgh.com" className="text-blue-600 hover:underline font-medium">legal@taskgh.com</a>
        </p>
      </section>
    </div>
  );
}
