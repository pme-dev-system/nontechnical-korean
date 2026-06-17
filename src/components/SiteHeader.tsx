import Link from "next/link";

export default function SiteHeader({ count }: { count?: number }) {
  return (
    <header className="mast">
      <div className="wrap mast__row">
        <Link href="/" className="mast__brand" aria-label="홈으로">
          <span className="mast__mark">
            쉬운<em>·</em>기술사전
          </span>
          <span className="mast__tag">비유로 이해하는 AI·개발 용어</span>
        </Link>
        {count ? (
          <span className="mast__count">
            <b>{count}</b>개 용어
          </span>
        ) : null}
      </div>
    </header>
  );
}
