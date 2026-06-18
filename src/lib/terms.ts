import fs from "node:fs";
import path from "node:path";
import { CATEGORIES, catByEn, type Category } from "./categories";

export type Related = { slug: string; title_ko: string };

export type Term = {
  slug: string;
  title_en: string;
  title_ko: string;
  category_en: string;
  category_ko: string;
  kicker_ko: string;
  deck_ko: string;
  analogy_ko: string;
  body_html: string;
  related: Related[];
  prev: string | null;
  next: string | null;
  img: string;
};

const TERMS_DIR = path.join(process.cwd(), "src", "data", "terms");

let _cache: Term[] | null = null;

export function loadTerms(): Term[] {
  if (_cache) return _cache;
  let files: string[] = [];
  try {
    files = fs.readdirSync(TERMS_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    files = [];
  }
  const terms: Term[] = [];
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(TERMS_DIR, f), "utf-8");
      const t = JSON.parse(raw) as Term;
      if (t && t.slug && t.title_ko) terms.push(normalize(t));
    } catch {
      // 손상된 항목은 건너뛴다 — 빌드를 막지 않는다.
    }
  }
  terms.sort((a, b) => a.title_ko.localeCompare(b.title_ko, "ko"));
  _cache = terms;
  return terms;
}

function normalize(t: Term): Term {
  return {
    ...t,
    related: Array.isArray(t.related) ? t.related : [],
    prev: t.prev || null,
    next: t.next || null,
    img: t.img || "",
  };
}

export function getTerm(slug: string): Term | undefined {
  return loadTerms().find((t) => t.slug === slug);
}

export function allSlugs(): string[] {
  return loadTerms().map((t) => t.slug);
}

export type CategoryGroup = { category: Category; terms: Term[] };

export function groupByCategory(): CategoryGroup[] {
  const terms = loadTerms();
  return CATEGORIES.map((category) => ({
    category,
    terms: terms.filter((t) => catByEn(t.category_en).slug === category.slug),
  })).filter((g) => g.terms.length > 0);
}

export function termsInCategory(catSlug: string): Term[] {
  return loadTerms().filter((t) => catByEn(t.category_en).slug === catSlug);
}

export function termCount(): number {
  return loadTerms().length;
}

const DIAGRAM_DIR = path.join(process.cwd(), "public", "dictionary", "diagram");

// 용어별 전문 SVG 다이어그램이 있으면 그 경로를, 없으면 null.
export function diagramFor(slug: string): string | null {
  try {
    if (fs.existsSync(path.join(DIAGRAM_DIR, `${slug}.svg`))) {
      return `/dictionary/diagram/${slug}.svg`;
    }
  } catch {
    // ignore
  }
  return null;
}
