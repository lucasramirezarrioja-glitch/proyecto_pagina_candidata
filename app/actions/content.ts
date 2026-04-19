"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  biographySectionSchema,
  heroSchema,
  milestoneSchema,
  newsItemSchema,
  settingSchema,
} from "@/lib/schemas/content";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata as Record<string, unknown> | undefined)
    ?.role;
  if (!user || role !== "admin") {
    throw new Error("No autorizado");
  }
  return supabase;
}

function flattenErrors(issues: { path: (string | number)[]; message: string }[]) {
  return issues
    .map((i) => `${i.path.join(".") || "campo"}: ${i.message}`)
    .join("; ");
}

function bumpRevalidate() {
  revalidatePath("/");
  revalidatePath("/aviso-privacidad");
}

// ------------------ HERO ------------------
export async function updateHeroAction(input: unknown) {
  const parsed = heroSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false as const, error: flattenErrors(parsed.error.issues) };

  const supabase = await requireAdmin();
  const { data: current } = await supabase
    .from("hero_content")
    .select("id")
    .limit(1)
    .maybeSingle();

  const payload = {
    ...parsed.data,
    subheadline: parsed.data.subheadline ?? null,
    image_url: parsed.data.image_url ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = current
    ? await supabase.from("hero_content").update(payload).eq("id", current.id)
    : await supabase.from("hero_content").insert(payload);

  if (error) return { ok: false as const, error: error.message };
  bumpRevalidate();
  return { ok: true as const };
}

// ------------------ BIOGRAPHY ------------------
export async function upsertBiographySectionAction(input: unknown) {
  const parsed = biographySectionSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false as const, error: flattenErrors(parsed.error.issues) };
  const supabase = await requireAdmin();

  const { id, ...rest } = parsed.data;
  const payload = { ...rest, updated_at: new Date().toISOString() };
  const { error } = id
    ? await supabase.from("biography_sections").update(payload).eq("id", id)
    : await supabase.from("biography_sections").insert(payload);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/biografia");
  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteBiographySectionAction(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("biography_sections")
    .delete()
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/biografia");
  revalidatePath("/");
  return { ok: true as const };
}

// ------------------ MILESTONES ------------------
export async function upsertMilestoneAction(input: unknown) {
  const parsed = milestoneSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false as const, error: flattenErrors(parsed.error.issues) };
  const supabase = await requireAdmin();

  const { id, ...rest } = parsed.data;
  const payload = {
    ...rest,
    description: rest.description ?? null,
    updated_at: new Date().toISOString(),
  };
  const { error } = id
    ? await supabase.from("milestones").update(payload).eq("id", id)
    : await supabase.from("milestones").insert(payload);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/biografia");
  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteMilestoneAction(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("milestones").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/biografia");
  revalidatePath("/");
  return { ok: true as const };
}

// ------------------ NEWS ------------------
export async function upsertNewsAction(input: unknown) {
  const parsed = newsItemSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false as const, error: flattenErrors(parsed.error.issues) };
  const supabase = await requireAdmin();

  const { id, ...rest } = parsed.data;
  const payload = {
    ...rest,
    source_name: rest.source_name ?? null,
    source_url: rest.source_url ?? null,
    image_url: rest.image_url ?? null,
    published_at: new Date(rest.published_at).toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { error } = id
    ? await supabase.from("news_items").update(payload).eq("id", id)
    : await supabase.from("news_items").insert(payload);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/noticias");
  revalidatePath("/");
  return { ok: true as const };
}

export async function deleteNewsAction(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("news_items").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/noticias");
  revalidatePath("/");
  return { ok: true as const };
}

// ------------------ SETTINGS ------------------
export async function upsertSettingAction(input: unknown) {
  const parsed = settingSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false as const, error: flattenErrors(parsed.error.issues) };
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { ...parsed.data, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  revalidatePath("/aviso-privacidad");
  revalidatePath("/admin/ajustes");
  return { ok: true as const };
}

// ------------------ SUPPORTERS ------------------
export async function deleteSupporterAction(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("supporters").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/simpatizantes");
  return { ok: true as const };
}
