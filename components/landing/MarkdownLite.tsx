import { cn } from "@/lib/utils";

/**
 * Renderizador minimalista de markdown (sólo para el Aviso de privacidad
 * que escribirá el equipo). Evita dependencias adicionales. Soporta:
 *  - encabezados h1/h2/h3
 *  - listas con viñetas
 *  - párrafos
 *  - énfasis **negrita** y _itálica_
 *  - enlaces [texto](url)
 */
export function MarkdownLite({ source }: { source: string }) {
  const blocks = source.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="prose-landing flex flex-col gap-4">
      {blocks.map((block, idx) => {
        const h1 = block.match(/^#\s+(.+)$/);
        if (h1)
          return (
            <h1
              key={idx}
              className="font-display text-3xl font-semibold lg:text-4xl"
            >
              {inline(h1[1])}
            </h1>
          );
        const h2 = block.match(/^##\s+(.+)$/);
        if (h2)
          return (
            <h2
              key={idx}
              className="mt-4 font-display text-2xl font-semibold"
            >
              {inline(h2[1])}
            </h2>
          );
        const h3 = block.match(/^###\s+(.+)$/);
        if (h3)
          return (
            <h3 key={idx} className="mt-2 font-display text-xl font-semibold">
              {inline(h3[1])}
            </h3>
          );
        const isList = /^(-|\*)\s+/.test(block);
        if (isList) {
          const items = block.split(/\n/).map((line) =>
            line.replace(/^(-|\*)\s+/, ""),
          );
          return (
            <ul
              key={idx}
              className="list-disc space-y-1 pl-6 text-foreground/90"
            >
              {items.map((it, i) => (
                <li key={i}>{inline(it)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={idx} className={cn("text-base leading-relaxed")}>
            {inline(block)}
          </p>
        );
      })}
    </div>
  );
}

function inline(text: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  const regex =
    /(\*\*([^*]+)\*\*)|(_([^_]+)_)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      tokens.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3]) {
      tokens.push(<em key={key++}>{match[4]}</em>);
    } else if (match[5]) {
      tokens.push(
        <a
          key={key++}
          href={match[7]}
          className="font-semibold text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[6]}
        </a>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }
  return tokens;
}
