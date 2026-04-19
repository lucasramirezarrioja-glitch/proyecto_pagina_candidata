import { cn } from "@/lib/utils";

export function PageLoader({
  label = "Cargando información...",
  overlay = false,
  fading = false,
}: {
  label?: string;
  overlay?: boolean;
  fading?: boolean;
}) {
  const wrapperClassName = overlay
    ? "fixed inset-0 z-[80] flex items-center justify-center bg-background/55 px-4 backdrop-blur-md"
    : "container-wide flex min-h-[55vh] items-center justify-center py-16";

  return (
    <div
      className={cn(
        wrapperClassName,
        overlay && "transition-opacity duration-1000 ease-in-out",
        overlay && (fading ? "opacity-0" : "opacity-100"),
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/90 px-6 py-7 text-center shadow-lg animate-fade-up-loader sm:px-8",
          overlay && "transition-all duration-1000 ease-in-out",
          overlay &&
            (fading
              ? "scale-[0.96] opacity-0 blur-[2px]"
              : "scale-100 opacity-100 blur-0"),
        )}
      >
        <div className="relative h-20 w-20">
          <span className="absolute inset-0 rounded-full border border-primary/25" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-gold/70" />
          <span className="absolute inset-2 inline-flex items-center justify-center rounded-full bg-primary text-3xl font-display font-semibold text-primary-foreground shadow-sm">
            E
          </span>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">{label}</p>
      </div>
    </div>
  );
}
