import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { SettingsManager } from "./SettingsManager";

export const dynamic = "force-dynamic";

const FIELDS = [
  {
    key: "site_hashtag",
    label: "Hashtag principal",
    description: "Aparece en el footer y en el watermark de imágenes.",
    type: "input" as const,
  },
  {
    key: "form_intro_text",
    label: "Texto introductorio del formulario",
    description: "Texto corto que antecede al formulario en la landing.",
    type: "textarea" as const,
  },
  {
    key: "form_success_text",
    label: "Mensaje de éxito del formulario",
    description: "Se muestra luego de un registro exitoso.",
    type: "textarea" as const,
  },
  {
    key: "privacy_notice_md",
    label: "Aviso de privacidad (markdown)",
    description:
      "Admite encabezados (#, ##, ###), listas con guiones, **negritas** y _itálicas_.",
    type: "markdown" as const,
  },
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in(
      "key",
      FIELDS.map((f) => f.key),
    );

  const byKey = new Map((data ?? []).map((r) => [r.key, r.value ?? ""]));

  const fields = FIELDS.map((f) => ({
    ...f,
    initial: byKey.get(f.key) ?? "",
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Ajustes del sitio"
        description="Textos editables que se muestran en la landing y el aviso de privacidad."
      />
      <SettingsManager fields={fields} />
    </div>
  );
}
