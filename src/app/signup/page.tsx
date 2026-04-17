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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Check your email</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            We've sent a verification link to your email address. Click the link to activate your account and get started.
          </p>
          <Link href="/login" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-center transition-colors">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-black text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
              Task<span className="text-blue-600">GH</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-8">
          <h1 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>Create your account</h1>
          <p className="text-slate-400 text-sm mb-7">Join thousands of Ghanaians using TaskGH</p>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: "customer" as const, label: "I need tasks done", icon: User },
              { value: "tasker" as const, label: "I want to earn", icon: Briefcase },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-sm font-semibold ${
                  role === value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
                {value === "tasker" && <span className="text-orange-500 font-bold text-xs">Tasker</span>}
                {value === "customer" && <span className="text-blue-500 font-bold text-xs">Customer</span>}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
              <input
                name="full_name"
                type="text"
                placeholder="Kwame Mensah"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="kwame@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-800 placeholder-slate-300 transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input name="terms" type="checkbox" className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-xs text-slate-500 leading-relaxed">
                I agree to TaskGH's{" "}
                <Link href="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
