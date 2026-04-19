"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email("Correo inválido."),
  password: z.string().min(6, "La contraseña es muy corta."),
  redirect: z.string().optional(),
});

export type LoginResult = { ok: false; error: string } | { ok: true };

export async function signInAction(
  _prev: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: formData.get("redirect") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { ok: false, error: "Credenciales inválidas." };
  }

  const role = (data.user.app_metadata as Record<string, unknown> | undefined)
    ?.role;
  if (role !== "admin") {
    await supabase.auth.signOut();
    return {
      ok: false,
      error:
        "Tu cuenta no tiene permisos de administración. Contacta al equipo.",
    };
  }

  const target = parsed.data.redirect?.startsWith("/admin")
    ? parsed.data.redirect
    : "/admin";
  redirect(target);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
