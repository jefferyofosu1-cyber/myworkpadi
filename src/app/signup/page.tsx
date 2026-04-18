"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, Loader2, User, Briefcase, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type FormState = { error?: string; success?: boolean } | undefined;

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<"customer" | "tasker">("customer");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const fullName = data.get("full_name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirm_password") as string;
    const agreed = data.get("terms");

    if (!agreed) { setError("Please agree to the Terms & Privacy Policy."); setPending(false); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); setPending(false); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); setPending(false); return; }

    const { data: authData, error: signUpError } = await supabase?.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    }) ?? { data: null, error: { message: 'Supabase not configured. Please add your Supabase credentials to .env.local.' } };

    if (signUpError) { setError(signUpError.message); setPending(false); return; }

    if (authData.user) {
      // Insert profile record
      await supabase.from("profiles").upsert({
        id: authData.user.id,
        full_name: fullName,
        email,
        role,
      });
    }

    setSuccess(true);
    setPending(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-foreground/[0.02] border border-border rounded-3xl backdrop-blur-xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Check your email</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            We've sent a verification link to your email address. Click the link to activate your account and get started.
          </p>
          <Link href="/login" className="block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-xl text-center transition-colors">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 transition-colors duration-300">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary-dark transition-colors">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-jakarta)" }}>
              Task<span className="text-primary">GH</span>
            </span>
          </Link>
        </div>

        <div className="bg-foreground/[0.02] border border-border rounded-3xl backdrop-blur-xl shadow-2xl p-8">
          <h1 className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>Create your account</h1>
          <p className="text-muted text-sm mb-7">Join thousands of Ghanaians using TaskGH</p>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: "customer" as const, label: "I need help with a task", icon: User },
              { value: "tasker" as const, label: "I want to work and earn", icon: Briefcase },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-sm font-semibold ${
                  role === value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted hover:border-muted/50"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                {label}
                {value === "tasker" && <span className="text-accent font-black text-[10px] uppercase tracking-widest mt-1">Earn Mode</span>}
                {value === "customer" && <span className="text-primary font-black text-[10px] uppercase tracking-widest mt-1">Hire Mode</span>}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Full Name</label>
              <input
                name="full_name"
                type="text"
                placeholder="Kwame Mensah"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="kwame@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-background outline-none text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-muted/30"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-background outline-none text-sm text-foreground focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-muted/30"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input name="terms" type="checkbox" className="mt-0.5 rounded border-border bg-background text-primary focus:ring-primary" />
              <span className="text-xs text-muted leading-relaxed">
                I agree to TaskGH's{" "}
                <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
