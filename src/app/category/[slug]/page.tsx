import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TermCard from "@/components/TermCard";
import { termsInCategory } from "@/lib/terms";
import { CATEGORIES, catBySlug } from "@/lib/categories";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = catBySlug(slug);
  if (!cat) return { title: "카테고리" };
  return { title: cat.ko, description: cat.blurb };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = catBySlug(slug);
  if (!cat) notFound();
  const terms = termsInCategory(cat.slug);

  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <header className="cathead">
          <nav className="crumbs">
            <Link href="/">홈</Link>
            <span aria-hidden>·</span>
            <span>{cat.ko}</span>
          </nav>
          <div className="cathead__no">{String(cat.order).padStart(2, "0")}</div>
          <h1 className="cathead__title">
            <span className="swatch" style={{ background: cat.color }} aria-hidden />
            {cat.ko}
          </h1>
          <p className="cathead__blurb">
            {cat.blurb} · 용어 {terms.length}개
          </p>
        </header>
        <section className="cat" style={{ borderTop: "none", paddingTop: "1.6rem" }}>
          <div className="entries">
            {terms.map((t, i) => (
              <TermCard key={t.slug} term={t} no={i + 1} showCat={false} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
