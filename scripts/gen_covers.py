#!/usr/bin/env python3
# 用語ごとの決定論的ミニマルSVGカバー生成器。
# カテゴリカラー + slugハッシュで一貫性がありつつ互いに区別できる抽象カバーを作る。
# /gi(画像生成)非依存。白黒+単色アクセントの学習向け美観。テキスト/ロゴなし。
# 実行: python3 scripts/gen_covers.py (すべてのterms/*.jsonのimgパスをsvgに更新)
import json, os, hashlib, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TERMS = os.path.join(ROOT, "src", "data", "terms")
OUT = os.path.join(ROOT, "public", "dictionary", "img")
os.makedirs(OUT, exist_ok=True)

CAT_COLOR = {
    "The Basics": "#2563eb", "How AI Works": "#7c3aed", "Building With AI": "#0891b2",
    "Code & Collaboration": "#059669", "Shipping & Running": "#d97706",
    "APIs & Connections": "#db2777", "How Developers Think": "#4f46e5", "More": "#475569",
}
BG = "#fbfaf7"
INK = "#111110"
W, H = 1200, 750


def rng(seed):
    h = hashlib.sha256(seed.encode("utf-8")).digest()
    i = [0]
    def nxt(lo, hi):
        b = h[i[0] % len(h)]; i[0] += 1
        return lo + (b / 255.0) * (hi - lo)
    return nxt


def cover(slug, color):
    r = rng(slug)
    cx = r(330, 870); cy = r(230, 520)
    R = r(170, 260)
    motif = int(r(0, 4.999))
    el = [f'<rect width="{W}" height="{H}" fill="{BG}"/>']
    # 共通: 大きなソフトな円(カテゴリカラー・低不透明度)
    el.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{R:.0f}" fill="{color}" fill-opacity="0.10"/>')
    # 淡いインクのグリッドドット(質感)
    dots = []
    gx0 = r(40, 80)
    for yy in range(90, H, 64):
        for xx in range(int(gx0), W, 64):
            dots.append(f'<circle cx="{xx}" cy="{yy}" r="2" fill="{INK}" fill-opacity="0.05"/>')
    el.append("".join(dots))
    if motif == 0:  # 同心円
        for k in range(4):
            rr = R * (0.45 + 0.2 * k)
            el.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{rr:.0f}" fill="none" stroke="{color}" stroke-width="2.5" stroke-opacity="{0.6-0.1*k:.2f}"/>')
        el.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="9" fill="{color}"/>')
    elif motif == 1:  # 交差円
        dx = r(60, 120)
        el.append(f'<circle cx="{cx-dx:.0f}" cy="{cy:.0f}" r="{R*0.62:.0f}" fill="none" stroke="{INK}" stroke-width="2" stroke-opacity="0.35"/>')
        el.append(f'<circle cx="{cx+dx:.0f}" cy="{cy:.0f}" r="{R*0.62:.0f}" fill="none" stroke="{color}" stroke-width="2.5" stroke-opacity="0.7"/>')
        el.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="10" fill="{color}"/>')
    elif motif == 2:  # 弧 + 点
        a = r(0, 360)
        el.append(f'<path d="M {cx-R:.0f} {cy:.0f} A {R:.0f} {R:.0f} 0 0 1 {cx+R:.0f} {cy:.0f}" fill="none" stroke="{color}" stroke-width="3" stroke-opacity="0.7" transform="rotate({a:.0f} {cx:.0f} {cy:.0f})"/>')
        el.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{R*0.5:.0f}" fill="none" stroke="{INK}" stroke-width="1.5" stroke-opacity="0.3"/>')
        el.append(f'<circle cx="{cx+R:.0f}" cy="{cy:.0f}" r="8" fill="{color}" transform="rotate({a:.0f} {cx:.0f} {cy:.0f})"/>')
    elif motif == 3:  # 対角線 + 円
        a = r(-30, 30)
        for k in range(3):
            off = (k - 1) * 46
            el.append(f'<line x1="{cx-R*1.1:.0f}" y1="{cy+off:.0f}" x2="{cx+R*1.1:.0f}" y2="{cy+off:.0f}" stroke="{INK}" stroke-width="2" stroke-opacity="0.12" transform="rotate({a:.0f} {cx:.0f} {cy:.0f})"/>')
        el.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{R*0.55:.0f}" fill="none" stroke="{color}" stroke-width="3" stroke-opacity="0.7"/>')
        el.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="9" fill="{color}"/>')
    else:  # 回転する正方形の重なり
        a = r(0, 45)
        for k in range(3):
            s = R * (0.5 + 0.28 * k)
            el.append(f'<rect x="{cx-s:.0f}" y="{cy-s:.0f}" width="{2*s:.0f}" height="{2*s:.0f}" rx="10" fill="none" stroke="{color if k==0 else INK}" stroke-width="2.5" stroke-opacity="{0.7 if k==0 else 0.18}" transform="rotate({a+ k*8:.0f} {cx:.0f} {cy:.0f})"/>')
        el.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="8" fill="{color}"/>')
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">{"".join(el)}</svg>'
    return svg


def main():
    files = [f for f in os.listdir(TERMS) if f.endswith(".json")]
    made = 0; skipped = []
    for f in sorted(files):
        path = os.path.join(TERMS, f)
        try:
            t = json.load(open(path, encoding="utf-8"))
        except Exception:
            skipped.append(f[:-5]); continue
        slug = t.get("slug") or f[:-5]
        color = CAT_COLOR.get(t.get("category_en", ""), "#475569")
        svg = cover(slug, color)
        open(os.path.join(OUT, slug + ".svg"), "w", encoding="utf-8").write(svg)
        t["img"] = f"/dictionary/img/{slug}.svg"
        json.dump(t, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        made += 1
    print(f"covers made: {made}; skipped(invalid json): {len(skipped)} {skipped}")


if __name__ == "__main__":
    main()
