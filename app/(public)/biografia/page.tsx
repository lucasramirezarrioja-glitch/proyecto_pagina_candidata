import type { Metadata } from "next";
import { Biography } from "@/components/site/biography/Biography";
import { Timeline } from "@/components/site/biography/Timeline";
import { PageIntro } from "@/components/site/shared/PageIntro";
import { CrossSellCTA } from "@/components/site/home/CrossSellCTA";
import {
  getBiographySections,
  getMilestones,
} from "@/lib/queries/content";

export const metadata: Metadata = {
  title: "Biografía y trayectoria",
  description:
    "Conoce la biografía y los hitos de la trayectoria de la Maestra Esthela Damián Peralta.",
};

export const dynamic = "force-dynamic";

export default async function BiografiaPage() {
  const [sections, milestones] = await Promise.all([
    safeCall(getBiographySections),
    safeCall(getMilestones),
  ]);

  return (
    <>
      <PageIntro
        eyebrow="#EsConE · Biografía"
        title="Biografía y trayectoria"
        description="Una vida dedicada al servicio público, la legalidad y la defensa de los derechos de las y los guerrerenses."
      />
      <Biography sections={sections ?? []} />
      <Timeline milestones={milestones ?? []} />
      <CrossSellCTA
        title="¿Te inspira su trayectoria?"
        description="Acompaña el proyecto ciudadano y súmate a la construcción del Guerrero que queremos."
        links={[
          { href: "/sumate", label: "Quiero sumarme", primary: true },
          { href: "/noticias", label: "Ver noticias" },
        ]}
      />
    </>
  );
}

async function safeCall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error("Supabase fetch error:", error);
    return null;
  }
}
