import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Activity,
  Shield,
  Settings,
  Search,
  Calendar,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { formatGHS } from "@/lib/pricing";

export default async function AdminPortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const [{ count: totalBookings }, { count: pendingBookings }, { count: activeBookings }, { count: completedBookings }, { count: cancelledBookings }, { count: totalUsers }, { data: recentBookings }] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select(`*, customer:customer_id (full_name, email), tasker:tasker_id (full_name)`)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <div className="flex h-[calc(100vh-80px)] mt-20">
        <div className="w-64 bg-background border-r border-border hidden md:flex flex-col">
          <div className="p-6">
            <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6">Administration</div>
            <nav className="space-y-1.5">
              {[
                { href: "/admin", label: "Overview", icon: Activity, active: true },
                { href: "/admin/users", label: "Users", icon: Users, active: false },
                { href: "/admin/bookings", label: "Bookings", icon: Briefcase, active: false },
                { href: "/admin/verifications", label: "Verifications", icon: Shield, active: false },
                { href: "/admin/settings", label: "Settings", icon: Settings, active: false },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest ${item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted hover:bg-foreground/5"}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Admin Portal
                </h1>
                <p className="text-muted text-sm font-medium max-w-2xl">
                  Manage bookings, monitor performance, and control access from one secure hub.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/bookings" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
                  Manage Bookings
                </Link>
                <Link href="/admin/users" className="inline-flex items-center gap-2 bg-foreground/[0.12] text-foreground px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-foreground/[0.18] transition-all">
                  Manage Users
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
              {[
                { label: "Total Bookings", value: totalBookings ?? 0, icon: Briefcase, accent: "bg-primary/10 text-primary" },
                { label: "Pending", value: pendingBookings ?? 0, icon: Clock, accent: "bg-accent/10 text-accent" },
                { label: "Active", value: activeBookings ?? 0, icon: CheckCircle, accent: "bg-primary/10 text-primary" },
                { label: "Completed", value: completedBookings ?? 0, icon: Shield, accent: "bg-emerald-500/10 text-emerald-500" },
                { label: "Cancelled", value: cancelledBookings ?? 0, icon: AlertTriangle, accent: "bg-red-500/10 text-red-500" },
              ].map(card => (
                <div key={card.label} className="bg-foreground/[0.02] rounded-3xl p-6 border border-border shadow-sm">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${card.accent}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-foreground mb-1">{card.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted">{card.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-10">
              <div className="lg:col-span-2 bg-foreground/[0.02] rounded-3xl border border-border shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted">Recent bookings</h2>
                    <p className="text-xs text-muted mt-2">Latest job requests and current status.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-foreground/[0.1] px-3 py-2 text-[10px] uppercase font-black tracking-widest text-muted">
                    <Search className="w-3.5 h-3.5" /> Search
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-foreground/5">
                        <th className="px-5 py-4 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Task</th>
                        <th className="px-5 py-4 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Customer</th>
                        <th className="px-5 py-4 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Worker</th>
                        <th className="px-5 py-4 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Status</th>
                        <th className="px-5 py-4 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {recentBookings && recentBookings.length > 0 ? (
                        recentBookings.map((booking: any) => (
                          <tr key={booking.id} className="group hover:bg-foreground/[0.03] transition-colors">
                            <td className="px-5 py-4 font-black text-foreground text-xs uppercase tracking-tight">{booking.title || booking.category}</td>
                            <td className="px-5 py-4 text-[10px] font-black text-muted uppercase tracking-widest">{booking.customer?.full_name || "Guest"}</td>
                            <td className="px-5 py-4 text-[10px] font-black text-muted uppercase tracking-widest">{booking.tasker?.full_name || "Unassigned"}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                booking.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : booking.status === "pending" ? "bg-accent/10 text-accent" : booking.status === "active" ? "bg-primary/10 text-primary" : "bg-foreground/10 text-muted"
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right font-black text-foreground text-xs uppercase tracking-tight">{formatGHS(booking.amount ?? 0)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center text-muted text-xs font-black uppercase tracking-widest">No recent bookings available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-foreground/[0.02] rounded-3xl border border-border shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted">Booking controls</h3>
                      <p className="text-[10px] text-muted mt-2">Quick access to admin actions.</p>
                    </div>
                    <Calendar className="w-5 h-5 text-muted" />
                  </div>
                  <div className="grid gap-3">
                    <Link href="/admin/bookings" className="block rounded-2xl border border-border bg-background px-4 py-4 text-sm font-black text-foreground hover:border-primary hover:bg-primary/5 transition-all">
                      View all bookings
                    </Link>
                    <Link href="/admin/users" className="block rounded-2xl border border-border bg-background px-4 py-4 text-sm font-black text-foreground hover:border-primary hover:bg-primary/5 transition-all">
                      Manage users
                    </Link>
                    <Link href="/admin/verifications" className="block rounded-2xl border border-border bg-background px-4 py-4 text-sm font-black text-foreground hover:border-primary hover:bg-primary/5 transition-all">
                      Review verifications
                    </Link>
                  </div>
                </div>

                <div className="bg-foreground/[0.02] rounded-3xl border border-border shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted">System status</h3>
                      <p className="text-[10px] text-muted mt-2">Current admin portal health.</p>
                    </div>
                    <MoreVertical className="w-5 h-5 text-muted" />
                  </div>
                  <div className="space-y-4 text-[10px] font-black uppercase tracking-widest text-muted">
                    <div className="flex justify-between gap-4">
                      <span>Booking sync</span>
                      <span className="text-emerald-500">Online</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Notifications</span>
                      <span className="text-accent">Enabled</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Audit trail</span>
                      <span className="text-primary">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
