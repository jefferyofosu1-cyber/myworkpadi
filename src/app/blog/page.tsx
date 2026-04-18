import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, Clock } from "lucide-react";

export const metadata = {
  title: "Blog — TaskGH",
  description: "Insights on home services, the Ghanaian gig economy, and platform updates from the TaskGH team.",
};

const posts = [
  {
    slug: "how-to-book-a-tasker",
    category: "Guide",
    categoryColor: "text-blue-600 bg-blue-50",
    title: "How to Book a Trusted Professional in Under 60 Seconds",
    excerpt: "A step-by-step guide to getting a vetted tasker at your door — no account needed, no phone calls, no stress.",
    date: "April 15, 2025",
    readTime: "4 min read",
    author: "TaskGH Team",
  },
  {
    slug: "pricing-explained",
    category: "Platform",
    categoryColor: "text-purple-600 bg-purple-50",
    title: "How TaskGH Pricing Works: Transparent, Fair, and Ghana-Built",
    excerpt: "We break down exactly what you pay and why — Booking Protection, Secure Service Charge, and what it means for your tasker.",
    date: "April 10, 2025",
    readTime: "5 min read",
    author: "TaskGH Team",
  },
  {
    slug: "tasker-success-story",
    category: "Story",
    categoryColor: "text-orange-600 bg-orange-50",
    title: "From Odd Jobs to GH₵8,000 a Month: Kofi's Tasker Journey",
    excerpt: "Kofi Asante, an electrician from Tema, shares how joining TaskGH changed his business — and his life.",
    date: "April 5, 2025",
    readTime: "6 min read",
    author: "TaskGH Team",
  },
  {
    slug: "home-maintenance-ghana",
    category: "Tips",
    categoryColor: "text-green-600 bg-green-50",
    title: "8 Home Maintenance Tasks Every Ghanaian Should Do Before the Rains",
    excerpt: "The rainy season is coming. A practical checklist to waterproof your home, clear your drains, and avoid costly repairs.",
    date: "March 28, 2025",
    readTime: "7 min read",
    author: "TaskGH Team",
  },
  {
    slug: "gig-economy-ghana",
    category: "Industry",
    categoryColor: "text-slate-600 bg-slate-100",
    title: "The Rise of the Skilled Gig Worker in Ghana",
    excerpt: "How digital platforms are reshaping how artisans, cleaners, and technicians find work — and what it means for Ghana's economy.",
    date: "March 20, 2025",
    readTime: "8 min read",
    author: "TaskGH Team",
  },
  {
    slug: "payment-security",
    category: "Platform",
    categoryColor: "text-purple-600 bg-purple-50",
    title: "Why TaskGH Holds Your Money in Escrow — And Why That's Good",
    excerpt: "Our escrow model protects both customers and taskers. Here's exactly how it works and the rare cases when we issue refunds.",
    date: "March 14, 2025",
    readTime: "5 min read",
    author: "TaskGH Team",
  },
];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
            The TaskGH Blog
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Guides, stories, and insights on home services, the Ghanaian gig economy, and platform updates.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Featured Post */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 mb-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full bg-white/20 mb-4`}>{featured.category}</span>
            <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-tight" style={{ fontFamily: "var(--font-jakarta)" }}>{featured.title}</h2>
            <p className="text-blue-100 mb-6 max-w-2xl leading-relaxed">{featured.excerpt}</p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 text-blue-200 text-sm">
                <span>{featured.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
              </div>
              <span className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold text-sm px-5 py-2.5 rounded-xl cursor-default opacity-60">
                Coming Soon <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <div key={post.slug} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all flex flex-col">
              <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-3 self-start ${post.categoryColor}`}>
                {post.category}
              </span>
              <h3 className="font-bold text-slate-900 mb-2 leading-snug flex-1">{post.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto pt-4 border-t border-slate-100">
                <span>{post.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-slate-50 rounded-2xl p-8">
          <p className="font-semibold text-slate-700 mb-1">More articles coming soon</p>
          <p className="text-slate-400 text-sm">Follow us on social media or subscribe for updates.</p>
        </div>
      </div>
    </div>
  );
}
