"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle, ArrowRight, ArrowLeft, Briefcase, User, Mail, Lock, Eye, EyeOff, Phone, MapPin, Loader2 } from "lucide-react";
import TrustBar from "@/components/TrustBar";

const categories = [
  "Plumbing", "Electrical", "Cleaning", "AC Repair",
  "Carpentry", "Painting", "Moving Help", "Appliance Repair", "Others"
];

const perks = [
  { icon: "💰", title: "Earn on your schedule", desc: "Set your own rates and work when you want." },
  { icon: "🔒", title: "Secure payments", desc: "Get paid within 24hrs of job completion." },
  { icon: "⭐", title: "Build your reputation", desc: "Ratings help you earn more over time." },
  { icon: "📱", title: "Simple dashboard", desc: "Manage all your jobs in one place." },
];

const STEPS = ["Your Role", "Account Details", "Done"];

export default function TaskerApplyPage() {
  const [step, setStep] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (!agreed) { setError("Please agree to the Terms & Privacy Policy."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setError("");
    setSubmitting(true);

    const supabase = createClient();
    if (!supabase) {
      setError("Service unavailable. Please try again later.");
      setSubmitting(false);
      return;
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: "tasker" },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) { setError(signUpError.message); setSubmitting(false); return; }

    if (authData.user) {
      await supabase.from("profiles").upsert({
        id: authData.user.id,
        full_name: fullName,
        email,
        role: "tasker",
      });

      await supabase.from("tasker_profiles").upsert({
        id: authData.user.id,
        is_verified: false,
        categories: selectedSkills,
        bio: "",
        review_count: 0,
      });
    }

    setSubmitting(false);
    setSuccess(true);
  };

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-300">
        {/* Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[100px]" />
        </div>

        <div className="bg-foreground/[0.02] border border-border rounded-3xl backdrop-blur-xl shadow-2xl p-10 max-w-md w-full text-center relative z-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
            Application submitted! 🎉
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-2">
            We've sent a verification link to <strong>{email}</strong>.
          </p>
          <p className="text-muted/60 text-sm mb-8">
            Once your email is confirmed, our team will review and verify your profile within <strong>24 hours</strong>. You'll be notified when you're approved to start receiving jobs.
          </p>
          <Link href="/login"
            className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-center transition-colors shadow-lg shadow-primary/20">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border px-4 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.jpg" alt="TaskGH Logo" className="h-9 w-auto object-contain bg-white rounded-lg p-1" />
          </Link>
          <Link href="/login" className="text-sm font-semibold text-muted hover:text-primary transition-colors">
            Already have an account? Sign in →
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Step 0: Why Become a Tasker + Skills */}
        {step === 0 && (
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left: Value Prop */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
                🚀 Now Hiring Taskers Across Ghana
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-foreground mb-6 leading-[0.9] tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>
                Earn money doing what<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">you're already good at.</span>
              </h1>
              <p className="text-muted text-base mb-10 leading-relaxed font-medium">
                Join 5,000+ Ghanaian taskers earning a great income on the TaskGH platform. Set your rates, choose your jobs, get paid fast.
              </p>

              <div className="space-y-6 mb-12">
                {perks.map(p => (
                  <div key={p.title} className="flex items-start gap-4">
                    <div className="text-2xl w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center flex-shrink-0">{p.icon}</div>
                    <div>
                      <p className="font-black text-foreground text-sm uppercase tracking-tight">{p.title}</p>
                      <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <TrustBar />
            </div>

            {/* Right: Skills Selection */}
            <div className="bg-foreground/[0.02] rounded-[2.5rem] border border-border p-8 backdrop-blur-xl shadow-2xl">
              <h2 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                What do you offer?
              </h2>
              <p className="text-muted text-sm mb-8">Select all that apply. You can update this later.</p>

              <div className="grid grid-cols-2 gap-3 mb-10">
                {categories.map(cat => {
                  const selected = selectedSkills.includes(cat);
                  return (
                    <button key={cat} onClick={() => toggleSkill(cat)}
                      className={`flex flex-col items-center gap-2 p-5 rounded-3xl border-2 text-xs font-black uppercase tracking-tight text-center transition-all ${selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted hover:border-primary/20"}`}>
                      {cat}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setStep(1)} disabled={selectedSkills.length === 0}
                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5 text-base uppercase tracking-wider">
                Continue to Setup <ArrowRight className="w-5 h-5" />
              </button>
              {selectedSkills.length === 0 && (
                <p className="text-slate-400 text-xs text-center mt-2">Please select at least one service</p>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Account Details */}
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <button onClick={() => setStep(0)} className="flex items-center gap-1 text-slate-400 text-sm mb-6 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="bg-foreground/[0.02] rounded-[2.5rem] border border-border p-10 backdrop-blur-xl shadow-2xl">
              <h2 className="text-3xl font-black text-foreground mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                Setup account
              </h2>
              <p className="text-muted text-sm mb-10">Application as <strong className="text-primary uppercase tracking-wider">tasker</strong></p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl px-5 py-4 mb-6">{error}</div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-[0.2em]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Kwame Asante" required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background outline-none text-sm font-bold text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-[0.2em]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="kwame@example.com" required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background outline-none text-sm font-bold text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted mb-2 uppercase tracking-[0.2em]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input value={password} onChange={e => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"} placeholder="••••••••" required
                      className="w-full pl-12 pr-12 py-4 rounded-2xl border border-border bg-background outline-none text-sm font-bold text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer pt-2">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="mt-1 rounded border-border bg-background text-primary focus:ring-primary outline-none" />
                  <span className="text-xs text-muted leading-relaxed font-semibold">
                    I agree to TaskGH's{" "}
                    <Link href="/terms" className="text-primary hover:underline font-bold">Terms</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-primary hover:underline font-bold">Privacy Policy</Link>
                  </span>
                </label>

                <button onClick={handleSubmit} disabled={submitting || !fullName || !email || !password || !agreed}
                  className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5 text-base uppercase tracking-wider">
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : <>Submit Application <ArrowRight className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
