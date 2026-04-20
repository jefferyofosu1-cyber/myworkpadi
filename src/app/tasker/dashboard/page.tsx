import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, Clock, DollarSign, Star, Briefcase, TrendingUp,
  AlertCircle, Wallet, CalendarDays, Award, ChevronRight, ArrowUpRight, Zap,
  BarChart3, Target, Shield
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Hero Welcome Section */}
        <div className="mb-12 bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black text-foreground" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Welcome, {firstName} 👋
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black bg-primary/20 text-primary px-3 py-1.5 rounded-full">
                    <Shield className="w-4 h-4" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black bg-accent/20 text-accent px-3 py-1.5 rounded-full">
                    <AlertCircle className="w-4 h-4" /> Pending
                  </span>
                )}
              </div>
              <p className="text-muted text-lg">Manage your bookings, track earnings, and grow your ratings.</p>
            </div>
            <Link
              href="/tasker/profile"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all text-base uppercase tracking-wider whitespace-nowrap"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Verification Banner */}
        {!isVerified && (
          <div className="mb-12 bg-accent/10 border border-accent/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-foreground text-base mb-1">Get verified to attract more jobs</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">Complete your profile with documents and proof of work. We verify within 24 hours.</p>
              <Link href="/tasker/verification" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-black px-6 py-3 rounded-xl transition-all">
                Start Verification <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="group bg-foreground/[0.02] hover:bg-foreground/[0.04] rounded-2xl p-6 border border-border hover:border-border/50 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="text-2xl font-black text-foreground mb-1">{formatGHS(netPayout)}</div>
            <div className="text-muted text-xs font-black uppercase tracking-widest">Available Balance</div>
            <div className="text-muted/60 text-[10px] mt-2">Fee: {formatGHS(successFee)}</div>
          </div>

          <div className="group bg-foreground/[0.02] hover:bg-foreground/[0.04] rounded-2xl p-6 border border-border hover:border-border/50 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-2xl font-black text-foreground mb-1">{completedJobs.length}</div>
            <div className="text-muted text-xs font-black uppercase tracking-widest">Jobs Completed</div>
            <div className="text-muted/60 text-[10px] mt-2">All time</div>
          </div>

          <div className="group bg-foreground/[0.02] hover:bg-foreground/[0.04] rounded-2xl p-6 border border-border hover:border-border/50 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <div className="text-2xl font-black text-foreground mb-1">{taskerProfile?.rating?.toFixed(1) ?? "—"}</div>
            <div className="text-muted text-xs font-black uppercase tracking-widest">Rating</div>
            <div className="text-muted/60 text-[10px] mt-2">{taskerProfile?.review_count ?? 0} reviews</div>
          </div>

          <div className="group bg-foreground/[0.02] hover:bg-foreground/[0.04] rounded-2xl p-6 border border-border hover:border-border/50 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="text-2xl font-black text-foreground mb-1">{performanceScore}%</div>
            <div className="text-muted text-xs font-black uppercase tracking-widest">Performance</div>
            <div className="text-muted/60 text-[10px] mt-2">{completionRate}% completion</div>
          </div>
        </div>

        {/* Active Jobs Alert */}
        {activeJobs.length > 0 && (
          <div className="mb-12 bg-primary/10 border-l-4 border-primary rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-foreground mb-1">You have {activeJobs.length} active job{activeJobs.length !== 1 ? 's' : ''}</h3>
                <p className="text-muted text-sm mb-3">Keep up the great work! Your customers are counting on you.</p>
                <div className="flex gap-2">
                  <Link href="/tasker/jobs" className="inline-flex items-center gap-2 bg-primary text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-primary-dark transition-all">
                    View Tasks <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Earnings & Performance Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Earnings Card */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white shadow-2xl shadow-primary/30 border border-white/10 overflow-hidden relative group">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Wallet className="w-5 h-5 text-white/60" />
                  <span className="text-xs font-black uppercase tracking-wider text-white/60">Earnings</span>
                </div>
                
                <div className="mb-2 text-5xl font-black" style={{ fontFamily: "var(--font-jakarta)" }}>
                  {formatGHS(netPayout)}
                </div>
                <div className="text-white/50 text-xs font-black uppercase tracking-widest mb-6">Ready to withdraw</div>
                
                <div className="bg-black/20 rounded-2xl p-4 mb-6 text-xs font-black uppercase tracking-wider space-y-3">
                  <div className="flex justify-between text-white/60">
                    <span>Gross Earnings</span>
                    <span className="text-white">{formatGHS(grossEarnings)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Platform Fee (10%)</span>
                    <span className="text-white">-{formatGHS(successFee)}</span>
                  </div>
                </div>
                
                <button className="w-full bg-white text-primary font-black py-4 rounded-xl text-xs uppercase tracking-wider hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg">
                  <ArrowUpRight className="w-4 h-4" /> Withdraw Funds
                </button>
              </div>
            </div>

            {/* Performance Score Card */}
            <div className="bg-foreground/[0.02] rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-accent" />
                <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Performance</h3>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-muted tracking-widest">Overall</span>
                <span className={`text-lg font-black ${performanceScore >= 80 ? "text-primary" : performanceScore >= 60 ? "text-accent" : "text-red-500"}`}>
                  {performanceScore}%
                </span>
              </div>
              
              <div className="w-full bg-foreground/5 rounded-full h-2 mb-6 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${performanceScore >= 80 ? "bg-primary" : performanceScore >= 60 ? "bg-accent" : "bg-red-500"}`}
                  style={{ width: `${performanceScore}%` }} 
                />
              </div>
              
              <div className="space-y-3 text-xs font-black uppercase tracking-wider text-muted">
                <div className="flex justify-between">
                  <span>Completion Rate</span>
                  <span className="text-foreground">{completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Acceptance Rate</span>
                  <span className="text-foreground">{acceptanceRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Queue */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-foreground text-lg uppercase tracking-widest">Job Requests</h2>
              <Link href="/tasker/jobs" className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {activeJobs.length === 0 && pendingJobs.length === 0 ? (
              <div className="bg-foreground/[0.02] rounded-2xl border border-dashed border-border p-12 text-center">
                <div className="w-16 h-16 bg-foreground/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-muted" />
                </div>
                <p className="text-foreground font-black text-lg mb-2">No job requests yet</p>
                <p className="text-muted text-sm mb-6">Complete your profile verification to start receiving requests from customers.</p>
                {!isVerified && (
                  <Link href="/tasker/verification" className="inline-flex items-center gap-2 bg-primary text-white font-black px-6 py-3 rounded-xl hover:bg-primary-dark transition-all">
                    Get Verified <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Active Jobs - Higher Priority */}
                {activeJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center gap-4 p-5 bg-primary/10 border-2 border-primary rounded-2xl hover:shadow-lg shadow-primary/20 transition-all">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-foreground text-sm uppercase tracking-tight truncate">{job.title || job.category}</p>
                      <p className="text-muted text-xs font-medium mt-1">📍 {job.location || "Remote"}</p>
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider bg-primary text-white px-3 py-1.5 rounded-lg flex-shrink-0">In Progress</span>
                  </div>
                ))}

                {/* Pending Job Requests */}
                {pendingJobs.slice(0, 6).map((job: any) => (
                  <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-foreground/[0.02] border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group">
                    <div className="w-14 h-14 bg-foreground/5 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {job.category === "plumbing" && "🔧"}
                      {job.category === "electrical" && "⚡"}
                      {job.category === "cleaning" && "🧹"}
                      {job.category === "ac-repair" && "❄️"}
                      {job.category === "carpentry" && "🪛"}
                      {job.category === "painting" && "🎨"}
                      {job.category === "moving" && "📦"}
                      {job.category === "appliance" && "🔌"}
                      {!job.category && "🔧"}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-foreground text-sm uppercase tracking-tight truncate">{job.title || job.category}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted font-medium">
                        <span>📍 {job.location?.substring(0, 25) || "Location TBA"}</span>
                        <span className="text-primary font-black">Payout: {formatGHS(job.amount * 0.9)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20">
                        Accept
                      </button>
                      <button className="flex-1 sm:flex-none bg-foreground/5 text-muted hover:bg-red-500/10 hover:text-red-500 text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job History */}
        {completedJobs.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-foreground text-lg uppercase tracking-widest">Completed Jobs</h2>
              <Link href="/tasker/history" className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                View Full History <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-foreground/[0.02] rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-border bg-foreground/[0.03]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-muted uppercase tracking-widest">Task</th>
                      <th className="px-6 py-4 text-xs font-black text-muted uppercase tracking-widest">Completed</th>
                      <th className="px-6 py-4 text-xs font-black text-muted uppercase tracking-widest text-right">Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {completedJobs.slice(0, 8).map((job: any) => (
                      <tr key={job.id} className="hover:bg-foreground/[0.03] transition-colors group">
                        <td className="px-6 py-4 font-black text-foreground text-sm uppercase tracking-tight">{job.title || job.category}</td>
                        <td className="px-6 py-4 text-muted text-xs font-medium">{new Date(job.created_at).toLocaleDateString("en-GH", { month: "short", day: "numeric", year: "2-digit" })}</td>
                        <td className="px-6 py-4 text-right font-black text-primary text-sm">{formatGHS(job.amount * 0.9)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
