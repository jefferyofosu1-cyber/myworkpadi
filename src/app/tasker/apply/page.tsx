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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
            Application submitted! 🎉
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">
            We've sent a verification link to <strong>{email}</strong>.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Once your email is confirmed, our team will review and verify your profile within <strong>24 hours</strong>. You'll be notified when you're approved to start receiving jobs.
          </p>
          <Link href="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-center transition-colors">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.jpg" alt="TaskGH Logo" className="h-9 w-auto object-contain" />
          </Link>
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
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
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
                🚀 Now Hiring Taskers Across Ghana
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                Earn money doing what<br />
                <span className="text-orange-500">you're already good at</span>
              </h1>
              <p className="text-slate-500 text-base mb-8 leading-relaxed">
                Join 5,000+ Ghanaian taskers earning a great income on the TaskGH platform. Set your rates, choose your jobs, get paid fast.
              </p>

              <div className="space-y-4 mb-8">
                {perks.map(p => (
                  <div key={p.title} className="flex items-start gap-3">
                    <div className="text-2xl w-10 flex-shrink-0">{p.icon}</div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{p.title}</p>
                      <p className="text-slate-400 text-sm">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <TrustBar />
            </div>

            {/* Right: Skills Selection */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: "var(--font-jakarta)" }}>
                What services do you offer?
              </h2>
              <p className="text-slate-400 text-sm mb-6">Select all that apply. You can update this later.</p>

              <div className="grid grid-cols-2 gap-2 mb-8">
                {categories.map(cat => {
                  const selected = selectedSkills.includes(cat);
                  return (
                    <button key={cat} onClick={() => toggleSkill(cat)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-semibold text-left transition-all ${selected ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                      {selected && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                      {cat}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setStep(1)} disabled={selectedSkills.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-100 hover:-translate-y-0.5 text-base">
                Continue to Account Setup <ArrowRight className="w-5 h-5" />
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

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
                Create your account
              </h2>
              <p className="text-slate-400 text-sm mb-6">You're applying as a <strong className="text-orange-600">tasker</strong> — {selectedSkills.join(", ")}</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Kwame Asante" required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="kwame@example.com" required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={password} onChange={e => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" required
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 outline-none text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
                  <span className="text-xs text-slate-500 leading-relaxed">
                    I agree to TaskGH's{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>
                  </span>
                </label>

                <button onClick={handleSubmit} disabled={submitting || !fullName || !email || !password || !agreed}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-100 hover:-translate-y-0.5 text-base">
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account…</> : <>Apply as Tasker <ArrowRight className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
