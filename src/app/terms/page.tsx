import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service — TaskGH",
  description: "The terms and conditions governing your use of the TaskGH platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the TaskGH platform — whether as a guest, customer, or tasker — you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.

These terms apply to all visitors, registered users, and taskers on the platform.`,
  },
  {
    title: "2. The TaskGH Marketplace",
    content: `TaskGH is a technology marketplace that facilitates connections between customers seeking services and independent professional taskers. TaskGH is not a staffing agency and does not employ taskers.

Taskers are independent contractors solely responsible for the quality and completion of the services they provide. TaskGH provides the platform, payment infrastructure, and dispute resolution mechanisms.`,
  },
  {
    title: "3. Account Registration",
    content: `To access certain features of the platform, you may be required to create an account. You must:

- Provide accurate and complete information during registration.
- Keep your account credentials confidential and not share your password.
- Notify us immediately at support@taskgh.com if you suspect unauthorised access to your account.
- Be at least 18 years old to create an account.

You are responsible for all activity that occurs under your account.`,
  },
  {
    title: "4. Booking and Payment",
    content: `When you book a service through TaskGH, you agree to pay the displayed service amount plus applicable platform charges:

- **Booking Protection:** A flat GH₵10 charge applied to every booking to cover customer protection.
- **Secure Service Charge:** 5% of the task value, which covers secure payment processing and escrow holding.
- **Emergency Surcharge:** GH₵20 additional charge applies to bookings placed with "ASAP" urgency.

Payment is collected at the time of booking and held in escrow. Funds are released to the tasker only upon satisfactory completion of the service.`,
  },
  {
    title: "5. Tasker Terms",
    content: `If you use TaskGH as a tasker, you additionally agree to:

- Provide honest and accurate information about your skills, qualifications, and experience.
- Submit to our identity verification process before accepting jobs.
- Complete all accepted jobs professionally and on time.
- Pay a Success Fee of 10% of the agreed service amount, deducted from your payout upon job completion.
- Not solicit customers for off-platform transactions. Transacting off-platform violates these terms and may result in permanent suspension.`,
  },
  {
    title: "6. Prohibited Conduct",
    content: `You agree not to:

- Use the platform for any unlawful purpose.
- Post false, misleading, or fraudulent reviews.
- Harass, threaten, or abuse other users or taskers.
- Circumvent the platform's payment system to pay or receive payment outside of TaskGH.
- Attempt to gain unauthorised access to any part of the platform.
- Use automated tools or bots to interact with the platform without our express written consent.

Violation of these rules may result in immediate suspension or permanent termination of your account.`,
  },
  {
    title: "7. Cancellations and Refunds",
    content: `Cancellations made more than 4 hours before a scheduled booking are eligible for a full refund of the service amount. The Booking Protection charge is non-refundable once a tasker has been confirmed.

If a tasker fails to show up or a service is not completed to a reasonable standard, please contact support@taskgh.com within 24 hours. TaskGH will investigate and, at its sole discretion, may issue a full or partial refund.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by Ghanaian law, TaskGH shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to property damage or personal injury caused by a tasker.

Our total aggregate liability to you for any claim shall not exceed the amount you paid for the specific booking giving rise to the claim.`,
  },
  {
    title: "9. Governing Law",
    content: `These Terms of Service are governed by and construed in accordance with the laws of the Republic of Ghana. Any dispute arising from these terms shall be subject to the exclusive jurisdiction of the courts of Ghana.`,
  },
  {
    title: "10. Changes to These Terms",
    content: `We may modify these terms at any time. We will notify you of material changes via email or in-app notification at least 14 days before they take effect. Your continued use of the platform after that date constitutes your acceptance of the revised terms.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-40 pb-20">
        <div className="mb-10">
          <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary mb-4 inline-block transition-colors">← About</Link>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-3 tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>Terms of Service</h1>
          <p className="text-muted/60 text-[10px] font-black uppercase tracking-widest">Last updated: April 18, 2025</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-12 text-sm text-primary font-medium leading-relaxed">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <strong className="uppercase tracking-widest text-xs font-black">Plain-language summary</strong>
          </div>
          Use the platform honestly. Customers pay a small protection charge. Taskers keep 90% of what they earn. If something goes wrong, contact us — we'll sort it out fairly.
        </div>

        <div className="space-y-10">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="text-xl font-black text-foreground mb-3 uppercase tracking-tight">{s.title}</h2>
              <div className="text-muted text-sm font-medium leading-relaxed space-y-3">
                {s.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
          Questions? Contact <a href="mailto:legal@taskgh.com" className="text-primary hover:underline">legal@taskgh.com</a>
        </div>
      </div>
    </div>
  );
}
