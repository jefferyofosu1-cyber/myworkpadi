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
    categoryColor: "text-primary bg-primary/10",
    title: "How to Book a Trusted Professional in Under 60 Seconds",
    excerpt: "A step-by-step guide to getting a vetted tasker at your door — no account needed, no phone calls, no stress.",
    date: "April 15, 2025",
    readTime: "4 min read",
    author: "TaskGH Team",
  },
  {
    slug: "pricing-explained",
    category: "Platform",
    categoryColor: "text-accent bg-accent/10",
    title: "How TaskGH Pricing Works: Transparent, Fair, and Ghana-Built",
    excerpt: "We break down exactly what you pay and why — Booking Protection, Secure Service Charge, and what it means for your tasker.",
    date: "April 10, 2025",
    readTime: "5 min read",
    author: "TaskGH Team",
  },
  {
    slug: "tasker-success-story",
    category: "Story",
    categoryColor: "text-primary bg-primary/10",
    title: "From Odd Jobs to GH₵8,000 a Month: Kofi's Tasker Journey",
    excerpt: "Kofi Asante, an electrician from Tema, shares how joining TaskGH changed his business — and his life.",
    date: "April 5, 2025",
    readTime: "6 min read",
    author: "TaskGH Team",
  },
  {
    slug: "home-maintenance-ghana",
    category: "Tips",
    categoryColor: "text-accent bg-accent/10",
    title: "8 Home Maintenance Tasks Every Ghanaian Should Do Before the Rains",
    excerpt: "The rainy season is coming. A practical checklist to waterproof your home, clear your drains, and avoid costly repairs.",
    date: "March 28, 2025",
    readTime: "7 min read",
    author: "TaskGH Team",
  },
  {
    slug: "gig-economy-ghana",
    category: "Industry",
    categoryColor: "text-primary bg-primary/10",
    title: "The Rise of the Skilled Gig Worker in Ghana",
    excerpt: "How digital platforms are reshaping how artisans, cleaners, and technicians find work — and what it means for Ghana's economy.",
    date: "March 20, 2025",
    readTime: "8 min read",
    author: "TaskGH Team",
  },
  {
    slug: "payment-security",
    category: "Platform",
    categoryColor: "text-accent bg-accent/10",
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
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-black text-foreground mb-6 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>
            Newsroom
          </h1>
          <p className="text-muted text-xl max-w-xl mx-auto font-medium">
            Guides, stories, and insights on the future of labor in Ghana.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Featured Post */}
        <div className="bg-foreground/[0.02] border border-border rounded-[3rem] p-10 mb-16 relative overflow-hidden group hover:border-primary/30 transition-all shadow-2xl shadow-primary/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors" />
          <div className="relative z-10">
            <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-primary text-white mb-6 shadow-lg shadow-primary/20`}>{featured.category}</span>
            <h2 className="text-3xl lg:text-4xl font-black mb-4 leading-tight text-foreground uppercase tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>{featured.title}</h2>
            <p className="text-muted mb-8 max-w-2xl leading-relaxed font-medium text-lg">{featured.excerpt}</p>
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4 text-muted/60 text-[10px] font-black uppercase tracking-widest">
                <span>{featured.date}</span>
                <span>/</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{featured.readTime}</span>
              </div>
              <span className="inline-flex items-center gap-3 bg-foreground/5 text-muted font-black text-[10px] px-6 py-3 rounded-2xl uppercase tracking-[0.2em] opacity-50">
                Dispatching soon <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map(post => (
            <div key={post.slug} className="bg-foreground/[0.02] border border-border rounded-[2.5rem] p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col group">
              <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 self-start shadow-inner ${post.categoryColor}`}>
                {post.category}
              </span>
              <h3 className="text-lg font-black text-foreground mb-3 leading-snug flex-1 uppercase tracking-tight group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-muted text-sm font-medium leading-relaxed mb-8 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted/40 mt-auto pt-6 border-t border-border/50">
                <span>{post.date}</span>
                <span>/</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{post.readTime}</span>
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
