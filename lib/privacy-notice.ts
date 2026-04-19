export type PrivacyNoticeSection = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};

export type ParsedPrivacyNotice = {
  title: string;
  intro: string;
  sections: PrivacyNoticeSection[];
};

const CANONICAL_SECTION_TITLES = [
  "Datos que recolectamos",
  "Finalidades",
  "Derechos ARCO",
  "Consentimiento",
] as const;

export function parsePrivacyNotice(source: string): ParsedPrivacyNotice {
  const normalized = normalizeSource(source);

  const lines = normalized.split("\n");
  let title = "Aviso de privacidad";
  const firstHeading = lines.find((line) => /^#\s+/.test(line));
  if (firstHeading) {
    title = firstHeading.replace(/^#\s+/, "").trim();
  }

  let intro = "";
  const sections: PrivacyNoticeSection[] = [];
  let currentSection: PrivacyNoticeSection | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^#\s+/.test(line)) continue;

    const headingInfo = parseHeading(line);
    if (headingInfo) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        title: headingInfo.title,
        paragraphs: [],
        bullets: [],
      };
      if (headingInfo.rest) {
        currentSection.paragraphs.push(headingInfo.rest);
      }
      continue;
    }

    const bulletsFromLine = parseInlineBullets(line);
    if (bulletsFromLine.length) {
      if (!currentSection) {
        currentSection = {
          title: "Información",
          paragraphs: [],
          bullets: [],
        };
      }
      currentSection.bullets.push(...bulletsFromLine);
      continue;
    }

    if (currentSection) {
      currentSection.paragraphs.push(line);
    } else {
      intro = intro ? `${intro} ${line}` : line;
    }
  }

  if (currentSection) sections.push(currentSection);

  return {
    title,
    intro,
    sections: sections.filter(
      (section) => section.paragraphs.length || section.bullets.length,
    ),
  };
}

function normalizeSource(source: string): string {
  let text = source.replace(/\r/g, "").trim();
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/(\n|^)\s*#{3,}\s*/g, "$1## ");
  text = text.replace(/([^\n])\s+(##\s+)/g, "$1\n$2");
  text = text.replace(/(^|\n)(Datos que recolectamos|Finalidades|Derechos ARCO|Consentimiento)\b/gi, "$1## $2");
  text = text.replace(/\s+(##\s+)/g, "\n$1");
  text = text.replace(/\s-\s+(?=[\p{L}\d(])/gu, "\n- ");
  text = text.replace(/\s•\s+(?=[\p{L}\d(])/gu, "\n• ");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text;
}

function parseHeading(line: string) {
  const fromMarkdown = line.match(/^##\s+(.+)$/);
  if (!fromMarkdown) return null;

  const raw = fromMarkdown[1].trim();
  const canonical = CANONICAL_SECTION_TITLES.find((title) =>
    raw.toLowerCase().startsWith(title.toLowerCase()),
  );
  if (canonical) {
    return {
      title: canonical,
      rest: raw.slice(canonical.length).trim(),
    };
  }

  return { title: raw, rest: "" };
}

function parseInlineBullets(line: string) {
  if (/^[-*•]\s+/.test(line)) {
    return [line.replace(/^[-*•]\s+/, "").trim()];
  }
  const chunks = line
    .split(/\s+-\s+|\s+•\s+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  if (chunks.length > 1) return chunks;
  return [];
}
