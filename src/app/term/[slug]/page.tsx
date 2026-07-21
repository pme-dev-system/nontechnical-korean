import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { allSlugs, getTerm, diagramFor } from "@/lib/terms";
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
  if (!term) return { title: "見つからない用語" };
  return { title: `${term.title_ja} (${term.title_en})`, description: term.deck_ja };
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
  const diagram = diagramFor(term.slug);

  return (
    <>
      <SiteHeader />
      <main className="wrap detail">
        <nav className="crumbs">
          <Link href="/">ホーム</Link>
          <span aria-hidden>·</span>
          <Link href={`/category/${cat.slug}`}>{cat.ja}</Link>
        </nav>

        <Link href={`/category/${cat.slug}`} className="detail__cat">
          <span className="dot" style={{ background: cat.color }} aria-hidden />
          {cat.ja}
        </Link>
        <h1 className="detail__title">{term.title_ja}</h1>
        <p className="detail__en">{term.title_en}</p>
        <p className="detail__deck">{term.deck_ja}</p>

        {term.analogy_ja ? (
          <aside className="analogy">
            <span className="analogy__label">一言でいうと</span>
            <p className="analogy__text">{term.analogy_ja}</p>
          </aside>
        ) : null}

        {diagram ? (
          <figure className="figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="figure__img" src={diagram} alt={`${term.title_ja} 概念ダイアグラム`} loading="lazy" />
          </figure>
        ) : null}

        <article className="prose" dangerouslySetInnerHTML={{ __html: term.body_html }} />

        {term.related.length > 0 ? (
          <div className="related">
            <p className="related__label">あわせて読みたい用語</p>
            <div className="related__list">
              {term.related.map((r) => (
                <Link key={r.slug} href={`/term/${r.slug}`} className="related__item">
                  {r.title_ja}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {prev || next ? (
          <nav className="pager">
            {prev ? (
              <Link href={`/term/${prev.slug}`}>
                <div className="pager__dir">← 前へ</div>
                <div className="pager__t">{prev.title_ja}</div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/term/${next.slug}`} className="pager--next">
                <div className="pager__dir">次へ →</div>
                <div className="pager__t">{next.title_ja}</div>
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
