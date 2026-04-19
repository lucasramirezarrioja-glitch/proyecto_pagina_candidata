import { SiteHeader } from "@/components/site/shell/SiteHeader";
import { SiteFooter } from "@/components/site/shell/SiteFooter";
import { PublicLoadingOverlay } from "@/components/site/shell/PublicLoadingOverlay";
import { PublicPageReadyProvider } from "@/components/site/shell/PublicPageReadyProvider";
import { getSetting } from "@/lib/queries/content";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let hashtag = "#EsConE";
  try {
    const value = await getSetting("site_hashtag");
    if (value) hashtag = value;
  } catch {
    // fallback silencioso
  }

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <PublicPageReadyProvider>
        <main id="contenido" className="relative">
          {children}
          <PublicLoadingOverlay />
        </main>
      </PublicPageReadyProvider>
      <SiteFooter hashtag={hashtag} />
    </>
  );
}
