"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { contactSchema, type ContactPayload } from "@/lib/contact-schema";
import { useContactModal } from "./ContactModalContext";

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

export function ContactModal() {
  const { state, closeModal } = useContactModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues: { _honeypot: "" },
  });

  // pre-fill subject when modal opens
  useEffect(() => {
    if (state.isOpen) {
      setValue("subject", state.subject ?? "");
    } else {
      reset();
    }
  }, [state.isOpen, state.subject, setValue, reset]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeModal]);

  // prevent body scroll
  useEffect(() => {
    if (state.isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [state.isOpen]);

  const onSubmit = async (data: ContactPayload) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("send failed");
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
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
              maxWidth: "520px",
              maxHeight: "90svh",
              overflowY: "auto",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              position: "relative",
            }}
          >
            {/* close button */}
            <button
              onClick={closeModal}
              aria-label="Chiudi"
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
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
                lineHeight: 1,
                transition: "background 0.15s",
              }}
            >
              ✕
            </button>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.03em",
                marginBottom: "0.5rem",
              }}
            >
              scrivimi
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "2rem",
              }}
            >
              Rispondo entro 48 ore.
            </p>

            {isSubmitSuccessful ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem 0",
                  fontFamily: "var(--font-body)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</p>
                <p style={{ fontSize: "1.125rem", fontWeight: 500, color: "white" }}>
                  Messaggio inviato!
                </p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Ti ho mandato anche una conferma via email.
                </p>
                <button
                  onClick={closeModal}
                  style={{
                    marginTop: "1.5rem",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "2rem",
                    padding: "0.625rem 1.5rem",
                    color: "white",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  chiudi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* honeypot */}
                <input
                  {...register("_honeypot")}
                  type="text"
                  tabIndex={-1}
                  aria-hidden
                  style={{ display: "none" }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label style={labelStyle}>nome *</label>
                    <input
                      {...register("name")}
                      type="text"
                      autoComplete="name"
                      autoFocus
                      placeholder="Il tuo nome"
                      style={inputStyle}
                    />
                    {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
                  </div>

                  <div>
                    <label style={labelStyle}>email *</label>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="tuaemail@esempio.it"
                      style={inputStyle}
                    />
                    {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
                  </div>

                  <div>
                    <label style={labelStyle}>oggetto</label>
                    <input
                      {...register("subject")}
                      type="text"
                      placeholder="Di cosa vuoi parlare?"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>messaggio *</label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Raccontami il contesto: più dettagli mi dai, meglio posso risponderti."
                      style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                    />
                    {errors.message && <p style={errorStyle}>{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: isSubmitting ? "rgba(232,93,38,0.6)" : "#E85D26",
                      color: "white",
                      border: "none",
                      borderRadius: "2rem",
                      padding: "0.875rem 2rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {isSubmitting ? "invio in corso…" : "invia messaggio ↗"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
