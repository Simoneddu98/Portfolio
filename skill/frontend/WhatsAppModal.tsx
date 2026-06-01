"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useWhatsAppModal, type ServiceType } from "./WhatsAppContext";

// ─── Zod schemas ──────────────────────────────────────────────
const baseFields = {
  nome: z.string().min(2, "min 2 caratteri").max(100),
  email: z.string().email("email non valida"),
};

const consulenzaSchema = z.object({
  ...baseFields,
  azienda: z.string().min(1, "campo obbligatorio").max(150),
  descrizione: z.string().min(10, "descrivi brevemente la tua esigenza").max(300),
});

const formazioneSchema = z.object({
  ...baseFields,
  team: z.enum(["individuale", "team_aziendale"], { message: "seleziona un'opzione" }),
  argomento: z.string().min(3, "campo obbligatorio").max(200),
});

const altroSchema = z.object({
  ...baseFields,
  tipo_progetto: z.string().min(3, "campo obbligatorio").max(150),
  budget: z.string().optional(),
});

type ConsulenzaFields = z.infer<typeof consulenzaSchema>;
type FormazioneFields = z.infer<typeof formazioneSchema>;
type AltroFields = z.infer<typeof altroSchema>;

// ─── Shared styles (mirror ContactModal) ──────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "0.75rem",
  padding: "0.875rem 1rem",
  color: "white",
  fontFamily: "var(--font-body)",
  fontSize: "1rem",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "0.8125rem",
  color: "rgba(255,255,255,0.55)",
  marginBottom: "0.375rem",
};

const errorStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.75rem",
  color: "#f87171",
  marginTop: "0.25rem",
};

const fieldWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
};

// ─── Step 1: service picker ────────────────────────────────────
const SERVICES: { type: ServiceType; emoji: string; label: string; desc: string }[] = [
  { type: "consulenza_ai", emoji: "🤖", label: "Consulenza AI", desc: "Strategia, implementazione, automazioni AI" },
  { type: "formazione", emoji: "📚", label: "Formazione", desc: "Corsi e workshop su AI per team o privati" },
  { type: "altro", emoji: "🛒", label: "Altro", desc: "E-commerce, sviluppo custom, altri progetti" },
];

function ServicePicker() {
  const { selectType } = useWhatsAppModal();
  return (
    <motion.div
      key="choose"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", marginBottom: "1.75rem" }}>
        Seleziona il tipo di richiesta e compila il mini-form.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {SERVICES.map(({ type, emoji, label, desc }) => (
          <motion.button
            key={type}
            onClick={() => selectType(type)}
            whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem 1.25rem",
              borderRadius: "var(--radius-md)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "background 0.15s",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{emoji}</span>
            <span>
              <span style={{ display: "block", fontFamily: "var(--font-body)", fontWeight: 600, color: "white", fontSize: "1rem" }}>
                {label}
              </span>
              <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", marginTop: "0.125rem" }}>
                {desc}
              </span>
            </span>
            <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: "1rem" }}>→</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Step 2: forms ─────────────────────────────────────────────
function ConsulenzaForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ConsulenzaFields>({ resolver: zodResolver(consulenzaSchema) });
  const [failed, setFailed] = useState(false);

  const onSubmit = async (data: ConsulenzaFields) => {
    setFailed(false);
    try {
      const res = await fetch("http://localhost:8000/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "consulenza_ai", ...data }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      setFailed(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={fieldWrap}>
        <div>
          <label style={labelStyle}>nome *</label>
          <input {...register("nome")} type="text" placeholder="Il tuo nome" style={inputStyle} autoFocus />
          {errors.nome && <p style={errorStyle}>{errors.nome.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>email *</label>
          <input {...register("email")} type="email" placeholder="tuaemail@esempio.it" style={inputStyle} />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>azienda / progetto *</label>
          <input {...register("azienda")} type="text" placeholder="Nome azienda o progetto" style={inputStyle} />
          {errors.azienda && <p style={errorStyle}>{errors.azienda.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>descrizione breve *</label>
          <textarea {...register("descrizione")} rows={3} placeholder="Qual è la tua esigenza AI?" style={{ ...inputStyle, resize: "vertical", minHeight: "90px" }} />
          {errors.descrizione && <p style={errorStyle}>{errors.descrizione.message}</p>}
        </div>
        {failed && <p style={{ ...errorStyle, fontSize: "0.875rem" }}>Errore di invio. Riprova o scrivimi direttamente.</p>}
        <SubmitButton isSubmitting={isSubmitting} color="#25D366" />
      </div>
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "formazione", ...data }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      setFailed(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={fieldWrap}>
        <div>
          <label style={labelStyle}>nome *</label>
          <input {...register("nome")} type="text" placeholder="Il tuo nome" style={inputStyle} autoFocus />
          {errors.nome && <p style={errorStyle}>{errors.nome.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>email *</label>
          <input {...register("email")} type="email" placeholder="tuaemail@esempio.it" style={inputStyle} />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>tipo di formazione *</label>
          <select {...register("team")} style={{ ...inputStyle, appearance: "none" }}>
            <option value="" style={{ background: "#1a1410" }}>seleziona…</option>
            <option value="individuale" style={{ background: "#1a1410" }}>Individuale</option>
            <option value="team_aziendale" style={{ background: "#1a1410" }}>Team Aziendale</option>
          </select>
          {errors.team && <p style={errorStyle}>{errors.team.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>argomento di interesse *</label>
          <input {...register("argomento")} type="text" placeholder="Es. AI per marketing, automazioni, LLM…" style={inputStyle} />
          {errors.argomento && <p style={errorStyle}>{errors.argomento.message}</p>}
        </div>
        {failed && <p style={{ ...errorStyle, fontSize: "0.875rem" }}>Errore di invio. Riprova o scrivimi direttamente.</p>}
        <SubmitButton isSubmitting={isSubmitting} color="#25D366" />
      </div>
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "altro", ...data }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      setFailed(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={fieldWrap}>
        <div>
          <label style={labelStyle}>nome *</label>
          <input {...register("nome")} type="text" placeholder="Il tuo nome" style={inputStyle} autoFocus />
          {errors.nome && <p style={errorStyle}>{errors.nome.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>email *</label>
          <input {...register("email")} type="email" placeholder="tuaemail@esempio.it" style={inputStyle} />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>tipo di progetto *</label>
          <input {...register("tipo_progetto")} type="text" placeholder="Es. e-commerce, sito vetrina, app custom…" style={inputStyle} />
          {errors.tipo_progetto && <p style={errorStyle}>{errors.tipo_progetto.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>budget indicativo</label>
          <select {...register("budget")} style={{ ...inputStyle, appearance: "none" }}>
            <option value="" style={{ background: "#1a1410" }}>non specificato</option>
            <option value="< 1.000€" style={{ background: "#1a1410" }}>{"< 1.000€"}</option>
            <option value="1.000€ – 5.000€" style={{ background: "#1a1410" }}>1.000€ – 5.000€</option>
            <option value="5.000€ – 15.000€" style={{ background: "#1a1410" }}>5.000€ – 15.000€</option>
            <option value="> 15.000€" style={{ background: "#1a1410" }}>{"> 15.000€"}</option>
          </select>
        </div>
        {failed && <p style={{ ...errorStyle, fontSize: "0.875rem" }}>Errore di invio. Riprova o scrivimi direttamente.</p>}
        <SubmitButton isSubmitting={isSubmitting} color="#25D366" />
      </div>
    </form>
  );
}

function SubmitButton({ isSubmitting, color }: { isSubmitting: boolean; color: string }) {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      style={{
        background: isSubmitting ? `${color}99` : color,
        color: "white",
        border: "none",
        borderRadius: "var(--radius-full)",
        padding: "0.875rem 2rem",
        fontFamily: "var(--font-body)",
        fontSize: "1rem",
        fontWeight: 600,
        cursor: isSubmitting ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {isSubmitting ? "invio in corso…" : "invia su WhatsApp ↗"}
    </motion.button>
  );
}

// ─── Success state ─────────────────────────────────────────────
function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: "center", padding: "2rem 0", fontFamily: "var(--font-body)" }}
    >
      <motion.p
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ fontSize: "3rem", marginBottom: "1rem" }}
      >
        ✓
      </motion.p>
      <p style={{ fontSize: "1.125rem", fontWeight: 600, color: "white" }}>Messaggio inviato!</p>
      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", marginTop: "0.5rem" }}>
        Ti rispondo su WhatsApp al più presto.
      </p>
      <button
        onClick={onClose}
        style={{
          marginTop: "1.5rem",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "var(--radius-full)",
          padding: "0.625rem 1.5rem",
          color: "white",
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        chiudi
      </button>
    </motion.div>
  );
}

// ─── Main modal ────────────────────────────────────────────────
const SERVICE_LABELS: Record<ServiceType, string> = {
  consulenza_ai: "🤖 Consulenza AI",
  formazione: "📚 Formazione",
  altro: "🛒 Altro",
};

export function WhatsAppModal() {
  const { isOpen, step, selectedType, closeModal, goBack } = useWhatsAppModal();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeModal]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setSuccess(false);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,8,6,0.75)",
            backdropFilter: "blur(8px)",
            padding: "1rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(145deg, #1a1410 0%, #120e0a 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1.5rem",
              padding: "2.5rem",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "90svh",
              overflowY: "auto",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              position: "relative",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <div>
                {step === "form" && !success && (
                  <button
                    onClick={goBack}
                    aria-label="Torna indietro"
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.45)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      padding: 0,
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    ← indietro
                  </button>
                )}
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}>
                  {success ? "Fatto!" : step === "choose" ? "Come posso aiutarti?" : selectedType ? SERVICE_LABELS[selectedType] : ""}
                </h2>
              </div>
              <button
                onClick={closeModal}
                aria-label="Chiudi"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  borderRadius: "50%",
                  width: "2rem",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  flexShrink: 0,
                  marginLeft: "0.75rem",
                }}
              >
                ✕
              </button>
            </div>

            {/* Body — animated step transitions */}
            <AnimatePresence mode="wait">
              {success ? (
                <SuccessState key="success" onClose={closeModal} />
              ) : step === "choose" ? (
                <ServicePicker key="choose" />
              ) : (
                <motion.div
                  key={`form-${selectedType}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  style={{ marginTop: "1.5rem" }}
                >
                  {selectedType === "consulenza_ai" && <ConsulenzaForm onSuccess={() => setSuccess(true)} />}
                  {selectedType === "formazione" && <FormazioneForm onSuccess={() => setSuccess(true)} />}
                  {selectedType === "altro" && <AltroForm onSuccess={() => setSuccess(true)} />}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
