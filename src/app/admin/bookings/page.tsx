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
              <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                <Users className="w-5 h-5" />
                Users
              </Link>
              <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium transition-colors">
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
                  Bookings Management
                </h1>
                <p className="text-slate-500 text-sm">Monitor and manage all task bookings on the platform.</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm shadow-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search bookings by ID or Task..." className="outline-none border-none bg-transparent placeholder-slate-400 text-slate-800 w-64" />
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">Task Details</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">Customer</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">Tasker</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">Status & Price</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100 text-right">Actions</th>
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
                        <tr key={booking.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800 mb-0.5">{booking.title}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="capitalize">{booking.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.created_at).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-800">{booking.customer?.full_name || 'N/A'}</div>
                            <div className="text-xs text-slate-500">{booking.location}</div>
                          </td>
                          <td className="px-6 py-4">
                            {booking.tasker ? (
                              <div className="font-medium text-slate-800">{booking.tasker.full_name}</div>
                            ) : (
                              <span className="inline-flex py-1 px-2 rounded-lg bg-orange-50 text-orange-600 text-xs font-medium">
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {booking.status}
                              </span>
                              <span className="font-bold text-slate-800 text-xs">
                                {booking.amount ? `GH₵ ${booking.amount}` : 'Quote Requested'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex">
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
