"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/text";

const gruppi = [
  {
    ente: "Anthropic",
    certificazioni: [
      "AI Fluency for Educators",
      "Introduction to Claude Cowork",
    ],
  },
  {
    ente: "Stanford University",
    certificazioni: [
      "Machine Learning Specialization",
    ],
  },
  {
    ente: "ICDL",
    certificazioni: [
      "ICDL Artificial Intelligence",
    ],
  },
  {
    ente: "Google",
    certificazioni: [
      "Foundations of Digital Marketing and E-commerce",
      "Attract and Engage Customers with Digital Marketing",
      "From Likes to Leads: Interact with Customers Online",
      "Think Outside the Inbox: Email Marketing",
    ],
  },
];

function GruppoRow({ gruppo, index }: { gruppo: (typeof gruppi)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="py-7 border-t grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3 lg:gap-12"
      style={{ borderColor: "var(--color-border)" }}
    >
      <span
        className="text-xs font-bold uppercase tracking-widest lg:pt-1"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}
      >
        {gruppo.ente}
      </span>

      <ul className="flex flex-col gap-2">
        {gruppo.certificazioni.map((cert) => (
          <li
            key={cert}
            className="font-medium"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 1.8vw, 1.375rem)",
              color: "var(--color-ink)",
              letterSpacing: "-0.01em",
            }}
          >
            {cert}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function CertificazioniSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section
      id="certificazioni"
      className="bg-(--color-bg-warm-start)"
      labelledBy="cert-title"
    >
      <motion.div
        ref={headerRef}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4"
      >
        <h2
          id="cert-title"
          className="font-bold lowercase tracking-[-0.04em] leading-[0.92]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 10vw, 12rem)",
            color: "var(--color-ink)",
          }}
        >
          certificazioni
        </h2>
        <Text
          variant={{ sm: "copy-16", lg: "copy-18" }}
          color="ink-muted"
          className="mt-4 max-w-lg"
          style={{ lineHeight: 1.5 }}
        >
          Percorsi completati su AI, machine learning e digital marketing.
        </Text>
      </motion.div>

      <div className="mt-8 lg:mt-12">
        {gruppi.map((g, i) => (
          <GruppoRow key={g.ente} gruppo={g} index={i} />
        ))}
        <div className="border-t" style={{ borderColor: "var(--color-border)" }} />

      </div>
    </Section>
  );
}
