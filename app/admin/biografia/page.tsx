import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { BiographyManager } from "./BiographyManager";
import { MilestonesManager } from "./MilestonesManager";

export const dynamic = "force-dynamic";

export default async function BiografiaAdminPage() {
  const supabase = await createClient();
  const [bio, timeline] = await Promise.all([
    supabase
      .from("biography_sections")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("milestones")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <PageHeader
          title="Biografía"
          description="Gestiona los bloques narrativos que construyen la historia."
        />
        <BiographyManager sections={bio.data ?? []} />
      </div>

      <div>
        <PageHeader
          title="Línea de tiempo"
          description="Hitos y cargos relevantes que aparecerán en orden cronológico."
        />
        <MilestonesManager milestones={timeline.data ?? []} />
      </div>
    </div>
  );
}
