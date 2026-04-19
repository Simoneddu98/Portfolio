'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SplineScene } from '@/components/ui/SplineScene'
import { Spotlight } from '@/components/ui/Spotlight'
import { AnimatedLetterText } from '@/components/ui/potfolio-text'

// Sostituisci con la scena Spline del keycap quando pronta
const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative min-h-[100svh]"
      style={{ background: 'var(--gradient-warm)' }}
    >
      {/* Spotlight interattivo al mouse — overflow-hidden solo qui per non tagliare Spline */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <Spotlight size={500} />
      </div>

      {/* Layout: colonna su mobile, side-by-side su desktop */}
      <div className="relative z-10 min-h-[100svh] flex flex-col lg:flex-row">

        {/* ── Sinistra: testo ─────────────────────────────── */}
        <div
          className="flex flex-col justify-end lg:justify-center flex-1 pt-24 pb-10 lg:pb-0"
          style={{ padding: 'calc(var(--section-pt) + 5rem) var(--page-px) 2.5rem' }}
        >
          {/* Tagline */}
          <h1 style={{ fontFamily: 'var(--font-display)' }}>
            {/* Linea 1: nome */}
            <motion.span
              className="block text-white font-bold"
              style={{
                fontSize: 'clamp(2.25rem, 8vw, 11rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.04em',
              }}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              Simone Sanna
            </motion.span>

            {/* Linea 2: "Portfolio" con diamond animato sulla "o" */}
            <motion.span
              className="block text-white font-bold"
              style={{
                fontSize: 'clamp(2.25rem, 8vw, 11rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.04em',
              }}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatedLetterText
                text="Portfolio"
                letterToReplace="o"
                className="font-bold text-white"
              />
            </motion.span>
          </h1>

          {/* CTA email sotto la tagline */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-8 flex items-center gap-4 flex-wrap"
          >
            <a
              href="mailto:hello@simonesanna.it"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              scrivimi ↗
            </a>
            <a
              href="#servizi"
              className="text-white/60 text-sm font-medium hover:text-white/90 transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              scopri i servizi ↓
            </a>
          </motion.div>

        </div>

        {/* ── Destra: scena 3D Spline ──────────────────────── */}
        <motion.div
          className="flex-1 relative min-h-[65svh] lg:min-h-0"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <SplineScene
            scene={SPLINE_SCENE}
            className="absolute -inset-[6%] translate-y-[6%]"
          />
        </motion.div>
      </div>
    </section>
  )
}
