import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import type { Database } from "@/lib/supabase/database.types";

type Section = Database["public"]["Tables"]["biography_sections"]["Row"];

export function Biography({ sections }: { sections: Section[] }) {
  if (!sections.length) return null;

  const [lead, ...rest] = sections;

  return (
    <section
      id="biografia"
      className="border-b border-border bg-secondary/40 py-16 sm:py-20 lg:py-28"
    >
      <div className="container-wide">
        <Reveal
          className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left"
          variant="emphasis"
        >
          <span className="eyebrow">#EsConE · Biografía</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Una vida al servicio de Guerrero
          </h2>
          <p className="mt-4 text-base text-muted-foreground lg:text-lg">
            Trayectoria construida con estudio, trabajo y una convicción firme
            por el bien público.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal delayMs={110} variant="emphasis">
            <article className="prose-landing flex flex-col gap-6">
              <div>
                <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
                  {lead.title}
                </h3>
                <p className="mt-3">{lead.body}</p>
              </div>
              {rest.map((section) => (
                <div key={section.id}>
                  <h3 className="font-display text-xl font-semibold text-primary lg:text-2xl">
                    {section.title}
                  </h3>
                  <p className="mt-3">{section.body}</p>
                </div>
              ))}
            </article>
          </Reveal>

          <Reveal delayMs={180} variant="emphasis">
            <aside
              className="order-first rounded-2xl border border-border bg-card p-6 shadow-sm lg:order-last lg:sticky lg:top-28 lg:self-start lg:p-8"
              aria-label="Cita destacada"
            >
              <Quote
                className="h-8 w-8 text-gold"
                aria-hidden="true"
                strokeWidth={1.5}
              />
              <blockquote className="mt-4 font-display text-xl leading-snug text-foreground lg:text-2xl">
                “Guerrero merece instituciones fuertes, gobiernos honestos y
                oportunidades reales en cada una de sus regiones.”
              </blockquote>
              <footer className="mt-6 flex flex-col gap-1 border-t border-border pt-4 text-sm">
                <span className="font-semibold text-foreground">
                  Maestra Esthela Damián Peralta
                </span>
                <span className="text-muted-foreground">
                  Trayectoria en servicio público federal
                </span>
              </footer>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
