"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/text";

export function ContattiSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="contatti"
      aria-labelledby="contatti-title"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      style={{
        background: "var(--gradient-warm)",
        paddingTop: "var(--section-pt)",
        paddingBottom: "var(--section-pb)",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
      }}
    >
      <div className="max-w-[1440px] mx-auto w-full" ref={ref}>
        <motion.h2
          id="contatti-title"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold lowercase tracking-[-0.04em] leading-[0.92] text-white mb-10 lg:mb-14"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 10vw, 12rem)",
          }}
        >
          contatti
        </motion.h2>

        {/* Email CTA */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="mailto:simonesanna.lavoro@gmail.com"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-full font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.5vw, 1.375rem)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(8px)",
              boxShadow: "var(--shadow-lift)",
            }}
          >
            scrivimi a simonesanna.lavoro@gmail.com
            <span aria-hidden>↗</span>
          </a>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5"
        >
          <Text
            variant="copy-14"
            color="ink"
            className="max-w-md"
            style={{ lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}
          >
            Rispondo entro 48 ore. Se hai in mente un percorso aziendale, dimmi qualcosa sul team e sui processi che vuoi toccare. Più contesto mi dai, più veloce sarò a capire se posso aiutarti.
          </Text>
        </motion.div>

        {/* Info row */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 lg:mt-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div>
            <p
              className="font-bold text-white"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem" }}
            >
              Simone Sanna
            </p>
            <Text
              variant="copy-14"
              className="mt-1"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Formatore AI · Digital Marketing Specialist
              <br />
              Milano · Italia
            </Text>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/simone-sanna-6767901a8/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="opacity-75 hover:opacity-100 transition-opacity"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
