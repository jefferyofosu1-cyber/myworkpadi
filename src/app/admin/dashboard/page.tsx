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
    { label: "Booking Protection", value: formatGHS(bookingProtectionRevenue), icon: ShieldCheck, color: "text-primary bg-primary/10", desc: `GH₵10 × ${totalBookings} tasks` },
    { label: "Service Charge", value: formatGHS(secureServiceChargeRevenue), icon: CreditCard, color: "text-accent bg-accent/10", desc: "5% of all job amounts" },
    { label: "Tasker Success", value: formatGHS(taskerSuccessFeeRevenue), icon: Wallet, color: "text-primary bg-primary/10", desc: "10% of completed work" },
    { label: "Total Revenue", value: formatGHS(totalPlatformRevenue), icon: TrendingUp, color: "text-accent bg-accent/10", desc: "Combined platform earnings" },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <div className="flex h-[calc(100vh-80px)] mt-20">

        {/* Sidebar */}
        <div className="w-64 bg-background border-r border-border hidden md:flex flex-col">
          <div className="p-6">
            <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6">Administration</div>
            <nav className="space-y-1.5">
              {[
                { href: "/admin/dashboard", label: "Overview", icon: Activity, active: true },
                { href: "/admin/users", label: "Users", icon: Users, active: false },
                { href: "/admin/bookings", label: "Bookings", icon: Briefcase, active: false },
                { href: "/admin/verifications", label: "Verifications", icon: Shield, active: false },
                { href: "/admin/settings", label: "Settings", icon: Settings, active: false },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest ${item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted hover:bg-foreground/5"}`}>
                  <item.icon className="w-4 h-4" />
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
            <div className="mb-10">
              <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                Overview
              </h1>
              <p className="text-muted text-sm font-medium">Platform reach and revenue summary.</p>
            </div>

            {/* Platform Snapshot */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "text-primary bg-primary/10" },
                { label: "Total Jobs", value: totalBookings ?? 0, icon: Briefcase, color: "text-accent bg-accent/10" },
                { label: "Active Workers", value: taskerCount ?? 0, icon: Star, color: "text-primary bg-primary/10" },
                { label: "Customers", value: customerCount ?? 0, icon: Activity, color: "text-accent bg-accent/10" },
              ].map(s => (
                <div key={s.label} className="bg-foreground/[0.02] rounded-2xl p-6 border border-border shadow-sm">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${s.color}`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-black text-foreground mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-muted">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue Streams */}
            <div className="mb-10">
              <h2 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Revenue breakdown</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {revenueCards.map(c => (
                  <div key={c.label} className="bg-foreground/[0.02] rounded-2xl p-6 border border-border shadow-sm">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${c.color} shadow-inner`}>
                      <c.icon className="w-6 h-6" />
                    </div>
                    <div className="text-xl font-black text-foreground mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>{c.value}</div>
                    <div className="text-[10px] font-black text-muted uppercase tracking-tight">{c.label}</div>
                    <div className="text-muted/40 text-[9px] font-bold uppercase mt-1">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Top Categories */}
              <div className="bg-foreground/[0.02] rounded-3xl border border-border shadow-sm p-6">
                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6">Top Categories</h3>
                {topCategories.length === 0 ? (
                  <p className="text-muted/40 text-[10px] font-black uppercase text-center py-10">No data available</p>
                ) : (
                  <div className="space-y-5">
                    {topCategories.map(([cat, count], i) => (
                      <div key={cat}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black uppercase text-foreground tracking-tight">{cat.replace("-", " ")}</span>
                          <span className="text-[10px] font-black text-primary uppercase">{count} jobs</span>
                        </div>
                        <div className="w-full bg-foreground/5 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-primary h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${(count / (topCategories[0]?.[1] || 1)) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Health */}
              <div className="lg:col-span-2 bg-foreground/[0.02] rounded-3xl border border-border shadow-sm p-6">
                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6">Booking Health</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-primary/10 rounded-2xl p-4 text-center border border-primary/20">
                    <div className="text-2xl font-black text-primary">{completedBookings.length}</div>
                    <div className="text-[10px] text-primary/70 font-black uppercase mt-1">Done</div>
                  </div>
                  <div className="bg-accent/10 rounded-2xl p-4 text-center border border-accent/20">
                    <div className="text-2xl font-black text-accent">{pendingBookings.length}</div>
                    <div className="text-[10px] text-accent/70 font-black uppercase mt-1">Pending</div>
                  </div>
                  <div className="bg-red-500/10 rounded-2xl p-4 text-center border border-red-500/20">
                    <div className="text-2xl font-black text-red-500">{cancelledBookings.length}</div>
                    <div className="text-[10px] text-red-500/70 font-black uppercase mt-1">Void</div>
                  </div>
                </div>

                {/* Recent Bookings Table */}
                <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Latest activity</h4>
                {!recentBookings || recentBookings.length === 0 ? (
                  <p className="text-center text-muted/40 text-[10px] font-black uppercase py-6">No activity recorded</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-3 text-[10px] font-black text-muted uppercase tracking-widest">Task</th>
                          <th className="pb-3 text-[10px] font-black text-muted uppercase tracking-widest">User</th>
                          <th className="pb-3 text-[10px] font-black text-muted uppercase tracking-widest text-right">Fee</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {recentBookings.map((b: any) => (
                          <tr key={b.id} className="group hover:bg-foreground/[0.02]">
                            <td className="py-4">
                              <div className="font-bold text-foreground text-xs uppercase tracking-tight">{b.title || b.category}</div>
                              <div className="text-muted text-[10px] font-black uppercase tracking-widest">{b.category}</div>
                            </td>
                            <td className="py-4 text-[10px] font-black text-muted uppercase tracking-widest">{b.customer?.full_name || b.guest_name || "Guest"}</td>
                            <td className="py-4 text-right">
                              <div className="text-xs font-black text-foreground uppercase tracking-widest">
                                {b.total_amount ? formatGHS(b.total_amount) : b.amount ? formatGHS(b.amount) : "—"}
                              </div>
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
