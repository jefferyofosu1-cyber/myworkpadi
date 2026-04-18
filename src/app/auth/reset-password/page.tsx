"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Setup listener to get auth state from fragment url code if present
    supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (event === "PASSWORD_RECOVERY") {
        // Ready to update password
      }
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setPending(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
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
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Updated</h2>
          <p className="text-muted text-lg font-medium leading-relaxed mb-10">
            Your security credentials have been successfully updated. You may now proceed to enter the platform.
          </p>
          <button onClick={() => router.push("/login")} 
            className="block w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl text-center transition-all hover:-translate-y-1 shadow-2xl shadow-primary/20 text-xs uppercase tracking-[0.2em]">
            Proceed to Login
          </button>
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
          <h1 className="text-3xl font-black text-foreground mb-1 uppercase tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Secure</h1>
          <p className="text-muted text-sm font-medium mb-10">Update your account credentials below.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl px-5 py-4 mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">New Passphrase</label>
              <div className="relative">
                <input
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full px-6 py-5 pr-14 rounded-2xl border border-border bg-foreground/[0.02] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-xs font-bold uppercase tracking-widest text-foreground placeholder:text-muted/30 transition-all shadow-inner"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Confirm Identity</label>
              <div className="relative">
                <input
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat passphrase"
                  required
                  className="w-full px-6 py-5 pr-14 rounded-2xl border border-border bg-foreground/[0.02] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-xs font-bold uppercase tracking-widest text-foreground placeholder:text-muted/30 transition-all shadow-inner"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em]"
            >
              {pending ? <><Loader2 className="w-4 h-4 animate-spin text-white" /> Updating...</> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
