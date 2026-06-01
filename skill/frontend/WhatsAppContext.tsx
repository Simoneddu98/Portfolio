"use client";

import { createContext, useContext, useState } from "react";

export type ServiceType = "consulenza_ai" | "formazione" | "altro";
type Step = "choose" | "form";

interface WhatsAppModalState {
  isOpen: boolean;
  step: Step;
  selectedType: ServiceType | null;
}

interface WhatsAppModalContextValue extends WhatsAppModalState {
  openModal: () => void;
  closeModal: () => void;
  selectType: (type: ServiceType) => void;
  goBack: () => void;
}

const WhatsAppModalContext = createContext<WhatsAppModalContextValue | null>(null);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WhatsAppModalState>({
    isOpen: false,
    step: "choose",
    selectedType: null,
  });

  const openModal = () =>
    setState({ isOpen: true, step: "choose", selectedType: null });

  const closeModal = () =>
    setState({ isOpen: false, step: "choose", selectedType: null });

  const selectType = (type: ServiceType) =>
    setState((s) => ({ ...s, step: "form", selectedType: type }));

  const goBack = () =>
    setState((s) => ({ ...s, step: "choose", selectedType: null }));

  return (
    <WhatsAppModalContext.Provider
      value={{ ...state, openModal, closeModal, selectType, goBack }}
    >
      {children}
    </WhatsAppModalContext.Provider>
  );
}

export function useWhatsAppModal() {
  const ctx = useContext(WhatsAppModalContext);
  if (!ctx) throw new Error("useWhatsAppModal must be used inside WhatsAppProvider");
  return ctx;
}
