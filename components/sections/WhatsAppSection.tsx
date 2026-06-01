"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────
type ServiceType = "consulenza_ai" | "formazione" | "altro";

const SERVICES: {
  type: ServiceType;
  emoji: string;
  label: string;
  desc: string;
}[] = [
  { type: "consulenza_ai", emoji: "🤖", label: "Consulenza AI", desc: "Strategia, automazioni e implementazione AI" },
  { type: "formazione",    emoji: "📚", label: "Formazione",    desc: "Workshop e percorsi per team e privati" },
  { type: "altro",         emoji: "🛒", label: "Altro",         desc: "E-commerce, sviluppo custom, altri progetti" },
];

// ─── Zod schemas ───────────────────────────────────────────────
const base = { nome: z.string().min(2), email: z.string().email("email non valida") };

const consulenzaSchema = z.object({ ...base, azienda: z.string().min(1), descrizione: z.string().min(10).max(300) });
const formazioneSchema  = z.object({ ...base, team: z.enum(["individuale","team_aziendale"]), argomento: z.string().min(3) });
const altroSchema       = z.object({ ...base, tipo_progetto: z.string().min(3), budget: z.string().optional() });

type ConsulenzaFields = z.infer<typeof consulenzaSchema>;
type FormazioneFields = z.infer<typeof formazioneSchema>;
type AltroFields      = z.infer<typeof altroSchema>;

// ─── Shared field styles ───────────────────────────────────────
const field: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "0.75rem",
  padding: "0.875rem 1rem",
  color: "white",
  fontFamily: "var(--font-body)",
  fontSize: "1rem",
  outline: "none",
};
const lbl: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-body)",
  fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.375rem",
};
const err: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "0.75rem",
  color: "#f87171", marginTop: "0.25rem",
};

// ─── Sub-forms ─────────────────────────────────────────────────
function ConsulenzaForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ConsulenzaFields>({ resolver: zodResolver(consulenzaSchema) });
  const [failed, setFailed] = useState(false);

  const onSubmit = async (data: ConsulenzaFields) => {
    setFailed(false);
    try {
      const res = await fetch("http://localhost:8000/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "consulenza_ai", ...data }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch { setFailed(true); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={lbl}>nome *</label>
          <input {...register("nome")} placeholder="Il tuo nome" style={field} autoFocus />
          {errors.nome && <p style={err}>{errors.nome.message}</p>}
        </div>
        <div>
          <label style={lbl}>email *</label>
          <input {...register("email")} type="email" placeholder="email@esempio.it" style={field} />
          {errors.email && <p style={err}>{errors.email.message}</p>}
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={lbl}>azienda / progetto *</label>
          <input {...register("azienda")} placeholder="Nome azienda o progetto" style={field} />
          {errors.azienda && <p style={err}>{errors.azienda.message}</p>}
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={lbl}>descrivi brevemente la tua esigenza *</label>
          <textarea {...register("descrizione")} rows={3} placeholder="Cosa vorresti realizzare?" style={{ ...field, resize: "vertical", minHeight: "90px" }} />
          {errors.descrizione && <p style={err}>{errors.descrizione.message}</p>}
        </div>
      </div>
      {failed && <p style={{ ...err, fontSize: "0.875rem", marginTop: "0.75rem" }}>Errore di invio. Riprova.</p>}
      <SendButton isSubmitting={isSubmitting} />
    </form>
  );
}

function FormazioneForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormazioneFields>({ resolver: zodResolver(formazioneSchema) });
  const [failed, setFailed] = useState(false);

  const onSubmit = async (data: FormazioneFields) => {
    setFailed(false);
    try {
      const res = await fetch("http://localhost:8000/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "formazione", ...data }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch { setFailed(true); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={lbl}>nome *</label>
          <input {...register("nome")} placeholder="Il tuo nome" style={field} autoFocus />
          {errors.nome && <p style={err}>{errors.nome.message}</p>}
        </div>
        <div>
          <label style={lbl}>email *</label>
          <input {...register("email")} type="email" placeholder="email@esempio.it" style={field} />
          {errors.email && <p style={err}>{errors.email.message}</p>}
        </div>
        <div>
          <label style={lbl}>tipo di formazione *</label>
          <select {...register("team")} style={{ ...field, appearance: "none" }}>
            <option value="" style={{ background: "#1a1410" }}>seleziona…</option>
            <option value="individuale" style={{ background: "#1a1410" }}>Individuale</option>
            <option value="team_aziendale" style={{ background: "#1a1410" }}>Team Aziendale</option>
          </select>
          {errors.team && <p style={err}>{errors.team.message}</p>}
        </div>
        <div>
          <label style={lbl}>argomento di interesse *</label>
          <input {...register("argomento")} placeholder="Es. AI per marketing, LLM…" style={field} />
          {errors.argomento && <p style={err}>{errors.argomento.message}</p>}
        </div>
      </div>
      {failed && <p style={{ ...err, fontSize: "0.875rem", marginTop: "0.75rem" }}>Errore di invio. Riprova.</p>}
      <SendButton isSubmitting={isSubmitting} />
    </form>
  );
}

function AltroForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AltroFields>({ resolver: zodResolver(altroSchema) });
  const [failed, setFailed] = useState(false);

  const onSubmit = async (data: AltroFields) => {
    setFailed(false);
    try {
      const res = await fetch("http://localhost:8000/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "altro", ...data }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch { setFailed(true); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={lbl}>nome *</label>
          <input {...register("nome")} placeholder="Il tuo nome" style={field} autoFocus />
          {errors.nome && <p style={err}>{errors.nome.message}</p>}
        </div>
        <div>
          <label style={lbl}>email *</label>
          <input {...register("email")} type="email" placeholder="email@esempio.it" style={field} />
          {errors.email && <p style={err}>{errors.email.message}</p>}
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={lbl}>tipo di progetto *</label>
          <input {...register("tipo_progetto")} placeholder="Es. e-commerce, sito vetrina, app custom…" style={field} />
          {errors.tipo_progetto && <p style={err}>{errors.tipo_progetto.message}</p>}
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={lbl}>budget indicativo</label>
          <select {...register("budget")} style={{ ...field, appearance: "none" }}>
            <option value="" style={{ background: "#1a1410" }}>non specificato</option>
            <option value="< 1.000€" style={{ background: "#1a1410" }}>{"< 1.000€"}</option>
            <option value="1.000€ – 5.000€" style={{ background: "#1a1410" }}>1.000€ – 5.000€</option>
            <option value="5.000€ – 15.000€" style={{ background: "#1a1410" }}>5.000€ – 15.000€</option>
            <option value="> 15.000€" style={{ background: "#1a1410" }}>{"> 15.000€"}</option>
          </select>
        </div>
      </div>
      {failed && <p style={{ ...err, fontSize: "0.875rem", marginTop: "0.75rem" }}>Errore di invio. Riprova.</p>}
      <SendButton isSubmitting={isSubmitting} />
    </form>
  );
}

function SendButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      style={{
        marginTop: "1.25rem",
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        padding: "0.875rem 2rem",
        borderRadius: "var(--radius-full)",
        background: isSubmitting ? "rgba(37,211,102,0.6)" : "#25D366",
        color: "white", border: "none",
        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem",
        cursor: isSubmitting ? "not-allowed" : "pointer",
        transition: "background 0.2s",
      }}
    >
      <WhatsAppIcon size={18} />
      {isSubmitting ? "invio in corso…" : "invia su WhatsApp ↗"}
    </motion.button>
  );
}

// ─── Main section ──────────────────────────────────────────────
export function WhatsAppSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const shouldReduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<ServiceType | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSelect = (type: ServiceType) => {
    setSelected(prev => prev === type ? null : type);
    setSuccess(false);
  };

  return (
    <section
      id="whatsapp"
      aria-labelledby="whatsapp-title"
      style={{
        background: "linear-gradient(160deg, #1a1410 0%, #0e0b08 100%)",
        paddingTop: "var(--section-pt)",
        paddingBottom: "var(--section-pb)",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
      }}
    >
      <div className="max-w-[1440px] mx-auto w-full" ref={ref}>

        {/* Heading */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "#25D366" }}>
              <WhatsAppIcon size={16} />
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600, color: "#25D366", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Contattami su WhatsApp
            </span>
          </div>
          <h2
            id="whatsapp-title"
            className="font-bold lowercase tracking-[-0.04em] leading-[0.92] text-white"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7vw, 8rem)", marginBottom: "1rem" }}
          >
            come posso<br />aiutarti?
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 1.2vw, 1.25rem)", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.6, marginBottom: "3rem" }}>
            Scegli il tipo di progetto, compila il mini-form e ricevi una risposta diretta su WhatsApp entro poche ore.
          </p>
        </motion.div>

        {/* Service cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="lg:grid-cols-3 grid-cols-1">
          {SERVICES.map(({ type, emoji, label, desc }, i) => {
            const isActive = selected === type;
            return (
              <motion.button
                key={type}
                onClick={() => handleSelect(type)}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "1.5rem",
                  borderRadius: "var(--radius-lg)",
                  background: isActive ? "rgba(37,211,102,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${isActive ? "#25D366" : "rgba(255,255,255,0.1)"}`,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
              >
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem" }}>{emoji}</span>
                <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, color: isActive ? "#25D366" : "white", fontSize: "1.25rem", marginBottom: "0.375rem" }}>
                  {label}
                </span>
                <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                  {desc}
                </span>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: "block", marginTop: "0.75rem", fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#25D366", fontWeight: 600 }}
                  >
                    ✓ selezionato — compila il form sotto
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Inline form — expands below selected card */}
        <AnimatePresence mode="wait">
          {selected && !success && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "2rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "var(--radius-lg)",
                  padding: "2rem",
                }}
              >
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {SERVICES.find(s => s.type === selected)?.emoji}{" "}
                  {SERVICES.find(s => s.type === selected)?.label}
                </p>
                {selected === "consulenza_ai" && <ConsulenzaForm onSuccess={() => setSuccess(true)} />}
                {selected === "formazione"    && <FormazioneForm onSuccess={() => setSuccess(true)} />}
                {selected === "altro"         && <AltroForm      onSuccess={() => setSuccess(true)} />}
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginTop: "2rem", padding: "2.5rem", borderRadius: "var(--radius-lg)", background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.3)", textAlign: "center" }}
            >
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}
              >
                ✓
              </motion.p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>Messaggio inviato!</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)" }}>Ti rispondo su WhatsApp al più presto.</p>
              <button
                onClick={() => { setSuccess(false); setSelected(null); }}
                style={{ marginTop: "1.5rem", background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "var(--radius-full)", padding: "0.5rem 1.5rem", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)", fontSize: "0.9rem", cursor: "pointer" }}
              >
                invia un'altra richiesta
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
