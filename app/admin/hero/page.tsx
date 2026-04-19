import { PageHeader } from "@/components/admin/PageHeader";
import { HeroForm } from "./HeroForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const supabase = await createClient();
  const { data: hero } = await supabase
    .from("hero_content")
    .select("*")
    .limit(1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Portada (Hero)"
        description="Edita los textos principales que se muestran al abrir la página."
      />
      <HeroForm hero={hero ?? null} />
    </div>
  );
}
