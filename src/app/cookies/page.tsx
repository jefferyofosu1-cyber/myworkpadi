import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Cookie Policy — TaskGH",
  description: "How TaskGH uses cookies and how you can manage your preferences.",
};

const cookieTypes = [
  {
    name: "Strictly Necessary",
    required: true,
    desc: "These cookies are essential for the platform to function. They enable core features like authentication, session management, and secure payment processing. You cannot opt out of these cookies.",
    examples: ["Session token (keeps you logged in)", "CSRF protection token", "Cookie consent state"],
  },
  {
    name: "Functional",
    required: false,
    desc: "These cookies remember your preferences and settings to improve your experience. For example, remembering your chosen location or the last service category you viewed.",
    examples: ["Preferred location", "Language preferences", "Last selected service category"],
  },
  {
    name: "Analytics",
    required: false,
    desc: "We use privacy-respecting analytics cookies to understand how people use our platform — what pages are popular, where users get stuck, and how we can improve the booking flow.",
    examples: ["Page view tracking", "User journey analysis", "Feature engagement"],
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-40 pb-20">
        <div className="mb-10">
          <Link href="/legal" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary mb-4 inline-block transition-colors">← Legal</Link>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-3 tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Cookie Policy</h1>
          <p className="text-muted/60 text-[10px] font-black uppercase tracking-widest">Last updated: April 18, 2025</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-12 text-sm text-primary font-medium leading-relaxed">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <strong className="uppercase tracking-widest text-xs font-black">Plain-language summary</strong>
          </div>
          We use a small number of cookies to keep you logged in and to understand how the platform is used. We don't use advertising cookies. You can turn off non-essential cookies at any time.
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black text-foreground mb-3 uppercase tracking-tight">What are cookies?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to the site owner. TaskGH uses cookies to keep you signed in, remember your preferences, and understand how people use our platform so we can improve it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">The cookies we use</h2>
            <div className="space-y-4">
              {cookieTypes.map(ct => (
                <div key={ct.name} className="bg-foreground/[0.02] border border-border rounded-3xl p-6 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">{ct.name}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${ct.required ? "bg-primary text-white" : "bg-foreground/10 text-muted"}`}>
                      {ct.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="text-muted text-sm font-medium leading-relaxed mb-4">{ct.desc}</p>
                  <div className="bg-background border border-border rounded-2xl p-4">
                    <p className="text-[10px] font-black text-muted/40 uppercase tracking-widest mb-3">Key Examples</p>
                    <ul className="space-y-2">
                      {ct.examples.map(e => (
                        <li key={e} className="text-xs text-muted font-bold flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                          <span className="uppercase tracking-tight opacity-70">{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-foreground mb-3 uppercase tracking-tight">Managing your cookie preferences</h2>
            <p className="text-muted text-sm font-medium leading-relaxed mb-4">
              You can control non-essential cookies through your browser settings. Most browsers allow you to refuse or delete cookies. Please note that disabling cookies may affect the functionality of the platform.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              To manage cookies specifically for TaskGH, you can also contact us at <a href="mailto:privacy@taskgh.com" className="text-primary hover:underline font-medium">privacy@taskgh.com</a> and we will process your preferences within 7 business days.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-foreground mb-3 uppercase tracking-tight">Third-party cookies</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our payment partner (Paystack) may set its own cookies during payment processing. These cookies are governed by Paystack's own privacy policy and cookie policy. We recommend reviewing their documentation at paystack.com.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-foreground mb-3 uppercase tracking-tight">Changes to this policy</h2>
            <p className="text-muted text-sm font-medium leading-relaxed">
              We may update this Cookie Policy to reflect changes in technology or legislation. Any material changes will be communicated via in-app notification.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
          Questions? Contact <a href="mailto:privacy@taskgh.com" className="text-primary hover:underline">privacy@taskgh.com</a>
        </div>
      </div>
    </div>
  );
}
