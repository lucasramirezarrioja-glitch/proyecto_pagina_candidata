import type { Metadata } from "next";
import { NewsGrid } from "@/components/site/news/NewsGrid";
import { CrossSellCTA } from "@/components/site/home/CrossSellCTA";
import { getPublishedNews } from "@/lib/queries/content";

export const metadata: Metadata = {
  title: "Noticias y apariciones",
  description:
    "Últimas publicaciones, apariciones en medios y eventos del proyecto ciudadano #EsConE.",
};

export const dynamic = "force-dynamic";

export default async function NoticiasPage() {
  const news = await safeCall(getPublishedNews);

  return (
    <>
      <NewsGrid items={news ?? []} />
      <CrossSellCTA
        title="No te pierdas ninguna novedad"
        description="Déjanos tus datos para recibir las próximas publicaciones directamente."
        links={[
          { href: "/sumate", label: "Quiero recibir noticias", primary: true },
          { href: "/biografia", label: "Ver biografía" },
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
