import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { allSlugs, getTerm } from "@/lib/terms";
import { catByEn } from "@/lib/categories";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) return { title: "찾을 수 없는 용어" };
  return { title: `${term.title_ko} (${term.title_en})`, description: term.deck_ko };
}

export default async function TermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) notFound();

  const cat = catByEn(term.category_en);
  const prev = term.prev ? getTerm(term.prev) : undefined;
  const next = term.next ? getTerm(term.next) : undefined;

  return (
    <>
      <SiteHeader />
      <main className="wrap detail">
        <nav className="crumbs">
          <Link href="/">홈</Link>
          <span aria-hidden>·</span>
          <Link href={`/category/${cat.slug}`}>{cat.ko}</Link>
        </nav>

        <Link href={`/category/${cat.slug}`} className="detail__cat">
          <span className="dot" style={{ background: cat.color }} aria-hidden />
          {cat.ko}
        </Link>
        <h1 className="detail__title">{term.title_ko}</h1>
        <p className="detail__en">{term.title_en}</p>
        <p className="detail__deck">{term.deck_ko}</p>

        {term.analogy_ko ? (
          <aside className="analogy">
            <span className="analogy__label">한 줄 비유</span>
            <p className="analogy__text">{term.analogy_ko}</p>
          </aside>
        ) : null}

        <article className="prose" dangerouslySetInnerHTML={{ __html: term.body_html }} />

        {term.related.length > 0 ? (
          <div className="related">
            <p className="related__label">함께 보면 좋은 용어</p>
            <div className="related__list">
              {term.related.map((r) => (
                <Link key={r.slug} href={`/term/${r.slug}`} className="related__item">
                  {r.title_ko}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {prev || next ? (
          <nav className="pager">
            {prev ? (
              <Link href={`/term/${prev.slug}`}>
                <div className="pager__dir">← 이전</div>
                <div className="pager__t">{prev.title_ko}</div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/term/${next.slug}`} className="pager--next">
                <div className="pager__dir">다음 →</div>
                <div className="pager__t">{next.title_ko}</div>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
