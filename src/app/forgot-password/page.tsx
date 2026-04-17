"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Check your email</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            We sent a password reset link to your email. Please check your inbox and follow the link to reset your password.
          </p>
          <Link href="/login" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-center transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
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
          <Link href="/login" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
          <h1 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>Forgot password?</h1>
          <p className="text-slate-400 text-sm mb-7">Enter your email and we'll send you a reset link.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
