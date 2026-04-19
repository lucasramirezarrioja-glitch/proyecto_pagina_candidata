import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/database.types";
import { Reveal } from "@/components/motion/Reveal";

type Milestone = Database["public"]["Tables"]["milestones"]["Row"];

export function Timeline({
  milestones,
  compact = false,
}: {
  milestones: Milestone[];
  compact?: boolean;
}) {
  if (!milestones.length) return null;

  return (
    <section
      id="trayectoria"
      className={cn(
        "border-b border-border",
        compact ? "py-12 sm:py-16" : "py-16 sm:py-20 lg:py-28",
      )}
    >
      <div className="container-wide">
        <Reveal className="max-w-2xl" variant="emphasis">
          <span className="eyebrow">#EsConE · Trayectoria</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Hitos de su carrera
          </h2>
          <p className="mt-4 text-base text-muted-foreground lg:text-lg">
            Pasos relevantes que han dado forma a una carrera dedicada al
            servicio público y la legalidad.
          </p>
        </Reveal>

        <ol
          className="relative mt-12 space-y-10 border-l-2 border-border pl-6 lg:hidden"
          aria-label="Cronología móvil"
        >
          {milestones.map((m, idx) => (
            <li key={m.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[33px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gold bg-background"
              >
                <span className="h-2 w-2 rounded-full bg-gold" />
              </span>
              <Reveal delayMs={idx * 130} variant="emphasis">
                <p className="font-display text-lg font-semibold text-primary">
                  {m.year}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">
                  {m.title}
                </h3>
                {m.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                ) : null}
              </Reveal>
            </li>
          ))}
        </ol>

        <ol
          className="relative mx-auto mt-16 hidden max-w-5xl lg:block"
          aria-label="Cronología escritorio"
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-gold/10 via-gold/70 to-gold/10"
          />
          {milestones.map((m, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <li
                key={m.id}
                className="relative grid grid-cols-2 gap-10 pb-10 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-6 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background bg-gold shadow"
                />
                {isLeft ? (
                  <>
                    <Reveal
                      delayMs={idx * 150}
                      variant="emphasis"
                      rootMargin="0px 0px -8% 0px"
                    >
                      <MilestoneCard milestone={m} align="right" />
                    </Reveal>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <Reveal
                      delayMs={idx * 150}
                      variant="emphasis"
                      rootMargin="0px 0px -8% 0px"
                    >
                      <MilestoneCard milestone={m} align="left" />
                    </Reveal>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function MilestoneCard({
  milestone: m,
  align,
}: {
  milestone: Milestone;
  align: "left" | "right";
}) {
  return (
    <article
      className={cn(
        "relative rounded-2xl border border-border bg-card p-6 shadow-sm",
        align === "right" ? "mr-10 text-right" : "ml-10 text-left",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-7 h-0.5 w-10 bg-border",
          align === "right" ? "-right-10" : "-left-10",
        )}
      />
      <p className="font-display text-2xl font-semibold text-primary">
        {m.year}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">{m.title}</h3>
      {m.description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {m.description}
        </p>
      ) : null}
    </article>
  );
}
