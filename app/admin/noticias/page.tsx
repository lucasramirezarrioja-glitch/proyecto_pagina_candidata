import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { NewsManager } from "./NewsManager";

export const dynamic = "force-dynamic";

export default async function NoticiasAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_items")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Noticias"
        description="Publica notas propias, comparte apariciones en medios o anuncia eventos. Marca como destacada lo que debe aparecer arriba."
      />
      <NewsManager items={data ?? []} />
    </div>
  );
}
