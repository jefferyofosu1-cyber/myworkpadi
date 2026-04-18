import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Search, Activity, Briefcase, Settings, Shield, MoreVertical, Edit, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  // Fetch all bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      customer:customer_id (full_name, email),
      tasker:tasker_id (full_name)
    `)
    .order("created_at", { ascending: false });

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
                { href: "/admin/dashboard", label: "Overview", icon: Activity, active: false },
                { href: "/admin/users", label: "Users", icon: Users, active: false },
                { href: "/admin/bookings", label: "Bookings", icon: Briefcase, active: true },
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
        <div className="flex-1 overflow-auto bg-background transition-colors duration-300">
          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-1 tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Bookings
                </h1>
                <p className="text-muted text-sm font-medium">Job flow monitoring and escrow status.</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-foreground/[0.02] border border-border px-4 py-3 shadow-inner group focus-within:border-primary/50 transition-all">
                <Search className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
                <input type="text" placeholder="Search tasks..." className="outline-none border-none bg-transparent placeholder-muted/50 text-foreground text-xs font-bold uppercase tracking-widest w-64" />
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-foreground/[0.02] rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-foreground/5">
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Job Details</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Customer</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Worker</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Flow & Fee</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {!bookings || bookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking: any) => (
                        <tr key={booking.id} className="group border-b border-border/50 hover:bg-foreground/[0.02] transition-colors">
                          <td className="px-6 py-5">
                            <div className="font-bold text-foreground text-xs uppercase tracking-tight mb-0.5">{booking.title}</div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest">
                              <span className="text-primary">{booking.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1 opacity-50"><Calendar className="w-3 h-3" /> {new Date(booking.created_at).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-bold text-foreground text-xs uppercase tracking-tight">{booking.customer?.full_name || 'N/A'}</div>
                            <div className="text-[10px] font-black text-muted uppercase tracking-widest line-clamp-1">{booking.location}</div>
                          </td>
                          <td className="px-6 py-5">
                            {booking.tasker ? (
                              <div className="font-bold text-foreground text-xs uppercase tracking-tight">{booking.tasker.full_name}</div>
                            ) : (
                              <span className="inline-flex py-1 px-3 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse border border-red-500/20">
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-1.5 items-start">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                booking.status === 'completed' ? 'bg-primary text-white shadow-lg shadow-primary/20' :
                                booking.status === 'pending' ? 'bg-accent/20 text-accent' :
                                'bg-foreground/10 text-muted'
                              }`}>
                                {booking.status}
                              </span>
                              <span className="font-black text-foreground text-[10px] uppercase tracking-widest">
                                {booking.amount ? `GH₵ ${booking.amount}` : 'Quote Ref'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all inline-flex">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
