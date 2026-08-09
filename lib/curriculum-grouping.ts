export type ItemGroup = { title: string; items: string[] };

/**
 * Detects a "1. MS Word" / "2. MS Excel" style numbered header inside a flat
 * curriculum list and groups the following items under it.
 */
function isNumberedHeader(item: string): boolean {
  return /^\s*\d+[.)]\s*\S/.test(item);
}
function cleanNumberedHeader(item: string): string {
  return item.replace(/^\s*\d+[.)]\s*/, "").trim();
}

/**
 * Detects a "MS Word Projects" / "Microsoft Excel Projects" style header
 * inside a flat projects/practice list and groups the following items
 * under it.
 */
function isProjectsHeader(item: string): boolean {
  return /^(ms|microsoft)\s+.+\sprojects$/i.test(item.trim());
}

function groupByHeaders(
  items: string[],
  isHeader: (item: string) => boolean,
  cleanHeader: (item: string) => string = (s) => s
): ItemGroup[] {
  const groups: ItemGroup[] = [];
  let current: ItemGroup | null = null;

  for (const item of items) {
    if (isHeader(item)) {
      current = { title: cleanHeader(item), items: [] };
      groups.push(current);
    } else if (current) {
      current.items.push(item);
    }
    // Items appearing before the first detected header are dropped from
    // grouped view (there shouldn't be any with this convention), and the
    // caller falls back to the flat list when fewer than 2 groups form.
  }

  return groups.filter((g) => g.items.length > 0);
}

/** Auto-detects "1. MS Word" style groups in a flat curriculum array. Returns [] if the pattern isn't present. */
export function detectCurriculumGroups(curriculum: string[]): ItemGroup[] {
  const groups = groupByHeaders(curriculum, isNumberedHeader, cleanNumberedHeader);
  return groups.length >= 2 ? groups : [];
}

/** Auto-detects "MS Word Projects" style groups in a flat projects array. Returns [] if the pattern isn't present. */
export function detectPracticeGroups(projects: string[]): ItemGroup[] {
  const groups = groupByHeaders(projects, isProjectsHeader);
  return groups.length >= 2 ? groups : [];
}
