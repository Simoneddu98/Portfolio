import { z } from "zod";

export const contactSchema = z.object({
  name:      z.string().min(2, "Nome troppo corto").max(100),
  email:     z.string().email("Email non valida"),
  subject:   z.string().max(150).optional(),
  message:   z.string().min(10, "Messaggio troppo corto (min 10 caratteri)").max(2000),
  _honeypot: z.string().max(0),
});

export type ContactPayload = z.infer<typeof contactSchema>;
