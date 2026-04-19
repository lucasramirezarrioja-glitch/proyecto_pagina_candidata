import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ExportCsvButton } from "./ExportCsvButton";
import { DeleteSupporterButton } from "./DeleteSupporterButton";

export const dynamic = "force-dynamic";

export default async function SupportersAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("supporters")
    .select("*")
    .order("created_at", { ascending: false });

  const supporters = data ?? [];
  const totalSeguidores = supporters.filter((s) => s.role === "seguidor").length;
  const totalActivistas = supporters.filter((s) => s.role === "activista").length;

  return (
    <div>
      <PageHeader
        title="Simpatizantes"
        description="Registros recibidos mediante el formulario público. Eliminar un registro lo borra de forma permanente."
        actions={<ExportCsvButton supporters={supporters} />}
      />

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Total" value={supporters.length} />
        <Stat label="Seguidores" value={totalSeguidores} />
        <Stat label="Activistas" value={totalActivistas} />
      </section>

      {/* Mobile cards */}
      <ul className="grid gap-3 lg:hidden">
        {supporters.map((s) => (
          <li
            key={s.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{s.full_name}</p>
                <p className="truncate text-xs text-muted-foreground">{s.email}</p>
              </div>
              <Badge variant={s.role === "activista" ? "gold" : "default"}>
                {s.role}
              </Badge>
            </div>
            <dl className="mt-3 grid gap-1 text-xs text-muted-foreground">
              {s.municipality ? (
                <div>
                  <dt className="inline font-semibold">Municipio:</dt>{" "}
                  <dd className="inline">{s.municipality}</dd>
                </div>
              ) : null}
              {s.phone ? (
                <div>
                  <dt className="inline font-semibold">Tel:</dt>{" "}
                  <dd className="inline">{s.phone}</dd>
                </div>
              ) : null}
              <div>
                <dt className="inline font-semibold">Registrado:</dt>{" "}
                <dd className="inline">{formatDate(s.created_at)}</dd>
              </div>
            </dl>
            <div className="mt-3 flex justify-end">
              <DeleteSupporterButton id={s.id} />
            </div>
          </li>
        ))}
        {supporters.length === 0 ? (
          <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No hay registros todavía.
          </li>
        ) : null}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:block">
        <div className="max-h-[640px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/60 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Municipio</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Registrado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {supporters.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-border/80 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{s.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.municipality ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={s.role === "activista" ? "gold" : "default"}>
                      {s.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteSupporterButton id={s.id} />
                  </td>
                </tr>
              ))}
              {supporters.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No hay registros todavía.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
