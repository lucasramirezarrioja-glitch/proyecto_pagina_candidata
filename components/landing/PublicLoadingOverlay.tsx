"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PageLoader } from "@/components/site/shell/PageLoader";
import { usePublicPageReady } from "@/components/site/shell/PublicPageReadyProvider";

const STORAGE_PREFIX = "esthela_public_route_seen:";
/** Bump cuando cambie la duración del intro; evita que un flag viejo salte los 2s tras actualizar el sitio. */
const STORAGE_REVISION = ":v2";
/** Tiempo que permanece visible el overlay la primera vez que entras a cada ruta (demo). */
const FIRST_VISIBLE_MS = 2000;
/**
 * Debe coincidir con `duration-1000` del overlay en PageLoader para que el fade termine de pintarse.
 */
const FADE_OUT_MS = 1000;

function storageKeyForPath(pathname: string) {
  return `${STORAGE_PREFIX}${pathname}${STORAGE_REVISION}`;
}

export function PublicLoadingOverlay() {
  const pathname = usePathname();
  const { setReady } = usePublicPageReady();

  const [phase, setPhase] = useState<"visible" | "fading" | "hidden">(
    "visible",
  );

  useLayoutEffect(() => {
    let cancelled = false;

    try {
      if (sessionStorage.getItem(storageKeyForPath(pathname)) === "1") {
        setPhase("hidden");
        setReady(true);
        return;
      }
    } catch {
      // modo privado u otro bloqueo: mostrar secuencia corta igual
    }

    setReady(false);
    setPhase("visible");

    const fadeTimer = window.setTimeout(() => {
      if (!cancelled) setPhase("fading");
    }, FIRST_VISIBLE_MS);

    const hideTimer = window.setTimeout(() => {
      if (cancelled) return;
      setPhase("hidden");
      setReady(true);
      try {
        sessionStorage.setItem(storageKeyForPath(pathname), "1");
      } catch {
        // ignorar
      }
    }, FIRST_VISIBLE_MS + FADE_OUT_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname, setReady]);

  if (phase === "hidden") return null;
  return <PageLoader overlay fading={phase === "fading"} />;
}
