import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users, Briefcase, DollarSign, Activity, Settings, UserCheck, Search, Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, avatar_url")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const firstName = profile?.full_name?.split(" ")[0] || "Admin";

  // Fetch quick stats
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true });
  
  const { data: bookings } = await supabase
    .from("bookings")
    .select("amount, status")
    .eq("status", "completed");
    
  const totalRevenue = bookings?.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) ?? 0;
  // Platform fee is typically a percentage, let's say 15%
  const platformRevenue = totalRevenue * 0.15;

  const { data: recentBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      customer:customer_id (full_name),
      tasker:tasker_id (full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Total Bookings", value: totalBookings ?? 0, icon: Briefcase, color: "text-orange-600 bg-orange-50" },
    { label: "Platform Revenue", value: `GH₵ ${platformRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-600 bg-green-50" },
    { label: "Active Sessions", value: "24", icon: Activity, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="flex h-[calc(100vh-80px)] mt-20">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 hidden md:block">
          <div className="p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Administration</div>
            <nav className="space-y-2">
              <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium transition-colors">
                <Activity className="w-5 h-5" />
                Overview
              </Link>
              <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                <Users className="w-5 h-5" />
                Users
              </Link>
              <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                <Briefcase className="w-5 h-5" />
                Bookings
              </Link>
              <Link href="/admin/verifications" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                <Shield className="w-5 h-5" />
                Verifications
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Admin Dashboard
                </h1>
                <p className="text-slate-500 text-sm">Welcome back, {firstName}. Here's what's happening today.</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm shadow-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="outline-none border-none bg-transparent placeholder-slate-400 text-slate-800" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
                  <div className="text-slate-500 text-xs font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-800">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-blue-600 text-sm font-semibold hover:underline">View all</Link>
              </div>

              {!recentBookings || recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No bookings found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="pb-3 text-xs font-semibold text-slate-400 uppercase border-b border-slate-100">Task</th>
                        <th className="pb-3 text-xs font-semibold text-slate-400 uppercase border-b border-slate-100">Customer</th>
                        <th className="pb-3 text-xs font-semibold text-slate-400 uppercase border-b border-slate-100">Status</th>
                        <th className="pb-3 text-xs font-semibold text-slate-400 uppercase border-b border-slate-100 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {recentBookings.map((booking: any) => (
                        <tr key={booking.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-4">
                            <div className="font-medium text-slate-800">{booking.title}</div>
                            <div className="text-xs text-slate-400 capitalize">{booking.category}</div>
                          </td>
                          <td className="py-4">
                            <div className="font-medium text-slate-800">{booking.customer?.full_name || 'Unknown'}</div>
                            <div className="text-xs text-slate-400">{booking.location}</div>
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4 text-right font-medium text-slate-800">
                            {booking.amount ? `GH₵ ${booking.amount}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
