"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ModalState {
  isOpen: boolean;
  subject?: string;
}

interface ContactModalContextValue {
  state: ModalState;
  openModal: (opts?: { subject?: string }) => void;
  closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({ isOpen: false });

  const openModal = useCallback((opts?: { subject?: string }) => {
    setState({ isOpen: true, subject: opts?.subject });
  }, []);

  const closeModal = useCallback(() => {
    setState({ isOpen: false });
  }, []);

  return (
    <ContactModalContext.Provider value={{ state, openModal, closeModal }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used inside ContactModalProvider");
  return ctx;
}
