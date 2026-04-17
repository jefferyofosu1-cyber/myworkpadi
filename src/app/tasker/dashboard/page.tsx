import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, Clock, DollarSign, Star, Briefcase, TrendingUp,
  AlertCircle, Wallet, CalendarDays, Award, ChevronRight, ArrowUpRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { calculateTaskerPayout, formatGHS } from "@/lib/pricing";

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
    .order("created_at", { ascending: false });

  const completedJobs = jobs?.filter((j: any) => j.status === "completed") ?? [];
  const pendingJobs = jobs?.filter((j: any) => j.status === "pending") ?? [];
  const activeJobs = jobs?.filter((j: any) => j.status === "active") ?? [];

  const grossEarnings = completedJobs.reduce((s: number, j: any) => s + (j.amount || 0), 0);
  const { netPayout, successFee } = completedJobs.length > 0
    ? calculateTaskerPayout(grossEarnings)
    : { netPayout: 0, successFee: 0 };

  const isVerified = taskerProfile?.is_verified;

  const stats = [
    { label: "Net Earnings", value: formatGHS(netPayout), icon: Wallet, color: "text-green-600 bg-green-50", sub: `Success deduction: ${formatGHS(successFee)}` },
    { label: "Jobs Completed", value: completedJobs.length, icon: CheckCircle, color: "text-blue-600 bg-blue-50", sub: "All time" },
    { label: "Pending Requests", value: pendingJobs.length, icon: Clock, color: "text-orange-600 bg-orange-50", sub: "Awaiting response" },
    { label: "Rating", value: `${taskerProfile?.rating?.toFixed(1) ?? "—"} ★`, icon: Star, color: "text-yellow-600 bg-yellow-50", sub: `${taskerProfile?.review_count ?? 0} reviews` },
  ];

  // Performance score
  const total = jobs?.length ?? 0;
  const completionRate = total > 0 ? Math.round((completedJobs.length / total) * 100) : 0;
  const acceptanceRate = total > 0 ? Math.round(((total - pendingJobs.length) / total) * 100) : 0;
  const performanceScore = Math.round((completionRate + acceptanceRate) / 2);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 flex flex-wrap items-center gap-2" style={{ fontFamily: "var(--font-jakarta)" }}>
              Welcome, {firstName} 👋
              {isVerified && <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full"><CheckCircle className="w-3 h-3" />Verified</span>}
              {!isVerified && <span className="inline-flex items-center gap-1 text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full"><AlertCircle className="w-3 h-3" />Pending Verification</span>}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Ready to earn? Here are your latest job requests.</p>
          </div>
          <Link href="/tasker/profile" className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all">
            Edit Profile
          </Link>
        </div>

        {/* Verification Banner */}
        {!isVerified && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-orange-800 text-sm mb-0.5">Complete your verification to get jobs</h3>
              <p className="text-orange-600 text-xs">Upload your ID and complete your profile. Our team reviews within 24 hours.</p>
            </div>
            <Link href="/tasker/verification" className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
              Complete Verification
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-slate-900 mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
              <div className="text-slate-500 text-xs font-medium">{s.label}</div>
              <div className="text-slate-300 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Earnings Wallet */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-200" />
                  <span className="text-sm font-semibold text-blue-200">Earnings Wallet</span>
                </div>
              </div>
              <div className="mb-1 text-3xl font-black" style={{ fontFamily: "var(--font-jakarta)" }}>{formatGHS(netPayout)}</div>
              <div className="text-blue-200 text-xs mb-4">Available balance</div>
              <div className="bg-white/10 rounded-xl p-3 mb-4 text-xs space-y-1">
                <div className="flex justify-between text-blue-200">
                  <span>Gross earnings</span><span className="text-white font-semibold">{formatGHS(grossEarnings)}</span>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>Success deduction (10%)</span><span className="text-white font-semibold">-{formatGHS(successFee)}</span>
                </div>
              </div>
              <button className="w-full bg-white text-blue-700 font-bold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> Withdraw Funds
              </button>
            </div>

            {/* Performance Score */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-800">Performance Score</h3>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Overall Score</span>
                <span className={`text-sm font-black ${performanceScore >= 80 ? "text-green-600" : performanceScore >= 60 ? "text-orange-600" : "text-red-600"}`}>{performanceScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                <div className={`h-2 rounded-full transition-all ${performanceScore >= 80 ? "bg-green-500" : performanceScore >= 60 ? "bg-orange-500" : "bg-red-500"}`}
                  style={{ width: `${performanceScore}%` }} />
              </div>
              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Completion rate</span>
                  <span className="font-semibold text-slate-800">{completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Acceptance rate</span>
                  <span className="font-semibold text-slate-800">{acceptanceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. rating</span>
                  <span className="font-semibold text-slate-800">{taskerProfile?.rating?.toFixed(1) ?? "—"} / 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Queue */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-800">Incoming Job Requests</h2>
              <Link href="/tasker/jobs" className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Active Jobs */}
            {activeJobs.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Active Now</p>
                <div className="space-y-2">
                  {activeJobs.map((job: any) => (
                    <div key={job.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{job.title || job.category}</p>
                        <p className="text-xs text-slate-500">{job.location}</p>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Jobs */}
            {pendingJobs.length === 0 && activeJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">No job requests yet</p>
                <p className="text-slate-300 text-xs">Complete your profile to start receiving jobs from customers.</p>
              </div>
            ) : (
              <>
                {pendingJobs.length > 0 && (
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Awaiting Response</p>
                )}
                <div className="space-y-3">
                  {pendingJobs.slice(0, 5).map((job: any) => (
                    <div key={job.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{job.title || job.category}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{job.location ? `${job.location.substring(0, 40)}…` : "Location not specified"}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{new Date(job.scheduled_at || job.created_at).toLocaleDateString("en-GH", { weekday: "short", month: "short", day: "numeric" })}</p>
                        {job.amount && <p className="text-green-600 font-bold text-xs mt-1">Payout: {formatGHS(job.amount * 0.9)}</p>}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">Accept</button>
                        <button className="bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Job History */}
        {completedJobs.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Job History</h2>
              <Link href="/tasker/history" className="text-blue-600 text-xs font-semibold hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Task</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase">Date</th>
                    <th className="pb-3 text-xs font-semibold text-slate-400 uppercase text-right">Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {completedJobs.slice(0, 5).map((job: any) => (
                    <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-3 font-medium text-slate-800">{job.title || job.category}</td>
                      <td className="py-3 text-slate-400 text-xs">{new Date(job.created_at).toLocaleDateString("en-GH")}</td>
                      <td className="py-3 text-right font-semibold text-green-600">{job.amount ? formatGHS(job.amount * 0.9) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
