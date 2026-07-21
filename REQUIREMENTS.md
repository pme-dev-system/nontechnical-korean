# nontechnical_korean — Requirements (SSoT)

> 単一の真実源。ゲートはこの表の各Rをexit codeで検証する。
> 原典: nontechnical.dev(AI・技術用語100個、例え話中心)。目標: 日本語再構成版。

| id | requirement | gate |
|---|---|---|
| R1 | 原典100個の用語がすべて日本語翻訳JSONとして存在(`src/data/terms/*.json` = 100) | terms_gate.sh |
| R2 | 各用語に必須フィールド(slug・title_ja・deck_ja・analogy_ja・body_html・category_en)が入力済み | terms_gate.sh |
| R3 | 8つのカテゴリーに分類、空カテゴリーなし | terms_gate.sh |
| R4 | AIらしさの排除: 絵文字・誇張自画自賛語・メタ文言・`TLDR:`残存なし | slop_gate.sh |
| R5 | 本文の日本語比率が十分(翻訳漏れ・英文本文残存を遮断) | slop_gate.sh |
| R6 | Noto Sans JP フォントの適用 | build_gate.sh |
| R7 | ホーム・カテゴリー・用語詳細のルートファイルが存在 | build_gate.sh |
| R8 | `next build` 成功(静的100用語 + 8カテゴリーページ生成) | build_gate.sh |
| R9 | 用語ごとの画像100件が存在(`public/dictionary/img/`) | img_gate.sh |
| R10 | シークレットのハードコードなし | secrets_gate.sh |
