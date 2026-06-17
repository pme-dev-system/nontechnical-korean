// 카테고리 단일 진실(SSoT). 원문 8개 분류 → 한국어명 + slug + 강조색 + 학습 순서.
// 색은 ADHD 친화 시각 청킹용으로 카테고리마다 하나씩 배정한다.

export type Category = {
  en: string;
  ko: string;
  slug: string;
  color: string; // 강조색 (HSL 기반, 절제된 채도)
  order: number;
  blurb: string; // 카테고리 한 줄 안내
};

export const CATEGORIES: Category[] = [
  {
    en: "The Basics",
    ko: "기초",
    slug: "basics",
    color: "#3b6ea5",
    order: 1,
    blurb: "가장 먼저 알아야 할 토대 개념.",
  },
  {
    en: "How AI Works",
    ko: "AI는 어떻게 작동하는가",
    slug: "how-ai-works",
    color: "#6d5aa6",
    order: 2,
    blurb: "모델이 답을 만들어내는 원리.",
  },
  {
    en: "Building With AI",
    ko: "AI로 만들기",
    slug: "building",
    color: "#2f8a8a",
    order: 3,
    blurb: "AI를 실제 제품과 작업에 연결하는 방법.",
  },
  {
    en: "Code & Collaboration",
    ko: "코드와 협업",
    slug: "code-collab",
    color: "#4a8a5c",
    order: 4,
    blurb: "코드를 함께 다루고 관리하는 도구.",
  },
  {
    en: "Shipping & Running",
    ko: "배포와 운영",
    slug: "shipping",
    color: "#b07636",
    order: 5,
    blurb: "만든 것을 세상에 내보내고 굴리는 일.",
  },
  {
    en: "APIs & Connections",
    ko: "API와 연결",
    slug: "apis",
    color: "#b0556b",
    order: 6,
    blurb: "서비스끼리 데이터를 주고받는 통로.",
  },
  {
    en: "How Developers Think",
    ko: "개발자처럼 생각하기",
    slug: "thinking",
    color: "#5566a8",
    order: 7,
    blurb: "코드를 다루는 사람들의 사고 습관.",
  },
  {
    en: "More",
    ko: "더 알아보기",
    slug: "more",
    color: "#6b6b66",
    order: 8,
    blurb: "알아두면 막힘이 줄어드는 나머지.",
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
