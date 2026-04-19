"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatermarkImage } from "@/components/media/WatermarkImage";
import { usePublicPageReady } from "@/components/site/shell/PublicPageReadyProvider";
import { cn } from "@/lib/utils";

type HeroEntranceProps = {
  headline: string;
  claim: string;
  subheadline: string;
  disclaimer: string;
  primaryCta: string;
  secondaryCta: string;
  imageUrl: string;
};

export function HeroEntrance({
  headline,
  claim,
  subheadline,
  disclaimer,
  primaryCta,
  secondaryCta,
  imageUrl,
}: HeroEntranceProps) {
  const { ready } = usePublicPageReady();

  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--gold)/0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.08),transparent_60%)]"
      />
      <div className="container-wide grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-24">
        {/* ----- Texto ----- */}
        <div
          className={cn(
            "order-2 flex flex-col gap-6 lg:order-1",
            ready ? "animate-fade-up-lg" : "translate-y-8 opacity-0",
          )}
          style={
            ready
              ? { animationDelay: "0ms", animationFillMode: "both" }
              : undefined
          }
        >
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            #EsConE · Guerrero 2027
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[88px]">
            {headline}
          </h1>
          <p className="font-display text-2xl italic text-primary lg:text-3xl">
            {claim}
          </p>
          <p className="max-w-xl text-base leading-relaxed text-foreground/80 lg:text-lg">
            {subheadline}
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/sumate">
                {primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Link href="/biografia">{secondaryCta}</Link>
            </Button>
          </div>

          <p className="mt-4 rounded-lg border border-dashed border-gold/50 bg-gold/5 p-3 text-xs font-medium text-foreground/80 sm:text-sm">
            {disclaimer}
          </p>
        </div>

        {/* ----- Imagen ----- */}
        <div
          className={cn(
            "order-1 lg:order-2",
            ready ? "animate-fade-up-lg" : "translate-y-8 opacity-0",
          )}
          style={
            ready
              ? { animationDelay: "150ms", animationFillMode: "both" }
              : undefined
          }
        >
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <WatermarkImage
              src={imageUrl}
              alt={`Fotografía de ${headline}`}
              width={900}
              height={1100}
              priority
              containerClassName="aspect-[4/5] w-full rounded-[28px] border border-border/70 bg-secondary shadow-[0_20px_60px_-20px_hsl(155_40%_15%/0.3)]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 hidden rounded-2xl border border-gold/40 bg-background/90 p-4 shadow-xl backdrop-blur sm:block"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                #EsConE
              </p>
              <p className="font-display text-lg text-foreground">
                Cercanía, legalidad y resultados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
