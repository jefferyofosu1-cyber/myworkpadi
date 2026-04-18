import Navbar from "@/components/Navbar";
import Link from "next/link";

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
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-10">
          <Link href="/legal" className="text-xs text-slate-400 hover:text-blue-600 font-medium mb-4 inline-block transition-colors">← Legal</Link>
          <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Cookie Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: April 2025 · Effective date: April 18, 2025</p>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-10 text-sm text-green-800">
          <strong>Plain-language summary:</strong> We use a small number of cookies to keep you logged in and to understand how the platform is used. We don't use advertising cookies. You can turn off non-essential cookies at any time.
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">What are cookies?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to the site owner. TaskGH uses cookies to keep you signed in, remember your preferences, and understand how people use our platform so we can improve it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">The cookies we use</h2>
            <div className="space-y-4">
              {cookieTypes.map(ct => (
                <div key={ct.name} className="border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800">{ct.name}</h3>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${ct.required ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                      {ct.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3">{ct.desc}</p>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Examples</p>
                    <ul className="space-y-1">
                      {ct.examples.map(e => (
                        <li key={e} className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="w-1 h-1 bg-slate-400 rounded-full flex-shrink-0" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Managing your cookie preferences</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              You can control non-essential cookies through your browser settings. Most browsers allow you to refuse or delete cookies. Please note that disabling cookies may affect the functionality of the platform.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              To manage cookies specifically for TaskGH, you can also contact us at <a href="mailto:privacy@taskgh.com" className="text-blue-600 hover:underline font-medium">privacy@taskgh.com</a> and we will process your preferences within 7 business days.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Third-party cookies</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our payment partner (Paystack) may set its own cookies during payment processing. These cookies are governed by Paystack's own privacy policy and cookie policy. We recommend reviewing their documentation at paystack.com.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Changes to this policy</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We may update this Cookie Policy to reflect changes in technology or legislation. Any material changes will be communicated via in-app notification.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-100 pt-8 text-sm text-slate-400">
          Questions about cookies? Contact us at{" "}
          <a href="mailto:privacy@taskgh.com" className="text-blue-600 hover:underline font-medium">privacy@taskgh.com</a>
        </div>
      </div>
    </div>
  );
}
