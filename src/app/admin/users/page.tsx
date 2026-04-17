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
        <div className="w-64 bg-white border-r border-slate-200 hidden md:block">
          <div className="p-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Administration</div>
            <nav className="space-y-2">
              <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                <Activity className="w-5 h-5" />
                Overview
              </Link>
              <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium transition-colors">
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
                  Users List
                </h1>
                <p className="text-slate-500 text-sm">Manage customers, taskers, and platform administrators.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm shadow-sm">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search users by name or email..." className="outline-none border-none bg-transparent placeholder-slate-400 text-slate-800 w-64" />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">User</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">Role</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">Joined</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100 text-right">Actions</th>
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
                        <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold uppercase">
                                {u.full_name?.charAt(0) || u.email?.charAt(0) || "?"}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800">{u.full_name || 'N/A'}</div>
                                <div className="text-xs text-slate-500">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'tasker' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {u.role === "tasker" ? (
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                                u.tasker_profile?.is_verified ? 'text-green-700' : 'text-orange-600'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${u.tasker_profile?.is_verified ? 'bg-green-500' : 'bg-orange-500'}`} />
                                {u.tasker_profile?.is_verified ? 'Verified' : 'Pending'}
                              </span>
                            ) : (
                              <span className="text-slate-400">--</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
