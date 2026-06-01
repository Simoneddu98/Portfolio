"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { isLeadReady, type LeadData } from "@/chatbot/parseLead";
import { submitLead } from "@/chatbot/submitLead";
import { initialLeadState } from "@/chatbot/chatState";

type Message = {
  id: number;
  text: string;
  sender: "bot" | "user";
};

type Step = "nome" | "email" | "messaggio" | "done";

const INITIAL_MESSAGE: Message = {
  id: 0,
  text: "Ciao! Sono BOTman 🦇 — l'assistente di Simone. Come ti chiami?",
  sender: "bot",
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
};

function BatIcon({ size = 28, color = "#E85D26" }: { size?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 100 55"
      fill={color}
      width={size}
      height={size * 0.6}
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <path d="M50 10 L43 0 L38 10 Q28 6 18 18 Q8 14 0 22 Q12 20 20 28 Q8 34 10 44 Q20 40 26 46 L35 40 Q40 48 46 44 L50 48 L54 44 Q60 48 65 40 L74 46 Q80 40 90 44 Q92 34 80 28 Q88 20 100 22 Q92 14 82 18 Q72 6 62 10 L57 0 Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon({ color = "white" }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" width="18" height="18" aria-hidden="true">
      <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BotmanWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [lead, setLead] = useState<LeadData>(initialLeadState);
  const [step, setStep] = useState<Step>("nome");
  const [isTyping, setIsTyping] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [peek, setPeek] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgIdRef = useRef(1);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // "Peek": il tooltip compare da solo poco dopo il caricamento per invitare al
  // click, poi si ritira. All'hover ricompare comunque. Funziona anche su touch.
  useEffect(() => {
    const show = setTimeout(() => setPeek(true), 1400);
    const hide = setTimeout(() => setPeek(false), 6000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  function addMessage(text: string, sender: "bot" | "user") {
    setMessages((prev) => [...prev, { id: msgIdRef.current++, text, sender }]);
  }

  async function botReply(text: string) {
    setIsTyping(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 650));
    setIsTyping(false);
    addMessage(text, "bot");
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || step === "done" || isTyping) return;

    addMessage(trimmed, "user");
    setInput("");

    if (step === "nome") {
      const updatedLead = { ...lead, nome: trimmed };
      setLead(updatedLead);
      setStep("email");
      await botReply(`Ciao ${trimmed}! Qual è la tua email?`);
    } else if (step === "email") {
      if (!trimmed.includes("@") || !trimmed.includes(".")) {
        await botReply("Mmh, quell'email non sembra valida. Riprova con una email corretta.");
        return;
      }
      const updatedLead = { ...lead, email: trimmed };
      setLead(updatedLead);
      setStep("messaggio");
      await botReply("Perfetto. Di cosa hai bisogno? Descrivimi pure la tua richiesta.");
    } else if (step === "messaggio") {
      const updatedLead = { ...lead, messaggio: trimmed };
      setLead(updatedLead);
      setStep("done");
      if (isLeadReady(updatedLead)) {
        try {
          await submitLead(updatedLead);
          await botReply("Ricevuto! Simone ti risponderà entro 48 ore. A presto 🦇");
        } catch {
          await botReply("Ops, c'è stato un problema nell'invio. Scrivi direttamente a Simone via email o WhatsApp.");
        }
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const isDone = step === "done";

  // Tooltip visibile all'hover o durante il peek, ma mai a chat aperta.
  const showTooltip = (hovered || peek) && !isOpen;

  const inputPlaceholder =
    isDone
      ? "Conversazione conclusa"
      : step === "nome"
      ? "Il tuo nome..."
      : step === "email"
      ? "La tua email..."
      : "La tua richiesta...";

  const sendDisabled = !input.trim() || isDone || isTyping;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 12,
      }}
    >
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              width: 360,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)",
              background: "#F8F6F2",
              transformOrigin: "bottom right",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "#0F0F0F",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#1A1A1A",
                  border: "2px solid #E85D26",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BatIcon size={22} color="#E85D26" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: "#F8F6F2",
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: "-0.01em",
                  }}
                >
                  BOTman
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#22c55e",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: "#777",
                      fontSize: 11,
                      fontFamily: "var(--font-dm-sans, sans-serif)",
                    }}
                  >
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Chiudi chat"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                  padding: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  flexShrink: 0,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F8F6F2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                <XIcon />
              </button>
            </div>

            {/* Messages area */}
            <div
              style={{
                height: 300,
                overflowY: "auto",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#F8F6F2",
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      display: "flex",
                      justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "9px 14px",
                        borderRadius:
                          msg.sender === "user"
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                        background: msg.sender === "user" ? "#E85D26" : "#EDE8DF",
                        color: msg.sender === "user" ? "#fff" : "#0F0F0F",
                        fontSize: 14,
                        lineHeight: 1.55,
                        fontFamily: "var(--font-dm-sans, sans-serif)",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: "18px 18px 18px 4px",
                        background: "#EDE8DF",
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                      }}
                    >
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay, ease: "easeInOut" }}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#999",
                            display: "inline-block",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div
              style={{
                padding: "12px 14px",
                background: "#fff",
                borderTop: "1px solid #E0DDD8",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isDone}
                placeholder={inputPlaceholder}
                aria-label="Scrivi un messaggio"
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 9999,
                  border: "1.5px solid #E0DDD8",
                  background: isDone ? "#F8F6F2" : "#fff",
                  fontSize: 14,
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                  outline: "none",
                  color: "#0F0F0F",
                  opacity: isDone ? 0.55 : 1,
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => { if (!isDone) e.target.style.borderColor = "#E85D26"; }}
                onBlur={(e) => { e.target.style.borderColor = "#E0DDD8"; }}
              />
              <button
                onClick={handleSend}
                disabled={sendDisabled}
                aria-label="Invia messaggio"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: sendDisabled ? "#E0DDD8" : "#E85D26",
                  border: "none",
                  cursor: sendDisabled ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s, transform 0.1s",
                }}
                onMouseEnter={(e) => { if (!sendDisabled) e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                onMouseDown={(e) => { if (!sendDisabled) e.currentTarget.style.transform = "scale(0.94)"; }}
                onMouseUp={(e) => { if (!sendDisabled) e.currentTarget.style.transform = "scale(1.08)"; }}
              >
                <SendIcon />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Chiudi BOTman" : "Apri BOTman"}
        title="BOTman"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#0F0F0F",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isOpen
            ? "0 0 0 2px #E85D26, 0 8px 28px rgba(232,93,38,0.45)"
            : "0 4px 20px rgba(0,0,0,0.38)",
          transition: "box-shadow 0.3s",
          position: "relative",
        }}
      >
        {/* Tooltip "parla con BOTman!" — invito al click */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              key="botman-tooltip"
              initial={{ opacity: 0, x: 6, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 6, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              aria-hidden="true"
              style={{
                position: "absolute",
                right: "calc(100% + 14px)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#0F0F0F",
                color: "#F8F6F2",
                padding: "9px 14px",
                borderRadius: 12,
                whiteSpace: "nowrap",
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: "var(--font-dm-sans, sans-serif)",
                letterSpacing: "-0.01em",
                boxShadow: "0 8px 28px rgba(0,0,0,0.32)",
                pointerEvents: "none",
              }}
            >
              parla con{" "}
              <span style={{ color: "#E85D26", fontWeight: 700 }}>BOTman</span>!
              {/* Freccia verso il bottone */}
              <span
                style={{
                  position: "absolute",
                  right: -4,
                  top: "50%",
                  width: 10,
                  height: 10,
                  transform: "translateY(-50%) rotate(45deg)",
                  background: "#0F0F0F",
                  borderRadius: 2,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orange glow */}
        <motion.span
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            background: "#E85D26",
            filter: "blur(18px)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              style={{ color: "#F8F6F2", display: "flex" }}
            >
              <XIcon />
            </motion.span>
          ) : (
            <motion.span
              key="bat"
              initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <BatIcon size={30} color="#E85D26" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
