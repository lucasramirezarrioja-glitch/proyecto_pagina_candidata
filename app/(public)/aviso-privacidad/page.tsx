import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { PrivacyNotice } from "@/components/site/privacy/PrivacyNotice";
import { Button } from "@/components/ui/button";
import { getSetting } from "@/lib/queries/content";
import { PRIVACY_NOTICE_FALLBACK } from "@/lib/privacy-fallback";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Aviso de privacidad del sitio ciudadano en apoyo a la Maestra Esthela Damián Peralta.",
};

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  let source = PRIVACY_NOTICE_FALLBACK;
  try {
    const value = await getSetting("privacy_notice_md");
    if (value) source = value;
  } catch {
    // fallback silencioso
  }

  return (
    <article className="container-wide max-w-3xl py-12 sm:py-16 lg:py-20">
      <Button asChild variant="ghost" size="sm" className="mb-6 animate-fade-up">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al inicio
        </Link>
      </Button>
      <div className="animate-fade-up" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
        <PrivacyNotice source={source} />
      </div>
    </article>
  );
}
