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
          <span className="hero__eyebrow">AI·개발 용어 사전</span>
          <h1 className="hero__title">
            낯선 말을<br />
            <span className="soft">비유 하나로</span> 이해하기
          </h1>
          <p className="hero__lead">
            처음 들으면 막막한 기술 용어 {total}개를, 고등학생도 알아들을 만큼
            쉬운 비유와 예시로 풀어 썼어요. 필요한 곳부터 골라 읽으면 돼요.
          </p>
          <div className="hero__rule" />
          <nav className="nav-index" aria-label="카테고리">
            {groups.map((g, i) => (
              <Link key={g.category.slug} href={`/category/${g.category.slug}`} className="nav-index__item">
                <span className="nav-index__no">{String(i + 1).padStart(2, "0")}</span>
                <span className="nav-index__dot" style={{ background: g.category.color }} aria-hidden />
                <span className="nav-index__ko">{g.category.ko}</span>
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
                    {g.category.ko}
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
