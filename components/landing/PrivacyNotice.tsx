import { cn } from "@/lib/utils";
import { parsePrivacyNotice } from "@/lib/privacy-notice";

export function PrivacyNotice({
  source,
  className,
  compact = false,
  showTitle = true,
}: {
  source: string;
  className?: string;
  compact?: boolean;
  showTitle?: boolean;
}) {
  const parsed = parsePrivacyNotice(source);

  return (
    <section className={cn("space-y-6", className)}>
      <header className="space-y-3 border-b border-border pb-4">
        {showTitle ? (
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {parsed.title}
          </h2>
        ) : null}
        {parsed.intro ? (
          <p
            className={cn(
              "leading-relaxed text-foreground/85",
              showTitle ? "mt-3 text-sm sm:text-base" : "text-sm sm:text-base",
            )}
          >
            {parsed.intro}
          </p>
        ) : null}
      </header>

      <div className="space-y-5">
        {parsed.sections.map((section) => (
          <article key={section.title} className="space-y-2">
            <h3 className="font-display text-xl font-semibold text-primary sm:text-2xl">
              {section.title}
            </h3>
            {section.paragraphs.map((paragraph) => (
              <p
                key={`${section.title}-${paragraph}`}
                className={cn(
                  "leading-relaxed text-foreground/85",
                  compact ? "text-sm" : "text-sm sm:text-base",
                )}
              >
                {withMailto(paragraph)}
              </p>
            ))}
            {section.bullets.length ? (
              <ul
                className={cn(
                  "list-disc space-y-1 pl-5 text-foreground/85",
                  compact ? "text-sm" : "text-sm sm:text-base",
                )}
              >
                {section.bullets.map((item) => (
                  <li key={`${section.title}-${item}`}>{withMailto(item)}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function withMailto(text: string) {
  const match = text.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  );
  if (!match || match.index === undefined) return text;

  const email = match[0];
  const start = text.slice(0, match.index);
  const end = text.slice(match.index + email.length);

  return (
    <>
      {start}
      <a href={`mailto:${email}`} className="font-semibold text-primary underline">
        {email}
      </a>
      {end}
    </>
  );
}
