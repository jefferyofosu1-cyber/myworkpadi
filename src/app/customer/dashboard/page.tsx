import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Search, CalendarDays, CreditCard, Star, MapPin, Bell,
  ChevronRight, Package, Clock, CheckCircle, TrendingUp, Zap, Heart
} from "lucide-react";
import Navbar from "@/components/Navbar";

const categories = [
  { name: "Cleaning", color: "bg-green-100 text-green-700", emoji: "🧹" },
  { name: "Plumbing", color: "bg-blue-100 text-blue-700", emoji: "🔧" },
  { name: "Electrical", color: "bg-yellow-100 text-yellow-700", emoji: "⚡" },
  { name: "Moving", color: "bg-purple-100 text-purple-700", emoji: "📦" },
  { name: "Painting", color: "bg-pink-100 text-pink-700", emoji: "🎨" },
  { name: "AC Repair", color: "bg-cyan-100 text-cyan-700", emoji: "❄️" },
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
    { label: "Total Bookings", value: bookings?.length ?? 0, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Active Tasks", value: bookings?.filter(b => b.status === "active").length ?? 0, icon: Clock, color: "text-orange-600 bg-orange-50" },
    { label: "Completed", value: bookings?.filter(b => b.status === "completed").length ?? 0, icon: CheckCircle, color: "text-green-600 bg-green-50" },
    { label: "Total Spent", value: `GH₵ ${bookings?.reduce((s, b) => s + (b.amount || 0), 0) ?? 0}`, icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
              Welcome, {firstName} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here is what's happening with your tasks today.</p>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all text-sm"
          >
            + Book a Task
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search for a service (e.g. Electrician, Plumber…)"
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-700 placeholder-slate-300 shadow-sm transition-all"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-slate-900 mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
              <div className="text-slate-400 text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Categories */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4">Book by Category</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((c) => (
                <Link
                  key={c.name}
                  href={`/booking?category=${c.name.toLowerCase()}`}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${c.color} hover:scale-105 transition-all text-center`}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-xs font-semibold">{c.name}</span>
                </Link>
              ))}
            </div>
            <Link href="/booking" className="flex items-center justify-center gap-1.5 mt-4 text-blue-600 text-sm font-semibold hover:underline">
              See all services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Recent Bookings</h2>
              <Link href="/customer/bookings" className="text-blue-600 text-xs font-semibold hover:underline">View all</Link>
            </div>
            {!bookings || bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">No bookings yet</p>
                <p className="text-slate-300 text-xs">Book your first task and get things done!</p>
                <Link href="/booking" className="inline-flex items-center gap-1.5 mt-4 bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                  Browse services <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b: any) => (
                  <Link
                    key={b.id}
                    href={`/customer/bookings/${b.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                      {categories.find(c => c.name.toLowerCase() === b.category?.toLowerCase())?.emoji || "🔧"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{b.title}</p>
                      <p className="text-slate-400 text-xs">{new Date(b.created_at).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        b.status === "completed" ? "bg-green-100 text-green-700" :
                        b.status === "active" ? "bg-blue-100 text-blue-700" :
                        b.status === "pending" ? "bg-orange-100 text-orange-700" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {b.status}
                      </span>
                      {b.amount && <span className="text-xs text-slate-400 font-medium">GH₵{b.amount}</span>}
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
