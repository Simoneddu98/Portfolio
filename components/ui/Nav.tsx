"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "./LogoMark";

const links = [
  { href: "#metodo",   label: "metodo" },
  { href: "#works",    label: "works" },
  { href: "#contatti", label: "contatti" },
];

export function Nav() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [active, setActive]       = useState("");
  const observerRef               = useRef<IntersectionObserver | null>(null);

  /* Blur backdrop on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section via IntersectionObserver */
  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href));
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive("#" + e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => s && observerRef.current?.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  /* Lock body scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-[72px] lg:h-20 flex items-center transition-all duration-300"
        style={{
          background: scrolled ? "rgba(248,246,242,.75)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "var(--shadow-soft)" : "none",
        }}
      >
        <div
          className="w-full flex items-center justify-between"
          style={{ padding: "0 var(--page-px)" }}
        >
          {/* Logo */}
          <a href="#" aria-label="Torna in cima">
            <LogoMark size={28} className="text-(--color-ink) lg:w-8 lg:h-8" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Navigazione principale">
            {links.map((link, i) => (
              <span key={link.href} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-(--color-ink-muted) text-sm">·</span>
                )}
                <a
                  href={link.href}
                  aria-current={active === link.href ? "true" : undefined}
                  className="text-sm font-medium transition-colors hover:text-(--color-accent)"
                  style={{
                    color: "var(--color-ink)",
                    textDecoration: active === link.href ? "underline" : "none",
                    textDecorationColor: "var(--color-accent)",
                    textDecorationThickness: "2px",
                    textUnderlineOffset: "4px",
                  }}
                >
                  {link.label}
                </a>
              </span>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          >
            <span
              className="block h-px w-7 origin-center transition-transform duration-300"
              style={{
                background: "var(--color-ink)",
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : undefined,
              }}
            />
            <span
              className="block h-px w-5 transition-opacity duration-300"
              style={{
                background: "var(--color-ink)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-px w-6 origin-center transition-transform duration-300"
              style={{
                background: "var(--color-ink)",
                transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : undefined,
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center lg:hidden"
            style={{ background: "var(--gradient-warm)" }}
          >
            <nav
              className="flex flex-col gap-8 px-8"
              aria-label="Navigazione mobile"
            >
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.3 }}
                  className="text-white font-bold lowercase"
                  style={{ fontSize: "clamp(2.25rem, 6vw, 6rem)", lineHeight: 0.95 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
