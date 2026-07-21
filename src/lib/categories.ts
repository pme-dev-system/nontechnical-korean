// カテゴリの単一の真実源(SSoT)。原文8分類 → 日本語名 + slug + アクセントカラー + 学習順序。
// 色はADHDフレンドリーな視覚的チャンク分けのため、カテゴリごとに1つずつ割り当てる。

export type Category = {
  en: string;
  ja: string;
  slug: string;
  color: string; // アクセントカラー(HSLベース、控えめな彩度)
  order: number;
  blurb: string; // カテゴリの一言案内
};

export const CATEGORIES: Category[] = [
  {
    en: "The Basics",
    ja: "基礎",
    slug: "basics",
    color: "#3b6ea5",
    order: 1,
    blurb: "最初に知っておきたい土台となる考え方。",
  },
  {
    en: "How AI Works",
    ja: "AIの仕組み",
    slug: "how-ai-works",
    color: "#6d5aa6",
    order: 2,
    blurb: "モデルが答えを作り出す原理。",
  },
  {
    en: "Building With AI",
    ja: "AIで作る",
    slug: "building",
    color: "#2f8a8a",
    order: 3,
    blurb: "AIを実際のプロダクトや作業に組み込む方法。",
  },
  {
    en: "Code & Collaboration",
    ja: "コードと共同作業",
    slug: "code-collab",
    color: "#4a8a5c",
    order: 4,
    blurb: "コードを一緒に扱い、管理するための道具。",
  },
  {
    en: "Shipping & Running",
    ja: "デプロイと運用",
    slug: "shipping",
    color: "#b07636",
    order: 5,
    blurb: "作ったものを世に出し、動かし続けること。",
  },
  {
    en: "APIs & Connections",
    ja: "APIと連携",
    slug: "apis",
    color: "#b0556b",
    order: 6,
    blurb: "サービス同士がデータをやり取りする通り道。",
  },
  {
    en: "How Developers Think",
    ja: "エンジニアの思考法",
    slug: "thinking",
    color: "#5566a8",
    order: 7,
    blurb: "コードを扱う人たちの考え方のクセ。",
  },
  {
    en: "More",
    ja: "もっと知る",
    slug: "more",
    color: "#6b6b66",
    order: 8,
    blurb: "知っておくとつまずきにくくなる残りの言葉たち。",
  },
];

const byEn = new Map(CATEGORIES.map((c) => [c.en, c]));
const bySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function catByEn(en: string): Category {
  return byEn.get(en) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function catBySlug(slug: string): Category | undefined {
  return bySlug.get(slug);
}
