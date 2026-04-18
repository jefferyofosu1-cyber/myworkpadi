import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, Clock, DollarSign, Star, Briefcase, TrendingUp,
  AlertCircle, Wallet, CalendarDays, Award, ChevronRight, ArrowUpRight, Zap
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
    { label: "Net Earnings", value: formatGHS(netPayout), icon: Wallet, color: "text-primary bg-primary/10", sub: `After fee: ${formatGHS(successFee)}` },
    { label: "Jobs Done", value: completedJobs.length, icon: CheckCircle, color: "text-primary bg-primary/10", sub: "All time" },
    { label: "Requests", value: pendingJobs.length, icon: Clock, color: "text-accent bg-accent/10", sub: "Awaiting" },
    { label: "Rating", value: `${taskerProfile?.rating?.toFixed(1) ?? "—"} ★`, icon: Star, color: "text-yellow-500 bg-yellow-500/10", sub: `${taskerProfile?.review_count ?? 0} reviews` },
  ];

  // Performance score
  const total = jobs?.length ?? 0;
  const completionRate = total > 0 ? Math.round((completedJobs.length / total) * 100) : 0;
  const acceptanceRate = total > 0 ? Math.round(((total - pendingJobs.length) / total) * 100) : 0;
  const performanceScore = Math.round((completionRate + acceptanceRate) / 2);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-foreground flex flex-wrap items-center gap-2" style={{ fontFamily: "var(--font-jakarta)" }}>
              Welcome, {firstName} 👋
              {isVerified && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black bg-primary/10 text-primary px-3 py-1 rounded-full"><CheckCircle className="w-3 h-3" />Verified</span>}
              {!isVerified && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black bg-accent/10 text-accent px-3 py-1 rounded-full"><AlertCircle className="w-3 h-3" />Pending</span>}
            </h1>
            <p className="text-muted text-sm mt-1">Ready to earn? Here are your latest job requests.</p>
          </div>
          <Link href="/tasker/profile" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted bg-foreground/5 px-5 py-3 rounded-2xl border border-border hover:border-primary/20 transition-all">
            Edit Profile
          </Link>
        </div>

        {/* Verification Banner */}
        {!isVerified && (
          <div className="bg-accent/5 border border-accent/20 rounded-[2rem] p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-foreground text-sm uppercase tracking-tight mb-1">Verify your account to start working</h3>
              <p className="text-muted text-xs leading-relaxed font-medium">Upload your documents and complete your profile. Our team reviews within 24 hours.</p>
            </div>
            <Link href="/tasker/verification" className="flex-shrink-0 bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-primary/20">
              Get Started
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-foreground/[0.02] rounded-2xl p-5 border border-border shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-foreground mb-0.5" style={{ fontFamily: "var(--font-jakarta)" }}>{s.value}</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-muted">{s.label}</div>
              <div className="text-muted/50 text-[10px] mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Earnings Wallet */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[2.5rem] p-7 text-white shadow-2xl shadow-primary/30 border border-white/10 overflow-hidden relative group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-white/60" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Earnings Wallet</span>
                </div>
              </div>
              <div className="mb-1 text-4xl font-black relative z-10" style={{ fontFamily: "var(--font-jakarta)" }}>{formatGHS(netPayout)}</div>
              <div className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6 relative z-10">Available balance</div>
              <div className="bg-black/10 rounded-2xl p-4 mb-6 text-[10px] font-black uppercase tracking-widest space-y-2 relative z-10">
                <div className="flex justify-between text-white/50">
                  <span>Gross earnings</span><span className="text-white">{formatGHS(grossEarnings)}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Platform fee (10%)</span><span className="text-white">-{formatGHS(successFee)}</span>
                </div>
              </div>
              <button className="w-full bg-white text-primary font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center justify-center gap-2 relative z-10 shadow-lg">
                <ArrowUpRight className="w-4 h-4" /> Withdraw
              </button>
            </div>

            {/* Performance Score */}
            <div className="bg-foreground/[0.02] rounded-[2.5rem] border border-border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-accent" />
                <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Score</h3>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-muted tracking-widest">Overall</span>
                <span className={`text-sm font-black ${performanceScore >= 80 ? "text-primary" : performanceScore >= 60 ? "text-accent" : "text-red-500"}`}>{performanceScore}%</span>
              </div>
              <div className="w-full bg-foreground/5 rounded-full h-1.5 mb-6">
                <div className={`h-1.5 rounded-full transition-all ${performanceScore >= 80 ? "bg-primary" : performanceScore >= 60 ? "bg-accent" : "bg-red-500"}`}
                  style={{ width: `${performanceScore}%` }} />
              </div>
              <div className="space-y-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                <div className="flex justify-between">
                  <span>Completion</span>
                  <span className="text-foreground">{completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Acceptance</span>
                  <span className="text-foreground">{acceptanceRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Queue */}
          <div className="lg:col-span-2 bg-foreground/[0.02] rounded-[2.5rem] border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-foreground text-sm uppercase tracking-widest">Job Requests</h2>
              <Link href="/tasker/jobs" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Job Content Rendering */}
            {(activeJobs.length === 0 && pendingJobs.length === 0) ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-7 h-7 text-muted" />
                </div>
                <p className="text-muted text-sm font-black uppercase tracking-widest mb-1">Queue Empty</p>
                <p className="text-muted/60 text-xs font-medium">Verify your profile to start receiving new tasks.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center gap-4 p-5 bg-primary/5 border border-primary/20 rounded-2xl group transition-all hover:bg-primary/10">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-foreground text-sm truncate uppercase tracking-tight">{job.title || job.category}</p>
                      <p className="text-muted text-[10px] font-black uppercase tracking-widest mt-0.5">{job.location}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Active</span>
                  </div>
                ))}

                {pendingJobs.slice(0, 5).map((job: any) => (
                  <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-background border border-border rounded-2xl group transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                    <div className="w-14 h-14 bg-foreground/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-foreground text-sm truncate uppercase tracking-tight">{job.title || job.category}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] font-black uppercase tracking-widest text-muted">
                        <span>{job.location ? job.location.substring(0, 30) : "Remote"}</span>
                        <span className="text-primary font-black">Payout: {formatGHS(job.amount * 0.9)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none bg-primary hover:bg-primary-dark text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition-all shadow-lg shadow-primary/20">Accept</button>
                      <button className="flex-1 sm:flex-none bg-foreground/5 hover:bg-red-500 hover:text-white text-muted text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition-all">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Job History */}
        {completedJobs.length > 0 && (
          <div className="mt-8 bg-foreground/[0.02] rounded-[2.5rem] border border-border shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-black text-foreground text-sm uppercase tracking-widest">History</h2>
              <Link href="/tasker/history" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-4 text-[10px] font-black text-muted uppercase tracking-widest">Task Title</th>
                    <th className="pb-4 text-[10px] font-black text-muted uppercase tracking-widest">Date</th>
                    <th className="pb-4 text-[10px] font-black text-muted uppercase tracking-widest text-right">Net Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {completedJobs.slice(0, 5).map((job: any) => (
                    <tr key={job.id} className="group hover:bg-foreground/[0.02]">
                      <td className="py-5 font-bold text-foreground text-sm uppercase tracking-tight">{job.title || job.category}</td>
                      <td className="py-5 text-muted text-[10px] font-black uppercase tracking-widest">{new Date(job.created_at).toLocaleDateString("en-GH")}</td>
                      <td className="py-5 text-right font-black text-primary text-sm uppercase tracking-widest">{job.amount ? formatGHS(job.amount * 0.9) : "—"}</td>
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
