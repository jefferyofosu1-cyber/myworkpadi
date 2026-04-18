import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4">
              <img 
                src="/logo.jpg" 
                alt="TaskGH Logo" 
                className="h-10 w-auto object-contain bg-white rounded-lg p-1"
              />
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Ghana's most trusted marketplace for professional home services.
            </p>
          </div>
          {[
            {
              title: "Services",
              links: [
                { label: "Plumbing", href: "/booking?category=plumbing" },
                { label: "Electrical", href: "/booking?category=electrical" },
                { label: "Cleaning", href: "/booking?category=cleaning" },
                { label: "Moving Help", href: "/booking?category=moving" },
                { label: "All Services", href: "/booking" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
                { label: "Press", href: "/press" },
                { label: "Become a Tasker", href: "/tasker/apply" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Legal Hub", href: "/legal" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-foreground font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-muted text-sm hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-6 text-center text-muted text-sm">
          © {new Date().getFullYear()} TaskGH. All rights reserved. Made with ❤️ in Ghana.
        </div>
      </div>
    </footer>
  );
}
