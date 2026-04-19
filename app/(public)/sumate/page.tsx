import type { Metadata } from "next";
import { SupportersSection } from "@/components/site/sumate/SupportersSection";
import { PageIntro } from "@/components/site/shared/PageIntro";
import { getSettings } from "@/lib/queries/content";
import { PRIVACY_NOTICE_FALLBACK } from "@/lib/privacy-fallback";

export const metadata: Metadata = {
  title: "Súmate al cambio",
  description:
    "Regístrate como seguidor o activista del proyecto ciudadano impulsado por la Maestra Esthela Damián Peralta.",
};

export const dynamic = "force-dynamic";

export default async function SumatePage() {
  const settings = await safeCall(getSettings);

  const introText =
    settings?.get("form_intro_text") ??
    "Déjanos tus datos para recibir noticias, invitaciones a eventos y llamados a la acción del proyecto ciudadano que impulsa la Maestra Esthela Damián Peralta.";
  const successText =
    settings?.get("form_success_text") ??
    "¡Gracias por sumarte! Te escribiremos muy pronto con las novedades del proyecto.";
  const privacyMarkdown =
    settings?.get("privacy_notice_md") ?? PRIVACY_NOTICE_FALLBACK;

  return (
    <>
      <PageIntro
        eyebrow="#EsConE · Súmate"
        title="Quiero formar parte del cambio"
        description="Este proyecto crece con cada persona que decide sumarse. Escoge cómo quieres participar y acompañemos juntos a Guerrero."
      />
      <SupportersSection
        introText={introText}
        successText={successText}
        privacyMarkdown={privacyMarkdown}
        showHeading={false}
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
