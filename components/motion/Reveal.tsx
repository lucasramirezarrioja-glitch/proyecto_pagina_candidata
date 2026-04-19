"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePublicPageReady } from "@/components/site/shell/PublicPageReadyProvider";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Retraso de la animación una vez visible (ms). */
  delayMs?: number;
  rootMargin?: string;
  variant?: "subtle" | "emphasis";
  disabledUntilReady?: boolean;
};

/**
 * Aparición al entrar en el viewport (scroll). Usa `animate-fade-up` del tema.
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
  rootMargin = "0px 0px -10% 0px",
  variant = "subtle",
  disabledUntilReady = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const { ready } = usePublicPageReady();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabledUntilReady && !ready) {
      setOn(false);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }

    const ob = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setOn(true);
            ob.disconnect();
          }
        }
      },
      { rootMargin, threshold: variant === "emphasis" ? 0.16 : 0.08 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [disabledUntilReady, ready, rootMargin, variant]);

  const style: CSSProperties | undefined = on
    ? { animationDelay: `${delayMs}ms`, animationFillMode: "both" as const }
    : undefined;

  const hiddenClass = variant === "emphasis" ? "translate-y-8 opacity-0" : "translate-y-5 opacity-0";
  const animationClass = variant === "emphasis" ? "animate-fade-up-lg" : "animate-fade-up";

  return (
    <div
      ref={ref}
      className={cn(
        on ? animationClass : hiddenClass,
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
