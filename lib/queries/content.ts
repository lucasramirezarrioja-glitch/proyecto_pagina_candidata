import { createClient } from "@/lib/supabase/server";

export async function getHero() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_content")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getBiographySections() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("biography_sections")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getMilestones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("is_published", true)
    .order("year", { ascending: true })
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedNews(limit = 9) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  const map = new Map<string, string>();
  for (const row of data ?? []) map.set(row.key, row.value);
  return map;
}

export async function getSetting(key: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data?.value ?? null;
}
