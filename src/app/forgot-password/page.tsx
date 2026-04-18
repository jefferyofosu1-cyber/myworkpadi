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
      <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/20 rounded-full blur-[120px]" />
        </div>

        <div className="bg-foreground/[0.02] border border-border rounded-[3rem] p-12 max-w-md w-full text-center relative z-10 backdrop-blur-2xl shadow-2xl">
          <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Check email</h2>
          <p className="text-muted text-lg font-medium leading-relaxed mb-10">
            We sent a secure reset link to your inbox. Please check and follow the instructions to regain access.
          </p>
          <Link href="/login" 
            className="block w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl text-center transition-all hover:-translate-y-1 shadow-2xl shadow-primary/20 text-xs uppercase tracking-[0.2em]">
            Proceed to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 bg-primary rounded-[1.25rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
          </Link>
        </div>

        <div className="bg-foreground/[0.02] border border-border rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
          <Link href="/login" className="inline-flex items-center gap-2 text-muted hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Login
          </Link>
          <h1 className="text-3xl font-black text-foreground mb-1 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Forgot?</h1>
          <p className="text-muted text-sm font-medium mb-10">Enter your email for a recovery link.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl px-5 py-4 mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Email Identity</label>
              <input
                name="email"
                type="email"
                placeholder="YOURNAME@EXAMPLE.COM"
                required
                className="w-full px-6 py-5 rounded-2xl border border-border bg-foreground/[0.02] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-xs font-bold uppercase tracking-widest text-foreground placeholder:text-muted/30 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em]"
            >
              {pending ? <><Loader2 className="w-4 h-4 animate-spin text-white" /> Dispatching...</> : <>Send Link <CheckCircle className="w-4 h-4 opacity-50" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
