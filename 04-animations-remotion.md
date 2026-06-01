# 04 — Animazioni, Transizioni, Video Remotion

Come il sito si muove. Ogni regola qui è coerente con `02-design-guide.md` (dove il design statico è definito) e con il reference `PORTFOLIO.mp4` (dal quale prendiamo il ritmo: presenza, poi rivelazione, poi caldo finale).

Principio-madre: **le animazioni sono enhancement, non contenuto.** Se un utente ha `prefers-reduced-motion: reduce`, tutto deve continuare a essere leggibile e navigabile.

---

## 1. Stack tecnico animazioni

| Tool | Uso | Perché |
|------|-----|--------|
| **Framer Motion 11** | Micro-interazioni, layout animations, page transitions | API dichiarativa, ottima DX, supporto nativo reduced-motion |
| **GSAP 3.12 + ScrollTrigger** | Scroll-driven (pinning, parallax, sequence) | Nessuno lo fa meglio di GSAP per scroll timeline complesse |
| **Lenis 1.1** | Smooth scroll nativo | Unico modo per avere ScrollTrigger coerente su iOS. Supporta touch |
| **React Three Fiber + Drei** | Keycap 3D | Componibile, reactive, perfetto per integrazione React |
| **Remotion 4** | Video programmatici | Rendering server-side ripetibile, versioned, componenti React |
| **Auto-animate** (`@formkit/auto-animate`) | Transizioni su liste | Zero config per reorder/add/remove di feed e cards |

### Perché Framer + GSAP insieme
Framer vince per interazione puntuale (hover, tap, layout). GSAP vince per scroll timeline con pinning e scrub. Dividere il lavoro evita di forzare una libreria oltre il suo sweet spot.

---

## 2. Sistema di "ritmo" globale

Il sito ha 3 tempi di movimento (valori da usare in ogni transizione):

```ts
// lib/motion.ts
export const timing = {
  // Micro-interazioni: hover, tap, focus
  micro:   { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  // Transizioni UI: open modal, nav collapse, card expand
  ui:      { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  // Ingressi contenuto: reveal on scroll, fade-in grandi
  content: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
  // Overture: hero load, transizione pagina
  opener:  { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
} as const;
```

Regola: **mai superare 1.2s**. Oltre diventa percepito come lag.

### Easing standard
Usare quasi solo "ease-out quartico" `cubic-bezier(0.22, 1, 0.36, 1)` (Framer lo esporta come `'easeOut'` ma questa curva è più espressiva). Per i movimenti "pesanti" (overture) passiamo a `cubic-bezier(0.16, 1, 0.3, 1)` che è più "posato".

### Stagger
Quando anima una lista: delay `0.06s` tra elementi, mai oltre 10 elementi in serie.

---

## 3. Scroll globale — Lenis setup

```tsx
// lib/smooth-scroll.tsx
'use client';
import Lenis from 'lenis';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
      smoothWheel: true,
      smoothTouch: false, // mantieni nativo su iOS
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // reduced motion: disabilita Lenis
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) lenis.stop();
    mq.addEventListener('change', (e) => e.matches ? lenis.stop() : lenis.start());

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

Wrappare `app/layout.tsx` con `<SmoothScrollProvider>`.

---

## 4. Animazioni per sezione

### 4.1 HERO — Overture + keycap

Sequenza al page load (0ms → 1800ms):

| Tempo | Evento |
|-------|--------|
| 0ms | Background gradient warm `opacity: 0 → 1`, 800ms `opener` |
| 200ms | Logo nav slide-down `y: -20 → 0`, fade-in |
| 400ms | Nav link fade-in con stagger 60ms |
| 600ms | Keycap base appare con leggero scale-in (`0.94 → 1`), 900ms opener |
| 800ms | Tasto "AI" emissive attivo (light pulse start) |
| 1000ms | Tagline "simone sanna" mask-in linea per linea (600ms per linea, stagger 120ms) |
| 1600ms | Pill "Milano · ..." fade-in |

Implementazione tagline (mask line reveal):
```tsx
// variants Framer
const lineVariants = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: 0,
    transition: { delay: 1.0 + i * 0.12, ...timing.opener }
  })
};

<h1 className="display-xl">
  {['simone sanna', 'formatore ai e', 'marketing specialist'].map((line, i) => (
    <span key={i} className="block overflow-hidden">
      <motion.span className="block" initial="hidden" animate="visible" custom={i} variants={lineVariants}>
        {line}
      </motion.span>
    </span>
  ))}
</h1>
```

### 4.2 KEYCAP 3D — Idle + hover

**Idle**: lightLeak del tasto "AI" pulsa in sinusoide (2 secondi per ciclo, intensità 0.85 ↔ 1.15). Base del keycap fa "breathing" molto discreto, rotation Y `-0.5° ↔ 0.5°` su 4s.

**Mouse-follow** (desktop):
```tsx
// KeycapScene.tsx
useFrame(({ mouse }) => {
  group.current.rotation.y = THREE.MathUtils.lerp(
    group.current.rotation.y,
    mouse.x * 0.14, // max ±0.14 rad ≈ ±8°
    0.08
  );
  group.current.rotation.x = THREE.MathUtils.lerp(
    group.current.rotation.x,
    -mouse.y * 0.08, // max ±0.08 rad ≈ ±4.6°
    0.08
  );
});
```

**Click sul tasto "AI"**: il tasto si preme (traslazione Y negativa di 0.06 units, return spring), particelle arancio escono dal basso (max 20, lifetime 1.2s), evento analytics `keycap_click`.

**Scroll**: al di fuori del viewport il `RAF` del keycap si mette in pausa (IntersectionObserver + `frameloop="demand"` di R3F).

### 4.3 NAV — Scroll behavior

- Scroll down 80px: nav prende backdrop-blur + shadow, `transition: 200ms`.
- Scroll up da qualsiasi posizione: nav appare (se era nascosta). Classic "hide-on-scroll-down, show-on-scroll-up" con threshold di 12px di delta.
- Link attivo: underline animata con `layoutId="nav-underline"` Framer (il pallino sottolineante si sposta in modo liscio tra le sezioni).

### 4.4 INTRO — Reveal semplice

```tsx
const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: timing.content }
};

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-15% 0px' }}
  variants={reveal}
>
  ...
</motion.div>
```

Ogni paragrafo ha delay incrementale di 80ms.

### 4.5 METODO — Scroll-pinned step reveal

La sezione si "pinna" mentre l'utente scorre: i 4 step si rivelano uno alla volta, con il numero gigante outline che diventa solido+accent quando lo step è attivo.

```tsx
// components/sections/Method.tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#method',
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 0.8,
    }
  });

  steps.forEach((_, i) => {
    tl.to(`#step-${i}-number`, {
      color: 'var(--color-accent)',
      webkitTextStroke: '2px var(--color-accent)',
      duration: 1,
    }, i);
    tl.to(`#step-${i}-body`, { opacity: 1, y: 0, duration: 1 }, i);
    if (i < steps.length - 1) {
      tl.to(`#step-${i}-body`, { opacity: 0.25, y: 0, duration: 1 }, i + 0.5);
    }
  });
}, []);
```

Su mobile il pinning è disattivato: gli step diventano una stack verticale classica con reveal standard (l'esperienza pin su mobile è sempre fragile).

### 4.6 WORKS — Card expand inline

Click → la card passa da "collapsed" a "expanded" con `layout` animation.

```tsx
<motion.article layout transition={timing.ui}>
  <motion.header layout>...</motion.header>
  <AnimatePresence>
    {isOpen && (
      <motion.div
        layout
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={timing.ui}
      >
        {caseDetail}
      </motion.div>
    )}
  </AnimatePresence>
</motion.article>
```

Hover (desktop): `translateY(-4px)` + shadow, 180ms micro.

### 4.7 FEED LINKEDIN — Auto-animate

```tsx
import { useAutoAnimate } from '@formkit/auto-animate/react';

const [parent] = useAutoAnimate({ duration: 380 });

<ul ref={parent}>
  {posts.map(p => <FeedCard key={p.id} post={p} />)}
</ul>
```

Quando il feed ricarica (ISR), eventuali card che cambiano ordine si transitano fluidamente.

### 4.8 CONTATTI — Ritorno a caldo

Gradient warm ri-appare con fade di 600ms quando la sezione entra in viewport. Il keycap mini (in contact) parte da scale 0.9, rotation Y 0.6 rad, e si posa in posizione finale in 900ms `opener`. È l'ultima "firma" visiva del sito.

Hover CTA: background shift `--color-ink → --color-accent`, freccia `↗` trasla `+4px, -4px` con micro (180ms).

### 4.9 FOOTER — Nessuna animazione

Entrata pulita, niente effetti. È dove l'utente si ferma.

---

## 5. Page transitions (se aggiungiamo /colophon)

Single page resta la home. Se aggiungiamo `/colophon`:

```tsx
// app/template.tsx
'use client';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={timing.ui}
    >
      {children}
    </motion.div>
  );
}
```

View Transitions API (Next.js 15 support): se disponibile, preferire `useViewTransitionState()` — transizione nativa, zero JS extra.

---

## 6. Micro-interazioni catalog

| Elemento | Stato | Effetto |
|----------|-------|---------|
| Link nav | hover | underline grow left→right, 180ms |
| Link nav | active | underline solida accent + `layoutId` shift |
| CTA pulsante | hover | bg shift + icona `↗` trasla 4/4px |
| CTA pulsante | tap | scale `0.98` + bounce spring |
| Case card | hover | translateY -4 + shadow lift |
| Case card | tap | scale `0.99` |
| Pill live | always | pallino accent pulse 2s sinusoidale |
| Social icon | hover | rotate `-6°` + scale `1.1`, 200ms |
| Scroll indicator | always | freccia ↓ bounce soft (Y `0 → 6 → 0`, 2s loop) |
| Cursor custom | hover interactive | scale `1.5`, 150ms |
| Input focus | focus | border `--color-border → --color-accent` + label slide-up |
| Form submit | submit | bottone diventa spinner, testo "invio in corso", success checkmark draw 400ms |

---

## 7. Performance budget per le animazioni

| Metrica | Budget |
|---------|--------|
| Frame rate target | 60fps desktop, 30fps+ mobile low-end |
| Paint operations | Solo `transform` e `opacity` (GPU accelerati). Mai `width/height/top/left` animati |
| Main thread JS per frame | < 8ms |
| Numero max animazioni simultanee | 5 su mobile, 12 su desktop |
| Peso totale JS animazioni | < 45KB gzipped (Framer + GSAP + Lenis) |

### Come rispettare il budget
- **`will-change`** solo prima di animare, rimuoverlo dopo (è una promessa al browser, non un set-and-forget)
- **Contain**: `contain: layout paint` su section che contengono animazioni
- **IntersectionObserver**: pause delle animazioni offscreen (GSAP, R3F)
- **`requestAnimationFrame`** per tutto ciò che non passa da Framer/GSAP
- **No layout thrash**: se serve measure+write del DOM, batch con `requestAnimationFrame`

---

## 8. Reduced motion — regole strict

Quando `(prefers-reduced-motion: reduce)`:

- Lenis: `stop()`
- GSAP ScrollTrigger: pin disattivati, scrub sostituito con toggle actions
- Framer: `useReducedMotion()` ritorna true, tutte le animazioni degradano a fade `opacity 0 → 1` in 200ms
- Keycap 3D: sostituito dalla PNG statica
- Cursor custom: off
- Particelle click: off
- Video autoplay (se esistono): off, si mostra poster

Test: in Chrome DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion → reduce. Il sito deve risultare leggibile e usabile con zero animazioni.

---

## 9. Video embeddati — Remotion

### A cosa servono
Remotion permette di rendere **video programmatici** come componenti React. Usato nel sito per:

1. **Intro opener** — 5 secondi, opzionale, può partire al primo load se user non ha reduced-motion. Mostra la tagline che si compone dalla digitazione + keycap che entra.
2. **Video metodo** — 20 secondi, animazione dei 4 step con grafica stile slide (sezione metodo ha versione statica E un bottone "vedi in 20 secondi").
3. **Case study video brief** — 15 secondi per case study rilevanti (solo alcuni). Mostra contesto → problema → risultato con motion graphics.

### Perché Remotion e non After Effects + MP4
- **Versioning**: il video vive nel repo, si rigenera se cambiano i contenuti
- **Theming coerente**: usa gli stessi token CSS del sito
- **Updates automatici**: se cambia un numero in Notion, il video si rigenera alla prossima build
- **Rendering offline**: build Vercel + render Lambda su AWS Remotion Lambda, costo ~$0.003/minute

### Struttura

```
/remotion
├── index.ts              # Compositions registration
├── Root.tsx              # Composition list
├── compositions/
│   ├── Intro/
│   │   ├── Intro.tsx
│   │   ├── Tagline.tsx
│   │   └── Keycap.tsx
│   ├── Method/
│   │   ├── Method.tsx
│   │   └── Step.tsx
│   └── CaseStudy/
│       ├── CaseStudy.tsx
│       ├── Metric.tsx
│       └── Timeline.tsx
├── design/
│   ├── tokens.ts         # Palette + typography (import da /styles)
│   └── transitions.ts    # Spring + fade factory
└── remotion.config.ts
```

### Esempio: Intro.tsx

```tsx
// /remotion/compositions/Intro/Intro.tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors, fonts } from '../../design/tokens';

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const backgroundOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const taglineY = spring({
    frame: frame - 30,
    fps,
    from: 110,
    to: 0,
    config: { damping: 200, mass: 1.2 }
  });

  return (
    <AbsoluteFill style={{ background: colors.gradientWarm, opacity: backgroundOpacity }}>
      <AbsoluteFill style={{
        fontFamily: fonts.display,
        fontSize: '10vw',
        color: colors.cream,
        padding: '0 6vw',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingBottom: '8vh',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ transform: `translateY(${taglineY}%)` }}>simone sanna</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

### Composition registration

```tsx
// /remotion/Root.tsx
import { Composition } from 'remotion';
import { Intro } from './compositions/Intro/Intro';

export const RemotionRoot = () => (
  <>
    <Composition
      id="intro"
      component={Intro}
      durationInFrames={150} // 5s @ 30fps
      fps={30}
      width={1920}
      height={1080}
    />
    {/* altre composition */}
  </>
);
```

### Embedding nel sito

Due strategie:

**Strategia A — MP4 statico** (raccomandato per intro)
Render-time: `npx remotion render intro out/intro.mp4`.
Il file finisce in `public/videos/intro.mp4`, servito da CDN.
Uso in sito:
```tsx
<video
  src="/videos/intro.mp4"
  autoPlay
  muted
  playsInline
  poster="/videos/intro-poster.jpg"
  className="w-full h-auto"
/>
```

**Strategia B — Player interattivo live** (per case studies dinamiche)
`@remotion/player` embedded in React. Il video si ri-renderizza se cambiano i dati.
```tsx
import { Player } from '@remotion/player';
import { CaseStudy } from '@/remotion/compositions/CaseStudy/CaseStudy';

<Player
  component={CaseStudy}
  durationInFrames={450}
  fps={30}
  compositionWidth={1920}
  compositionHeight={1080}
  style={{ width: '100%', aspectRatio: '16/9' }}
  controls
  inputProps={{ caseData: currentCase }}
/>
```

La Strategia B costa più JS (~180KB gzipped per `@remotion/player`), quindi va usata solo dove il valore del video live è alto.

### Pipeline di build

```yaml
# .github/workflows/render-videos.yml
name: Render Remotion videos
on:
  push:
    paths:
      - 'remotion/**'
      - 'content/**'
jobs:
  render:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx remotion render intro public/videos/intro.mp4 --codec=h264 --crf=20
      - run: npx remotion render method public/videos/method.mp4 --codec=h264 --crf=20
      - uses: actions/upload-artifact@v4
        with: { name: videos, path: public/videos/ }
```

In alternativa, render on-demand via **Remotion Lambda** per i case study (evita workflow pesante nel repo).

### Regole video Remotion

1. **Nessun video > 30 secondi** (l'utente scorre, non guarda). Intro 5s, metodo 20s, case 15s.
2. **Muto di default**. Nessun audio autoplay.
3. **`playsInline`** obbligatorio (iOS non fa fullscreen).
4. **Poster statico** sempre presente (LCP non degrada).
5. **Reduced motion**: nascondi il video, mostra versione statica (frame 1 come immagine).
6. **Fallback immagine** se `navigator.connection?.effectiveType === '2g' || 'slow-2g'`.
7. Stessi token (colori, font, timing) tra sito e video — mai palette divergenti.

---

## 10. Test & QA animazioni

### Checklist
- [ ] 60fps costanti su MacBook Air M1 Chrome
- [ ] 30fps+ su iPhone 12 Safari (device reale)
- [ ] Zero layout shift durante le animazioni (CLS < 0.05)
- [ ] `prefers-reduced-motion: reduce` testato: sito usabile e bello
- [ ] Tab navigation funzionante (nessun focus trap animato)
- [ ] Lighthouse Performance > 90 mobile
- [ ] Lighthouse Accessibility = 100
- [ ] Nessuna animazione parte prima che il font sia caricato (evitare FOUT+animato = doppio disturbo)

### Tool
- **Chrome DevTools Performance**: record di un'intera sessione hero→contact, cerca long tasks
- **Chrome DevTools Rendering → FPS meter**
- **Lighthouse CI** in GitHub Actions
- **Playwright** visual regression: screenshot di hero pre/post animazione

---

## 11. Snippet Framer Motion riutilizzabili

Salvare in `lib/motion.ts`:

```ts
// Fade up
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: timing.content }
};

// Stagger children
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren }
  }
});

// Scale-in soft
export const scaleSoft = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: timing.content }
};

// Mask line reveal
export const maskLine = (delay = 0) => ({
  hidden: { y: '110%' },
  visible: { y: 0, transition: { ...timing.opener, delay } }
});

// Hover lift
export const liftHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.005, transition: timing.micro }
};
```

Import ovunque servano. Coerenza immediata.

---

## 12. Regole editoriali sulle animazioni

1. **Niente "wow di primo impatto"** — Il sito non deve sembrare una demo. L'animazione serve il contenuto.
2. **Niente parallax gratuito**. Parallax solo dove aggiunge significato (keycap, numeri step).
3. **Niente loop infiniti troppo vistosi**. Solo il pallino live e il breathing del keycap. Stop.
4. **Niente reveal a pioggia**. Non tutto deve entrare in viewport con animazione. Molto resta statico (è una scelta).
5. **Niente transizione audio**. Zero suoni. Mai.
6. **Niente "scroll-jacking" aggressivo**. Lenis è smooth, non ruba il controllo. Il pin del metodo dura 300vh max.
7. **Niente cursor effect decorativi**. Il cursor custom è solo visual feedback di interattività, nient'altro.

---

## 13. Roadmap animazioni

| Fase | Output |
|------|--------|
| 1 | Lenis setup + fade reveal base su tutte le sezioni |
| 2 | Nav micro-interazioni + layoutId underline |
| 3 | Hero overture + mask line reveal tagline |
| 4 | Keycap idle + mouse-follow |
| 5 | Case card expand + feed auto-animate |
| 6 | ScrollTrigger pin su sezione metodo |
| 7 | Remotion: intro MP4 statico |
| 8 | Remotion: player live per 1 case study |
| 9 | Passaggio finale: reduced motion audit + performance tuning |

Ogni fase chiude con una demo sul branch preview Vercel.
