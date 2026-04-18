import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — TaskGH",
  description: "Learn how TaskGH collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Who We Are",
    content: `TaskGH is a technology marketplace that connects customers with independent professional taskers across Ghana. References to "TaskGH", "we", "us", or "our" in this policy refer to the company operating this platform.

Our registered address is Accra, Ghana. For any privacy-related enquiries, please contact us at privacy@taskgh.com.`,
  },
  {
    title: "2. What Information We Collect",
    content: `We collect information that you provide directly to us, and information that is automatically generated when you use our platform.

**Information you provide:**
- Account registration details: full name, email address, phone number, and password.
- Booking details: service type, location, date, time, and task description.
- Payment information: Mobile Money account details and transaction references (we do not store full card numbers).
- Identity verification documents for taskers: government-issued ID and photos.
- Communications you send to us, including support messages and reviews.

**Information collected automatically:**
- Usage data: pages visited, features used, and booking interactions.
- Device information: browser type, operating system, and approximate location derived from IP address.
- Cookies and similar tracking technologies (see our Cookie Policy for details).`,
  },
  {
    title: "3. How We Use Your Information",
    content: `We use the information we collect for the following purposes:

- **To operate the platform:** Process bookings, facilitate payments, and connect customers with taskers.
- **To verify identity:** Ensure that taskers on our platform are who they say they are.
- **To communicate with you:** Send booking confirmations, service updates, and customer support responses.
- **To improve our services:** Analyse usage patterns to improve the platform experience.
- **To comply with the law:** Meet our obligations under Ghanaian data protection regulations.
- **For marketing:** With your consent only, we may send promotional offers or platform updates.`,
  },
  {
    title: "4. Sharing Your Information",
    content: `We do not sell your personal data. We only share information in the following limited circumstances:

- **With taskers:** Your name, contact number, and booking address are shared with the tasker assigned to your job.
- **With payment processors:** We share necessary transaction data with our payment partners (e.g., Paystack) to process payments securely.
- **With law enforcement:** If required by law, a court order, or to protect the safety of our users or the public.
- **With service providers:** Trusted third-party vendors who help us operate our infrastructure, subject to strict data processing agreements.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your personal data for as long as your account is active or as necessary to provide our services. Booking records are retained for a minimum of 3 years for financial and legal compliance purposes.

You may request the deletion of your account and associated personal data at any time by contacting privacy@taskgh.com. We will process and confirm deletion requests within 30 days, except where retention is required by law.`,
  },
  {
    title: "6. Your Rights",
    content: `Under applicable data protection law, you have the right to:

- **Access** the personal data we hold about you.
- **Correct** any inaccurate or incomplete information.
- **Delete** your personal data, subject to legal retention requirements.
- **Object** to the processing of your data for marketing purposes.
- **Portability:** Request a copy of your data in a structured, machine-readable format.

To exercise any of these rights, contact us at privacy@taskgh.com.`,
  },
  {
    title: "7. Security",
    content: `We take the security of your personal data seriously. We use industry-standard encryption (TLS) for all data in transit, and store passwords using strong cryptographic hashing. Payment data is processed through certified PCI-DSS compliant partners.

No system is completely foolproof. In the event of a data breach that affects your rights, we will notify you as required by applicable law.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you via email or an in-app notification at least 14 days before the changes take effect. Your continued use of the platform after that date constitutes your acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-10">
          <Link href="/legal" className="text-xs text-slate-400 hover:text-blue-600 font-medium mb-4 inline-block transition-colors">← Legal</Link>
          <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: April 2025 · Effective date: April 18, 2025</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-10 text-sm text-blue-800">
          <strong>Plain-language summary:</strong> We collect your name, contact details, and booking information to make the platform work. We share your basic contact details with your tasker so they can do the job. We don't sell your data. You can ask us to delete your data at any time.
        </div>

        <div className="space-y-10">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h2>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-3">
                {s.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-slate-100 pt-8 text-sm text-slate-400">
          Questions? Contact us at{" "}
          <a href="mailto:privacy@taskgh.com" className="text-blue-600 hover:underline font-medium">privacy@taskgh.com</a>
        </div>
      </div>
    </div>
  );
}
