"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/biografia", label: "Biografía" },
  { href: "/noticias", label: "Noticias" },
  { href: "/sumate", label: "Súmate" },
];

/** Altura de la fila del header en móvil; debe coincidir con `h-16` del contenedor interno. */
const HEADER_INNER_H_MOBILE = "4rem";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-border/60 bg-background/85 pt-[env(safe-area-inset-top,0px)] backdrop-blur supports-[backdrop-filter]:bg-background/75",
          open && "z-[110]",
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-primary"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              E
            </span>
            <span className="hidden sm:inline">Esthela Damián</span>
          </Link>

          <nav
            aria-label="Principal"
            className="hidden lg:flex lg:items-center lg:gap-8"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button asChild size="sm">
              <Link href="/sumate">Quiero formar parte</Link>
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {open ? (
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          aria-hidden={false}
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-background/40 backdrop-blur-md transition-opacity duration-300 ease-out"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="animate-in fade-in slide-in-from-top-2 absolute left-0 right-0 overflow-y-auto rounded-b-xl border-b border-border bg-background shadow-lg duration-300"
            style={{
              top: `calc(${HEADER_INNER_H_MOBILE} + env(safe-area-inset-top, 0px))`,
              maxHeight: `calc(100dvh - ${HEADER_INNER_H_MOBILE} - env(safe-area-inset-top, 0px))`,
            }}
          >
            <div className="container-wide flex flex-col gap-1 py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                asChild
                className="mt-2 w-auto max-w-sm shrink-0 self-center whitespace-normal text-center leading-snug"
                size="lg"
              >
                <Link href="/sumate" onClick={() => setOpen(false)}>
                  Quiero formar parte del cambio
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
