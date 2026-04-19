import { z } from "zod";

export const heroSchema = z.object({
  headline: z.string().trim().min(3, "Ingresa un titular."),
  subheadline: z
    .string()
    .trim()
    .max(500, "Máximo 500 caracteres.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  claim: z.string().trim().min(3, "Ingresa el mensaje principal."),
  disclaimer: z.string().trim().min(3, "Ingresa el disclaimer."),
  primary_cta_label: z.string().trim().min(2, "Texto del CTA principal."),
  secondary_cta_label: z.string().trim().min(2, "Texto del CTA secundario."),
  image_url: z
    .string()
    .trim()
    .url("Debe ser una URL válida.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export const biographySectionSchema = z.object({
  id: z.string().uuid().optional(),
  order_index: z.coerce
    .number()
    .int()
    .min(0, "Debe ser cero o positivo.")
    .default(0),
  title: z.string().trim().min(2, "Ingresa un título."),
  body: z.string().trim().min(10, "El cuerpo es muy corto."),
  is_published: z.boolean().default(true),
});

export const milestoneSchema = z.object({
  id: z.string().uuid().optional(),
  year: z.coerce
    .number()
    .int()
    .min(1900, "Año inválido.")
    .max(2100, "Año inválido."),
  title: z.string().trim().min(2, "Ingresa un título."),
  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  order_index: z.coerce
    .number()
    .int()
    .min(0, "Debe ser cero o positivo.")
    .default(0),
  is_published: z.boolean().default(true),
});

export const newsItemSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3, "Ingresa un título."),
  summary: z.string().trim().min(10, "Ingresa un resumen."),
  source_name: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  source_url: z
    .string()
    .trim()
    .url("URL inválida.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  image_url: z
    .string()
    .trim()
    .url("URL inválida.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  published_at: z.string().trim().min(1, "Fecha requerida."),
  type: z.enum(["social", "medio", "evento"], {
    required_error: "Selecciona un tipo.",
  }),
  is_pinned: z.boolean().default(false),
  is_published: z.boolean().default(true),
});

export const settingSchema = z.object({
  key: z.string().trim().min(1, "Clave requerida."),
  value: z.string(),
});

export type HeroInput = z.infer<typeof heroSchema>;
export type BiographySectionInput = z.infer<typeof biographySectionSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type NewsItemInput = z.infer<typeof newsItemSchema>;
export type SettingInput = z.infer<typeof settingSchema>;
