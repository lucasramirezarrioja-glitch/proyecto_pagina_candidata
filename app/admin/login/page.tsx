import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Acceso administrativo" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="font-display text-xl font-semibold text-primary"
          >
            Esthela Damián · Admin
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-2xl font-semibold">
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa con tu cuenta autorizada para gestionar el contenido del
            sitio.
          </p>
          {params.error === "forbidden" ? (
            <p
              role="alert"
              className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
            >
              Tu sesión no tiene permisos de administrador.
            </p>
          ) : null}
          <div className="mt-6">
            <LoginForm redirectTo={params.redirect} />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ¿Necesitas acceso? Escribe al equipo técnico del proyecto.
        </p>
      </div>
    </div>
  );
}
