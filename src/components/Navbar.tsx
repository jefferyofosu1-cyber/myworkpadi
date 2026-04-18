"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

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
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", user.id)
          .single();
        setUser({ email: user.email, role: profile?.role });
      }
    };
    checkUser();
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
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-2xl" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/logo.jpg" 
              alt="TaskGH Logo" 
              className="h-10 w-auto object-contain bg-white rounded-lg p-1 group-hover:shadow-neon transition-all"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/#services" className="text-sm font-semibold text-muted hover:text-primary transition-colors">Services</Link>
            <Link href="/#how-it-works" className="text-sm font-semibold text-muted hover:text-primary transition-colors">How it works</Link>
            <Link href="/tasker/apply" className="text-sm font-semibold text-muted hover:text-primary transition-colors">Become a Tasker</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link
                  href={user.role === "tasker" ? "/tasker/dashboard" : "/customer/dashboard"}
                  className="text-sm font-semibold text-muted hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-muted hover:text-red-400 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-muted hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/booking"
                  className="text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-all px-6 py-3 rounded-2xl shadow-green hover:shadow-neon hover:-translate-y-1 active:scale-95"
                >
                  Book a Task
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-xl text-muted hover:bg-background/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border shadow-2xl overflow-hidden">
          <div className="px-6 py-8 flex flex-col gap-6">
            <Link href="/#services" className="text-base font-bold text-muted" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/#how-it-works" className="text-base font-bold text-muted" onClick={() => setMenuOpen(false)}>How it works</Link>
            <Link href="/tasker/apply" className="text-base font-bold text-muted" onClick={() => setMenuOpen(false)}>Become a Tasker</Link>
            <div className="border-t border-border pt-6 flex flex-col gap-4">
              {user ? (
                <>
                  <Link href={user.role === "tasker" ? "/tasker/dashboard" : "/customer/dashboard"} className="text-center py-4 rounded-2xl bg-primary text-white font-bold" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <button onClick={handleSignOut} className="text-center py-4 rounded-2xl border border-border text-muted font-bold">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/booking" className="text-center py-4 rounded-2xl bg-primary text-white font-bold shadow-green" onClick={() => setMenuOpen(false)}>Book a Task</Link>
                  <Link href="/login" className="text-center py-4 rounded-2xl border border-border text-muted font-bold" onClick={() => setMenuOpen(false)}>Sign In</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
