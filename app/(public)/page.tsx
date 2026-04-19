import { Hero } from "@/components/site/home/Hero";
import { SectionsGrid } from "@/components/site/home/SectionsGrid";
import { CrossSellCTA } from "@/components/site/home/CrossSellCTA";
import { getHero } from "@/lib/queries/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const hero = await safeCall(getHero);

  return (
    <>
      <Hero hero={hero ?? null} />
      <SectionsGrid />
      <CrossSellCTA
        title="¿Quieres formar parte del cambio?"
        description="Déjanos tus datos y recibe noticias, invitaciones a eventos y llamados a la acción del proyecto ciudadano."
        links={[
          { href: "/sumate", label: "Registrarme", primary: true },
          { href: "/biografia", label: "Conocer su trayectoria" },
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
