import { z } from "zod";

export const contactSchema = z.object({
  from: z
    .string()
    .min(2, "Ingresa tu nombre, email o teléfono.")
    .max(120, "Demasiado largo."),
  subject: z
    .string()
    .min(3, "El asunto es requerido.")
    .max(120, "Máximo 120 caracteres."),
  message: z
    .string()
    .min(10, "El mensaje es muy corto.")
    .max(2000, "Máximo 2000 caracteres."),
});

export type ContactPayload = z.infer<typeof contactSchema>;
