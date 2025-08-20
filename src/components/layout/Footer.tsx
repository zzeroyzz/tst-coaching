// components/layout/Footer.tsx
import Link from "next/link";

const footerSections = {
  product: {
    title: "Product",
    links: [
      { href: "/services", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/about", label: "About" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Blog" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-nb-ink text-nb-bg border-t-3 border-nb-border ">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-nb-teal border-2 border-nb-bg rounded-sm flex items-center justify-center">
                <span className="text-nb-ink font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-black">TST Coaching</span>
            </div>
            <p className="text-nb-bg/80 text-sm leading-relaxed">
              Neo-brutalist coaching platform designed to help you achieve your goals with bold, direct guidance.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h3 className="font-bold text-nb-bg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-nb-bg/80 hover:text-nb-bg text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t-2 border-nb-bg/20 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-nb-bg/60 text-sm">
            © 2025 TST Coaching. All rights reserved.
          </p>

          {/* Social Links (optional) */}
          <div className="flex space-x-4">
            <Link href="#" className="text-nb-bg/60 hover:text-nb-bg text-sm">
              Twitter
            </Link>
            <Link href="#" className="text-nb-bg/60 hover:text-nb-bg text-sm">
              LinkedIn
            </Link>
            <Link href="#" className="text-nb-bg/60 hover:text-nb-bg text-sm">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
