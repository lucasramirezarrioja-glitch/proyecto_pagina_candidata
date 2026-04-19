import Link from "next/link";
import { ArrowUpRight, Calendar, Radio, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/Reveal";
import { cn, formatDate } from "@/lib/utils";
import type { Database } from "@/lib/supabase/database.types";

type News = Database["public"]["Tables"]["news_items"]["Row"];

const TYPE_LABEL: Record<string, { label: string; Icon: typeof Radio }> = {
  social: { label: "Redes", Icon: Radio },
  medio: { label: "Medios", Icon: Newspaper },
  evento: { label: "Evento", Icon: Calendar },
};

export function NewsGrid({ items }: { items: News[] }) {
  if (!items.length) {
    return (
      <section
        id="noticias"
        className="border-b border-border bg-secondary/30 py-16 sm:py-20 lg:py-28"
      >
        <div className="container-wide">
          <Reveal variant="emphasis">
            <p className="text-center text-muted-foreground">
              Pronto compartiremos noticias y publicaciones recientes.
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section
      id="noticias"
      className="border-b border-border bg-secondary/30 py-16 sm:py-20 lg:py-28"
    >
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-2xl" variant="emphasis">
            <span className="eyebrow">#EsConE · Noticias y redes</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              Las últimas publicaciones
            </h2>
            <p className="mt-4 text-base text-muted-foreground lg:text-lg">
              Sigue las notas, eventos y publicaciones más recientes
              relacionadas con la Maestra Esthela.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {items.map((item, idx) => {
            const type = TYPE_LABEL[item.type] ?? TYPE_LABEL.medio;
            const Icon = type.Icon;
            const featured = item.is_pinned && idx === 0;
            return (
              <Reveal
                key={item.id}
                delayMs={idx * 110}
                variant={featured ? "emphasis" : "subtle"}
                className={cn(featured && "lg:col-span-2")}
              >
                <article
                  className={cn(
                    "group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md lg:p-7",
                    featured && "lg:flex-row lg:gap-8",
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-col gap-4",
                      featured && "lg:flex-1",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="muted" className="gap-1.5">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {type.label}
                      </Badge>
                      {item.is_pinned ? (
                        <Badge variant="gold">Destacada</Badge>
                      ) : null}
                      <time
                        dateTime={item.published_at}
                        className="text-xs text-muted-foreground"
                      >
                        {formatDate(item.published_at)}
                      </time>
                    </div>
                    <h3
                      className={cn(
                        "font-display text-xl font-semibold text-foreground",
                        featured && "lg:text-3xl",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                      {item.summary}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-2 text-sm">
                      {item.source_url ? (
                        <Link
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          Leer en {item.source_name ?? "la fuente"}
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      ) : item.source_name ? (
                        <span className="text-xs text-muted-foreground">
                          Fuente: {item.source_name}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
