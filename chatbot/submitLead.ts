export async function submitLead(lead: { nome: string; email: string; messaggio: string }) {
    const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
    });

    if (!response.ok) {
        throw new Error("Errore durante l'invio del lead");
    }
}