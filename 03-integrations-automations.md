# 03 — Integrazioni, Connessioni, Automazioni

Tutto quello che il sito "chiama fuori" — API esterne, CMS, analytics, email, automazioni — e le regole per farlo senza rompere performance e privacy.

---

## Principi

1. **Nessuna integrazione blocca il first paint**. Se non c'è connessione, il sito funziona comunque.
2. **Tutto quello che parte dal browser diventa facoltativo.** Gli script di terze parti vanno in PartyTown (web worker).
3. **Privacy-first**. Nessun tracker Meta/Google senza consenso esplicito. Analytics anonima di default.
4. **Zero segreti nel bundle**. Ogni API key vive solo server-side (Route Handlers Next.js o Edge Functions).
5. **Fallback visibile**. Se un'integrazione si rompe, il sito mostra contenuto statico di backup, non un errore all'utente.

---

## 1. Form Contatti

### Scopo
Il pulsante "scrivimi a hello@simonesanna.it" della sezione contatti va trattato in 2 modi:

- **Versione semplice (MVP)**: è un `mailto:` che apre il client email. Zero backend.
- **Versione avanzata (v2)**: il pulsante apre un modal con un form minimale (nome, email, oggetto, messaggio), post → Route Handler Next.js → invio via Resend.

MVP in release 1, v2 dopo i primi feedback reali.

### Stack v2

```
Form UI        → React Hook Form + Zod (validazione)
Endpoint       → app/api/contact/route.ts (Edge runtime)
Anti-spam      → honeypot field + Turnstile (Cloudflare, senza cookie)
Email delivery → Resend (dominio custom simonesanna.it verificato)
Log            → Supabase table `contact_submissions` (backup + analytics)
Notifica       → Resend → inbox Simone; webhook Slack/Telegram opzionale
Confirmazione  → Email automatica all'utente via Resend
```

### Schema tabella Supabase
```sql
create table contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  source      text default 'website',
  ip_hash     text,
  user_agent  text
);
```

Nessun IP in chiaro, solo hash SHA-256 + salt per deduplica, retention 90 giorni.

### Anti-spam
- Honeypot `<input type="text" name="website" tabindex="-1" style="display:none" />`: se è compilato, il form viene droppato silenziosamente.
- Cloudflare Turnstile invisible widget: zero cookie, zero UX tax.
- Rate limit 3 submit / 10 minuti / IP via Upstash Redis.

---

## 2. Feed LinkedIn

### Scopo
Nella sezione "pensiero" mostriamo gli ultimi 3 post di LinkedIn di Simone, auto-aggiornati.

### Sfida
L'API ufficiale LinkedIn per profili personali è limitata e richiede OAuth user-side. Non abbiamo webhook pubblici per i post.

### Soluzione ibrida (pragmatica)

**Strategy A — Notion come fonte di verità** (raccomandato)
Ogni volta che Simone pubblica su LinkedIn, salva anche una copia riassuntiva in un database Notion (già fa questo tramite le skill LinkedIn esistenti). Il sito pulls da Notion:

```
[Notion DB "LinkedIn Posts"] ─ API Notion ─→ [Next.js ISR, revalidate 3600s]
```

Schema DB Notion minimo:
| Property | Tipo |
|----------|------|
| Title | Title |
| PublishedAt | Date |
| Hook | Text (2 righe) |
| LinkedInUrl | URL |
| Tags | Multi-select |
| Published | Checkbox |

Il sito fetcha solo `Published = true`, ordine `PublishedAt desc`, limit 3. ISR con revalidate di 1 ora: basta perché i post sono di Simone e lui controlla quando pubblicarli.

**Strategy B — Scraping via Apify** (fallback)
Se il DB Notion non è pronto, usiamo l'actor `curious_coder/linkedin-profile-scraper` di Apify con run schedulato ogni 24h → Supabase → sito pulls da Supabase.

Cost-saving: Apify solo 1 run/giorno, cached aggressivamente.

### Componente

```tsx
// app/page.tsx (o Section)
import { getLatestPosts } from '@/lib/notion';

export const revalidate = 3600;

export default async function Home() {
  const posts = await getLatestPosts(3);
  return <FeedSection posts={posts} />;
}
```

### Errore gestito
Se Notion è down o il fetch fallisce: mostriamo 3 post hardcoded come fallback, con un piccolo indicatore "aggiornato manualmente". Mai errore 500 lato utente.

---

## 3. Newsletter

### Stack
**Kit (ex ConvertKit)** o **Buttondown**, a scelta di Simone. Entrambi:
- Form embed semplice (un input email + bottone)
- Double opt-in GDPR compliant
- API per iscrizione diretta (più elegante dell'embed)

### Form inline
Un solo campo email nella sezione contatti. Submit → Route Handler → API provider. Zero redirect. Conferma inline con microanimazione (vedi `04`).

```ts
// app/api/newsletter/route.ts
export async function POST(req: Request) {
  const { email } = await req.json();
  // valida, chiama API Kit, log su Supabase, ritorna ok
}
```

Privacy: il sito dichiara esplicitamente "un'email al mese, zero spam, disiscrizione con un click" sotto il form.

---

## 4. Analytics

### Stack scelto
**Plausible Analytics** (self-hosted via Plausible Cloud EU) — zero cookie, GDPR compliant senza banner.

**Motivo**: per il volume di un sito personale le alternative Meta/Google sono sproporzionate e introducono cookie banner pesanti.

### Eventi custom
- `nav_click` con prop `section`
- `cta_email_click` (pulsante contatti)
- `case_study_expand` con prop `case_id`
- `feed_click` con prop `post_slug`
- `keycap_interact` (se desktop + l'utente muove il mouse sul keycap > 2s)
- `reduced_motion_user` (flag anonimo per capire quanti visitatori hanno reduced-motion attivo)
- `scroll_depth` su 25/50/75/100

### Loading
Plausible script caricato via PartyTown per non pesare sul main thread:

```tsx
// app/layout.tsx
<Script
  strategy="worker"
  data-domain="simonesanna.it"
  src="https://plausible.io/js/script.tagged-events.outbound-links.js"
/>
```

Partytown richiede setup in `next.config.js` (vedi docs Vercel).

### Dashboard
Simone accede via Plausible web. Bookmark della dashboard pubblica o privata in funzione della preferenza.

---

## 5. CMS — Gestione contenuti

### Setup: Hybrid
- **Contenuti "core"** (sezioni Hero, Intro, Metodo, Servizi, Footer) → file `.mdx` in repo. Simone può editarli via GitHub web (un commit = deploy).
- **Contenuti "vivi"** (Works case studies, Feed LinkedIn, Disponibilità date) → Notion come CMS.

### Perché non un CMS unico
Il sito ha 90% contenuto stabile. Mettere tutto in Notion aggiungerebbe dipendenza per ogni modifica minore. I `.mdx` in repo sono veloci, versionati, e Simone può modificarli come qualsiasi file testo.

### Notion: cosa vive lì
| DB Notion | Cosa | Endpoint sito |
|-----------|------|---------------|
| `Case Studies` | I casi reali | `/` (sezione works) |
| `LinkedIn Posts` | Post recenti | `/` (sezione pensiero) |
| `Availability` | Slot disponibili per consulenze | badge pill hero se attivo |
| `Testimonials` | Testimonianze anonimizzate (opzionale) | `/` se Simone vuole aggiungere |

### API Notion
Uso libreria `@notionhq/client`. Cache con Next.js ISR (`revalidate` per pagina). Fallback statico per tutti i fetch.

---

## 6. Calendar / Booking

### Scopo
Se Simone vuole offrire slot di consulenza prenotabili direttamente dal sito.

### Opzioni

**Opzione A — Cal.com (open source)**
- Self-host o cloud
- Embed widget o popup
- Sync Google Calendar / Apple Calendar
- Libero per single-user

Integrazione: link nel CTA contatti "prenota una chiamata" che apre popup Cal.com con overlay sfondo warm.

**Opzione B — Google Calendar Appointment Slots**
- Nativo Google
- Meno personalizzabile

Scelta consigliata: Cal.com. Setup una tantum, full control.

### Implementazione
```tsx
import Cal, { getCalApi } from "@calcom/embed-react";

useEffect(() => {
  (async () => {
    const cal = await getCalApi();
    cal("ui", { styles: { branding: { brandColor: "#E85D26" } } });
  })();
}, []);

<Cal calLink="simonesanna/consulenza-30min" style={{ width: '100%' }} />
```

---

## 7. Automazioni (Zapier / Make / n8n)

### Obiettivo
Evitare copia-incolla manuale tra i tool di Simone.

### Flussi consigliati

**Flow 1 — Submit form contatti**
```
Form site → Resend (email to Simone)
          → Supabase (backup)
          → n8n webhook → Notion DB "Leads"
                        → Telegram bot Simone (notifica)
```

**Flow 2 — Nuovo post LinkedIn → Sito aggiornato**
```
Simone pubblica su LinkedIn → scrive post archive in Notion (via skill linkedin-post-generator)
→ trigger sul DB Notion → n8n chiama revalidate endpoint Next.js
→ sito ricarica ISR per la sezione feed
```

Endpoint revalidate:
```ts
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { secret, tag } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) return new Response('nope', { status: 401 });
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}
```

**Flow 3 — Slot Cal.com prenotato**
```
Cal.com webhook → n8n → Notion (nuova riga in "Consulenze")
                     → Email preparatoria automatica all'utente (Resend)
                     → Reminder 24h prima (Resend)
```

**Flow 4 — Mensile: check link rotti**
```
Cron (Vercel scheduled function) 1 volta al mese
→ scan di tutti i link esterni del sito
→ se qualcuno 404 → email a Simone con elenco
```

### Tool di orchestrazione
**n8n self-hosted** (su Railway o Hetzner) è la scelta raccomandata: open source, unlimited workflow, zero per-task cost. Alternative: Zapier/Make per partire veloce (ma paghi per esecuzione).

---

## 8. Monitoring & Alerting

### Uptime
**Better Stack** (ex Better Uptime) free tier: 10 monitor, email+Telegram notification. Check ogni 3 minuti su:
- Homepage
- Endpoint `/api/contact` (health ping)
- Endpoint `/api/newsletter`

### Errors
**Sentry** free tier (5k events/mese bastano):
- Client-side errors (ChunkLoadError, hydration mismatch)
- Server-side errors (Route Handler failures)

Sentry deve essere **caricato via PartyTown** per non pesare sul bundle.

### Performance budgets
GitHub Actions + Lighthouse CI, break build se:
- LCP mobile > 2.5s
- Performance score < 90
- Accessibility < 95
- CLS > 0.1

---

## 9. Sitemap & robots

### Sitemap dinamica
```ts
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getLatestPosts(100);
  return [
    { url: 'https://simonesanna.it', lastModified: new Date(), priority: 1 },
    { url: 'https://simonesanna.it/colophon', lastModified: new Date(), priority: 0.3 },
    ...posts.map(p => ({
      url: p.linkedInUrl,
      lastModified: p.publishedAt
    }))
  ];
}
```

### robots.txt
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://simonesanna.it/sitemap.xml
```

AI crawler policy: permetti a GPTBot, ClaudeBot, CCBot (scelta esplicita di Simone; se preferisce opt-out, aggiungere le direttive).

---

## 10. Dominio & DNS

**Dominio**: `simonesanna.it`

Setup suggerito:
```
A       @        76.76.21.21     (Vercel)
CNAME   www      cname.vercel-dns.com
TXT     @        resend-verify=<...>
MX      @        (forward → Simone mailbox)
```

SSL: automatico via Vercel.
Email: usa ForwardEmail.net per aliasare `hello@simonesanna.it` → inbox principale di Simone. Zero hosting email, zero manutenzione.

---

## 11. Environment variables

```
# .env.local (dev) / Vercel project settings (prod)
NOTION_TOKEN=secret_...
NOTION_DB_POSTS=...
NOTION_DB_CASES=...
RESEND_API_KEY=re_...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ... # server only
TURNSTILE_SECRET=0x...
TURNSTILE_SITE_KEY=0x...    # client
PLAUSIBLE_DOMAIN=simonesanna.it
REVALIDATE_SECRET=<random-32-char>
CAL_COM_USER=simonesanna
```

Tutte le secret che iniziano con `NEXT_PUBLIC_*` sono esposte al bundle. Massima attenzione.

---

## 12. Checklist pre-launch integrazioni

- [ ] Dominio verificato Resend (SPF, DKIM, DMARC)
- [ ] Turnstile widget testato su form
- [ ] Supabase RLS policy attiva su ogni tabella
- [ ] Notion integrations hanno accesso solo ai DB necessari
- [ ] Plausible dashboard accessibile
- [ ] Sentry source maps caricati (per lettura stack trace)
- [ ] Cron di revalidate configurato in Vercel
- [ ] Rate limit attivi su endpoint `/api/contact`
- [ ] Fallback statico presente per feed LinkedIn
- [ ] `mailto:` testato anche senza JS (progressive enhancement)
- [ ] n8n workflows testati con webhook dummy
- [ ] Lighthouse CI green su ogni PR
- [ ] robots.txt e sitemap accessibili pubblicamente
