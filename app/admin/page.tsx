import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const CARDS = [
  {
    href: "/admin/hero",
    title: "Portada",
    description: "Edita el titular, claim y CTAs del hero.",
    Icon: FileText,
  },
  {
    href: "/admin/biografia",
    title: "Biografía y hitos",
    description: "Gestiona los párrafos y la línea de tiempo.",
    Icon: BookOpen,
  },
  {
    href: "/admin/noticias",
    title: "Noticias",
    description: "Publica notas, eventos y contenido de redes.",
    Icon: Newspaper,
  },
  {
    href: "/admin/simpatizantes",
    title: "Simpatizantes",
    description: "Consulta y exporta los registros recibidos.",
    Icon: Users,
  },
  {
    href: "/admin/ajustes",
    title: "Ajustes del sitio",
    description: "Textos del formulario, hashtag y aviso de privacidad.",
    Icon: Settings,
  },
];

export default async function AdminHome() {
  const supabase = await createClient();
  const [supportersCount, newsCount, bioCount] = await Promise.all([
    supabase
      .from("supporters")
      .select("*", { count: "exact", head: true })
      .then((r) => r.count ?? 0),
    supabase
      .from("news_items")
      .select("*", { count: "exact", head: true })
      .then((r) => r.count ?? 0),
    supabase
      .from("biography_sections")
      .select("*", { count: "exact", head: true })
      .then((r) => r.count ?? 0),
  ]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl font-semibold">Hola 👋</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Desde aquí puedes mantener el sitio al día sin tocar código.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Simpatizantes registrados" value={supportersCount} />
        <Stat label="Noticias publicadas" value={newsCount} />
        <Stat label="Bloques de biografía" value={bioCount} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ href, title, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Gestionar
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}
