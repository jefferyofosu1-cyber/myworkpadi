import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Search, Activity, Briefcase, Settings, Shield, MoreVertical, Edit, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  // Fetch all users
  const { data: users } = await supabase
    .from("profiles")
    .select(`
      *,
      tasker_profile:tasker_profiles (is_verified, rating)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="flex h-[calc(100vh-80px)] mt-20">
        {/* Sidebar */}
        <div className="w-64 bg-background border-r border-border hidden md:flex flex-col">
          <div className="p-6">
            <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6">Administration</div>
            <nav className="space-y-1.5">
              {[
                { href: "/admin/dashboard", label: "Overview", icon: Activity, active: false },
                { href: "/admin/users", label: "Users", icon: Users, active: true },
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
        <div className="flex-1 overflow-auto bg-background transition-colors duration-300">
          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-1 tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Users
                </h1>
                <p className="text-muted text-sm font-medium">Platform reach and role management.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl bg-foreground/[0.02] border border-border px-4 py-3 shadow-inner group focus-within:border-primary/50 transition-all">
                  <Search className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
                  <input type="text" placeholder="Search accounts..." className="outline-none border-none bg-transparent placeholder-muted/50 text-foreground text-xs font-bold uppercase tracking-widest w-64" />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-foreground/[0.02] rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-foreground/5">
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Account</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Access Role</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Registration</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border">Verification</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {!users || users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((u: any) => (
                        <tr key={u.id} className="group border-b border-border/50 hover:bg-foreground/[0.02] transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-black text-[10px] uppercase shadow-inner">
                                {u.full_name?.charAt(0) || u.email?.charAt(0) || "?"}
                              </div>
                              <div>
                                <div className="font-bold text-foreground text-xs uppercase tracking-tight">{u.full_name || 'N/A'}</div>
                                <div className="text-[10px] font-black text-muted uppercase tracking-widest mt-0.5">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              u.role === 'admin' ? 'bg-primary text-white' :
                              u.role === 'tasker' ? 'bg-accent/20 text-accent font-black' :
                              'bg-foreground/10 text-muted'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-muted text-[10px] font-black uppercase tracking-widest">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5">
                            {u.role === "tasker" ? (
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                u.tasker_profile?.is_verified ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${u.tasker_profile?.is_verified ? 'bg-primary' : 'bg-red-500'}`} />
                                {u.tasker_profile?.is_verified ? 'Identity verified' : 'Unverified'}
                              </span>
                            ) : (
                              <span className="text-muted/30 text-[10px] font-black uppercase tracking-widest">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
