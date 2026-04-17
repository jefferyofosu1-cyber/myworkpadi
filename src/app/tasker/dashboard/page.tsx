import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, Clock, XCircle, DollarSign, Star, Briefcase, TrendingUp,
  CalendarCheck, Bell, User, ChevronRight, AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function TaskerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, avatar_url")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "tasker") redirect("/customer/dashboard");

  const firstName = profile?.full_name?.split(" ")[0] || "Tasker";

  const { data: taskerProfile } = await supabase
    .from("tasker_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: jobs } = await supabase
    .from("bookings")
    .select("*")
    .eq("tasker_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const totalEarnings = jobs?.filter(j => j.status === "completed").reduce((s, j) => s + (j.amount || 0), 0) ?? 0;
  const isVerified = taskerProfile?.is_verified;

  const stats = [
    { label: "Total Earnings", value: `GH₵ ${totalEarnings}`, icon: DollarSign, color: "text-green-600 bg-green-50", trend: "+12% this month" },
    { label: "Jobs Completed", value: jobs?.filter(j => j.status === "completed").length ?? 0, icon: CheckCircle, color: "text-blue-600 bg-blue-50", trend: "Great work!" },
    { label: "Pending Jobs", value: jobs?.filter(j => j.status === "pending").length ?? 0, icon: Clock, color: "text-orange-600 bg-orange-50", trend: "Review & accept" },
    { label: "Rating", value: `${taskerProfile?.rating?.toFixed(1) ?? "—"} ★`, icon: Star, color: "text-yellow-600 bg-yellow-50", trend: `${taskerProfile?.review_count ?? 0} reviews` },
  ];

  const taskActions = [
    { label: "On the way", status: "on_the_way", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    { label: "Started", status: "started", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { label: "Completed", status: "completed", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-slate-400 text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 flex items-center gap-2" style={{ fontFamily: "var(--font-jakarta)" }}>
              {firstName}
              {isVerified && <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full"><CheckCircle className="w-3 h-3" />Verified</span>}
              {!isVerified && <span className="inline-flex items-center gap-1 text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full"><AlertCircle className="w-3 h-3" />Pending Approval</span>}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/tasker/profile" className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all">
              <User className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Verification Banner */}
        {!isVerified && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-orange-800 text-sm mb-0.5">Your account is pending verification</h3>
              <p className="text-orange-600 text-xs">Upload your ID and complete your profile to start receiving jobs. Our team will review and approve within 24 hours.</p>
            </div>
            <Link href="/tasker/verification" className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
              Complete Verification
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-slate-900 mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
              <div className="text-slate-400 text-xs font-medium mb-1">{s.label}</div>
              <div className="text-slate-300 text-xs">{s.trend}</div>
            </div>
          ))}
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800">Incoming Job Requests</h2>
            <Link href="/tasker/jobs" className="text-blue-600 text-xs font-semibold hover:underline">View all</Link>
          </div>

          {!jobs || jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">No job requests yet</p>
              <p className="text-slate-300 text-xs">Complete your profile to start receiving jobs from customers.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job: any) => (
                <div key={job.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{job.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{job.location} · {new Date(job.scheduled_at || job.created_at).toLocaleDateString("en-GH", { weekday: "short", month: "short", day: "numeric" })}</p>
                    {job.amount && <p className="text-green-600 font-bold text-xs mt-1">GH₵ {job.amount}</p>}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {job.status === "pending" && (
                      <>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">Accept</button>
                        <button className="bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">Decline</button>
                      </>
                    )}
                    {job.status !== "pending" && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        job.status === "completed" ? "bg-green-100 text-green-700" :
                        job.status === "active" ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-500"
                      }`}>{job.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
