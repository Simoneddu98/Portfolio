"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/text";

const paragraphs = [
  "Aiuto aziende e professionisti a integrare l'AI nei processi quotidiani. Ogni percorso parte da quello che il team fa già: si mappano i flussi, si individuano i punti di attrito, si costruisce un sistema che funziona sul lavoro reale.",
  "La cosa che sento più spesso in aula: \"ho provato, poi ho smesso.\" Di solito manca il collegamento tra lo strumento e quello che si fa già ogni giorno.",
  "Parto da lì: dalla routine, dai punti di attrito, da dove si guadagna tempo.",
];

function FadeUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function IntroSection() {
  return (
    <Section
      id="intro"
      className="bg-(--color-bg-warm-start) flex flex-col justify-center"
      labelledBy="intro-title"
    >
      <div className="max-w-3xl">
        <FadeUp>
          <h2
            id="intro-title"
            className="font-bold lowercase leading-[0.95] tracking-[-0.035em] mb-10 lg:mb-14"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 10rem)",
              color: "var(--color-ink)",
            }}
          >
            non insegno l&apos;ai.
            <br />
            insegno a pensare con l&apos;ai.
          </h2>
        </FadeUp>

        <div className="flex flex-col gap-6">
          {paragraphs.map((p, i) => (
            <FadeUp key={i} delay={0.1 + i * 0.1}>
              <Text
                variant={{ sm: "copy-18", lg: "copy-20" }}
                color="ink"
                style={{ letterSpacing: "-0.005em", lineHeight: 1.55 }}
              >
                {p}
              </Text>
            </FadeUp>
          ))}
        </div>

        {/* Quote di chiusura */}
        <FadeUp delay={0.5}>
          <blockquote
            className="mt-14 lg:mt-20 border-l-2 pl-6"
            style={{ borderColor: "var(--color-accent)" }}
          >
            <p
              className="font-medium italic"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
                color: "var(--color-ink)",
                letterSpacing: "-0.02em",
              }}
            >
              &ldquo;Prima il processo. Poi l&apos;AI ci entra da sola.&rdquo;
            </p>
          </blockquote>
        </FadeUp>

        <FadeUp delay={0.65}>
          <div className="mt-12 lg:mt-16">
            <a
              href="mailto:simonesanna.lavoro@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-[1.02] active:scale-[0.98] hover:brightness-90"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.9rem, 1.2vw, 1.125rem)",
                background: "var(--color-accent)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(232,93,38,0.3)",
              }}
            >
              Dimmi di cosa hai bisogno <span aria-hidden>→</span>
            </a>
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
