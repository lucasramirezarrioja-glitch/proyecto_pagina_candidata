import { z } from "zod";
import { GUERRERO_MUNICIPIOS } from "@/lib/data/guerrero-municipios";

const PHONE_REGEX = /^[\d\s()+-]{7,20}$/;
const MUNICIPALITY_SET = new Set<string>(GUERRERO_MUNICIPIOS);

export const supporterSchema = z.object({
  full_name: z
    .string({ required_error: "Tu nombre completo es obligatorio." })
    .trim()
    .min(2, "Escribe tu nombre completo.")
    .max(120, "Máximo 120 caracteres."),
  email: z
    .string({ required_error: "El correo electrónico es obligatorio." })
    .trim()
    .toLowerCase()
    .email("Ingresa un correo válido."),
  municipality: z
    .string({ required_error: "Selecciona tu municipio." })
    .trim()
    .min(1, "Selecciona tu municipio.")
    .refine(
      (value) => MUNICIPALITY_SET.has(value),
      "Selecciona un municipio válido de Guerrero.",
    ),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Teléfono inválido.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  role: z.enum(["seguidor", "activista"], {
    required_error: "Selecciona cómo quieres participar.",
  }),
  consent_accepted: z.literal(true, {
    errorMap: () => ({
      message: "Debes aceptar el aviso de privacidad para registrarte.",
    }),
  }),
  // Honeypot: debe ir vacío
  website: z
    .string()
    .max(0, "Campo reservado.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type SupporterInput = z.infer<typeof supporterSchema>;
