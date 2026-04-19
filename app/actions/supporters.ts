"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { supporterSchema, type SupporterInput } from "@/lib/schemas/supporter";
import { hashString } from "@/lib/utils";

export type SupporterActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitSupporter(
  raw: SupporterInput,
): Promise<SupporterActionResult> {
  const parsed = supporterSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los campos marcados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Honeypot: si el campo "website" viene con contenido, asumimos bot.
  if (data.website && data.website.length > 0) {
    return { ok: true };
  }

  const supabase = await createClient();

  const hdrs = await headers();
  const ipRaw =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    null;
  const userAgent = hdrs.get("user-agent") ?? null;
  const ipHash = ipRaw ? await hashString(ipRaw) : null;

  const { error } = await supabase.from("supporters").insert({
    full_name: data.full_name,
    email: data.email,
    municipality: data.municipality,
    phone: data.phone ?? null,
    role: data.role,
    consent_accepted: data.consent_accepted,
    consent_version: "v1.0",
    ip_hash: ipHash,
    user_agent: userAgent,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error:
          "Este correo ya está registrado. ¡Gracias por sumarte previamente!",
      };
    }
    return {
      ok: false,
      error:
        "No pudimos registrar tus datos en este momento. Intenta de nuevo en unos minutos.",
    };
  }

  return { ok: true };
}
