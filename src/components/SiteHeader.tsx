import Link from "next/link";

export default function SiteHeader({ count }: { count?: number }) {
  return (
    <header className="mast">
      <div className="wrap mast__row">
        <Link href="/" className="mast__brand" aria-label="ホームへ">
          <span className="mast__mark">
            やさしい<em>・</em>技術辞典
          </span>
          <span className="mast__tag">例えで理解するAI・開発用語</span>
        </Link>
        {count ? (
          <span className="mast__count">
            <b>{count}</b>個の用語
          </span>
        ) : null}
      </div>
    </header>
  );
}
