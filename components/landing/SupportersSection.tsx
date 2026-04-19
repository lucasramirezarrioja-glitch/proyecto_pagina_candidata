import { Heart, Megaphone, Users } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SupportersForm } from "./SupportersForm";

const BULLETS = [
  {
    Icon: Heart,
    title: "Sumas tu voz",
    text: "Cada registro refuerza el impulso ciudadano para construir un mejor Guerrero.",
  },
  {
    Icon: Megaphone,
    title: "Te mantienes informado",
    text: "Recibirás noticias, propuestas y convocatorias directamente del equipo.",
  },
  {
    Icon: Users,
    title: "Participas activamente",
    text: "Como activista podrás apoyar en eventos, brigadas y diálogos ciudadanos.",
  },
];

export function SupportersSection({
  introText,
  successText,
  privacyMarkdown,
  showHeading = true,
}: {
  introText: string;
  successText: string;
  privacyMarkdown: string;
  showHeading?: boolean;
}) {
  return (
    <section
      id="registro"
      className="relative overflow-hidden border-b border-border py-16 sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.08),transparent_55%),radial-gradient(ellipse_at_bottom_right,hsl(var(--gold)/0.12),transparent_60%)]"
      />
      <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Reveal variant="emphasis">
            {showHeading ? (
              <>
                <span className="eyebrow">#EsConE · Súmate al cambio</span>
                <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
                  Quiero formar parte del cambio y recibir novedades
                </h2>
                <p className="text-base text-muted-foreground lg:text-lg">
                  Este proyecto crece con cada persona que decide sumarse.
                  Regístrate para recibir noticias, invitaciones a eventos y
                  llamados a acción desde Guerrero y para Guerrero.
                </p>
              </>
            ) : (
              <p className="text-base text-muted-foreground lg:text-lg">
                Elige cómo quieres participar y mantente al día con las
                actividades del proyecto ciudadano.
              </p>
            )}
          </Reveal>
          <ul className="mt-2 flex flex-col gap-5">
            {BULLETS.map(({ Icon, title, text }, idx) => (
              <li key={title}>
                <Reveal
                  delayMs={idx * 120}
                  variant="emphasis"
                  className="flex gap-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delayMs={210} variant="emphasis">
          <SupportersForm
            introText={introText}
            successText={successText}
            privacyMarkdown={privacyMarkdown}
          />
        </Reveal>
      </div>
    </section>
  );
}
