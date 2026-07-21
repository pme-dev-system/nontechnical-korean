import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TermCard from "@/components/TermCard";
import Reveal from "@/components/Reveal";
import { groupByCategory, termCount } from "@/lib/terms";

export default function Home() {
  const groups = groupByCategory();
  const total = termCount();

  return (
    <>
      <SiteHeader count={total} />
      <main>
        <section className="wrap hero">
          <span className="hero__eyebrow">AI・開発用語辞典</span>
          <h1 className="hero__title">
            聞き慣れない言葉を<br />
            <span className="soft">ひとつの例え</span>で理解する
          </h1>
          <p className="hero__lead">
            初めて聞くと戸惑う技術用語{total}個を、専門知識がなくても
            わかるやさしい例えと具体例で解説しました。必要なところから読めばOKです。
          </p>
          <div className="hero__rule" />
          <nav className="nav-index" aria-label="カテゴリー">
            {groups.map((g, i) => (
              <Link key={g.category.slug} href={`/category/${g.category.slug}`} className="nav-index__item">
                <span className="nav-index__no">{String(i + 1).padStart(2, "0")}</span>
                <span className="nav-index__dot" style={{ background: g.category.color }} aria-hidden />
                <span className="nav-index__ja">{g.category.ja}</span>
                <span className="nav-index__n">{g.terms.length}</span>
              </Link>
            ))}
          </nav>
        </section>

        {groups.map((g, gi) => (
          <section key={g.category.slug} id={g.category.slug} className="wrap cat">
            <Reveal>
              <div className="cat__head">
                <span className="cat__no">{String(gi + 1).padStart(2, "0")}</span>
                <Link href={`/category/${g.category.slug}`}>
                  <h2 className="cat__title">
                    <span className="swatch" style={{ background: g.category.color }} aria-hidden />
                    {g.category.ja}
                  </h2>
                </Link>
                <p className="cat__blurb">{g.category.blurb}</p>
              </div>
              <div className="entries">
                {g.terms.map((t, i) => (
                  <TermCard key={t.slug} term={t} no={i + 1} showCat={false} />
                ))}
              </div>
            </Reveal>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
