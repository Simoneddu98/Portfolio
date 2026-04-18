"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/text";

const cases = [
  {
    id: "caso-01",
    num: "01",
    context: "scuola di formazione, AI per il digital marketing e AI per il lavoro",
    problem: "aggiornare l'offerta formativa integrando l'AI nei programmi didattici con moduli pratici e immediatamente applicabili",
    solution:
      "progettazione ed erogazione di moduli su AI per il digital marketing e AI per il lavoro, con approccio learning by doing e laboratori su casi reali",
    result: "500+ ore di formazione erogata",
    time: "percorso continuativo",
  },
  {
    id: "caso-02",
    num: "02",
    context: "Formazione one-to-one e consulenza strategica per processi aziendali",
    problem: "capire come portare l'AI dentro l'operatività aziendale senza stravolgere i flussi esistenti",
    solution:
      "analisi dei processi, individuazione dei punti di attrito, piano di adozione progressiva degli strumenti AI con affiancamento one-to-one",
    result: "work in progress",
    time: "in corso",
  },
];

function CaseRow({
  c,
  index,
}: {
  c: (typeof cases)[0];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <button
        className="w-full text-left flex items-center justify-between py-8 lg:py-10 gap-6 group cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`case-${c.id}-detail`}
      >
        <div className="flex items-baseline gap-6">
          <span
            className="font-bold"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontSize: "0.8rem" }}
          >
            {c.num}
          </span>
          <span
            className="font-bold lowercase tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.25rem, 3vw, 2.5rem)",
              color: "var(--color-ink)",
            }}
          >
            {c.context}
          </span>
        </div>

        {/* Toggle icon */}
        <span
          className="shrink-0 text-2xl transition-transform duration-300 font-light"
          style={{
            color: "var(--color-ink-muted)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
          aria-hidden
        >
          +
        </span>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`case-${c.id}-detail`}
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { label: "problema", value: c.problem },
                { label: "cosa abbiamo fatto", value: c.solution },
                { label: "risultato", value: c.result },
                { label: "tempo", value: c.time },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink-muted)" }}
                  >
                    {label}
                  </dt>
                  <dd>
                    <Text variant="copy-14" color="ink" style={{ lineHeight: 1.6 }}>
                      {value}
                    </Text>
                  </dd>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function WorksSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section
      id="works"
      className="bg-(--color-bg-warm-end)"
      labelledBy="works-title"
    >
      <motion.div
        ref={headerRef}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-2"
      >
        <h2
          id="works-title"
          className="font-bold lowercase tracking-[-0.04em] leading-[0.92]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 10vw, 12rem)",
            color: "var(--color-ink)",
          }}
        >
          projects
        </h2>
      </motion.div>

      <dl className="mt-6 lg:mt-8">
        {cases.map((c, i) => (
          <CaseRow key={c.id} c={c} index={i} />
        ))}
        <div className="border-t" style={{ borderColor: "var(--color-border)" }} />
      </dl>
    </Section>
  );
}
