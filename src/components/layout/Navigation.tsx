// components/layout/Navigation.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close menu when pathname changes (navigation occurs)
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  return (
    <>
      <nav className="relative w-full bg-gradient-to-r from-nb-lilac-200 via-nb-lilac-100 to-nb-lilac-50 z-[90]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-nb-teal border-2 border-nb-border rounded-sm flex items-center justify-center">
                <span className="text-nb-bg font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-black text-nb-ink">TST Coaching</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-full font-medium transition-all duration-200",
                      isActive
                        ? "bg-white text-nb-ink border-2 border-nb-border shadow-nb-sm"
                        : "text-nb-ink/80 hover:text-nb-ink hover:bg-white/50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="default"
                size="default"
                className="bg-nb-ink text-nb-bg hover:bg-nb-ink/90"
                asChild
              >
                <Link href="/auth">Open an account</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-white/30 rounded-md transition-colors relative z-[120]"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                // X icon when menu is open
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon when menu is closed
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop - Click to close */}
          <div
            className="fixed inset-0 bg-black/50 z-[100] md:hidden"
            onClick={closeMobileMenu}
          />

          {/* Mobile Menu Panel */}
          <div className="fixed top-[0] left-0 right-0 bg-nb-lilac from-nb-lilac-200 via-nb-lilac-100 to-nb-lilac-50 border-b-3 border-nb-border shadow-nb-lg z-[110] md:hidden">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "px-4 py-3 rounded-md font-medium transition-all duration-200 text-left",
                        isActive
                          ? "bg-white text-nb-ink border-2 border-nb-border shadow-nb-sm"
                          : "text-nb-ink/80 hover:text-nb-ink hover:bg-white/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* Mobile CTA Button */}
                <div className="pt-2">
                  <Button
                    variant="default"
                    size="default"
                    className="w-full bg-nb-ink text-nb-bg hover:bg-nb-ink/90"
                    asChild
                  >
                    <Link href="/auth" onClick={closeMobileMenu}>Open an account</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
