import Link from "next/link";

export function SiteFooter({
  hashtag = "#EsConE",
}: {
  hashtag?: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-wide grid gap-10 py-12 lg:grid-cols-3 lg:py-16">
        <div>
          <p className="font-display text-2xl font-semibold">
            Maestra Esthela Damián Peralta
          </p>
          <p className="mt-2 max-w-sm text-sm text-primary-foreground/80">
            Un proyecto ciudadano para construir un Guerrero más seguro,
            próspero y justo.
          </p>
        </div>
        <nav
          className="flex flex-col gap-3 text-sm"
          aria-label="Secundaria"
        >
          <p className="font-semibold uppercase tracking-widest text-gold/80">
            Enlaces
          </p>
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <Link href="/biografia" className="hover:underline">
            Biografía y trayectoria
          </Link>
          <Link href="/noticias" className="hover:underline">
            Noticias
          </Link>
          <Link href="/sumate" className="hover:underline">
            Súmate
          </Link>
          <Link href="/aviso-privacidad" className="hover:underline">
            Aviso de privacidad
          </Link>
        </nav>
        <div className="flex flex-col gap-3">
          <p className="font-semibold uppercase tracking-widest text-gold/80">
            Identidad ciudadana
          </p>
          <p className="font-display text-4xl text-gold">{hashtag}</p>
          <p className="text-xs text-primary-foreground/70">
            Esta página ha sido creada por simpatizantes de la Maestra Esthela
            Damián; no es un sitio oficial de gobierno ni de campaña.
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-4 text-xs text-primary-foreground/70 sm:flex-row">
          <p>
            © {year} Simpatizantes de la Maestra Esthela Damián. Todos los
            derechos reservados.
          </p>
          <p>Hecho con orgullo por Guerrero.</p>
        </div>
      </div>
    </footer>
  );
}
