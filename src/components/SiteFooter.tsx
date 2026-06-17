export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot__row">
        <span>AI·개발 용어를 비유와 예시로 풀어 쓴 한국어 사전이에요.</span>
        <span>
          개념 출처{" "}
          <a href="https://www.nontechnical.dev" target="_blank" rel="noopener noreferrer">
            nontechnical.dev
          </a>{" "}
          · 한국어 재구성판
        </span>
      </div>
    </footer>
  );
}
