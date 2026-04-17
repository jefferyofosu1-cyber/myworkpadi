import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users, Briefcase, DollarSign, Activity, Settings, Shield,
  TrendingUp, Star, AlertTriangle, RefreshCw, ShieldCheck, CreditCard, Wallet
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { BOOKING_PROTECTION, SECURE_SERVICE_RATE, TASKER_SUCCESS_RATE, formatGHS } from "@/lib/pricing";

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

  // Platform stats
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true });
  const { count: taskerCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "tasker");
  const { count: customerCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer");

  // Revenue data
  const { data: allBookings } = await supabase
    .from("bookings")
    .select("amount, status, booking_protection_fee, secure_service_charge, created_at, category, is_guest");

  const completedBookings = allBookings?.filter((b: any) => b.status === "completed") ?? [];
  const pendingBookings = allBookings?.filter((b: any) => b.status === "pending") ?? [];
  const cancelledBookings = allBookings?.filter((b: any) => b.status === "cancelled") ?? [];

  const totalCompletedAmount = completedBookings.reduce((s: number, b: any) => s + (b.amount || 0), 0);

  // Revenue streams
  const bookingProtectionRevenue = (allBookings?.length ?? 0) * BOOKING_PROTECTION;
  const secureServiceChargeRevenue = allBookings?.reduce((s: number, b: any) => s + (b.secure_service_charge || b.amount * SECURE_SERVICE_RATE || 0), 0) ?? 0;
  const taskerSuccessFeeRevenue = totalCompletedAmount * TASKER_SUCCESS_RATE;
  const totalPlatformRevenue = bookingProtectionRevenue + secureServiceChargeRevenue + taskerSuccessFeeRevenue;

  // Top categories
  const categoryCount: Record<string, number> = {};
  allBookings?.forEach((b: any) => { if (b.category) categoryCount[b.category] = (categoryCount[b.category] || 0) + 1; });
  const topCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, customer:customer_id (full_name)")
    .order("created_at", { ascending: false })
    .limit(8);

  const revenueCards = [
    { label: "Booking Protection", value: formatGHS(bookingProtectionRevenue), icon: ShieldCheck, color: "text-blue-600 bg-blue-50", desc: `GH₵10 × ${totalBookings} bookings` },
    { label: "Secure Service Charge", value: formatGHS(secureServiceChargeRevenue), icon: CreditCard, color: "text-purple-600 bg-purple-50", desc: "5% of all booking amounts" },
    { label: "Tasker Success", value: formatGHS(taskerSuccessFeeRevenue), icon: Wallet, color: "text-green-600 bg-green-50", desc: "10% of completed jobs" },
    { label: "Total Revenue", value: formatGHS(totalPlatformRevenue), icon: TrendingUp, color: "text-orange-600 bg-orange-50", desc: "All revenue streams combined" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex h-[calc(100vh-80px)] mt-20">

        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
          <div className="p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Administration</div>
            <nav className="space-y-1">
              {[
                { href: "/admin/dashboard", label: "Overview", icon: Activity, active: true },
                { href: "/admin/users", label: "Users", icon: Users, active: false },
                { href: "/admin/bookings", label: "Bookings", icon: Briefcase, active: false },
                { href: "/admin/verifications", label: "Verifications", icon: Shield, active: false },
                { href: "/admin/settings", label: "Settings", icon: Settings, active: false },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${item.active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                Admin Dashboard
              </h1>
              <p className="text-slate-500 text-sm">Welcome, {firstName}. Here's your platform overview.</p>
            </div>

            {/* Platform Snapshot */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "text-blue-600 bg-blue-50" },
                { label: "Total Bookings", value: totalBookings ?? 0, icon: Briefcase, color: "text-orange-600 bg-orange-50" },
                { label: "Active Taskers", value: taskerCount ?? 0, icon: Star, color: "text-green-600 bg-green-50" },
                { label: "Customers", value: customerCount ?? 0, icon: Activity, color: "text-purple-600 bg-purple-50" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
                  <div className="text-slate-500 text-xs font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue Streams */}
            <div className="mb-8">
              <h2 className="font-bold text-slate-800 mb-4">Revenue Breakdown</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {revenueCards.map(c => (
                  <div key={c.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div className="text-lg font-black text-slate-900 mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>{c.value}</div>
                    <div className="text-slate-600 text-xs font-semibold">{c.label}</div>
                    <div className="text-slate-300 text-xs mt-0.5">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Top Categories */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4">Top Categories</h3>
                {topCategories.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-6">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {topCategories.map(([cat, count], i) => (
                      <div key={cat}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-slate-700 capitalize">{cat.replace("-", " ")}</span>
                          <span className="text-xs font-bold text-slate-500">{count} bookings</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${(count / (topCategories[0]?.[1] || 1)) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Health */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4">Booking Health</h3>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-green-700">{completedBookings.length}</div>
                    <div className="text-xs text-green-600 font-medium">Completed</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-orange-700">{pendingBookings.length}</div>
                    <div className="text-xs text-orange-600 font-medium">Pending</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-red-700">{cancelledBookings.length}</div>
                    <div className="text-xs text-red-600 font-medium">Cancelled</div>
                  </div>
                </div>

                {/* Recent Bookings Table */}
                <h4 className="font-semibold text-slate-700 text-sm mb-3">Recent Bookings</h4>
                {!recentBookings || recentBookings.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-4">No bookings yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="pb-2 text-xs font-semibold text-slate-400 uppercase">Task</th>
                          <th className="pb-2 text-xs font-semibold text-slate-400 uppercase">Customer</th>
                          <th className="pb-2 text-xs font-semibold text-slate-400 uppercase">Status</th>
                          <th className="pb-2 text-xs font-semibold text-slate-400 uppercase text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((b: any) => (
                          <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="py-2.5">
                              <div className="font-medium text-slate-800 text-xs">{b.title || b.category}</div>
                              <div className="text-slate-400 text-xs capitalize">{b.category} {b.is_guest && <span className="text-orange-500">· Guest</span>}</div>
                            </td>
                            <td className="py-2.5 text-xs text-slate-600">{b.customer?.full_name || b.guest_name || "Guest"}</td>
                            <td className="py-2.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                                b.status === "completed" ? "bg-green-100 text-green-700" :
                                b.status === "pending" ? "bg-orange-100 text-orange-700" :
                                "bg-blue-100 text-blue-700"}`}>{b.status}</span>
                            </td>
                            <td className="py-2.5 text-right text-xs font-semibold text-slate-800">
                              {b.total_amount ? formatGHS(b.total_amount) : b.amount ? formatGHS(b.amount) : "—"}
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
    </div>
  );
}
