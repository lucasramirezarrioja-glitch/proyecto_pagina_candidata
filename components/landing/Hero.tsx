import type { Database } from "@/lib/supabase/database.types";
import { HeroEntrance } from "@/components/site/home/HeroEntrance";

type Hero = Database["public"]["Tables"]["hero_content"]["Row"];

const DEFAULT_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/e/e7/Foto_de_Perfil_Esthela_Dami%C3%A1n_%28cropped%29.jpg";

export function Hero({ hero }: { hero: Hero | null }) {
  const headline = hero?.headline ?? "Maestra Esthela Damián Peralta";
  const claim = hero?.claim ?? "La mejor opción para Guerrero en 2027";
  const subheadline =
    hero?.subheadline ??
    "Una vida dedicada al servicio público, la legalidad y la defensa de los derechos de las y los guerrerenses.";
  const disclaimer =
    hero?.disclaimer ??
    "Esta página ha sido creada por simpatizantes de la Maestra Esthela Damián; no es un sitio oficial.";
  const primaryCta = hero?.primary_cta_label ?? "Quiero formar parte del cambio";
  const secondaryCta = hero?.secondary_cta_label ?? "Conoce su trayectoria";
  const imageUrl = hero?.image_url ?? DEFAULT_IMAGE;

  return (
    <HeroEntrance
      headline={headline}
      claim={claim}
      subheadline={subheadline}
      disclaimer={disclaimer}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
      imageUrl={imageUrl}
    />
  );
}
