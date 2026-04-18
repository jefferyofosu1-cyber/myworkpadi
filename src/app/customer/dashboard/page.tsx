import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Search, CalendarDays, CreditCard, Star, MapPin, Bell,
  ChevronRight, Package, Clock, CheckCircle, TrendingUp, Zap, Heart
} from "lucide-react";
import Navbar from "@/components/Navbar";

const categories = [
  { name: "Cleaning", color: "bg-primary/10 text-primary", emoji: "🧹" },
  { name: "Plumbing", color: "bg-primary/10 text-primary", emoji: "🔧" },
  { name: "Electrical", color: "bg-accent/10 text-accent", emoji: "⚡" },
  { name: "Moving", color: "bg-primary/10 text-primary", emoji: "📦" },
  { name: "Painting", color: "bg-accent/10 text-accent", emoji: "🎨" },
  { name: "AC Repair", color: "bg-primary/10 text-primary", emoji: "❄️" },
];

export default async function CustomerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", user.id)
    .single();

  if (profile?.role === "tasker") redirect("/tasker/dashboard");

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, tasker_profiles(full_name, avatar_url)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total Bookings", value: bookings?.length ?? 0, icon: Package, color: "text-primary bg-primary/10" },
    { label: "Active Tasks", value: bookings?.filter((b: any) => b.status === "active").length ?? 0, icon: Clock, color: "text-accent bg-accent/10" },
    { label: "Completed", value: bookings?.filter((b: any) => b.status === "completed").length ?? 0, icon: CheckCircle, color: "text-green-500 bg-green-500/10" },
    { label: "Total Spent", value: `GH₵ ${bookings?.reduce((s: number, b: any) => s + (b.amount || 0), 0) ?? 0}`, icon: TrendingUp, color: "text-primary bg-primary/10" },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-foreground" style={{ fontFamily: "var(--font-jakarta)" }}>
              Welcome, {firstName} 👋
            </h1>
            <p className="text-muted text-sm mt-1">Here is what's happening with your tasks today.</p>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-black px-6 py-3 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider"
          >
            + Book a Task
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search for a service (e.g. Electrician, Plumber…)"
            className="w-full pl-12 pr-4 py-4 bg-foreground/[0.02] rounded-2xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm text-foreground placeholder-slate-400 shadow-sm transition-all"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-foreground/[0.02] rounded-2xl p-5 border border-border shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-foreground mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
              <div className="text-muted text-[10px] font-black uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Categories */}
          <div className="lg:col-span-1 bg-foreground/[0.02] rounded-2xl border border-border shadow-sm p-6">
            <h2 className="font-black text-foreground text-sm uppercase tracking-widest mb-4">Categories</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((c) => (
                <Link
                  key={c.name}
                  href={`/booking?category=${c.name.toLowerCase()}`}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl ${c.color} hover:scale-105 transition-all text-center border border-transparent hover:border-primary/20 shadow-sm`}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-tight">{c.name}</span>
                </Link>
              ))}
            </div>
            <Link href="/booking" className="flex items-center justify-center gap-1.5 mt-6 text-primary text-xs font-black uppercase tracking-widest hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-foreground/[0.02] rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-foreground text-sm uppercase tracking-widest">Recent Bookings</h2>
              <Link href="/customer/bookings" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">View all</Link>
            </div>
            {!bookings || bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-muted" />
                </div>
                <p className="text-muted text-sm font-bold mb-1">No bookings yet</p>
                <p className="text-muted/60 text-xs">Book your first task and get things done!</p>
                <Link href="/booking" className="inline-flex items-center gap-1.5 mt-4 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors">
                  Browse <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b: any) => (
                  <Link
                    key={b.id}
                    href={`/customer/bookings/${b.id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-foreground/[0.04] transition-colors border border-transparent hover:border-border group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl shadow-inner shadow-primary/5">
                      {categories.find(c => c.name.toLowerCase() === b.category?.toLowerCase())?.emoji || "🔧"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{b.title}</p>
                      <p className="text-muted text-[10px] uppercase font-black tracking-tight">{new Date(b.created_at).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        b.status === "completed" ? "bg-green-500/10 text-green-500" :
                        b.status === "active" ? "bg-primary/10 text-primary" :
                        b.status === "pending" ? "bg-accent/10 text-accent" :
                        "bg-foreground/5 text-muted"
                      }`}>
                        {b.status}
                      </span>
                      {b.amount && <span className="text-xs text-primary font-black">GH₵{b.amount}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
