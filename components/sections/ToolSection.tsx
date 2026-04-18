"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/text";

/* ─── Data ──────────────────────────────────────────────────────── */

const tools = [
  {
    id: "claude",
    name: "CLAUDE",
    maker: "Anthropic",
    description:
      "Copywriting, piano editoriale e scrittura assistita. Costruzione e test di flussi di prompting, analisi di documenti.",
  },
  {
    id: "perplexity",
    name: "PERPLEXITY",
    maker: "",
    description:
      "Ricerca rapida, sintesi di fonti e trend. Verifica di informazioni in tempo reale per contenuti e strategie.",
  },
  {
    id: "gemini",
    name: "GEMINI",
    maker: "Google",
    description:
      "Pianificazione contenuti per i social, integrazione con Google Workspace, lavori multimodali.",
  },
  {
    id: "antigravity",
    name: "ANTIGRAVITY",
    maker: "",
    description: "Vibecoding, sviluppo automazioni ed app.",
  },
];

/* ─── ToolCard ──────────────────────────────────────────────────── */

function ToolCard({ tool, index }: { tool: (typeof tools)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="py-8 border-t flex items-center justify-between gap-6"
      style={{ borderColor: "var(--color-border)" }}
    >
      {/* Left: name + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 mb-2">
          <span
            className="font-bold uppercase tracking-[-0.01em]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "var(--color-ink)",
            }}
          >
            {tool.name}
          </span>
          {tool.maker && (
            <span
              className="text-xs font-medium"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}
            >
              {tool.maker}
            </span>
          )}
        </div>
        <Text variant="copy-16" color="ink-muted" style={{ lineHeight: 1.6 }}>
          {tool.description}
        </Text>
      </div>

      {/* Right: logo */}
      <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20">
        <Image
          src={`/logos/${tool.id}.jpg`}
          alt={tool.name}
          width={80}
          height={80}
          className="w-full h-full object-contain"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────── */

export function ToolSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section
      id="tool"
      className="bg-(--color-bg-warm-start)"
      labelledBy="tool-title"
    >
      <motion.div
        ref={headerRef}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4"
      >
        <h2
          id="tool-title"
          className="font-bold lowercase tracking-[-0.04em] leading-[0.92]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 10vw, 12rem)",
            color: "var(--color-ink)",
          }}
        >
          i tool con
          <br />
          cui lavoro
        </h2>
        <Text
          variant={{ sm: "copy-16", lg: "copy-18" }}
          color="ink-muted"
          className="mt-4 max-w-lg"
          style={{ lineHeight: 1.5 }}
        >
          Gli strumenti su cui ho costruito il metodo. Li uso ogni giorno, li conosco in
          profondità.
        </Text>
      </motion.div>

      <div className="mt-8 lg:mt-12">
        {tools.map((tool, i) => (
          <ToolCard key={tool.id} tool={tool} index={i} />
        ))}
        <div className="border-t" style={{ borderColor: "var(--color-border)" }} />
      </div>
    </Section>
  );
}
