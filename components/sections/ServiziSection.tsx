"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/text";

const servizi = [
  {
    id: "formazione",
    title: "formazione",
    subtitle: "In aula, online, in azienda.",
    body: "Aiuto aziende e professionisti a integrare l'AI nei processi quotidiani. Ogni percorso parte da quello che il team fa già: mappiamo i flussi, individuiamo i punti di attrito, costruiamo un sistema che funziona sul lavoro reale. Learning by doing: si prova durante la formazione, su casi concreti, con un risultato misurabile a fine sessione. Elementi di gamification per tenere alta l'attenzione e rendere l'apprendimento attivo.",
    items: [
      "Workshop intensivi da mezza giornata o giornata intera",
      "Percorsi aziendali di 2-4 settimane con follow-up",
      "Lezioni singole per scuole di formazione e master",
    ],
  },
  {
    id: "consulenza",
    title: "consulenza",
    subtitle: "Quando serve strutturare l'adozione dell'AI in modo coerente.",
    body: "Analisi dei processi aziendali, design di flussi AI-assistiti, scrittura dei prompt di sistema.",
    items: [
      "Team che usano già tool AI e vogliono farli convergere",
      "Aziende che partono da zero e vogliono strutturare l'adozione",
      "Freelance che vogliono passare dall'uso casuale a un flusso stabile",
    ],
  },
  {
    id: "contenuti",
    title: "contenuti",
    subtitle: "Strategia editoriale, copy e pianificazione per i social.",
    body: "Costruisco il piano editoriale, scrivo i copy e gestisco la pianificazione dei contenuti sui social, integrando l'AI in ogni fase del processo. Il risultato è una presenza coerente, costante e riconoscibile, senza che tu debba occupartene ogni giorno.",
    items: [
      "Piano editoriale mensile con topic, format e calendario",
      "Copywriting per post LinkedIn, Instagram e altri canali",
      "Costruzione della voce editoriale e del tono di comunicazione",
    ],
    cta: { label: "Scrivimi →", href: "mailto:simonesanna.lavoro@gmail.com" },
  },
];

function ServizioCard({
  servizio,
  index,
}: {
  servizio: (typeof servizi)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 py-10 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <h3
        className="font-bold lowercase tracking-[-0.03em] leading-[0.95]"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.25rem, 6vw, 6rem)",
          color: "var(--color-ink)",
        }}
      >
        {servizio.title}
      </h3>

      <Text variant="copy-16" color="ink-muted" style={{ fontStyle: "italic" }}>
        {servizio.subtitle}
      </Text>

      <Text variant="copy-16" color="ink" className="max-w-2xl" style={{ lineHeight: 1.6 }}>
        {servizio.body}
      </Text>

      {servizio.items.length > 0 && (
        <ul className="flex flex-col gap-2 mt-1">
          {servizio.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.9rem, 1vw, 1rem)",
                color: "var(--color-ink-muted)",
              }}
            >
              <span
                className="mt-[0.35em] w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "var(--color-accent)" }}
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      )}

      {servizio.cta && (
        <a
          href={servizio.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start mt-2 font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-accent)",
            textDecorationColor: "var(--color-accent)",
          }}
        >
          {servizio.cta.label}
        </a>
      )}
    </motion.article>
  );
}

export function ServiziSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section
      id="servizi"
      className="bg-(--color-bg-warm-start)"
      labelledBy="servizi-title"
    >
      <motion.h2
        ref={headerRef}
        id="servizi-title"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-bold lowercase tracking-[-0.04em] leading-[0.92] mb-2"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem, 10vw, 12rem)",
          color: "var(--color-ink)",
        }}
      >
        tre modi per
        <br />
        lavorare insieme.
      </motion.h2>

      <div className="mt-4 lg:mt-6">
        {servizi.map((s, i) => (
          <ServizioCard key={s.id} servizio={s} index={i} />
        ))}
        <div className="border-t" style={{ borderColor: "var(--color-border)" }} />

        <div className="mt-10 lg:mt-14 flex flex-col items-start gap-2">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9rem, 1vw, 1rem)",
              color: "var(--color-ink-muted)",
            }}
          >
            Vuoi qualcosa costruito attorno alle esigenze del tuo team?
          </p>
          <a
            href="mailto:simonesanna.lavoro@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9rem, 1.2vw, 1.125rem)",
              background: "rgba(0,0,0,0.06)",
              color: "var(--color-ink)",
              border: "1px solid rgba(0,0,0,0.1)",
              backdropFilter: "blur(8px)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            Scrivimi per una formazione su misura <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
