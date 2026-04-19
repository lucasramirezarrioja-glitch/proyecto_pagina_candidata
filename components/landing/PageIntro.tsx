import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  backHref = "/",
  backLabel = "Volver al inicio",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border-b border-border bg-gradient-to-b from-secondary/60 via-background to-background",
        className,
      )}
    >
      <div className="container-wide py-10 sm:py-14 lg:py-20">
        <Reveal variant="emphasis">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </Link>
          <div className="mt-6 max-w-3xl">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
