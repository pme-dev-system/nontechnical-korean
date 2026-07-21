# やさしい技術辞典 (nontechnical-japanese)

AI・開発用語100個を、専門知識がなくても理解できるように**例え話と具体例**で解説する日本語辞典。
英語原典 [nontechnical.dev](https://www.nontechnical.dev) の概念を日本語で再構成した。

- 100個の用語 · 8つのカテゴリー(ADHDフレンドリーな分類)
- フォント: Noto Sans JP · 用語ごとの決定論的SVGカバー
- です・ます調の丁寧なトーン、AIらしさの排除(絵文字・誇張語・メタ文言を禁止)

## 構成

```
src/
  app/            ホーム / term/[slug] / category/[slug] (静的生成)
  components/     SiteHeader, SiteFooter, TermCard, Reveal(framer-motion)
  data/
    catalog.json  英語原本100件(参考データ)
    terms/        日本語翻訳100件(slug.json)
  lib/            categories(SSoT) / terms(ローダー)
public/
  dictionary/img/     用語ごとのSVGカバー100件
  dictionary/diagram/ 用語ごとのフロー図SVG100件
scripts/
  diagram-specs/      フロー図の元データ(slug.json)
  gen_flow_svg.py     フロー図SVG生成スクリプト
  gen_covers.py       カバーSVG生成スクリプト
gates/            verify_*.sh + terms/slop/img/build/secrets サブゲート
```

## 開発

```bash
npm install
npm run dev          # ローカル
npm run build        # 静的ビルド(用語100件 + カテゴリー8件)
bash gates/verify_nontechnical_korean.sh .   # マスターQAゲート(exit 0 = PASS)
```

要件の正本は `REQUIREMENTS.md`、失敗履歴は `FAILURE_LOG.md`。

> 画像は現在、決定論的SVGカバーです。将来的に実写画像へ差し替え可能です。
