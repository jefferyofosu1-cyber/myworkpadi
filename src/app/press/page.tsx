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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" /> Media & Press
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>
            TaskGH in the news
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Resources for journalists, bloggers, and content creators covering the TaskGH story.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-10">
        {/* Press Releases */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-slate-900 mb-6" style={{ fontFamily: "var(--font-jakarta)" }}>Press Releases</h2>
          <div className="space-y-5">
            {pressReleases.map(p => (
              <div key={p.title} className="border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition-all">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{p.date}</p>
                <h3 className="font-bold text-slate-800 mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Fast Facts */}
          <div className="bg-slate-50 rounded-2xl p-5">
            <h3 className="font-black text-slate-900 mb-4 text-sm uppercase tracking-wider">Fast Facts</h3>
            <div className="space-y-2">
              {facts.map(f => (
                <div key={f.label} className="flex justify-between text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-500">{f.label}</span>
                  <span className="font-bold text-slate-800">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Media Kit */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="font-black text-slate-900 mb-2 text-sm">Brand Assets</h3>
            <p className="text-slate-500 text-sm mb-4">Download official logos, product screenshots, and brand guidelines for media use.</p>
            <a href="/media-kit.zip" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors">
              <Download className="w-4 h-4" /> Download Media Kit
            </a>
          </div>

          {/* Press Contact */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <h3 className="font-black text-slate-900 mb-2 text-sm">Press Enquiries</h3>
            <p className="text-slate-500 text-sm mb-3">We respond to all media requests within 24 hours on business days.</p>
            <a href="mailto:press@taskgh.com" className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
              <Mail className="w-4 h-4" /> press@taskgh.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
