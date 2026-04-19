import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

type Link = { href: string; label: string; primary?: boolean };

export function CrossSellCTA({
  title = "¿Listo para dar el siguiente paso?",
  description = "Súmate al cambio y recibe noticias del proyecto ciudadano.",
  links = [
    { href: "/sumate", label: "Quiero formar parte", primary: true },
    { href: "/biografia", label: "Conoce su trayectoria" },
  ],
}: {
  title?: string;
  description?: string;
  links?: Link[];
}) {
  return (
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-wide py-12 sm:py-16">
        <Reveal
          className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10"
          variant="emphasis"
          delayMs={60}
        >
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/80">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            {links.map((l) => (
              <Button
                key={l.href}
                asChild
                size="lg"
                variant={l.primary ? "accent" : "outline"}
                className={
                  l.primary
                    ? undefined
                    : "border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                }
              >
                <Link href={l.href}>
                  {l.label}
                  {l.primary ? (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                </Link>
              </Button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
