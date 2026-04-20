import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, CalendarDays, CreditCard, Star, MapPin, Bell,
  ChevronRight, Package, Clock, CheckCircle, TrendingUp, Zap, Heart,
  Wrench, Home, Wind, Hammer, Brush, Truck, AlertCircle, Activity, Calendar
} from "lucide-react";
import Navbar from "@/components/Navbar";

const categories = [
  { name: "Cleaning", color: "bg-primary/10 text-primary", emoji: "🧹", icon: Home },
  { name: "Plumbing", color: "bg-primary/10 text-primary", emoji: "🔧", icon: Wrench },
  { name: "Electrical", color: "bg-accent/10 text-accent", emoji: "⚡", icon: Zap },
  { name: "Moving", color: "bg-primary/10 text-primary", emoji: "📦", icon: Truck },
  { name: "Painting", color: "bg-accent/10 text-accent", emoji: "🎨", icon: Brush },
  { name: "AC Repair", color: "bg-primary/10 text-primary", emoji: "❄️", icon: Wind },
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
    .select("*, tasker_profiles(full_name, avatar_url, rating)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const activeBooking = bookings?.find((b: any) => b.status === "active");
  const totalSpent = bookings?.reduce((s: number, b: any) => s + (b.total_amount || 0), 0) ?? 0;

  const stats = [
    { label: "Total Bookings", value: bookings?.length ?? 0, icon: Package, color: "text-primary" },
    { label: "Active Tasks", value: bookings?.filter((b: any) => b.status === "active").length ?? 0, icon: Activity, color: "text-accent" },
    { label: "Completed", value: bookings?.filter((b: any) => b.status === "completed").length ?? 0, icon: CheckCircle, color: "text-green-500" },
    { label: "Total Spent", value: `GH₵${totalSpent}`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Hero Welcome Section */}
        <div className="mb-12 bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-muted text-lg">Keep your life moving. Here's what's happening with your tasks.</p>
            </div>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all text-base uppercase tracking-wider whitespace-nowrap"
            >
              <Zap className="w-5 h-5" /> Book Now
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <div 
              key={s.label} 
              className="group bg-foreground/[0.02] hover:bg-foreground/[0.04] rounded-2xl p-6 border border-border hover:border-border/50 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${s.color} bg-current/10`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                {s.value}
              </div>
              <div className="text-muted text-xs font-black uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Active Task Alert */}
        {activeBooking && (
          <div className="mb-12 bg-primary/10 border-l-4 border-primary rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-foreground mb-1">You have an active task</h3>
                <p className="text-muted text-sm mb-3">{activeBooking.title} scheduled for {new Date(activeBooking.scheduled_at).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <Link href={`/customer/bookings/${activeBooking.id}`} className="inline-flex items-center gap-2 bg-primary text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-primary-dark transition-all">
                    View Details <ChevronRight className="w-3 h-3" />
                  </Link>
                  {activeBooking.tasker_profiles && (
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="w-8 h-8 bg-foreground/10 rounded-full flex items-center justify-center text-xs font-bold">
                        {activeBooking.tasker_profiles.full_name?.[0]}
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-foreground">{activeBooking.tasker_profiles.full_name}</p>
                        <p className="text-xs text-muted">⭐ {activeBooking.tasker_profiles.rating?.toFixed(1) || "New"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Categories */}
          <div className="lg:col-span-1">
            <div className="bg-foreground/[0.02] rounded-2xl border border-border shadow-sm p-6 sticky top-24">
              <h2 className="font-black text-foreground text-sm uppercase tracking-widest mb-6">Quick Book</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={c.name}
                      href={`/booking?category=${c.name.toLowerCase()}`}
                      className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl ${c.color} hover:scale-105 transition-all text-center border border-transparent hover:border-primary/30 shadow-sm hover:shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-tight">{c.name}</span>
                    </Link>
                  );
                })}
              </div>
              <Link href="/booking" className="flex items-center justify-center gap-1.5 mt-8 text-primary text-xs font-black uppercase tracking-widest hover:underline">
                View All Services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-foreground text-lg uppercase tracking-widest">Recent Activity</h2>
              <Link href="/customer/bookings" className="text-primary text-xs font-black uppercase tracking-widest hover:underline">View All</Link>
            </div>

            {!bookings || bookings.length === 0 ? (
              <div className="bg-foreground/[0.02] rounded-2xl border border-dashed border-border p-12 text-center">
                <div className="w-16 h-16 bg-foreground/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-muted" />
                </div>
                <p className="text-foreground font-black text-lg mb-1">No bookings yet</p>
                <p className="text-muted text-sm mb-6">Start by booking your first task to get things done!</p>
                <Link href="/booking" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-black px-6 py-3 rounded-xl hover:bg-primary-dark transition-all">
                  Browse Services <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 8).map((b: any) => {
                  const statusConfig = {
                    active: "bg-accent/10 text-accent border-accent/20",
                    completed: "bg-green-500/10 text-green-500 border-green-500/20",
                    pending: "bg-primary/10 text-primary border-primary/20",
                    cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
                  };
                  
                  return (
                    <Link
                      key={b.id}
                      href={`/customer/bookings/${b.id}`}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all border border-border hover:border-primary/30 group"
                    >
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl shadow-sm group-hover:scale-110 transition-transform">
                        {categories.find(c => c.name.toLowerCase() === b.category?.toLowerCase())?.emoji || "🔧"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">{b.title || b.category}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                          <Calendar className="w-3 h-3" />
                          {new Date(b.created_at).toLocaleDateString("en-GH", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${statusConfig[b.status as keyof typeof statusConfig] || statusConfig.pending}`}>
                          {b.status}
                        </span>
                        {b.total_amount && (
                          <span className="text-sm font-black text-primary">GH₵{b.total_amount.toFixed(0)}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
