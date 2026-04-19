import Link from "next/link";
import { ArrowUpRight, BookOpen, Newspaper, UsersRound } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const CARDS = [
  {
    href: "/biografia",
    title: "Biografía y trayectoria",
    description:
      "Conoce los capítulos que han forjado su vocación de servicio público.",
    Icon: BookOpen,
  },
  {
    href: "/noticias",
    title: "Noticias y apariciones",
    description:
      "Lo más reciente del proyecto ciudadano, en medios y redes sociales.",
    Icon: Newspaper,
  },
  {
    href: "/sumate",
    title: "Súmate al cambio",
    description:
      "Regístrate como seguidor o activista y forma parte del proyecto.",
    Icon: UsersRound,
  },
];

export function SectionsGrid() {
  return (
    <section className="border-b border-border py-16 sm:py-20 lg:py-24">
      <div className="container-wide">
        <Reveal className="max-w-2xl" variant="emphasis">
          <span className="eyebrow">Conoce el proyecto</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Explora cada sección
          </h2>
          <p className="mt-4 text-base text-muted-foreground lg:text-lg">
            Hemos organizado la información por temas para que accedas
            directamente a lo que te interesa.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {CARDS.map(({ href, title, description, Icon }, idx) => (
            <Reveal key={href} delayMs={idx * 110} variant="emphasis">
              <Link
                href={href}
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Ver sección
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
