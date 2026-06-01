# 02 — Design Guide

Design system del portfolio. Tutto quello che sta tra il contenuto (`01`) e il comportamento (`04`) vive qui: palette, tipografia, spaziatura, layout, componenti, breakpoints, regole di accessibilità.

La fonte stilistica primaria è il reference `PORTFOLIO.mp4` in cartella (portfolio Framer di un product designer, layout one-pager con elemento 3D in hero e gradient warm). La palette e i font sono ereditati dalle brand guidelines esistenti di Simone (LinkedIn visual identity).

---

## 1. Design tokens

I token vivono in `styles/globals.css` come CSS variables + sono wrappati in `tailwind.config.ts` come theme extensions. Questo permette di switchare dark/light mode senza rifare classi.

### 1.1 Palette

```css
:root {
  /* Core */
  --color-bg-warm-start:    #F8F6F2;  /* cream, sfondo neutro */
  --color-bg-warm-end:      #EDE8DF;  /* cream più scuro per footer */
  --color-ink:              #0F0F0F;  /* nero testo */
  --color-ink-muted:        #5A5A5A;  /* grigio secondario */
  --color-border:           #E0DDD8;  /* divisori */

  /* Accent: il rosso/arancione del keycap */
  --color-accent:           #E85D26;  /* signal orange */
  --color-accent-deep:      #B8370C;  /* fondo del gradient hero */
  --color-accent-glow:      #FFB37A;  /* highlight del keycap */

  /* Gradient hero/contact */
  --gradient-warm: radial-gradient(
    ellipse 100% 80% at 50% 45%,
    #FF8A3D 0%,
    #E85D26 35%,
    #B8370C 70%,
    #7A1F00 100%
  );
}

/* Dark mode opzionale, default off — attivabile con [data-theme="dark"] */
[data-theme="dark"] {
  --color-bg-warm-start: #0F0F0F;
  --color-bg-warm-end:   #1A1A1A;
  --color-ink:           #F8F6F2;
  --color-ink-muted:     #A8A6A1;
  --color-border:        #2A2A2A;
  /* accent e gradient restano identici: l'arancio funziona su entrambi */
}
```

**Regola d'uso**:
- `--color-accent` usato SOLO su: keycap attivo, CTA primaria, indicatore nav attivo, numero step corrente. Mai decorativo.
- `--color-accent-deep` e `--color-accent-glow` vivono dentro il gradient radiale e il lighting 3D. Non si usano nel UI piatto.
- Max 3 colori visibili contemporaneamente per viewport.

### 1.2 Tipografia

```
Headline    → Space Grotesk Bold (700)
Display     → Space Grotesk Bold (700) weight esagerato
Body        → DM Sans Regular (400) / Medium (500)
Quote       → Space Grotesk Medium Italic (500)
Mono/meta   → JetBrains Mono Regular (per colophon e footer)
```

Caricamento tramite `next/font`:
```ts
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from 'next/font/google';
```
Variables CSS pubblicate come `--font-display`, `--font-body`, `--font-mono`.

### 1.3 Scala tipografica fluida

Uso `clamp()` per tutto, evita breakpoint infiniti. Step `1.25` (major third).

| Ruolo | Fluid size | Line-height | Tracking | Peso |
|-------|-----------|-------------|----------|------|
| `display-xl` (tagline hero) | `clamp(3.5rem, 14vw, 18rem)` | 0.9 | -0.04em | 700 |
| `display-lg` (sezione title) | `clamp(3rem, 10vw, 12rem)` | 0.92 | -0.035em | 700 |
| `display-md` | `clamp(2.25rem, 6vw, 6rem)` | 0.95 | -0.03em | 700 |
| `headline` | `clamp(1.5rem, 3vw, 2.5rem)` | 1.1 | -0.02em | 700 |
| `body-lg` | `clamp(1.125rem, 1.2vw, 1.375rem)` | 1.55 | -0.005em | 400 |
| `body` | `1rem` (16px) | 1.6 | 0 | 400 |
| `caption` | `0.875rem` (14px) | 1.5 | 0.01em | 400 |
| `mono-sm` | `0.8125rem` (13px) | 1.5 | 0.02em | 400 |

Tutti i titoli sono **lowercase** (come nel video reference). Niente `text-transform: uppercase` sul sito.

### 1.4 Spaziatura

Scala basata su `4px` (`0.25rem`). Tailwind default va bene. Per le sezioni:

```
/* Padding top/bottom per ogni sezione */
--section-pt: clamp(5rem, 10vw, 10rem);
--section-pb: clamp(5rem, 10vw, 10rem);

/* Padding orizzontale container */
--page-px: clamp(1.25rem, 5vw, 6rem);
```

Container max-width: `1440px`. Nulla di più grande (anche su schermi 4K il contenuto resta centrato).

### 1.5 Radius & shadows

```
--radius-sm:  8px
--radius-md:  16px
--radius-lg:  24px
--radius-full: 9999px

--shadow-soft:   0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);
--shadow-lift:   0 4px 8px rgba(0,0,0,.05), 0 16px 40px rgba(0,0,0,.08);
--shadow-keycap: 0 20px 60px rgba(184,55,12,.25), 0 8px 20px rgba(0,0,0,.15);
```

Le shadow sono rare: pill nav sticky, pulsante email in contact, keycap 3D rim-light. Niente card con ombra gratuita.

### 1.6 Breakpoints

Mobile-first. Valori Tailwind default, ma li ribattezziamo:

| Nome | min-width | Esempio d'uso |
|------|-----------|---------------|
| `sm`  | 640px  | Due colonne text, nav mobile espanso |
| `md`  | 768px  | Attivazione keycap 3D R3F |
| `lg`  | 1024px | Nav orizzontale completa |
| `xl`  | 1280px | Tagline in 2 righe, layout hero asimmetrico |
| `2xl` | 1536px | Limiti container attivi |

**Regola assoluta**: ogni componente viene progettato PRIMA su 360px (non 375), POI scalato.

---

## 2. Layout globale

### 2.1 Grid

12 colonne, gutter responsive:
- Mobile (<768): 4 col, gutter 16px
- Tablet (768-1024): 8 col, gutter 24px
- Desktop (>1024): 12 col, gutter 32px

Tailwind: `container mx-auto px-[var(--page-px)] grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 md:gap-x-6 lg:gap-x-8`.

### 2.2 Struttura verticale

```
┌──────────────────────────────────────┐
│ NAV (sticky, h: 72px / 80px desktop) │  <- blur backdrop su scroll
├──────────────────────────────────────┤
│                                      │
│  Section (min-h: 100svh)             │
│                                      │
├──────────────────────────────────────┤
│  Section                             │
├──────────────────────────────────────┤
│  ...                                 │
├──────────────────────────────────────┤
│  FOOTER                              │
└──────────────────────────────────────┘
```

Usare `100svh` (small viewport height) invece di `100vh` per evitare il jump su mobile Safari con la URL bar.

---

## 3. Componenti primitivi

Ogni componente va in `components/ui/` o `components/sections/`, documentato in Storybook.

### 3.1 `<Nav />`

```
┌─────────────────────────────────────────┐
│ [■] ──────────── metodo · works · hello │
└─────────────────────────────────────────┘
```

- Desktop (`lg+`): top-left logo (32x32 square pixel pattern), top-right link inline con `·` separatore, font DM Sans Medium 14pt.
- Mobile: logo + hamburger custom (tre barre orizzontali irregolari, non il classico hamburger). Tap apre overlay fullscreen con gradient warm e i 3 link a dimensione `display-md`.
- Su scroll > 80px: backdrop `rgba(248,246,242,.75)` + `backdrop-blur-md` + shadow-soft.
- Link attivo: sottolineatura colore `--color-accent`, spessore 2px, offset 4px.
- Accessibilità: `aria-current="page"` su link corrispondente alla sezione in viewport (IntersectionObserver).

### 3.2 `<LogoMark />`

Square 32x32 ispirato al logo del reference (pixel pattern). Versione Simone: 4 quadrati in griglia 2x2, uno dei 4 colorato `--color-accent`. Posizione del quadrato acceso: basso-destra (coerente con il keycap hero).

SVG inline, `fill="currentColor"` per il nero, `fill="var(--color-accent)"` per il quadrato acceso. Dimensioni responsive: 28px mobile, 32px desktop.

### 3.3 `<Section />`

Wrapper semantico `<section>` con id, attributo `aria-labelledby`, padding verticale responsive.

```tsx
<Section id="metodo" className="bg-cream">
  <Container>
    <SectionTitle>un metodo in 4 passaggi</SectionTitle>
    <SectionContent>...</SectionContent>
  </Container>
</Section>
```

### 3.4 `<DisplayTitle />`

Versione lowercase gigante usata come marcatore di sezione. Va sempre left-aligned su desktop. Su mobile resta left ma occupa più largo (95vw).

### 3.5 `<CTAButton />` — primary

```
┌──────────────────────────────────┐
│  scrivimi a hello@simonesanna.it ↗│
└──────────────────────────────────┘
```

- Sfondo `--color-ink`, testo `--color-bg-warm-start`, radius `--radius-full`.
- Padding: `16px 28px` mobile, `20px 36px` desktop.
- Hover: background shift a `--color-accent`, icona freccia `↗` trasla di 4px diagonale in alto-destra.
- Focus visible: ring 3px `--color-accent` con offset 3px.
- Motion: transizione 180ms `cubic-bezier(.22,1,.36,1)`.

### 3.6 `<Pill />` — secondary

Pill informativa piccola (es. "disponibile Q3 2026"). Background `rgba(15,15,15,.08)`, testo `--color-ink`, DM Sans Medium 13pt, padding `6px 12px`, radius full. Versione "live": puntino `--color-accent` animato (pulse 2s loop).

### 3.7 `<KeycapScene />`

Il cuore visivo del sito. Oggetto 3D (keycap tastiera) con 4 tasti etichettati.

**Geometrie**:
- Base del keycap: box `2.4 × 2.4 × 0.4` con bevel 0.08
- Singolo tasto: box `1.0 × 1.0 × 0.5` con bevel 0.06, inclinazione della top face 4°
- Tasto attivo ("AI"): stesso box ma con emissive material arancio `#E85D26`, intensity animata 0.8↔1.2 (sinusoidale, loop 3s)

**Luci**:
- Ambient 0.4 bianco neutro
- DirectionalLight key 1.2 da 45°
- PointLight emissive sul tasto AI (rimbalzo sui vicini)

**Camera**:
- Desktop: FOV 35, position `[0, 1, 6]`, looking at `[0, 0, 0]`
- Mouse-follow: rotazione `±8°` su Y, `±4°` su X (lerp 0.08, smooth)

**Fallback**:
- Su mobile (<768px) o `prefers-reduced-motion: reduce`: si mostra una PNG renderizzata 2x di default (Next/Image, lazy=false perché è LCP).
- In caso di errore WebGL: stessa PNG.

**Label sui tasti**: Marketing / Persone / AI / Formazione. Font Inter Bold 0.18 units, planar mapped sulla top face, `anchorY="middle"` per centrare.

Implementazione: React Three Fiber + `@react-three/drei` per `Text3D`, `MeshTransmissionMaterial` non serve (stiamo plastic/matte, niente vetro).

---

## 4. Pattern visivi ricorrenti

### 4.1 Hero gradient

Il gradient warm NON è un'immagine, è un `div` con `background: var(--gradient-warm)` + `filter: blur(80px)` wrappato dentro un container con `overflow: hidden`. Una noise texture SVG 4% opacity in overlay per evitare banding.

```tsx
<div className="absolute inset-0 -z-10">
  <div className="absolute inset-0" style={{ background: 'var(--gradient-warm)' }} />
  <svg className="absolute inset-0 w-full h-full opacity-[.04] mix-blend-overlay">
    <filter id="noise">
      <feTurbulence baseFrequency="0.9" numOctaves="2" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
</div>
```

### 4.2 Section headers

Titolo enorme lowercase left-aligned, subtitle sotto in DM Sans Medium, grigio `--color-ink-muted`. Distanza titolo→subtitle: 24px mobile, 32px desktop.

### 4.3 Case study card

Orizzontale, 1 col mobile / 2 col tablet / 3 col desktop (ma sulla griglia base 12: 4+4+4 con gap `var(--page-px)`).

- Background `--color-bg-warm-start` leggermente più saturo
- Border `1px solid var(--color-border)`
- Radius `--radius-lg`
- Padding 32px
- Hover: traslazione `translateY(-4px)`, shadow-lift
- Al click si apre inline in un `<details>` con animazione height (Framer Motion `AnimatePresence` + `layout`)

### 4.4 Numeri step del metodo

Outline giganti (`-webkit-text-stroke: 2px var(--color-ink)`, `color: transparent`), font Space Grotesk Bold 200pt. Diventano solidi + colore accent quando lo step è in viewport (scroll-trigger).

### 4.5 Feed LinkedIn cards

Card semplicissima: data in mono-sm, hook in `body-lg`, link in DM Sans Medium con `↗`. Border sottile `--color-border`, hover background `rgba(232,93,38,.04)` (un velo di accent).

### 4.6 Cursor custom (solo desktop, pointer: fine)

Cerchio 8px pieno `--color-ink`, scala `1.5` on hover su link/pulsanti. Implementato con `requestAnimationFrame` + `lerp`. Disabilitato su touch device.

---

## 5. Responsive playbook

| Elemento | Mobile (<768) | Tablet (768-1024) | Desktop (>1024) |
|----------|---------------|-------------------|-----------------|
| Nav | Logo + burger | Inline se cape | Inline spaziata |
| Hero keycap | PNG 1x | PNG 2x | R3F 3D |
| Hero tagline | `display-lg` 3 righe | `display-xl` 3 righe | `display-xl` 2-3 righe |
| Metodo step | Stack vertical | Stack vertical | Griglia 4 col |
| Works card | 1 col | 2 col | 3 col |
| Contact | Stack | 2 col centrato | 3 col asimmetrico |
| Footer | Stack | 2 col | 3 col |
| Cursor custom | Off | Off | On |
| Smooth scroll | iOS momentum nativo | Lenis | Lenis |

**Touch targets**: minimo 44×44 CSS pixel (Apple HIG), meglio 48×48. Vale per nav link, CTA, social icons, pulsanti feed.

**Viewport meta**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

**Safe areas iOS**:
```css
padding-bottom: calc(1rem + env(safe-area-inset-bottom));
```
Applicato a nav mobile overlay e footer.

---

## 6. Accessibilità (WCAG 2.1 AA)

### Contrasto
- `#0F0F0F` su `#F8F6F2` → 17.4:1 ✅
- `#5A5A5A` su `#F8F6F2` → 6.4:1 ✅
- `#F8F6F2` su gradient warm (darkest point `#7A1F00`): 9.2:1 ✅
- `#0F0F0F` su `#E85D26` → 4.9:1 ✅ (AA large text, AA normal al limite: usare solo per bottoni ≥16pt bold)
- `#F8F6F2` su `#E85D26` → 3.6:1 ❌ solo per testo ≥18pt bold o ≥24pt regular

Le CTA con bg accent usano testo `--color-ink` (sicuro). Se mai serve bianco su accent, minimum size 18pt bold.

### Focus
Tutti i focusable hanno un `:focus-visible` ring di 3px `--color-accent` con offset 3px. Nav link + CTA + link del feed.

### Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
Inoltre, nei componenti React usiamo `useReducedMotion()` di Framer Motion per disattivare variants pesanti e sostituire con `opacity` fade.

### Semantica
- `<main>` unico wrapper delle sezioni
- Ogni sezione ha `aria-labelledby` che punta al suo H2
- `<nav>` con `aria-label="principale"`
- Skip link `Vai al contenuto` visibile al primo tab

### Screen reader
Il keycap 3D ha `role="img"` e `aria-label="Keycap con quattro tasti: Marketing, Persone, AI, Formazione. Il tasto AI è evidenziato in arancione."`. Le label 3D interne sono aria-hidden.

---

## 7. Dark mode (opzionale, post-launch)

Attivazione via `prefers-color-scheme: dark` + toggle manuale in footer. Quando attivo:
- Sfondo `#0F0F0F`
- Testo `#F8F6F2`
- Gradient warm invariato (funziona ancora meglio su dark)
- Keycap: versione "night" con lighting diverso, base grigio scuro

Launch phase 1 ONLY light. Dark si valuta dopo QA.

---

## 8. Asset statici

### Favicon
- `favicon.ico` 32x32 con il logo mark pixel
- `icon-192.png`, `icon-512.png` per PWA (ma non serviamo PWA ora)
- `apple-touch-icon.png` 180x180

### OG image
Generata runtime con `@vercel/og`. Template:
- Sfondo gradient warm
- Keycap PNG centrato
- Tagline "simone sanna / formatore ai e marketing specialist" in basso-sinistra
- Logo mark in alto-sinistra
- Dimensioni 1200x630

Vive in `app/opengraph-image.tsx`.

### Font files
Servire via `next/font` (self-host automatico). No Google Fonts CDN in produzione (GDPR + performance).

---

## 9. Regole di qualità visiva

1. **Mai due accent nella stessa viewport**. Se il keycap è acceso, la CTA in viewport usa ink nero. Quando il keycap esce, la CTA può tornare accent.
2. **Mai più di 3 livelli di gerarchia tipografica visibili insieme**. Titolo + subtitle + body, basta.
3. **Spazio bianco > decorazione**. Se la sezione sembra vuota, probabilmente è giusta.
4. **Gradient solo warm**. Niente gradient grigio, niente gradient colore random. Solo il warm dell'accent.
5. **Niente shadow drop decorative**. Le shadow esistono solo dove c'è interazione (nav sticky, CTA hover, keycap 3D).
6. **Border `1px` o `2px`, mai 3+**. Border `--color-border` per divisori statici, `--color-ink` per divisori attivi.
7. **Immagini sempre `object-cover` + aspect-ratio fissa**. Mai layout shift da immagini.

---

## 10. Storybook (primitive da documentare)

Prima di toccare la home, avere in Storybook queste primitive con tutti gli stati:

- `LogoMark` (light, dark, small, large)
- `Nav` (inactive, scrolled, mobile-closed, mobile-open)
- `DisplayTitle` (xl, lg, md)
- `CTAButton` (default, hover, focus, disabled, loading)
- `Pill` (neutral, live)
- `CaseStudyCard` (collapsed, expanded, hover)
- `StepBlock` (inactive outline, active solid+accent)
- `KeycapScene` (idle, hover, mobile-fallback)
- `SectionTitle` (con e senza subtitle)
- `FeedCard`
- `Reveal` wrapper (dimostrazione con card generica)

Questo pacchetto di 11 primitive copre il 95% del sito.
