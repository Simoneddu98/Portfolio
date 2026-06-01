import type { LeadData } from "./parseLead";

export const initialLeadState: LeadData = {
    nome: "",
    email: "",
    messaggio: ""
};

export const initialChatState = {
    lead: initialLeadState,
    leadSubmitted: false
};