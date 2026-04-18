"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/text";

const steps = [
  {
    num: "01",
    title: "mappa",
    subtitle: "Guardiamo i processi esistenti.",
    body: "Dove si perde tempo, dove si ripetono le stesse operazioni, dove il flusso si inceppa. Prima di aggiungere AI, capiamo cosa c'è già.",
  },
  {
    num: "02",
    title: "scegli",
    subtitle: "Individuiamo dove vale la pena.",
    body: "Scegliamo i 2-3 processi dove l'AI porta valore reale. Quello che merita il cambiamento e quello che resta, giustamente, umano.",
  },
  {
    num: "03",
    title: "prova",
    subtitle: "Learning by doing.",
    body: "Ogni partecipante lavora su un caso reale del suo lavoro. Una settimana, un processo, un risultato misurabile. Se funziona sul tuo caso, funziona.",
  },
  {
    num: "04",
    title: "integra",
    subtitle: "L'AI entra nel flusso.",
    body: "Smette di essere \"la cosa che proviamo\" e diventa parte di come il team lavora ogni giorno.",
  },
];

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative py-8 lg:py-10 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      {/* Numero gigante in outline */}
      <span
        className="absolute right-0 top-6 font-bold lowercase select-none pointer-events-none transition-opacity duration-300 opacity-[0.06] group-hover:opacity-[0.12]"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(4rem, 12vw, 14rem)",
          color: "var(--color-ink)",
          lineHeight: 1,
        }}
        aria-hidden
      >
        {step.num}
      </span>

      <div className="relative max-w-2xl">
        {/* Numero piccolo accent */}
        <span
          className="text-sm font-bold mb-3 block"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}
        >
          {step.num}
        </span>

        <h3
          className="font-bold lowercase tracking-[-0.03em] leading-[0.95] mb-3"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: "var(--color-ink)",
          }}
        >
          {step.title}
        </h3>

        <Text
          variant="copy-18"
          color="ink-muted"
          className="mb-3"
          style={{ fontStyle: "italic" }}
        >
          {step.subtitle}
        </Text>

        <Text variant="copy-16" color="ink" style={{ lineHeight: 1.6 }}>
          {step.body}
        </Text>
      </div>
    </motion.article>
  );
}

export function MetodoSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section
      id="metodo"
      className="bg-(--color-bg-warm-end)"
      labelledBy="metodo-title"
    >
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4"
      >
        <h2
          id="metodo-title"
          className="font-bold lowercase tracking-[-0.04em] leading-[0.92]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 10vw, 12rem)",
            color: "var(--color-ink)",
          }}
        >
          dal caos
          <br />
          all&apos;alchimia
        </h2>
        <Text
          variant={{ sm: "copy-16", lg: "copy-18" }}
          color="ink-muted"
          className="mt-4 max-w-lg"
          style={{ lineHeight: 1.5 }}
        >
          4 step per integrare l&apos;AI nei processi aziendali. Ogni fase lavora su casi reali del tuo team.
        </Text>
      </motion.div>

      {/* Steps */}
      <div className="mt-8 lg:mt-12">
        {steps.map((step, i) => (
          <StepCard key={step.num} step={step} index={i} />
        ))}
        {/* Bordo di chiusura */}
        <div className="border-t" style={{ borderColor: "var(--color-border)" }} />
      </div>
    </Section>
  );
}
