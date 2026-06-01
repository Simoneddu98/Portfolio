# Portfolio Simone Sanna — Documentazione di Progetto

Portfolio personale di Simone Sanna, Digital Marketing Specialist + Trainer AI a Milano. Sito one-pager con navigazione verticale, responsive-first (mobile → desktop), ispirato allo stile del reference `PORTFOLIO.mp4` presente in cartella (portfolio Framer-style con elemento 3D centrale e gradient warm arancio/rosso).

---

## File di questo progetto

| File | Cosa contiene |
|------|----------------|
| `00-README.md` | Questo file. Indice generale, stack tecnico, roadmap |
| `01-content-story.md` | Storia come formatore AI + copy pronto per tutte le sezioni |
| `02-design-guide.md` | Design system: palette, typography, layout, componenti, responsive |
| `03-integrations-automations.md` | Collegamenti esterni, form, CMS, analytics, automazioni |
| `04-animations-remotion.md` | Transizioni, micro-interazioni, scroll-animations, video Remotion embedded |

Leggi i file nell'ordine sopra quando imposti il progetto. `02` e `04` si completano: il design fissa lo stato finale, `04` descrive come ci si arriva.

---

## Stack Tecnico Scelto

La scelta privilegia: performance su mobile, animazioni di qualità, video programmatici, SEO pulito.

### Core
- **Next.js 15** (App Router) — framework React, SSG per le sezioni statiche, SSR dove serve fresh data
- **TypeScript** — sicurezza sui prop dei componenti 3D e delle animazioni
- **Tailwind CSS v4** — utility-first, build istantanea, theme centralizzato
- **React 19** — latest stable con Server Components

### Animazioni & 3D
- **Framer Motion 11** — transizioni di pagina, micro-interazioni, variants
- **GSAP 3.12 + ScrollTrigger** — scroll-driven animations, pinning, parallax
- **Lenis** — smooth scroll nativo (obbligatorio per GSAP ScrollTrigger coerente su iOS)
- **React Three Fiber + Drei** — keycap 3D interattivo in hero, scene leggera
- **Remotion 4** — video programmatici embeddati nel sito (intro, case study)

### Performance / Delivery
- **Next/Image + Sharp** — lazy loading, AVIF/WebP automatici
- **Vercel** — deploy, ISR, edge functions
- **PartyTown** — offload di script terzi (analytics) al web worker

### Dev tooling
- **Biome** (al posto di ESLint+Prettier) — linting/formatting unico, più veloce
- **Playwright** — test E2E sulle animazioni chiave e sul responsive
- **Lighthouse CI** — budget performance nelle GitHub Actions

---

## Struttura cartelle consigliata

```
portfolio/
├── app/
│   ├── layout.tsx              # Shell con nav + smooth scroll provider
│   ├── page.tsx                # Home one-pager
│   ├── api/
│   │   └── contact/route.ts    # Endpoint form contatti (edge)
│   └── opengraph-image.tsx     # OG dinamico
├── components/
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── KeycapScene.tsx     # React Three Fiber
│   │   └── HeroGradient.tsx    # Gradient animato CSS
│   ├── sections/
│   │   ├── About.tsx
│   │   ├── Method.tsx          # "Dal Caos all'Alchimia"
│   │   ├── Works.tsx           # Case study / corsi / talk
│   │   ├── Services.tsx
│   │   └── Contact.tsx
│   ├── ui/
│   │   ├── Nav.tsx
│   │   ├── Cursor.tsx          # Custom cursor desktop
│   │   ├── LogoMark.tsx
│   │   └── Reveal.tsx          # Wrapper per reveal on scroll
│   └── video/
│       └── RemotionPlayer.tsx
├── remotion/
│   ├── index.ts                # Composizioni registrate
│   ├── Intro.tsx               # Intro 5s del sito
│   └── CaseStudy.tsx
├── lib/
│   ├── motion.ts               # Variants Framer riutilizzabili
│   ├── gsap.ts                 # Setup ScrollTrigger + Lenis
│   └── seo.ts
├── public/
│   ├── fonts/
│   └── models/keycap.glb       # Mesh keycap 3D
├── styles/
│   └── globals.css             # Token Tailwind + CSS variables
└── content/
    └── *.mdx                   # Contenuti statici editabili (bio, metodo, case)
```

---

## Principi di progetto (vincolanti)

1. **Mobile-first reale**. Ogni componente progettato prima a 360px, poi scalato. Il keycap 3D su mobile degrada a PNG renderizzato (niente Three.js sotto 768px salvo `prefers-reduced-motion: no-preference` + connessione buona).
2. **Nessun gradient decorativo**. L'unico gradient del sito è l'hero/contact warm (arancio→rosso). Il resto è piatto.
3. **Una sola idea per schermata**. Scroll = cambio di idea. Niente affollamento.
4. **Typography is the design**. I titoli grandi (fino a 18vw desktop) sono l'elemento dominante, non decorazione.
5. **Tutto funziona senza JavaScript**. Le animazioni sono progressive enhancement, non contenuto.
6. **`prefers-reduced-motion` rispettato ovunque**. Se l'utente lo chiede, tutte le animazioni si disattivano senza rompere il layout.
7. **Prestazioni budget**: LCP < 2.0s su 4G, CLS < 0.05, TBT < 150ms. Se un'animazione mette a rischio questi numeri, si taglia.

---

## Roadmap indicativa

| Sprint | Focus | Deliverable |
|--------|-------|-------------|
| 1 | Setup + Design System | Next.js + Tailwind + token da `02-design-guide.md`, Storybook delle primitive |
| 2 | Hero + Nav | Hero con keycap statico PNG, gradient animato, nav responsive, smooth scroll |
| 3 | Keycap 3D | Scena R3F con interazione mouse, fallback PNG |
| 4 | Sezioni Content | About, Method, Works, Services secondo `01-content-story.md` |
| 5 | Animazioni avanzate | Scroll-trigger su tutte le sezioni secondo `04-animations-remotion.md` |
| 6 | Remotion | Intro 5s + 1 case study video embedded |
| 7 | Integrazioni | Form contatti, Plausible analytics, newsletter, Notion CMS (`03`) |
| 8 | QA + Performance | Lighthouse, a11y audit, test su device reali, deploy |

Ogni sprint chiude con un deploy su preview URL Vercel revisionabile.

---

## Cosa NON entra nel sito (scelta editoriale)

- Nomi di aziende o brand come cliente/employer (scelta esplicita di Simone).
- Testimonianze con logo aziendale.
- Counter tipo "+500 studenti formati" come vanto: i numeri ci sono ma contestualizzati nel metodo, non come trofeo.
- Blog integrato alla prima release (il contenuto editoriale vive su LinkedIn, il sito linka).
- Popup, cookie wall invasivi, chat bot commerciali.

---

## Fonti di stile

- Reference video: `PORTFOLIO.mp4` in questa cartella (portfolio Framer di Sasha Belousov, Freelance Product Designer). Prendiamo: layout hero con keycap 3D, gradient warm, typography lowercase bold, nav minimal, badge/mockup pattern.
- Brand identity esistente: palette e font derivati dalle visual guidelines LinkedIn di Simone (`#E85D26` accent, Space Grotesk + DM Sans).
- La convergenza tra i due mondi è naturale: il video usa la stessa famiglia di rosso/arancio che è già l'accento di Simone.
