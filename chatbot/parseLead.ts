export type LeadData = {
    nome: string;
    email: string;
    messaggio: string;
};

export function isLeadReady(lead: LeadData) {
    return (
        lead.nome.trim() !== "" &&
        lead.email.trim() !== "" &&
        lead.messaggio.trim() !== ""
    );
}

export function getMissingField(lead: LeadData) {
    if (!lead.nome.trim()) return "nome";
    if (!lead.email.trim()) return "email";
    if (!lead.messaggio.trim()) return "messaggio";
    return null;
}