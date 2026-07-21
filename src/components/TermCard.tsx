import Link from "next/link";
import type { Term } from "@/lib/terms";
import { catByEn } from "@/lib/categories";

export default function TermCard({
  term,
  no,
  showCat = true,
}: {
  term: Term;
  no?: number;
  showCat?: boolean;
}) {
  const cat = catByEn(term.category_en);
  return (
    <Link href={`/term/${term.slug}`} className="entry">
      <span className="entry__no">{no != null ? String(no).padStart(2, "0") : ""}</span>
      <span className="entry__main">
        <span className="entry__title">
          {term.title_ja}
          <span className="entry__en">{term.title_en}</span>
        </span>
        <span className="entry__deck">{term.deck_ja}</span>
      </span>
      {showCat ? (
        <span className="entry__cat">
          <span className="dot" style={{ background: cat.color }} aria-hidden />
          {cat.ja}
          <span className="entry__arrow" aria-hidden>→</span>
        </span>
      ) : (
        <span className="entry__arrow" aria-hidden>→</span>
      )}
    </Link>
  );
}
