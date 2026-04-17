"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", user.id)
          .single();
        setUser({ email: user.email, role: profile?.role });
      }
    });
  }, [supabase]);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-jakarta)" }}>
              Task<span className="text-blue-600">GH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Services</Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it works</Link>
            <Link href="/tasker/signup" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Become a Tasker</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={user.role === "tasker" ? "/tasker/dashboard" : "/customer/dashboard"}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/booking"
                  className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all px-5 py-2.5 rounded-xl shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-200 hover:-translate-y-0.5"
                >
                  Book a Task
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-5 flex flex-col gap-4">
            <Link href="/#services" className="text-sm font-medium text-slate-700 py-2" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-slate-700 py-2" onClick={() => setMenuOpen(false)}>How it works</Link>
            <Link href="/tasker/signup" className="text-sm font-medium text-slate-700 py-2" onClick={() => setMenuOpen(false)}>Become a Tasker</Link>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link href={user.role === "tasker" ? "/tasker/dashboard" : "/customer/dashboard"} className="text-center py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <button onClick={handleSignOut} className="text-center py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/booking" className="text-center py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold" onClick={() => setMenuOpen(false)}>Book a Task</Link>
                  <Link href="/login" className="text-center py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium" onClick={() => setMenuOpen(false)}>Sign In</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
